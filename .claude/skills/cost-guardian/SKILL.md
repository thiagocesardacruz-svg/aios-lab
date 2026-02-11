---
name: cost-guardian
description: |
  Cost Guardian - Controle rigoroso de budget com enforcement automático.

  Monitora e controla custos de tokens, API calls, e recursos em tempo real.
  Implementa hard stops, alertas, e relatórios para manter gastos dentro do budget.

  Integra com ClickUp Goals para tracking centralizado.
  Budget atual: €468/mês, €20/dia hard limit, €15/dia alert.

  Use quando: monitorar gastos, definir limites por task, gerar relatórios de custo,
  ou quando precisar de controle fino sobre budget de AI.

# Auto-routing configuration (opt-in)
auto_invoke: true
triggers:
  keywords:
    - "custo"
    - "cost"
    - "budget"
    - "orçamento"
    - "gasto"
    - "spending"
    - "limite de custo"
    - "quanto gastei"
    - "how much spent"
  patterns:
    - "(?i)budget.*limit"
    - "(?i)cost.*track"
    - "(?i)quanto.*custa"
    - "(?i)monitor.*spend"
agents_allowed: all
priority: critical
confirm_before_invoke: false
---

# Cost Guardian

Controle rigoroso de budget com enforcement automático.

## Overview

Implementa a filosofia de Charlie Munger combinada com Elon Musk:

> Munger: "Show me the incentive and I will show you the outcome."
> Musk: "Break down costs to physics floor."

**Sem controle de custos, o incentivo é gastar mais tokens.**
**Com Cost Guardian, o incentivo é eficiência.**

## Budget Structure

```yaml
# AIOS Budget Configuration
budget:
  monthly:
    limit: €468
    alert_at: €400

  daily:
    limit: €20
    alert_at: €15

  per_task:
    default_limit: €5
    approval_required_above: €10

  per_agent:
    dev: €50/month
    architect: €30/month
    analyst: €40/month
    aios-master: €100/month
```

## Cost Tracking Hierarchy

```
Monthly Budget (€468)
    │
    ├── Daily Budget (€20)
    │   │
    │   ├── Task 1 (€X)
    │   │   ├── Agent calls
    │   │   ├── Tool usage
    │   │   └── Context tokens
    │   │
    │   ├── Task 2 (€Y)
    │   │
    │   └── Overhead (€Z)
    │
    └── Remaining (€468 - Σ daily)
```

## Real-Time Monitoring

### Dashboard Display

```markdown
## Cost Guardian Dashboard

### Today (2025-02-11)
| Metric | Used | Limit | Status |
|--------|------|-------|--------|
| Daily | €12.50 | €20 | ⚠️ 63% |
| Tokens | 45,000 | - | - |
| Tasks | 8 | - | - |

### This Month
| Metric | Used | Limit | Status |
|--------|------|-------|--------|
| Monthly | €156.80 | €468 | ✅ 34% |
| Days left | 17 | - | - |
| Daily avg | €9.22 | €18.40* | ✅ |

*Adjusted daily based on remaining budget

### Top Spenders Today
| Task | Cost | Tokens | Agent |
|------|------|--------|-------|
| Research X | €4.20 | 15,000 | analyst |
| Implement Y | €3.80 | 12,000 | dev |
| Review Z | €2.10 | 8,000 | qa |

### Alerts
⚠️ Daily usage at 63% - consider optimizing remaining tasks
```

## Enforcement Levels

### Level 1: Tracking (Passive)

```yaml
tracking:
  log_every_call: true
  aggregate_by:
    - task
    - agent
    - day
    - month
  report_frequency: hourly
```

### Level 2: Alerts (Warning)

```yaml
alerts:
  daily_warning:
    threshold: 75%  # €15 of €20
    action:
      - Notify user
      - Log warning
      - Suggest optimization

  monthly_warning:
    threshold: 85%
    action:
      - Notify user
      - Restrict non-essential tasks
      - Require approval for new tasks
```

### Level 3: Soft Stop (Pause)

```yaml
soft_stop:
  daily_soft:
    threshold: 90%  # €18 of €20
    action:
      - Pause non-critical tasks
      - Ask for approval to continue
      - Enable "essential only" mode

  task_limit:
    threshold: 100%  # of task budget
    action:
      - Pause task
      - Report progress
      - Ask to increase limit or abort
```

### Level 4: Hard Stop (Block)

```yaml
hard_stop:
  daily_hard:
    threshold: 100%  # €20
    action:
      - STOP all non-critical execution
      - Save state for tomorrow
      - Report final status
    exceptions:
      - Emergency fixes
      - User override with confirmation

  monthly_hard:
    threshold: 100%  # €468
    action:
      - SAFE MODE activated
      - Only read operations allowed
      - No new tasks until next month
```

## Token-to-Cost Calculation

```yaml
# Approximate costs (Claude pricing)
token_costs:
  input:
    opus: $15.00 / 1M tokens
    sonnet: $3.00 / 1M tokens
    haiku: $0.25 / 1M tokens

  output:
    opus: $75.00 / 1M tokens
    sonnet: $15.00 / 1M tokens
    haiku: $1.25 / 1M tokens

# Conversion
cost_per_1k_tokens:
  opus_in: €0.0138
  opus_out: €0.069
  sonnet_in: €0.00276
  sonnet_out: €0.0138
  haiku_in: €0.00023
  haiku_out: €0.00115
```

