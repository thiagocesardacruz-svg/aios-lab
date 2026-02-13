# Calculate Daily Cost

## Meta
- **ID:** calculate-daily-cost
- **Squad:** ops
- **Executed by:** ops-manager
- **Idempotent:** yes
- **Estimated tokens:** medium (1-5k)

## Purpose
Calculate and log total AI/operational costs for the current day.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| date | text | yes | system |
| os_activity_log | yaml | yes | ops-manager |
| cost_categories | yaml | yes | finance/data/cost-categories.yaml |

## Steps
1. Retrieve all OS activity for the date
2. Calculate token usage per OS
3. Apply cost rates per category (BASE, EXEC, VRFY, etc.)
4. Sum by squad and by category
5. Check against daily limits (€15 alert, €20 hard)
6. Generate alerts if thresholds exceeded
7. Log to cost-log

## Output
| Field | Type | Destination |
|-------|------|-------------|
| daily_cost_summary | yaml | generate-status-report |
| cost_alerts | yaml | ops-lead (if threshold exceeded) |

## Validation
- All OS for date included
- Cost matches activity log
- Alerts generated if > €15

## Error Handling
- **If input missing:** Use previous day's rates
- **If step fails:** Log partial calculation, notify ops-lead
