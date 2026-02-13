# Task: Configure GHL

> Setup GoHighLevel funnel, pipeline, or CRM configuration

## Metadata

| Field | Value |
|-------|-------|
| **ID** | configure-ghl |
| **Agent** | ghl-specialist |
| **Type** | configuration |
| **Complexity** | medium |

## Objective

Configure GoHighLevel for optimal lead capture, nurturing, and conversion tracking.

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `setup_type` | enum | yes | funnel / pipeline / automation / form |
| `business_context` | text | yes | What business problem to solve |
| `integrations` | list | no | External systems to connect |

## Process

### Step 1: Requirements Gathering
- Business objective
- Target audience
- Conversion goals
- Integration requirements

### Step 2: Setup Based on Type

#### Funnel Setup
- [ ] Landing page created
- [ ] Thank you page configured
- [ ] Form fields defined
- [ ] Tracking pixels installed
- [ ] Mobile responsive verified

#### Pipeline Setup
- [ ] Stages defined
- [ ] Stage automation rules
- [ ] Team assignments
- [ ] Notification triggers
- [ ] Win/loss tracking

#### Automation Setup
- [ ] Trigger defined
- [ ] Workflow steps
- [ ] Delays configured
- [ ] Conditions set
- [ ] Tags/lists updated

#### Form Setup
- [ ] Fields configured
- [ ] Validation rules
- [ ] Submission action
- [ ] Confirmation message
- [ ] Lead routing

### Step 3: Integration Configuration

| Integration | Purpose | Status |
|-------------|---------|--------|
| Email | Notifications | |
| SMS | Alerts | |
| Webhook | External sync | |
| Zapier | Third-party | |
| Calendar | Booking | |

### Step 4: Tracking Setup
- [ ] UTM parameters configured
- [ ] Conversion tracking
- [ ] Attribution setup
- [ ] Reporting dashboard

### Step 5: Testing
- [ ] Submit test lead
- [ ] Verify automation triggers
- [ ] Check notifications
- [ ] Verify integrations
- [ ] Test on mobile

## Output

| Output | Type | Description |
|--------|------|-------------|
| `ghl_config` | doc | Configuration documentation |
| `funnel_url` | url | Live funnel URL (if applicable) |
| `pipeline_id` | text | Pipeline ID (if applicable) |
| `test_results` | md | Test results summary |

## Quality Gates

- [ ] All required fields captured
- [ ] Automation tested end-to-end
- [ ] Integrations verified
- [ ] Mobile responsive (funnels)
- [ ] Tracking working

## Best Practices

1. **Naming**: Use consistent naming convention
2. **Tags**: Tag leads for segmentation
3. **Automation**: Keep automations simple
4. **Testing**: Always test with real data flow
5. **Documentation**: Document all configurations

## Common Configurations

### Lead Capture Funnel
```
Landing Page → Form → Thank You → Automation
                         ↓
                  Pipeline Stage 1
                         ↓
                  Email Sequence
```

### Sales Pipeline
```
New Lead → Qualified → Proposal → Negotiation → Won/Lost
    ↓          ↓           ↓           ↓
  Auto      Auto        Manual      Manual
  Assign    Email       Follow      Review
```

---

*Task v1.0 - Tech Squad*
