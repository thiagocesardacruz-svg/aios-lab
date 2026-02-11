# Budget Review Checklist

## Meta
- **ID:** budget-review
- **Squad:** finance
- **Used by:** finance-lead, budget-check workflow
- **Trigger:** Weekly or when threshold breached
- **Type:** quality-gate

## Items

### Current Status

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 1 | Daily limit compliance | No day exceeded €20 without approval | 🔴 |
| 2 | Weekly trend acceptable | Week-over-week increase <20% | 🟡 |
| 3 | Monthly projection OK | Projected month-end <= £400 | 🔴 |

### Squad Analysis

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 4 | No squad over-allocated | Each squad <= 25% of total | 🟡 |
| 5 | High-spend squads explained | Top 2 spenders have justification | 🟡 |
| 6 | Cost per OS reasonable | Avg cost/OS within expected range | 🟡 |

### Anomalies

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 7 | Spikes investigated | Any day >150% of avg investigated | 🔴 |
| 8 | Category distribution normal | No single category >50% of total | 🟡 |
| 9 | Unusual patterns flagged | Outliers documented | 🟡 |

### Forecast

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 10 | Runway acceptable | >6 months runway at current burn | 🔴 |
| 11 | Next month budget set | Following month allocation defined | 🟡 |

## Gate Rule
- **Pass:** All 🔴 items pass + max 4 🟡 warnings
- **Fail:** Any 🔴 item fails
- **Action on fail:** Escalate to user with budget recovery plan
