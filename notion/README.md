# Notion Command Center

> Database specifications for the AIOS Command Center in Notion.

## Overview

The Command Center is the visual dashboard for Travel Tech Digital operations.
It provides real-time visibility into Service Orders, costs, agents, and projects.

**Important:** YAML files are the source of truth. Notion is a derived view.

## Databases

| Database | Purpose | Sync Direction |
|----------|---------|----------------|
| Service Orders | Track OS execution | YAML → Notion |
| Projects | Group related OS | Manual + YAML |
| Agents | Agent registry | YAML → Notion |
| Commands | Available commands | YAML → Notion |
| Cost Log | Daily cost tracking | YAML → Notion |
| Squads | Squad registry | YAML → Notion |

## Setup Instructions

1. Create a new Notion workspace or use existing
2. Create an integration at https://www.notion.so/my-integrations
3. Create databases from specifications in `/databases/`
4. Share databases with the integration
5. Set environment variables (see scripts/README.md)
6. Run initial sync: `node scripts/sync-yaml-to-notion.js`

## Database Relationships

```
Projects (1) ─────────┬──────────> Service Orders (N)
                      │
Squads (1) ───────────┼──────────> Service Orders (N)
                      │
Agents (N) ───────────┘

Commands (N) ─────────> Squads (1)

Cost Log (N) ─────────> Service Orders (1)
```

## Views

Each database should have these views:

### Service Orders
- **Kanban**: Group by Status
- **By Squad**: Group by Squad
- **Calendar**: By Created date
- **Blocked**: Filter status=blocked
- **Today**: Filter created_at=today

### Projects
- **Active**: Filter status=active
- **Timeline**: Calendar view

### Costs
- **Daily**: Group by Date
- **By Squad**: Group by Squad
- **By Category**: Group by Category
- **Alerts**: Filter cost > threshold

## Permissions

| Role | Service Orders | Projects | Agents | Commands | Costs |
|------|----------------|----------|--------|----------|-------|
| Director | Full | Full | Full | Full | Full |
| Squad Lead | Edit (own squad) | View | View | View | View (own) |
| Agent | View | View | View | View | - |
| External | - | - | - | - | - |

## Automation

Recommended automations (via Notion API or Zapier):

1. **Daily Cost Report**: Email summary at EOD
2. **Blocked Alert**: Slack when OS blocked > 24h
3. **Budget Alert**: Notify when daily cost > €15
4. **Weekly Summary**: Create summary page Fridays
