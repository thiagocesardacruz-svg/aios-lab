# Handover Contracts (Summary)

## TL;DR
Formalize work transfer between agents with contracts that enforce Five Trust Behaviors. Required for cross-agent artifact transfers, ClickUp status transitions, and sprint boundaries.

## Critical Rules
- MUST: Provide handover contract when transferring artifacts between agents (epic, story, task, etc.)
- MUST: Include evidence when confidence is "low" or "medium"
- MUST: Set `checklist_completed: true` before handover
- NEVER: Use confidence "high" without supporting evidence
- NEVER: Skip handover for multi-agent workflows without logged reason

## Minimal Contract Example

```yaml
handover_contract:
  from_agent: "@pm"
  to_agent: "@sm"
  artifact_type: "story"
  verification:
    checklist_completed: true
    confidence: "high"
    evidence:
      - "Story document created"
      - "Acceptance criteria defined"
  paper_trail:
    clickup_task_id: "86c86efw9"
  next_actions:
    - "@sm: Create detailed stories"
```

## Full Documentation
See: `docs/rules/handover-contracts-full.md` for complete contract structures, validation rules, agent compatibility matrix, and integration details.

Schema: `governance/schemas/handover-contract-schema.json`
