# ClickUp Auto-Sync (Summary)

## TL;DR
Agents MUST automatically sync tasks to ClickUp when working on user requests. Create tasks at start, update status during work, mark done with summary. Handover validation enforces Five Trust Behaviors when transferring work between agents.

## Critical Rules
- MUST: Create ClickUp task when starting multi-step work (>3 minutes)
- MUST: Use format `[AREA] Brief description` for task names
- MUST: Provide handover contract OR skip reason when marking tasks done
- NEVER: Skip handover validation for multi-agent workflows without documented reason
- NEVER: Mark task as "done" if tests failing, implementation partial, or errors unresolved

## Quick Reference

```bash
# Create task
node squads/ops/scripts/clickup-sync.mjs create "[Feature] Task name" --agent=@dev --squad=tech --impact=efficiency

# Start work
node clickup-sync.mjs start <task_id>

# Mark done (with handover)
node clickup-sync.mjs done <task_id> "Summary" --handover='{"from_agent":"@pm","to_agent":"@sm",...}'

# Emergency skip (requires reason)
node clickup-sync.mjs done <task_id> "Summary" --skip-handover --reason="Emergency hotfix"
```

## Full Documentation
See: `docs/rules/clickup-auto-sync-full.md` for complete sync workflow, handover contracts schema, and validation rules.
