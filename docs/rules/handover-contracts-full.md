# Handover Contracts Rules

## Overview

Handover contracts formalize the transfer of work between AIOS agents, ensuring complete context transfer, traceability, and enforcement of the Five Trust Behaviors.

**Schema Location:** `governance/schemas/handover-contract-schema.json`

---

## When Handover Contracts are REQUIRED

Handover contracts are **mandatory** in these scenarios:

### 1. Cross-Agent Artifact Transfer
When an artifact (epic, story, task) is transferred from one agent to another:

| From | To | Artifact | Required |
|------|-----|----------|----------|
| @pm | @sm | Epic | YES |
| @sm | @dev | Story | YES |
| @architect | @dev | Architecture specs | YES |
| @dev | @qa | Implementation | YES |
| @qa | @devops | Validated code | YES |

### 2. Status Transitions in ClickUp
Before marking a task as `done` in ClickUp, a handover contract must be validated if:
- The task will be picked up by another agent
- The task produces artifacts for downstream consumption
- The task is part of a multi-agent workflow

### 3. Sprint Boundaries
At sprint boundaries when work is:
- Carried over to next sprint
- Transferred to different agent/team
- Blocked and needs escalation

---

## When Handover Contracts are OPTIONAL

Handover contracts can be skipped (`--skip-handover`) for:

### 1. Simple Tasks (< 3 steps)
- Single file edits
- Quick fixes
- Documentation typos

### 2. Same-Agent Continuation
- Agent continues their own work in new session
- No context transfer to different agent

### 3. Emergencies (with logging)
- Hotfixes requiring immediate deployment
- Must provide `--reason` when skipping
- Logged for audit trail

---

## Five Trust Behaviors Mapping

The schema enforces all five trust behaviors:

| Behavior | Schema Field | Enforcement |
|----------|-------------|-------------|
| **Verification Before Claim** | `verification.evidence` | Cannot claim "done" without evidence array |
| **Loud Failure** | `verification.blockers` | Must surface any known issues |
| **Honest Uncertainty** | `verification.confidence` | Required enum: low/medium/high |
| **Paper Trail** | `paper_trail.*` | ClickUp ID, git commit, timestamp |
| **Diligent Execution** | `verification.checklist_completed` | Boolean must be true |

### Confidence + Evidence Rule

```
IF confidence = "low" OR confidence = "medium"
THEN evidence[] MUST have at least 1 item
```

This enforces that uncertain handovers must provide supporting evidence.

---

## Contract Structure

### Minimal Contract (Quick Mode)

```yaml
handover_contract:
  from_agent: "@pm"
  to_agent: "@sm"
  artifact_type: "story"
  verification:
    checklist_completed: true
    confidence: "high"
```

### Standard Contract

```yaml
handover_contract:
  from_agent: "@pm"
  to_agent: "@sm"
  artifact_type: "epic"
  artifact_id: "AIOS-GOV-001"
  artifact_path: "docs/epics/AIOS-GOV-001.md"

  required_fields:
    - business_context
    - success_metrics
    - scope_boundaries

  verification:
    checklist_completed: true
    checklist_path: "checklists/epic-ready.md"
    confidence: "high"
    evidence:
      - "Epic document created"
      - "ClickUp task synced"
      - "3 stories defined"

  paper_trail:
    clickup_task_id: "86c86efw9"
    timestamp: "2026-02-12T14:30:00Z"

  next_actions:
    - "@sm: Create detailed stories"
    - "@architect: Review schema design"
```

### Full Contract (with Context)

