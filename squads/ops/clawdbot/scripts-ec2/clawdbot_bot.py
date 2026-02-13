#!/usr/bin/env python3
"""
Clawdbot - Platform Operations Agent
Socket Mode Slack Bot running 24/7 on Hostinger VPS
"""

import json
import subprocess
import os
from datetime import datetime
from pathlib import Path
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler
from slack_sdk import WebClient

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

# Get bot user ID to ignore own messages
BOT_USER_ID = None
try:
    BOT_USER_ID = client.auth_test()['user_id']
except:
    pass


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


def process_command(text, say):
    """Route command to handler"""
    text = text.strip().lower()
    # Remove bot mention if present
    if BOT_USER_ID:
        text = text.replace(f'<@{BOT_USER_ID.lower()}>', '').strip()
        text = text.replace(f'<@{BOT_USER_ID}>', '').strip()

    if text in ('status', 'st'):
        say(':hourglass_flowing_sand: Running health check...')
        output = run_script('health_check.py')
        say(f'```{output}```')

    elif text in ('health', 'h'):
        output = run_script('health_check.py')
        say(f'```{output}```')

    elif text in ('budget', 'b', 'costs', 'custo'):
        output = run_script('spend_monitor.py')
        say(f'```{output}```')

    elif text.startswith('safemode') or text.startswith('safe'):
        if 'on' in text or 'activate' in text:
            output = run_script('safe_mode_manager.py', ['activate', 'Manual via Slack'])
        elif 'off' in text or 'deactivate' in text:
            output = run_script('safe_mode_manager.py', ['deactivate'])
        else:
            output = run_script('safe_mode_manager.py', ['status'])
        say(f'```{output}```')

    elif text in ('tasks', 'task', 'tarefas'):
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
                    say('No open tasks.')
                    return
                lines = [f'*Open Tasks ({len(tasks)}):*\n']
                for t in tasks[:15]:
                    st = t.get('status', {}).get('status', '?')
                    name = t.get('name', 'Untitled')
                    em = {'to do': ':white_circle:', 'in progress': ':large_blue_circle:', 'waiting': ':yellow_circle:'}.get(st, ':black_circle:')
                    lines.append(f'{em} [{st}] {name}')
                say('\n'.join(lines))
            else:
                say(f'ClickUp error: {response.status_code}')
        except Exception as e:
            say(f'Error: {str(e)}')

    elif text in ('n8n', 'workflows'):
        try:
            import requests
            try:
                r = requests.get('http://localhost:5678/healthz', timeout=5)
                health = ':white_check_mark: OK' if r.status_code == 200 else f':x: ERROR ({r.status_code})'
            except:
                health = ':x: Not responding'
            say(f'*n8n Status:*\nHealth: {health}')
        except Exception as e:
            say(f'Error: {str(e)}')

    elif text in ('help', 'h', 'ajuda', '?'):
        say('*Clawdbot Commands:*\n\n'
            ':white_check_mark: `status` - Platform health check\n'
            ':money_with_wings: `budget` - Budget status\n'
            ':clipboard: `tasks` - Open ClickUp tasks\n'
            ':gear: `n8n` - n8n workflow status\n'
            ':rotating_light: `safemode` - Safe mode status\n'
            ':rotating_light: `safemode on/off` - Toggle safe mode\n'
            ':question: `help` - This message\n\n'
            '_Clawdbot - Platform Operations Agent_')

    else:
        say(f'Unknown command: `{text}`\nType `help` for available commands.')


@app.event('message')
def handle_message(event, say):
    """Handle all messages (DM and channels)"""
    # Ignore bot's own messages
    if event.get('bot_id') or event.get('user') == BOT_USER_ID:
        return
    # Ignore message subtypes (edits, joins, etc)
    if event.get('subtype'):
        return

    text = event.get('text', '').strip()
    if not text:
        return

    log_activity('command', {'cmd': text, 'user': event.get('user'), 'channel': event.get('channel')})
    process_command(text, say)


@app.event('app_mention')
def handle_mention(event, say):
    """Handle @clawdbot mentions in channels"""
    if event.get('bot_id'):
        return
    text = event.get('text', '').strip()
    if not text:
        return
    log_activity('mention', {'text': text, 'user': event.get('user')})
    process_command(text, say)


def main():
    print(f'''
====================================
  Clawdbot - Platform Operations
  Started: {datetime.now().isoformat()}
  Mode: Socket Mode
  Bot ID: {BOT_USER_ID}
====================================
''')

    log_activity('bot_started', {
        'mode': 'socket_mode',
        'bot_id': BOT_USER_ID
    })

    client.chat_postMessage(
        channel=CH_COMMAND_CENTER,
        text=':robot_face: Clawdbot online - VPS Hostinger'
    )

    handler = SocketModeHandler(app, APP_TOKEN)
    handler.start()


if __name__ == '__main__':
    main()
