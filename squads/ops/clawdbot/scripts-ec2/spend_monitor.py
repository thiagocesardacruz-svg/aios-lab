#!/usr/bin/env python3
"""
Spend Monitor - Track API costs and trigger SAFE_MODE
Executar via cron a cada 30 minutos

Cron: */30 * * * * /usr/bin/python3 /opt/clawdbot/scripts/spend_monitor.py
"""

import json
import yaml
import requests
from datetime import datetime, date
from pathlib import Path

# Paths
BASE_DIR = Path('/opt/clawdbot')
BUDGET_FILE = BASE_DIR / 'config' / 'budget-limits.yaml'
DAILY_COSTS_FILE = BASE_DIR / 'state' / 'daily_costs.json'
SAFE_MODE_FLAG = BASE_DIR / 'state' / 'safe_mode.flag'
LOG_FILE = BASE_DIR / 'logs' / 'activity' / f'{datetime.now().strftime("%Y-%m-%d")}.jsonl'

# ClickUp API for Goals
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

    print(f"[{entry['timestamp']}] {action}: {json.dumps(data)}")


def load_budget_limits():
    """Carrega limites de budget do arquivo compartilhado"""
    if not BUDGET_FILE.exists():
        # Fallback defaults
        return {
            'daily': {'alert': 15, 'hard': 20},
            'monthly': {'total': 468, 'alert': 350}
        }

    with open(BUDGET_FILE) as f:
        config = yaml.safe_load(f)

    return config.get('budget', {})


def load_daily_costs():
    """Carrega custos do dia atual"""
    today = date.today().isoformat()

    if DAILY_COSTS_FILE.exists():
        try:
            with open(DAILY_COSTS_FILE) as f:
                data = json.load(f)

            # Reset se for um novo dia
            if data.get('date') != today:
                return {'date': today, 'total': 0, 'by_source': {}, 'by_model': {}}

            return data
        except (json.JSONDecodeError, IOError):
            pass

    return {'date': today, 'total': 0, 'by_source': {}, 'by_model': {}}


def save_daily_costs(costs):
    """Salva custos do dia"""
    DAILY_COSTS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(DAILY_COSTS_FILE, 'w') as f:
        json.dump(costs, f, indent=2)


def get_clickup_goal_value(goal_id):
    """Busca valor atual de um Goal no ClickUp"""
    headers = {'Authorization': API_KEY}

    try:
        response = requests.get(
            f'{CLICKUP_API}/goal/{goal_id}',
            headers=headers,
            timeout=30
        )

        if response.status_code == 200:
            goal = response.json().get('goal', {})
            # Retorna a soma dos targets
            targets = goal.get('key_results', [])
            total = sum(t.get('current', 0) for t in targets)
            return total

    except requests.RequestException:
        pass

    return None


def activate_safe_mode(reason):
    """Ativa SAFE_MODE"""
    SAFE_MODE_FLAG.parent.mkdir(parents=True, exist_ok=True)

    with open(SAFE_MODE_FLAG, 'w') as f:
        json.dump({
            'activated': datetime.utcnow().isoformat(),
            'reason': reason
        }, f)

    log('SAFE_MODE_ACTIVATED', {'reason': reason}, 'alert')

    # TODO: Send Slack alert
    print(f"🚨 SAFE_MODE ACTIVATED: {reason}")


def is_safe_mode():
    """Verifica se SAFE_MODE está ativo"""
    return SAFE_MODE_FLAG.exists()


def send_slack_alert(message, level='warning'):
    """Envia alerta para Slack (placeholder)"""
    # TODO: Implementar com Slack SDK
    print(f"[SLACK {level.upper()}] {message}")


def main():
    log('spend_check_start', {'timestamp': datetime.utcnow().isoformat()})

    # Carregar configuração
    limits = load_budget_limits()
    daily_limits = limits.get('daily', {'alert': 15, 'hard': 20})
    monthly_limits = limits.get('monthly', {'total': 468, 'alert': 350})

    # Carregar custos atuais
    costs = load_daily_costs()
    daily_total = costs.get('total', 0)

    # TODO: Buscar custos do ClickUp Goals
    # daily_goal_id = 'fd3f4a06-8fe7-403a-90f9-bd7cbb05f45e'
    # clickup_daily = get_clickup_goal_value(daily_goal_id) or 0

    # Calcular status
    daily_percent = (daily_total / daily_limits['hard']) * 100 if daily_limits['hard'] > 0 else 0

    status = {
        'daily': {
            'current': daily_total,
            'alert': daily_limits['alert'],
            'hard': daily_limits['hard'],
            'percent': round(daily_percent, 1)
        },
        'safe_mode': is_safe_mode()
    }

    # Verificar limites
    if daily_total >= daily_limits['hard']:
        if not is_safe_mode():
            activate_safe_mode(f"Daily budget exceeded: €{daily_total:.2f} >= €{daily_limits['hard']}")
        status['action'] = 'SAFE_MODE_ACTIVE'

    elif daily_total >= daily_limits['alert']:
        send_slack_alert(
            f"⚠️ Daily budget warning: €{daily_total:.2f} / €{daily_limits['hard']} ({daily_percent:.0f}%)",
            'warning'
        )
        status['action'] = 'WARNING_SENT'

    else:
        status['action'] = 'OK'

    log('spend_check_complete', status, 'metric')

    # Salvar estado atualizado
    costs['last_check'] = datetime.utcnow().isoformat()
    save_daily_costs(costs)

    # Output summary
    print(f"""
📊 Spend Monitor Report
━━━━━━━━━━━━━━━━━━━━━━
Daily:   €{daily_total:.2f} / €{daily_limits['hard']:.2f} ({daily_percent:.0f}%)
Alert:   €{daily_limits['alert']:.2f}
Status:  {status['action']}
SAFE_MODE: {'🔴 ACTIVE' if is_safe_mode() else '🟢 OFF'}
━━━━━━━━━━━━━━━━━━━━━━
""")


if __name__ == '__main__':
    main()
