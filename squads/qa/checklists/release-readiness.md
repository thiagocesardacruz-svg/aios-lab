# Release Readiness Checklist

## Meta
- **ID:** release-readiness
- **Squad:** qa
- **Used by:** qa-lead, release-gate workflow
- **Trigger:** Before any release to production
- **Type:** quality-gate

## Items

### Code Quality

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 1 | Build succeeds | Build completes without errors | 🔴 |
| 2 | Tests pass | All automated tests pass | 🔴 |
| 3 | No critical bugs | Zero critical severity bugs open | 🔴 |
| 4 | No major bugs | Zero major severity bugs open | 🔴 |

### Documentation

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 5 | Release notes complete | Release notes document exists and is complete | 🔴 |
| 6 | API docs updated | If API changed, docs reflect changes | 🟡 |
| 7 | User-facing docs updated | Help/guide content updated if needed | 🟡 |

### Operations

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 8 | Rollback plan exists | Documented rollback procedure | 🔴 |
| 9 | Monitoring configured | Alerts and dashboards ready | 🟡 |
| 10 | Stakeholder approval | Product owner sign-off obtained | 🔴 |

### Compliance

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 11 | Security review done | Security checklist passed | 🔴 |
| 12 | Performance acceptable | Meets performance SLAs | 🟡 |
| 13 | Accessibility verified | WCAG AA compliance confirmed | 🟡 |

## Gate Rule
- **Pass:** All 🔴 items pass + max 3 🟡 warnings
- **Fail:** Any 🔴 item fails
- **Action on fail:** Block release, notify qa-lead and stakeholder
