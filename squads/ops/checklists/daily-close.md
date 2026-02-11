# Daily Close Checklist

## Meta
- **ID:** daily-close
- **Squad:** ops
- **Used by:** ops-manager, daily-standup workflow
- **Trigger:** End of each business day
- **Type:** post-delivery

## Items

### Status Updates

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 1 | All active OS have status update | Each in-progress OS updated in last 8 hours | 🟡 |
| 2 | Blocked OS have blocker reason | All blocked OS have blocker_reason field filled | 🔴 |
| 3 | No orphan OS | No OS without assignee in non-draft status | 🔴 |

### Cost Tracking

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 4 | Daily cost logged | cost-log entry exists for today | 🔴 |
| 5 | Cost within daily limit | daily total < €20 hard limit | 🔴 |
| 6 | Alert threshold checked | if > €15, alert was generated | 🟡 |

### SLA Compliance

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 7 | SLA breaches documented | Any breaches logged with reason | 🔴 |
| 8 | Escalations resolved or noted | No pending escalations without action | 🟡 |

### Reporting

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 9 | Daily report generated | daily-report exists for today | 🟡 |
| 10 | Notion synced | Last sync < 4 hours ago | 🟡 |

## Gate Rule
- **Pass:** All 🔴 items pass + max 3 🟡 warnings
- **Fail:** Any 🔴 item fails
- **Action on fail:** Notify ops-lead before EOD
