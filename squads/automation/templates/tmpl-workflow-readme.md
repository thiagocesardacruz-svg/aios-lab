# {Workflow Name}

> {One-line description of what this workflow does}

## Overview

| Property | Value |
|----------|-------|
| **ID** | `{workflow-id}` |
| **Version** | 1.0.0 |
| **Complexity** | Simple / Medium / Complex |
| **Has AI** | Yes / No |
| **Nodes** | {n} |

## What It Does

{2-3 paragraphs explaining what the workflow does in plain language}

## Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Trigger   │────►│   Process   │────►│   Output    │
│  {type}     │     │   {action}  │     │  {result}   │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Trigger

- **Type**: Webhook / Schedule / Manual / Event
- **Configuration**:
  - {config_detail_1}
  - {config_detail_2}

### For Webhook:
```
POST {n8n_url}/webhook/{path}
Content-Type: application/json

{
  "field1": "value1"
}
```

### For Schedule:
```
Cron: {cron_expression}
Timezone: {timezone}
```

## Input

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `{field}` | string | {desc} | `"value"` |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `{field}` | string | `null` | {desc} |

### Example Input

```json
{
  "requiredField": "value",
  "optionalField": "value"
}
```

## Output

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "123",
    "result": "processed"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error description"
}
```

## Nodes

| # | Node | Type | Purpose |
|---|------|------|---------|
| 1 | {Name} | {type} | {purpose} |
| 2 | {Name} | {type} | {purpose} |
| 3 | {Name} | {type} | {purpose} |

## Integrations

| Integration | Required | Purpose |
|-------------|----------|---------|
| {Name} | Yes/No | {purpose} |

## Credentials Required

| Credential | Type | Setup |
|------------|------|-------|
| {Name} | API Key / OAuth | See {link} |

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `{OPTION}` | string | `"default"` | {desc} |

To configure, set environment variables or update the Set node at the beginning.

## Error Handling

### Handled Errors

| Error | Behavior |
|-------|----------|
| Invalid input | Returns 400 with error message |
| API timeout | Retries 3 times with backoff |
| Rate limit | Waits and retries |

### Notifications

Errors are sent to: {Slack channel / Email / etc.}

## Performance

| Metric | Typical Value |
|--------|---------------|
| Execution time | {X} seconds |
| Tokens per run (if AI) | {n} |
| API calls | {n} |

## Cost

| Component | Per Run | Monthly (est.) |
|-----------|---------|----------------|
| AI tokens | €{value} | €{value} |
| API calls | €{value} | €{value} |
| **Total** | €{value} | €{value} |

## Testing

### Test with Sample Data

```bash
curl -X POST {n8n_url}/webhook/{path} \
  -H "Content-Type: application/json" \
  -d '{"field": "test"}'
```

### Expected Result

```json
{
  "success": true
}
```

## Troubleshooting

### Issue: {Common issue}

**Symptom**: {What happens}

**Solution**: {How to fix}

---

### Issue: {Another issue}

**Symptom**: {What happens}

**Solution**: {How to fix}

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | {date} | Initial version |

## Related

- Product: {link to product if applicable}
- Template: {link to template used}
- Documentation: {link to docs}

---

*Created by: @{agent}*
*Last updated: {date}*
