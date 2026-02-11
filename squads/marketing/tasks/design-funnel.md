# Design Funnel

## Identity
- **ID:** design-funnel
- **Squad:** marketing
- **Agent:** funnel-architect
- **Type:** task

## Purpose

Design complete marketing funnel with stages, pages, automations, and metrics.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `funnel_type` | string | Yes | lead_magnet/webinar/sales/tripwire |
| `product` | string | Yes | Product/offer name |
| `price_point` | number | No | Product price |
| `traffic_source` | string | No | Primary traffic source |
| `automation` | boolean | No | Include email automation |

## Funnel Types

### Lead Magnet Funnel
```
Ad/Content → Opt-in Page → Thank You → Email Sequence → Offer
```

### Webinar Funnel
```
Ad → Registration → Confirmation → Reminder Sequence → Live/Replay → Offer → Follow-up
```

### Sales Funnel
```
Ad → Sales Page → Checkout → Upsell → Thank You → Onboarding
```

### Tripwire Funnel
```
Ad → Low-ticket Offer → OTO 1 → OTO 2 → Core Offer Sequence
```

## Process

### 1. Funnel Mapping
- Define all stages
- Identify page types
- Map user journey
- Define conversion points

### 2. Page Strategy
- Each page purpose
- Key elements needed
- Copy requirements
- Design direction

### 3. Automation Design
- Email sequences
- Trigger points
- Timing logic
- Segmentation rules

### 4. Metrics Definition
- Stage conversion rates
- Target benchmarks
- Tracking setup
- Optimization triggers

## Output

```yaml
funnel_design:
  name: "{funnel_name}"
  type: "{funnel_type}"
  product: "{product}"

  stages:
    - stage: "awareness"
      page: "landing_page"
      objective: "capture_lead"
      conversion_target: 30%
      elements:
        - headline
        - lead_magnet
        - opt_in_form

    - stage: "consideration"
      page: "thank_you"
      objective: "deliver_value"
      elements:
        - confirmation
        - next_steps
        - social_proof

    - stage: "decision"
      page: "sales_page"
      objective: "convert"
      conversion_target: 5%
      elements:
        - long_form_copy
        - testimonials
        - guarantee
        - cta

  automations:
    - trigger: "opt_in"
      sequence: "welcome_sequence"
      emails: 5
      duration: "7_days"

    - trigger: "no_purchase_3d"
      sequence: "objection_handler"
      emails: 3
      duration: "3_days"

  metrics:
    - name: "opt_in_rate"
      target: 30%
      formula: "optins / visitors"

    - name: "email_open_rate"
      target: 40%
      formula: "opens / delivered"

    - name: "sales_conversion"
      target: 5%
      formula: "sales / optins"

  pages_needed:
    - landing_page
    - thank_you
    - sales_page
    - checkout
    - upsell
    - confirmation
```

## Quality Criteria

- [ ] All stages have clear objectives
- [ ] Conversion targets are realistic
- [ ] Automations are defined
- [ ] Metrics are trackable
- [ ] Passes funnel-validation checklist

## Related

- **Workflow:** `/mkt/create-funnel`
- **Template:** `funnel-map-tmpl.md`
- **Checklist:** `funnel-validation.md`
