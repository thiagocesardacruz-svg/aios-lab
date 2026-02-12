---
name: data-insight
description: |
  Data Insight - Pesquisa rápida e embasada para decisões informadas.

  Porta de entrada inteligente para pesquisa: avalia complexidade e resolve inline
  (quick), usa templates do squad (standard), ou escala para squad deep-research (deep).

  Fornece dados, análises e recomendações acionáveis com fontes citadas e nível
  de confiança. Para qualquer tema: mercado, competidores, tendências, usuários, etc.

  Use quando: precisar de dados para tomar decisão, validar hipótese, entender
  mercado/competidores, ou qualquer pergunta que exija pesquisa.

# Auto-routing configuration (opt-in)
auto_invoke: true
triggers:
  keywords:
    - "pesquisar sobre"
    - "research about"
    - "dados sobre"
    - "data about"
    - "análise de mercado"
    - "market analysis"
    - "quem são os competidores"
    - "competitor analysis"
    - "tendências de"
    - "trends in"
    - "validar hipótese"
    - "validate hypothesis"
    - "entender mercado"
    - "understand market"
    - "qual o tamanho do mercado"
    - "market size"
  patterns:
    - "(?i)research.*about"
    - "(?i)dados.*para.*decis"
    - "(?i)analyze.*market"
    - "(?i)who.*competitors"
    - "(?i)tendencia.*de"
agents_allowed: all
priority: medium
confirm_before_invoke: false
---

# Data Insight

Pesquisa rápida e embasada para decisões informadas.

## Overview

Esta skill é a **porta de entrada inteligente** para pesquisa no AIOS. Ela:

1. **Avalia complexidade** da pergunta
2. **Resolve inline** se for rápida (quick)
3. **Usa templates** do squad deep-research se for média (standard)
4. **Escala para squad** se for profunda (deep)

```
"Preciso de dados para decidir X"
            │
            ▼
    ┌───────────────┐
    │ /data-insight │
    └───────────────┘
            │
    ┌───────┼───────┐
    │       │       │
    ▼       ▼       ▼
  Quick  Standard  Deep
  5 min   30 min   Squad
```

## Complexity Assessment

### Quick (5-15 min)
- Pergunta específica e focada
- Resposta encontrável com 2-3 buscas
- Não requer análise cruzada profunda

**Exemplos:**
- "Qual o tamanho do mercado de SaaS hoteleiro em Portugal?"
- "Quem são os 3 principais competidores do Booking para hotéis independentes?"
- "Qual a tendência de adoção de IA em hotéis?"

### Standard (30-60 min)
- Requer múltiplas fontes
- Precisa de análise e síntese
- Beneficia de templates estruturados

**Exemplos:**
- "Análise completa dos competidores diretos do AI OS"
- "Pain points de hoteleiros com ferramentas de marketing digital"
- "Comparação de modelos de pricing para SaaS B2B na Europa"

### Deep (1-5 dias → Squad)
- Novo mercado ou pivô estratégico
- Requer as 7 fases do framework
- Output é Strategic Brief completo

**Exemplos:**
- "Devemos expandir para Espanha ou UK primeiro?"
- "Análise completa para lançar produto em novo segmento"
- "Research para definir posicionamento e go-to-market"

## Workflow

### Phase 1: Intake & Classification

```markdown
## Data Insight Request

**Pergunta/Tema:** {user_question}

### Classification
- [ ] Quick (específica, 2-3 buscas)
- [ ] Standard (múltiplas fontes, síntese)
- [ ] Deep (estratégico, requer squad)

### Context Needed
- Decisão a ser tomada: {decision}
- Deadline: {when needed}
- Profundidade desejada: {quick/thorough}
```

### Phase 2: Quick Research (Inline)

Para pesquisas quick, resolver diretamente:

```markdown
## Quick Research: {topic}

### Search Strategy
1. WebSearch: "{query 1}"
2. WebSearch: "{query 2}"
3. Context7/Docs: {if technical}

### Findings

#### Key Data Points
| Metric | Value | Source | Confidence |
|--------|-------|--------|------------|
| {metric} | {value} | {source} | High/Med/Low |

#### Summary
{2-3 parágrafos com principais insights}

#### Recommendation
{Ação sugerida baseada nos dados}

#### Sources
- [Source 1](url)
- [Source 2](url)
```

### Phase 3: Standard Research (Templates)

Para pesquisas standard, usar templates do squad:

```markdown
## Standard Research: {topic}

Using template: {template_name} from squads/deep-research/templates/

### Process
1. Load template
2. Execute searches for each section
3. Fill template with findings
4. Cross-reference sources
5. Generate recommendations

### Output
{Filled template saved to docs/research/}
```

**Available Templates:**
- `competitor-analysis-tmpl.md` - Análise de competidores
- `audience-persona-tmpl.md` - Personas de público
- `swot-tmpl.md` - Análise SWOT
- `project-brief-tmpl.md` - Brief de projeto

### Phase 4: Deep Research (Escalation)

