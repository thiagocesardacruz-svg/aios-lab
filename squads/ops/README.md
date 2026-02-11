# OPS Squad

> Squad de Orquestração e Operações Centrais

## Visão Geral

O OPS Squad é o núcleo operacional do sistema AIOS da Travel Tech Digital. Responsável por:

- Coordenação global entre squads
- Roteamento de trabalho via Service Orders (OS)
- Monitoramento de custos e SLAs
- **ClickUp Command Center** - Central de gestão de projetos
- Sincronização automática de tarefas AI ↔ ClickUp
- Daily standups e weekly reviews automatizados

## Agentes

| Agente | Nome | Papel |
|--------|------|-------|
| `ops-lead` | **Orion** | AIOS Master - Visão sistêmica, prioridades, conflitos |
| `ops-manager` | **Maxwell** | Operations Manager - Cria OS, roteia para squads |
| `clawdbot` | **Clawdbot** | Executor determinístico - Scripts, sync, logs |

## Comandos

### Core Operations

| Comando | Descrição |
|---------|-----------|
| `/ops/status` | Status geral do sistema |
| `/ops/new-task` | Cria nova OS a partir de pedido |
| `/ops/cost-report` | Relatório de custos |

### Recurring Workflows

| Comando | Descrição | Trigger |
|---------|-----------|---------|
| `/ops/daily-standup` | Daily digest: OS status, blockers, costs | 18:00 London |
| `/ops/weekly-review` | Weekly review: metrics, retrospective | Fridays |

### ClickUp Command Center

| Comando | Descrição |
|---------|-----------|
| `/ops/clickup-create` | Criar task no ClickUp |
| `/ops/clickup-start` | Marcar task como in progress |
| `/ops/clickup-done` | Marcar task como concluída |
| `/ops/track-cost` | Registrar custo/tokens |
| `/ops/sync-dashboard` | Sincronizar dashboard e goals |

### Sync & Integration

| Comando | Descrição |
|---------|-----------|
| `/ops/sync-notion` | Sincroniza YAML com Notion (legacy) |

## Fluxo Principal

```
Pedido → /ops/new-task → OS criada → Squad responsável → Execução → Done
                ↓
        ClickUp sync automático
```

## Estrutura

```
ops/
├── squad.yaml                    # Configuração do squad (v1.1.0)
├── README.md
├── agents/
│   ├── ops-lead.md               # Orion - AIOS Master
│   ├── ops-manager.md            # Maxwell - Operations Manager
│   └── clawdbot.md               # Executor determinístico
├── tasks/
│   ├── create-os.md              # Criar Service Order
│   ├── route-request.md          # Rotear para squad correto
│   ├── assign-agent.md           # Atribuir agente
│   ├── track-os-status.md        # Rastrear status
│   ├── validate-os.md            # Validar OS
│   ├── monitor-sla.md            # Monitorar SLAs
│   ├── escalate-issue.md         # Escalar problemas
│   ├── calculate-daily-cost.md   # Calcular custos diários
│   ├── sync-to-notion.md         # Sync com Notion
│   ├── generate-status-report.md # Gerar relatórios
│   ├── archive-completed.md      # Arquivar concluídos
│   └── balance-workload.md       # Balancear carga
├── workflows/
│   ├── status.yaml               # Status geral
│   ├── new-task.yaml             # Nova tarefa
│   ├── cost-report.yaml          # Relatório de custos
│   ├── sync-notion.yaml          # Sync Notion
│   ├── daily-standup.yaml        # Daily digest
│   └── weekly-review.yaml        # Weekly review
├── templates/
│   ├── os-template.yaml          # Template de OS
│   ├── daily-report-tmpl.md      # Daily report
│   ├── weekly-summary-tmpl.md    # Weekly summary
│   ├── escalation-tmpl.md        # Escalation template
│   └── cost-report-tmpl.md       # Cost report
├── checklists/
│   ├── os-validation.md          # Validação de OS
│   ├── os-handoff.md             # Handoff checklist
│   ├── daily-close.md            # Checklist diário
│   └── weekly-review.md          # Checklist semanal
├── scripts/
│   ├── clickup-sync.mjs          # Task CRUD com ClickUp
│   ├── command-center.mjs        # Cost/token tracking
│   └── dashboard.mjs             # Dashboard & Goals sync
└── data/
    ├── squad-registry.yaml       # Registry de squads
    ├── sla-definitions.yaml      # Definições de SLA
    ├── escalation-matrix.yaml    # Matriz de escalação
    ├── os-status-definitions.yaml# Status de OS
    └── command-center-data.json  # Dados de uso
```

