# Balance Workload

## Meta
- **ID:** balance-workload
- **Squad:** ops
- **Executed by:** ops-manager
- **Idempotent:** yes
- **Estimated tokens:** medium (1-5k)

## Purpose
Analyze and rebalance OS assignments to prevent agent overload.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| active_os_list | yaml | yes | ops-manager |
| agent_workloads | yaml | yes | ops-manager |
| max_os_per_agent | number | yes | config |

## Steps
1. Calculate current OS count per agent
2. Identify overloaded agents (> max_os_per_agent)
3. Identify underloaded agents (< 50% of max)
4. For overloaded agents, select lowest-priority OS
5. Reassign to underloaded agents with matching skills
6. Update OS records with new assignments
7. Notify affected agents

## Output
| Field | Type | Destination |
|-------|------|-------------|
| rebalance_actions | yaml | ops-manager |
| notifications | yaml | affected agents |

## Validation
- No agent exceeds max_os_per_agent after rebalance
- Reassigned OS match agent capabilities
- All affected agents notified

## Error Handling
- **If input missing:** Use default max of 5 OS per agent
- **If step fails:** Escalate to ops-lead for manual rebalance
