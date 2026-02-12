# Task: Migrate Workflow

## Metadata
```yaml
task_id: migrate-workflow
agent: n8n-builder
priority: P3
estimated_time: 1-4h
inputs:
  - source: string (required) - path to workflow or ID
  - source_type: enum [json, n8n_instance, make, zapier] (required)
  - target: string (default: n8n local)
outputs:
  - migrated_workflow: json
  - migration_report: yaml
  - manual_steps: array
```

## Objetivo
Migrar workflows de outras plataformas ou versões antigas para n8n atual.

## Steps

### 1. Identificar Source Type

| Source | Formato | Abordagem |
|--------|---------|-----------|
| **n8n JSON antigo** | JSON | Upgrade nodes/expressions |
| **n8n instance** | API | Export e upgrade |
| **Make (Integromat)** | JSON export | Rebuild com mapeamento |
| **Zapier** | Descrição | Rebuild manual |
| **Pabbly** | JSON | Rebuild com mapeamento |

### 2. Migração de n8n Antigo

#### 2.1 Export Workflow
```bash
# Se de outra instância n8n
mcp__n8n-mcp__n8n_get_workflow --id {workflow_id} --mode full
```

#### 2.2 Identificar Versões Antigas
```
□ Checar typeVersion de cada node
□ Identificar nodes deprecated
□ Identificar expression format antigo (${}  vs {{ }})
```

#### 2.3 Upgrade Automático
```bash
# Usar autofix para upgrades comuns
mcp__n8n-mcp__n8n_autofix_workflow --workflow {json}
```

Fixes aplicados automaticamente:
- Expression format upgrade
- typeVersion upgrade
- Error output addition
- Webhook path fix

#### 2.4 Upgrade Manual (se necessário)
```
□ Nodes deprecated → Substituir por novos
□ Credentials incompatíveis → Reconfigurar
□ Breaking changes → Adaptar lógica
```

### 3. Migração de Make/Integromat

#### 3.1 Analisar Workflow Make
```
□ Listar todos os modules usados
□ Mapear para nodes n8n equivalentes
□ Identificar features sem equivalente direto
```

#### 3.2 Mapeamento Make → n8n

| Make Module | n8n Node |
|-------------|----------|
| HTTP | HTTP Request |
| Router | Switch |
| Iterator | SplitInBatches |
| Aggregator | Merge (combine mode) |
| Set Variable | Set |
| Sleep | Wait |
| Filter | If |
| Array Aggregator | Code (custom) |

#### 3.3 Rebuild Workflow
Usar templates n8n como base e adaptar lógica.

### 4. Migração de Zapier

#### 4.1 Documentar Zap
```
□ Trigger: {descrição}
□ Actions: {lista de actions}
□ Filters: {condições}
□ Paths: {branches}
```

#### 4.2 Mapeamento Zapier → n8n

| Zapier | n8n |
|--------|-----|
| Trigger | Webhook/Schedule/Event |
| Action | HTTP Request ou node específico |
| Filter | If node |
| Path | Switch node |
| Formatter | Set ou Code |
| Delay | Wait |
| Looping | SplitInBatches |

#### 4.3 Rebuild Workflow
Construir do zero seguindo a lógica do Zap.

### 5. Validar Migração
```bash
# Validar workflow migrado
mcp__n8n-mcp__validate_workflow --workflow {migrated_json} --profile strict
```

### 6. Testar Equivalência
```
□ Testar com mesmos inputs
□ Comparar outputs
□ Verificar todos os branches
□ Testar error handling
```

### 7. Documentar Migração
```yaml
migration_report:
  source:
    type: "{source_type}"
    location: "{path or url}"
    workflow_name: "{name}"

  target:
    type: "n8n"
    version: "{n8n_version}"
    workflow_name: "{new_name}"

  migration:
    started_at: "{timestamp}"
    completed_at: "{timestamp}"
    migrated_by: "@n8n-builder"

  changes:
    automatic:
      - "{change aplicado automaticamente}"
    manual:
      - "{change feito manualmente}"

  nodes_mapping:
    - source_node: "{source}"
      target_node: "{target}"
      notes: "{observações}"

  features_not_migrated:
    - feature: "{feature}"
      reason: "{por que não foi migrado}"
      workaround: "{alternativa}"

  manual_steps_required:
    - step: "{o que fazer}"
      reason: "{por que manual}"

  testing:
    inputs_tested: {n}
    outputs_matched: {n}
    issues_found:
      - "{issue}"

  status: "complete | partial | failed"
```

### 8. Handover
Se migração parcial, documentar claramente o que falta:
```yaml
handover:
  from_agent: "@n8n-builder"
  to_agent: "automation-lead"
  status: "partial"
  remaining_work:
    - "{task pendente 1}"
    - "{task pendente 2}"
  blockers:
    - "{blocker se houver}"
```

## Migration Checklist

### Pre-Migration
- [ ] Source workflow exportado/documentado
- [ ] Mapeamento de nodes criado
- [ ] Features sem equivalente identificadas
- [ ] Estimate de esforço aprovado

### During Migration
- [ ] Estrutura básica criada
- [ ] Nodes configurados
- [ ] Connections estabelecidas
- [ ] Error handling adicionado

### Post-Migration
- [ ] Validação passou
- [ ] Testes de equivalência passaram
- [ ] Documentação criada
- [ ] Deploy realizado (se aplicável)

## Output
```yaml
migration_complete:
  source: "{source_type}: {path}"
  target: "n8n workflow: {id}"
  status: "complete | partial"
  manual_steps: [{list}]
  report_path: "reports/migration-{date}.yaml"
```

## Quality Gate
- [ ] Workflow migrado funciona
- [ ] Outputs equivalentes ao original
- [ ] Validação n8n passou
- [ ] Documentação de migração completa
- [ ] Manual steps listados (se houver)
