# Activity Logging Rules

## Overview

Sistema de logging automático com custo zero que captura tudo que acontece no AIOS.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 AUTO-CAPTURE (€0)                           │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Git Commits │  │ Stop Hook   │  │ Manual Log  │         │
│  │ (existing)  │  │ (new)       │  │ (optional)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│         │                │                │                 │
│         └────────────────┼────────────────┘                 │
│                          ▼                                  │
│               .aios/logs/activity/                          │
│               └── YYYY-MM-DD.jsonl                          │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              BATCH PROCESS (€0 - Ollama local)              │
│                                                             │
│  daily-digest.mjs (run end of day)                          │
│  - Summarize activities                                     │
│  - Extract decisions → .aios/memory/decisions/              │
│  - Extract patterns → .aios/learning/patterns/              │
│  - Update metrics                                           │
└─────────────────────────────────────────────────────────────┘
```

## What Gets Captured Automatically

| Source | Trigger | Content |
|--------|---------|---------|
| **Stop Hook** | Every session end | Files modified, commands run, decisions detected |
| **Git Commits** | Every commit | Changes, message, files |
| **ClickUp Sync** | Task updates | Task progress, status changes |

## Manual Logging (When Needed)

For important events not auto-captured, use the quick log:

```bash
# Quick log (minimal overhead)
node squads/ops/scripts/log.mjs "Mensagem" [--type=TYPE] [--files=a,b]

# Types auto-detected from keywords:
# - decision: decidir, escolher, optar, definir
# - error: erro, bug, fix, fail
# - implementation: implementar, criar, adicionar
# - action: default

# Examples:
node log.mjs "Decidimos usar JSONL para logs"
node log.mjs "Implementamos sistema de memory" --files=memory.ts,hooks.py
node log.mjs "Fixed auth bug" --type=error --files=auth.ts
```

## Viewing Logs

```bash
# View today's log
node squads/ops/scripts/activity-logger.mjs view --today

# View specific date
node squads/ops/scripts/activity-logger.mjs view --date=2025-02-11

# Statistics
node squads/ops/scripts/activity-logger.mjs stats
```

## Daily Digest

Run at end of day (or week) to process accumulated logs:

```bash
# Process today
node squads/ops/scripts/daily-digest.mjs

# Process specific date
node squads/ops/scripts/daily-digest.mjs --date=2025-02-11

# Preview without saving
node squads/ops/scripts/daily-digest.mjs --dry-run
```

**Output:**
- `.aios/logs/digests/YYYY-MM-DD.md` - Human-readable summary
- Updates to `.aios/memory/decisions/index.yaml`
- Updates to `.aios/learning/metrics/`

## Agent Guidelines

### When to Log Manually

Agents SHOULD manually log when:
1. Making important architectural decisions
2. Discovering significant bugs or issues
3. Implementing major features
4. Learning something that should be remembered

### How to Log (Inline)

```bash
# During task execution, add this when important
node squads/ops/scripts/log.mjs "Descrição da ação/decisão" --agent=@dev
```

### Integration with Memory Skills

After daily-digest runs:
- Decisions go to `/institutional-memory` store
- Patterns go to `/learning-loop` store
- Can be queried via `*remember` command

## Cost Analysis

| Component | Cost | Frequency |
|-----------|------|-----------|
| Stop Hook (session-logger.py) | €0 | Every session |
| Manual log (log.mjs) | €0 | As needed |
| Daily Digest (Ollama) | €0 | Daily |
| Daily Digest (fallback) | €0 | If Ollama unavailable |

**Total: €0/month for full activity logging**

## Files Reference

| File | Purpose |
|------|---------|
| `.claude/hooks/session-logger.py` | Auto-capture at session end |
| `squads/ops/scripts/log.mjs` | Quick manual logging |
| `squads/ops/scripts/activity-logger.mjs` | Full logging CLI |
| `squads/ops/scripts/daily-digest.mjs` | Batch processing |
| `.aios/logs/activity/*.jsonl` | Raw activity logs |
| `.aios/logs/digests/*.md` | Processed summaries |

---

*Activity Logging v1.0 - Zero-cost continuous capture*
