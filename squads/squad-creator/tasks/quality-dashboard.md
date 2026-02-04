---
task: Quality Dashboard
responsavel: "@squad-architect"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - squad_name: Name of the squad to assess, e.g. "squad-creator" (string, required)
Saida: |
  - metrics: Structure coverage, task coverage, doc coverage, agent health scores (object)
  - overall_score: Aggregate quality score from 0 to 100 (number)
  - suggestions: Prioritized list of improvement recommendations (array)
Checklist:
  - "[ ] Load squad manifest (squad.yaml)"
  - "[ ] Check all declared components exist on disk"
  - "[ ] Measure documentation coverage"
  - "[ ] Assess task completeness"
  - "[ ] Evaluate agent definition quality"
  - "[ ] Calculate overall quality score"
  - "[ ] Generate improvement suggestions"
  - "[ ] Display dashboard"
---

# *quality-dashboard

Generates a comprehensive quality assessment dashboard for a squad. Checks structural integrity, component completeness, documentation coverage, and agent health to produce an actionable quality score with improvement suggestions.

## Uso

```
*quality-dashboard squad_name="squad-creator"
```

## Parametros

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| squad_name | string | yes | Name of the squad to assess |

## Implementation

### Step 1: Load Squad Manifest
- Read `squads/{squad_name}/squad.yaml`
- Parse component declarations: agents, tasks, workflows, checklists, templates, tools, scripts, data
- Establish expected file list from manifest

### Step 2: Structure Coverage
- For each component category, check every declared file exists on disk
- Calculate structure_coverage = (existing_files / declared_files) * 100
- List missing files with their expected paths
- Check for undeclared files (files on disk not in manifest) and flag as orphans

### Step 3: Task Coverage
- For each declared task file:
  - Check frontmatter completeness: task, responsavel, Entrada, Saida, Checklist all present
  - Check body completeness: Implementation section exists, Error Handling section exists, Related section exists
  - Score each task 0-100 based on completeness
- Calculate task_coverage = average of all task scores

### Step 4: Documentation Coverage
- Check for squad-level documentation:
  - squad.yaml has description
  - squad-kb.md exists and has content (if declared)
  - README or equivalent exists
- For each agent, check agent definition file has: purpose, capabilities, constraints
- For each checklist, verify it has actionable items
- Calculate doc_coverage = (documented_items / total_items) * 100

### Step 5: Agent Health
- For each declared agent:
  - Agent file exists and is parseable
  - Agent has defined responsibilities
  - Agent has at least one associated task
  - Agent has defined communication style or persona
- Calculate agent_health = average health score across agents

### Step 6: Overall Score Calculation
- Weighted aggregate:
  - Structure coverage: 25%
  - Task coverage: 30%
  - Documentation coverage: 20%
  - Agent health: 25%
- overall_score = weighted sum, rounded to nearest integer

### Step 7: Suggestion Generation
- For each metric below 80%, generate specific improvement suggestions
- Prioritize suggestions by impact (fixing a missing critical task > fixing a missing optional doc)
- Categories:
  - **Critical**: Missing files declared in manifest, tasks without implementation
  - **Important**: Incomplete frontmatter, missing error handling
  - **Nice-to-have**: Missing optional docs, orphan files, style improvements

### Step 8: Dashboard Display
- Format as structured report:
  ```
  Squad Quality Dashboard: {squad_name}
  =========================================
  Structure Coverage:  {score}% [=====     ]
  Task Coverage:       {score}% [========  ]
  Doc Coverage:        {score}% [======    ]
  Agent Health:        {score}% [========= ]
  -----------------------------------------
  OVERALL SCORE:       {score}/100

  Suggestions:
  1. [Critical] ...
  2. [Important] ...
  3. [Nice-to-have] ...
  ```

## Error Handling

- **Squad not found**: Abort with message listing available squads in `squads/` directory
- **Manifest parse error**: Report YAML error, attempt partial parsing of readable sections
- **Permission denied on files**: Skip inaccessible files, note them as "unable to assess" in report
- **Empty squad**: If manifest declares no components, report as "empty squad" with score 0 and suggest running `*clone-mind` or `*extract-sop` to begin populating

## Related

- `discover-tools.md` — Tool discovery feeds into squad completeness
- `validate-sop.md` — SOP validation is part of documentation quality
- `squads/squad-creator/checklists/squad-checklist.md` — Squad-level checklist for quality
