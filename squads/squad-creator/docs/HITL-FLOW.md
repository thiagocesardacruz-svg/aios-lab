# Human-in-the-Loop (HITL) Flow

> Detailed documentation of all human interaction points in Squad Creator v2.6

---

## Overview

Squad Creator v2.6 uses HITL at critical decision points to ensure quality, safety, and alignment with user intent. Every automated pipeline includes checkpoints where human judgment is required or recommended before proceeding.

HITL is not optional friction — it is a design principle. The system produces better outcomes when human expertise is applied at the right moments. The goal is to automate the tedious parts while keeping humans in control of the important decisions.

---

## HITL Integration Points

### 1. Mind Cloning

Mind cloning has the highest density of HITL points because it involves creating representations of real people.

| Point | When | Type | Can Skip? |
|-------|------|------|-----------|
| Source Approval | After `*auto-acquire-sources` | Approval Gate | No |
| Voice DNA Review | After extraction | Review Checkpoint | Yes (YOLO only) |
| Thinking DNA Review | After extraction | Review Checkpoint | Yes (YOLO only) |
| Profile Merge Approval | Before saving merged profile | Approval Gate | No |
| Smoke Test Judgment | After 3 scenarios | Collaborative Step | No |
| Fidelity Override | When score < threshold | Override Capability | Yes |

**Source Approval Flow:**
```
System: Found 8 sources for "Nicolas Oala":
  1. [HIGH] LinkedIn profile — 3 posts, 2 articles
  2. [HIGH] GitHub — 15 repos, README patterns
  3. [MED]  Medium — 4 blog posts
  4. [LOW]  Twitter/X — 12 tweets (limited signal)
  5. [LOW]  YouTube — 1 conference talk transcript

? Which sources should we include? (select multiple)
> [x] 1. LinkedIn profile
> [x] 2. GitHub
> [x] 3. Medium
> [ ] 4. Twitter/X
> [x] 5. YouTube
```

**Smoke Test Judgment Flow:**
```
Smoke Test Results for "nicolas-oala":

Scenario 1 — Email Writing (informal to colleague):
  Output: "Fala! Vi que o PR ta com uns edge cases..."
  ? Does this match the person's communication? (1-5): _

Scenario 2 — Decision Making (choose between two architectures):
  Output: "Eu iria com microservices aqui porque..."
  ? Does this match the person's reasoning? (1-5): _

Scenario 3 — Conflict Resolution (disagreement in code review):
  Output: "Entendo seu ponto, mas olha esse tradeoff..."
  ? Does this match the person's approach? (1-5): _

Fidelity Score: 78% (target: 85%)
? Accept profile or add more sources? [accept/add-sources]
```

### 2. Tool Discovery

Tool discovery uses HITL primarily at the decision phase to validate automated scoring.

| Point | When | Type | Can Skip? |
|-------|------|------|-----------|
| Gap Prioritization | After Phase 0 | Review Checkpoint | Yes |
| Security Gate Override | When gate fails but tool needed | Override Capability | No |
| Decision Matrix Approval | After Phase 3 | Approval Gate | No |
| Registry Update Confirmation | Before writing to registry | Approval Gate | Yes |

**Decision Matrix Approval Flow:**
```
Tool Discovery Results — Domain: "data-processing"

| Tool      | RICE | WSJF | Security | Social | Tier | Decision |
|-----------|------|------|----------|--------|------|----------|
| dbt-core  |  92  |  88  |   PASS   |  PASS  |  T1  | DO NOW   |
| Airbyte   |  78  |  72  |   PASS   |  PASS  |  T2  | DO NEXT  |
| Meltano   |  65  |  58  |   PASS   |  FAIL  |  T3  | DO LATER |
| custom-etl|  32  |  25  |  PENDING |  FAIL  |  T4  | DON'T DO |

? Approve these decisions? You can override any row.
  1. Accept all
  2. Override specific tool decisions
  3. Re-evaluate with different weights
> _
```

**Security Gate Override:**
```
SECURITY GATE FAILED for "legacy-parser" v2.3.1:
  - CVE-2024-1234: Medium severity (input validation)
  - Last patched: 8 months ago
  - Maintainer response: slow (>30 days)

? This tool addresses a critical capability gap.
  1. Reject — find alternative
  2. Accept with risk — document mitigation plan
  3. Pin to specific version + monitor
> _
```

### 3. SOP Extraction

SOP extraction uses HITL to validate the fidelity of extraction from source material.

| Point | When | Type | Can Skip? |
|-------|------|------|-----------|
| Source Interpretation | Ambiguous source content | Collaborative Step | No |
| Step Classification Review | After cognitive taxonomy | Review Checkpoint | Yes |
| Executor Assignment Review | After executor classification | Review Checkpoint | Yes |
| Automation Recommendation Approval | After PV_PM_001 analysis | Approval Gate | No |
| Blueprint Generation Approval | Before creating squad design | Approval Gate | No |

