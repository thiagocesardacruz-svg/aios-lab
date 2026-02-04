---
task: Show Tools
responsavel: "@squad-architect"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - filter: Optional filter criteria — category, tier (DO NOW/DO NEXT/DO LATER/DON'T DO), decision, flags (object, optional)
Saida: |
  - formatted_view: Formatted table of tools from the registry matching the filter criteria (string)
Checklist:
  - "[ ] Load tool-registry.yaml"
  - "[ ] Apply filter criteria if provided"
  - "[ ] Format results as table"
  - "[ ] Display formatted view"
---

# *show-tools

Displays tools from the tool registry in a formatted table view. Supports filtering by category, tier, decision status, and flags.

## Uso

```
*show-tools
*show-tools filter={"category": "web-scraping"}
*show-tools filter={"tier": "DO NOW"}
*show-tools filter={"flags": "LOW_CONFIDENCE"}
```

## Parametros

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| filter | object | no | none (show all) | Filter by category, tier, decision, or flags |

### Filter Options

| Key | Values | Description |
|-----|--------|-------------|
| category | string | Tool category (e.g., "web-scraping", "database", "ci-cd") |
| tier | string | Decision tier: "DO NOW", "DO NEXT", "DO LATER", "DON'T DO" |
| decision | string | Current decision status: "approved", "pending", "rejected" |
| flags | string | Tool flags: "BLOCKED", "LOW_CONFIDENCE", "NEEDS_REVIEW" |

## Implementation

### Step 1: Load Registry
- Read `squads/squad-creator/data/tool-registry.yaml`
- Parse YAML into structured data
- Validate registry schema

### Step 2: Apply Filters
- If no filter provided, select all tools
- If filter provided, apply each filter criterion as AND condition
- Support partial string matching for category names

### Step 3: Format Output
- Generate markdown table with columns: Name, Category, Tier, RICE Score, WSJF Score, Flags, URL
- Sort by tier priority (DO NOW first) then by RICE score descending
- Include summary line: "Showing X of Y tools"
- If no tools match filter, display "No tools match the specified criteria"

### Step 4: Display
- Output formatted table to user
- Include legend for flags and tiers if first time viewing

## Error Handling

- **Registry file not found**: Create empty registry and inform user to run `*discover-tools` first
- **Registry parse error**: Report YAML syntax error with line number, suggest manual fix
- **Invalid filter key**: Warn about unrecognized filter key, ignore it, apply remaining valid filters
- **Empty results**: Display helpful message with available filter values from the registry

## Related

- `discover-tools.md` — Populates the tool registry
- `add-tool.md` — Manually adds tools to registry
- `squads/squad-creator/data/tool-registry.yaml` — Data source
