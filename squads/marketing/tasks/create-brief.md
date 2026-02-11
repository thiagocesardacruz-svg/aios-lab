# Create Brief

## Identity
- **ID:** create-brief
- **Squad:** marketing
- **Agent:** marketing-lead
- **Type:** task

## Purpose

Create comprehensive marketing brief for campaigns, content, or creative projects.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_type` | string | Yes | campaign/content/creative/funnel |
| `objective` | string | Yes | Primary marketing objective |
| `budget` | number | No | Available budget |
| `deadline` | date | No | Delivery deadline |
| `stakeholders` | list | No | Key stakeholders |

## Process

### 1. Objective Definition
- SMART goal setting
- KPIs identification
- Success metrics
- Timeline milestones

### 2. Audience Definition
- Primary ICP
- Secondary audiences
- Exclusions
- Buyer journey stage

### 3. Message Strategy
- Core message
- Supporting points
- Tone and voice
- Key differentiators

### 4. Channel Strategy
- Primary channels
- Supporting channels
- Content formats
- Distribution plan

### 5. Resource Planning
- Team allocation
- Budget breakdown
- Tool requirements
- Dependencies

## Output

```markdown
# Marketing Brief: {project_name}

## Executive Summary
{one_paragraph_overview}

## Objectives
- **Primary:** {main_goal}
- **Secondary:** {supporting_goals}
- **KPIs:** {measurable_metrics}

## Target Audience
- **Primary ICP:** {icp_name}
- **Journey Stage:** {awareness/consideration/decision}
- **Pain Points:** {key_pains}
- **Desires:** {key_desires}

## Core Message
> {single_sentence_value_prop}

### Supporting Messages
1. {message_1}
2. {message_2}
3. {message_3}

## Channel Strategy
| Channel | Format | Frequency | Owner |
|---------|--------|-----------|-------|
| {channel} | {format} | {freq} | {owner} |

## Deliverables
- [ ] {deliverable_1}
- [ ] {deliverable_2}
- [ ] {deliverable_3}

## Timeline
| Milestone | Date | Owner |
|-----------|------|-------|
| Brief approval | {date} | {owner} |
| First draft | {date} | {owner} |
| Review | {date} | {owner} |
| Launch | {date} | {owner} |

## Budget
| Item | Amount |
|------|--------|
| {item} | €{amount} |
| **Total** | €{total} |

## Success Criteria
- [ ] {criterion_1}
- [ ] {criterion_2}
- [ ] {criterion_3}

## Approvals
- [ ] Marketing Lead
- [ ] Stakeholder
- [ ] Budget Owner
```

## Quality Criteria

- [ ] Objectives are SMART
- [ ] ICP clearly defined
- [ ] Message is differentiated
- [ ] Timeline is realistic
- [ ] Budget is allocated

## Related

- **Workflow:** `/mkt/market-research`
- **Data:** `icp-profiles.yaml`
- **Next:** Any marketing workflow
