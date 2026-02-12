# Five Trust Behaviors Reference

This document defines the Five Trust Behaviors that the Handover Validator enforces.

## Overview

The Five Trust Behaviors define trustworthy agent behavior, ensuring reliable handovers between agents in the AIOS system.

## The Five Behaviors

### 1. Verification Before Claim

**Rule:** Never say "done" without proof.

**Schema Enforcement:**
- `verification.evidence` array must contain items when claiming completion
- Evidence should be specific and verifiable
- Examples: "Schema created and validated", "12/12 tests passing"

**Implementation:**
```yaml
verification:
  evidence:
    - "Schema JSON created with all required fields"
    - "12/12 validation tests passing"
    - "Governance rules documented"
```

### 2. Loud Failure

**Rule:** No silent fallbacks.

**Schema Enforcement:**
- Validation errors are surfaced explicitly
- `verification.blockers` array for known issues
- Receiving agent must know about any problems

**Implementation:**
```yaml
verification:
  blockers:
    - "Dependency X not yet available"
    - "Waiting for @architect approval on design"
```

### 3. Honest Uncertainty

**Rule:** "I don't know" is valid.

**Schema Enforcement:**
- `verification.confidence` field is REQUIRED
- Valid values: `low`, `medium`, `high`
- Evidence required when confidence < high

**Implementation:**
```yaml
verification:
  confidence: "medium"  # Being honest about uncertainty
  evidence:
    - "Implemented based on interpretation of requirements"
    - "May need validation from @pm"
```

### 4. Paper Trail

**Rule:** Every action documented.

**Schema Enforcement:**
- `paper_trail` object for audit trail
- ClickUp task ID for tracking
- Git commit for code changes
- Timestamp for temporal tracking

**Implementation:**
```yaml
paper_trail:
  clickup_task_id: "86c86efzv"
  clickup_url: "https://app.clickup.com/t/86c86efzv"
  git_commit: "feat(gov): add handover schema"
  git_branch: "feature/GOV-001.1"
  timestamp: "2026-02-12T15:00:00Z"
```

### 5. Diligent Execution

**Rule:** No shortcuts, even when tedious.

**Schema Enforcement:**
- `verification.checklist_completed` must be `true`
- `verification.checklist_path` documents which checklist was used
- Cannot skip steps for "efficiency"

**Implementation:**
```yaml
verification:
  checklist_completed: true
  checklist_path: "checklists/story-complete.md"
```

## Validation Matrix

| Behavior | Schema Field | Validation Rule |
|----------|-------------|-----------------|
| Verification Before Claim | `verification.evidence` | Required when confidence < high |
| Loud Failure | `verification.blockers` | Must surface known issues |
| Honest Uncertainty | `verification.confidence` | Required field (low/medium/high) |
| Paper Trail | `paper_trail.*` | ClickUp ID, git commit, timestamp |
| Diligent Execution | `verification.checklist_completed` | Must be `true` |

## Anti-Patterns

### DON'T: Skip Evidence

```yaml
# BAD - High claim without evidence
verification:
  checklist_completed: true
  confidence: "high"
  # No evidence to back up the claim
```

### DON'T: Hide Problems

```yaml
# BAD - Known issue not documented
verification:
  checklist_completed: true
  confidence: "high"
  # Blockers array empty even though there's a known dependency issue
```

### DON'T: Claim False Certainty

```yaml
# BAD - Saying "high" when unsure
verification:
  checklist_completed: true
  confidence: "high"  # Actually uncertain about requirements
```

### DON'T: Skip Paper Trail

```yaml
# BAD - No audit trail
verification:
  checklist_completed: true
  confidence: "high"
# No paper_trail at all - impossible to trace
```

### DON'T: Bypass Checklist

```yaml
# BAD - Skipping checklist "for speed"
verification:
  checklist_completed: false  # "Will do it later"
  confidence: "high"
```

## Good Examples

### Complete Handover

```yaml
handover_contract:
  from_agent: "@architect"
  to_agent: "@dev"
  artifact_type: "story"
  artifact_id: "GOV-001.2"

  verification:
    checklist_completed: true
    checklist_path: "checklists/story-ready-for-dev.md"
    confidence: "high"
    evidence:
      - "Schema JSON created with all required fields"
      - "12/12 validation tests passing"
      - "Governance rules documented"
      - "Squad template updated"
    blockers: []  # Explicitly empty = no blockers

  paper_trail:
    clickup_task_id: "86c86efzv"
    clickup_url: "https://app.clickup.com/t/86c86efzv"
    git_branch: "feature/GOV-001.1"
    timestamp: "2026-02-12T15:00:00Z"

  next_actions:
    - "@dev: Implement /handover-validator skill"
    - "@qa: Validate when complete"
```

### Honest Uncertainty Handover

```yaml
handover_contract:
  from_agent: "@pm"
  to_agent: "@architect"
  artifact_type: "epic"

  verification:
    checklist_completed: true
    checklist_path: "checklists/epic-draft.md"
    confidence: "medium"  # Honest about uncertainty
    evidence:
      - "Epic structure defined based on initial requirements"
      - "Some technical details may need refinement"
    blockers:
      - "Technical feasibility not yet validated"
    assumptions:
      - "Assumed we can use JSON Schema for validation"
      - "Assumed ClickUp API supports custom fields"

  paper_trail:
    clickup_task_id: "86c86efw9"
    timestamp: "2026-02-12T14:00:00Z"

  next_actions:
    - "@architect: Validate technical assumptions"
    - "@architect: Refine schema design"
```

## Integration Points

- **Validator**: `.claude/skills/handover-validator/scripts/validate-handover.js`
- **Schema**: `governance/schemas/handover-contract-schema.json`
- **Rules**: `.claude/rules/handover-contracts.md`
- **ClickUp Integration**: `squads/ops/scripts/clickup-sync.mjs`

## References

- Epic: AIOS-GOV-001 (Handover Contracts System)
- Veritas Framework (original inspiration for Five Trust Behaviors)
