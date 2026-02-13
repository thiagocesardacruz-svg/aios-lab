# Calculate Runway

## Meta
- **ID:** calculate-runway
- **Squad:** finance
- **Executed by:** controller
- **Idempotent:** yes
- **Estimated tokens:** low (<1k)

## Purpose
Calculate months of runway remaining at current burn rate.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| cash_balance | number | yes | finance records |
| monthly_burn | number | yes | controller |
| monthly_revenue | number | yes | finance records |

## Steps
1. Calculate net burn (expenses - revenue)
2. Divide cash balance by net burn
3. Round down to whole months
4. Flag if below threshold (6 months)
5. Generate runway alert if needed

## Output
| Field | Type | Destination |
|-------|------|-------------|
| runway_months | number | finance-lead |
| runway_alert | yaml | ops-lead (if <6 months) |

## Validation
- Calculation is mathematically correct
- Alert generated if runway <6 months

## Error Handling
- **If input missing:** Use last known values
- **If step fails:** Alert finance-lead immediately
