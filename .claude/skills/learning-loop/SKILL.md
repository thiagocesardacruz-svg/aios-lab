---
name: learning-loop
description: |
  Learning Loop - Agentes que melhoram a cada execução através de compound intelligence.

  Captura padrões de sucesso e falha, extrai lições de cada task, e aplica aprendizado
  em execuções futuras. Quanto mais usa, melhor fica.

  Implementa a filosofia de Thiel: "Zero to one" - vantagem que concorrentes não podem copiar.

  Use quando: completar tasks, após erros, para melhorar workflows, ou quando quiser
  que o sistema aprenda com a experiência.

# Auto-routing configuration (opt-in)
auto_invoke: true
triggers:
  keywords:
    - "aprender com"
    - "learn from"
    - "melhorar processo"
    - "improve process"
    - "lição aprendida"
    - "lesson learned"
    - "padrão de sucesso"
    - "success pattern"
  patterns:
    - "(?i)what.*learned"
    - "(?i)como.*melhorar"
    - "(?i)next.*time"
    - "(?i)avoid.*mistake"
agents_allowed: all
priority: high
confirm_before_invoke: false
---

# Learning Loop

Agentes que melhoram a cada execução através de compound intelligence.

## Overview

Implementa a filosofia de Peter Thiel: **"Zero to one, not one to n."**

> "What important truth do very few people agree with you on?"

A verdade: **Agentes que APRENDEM são exponencialmente mais valiosos que agentes que apenas EXECUTAM.**

```
Agente tradicional:  Performance = Constant
Agente com learning: Performance = Base × (1.01)^executions

Após 100 execuções: 2.7x melhor
Após 500 execuções: 145x melhor
```

## Learning Categories

### 1. Pattern Recognition

```yaml
patterns:
  success_patterns:
    - "When X happens, Y works"
    - "Task type A is best solved with approach B"
    - "User prefers style X over Y"

  failure_patterns:
    - "Approach X always fails for task type Y"
    - "Error Z indicates root cause W"
    - "This anti-pattern leads to rework"

  efficiency_patterns:
    - "This shortcut saves N tokens"
    - "This order of operations is faster"
    - "This tool is better than that for X"
```

### 2. Preference Learning

```yaml
preferences:
  user_style:
    - Communication tone
    - Code style preferences
    - Documentation level
    - Review depth

  project_conventions:
    - Naming patterns
    - File organization
    - Testing approach
    - Commit message style
```

### 3. Domain Knowledge

```yaml
domain:
  codebase_knowledge:
    - "Module X depends on Y"
    - "Function Z is deprecated, use W"
    - "This pattern is used throughout"

  business_rules:
    - "Feature A requires approval"
    - "Data X is sensitive"
    - "Process Y has compliance requirements"
```

## Learning Loop Workflow

### Phase 1: Capture (After Every Task)

```markdown
## Task Completion Capture

Task: {task_description}
Outcome: [success|partial|failure]
Duration: X minutes
Tokens used: Y

### What Worked
- {specific action that contributed to success}
- {tool/approach that was effective}

### What Didn't Work
- {approach that failed}
- {time wasted on X}

### Key Insight
{One sentence learning for future reference}

### Applies To
- Task types: [list]
- Contexts: [list]
- Agents: [list]
```

### Phase 2: Extract (Pattern Recognition)

```markdown
## Pattern Extraction

New pattern detected:
- Trigger: {when this condition exists}
- Action: {do this}
- Confidence: {low|medium|high}
- Evidence: {list of tasks that support this}

Similar existing patterns:
- {pattern_id}: {similarity_score}

Recommendation:
- [ ] Add as new pattern
- [ ] Merge with existing pattern
- [ ] Discard (not enough evidence)
```

### Phase 3: Apply (Before Future Tasks)

```markdown
## Pre-Task Learning Check

Task: {new_task}

Relevant learnings:
1. Pattern P1 (confidence: high)
   → "For tasks like this, start with X"

2. Preference U1
   → "User prefers Y style"

3. Domain knowledge D1
   → "This codebase uses Z pattern"

Suggested approach based on learnings:
{approach}
```

### Phase 4: Validate (Feedback Loop)

