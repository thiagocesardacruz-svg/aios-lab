# Projects Database

> Groups related Service Orders into trackable projects.

## Database Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Project ID | Title | Yes | Unique identifier (PRJ-NNN) |
| Name | Text | Yes | Project name |
| Description | Text | No | Project description |
| Status | Select | Yes | Current state |
| Priority | Select | Yes | Urgency level |
| Owner | Person | Yes | Project owner |
| Squad | Select | Yes | Primary squad |
| Start Date | Date | No | Project start |
| Target Date | Date | No | Target completion |
| Actual End | Date | No | Actual completion |
| Budget (EUR) | Number | No | Allocated budget |
| Spent (EUR) | Rollup | Auto | Sum from OS |
| OS Count | Rollup | Auto | Count from OS |
| Completed OS | Rollup | Auto | Completed count |
| Service Orders | Relation | Auto | Related OS |
| Tags | Multi-select | No | Classification |
| Notes | Text | No | Additional notes |

## Select Options

### Status
- `planning` - In planning phase (Gray)
- `active` - In execution (Blue)
- `paused` - Temporarily stopped (Yellow)
- `completed` - Successfully finished (Green)
- `cancelled` - Cancelled (Gray strikethrough)

### Priority
- `critical` - Top priority (Red)
- `high` - High priority (Orange)
- `medium` - Normal priority (Yellow)
- `low` - Low priority (Gray)

### Squad
Same as Service Orders database.

## Default Views

### 1. Active Projects (Default)
- Filter: Status = active
- Sort: Priority (desc), Target Date (asc)
- Show: Name, Squad, Progress, Budget, Target Date

### 2. All Projects
- Sort: Status, Created (desc)
- Group by: Status

### 3. Timeline
- Timeline property: Start Date → Target Date
- Filter: Status in [planning, active]

### 4. By Squad
- Group by: Squad
- Filter: Status != cancelled

### 5. Budget Overview
- Show: Budget, Spent, Remaining
- Sort: Spent (desc)

## Formulas

### Progress (%)
```
if(prop("OS Count") > 0,
   round(prop("Completed OS") / prop("OS Count") * 100),
   0)
```

### Remaining Budget
```
prop("Budget (EUR)") - prop("Spent (EUR)")
```

### Is Over Budget
```
prop("Spent (EUR)") > prop("Budget (EUR)")
```

### Days Until Target
```
if(not empty(prop("Target Date")),
   dateBetween(prop("Target Date"), now(), "days"),
   0)
```

### Is Overdue
```
prop("Status") == "active" and
not empty(prop("Target Date")) and
now() > prop("Target Date")
```

## Rollups

### From Service Orders Relation

| Rollup | Function | Property |
|--------|----------|----------|
| OS Count | Count all | OS ID |
| Completed OS | Count values | Status = done |
| Spent (EUR) | Sum | Cost (EUR) |
| Blocked Count | Count values | Status = blocked |

## Templates

### New Project
```
Project ID: PRJ-{next number}
Status: planning
Priority: medium
Created: {today}
```
