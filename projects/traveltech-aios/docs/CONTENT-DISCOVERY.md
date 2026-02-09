# TravelTech AIOS - Content Discovery Report

> **Date:** 2026-02-09
> **Source:** C:\Users\thiag\workspace\projects\traveltech-digital\products
> **Status:** Discovery Complete

---

## 📊 Content Inventory Summary

| Content Type | Count | Format | Languages |
|-------------|-------|--------|-----------|
| **GPT Experts** | 68 | Markdown | EN (base) |
| **Prompts** | 1,697 | Markdown | EN (base) |
| **GPT Tools** | 98 | Markdown | EN (base) |
| **Expert Icons** | 68 | JPG | N/A |
| **Localized Prompts** | ~1,500 | CSV | DE, ES, FR, IT, PT-BR |

**Total Content Pieces:** ~3,400+

---

## 📁 Source Structure

```
products/
├── gpt-teams/                    # 68 GPT Experts
│   ├── branding-and-content/
│   ├── customer-service/
│   ├── finance/
│   ├── hr/
│   ├── leadership-and-strategy/
│   ├── sales/
│   ├── sustainability/
│   ├── technology/
│   ├── travel-experts/           # Main tourism experts
│   └── travel-marketing/
│
├── prompt-packs/                 # 1,697 Prompts by segment
│   ├── attractions/
│   ├── holiday-rentals/
│   ├── hotels/
│   ├── resorts/
│   ├── tour-guides/
│   ├── tourism-associations/
│   ├── tourism-observatory/
│   ├── tour-operators/           # DMC/DMO content
│   └── travel-agencies/
│
├── gpt-tools/                    # 98 Tools by category
│   ├── associations/
│   ├── attractions/
│   ├── content-and-copywriting/
│   ├── customer-service/
│   ├── data-analysis/
│   ├── destinations/
│   ├── digital-marketing/
│   ├── finance/
│   ├── hospitality/
│   ├── management/
│   ├── sales-and-commercial/
│   ├── team-development/
│   └── travel-packages/
│
├── gpt-experts-icons/            # 68 humanized avatars
│
├── deep-research-localized/      # Translated prompts
│   ├── LOCALIZED_DE_*.csv        # German
│   ├── LOCALIZED_ES_*.csv        # Spanish
│   ├── LOCALIZED_FR_*.csv        # French
│   ├── LOCALIZED_IT_*.csv        # Italian
│   └── LOCALIZED_PT-BR_*.csv     # Portuguese
│
├── ai-tutor/                     # AI Tutor content
├── personalization-guide/        # Setup guides
└── guides-and-resources/         # Additional resources
```

---

## 📝 Content Format Analysis

### GPT Expert Format (Markdown)

```markdown
# [Expert Name]

Team: [Team Name]
Role: [Role description]
Expertise: [Expertise description]
GPT Link:: [ChatGPT URL]

---

## Orientation & Education
- [Prompt Title]
  <aside>
  [Prompt content]
  </aside>

---

## Optimization Steps

### 1: Initial Steps
[Description]
- [Prompt Title]
  <aside>
  [Prompt content]
  </aside>

### 2: Development & Enhancement
...

### 3: Advanced Optimization
...

### 4: Scaling & Innovation
...

### 5: Market Leadership
...

---

## Routines & Process
...

## Growth Tactics
...

## Essential Documents
...

## Common Tasks
...
```

### Prompt Format (Markdown)

```markdown
# [Prompt Title]

Business Segment: [Segment]
Topic: [Category]
Problem: [Problem description]
Task: [Task description]
More Info: [Additional context needed]
Prompt: ---

Business Context:
My business is [Insert your business description here].
I'm located in [Insert your location here].

---

Goal
[Goal description]

---

Persona
[AI persona to adopt]

---

Detailed Context
[Context description]

---

Execution Specifications
1. [Spec 1]
2. [Spec 2]
...

---

Quality Checklist
- [Check 1]
- [Check 2]
...
```

---

## 🔄 Variable Mapping (Current → New)

