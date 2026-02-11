# Analyze Churn

## Identity
- **ID:** analyze-churn
- **Squad:** customer
- **Agent:** retention-strategist
- **Type:** task

## Purpose

Analyze churn patterns to identify drivers, predict at-risk customers, and recommend interventions.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customer_data` | object | Yes | Customer usage and profile data |
| `time_period` | string | No | Analysis period |
| `segment` | string | No | Specific segment to analyze |
| `churn_definition` | string | No | How churn is defined |

## Process

### 1. Define Churn
- Contractual vs behavioral churn
- Time threshold for inactivity
- Revenue vs logo churn
- Voluntary vs involuntary

### 2. Analyze Patterns
- Churn by cohort
- Churn by segment
- Churn by acquisition source
- Seasonal patterns

### 3. Identify Drivers
- Usage patterns before churn
- Support interactions
- Feature adoption gaps
- External factors

### 4. Build Risk Model
- Leading indicators
- Signal weights
- Prediction accuracy
- Alert thresholds

### 5. Recommend Actions
- Segment-specific interventions
- Timing of outreach
- Channel preferences
- Offer strategies

## Output

```yaml
churn_analysis:
  period: "{start} to {end}"
  total_customers: {n}
  churned_customers: {n}
  churn_rate: "{percentage}"

  churn_by_segment:
    - segment: "{segment_1}"
      customers: {n}
      churned: {n}
      rate: "{percentage}"
      vs_average: "{+/-}%"

    - segment: "{segment_2}"
      customers: {n}
      churned: {n}
      rate: "{percentage}"
      vs_average: "{+/-}%"

  churn_drivers:
    - driver: "{driver_1}"
      impact: "{high/medium/low}"
      correlation: {r}
      affected_pct: "{percentage}"
      actionable: {true/false}

    - driver: "{driver_2}"
      impact: "{high/medium/low}"
      correlation: {r}
      affected_pct: "{percentage}"
      actionable: {true/false}

  leading_indicators:
    - signal: "{signal_1}"
      days_before_churn: {n}
      reliability: "{percentage}"
      action_window: "{timeframe}"

    - signal: "{signal_2}"
      days_before_churn: {n}
      reliability: "{percentage}"
      action_window: "{timeframe}"

  at_risk_segments:
    - segment: "{segment}"
      risk_level: "{critical/high/medium}"
      count: {n}
      revenue_at_risk: "${amount}"
      recommended_action: "{action}"

  cohort_analysis:
    - cohort: "{month}"
      size: {n}
      month_1_churn: "{percentage}"
      month_3_churn: "{percentage}"
      month_6_churn: "{percentage}"
      month_12_churn: "{percentage}"

  recommendations:
    immediate:
      - "{action_1}"
      - "{action_2}"
    short_term:
      - "{action_3}"
    long_term:
      - "{action_4}"
```

## Churn Benchmarks

| Business Type | Monthly | Annual | Good |
|---------------|---------|--------|------|
| B2B SaaS SMB | 3-5% | 30-50% | <3% |
| B2B SaaS Enterprise | 0.5-1% | 5-10% | <5% |
| B2C Subscription | 5-7% | 45-60% | <5% |
| Consumer Apps | 8-10% | 60-70% | <8% |

## Common Churn Drivers

| Driver | Type | Actionability |
|--------|------|---------------|
| Poor onboarding | Product | High |
| Missing features | Product | Medium |
| Price sensitivity | Business | Medium |
| Champion left | Relationship | Low |
| Competitor switch | Market | Medium |
| Business closed | External | None |
| Payment failure | Operations | High |

## Quality Criteria

- [ ] Churn clearly defined
- [ ] Sufficient data analyzed
- [ ] Segments compared
- [ ] Drivers validated
- [ ] Actions prioritized
- [ ] Revenue impact quantified

## Related

- **Workflow:** `/customer/retention-system`
- **Template:** `churn-analysis-tmpl.md`
- **Data:** `customer-lifecycle.yaml`
