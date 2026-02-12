# Clawdbot - Guia de Setup (Hostinger)

**Versão:** 3.0
**Infraestrutura:** Hostinger VPS (junto com n8n)
**Custo Adicional:** €0

---

## Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                     HOSTINGER VPS                               │
│                    (Já pago, n8n rodando)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                        n8n                              │   │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │   │
│   │  │ WF-COMMANDS │  │ WF-MONITORS │  │ WF-REPORTS  │     │   │
│   │  │ (Slack)     │  │ (Cron)      │  │ (Daily)     │     │   │
│   │  └─────────────┘  └─────────────┘  └─────────────┘     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│   ┌──────────────────────────┴──────────────────────────────┐   │
│   │                   Scripts Python                        │   │
│   │  platform_checks.py | clickup_ops.py | report_gen.py   │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│   ┌──────────────────────────┴──────────────────────────────┐   │
│   │                    Slack Bot                            │   │
│   │                    (Clawdbot)                           │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Parte 1: O Que é o Clawdbot

### Identidade

| Campo | Valor |
|-------|-------|
| **Nome** | Clawdbot |
| **Role** | Platform Operations Agent |
| **Squad** | OPS |
| **Função** | Monitora plataformas, cria tasks, reporta status |
| **Interface** | Slack |
| **Infra** | Hostinger VPS (compartilhado com n8n) |

### O Que Clawdbot Faz

1. **Monitora Plataformas:** ClickUp, Notion, GHL, n8n, WordPress, Supabase
2. **Recebe Comandos:** Via Slack do Director
3. **Cria Tasks:** No ClickUp para squads executarem
4. **Reporta Status:** Alertas e reports diários/semanais
5. **QA Contínuo:** Verifica saúde de todas as integrações

### O Que Clawdbot NÃO Faz

- ❌ Escrever código (função do Claude Code)
- ❌ Interagir com squads (função do AIOS Master)
- ❌ Falar com clientes
- ❌ Tomar decisões estratégicas

---

## Parte 2: Arquitetura no Hostinger

### Componentes

```
/home/user/clawdbot/
├── scripts/
│   ├── platform_checks.py    # Health checks das plataformas
│   ├── clickup_ops.py        # Operações no ClickUp
│   ├── ghl_monitor.py        # Monitoramento do GHL
│   ├── notion_audit.py       # Auditoria do Notion
│   ├── site_monitor.py       # Monitoramento WordPress
│   └── report_generator.py   # Geração de reports
│
├── config/
│   ├── platforms.yaml        # Credenciais e endpoints
│   └── alerts.yaml           # Configuração de alertas
│
├── logs/
│   └── activity.jsonl        # Logs de atividade
│
└── data/
    └── state.json            # Estado atual
```

### Workflows n8n

| Workflow | Trigger | Função |
|----------|---------|--------|
| `WF-CLAWDBOT-COMMANDS` | Webhook Slack | Processa comandos do Director |
| `WF-CLAWDBOT-MONITORS` | Cron (30min) | Executa health checks |
| `WF-CLAWDBOT-ALERTS` | On event | Envia alertas para Slack |
| `WF-CLAWDBOT-REPORTS` | Cron (daily 09:00) | Gera report diário |
| `WF-CLAWDBOT-CLICKUP` | Cron (5min) | Sync com ClickUp |

---

## Parte 3: Setup Passo a Passo

### 3.1 Conectar ao Hostinger

```bash
ssh user@your-hostinger-vps
```

### 3.2 Criar Estrutura

```bash
# Criar diretórios
mkdir -p ~/clawdbot/{scripts,config,logs,data}

# Verificar
ls -la ~/clawdbot/
```

### 3.3 Instalar Dependências

```bash
# Python packages
pip3 install requests pyyaml slack_sdk

# Verificar
python3 -c "import requests, yaml, slack_sdk; print('OK')"
```

### 3.4 Configurar Credenciais

