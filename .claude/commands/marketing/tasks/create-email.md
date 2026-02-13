# Create Email

## Identity
- **ID:** create-email
- **Squad:** marketing
- **Agent:** copy-specialist
- **Type:** task

## Purpose

Create email copy for any purpose: welcome, nurture, sales, transactional, or re-engagement.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | welcome/nurture/sales/cart/reengagement |
| `sequence_position` | number | No | Position in sequence (1-based) |
| `subject_lines` | number | No | Number of subject variations (default: 3) |
| `cta` | string | No | Primary call to action |
| `product` | string | No | Product being promoted |

## Email Types

### Welcome Email
- Deliver promised value
- Set expectations
- Quick win/value
- Soft CTA

### Nurture Email
- Educational content
- Story-based
- Build trust
- Subtle positioning

### Sales Email
- Direct pitch
- Benefits focus
- Objection handling
- Strong CTA

### Cart Abandonment
- Reminder
- Address concerns
- Add urgency
- Easy return path

### Re-engagement
- "We miss you"
- Special offer
- Survey option
- Clean list offer

## Process

### 1. Subject Line Development
- Create 5+ variations
- Test curiosity vs clarity
- Personalization options
- Emoji testing

### 2. Preview Text
- Complement subject
- Add context
- Drive opens

### 3. Email Body
- Hook in first line
- One clear message
- Scannable format
- P.S. line

### 4. CTA Optimization
- Button text
- Link placement
- Multiple CTAs (same action)

## Output

```yaml
email:
  type: "{type}"
  sequence_position: {position}

  subject_lines:
    - "{subject_1}"
    - "{subject_2}"
    - "{subject_3}"

  preview_text: "{preview}"

  body:
    hook: |
      {first_line_hook}

    content: |
      {main_body}

    cta: |
      {call_to_action}

    ps: |
      {post_script}

  cta_button:
    text: "{button_text}"
    url: "{destination_url}"

  metadata:
    send_time: "{recommended_time}"
    segment: "{target_segment}"
    trigger: "{automation_trigger}"
```

## Quality Criteria

- [ ] Subject line <50 characters
- [ ] Preview text complements subject
- [ ] Hook in first 2 lines
- [ ] Single clear CTA
- [ ] Mobile-friendly formatting

## Related

- **Workflow:** `/mkt/email-sequence`
- **Template:** `email-tmpl.md`
- **Checklist:** `copy-quality.md`