```yaml
handover_contract:
  from_agent: "@architect"
  to_agent: "@dev"
  artifact_type: "story"
  artifact_id: "GOV-001.1"
  artifact_path: "docs/stories/GOV-001.1.md"

  required_fields:
    - acceptance_criteria
    - technical_specs
    - files_to_modify

  verification:
    checklist_completed: true
    checklist_path: "checklists/story-ready-for-dev.md"
    confidence: "high"
    evidence:
      - "Schema JSON created and validated"
      - "Governance rules documented"
      - "Squad template updated"
    blockers: []
    assumptions:
      - "ajv library available for validation"

  context:
    summary: "Created handover contract schema implementing Five Trust Behaviors"
    decisions_made:
      - decision: "Use JSON Schema draft-07"
        rationale: "Wide tooling support, ajv compatibility"
        alternatives_considered:
          - "JSON Schema 2020-12 (less tooling)"
          - "Custom YAML schema (non-standard)"
    files_modified:
      - "governance/schemas/handover-contract-schema.json"
      - ".claude/rules/handover-contracts.md"
      - "squads/_template/squad.yaml"

  paper_trail:
    clickup_task_id: "86c86efzv"
    clickup_url: "https://app.clickup.com/t/86c86efzv"
    git_branch: "feature/GOV-001.1-handover-schema"
    timestamp: "2026-02-12T15:00:00Z"

  next_actions:
    - "@dev: Implement /handover-validator skill"
    - "@qa: Validate schema with test cases"

  metadata:
    schema_version: "1.0.0"
    priority: "high"
    tags:
      - governance
      - schema
      - trust-behaviors
```

---

## Validation Rules

### Required Fields by Artifact Type

| Artifact Type | Required Fields |
|---------------|-----------------|
| epic | business_context, success_metrics, scope_boundaries |
| story | acceptance_criteria, tasks, dev_notes |
| task | description, files_to_modify, verification_criteria |
| document | purpose, audience, sections |
| review | findings, recommendations, severity |
| deployment | environment, rollback_plan, verification_steps |
| research | methodology, findings, recommendations |

### Agent Compatibility Matrix

| From Agent | Valid To Agents |
|------------|-----------------|
| @pm | @sm, @architect, @analyst |
| @sm | @dev, @qa, @architect |
| @architect | @dev, @devops, @data-engineer |
| @dev | @qa, @devops |
| @qa | @dev (fixes), @devops (approved) |
| @devops | @dev (issues), @pm (reports) |

---

## Integration with ClickUp

### Automatic Paper Trail

When a handover contract is validated, the ClickUp sync script:

1. Creates a comment on the task with contract summary
2. Updates custom field "Last Handover" with timestamp
3. Logs handover to `.aios/logs/handovers.log`

### Status Transition Gate

```
┌─────────────────────────────────────────────────────────────┐
│                  clickup-sync.mjs done                      │
│                                                             │
│  1. Check if handover validation enabled                    │
│  2. Load handover contract from context                     │
│  3. Validate against schema                                 │
│  4. IF invalid: BLOCK transition, show errors               │
│  5. IF valid: proceed, create paper trail comment           │
└─────────────────────────────────────────────────────────────┘
```

### Skip Flag Usage

```bash
# Emergency skip (requires reason)
node clickup-sync.mjs done <task_id> --skip-handover --reason "Emergency hotfix"

# This will:
# - Log the skip to .aios/logs/handover-skips.log
# - Add warning comment to ClickUp task
# - Emit console warning
```

---

## Graceful Degradation

The handover system operates in three modes:

| Mode | Behavior | When |
|------|----------|------|
| **enforce** | Block invalid handovers | Production workflows |
| **warn** | Warn but allow | Development/testing |
| **disabled** | No validation | Legacy compatibility |

Configure in `core-config.yaml`:

```yaml
handover_validation:
  enabled: true
  mode: "warn"  # enforce | warn | disabled
  skip_allowed: true
  log_path: ".aios/logs/handovers.log"
```

---

## Best Practices

### DO

- Include specific evidence for each claim
- Document decisions and their rationale
- List explicit next actions for receiving agent
- Use confidence: "medium" if you have any doubts
- Include file paths for modified artifacts

### DON'T

- Skip handover for multi-agent workflows
- Use confidence: "high" without evidence
- Leave blockers undocumented
- Assume receiving agent has context

---

## Related Documentation

- Epic: `docs/epics/AIOS-GOV-001-handover-contracts.md`
- Schema: `governance/schemas/handover-contract-schema.json`
- Skill: `.claude/skills/handover-validator/` (Story GOV-001.2)
- ClickUp Integration: `.claude/rules/clickup-auto-sync.md`

---

*Handover Contracts v1.0 - AIOS Governance Framework*
