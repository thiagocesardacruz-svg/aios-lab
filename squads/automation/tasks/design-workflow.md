# Task: Design Workflow

## Metadata
```yaml
task_id: design-workflow
agent: n8n-architect
priority: P0
estimated_time: 30-60min
inputs:
  - use_case: string (required)
  - triggers: array (optional)
  - outputs: array (optional)
  - integrations: array (optional)
outputs:
  - workflow_design: yaml
  - nodes_list: array
  - connections_map: object
  - cost_estimate: object
```

## Objetivo
Criar design técnico completo de um workflow n8n a partir de requisitos de negócio.

## Steps

### 1. Analisar Requisitos
```
□ Entender o use case completamente
□ Identificar trigger type (webhook, schedule, manual, event)
□ Listar inputs esperados
□ Listar outputs desejados
□ Identificar integrações necessárias
```

### 2. Pesquisar Nodes
```bash
# Usar n8n MCP para buscar nodes relevantes
mcp__n8n-mcp__search_nodes --query "{use_case}"
```

```
□ Listar nodes candidatos
□ Verificar typeVersion de cada node
□ Checar se requer credentials
□ Avaliar alternativas
```

### 3. Desenhar Fluxo
```
□ Definir sequência de nodes
□ Mapear conexões (main, ai_tool, etc)
□ Identificar branches condicionais
□ Definir error handling strategy
```

### 4. Criar Design Document
```yaml
workflow_design:
  name: "{workflow-name}"
  version: "1.0.0"
  complexity: "simple | medium | complex"

  purpose: |
    {descrição do que faz}

  trigger:
    type: "{type}"
    config: {}

  inputs:
    - name: "{input}"
      type: "{type}"
      required: true

  outputs:
    - name: "{output}"
      type: "{type}"

  nodes:
    - id: "node_1"
      type: "n8n-nodes-base.{type}"
      purpose: "{o que faz}"

  connections:
    - from: "node_1"
      to: "node_2"

  error_handling:
    strategy: "retry | fallback | notify"

  estimates:
    build_time: "{hours}h"
    tokens_per_run: {number}
    cost_per_run: "€{value}"
```

### 5. Revisar Design
```
□ Design cobre todos os requisitos?
□ Error handling adequado?
□ Performance considerada?
□ Custos estimados?
□ Documentação inline?
```

## Output Template
```yaml
# Salvar em: squads/automation/designs/{workflow-name}.yaml
workflow_design:
  # ... design completo
```

## Handover
Após completar, fazer handover para `n8n-builder`:
```yaml
handover:
  from_agent: "n8n-architect"
  to_agent: "n8n-builder"
  artifact_type: "workflow_design"
  required_fields:
    - workflow_design
    - nodes_list
    - connections_map
  confidence: "high"
```

## Quality Gate
- [ ] Design document completo
- [ ] Todos os nodes identificados existem
- [ ] Connections mapeadas
- [ ] Error handling definido
- [ ] Custo estimado
