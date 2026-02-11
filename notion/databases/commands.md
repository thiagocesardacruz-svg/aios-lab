# Commands Database

> SOURCE OF TRUTH for all available AIOS workflow commands.
> This database syncs TO code via `sync-notion-to-code.js`

## CSV Output Format

```csv
Objetivo,Command,Squad,Tipo,Responsável,Cross-Squad
Criar Grand Slam Offer,/marketing/grand-slam,Marketing,Execution,Offer Engine,Board + Sales
```

## Database Properties

| Property | Type | Required | Maps to CSV | Description |
|----------|------|----------|-------------|-------------|
| Objetivo | Text | Yes | Objetivo | What this command accomplishes |
| Command | Title | Yes | Command | Full command path (e.g., `/marketing/grand-slam`) |
| Squad | Select | Yes | Squad | Parent squad |
| Tipo | Select | Yes | Tipo | Command type classification |
| Responsável | Text/Relation | Yes | Responsável | Agent(s) responsible |
| Cross-Squad | Text | No | Cross-Squad | Other squads involved |
| Description | Text | No | - | Detailed description |
| Visibility | Select | No | - | UI visibility level |
| Workflow File | URL | No | - | Path to workflow YAML |
| Parameters | Text | No | - | Required parameters |
| Example | Text | No | - | Usage example |
| Avg Duration | Number | No | - | Average minutes |
| Avg Cost | Number | No | - | Average EUR |
| Usage Count | Rollup | Auto | - | Times executed |
| Status | Select | Yes | - | Command status |
| Tags | Multi-select | No | - | Classification tags |
| Notes | Text | No | - | Additional notes |

## Select Options

### Tipo (Command Type)
| Value | Description | Example |
|-------|-------------|---------|
| `Workflow` | Multi-step orchestrated flow | /marketing/campaign |
| `Strategy` | Strategic planning/analysis | /board/consult |
| `Execution` | Direct task execution | /copy/write-headline |
| `Analysis` | Data analysis/reporting | /growth/analyze |
| `Review` | Quality review/audit | /qa/review-content |
| `Quick` | Fast single-action | /ops/status |

### Visibility
- `full` - Full UI visibility (Green)
- `quick` - Quick action only (Blue)
- `hidden` - API/internal only (Gray)
- `deprecated` - Phased out (Red)

### Status
- `active` - Operational (Green)
- `beta` - In testing (Yellow)
- `development` - Being built (Blue)
- `deprecated` - Phased out (Red)

### Tags
- `content` - Content creation
- `research` - Research tasks
- `automation` - Automated tasks
- `review` - Review processes
- `management` - Management tasks
- `external` - External integrations
- `internal` - Internal operations
- `advisory` - Advisory only

## Default Views

### 1. By Squad (Default)
- Group by: Squad
- Filter: Status = active
- Sort: Command (asc)

### 2. By Type
- Group by: Tipo
- Sort: Squad, Command

### 3. All Commands
- Sort: Squad, Command
- Show: Command, Objetivo, Tipo, Responsável

### 4. Quick Actions
- Filter: Tipo = Quick
- Sort: Squad, Command

### 5. Cross-Squad
- Filter: Cross-Squad is not empty
- Group by: Cross-Squad
- Show: Command, Squad, Cross-Squad

### 6. Most Used
- Sort: Usage Count (desc)
- Show: Command, Usage Count, Avg Duration, Avg Cost

### 7. Development
- Filter: Status in [beta, development]
- Sort: Squad, Status

## Formulas

### Short Command
```
prop("Command")
```

### Cost Efficiency
```
if(prop("Avg Duration") > 0,
   prop("Avg Cost") / prop("Avg Duration"),
   0)
```

### Is Active
```
prop("Status") == "active"
```

## Current Command Counts by Squad

| Squad | Commands | Primary Type |
|-------|----------|--------------|
| Marketing | 24 | Workflow, Execution |
| Sales | 12 | Strategy, Execution |
| Sales Pages | 15 | Execution |
| Copywriting Masters | 18 | Execution |
| Design | 12 | Execution |
| Growth | 8 | Analysis, Strategy |
| Customer | 6 | Workflow |
| Finance | 8 | Analysis, Review |
| Tech | 10 | Execution |
| Ops | 8 | Quick, Workflow |
| QA | 10 | Review |
| Board | 6 | Strategy |
| Deep Research | 4 | Analysis |
| Hormozi | 5 | Strategy, Execution |

## Command Examples

### Marketing Squad
| Objetivo | Command | Tipo | Responsável |
|----------|---------|------|-------------|
| Criar Grand Slam Offer | /marketing/grand-slam | Execution | Offer Engine |
| Pesquisa de mercado completa | /marketing/market-research | Workflow | Copy Specialist |
| Criar funil de vendas | /marketing/funnel-design | Workflow | Funnel Architect |

### OPS Squad
| Objetivo | Command | Tipo | Responsável |
|----------|---------|------|-------------|
| Criar nova Service Order | /ops/new-os | Quick | Ops Manager |
| Ver status do sistema | /ops/status | Quick | Ops Lead |
| Escalar para diretor | /ops/escalate | Quick | Ops Lead |

### Board Squad
| Objetivo | Command | Tipo | Responsável |
|----------|---------|------|-------------|
| Consultar board de advisors | /board/consult | Strategy | Board Members |
| Gerar memo de decisão | /board/decision-memo | Strategy | Board Members |

## Templates

### New Command
```
Command: /{squad}/{name}
Tipo: Execution
Status: development
Visibility: hidden
Created: {today}
```

### New Workflow Command
```
Command: /{squad}/{name}
Tipo: Workflow
Status: development
Visibility: full
Cross-Squad: (list involved squads)
```

## Sync Instructions

1. Edit commands in this Notion database
2. Run: `cd scripts && npm run sync:commands`
3. Generated file: `squads/_registry/command-library.csv`
4. Commit changes to git

## Naming Conventions

### Command Path
- Format: `/{squad}/{action-noun}`
- Use kebab-case
- Keep under 30 chars
- Examples:
  - `/marketing/grand-slam`
  - `/ops/new-os`
  - `/qa/review-content`

### Objetivo
- Start with verb in infinitive (Criar, Analisar, Gerar)
- Be specific about outcome
- Keep under 60 chars
