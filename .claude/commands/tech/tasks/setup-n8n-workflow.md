# Task: Setup n8n Workflow

> Create automation workflow in n8n

## Metadata

| Field | Value |
|-------|-------|
| **ID** | setup-n8n-workflow |
| **Agent** | automation-engineer |
| **Type** | automation |
| **Complexity** | medium |

## Objective

Create a reliable, maintainable automation workflow in n8n.

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `workflow_name` | text | yes | Descriptive name |
| `trigger` | text | yes | What triggers the workflow |
| `steps` | list | yes | Actions to perform |
| `integrations` | list | yes | Services to connect |

## Process

### Step 1: Requirements Analysis
- Define trigger (webhook, schedule, event)
- List all steps in sequence
- Identify error scenarios
- Define success criteria

### Step 2: Integration Setup
- [ ] Credentials configured for each service
- [ ] API access verified
- [ ] Rate limits understood

### Step 3: Workflow Design

```
Trigger → Validate → Process → Transform → Output → Notify
              ↓                              ↓
           Error → Log → Alert → Retry/Skip
```

#### Node Checklist
- [ ] Trigger node configured
- [ ] Validation node (check input data)
- [ ] Processing nodes (main logic)
- [ ] Error handling nodes
- [ ] Success notification
- [ ] Failure notification

### Step 4: Implementation

| Node Type | Purpose | Notes |
|-----------|---------|-------|
| Webhook | External trigger | Validate payload |
| Schedule | Time-based trigger | Use cron expression |
| IF | Conditional logic | Keep simple |
| Set | Transform data | Document transformations |
| HTTP Request | API calls | Handle errors |
| Code | Custom logic | Keep minimal |

### Step 5: Error Handling
- [ ] Catch all potential errors
- [ ] Log errors with context
- [ ] Send alerts for critical failures
- [ ] Implement retry logic where appropriate

### Step 6: Testing
- [ ] Test with sample data
- [ ] Test error scenarios
- [ ] Test edge cases
- [ ] Verify notifications work

### Step 7: Documentation
- [ ] Workflow purpose documented
- [ ] Trigger documented
- [ ] Expected inputs/outputs
- [ ] Error handling documented

## Output

| Output | Type | Description |
|--------|------|-------------|
| `workflow_json` | file | n8n workflow export |
| `documentation` | md | Usage documentation |
| `credentials_needed` | list | Required credentials |

## Quality Gates

- [ ] All paths tested (success + error)
- [ ] Error handling complete
- [ ] Notifications configured
- [ ] Documentation complete
- [ ] Credentials documented (not exposed)

## Best Practices

1. **Naming**: Use clear, descriptive names for nodes
2. **Notes**: Add sticky notes explaining complex logic
3. **Errors**: Always handle errors explicitly
4. **Logging**: Log important steps for debugging
5. **Secrets**: Never hardcode credentials

---

*Task v1.0 - Tech Squad*
