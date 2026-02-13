# Task: Price Product

## Metadata
```yaml
task_id: price-product
agent: product-engineer
priority: P1
estimated_time: 1-2h
inputs:
  - product_id: string (required)
  - product_spec: yaml (required)
outputs:
  - pricing_strategy: yaml
  - price_points: object
```

## Objetivo
Definir estratégia de pricing para produto de automação.

## Steps

### 1. Analisar Custos
```yaml
cost_analysis:
  # Custos variáveis (por execução)
  variable_costs:
    ai_tokens: {value}  # EUR per run
    api_calls: {value}  # EUR per run
    compute: {value}    # EUR per run
    total_per_run: {sum}

  # Custos fixos (por cliente/mês)
  fixed_costs:
    support_allocation: {value}  # EUR/month
    infrastructure: {value}      # EUR/month
    total_fixed: {sum}

  # Estimativa de uso
  usage_estimate:
    runs_per_month_low: {n}
    runs_per_month_avg: {n}
    runs_per_month_high: {n}
```

### 2. Calcular Break-even
```
Custo mensal = Fixed + (Variable × Runs)

Exemplo:
- Fixed: €10
- Variable: €0.05/run
- Runs médio: 500/mês

Custo = €10 + (€0.05 × 500) = €35/mês
Break-even price (65% margin) = €35 / 0.35 = €100/mês
```

### 3. Pesquisar Mercado
```
□ Preço de competidores diretos
□ Preço de alternativas (manual, outras tools)
□ Willingness-to-pay do ICP
□ Valor percebido vs custo
```

### 4. Escolher Modelo de Pricing

| Modelo | Quando Usar | Pros | Cons |
|--------|-------------|------|------|
| **Flat** | Uso previsível | Simples | Não escala |
| **Tiered** | Segmentos diferentes | Flexível | Complexo |
| **Usage** | Uso variável | Justo | Imprevisível |
| **Percentage** | Atrelado a resultado | Alinhado | Difícil medir |

### 5. Definir Tiers (se Tiered)
```yaml
pricing:
  model: "tiered"
  currency: "EUR"
  billing: "monthly"

  tiers:
    - name: "Starter"
      price: {value}
      target: "Small business, testing"
      features:
        - "{feature 1}"
        - "{feature 2}"
      limits:
        runs_per_month: {n}
        {other_limit}: {value}
      margin_target: 70%

    - name: "Professional"
      price: {value}
      target: "Growing business"
      features:
        - "Tudo do Starter +"
        - "{feature adicional}"
      limits:
        runs_per_month: {n}
      margin_target: 75%

    - name: "Enterprise"
      price: {value}  # ou "custom"
      target: "Large business"
      features:
        - "Tudo do Professional +"
        - "Customizações"
        - "Suporte dedicado"
      limits: "Ilimitado"
      margin_target: 80%
```

### 6. Definir Pricing Alternativo (se Usage/Percentage)
```yaml
# Usage-based
pricing:
  model: "usage"
  base_fee: 47  # EUR/month
  per_unit: 0.10  # EUR
  unit: "run"  # ou "contact", "review", etc

# Percentage-based
pricing:
  model: "percentage"
  base_fee: 97  # EUR/month
  percentage: 5  # % do resultado
  measurement: "recovered_revenue"
```

### 7. Calcular Margens
```yaml
margin_analysis:
  starter:
    price: {price}
    estimated_cost: {cost}
    margin: {margin}%

  professional:
    price: {price}
    estimated_cost: {cost}
    margin: {margin}%
```

**Margem mínima target: 65%**

### 8. Definir Estratégia de Upsell
```yaml
upsell_path:
  starter_to_professional:
    trigger: "{quando sugerir}"
    message: "{pitch}"
    discount: "{se aplicável}"

  professional_to_enterprise:
    trigger: "{quando sugerir}"
    message: "{pitch}"
```

### 9. Atualizar Product Spec
Adicionar pricing ao spec do produto:
```yaml
# Em products/{product-id}/spec.yaml
pricing:
  model: "{model}"
  currency: "EUR"
  billing: "monthly"
  tiers:
    # ... definição completa
```

### 10. Validar Pricing
```
□ Margens > 65% em todos os tiers?
□ Preço competitivo vs mercado?
□ Valor percebido > preço?
□ Upsell path claro?
□ Escalabilidade garantida?
```

## Pricing Matrix Reference

| Complexidade | Preço Base Sugerido | Margem Target |
|--------------|---------------------|---------------|
| Simple (1-5 nodes) | €47-97 | 80% |
| Medium (6-15 nodes) | €97-197 | 75% |
| Complex (15+ nodes, AI) | €197-497 | 70% |
| Enterprise/Custom | €497+ | 65%+ |

## Output
```yaml
pricing_defined:
  product_id: "{id}"
  model: "{model}"
  tiers:
    starter: €{price}
    professional: €{price}
    enterprise: €{price}
  average_margin: {value}%
  approved: pending
```

## Quality Gate
- [ ] Custos calculados corretamente
- [ ] Margem > 65% em todos os tiers
- [ ] Preço validado vs mercado
- [ ] Upsell path definido
- [ ] Documentado no spec
