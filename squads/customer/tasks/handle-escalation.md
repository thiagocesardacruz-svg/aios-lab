# Handle Escalation

## Identity
- **ID:** handle-escalation
- **Squad:** customer
- **Agent:** customer-lead
- **Type:** task

## Purpose

Handle customer escalations systematically to resolve issues, retain customers, and improve processes.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customer_id` | string | Yes | Customer identifier |
| `issue` | string | Yes | Escalation description |
| `severity` | string | Yes | critical/high/medium/low |
| `history` | object | No | Previous interactions |

## Process

### 1. Assess Situation
- Understand the issue fully
- Review customer history
- Identify root cause
- Assess business impact

### 2. Classify Severity
- Customer tier impact
- Revenue at risk
- Reputation risk
- Legal/compliance risk

### 3. Mobilize Response
- Assign owner
- Notify stakeholders
- Set response timeline
- Prepare communication

### 4. Resolve Issue
- Execute fix/workaround
- Communicate progress
- Confirm resolution
- Document outcome

### 5. Follow Up
- Customer satisfaction check
- Internal retrospective
- Process improvement
- Prevention measures

## Output

```yaml
escalation_report:
  id: "ESC-{YYYY}-{NNN}"
  date_opened: "{date}"
  date_resolved: "{date}"

  customer:
    id: "{customer_id}"
    name: "{customer_name}"
    tier: "{enterprise/business/starter}"
    arr: "${amount}"
    health_score: {score}

  escalation:
    summary: "{brief_description}"
    severity: "{critical/high/medium/low}"
    category: "{technical/billing/service/other}"

  impact:
    business_impact: "{description}"
    revenue_at_risk: "${amount}"
    users_affected: {n}
    sla_breach: {true/false}

  timeline:
    - timestamp: "{datetime}"
      event: "Escalation received"
      owner: "{name}"
    - timestamp: "{datetime}"
      event: "Root cause identified"
      owner: "{name}"
    - timestamp: "{datetime}"
      event: "Resolution implemented"
      owner: "{name}"
    - timestamp: "{datetime}"
      event: "Customer confirmed resolution"
      owner: "{name}"

  root_cause:
    category: "{product/process/people/external}"
    description: "{what_went_wrong}"
    contributing_factors:
      - "{factor_1}"
      - "{factor_2}"

  resolution:
    action_taken: "{what_we_did}"
    owner: "{name}"
    time_to_resolve: "{duration}"
    customer_satisfaction: "{rating}"

  prevention:
    immediate_actions:
      - "{action_1}"
    long_term_improvements:
      - "{action_2}"
    owner: "{name}"
    due_date: "{date}"

  communication_log:
    - channel: "{email/call/meeting}"
      date: "{date}"
      summary: "{what_was_communicated}"
      customer_response: "{response}"
```

## Severity Matrix

| Severity | Response Time | Owner Level | Examples |
|----------|---------------|-------------|----------|
| **Critical** | 1 hour | Executive | Service down, data loss |
| **High** | 4 hours | Director | Major feature broken |
| **Medium** | 24 hours | Manager | Significant inconvenience |
| **Low** | 72 hours | Team Lead | Minor issue |

## Escalation Categories

| Category | Typical Causes | Resolution Path |
|----------|----------------|-----------------|
| **Technical** | Bugs, outages, performance | Engineering |
| **Billing** | Charges, invoices, refunds | Finance |
| **Service** | SLA, response time, quality | Operations |
| **Relationship** | Communication, trust | Executive |

## Communication Templates

### Initial Response
```
We've received your escalation and understand the urgency.
- Issue: {summary}
- Assigned to: {owner}
- Next update: {time}
We're treating this as {severity} priority.
```

### Progress Update
```
Update on your escalation:
- Status: {status}
- Actions taken: {actions}
- Next steps: {next_steps}
- Expected resolution: {timeline}
```

### Resolution Confirmation
```
Your issue has been resolved:
- Resolution: {what_we_did}
- Verification: {how_to_confirm}
- Prevention: {what_we're_doing}
Please confirm this addresses your concern.
```

## Quality Criteria

- [ ] Issue fully understood
- [ ] Severity appropriately classified
- [ ] Response within SLA
- [ ] Customer communicated throughout
- [ ] Root cause identified
- [ ] Prevention plan created

## Related

- **Checklist:** `churn-prevention-checklist.md`
- **Data:** `customer-lifecycle.yaml`
