#!/usr/bin/env python3
"""
Clawdbot - Platform Operations Agent
Socket Mode Slack Bot running 24/7 on Hostinger VPS

Listens for Slack commands and runs scheduled checks.
"""

import json
import subprocess
import threading
import time
import os
from datetime import datetime, date
from pathlib import Path
from slack_bolt import App
from slack_bolt.adapter.socket_mode import SocketModeHandler
from slack_sdk import WebClient

# Paths
BASE_DIR = Path('/root/clawdbot')
SCRIPTS_DIR = BASE_DIR / 'scripts'
VENV_PYTHON = BASE_DIR / 'venv' / 'bin' / 'python3'
LOG_DIR = BASE_DIR / 'logs' / 'activity'
STATE_DIR = BASE_DIR / 'state'
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

# Channels
CH_COMMAND_CENTER = ENV.get('SLACK_COMMAND_CENTER', 'C0ACL6P5LQG')
CH_OPS = ENV.get('SLACK_OPS', 'C0ABSUK6XBL')

# Initialize app
app = App(token=BOT_TOKEN)
client = WebClient(token=BOT_TOKEN)


def log_activity(action, data, log_type='action'):
    """Log em JSONL"""
    today = datetime.now().strftime('%Y-%m-%d')
    log_file = LOG_DIR / f'{today}.jsonl'
    log_file.parent.mkdir(parents=True, exist_ok=True)

    entry = {
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'action': action,
        'type': log_type,
        'agent': '@clawdbot',
        'source': 'clawdbot-bot',
        'data': data
    }

    with open(log_file, 'a') as f:
        f.write(json.dumps(entry) + '\n')


def run_script(script_name, args=None):
    """Run a Python script and return output"""
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


def send_message(channel, text):
    """Send Slack message"""
    try:
        client.chat_postMessage(channel=channel, text=text)
    except Exception as e:
        log_activity('slack_error', {'error': str(e)}, 'error')


# === COMMAND HANDLERS ===

@app.message('status')
def handle_status(message, say):
    """Full platform status"""
    log_activity('command', {'cmd': 'status', 'user': message.get('user')})
    say('Running health check...')
    output = run_script('health_check.py')
    say(f'```{output}```')


@app.message('health')
def handle_health(message, say):
    """Quick health check"""
    log_activity('command', {'cmd': 'health', 'user': message.get('user')})
    output = run_script('health_check.py')
    say(f'```{output}```')


@app.message('budget')
def handle_budget(message, say):
    """Budget status"""
    log_activity('command', {'cmd': 'budget', 'user': message.get('user')})
    output = run_script('spend_monitor.py')
    say(f'```{output}```')


@app.message('safemode')
def handle_safemode(message, say):
    """Safe mode status/control"""
    text = message.get('text', '').strip().lower()
    log_activity('command', {'cmd': 'safemode', 'user': message.get('user')})

    if 'on' in text or 'activate' in text:
        output = run_script('safe_mode_manager.py', ['activate', 'Manual activation via Slack'])
    elif 'off' in text or 'deactivate' in text:
        output = run_script('safe_mode_manager.py', ['deactivate'])
    else:
        output = run_script('safe_mode_manager.py', ['status'])

    say(f'```{output}```')


@app.message('tasks')
def handle_tasks(message, say):
    """Check ClickUp tasks"""
    log_activity('command', {'cmd': 'tasks', 'user': message.get('user')})

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
                say('No open tasks found.')
                return

            lines = [f'*Open Tasks ({len(tasks)}):*\n']
            for t in tasks[:15]:
                status = t.get('status', {}).get('status', '?')
                name = t.get('name', 'Untitled')
                emoji = {'to do': ':white_circle:', 'in progress': ':large_blue_circle:', 'waiting': ':yellow_circle:'}.get(status, ':black_circle:')
                lines.append(f'{emoji} [{status}] {name}')

            say('\n'.join(lines))
        else:
            say(f'ClickUp API error: {response.status_code}')

    except Exception as e:
        say(f'Error fetching tasks: {str(e)}')


@app.message('n8n')
def handle_n8n(message, say):
    """Check n8n status"""
    log_activity('command', {'cmd': 'n8n', 'user': message.get('user')})

    try:
        import requests
        say('Checking n8n...')

        # Check n8n health
        try:
            r = requests.get('http://localhost:5678/healthz', timeout=5)
            health = 'OK' if r.status_code == 200 else f'ERROR ({r.status_code})'
        except:
            health = 'ERROR (not responding)'

        # Check workflows via API
        config = yaml.safe_load(open(CONFIG_DIR / 'platforms.yaml'))
        n8n_url = config.get('n8n', {}).get('url', 'http://localhost:5678')

        lines = [f'*n8n Status:*\n', f'Health: {health}', f'URL: {n8n_url}']
        say('\n'.join(lines))

    except Exception as e:
        say(f'Error checking n8n: {str(e)}')


@app.message('help')
def handle_help(message, say):
    """Show available commands"""
    log_activity('command', {'cmd': 'help', 'user': message.get('user')})
    say('''*Clawdbot Commands:*

:white_check_mark: `status` - Full platform health check
:heartbeat: `health` - Quick health check
:money_with_wings: `budget` - Budget status (daily/monthly)
:clipboard: `tasks` - Open ClickUp tasks
:gear: `n8n` - n8n workflow status
:rotating_light: `safemode` - Safe mode status
:rotating_light: `safemode on/off` - Toggle safe mode
:question: `help` - This message

_Clawdbot - Platform Operations Agent_''')


@app.event('app_mention')
def handle_mention(event, say):
    """Handle @clawdbot mentions"""
    text = event.get('text', '').lower()
    log_activity('mention', {'text': text, 'user': event.get('user')})

    if 'status' in text:
        handle_status({'text': text, 'user': event.get('user')}, say)
    elif 'health' in text:
        handle_health({'text': text, 'user': event.get('user')}, say)
    elif 'budget' in text:
        handle_budget({'text': text, 'user': event.get('user')}, say)
    elif 'tasks' in text:
        handle_tasks({'text': text, 'user': event.get('user')}, say)
    elif 'n8n' in text:
        handle_n8n({'text': text, 'user': event.get('user')}, say)
    elif 'help' in text:
        handle_help({'text': text, 'user': event.get('user')}, say)
    else:
        say('Type `help` to see available commands.')


# === STARTUP ===

def main():
    print(f'''
====================================
  Clawdbot - Platform Operations
  Started: {datetime.now().isoformat()}
  Mode: Socket Mode
  Channels: #{CH_COMMAND_CENTER}
====================================
''')

    log_activity('bot_started', {
        'mode': 'socket_mode',
        'channels': [CH_COMMAND_CENTER, CH_OPS]
    })

    # Send startup message
    send_message(CH_COMMAND_CENTER, ':robot_face: Clawdbot online - VPS Hostinger')

    # Start Socket Mode
    handler = SocketModeHandler(app, APP_TOKEN)
    handler.start()


if __name__ == '__main__':
    main()
