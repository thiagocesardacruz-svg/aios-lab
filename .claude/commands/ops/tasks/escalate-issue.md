# Escalate Issue

## Meta
- **ID:** escalate-issue
- **Squad:** ops
- **Executed by:** ops-manager
- **Idempotent:** no
- **Estimated tokens:** low (<1k)

## Purpose
Escalate a blocked or breached OS to the appropriate authority per escalation matrix.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| os_record | yaml | yes | monitor-sla |
| escalation_reason | text | yes | monitor-sla |
| escalation_matrix | yaml | yes | data/escalation-matrix.yaml |

## Steps
1. Determine escalation trigger type (sla-breach, blocked, cost-overrun)
2. Look up escalation path in matrix
3. Determine current escalation level
4. Generate escalation notice using escalation-tmpl
5. Notify escalation target
6. Update OS status to "escalated"
7. Log escalation event

## Output
| Field | Type | Destination |
|-------|------|-------------|
| escalation_notice | md | escalation_target |
| updated_os | yaml | track-os-status |

## Validation
- Escalation target notified
- OS status updated to escalated
- Escalation logged with timestamp

## Error Handling
- **If input missing:** Use default escalation path (ops-lead)
- **If step fails:** Escalate to ops-lead directly
