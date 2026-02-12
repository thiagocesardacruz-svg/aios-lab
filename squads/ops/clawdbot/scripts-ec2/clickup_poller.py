#!/usr/bin/env python3
"""
ClickUp Poller - Detecta tasks delegadas pelo Claude Code
Executar via cron a cada 5 minutos

Cron: */5 * * * * /usr/bin/python3 /opt/clawdbot/scripts/clickup_poller.py
"""

import requests
import json
import subprocess
from datetime import datetime
from pathlib import Path

# Configuration
CLICKUP_API = 'https://api.clickup.com/api/v2'
API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O'
INBOX_LIST = '901521080779'

# Paths
BASE_DIR = Path('/opt/clawdbot')
STATE_FILE = BASE_DIR / 'state' / 'processed_tasks.json'
LOG_FILE = BASE_DIR / 'logs' / 'activity' / f'{datetime.now().strftime("%Y-%m-%d")}.jsonl'
SCRIPTS_DIR = BASE_DIR / 'scripts'
SAFE_MODE_FLAG = BASE_DIR / 'state' / 'safe_mode.flag'


def log(action, data, log_type='action'):
    """Log em formato JSONL compatível com AIOS"""
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)

    entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "action": action,
        "type": log_type,
        "agent": "@clawdbot",
        "source": "clawdbot",
        "data": data
    }

    with open(LOG_FILE, 'a') as f:
        f.write(json.dumps(entry) + '\n')

    print(f"[{entry['timestamp']}] {action}: {json.dumps(data)}")


def is_safe_mode():
    """Verifica se SAFE_MODE está ativo"""
    return SAFE_MODE_FLAG.exists()


def get_delegated_tasks():
    """Busca tasks com tag clawdbot:execute"""
    headers = {'Authorization': API_KEY}

    try:
        response = requests.get(
            f'{CLICKUP_API}/list/{INBOX_LIST}/task',
            headers=headers,
            params={
                'tags[]': 'clawdbot:execute',
                'include_closed': 'false'
            },
            timeout=30
        )

        if response.status_code != 200:
            log('error', {
                'message': 'Failed to fetch tasks',
                'status': response.status_code,
                'response': response.text[:200]
            }, 'error')
            return []

        tasks = response.json().get('tasks', [])

        # Filtrar apenas tasks pendentes
        pending_tasks = [
            t for t in tasks
            if t.get('status', {}).get('status', '').lower() in ['daemon_queue', 'inbox', 'to do']
        ]

        return pending_tasks

    except requests.RequestException as e:
        log('error', {'message': 'Request failed', 'error': str(e)}, 'error')
        return []


def parse_execution_details(task):
    """Extrai detalhes de execução do comentário da task"""
    headers = {'Authorization': API_KEY}

    try:
        response = requests.get(
            f'{CLICKUP_API}/task/{task["id"]}/comment',
            headers=headers,
            timeout=30
        )

        if response.status_code != 200:
            return None

        comments = response.json().get('comments', [])

        for comment in comments:
            text = comment.get('comment_text', '')
            if '```json' in text and 'script' in text:
                try:
                    json_start = text.index('```json') + 7
                    json_end = text.index('```', json_start)
                    return json.loads(text[json_start:json_end].strip())
                except (ValueError, json.JSONDecodeError):
                    continue

        # Fallback: tentar extrair do description
        description = task.get('description', '')
        if '**Script:**' in description:
            try:
                script_line = [l for l in description.split('\n') if '**Script:**' in l][0]
                script_name = script_line.split('`')[1]
                return {'script': script_name, 'args': None}
            except (IndexError, KeyError):
                pass

        return None

    except requests.RequestException:
        return None


def execute_script(script_name, args=None):
    """Executa script Python"""
    script_path = SCRIPTS_DIR / script_name

    if not script_path.exists():
        return {'success': False, 'error': f'Script not found: {script_name}'}

    cmd = ['python3', str(script_path)]
    if args:
        cmd.extend(args.split())

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300,  # 5 min timeout
            cwd=str(BASE_DIR)
        )
        return {
            'success': result.returncode == 0,
            'stdout': result.stdout,
            'stderr': result.stderr,
            'returncode': result.returncode
        }
    except subprocess.TimeoutExpired:
        return {'success': False, 'error': 'Script timeout (5 min)'}
    except Exception as e:
        return {'success': False, 'error': str(e)}


