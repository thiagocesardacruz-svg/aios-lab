---
task: Validate SOP
responsavel: "@sop-extractor"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - sop_path: Path to the SOP document to validate (string, required)
Saida: |
  - validation_result: Pass or fail with detailed findings per part (object)
  - coverage_score: Percentage of SC-PE-001 parts that are complete and valid, 0-100% (number)
  - missing_parts: List of SC-PE-001 parts that are missing or incomplete (array)
Checklist:
  - "[ ] Load SOP document"
  - "[ ] Check all 11 SC-PE-001 parts are present"
  - "[ ] Validate cognitive taxonomy assignments"
  - "[ ] Validate executor type assignments"
  - "[ ] Check logical flow and step ordering"
  - "[ ] Run sop-validation.md checklist"
  - "[ ] Calculate coverage score"
  - "[ ] Generate validation report"
---

# *validate-sop

Validates an SOP document against the SC-PE-001 specification. Checks structural completeness, cognitive taxonomy correctness, executor assignments, and logical flow. Uses the sop-validation.md checklist for systematic verification.

## Uso

```
*validate-sop sop_path="./data/sops/onboarding-sop-001.md"
```

## Parametros

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| sop_path | string | yes | Path to the SOP document to validate |

## Implementation

### Step 1: Load and Parse
- Load SOP document from sop_path
- Parse markdown structure to identify sections
- Map sections to SC-PE-001 parts

### Step 2: Structural Completeness Check
Verify all 11 SC-PE-001 parts exist and have content:
1. Title and ID — must have unique identifier
2. Purpose and Scope — must describe what and boundaries
3. Definitions and Acronyms — can be empty if no special terms
4. Roles and Responsibilities — must list at least one role
5. Prerequisites and Inputs — must define entry conditions
6. Procedure Steps — must have at least one step
7. Decision Points and Branching — required if any conditional logic exists
8. Outputs and Deliverables — must define what is produced
9. Quality Criteria — must define success measures
10. Exception Handling — must cover at least common failures
11. Revision History — must have at least initial version entry

### Step 3: Cognitive Taxonomy Validation
- Verify every procedure step has a cognitive classification
- Check classifications are valid Bloom's taxonomy levels
- Verify classifications are reasonable for the step content (flag obvious misclassifications)
- Check for distribution: warn if all steps are same level (unlikely in real procedures)

### Step 4: Executor Assignment Validation
- Verify every procedure step has an executor type (Human, AI, Hybrid)
- Validate that executor types are consistent with cognitive classifications
  - Create-level steps rarely pure AI
  - Remember-level steps rarely pure Human
- Check that rationale is provided for each assignment

### Step 5: Logical Flow Validation
- Verify steps follow a logical sequence
- Check for missing transitions between steps
- Verify decision points have all branches defined
- Check for unreachable steps or dead-end branches
- Validate that prerequisites reference valid outputs from prior steps

### Step 6: Checklist Execution
- Load `squads/squad-creator/checklists/sop-validation.md`
- Execute each checklist item against the SOP
- Record pass/fail for each item

### Step 7: Scoring and Report
- Calculate coverage_score: (valid_parts / 11) * 100
- Compile missing_parts list with details on what is needed
- Generate validation_result with per-part status and findings
- Determine overall pass/fail: pass requires coverage_score >= 80 and no critical parts missing (Parts 1, 5, 6, 8 are critical)

## Error Handling

- **SOP file not found**: Abort with path error, suggest listing available SOPs
- **SOP not in expected format**: Attempt best-effort parsing, report structural issues found
- **Checklist file missing**: Run validation without checklist, note that checklist validation was skipped
- **Ambiguous section mapping**: Flag sections that could not be mapped to SC-PE-001 parts, include in report

## Related

- `extract-sop.md` — Creates SOPs that this task validates
- `generate-blueprint-from-sop.md` — Requires validated SOP as input
- `analyze-automation.md` — Works best with validated SOPs
- `squads/squad-creator/checklists/sop-validation.md` — Checklist used during validation
