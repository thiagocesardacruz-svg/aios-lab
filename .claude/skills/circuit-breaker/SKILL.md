---
name: circuit-breaker
description: |
  Circuit Breaker - Previne loops infinitos, custo descontrolado e falhas em cascata.

  Monitora execução de agentes e tasks, detectando padrões de falha e aplicando
  hard stops antes que custos explodam ou agentes entrem em loops.

  Implementa a filosofia de Munger: "Evitar estupidez é mais fácil que buscar brilhantismo."

  Use quando: tasks longas, operações custosas, risco de loops, ou qualquer execução
  que precise de guardrails.

# Auto-routing configuration (opt-in)
auto_invoke: true
triggers:
  keywords:
    - "prevenir loop"
    - "prevent loop"
    - "parar execução"
    - "stop execution"
    - "limite de custo"
    - "cost limit"
    - "guardrails"
    - "circuit breaker"
  patterns:
    - "(?i)infinite.*loop"
    - "(?i)cost.*control"
    - "(?i)stop.*if"
    - "(?i)safeguard"
agents_allowed: all
priority: critical
confirm_before_invoke: false
---

# Circuit Breaker

Previne loops infinitos, custo descontrolado e falhas em cascata.

## Overview

Implementa a filosofia de Charlie Munger: **"Invert, always invert."**

> "All I want to know is where I'm going to die so I never go there."

Este skill pergunta: **"O que GARANTIRIA que esta task falha?"** e então previne essas condições.

## Circuit Breaker States

```
     ┌─────────┐
     │  CLOSED │ ← Normal operation
     └────┬────┘
          │ Failures detected
          ▼
     ┌─────────┐
     │  OPEN   │ ← Blocking execution
     └────┬────┘
          │ Cooldown period
          ▼
     ┌─────────┐
     │HALF-OPEN│ ← Testing recovery
     └────┬────┘
          │ Success/Failure
          ▼
     CLOSED or OPEN
```

## Failure Patterns Detected

### Pattern 1: Infinite Loops

```yaml
detection:
  - Same action repeated > 3 times
  - No progress in output between iterations
  - Token count increasing without new information

action:
  - STOP immediately
  - Report: "Loop detected: {action} repeated {n} times"
  - Suggest: "Rephrase the approach or break into smaller steps"
```

### Pattern 2: Cost Explosion

```yaml
detection:
  - Tokens/minute > threshold (default: 5000)
  - Estimated cost approaching limit
  - Many parallel agent spawns

action:
  - WARNING at 70% of limit
  - PAUSE at 90% of limit
  - STOP at 100% of limit
  - Report: "Cost limit approaching: €{current}/€{limit}"
```

### Pattern 3: Error Cascade

```yaml
detection:
  - Same error type > 2 times
  - Error in error handling
  - Retry without change

action:
  - STOP after 3rd identical error
  - Report: "Error cascade: {error} occurred {n} times"
  - Suggest: "Root cause analysis needed before retry"
```

### Pattern 4: Hallucination Indicators

```yaml
detection:
  - References to non-existent files
  - Claims about code that doesn't match reality
  - Confident statements without verification

action:
  - FLAG for review
  - Request: "Verify this claim against actual source"
  - Suggest: "Use Read tool to confirm before proceeding"
```

## Thresholds Configuration

```yaml
# Default thresholds (can be overridden per-task)
thresholds:
  max_retries: 3
  max_tokens_per_task: 50000
  max_cost_per_task: €10
  max_duration_minutes: 30
  max_agent_spawns: 5
  max_file_edits_without_test: 10
  max_consecutive_errors: 3

alerts:
  cost_warning: 70%  # of max_cost
  cost_pause: 90%
  cost_stop: 100%

cooldown:
  after_stop: 60 seconds
  after_error: 10 seconds
```

## Integration Protocol

### Before Task Execution

```markdown
## Circuit Breaker Check

Task: {task_description}
Estimated complexity: [low|medium|high]

Thresholds applied:
- Max retries: 3
- Max cost: €10
- Max duration: 30 min

Circuit status: CLOSED (ready to execute)
```

### During Execution

Monitor continuously and report:

```markdown
## Execution Monitor

| Metric | Current | Limit | Status |
|--------|---------|-------|--------|
| Retries | 1 | 3 | OK |
| Cost | €2.50 | €10 | OK |
| Duration | 5 min | 30 min | OK |
| Tokens | 12,000 | 50,000 | OK |

Circuit: CLOSED
```

### On Threshold Breach

```markdown
## CIRCUIT OPEN

Reason: Cost limit reached (€10.05/€10.00)
Action: Execution paused
Recovery: Manual approval required to continue

Options:
1. Increase limit and continue
2. Abort task
3. Save progress and resume later
```

## Commands

| Command | Description |
|---------|-------------|
| `*status` | Show current circuit status and metrics |
| `*thresholds` | Display/modify thresholds |
| `*override` | Temporarily override a threshold (requires confirmation) |
| `*reset` | Reset circuit to CLOSED state |
| `*history` | Show recent trips and reasons |

## Auto-Actions

Actions taken automatically without user intervention:

| Trigger | Action | Reversible |
|---------|--------|------------|
| 3rd retry of same action | STOP + suggest alternative | Yes |
| Cost > 90% limit | PAUSE + ask to continue | Yes |
| Same error 3x | STOP + root cause prompt | Yes |
| No progress 5 min | WARNING + status check | Yes |
| Hallucination detected | FLAG + verification request | Yes |

## Integration with Other Skills

```yaml
integrations:
  cost-guardian:
    - Shares cost metrics
    - Respects cost-guardian limits
    - Reports to cost-guardian on stop

  context-optimizer:
    - Triggers optimization on high token usage
    - Uses compressed context to reduce costs

  learning-loop:
    - Records failure patterns
    - Learns from circuit trips
    - Improves detection over time
```

## Inversion Checklist

Before any task, apply Munger's inversion:

```markdown
## Pre-Task Inversion

Task: {task}

What would GUARANTEE this fails?
- [ ] Infinite retry without change
- [ ] Ignoring errors and continuing
- [ ] No cost limits
- [ ] No verification of outputs
- [ ] Assuming files exist without checking

Safeguards applied:
- [x] Max 3 retries
- [x] Stop on repeated errors
- [x] Cost limit €10
- [x] Verify before edit
- [x] Check file existence
```

## Hard Rules

1. NEVER disable circuit breaker for production tasks
2. ALWAYS log the reason for circuit trips
3. NEVER auto-reset after cost-related stops
4. ALWAYS require human approval for threshold overrides > 2x default

## Example Scenarios

### Scenario 1: Loop Detection

```
Agent: *tries to fix test*
Attempt 1: Edit file → Test fails
Attempt 2: Edit same line → Test fails
Attempt 3: Edit same line → Test fails

Circuit Breaker:
STOP - Loop detected
"Same edit attempted 3 times without success.
Consider: Is the test correct? Is there a different approach?"
```

### Scenario 2: Cost Control

```
Task: Research and implement feature
Token usage climbing...

At €7.00 (70%): "Cost warning: 70% of €10 limit used"
At €9.00 (90%): "PAUSE - Cost at 90%. Continue? [y/n]"
At €10.00 (100%): "STOP - Cost limit reached. Save progress."
```

---

*Circuit Breaker v1.0 - "Avoid stupidity rather than seek brilliance" — Charlie Munger*
