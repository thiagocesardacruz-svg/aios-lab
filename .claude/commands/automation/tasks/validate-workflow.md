# Task: Validate Workflow

## Metadata
```yaml
task_id: validate-workflow
agent: n8n-builder
priority: P0
estimated_time: 15-30min
inputs:
  - workflow_json: object (required)
  - profile: enum [minimal, runtime, strict] (default: runtime)
outputs:
  - validation_result: object
  - errors: array
  - warnings: array
  - fixes_applied: array
```

## Objetivo
Validar workflow n8n contra schema e best practices, corrigindo erros automaticamente quando possível.

## Steps

### 1. Validação Estrutural
```bash
# Usar n8n MCP
mcp__n8n-mcp__validate_workflow \
  --workflow {json} \
  --options.profile "{profile}" \
  --options.validateNodes true \
  --options.validateConnections true \
  --options.validateExpressions true
```

### 2. Analisar Resultado
```
□ Contar erros críticos
□ Contar warnings
□ Identificar erros auto-corrigíveis
□ Listar erros que requerem intervenção manual
```

### 3. Categorizar Erros

| Categoria | Auto-fix? | Ação |
|-----------|-----------|------|
| typeVersion incorreto | ✅ | autofix |
| Expression format | ✅ | autofix |
| Missing error output | ✅ | autofix |
| Webhook path duplicado | ❌ | manual |
| Credential missing | ❌ | manual |
| Node não existe | ❌ | manual |
| Connection órfã | ✅ | autofix |

### 4. Aplicar Auto-fix
```bash
# Se houver erros corrigíveis
mcp__n8n-mcp__n8n_autofix_workflow --workflow {json}
```

Fixes automáticos disponíveis:
- Expression format (`${}` → `{{ }}`)
- typeVersion upgrade
- Error output handling
- Webhook path generation
- Stale connections cleanup

### 5. Re-validar
```bash
# Validar novamente após fixes
mcp__n8n-mcp__validate_workflow --workflow {fixed_json} --options.profile strict
```

### 6. Gerar Relatório
```yaml
validation_report:
  workflow_name: "{name}"
  validated_at: "{timestamp}"
  profile: "{profile}"

  summary:
    total_errors: {n}
    total_warnings: {n}
    auto_fixed: {n}
    manual_required: {n}

  errors:
    - node: "{node_name}"
      type: "{error_type}"
      message: "{message}"
      fixed: true|false

  warnings:
    - node: "{node_name}"
      type: "{warning_type}"
      message: "{message}"
      recommendation: "{fix}"

  passed: true|false
```

### 7. Decisão

```
SE errors_manual_required > 0:
  → Retornar para n8n-builder com lista de fixes
  → Status: FAILED

SE warnings > 5:
  → Revisar se são aceitáveis
  → Documentar razão de aceitar

SE passed:
  → Marcar como validado
  → Status: PASSED
```

## Profiles de Validação

| Profile | Uso | Rigor |
|---------|-----|-------|
| `minimal` | Durante edição | Baixo |
| `runtime` | Default | Médio |
| `strict` | Antes de deploy | Alto |

## Checklist Pre-Deploy
Usar `checklists/pre-deploy-validation.md` para validação completa antes de deploy.

## Output
```yaml
# Retornar para o agente que solicitou
validation:
  passed: boolean
  errors: array
  warnings: array
  fixes_applied: array
  ready_for_deploy: boolean
```

## Quality Gate
- [ ] Validação executada com profile correto
- [ ] Erros auto-corrigíveis aplicados
- [ ] Erros manuais listados claramente
- [ ] Relatório gerado
- [ ] Decisão documentada
