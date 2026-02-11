# Pricing Change Checklist

## Meta
- **ID:** pricing-change
- **Squad:** finance
- **Used by:** pricing-strategist, pricing-review workflow
- **Trigger:** Before implementing any pricing change
- **Type:** quality-gate

## Items

### Analysis

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 1 | Cost basis updated | Current costs reflected in model | 🔴 |
| 2 | Margin target met | New price achieves target margin | 🔴 |
| 3 | Competitor analysis done | Competitor prices reviewed (<3 months) | 🟡 |

### Impact Assessment

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 4 | Customer impact estimated | Number of affected customers known | 🔴 |
| 5 | Revenue impact modeled | Expected revenue change calculated | 🔴 |
| 6 | Churn risk assessed | Potential churn estimated | 🟡 |

### Communication

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 7 | Customer notification planned | Communication plan exists | 🔴 |
| 8 | Grandfathering policy defined | Existing customer treatment decided | 🔴 |
| 9 | Sales team briefed | Sales knows new pricing | 🟡 |

### Implementation

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 10 | Effective date set | Clear implementation date | 🔴 |
| 11 | Systems updated | Billing systems reflect new prices | 🔴 |
| 12 | Documentation updated | All pricing docs updated | 🟡 |

## Gate Rule
- **Pass:** All 🔴 items pass + max 3 🟡 warnings
- **Fail:** Any 🔴 item fails
- **Action on fail:** Block pricing change, return to pricing-strategist
