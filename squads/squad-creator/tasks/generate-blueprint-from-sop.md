---
task: Generate Blueprint from SOP
responsavel: "@sop-extractor"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - sop_path: Path to a validated SOP document (string, required)
Saida: |
  - blueprint: Squad design in squad-design.yaml format with agents, tasks, workflows (object)
  - agent_recommendations: Recommended agent roles derived from SOP executor types (array)
  - task_recommendations: Recommended tasks derived from SOP procedure steps (array)
Checklist:
  - "[ ] Load and parse validated SOP"
  - "[ ] Map SOP procedure steps to potential tasks"
  - "[ ] Identify agent roles from executor classifications"
  - "[ ] Design workflow from step sequence and decision points"
  - "[ ] Generate squad blueprint in squad-design.yaml format"
  - "[ ] Save blueprint to squads/.designs/"
---

# *generate-blueprint

Converts a validated SOP into a squad blueprint. Maps procedure steps to tasks, derives agent roles from executor classifications, and produces a complete squad-design.yaml ready for implementation.

## Uso

```
*generate-blueprint sop_path="./data/sops/onboarding-sop-001.md"
```

## Parametros

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| sop_path | string | yes | Path to a validated SOP document |

## Implementation

### Step 1: Load SOP
- Load SOP document from sop_path
- Verify SOP has been validated (check for validation metadata or run quick validation)
- If not validated, warn user and suggest running `*validate-sop` first
- Extract procedure steps, executor types, cognitive classifications, decision points

### Step 2: Task Mapping
- Group related SOP steps into logical task units
- Each task should be atomic: single responsibility, clear input/output
- For each task candidate:
  - Derive task name from step description (kebab-case)
  - Define Entrada from step prerequisites and inputs
  - Define Saida from step outputs
  - Carry over cognitive classification
  - Carry over executor type
- Generate task file structure for each

### Step 3: Agent Role Identification
- Analyze executor classifications across all steps
- Group steps by required capabilities
- Derive agent roles:
  - Steps classified as "AI" -> identify AI agent specialization needed
  - Steps classified as "Human" -> identify human role requirements
  - Steps classified as "Hybrid" -> define agent-human collaboration pattern
- Recommend agent personas with:
  - Name suggestion
  - Responsibilities (mapped from SOP steps)
  - Required capabilities
  - Interaction patterns

### Step 4: Workflow Design
- Map the SOP's sequential and branching flow into a workflow definition
- Define step dependencies
- Map decision points to workflow branching logic
- Identify parallelizable step groups
- Define error handling paths from SOP exception handling section

### Step 5: Blueprint Generation
- Compile into squad-design.yaml format:
  ```yaml
  name: {derived-from-sop-title}
  version: 1.0.0
  description: {from SOP purpose}
  agents: [{agent recommendations}]
  tasks: [{task recommendations}]
  workflows: [{workflow definition}]
  checklists: []
  data: []
  ```
- Include agent_recommendations as separate detailed output
- Include task_recommendations as separate detailed output

### Step 6: Save
- Save blueprint to `squads/.designs/{sop-slug}-blueprint.yaml`
- Save agent recommendations to `squads/.designs/{sop-slug}-agents.md`
- Save task recommendations to `squads/.designs/{sop-slug}-tasks.md`

## Error Handling

- **SOP not validated**: Warn and suggest running `*validate-sop`; optionally continue with caveat that blueprint may be incomplete
- **SOP file not found**: Abort with path error
- **SOP has no procedure steps**: Abort — cannot generate blueprint without procedural content
- **Ambiguous task boundaries**: Flag steps that could be split or merged, ask user in interactive mode
- **No AI-eligible steps**: Generate blueprint with all-human agents, note that automation potential is low
- **Design directory missing**: Create `squads/.designs/` directory automatically

## Related

- `extract-sop.md` — Creates the SOP that feeds this task
- `validate-sop.md` — Validates SOP before blueprint generation
- `analyze-automation.md` — Complements blueprint with automation analysis
- `squads/squad-creator/data/squad-kb.md` — Knowledge base for squad design patterns
