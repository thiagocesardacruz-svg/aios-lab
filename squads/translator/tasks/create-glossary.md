# Task: Create Glossary

## Identity
- **ID:** create-glossary
- **Squad:** translator
- **Type:** task

---

## Objective

Create a terminology glossary for a project or domain to ensure consistent translations.

---

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| domain | Yes | Domain/project name |
| source_content | No | Reference content to extract terms |
| languages | Yes | Target languages for glossary |
| existing_glossary | No | Existing glossary to extend |

---

## Process

### Step 1: Term Extraction
```markdown
- [ ] Analyze source content
- [ ] Identify key terms
- [ ] Identify brand terms
- [ ] Identify technical terms
- [ ] Note context for each term
```

### Step 2: Term Classification
```markdown
Categories:
- [ ] Brand terms (names, products)
- [ ] Technical terms (industry-specific)
- [ ] UI terms (buttons, labels)
- [ ] Marketing terms (calls to action)
- [ ] Legal terms (compliance, contracts)
```

### Step 3: Translation
```markdown
For each term:
- [ ] Research standard translation
- [ ] Check competitor usage
- [ ] Consider cultural implications
- [ ] Document alternatives
- [ ] Choose best translation
```

### Step 4: Documentation
```markdown
For each entry:
- [ ] Source term
- [ ] Definition/context
- [ ] Translation per language
- [ ] Usage examples
- [ ] Do not use alternatives
```

---

## Output Format

```yaml
# Glossary: [Domain Name]
# Version: 1.0.0
# Languages: [list]
# Created: [date]

metadata:
  domain: "[domain]"
  version: "1.0.0"
  languages: ["EN", "PT-BR", "ES"]
  last_updated: "[date]"

terms:
  - source: "checkout"
    definition: "The process of completing a purchase"
    category: "ui"
    translations:
      PT-BR: "finalizar compra"
      ES: "finalizar compra"
    do_not_use:
      PT-BR: ["checkout", "fechar pedido"]
      ES: ["checkout"]
    examples:
      EN: "Click checkout to complete your order"
      PT-BR: "Clique em finalizar compra para completar seu pedido"
    notes: "Never translate literally as 'check out'"

  - source: "[term]"
    definition: "[definition]"
    category: "[category]"
    translations:
      PT-BR: "[translation]"
      ES: "[translation]"
    do_not_use:
      PT-BR: ["[alternatives]"]
    examples:
      EN: "[example]"
    notes: "[notes]"
```

---

## Quality Criteria

- [ ] All key terms identified
- [ ] Context provided for each term
- [ ] All target languages covered
- [ ] Examples included
- [ ] Do not use alternatives documented
