# ClickUp Auto-Sync Rules

## Automatic Task Synchronization

When working on any task requested by the user, agents MUST automatically sync with ClickUp.

### When to Create ClickUp Task

Create a ClickUp task when:
1. User requests a new feature, fix, or task
2. Starting a multi-step workflow
3. Beginning work that will take more than a few minutes

Do NOT create for:
- Quick questions/answers
- Simple file reads
- Clarification requests

### How to Sync

Use the sync script at `squads/ops/scripts/clickup-sync.mjs`:

```bash
# Create task when starting work
node squads/ops/scripts/clickup-sync.mjs create "Task name" --agent=@<agent> --description="..."

# Mark as in progress
node squads/ops/scripts/clickup-sync.mjs start <task_id>

# When needing human input
node squads/ops/scripts/clickup-sync.mjs await-human <task_id> "What I need from you"

# When complete
node squads/ops/scripts/clickup-sync.mjs done <task_id> "Summary of what was done"

# Add progress comments
node squads/ops/scripts/clickup-sync.mjs comment <task_id> "Progress update"
```

### Task Naming Convention

Format: `[AREA] Brief description`

Examples:
- `[Setup] Configure ClickUp integration`
- `[Feature] Add user authentication`
- `[Fix] Resolve API timeout issue`
- `[Research] Analyze competitor features`

### Automatic Agent Mapping

| Agent | ClickUp Agent Field |
|-------|---------------------|
| @dev | @dev |
| @architect | @architect |
| @devops | @devops |
| @pm | @pm |
| @qa | @qa |
| @analyst | @analyst |

### Status Flow

```
inbox → to do → in progress → waiting (if needed) → review → done
```

### Example Workflow

1. User: "Create a new login page"
2. Agent creates ClickUp task: `[Feature] Create login page`
3. Agent starts work, updates status to "in progress"
4. Agent adds comment with progress
5. If blocked, moves to "waiting" with explanation
6. When done, marks "done" with summary

### Important

- Always capture the `task_id` from create command
- Use it for all subsequent updates
- Include meaningful descriptions and summaries

---

## Handover Validation (GOV-001.3)

When marking tasks as `done`, the system validates handover contracts to ensure complete context transfer between agents.

### When Handover Validation is Required

Handover validation is required when:
1. Task involves transfer to another agent
2. Task produces artifacts for downstream consumption
3. Task is part of a multi-agent workflow

Handover validation can be skipped for:
- Simple tasks (< 3 steps)
- Same-agent continuation
- Emergencies (with logged reason)

### How to Complete Tasks with Handover

**Option 1: Provide handover contract**

```bash
node squads/ops/scripts/clickup-sync.mjs done <task_id> "Summary" \
  --handover='{"from_agent":"@pm","to_agent":"@sm","artifact_type":"epic","verification":{"checklist_completed":true,"confidence":"high"}}'
```

**Option 2: Skip validation (emergency only)**

```bash
node squads/ops/scripts/clickup-sync.mjs done <task_id> "Summary" \
  --skip-handover --reason="Emergency hotfix"
```

### Handover Contract Structure

```yaml
handover_contract:
  from_agent: "@pm"
  to_agent: "@sm"
  artifact_type: "epic"  # epic | story | task | document | review

  verification:
    checklist_completed: true
    confidence: "high"  # low | medium | high
    evidence:           # Required when confidence < high
      - "Evidence item 1"
      - "Evidence item 2"

  paper_trail:
    clickup_task_id: "86c86efw9"

  next_actions:
    - "@sm: Create detailed stories"
```

### Five Trust Behaviors Enforcement

| Behavior | Enforcement |
|----------|-------------|
| Verification Before Claim | `evidence` required when confidence < high |
| Loud Failure | Validation errors surfaced, not silent |
| Honest Uncertainty | `confidence` field required |
| Paper Trail | Comment added to ClickUp with contract summary |
| Diligent Execution | `checklist_completed` must be true |

### Paper Trail

When a valid handover contract is provided, the system automatically:
1. Validates the contract against the schema
2. Creates a detailed comment on the ClickUp task
3. Records metrics (valid/invalid/skipped counts)

### Skip Logging

When handover is skipped, the system:
1. Requires a reason (`--reason`)
2. Logs the skip to `.aios/logs/handover-skips.log`
3. Adds a warning comment to the ClickUp task
4. Increments the `skipped_handovers` metric

### Graceful Degradation

If the handover validation system is unavailable (schema missing, script error):
- A warning is shown
- The task completion proceeds
- No blocking occurs

### Metrics

View handover metrics:

```bash
node squads/ops/scripts/handover-gate.mjs --metrics
```

Metrics tracked:
- `total_validations`
- `valid_handovers`
- `invalid_handovers`
- `skipped_handovers`
- `by_agent` (breakdown by from_agent)
- `by_artifact_type` (breakdown by type)

### Related Documentation

- Schema: `governance/schemas/handover-contract-schema.json`
- Rules: `.claude/rules/handover-contracts.md`
- Skill: `.claude/skills/handover-validator/`
- Gate Script: `squads/ops/scripts/handover-gate.mjs`
