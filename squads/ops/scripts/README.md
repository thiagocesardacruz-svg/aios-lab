# OPS Scripts

Scripts do Command Center para automação de operações com ClickUp.

## Scripts Disponíveis

| Script | Função |
|--------|--------|
| `clickup-sync.mjs` | CRUD de tarefas no ClickUp |
| `command-center.mjs` | Tracking de custos e tokens |
| `dashboard.mjs` | Sincronização de dashboard e Goals |

---

## clickup-sync.mjs

Gerenciamento de tarefas no ClickUp.

### Comandos

```bash
# Criar task
node clickup-sync.mjs create "Nome da task" --agent=@dev --priority=2

# Iniciar trabalho (move para In Progress)
node clickup-sync.mjs start <task_id>

# Aguardando humano
node clickup-sync.mjs await-human <task_id> "Motivo"

# Marcar como concluído
node clickup-sync.mjs done <task_id> "Resumo do trabalho"

# Adicionar comentário
node clickup-sync.mjs comment <task_id> "Comentário de progresso"
```

### Parâmetros

| Param | Descrição | Valores |
|-------|-----------|---------|
| `--agent` | Agente responsável | `@dev`, `@architect`, `@pm`, `@po`, `@qa`, `@sm`, `@analyst`, `@devops`, `@data-engineer` |
| `--priority` | Prioridade | `1` (urgent), `2` (high), `3` (normal), `4` (low) |
| `--description` | Descrição da task | texto |

### Status Flow

```
Inbox → In Progress → Awaiting Human (se bloqueado) → Completed
```

---

## command-center.mjs

Tracking de custos e tokens por task.

### Comandos

```bash
# Registrar tokens usados
node command-center.mjs track <task_id> <input_tokens> <output_tokens>

# Ver resumo diário
node command-center.mjs daily

# Ver resumo mensal
node command-center.mjs monthly

# Verificar budget
node command-center.mjs check-budget
```

### Cálculo de Custo

```
Input tokens:  $3.00 / 1M tokens
Output tokens: $15.00 / 1M tokens
```

---

## dashboard.mjs

Sincronização com ClickUp Dashboard e Goals.

### Comandos

```bash
# Sync completo (dashboard + goals)
node dashboard.mjs sync

# Apenas goals
node dashboard.mjs goals

# Apenas dashboard
node dashboard.mjs dashboard
```

### Goals Sincronizados

| Goal | Target | Métrica |
|------|--------|---------|
| Daily Budget | €20 | Custo acumulado hoje |
| Monthly Budget | €468 | Custo acumulado mês |
| Token Usage | - | Total tokens consumidos |

---

## Configuração

### IDs Necessários

Os IDs do workspace estão em:
```
squads/project-management-clickup/data/clickup-workspace-ids.json
```

### Dados de Uso

Tracking local salvo em:
```
squads/ops/data/command-center-data.json
```

---

## Integração com Agents

Agents AIOS devem sincronizar automaticamente com ClickUp seguindo `.claude/rules/clickup-auto-sync.md`:

1. Criar task ao iniciar trabalho
2. Atualizar status conforme progresso
3. Registrar tokens/custo ao finalizar
4. Marcar como done com resumo

---

*OPS Scripts v1.0 - ClickUp Command Center*
