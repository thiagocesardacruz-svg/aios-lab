# Task: Gap Analysis

## Objective
Identificar gaps entre o que o mercado oferece e o que o público realmente precisa, revelando oportunidades de diferenciação.

## Context
Gaps são espaços vazios onde existe demanda mas não existe oferta adequada. É onde sua oportunidade mora.

## Process

### Step 1: Consolidate Findings

**From Audience Research:**
- Top unmet needs:
- Underserved segments:
- Frustrations with current solutions:

**From Market Analysis:**
- Emerging trends not addressed:
- Changing behaviors:
- New contexts/use cases:

**From Competitor Analysis:**
- Features no one offers:
- Segments no one targets:
- Price points not covered:
- Messages no one uses:

### Step 2: Gap Identification Matrix

| Gap Type | Description | Evidence | Opportunity Size |
|----------|-------------|----------|------------------|
| **Functional** | Missing features/capabilities | | High/Med/Low |
| **Emotional** | Unaddressed feelings/fears | | |
| **Segment** | Underserved audience | | |
| **Price** | Missing price points | | |
| **Access** | Availability/distribution | | |
| **Experience** | UX/service gaps | | |
| **Communication** | Messaging gaps | | |

### Step 3: SWOT Analysis

Use template: `templates/swot-tmpl.md`

```
         POSITIVE              NEGATIVE
       ┌─────────────────┬─────────────────┐
INTERNAL│  STRENGTHS      │  WEAKNESSES     │
       │                 │                 │
       │                 │                 │
       ├─────────────────┼─────────────────┤
EXTERNAL│  OPPORTUNITIES  │  THREATS        │
       │                 │                 │
       │                 │                 │
       └─────────────────┴─────────────────┘
```

### Step 4: Opportunity Scoring

| Opportunity | Impact | Feasibility | Urgency | Score |
|-------------|--------|-------------|---------|-------|
| [Opp 1] | 1-5 | 1-5 | 1-5 | /15 |
| [Opp 2] | | | | |
| [Opp 3] | | | | |

**Scoring Criteria:**
- Impact: Potential value if successful
- Feasibility: Ability to execute
- Urgency: Time sensitivity

### Step 5: Strategic Opportunities Summary

**Primary Opportunity:**
> [One sentence describing the main opportunity]

**Supporting Opportunities:**
1.
2.
3.

**Key Insight:**
> [The "aha" that makes this opportunity unique]

## Output
- Gap identification matrix
- SWOT analysis
- Prioritized opportunity list
- Strategic insight

## Next Task
→ `06-positioning.md`

---

## Prompts de Apoio

### Para Gap Analysis
```
Com base nestas informações:

Audience needs: [NEEDS]
Competitor offerings: [OFFERINGS]
Market trends: [TRENDS]

Identifique:
1. Gaps funcionais (features/capabilities missing)
2. Gaps emocionais (feelings not addressed)
3. Gaps de segmento (audiences underserved)
4. Gaps de preço (price points not covered)
5. Gaps de experiência (UX/service issues)

Para cada gap, avalie:
- Evidência de que existe demanda
- Dificuldade de preencher
- Potencial de diferenciação
```

### Para SWOT
```
Analise o cenário para entrar no mercado de [MERCADO] com [SOLUÇÃO]:

Crie uma análise SWOT considerando:
- Strengths: O que temos de vantagem?
- Weaknesses: Onde somos fracos?
- Opportunities: Que mudanças favorecem nossa entrada?
- Threats: Que riscos enfrentamos?

Para cada item, seja específico e baseado em evidências.
```
