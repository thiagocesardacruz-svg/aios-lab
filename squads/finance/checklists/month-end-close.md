# Month-End Close Checklist

## Meta
- **ID:** month-end-close
- **Squad:** finance
- **Used by:** controller, monthly-report workflow
- **Trigger:** Last business day of each month
- **Type:** compliance

## Items

### Cost Reconciliation

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 1 | All OS costs logged | Every completed OS has cost entry | 🔴 |
| 2 | Categories assigned | All costs have valid category | 🔴 |
| 3 | Daily totals reconcile | Sum of daily = monthly total | 🔴 |

### Budget Verification

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 4 | Monthly limit checked | Total <= £400 or exception documented | 🔴 |
| 5 | Squad allocations verified | No squad >25% of total | 🟡 |
| 6 | Overages documented | Any overage has approval record | 🔴 |

### Reporting

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 7 | Financial report generated | Monthly report exists | 🔴 |
| 8 | Metrics calculated | All key metrics computed | 🟡 |
| 9 | Notion synced | Cost log synced to Notion | 🟡 |

### Compliance

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 10 | No unclassified costs | Zero costs in "uncategorized" | 🔴 |
| 11 | Audit trail complete | All changes logged | 🔴 |

## Gate Rule
- **Pass:** All 🔴 items pass + max 2 🟡 warnings
- **Fail:** Any 🔴 item fails
- **Action on fail:** Block report submission, escalate to finance-lead
