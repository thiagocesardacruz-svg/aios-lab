#!/usr/bin/env python3
"""
SAFE_MODE Manager - Gerencia estado de SAFE_MODE

Uso:
  python3 safe_mode_manager.py status    # Verifica status
  python3 safe_mode_manager.py activate "reason"  # Ativa (automático)
  python3 safe_mode_manager.py deactivate         # Desativa (somente Director)
"""

import json
import sys
from datetime import datetime
from pathlib import Path

# Paths
BASE_DIR = Path('/opt/clawdbot')
SAFE_MODE_FLAG = BASE_DIR / 'state' / 'safe_mode.flag'
LOG_FILE = BASE_DIR / 'logs' / 'activity' / f'{datetime.now().strftime("%Y-%m-%d")}.jsonl'


def log(action, data, log_type='alert'):
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

    print(f"[{entry['timestamp']}] {action}")


def is_safe_mode():
    """Verifica se SAFE_MODE está ativo"""
    return SAFE_MODE_FLAG.exists()


def get_safe_mode_info():
    """Retorna informações do SAFE_MODE"""
    if not SAFE_MODE_FLAG.exists():
        return None

    try:
        with open(SAFE_MODE_FLAG) as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return {'activated': 'unknown', 'reason': 'unknown'}


def activate_safe_mode(reason):
    """Ativa SAFE_MODE"""
    if is_safe_mode():
        print("⚠️ SAFE_MODE already active")
        return False

    SAFE_MODE_FLAG.parent.mkdir(parents=True, exist_ok=True)

    data = {
        'activated': datetime.utcnow().isoformat(),
        'reason': reason
    }

    with open(SAFE_MODE_FLAG, 'w') as f:
        json.dump(data, f, indent=2)

    log('SAFE_MODE_ACTIVATED', data)

    print(f"""
🚨 SAFE_MODE ACTIVATED
━━━━━━━━━━━━━━━━━━━━━━
Reason: {reason}
Time: {data['activated']}

Allowed actions: read, log, alert, health_check
Blocked actions: write, execute, API calls, deployments

To deactivate, Director must run:
  /safemode off (via Slack)
  or
  python3 safe_mode_manager.py deactivate
━━━━━━━━━━━━━━━━━━━━━━
""")

    return True


def deactivate_safe_mode():
    """Desativa SAFE_MODE (somente Director pode chamar)"""
    if not is_safe_mode():
        print("ℹ️ SAFE_MODE is not active")
        return False

    info = get_safe_mode_info()

    # Remove flag
    SAFE_MODE_FLAG.unlink()

    log('SAFE_MODE_DEACTIVATED', {
        'was_activated': info.get('activated'),
        'was_reason': info.get('reason'),
        'deactivated_by': 'Director'
    })

    print(f"""
✅ SAFE_MODE DEACTIVATED
━━━━━━━━━━━━━━━━━━━━━━━
Was active since: {info.get('activated', 'unknown')}
Reason was: {info.get('reason', 'unknown')}
Deactivated by: Director
Time: {datetime.utcnow().isoformat()}

Normal operations resumed.
━━━━━━━━━━━━━━━━━━━━━━━
""")

    return True


def check_before_action(action_type):
    """
    Verifica se ação é permitida no estado atual.

    Uso:
        if not check_before_action('execute'):
            print("Blocked by SAFE_MODE")
            return

    Returns True if action is allowed, False if blocked.
    """
    if not is_safe_mode():
        return True

    allowed = ['read', 'log', 'alert', 'health_check', 'status']
    return action_type.lower() in allowed


def show_status():
    """Mostra status atual do SAFE_MODE"""
    if is_safe_mode():
        info = get_safe_mode_info()
        print(f"""
🔴 SAFE_MODE: ACTIVE
━━━━━━━━━━━━━━━━━━━━━━
Activated: {info.get('activated', 'unknown')}
Reason: {info.get('reason', 'unknown')}

Allowed: read, log, alert, health_check
Blocked: write, execute, API calls, deployments
━━━━━━━━━━━━━━━━━━━━━━
""")
    else:
        print(f"""
🟢 SAFE_MODE: OFF
━━━━━━━━━━━━━━━━━━━━━━
All operations allowed.
Normal mode active.
━━━━━━━━━━━━━━━━━━━━━━
""")


def main():
    if len(sys.argv) < 2:
        print("""
SAFE_MODE Manager

Usage:
  python3 safe_mode_manager.py status              # Check status
  python3 safe_mode_manager.py activate "reason"   # Activate (auto-triggered)
  python3 safe_mode_manager.py deactivate          # Deactivate (Director only)
  python3 safe_mode_manager.py check <action>      # Check if action allowed
""")
        return

    command = sys.argv[1].lower()

    if command == 'status':
        show_status()

    elif command == 'activate':
        if len(sys.argv) < 3:
            print("Error: reason required")
            print("Usage: python3 safe_mode_manager.py activate \"reason\"")
            exit(1)
        reason = sys.argv[2]
        activate_safe_mode(reason)

    elif command == 'deactivate':
        deactivate_safe_mode()

    elif command == 'check':
        if len(sys.argv) < 3:
            print("Error: action type required")
            print("Usage: python3 safe_mode_manager.py check execute")
            exit(1)
        action = sys.argv[2]
        allowed = check_before_action(action)
        print(f"Action '{action}': {'✅ ALLOWED' if allowed else '❌ BLOCKED'}")
        exit(0 if allowed else 1)

    else:
        print(f"Unknown command: {command}")
        exit(1)


if __name__ == '__main__':
    main()