**Step Classification Review:**
```
SOP: "Customer Onboarding Process"

Step 3: "Review customer documentation for completeness"
  Cognitive Level: Evaluate (level 5)
  Executor: Hybrid (AI pre-check + Human final review)
  Automation Potential: 70%

  ? Agree with classification? [y/n/modify]
  ? If modifying, select:
    Cognitive: [Remember/Understand/Apply/Analyze/Evaluate/Create]
    Executor: [Human/AI/Hybrid]
> _
```

### 4. Squad Quality

Quality dashboard uses HITL for improvement prioritization.

| Point | When | Type | Can Skip? |
|-------|------|------|-----------|
| Improvement Prioritization | After suggestions generated | Review Checkpoint | Yes |
| Score Override | When automated score seems wrong | Override Capability | Yes |

---

## HITL Types

### Approval Gate
A hard stop that requires explicit human approval before proceeding. The pipeline cannot continue without a "yes" from the user. Used for irreversible actions or high-impact decisions.

**Characteristics:**
- Pipeline blocks until response
- Binary outcome: approve or reject
- Rejection triggers alternative flow
- Logged for audit trail

### Review Checkpoint
A soft stop that presents information for human review. The user can accept the default, modify, or reject. Can be skipped in fast modes (YOLO).

**Characteristics:**
- Shows current state and proposed action
- User can accept, modify, or reject
- Skippable in YOLO mode
- Modifications feed back into pipeline

### Override Capability
Allows humans to override automated decisions when they have domain knowledge the system lacks. Used when gates fail but the tool or decision is still desired.

**Characteristics:**
- System explains why it recommends against
- User provides justification for override
- Override is documented with rationale
- May trigger additional monitoring

### Collaborative Step
Requires human judgment that the system cannot replicate. The system provides structured input and the human provides qualitative assessment.

**Characteristics:**
- System provides scaffolding (scenarios, criteria)
- Human provides subjective evaluation
- Combined human + system judgment produces result
- Cannot be automated or skipped

---

## Configuring HITL Thresholds

HITL behavior can be adjusted per-execution using mode flags:

| Mode | Approval Gates | Review Checkpoints | Overrides |
|------|---------------|-------------------|-----------|
| **QUALITY** | All active | All active | Available |
| **YOLO** | Critical only | Skipped | Available |
| **AUTONOMOUS** | None (for CI/CD) | None | Not available |

### Mode Selection

```bash
# Quality mode — all HITL active (default)
*clone-mind "John" --mode quality

# YOLO mode — skip review checkpoints
*clone-mind "John" --mode yolo

# Autonomous mode — for pipeline integration (no interaction)
# Only available for: *validate-squad, *show-tools, *quality-dashboard
```

### Custom Thresholds

Tasks with `elicit: true` in their frontmatter always require interaction. Tasks with `elicit: false` can run autonomously. To override per-execution:

```bash
# Force interaction on a normally autonomous task
*show-tools --interactive

# Skip optional interaction (only works for review checkpoints)
*extract-sop --source ./doc.md --skip-reviews
```

---

## HITL in Workflows

The `wf-discover-tools` workflow has built-in HITL at phase boundaries:

```
Phase 0 (Gap Analysis)
    |
    v
[HITL: Review and prioritize gaps]
    |
    v
Phase 1 (Parallel Search)
    |
    v
[HITL: Review candidate list, remove irrelevant]
    |
    v
Phase 2 (Evaluation)
    |
    v
[HITL: Override gate failures if justified]
    |
    v
Phase 3 (Decision Matrix)
    |
    v
[HITL: Approve final decisions before registry update]
    |
    v
Done
```

---

## Veto Conditions

Certain conditions trigger automatic vetoes that cannot be overridden, even by the user:

| Condition | Applies To | Reason |
|-----------|-----------|--------|
| Critical CVE (CVSS > 9.0) | Tool Discovery | Unacceptable security risk |
| No license declared | Tool Discovery | Legal liability |
| Zero sources available | Mind Cloning | Cannot extract without data |
| SOP source is empty/corrupt | SOP Extraction | No content to extract |
| Squad manifest missing `name` | Squad Validation | Schema requires it |

These are defined by `@pedro-valerio` via `*define-veto-conditions` and enforced at the system level.

---

## Audit Trail

All HITL interactions are logged for traceability:

```yaml
hitl_log:
  - timestamp: "2025-06-15T14:30:00Z"
    type: approval_gate
    pipeline: clone-mind
    point: profile_merge_approval
    decision: approved
    user_comment: "Profile looks accurate"

  - timestamp: "2025-06-15T14:35:00Z"
    type: override
    pipeline: discover-tools
    point: security_gate
    original_decision: reject
    override_decision: accept_with_risk
    justification: "Only tool available for this capability, will pin to v2.3.0"
```

---

*HITL is not bureaucracy — it is quality insurance. The best squads are built by humans and AI working together.*
