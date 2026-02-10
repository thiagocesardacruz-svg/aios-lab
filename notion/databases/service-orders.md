# Service Orders Database

> Primary tracking database for all Service Orders.

## Database Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| OS ID | Title | Yes | Unique identifier (OS-YYYY-NNNN) |
| Title | Text | Yes | Descriptive title |
| Squad | Select | Yes | Responsible squad |
| Status | Select | Yes | Current state |
| Priority | Select | Yes | Urgency level |
| Workflow | Text | Yes | Command executed |
| Requester | Text | Yes | Who requested |
| Project | Relation | No | Related project |
| Created | Date | Yes | Creation timestamp |
| Started | Date | No | Execution start |
| Completed | Date | No | Completion timestamp |
| Duration | Number | No | Minutes elapsed |
| Cost (EUR) | Number | No | Actual cost in EUR |
| Cost Category | Select | No | Cost classification |
| Cost Mode | Select | No | Budget mode |
| Agents Used | Multi-select | No | Agents involved |
| Tags | Multi-select | No | Classification tags |
| Blocked By | Relation | No | Blocking OS |
| Blocked Reason | Text | No | Why blocked |
| Outputs | Files | No | Generated files |
| Notes | Text | No | Additional notes |

## Select Options

### Squad
- `ops` - Operations
- `marketing` - Marketing
- `sales` - Sales
- `growth` - Growth
- `tech` - Tech
- `development` - Development
- `finance` - Finance
- `qa` - QA
- `translator` - Translator
- `customer` - Customer
- `board` - Board Advisor

### Status
- `intake` - Received, not started (Gray)
- `running` - In execution (Blue)
- `blocked` - Waiting on dependency (Red)
- `qa` - In quality review (Yellow)
- `done` - Completed (Green)
- `cancelled` - Cancelled (Gray strikethrough)

### Priority
- `critical` - Immediate (Red)
- `high` - Today (Orange)
- `medium` - This week (Yellow)
- `low` - When possible (Gray)

### Cost Category
- `BASE` - Baseline (deterministic)
- `EXEC` - Execution (LLM calls)
- `VRFY` - Verification
- `RCVR` - Recovery/Retry
- `EXTA` - External Auto
- `EXTM` - External Manual
- `DEV_` - Development

### Cost Mode
- `OP` - Operations budget
- `CLIENT` - Client billable
- `DEV` - Development budget

## Default Views

### 1. Kanban (Default)
- Group by: Status
- Sort: Priority (desc), Created (desc)
- Visible: OS ID, Title, Squad, Priority, Created

### 2. By Squad
- Group by: Squad
- Sort: Status, Created (desc)
- Filter: Status != cancelled

### 3. Calendar
- Calendar property: Created
- Filter: Status != cancelled

### 4. Blocked Items
- Filter: Status = blocked
- Sort: Created (asc)
- Show: Blocked Reason, Blocked By

### 5. Today
- Filter: Created = today OR Status = running
- Sort: Priority (desc)

### 6. Costs
- Filter: Cost (EUR) > 0
- Sort: Created (desc)
- Sum: Cost (EUR)
- Show: Cost Category, Cost Mode

## Formulas

### Duration (Calculated)
```
if(not empty(prop("Completed")) and not empty(prop("Started")),
   dateBetween(prop("Completed"), prop("Started"), "minutes"),
   0)
```

### Is Overdue
```
if(prop("Status") == "running" and
   dateBetween(now(), prop("Created"), "hours") > 24,
   true, false)
```

### Cost Per Minute
```
if(prop("Duration") > 0,
   prop("Cost (EUR)") / prop("Duration"),
   0)
```

## Rollups (from Project relation)

- Total OS count
- Total cost
- Completed count
- Blocked count

## Automations

1. **Set Started**: When Status changes to "running", set Started = now()
2. **Set Completed**: When Status changes to "done", set Completed = now()
3. **Overdue Alert**: If running > 24h, add "overdue" tag
