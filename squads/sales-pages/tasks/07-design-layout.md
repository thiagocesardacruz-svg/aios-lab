# Task: Design Layout

## Metadata
- **ID:** design-layout
- **Agent:** conversion-optimizer
- **Phase:** Assembly
- **Duration:** 45-60 min
- **Depends On:** write-copy, create-proof

## Objective
Criar o layout estruturado da página de vendas otimizado para conversão.

## Inputs
```yaml
required:
  - page_copy: Output de write-copy
  - proof_package: Output de create-proof
  - complete_offer: Output de structure-offer
```

## Layout Principles

### 1. Visual Hierarchy
```
F-Pattern para Long-form:
┌─────────────────────────────────┐
│ HEADLINE ══════════════════════ │  ← Scan horizontal
│ Sub-headline ───────────────    │
│ │                               │  ← Scan vertical
│ │ Content                       │
│ │                               │
│ │ ▶ CTA                         │
│ │                               │
└─────────────────────────────────┘
```

### 2. Section Flow
```yaml
sections:
  1_hero:
    width: "full"
    bg: "primary"
    elements:
      - headline
      - subheadline
      - cta
      - trust_indicator

  2_problem:
    width: "content"
    bg: "light"
    elements:
      - story
      - pain_points
      - transition

  3_solution:
    width: "content"
    bg: "white"
    elements:
      - mechanism
      - benefits
      - mini_proof

  4_product:
    width: "full"
    bg: "gradient"
    elements:
      - modules
      - features
      - visuals

  5_proof:
    width: "content"
    bg: "light"
    elements:
      - testimonials
      - case_study
      - stats

  6_offer:
    width: "full"
    bg: "primary"
    elements:
      - stack
      - price
      - cta

  7_guarantee:
    width: "content"
    bg: "trust"
    elements:
      - badge
      - explanation
      - reinforcement

  8_faq:
    width: "content"
    bg: "white"
    elements:
      - accordion
      - final_objection

  9_final:
    width: "full"
    bg: "urgency"
    elements:
      - recap
      - scarcity
      - cta
      - ps
```

### 3. CTA Placement Strategy
```yaml
cta_positions:
  - section: "hero"
    type: "primary"
    visibility: "always"

  - section: "after_solution"
    type: "secondary"
    visibility: "scroll"

  - section: "offer"
    type: "primary"
    visibility: "prominent"

  - section: "final"
    type: "primary"
    visibility: "sticky_option"
```

### 4. Mobile Considerations
```yaml
mobile:
  - single_column: true
  - touch_targets: "44px min"
  - font_size: "16px base"
  - cta_fixed: "optional"
  - accordion_faq: true
  - collapsible_sections: false
```

### 5. Visual Elements Spec
```yaml
visuals:
  hero_image:
    type: ""  # product mockup, person, abstract
    position: ""

  section_images:
    - section: ""
      type: ""
      purpose: ""

  icons:
    style: ""  # filled, outline, duotone
    color: ""

  colors:
    primary: ""
    secondary: ""
    accent: ""
    trust: ""
    urgency: ""
```

## Wireframe Output

### Desktop Wireframe
```
┌────────────────────────────────────────┐
│            [LOGO]           [NAV?]     │
├────────────────────────────────────────┤
│                                        │
│    HEADLINE PRINCIPAL                  │
│    Sub-headline de suporte             │
│                                        │
│    [  BOTÃO CTA PRINCIPAL  ]           │
│                                        │
│    ★★★★★ "X mil alunos"               │
├────────────────────────────────────────┤
│                                        │
│    📌 PROBLEMA / IDENTIFICAÇÃO         │
│                                        │
├────────────────────────────────────────┤
...
```

## Outputs
```yaml
layout_spec:
  wireframe: ""
  section_order: []
  cta_placements: []
  visual_elements: {}
  mobile_adaptations: {}
  color_scheme: {}
  typography: {}
```

## Success Criteria
- [ ] Wireframe de cada seção
- [ ] Hierarquia visual clara
- [ ] CTAs estrategicamente posicionados
- [ ] Adaptações mobile definidas
- [ ] Especificação de cores e tipografia
