# Template: Sales Page

## Metadata
- **Type:** Long-form Sales Page
- **Avg Words:** 2500-4000
- **Sections:** 9

---

# {{product.name}}

## HERO SECTION

### {{headline.primary}}

{{headline.subheadline}}

[{{offer.cta_text}}]({{offer.checkout_url}})

**{{proof.micro_stat}}**

---

## O PROBLEMA

{{#if avatar.story}}
{{avatar.story}}
{{/if}}

Você já se sentiu assim?

{{#each avatar.pains}}
- {{this}}
{{/each}}

E o pior é que você já tentou de tudo:

{{#each avatar.failed_solutions}}
- {{this}}
{{/each}}

Mas não funcionou porque...

{{copy.problem_agitation}}

---

## A SOLUÇÃO

### {{headline.solution}}

{{copy.solution_intro}}

Apresentando: **{{product.name}}**

{{product.description}}

#### Por que funciona:

{{#each product.unique_mechanisms}}
**{{this.name}}:** {{this.description}}
{{/each}}

---

## O QUE VOCÊ VAI RECEBER

{{#each product.modules}}

### Módulo {{@index}}: {{this.name}}

{{this.description}}

**O que você vai aprender:**
{{#each this.lessons}}
- {{this}}
{{/each}}

**Resultado:** {{this.outcome}}

{{/each}}

---

## RESULTADOS REAIS

{{#each proof.testimonials}}

> "{{this.quote}}"

**{{this.name}}** - {{this.location}}
{{this.result}}

---

{{/each}}

### Números que falam:

{{#each proof.statistics}}
- **{{this.value}}** {{this.description}}
{{/each}}

---

## SUA OFERTA ESPECIAL

### Tudo que você recebe hoje:

| Item | Valor |
|------|-------|
{{#each offer.value_stack}}
| {{this.name}} | {{this.value}} |
{{/each}}
| **TOTAL** | **{{offer.total_value}}** |

### Seu investimento hoje:

~~{{offer.anchor_price}}~~

**Apenas {{offer.price}}**

{{#if offer.installments}}
ou {{offer.installments}}
{{/if}}

[{{offer.cta_text}}]({{offer.checkout_url}})

---

## GARANTIA {{guarantee.name}}

{{guarantee.badge}}

{{guarantee.description}}

Você tem **{{guarantee.duration}}** para testar.

Se não gostar, devolvemos 100% do seu investimento.

Sem perguntas. Sem burocracia.

---

## PERGUNTAS FREQUENTES

{{#each faq}}

<details>
<summary>{{this.question}}</summary>

{{this.answer}}

</details>

{{/each}}

---

## ÚLTIMA CHANCE

{{headline.final}}

{{copy.final_recap}}

{{#if urgency.active}}
**{{urgency.message}}**
{{/if}}

[{{offer.cta_text}}]({{offer.checkout_url}})

---

**P.S.:** {{copy.ps}}

---

{{footer}}
