# Task: Write Headlines

## Metadata
- **ID:** write-headlines
- **Agent:** copy-chief
- **Phase:** Creation
- **Duration:** 30-45 min
- **Depends On:** define-avatar, structure-offer

## Objective
Criar conjunto de headlines magnéticas para a página de vendas, otimizadas para o nível de consciência do avatar.

## Inputs
```yaml
required:
  - avatar: Output de define-avatar
  - complete_offer: Output de structure-offer
```

## Steps

### 1. Awareness Level Adaptation
Adaptar abordagem ao nível de consciência:

| Level | Focus | Style |
|-------|-------|-------|
| Unaware | Identidade | Provocativo |
| Problem Aware | Dor | Emocional |
| Solution Aware | Mecanismo | Educativo |
| Product Aware | Prova | Comparativo |
| Most Aware | Oferta | Direto |

### 2. Headline Formulas
Aplicar fórmulas clássicas:

**AIDA Headlines:**
- Attention → Interest → Desire → Action

**How To Headlines:**
- "Como [resultado] sem [obstáculo] em [tempo]"

**Question Headlines:**
- "Você comete esses [X] erros que [consequência negativa]?"

**News Headlines:**
- "Novo [método/descoberta] permite [resultado]"

**Command Headlines:**
- "Pare de [ação negativa] e comece a [resultado positivo]"

### 3. Generate Variations
Criar 10-15 headlines em categorias:

```yaml
headlines:
  primary:
    - headline: ""
      formula: ""
      target: ""

  benefit_focused:
    - headline: ""

  curiosity_driven:
    - headline: ""

  pain_point:
    - headline: ""

  social_proof:
    - headline: ""
```

### 4. Sub-headlines
Criar sub-headlines de suporte:
```yaml
sub_headlines:
  - pairs_with: "headline_id"
    text: ""
    purpose: ""  # clarify, amplify, qualify
```

### 5. Section Headlines
Headlines para seções da página:
- Problema
- Solução
- Método
- Prova Social
- Oferta
- Garantia
- CTA

## Outputs
```yaml
headline_package:
  primary_headline: ""
  primary_subheadline: ""
  variations: []
  section_headlines: {}
  recommended_for_testing: []
```

## Success Criteria
- [ ] Mínimo 10 variações de headline
- [ ] Adaptadas ao nível de consciência
- [ ] Sub-headlines de suporte
- [ ] Headlines para todas seções
- [ ] 3 recomendadas para teste A/B
