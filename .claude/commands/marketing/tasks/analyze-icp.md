# Analyze ICP

## Identity
- **ID:** analyze-icp
- **Squad:** marketing
- **Agent:** content-strategist
- **Type:** task

## Purpose

Deep analysis of Ideal Customer Profile (ICP) including demographics, psychographics, pain points, desires, and buying behavior.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `product` | string | Yes | Product/service name |
| `market` | string | No | Target market (default: global) |
| `segment` | string | No | Specific segment to analyze |
| `data_sources` | list | No | Additional data sources |

## Process

### 1. Demographics Analysis
- Age, gender, location
- Income level, education
- Job title, company size
- Industry vertical

### 2. Psychographics Analysis
- Values and beliefs
- Lifestyle choices
- Personality traits
- Interests and hobbies

### 3. Pain Points Discovery
- Primary frustrations
- Failed solutions tried
- Cost of inaction
- Emotional triggers

### 4. Desires Mapping
- Ideal outcome (dream state)
- Success metrics
- Timeline expectations
- Budget considerations

### 5. Buying Behavior
- Decision-making process
- Key influencers
- Objections patterns
- Preferred channels

## Output

```yaml
icp_profile:
  name: "{segment_name}"

  demographics:
    age_range: ""
    gender_split: ""
    location: ""
    income: ""
    education: ""
    job_title: ""
    company_size: ""
    industry: ""

  psychographics:
    values: []
    lifestyle: ""
    personality: ""
    interests: []

  pain_points:
    primary: ""
    secondary: []
    emotional: ""
    cost_of_inaction: ""

  desires:
    dream_outcome: ""
    success_metrics: []
    timeline: ""
    budget_range: ""

  buying_behavior:
    decision_process: ""
    influencers: []
    objections: []
    preferred_channels: []

  messaging_angles:
    headline_hooks: []
    pain_agitation: []
    desire_amplification: []
```

## Quality Criteria

- [ ] Based on real data (not assumptions)
- [ ] Pain points are specific and measurable
- [ ] Desires connect to product benefits
- [ ] Buying behavior informs funnel design
- [ ] Messaging angles are actionable

## Related

- **Workflow:** `/mkt/market-research`
- **Template:** `icp-profiles.yaml`
- **Next:** `keyword-research`, `create-brief`