```bash
# Criar config de plataformas
cat > ~/clawdbot/config/platforms.yaml << 'EOF'
# Platform Credentials
# WARNING: Keep this file secure!

clickup:
  api_key: "pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O"
  team_id: "90152366829"
  inbox_list: "901521080779"

notion:
  token: "YOUR_NOTION_TOKEN"
  workspace: "thiago-os"

ghl:
  api_key: "YOUR_GHL_API_KEY"
  location_id: "YOUR_LOCATION_ID"

slack:
  bot_token: "xoxb-YOUR-BOT-TOKEN"
  signing_secret: "YOUR_SIGNING_SECRET"
  channel_commands: "#command-center"
  channel_alerts: "#alerts"

wordpress:
  sites:
    - url: "https://traveltechdigital.com"
      name: "Main Site"

supabase:
  url: "https://YOUR_PROJECT.supabase.co"
  service_key: "YOUR_SERVICE_KEY"
EOF

# Proteger arquivo
chmod 600 ~/clawdbot/config/platforms.yaml
```

### 3.5 Criar Scripts

```bash
# Health Check principal
cat > ~/clawdbot/scripts/platform_checks.py << 'SCRIPT'
#!/usr/bin/env python3
"""Platform health checks para todas as plataformas"""

import requests
import yaml
from datetime import datetime
from pathlib import Path

CONFIG_FILE = Path.home() / "clawdbot/config/platforms.yaml"
LOG_FILE = Path.home() / "clawdbot/logs/activity.jsonl"

def load_config():
    with open(CONFIG_FILE) as f:
        return yaml.safe_load(f)

def check_clickup(config):
    """Check ClickUp connectivity"""
    try:
        response = requests.get(
            "https://api.clickup.com/api/v2/team",
            headers={"Authorization": config["clickup"]["api_key"]},
            timeout=10
        )
        return {
            "status": "ok" if response.status_code == 200 else "error",
            "latency_ms": int(response.elapsed.total_seconds() * 1000)
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}

def check_n8n():
    """Check n8n local"""
    try:
        response = requests.get("http://localhost:5678/healthz", timeout=5)
        return {"status": "ok" if response.status_code == 200 else "error"}
    except:
        return {"status": "error", "error": "n8n not responding"}

def check_wordpress(config):
    """Check WordPress sites"""
    results = []
    for site in config.get("wordpress", {}).get("sites", []):
        try:
            response = requests.get(site["url"], timeout=10)
            results.append({
                "name": site["name"],
                "status": "ok" if response.status_code == 200 else "error",
                "latency_ms": int(response.elapsed.total_seconds() * 1000)
            })
        except Exception as e:
            results.append({"name": site["name"], "status": "error", "error": str(e)})
    return results

def run_all_checks():
    config = load_config()

    results = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "platforms": {
            "clickup": check_clickup(config),
            "n8n": check_n8n(),
            "wordpress": check_wordpress(config)
        }
    }

    # Calculate overall
    statuses = []
    for p in results["platforms"].values():
        if isinstance(p, list):
            statuses.extend([x.get("status") for x in p])
        else:
            statuses.append(p.get("status"))

    results["overall"] = "ok" if all(s == "ok" for s in statuses) else "error"

    return results

if __name__ == "__main__":
    import json
    results = run_all_checks()
    print(json.dumps(results, indent=2))
SCRIPT

chmod +x ~/clawdbot/scripts/platform_checks.py
```

### 3.6 Configurar Workflows no n8n

#### Workflow 1: Commands (Webhook)

```
1. Abrir n8n: http://your-vps:5678
2. Create new workflow: "WF-CLAWDBOT-COMMANDS"
3. Add nodes:
   - Webhook (POST /clawdbot/command)
   - Switch (route by command)
   - Execute Command (run Python scripts)
   - Slack (send response)
4. Activate workflow
```

#### Workflow 2: Monitors (Cron)

```
1. Create workflow: "WF-CLAWDBOT-MONITORS"
2. Add nodes:
   - Cron (every 30 min)
   - Execute Command (python3 ~/clawdbot/scripts/platform_checks.py)
   - IF (check for errors)
   - Slack (send alert if errors)
3. Activate workflow
```

#### Workflow 3: Daily Report (Cron)

```
1. Create workflow: "WF-CLAWDBOT-REPORTS"
2. Add nodes:
   - Cron (daily 09:00)
   - Execute Command (generate report)
   - Slack (send to #command-center)
3. Activate workflow
```

