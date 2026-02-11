# Design Onboarding

## Identity
- **ID:** design-onboarding
- **Squad:** customer
- **Agent:** onboarding-architect
- **Type:** task

## Purpose

Design a comprehensive onboarding experience that minimizes time-to-value and maximizes activation rate.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `product` | string | Yes | Product being onboarded |
| `segment` | string | No | Customer segment |
| `current_ttv` | string | No | Current time-to-value |
| `activation_rate` | number | No | Current activation rate |

## Process

### 1. Map Current Journey
- Document current onboarding steps
- Identify friction points
- Measure current time-to-value
- Analyze drop-off points

### 2. Define Aha Moment
- What makes users "get it"?
- First value experience
- Minimum actions required
- Emotional trigger point

### 3. Design Milestones
- Break journey into steps
- Define completion criteria
- Set time targets
- Create progress indicators

### 4. Create Flow
- Welcome experience
- Setup wizard
- First success moment
- Habit formation hooks

### 5. Multi-Channel Design
- In-app guidance
- Email sequence
- Push notifications
- Human touchpoints

## Output

```yaml
onboarding_design:
  product: "{product_name}"
  segment: "{segment}"
  date: "{date}"

  aha_moment:
    definition: "{what_is_the_aha}"
    trigger_action: "{action_that_triggers}"
    time_target: "{minutes/hours}"
    success_indicator: "{how_we_know}"

  journey_map:
    - step: 1
      name: "{step_name}"
      action: "{user_action}"
      goal: "{what_user_achieves}"
      time: "{expected_time}"
      channel: "{in-app/email/both}"

    - step: 2
      name: "{step_name}"
      action: "{user_action}"
      goal: "{what_user_achieves}"
      time: "{expected_time}"
      channel: "{channel}"

  milestones:
    - milestone: "signup_complete"
      criteria: "{completion_criteria}"
      celebration: "{how_we_celebrate}"

    - milestone: "first_value"
      criteria: "{completion_criteria}"
      celebration: "{how_we_celebrate}"

    - milestone: "activated"
      criteria: "{completion_criteria}"
      celebration: "{how_we_celebrate}"

  email_sequence:
    - day: 0
      subject: "{welcome_subject}"
      goal: "{email_goal}"
      cta: "{call_to_action}"

    - day: 1
      subject: "{subject}"
      goal: "{email_goal}"
      cta: "{call_to_action}"

  in_app_guidance:
    - trigger: "{trigger}"
      type: "{tooltip/modal/checklist}"
      content: "{message}"
      action: "{what_user_does}"

  success_metrics:
    activation_rate:
      current: "{percentage}"
      target: "{percentage}"
    time_to_value:
      current: "{time}"
      target: "{time}"
    completion_rate:
      current: "{percentage}"
      target: "{percentage}"
```

## Onboarding Principles

### Time to Value (TTV)
| Rating | Time | Action |
|--------|------|--------|
| Excellent | < 2 min | Maintain |
| Good | 2-5 min | Optimize |
| Average | 5-15 min | Redesign |
| Poor | > 15 min | Urgent fix |

### Activation Best Practices
1. **Single focus** - One task at a time
2. **Quick win** - Early success builds momentum
3. **Progress visible** - Show completion status
4. **Skip option** - Don't force, guide
5. **Personalize** - Adapt to user context

## Quality Criteria

- [ ] Aha moment clearly defined
- [ ] Journey mapped end-to-end
- [ ] Milestones measurable
- [ ] Multi-channel coordinated
- [ ] Metrics tracking planned
- [ ] Time targets realistic

## Related

- **Workflow:** `/customer/onboarding-sequence`
- **Template:** `onboarding-sequence-tmpl.md`
- **Checklist:** `onboarding-checklist.md`
