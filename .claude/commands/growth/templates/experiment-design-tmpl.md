# Experiment Design Template

## Identity
- **Template ID:** experiment-design-tmpl
- **Squad:** growth
- **Version:** 1.0.0

---

# Experiment: {EXPERIMENT_NAME}

## Metadata
- **ID:** EXP-{YYYY}-{NNN}
- **Owner:** {agent}
- **Status:** draft | approved | running | completed | cancelled
- **Priority:** P1 | P2 | P3
- **Created:** {YYYY-MM-DD}

## Hypothesis

### Problem Statement
{What problem are we trying to solve? What evidence suggests this is a problem?}

### Hypothesis
**If** {we do this change}
**Then** {this metric will improve}
**Because** {this is why we believe it will work}

### Null Hypothesis
{What would prove our hypothesis wrong?}

## Metrics

### Primary Metric
| Metric | Current | Target | MDE |
|--------|---------|--------|-----|
| {metric_name} | {current_value} | {target_value} | {minimum_detectable_effect} |

### Secondary Metrics
| Metric | Current | Purpose |
|--------|---------|---------|
| {metric_1} | {value} | {why tracking} |
| {metric_2} | {value} | {why tracking} |

### Guardrail Metrics
| Metric | Threshold | Action if Breached |
|--------|-----------|-------------------|
| {metric} | {threshold} | {action} |

## Design

### Variants
| Variant | Description | Traffic % |
|---------|-------------|-----------|
| Control | {current experience} | 50% |
| Treatment | {new experience} | 50% |

### Targeting
- **Audience:** {who will see this}
- **Exclusions:** {who should NOT see this}
- **Segments to analyze:** {list of segments}

### Sample Size Calculation
- **Baseline conversion:** {percentage}
- **MDE:** {percentage}
- **Confidence level:** 95%
- **Power:** 80%
- **Required sample per variant:** {n}
- **Estimated duration:** {days/weeks}

## Implementation

### Changes Required
- [ ] {change_1}
- [ ] {change_2}
- [ ] {change_3}

### Technical Requirements
- **Feature flag:** {flag_name}
- **Tracking events:** {list}
- **Dependencies:** {list}

### Rollout Plan
1. {step_1}
2. {step_2}
3. {step_3}

## Risk Assessment

### Potential Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| {risk_1} | Low/Med/High | Low/Med/High | {mitigation} |

### Rollback Plan
{How to quickly revert if something goes wrong}

## Timeline

| Phase | Date | Owner |
|-------|------|-------|
| Design complete | {date} | {owner} |
| Implementation ready | {date} | {owner} |
| QA complete | {date} | {owner} |
| Launch | {date} | {owner} |
| Analysis ready | {date} | {owner} |

## Approvals

| Role | Name | Date | Status |
|------|------|------|--------|
| Growth Lead | | | Pending |
| Tech Lead | | | Pending |
| Product | | | Pending |

---

## Checklist

- [ ] Hypothesis clearly stated
- [ ] Metrics defined with targets
- [ ] Sample size calculated
- [ ] Variants documented
- [ ] Implementation plan ready
- [ ] Risks assessed
- [ ] Rollback plan defined
- [ ] Approvals obtained
