# Scripts EC2 - Clawdbot

Scripts prontos para implementar no AWS EC2.

## Setup Rápido

```bash
# No EC2, baixe e execute o setup:
curl -sSL https://raw.githubusercontent.com/thiagocesardacruz-svg/aios-lab/main/squads/ops/clawdbot/scripts-ec2/setup.sh | bash
```

Ou manualmente:

```bash
# 1. Clone o repo
git clone https://github.com/thiagocesardacruz-svg/aios-lab.git /opt/clawdbot/repo

# 2. Execute o setup
bash /opt/clawdbot/repo/squads/ops/clawdbot/scripts-ec2/setup.sh
```

## Scripts Incluídos

| Script | Função | Cron |
|--------|--------|------|
| `clickup_poller.py` | Poll ClickUp para tasks delegadas | `*/5 * * * *` |
| `spend_monitor.py` | Monitorar custos, trigger SAFE_MODE | `*/30 * * * *` |
| `health_check.py` | Health check dos sistemas | `*/30 * * * *` |
| `safe_mode_manager.py` | Gerenciar SAFE_MODE | Manual |
| `setup.sh` | Setup automático | Uma vez |

## Uso Manual

```bash
# Health check
python3 /opt/clawdbot/scripts/health_check.py

# Verificar SAFE_MODE
python3 /opt/clawdbot/scripts/safe_mode_manager.py status

# Ativar SAFE_MODE (emergência)
python3 /opt/clawdbot/scripts/safe_mode_manager.py activate "Reason"

# Desativar SAFE_MODE (somente Director)
python3 /opt/clawdbot/scripts/safe_mode_manager.py deactivate

# Testar poller
python3 /opt/clawdbot/scripts/clickup_poller.py
```

## Logs

```bash
# Ver logs de atividade
tail -f /opt/clawdbot/logs/activity/$(date +%Y-%m-%d).jsonl

# Ver logs do cron
tail -f /opt/clawdbot/logs/cron.log
```

## Source of Truth

**IMPORTANTE:** A única fonte de verdade é o repositório `aios-lab`:

- Documentação: `squads/ops/clawdbot/`
- Budget: `shared/budget-limits.yaml`
- Scripts: `squads/ops/clawdbot/scripts-ec2/`

**IGNORE** documentos antigos do `thiago-os`.
