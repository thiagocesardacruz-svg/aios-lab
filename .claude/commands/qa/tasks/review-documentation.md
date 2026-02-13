# Review Documentation

## Meta
- **ID:** review-documentation
- **Squad:** qa
- **Executed by:** content-reviewer
- **Idempotent:** yes
- **Estimated tokens:** medium (1-5k)

## Purpose
Review technical or user documentation for accuracy and completeness.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| documentation | md | yes | tech or product agent |
| related_code | text | no | tech agent |
| doc_template | md | no | templates/ |

## Steps
1. Check document structure matches template
2. Verify all sections complete
3. Test code examples if present
4. Verify links and references
5. Check for outdated information
6. Verify terminology consistency

## Output
| Field | Type | Destination |
|-------|------|-------------|
| doc_review | md | source agent |
| issues_found | yaml | source agent |

## Validation
- All sections reviewed
- Code examples tested
- Links verified

## Error Handling
- **If input missing:** Review what's provided
- **If step fails:** Note untested sections
