# Agents Database

> SOURCE OF TRUTH for all AIOS agents and their capabilities.
> This database syncs TO code via `sync-notion-to-code.js`

## CSV Output Format

```csv
Agente,Chamada,Squad,Tipo,O que faz
alex-hormozi,@alex-hormozi,board,Mind Clone,Architect offers e optimize revenue using value equation
```

## Database Properties

| Property | Type | Required | Maps to CSV | Description |
|----------|------|----------|-------------|-------------|
| Agent ID | Title | Yes | Agente | Unique identifier (e.g., `alex-hormozi`) |
| Squad | Select | Yes | Squad | Parent squad name |
| Type | Select | Yes | Tipo | Agent type classification |
| Role | Text | Yes | O que faz | What the agent does |
| Icon | Text | No | - | Emoji icon |
| Is Lead | Checkbox | No | - | Is squad lead |
| Commands | Relation | No | - | Available commands |
| Focus Areas | Multi-select | No | - | Areas of expertise |
| Greeting | Text | No | - | Agent greeting |
| Closing | Text | No | - | Agent signature |
| File Path | URL | No | - | Path to agent file |
| Status | Select | Yes | - | Agent status |
| Last Active | Date | No | - | Last activity |
| Notes | Text | No | - | Additional notes |

**Note:** The "Chamada" column (`@agent-id`) is auto-generated from Agent ID.

## Select Options

### Type (Tipo)
| Value | Description | Count |
|-------|-------------|-------|
| `Expert` | Deep specialist in one domain | ~81 |
| `Hybrid` | Orchestrates + executes | ~15 |
| `Operational` | Day-to-day execution | ~8 |
| `Mind Clone` | Board advisors (personas) | ~8 |

### Status
- `active` - Currently operational (Green)
- `inactive` - Not currently used (Gray)
- `development` - Being developed (Yellow)
- `deprecated` - Phased out (Red)

### Focus Areas
- `strategy` - Strategic planning
- `execution` - Task execution
- `analysis` - Data analysis
- `creative` - Creative work
- `technical` - Technical work
- `review` - Quality review
- `coordination` - Team coordination
- `research` - Research
- `documentation` - Documentation
- `optimization` - Optimization

## Default Views

### 1. By Squad (Default)
- Group by: Squad
- Filter: Status = active
- Sort: Is Lead (desc), Agent ID (asc)

### 2. By Type
- Group by: Type
- Sort: Squad, Agent ID

### 3. All Agents
- Sort: Squad, Agent ID
- Show: Icon, Agent ID, Role, Squad, Type

### 4. Lead Agents
- Filter: Is Lead = true
- Sort: Squad

### 5. Mind Clones (Board)
- Filter: Squad = board
- Show: Agent ID, Focus Areas, Role

### 6. Development
- Filter: Status = development
- Sort: Last Active (desc)

## Formulas

### Display Name
```
prop("Icon") + " " + prop("Agent ID")
```

### Call Syntax
```
"@" + prop("Agent ID")
```

### Is Mind Clone
```
prop("Squad") == "board"
```

## Current Squads (19)

| Squad | Agent Count | Lead |
|-------|-------------|------|
| board | 8 | - (Advisory) |
| copywriting-masters | 23 | copy-chief |
| customer | 2 | customer-lead |
| deep-research | 1 | researcher |
| design | 4 | design-lead |
| design-system | 1 | design-system |
| finance | 4 | finance-lead |
| growth | 2 | growth-lead |
| hormozi | 16 | hormozi-chief |
| hotel-mkt | 16 | hotel-mkt-chief |
| marketing | 6 | marketing-lead |
| ops | 3 | ops-lead |
| project-management-clickup | 9 | pm-orchestrator |
| qa | 3 | qa-lead |
| sales | 4 | sales-lead |
| sales-pages | 3 | copy-chief-sp |
| squad-creator | 3 | squad-chief |
| tech | 5 | tech-lead |
| translator | 1 | translation-lead |

## Templates

### New Agent
```
Agent ID: {squad}-{role}
Type: Expert
Status: development
Is Lead: false
Created: {today}
```

### New Mind Clone
```
Agent ID: {name-slug}
Squad: board
Type: Mind Clone
Status: development
Is Lead: false
```

## Sync Instructions

1. Edit agents in this Notion database
2. Run: `cd scripts && npm run sync:agents`
3. Generated file: `squads/_registry/agents-directory.csv`
4. Commit changes to git