Para pesquisas deep, escalar para squad:

```markdown
## Deep Research Required

This question requires the full deep-research squad workflow.

**Recommended action:**
Use @analyst to start the deep-research squad with:
- Task sequence: 01 → 07
- Estimated time: {days}
- Output: Strategic Brief

**To start:**
```
@analyst "Iniciar deep research para: {topic}"
```

Squad location: squads/deep-research/
Workflow: full-research.yaml
```

## Output Format

### Data Confidence Levels

| Level | Meaning | When to Use |
|-------|---------|-------------|
| **High** | Multiple reliable sources agree | Official stats, verified data |
| **Medium** | 1-2 sources, reputable | Industry reports, news |
| **Low** | Single source or inference | Estimates, projections |
| **Unverified** | Couldn't cross-reference | Flag for user |

### Citation Format

```markdown
According to [Source Name](url), {claim}. (Confidence: High)
```

### Recommendation Format

```markdown
## Recommendation

**Action:** {specific action to take}
**Rationale:** {why this is recommended based on data}
**Risk:** {what could go wrong}
**Alternative:** {if main recommendation isn't viable}
```

## Integration Points

### With Squad deep-research

```yaml
integration:
  squad: deep-research
  templates_path: squads/deep-research/templates/
  tasks_path: squads/deep-research/tasks/

  template_mapping:
    competitor_analysis: competitor-analysis-tmpl.md
    audience_research: audience-persona-tmpl.md
    swot: swot-tmpl.md
    market_analysis: project-brief-tmpl.md

  escalation:
    trigger: complexity == deep OR user_requests
    action: Suggest @analyst to start squad workflow
```

### With /institutional-memory

```yaml
integration:
  trigger: Research completed
  action: Save to memory
  location: .aios/memory/context/
  type: research_snapshot
  keywords: [topic, date, key_findings]
```

### With /learning-loop

```yaml
integration:
  trigger: Research completed
  action: Capture patterns
  patterns:
    - "Topic X best researched with source Y"
    - "User prefers depth level Z for topic type W"
```

### With Board Advisors

```yaml
integration:
  trigger: Strategic decision needed
  action: Suggest Board consultation
  advisors:
    market_entry: [Gates, Thiel]
    competition: [Thiel, Hormozi]
    pricing: [Hormozi, Kennedy]
    risk: [Munger, Dalio]
```

## Commands

| Command | Description |
|---------|-------------|
| `*insight {question}` | Start research on question |
| `*quick {question}` | Force quick mode |
| `*standard {topic}` | Use template-based research |
| `*deep {topic}` | Escalate to squad |
| `*sources {topic}` | Show sources used for topic |

## Examples

### Example 1: Quick Research

```
User: "Qual o tamanho do mercado de property management systems?"

/data-insight (auto-invoked):
Classification: Quick (specific metric question)

## Quick Research: PMS Market Size

### Key Data Points
| Metric | Value | Source | Confidence |
|--------|-------|--------|------------|
| Global PMS Market 2024 | $3.2B | Grand View Research | High |
| CAGR 2024-2030 | 8.4% | Mordor Intelligence | High |
| Europe Share | 28% | Statista | Medium |
| Portugal Estimate | €45-60M | Calculated | Low |

### Summary
O mercado global de PMS está em $3.2B com crescimento de 8.4% ao ano...

### Recommendation
Mercado suficiente para nicho. Foco em diferenciação por IA.

### Sources
- [Grand View Research](url)
- [Mordor Intelligence](url)
```

### Example 2: Standard Research

```
User: "Preciso entender os competidores do AI OS em profundidade"

/data-insight (auto-invoked):
Classification: Standard (requires structured analysis)

Loading template: competitor-analysis-tmpl.md

## Competitor Analysis: AI OS

[Template filled with research...]

Saved to: docs/research/2025-02-11-ai-os-competitors/
```

### Example 3: Deep Escalation

```
User: "Devemos expandir para Espanha ou focar em UK?"

/data-insight (auto-invoked):
Classification: Deep (strategic decision, multiple factors)

## Deep Research Required

This is a strategic market entry decision requiring:
- Market analysis (both markets)
- Competitor mapping (both markets)
- Regulatory analysis
- Resource requirements
- Go-to-market strategy

**Recommended:** Use the full deep-research squad.

To start:
@analyst "Deep research: Spain vs UK market entry for AI OS"

Estimated time: 3-5 days
Output: Strategic Brief with recommendation
```

## Hard Rules

1. ALWAYS cite sources with confidence levels
2. NEVER present opinion as data
3. ALWAYS offer to go deeper if user needs more
4. NEVER skip classification step
5. ALWAYS save standard/deep research to docs/research/

## Storage

Research outputs are saved to:

```
docs/research/
└── {YYYY-MM-DD}-{slug}/
    ├── README.md           # Summary
    ├── findings.md         # Detailed findings
    ├── sources.md          # All sources
    └── recommendation.md   # Action items
```

---

*Data Insight v1.0 - "Decisions backed by data, not assumptions"*
