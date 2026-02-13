# Escalation Template

## Meta
- **ID:** escalation-tmpl
- **Squad:** ops
- **Used by:** escalate-issue
- **Output format:** md
- **Version:** 1.0.0

## Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `{{escalation_id}}` | Unique escalation identifier | yes | none |
| `{{os_id}}` | Related OS identifier | yes | none |
| `{{escalation_level}}` | Current escalation level (1-3) | yes | none |
| `{{trigger_reason}}` | Why escalation was triggered | yes | none |
| `{{original_assignee}}` | Who was originally assigned | yes | none |
| `{{escalated_to}}` | Who is now responsible | yes | none |
| `{{escalation_time}}` | When escalation occurred | yes | none |
| `{{context}}` | Summary of the issue | yes | none |
| `{{required_action}}` | What needs to happen | yes | none |
| `{{deadline}}` | When this must be resolved | yes | none |

## Template

---BEGIN TEMPLATE---

# ⚠️ Escalation Notice

**ID:** {{escalation_id}}
**Level:** {{escalation_level}}
**Time:** {{escalation_time}}

## Related OS

**OS ID:** {{os_id}}

## Trigger

{{trigger_reason}}

## Context

{{context}}

## Routing

| From | To |
|------|-----|
| {{original_assignee}} | {{escalated_to}} |

## Required Action

{{required_action}}

## Deadline

**Must be resolved by:** {{deadline}}

---

*Escalation generated per escalation-matrix.yaml*

---END TEMPLATE---

## Usage Notes
- Escalations are automatically generated when SLA thresholds are breached
- Level 3 escalations always notify the user/stakeholder
- Include enough context for recipient to act without additional research
