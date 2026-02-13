# Task: Debug Workflow

## Metadata
```yaml
task_id: debug-workflow
agent: n8n-builder
priority: P1
estimated_time: 30min-2h
inputs:
  - workflow_id: string (required)
  - error_description: string (optional)
  - execution_id: string (optional)
outputs:
  - root_cause: string
  - fix_applied: boolean
  - fix_description: string
```

## Objetivo
Diagnosticar e corrigir problemas em workflows n8n.

## Steps

### 1. Coletar Informações
```bash
# Obter workflow atual
mcp__n8n-mcp__n8n_get_workflow --id {workflow_id} --mode standard

# Se tiver execution_id, obter detalhes
mcp__n8n-mcp__n8n_executions \
  --operation get \
  --executionId {execution_id} \
  --includeData true
```

### 2. Identificar Tipo de Erro

| Tipo | Sintomas | Abordagem |
|------|----------|-----------|
| **Validation** | Workflow não salva | Validar estrutura |
| **Trigger** | Não inicia | Verificar trigger config |
| **Connection** | Dados não passam | Checar connections |
| **Expression** | Valor undefined | Debug expressions |
| **API** | 4xx/5xx errors | Verificar credentials/payload |
| **Logic** | Output errado | Trace data flow |
| **Performance** | Timeout | Otimizar/paginar |

### 3. Debug por Tipo

#### 3.1 Validation Errors
```bash
# Re-validar workflow
mcp__n8n-mcp__validate_workflow --workflow {json} --profile strict
```

Fixes comuns:
- typeVersion incorreto → autofix
- Expression format → autofix
- Connection órfã → autofix

#### 3.2 Trigger Issues
```
□ Webhook: URL correta? Path único?
□ Schedule: Timezone correto? Cron válido?
□ Event: Source configurado?
```

#### 3.3 Connection Issues
```
□ Todas as connections existem?
□ Indexes corretos (0, 1, 2...)?
□ Para AI nodes, type correto (ai_tool, ai_languageModel)?
```

#### 3.4 Expression Issues
```javascript
// Debugar expression
// Problema comum: acessar dado que não existe

// Errado:
{{ $json.user.email }}  // se user pode ser undefined

// Correto:
{{ $json.user?.email ?? 'N/A' }}

// Ou usar $if:
{{ $if($json.user, $json.user.email, 'N/A') }}
```

#### 3.5 API Errors
```
□ Credentials válidas?
□ Rate limit atingido?
□ Payload correto?
□ Headers necessários?
```

Teste isolado:
```javascript
// No Code node, testar API isoladamente
const response = await $http.request({
  method: 'GET',
  url: 'https://api.example.com/test',
  headers: {
    'Authorization': 'Bearer ' + $credentials.token
  }
});
return { json: response };
```

#### 3.6 Logic Issues
```
□ Adicionar Set nodes para inspecionar dados
□ Usar pinData para testar com dados fixos
□ Verificar condicionais (If/Switch)
```

#### 3.7 Performance Issues
```
□ Loop muito grande? → SplitInBatches
□ API lenta? → Adicionar timeout
□ Dados grandes? → Paginar
```

### 4. Aplicar Fix
```bash
# Atualizar workflow com fix
mcp__n8n-mcp__n8n_update_partial_workflow \
  --id {workflow_id} \
  --operations '[{fix_operations}]'
```

### 5. Testar Fix
```bash
# Re-executar workflow
mcp__n8n-mcp__n8n_test_workflow --id {workflow_id}
```

### 6. Documentar
```yaml
debug_report:
  workflow_id: "{id}"
  error_type: "{type}"
  root_cause: "{description}"
  fix_applied: "{description}"
  tested: true
  fixed_at: "{timestamp}"
  fixed_by: "@n8n-builder"

  # Para learning loop
  lesson_learned: |
    {O que aprendemos com este bug}
```

## Common Fixes Cheatsheet

| Erro | Fix |
|------|-----|
| "Cannot read property X of undefined" | Adicionar optional chaining `?.` |
| "Expression evaluation error" | Verificar formato `{{ }}` vs `${}` |
| "Node type not found" | Verificar prefix `n8n-nodes-base.` |
| "Connection not found" | Verificar nome exato do node |
| "Timeout" | Aumentar timeout ou paginar |
| "Rate limit" | Adicionar Wait node ou throttle |
| "401 Unauthorized" | Verificar/renovar credentials |
| "Invalid JSON" | Verificar encoding e formato |

## Quality Gate
- [ ] Root cause identificado
- [ ] Fix aplicado
- [ ] Testes passaram
- [ ] Documentação atualizada
- [ ] Lesson learned registrado
