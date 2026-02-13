# Design Upsell

## Identity
- **ID:** design-upsell
- **Squad:** customer
- **Agent:** retention-strategist
- **Type:** task

## Purpose

Design upsell and cross-sell campaigns to maximize expansion revenue from existing customers.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `campaign_type` | string | Yes | upsell/cross-sell/expansion |
| `segment` | string | Yes | Target customer segment |
| `offer` | string | No | Product/feature to promote |
| `budget` | number | No | Campaign budget |

## Process

### 1. Identify Opportunities
- Usage patterns indicating need
- Feature request history
- Growth signals (new users, usage)
- Contract timing (renewal, expansion)

### 2. Qualify Prospects
- Health score threshold
- Usage prerequisites
- Budget/authority signals
- Timing readiness

### 3. Design Offer
- Value proposition
- Pricing/packaging
- Urgency elements
- Risk reversal

### 4. Create Campaign
- Messaging sequence
- Channel selection
- Trigger automation
- Sales enablement

### 5. Plan Execution
- Segment rollout
- A/B testing
- Tracking setup
- Team training

## Output

```yaml
upsell_campaign:
  name: "{campaign_name}"
  type: "{upsell/cross-sell/expansion}"
  date: "{date}"

  opportunity_analysis:
    total_addressable: {n} customers
    qualified_prospects: {n} customers
    potential_revenue: "${amount}"
    avg_deal_size: "${amount}"

  target_segment:
    definition: "{segment_criteria}"
    size: {n}
    current_arr: "${amount}"
    expansion_potential: "${amount}"

  qualification_criteria:
    must_have:
      - "{criteria_1}"
      - "{criteria_2}"
    nice_to_have:
      - "{criteria_3}"
    disqualifiers:
      - "{criteria_4}"

  offer:
    product: "{product/feature}"
    value_proposition: "{why_they_need_this}"
    pricing:
      list_price: "${amount}"
      discount: "{percentage}"
      offer_price: "${amount}"
    urgency: "{limited_time/seats/etc}"
    guarantee: "{risk_reversal}"

  triggers:
    - trigger: "{trigger_condition}"
      timing: "{when_to_fire}"
      channel: "{email/in-app/sales}"
    - trigger: "{trigger_condition}"
      timing: "{when_to_fire}"
      channel: "{channel}"

  campaign_sequence:
    - day: 0
      channel: "{channel}"
      message: "{message_summary}"
      cta: "{call_to_action}"
    - day: 3
      channel: "{channel}"
      message: "{message_summary}"
      cta: "{call_to_action}"
    - day: 7
      channel: "{channel}"
      message: "{message_summary}"
      cta: "{call_to_action}"

  sales_enablement:
    talk_track: "{key_points}"
    objection_handling:
      - objection: "{objection}"
        response: "{response}"
    case_studies: ["{case_1}", "{case_2}"]

  success_metrics:
    primary:
      metric: "expansion_revenue"
      target: "${amount}"
    secondary:
      - metric: "conversion_rate"
        target: "{percentage}"
      - metric: "avg_deal_size"
        target: "${amount}"

  timeline:
    design_complete: "{date}"
    soft_launch: "{date}"
    full_rollout: "{date}"
    review: "{date}"
```

## Expansion Triggers

| Signal | Opportunity | Timing |
|--------|-------------|--------|
| Usage limit 80%+ | Tier upgrade | Immediate |
| New team members | Additional seats | Within week |
| Feature requests | Cross-sell | Next quarter |
| High NPS (9-10) | Annual upgrade | At renewal |
| Champion promotion | Enterprise deal | Strategic |

## Campaign Types

| Type | Definition | Example |
|------|------------|---------|
| **Upsell** | Higher tier/plan | Basic → Pro |
| **Cross-sell** | Additional product | Add analytics module |
| **Expansion** | More usage/seats | +10 team seats |
| **Upgrade** | Better terms | Monthly → Annual |

## Quality Criteria

- [ ] Segment clearly defined
- [ ] Qualification criteria specific
- [ ] Value proposition compelling
- [ ] Triggers automated
- [ ] Tracking in place
- [ ] Team enabled

## Related

- **Workflow:** `/customer/upsell-campaign`
- **Template:** `upsell-campaign-tmpl.md`
- **Task:** `create-health-score`
