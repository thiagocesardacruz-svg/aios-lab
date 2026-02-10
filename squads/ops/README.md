# OPS Squad

> Squad de Orquestração e Operações Centrais

## Visão Geral

O OPS Squad é o núcleo operacional do sistema AIOS da Travel Tech Digital. Responsável por:

- Coordenação global entre squads
- Roteamento de trabalho via Service Orders
- Monitoramento de custos e status
- Sincronização com sistemas externos (Notion)

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
├── squad.yaml          # Configuração do squad
├── agents/
│   ├── ops-lead.md     # Orion
│   ├── ops-manager.md  # Maxwell
│   └── clawdbot.md     # Executor
├── workflows/
│   ├── status.yaml
│   ├── new-task.yaml
│   ├── cost-report.yaml
│   └── sync-notion.yaml
├── templates/
│   └── os-template.yaml
├── checklists/
│   └── os-validation.md
├── data/
│   └── squad-registry.yaml
└── README.md
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

## Integrações

- **Notion**: Sync automático de OS e custos
- **Filesystem**: Source of truth local
- **Todos os squads**: Roteamento e coordenação
