# Commands Database

> Registry of all available AIOS commands and workflows.

## Database Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Command | Title | Yes | Full command path |
| Name | Text | Yes | Command name |
| Squad | Relation | Yes | Parent squad |
| Description | Text | Yes | What it does |
| Visibility | Select | Yes | UI visibility |
| Workflow File | URL | No | Path to workflow |
| Parameters | Text | No | Required parameters |
| Example | Text | No | Usage example |
| Agents | Relation | No | Agents involved |
| Avg Duration | Number | No | Average minutes |
| Avg Cost | Number | No | Average EUR |
| Usage Count | Rollup | Auto | Times executed |
| Status | Select | Yes | Command status |
| Tags | Multi-select | No | Classification |
| Notes | Text | No | Additional notes |

## Select Options

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

### 2. All Commands
- Sort: Squad, Command
- Show: Command, Description, Visibility, Status

### 3. Quick Actions
- Filter: Visibility = quick
- Sort: Squad, Command

### 4. Most Used
- Sort: Usage Count (desc)
- Show: Command, Usage Count, Avg Duration, Avg Cost

### 5. Development
- Filter: Status in [beta, development]
- Sort: Squad, Status

## Formulas

### Short Command
```
"/" + prop("Squad") + "/" + prop("Name")
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

## Rollups

### From Service Orders (via Squad)

| Rollup | Function | Property |
|--------|----------|----------|
| Usage Count | Count where | Workflow = command |

## Command Examples

### Marketing Squad

| Command | Description |
|---------|-------------|
| `/mkt/market-research` | Conduct market research |
| `/mkt/landing-page` | Create landing page copy |
| `/mkt/create-funnel` | Design marketing funnel |
| `/mkt/seo-plan` | Create SEO strategy |
| `/mkt/article` | Write blog article |
| `/mkt/email-sequence` | Create email sequence |
| `/mkt/ad-creative-pack` | Generate ad creatives |
| `/mkt/social-calendar` | Plan social content |

### OPS Squad

| Command | Description |
|---------|-------------|
| `/ops/new-task` | Create new service order |
| `/ops/status` | Check OS status |
| `/ops/escalate` | Escalate to director |
| `/ops/health-check` | System health check |

### Board Squad

| Command | Description |
|---------|-------------|
| `/board/consult` | Request board consultation |
| `/board/decision-memo` | Generate decision memo |

## Templates

### New Command
```
Command: /{squad}/{name}
Status: development
Visibility: hidden
Created: {today}
```
