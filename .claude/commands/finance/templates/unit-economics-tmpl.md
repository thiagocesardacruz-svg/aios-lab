# Unit Economics Template

## Meta
- **ID:** unit-economics-tmpl
- **Squad:** finance
- **Used by:** analyze-unit-economics task
- **Output format:** md
- **Version:** 1.0.0

## Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `{{analysis_date}}` | Date of analysis | yes | none |
| `{{cac}}` | Customer acquisition cost | yes | none |
| `{{ltv}}` | Customer lifetime value | yes | none |
| `{{ltv_cac_ratio}}` | LTV to CAC ratio | yes | none |
| `{{payback_period}}` | CAC payback in months | yes | none |
| `{{gross_margin}}` | Gross margin percentage | yes | none |
| `{{arpu}}` | Average revenue per user | yes | none |
| `{{churn_rate}}` | Monthly churn rate | yes | none |
| `{{cohort_analysis}}` | Cohort performance | no | "Not available" |
| `{{recommendations}}` | Improvement recommendations | no | "None" |

## Template

---BEGIN TEMPLATE---

# Unit Economics Analysis — {{analysis_date}}

## Key Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| CAC | {{cac}} | - | - |
| LTV | {{ltv}} | - | - |
| LTV:CAC Ratio | {{ltv_cac_ratio}} | >3 | {{ltv_cac_status}} |
| Payback Period | {{payback_period}} | <12 mo | {{payback_status}} |
| Gross Margin | {{gross_margin}} | >70% | {{margin_status}} |
| ARPU | {{arpu}} | - | - |
| Churn Rate | {{churn_rate}} | <5% | {{churn_status}} |

## Cohort Analysis

{{cohort_analysis}}

## Recommendations

{{recommendations}}

---

*Unit economics analysis by Finance Squad*

---END TEMPLATE---

## Usage Notes
- Calculate quarterly minimum
- LTV:CAC < 3 requires immediate attention
- Include cohort analysis when data available
