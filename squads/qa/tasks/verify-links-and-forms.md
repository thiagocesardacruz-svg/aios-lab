# Verify Links and Forms

## Meta
- **ID:** verify-links-and-forms
- **Squad:** qa
- **Executed by:** content-reviewer
- **Idempotent:** yes
- **Estimated tokens:** medium (1-5k)

## Purpose
Test all links and forms in a deliverable to ensure they work correctly.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| artifact_url | text | yes | source agent |
| expected_links | yaml | no | source agent |

## Steps
1. Crawl artifact to extract all links
2. Test each link for valid response (200 OK)
3. Identify and test all forms
4. Submit forms with test data
5. Verify form submissions succeed
6. Document broken links/forms

## Output
| Field | Type | Destination |
|-------|------|-------------|
| link_report | yaml | source agent |
| broken_items | yaml | source agent (if any) |

## Validation
- All links return 200 or valid redirect
- All forms submit successfully
- No 404 or 500 errors

## Error Handling
- **If input missing:** Attempt to extract links from content
- **If step fails:** Log partial results, continue with remaining items
