# Template: Offer Stack

## Estrutura Visual do Value Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    TUDO QUE VOCÊ RECEBE                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  📦 PRODUTO PRINCIPAL                                │    │
│  │  {{product.name}}                                    │    │
│  │  {{product.description}}                             │    │
│  │                                            Valor: {{value}}│
│  └─────────────────────────────────────────────────────┘    │
│                            +                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  🎁 BÔNUS #1: {{bonus1.name}}                        │    │
│  │  {{bonus1.description}}                              │    │
│  │                                            Valor: {{value}}│
│  └─────────────────────────────────────────────────────┘    │
│                            +                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  🎁 BÔNUS #2: {{bonus2.name}}                        │    │
│  │  {{bonus2.description}}                              │    │
│  │                                            Valor: {{value}}│
│  └─────────────────────────────────────────────────────┘    │
│                            +                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  🎁 BÔNUS #3: {{bonus3.name}}                        │    │
│  │  {{bonus3.description}}                              │    │
│  │                                            Valor: {{value}}│
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│         VALOR TOTAL: ~~{{total_value}}~~                     │
│                                                              │
│         HOJE POR APENAS:                                     │
│         ████████████████████████████                         │
│         █  {{offer_price}}  █                                │
│         ████████████████████████████                         │
│                                                              │
│         ou {{installments}}                                  │
│                                                              │
│         [    {{cta_text}}    ]                               │
│                                                              │
│         🔒 Pagamento 100% Seguro                             │
│         ✅ Garantia de {{guarantee_days}} dias               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Componentes do Stack

### Produto Principal
```yaml
main_product:
  name: ""
  tagline: ""
  description: ""
  includes:
    - ""
  value: ""
  icon: "📦"
```

### Bônus Estratégicos

#### Tipo 1: Acelerador
```yaml
accelerator_bonus:
  name: ""
  purpose: "Acelerar resultado principal"
  description: ""
  value: ""
  icon: "🚀"
```

#### Tipo 2: Eliminador de Objeção
```yaml
objection_crusher:
  name: ""
  objection_addressed: ""
  description: ""
  value: ""
  icon: "🛡️"
```

#### Tipo 3: Amplificador de Valor
```yaml
value_amplifier:
  name: ""
  complementary_benefit: ""
  description: ""
  value: ""
  icon: "💎"
```

#### Tipo 4: FOMO Creator
```yaml
fomo_bonus:
  name: ""
  scarcity_reason: ""
  description: ""
  value: ""
  limited: true
  icon: "⚡"
```

---

## Precificação Estratégica

### Fórmula de Ancoragem
```
Valor Total do Stack = 10x a 15x do Preço da Oferta

Exemplo:
- Produto Principal: R$ 2.997
- Bônus 1: R$ 497
- Bônus 2: R$ 397
- Bônus 3: R$ 297
- Bônus 4: R$ 197
─────────────────────
Valor Total: R$ 4.385

Preço da Oferta: R$ 297-497 (10-15x inferior)
```

### Apresentação de Preço
```markdown
De ~~R$ 4.385~~ por apenas:

# R$ 297

ou 12x de R$ 29,25

[QUERO GARANTIR MINHA VAGA]
```

---

## Garantia

### Template de Garantia
```yaml
guarantee:
  name: "Garantia [Nome Criativo]"
  type: "incondicional"  # incondicional, condicional, dupla
  duration: "30 dias"
  description: |
    Se você não ficar 100% satisfeito nos próximos {{duration}},
    basta enviar um email e devolvemos cada centavo.
    Sem perguntas. Sem burocracia.
  badge: "🛡️"
```

### Tipos de Garantia
1. **Incondicional:** Sem perguntas
2. **Condicional:** Com requisitos (implementar X)
3. **Dupla:** Dinheiro + Algo extra
4. **Tripla:** Dinheiro + Extra + Extra

---

## Urgência/Escarcity

### Tipos Éticos
```yaml
urgency:
  time_based:
    reason: "Turma fecha [data]"
    deadline: ""

  quantity_based:
    reason: "Apenas [X] vagas"
    remaining: ""

  bonus_based:
    reason: "Bônus [X] só até [data]"
    expires: ""

  price_based:
    reason: "Preço promocional até [data]"
    normal_price: ""
```

---

## CTA Variations

```yaml
cta_options:
  primary:
    - "QUERO COMEÇAR AGORA"
    - "GARANTIR MINHA VAGA"
    - "SIM, QUERO ACESSO"
    - "COMEÇAR MINHA TRANSFORMAÇÃO"

  with_urgency:
    - "APROVEITAR OFERTA ESPECIAL"
    - "GARANTIR MEUS BÔNUS"
    - "ENTRAR ANTES DO FECHAMENTO"
```
