# Monitor SLA

## Meta
- **ID:** monitor-sla
- **Squad:** ops
- **Executed by:** ops-manager
- **Idempotent:** yes
- **Estimated tokens:** low (<1k)

## Purpose
Check all active OS against SLA thresholds and trigger alerts or escalations.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| active_os_list | yaml | yes | ops-manager |
| sla_definitions | yaml | yes | data/sla-definitions.yaml |
| current_time | text | yes | system |

## Steps
1. Retrieve all OS with status in-progress or assigned
2. For each OS, calculate time elapsed since assignment
3. Compare against SLA tier (based on priority)
4. Flag OS at warning threshold (80% of SLA)
5. Flag OS at breach threshold (100% of SLA)
6. Trigger escalation for breached OS

## Output
| Field | Type | Destination |
|-------|------|-------------|
| sla_status_report | yaml | generate-status-report |
| escalation_triggers | yaml | escalate-issue |

## Validation
- All active OS checked
- Breaches correctly identified
- Escalations triggered for all breaches

## Error Handling
- **If input missing:** Use default SLA tier
- **If step fails:** Log error, continue with remaining OS
