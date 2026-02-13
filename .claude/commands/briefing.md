Generate and display the daily briefing.

Run the briefing script:
```bash
node squads/ops/scripts/briefing.mjs
```

Then read and display the contents of `.aios/briefings/latest.md` to the user.

If the script fails, manually gather:
1. `git log --since="today" --oneline` for recent commits
2. `git status --porcelain` for uncommitted changes
3. Read `.aios/memory/decisions/index.yaml` for recent decisions

Present the briefing in a clean, concise format answering:
- What happened (commits, activities)
- What needs attention (uncommitted changes, budget alerts)
- Budget status (daily/monthly)
- Recent decisions
