# Track OS Status

## Meta
- **ID:** track-os-status
- **Squad:** ops
- **Executed by:** ops-manager
- **Idempotent:** yes
- **Estimated tokens:** low (<1k)

## Purpose
Monitor and update OS status throughout its lifecycle.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| os_id | text | yes | ops-manager |
| new_status | text | yes | agent |
| status_definitions | yaml | yes | data/os-status-definitions.yaml |

## Steps
1. Retrieve current OS record
2. Validate status transition is allowed per status-definitions
3. Update status and timestamp
4. Check SLA timer and update
5. Log status change in history
6. Trigger notifications if required

## Output
| Field | Type | Destination |
|-------|------|-------------|
| updated_os | yaml | ops-manager |
| status_change_log | yaml | generate-status-report |

## Validation
- Status transition is valid per os-status-definitions.yaml
- Timestamp is updated
- SLA timer adjusted correctly

## Error Handling
- **If input missing:** Ask agent for status
- **If step fails:** Log error, keep previous status
