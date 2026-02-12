# Clawdbot - Platform Operations Guide

**Versão:** 1.0
**Última Atualização:** 2026-02-12

---

## Overview

Clawdbot monitora e opera as seguintes plataformas:

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLAWDBOT                                │
│                    (Platform Operations)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│   │ ClickUp  │  │  Notion  │  │   GHL    │  │   n8n    │       │
│   │ Command  │  │Knowledge │  │   CRM    │  │Automation│       │
│   │ Center   │  │  Base    │  │          │  │          │       │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                 │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│   │WordPress │  │ Supabase │  │  Slack   │                     │
│   │  Sites   │  │ Database │  │  Comms   │                     │
│   └──────────┘  └──────────┘  └──────────┘                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. ClickUp (Command Center)

### Propósito
Central de gestão de tasks e projetos do AIOS.

### Conexão
```yaml
api: https://api.clickup.com/api/v2
auth: API Key
workspace: Thiago OS
team_id: 90152366829
```

### Monitoramento

| Check | Frequência | Query | Alerta Se |
|-------|------------|-------|-----------|
| Tasks overdue | 1h | `status != done AND due_date < now` | Count > 0 |
| Tasks órfãs | 1h | `assignee = null AND status = inbox` | Count > 5 |
| Tasks blocked | 1h | `status = blocked AND updated < 24h ago` | Any |
| Goals progress | Daily | Goal targets vs current | < 80% expected |

### Operações

| Operação | Trigger | Ação |
|----------|---------|------|
| Create task | Comando Slack | POST /list/{id}/task |
| Update status | Automático | PUT /task/{id} |
| Add comment | Report | POST /task/{id}/comment |
| Sync costs | 30min | PUT /goal/{id}/key_result |

### Exemplo: Criar Task

```python
def create_task(name, description, agent=None, priority=3):
    """Cria task no ClickUp via Clawdbot"""
    data = {
        "name": f"[CLAWDBOT] {name}",
        "description": description,
        "status": "inbox",
        "priority": priority,
        "assignees": [USER_ID]
    }

    response = requests.post(
        f"{CLICKUP_API}/list/{INBOX_LIST}/task",
        headers={"Authorization": API_KEY},
        json=data
    )

    if agent:
        set_agent_field(response.json()["id"], agent)

    return response.json()
```

---

## 2. Notion (Knowledge Base)

### Propósito
Documentação, knowledge base, specs de projeto.

### Conexão
```yaml
api: https://api.notion.com/v1
auth: Integration Token
workspace: thiago-os
```

### Monitoramento

| Check | Frequência | Alerta Se |
|-------|------------|-----------|
| Docs não atualizados | Daily | last_edited > 30 dias |
| Links quebrados | Weekly | Qualquer link 404 |
| Páginas vazias | Weekly | Content empty |
| Estrutura DB | Weekly | Schema changed |

### Operações

| Operação | Quando |
|----------|--------|
| Query databases | Health check |
| Check page status | Audit |
| Verify links | Weekly scan |

---

## 3. GHL - GoHighLevel (CRM)

### Propósito
CRM, pipelines de vendas, automações de marketing.

### Conexão
```yaml
api: https://rest.gohighlevel.com/v1
auth: API Key
location_id: [configured]
```

### Monitoramento

| Check | Frequência | Alerta Se |
|-------|------------|-----------|
| Leads sem followup | 4h | Último contato > 24h |
| Pipeline estagnado | Daily | Deals sem movimento > 7 dias |
| Automações | 1h | Workflow errors |
| Appointments | 1h | No-shows não tratados |

### Operações

| Operação | Quando |
|----------|--------|
| List stale leads | Alert check |
| Pipeline summary | Daily report |
| Automation status | Health check |

### Exemplo: Check Leads

```python
def check_stale_leads():
    """Verifica leads sem followup"""
    leads = ghl_api.get_contacts(
        filters={"lastActivity": {"lt": "24h"}}
    )

    stale = [l for l in leads if needs_followup(l)]

    if stale:
        alert_slack(f"⚠️ {len(stale)} leads sem followup > 24h")

    return stale
```

---

## 4. n8n (Automation)

### Propósito
Workflows de automação, integrações, scheduled tasks.

### Conexão
```yaml
api: http://localhost:5678/api/v1  # ou Hostinger URL
auth: API Key
```

### Monitoramento

| Check | Frequência | Alerta Se |
|-------|------------|-----------|
| Workflow errors | 30min | Qualquer erro |
| Execution failures | 30min | > 3 consecutivas |
| Queue backlog | 30min | > 10 pending |
| Performance | Daily | Avg time > 2x normal |

### Operações

| Operação | Quando |
|----------|--------|
| List workflows | Health check |
| Get executions | Error check |
| Trigger workflow | On demand |

### Workflows Clawdbot

| Workflow | Trigger | Função |
|----------|---------|--------|
| WF-CLAWDBOT-COMMANDS | Webhook Slack | Processa comandos |
| WF-CLAWDBOT-MONITORS | Cron 30min | Health checks |
| WF-CLAWDBOT-ALERTS | On event | Envia alertas |
| WF-CLAWDBOT-REPORTS | Cron daily | Gera reports |
| WF-CLAWDBOT-CLICKUP | Cron 5min | Sync ClickUp |

---

## 5. WordPress (Sites)

