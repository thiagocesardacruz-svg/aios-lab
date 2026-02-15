# Production Engineering Processes — Implementation Guide

**Date:** 2026-02-15
**Status:** All 7 processes implemented and operational
**Total Cost:** €0/month (all deterministic)
**Total Dev Time:** ~4h (Board estimated 11h)

---

## Implemented Processes

### 1. Statistical Process Control (SPC) — `cycle-time.mjs`

**What:** Cycle time tracking with percentiles, standard deviation, and outlier detection (>2σ).

```bash
node squads/ops/scripts/cycle-time.mjs              # Full report
node squads/ops/scripts/cycle-time.mjs --by=agent    # By agent
node squads/ops/scripts/cycle-time.mjs --by=squad    # By squad
node squads/ops/scripts/cycle-time.mjs --bottleneck --by=agent  # With ToC analysis
node squads/ops/scripts/cycle-time.mjs --days=7      # Last 7 days
node squads/ops/scripts/cycle-time.mjs --format=json # JSON
```

**Metrics:** Avg CT, P50, P90, StdDev, Min/Max, WIP, Throughput, Outliers
**Targets:** CT <24h, WIP <5, Outliers = 0

---

### 2. Pre-flight Checks (Poka-Yoke) — `clickup-sync.mjs`

**What:** Validation before starting a task. Checks:
- Agent assigned?
- Squad assigned?
- WIP limit (<5) respected?
- Same agent already has task in progress?

**How:** Automatic when using `node clickup-sync.mjs start <task_id>`
- Blocks start if agent missing or WIP exceeded
- Use `--force` to override (logged)

---

### 3. Weekly Kaizen Report — `weekly-report.mjs`

**What:** Week-over-week comparison with trends, outliers, bottlenecks, and Kaizen suggestions.

```bash
node squads/ops/scripts/weekly-report.mjs              # Full report (saved to file)
node squads/ops/scripts/weekly-report.mjs --slack       # Slack-formatted
node squads/ops/scripts/weekly-report.mjs --format=json # JSON
```

**Output:** `.aios/reports/weekly/YYYY-WNN.md`
**Schedule:** Cron — Sunday 20:00
**Suggestions:** Deterministic rules (CT increase, throughput drop, WIP growth, outliers, variability)

---

### 4. Unified Dashboard (5 Metrics) — `dashboard-unified.mjs`

**What:** "3-second" dashboard combining 5 key metrics with health status.

```bash
node squads/ops/scripts/dashboard-unified.mjs              # Dashboard
node squads/ops/scripts/dashboard-unified.mjs --format=json # JSON
```

**Metrics:**
1. Cycle Time (from cycle-time.mjs)
2. WIP Count (from ClickUp)
3. Daily Budget (from command-center-data.json)
4. Monthly Cost (from command-center-data.json)
5. Outliers (from cycle-time.mjs)

**Health:** 🟢 HEALTHY (4-5 green) | 🟡 WARNING (3 green) | 🔴 CRITICAL (<3 green)

---

### 5. Bottleneck Detection (Theory of Constraints) — `cycle-time.mjs --bottleneck`

**What:** Identifies the constraint (agent/squad with highest P90) and recommends focus.

```bash
node squads/ops/scripts/cycle-time.mjs --by=agent --bottleneck
node squads/ops/scripts/cycle-time.mjs --by=squad --bottleneck
```

---

### 6. Closed-loop Corrective Actions — `daily-digest.mjs`

**What:** Deterministic rules added to daily digest that suggest improvements:
- High error count (≥3) → review error patterns
- Repetitive work (≥3x) → consider automating
- Decision fatigue (≥5 decisions) → document patterns
- Many changes without decisions → log rationale

**Schedule:** Cron — Daily 23:30
**Output:** `.aios/logs/digests/YYYY-MM-DD.md`

---

### 7. Value Stream Mapping — `value-stream-map.mjs`

**What:** Quarterly analysis of flow across squads/agents. Detects waste:
- Context switching (agent in >2 squads)
- Slow squads (avg CT >24h)
- Rubber stamp handovers (<5min completion)

```bash
node squads/ops/scripts/value-stream-map.mjs              # Last 90 days
node squads/ops/scripts/value-stream-map.mjs --days=180    # Custom period
node squads/ops/scripts/value-stream-map.mjs --format=json # JSON
```

**Output:** `.aios/reports/quarterly/YYYY-QN.md`
**Schedule:** Cron — 1st day of Jan/Apr/Jul/Oct at 10:00

---

## Automation Schedule

| Cron | Script | Frequency |
|------|--------|-----------|
| `30 23 * * *` | daily-digest.mjs | Every day 23:30 |
| `0 20 * * 0` | weekly-report.mjs | Sunday 20:00 |
| `0 10 1 1,4,7,10 *` | value-stream-map.mjs | Quarterly |
| `*/5 * * * *` | clickup_poller.py | Every 5 min (existing) |
| `*/30 * * * *` | spend_monitor.py | Every 30 min (existing) |
| `*/30 * * * *` | health_check.py | Every 30 min (existing) |

## On-Demand Commands

```bash
# Quick health check
node squads/ops/scripts/dashboard-unified.mjs

# Detailed cycle time
node squads/ops/scripts/cycle-time.mjs --by=agent --bottleneck

# Weekly summary
node squads/ops/scripts/weekly-report.mjs --slack

# Value stream (anytime)
node squads/ops/scripts/value-stream-map.mjs --days=30
```

## File Structure

```
.aios/
├── logs/
│   ├── activity/YYYY-MM-DD.jsonl     # Daily activity (auto-captured)
│   ├── digests/YYYY-MM-DD.md         # Daily digest + corrective actions
│   ├── cron-digest.log               # Cron output
│   ├── cron-weekly.log
│   └── cron-vsm.log
└── reports/
    ├── weekly/YYYY-WNN.md            # Weekly Kaizen reports
    └── quarterly/YYYY-QN.md          # Value stream maps
```

---

*All processes: €0/month | Deterministic | No AI required*
*Board recommendation implemented 2026-02-15 by @aios-master*
