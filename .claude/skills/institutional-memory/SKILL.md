---
name: institutional-memory
description: |
  Institutional Memory - Memória organizacional acumulada que persiste entre sessões.

  Captura e organiza decisões, padrões, erros, e conhecimento tácito da organização.
  Funciona como a "memória de longo prazo" do AIOS, permitindo que novos agentes
  e sessões acessem o conhecimento acumulado.

  Implementa o moat de Thiel: conhecimento que concorrentes não podem copiar.

  Use quando: tomar decisões recorrentes, onboarding de contexto, evitar repetir erros,
  ou documentar conhecimento tácito.

# Auto-routing configuration (opt-in)
auto_invoke: true
triggers:
  keywords:
    - "decisão anterior"
    - "previous decision"
    - "já fizemos isso"
    - "we did this before"
    - "histórico de"
    - "history of"
    - "por que decidimos"
    - "why did we decide"
    - "memória institucional"
  patterns:
    - "(?i)what.*decided.*before"
    - "(?i)como.*resolvemos"
    - "(?i)last.*time.*we"
    - "(?i)remember.*when"
agents_allowed: all
priority: high
confirm_before_invoke: false
---

# Institutional Memory

Memória organizacional acumulada que persiste entre sessões.

## Overview

Este skill implementa o conceito de **Knowledge Moat** de Peter Thiel:

> "What do you know that others don't?"

A memória institucional é o conhecimento ÚNICO da sua organização - decisões, contexto, padrões, erros - que nenhum concorrente pode replicar porque é específico da sua jornada.

```
Valor da Memória = Σ(decisões × contexto × tempo)

Concorrente pode copiar:
- Código (open source)
- Processos (documentados)
- Ferramentas (disponíveis)

Concorrente NÃO pode copiar:
- Por que você tomou aquela decisão
- O que você aprendeu com aquele erro
- O contexto específico do seu negócio
```

## Memory Categories

### 1. Decision Records

```yaml
decisions:
  architectural:
    - "Why we chose Supabase over Firebase"
    - "Why we use Server Components"
    - "Why we structured squads this way"

  business:
    - "Why we focus on hotels first"
    - "Why we price at X"
    - "Why we don't do Y"

  technical:
    - "Why this library over that"
    - "Why this pattern"
    - "Why this naming convention"
```

### 2. Error Archive

```yaml
errors:
  critical_failures:
    - "The time we lost data because..."
    - "The outage caused by..."
    - "The security issue from..."

  near_misses:
    - "Almost deployed bug that would..."
    - "Caught issue before production..."

  lessons:
    - "Never do X because Y"
    - "Always check Z before W"
```

### 3. Tacit Knowledge

```yaml
tacit:
  how_things_work:
    - "Module X behaves unexpectedly when..."
    - "The real reason Y is slow is..."
    - "To debug Z, always start with..."

  tribal_knowledge:
    - "User prefers when we..."
    - "Stakeholder X cares about..."
    - "The unwritten rule is..."

  shortcuts:
    - "Fastest way to do X is..."
    - "The trick with Y is..."
```

### 4. Context Snapshots

```yaml
context:
  project_state:
    - "As of {date}, project was at..."
    - "Key constraints at the time were..."

  external_factors:
    - "Market conditions that influenced..."
    - "Competitor actions that changed..."

  team_context:
    - "Available resources were..."
    - "Key people involved were..."
```

## Memory Storage Structure

```
.aios/
└── memory/
    ├── decisions/
    │   ├── 2025-01-arch-supabase.md
    │   ├── 2025-01-biz-hotel-focus.md
    │   └── index.yaml
    ├── errors/
    │   ├── 2025-01-data-loss-incident.md
    │   └── index.yaml
    ├── tacit/
    │   ├── debugging-tips.md
    │   ├── stakeholder-preferences.md
    │   └── index.yaml
    ├── context/
    │   ├── 2025-Q1-snapshot.md
    │   └── index.yaml
    └── search-index.yaml
```

## Memory Entry Schema

```yaml
# Decision Record Example
entry:
  id: DEC-2025-001
  type: decision
  category: architectural
  title: "Escolha do Supabase como backend"
  date: 2025-01-15

  context:
    situation: "Precisávamos de BaaS para MVP"
    constraints:
      - "Budget limitado"
      - "Time-to-market crítico"
      - "Equipe pequena"
    alternatives_considered:
      - name: Firebase
        rejected_because: "Vendor lock-in, pricing unpredictable"
      - name: Self-hosted
        rejected_because: "Overhead de manutenção"

  decision:
    choice: Supabase
    rationale: |
      - Open source (exit strategy)
      - PostgreSQL (familiar, powerful)
      - Auth + Storage + Functions integrados
      - Pricing previsível

  outcomes:
    - "Implementação 2x mais rápida que estimado"
    - "Custo 30% abaixo do budget"

  lessons:
    - "BaaS com exit strategy vale premium"
    - "PostgreSQL expertise transferível"

  participants:
    - Thiago (Director)
    - @architect (Aria)

  related:
    - DEC-2025-003 (Edge Functions adoption)
    - ERR-2025-002 (RLS misconfiguration)

  tags: [architecture, infrastructure, database]

  searchable_text: |
    supabase firebase baas backend database postgresql
    auth authentication storage functions serverless
```

