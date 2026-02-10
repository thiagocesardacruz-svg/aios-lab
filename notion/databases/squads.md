# Squads Database

> Registry of all AIOS squads and their configuration.

## Database Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Squad ID | Title | Yes | Unique identifier |
| Name | Text | Yes | Display name |
| Icon | Text | No | Emoji icon |
| Description | Text | Yes | Squad purpose |
| Slash Prefix | Text | Yes | Command prefix |
| Domain | Select | Yes | Business domain |
| Lead Agent | Relation | Yes | Squad lead |
| Agents | Relation | Auto | All agents |
| Commands | Relation | Auto | Available commands |
| Service Orders | Relation | Auto | Related OS |
| Monthly Cost | Rollup | Auto | Total monthly cost |
| OS Count | Rollup | Auto | Total OS count |
| Avg Response | Number | No | Avg minutes to start |
| Status | Select | Yes | Squad status |
| Version | Text | No | Config version |
| File Path | URL | No | Path to squad.yaml |
| Notes | Text | No | Additional notes |

## Select Options

### Domain
- `operations` - Core operations
- `marketing` - Marketing & brand
- `sales` - Sales & pipeline
- `growth` - Growth & optimization
- `technology` - Tech & development
- `finance` - Finance & accounting
- `quality` - QA & validation
- `localization` - Translation & localization
- `support` - Customer support
- `advisory` - Advisory board

### Status
- `active` - Fully operational (Green)
- `limited` - Reduced capacity (Yellow)
- `maintenance` - Under maintenance (Orange)
- `inactive` - Not operational (Gray)

## Default Views

### 1. Overview (Default)
- Sort: Domain, Name
- Show: Icon, Name, Domain, Lead, Agent Count, Status

### 2. By Domain
- Group by: Domain
- Filter: Status = active

### 3. Performance
- Sort: Monthly Cost (desc)
- Show: Name, Monthly Cost, OS Count, Avg Response

### 4. Command Reference
- Show: Name, Slash Prefix, Commands
- Filter: Status = active

## Formulas

### Display Name
```
prop("Icon") + " " + prop("Name")
```

### Agent Count
```
length(prop("Agents"))
```

### Command Count
```
length(prop("Commands"))
```

### Is Operational
```
prop("Status") == "active" or prop("Status") == "limited"
```

### Cost Per OS
```
if(prop("OS Count") > 0,
   prop("Monthly Cost") / prop("OS Count"),
   0)
```

## Rollups

### From Service Orders Relation

| Rollup | Function | Property |
|--------|----------|----------|
| OS Count | Count all | OS ID |
| Monthly Cost | Sum | Cost (EUR) |
| Completed | Count where | Status = done |
| Blocked | Count where | Status = blocked |

### From Agents Relation

| Rollup | Function | Property |
|--------|----------|----------|
| Agent Count | Count all | Agent ID |
| Active Agents | Count where | Status = active |

### From Commands Relation

| Rollup | Function | Property |
|--------|----------|----------|
| Command Count | Count all | Command |
| Active Commands | Count where | Status = active |

## Squad Registry

### Operational Squads

| ID | Name | Prefix | Domain |
|----|------|--------|--------|
| ops | Operations | `/ops` | operations |
| marketing | Marketing | `/mkt` | marketing |
| sales | Sales | `/sales` | sales |
| growth | Growth | `/growth` | growth |
| tech | Tech | `/tech` | technology |
| finance | Finance | `/fin` | finance |
| qa | QA | `/qa` | quality |
| translator | Translator | `/translate` | localization |
| customer | Customer | `/cx` | support |

### Advisory Squad

| ID | Name | Prefix | Domain |
|----|------|--------|--------|
| board | Board Advisor | `/board` | advisory |

## Templates

### New Squad
```
Squad ID: {id}
Status: maintenance
Version: 1.0.0
Created: {today}
```
