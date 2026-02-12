# Clawdbot - Integrações

---

## Overview

```
                    Clawdbot (AWS EC2)
                          │
    ┌─────────────────────┼─────────────────────┐
    │                     │                     │
    ▼                     ▼                     ▼
┌────────┐          ┌──────────┐          ┌────────┐
│ Slack  │          │ ClickUp  │          │  n8n   │
│ (UI)   │          │ (Tasks)  │          │(Flows) │
└────────┘          └──────────┘          └────────┘
    │                     │                     │
    │                     │                     │
    ▼                     ▼                     ▼
┌────────┐          ┌──────────┐          ┌────────┐
│ Notion │          │   GHL    │          │ Google │
│ (Docs) │          │  (CRM)   │          │(Cal)   │
└────────┘          └──────────┘          └────────┘
```

---

## Integrações Ativas

### Slack
- **Status:** Ativo
- **Função:** Interface principal com humanos
- **Canais:** #command-center, DMs
- **Capabilities:** Comandos, alertas, threads

### Notion
- **Status:** Ativo
- **Função:** Knowledge base, documentação
- **Databases:** Projects, Service Orders, Knowledge Base
- **Capabilities:** Read/Write pages, query DBs

### n8n
- **Status:** Ativo (Hostinger)
- **Função:** Automações e workflows
- **Workflows:** 8 ativos (WF-01 a WF-11)

### Google
- **Status:** Ativo
- **Função:** Calendar, Drive
- **Capabilities:** Read events, access docs

### ClickUp
- **Status:** Em integração
- **Função:** Command Center (sync com AIOS Lab)
- **Capabilities:** Task CRUD, Goals, Comments

### GHL (GoHighLevel)
- **Status:** Potencial
- **Função:** CRM, funnels, automações
- **Capabilities:** Via API (não MCP)

---

## n8n Workflows

| ID | Nome | Trigger | Função |
|----|------|---------|--------|
| WF-01 | Context Sync | Schedule 30min | Sync Notion → AWS cache |
| WF-02 | SO Detector | Schedule 10min | Detectar SOs ready, executar |
| WF-03 | Execution Logger | Webhook AWS | Log resultados em Notion |
| WF-04 | Lead SLA Monitor | Schedule 10min | Monitor tempo resposta leads |
| WF-05 | Daily Digest | Schedule 09:00 | Gerar resumo diário |
| WF-06 | Alert Router | Webhook | Rotear alertas por severidade |
| WF-07 | Member Tracker | Webhook GHL | Track milestones member area |
| WF-11 | Health Ping | Schedule 30min | Verificar health componentes |

---

## Python Scripts (EC2)

| Script | Função | Trigger |
|--------|--------|---------|
| `state_manager.py` | Single-writer state files | Called by others |
| `spend_monitor.py` | Track API costs, SAFE_MODE | Cron 30 min |
| `health_check.py` | System health monitoring | Cron 30 min |
| `context_sync.py` | Sync Notion → AWS cache | n8n WF-01 |
| `so_executor.py` | Execute Service Orders | n8n WF-02 |
| `finance_import.py` | Import finance CSV | Manual |

---

## Integração com AIOS Lab

### Via ClickUp (Recomendado)

```
Claude Code                    Clawdbot
    │                             │
    │ 1. Cria task com tag        │
    │    clawdbot:execute         │
    ├────────────────────────────►│
    │                             │
    │          ClickUp            │
    │                             │
    │ 2. Clawdbot poll (5 min)    │
    │◄────────────────────────────┤
    │                             │
    │ 3. Executa script           │
    │                             │
    │ 4. Update status ClickUp    │
    │◄────────────────────────────┤
    │                             │
```

### Campos ClickUp

| Campo | Valores | Uso |
|-------|---------|-----|
| Execution Mode | SESSION, DAEMON | Quem executa |
| Clawdbot Script | texto | Script a executar |
| Status | daemon_queue | Task para Clawdbot |

---

## Comparação: Onde Construir

| Ferramenta | Claude Code | Clawdbot |
|------------|-------------|----------|
| **GHL** | MCP (36 tools) - MELHOR | API direta |
| **n8n** | Via API/webhook | Nativo - MELHOR |
| **Notion** | Via MCP | Nativo - MELHOR |
| **ClickUp** | Scripts completos - MELHOR | Básico |
| **Código** | Full capability - MELHOR | Limitado |

**Regra:** Construir em Claude Code, executar em Clawdbot quando 24/7 necessário.

---

## Configuração de Integrações

### Slack
```yaml
workspace: travel-tech-digital
channels:
  - "#command-center"
  - "#alerts"
bot_name: Clawdbot
```

### Notion
```yaml
workspace: thiago-os
databases:
  projects: "xxx"
  service_orders: "xxx"
  knowledge_base: "xxx"
```

### ClickUp
```yaml
workspace: "Thiago OS"
team_id: "90152366829"
lists:
  inbox: "901521080779"
  in_progress: "901521080780"
```

---

*Referência: thiago-os/30-N8N-WORKFLOWS-SPEC.md*
