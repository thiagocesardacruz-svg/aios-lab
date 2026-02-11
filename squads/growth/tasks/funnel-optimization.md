# Funnel Optimization

## Identity
- **ID:** funnel-optimization
- **Squad:** growth
- **Agent:** growth-hacker
- **Type:** task

## Purpose

Identify and prioritize funnel optimization opportunities.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `funnel_data` | object | Yes | Current funnel metrics |
| `stage` | string | No | Specific stage to focus on |
| `goal` | string | No | Optimization goal |

## Process

### 1. Analyze Current State
- Map funnel stages
- Calculate drop-offs
- Identify biggest leaks

### 2. Benchmark
- Compare to industry
- Compare to historical
- Identify gaps

### 3. Generate Ideas
- Brainstorm optimizations
- Score with ICE
- Prioritize

### 4. Create Plan
- Top 3 experiments
- Resource requirements
- Timeline

## Funnel Stages

```
Visitors → Signups → Activated → Retained → Paying → Advocates
   100%     30%        50%         40%        10%       20%
         ↓         ↓           ↓          ↓         ↓
       70% lost  50% lost    60% lost   90% lost  80% lost
```

## Output

```yaml
funnel_optimization:
  funnel: "{funnel_name}"
  date: "{date}"

  current_state:
    - stage: "visitors"
      count: {n}
      rate: "100%"
    - stage: "signups"
      count: {n}
      rate: "{percentage}"
      drop_off: "{percentage}"
    # ... more stages

  biggest_leaks:
    1:
      stage: "{stage}"
      drop_off: "{percentage}"
      opportunity: "{potential_gain}"
    2:
      stage: "{stage}"
      drop_off: "{percentage}"
      opportunity: "{potential_gain}"

  optimization_ideas:
    - idea: "{idea_1}"
      stage: "{stage}"
      ice_score: {score}
      effort: "{low/medium/high}"
    - idea: "{idea_2}"
      stage: "{stage}"
      ice_score: {score}
      effort: "{low/medium/high}"

  recommended_experiments:
    1: "{experiment_1}"
    2: "{experiment_2}"
    3: "{experiment_3}"

  expected_impact:
    metric: "{conversion_rate}"
    current: "{percentage}"
    target: "{percentage}"
    lift: "{percentage}"
```

## Quality Criteria

- [ ] All stages mapped
- [ ] Drop-offs calculated
- [ ] Ideas scored
- [ ] Experiments defined
- [ ] Impact estimated

## Related

- **Workflow:** `/growth/analyze-funnel`
- **Checklist:** `funnel-analysis-checklist.md`
