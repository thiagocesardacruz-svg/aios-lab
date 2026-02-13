# Project Cashflow

## Meta
- **ID:** project-cashflow
- **Squad:** finance
- **Executed by:** financial-analyst
- **Idempotent:** yes
- **Estimated tokens:** medium (1-5k)

## Purpose
Project cash position for upcoming months to ensure adequate runway.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| current_balance | number | yes | finance records |
| revenue_forecast | yaml | yes | forecast-revenue |
| expense_forecast | yaml | yes | controller |
| projection_months | number | yes | finance-lead |

## Steps
1. Start with current cash balance
2. Add projected monthly inflows
3. Subtract projected monthly outflows
4. Calculate net cashflow per month
5. Project ending balance for each month
6. Calculate runway in months
7. Generate cashflow report

## Output
| Field | Type | Destination |
|-------|------|-------------|
| cashflow_projection | md | finance-lead |
| runway_months | number | ops-lead |

## Validation
- All months projected
- Runway calculated correctly
- Assumptions documented

## Error Handling
- **If input missing:** Use conservative estimates
- **If step fails:** Alert if runway <6 months
