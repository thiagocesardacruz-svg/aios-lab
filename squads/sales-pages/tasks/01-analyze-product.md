# Task: Analyze Product

## Metadata
- **ID:** analyze-product
- **Agent:** offer-architect
- **Phase:** Discovery
- **Duration:** 15-30 min

## Objective
Analisar profundamente o produto digital para extrair pontos de valor, diferenciais e oportunidades de posicionamento.

## Inputs
```yaml
required:
  - product_name: Nome do produto
  - product_type: Tipo (curso, ebook, software, mentoria, etc.)
  - product_description: Descrição do produto

optional:
  - existing_materials: Links para materiais existentes
  - competitor_urls: URLs de concorrentes
  - target_price: Faixa de preço desejada
```

## Steps

### 1. Product Decomposition
Extrair componentes do produto:
- Módulos/Capítulos/Funcionalidades
- Formato de entrega
- Tempo de consumo
- Nível de complexidade

### 2. Value Identification
Identificar fontes de valor:
- Transformação prometida
- Problema que resolve
- Dor que elimina
- Resultado que entrega

### 3. Differentiation Analysis
Mapear diferenciais:
- Método único
- Credenciais do criador
- Resultados comprovados
- Elementos exclusivos

### 4. Market Position
Definir posicionamento:
- Categoria de mercado
- Faixa de preço
- Público-alvo primário
- Momento de compra ideal

## Outputs
```yaml
product_analysis:
  core_value_proposition: ""
  primary_transformation: ""
  key_differentiators: []
  target_audience: ""
  price_positioning: ""
  unique_mechanism: ""
```

## Success Criteria
- [ ] Proposta de valor clara e única
- [ ] Transformação principal definida
- [ ] Mínimo 3 diferenciais identificados
- [ ] Público-alvo específico
