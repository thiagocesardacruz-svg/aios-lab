# Accessibility Audit Checklist

## Meta
- **ID:** accessibility-audit
- **Squad:** qa
- **Used by:** content-reviewer, check-accessibility task
- **Trigger:** Before publishing web content or releasing UI
- **Type:** compliance

## Items

### Perceivable

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 1 | Images have alt text | All images have descriptive alt attributes | 🔴 |
| 2 | Color contrast sufficient | Text contrast ratio >= 4.5:1 (AA) | 🔴 |
| 3 | Video has captions | All videos have accurate captions | 🟡 |
| 4 | Audio has transcript | Audio content has text alternative | 🟡 |

### Operable

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 5 | Keyboard navigable | All functions accessible via keyboard | 🔴 |
| 6 | Focus visible | Focus indicator clearly visible | 🔴 |
| 7 | No keyboard traps | User can navigate away from all elements | 🔴 |
| 8 | Skip links present | Skip to main content link available | 🟡 |

### Understandable

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 9 | Language declared | HTML lang attribute set correctly | 🔴 |
| 10 | Form labels present | All form inputs have associated labels | 🔴 |
| 11 | Error messages clear | Form errors described and linked to field | 🟡 |

### Robust

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 12 | Valid HTML | No parsing errors in HTML | 🟡 |
| 13 | ARIA used correctly | ARIA attributes valid and appropriate | 🔴 |

## Gate Rule
- **Pass:** All 🔴 items pass + max 2 🟡 warnings
- **Fail:** Any 🔴 item fails
- **Action on fail:** Return to design/dev with specific WCAG violations
