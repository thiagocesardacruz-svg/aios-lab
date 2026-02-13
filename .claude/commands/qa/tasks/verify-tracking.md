# Verify Tracking

## Meta
- **ID:** verify-tracking
- **Squad:** qa
- **Executed by:** content-reviewer
- **Idempotent:** yes
- **Estimated tokens:** low (<1k)

## Purpose
Verify analytics and tracking codes are properly implemented.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| page_url | text | yes | marketing or tech agent |
| expected_tracking | yaml | yes | marketing agent |

## Steps
1. Load page and inspect tracking scripts
2. Verify Google Analytics/GTM present
3. Verify Facebook Pixel if required
4. Check UTM parameters preserved
5. Verify conversion tracking on forms
6. Test event firing on key actions

## Output
| Field | Type | Destination |
|-------|------|-------------|
| tracking_status | text | source agent |
| missing_tracking | yaml | source agent (if any) |

## Validation
- All required tracking codes present
- Events fire correctly
- No console errors from tracking

## Error Handling
- **If input missing:** Check for standard GA/GTM
- **If step fails:** Document what couldn't be verified
