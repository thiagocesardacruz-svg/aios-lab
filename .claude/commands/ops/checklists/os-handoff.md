# OS Handoff Checklist

## Meta
- **ID:** os-handoff
- **Squad:** ops
- **Used by:** ops-manager, assign-agent, route-request
- **Trigger:** Before assigning OS to an agent or squad
- **Type:** pre-flight

## Items

### Completeness

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 1 | OS has valid ID | ID matches format OS-YYYY-NNNN | 🔴 |
| 2 | Requester identified | requester field is not empty | 🔴 |
| 3 | Description provided | description has >20 characters | 🔴 |
| 4 | Priority set | priority is one of: critical, high, normal, low | 🔴 |

### Routing

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 5 | Target squad identified | squad field matches squad-registry.yaml | 🔴 |
| 6 | Assignee available | assignee is not overloaded (< 5 active OS) | 🟡 |
| 7 | No circular dependency | OS does not depend on itself or create cycle | 🔴 |

### Context

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 8 | Inputs provided | required inputs for target workflow present | 🔴 |
| 9 | Success criteria defined | at least 1 acceptance criterion stated | 🟡 |
| 10 | Deadline reasonable | deadline > now + estimated_time | 🟡 |

## Gate Rule
- **Pass:** All 🔴 items pass + max 2 🟡 warnings
- **Fail:** Any 🔴 item fails
- **Action on fail:** Return to requester with missing items noted
