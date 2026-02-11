# Write Copy

## Identity
- **ID:** write-copy
- **Squad:** marketing
- **Agent:** copy-specialist
- **Type:** task

## Purpose

Write persuasive marketing copy for any format following proven frameworks and brand voice guidelines.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | Yes | headline/body/cta/email/ad/landing |
| `objective` | string | Yes | awareness/consideration/conversion |
| `icp` | string | No | ICP profile to target |
| `tone` | string | No | professional/casual/urgent/friendly |
| `length` | string | No | short/medium/long |
| `framework` | string | No | AIDA/PAS/BAB/4Ps |

## Frameworks

### AIDA
- **A**ttention: Hook with problem/benefit
- **I**nterest: Expand with details
- **D**esire: Create emotional connection
- **A**ction: Clear CTA

### PAS
- **P**roblem: Identify pain
- **A**gitation: Amplify consequences
- **S**olution: Present offer

### BAB
- **B**efore: Current painful state
- **A**fter: Dream outcome
- **B**ridge: Your solution

### 4Ps
- **P**icture: Paint the scenario
- **P**romise: State the benefit
- **P**roof: Show evidence
- **P**ush: Call to action

## Process

### 1. Research
- Review ICP profile
- Understand pain points
- Identify desired outcome
- Review competitor copy

### 2. Hook Development
- Create 5+ headline variations
- Test different angles
- A/B test candidates

### 3. Body Copy
- Follow chosen framework
- One idea per paragraph
- Benefits over features
- Social proof integration

### 4. CTA Optimization
- Action-oriented verbs
- Reduce friction
- Create urgency (ethical)
- Clear next step

## Output

```yaml
copy_deliverable:
  type: "{type}"
  objective: "{objective}"
  framework: "{framework}"

  headlines:
    primary: ""
    variations:
      - ""
      - ""
      - ""

  body:
    hook: ""
    problem: ""
    agitation: ""
    solution: ""
    proof: ""
    cta: ""

  cta_options:
    - text: ""
      urgency: ""
    - text: ""
      urgency: ""

  notes:
    key_benefit: ""
    emotional_trigger: ""
    objection_handled: ""
```

## Quality Criteria

- [ ] Passes copy-quality checklist
- [ ] Headline hooks in <3 seconds
- [ ] Benefits emphasized over features
- [ ] CTA is specific and actionable
- [ ] No jargon or buzzwords

## Related

- **Checklist:** `copy-quality.md`
- **Templates:** `ad-copy-tmpl.md`, `email-tmpl.md`
- **ICP:** `icp-profiles.yaml`
