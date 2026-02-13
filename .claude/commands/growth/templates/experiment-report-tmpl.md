# Experiment Report Template

## Identity
- **Template ID:** experiment-report-tmpl
- **Squad:** growth
- **Version:** 1.0.0

---

# Experiment Report: {EXPERIMENT_NAME}

## Summary

| Field | Value |
|-------|-------|
| **Experiment ID** | EXP-{YYYY}-{NNN} |
| **Status** | Winner / No Winner / Inconclusive |
| **Run dates** | {start_date} - {end_date} |
| **Duration** | {N} days |
| **Owner** | {agent} |

### TL;DR
{One paragraph summary: what we tested, what happened, what we're doing next}

## Results Overview

### Primary Metric: {metric_name}

| Variant | Visitors | Conversions | Rate | vs Control |
|---------|----------|-------------|------|------------|
| Control | {n} | {n} | {%} | - |
| Treatment | {n} | {n} | {%} | {+/-}% |

### Statistical Significance

| Metric | Value |
|--------|-------|
| **Lift** | {+/-X}% |
| **Confidence** | {X}% |
| **P-value** | {0.XXX} |
| **Effect size (Cohen's d)** | {X.XX} |

### Verdict
- [ ] ✅ **Significant positive result** - Implement treatment
- [ ] ❌ **Significant negative result** - Keep control
- [ ] ⚠️ **Not significant** - Need more data or iterate
- [ ] 🔄 **Inconclusive** - Technical issues, stop experiment

## Detailed Analysis

### Secondary Metrics

| Metric | Control | Treatment | Lift | Significant? |
|--------|---------|-----------|------|--------------|
| {metric_1} | {value} | {value} | {%} | Yes/No |
| {metric_2} | {value} | {value} | {%} | Yes/No |

### Guardrail Metrics

| Metric | Threshold | Control | Treatment | Status |
|--------|-----------|---------|-----------|--------|
| {metric} | {threshold} | {value} | {value} | ✅/⚠️ |

### Segment Analysis

| Segment | Control Rate | Treatment Rate | Lift | Notes |
|---------|--------------|----------------|------|-------|
| {segment_1} | {%} | {%} | {%} | {notes} |
| {segment_2} | {%} | {%} | {%} | {notes} |

### Best Performing Segment
**{Segment name}** showed the highest lift of **{X}%** with **{confidence}%** confidence.

### Worst Performing Segment
**{Segment name}** showed **{negative/neutral}** results, suggesting {insight}.

## Data Quality

### Sample Validity
- [ ] Sufficient sample size reached
- [ ] No SRM (Sample Ratio Mismatch) detected
- [ ] Randomization verified
- [ ] No novelty effects detected
- [ ] No data quality issues found

### Issues Encountered
{List any data quality or technical issues, or "None"}

## Learnings

### What We Learned
1. {learning_1}
2. {learning_2}
3. {learning_3}

### Surprising Findings
- {surprising_finding_1}
- {surprising_finding_2}

### Failed Assumptions
- {assumption_that_was_wrong}

## Recommendations

### Immediate Actions
- [ ] {action_1}
- [ ] {action_2}

### Follow-up Experiments
| Experiment | Hypothesis | Priority |
|------------|------------|----------|
| {experiment_1} | {hypothesis} | P1/P2/P3 |
| {experiment_2} | {hypothesis} | P1/P2/P3 |

### Implementation Plan (if winner)
1. {step_1}
2. {step_2}
3. {step_3}

**Target deployment date:** {date}

## Appendix

### Raw Data Location
{Link or path to raw data}

### Charts & Visualizations
{Include or link to charts}

### Hypothesis Recap
**If** {original change}
**Then** {expected outcome}
**Because** {reasoning}

**Result:** {Confirmed / Partially Confirmed / Rejected}

---

## Sign-off

| Role | Name | Date |
|------|------|------|
| Analyst | | |
| Growth Lead | | |
| Product | | |

**Report generated:** {YYYY-MM-DD}
