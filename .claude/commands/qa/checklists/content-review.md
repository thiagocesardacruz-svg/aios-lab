# Content Review Checklist

## Meta
- **ID:** content-review
- **Squad:** qa
- **Used by:** content-reviewer, review-content workflow
- **Trigger:** Before content is published or delivered
- **Type:** quality-gate

## Items

### Accuracy

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 1 | Facts verified | All claims have source or are common knowledge | 🔴 |
| 2 | No placeholder text | No [TBD], lorem ipsum, or XXX markers | 🔴 |
| 3 | Dates and numbers correct | All dates/numbers verified against source | 🔴 |

### Brand Voice

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 4 | Tone matches brand | Follows brand voice guidelines | 🟡 |
| 5 | No prohibited terms | No blacklisted words or phrases | 🔴 |
| 6 | Consistent terminology | Uses approved product/feature names | 🟡 |

### Quality

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 7 | Spelling checked | No spelling errors | 🔴 |
| 8 | Grammar checked | No grammatical errors | 🟡 |
| 9 | Readability appropriate | Reading level matches target audience | 🟡 |

### Functionality

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 10 | All links work | Every link tested and working | 🔴 |
| 11 | CTA clear and present | Call to action visible and actionable | 🔴 |
| 12 | Images load | All images display correctly | 🔴 |

## Gate Rule
- **Pass:** All 🔴 items pass + max 2 🟡 warnings
- **Fail:** Any 🔴 item fails
- **Action on fail:** Return to content creator with specific items to fix
