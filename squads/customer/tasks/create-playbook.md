# Create Playbook

## Identity
- **ID:** create-playbook
- **Squad:** customer
- **Agent:** retention-strategist
- **Type:** task

## Purpose

Create customer success playbooks that standardize responses to common scenarios and enable consistent, high-quality customer interactions.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `playbook_type` | string | Yes | save/onboarding/expansion/renewal |
| `segment` | string | No | Target customer segment |
| `trigger` | string | No | What triggers this playbook |

## Process

### 1. Define Scenario
- Trigger conditions
- Customer context
- Desired outcome
- Success metrics

### 2. Map Actions
- Step-by-step process
- Decision points
- Escalation criteria
- Timeline

### 3. Create Assets
- Email templates
- Call scripts
- Offer frameworks
- Documentation

### 4. Define Metrics
- Activity metrics
- Outcome metrics
- Quality metrics
- Efficiency metrics

### 5. Enable Team
- Training materials
- Quick reference
- FAQ
- Examples

## Output

```yaml
playbook:
  id: "PB-{type}-{version}"
  name: "{playbook_name}"
  type: "{save/onboarding/expansion/renewal}"
  version: "{version}"

  overview:
    purpose: "{why_this_playbook}"
    trigger: "{what_starts_it}"
    owner: "{role}"
    estimated_time: "{duration}"

  target:
    segment: "{customer_segment}"
    criteria:
      - "{qualification_1}"
      - "{qualification_2}"
    exclusions:
      - "{exclusion_1}"

  objectives:
    primary: "{main_goal}"
    secondary:
      - "{goal_2}"
      - "{goal_3}"
    success_metric: "{how_measured}"
    target: "{target_value}"

  steps:
    - step: 1
      name: "{step_name}"
      action: "{what_to_do}"
      owner: "{role}"
      timing: "{when}"
      tools: ["{tool_1}", "{tool_2}"]
      output: "{deliverable}"

    - step: 2
      name: "{step_name}"
      action: "{what_to_do}"
      owner: "{role}"
      timing: "{when}"
      decision_point:
        question: "{decision_question}"
        if_yes: "Go to step 3"
        if_no: "Go to step 4"

  decision_tree:
    - condition: "{if_this}"
      action: "{then_this}"
      next_step: "{step_number}"
    - condition: "{if_this}"
      action: "{then_this}"
      escalate_to: "{role}"

  templates:
    emails:
      - name: "initial_outreach"
        subject: "{subject_line}"
        body: |
          {email_template}

      - name: "follow_up"
        subject: "{subject_line}"
        body: |
          {email_template}

    call_scripts:
      - name: "discovery_call"
        opening: "{how_to_start}"
        questions:
          - "{question_1}"
          - "{question_2}"
        closing: "{how_to_end}"

  objection_handling:
    - objection: "{common_objection}"
      response: "{how_to_handle}"
      example: "{example_response}"

  escalation:
    criteria:
      - "{when_to_escalate}"
    path:
      - level: 1
        role: "{role}"
        response_time: "{time}"
      - level: 2
        role: "{role}"
        response_time: "{time}"

  metrics:
    activity:
      - "{metric_1}: {target}"
      - "{metric_2}: {target}"
    outcome:
      - "{metric_3}: {target}"
    quality:
      - "{metric_4}: {target}"

  resources:
    documentation:
      - "{doc_1}"
    tools:
      - "{tool_1}"
    training:
      - "{training_1}"
```

## Playbook Types

| Type | Purpose | Key Metrics |
|------|---------|-------------|
| **Save** | Retain at-risk customer | Save rate |
| **Onboarding** | Activate new customer | Activation rate, TTV |
| **Expansion** | Grow account revenue | Expansion revenue |
| **Renewal** | Secure contract renewal | Renewal rate |
| **Reactivation** | Win back churned | Win-back rate |

## Save Play Framework

| Risk Level | Response | Timeline |
|------------|----------|----------|
| Critical | Exec + CSM + discount | 24 hours |
| High | CSM call + value demo | 48 hours |
| Medium | Email sequence + check-in | 1 week |
| Low | Automated nurture | Ongoing |

## Quality Criteria

- [ ] Trigger clearly defined
- [ ] Steps actionable
- [ ] Templates ready to use
- [ ] Decision points clear
- [ ] Metrics trackable
- [ ] Team trained

## Related

- **Task:** `analyze-churn`
- **Data:** `customer-lifecycle.yaml`
- **Checklist:** `churn-prevention-checklist.md`
