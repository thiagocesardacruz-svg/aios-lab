# Task: Create Product

## Metadata
```yaml
task_id: create-product
agent: product-engineer
priority: P1
estimated_time: 2-4h
inputs:
  - workflow_id: string (required)
  - product_name: string (required)
  - category: enum [acquisition, conversion, content, data, retention]
outputs:
  - product_spec: yaml
  - product_id: string
```

## Objetivo
Transformar um workflow n8n em produto vendável com spec completa.

## Steps

### 1. Analisar Workflow
```
□ Ler workflow e entender o que faz
□ Identificar inputs necessários do cliente
□ Identificar outputs produzidos
□ Listar integrações requeridas
□ Calcular custos por execução
```

### 2. Definir Proposta de Valor
```
□ Qual problema resolve?
□ Para quem? (ICP)
□ Qual o benefício principal?
□ Qual economia de tempo/dinheiro?
□ Qual diferencial vs alternativas?
```

### 3. Criar Product Spec
```yaml
product:
  # Identidade
  id: "{slug}"
  name: "{Product Name}"
  tagline: "{< 10 palavras}"
  version: "1.0.0"
  category: "{category}"
  status: "development"  # development | beta | live | deprecated

  # Value Proposition
  description:
    short: "{1 parágrafo}"
    long: |
      {Descrição completa com benefícios}

  # Problema
  problem:
    pain_points:
      - "{dor 1}"
      - "{dor 2}"
    consequences:
      - "{consequência de não resolver}"
    current_alternatives:
      - "{como resolvem hoje}"

  # Solução
  solution:
    features:
      - name: "{Feature 1}"
        description: "{O que faz}"
        included_in: ["starter", "professional"]
      - name: "{Feature 2}"
        description: "{O que faz}"
        included_in: ["professional"]
    benefits:
      - "{Benefício quantificável}"

  # Técnico
  technical:
    workflow_id: "{id}"
    workflow_file: "workflows/{file}.json"
    complexity: "simple | medium | complex"
    ai_required: true|false

    costs:
      ai_per_run: 0.05  # EUR
      api_calls_per_run: 3
      estimated_monthly: 10  # EUR para uso médio

    requirements:
      integrations:
        - name: "{Integration}"
          required: true
          setup_time: "10min"
      credentials:
        - "{Credential do cliente}"

  # Pricing (definido em price-product task)
  pricing: null  # será preenchido depois

  # Métricas de Sucesso
  success_metrics:
    - metric: "{Métrica}"
      target: "{valor}"
      measurement: "{como medir}"

  # Metadata
  metadata:
    created_at: "{timestamp}"
    created_by: "@product-engineer"
    workflow_version: "1.0.0"
```

### 4. Definir Features por Tier
```yaml
feature_matrix:
  starter:
    - "{feature básica 1}"
    - "{feature básica 2}"
    limits:
      - "{limite 1}"

  professional:
    - "Tudo do Starter +"
    - "{feature avançada 1}"
    - "{feature avançada 2}"
    limits:
      - "{limite maior}"

  enterprise:
    - "Tudo do Professional +"
    - "{feature enterprise}"
    - "Customizações"
    - "Suporte dedicado"
    limits: "Ilimitado"
```

### 5. Validar Viabilidade
```
□ Workflow funciona confiavelmente?
□ Custos permitem margem > 65%?
□ Setup time < 1 hora?
□ Suporte é gerenciável?
□ Existe demanda de mercado?
```

### 6. Registrar no Catálogo
Adicionar em `data/product-catalog.yaml`:
```yaml
products:
  - id: "{product_id}"
    name: "{name}"
    category: "{category}"
    status: "development"
    # ... resto do spec
```

### 7. Criar Estrutura de Arquivos
```
squads/automation/products/{product-id}/
├── spec.yaml           # Product spec completo
├── README.md           # Overview do produto
├── setup-guide.md      # Guia de setup
├── workflow.json       # Workflow n8n
└── assets/             # Imagens, videos
```

## Output
```yaml
product_created:
  id: "{product_id}"
  name: "{name}"
  category: "{category}"
  status: "development"
  next_steps:
    - "Define pricing (price-product task)"
    - "Create documentation (document-product task)"
    - "Beta testing"
```

## Handover
```yaml
handover:
  from_agent: "product-engineer"
  to_agent: "automation-lead"
  artifact_type: "product_spec"
  next_actions:
    - "Review product spec"
    - "Approve for pricing"
```

## Quality Gate
- [ ] Product spec completo
- [ ] Proposta de valor clara
- [ ] Features definidas por tier
- [ ] Custos calculados
- [ ] Viabilidade validada
- [ ] Registrado no catálogo
