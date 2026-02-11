# Audit Costs

## Meta
- **ID:** audit-costs
- **Squad:** finance
- **Executed by:** controller
- **Idempotent:** yes
- **Estimated tokens:** medium (1-5k)

## Purpose
Audit cost entries for accuracy, categorization, and compliance.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| cost_entries | yaml | yes | cost-log |
| period | text | yes | finance-lead |
| cost_categories | yaml | yes | data/cost-categories.yaml |

## Steps
1. Retrieve all cost entries for period
2. Verify each entry has valid category
3. Check for duplicate entries
4. Verify amounts match source records
5. Identify anomalies (>2 std dev from mean)
6. Document findings
7. Generate audit report

## Output
| Field | Type | Destination |
|-------|------|-------------|
| audit_report | md | finance-lead |
| anomalies | yaml | controller (for investigation) |

## Validation
- All entries reviewed
- Duplicates identified
- Anomalies flagged

## Error Handling
- **If input missing:** Audit available entries, note gaps
- **If step fails:** Log partial audit, continue