### Propósito
Sites públicos, landing pages, blogs.

### Conexão
```yaml
sites:
  - url: https://traveltechdigital.com
    type: main
  - url: https://[other-sites]
    type: landing
```

### Monitoramento

| Check | Frequência | Alerta Se |
|-------|------------|-----------|
| Uptime | 5min | Response != 200 |
| Page speed | Daily | Load > 3s |
| SSL cert | Daily | Expira < 7 dias |
| Errors 500 | 5min | Qualquer |
| Core updates | Weekly | Updates available |

### Operações

| Operação | Quando |
|----------|--------|
| Ping site | Health check |
| Check SSL | Daily |
| Speed test | Daily |

### Exemplo: Uptime Check

```python
def check_site_uptime(url):
    """Verifica se site está up"""
    try:
        response = requests.get(url, timeout=10)
        return {
            "status": "ok" if response.status_code == 200 else "error",
            "code": response.status_code,
            "latency_ms": response.elapsed.total_seconds() * 1000
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}
```

---

## 6. Supabase (Database)

### Propósito
Database principal, auth, storage para o AI OS.

### Conexão
```yaml
api: https://[project].supabase.co
auth: Service Role Key
project: ai-os-v3
```

### Monitoramento

| Check | Frequência | Alerta Se |
|-------|------------|-----------|
| Connectivity | 5min | Falha conexão |
| Query performance | Daily | Queries > 1s |
| Storage usage | Daily | > 80% capacity |
| Auth health | 1h | Erros de auth |

### Operações

| Operação | Quando |
|----------|--------|
| Test connection | Health check |
| Check slow queries | Daily |
| Storage report | Weekly |

---

## 7. Slack (Communications)

### Propósito
Interface de comando com Thiago, alertas, reports.

### Conexão
```yaml
workspace: travel-tech-digital
bot_token: xoxb-[token]
channels:
  - "#command-center"
  - "#alerts"
```

### Operações

| Operação | Quando |
|----------|--------|
| Send message | Alerts, reports |
| Receive command | Webhook |
| Thread reply | Conversations |

---

## Health Check Consolidado

### Script: health_check_all.py

```python
#!/usr/bin/env python3
"""Health check de todas as plataformas"""

from datetime import datetime
import json

def run_all_checks():
    results = {
        "timestamp": datetime.utcnow().isoformat(),
        "platforms": {}
    }

    # ClickUp
    results["platforms"]["clickup"] = check_clickup()

    # Notion
    results["platforms"]["notion"] = check_notion()

    # GHL
    results["platforms"]["ghl"] = check_ghl()

    # n8n
    results["platforms"]["n8n"] = check_n8n()

    # WordPress
    results["platforms"]["wordpress"] = check_wordpress()

    # Supabase
    results["platforms"]["supabase"] = check_supabase()

    # Calculate overall status
    statuses = [p["status"] for p in results["platforms"].values()]
    if all(s == "ok" for s in statuses):
        results["overall"] = "ok"
    elif any(s == "error" for s in statuses):
        results["overall"] = "error"
    else:
        results["overall"] = "warning"

    return results

def format_slack_report(results):
    """Formata resultado para Slack"""
    emoji = {
        "ok": "✅",
        "warning": "⚠️",
        "error": "❌"
    }

    lines = [
        f"**Platform Health Check** - {results['timestamp']}",
        f"Overall: {emoji[results['overall']]} {results['overall'].upper()}",
        "",
        "**Platforms:**"
    ]

    for name, data in results["platforms"].items():
        lines.append(f"• {name}: {emoji[data['status']]} {data.get('message', '')}")

    return "\n".join(lines)
```

---

## Alertas

### Níveis de Alerta

| Nível | Quando | Ação |
|-------|--------|------|
| **INFO** | Status normal, mudanças | Log only |
| **WARNING** | Anomalia detectada | Slack #command-center |
| **ERROR** | Falha crítica | Slack #alerts + mention @thiago |

### Template de Alerta

```
🚨 ALERT: [PLATFORM] - [ISSUE]

Status: ERROR
Time: 2026-02-12 10:30:00 UTC

Details:
• [detail 1]
• [detail 2]

Suggested Action:
• [action]

---
Clawdbot Platform Ops
```

---

## Reports

### Daily Report (09:00)

```
📊 Daily Platform Report - 2026-02-12

PLATFORMS:
✅ ClickUp: 15 tasks completed, 3 pending
✅ Notion: All docs current
⚠️ GHL: 2 leads need followup
✅ n8n: 45 workflows executed, 0 errors
✅ WordPress: All sites up, avg 1.2s load
✅ Supabase: 45% storage used

HIGHLIGHTS:
• [Notable events]

NEEDS ATTENTION:
• GHL: 2 leads awaiting followup > 24h

---
Clawdbot Daily Report
```

### Weekly Report (Monday 09:00)

```
📈 Weekly Platform Report - Week 7, 2026

SUMMARY:
• Tasks completed: 45
• Leads processed: 12
• Automations run: 312
• Uptime: 99.9%

TRENDS:
• ClickUp velocity: +15% vs last week
• GHL conversions: 3/12 (25%)

ISSUES RESOLVED:
• [list]

RECOMMENDATIONS:
• [suggestions]

---
Clawdbot Weekly Report
```

---

*Platform Operations Guide v1.0*
*Clawdbot - Squad OPS*
