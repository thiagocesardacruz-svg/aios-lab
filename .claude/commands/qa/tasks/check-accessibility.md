# Check Accessibility

## Meta
- **ID:** check-accessibility
- **Squad:** qa
- **Executed by:** content-reviewer
- **Idempotent:** yes
- **Estimated tokens:** medium (1-5k)

## Purpose
Verify web content meets WCAG AA accessibility standards.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| page_url | text | yes | tech or design agent |
| accessibility_checklist | md | yes | checklists/accessibility-audit.md |

## Steps
1. Run automated accessibility scan
2. Check color contrast ratios
3. Verify keyboard navigation
4. Test with screen reader simulation
5. Check image alt texts
6. Verify form labels and ARIA
7. Document all violations

## Output
| Field | Type | Destination |
|-------|------|-------------|
| accessibility_report | md | source agent |
| wcag_violations | yaml | source agent (if any) |

## Validation
- All WCAG AA criteria checked
- Violations categorized by severity
- Remediation guidance provided

## Error Handling
- **If input missing:** Abort with error
- **If step fails:** Generate partial report with tested items
