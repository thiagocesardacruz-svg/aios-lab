# Task: Optimize Page

## Metadata
- **ID:** optimize-page
- **Agent:** conversion-optimizer
- **Phase:** Optimization
- **Duration:** 30-45 min
- **Depends On:** assemble-page

## Objective
Revisar e otimizar a página final para máxima conversão aplicando checklist de CRO.

## Inputs
```yaml
required:
  - assembled_page: Output de assemble-page
  - avatar: Output de define-avatar

optional:
  - competitor_pages: Páginas de concorrentes para benchmark
```

## Optimization Areas

### 1. Above The Fold Audit
```yaml
atf_checklist:
  - item: "Headline visível sem scroll"
    status: ""
    notes: ""

  - item: "Proposta de valor clara em 5 segundos"
    status: ""
    notes: ""

  - item: "CTA primário visível"
    status: ""
    notes: ""

  - item: "Prova social inicial"
    status: ""
    notes: ""

  - item: "Visual de suporte"
    status: ""
    notes: ""
```

### 2. Copy Optimization
```yaml
copy_audit:
  readability:
    flesch_score: ""  # Target: 60-70
    avg_sentence_length: ""  # Target: <20 words
    action: ""

  power_words:
    count: 0
    distribution: ""
    action: ""

  you_ratio:
    you_count: 0
    we_count: 0
    ratio: ""  # Target: 4:1

  benefit_feature_ratio:
    benefits: 0
    features: 0
    ratio: ""  # Target: 3:1
```

### 3. CTA Optimization
```yaml
cta_audit:
  - location: ""
    text: ""
    color: ""
    size: ""
    contrast: ""
    urgency: ""
    improvements: []
```

### 4. Trust Element Check
```yaml
trust_audit:
  testimonials:
    count: 0
    with_photos: 0
    with_results: 0
    action: ""

  guarantees:
    visible: ""
    prominent: ""
    action: ""

  security:
    badges_present: ""
    location: ""
    action: ""
```

### 5. Mobile Optimization
```yaml
mobile_audit:
  - check: "Tap targets adequados"
    status: ""

  - check: "Texto legível sem zoom"
    status: ""

  - check: "CTAs acessíveis"
    status: ""

  - check: "Imagens otimizadas"
    status: ""

  - check: "Formulário simplificado"
    status: ""
```

### 6. Speed & Technical
```yaml
technical_audit:
  - check: "Imagens comprimidas"
    recommendation: ""

  - check: "Scripts minimizados"
    recommendation: ""

  - check: "Lazy loading"
    recommendation: ""

  - check: "Critical CSS inline"
    recommendation: ""
```

### 7. A/B Test Recommendations
```yaml
ab_tests:
  - element: "Headline"
    variations:
      - control: ""
      - variation_a: ""
    hypothesis: ""

  - element: "CTA Text"
    variations:
      - control: ""
      - variation_a: ""
    hypothesis: ""

  - element: "Price Presentation"
    variations:
      - control: ""
      - variation_a: ""
    hypothesis: ""
```

## Optimization Actions

### Quick Wins
Melhorias de implementação imediata:
1.
2.
3.

### Medium Effort
Melhorias que requerem mais trabalho:
1.
2.
3.

### Future Tests
Testes para próximas iterações:
1.
2.
3.

## Outputs
```yaml
optimization_report:
  overall_score: "/100"
  quick_wins: []
  medium_effort_improvements: []
  ab_test_recommendations: []
  technical_recommendations: []
  final_page: ""
```

## Success Criteria
- [ ] Auditoria completa de todas as áreas
- [ ] Score de conversão calculado
- [ ] Mínimo 3 quick wins identificados
- [ ] Recomendações de A/B test
- [ ] Página final otimizada
