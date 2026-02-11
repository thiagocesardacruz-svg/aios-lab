# Create Health Score

## Identity
- **ID:** create-health-score
- **Squad:** customer
- **Agent:** retention-strategist
- **Type:** task

## Purpose

Design a customer health score model that predicts churn risk and identifies expansion opportunities.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `churn_drivers` | list | Yes | Identified churn drivers |
| `usage_data` | object | No | Available usage metrics |
| `segments` | list | No | Customer segments |

## Process

### 1. Select Indicators
- Usage metrics (logins, features used)
- Engagement metrics (time in app)
- Relationship metrics (support, NPS)
- Business metrics (growth, expansion)

### 2. Weight Factors
- Correlation with churn
- Leading vs lagging
- Actionability
- Data availability

### 3. Define Thresholds
- Green/Yellow/Red zones
- Alert triggers
- Trend sensitivity
- Segment variations

### 4. Validate Model
- Backtest on churned customers
- Precision and recall
- False positive rate
- Adjust weights

### 5. Operationalize
- Data pipeline
- Update frequency
- Dashboard design
- Alert routing

## Output

```yaml
health_score_model:
  version: "{version}"
  created: "{date}"

  score_range:
    min: 0
    max: 100

  health_zones:
    healthy:
      range: "80-100"
      color: "green"
      action: "Monitor, expansion opportunities"
    at_risk:
      range: "50-79"
      color: "yellow"
      action: "Proactive outreach"
    critical:
      range: "0-49"
      color: "red"
      action: "Immediate intervention"

  indicators:
    usage:
      weight: 30
      metrics:
        - name: "login_frequency"
          weight: 10
          scoring:
            - range: "daily"
              points: 10
            - range: "weekly"
              points: 7
            - range: "monthly"
              points: 3
            - range: "none_30d"
              points: 0

        - name: "feature_adoption"
          weight: 10
          scoring:
            - range: ">80%"
              points: 10
            - range: "50-80%"
              points: 7
            - range: "20-50%"
              points: 4
            - range: "<20%"
              points: 1

        - name: "active_users_ratio"
          weight: 10
          scoring:
            - range: ">75%"
              points: 10
            - range: "50-75%"
              points: 6
            - range: "<50%"
              points: 2

    engagement:
      weight: 25
      metrics:
        - name: "session_duration"
          weight: 10
        - name: "actions_per_session"
          weight: 10
        - name: "return_frequency"
          weight: 5

    relationship:
      weight: 25
      metrics:
        - name: "nps_score"
          weight: 10
        - name: "support_sentiment"
          weight: 10
        - name: "csm_engagement"
          weight: 5

    business:
      weight: 20
      metrics:
        - name: "contract_value_trend"
          weight: 10
        - name: "payment_history"
          weight: 5
        - name: "expansion_signals"
          weight: 5

  alerts:
    - trigger: "score_drop_20"
      condition: "Score drops >20 points in 7 days"
      action: "CSM notification"
      urgency: "high"

    - trigger: "enters_critical"
      condition: "Score falls below 50"
      action: "Immediate outreach"
      urgency: "critical"

    - trigger: "no_login_14d"
      condition: "No login in 14 days"
      action: "Re-engagement sequence"
      urgency: "medium"

  validation:
    backtest_period: "{months}"
    accuracy: "{percentage}"
    precision: "{percentage}"
    recall: "{percentage}"

  implementation:
    data_source: "{source}"
    update_frequency: "daily"
    dashboard: "{link}"
```

## Health Score Components

| Category | Weight | Why |
|----------|--------|-----|
| **Usage** | 30% | Direct product engagement |
| **Engagement** | 25% | Quality of interaction |
| **Relationship** | 25% | Sentiment and connection |
| **Business** | 20% | Financial health signals |

## Quality Criteria

- [ ] Indicators data-backed
- [ ] Weights validated against churn
- [ ] Thresholds tested
- [ ] Alerts actionable
- [ ] Model backtested
- [ ] Dashboard designed

## Related

- **Task:** `analyze-churn`
- **Template:** `customer-health-tmpl.md`
- **Data:** `health-score-model.yaml`
