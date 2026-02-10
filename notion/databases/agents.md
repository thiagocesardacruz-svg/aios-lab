# Agents Database

> Registry of all AIOS agents and their capabilities.

## Database Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| Agent ID | Title | Yes | Unique identifier |
| Name | Text | Yes | Agent display name |
| Icon | Text | No | Emoji icon |
| Squad | Relation | Yes | Parent squad |
| Role | Text | Yes | Agent role description |
| Archetype | Select | No | Agent archetype |
| Is Lead | Checkbox | No | Is squad lead |
| Commands | Relation | No | Available commands |
| Focus Areas | Multi-select | No | Areas of expertise |
| Greeting | Text | No | Agent greeting |
| Closing | Text | No | Agent signature |
| File Path | URL | No | Path to agent file |
| Status | Select | Yes | Agent status |
| Last Active | Date | No | Last activity |
| Notes | Text | No | Additional notes |

## Select Options

### Archetype
- `Aries` - Bold, initiating, pioneering
- `Taurus` - Stable, methodical, quality-focused
- `Gemini` - Adaptive, communicative, versatile
- `Cancer` - Nurturing, protective, intuitive
- `Leo` - Confident, creative, leadership
- `Virgo` - Analytical, detail-oriented, precise
- `Libra` - Balanced, fair, diplomatic
- `Scorpio` - Deep, investigative, transformative
- `Sagittarius` - Expansive, optimistic, visionary
- `Capricorn` - Structured, ambitious, disciplined
- `Aquarius` - Innovative, independent, systemic
- `Pisces` - Creative, empathic, intuitive

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
- Sort: Is Lead (desc), Name (asc)

### 2. All Agents
- Sort: Squad, Name
- Show: Icon, Name, Role, Squad, Archetype

### 3. Lead Agents
- Filter: Is Lead = true
- Sort: Squad

### 4. Development
- Filter: Status = development
- Sort: Last Active (desc)

### 5. Mind Clones (Board)
- Filter: Squad = board
- Show: Name, Archetype, Focus Areas

## Formulas

### Display Name
```
prop("Icon") + " " + prop("Name")
```

### Is Mind Clone
```
prop("Squad") == "board"
```

## Rollups

### From Commands Relation

| Rollup | Function | Property |
|--------|----------|----------|
| Command Count | Count all | Command Name |

### From Squad Relation

| Rollup | Function | Property |
|--------|----------|----------|
| Squad Name | Show original | Name |

## Templates

### New Agent
```
Agent ID: {squad}-{role}
Status: development
Created: {today}
Is Lead: false
```

### New Mind Clone
```
Agent ID: {name-slug}
Squad: board
Archetype: {selected}
Status: development
Is Lead: false
```
