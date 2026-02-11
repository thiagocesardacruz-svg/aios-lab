# Design Experiment

## Identity
- **ID:** design-experiment
- **Squad:** growth
- **Agent:** growth-lead
- **Type:** task

## Purpose

Design a rigorous growth experiment with clear hypothesis, metrics, and success criteria.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `hypothesis` | string | Yes | What we believe will happen |
| `metric` | string | Yes | Primary success metric |
| `funnel_stage` | string | No | AARRR stage |
| `baseline` | number | No | Current metric value |

## Process

### 1. Define Hypothesis
- State belief clearly
- Make it falsifiable
- Connect to metric

### 2. Design Variants
- Control (current state)
- Treatment(s)
- Isolate single variable

### 3. Calculate Requirements
- Sample size needed
- Expected duration
- Minimum detectable effect

### 4. Define Success
- Primary metric
- Secondary metrics
- Guardrail metrics

## Output

```yaml
experiment:
  name: "{experiment_name}"
  hypothesis: "{hypothesis_statement}"

  variants:
    control: "{description}"
    treatment: "{description}"

  metrics:
    primary: "{metric_name}"
    secondary: []
    guardrails: []

  requirements:
    sample_size: {n}
    duration_days: {n}
    confidence_level: 0.95
    mde: "{percentage}"

  success_criteria:
    - "{criterion_1}"
    - "{criterion_2}"

  risks:
    - "{risk_1}"
```

## Quality Criteria

- [ ] Hypothesis is falsifiable
- [ ] Single variable tested
- [ ] Sample size calculated
- [ ] Success criteria defined
- [ ] Guardrails identified

## Related

- **Workflow:** `/growth/experiment`
- **Template:** `experiment-design-tmpl.md`
- **Checklist:** `experiment-checklist.md`