## Per-Task Budget

### Setting Task Budget

```markdown
## Task Cost Estimation

Task: {task_description}
Complexity: [simple | medium | complex]

Estimated resources:
- Context tokens: ~X
- Expected turns: ~Y
- Model: [opus | sonnet | haiku]

Estimated cost: €Z

Recommended budget: €{Z × 1.5} (50% buffer)

[ ] Accept estimate
[ ] Set custom budget: €___
[ ] Use default (€5)
```

### During Task Execution

```markdown
## Task Cost Monitor

Task: {task_id}
Budget: €5.00
Used: €3.20 (64%)

Breakdown:
- Context: €1.50
- Generation: €1.70

Remaining: €1.80

Status: ✅ On track
```

## ClickUp Integration

Syncs with ClickUp Goals for centralized tracking:

```bash
# Update daily goal
node squads/ops/scripts/command-center.mjs track <task_id> <tokens>

# Sync dashboard
node squads/ops/scripts/dashboard.mjs sync
```

### Goal Structure

```yaml
clickup_goals:
  daily_budget:
    goal_id: "goal_daily_budget"
    target: 2000  # €20 in cents
    current: synced_from_tracking

  monthly_budget:
    goal_id: "goal_monthly_budget"
    target: 46800  # €468 in cents
    current: synced_from_tracking

  token_usage:
    goal_id: "goal_tokens"
    target: 0  # No limit, just tracking
    current: total_tokens_used
```

## Commands

| Command | Description |
|---------|-------------|
| `*cost` | Show current cost status |
| `*budget` | Show/modify budget limits |
| `*estimate {task}` | Estimate cost for task |
| `*report [day\|week\|month]` | Generate cost report |
| `*limit {task} {€amount}` | Set task budget limit |
| `*override` | Request budget override (needs confirmation) |
| `*optimize` | Suggest cost optimizations |

## Cost Optimization Suggestions

When budget is tight, suggest:

```markdown
## Cost Optimization Recommendations

Current situation: Daily budget at 80%

### Immediate Actions
1. **Use Haiku for simple tasks**
   - Switch research summaries to Haiku
   - Estimated savings: €2/day

2. **Compress context**
   - Enable /context-optimizer
   - Estimated savings: 30% per task

3. **Batch similar tasks**
   - Combine related file reads
   - Reduce context reloading

### Longer-term
1. **Cache common queries**
   - Store frequent lookups
   - Avoid redundant API calls

2. **Use /learning-loop**
   - Patterns reduce trial-and-error
   - Fewer iterations = lower cost
```

## Integration with Other Skills

```yaml
integrations:
  circuit-breaker:
    - Cost thresholds trigger circuit break
    - Shared monitoring metrics

  context-optimizer:
    - Reduces tokens = reduces cost
    - Auto-triggered on high spend

  learning-loop:
    - Tracks cost patterns
    - Learns efficient approaches
```

## Reports

### Daily Report

```markdown
## Daily Cost Report - 2025-02-11

### Summary
- Total: €18.50
- Budget: €20.00
- Remaining: €1.50

### By Agent
| Agent | Cost | Tasks | Efficiency |
|-------|------|-------|------------|
| dev | €8.20 | 5 | €1.64/task |
| analyst | €5.30 | 2 | €2.65/task |
| architect | €3.50 | 3 | €1.17/task |
| other | €1.50 | 8 | €0.19/task |

### By Task Type
| Type | Cost | Count |
|------|------|-------|
| Implementation | €10.50 | 4 |
| Research | €5.30 | 2 |
| Review | €2.70 | 6 |

### Efficiency Metrics
- Avg tokens/task: 12,500
- Avg cost/task: €1.54
- Tasks completed: 12

### Recommendations
- Research tasks above average cost
- Consider caching for repeated queries
```

### Monthly Report

```markdown
## Monthly Cost Report - February 2025

### Summary
- Total: €156.80
- Budget: €468.00
- Utilization: 34%
- Projected: €312 (if trend continues)

### Daily Trend
[Chart showing daily spend]

### Top Cost Drivers
1. Feature implementation: €45 (29%)
2. Research tasks: €38 (24%)
3. Code review: €28 (18%)
4. Documentation: €22 (14%)
5. Other: €24 (15%)

### Cost per Feature
| Feature | Cost | Tokens | LOC Changed |
|---------|------|--------|-------------|
| Auth | €25 | 85,000 | 450 |
| Dashboard | €18 | 62,000 | 320 |
| API | €12 | 41,000 | 280 |

### Efficiency Comparison
- This month: €1.52/task
- Last month: €1.78/task
- Improvement: 15%
```

## Hard Rules

1. NEVER exceed daily hard limit without explicit user override
2. ALWAYS log costs even when tracking-only mode
3. NEVER hide cost information from user
4. ALWAYS include cost estimate before expensive operations
5. NEVER disable cost tracking for production tasks

---

*Cost Guardian v1.0 - "Show me the incentive and I will show you the outcome" — Charlie Munger*
