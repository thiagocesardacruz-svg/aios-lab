# Retention Analysis

## Identity
- **ID:** retention-analysis
- **Squad:** growth
- **Agent:** data-analyst
- **Type:** task

## Purpose

Analyze user retention cohorts to understand engagement patterns and PMF signals.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cohort_data` | object | Yes | User cohort data |
| `period` | string | No | daily/weekly/monthly |
| `segments` | list | No | Segments to analyze |

## Process

### 1. Build Cohort Table
- Group by signup date
- Track activity over time
- Calculate retention rates

### 2. Curve Analysis
- Plot retention curves
- Identify inflection points
- Find steady state

### 3. Segment Comparison
- Compare by segment
- Find best retainers
- Identify at-risk groups

### 4. Insights
- What drives retention?
- What predicts churn?
- Action recommendations

## Output

```yaml
retention_analysis:
  period: "{daily/weekly/monthly}"
  date_range: "{start} to {end}"

  cohort_table:
    - cohort: "{date}"
      size: {n}
      day_1: "{percentage}"
      day_7: "{percentage}"
      day_14: "{percentage}"
      day_30: "{percentage}"
      day_60: "{percentage}"
      day_90: "{percentage}"

  summary:
    avg_day_1: "{percentage}"
    avg_day_7: "{percentage}"
    avg_day_30: "{percentage}"
    steady_state: "{percentage}"
    vs_benchmark: "{above/below/at}"

  segments:
    best:
      segment: "{name}"
      day_30: "{percentage}"
      characteristics: []
    worst:
      segment: "{name}"
      day_30: "{percentage}"
      characteristics: []

  inflection_points:
    - day: {n}
      event: "{what_happens}"
      action: "{recommendation}"

  churn_predictors:
    - signal: "{signal}"
      correlation: {r}
      action: "{intervention}"

  recommendations:
    - "{recommendation_1}"
    - "{recommendation_2}"
```

## Benchmarks

| Product Type | Day 1 | Day 7 | Day 30 |
|--------------|-------|-------|--------|
| SaaS B2B | 80% | 60% | 40% |
| SaaS B2C | 60% | 40% | 25% |
| Consumer | 40% | 20% | 10% |

## Quality Criteria

- [ ] Cohorts properly defined
- [ ] Curves visualized
- [ ] Segments compared
- [ ] Benchmarks referenced
- [ ] Actions recommended

## Related

- **Task:** `assess-pmf`
- **Data:** `retention-benchmarks.yaml`
