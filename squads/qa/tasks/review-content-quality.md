# Review Content Quality

## Meta
- **ID:** review-content-quality
- **Squad:** qa
- **Executed by:** content-reviewer
- **Idempotent:** yes
- **Estimated tokens:** medium (1-5k)

## Purpose
Review content for accuracy, brand compliance, and quality standards.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| content | md | yes | marketing or design agent |
| content_brief | md | no | marketing or design agent |
| brand_guidelines | md | yes | data/brand-guidelines |

## Steps
1. Load content-review checklist
2. Verify factual accuracy of claims
3. Check spelling and grammar
4. Verify brand voice compliance
5. Test all links and CTAs
6. Document findings with severity

## Output
| Field | Type | Destination |
|-------|------|-------------|
| content_review | md | source agent |
| findings_list | yaml | qa-lead (if critical) |

## Validation
- All checklist items evaluated
- Links tested and verified
- Brand compliance checked

## Error Handling
- **If input missing:** Ask for content brief
- **If step fails:** Return partial review with issues noted
