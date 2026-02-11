---
name: skill-composer
description: |
  Skill Composer - Combina múltiplas skills em workflows complexos orquestrados.

  Permite criar pipelines de skills, executar skills em paralelo ou sequência,
  e definir workflows reutilizáveis que combinam capacidades de várias skills.

  Implementa a visão de plataforma de Gates: quando skills se combinam,
  o valor do ecossistema multiplica.

  Use quando: tasks complexas que precisam de múltiplas skills, criar workflows
  reutilizáveis, ou orquestrar pipelines multi-skill.

# Auto-routing configuration (opt-in)
auto_invoke: true
triggers:
  keywords:
    - "combinar skills"
    - "combine skills"
    - "workflow de skills"
    - "skill pipeline"
    - "múltiplas skills"
    - "multiple skills"
    - "orquestrar skills"
    - "orchestrate skills"
  patterns:
    - "(?i)use.*skills.*together"
    - "(?i)chain.*skills"
    - "(?i)pipeline.*skills"
    - "(?i)sequencia.*skills"
agents_allowed:
  - aios-master
  - architect
  - pm
priority: medium
confirm_before_invoke: false
---

# Skill Composer

Combina múltiplas skills em workflows complexos orquestrados.

## Overview

Implementa a filosofia de **Platform Thinking** de Bill Gates:

> "What's the platform play?"

Skills individuais têm valor. Skills que se **combinam** têm valor exponencial.

```
Valor(Skill A) + Valor(Skill B) = X
Valor(Skill A ⊕ Skill B) = X × Network Effect

Onde ⊕ = composição inteligente
```

## Composition Types

### 1. Sequential Pipeline

```yaml
type: sequential
description: Skills executam uma após outra
use_when: Output de uma skill é input da próxima

example:
  name: "Research-to-Implementation"
  steps:
    - skill: tech-search
      input: "user query"
      output: research_results

    - skill: architect-first
      input: research_results
      output: architecture

    - skill: context-optimizer
      input: architecture
      output: optimized_context
```

### 2. Parallel Execution

```yaml
type: parallel
description: Skills executam simultaneamente
use_when: Tasks independentes que podem rodar juntas

example:
  name: "Multi-Analysis"
  parallel:
    - skill: tech-search
      query: "React patterns"

    - skill: tech-search
      query: "TypeScript best practices"

    - skill: cost-guardian
      action: estimate

  merge: combine_results
```

### 3. Conditional Flow

```yaml
type: conditional
description: Skills executam baseado em condições
use_when: Fluxo depende de resultados intermediários

example:
  name: "Smart Implementation"
  flow:
    - skill: context-optimizer
      action: audit
      output: context_status

    - condition: context_status.savings > 30%
      then:
        skill: context-optimizer
        action: compress
      else:
        continue: true

    - skill: architect-first
```

### 4. Loop/Iteration

```yaml
type: loop
description: Skill executa até condição ser atendida
use_when: Refinamento iterativo necessário

example:
  name: "Quality Loop"
  loop:
    skill: learning-loop
    action: validate
    until: confidence > 0.8
    max_iterations: 5
```

## Workflow Definition Schema

```yaml
# workflow-definition.yaml
workflow:
  name: string
  description: string
  version: string

  triggers:
    keywords: [list]
    patterns: [list]
    manual_only: boolean

  inputs:
    - name: string
      type: string
      required: boolean
      default: any

  steps:
    - id: string
      skill: string
      action: string
      inputs:
        key: value | ${reference}
      outputs:
        - name: string
      condition: expression
      parallel_with: [step_ids]
      retry:
        max: number
        on_error: skill | abort

  outputs:
    - name: string
      from: step_id.output_name

  error_handling:
    on_skill_failure: retry | skip | abort
    on_timeout: skip | abort
    notify: boolean

  cost_limit: number
  timeout_minutes: number
```

## Pre-Built Compositions

### 1. Full Development Pipeline

```yaml
workflow:
  name: full-dev-pipeline
  description: Complete development flow from research to implementation

  steps:
    - id: research
      skill: tech-search
      inputs:
        query: ${user_query}
      outputs:
        - research_doc

    - id: optimize_context
      skill: context-optimizer
      inputs:
        context: ${research.research_doc}
      outputs:
        - optimized_context

    - id: architecture
      skill: architect-first
      inputs:
        context: ${optimize_context.optimized_context}
      outputs:
        - architecture_doc

    - id: cost_check
      skill: cost-guardian
      inputs:
        estimated_task: ${architecture.architecture_doc}
      outputs:
        - cost_estimate
      condition: cost_estimate.approved == true

    - id: implement
      parallel_with: [monitor]
      skill: (delegate to @dev)
      inputs:
        architecture: ${architecture.architecture_doc}

    - id: monitor
      parallel_with: [implement]
      skill: circuit-breaker
      inputs:
        task_id: ${implement.task_id}

    - id: learn
      skill: learning-loop
      inputs:
        task_outcome: ${implement.outcome}
```

