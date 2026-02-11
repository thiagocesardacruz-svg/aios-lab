# Assign Agent

## Meta
- **ID:** assign-agent
- **Squad:** ops
- **Executed by:** ops-manager
- **Idempotent:** yes
- **Estimated tokens:** low (<1k)

## Purpose
Assign an OS to a specific agent within the target squad based on workload and expertise.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| os_record | yaml | yes | route-request |
| target_squad | text | yes | route-request |
| squad_agents | yaml | yes | squads/{squad}/agents/ |

## Steps
1. List available agents in target squad
2. Check current workload per agent (active OS count)
3. Match OS requirements to agent capabilities
4. Select agent with best fit and lowest load
5. Update OS record with assignee
6. Transition OS status to "assigned"

## Output
| Field | Type | Destination |
|-------|------|-------------|
| assigned_agent | text | os_record |
| updated_os | yaml | track-os-status |

## Validation
- Agent is member of target squad
- Agent has < 5 active OS
- OS status changed to "assigned"

## Error Handling
- **If input missing:** Return to route-request
- **If step fails:** Escalate to ops-lead
