# OPS Squad

> Squad de Orquestração e Operações Centrais

## Visão Geral

O OPS Squad é o núcleo operacional do sistema AIOS da Travel Tech Digital. Responsável por:

- Coordenação global entre squads
- Roteamento de trabalho via Service Orders
- Monitoramento de custos e status
- **ClickUp Command Center** - Central de gestão de projetos e tarefas
- Sincronização automática de tarefas AI ↔ ClickUp

## Agentes

| Agente | Papel | Função |
|--------|-------|--------|
| **Orion** (ops-lead) | AIOS Master | Visão sistêmica, prioridades, conflitos |
| **Maxwell** (ops-manager) | Operations Manager | Cria OS, roteia para squads |
| **Clawdbot** | Executor | Scripts, sync, logs (não conversa) |

## Comandos

| Comando | Descrição |
|---------|-----------|
| `/ops/status` | Status geral do sistema |
| `/ops/new-task` | Cria nova OS a partir de pedido |
| `/ops/cost-report` | Relatório de custos |
| `/ops/sync-notion` | Sincroniza com Notion |

## Fluxo Principal

```
Pedido → /ops/new-task → OS criada → Squad responsável → Execução → Done
```

## Estrutura

```
ops/
├── squad.yaml                    # Configuração do squad
├── README.md
├── agents/
│   ├── ops-lead.md               # Orion
│   ├── ops-manager.md            # Maxwell
│   └── clawdbot.md               # Executor
├── scripts/                      # Command Center Scripts
│   ├── clickup-sync.mjs          # Task CRUD (create, start, done, comment)
│   ├── command-center.mjs        # Cost/token tracking
│   └── dashboard.mjs             # Dashboard & Goals sync
├── workflows/
│   ├── status.yaml
│   ├── new-task.yaml
│   ├── cost-report.yaml
│   └── sync-notion.yaml
├── templates/
│   └── os-template.yaml
├── checklists/
│   └── os-validation.md
└── data/
    ├── squad-registry.yaml
    └── command-center-data.json  # Usage tracking
```

## Uso

### Criar nova tarefa
```
/ops/new-task "Criar landing page para Hotel AIOS"
```

### Ver status
```
/ops/status
```

### Relatório de custos
```
/ops/cost-report --period=month --breakdown=squad
```

## ClickUp Command Center

Central de gestão de projetos integrada com ClickUp.

### Scripts

| Script | Função | Comando |
|--------|--------|---------|
| `clickup-sync.mjs` | CRUD de tarefas | `node scripts/clickup-sync.mjs create "Task" --agent=@dev` |
| `command-center.mjs` | Tracking de custos/tokens | `node scripts/command-center.mjs track <id> <in> <out>` |
| `dashboard.mjs` | Sync dashboard e Goals | `node scripts/dashboard.mjs sync` |

### Workspace Structure

```
THIAGO OS (Workspace)
├── PERSONAL (Finance, Goals, Health, Leisure, Courses, Love)
├── WORK (Travel Tech Digital, Tripwix)
├── AI OPS (Inbox, In Progress, Awaiting Human, Completed)
└── RESOURCES (Knowledge Base, Templates, Documentation, Archived)
```

### Budget Governance

| Limite | Valor | Ação |
|--------|-------|------|
| Daily | €20 | SAFE MODE |
| Monthly | €468 | Hard limit |
| Per Task | €10 | Approval required |

### Goals (ClickUp Dashboard)

- Daily Budget: https://app.clickup.com/90152366829/goals/1
- Monthly Budget: https://app.clickup.com/90152366829/goals/2
- Token Usage: https://app.clickup.com/90152366829/goals/3

Dashboard: https://app.clickup.com/t/86c86bz0w

### Files

| Arquivo | Propósito |
|---------|-----------|
| `data/command-center-data.json` | Dados de uso (tokens, custos) |
| `../project-management-clickup/data/clickup-workspace-ids.json` | IDs do workspace |

## Integrações

- **ClickUp**: Command Center, sync de tarefas e custos
- **Filesystem**: Source of truth local
- **Todos os squads**: Roteamento e coordenação
