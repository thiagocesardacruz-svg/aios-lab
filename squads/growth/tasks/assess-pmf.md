# Assess PMF

## Identity
- **ID:** assess-pmf
- **Squad:** growth
- **Agent:** pmf-specialist
- **Type:** task

## Purpose

Assess current Product-Market Fit level using multiple signals and frameworks.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `product` | string | Yes | Product to assess |
| `retention_data` | object | No | Retention cohort data |
| `survey_data` | object | No | Sean Ellis survey results |
| `nps_score` | number | No | Current NPS |

## Process

### 1. Retention Analysis
- Calculate retention curves
- Compare to benchmarks
- Identify best segments

### 2. Sean Ellis Survey
- "Very disappointed" %
- Segment analysis
- Trend over time

### 3. Qualitative Signals
- Customer interviews
- Support tickets
- Feature requests

### 4. PMF Score
- Combine signals
- Assign PMF level (0-4)
- Identify gaps

## PMF Levels

| Level | Description | Criteria |
|-------|-------------|----------|
| 0 | No fit | <20% disappointed, high churn |
| 1 | Early signals | 20-30% disappointed, some retention |
| 2 | Emerging | 30-40% disappointed, clear segment |
| 3 | Strong | >40% disappointed, growing organically |
| 4 | Leader | >50% disappointed, category defining |

## Output

```yaml
pmf_assessment:
  product: "{product_name}"
  date: "{date}"

  pmf_level: {0-4}
  pmf_status: "{no_fit/early/emerging/strong/leader}"

  signals:
    sean_ellis:
      very_disappointed: "{percentage}"
      somewhat_disappointed: "{percentage}"
      not_disappointed: "{percentage}"

    retention:
      week_1: "{percentage}"
      week_4: "{percentage}"
      week_12: "{percentage}"
      vs_benchmark: "{above/below}"

    nps:
      score: {number}
      promoters: "{percentage}"
      detractors: "{percentage}"

    qualitative:
      customer_love: "{low/medium/high}"
      organic_growth: "{low/medium/high}"
      word_of_mouth: "{low/medium/high}"

  best_segments:
    - segment: "{name}"
      pmf_level: {level}
      why: "{reason}"

  gaps:
    - "{gap_1}"
    - "{gap_2}"

  recommendations:
    - "{recommendation_1}"
    - "{recommendation_2}"
```

## Quality Criteria

- [ ] Multiple signals used
- [ ] Segments analyzed
- [ ] Benchmarks compared
- [ ] Gaps identified
- [ ] Actions recommended

## Related

- **Template:** `pmf-assessment-tmpl.md`
- **Data:** `retention-benchmarks.yaml`
