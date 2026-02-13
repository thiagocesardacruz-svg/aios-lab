# Check Brand Compliance

## Meta
- **ID:** check-brand-compliance
- **Squad:** qa
- **Executed by:** content-reviewer
- **Idempotent:** yes
- **Estimated tokens:** low (<1k)

## Purpose
Verify content or design adheres to brand guidelines and voice.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| artifact | any | yes | design or marketing agent |
| brand_guidelines | md | yes | design/data/brand-visual-rules.md |

## Steps
1. Compare colors against brand palette
2. Verify typography matches brand fonts
3. Check logo usage follows guidelines
4. Verify tone matches brand voice
5. Check terminology uses approved terms

## Output
| Field | Type | Destination |
|-------|------|-------------|
| compliance_status | text | source agent |
| deviations | yaml | source agent (if any) |

## Validation
- All brand elements checked
- Deviations documented with reference

## Error Handling
- **If input missing:** Request brand guidelines location
- **If step fails:** Escalate to design-lead
