# Expense Approval Checklist

## Meta
- **ID:** expense-approval
- **Squad:** finance
- **Used by:** controller, budget-check workflow
- **Trigger:** Before approving any expense request
- **Type:** pre-flight

## Items

### Budget Verification

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 1 | Budget available | Expense <= remaining budget | 🔴 |
| 2 | Category valid | Expense category exists in cost-categories.yaml | 🔴 |
| 3 | Squad allocation | Squad has allocation for this type | 🟡 |

### Justification

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 4 | Business purpose stated | Clear reason for expense | 🔴 |
| 5 | Alternative considered | Cheaper alternatives evaluated | 🟡 |
| 6 | ROI estimated | Expected return documented if >€10 | 🟡 |

### Authorization

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 7 | Requester authorized | Requester can request this type | 🔴 |
| 8 | Approval level correct | Amount within approver's limit | 🔴 |

### Documentation

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 9 | OS linked | Expense linked to valid OS | 🟡 |
| 10 | Receipt/evidence attached | Supporting documentation present | 🟡 |

## Gate Rule
- **Pass:** All 🔴 items pass + max 2 🟡 warnings
- **Fail:** Any 🔴 item fails
- **Action on fail:** Reject expense, notify requester with reason
