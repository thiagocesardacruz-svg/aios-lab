# Notion Command Center

> Database specifications for the AIOS Command Center in Notion.

## Overview

The Command Center is the visual dashboard for Travel Tech Digital operations.
It provides real-time visibility into Service Orders, costs, agents, and projects.

**IMPORTANT: Notion is the SOURCE OF TRUTH for Agents and Commands.**
Code registry files are derived views, generated via sync scripts.

## Sync Direction

| Database | Source | Direction | Script |
|----------|--------|-----------|--------|
| **Agents** | Notion | Notion → Code | `sync-notion-to-code.js` |
| **Commands** | Notion | Notion → Code | `sync-notion-to-code.js` |
| Service Orders | YAML | YAML → Notion | `sync-yaml-to-notion.js` |
| Projects | Manual | Manual + YAML | - |
| Cost Log | YAML | YAML → Notion | `sync-yaml-to-notion.js` |
| Squads | Notion | Notion → Code | (future) |

## Generated Files

When you run `npm run sync:from-notion` from the `scripts/` folder:

| Notion Database | Generated File |
|-----------------|----------------|
| Agents | `squads/_registry/agents-directory.csv` |
| Commands | `squads/_registry/command-library.csv` |

## Databases

| Database | Purpose |
|----------|---------|
| Agents | Master list of all 112+ agents with @call syntax |
| Commands | Command library with 146+ workflow commands |
| Service Orders | Track OS execution |
| Projects | Group related OS |
| Cost Log | Daily cost tracking |
| Squads | Squad registry |

## Setup Instructions

### 1. Create Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Name it "AIOS Sync"
4. Select your workspace
5. Copy the "Internal Integration Token" (starts with `secret_`)

### 2. Create Databases

Create two databases in Notion following the specs in `/databases/`:
- `agents.md` - Agents database schema
- `commands.md` - Commands database schema

### 3. Share Databases

For each database:
1. Open the database page
2. Click "Share" in the top right
3. Click "Invite"
4. Search for "AIOS Sync" (your integration)
5. Click "Invite"

### 4. Get Database IDs

The database ID is in the URL:
```
https://notion.so/workspace/DATABASE_ID?v=...
                          ^^^^^^^^^^^^
```

### 5. Set Environment Variables

```bash
# Add to your shell profile (~/.zshrc, ~/.bashrc, etc.)
export NOTION_API_KEY="secret_..."
export NOTION_AGENTS_DB="your-agents-database-id"
export NOTION_COMMANDS_DB="your-commands-database-id"
```

### 6. Run Sync

```bash
cd scripts

# Preview what would sync (dry run)
npm run sync:from-notion -- --dry-run

# Sync everything
npm run sync:from-notion

# Sync only agents
npm run sync:agents

# Sync only commands
npm run sync:commands
```

## Database Schema

### Agents Database

Required columns for sync to work:

| Column | Type | Maps to CSV |
|--------|------|-------------|
| Agent ID (or Name) | Title | Agente |
| Squad | Select/Relation | Squad |
| Type (or Tipo) | Select | Tipo |
| Role (or O que faz) | Text | O que faz |

CSV output format:
```csv
Agente,Chamada,Squad,Tipo,O que faz
alex-hormozi,@alex-hormozi,board,Mind Clone,Architect offers e optimize revenue
```

### Commands Database

Required columns for sync to work:

| Column | Type | Maps to CSV |
|--------|------|-------------|
| Objetivo | Text | Objetivo |
| Command | Title | Command |
| Squad | Select/Relation | Squad |
| Tipo | Select | Tipo |
| Responsável | Text/Relation | Responsável |
| Cross-Squad | Text | Cross-Squad |

CSV output format:
```csv
Objetivo,Command,Squad,Tipo,Responsável,Cross-Squad
Criar Grand Slam Offer,/marketing/grand-slam,Marketing,Execution,Offer Engine,Board + Sales
```

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

### Agents
- **By Squad**: Group by Squad
- **By Type**: Group by Type (Hybrid, Expert, Operational, Mind Clone)
- **All Agents**: Sort by Squad, Name

### Commands
- **By Squad**: Group by Squad
- **By Type**: Group by Tipo
- **Quick Actions**: Filter Tipo = Quick

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

| Role | Agents | Commands | Service Orders | Projects | Costs |
|------|--------|----------|----------------|----------|-------|
| Director | Full | Full | Full | Full | Full |
| Squad Lead | Edit (own squad) | Edit (own squad) | Edit (own squad) | View | View (own) |
| Agent | View | View | View | View | - |
| External | - | - | - | - | - |

## Automation Ideas

Recommended automations (via Notion API, Zapier, or n8n):

1. **Auto-sync on Schedule**: GitHub Action to run sync daily
2. **Webhook on Change**: Trigger sync when Notion database changes
3. **PR on Diff**: Create PR when sync produces different CSV
4. **Daily Cost Report**: Email summary at EOD
5. **Blocked Alert**: Slack when OS blocked > 24h
6. **Budget Alert**: Notify when daily cost > €15

## Troubleshooting

### "Could not find database"
- Verify the database ID is correct (from URL)
- Make sure you shared the database with the integration

### "Object not found"
- The integration doesn't have access to that page/database
- Re-share the database with the integration

### "validation_error"
- Column names may differ from expected
- Check the script's property name mappings match your Notion columns

### Empty CSV output
- Check that your Notion database has data
- Verify the column names match what the script expects
