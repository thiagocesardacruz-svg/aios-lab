# Activity Logging (Summary)

## TL;DR
Zero-cost automatic logging system captures all AIOS activities (git commits, session ends, task updates). Manual logging available for important decisions. Daily digest processes logs using local Ollama.

## Critical Rules
- MUST: Let automatic capture handle routine logging (stop hooks, git commits, ClickUp sync)
- SHOULD: Manually log important architectural decisions or significant discoveries
- MUST: Use `node squads/ops/scripts/log.mjs` for manual logging
- NEVER: Use external paid APIs for logging (always €0 cost)

## Quick Reference

```bash
# Manual log (auto-detects type from keywords)
node squads/ops/scripts/log.mjs "Decision: Use JSONL format" --agent=@dev

# View today's log
node squads/ops/scripts/activity-logger.mjs view --today

# Run daily digest (processes logs with Ollama)
node squads/ops/scripts/daily-digest.mjs
```

**Auto-capture sources:** Stop Hook (session end), Git Commits, ClickUp Sync
**Output:** `.aios/logs/activity/YYYY-MM-DD.jsonl` → Daily digests + institutional memory

## Full Documentation
See: `docs/rules/activity-logging-full.md` for architecture details, integration with memory skills, and all logging commands.
