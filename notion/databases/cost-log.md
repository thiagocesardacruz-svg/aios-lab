# Cost Log Database

> Daily cost tracking and budget monitoring.

## Database Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Date | Title | Yes | Log date (YYYY-MM-DD) |
| Total (EUR) | Number | Yes | Daily total |
| OS Count | Number | Yes | OS executed |
| Tokens In | Number | No | Input tokens |
| Tokens Out | Number | No | Output tokens |
| By Squad | Text | No | JSON breakdown |
| By Category | Text | No | JSON breakdown |
| By Mode | Text | No | JSON breakdown |
| Alert Level | Select | Auto | Budget alert |
| Service Orders | Relation | Auto | Related OS |
| Notes | Text | No | Daily notes |

## Select Options

### Alert Level
- `normal` - Under €15 (Green)
- `warning` - €15-€20 (Yellow)
- `critical` - Over €20 (Red)
- `safe_mode` - SAFE MODE active (Red)

## Default Views

### 1. Daily Log (Default)
- Sort: Date (desc)
- Show: Date, Total, OS Count, Alert Level

### 2. Calendar
- Calendar property: Date
- Color by: Alert Level

### 3. Alerts Only
- Filter: Alert Level in [warning, critical, safe_mode]
- Sort: Date (desc)

### 4. Monthly Summary
- Group by: Month (from Date)
- Sum: Total (EUR)

### 5. Chart View
- X-axis: Date
- Y-axis: Total (EUR)
- Last 30 days

## Formulas

### Alert Level (Calculated)
```
if(prop("Total (EUR)") >= 20, "critical",
   if(prop("Total (EUR)") >= 15, "warning",
      "normal"))
```

### Avg Per OS
```
if(prop("OS Count") > 0,
   prop("Total (EUR)") / prop("OS Count"),
   0)
```

### Month
```
formatDate(prop("Date"), "YYYY-MM")
```

### Is Weekend
```
day(prop("Date")) == 0 or day(prop("Date")) == 6
```

### Budget Remaining (Daily)
```
20 - prop("Total (EUR)")
```

## Rollups

### Monthly Totals
| Rollup | Function | Property |
|--------|----------|----------|
| Monthly Total | Sum | Total (EUR) |
| Monthly OS Count | Sum | OS Count |
| Warning Days | Count where | Alert Level = warning |
| Critical Days | Count where | Alert Level = critical |

## Budget Thresholds

| Threshold | Value | Action |
|-----------|-------|--------|
| Daily Alert | €15 | Notify Director |
| Daily Hard | €20 | SAFE MODE |
| Monthly | €470 | Hard stop |
| Single Task | €10 | Require approval |

## Aggregation Queries

### Daily Cost by Squad
```json
{
  "ops": 0.50,
  "marketing": 2.30,
  "sales": 0.80,
  "growth": 1.20,
  "tech": 0.00,
  "finance": 0.00,
  "qa": 0.40,
  "translator": 0.00,
  "customer": 0.00,
  "board": 0.80
}
```

### Daily Cost by Category
```json
{
  "BASE": 0.00,
  "EXEC": 5.20,
  "VRFY": 0.40,
  "RCVR": 0.40,
  "EXTA": 0.00,
  "EXTM": 0.00,
  "DEV_": 0.00
}
```

## Templates

### Daily Log Entry
```
Date: {today}
Total (EUR): 0.00
OS Count: 0
Alert Level: normal
```

## Automations

1. **Create Daily**: Auto-create entry at midnight
2. **Update Alert**: When Total changes, recalculate Alert Level
3. **Notify Warning**: When Alert Level = warning, notify Director
4. **Activate Safe Mode**: When Alert Level = critical, trigger SAFE MODE
