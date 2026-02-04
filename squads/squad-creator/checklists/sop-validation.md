# SOP Validation Checklist (SC-CK-001)

> Validates completeness, accuracy, and automation readiness of extracted Standard Operating Procedures.
> Squad: squad-creator
> Created: 2025-01-01
> Reference: SC-PE-001 SOP Extraction Format

---

## Pre-Conditions

Before starting, verify:

- [ ] SOP document exists and is accessible
- [ ] Source material used for extraction is available for cross-reference
- [ ] SC-PE-001 format specification is understood by the reviewer
- [ ] Cognitive taxonomy (Bloom's) reference is available

---

## Checklist Items

### Category 1: Source Validation

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1.1 | Source material is identified with title, author, and date | [ ] | |
| 1.2 | Source type is classified (document, transcript, interview, observation) | [ ] | |
| 1.3 | Source completeness assessed -- covers the full scope of the procedure | [ ] | |
| 1.4 | Source accuracy verified -- information is current and factually correct | [ ] | |
| 1.5 | Source recency confirmed -- material is from within the last 12 months or explicitly marked as evergreen | [ ] | |
| 1.6 | Multiple sources cross-referenced where available | [ ] | |
| 1.7 | Source quality score assigned (1-10) with justification | [ ] | |

### Category 2: Extraction Completeness (SC-PE-001)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 2.1 | **Title** -- Clear, action-oriented title present | [ ] | |
| 2.2 | **Objective** -- Single-sentence purpose statement with expected outcome | [ ] | |
| 2.3 | **Scope** -- Boundaries defined (inclusions and exclusions) | [ ] | |
| 2.4 | **Prerequisites** -- Required tools, access, knowledge, and prior SOPs listed | [ ] | |
| 2.5 | **Procedure Steps** -- Numbered, atomic steps with estimated duration per step | [ ] | |
| 2.6 | **Decision Points** -- Branch logic (IF/THEN/ELSE) identified and documented | [ ] | |
| 2.7 | **Error Handling** -- Known failure modes and recovery actions specified | [ ] | |
| 2.8 | **Outputs** -- All artifacts produced are listed (files, reports, state changes) | [ ] | |
| 2.9 | **Quality Checks** -- Verification steps to confirm correctness are included | [ ] | |
| 2.10 | **Handoffs** -- Downstream consumers and their expected actions are documented | [ ] | |
| 2.11 | **Revision History** -- Version, date, author, and change summary present | [ ] | |

### Category 3: Cognitive Taxonomy

| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.1 | Each procedure step is classified using Bloom's taxonomy (Remember, Understand, Apply, Analyze, Evaluate, Create) | [ ] | |
| 3.2 | Classification is justified with reasoning for each step | [ ] | |
| 3.3 | Complexity distribution is analyzed (percentage at each level) | [ ] | |
| 3.4 | Steps at Evaluate/Create level are flagged as requiring human oversight | [ ] | |
| 3.5 | Steps at Remember/Understand/Apply level are flagged as automation candidates | [ ] | |
| 3.6 | Overall cognitive complexity score is calculated for the SOP | [ ] | |

### Category 4: Executor Classification

| # | Item | Status | Notes |
|---|------|--------|-------|
| 4.1 | Each procedure step is assigned an executor type (Human, AI, Hybrid) | [ ] | |
| 4.2 | Rationale for executor assignment is documented per step | [ ] | |
| 4.3 | Human-only steps have justification (judgment, authority, creativity required) | [ ] | |
| 4.4 | AI-assigned steps have validated automation feasibility | [ ] | |
| 4.5 | Hybrid steps define clear human/AI responsibility boundaries | [ ] | |
| 4.6 | Automation readiness percentage is calculated: `(AI + Hybrid) / Total * 100` | [ ] | |
| 4.7 | Executor distribution summary is documented (count per type) | [ ] | |

### Category 5: Automation Analysis

| # | Item | Status | Notes |
|---|------|--------|-------|
| 5.1 | PV_PM_001 automation potential analysis is completed | [ ] | |
| 5.2 | Automation score is calculated (0-100 scale) | [ ] | |
| 5.3 | Each automatable step has a recommended tool or approach | [ ] | |
| 5.4 | Recommendations are prioritized by RICE or WSJF scoring | [ ] | |
| 5.5 | ROI is estimated for each automation recommendation (time saved vs implementation effort) | [ ] | |
| 5.6 | Quick wins identified (high ROI, low effort automations) | [ ] | |
| 5.7 | Automation dependencies and prerequisites are mapped | [ ] | |
| 5.8 | Phased automation roadmap is proposed (immediate, short-term, long-term) | [ ] | |

---

## Post-Conditions

After completion, verify:

- [ ] SOP has been fully validated against all categories
- [ ] Coverage score is calculated: `(passed / total) * 100`
- [ ] Coverage score meets minimum threshold (> 80%)
- [ ] Automation recommendations are documented with priorities and ROI estimates
- [ ] Failing items have remediation notes with responsible party and deadline
- [ ] Validation report is generated and attached to the SOP document
- [ ] SOP is approved for production use or returned for revision

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Creator | | | |
| Reviewer | | | |
| Approver | | | |

---

## Usage

```bash
# Use this checklist with:
*checklist sop-validation

# Or reference in tasks:
checklist: sop-validation.md

# Validate a specific SOP:
*validate-sop --checklist sop-validation --sop <sop-file>
```

---

*Checklist created by squad-creator (SC-CK-001)*
