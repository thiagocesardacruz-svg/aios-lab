# Review Creative

## Identity
- **ID:** review-creative
- **Squad:** design
- **Agent:** design-lead
- **Type:** task

## Purpose

Quality review of creative assets before delivery to ensure brand compliance and conversion optimization.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `asset_type` | string | Yes | ad/social/vsl/brand/landing |
| `files` | list | Yes | Files to review |
| `brief` | string | No | Original brief reference |
| `checklist` | string | No | Specific checklist to apply |

## Process

### 1. Brief Alignment
- Compare to original brief
- Verify all deliverables present
- Check messaging accuracy
- Confirm target audience fit

### 2. Brand Compliance
- Logo usage correct
- Colors match palette
- Typography consistent
- Tone alignment

### 3. Conversion Optimization
- Visual hierarchy clear
- CTA prominent
- Mobile optimized
- Scroll-stopping hook

### 4. Technical Quality
- Resolution adequate
- File sizes optimized
- Correct formats
- No artifacts/errors

### 5. Feedback Generation
- Document issues
- Provide solutions
- Prioritize fixes
- Approve or request revisions

## Output

```yaml
creative_review:
  asset_type: "{type}"
  review_date: "{date}"
  reviewer: "design-lead"

  overall_status: "{approved/revisions_needed/rejected}"

  scores:
    brand_compliance: {1-5}
    conversion_focus: {1-5}
    technical_quality: {1-5}
    brief_alignment: {1-5}

  checklist_results:
    passed: {count}
    failed: {count}
    na: {count}

  issues:
    - severity: "{critical/major/minor}"
      item: "{what}"
      location: "{where}"
      fix: "{how_to_fix}"

  approved_assets:
    - file: "{path}"
      status: "approved"

  revision_requests:
    - file: "{path}"
      changes: ["{change_1}", "{change_2}"]

  notes: "{additional_feedback}"
```

## Review Criteria by Type

### Ad Creatives
- [ ] Stops scroll
- [ ] Message clear in 3 sec
- [ ] CTA visible
- [ ] Platform specs met
- [ ] Text within limits

### Social Posts
- [ ] Brand consistent
- [ ] Engaging visual
- [ ] Readable on mobile
- [ ] Carousel flow logical
- [ ] CTA clear

### VSL Slides
- [ ] Script timing matched
- [ ] Text readable
- [ ] Emotional beats hit
- [ ] Transitions smooth
- [ ] Brand aligned

### Landing Visuals
- [ ] Above fold optimized
- [ ] Hierarchy clear
- [ ] Mobile responsive
- [ ] Fast loading
- [ ] Consistent with ads

## Severity Definitions

| Level | Description | Action |
|-------|-------------|--------|
| Critical | Blocks delivery | Must fix before release |
| Major | Significant issue | Should fix before release |
| Minor | Polish item | Fix if time permits |

## Quality Criteria

- [ ] All checklist items evaluated
- [ ] Issues clearly documented
- [ ] Solutions provided
- [ ] Priority assigned
- [ ] Decision documented

## Related

- **Checklists:** All design checklists
- **Template:** `creative-brief.md`