### 3.7 Configurar Slack App

1. Criar App em https://api.slack.com/apps
2. Bot Token Scopes:
   - `chat:write`
   - `commands`
   - `channels:read`
3. Event Subscriptions:
   - Request URL: `https://your-vps/webhook/clawdbot/command`
4. Install to Workspace
5. Add bot to channels: `#command-center`, `#alerts`

### 3.8 Testar

```bash
# Testar health check
python3 ~/clawdbot/scripts/platform_checks.py

# Testar via Slack
# No Slack: @Clawdbot status
```

---

## Parte 4: Comandos Disponíveis

### Via Slack

| Comando | Ação |
|---------|------|
| `status` | Status de todas as plataformas |
| `status clickup` | Status específico do ClickUp |
| `cria task [desc]` | Criar task no ClickUp |
| `tasks pendentes` | Listar tasks abertas |
| `health check` | Executar health check completo |
| `report` | Gerar report atual |

### Formato de Resposta

```
STATUS: OK

PLATFORMS:
• ClickUp: ✅ ok (45ms)
• Notion: ✅ ok
• GHL: ⚠️ 2 leads need followup
• n8n: ✅ ok
• WordPress: ✅ ok (1.2s)

ALERTS: None

NEEDS ATTENTION: None
```

---

## Parte 5: Monitoramento

### Checks Periódicos

| Check | Frequência | Script |
|-------|------------|--------|
| Platform health | 30min | `platform_checks.py` |
| ClickUp tasks | 5min | `clickup_ops.py` |
| GHL leads | 4h | `ghl_monitor.py` |
| Site uptime | 5min | `site_monitor.py` |

### Alertas

| Nível | Quando | Canal |
|-------|--------|-------|
| INFO | Status normal | Log only |
| WARNING | Anomalia | #command-center |
| ERROR | Falha crítica | #alerts + @thiago |

---

## Parte 6: Manutenção

### Daily

```bash
# Verificar logs
tail -f ~/clawdbot/logs/activity.jsonl

# Verificar n8n executions
# (via n8n UI)
```

### Weekly

```bash
# Atualizar scripts do repo
cd ~/clawdbot
git pull origin main 2>/dev/null || echo "Not a git repo"

# Limpar logs antigos
find ~/clawdbot/logs -name "*.jsonl" -mtime +30 -delete
```

---

## Parte 7: Troubleshooting

### n8n não responde

```bash
# Verificar status
systemctl status n8n

# Restart
systemctl restart n8n

# Ver logs
journalctl -u n8n -f
```

### Script falha

```bash
# Testar manualmente
python3 ~/clawdbot/scripts/platform_checks.py

# Ver erros
cat ~/clawdbot/logs/activity.jsonl | tail -20
```

### Slack não recebe mensagens

1. Verificar bot token em `platforms.yaml`
2. Verificar se bot está nos canais
3. Testar webhook do n8n

---

## Parte 8: Migração do AWS

Se estiver migrando do AWS EC2:

```bash
# 1. No EC2, exportar configs
scp -r /opt/clawdbot/config user@hostinger:~/clawdbot/

# 2. No Hostinger, ajustar paths
sed -i 's|/opt/clawdbot|/home/user/clawdbot|g' ~/clawdbot/config/*.yaml

# 3. Desligar EC2
# (via AWS Console)

# 4. Testar tudo no Hostinger
python3 ~/clawdbot/scripts/platform_checks.py
```

---

## Checklist Final

- [ ] VPS Hostinger acessível
- [ ] Python 3 instalado
- [ ] Dependências instaladas (requests, pyyaml, slack_sdk)
- [ ] Estrutura de diretórios criada
- [ ] Credenciais configuradas em `platforms.yaml`
- [ ] Scripts copiados e executáveis
- [ ] n8n workflows criados e ativos
- [ ] Slack App configurado
- [ ] Bot adicionado aos canais
- [ ] Health check passando
- [ ] Comando `status` respondendo no Slack

---

*Clawdbot Setup Guide v3.0*
*Hostinger VPS - Zero Additional Cost*
*2026-02-12*
