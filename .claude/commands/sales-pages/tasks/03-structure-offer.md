# Task: Structure Offer

## Metadata
- **ID:** structure-offer
- **Agent:** offer-architect
- **Phase:** Strategy
- **Duration:** 30-45 min
- **Depends On:** analyze-product, define-avatar

## Objective
Estruturar a oferta completa com value stack, bônus, garantia e estratégia de preço.

## Inputs
```yaml
required:
  - product_analysis: Output de analyze-product
  - avatar: Output de define-avatar

optional:
  - price_constraints: Limites de preço
  - bonus_assets: Bônus já existentes
```

## Steps

### 1. Core Offer Definition
```yaml
core_offer:
  product_name: ""
  headline: ""
  primary_benefit: ""
  delivery_format: ""
  access_duration: ""
```

### 2. Value Stack Design
Aplicar modelo Hormozi:
```yaml
value_stack:
  - component: "Produto Principal"
    description: ""
    value: "$X.XXX"

  - component: "Bônus 1"
    description: ""
    value: "$XXX"
    type: "accelerator"  # accelerator, objection-crusher, value-amplifier

  - component: "Bônus 2"
    description: ""
    value: "$XXX"
    type: ""
```

### 3. Bonus Strategy
Tipos de bônus a considerar:
- **Accelerators:** Aceleram resultado
- **Objection Crushers:** Eliminam objeções específicas
- **Value Amplifiers:** Aumentam valor percebido
- **FOMO Creators:** Criam urgência

### 4. Guarantee Architecture
```yaml
guarantee:
  type: ""  # money-back, results, conditional
  duration: ""
  conditions: []
  name: ""  # Nome criativo para garantia
```

### 5. Pricing Strategy
```yaml
pricing:
  anchor_price: ""  # Valor total do stack
  offer_price: ""   # Preço real
  savings: ""       # Economia destacada
  payment_options:
    - full: ""
    - installments: ""
  price_justification: ""
```

### 6. Urgency/Scarcity
```yaml
urgency:
  type: ""  # time-based, quantity-based, bonus-based
  deadline: ""
  reason: ""  # Justificativa real
```

## Outputs
```yaml
complete_offer:
  name: ""
  headline: ""
  value_stack: []
  total_value: ""
  offer_price: ""
  guarantee: {}
  urgency: {}
  cta_text: ""
```

## Success Criteria
- [ ] Value stack com mínimo 3 componentes
- [ ] Valor total > 10x preço da oferta
- [ ] Garantia definida e nomeada
- [ ] Urgência com justificativa real
- [ ] CTA principal definido
