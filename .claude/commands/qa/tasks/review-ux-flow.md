# Review UX Flow

## Meta
- **ID:** review-ux-flow
- **Squad:** qa
- **Executed by:** content-reviewer
- **Idempotent:** yes
- **Estimated tokens:** medium (1-5k)

## Purpose
Review user experience flow for usability and consistency.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| flow_url | text | yes | design or tech agent |
| user_journey | md | yes | design agent |
| expected_steps | yaml | yes | design agent |

## Steps
1. Walk through user journey step by step
2. Verify each step is achievable
3. Check for dead ends or confusion points
4. Verify error states are handled gracefully
5. Check loading states and feedback
6. Verify success states are clear

## Output
| Field | Type | Destination |
|-------|------|-------------|
| ux_review | md | design-lead |
| friction_points | yaml | design agent |

## Validation
- All journey steps tested
- Error states verified
- User can complete intended action

## Error Handling
- **If input missing:** Document blocked points in journey
- **If step fails:** Note where flow breaks down
