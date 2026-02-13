# Task: Define Avatar

## Metadata
- **ID:** define-avatar
- **Agent:** copy-chief
- **Phase:** Discovery
- **Duration:** 20-40 min
- **Depends On:** analyze-product

## Objective
Criar um avatar detalhado do cliente ideal, mapeando dores, desejos, objeções e linguagem.

## Inputs
```yaml
required:
  - product_analysis: Output da task anterior

optional:
  - customer_interviews: Transcrições de entrevistas
  - reviews: Avaliações de produtos similares
  - social_comments: Comentários de redes sociais
```

## Steps

### 1. Demographic Profile
```yaml
demographics:
  age_range: ""
  gender: ""
  location: ""
  income_level: ""
  education: ""
  occupation: ""
```

### 2. Psychographic Mapping
```yaml
psychographics:
  values: []
  beliefs: []
  aspirations: []
  fears: []
  frustrations: []
```

### 3. Pain Point Excavation
Aplicar técnica "5 Whys" para cada dor:
- Dor superficial → Por quê?
- Dor intermediária → Por quê?
- Dor profunda → Por quê?
- Dor emocional → Por quê?
- Dor raiz → Core desire

### 4. Desire Amplification
Mapear desejos em 3 níveis:
- **Have:** O que querem TER
- **Do:** O que querem FAZER
- **Be:** Quem querem SER

### 5. Objection Inventory
Listar objeções por categoria:
- Preço
- Tempo
- Credibilidade
- Aplicabilidade
- Timing

### 6. Language Extraction
Coletar vocabulário do avatar:
- Frases que usam
- Gírias e expressões
- Como descrevem o problema
- Como descrevem o resultado desejado

## Outputs
```yaml
avatar:
  name: "Nome fictício"
  tagline: "Frase que resume"
  demographics: {}
  pains: []
  desires: []
  objections: []
  language_patterns: []
  awareness_level: ""  # Unaware, Problem, Solution, Product, Most Aware
```

## Success Criteria
- [ ] Avatar com nome e tagline
- [ ] Mínimo 5 dores mapeadas
- [ ] Mínimo 5 desejos identificados
- [ ] Objeções principais listadas
- [ ] Nível de consciência definido
