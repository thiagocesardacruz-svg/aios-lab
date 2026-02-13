# Task: Create Proof

## Metadata
- **ID:** create-proof
- **Agent:** conversion-optimizer
- **Phase:** Creation
- **Duration:** 30-45 min
- **Depends On:** write-copy

## Objective
Desenvolver e estruturar elementos de prova social e credibilidade para a página.

## Inputs
```yaml
required:
  - avatar: Output de define-avatar
  - page_copy: Output de write-copy

optional:
  - existing_testimonials: Depoimentos existentes
  - case_studies: Estudos de caso
  - media_mentions: Menções na mídia
  - certifications: Certificações/Credenciais
```

## Proof Types

### 1. Testimonials
```yaml
testimonial_template:
  name: ""
  photo: ""  # placeholder
  location: ""
  role: ""
  before_state: ""
  after_state: ""
  specific_result: ""
  quote: ""
  rating: 5
```

**Guidelines:**
- Resultados específicos e mensuráveis
- Identificação clara (nome, foto, cidade)
- Conexão com avatar
- Objeções que superam

### 2. Case Studies
```yaml
case_study_template:
  title: ""
  subject: ""
  challenge: ""
  solution_applied: ""
  results:
    - metric: ""
      before: ""
      after: ""
  timeline: ""
  quote: ""
```

### 3. Statistics & Numbers
```yaml
stats:
  - metric: "Alunos"
    value: ""
    context: ""
  - metric: "Taxa de Conclusão"
    value: ""
    context: ""
  - metric: "Nota Média"
    value: ""
    context: ""
```

### 4. Authority Indicators
```yaml
authority:
  credentials:
    - type: ""
      description: ""
  media_mentions:
    - outlet: ""
      description: ""
  partnerships:
    - partner: ""
      logo: ""
  certifications:
    - name: ""
      issuer: ""
```

### 5. Trust Badges
```yaml
trust_elements:
  security:
    - "Pagamento Seguro"
    - "Dados Protegidos"
    - "SSL Certificado"
  guarantees:
    - "Garantia de X Dias"
    - "Satisfação Garantida"
  payment:
    - "Cartão de Crédito"
    - "PIX"
    - "Boleto"
```

## Proof Placement Strategy

| Section | Proof Type | Purpose |
|---------|------------|---------|
| Above Fold | Micro-stat | Credibilidade imediata |
| After Problem | Testimonial | "Eu também estava assim" |
| After Solution | Case Study | "E consegui resultado" |
| Before CTA | Stats + Badges | Eliminar dúvida |
| Final CTA | Garantia visual | Remover risco |

## Proof Writing Guidelines

### Testimonial Copy
1. Resultado específico primeiro
2. Situação anterior (dor)
3. Transformação (processo)
4. Estado atual (resultado)
5. Recomendação

### Numbers Formatting
- Use contrastes: "De X para Y"
- Seja específico: "47%" não "quase 50%"
- Contextualize: "em apenas 30 dias"

## Outputs
```yaml
proof_package:
  testimonials:
    - {}
  case_studies:
    - {}
  statistics: []
  authority_elements: []
  trust_badges: []
  placement_map: {}
```

## Success Criteria
- [ ] Mínimo 3 depoimentos formatados
- [ ] 1 case study detalhado
- [ ] 3-5 estatísticas de impacto
- [ ] Elementos de autoridade
- [ ] Trust badges selecionados
- [ ] Mapa de posicionamento
