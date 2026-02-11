# Experiment Checklist

## Identity
- **ID:** experiment-checklist
- **Squad:** growth
- **Type:** checklist
- **Version:** 1.0.0

---

## Pre-Experiment

### Hypothesis Quality
- [ ] Problem statement clearly defined
- [ ] Hypothesis follows IF/THEN/BECAUSE format
- [ ] Null hypothesis documented
- [ ] Hypothesis is falsifiable

### Metric Definition
- [ ] Primary metric selected
- [ ] Primary metric is measurable
- [ ] Secondary metrics defined
- [ ] Guardrail metrics identified
- [ ] Baseline values documented
- [ ] Target values set with MDE

### Statistical Design
- [ ] Sample size calculated
- [ ] Power analysis completed (80%+ power)
- [ ] Confidence level set (typically 95%)
- [ ] Expected duration estimated
- [ ] No peeking plan in place

### Technical Readiness
- [ ] Feature flag created
- [ ] Tracking events implemented
- [ ] Data pipeline verified
- [ ] QA test completed
- [ ] Randomization logic verified

### Documentation
- [ ] Experiment design document complete
- [ ] Approval from Growth Lead
- [ ] Approval from Tech Lead
- [ ] Launch date scheduled

---

## During Experiment

### Launch Day
- [ ] Experiment activated
- [ ] Traffic split verified (50/50 or as designed)
- [ ] First data points appearing
- [ ] No errors in tracking
- [ ] Team notified of launch

### Daily Monitoring
- [ ] No SRM (Sample Ratio Mismatch)
- [ ] No data quality issues
- [ ] Guardrail metrics stable
- [ ] No external factors affecting test
- [ ] Progress documented

### Red Flags to Watch
- [ ] SRM > 1% deviation → Investigate
- [ ] Guardrail breach → Consider stopping
- [ ] Bug reports in treatment → Fix or stop
- [ ] External events (marketing, PR) → Document

---

## Post-Experiment

### Data Validation
- [ ] Final sample size sufficient
- [ ] SRM check passed
- [ ] Data quality verified
- [ ] No novelty effects detected
- [ ] No network effects unaccounted for

### Statistical Analysis
- [ ] Primary metric analyzed
- [ ] Confidence interval calculated
- [ ] P-value calculated
- [ ] Effect size calculated
- [ ] Multiple comparison correction (if needed)

### Segment Analysis
- [ ] Key segments analyzed
- [ ] Differential effects documented
- [ ] Best/worst segments identified
- [ ] Segment-specific insights captured

### Decision Making
- [ ] Winner declared OR no winner documented
- [ ] Decision rationale documented
- [ ] Stakeholders informed
- [ ] Implementation plan (if winner)
- [ ] Next steps defined

### Documentation
- [ ] Experiment report complete
- [ ] Learnings documented
- [ ] Knowledge base updated
- [ ] Results shared with team
- [ ] Archive experiment artifacts

---

## Quality Gates

### Must Have Before Launch
| Gate | Status |
|------|--------|
| Hypothesis documented | [ ] |
| Sample size calculated | [ ] |
| Tracking verified | [ ] |
| Approvals obtained | [ ] |

### Must Have Before Decision
| Gate | Status |
|------|--------|
| Sample size reached | [ ] |
| SRM check passed | [ ] |
| Primary metric analyzed | [ ] |
| Statistical significance evaluated | [ ] |

---

## Common Mistakes to Avoid

### Design Phase
- ❌ Vague hypothesis
- ❌ No sample size calculation
- ❌ Too many variants
- ❌ Metric not aligned with hypothesis

### Running Phase
- ❌ Peeking at results and stopping early
- ❌ Changing experiment mid-flight
- ❌ Ignoring SRM
- ❌ No monitoring plan

### Analysis Phase
- ❌ Cherry-picking segments
- ❌ Ignoring inconclusive results
- ❌ Not documenting learnings
- ❌ Declaring winner without significance

---

## Templates & Resources

- [Experiment Design Template](../templates/experiment-design-tmpl.md)
- [Experiment Report Template](../templates/experiment-report-tmpl.md)
- [Sample Size Calculator](../data/growth-metrics.yaml)

---

**Last updated:** {date}
**Owner:** Growth Squad
