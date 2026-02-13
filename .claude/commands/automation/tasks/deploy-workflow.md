# Task: Deploy Workflow

## Metadata
```yaml
task_id: deploy-workflow
agent: n8n-builder
priority: P1
estimated_time: 15-30min
inputs:
  - workflow_json: object (required)
  - target_instance: string (default: production)
  - activate: boolean (default: false)
outputs:
  - deployed_workflow_id: string
  - deployment_status: object
```

## Objetivo
Fazer deploy de workflow validado para instância n8n.

## Pre-requisitos
```
□ Workflow passou em validate-workflow
□ Checklist pre-deploy-validation.md completo
□ Credentials configuradas na instância destino
□ Permissões de API configuradas
```

## Steps

### 1. Verificar Validação
```
□ Confirmar que workflow passou validação
□ Confirmar profile usado foi 'strict'
□ Verificar se há warnings pendentes
```

### 2. Preparar para Deploy
```javascript
// Remover dados de desenvolvimento
const deployReady = {
  ...workflow,
  // Limpar staticData se existir dados de teste
  staticData: null,
  // Limpar pinData
  pinData: {},
  // Garantir que está inativo inicialmente
  active: false
};
```

### 3. Verificar Credentials
```
□ Listar credentials usadas no workflow
□ Confirmar que existem na instância destino
□ Se não existem, documentar e pausar
```

### 4. Deploy via MCP
```bash
# Criar workflow na instância
mcp__n8n-mcp__n8n_create_workflow \
  --name "{workflow_name}" \
  --nodes {nodes_array} \
  --connections {connections_object} \
  --settings {settings_object}
```

### 5. Validar Deploy
```bash
# Verificar workflow na instância
mcp__n8n-mcp__n8n_get_workflow --id {workflow_id} --mode summary
```

```
□ Workflow existe na instância
□ Nodes estão corretos
□ Connections estão corretas
□ Settings estão corretos
```

### 6. Testar em Produção
```bash
# Se workflow tem trigger testável
mcp__n8n-mcp__n8n_test_workflow --id {workflow_id}
```

```
□ Trigger funciona
□ Flow executa sem erros
□ Output é o esperado
```

### 7. Ativar (se solicitado)
```bash
# Apenas se --activate=true e testes passaram
mcp__n8n-mcp__n8n_update_partial_workflow \
  --id {workflow_id} \
  --operations '[{"type": "activateWorkflow"}]'
```

### 8. Registrar Deploy
Atualizar `data/workflow-registry.yaml`:
```yaml
- id: "{workflow_id}"
  name: "{name}"
  version: "{version}"
  status: "active"
  deployed_at: "{timestamp}"
  deployed_to: "{instance}"
  deployed_by: "@n8n-builder"
```

### 9. Notificar
```
□ Informar automation-lead sobre deploy
□ Se produto, informar product-engineer
□ Documentar em changelog
```

## Rollback
Se algo der errado:
```bash
# Desativar workflow
mcp__n8n-mcp__n8n_update_partial_workflow \
  --id {workflow_id} \
  --operations '[{"type": "deactivateWorkflow"}]'

# Ou deletar se necessário
mcp__n8n-mcp__n8n_delete_workflow --id {workflow_id}
```

## Output
```yaml
deployment:
  workflow_id: "{id}"
  workflow_name: "{name}"
  instance: "{instance_url}"
  status: "deployed | active | failed"
  deployed_at: "{timestamp}"
  tested: true|false
  activated: true|false
```

## Quality Gate
- [ ] Validação prévia confirmada
- [ ] Credentials verificadas
- [ ] Deploy executado
- [ ] Testes em produção passaram (se aplicável)
- [ ] Registry atualizado
- [ ] Stakeholders notificados