## ClickUp Command Center

Central de gestão de projetos integrada com ClickUp.

### Scripts

| Script | Função | Uso |
|--------|--------|-----|
| `clickup-sync.mjs` | CRUD de tarefas | `node scripts/clickup-sync.mjs create "Task" --agent=@dev` |
| `command-center.mjs` | Tracking de custos/tokens | `node scripts/command-center.mjs track <id> <tokens>` |
| `dashboard.mjs` | Sync dashboard e Goals | `node scripts/dashboard.mjs sync` |

### Exemplos de Uso

```bash
# Criar task
node squads/ops/scripts/clickup-sync.mjs create "[Feature] Nova funcionalidade" --agent=@dev --priority=2

# Iniciar trabalho
node squads/ops/scripts/clickup-sync.mjs start <task_id>

# Marcar como concluído
node squads/ops/scripts/clickup-sync.mjs done <task_id> "Implementado conforme spec"

# Registrar custo
node squads/ops/scripts/command-center.mjs track <task_id> 15000 45000

# Sync dashboard
node squads/ops/scripts/dashboard.mjs sync
```

### Workspace Structure

```
THIAGO OS (Workspace)
├── PERSONAL (Finance, Goals, Health, Leisure, Courses, Love)
├── WORK (Travel Tech Digital, Tripwix)
├── AI OPS (Inbox, In Progress, Awaiting Human, Completed)
└── RESOURCES (Knowledge Base, Templates, Documentation, Archived)
```

## Budget Governance

| Limite | Valor | Ação |
|--------|-------|------|
| Daily Alert | €15 | Notification |
| Daily Limit | €20 | SAFE MODE |
| Monthly Limit | €468 | Hard limit |
| Per Task | €10 | Approval required |

### Goals (ClickUp Dashboard)

- Daily Budget: https://app.clickup.com/90152366829/goals/1
- Monthly Budget: https://app.clickup.com/90152366829/goals/2
- Token Usage: https://app.clickup.com/90152366829/goals/3

Dashboard: https://app.clickup.com/t/86c86bz0w

## Tasks (12)

| Task | Função |
|------|--------|
| `create-os` | Criar Service Order |
| `route-request` | Rotear para squad correto |
| `assign-agent` | Atribuir agente responsável |
| `track-os-status` | Rastrear status de OS |
| `validate-os` | Validar OS contra checklist |
| `monitor-sla` | Monitorar SLAs |
| `escalate-issue` | Escalar problemas |
| `calculate-daily-cost` | Calcular custos diários |
| `sync-to-notion` | Sincronizar com Notion |
| `generate-status-report` | Gerar relatórios de status |
| `archive-completed` | Arquivar OS concluídas |
| `balance-workload` | Balancear carga entre agentes |

## Integrações

| Integração | Tipo | Status | Função |
|------------|------|--------|--------|
| **ClickUp** | API | Required | Command Center, tasks, goals |
| **Notion** | API | Optional | Legacy sync |
| **Filesystem** | Tool | Required | Source of truth local |

## Escalation Triggers

- Budget daily > 80%
- Conflito sem resolução em 24h
- Decisão estratégica necessária
- Violação de governance detectada

---

*OPS Squad v1.1.0 - Travel Tech Digital AIOS*
