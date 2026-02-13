# Task: Assemble Page

## Metadata
- **ID:** assemble-page
- **Agent:** conversion-optimizer
- **Phase:** Assembly
- **Duration:** 45-60 min
- **Depends On:** design-layout

## Objective
Montar a página de vendas completa combinando copy, elementos visuais e estrutura.

## Inputs
```yaml
required:
  - page_copy: Output de write-copy
  - proof_package: Output de create-proof
  - layout_spec: Output de design-layout
  - headline_package: Output de write-headlines
  - complete_offer: Output de structure-offer
```

## Assembly Process

### 1. Header Assembly
```html
<!-- Hero Section -->
<section class="hero">
  <h1>{{headline_package.primary_headline}}</h1>
  <p class="subheadline">{{headline_package.primary_subheadline}}</p>

  <div class="cta-group">
    <a class="btn-primary">{{complete_offer.cta_text}}</a>
  </div>

  <div class="trust-bar">
    <!-- micro proof -->
  </div>
</section>
```

### 2. Content Sections
Para cada seção, combinar:
- Copy da seção
- Headline da seção
- Elementos visuais
- CTAs quando apropriado

### 3. Proof Integration
```yaml
proof_integration:
  - location: "after_problem"
    type: "testimonial"
    content: "{{proof_package.testimonials[0]}}"

  - location: "after_solution"
    type: "case_study"
    content: "{{proof_package.case_studies[0]}}"

  - location: "before_offer"
    type: "stats"
    content: "{{proof_package.statistics}}"
```

### 4. Offer Section Assembly
```markdown
## Tudo Que Você Recebe:

{{#each complete_offer.value_stack}}
### {{component}}
{{description}}
**Valor: {{value}}**
{{/each}}

---

**Valor Total: {{complete_offer.total_value}}**

Por apenas **{{complete_offer.offer_price}}**

[{{complete_offer.cta_text}}]
```

### 5. Interactive Elements
```yaml
interactive:
  - element: "FAQ Accordion"
    behavior: "click to expand"

  - element: "Video Player"
    behavior: "autoplay muted optional"

  - element: "Countdown Timer"
    behavior: "real deadline or evergreen"

  - element: "Exit Intent"
    behavior: "optional popup"
```

### 6. Final Touches
- [ ] Verificar todos os links
- [ ] Placeholder para imagens
- [ ] Verificar consistência de CTAs
- [ ] Adicionar tracking placeholders
- [ ] PS final

## Output Format

### Markdown Version
```markdown
# Página de Vendas: {{product_name}}

---

## HERO SECTION
[copy aqui]

---

## PROBLEMA
[copy aqui]

...
```

### HTML Skeleton
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <title>{{headline}}</title>
</head>
<body>
  <!-- sections -->
</body>
</html>
```

## Outputs
```yaml
assembled_page:
  markdown_version: ""
  html_skeleton: ""
  image_placeholders: []
  tracking_points: []
  word_count: 0
  estimated_read_time: ""
```

## Success Criteria
- [ ] Página completa em markdown
- [ ] HTML skeleton gerado
- [ ] Todos elementos integrados
- [ ] Links e CTAs funcionais
- [ ] Placeholders documentados