def update_task_status(task_id, status, comment=None):
    """Atualiza status da task no ClickUp"""
    headers = {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
    }

    try:
        # Atualizar status
        requests.put(
            f'{CLICKUP_API}/task/{task_id}',
            headers=headers,
            json={'status': status},
            timeout=30
        )

        # Adicionar comentário se fornecido
        if comment:
            timestamp = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')
            requests.post(
                f'{CLICKUP_API}/task/{task_id}/comment',
                headers=headers,
                json={'comment_text': f'{comment}\n\n---\n_Clawdbot @ {timestamp}_'},
                timeout=30
            )

    except requests.RequestException as e:
        log('error', {'message': 'Failed to update task', 'task_id': task_id, 'error': str(e)}, 'error')


def load_processed():
    """Carrega lista de tasks já processadas"""
    if STATE_FILE.exists():
        try:
            with open(STATE_FILE) as f:
                return set(json.load(f))
        except (json.JSONDecodeError, IOError):
            return set()
    return set()


def save_processed(processed):
    """Salva lista de tasks processadas"""
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_FILE, 'w') as f:
        json.dump(list(processed), f, indent=2)


def main():
    log('poll_start', {'timestamp': datetime.utcnow().isoformat()})

    # Verificar SAFE_MODE
    if is_safe_mode():
        log('poll_skipped', {'reason': 'SAFE_MODE active'})
        print("⚠️ SAFE_MODE active - skipping execution")
        return

    # Carregar tasks já processadas
    processed = load_processed()

    # Buscar tasks delegadas
    tasks = get_delegated_tasks()
    log('tasks_found', {'count': len(tasks)})

    new_tasks = 0
    for task in tasks:
        task_id = task['id']
        task_name = task.get('name', 'Unknown')

        # Pular se já processada
        if task_id in processed:
            continue

        new_tasks += 1
        log('task_processing', {'task_id': task_id, 'name': task_name})

        # Extrair detalhes de execução
        details = parse_execution_details(task)

        if not details or not details.get('script'):
            update_task_status(
                task_id,
                'waiting',
                '⚠️ **Clawdbot Error**\n\nNo execution details found in task comments.\n\nExpected format: JSON with "script" field.'
            )
            log('task_error', {'task_id': task_id, 'error': 'No execution details'}, 'error')
            processed.add(task_id)
            continue

        script_name = details['script']
        script_args = details.get('args')

        # Atualizar para in_progress
        update_task_status(
            task_id,
            'in progress',
            f'🤖 **Clawdbot Executing**\n\nScript: `{script_name}`\nArgs: `{script_args or "none"}`'
        )

        # Executar script
        result = execute_script(script_name, script_args)

        if result['success']:
            output = result['stdout'][:1500] if result['stdout'] else 'No output'
            update_task_status(
                task_id,
                'done',
                f'✅ **Clawdbot Completed**\n\nScript: `{script_name}`\n\n**Output:**\n```\n{output}\n```'
            )
            log('task_completed', {
                'task_id': task_id,
                'script': script_name,
                'output_length': len(result.get('stdout', ''))
            })
        else:
            error = result.get('error') or result.get('stderr', 'Unknown error')
            update_task_status(
                task_id,
                'waiting',
                f'❌ **Clawdbot Failed**\n\nScript: `{script_name}`\n\n**Error:**\n```\n{error[:500]}\n```'
            )
            log('task_failed', {
                'task_id': task_id,
                'script': script_name,
                'error': str(error)[:200]
            }, 'error')

        processed.add(task_id)

    # Salvar estado
    save_processed(processed)
    log('poll_end', {
        'total_processed': len(processed),
        'new_this_run': new_tasks
    })

    print(f"✅ Poll complete. Found {len(tasks)} tasks, processed {new_tasks} new.")


if __name__ == '__main__':
    main()
