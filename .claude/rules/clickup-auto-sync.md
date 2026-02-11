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