| Current Placeholder | New Variable | Example Value |
|--------------------|--------------|---------------|
| `[Insert your business description here]` | `{{business_name}}` | Hotel & Spa Belvedere |
| `[Insert your location here]` | `{{location}}` | Lisbon, Portugal |
| `[My business is]` | `{{business_name}}` | Hotel & Spa Belvedere |
| `[Informe o nome da empresa/destino]` | `{{business_name}}` | Hotel & Spa Belvedere |
| `[Informe a cidade/país]` | `{{location}}` | Lisboa, Portugal |
| `[Descrição breve]` | `{{business_description}}` | Luxury boutique hotel |
| `[target audience description]` | `{{target_audience}}` | Business travelers |

---

## 🗂️ Segment Mapping (PRD ↔ Content)

| PRD Product | Content Source Folder | Prompts | Status |
|-------------|----------------------|---------|--------|
| `hotel-aios` | prompt-packs/hotels | ~200+ | Ready |
| `agency-aios` | prompt-packs/travel-agencies | ~180+ | Ready |
| `dmc-aios` | prompt-packs/tour-operators | ~180+ | Ready |
| `dmo-aios` | prompt-packs/tourism-observatory + destinations | ~150+ | Ready |
| `resort-aios` (V2) | prompt-packs/resorts | ~180+ | Ready |

---

## 🎯 Transformation Needed

### 1. Variable Standardization
- Convert all `[Insert...]` patterns to `{{variable}}` format
- Ensure consistent variable names across all content
- Variables must remain in English even in translations

### 2. Metadata Extraction
- Parse Markdown to JSON structure
- Extract: title, segment, category, problem, task, prompt
- Add: id, growth_vertical, tags

### 3. Icon Mapping
- Map expert names to icon filenames
- Normalize filenames (spaces, special chars)

### 4. i18n Structure
- Create per-language JSON files
- Keep variable names unchanged
- Structure: `content/{type}/{lang}/{id}.json`

---

## 📋 Content Quality Notes

### Strengths
- ✅ Comprehensive coverage (1,697 prompts!)
- ✅ Well-structured format
- ✅ Professional tone
- ✅ Practical, actionable content
- ✅ 5 languages available
- ✅ GPT Links functional

### Needs Improvement
- ⚠️ Variable format needs standardization
- ⚠️ Some translations may need review
- ⚠️ Missing Growth Vertical classification
- ⚠️ Missing explicit segment tags in some files

---

## 🛠️ Recommended Transformation Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONTENT TRANSFORMATION PIPELINE                          │
│                                                                             │
│  1. PARSE               2. TRANSFORM           3. VALIDATE    4. EXPORT   │
│  ┌─────────────┐       ┌─────────────┐       ┌───────────┐   ┌─────────┐ │
│  │ Read MD     │  →    │ Extract     │  →    │ Check     │ → │ JSON    │ │
│  │ files       │       │ metadata    │       │ variables │   │ files   │ │
│  │             │       │ + content   │       │ + format  │   │         │ │
│  │ Parse       │       │ Convert     │       │ Validate  │   │ By lang │ │
│  │ structure   │       │ variables   │       │ links     │   │ By type │ │
│  └─────────────┘       └─────────────┘       └───────────┘   └─────────┘ │
│                                                                             │
│  Scripts:                                                                   │
│  - parse-experts.js                                                         │
│  - parse-prompts.js                                                         │
│  - parse-tools.js                                                           │
│  - validate-content.js                                                      │
│  - export-json.js                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Estimated Effort

| Task | Time | Priority |
|------|------|----------|
| Parse & Transform Scripts | 4-6h | P0 |
| Variable Standardization | 2-3h | P0 |
| JSON Export (EN) | 2h | P0 |
| Validation Suite | 2h | P0 |
| i18n Integration | 4h | P1 |
| Icon Mapping | 1h | P1 |
| Translation Review | Squad | P2 |

**Total Core Work:** ~12-15 hours

---

## 🎯 Next Steps

1. [ ] Create parsing scripts
2. [ ] Run transformation on tour-operators (DMC) first
3. [ ] Validate output format
4. [ ] Scale to all segments
5. [ ] Integrate with AIOS app
6. [ ] Setup translation squad (if needed)
