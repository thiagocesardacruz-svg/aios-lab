# Task: Build Workflow

## Metadata
```yaml
task_id: build-workflow
agent: n8n-builder
priority: P0
estimated_time: 1-4h (depends on complexity)
inputs:
  - workflow_design: yaml (required)
  - from_template: boolean (optional)
outputs:
  - workflow_json: object
  - validation_result: object
```

## Objetivo
Implementar workflow n8n a partir de design aprovado.

## Steps

### 1. Receber Design
```
□ Ler design document
□ Confirmar entendimento dos requisitos
□ Verificar se todos os nodes existem
□ Confirmar credentials disponíveis
```

### 2. Verificar Templates Existentes
```
□ Checar se existe template similar em templates/
□ Se sim, usar como base
□ Se não, construir do zero
```

### 3. Criar Estrutura Base
```json
{
  "name": "{workflow-name}",
  "nodes": [],
  "connections": {},
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null,
  "pinData": {}
}
```

### 4. Implementar Nodes
Para cada node no design:

```javascript
// Template de node
{
  "id": "uuid-generated",
  "name": "Node Name",
  "type": "n8n-nodes-base.{type}",
  "typeVersion": {version},
  "position": [x, y],
  "parameters": {
    // configurações específicas
  }
}
```

**Checklist por node:**
```
□ ID único gerado
□ Name descritivo
□ Type correto com prefix (n8n-nodes-base. ou @n8n/n8n-nodes-langchain.)
□ typeVersion correto (verificar com get_node)
□ Position calculada (evitar sobreposição)
□ Parameters configurados
□ Credentials referenciadas (não hardcoded)
```

### 5. Implementar Connections
```javascript
// Template de connection
"connections": {
  "Source Node": {
    "main": [
      [
        {
          "node": "Target Node",
          "type": "main",
          "index": 0
        }
      ]
    ]
  }
}
```

**Para AI nodes, usar tipos especiais:**
- `ai_languageModel`
- `ai_tool`
- `ai_memory`
- `ai_outputParser`

### 6. Implementar Code Nodes (se necessário)
```javascript
// Padrões a seguir:
// 1. Sempre usar $input para acessar dados
// 2. Sempre retornar array de items
// 3. Usar try-catch para error handling
// 4. Não usar console.log em produção

const items = $input.all();

return items.map(item => {
  const data = item.json;
  return {
    json: {
      // transformed data
    }
  };
});
```

### 7. Validar Workflow
```bash
# Usar n8n MCP para validar
mcp__n8n-mcp__validate_workflow --workflow {json} --profile strict
```

```
□ Zero erros críticos
□ Warnings revisados
□ Expressions válidas
□ Connections completas
```

### 8. Auto-fix se necessário
```bash
# Se houver erros corrigíveis automaticamente
mcp__n8n-mcp__n8n_autofix_workflow --workflow {json}
```

### 9. Testar Localmente
```
□ Testar com dados mock
□ Verificar happy path
□ Verificar error path
□ Confirmar outputs esperados
```

## Output
Salvar workflow em: `squads/automation/workflows/{name}.json`

## Handover
```yaml
handover:
  from_agent: "n8n-builder"
  to_agent: "automation-lead"
  artifact_type: "workflow"
  verification:
    checklist_completed: true
    confidence: "high"
    evidence:
      - "Workflow JSON criado"
      - "Validação passou"
      - "Testes executados"
```

## Quality Gate
- [ ] Workflow JSON válido
- [ ] Validação n8n passou
- [ ] Todos os nodes configurados
- [ ] Connections completas
- [ ] Error handling implementado
- [ ] Notes explicativos em nodes complexos
