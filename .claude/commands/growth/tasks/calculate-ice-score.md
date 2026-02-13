# Calculate ICE Score

## Identity
- **ID:** calculate-ice-score
- **Squad:** growth
- **Agent:** growth-lead
- **Type:** task

## Purpose

Calculate ICE (Impact, Confidence, Ease) scores to prioritize growth initiatives.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `initiatives` | list | Yes | List of initiatives to score |
| `context` | string | No | Additional context |

## Process

### 1. Score Impact (1-10)
- How much will this move the needle?
- What's the potential upside?
- How many users affected?

### 2. Score Confidence (1-10)
- How sure are we it will work?
- Do we have data to support?
- Have we seen this work before?

### 3. Score Ease (1-10)
- How easy to implement?
- Resources required?
- Dependencies?

### 4. Calculate & Rank
- ICE = (I + C + E) / 3
- Rank by score
- Consider dependencies

## ICE Scale Guide

### Impact
| Score | Meaning |
|-------|---------|
| 10 | 10x improvement |
| 7-9 | Major improvement |
| 4-6 | Moderate improvement |
| 1-3 | Minor improvement |

### Confidence
| Score | Meaning |
|-------|---------|
| 10 | Proven, data-backed |
| 7-9 | Strong evidence |
| 4-6 | Some evidence |
| 1-3 | Gut feeling |

### Ease
| Score | Meaning |
|-------|---------|
| 10 | Trivial, <1 day |
| 7-9 | Easy, <1 week |
| 4-6 | Moderate, 1-2 weeks |
| 1-3 | Hard, >2 weeks |

## Output

```yaml
ice_scores:
  date: "{date}"

  initiatives:
    - name: "{initiative_1}"
      impact: {score}
      confidence: {score}
      ease: {score}
      ice_score: {average}
      notes: "{notes}"

    - name: "{initiative_2}"
      impact: {score}
      confidence: {score}
      ease: {score}
      ice_score: {average}
      notes: "{notes}"

  ranking:
    1: "{highest_priority}"
    2: "{second_priority}"
    3: "{third_priority}"

  recommendation: "{top_3_to_pursue}"
```

## Quality Criteria

- [ ] All factors scored
- [ ] Scores justified
- [ ] Ranking clear
- [ ] Dependencies noted

## Related

- **Workflow:** `/growth/create-wave`
- **Data:** `growth-metrics.yaml`