```markdown
## Learning Validation

Applied learning: {pattern_id}
Task outcome: [success|failure]

Learning effectiveness:
- [ ] Confirmed - pattern holds
- [ ] Refined - pattern needs adjustment
- [ ] Invalidated - pattern doesn't apply

Update:
- Confidence: {old} → {new}
- Scope: {adjusted scope if needed}
```

## Storage Structure

```
.aios/
└── learning/
    ├── patterns/
    │   ├── success-patterns.yaml
    │   ├── failure-patterns.yaml
    │   └── efficiency-patterns.yaml
    ├── preferences/
    │   ├── user-preferences.yaml
    │   └── project-conventions.yaml
    ├── domain/
    │   ├── codebase-knowledge.yaml
    │   └── business-rules.yaml
    └── metrics/
        ├── learning-effectiveness.yaml
        └── pattern-usage.yaml
```

## Pattern Schema

```yaml
# Example pattern entry
pattern:
  id: SP-001
  type: success_pattern
  trigger: "Implementing React component with state"
  action: "Start with useState, add useEffect only if needed"
  confidence: 0.85
  evidence:
    - task_id: T-123
      outcome: success
    - task_id: T-156
      outcome: success
    - task_id: T-189
      outcome: partial
  created: 2025-02-11
  last_validated: 2025-02-11
  times_applied: 12
  success_rate: 0.92
  scope:
    task_types: [frontend, component]
    contexts: [react, typescript]
    agents: [dev, architect]
```

## Commands

| Command | Description |
|---------|-------------|
| `*capture` | Manually capture learning from current context |
| `*patterns` | List all patterns (filter by type/confidence) |
| `*apply {task}` | Get relevant learnings for a task |
| `*validate {pattern_id}` | Validate/update a pattern |
| `*metrics` | Show learning effectiveness metrics |
| `*export` | Export learnings for backup/sharing |

## Auto-Capture Triggers

Learning is automatically captured when:

| Trigger | Capture Type |
|---------|--------------|
| Task completed successfully | Success pattern |
| Task failed | Failure pattern |
| User corrects agent | Preference |
| Same approach used 3+ times | Efficiency pattern |
| Circuit breaker triggered | Failure pattern |
| Significant token savings | Efficiency pattern |

## Metrics Dashboard

```markdown
## Learning Loop Metrics

### Overall
- Total patterns: 127
- Active patterns: 98
- Success rate improvement: +23%

### By Category
| Category | Patterns | Avg Confidence | Usage |
|----------|----------|----------------|-------|
| Success | 45 | 0.82 | 312 |
| Failure | 32 | 0.78 | 156 |
| Efficiency | 21 | 0.71 | 89 |

### Recent Learnings
| Date | Pattern | Confidence | Impact |
|------|---------|------------|--------|
| Today | SP-127 | 0.65 | New |
| Yesterday | FP-032 | 0.78→0.85 | Validated |

### ROI
- Estimated tokens saved: 45,000
- Estimated time saved: 3.2 hours
- Errors prevented: 12
```

## Integration with Other Skills

```yaml
integrations:
  circuit-breaker:
    - Records failure patterns on circuit trips
    - Learns thresholds that work for project

  context-optimizer:
    - Learns which context is actually used
    - Optimizes based on historical patterns

  institutional-memory:
    - Feeds patterns into org memory
    - Cross-pollinates learnings across projects
```

## Hard Rules

1. NEVER apply pattern with confidence < 0.5 automatically
2. ALWAYS ask for validation on first application of new pattern
3. NEVER store sensitive data in learnings (credentials, PII)
4. ALWAYS decay confidence if pattern not used in 30 days
5. NEVER override explicit user instructions with learned patterns

## Compound Intelligence Formula

```
Intelligence(t) = Base + Σ(validated_patterns × confidence × recency_weight)

Where:
- Base = Model's inherent capability
- validated_patterns = Patterns confirmed by outcomes
- confidence = [0-1] based on evidence
- recency_weight = Decay function (recent = 1, old = 0.5)
```

---

*Learning Loop v1.0 - "Compound intelligence is the moat" — Peter Thiel*
