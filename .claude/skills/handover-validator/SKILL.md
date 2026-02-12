---
name: handover-validator
description: |
  Validates handover contracts between AIOS agents, ensuring complete context transfer
  and enforcement of the Five Trust Behaviors. Blocks invalid handovers with clear
  error messages and suggestions for fixes.

auto_invoke: true
triggers:
  keywords:
    - "handover"
    - "handoff"
    - "transferir para"
    - "passar para @"
    - "delegate to"
    - "entregar para"
    - "handover contract"
    - "contrato de handover"
  patterns:
    - "(?i)@[a-z-]+.*recebe"
    - "(?i)handoff.*to.*@"
    - "(?i)pass.*to.*@"
    - "(?i)transfer.*to.*@"
agents_allowed: all
priority: high
confirm_before_invoke: false
---

# Handover Validator Skill

Validates handover contracts between AIOS agents, ensuring complete context transfer and enforcement of the Five Trust Behaviors.

## Overview

When agents transfer work (epics, stories, tasks), the handover contract ensures:
- **Complete context** is passed to the receiving agent
- **Five Trust Behaviors** are enforced
- **Paper trail** is maintained for auditability
- **Clear next actions** are defined

## Usage

### Automatic Invocation

The skill is automatically invoked when agents use handover keywords:
- "Passing to @dev for implementation"
- "Handover to @qa for review"
- "Transferir para @sm as stories"

### Manual Invocation

```
/handover-validator --contract contract.yaml
/handover-validator --quick  # Minimal validation
```

### In Code/Scripts

```javascript
const { validateHandover } = require('.claude/skills/handover-validator/scripts/validate-handover.js');

const result = await validateHandover(contract, { quick: false });
if (!result.valid) {
  console.error('Handover blocked:', result.errors);
  console.log('Suggestions:', result.suggestions);
}
```

## Validation Modes

### Full Validation (Default)

Validates all fields against the JSON schema:
- Required fields present
- Agent format (`@agent-name`)
- Artifact type valid
- Verification block complete
- Evidence present when confidence < high
- Paper trail fields

### Quick Mode (`--quick`)

Minimal validation for simple handovers:
- Only checks: `from_agent`, `to_agent`, `artifact_type`
- Skips verification and paper trail
- Use for tasks < 3 steps

## Contract Structure

### Minimal Contract

```yaml
handover_contract:
  from_agent: "@pm"
  to_agent: "@sm"
  artifact_type: "epic"
  verification:
    checklist_completed: true
    confidence: "high"
```

### Full Contract

```yaml
handover_contract:
  from_agent: "@architect"
  to_agent: "@dev"
  artifact_type: "story"
  artifact_id: "GOV-001.2"
  artifact_path: "docs/stories/GOV-001.2.md"

  required_fields:
    - acceptance_criteria
    - technical_specs

  verification:
    checklist_completed: true
    checklist_path: "checklists/story-ready.md"
    confidence: "high"
    evidence:
      - "Schema created and tested"
      - "Documentation complete"
    blockers: []

  paper_trail:
    clickup_task_id: "86c86efzy"
    timestamp: "2026-02-12T15:30:00Z"

  next_actions:
    - "@dev: Implement the skill"
    - "@qa: Review when complete"
```

## Five Trust Behaviors Enforcement

| Behavior | Validation |
|----------|------------|
| **Verification Before Claim** | `evidence` array must exist when confidence < high |
| **Loud Failure** | Validation errors are surfaced, not silent |
| **Honest Uncertainty** | `confidence` field required (low/medium/high) |
| **Paper Trail** | `paper_trail` with ClickUp ID encouraged |
| **Diligent Execution** | `checklist_completed` must be true |

## Error Messages

The validator provides clear, actionable error messages:

```
❌ Handover Validation Failed

Errors:
  1. Missing required field: verification
  2. Invalid agent format: pm (should be @pm)
  3. Evidence required when confidence is "medium"

Suggestions:
  1. Add verification block with checklist_completed and confidence
  2. Prefix agent name with @: @pm
  3. Add evidence array: ["Item 1", "Item 2"]

Schema: governance/schemas/handover-contract-schema.json
Rules: .claude/rules/handover-contracts.md
```

## Integration with ClickUp

When integrated with `clickup-sync.mjs`:
- Validates contract before marking tasks as `done`
- Creates paper trail comment on ClickUp task
- Blocks status transition if validation fails
- Supports `--skip-handover --reason "..."` for emergencies

## Files

- `SKILL.md` - This file
- `scripts/validate-handover.js` - Validation logic
- `references/five-trust-behaviors.md` - Reference documentation

## Related

- **Schema**: `governance/schemas/handover-contract-schema.json`
- **Rules**: `.claude/rules/handover-contracts.md`
- **Epic**: AIOS-GOV-001 (Handover Contracts System)
