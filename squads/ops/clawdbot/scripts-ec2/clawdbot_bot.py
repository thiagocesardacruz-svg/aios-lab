#!/usr/bin/env python3
"""
Clawdbot - Platform Operations Agent
Socket Mode Slack Bot running 24/7 on Hostinger VPS
Conversational + Commands via Haiku LLM
"""

import json
import subprocess
import os
from datetime import datetime
from pathlib import Path
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler
from slack_sdk import WebClient
import anthropic

# Paths
BASE_DIR = Path('/root/clawdbot')
SCRIPTS_DIR = BASE_DIR / 'scripts'
VENV_PYTHON = BASE_DIR / 'venv' / 'bin' / 'python3'
LOG_DIR = BASE_DIR / 'logs' / 'activity'
CREDENTIALS_DIR = BASE_DIR / 'credentials'
CONFIG_DIR = BASE_DIR / 'config'

# Load tokens
BOT_TOKEN = (CREDENTIALS_DIR / 'slack-bot-token.env').read_text().strip()
APP_TOKEN = (CREDENTIALS_DIR / 'slack-app-token.env').read_text().strip()
ANTHROPIC_KEY = (CREDENTIALS_DIR / 'anthropic.env').read_text().strip()

# Load .env
ENV = {}
env_file = BASE_DIR / '.env'
if env_file.exists():
    for line in env_file.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            k, v = line.split('=', 1)
            ENV[k] = v

CH_COMMAND_CENTER = ENV.get('SLACK_COMMAND_CENTER', 'C0ACL6P5LQG')
CH_OPS = ENV.get('SLACK_OPS', 'C0ABSUK6XBL')

# Initialize
app = App(token=BOT_TOKEN)
client = WebClient(token=BOT_TOKEN)
claude = anthropic.Anthropic(api_key=ANTHROPIC_KEY)

# Get bot user ID to ignore own messages
BOT_USER_ID = None
try:
    BOT_USER_ID = client.auth_test()['user_id']
except:
    pass

# Conversation history per user (last 10 messages)
conversations = {}
MAX_HISTORY = 10

SYSTEM_PROMPT = """Voce e o Clawdbot, Platform Operations Agent do AIOS (AI-Orchestrated System).

Sua personalidade:
- Direto, eficiente, mas amigavel
- Fala em portugues (pt-BR) por padrao, ingles se o usuario preferir
- Usa emojis com moderacao
- Tom profissional mas acessivel

Seu papel:
- Monitora plataformas: ClickUp, Notion, GHL, n8n, WordPress, Supabase
- Executa operacoes de monitoramento e reporting
- Cria tasks no ClickUp para squads executarem
- Reporta status e alertas via Slack
- Guardiao da governanca do AIOS
- Braco operacional 24/7

Voce faz parte do AIOS Lab, um sistema com 20 squads e 44 agentes AI coordenados pelo Director (Thiago).
O Claude Code (terminal) e o motor principal de desenvolvimento. Voce e a extensao operacional que funciona 24/7 via Slack.

Comandos disponiveis (o usuario pode digitar diretamente):
- status / st - Health check de plataformas
- budget / custo - Status do budget diario/mensal
- tasks / tarefas - Tasks abertas no ClickUp
- n8n - Status dos workflows n8n
- safemode - Status do safe mode
- safemode on/off - Ativar/desativar safe mode
- help - Lista de comandos

Limites (NUNCA faca):
- Nao escreva codigo (funcao do @dev)
- Nao interaja com squads (funcao do AIOS Master)
- Nao fale com clientes externos
- Nao delete dados
- Nao tome decisoes estrategicas
- Nao faca deploy em producao

Budget:
- Diario: EUR 20 (alerta em EUR 15)
- Mensal: EUR 468

Quando o usuario perguntar algo que voce pode resolver com seus scripts/checks, ofereca para executar.
Quando nao souber algo, seja honesto. Quando for fora do seu escopo, redirecione para o Claude Code ou Director.

Mantenha respostas concisas (max 3-4 paragrafos). Voce esta no Slack, nao em um documento."""


def log_activity(action, data, log_type='action'):
    today = datetime.now().strftime('%Y-%m-%d')
    log_file = LOG_DIR / f'{today}.jsonl'
    log_file.parent.mkdir(parents=True, exist_ok=True)
    entry = {
        'timestamp': datetime.now().isoformat() + 'Z',
        'action': action,
        'type': log_type,
        'agent': '@clawdbot',
        'source': 'clawdbot-bot',
        'data': data
    }
    with open(log_file, 'a') as f:
        f.write(json.dumps(entry) + '\n')


def run_script(script_name, args=None):
    script_path = SCRIPTS_DIR / script_name
    if not script_path.exists():
        return f'Script not found: {script_name}'
    cmd = [str(VENV_PYTHON), str(script_path)]
    if args:
        cmd.extend(args)
    try:
        result = subprocess.run(
            cmd, capture_output=True, text=True,
            timeout=120, cwd=str(BASE_DIR)
        )
        return result.stdout if result.returncode == 0 else f'Error: {result.stderr}'
    except subprocess.TimeoutExpired:
        return 'Script timeout (2 min)'
    except Exception as e:
        return f'Error: {str(e)}'


