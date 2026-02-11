# Task: Review Translation

## Identity
- **ID:** review-translation
- **Squad:** translator
- **Type:** task

---

## Objective

Review an existing translation for accuracy, quality, and cultural appropriateness.

---

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| original | Yes | Original content |
| translation | Yes | Translation to review |
| source_language | No | Source language (default: EN) |
| target_language | Yes | Target language code |
| review_depth | No | quick, standard, deep (default: standard) |

---

## Review Checklist

### Accuracy Review
```markdown
- [ ] All content translated (nothing missing)
- [ ] Meaning accurately conveyed
- [ ] No additions or omissions
- [ ] Numbers and data correct
- [ ] Names and proper nouns handled correctly
```

### Language Quality
```markdown
- [ ] Grammar correct
- [ ] Spelling correct
- [ ] Punctuation appropriate
- [ ] Natural flow in target language
- [ ] No awkward phrasing
```

### Terminology
```markdown
- [ ] Consistent term usage
- [ ] Glossary terms used correctly
- [ ] Technical terms accurate
- [ ] Brand terms preserved/adapted correctly
```

### Tone & Style
```markdown
- [ ] Tone matches original
- [ ] Formality level appropriate
- [ ] Style consistent throughout
- [ ] Voice maintained
```

### Cultural Fit
```markdown
- [ ] Culturally appropriate
- [ ] Idioms properly adapted
- [ ] No offensive content
- [ ] Local references relevant
```

---

## Scoring Guide

| Score | Meaning |
|-------|---------|
| 95-100 | Excellent - Publish ready |
| 85-94 | Good - Minor edits needed |
| 70-84 | Acceptable - Some revision needed |
| 50-69 | Poor - Significant revision needed |
| <50 | Reject - Retranslate |

---

## Output Format

```markdown
## Translation Review Report

### Overview
- **Source:** [language]
- **Target:** [language]
- **Review Type:** [quick/standard/deep]
- **Reviewer:** [agent]

### Scores
| Category | Score | Notes |
|----------|-------|-------|
| Accuracy | /100 | |
| Language | /100 | |
| Terminology | /100 | |
| Tone | /100 | |
| Cultural | /100 | |
| **OVERALL** | **/100** | |

### Issues Found

#### Critical (Must Fix)
- [Issue description + location + suggestion]

#### Major (Should Fix)
- [Issue description + location + suggestion]

#### Minor (Nice to Fix)
- [Issue description + location + suggestion]

### Verdict: [APPROVE / REVISE / REJECT]

### Recommendations
[Specific recommendations for improvement]
```

---

## Quality Criteria

- [ ] All categories reviewed
- [ ] Issues clearly documented
- [ ] Actionable recommendations
- [ ] Fair and consistent scoring
