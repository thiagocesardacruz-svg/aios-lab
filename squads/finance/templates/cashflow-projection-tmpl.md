# Cashflow Projection Template

## Meta
- **ID:** cashflow-projection-tmpl
- **Squad:** finance
- **Used by:** project-cashflow task
- **Output format:** md
- **Version:** 1.0.0

## Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `{{projection_period}}` | Months being projected | yes | none |
| `{{starting_balance}}` | Current cash position | yes | none |
| `{{monthly_inflows}}` | Expected income per month | yes | none |
| `{{monthly_outflows}}` | Expected expenses per month | yes | none |
| `{{net_cashflow}}` | Net change per month | yes | none |
| `{{ending_balance}}` | Projected end balance | yes | none |
| `{{runway_months}}` | Months of runway | yes | none |
| `{{assumptions}}` | Key assumptions | yes | none |
| `{{risks}}` | Identified risks | no | "None identified" |

## Template

---BEGIN TEMPLATE---

# Cashflow Projection — {{projection_period}}

## Summary

| Metric | Value |
|--------|-------|
| Starting Balance | {{starting_balance}} |
| Projected Ending Balance | {{ending_balance}} |
| Runway | {{runway_months}} months |

## Monthly Breakdown

{{monthly_inflows}}

{{monthly_outflows}}

{{net_cashflow}}

## Key Assumptions

{{assumptions}}

## Risks

{{risks}}

---

*Cashflow projection by Finance Squad*

---END TEMPLATE---

## Usage Notes
- Project 6-12 months ahead
- Update monthly with actuals
- Flag if runway drops below 6 months