def chat_with_haiku(user_id, message_text):
    """Send message to Haiku and get response"""
    # Get or create conversation history
    if user_id not in conversations:
        conversations[user_id] = []

    # Add user message
    conversations[user_id].append({'role': 'user', 'content': message_text})

    # Keep only last N messages
    if len(conversations[user_id]) > MAX_HISTORY:
        conversations[user_id] = conversations[user_id][-MAX_HISTORY:]

    try:
        response = claude.messages.create(
            model='claude-haiku-4-5-20251001',
            max_tokens=500,
            system=SYSTEM_PROMPT,
            messages=conversations[user_id]
        )

        assistant_text = response.content[0].text

        # Add assistant response to history
        conversations[user_id].append({'role': 'assistant', 'content': assistant_text})

        log_activity('llm_call', {
            'model': 'haiku',
            'input_tokens': response.usage.input_tokens,
            'output_tokens': response.usage.output_tokens,
            'user': user_id
        }, 'metric')

        return assistant_text

    except Exception as e:
        log_activity('llm_error', {'error': str(e)}, 'error')
        return f'Erro ao processar: {str(e)}'


def process_command(text, say, user_id=None):
    """Route command or chat"""
    clean = text.strip().lower()
    # Remove bot mention if present
    if BOT_USER_ID:
        clean = clean.replace(f'<@{BOT_USER_ID.lower()}>', '').strip()
        clean = clean.replace(f'<@{BOT_USER_ID}>', '').strip()

    # Direct commands
    if clean in ('status', 'st'):
        say(':hourglass_flowing_sand: Rodando health check...')
        output = run_script('health_check.py')
        say(f'```{output}```')
        return

    if clean in ('health',):
        output = run_script('health_check.py')
        say(f'```{output}```')
        return

    if clean in ('budget', 'b', 'costs', 'custo', 'custos'):
        output = run_script('spend_monitor.py')
        say(f'```{output}```')
        return

    if clean.startswith('safemode') or clean.startswith('safe'):
        if 'on' in clean or 'activate' in clean:
            output = run_script('safe_mode_manager.py', ['activate', 'Manual via Slack'])
        elif 'off' in clean or 'deactivate' in clean:
            output = run_script('safe_mode_manager.py', ['deactivate'])
        else:
            output = run_script('safe_mode_manager.py', ['status'])
        say(f'```{output}```')
        return

    if clean in ('tasks', 'task', 'tarefas'):
        try:
            import requests
            import yaml
            config = yaml.safe_load(open(CONFIG_DIR / 'platforms.yaml'))
            api_key = config['clickup']['api_key']
            list_id = config['clickup']['inbox_list']
            response = requests.get(
                f'https://api.clickup.com/api/v2/list/{list_id}/task',
                headers={'Authorization': api_key},
                params={'statuses[]': ['to do', 'in progress', 'waiting'], 'include_closed': 'false'},
                timeout=30
            )
            if response.status_code == 200:
                tasks = response.json().get('tasks', [])
                if not tasks:
                    say('Nenhuma task aberta.')
                    return
                lines = [f'*Tasks Abertas ({len(tasks)}):*\n']
                for t in tasks[:15]:
                    st = t.get('status', {}).get('status', '?')
                    name = t.get('name', 'Untitled')
                    em = {'to do': ':white_circle:', 'in progress': ':large_blue_circle:', 'waiting': ':yellow_circle:'}.get(st, ':black_circle:')
                    lines.append(f'{em} [{st}] {name}')
                say('\n'.join(lines))
            else:
                say(f'ClickUp error: {response.status_code}')
        except Exception as e:
            say(f'Erro: {str(e)}')
        return

    if clean in ('n8n', 'workflows'):
        try:
            import requests
            try:
                r = requests.get('http://localhost:5678/healthz', timeout=5)
                health = ':white_check_mark: OK' if r.status_code == 200 else f':x: ERROR ({r.status_code})'
            except:
                health = ':x: Nao respondendo'
            say(f'*n8n Status:*\nHealth: {health}')
        except Exception as e:
            say(f'Erro: {str(e)}')
        return

    if clean in ('help', 'ajuda', '?', 'comandos'):
        say('*Clawdbot Commands:*\n\n'
            ':white_check_mark: `status` - Health check das plataformas\n'
            ':money_with_wings: `budget` - Status do budget\n'
            ':clipboard: `tasks` - Tasks abertas no ClickUp\n'
            ':gear: `n8n` - Status do n8n\n'
            ':rotating_light: `safemode` - Safe mode\n'
            ':question: `help` - Esta mensagem\n\n'
            '_Ou simplesmente converse comigo!_')
        return

    # Not a command — chat with Haiku
    response = chat_with_haiku(user_id or 'unknown', text)
    say(response)


@app.event('message')
def handle_message(event, say):
    """Handle all messages"""
    if event.get('bot_id') or event.get('user') == BOT_USER_ID:
        return
    if event.get('subtype'):
        return
    text = event.get('text', '').strip()
    if not text:
        return
    user_id = event.get('user', 'unknown')
    log_activity('message', {'text': text, 'user': user_id, 'channel': event.get('channel')})
    process_command(text, say, user_id)


@app.event('app_mention')
def handle_mention(event, say):
    """Handle @clawdbot mentions"""
    if event.get('bot_id'):
        return
    text = event.get('text', '').strip()
    if not text:
        return
    user_id = event.get('user', 'unknown')
    log_activity('mention', {'text': text, 'user': user_id})
    process_command(text, say, user_id)


def main():
    print(f'''
====================================
  Clawdbot - Platform Operations
  Started: {datetime.now().isoformat()}
  Mode: Socket Mode + Haiku LLM
  Bot ID: {BOT_USER_ID}
====================================
''')

    log_activity('bot_started', {
        'mode': 'socket_mode',
        'llm': 'haiku',
        'bot_id': BOT_USER_ID
    })

    client.chat_postMessage(
        channel=CH_COMMAND_CENTER,
        text=':robot_face: Clawdbot online - VPS Hostinger (com LLM)'
    )

    handler = SocketModeHandler(app, APP_TOKEN)
    handler.start()


if __name__ == '__main__':
    main()
