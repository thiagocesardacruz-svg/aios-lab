---
task: Extract SOP
responsavel: "@sop-extractor"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - source: Path to document or transcript to extract SOP from (string, required)
  - source_type: Type of source — document, transcript, interview, or observation (string, required)
Saida: |
  - sop_document: Complete SOP in SC-PE-001 format with all 11 parts (object)
  - cognitive_taxonomy: Classification of each step by cognitive complexity level (object)
  - executor_classification: Assignment of each step as Human, AI, or Hybrid executor (object)
Checklist:
  - "[ ] Load and parse source document"
  - "[ ] Identify procedure steps from source content"
  - "[ ] Sequence steps in logical execution order"
  - "[ ] Classify each step cognitively (remember, understand, apply, analyze, evaluate, create)"
  - "[ ] Assign executor type per step (Human, AI, Hybrid)"
  - "[ ] Structure into SC-PE-001 format with all 11 parts"
  - "[ ] Validate completeness against SC-PE-001 specification"
  - "[ ] Save SOP document"
---

# *extract-sop

Extracts a Standard Operating Procedure from unstructured source material. Parses documents, transcripts, interviews, or observation notes to identify procedural steps, classifies each step cognitively, assigns executor types, and structures the output into the SC-PE-001 format.

## Uso

```
*extract-sop source="./docs/onboarding-process.md" source_type=document
*extract-sop source="./transcripts/expert-interview.md" source_type=interview
```

## Parametros

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| source | string | yes | Path to the source document |
| source_type | string | yes | One of: `document`, `transcript`, `interview`, `observation` |

## Implementation

### Step 1: Source Parsing
- Load source file
- Apply parsing strategy based on source_type:
  - **document**: Extract sections, numbered lists, headers, action items
  - **transcript**: Identify speaker turns, extract action descriptions, filter filler
  - **interview**: Extract answers about "how do you do X", identify sequential actions
  - **observation**: Extract timestamped actions, sequential behaviors
- Normalize extracted content into raw step candidates

### Step 2: Step Identification
- Identify discrete procedure steps from raw candidates
- Merge overly granular steps that form a single logical action
- Split compound steps that contain multiple distinct actions
- Establish execution order (sequential, parallel where applicable)
- Identify decision points and branching logic

### Step 3: Cognitive Taxonomy Classification
Classify each step using Bloom's taxonomy:
- **Remember**: Recall facts, terms, basic concepts (e.g., "look up the client ID")
- **Understand**: Explain ideas, interpret meaning (e.g., "review the error message")
- **Apply**: Use information in new situations (e.g., "apply the template to the data")
- **Analyze**: Draw connections, identify patterns (e.g., "compare current vs. expected output")
- **Evaluate**: Justify decisions, assess quality (e.g., "decide if the result meets criteria")
- **Create**: Produce new work, design solutions (e.g., "design the integration architecture")

### Step 4: Executor Classification
Assign each step an executor type:
- **Human**: Requires judgment, creativity, empathy, or physical action that AI cannot perform
- **AI**: Deterministic, data-driven, pattern-matching, or high-volume repetitive tasks
- **Hybrid**: Requires AI assistance with human oversight, or human input with AI augmentation
- Include rationale for each classification

### Step 5: SC-PE-001 Structuring
Organize into the 11 parts of SC-PE-001:
1. Title and ID
2. Purpose and Scope
3. Definitions and Acronyms
4. Roles and Responsibilities
5. Prerequisites and Inputs
6. Procedure Steps (with cognitive and executor tags)
7. Decision Points and Branching
8. Outputs and Deliverables
9. Quality Criteria
10. Exception Handling
11. Revision History

### Step 6: Validation
- Verify all 11 parts are populated
- Check that every step has cognitive and executor classifications
- Validate logical flow (no orphan steps, no circular dependencies)
- Run completeness score (percentage of parts with substantive content)

### Step 7: Save
- Save SOP to `squads/squad-creator/data/sops/{sop-id}.md`
- Generate SOP ID from source name and date

## Error Handling

- **Source file not found**: Abort with clear path error message
- **Unrecognizable content**: If source has no identifiable procedural content, report "no procedure detected" with suggestions for what to look for
- **Ambiguous step order**: Flag ambiguous sequences, ask user to clarify in interactive mode, make best guess in yolo mode
- **Incomplete source**: If source covers only part of a procedure, note gaps in the SOP and suggest follow-up sources
- **Conflicting instructions**: Flag contradictions found in source, include both versions with notes

## Related

- `validate-sop.md` — Validates a completed SOP against SC-PE-001
- `generate-blueprint-from-sop.md` — Converts validated SOP into squad blueprint
- `analyze-automation.md` — Analyzes SOP steps for automation potential
- `squads/squad-creator/checklists/sop-validation.md` — Validation checklist
