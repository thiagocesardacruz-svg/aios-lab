#!/usr/bin/env python3
"""
Health Check - System health monitoring
Executar via cron a cada 30 minutos

Cron: */30 * * * * /usr/bin/python3 /opt/clawdbot/scripts/health_check.py
"""

import json
import requests
import subprocess
from datetime import datetime
from pathlib import Path

# Paths
BASE_DIR = Path('/opt/clawdbot')
LOG_FILE = BASE_DIR / 'logs' / 'activity' / f'{datetime.now().strftime("%Y-%m-%d")}.jsonl'
STATE_FILE = BASE_DIR / 'state' / 'health_status.json'

# Services to check
CLICKUP_API = 'https://api.clickup.com/api/v2'
API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O'


def log(action, data, log_type='metric'):
    """Log em formato JSONL"""
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


def check_clickup():
    """Verifica conectividade com ClickUp"""
    try:
        response = requests.get(
            f'{CLICKUP_API}/team',
            headers={'Authorization': API_KEY},
            timeout=10
        )
        return {
            'status': 'healthy' if response.status_code == 200 else 'unhealthy',
            'latency_ms': int(response.elapsed.total_seconds() * 1000),
            'status_code': response.status_code
        }
    except requests.RequestException as e:
        return {
            'status': 'unhealthy',
            'error': str(e)
        }


def check_disk_space():
    """Verifica espaço em disco"""
    try:
        result = subprocess.run(
            ['df', '-h', '/opt/clawdbot'],
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.returncode == 0:
            lines = result.stdout.strip().split('\n')
            if len(lines) >= 2:
                parts = lines[1].split()
                return {
                    'status': 'healthy',
                    'total': parts[1],
                    'used': parts[2],
                    'available': parts[3],
                    'percent_used': parts[4]
                }

        return {'status': 'unknown', 'error': 'Could not parse df output'}

    except Exception as e:
        return {'status': 'unhealthy', 'error': str(e)}


def check_cron_running():
    """Verifica se cron está rodando"""
    try:
        result = subprocess.run(
            ['pgrep', 'cron'],
            capture_output=True,
            text=True,
            timeout=10
        )
        return {
            'status': 'healthy' if result.returncode == 0 else 'unhealthy',
            'pid': result.stdout.strip() if result.returncode == 0 else None
        }
    except Exception as e:
        return {'status': 'unknown', 'error': str(e)}


def check_repo_updated():
    """Verifica se o repositório está atualizado"""
    repo_path = BASE_DIR / 'repo'

    if not repo_path.exists():
        return {'status': 'unhealthy', 'error': 'Repo not found'}

    try:
        # Check last commit date
        result = subprocess.run(
            ['git', 'log', '-1', '--format=%ci'],
            capture_output=True,
            text=True,
            cwd=str(repo_path),
            timeout=10
        )

        if result.returncode == 0:
            last_commit = result.stdout.strip()
            return {
                'status': 'healthy',
                'last_commit': last_commit
            }

        return {'status': 'unknown', 'error': 'Could not get git log'}

    except Exception as e:
        return {'status': 'unhealthy', 'error': str(e)}


def check_logs_writable():
    """Verifica se logs podem ser escritos"""
    try:
        test_file = LOG_FILE.parent / '.write_test'
        test_file.write_text('test')
        test_file.unlink()
        return {'status': 'healthy'}
    except Exception as e:
        return {'status': 'unhealthy', 'error': str(e)}


def main():
    timestamp = datetime.utcnow().isoformat()

    print(f"""
🏥 Health Check - {timestamp}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
""")

    checks = {
        'clickup': check_clickup(),
        'disk': check_disk_space(),
        'cron': check_cron_running(),
        'repo': check_repo_updated(),
        'logs': check_logs_writable()
    }

    # Calculate overall status
    unhealthy_count = sum(1 for c in checks.values() if c.get('status') != 'healthy')
    overall = 'healthy' if unhealthy_count == 0 else 'degraded' if unhealthy_count < 3 else 'unhealthy'

    # Print results
    for name, result in checks.items():
        status = result.get('status', 'unknown')
        icon = '✅' if status == 'healthy' else '⚠️' if status == 'unknown' else '❌'
        print(f"{icon} {name}: {status}")

        # Print additional details
        for key, value in result.items():
            if key != 'status':
                print(f"   {key}: {value}")

    print(f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall: {overall.upper()}
{'🟢' if overall == 'healthy' else '🟡' if overall == 'degraded' else '🔴'}
""")

    # Log results
    log('health_check', {
        'overall': overall,
        'checks': checks,
        'unhealthy_count': unhealthy_count
    }, 'metric')

    # Save state
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_FILE, 'w') as f:
        json.dump({
            'timestamp': timestamp,
            'overall': overall,
            'checks': checks
        }, f, indent=2)

    # Return exit code based on health
    exit(0 if overall == 'healthy' else 1)


if __name__ == '__main__':
    main()
