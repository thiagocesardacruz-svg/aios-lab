# Analyze A/B Test

## Identity
- **ID:** analyze-ab-test
- **Squad:** growth
- **Agent:** data-analyst
- **Type:** task

## Purpose

Analyze A/B test results to determine winner with statistical rigor.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `test_id` | string | Yes | Test identifier |
| `control_data` | object | Yes | Control variant data |
| `treatment_data` | object | Yes | Treatment variant data |
| `confidence` | number | No | Required confidence (default: 0.95) |

## Process

### 1. Data Validation
- Check sample sizes
- Verify randomization
- Look for data quality issues

### 2. Statistical Analysis
- Calculate conversion rates
- Run significance test
- Calculate confidence interval
- Compute effect size

### 3. Segment Analysis
- Break down by segments
- Identify differential effects
- Check for novelty effects

### 4. Recommendation
- Declare winner (or no winner)
- Document learnings
- Suggest next steps

## Output

```yaml
analysis:
  test_id: "{test_id}"
  status: "{significant/not_significant/inconclusive}"

  results:
    control:
      visitors: {n}
      conversions: {n}
      rate: "{percentage}"
    treatment:
      visitors: {n}
      conversions: {n}
      rate: "{percentage}"

  statistics:
    lift: "{percentage}"
    confidence: "{percentage}"
    p_value: {n}
    effect_size: {n}

  segments:
    - segment: "{name}"
      lift: "{percentage}"
      significant: {boolean}

  recommendation: "{implement/iterate/reject}"

  learnings:
    - "{learning_1}"
    - "{learning_2}"

  next_steps:
    - "{step_1}"
```

## Quality Criteria

- [ ] Sample size sufficient
- [ ] Confidence level met
- [ ] Segments analyzed
- [ ] Learnings documented
- [ ] Next steps defined

## Related

- **Workflow:** `/growth/experiment`
- **Template:** `experiment-report-tmpl.md`
