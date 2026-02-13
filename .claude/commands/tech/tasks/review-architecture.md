# Task: Review Architecture

> Technical architecture review for scalability and maintainability

## Metadata

| Field | Value |
|-------|-------|
| **ID** | review-architecture |
| **Agent** | tech-lead |
| **Type** | review |
| **Complexity** | medium |

## Objective

Review technical architecture to ensure scalability, maintainability, and alignment with standards.

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `scope` | text | yes | What to review (feature, module, full system) |
| `code_path` | path | no | Specific path to review |
| `concerns` | list | no | Specific concerns to address |

## Process

### Step 1: Scope Definition
- Define boundaries of review
- Identify critical paths
- List stakeholders

### Step 2: Architecture Analysis
- [ ] Component structure
- [ ] Data flow
- [ ] Dependencies
- [ ] External integrations

### Step 3: Quality Assessment

| Dimension | Weight | Questions |
|-----------|--------|-----------|
| Scalability | High | Does this scale to 100x users? |
| Maintainability | High | Can a new dev understand this? |
| Performance | Medium | Is this fast enough? |
| Complexity | Medium | Is this the simplest solution? |
| Security | High | Are there vulnerabilities? |

### Step 4: Technical Debt Identification
- Current debt items
- Risk assessment
- Prioritization

### Step 5: Recommendations
- Must fix (blockers)
- Should fix (improvements)
- Nice to have (optimizations)

## Output

```markdown
# Architecture Review: {scope}

## Summary
[Executive summary]

## Scores
| Dimension | Score (1-5) | Notes |
|-----------|-------------|-------|

## Findings
### Critical
### Important
### Minor

## Technical Debt
| Item | Risk | Effort | Priority |

## Recommendations
1. [Recommendation]

## Next Steps
- [ ] Action item
```

## Quality Gates

- [ ] All critical paths reviewed
- [ ] Security concerns addressed
- [ ] Recommendations actionable
- [ ] Technical debt documented

---

*Task v1.0 - Tech Squad*