## Workflows

### Capture Decision

```markdown
## New Decision Record

Triggered by: [manual | agent-detected | significant-change]

### 1. Context Gathering
- What is the situation?
- What constraints exist?
- What alternatives were considered?

### 2. Decision Documentation
- What was decided?
- Why this choice over alternatives?
- Who participated?

### 3. Outcome Tracking
- What happened after implementation?
- Were assumptions correct?
- What would we do differently?

### 4. Lesson Extraction
- What should future agents/sessions know?
- What keywords should trigger this memory?
```

### Recall Memory

```markdown
## Memory Recall

Query: {user_question_or_context}

### Search Process
1. Keyword match against search-index
2. Semantic similarity to past decisions
3. Related entries via links
4. Temporal proximity (recent more relevant)

### Results
| Entry | Relevance | Summary |
|-------|-----------|---------|
| DEC-001 | 0.92 | Decision about X |
| ERR-015 | 0.78 | Error related to X |
| TAC-007 | 0.65 | Tip about X |

### Recommended Read
{Most relevant entry in full}
```

### Onboard Context

```markdown
## Context Onboarding

New session/agent needs context about: {topic}

### Core Memory Package
1. Key decisions (top 5)
2. Critical errors to avoid (top 3)
3. Current project state
4. Active constraints
5. Stakeholder preferences

### Compressed Context
{Optimized summary for context window}

### Deep Dive Available
"Ask about any of these for full details:
- Decision: Supabase choice
- Error: RLS incident
- Context: Q1 2025 priorities"
```

## Commands

| Command | Description |
|---------|-------------|
| `*remember {topic}` | Search memory for topic |
| `*decide` | Start decision documentation flow |
| `*error` | Document error/incident |
| `*tacit {knowledge}` | Record tacit knowledge |
| `*snapshot` | Create context snapshot |
| `*onboard {topic}` | Get onboarding context |
| `*timeline {topic}` | Show decision timeline for topic |

## Auto-Capture Triggers

Memory is automatically prompted for capture when:

| Trigger | Memory Type |
|---------|-------------|
| "We decided to..." | Decision |
| "We chose X over Y" | Decision |
| "This error happened" | Error |
| "Lesson learned" | Error/Tacit |
| "The trick is..." | Tacit |
| "Always remember to..." | Tacit |
| New major feature shipped | Context snapshot |
| Quarter end | Context snapshot |

## Integration with Other Skills

```yaml
integrations:
  learning-loop:
    - Patterns feed into tacit knowledge
    - Decisions inform pattern confidence

  circuit-breaker:
    - Error records inform thresholds
    - Past incidents guide prevention

  context-optimizer:
    - Memory provides compressed context
    - Historical queries optimize future loads
```

## Search & Retrieval

### Keyword Index

```yaml
# search-index.yaml
keywords:
  supabase:
    - DEC-2025-001
    - DEC-2025-003
    - ERR-2025-002

  authentication:
    - DEC-2025-001
    - TAC-2025-015
    - ERR-2025-008

  performance:
    - DEC-2025-012
    - TAC-2025-022
    - CTX-2025-Q1
```

### Semantic Search

For queries that don't match keywords:

```
Query: "Why is login slow?"

Process:
1. No exact match for "login slow"
2. Semantic expansion: auth, performance, latency
3. Match: TAC-2025-022 "Authentication latency debugging"
4. Return relevant memory
```

## Hard Rules

1. NEVER delete memory entries (mark as superseded instead)
2. ALWAYS include context with decisions (never just the what, always the why)
3. NEVER store credentials or sensitive data
4. ALWAYS link related memories
5. ALWAYS make entries searchable

## Memory Decay & Relevance

```yaml
relevance_scoring:
  base_score: 1.0

  modifiers:
    recency:
      < 30 days: 1.0
      30-90 days: 0.9
      90-180 days: 0.8
      > 180 days: 0.7

    access_frequency:
      accessed_this_month: +0.2
      never_accessed: -0.1

    outcome_validated:
      positive_outcome: +0.3
      negative_outcome: +0.2  # Still valuable!
      unknown: 0

    links:
      many_related: +0.1
      standalone: -0.1
```

---

*Institutional Memory v1.0 - "What you know that others don't is your moat" — Peter Thiel*
