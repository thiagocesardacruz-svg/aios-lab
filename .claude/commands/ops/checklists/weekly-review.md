# Weekly Review Checklist

## Meta
- **ID:** weekly-review
- **Squad:** ops
- **Used by:** ops-lead, weekly-review workflow
- **Trigger:** Every Friday EOD or Monday morning
- **Type:** quality-gate

## Items

### Throughput

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 1 | Completion rate acceptable | OS completed / OS created >= 80% | 🟡 |
| 2 | No OS older than 7 days | All OS created >7 days ago are completed or have exception | 🔴 |
| 3 | Backlog under control | Total open OS < 20 | 🟡 |

### Budget

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 4 | Weekly cost within budget | Weekly total < £100 (25% of monthly) | 🔴 |
| 5 | No squad over-budget | Each squad < allocated budget | 🟡 |
| 6 | Cost anomalies investigated | Any day >€20 has documented reason | 🔴 |

### Quality

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 7 | SLA compliance > 90% | >= 90% of OS met SLA | 🔴 |
| 8 | Rework rate < 10% | OS returned for revision < 10% | 🟡 |
| 9 | Escalation rate < 5% | Escalations / total OS < 5% | 🟡 |

### Process

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 10 | All daily reports exist | 5 daily reports for the week (Mon-Fri) | 🟡 |
| 11 | Notion fully synced | All OS reflected in Notion | 🔴 |
| 12 | Bottlenecks identified | If completion rate <80%, bottleneck analysis done | 🔴 |

## Gate Rule
- **Pass:** All 🔴 items pass + max 4 🟡 warnings
- **Fail:** Any 🔴 item fails
- **Action on fail:** Escalate to user with improvement plan
