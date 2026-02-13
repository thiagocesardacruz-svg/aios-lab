# Track Expenses

## Meta
- **ID:** track-expenses
- **Squad:** finance
- **Executed by:** controller
- **Idempotent:** yes
- **Estimated tokens:** low (<1k)

## Purpose
Log and categorize an expense entry from OS activity.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| os_id | text | yes | ops-manager |
| cost_amount | number | yes | ops-manager |
| cost_category | text | yes | data/cost-categories.yaml |
| squad_id | text | yes | ops-manager |
| timestamp | text | yes | system |

## Steps
1. Validate cost_category against cost-categories.yaml
2. Verify squad_id exists in squad-registry
3. Create expense entry with all fields
4. Update daily running total
5. Check against daily limits
6. Log to cost tracking system

## Output
| Field | Type | Destination |
|-------|------|-------------|
| expense_entry | yaml | cost-log |
| daily_status | yaml | controller (for alerts) |

## Validation
- Category is valid
- Amount is positive number
- Daily total updated correctly

## Error Handling
- **If input missing:** Classify as highest-cost category (conservative)
- **If step fails:** Log error, continue with partial entry
