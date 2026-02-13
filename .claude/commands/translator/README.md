# Translator Squad

> Translation & Localization for Multilingual Products

| Aspecto | Valor |
|---------|-------|
| **Versao** | 1.1.0 |
| **Dominio** | localization |
| **Prefixo** | `/translate` |
| **Entry Point** | translation-lead |

---

## Overview

The Translator Squad handles all multilingual needs for Travel Tech Digital:

- Content translation (marketing, technical, legal, UI)
- Cultural localization and adaptation
- Terminology consistency via glossaries
- Translation quality review
- Multi-language support (7 languages)

---

## Architecture

```
TIER 0 — LEAD
  translation-lead (Lingua)    Coordination, standards, quality

TIER 1 — TRANSLATORS
  translators (Polyglot)       Language specialists (7 languages)

TIER 2 — SPECIALIST
  localization-specialist      Cultural adaptation, market fit
  (Local)
```

---

## Agents

| Agent | Name | Role | Focus |
|-------|------|------|-------|
| translation-lead | Lingua | Lead | Coordination, glossaries, QA |
| translators | Polyglot | Translators | EN, PT-BR, ES, FR, DE, IT, AR |
| localization-specialist | Local | Localization | Cultural adaptation |

---

## Languages

### Primary
| Code | Language | Role |
|------|----------|------|
| EN | English | Source language |
| PT-BR | Portuguese (Brazil) | Primary target |
| ES | Spanish (Latin America) | Primary target |

### Secondary
| Code | Language | Notes |
|------|----------|-------|
| FR | French | Marketing, hospitality |
| DE | German | Technical, legal |
| IT | Italian | Marketing, hospitality |
| AR | Arabic | RTL support |

---

## Commands

| Command | Description | Type |
|---------|-------------|------|
| `/translate/localize` | Full localization pipeline | workflow |
| `/translate/translate` | Translate document | task |
| `/translate/batch` | Batch translation | workflow |
| `/translate/ui` | Localize UI strings | task |
| `/translate/review` | Review translation quality | workflow |
| `/translate/glossary` | Create glossary | task |
| `/translate/glossary-update` | Update glossary | workflow |

---

## Translation Principles

1. **Meaning Over Words** - Translate concepts, not literal words
2. **Tone Preservation** - Maintain emotional impact
3. **Cultural Adaptation** - Adapt idioms, references, examples
4. **Terminology Consistency** - Use glossary terms
5. **Native Quality** - Should feel written by native speaker

---

## Process

```
Source Content
      ↓
  Analysis (identify type, terms, cultural refs)
      ↓
  Translation (glossary-guided)
      ↓
  Localization (cultural adaptation)
      ↓
  Quality Review
      ↓
Localized Content + Glossary Updates
```

---

## Content Types

| Type | Tone | Priority |
|------|------|----------|
| Marketing | Persuasive, engaging | Impact |
| Technical | Clear, precise | Accuracy |
| Legal | Formal, unambiguous | Legal accuracy |
| UI | Concise, action-oriented | Brevity |
| Support | Friendly, helpful | Clarity |

---

## Quality Metrics

| Metric | Target |
|--------|--------|
| Accuracy | 100% meaning preserved |
| Fluency | Natural in target language |
| Terminology | 100% glossary compliance |
| Cultural fit | Appropriate for market |

---

## Directory Structure

```
squads/translator/
├── squad.yaml                    # AIOS 2.1.0 manifest
├── README.md                     # This file
├── agents/
│   ├── translation-lead.md       # Lead/coordinator
│   ├── translators.md            # Language specialists
│   └── localization-specialist.md # Cultural adaptation
├── tasks/
│   ├── translate-document.md     # Document translation
│   ├── review-translation.md     # Quality review
│   ├── create-glossary.md        # Glossary creation
│   └── localize-ui.md            # UI string localization
├── workflows/
│   ├── localize-content.yaml     # Full localization pipeline
│   ├── translate-batch.yaml      # Batch translation
│   ├── review.yaml               # Quality review
│   └── glossary-update.yaml      # Glossary maintenance
├── templates/
│   ├── translation-brief-tmpl.md # Project brief
│   ├── glossary-entry-tmpl.md    # Glossary entry
│   └── review-report-tmpl.md     # Review report
├── checklists/
│   ├── translation-quality-checklist.md
│   └── localization-checklist.md
└── data/
    ├── glossary-pt-br.yaml       # PT-BR terminology
    ├── glossary-es.yaml          # ES terminology
    └── style-guides.yaml         # Style guidelines
```

---

## Components Summary

| Component | Count |
|-----------|-------|
| Agents | 3 |
| Tasks | 4 |
| Workflows | 4 |
| Templates | 3 |
| Checklists | 2 |
| Data files | 3 |
| **Total** | **19 files** |

---

## Quick Start

**Translate a document:**
```
@translation-lead
Translate this marketing copy to PT-BR:
"Transform your business with our AI-powered solution"
```

**Full localization:**
```
/translate/localize
Content: [your content]
Target: PT-BR, ES
Type: marketing
```

**Review existing translation:**
```
/translate/review
Original: [EN text]
Translation: [PT-BR text]
```

---

## Integration

The Translator Squad integrates with:
- **Marketing Squad** - Campaign localization
- **Hotel-MKT Squad** - Hospitality content
- **Customer Squad** - Support content
- **Tech Squad** - UI/documentation

---

*AIOS 2.1.0 | translator v1.1.0 | 3 agents | 4 workflows | 7 languages | 19 files*
