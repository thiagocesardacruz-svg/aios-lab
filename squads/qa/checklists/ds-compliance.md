# Design System Compliance Checklist

## Meta
- **ID:** ds-compliance
- **Squad:** qa
- **Used by:** content-reviewer, validate-deliverable
- **Trigger:** Before accepting any UI deliverable
- **Type:** quality-gate

## Items

### Token Usage

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 1 | Colors from tokens | All colors reference design tokens | 🔴 |
| 2 | Spacing from tokens | All spacing uses token values | 🔴 |
| 3 | Typography from tokens | Font sizes/weights from tokens | 🔴 |
| 4 | No hardcoded values | Zero magic numbers in styles | 🔴 |

### Component Usage

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 5 | DS components used | Standard components used where available | 🔴 |
| 6 | No duplicate components | No custom versions of existing DS components | 🔴 |
| 7 | Component props correct | Props match DS component API | 🟡 |

### Patterns

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 8 | Layout follows patterns | Page layout matches DS templates | 🟡 |
| 9 | Forms follow patterns | Form structure matches DS patterns | 🟡 |
| 10 | Icons from DS set | Icons come from approved icon set | 🟡 |

### Documentation

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 11 | Component documented | New components have documentation | 🟡 |
| 12 | Variants documented | All variants shown in Storybook | 🟡 |

## Gate Rule
- **Pass:** All 🔴 items pass + max 3 🟡 warnings
- **Fail:** Any 🔴 item fails
- **Action on fail:** Return to design-system squad for alignment
