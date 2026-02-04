---
task: Add Tool
responsavel: "@squad-architect"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - tool_name: Name of the tool to add (string, required)
  - category: Tool category, e.g. "web-scraping", "database", "ci-cd" (string, required)
  - url: URL to the tool's homepage or repository (string, required)
  - notes: Additional notes or context about the tool (string, optional)
  - evaluate: Whether to run the evaluation pipeline (RICE/WSJF/gates) (boolean, optional, default: true)
Saida: |
  - updated_registry: The updated tool-registry.yaml contents (object)
  - evaluation_result: RICE score, WSJF score, tier classification, gate results — only if evaluate=true (object)
Checklist:
  - "[ ] Validate input parameters"
  - "[ ] Check for duplicate entry in registry"
  - "[ ] Run evaluation pipeline if evaluate=true"
  - "[ ] Add tool entry to tool-registry.yaml"
  - "[ ] Confirm addition to user"
---

# *add-tool

Manually adds a tool to the tool registry. Optionally runs the full evaluation pipeline (RICE/WSJF scoring and security/social proof gates) before adding.

## Uso

```
*add-tool tool_name="Playwright" category="testing" url="https://playwright.dev" notes="E2E browser testing" evaluate=true
*add-tool tool_name="custom-script" category="internal" url="./scripts/custom.sh" evaluate=false
```

## Parametros

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| tool_name | string | yes | - | Name of the tool |
| category | string | yes | - | Category classification |
| url | string | yes | - | Homepage or repository URL |
| notes | string | no | empty | Additional context |
| evaluate | boolean | no | true | Run RICE/WSJF evaluation |

## Implementation

### Step 1: Input Validation
- Verify tool_name is non-empty and follows naming convention (lowercase, hyphens allowed)
- Verify category is a recognized category or create new category
- Verify URL is a valid URL format or valid local path
- Normalize tool_name to kebab-case

### Step 2: Duplicate Check
- Load `squads/squad-creator/data/tool-registry.yaml`
- Check if tool_name already exists in registry
- If duplicate found, prompt user: update existing entry or abort

### Step 3: Evaluation Pipeline (if evaluate=true)
- Run RICE scoring: estimate Reach, Impact, Confidence, Effort
- Run WSJF scoring: estimate Business Value, Time Criticality, Risk Reduction, Job Size
- Run security gate: check license, vulnerabilities, data privacy
- Run social proof gate: check stars, downloads, community activity
- Classify into tier: DO NOW / DO NEXT / DO LATER / DON'T DO
- Compile evaluation_result

### Step 4: Registry Update
- Create tool entry with all metadata:
  - name, category, url, notes
  - evaluation scores (if evaluated)
  - tier classification (if evaluated), or "UNSCORED" if not
  - added_date, added_by
- Append entry to tool-registry.yaml
- Preserve existing entries and formatting

### Step 5: Confirmation
- Display added tool summary
- If evaluated, show scores and tier classification
- Confirm successful save

## Error Handling

- **Duplicate tool**: Prompt user to update or abort; do not silently overwrite
- **Invalid URL**: Warn user, allow adding with a note that URL needs verification
- **Registry file missing**: Create new registry file with the tool as first entry
- **Evaluation failure**: Add tool with "EVALUATION_FAILED" flag, suggest re-evaluation later
- **Write permission error**: Report error with path, suggest checking file permissions

## Related

- `discover-tools.md` — Automated tool discovery that also populates registry
- `show-tools.md` — View tools in the registry
- `squads/squad-creator/data/tool-registry.yaml` — Data target
- `squads/squad-creator/data/tool-evaluation-framework.md` — Evaluation criteria reference
