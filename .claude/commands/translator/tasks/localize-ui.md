# Task: Localize UI

## Identity
- **ID:** localize-ui
- **Squad:** translator
- **Type:** task

---

## Objective

Localize user interface strings for software applications, considering character limits, context, and platform conventions.

---

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| ui_strings | Yes | UI strings to localize (JSON/YAML) |
| target_language | Yes | Target language code |
| platform | No | web, ios, android, desktop |
| max_expansion | No | Max character expansion % (default: 30%) |

---

## UI Localization Principles

### 1. Brevity
```
UI space is limited. Shorter is better.

EN: "Submit" (6 chars)
PT-BR: "Enviar" (6 chars) ✓
PT-BR: "Submeter formulario" (19 chars) ✗
```

### 2. Context Awareness
```
Same word, different context:

"Save" (document) → "Salvar"
"Save" (money) → "Economizar"
"Save" (rescue) → "Salvar/Resgatar"
```

### 3. Platform Conventions
```
iOS: "Settings" → "Ajustes" (PT-BR)
Android: "Settings" → "Configuracoes" (PT-BR)
```

### 4. Placeholder Handling
```
"Hello, {name}!" → "Ola, {name}!"
"{count} items" → "{count} itens"
```

---

## Text Expansion Guide

| Source Length | Expected Expansion |
|---------------|-------------------|
| 1-10 chars | Up to 200% |
| 11-20 chars | Up to 80% |
| 21-30 chars | Up to 60% |
| 31-50 chars | Up to 40% |
| 51-70 chars | Up to 30% |
| 70+ chars | Up to 20% |

---

## Process

### Step 1: String Analysis
```markdown
- [ ] Import string file
- [ ] Identify string types (labels, buttons, messages, errors)
- [ ] Note character limits
- [ ] Identify placeholders
- [ ] Check for concatenated strings
```

### Step 2: Context Gathering
```markdown
- [ ] Request screenshots if unclear
- [ ] Understand UI flow
- [ ] Note gender/plural requirements
- [ ] Identify related strings
```

### Step 3: Translation
```markdown
- [ ] Translate maintaining brevity
- [ ] Preserve placeholders exactly
- [ ] Follow platform conventions
- [ ] Check character limits
- [ ] Handle pluralization
```

### Step 4: Validation
```markdown
- [ ] All strings translated
- [ ] Placeholders intact
- [ ] Character limits respected
- [ ] Terminology consistent
- [ ] Grammar correct
```

---

## Output Format

```json
{
  "metadata": {
    "source_language": "EN",
    "target_language": "PT-BR",
    "platform": "web",
    "string_count": 50,
    "translated_by": "translator-squad"
  },
  "strings": {
    "btn_submit": {
      "source": "Submit",
      "translation": "Enviar",
      "context": "Form submission button",
      "max_length": 10
    },
    "msg_welcome": {
      "source": "Welcome, {name}!",
      "translation": "Bem-vindo, {name}!",
      "context": "User greeting",
      "placeholders": ["name"]
    },
    "error_required": {
      "source": "This field is required",
      "translation": "Este campo e obrigatorio",
      "context": "Form validation error"
    }
  },
  "notes": [
    "String 'btn_cancel' kept short due to button width",
    "Placeholder {count} requires plural handling"
  ]
}
```

---

## Quality Criteria

- [ ] All strings translated
- [ ] Placeholders preserved exactly
- [ ] Character limits respected
- [ ] Platform conventions followed
- [ ] Consistent terminology
- [ ] Natural UI language