### 2. Safe Execution Wrapper

```yaml
workflow:
  name: safe-execution
  description: Wrap any task with safety guardrails

  steps:
    - id: cost_estimate
      skill: cost-guardian
      action: estimate

    - id: setup_breaker
      skill: circuit-breaker
      action: configure
      inputs:
        cost_limit: ${cost_estimate.recommended}

    - id: recall_memory
      skill: institutional-memory
      action: recall
      inputs:
        topic: ${task_description}

    - id: execute
      skill: (user provided)
      inputs:
        context: ${recall_memory.relevant_context}

    - id: capture_learning
      skill: learning-loop
      action: capture
      inputs:
        task_outcome: ${execute.outcome}

    - id: update_memory
      skill: institutional-memory
      action: record
      inputs:
        decision: ${execute.decisions_made}
```

### 3. Optimized Research

```yaml
workflow:
  name: optimized-research
  description: Research with context optimization and cost control

  steps:
    - id: set_budget
      skill: cost-guardian
      action: limit
      inputs:
        budget: €5

    - id: search
      skill: tech-search
      inputs:
        query: ${user_query}
      parallel_with: [check_memory]

    - id: check_memory
      skill: institutional-memory
      action: recall
      inputs:
        topic: ${user_query}

    - id: merge
      action: merge_results
      inputs:
        - ${search.results}
        - ${check_memory.relevant}

    - id: compress
      skill: context-optimizer
      inputs:
        content: ${merge.combined}
      outputs:
        - optimized_research
```

## Commands

| Command | Description |
|---------|-------------|
| `*compose {workflow}` | Execute a pre-defined workflow |
| `*define` | Start interactive workflow definition |
| `*list-workflows` | List available compositions |
| `*run {workflow} {inputs}` | Run workflow with inputs |
| `*preview {workflow}` | Show workflow execution plan |
| `*edit {workflow}` | Edit existing workflow |

## Interactive Composition

```markdown
## Skill Composer - Interactive Mode

What do you want to accomplish?
> "Research best practices, design architecture, then implement"

Detected skills needed:
1. /tech-search - for research
2. /architect-first - for design
3. /context-optimizer - for efficiency
4. /circuit-breaker - for safety

Proposed pipeline:
```
[tech-search] → [context-optimizer] → [architect-first] → [implementation]
      ↓                                                          ↓
[cost-guardian monitors throughout]                    [learning-loop captures]
```

Estimated cost: €8-12
Estimated time: 20-30 min

[ ] Execute this workflow
[ ] Modify workflow
[ ] Save as reusable workflow
```

## Composition Rules

### Skill Compatibility Matrix

```yaml
compatibility:
  # Which skills can chain into which
  tech-search:
    outputs_to:
      - architect-first
      - context-optimizer
      - learning-loop

  architect-first:
    requires_before:
      - context-optimizer (recommended)
    outputs_to:
      - (implementation agents)

  context-optimizer:
    can_wrap: all
    position: early_in_pipeline

  circuit-breaker:
    can_wrap: all
    position: parallel_monitor

  cost-guardian:
    can_wrap: all
    position: parallel_monitor

  learning-loop:
    position: end_of_pipeline
    requires_after: (any task completion)

  institutional-memory:
    position: start_or_end
    at_start: recall
    at_end: record
```

### Anti-Patterns

```yaml
anti_patterns:
  - name: "Infinite composition"
    pattern: Skill A → Skill A
    why_bad: "Can create loops"
    fix: "Use circuit-breaker with max iterations"

  - name: "Expensive parallel"
    pattern: Many Opus calls in parallel
    why_bad: "Cost explosion"
    fix: "Sequential or use Haiku for parallel"

  - name: "Memory after learning"
    pattern: institutional-memory → learning-loop
    why_bad: "Order should be reversed"
    fix: "learning-loop → institutional-memory"
```

## Storage

```
.claude/
└── skills/
    └── skill-composer/
        └── workflows/
            ├── full-dev-pipeline.yaml
            ├── safe-execution.yaml
            ├── optimized-research.yaml
            └── custom/
                └── (user-defined workflows)
```

## Integration

```yaml
integrations:
  all_skills:
    - Can compose any skill
    - Respects individual skill rules

  auto_routing:
    - Workflows can be auto-triggered
    - Uses combined triggers of component skills

  cost_guardian:
    - Aggregates costs across composition
    - Enforces total workflow budget
```

## Hard Rules

1. NEVER compose skills that violate each other's hard rules
2. ALWAYS include cost-guardian for compositions > 3 skills
3. NEVER allow infinite loops without circuit-breaker
4. ALWAYS capture learnings at end of successful compositions
5. NEVER skip institutional-memory recall for complex tasks

---

*Skill Composer v1.0 - "The network effect multiplies value" — Bill Gates*
