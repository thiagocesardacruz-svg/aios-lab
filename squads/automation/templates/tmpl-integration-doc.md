# Integration Documentation Template

## Integration Overview

| Field | Value |
|-------|-------|
| **Integration Name** | {Name} |
| **Integration ID** | `{id}` |
| **Type** | API / Webhook / MCP / OAuth |
| **Tier** | Core / Marketing / Data / Communication |
| **Status** | Active / Planned / Deprecated |

## Description

{Breve descrição do que esta integração permite fazer}

---

## Authentication

### Auth Type: {API Key / OAuth 2.0 / JWT / Basic}

### Setup Instructions

#### For API Key:

1. Acesse {url}
2. Navegue para {section}
3. Crie uma nova API Key
4. Copie a key (ela não será mostrada novamente)
5. Configure no n8n:
   - Vá em Credentials
   - Adicione novo: {credential_type}
   - Cole a API Key

#### For OAuth 2.0:

1. Acesse {developer_portal}
2. Crie um novo App
3. Configure Redirect URI: `{n8n_url}/rest/oauth2-credential/callback`
4. Copie Client ID e Client Secret
5. No n8n:
   - Adicione credential OAuth2
   - Configure Client ID e Secret
   - Autorize

### Required Scopes

| Scope | Purpose |
|-------|---------|
| `{scope_1}` | {purpose} |
| `{scope_2}` | {purpose} |

### Permissions Required

| Permission | Why Needed |
|------------|------------|
| {permission} | {reason} |

---

## Rate Limits

| Limit Type | Value | Action on Exceed |
|------------|-------|------------------|
| Requests/second | {n} | 429 + Retry-After |
| Requests/minute | {n} | 429 |
| Requests/day | {n} | 429 |
| Token limit | {n} | 429 |

### Handling Rate Limits

```javascript
// n8n Code node pattern
const maxRetries = 3;
const baseDelay = 1000;

for (let attempt = 0; attempt < maxRetries; attempt++) {
  try {
    const response = await $http.request(config);
    return response;
  } catch (error) {
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || Math.pow(2, attempt);
      await new Promise(r => setTimeout(r, retryAfter * 1000));
      continue;
    }
    throw error;
  }
}
```

---

## Endpoints / Capabilities

### {Capability 1}: {Name}

**Purpose**: {O que faz}

**Endpoint**: `{method} {url}`

**n8n Node**: `{node_type}`

**Request Example**:
```json
{
  "field1": "value1",
  "field2": "value2"
}
```

**Response Example**:
```json
{
  "id": "123",
  "status": "success"
}
```

**Common Errors**:
| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Invalid request | Check payload |
| 401 | Unauthorized | Check credentials |
| 404 | Not found | Check ID |

---

### {Capability 2}: {Name}

{Repetir estrutura acima}

---

## n8n Configuration

### Using Native Node

Node: `{n8n-nodes-base.xxx}`

```json
{
  "parameters": {
    "resource": "{resource}",
    "operation": "{operation}",
    // specific params
  }
}
```

### Using HTTP Request

```json
{
  "method": "{METHOD}",
  "url": "{base_url}/{endpoint}",
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "Bearer {{ $credentials.apiKey }}"
      }
    ]
  }
}
```

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Token expired | Refresh credentials |
| `403 Forbidden` | Missing scope | Add required scope |
| `429 Too Many Requests` | Rate limit | Implement backoff |
| `500 Internal Server Error` | API issue | Retry with backoff |

### Recommended Error Handling Pattern

```javascript
// In Code node or HTTP Request error handler
const error = $input.first().json;

if (error.statusCode === 401) {
  // Notify about auth issue
  return { json: { error: 'auth_failed', retry: false } };
}

if (error.statusCode === 429) {
  // Rate limited - should retry
  return { json: { error: 'rate_limited', retry: true, retryAfter: 60 } };
}

if (error.statusCode >= 500) {
  // Server error - should retry
  return { json: { error: 'server_error', retry: true } };
}

// Other errors - don't retry
return { json: { error: 'client_error', retry: false } };
```

---

## Security Considerations

### Data Handling

- [ ] PII is handled according to {policy}
- [ ] Data is encrypted in transit (HTTPS)
- [ ] No sensitive data in logs

### Credential Security

- [ ] Credentials stored in n8n credential store
- [ ] No hardcoded credentials
- [ ] Credentials have minimum required permissions

### Compliance

- [ ] GDPR compliant: {Yes/No/NA}
- [ ] LGPD compliant: {Yes/No/NA}
- [ ] SOC2: {Yes/No/NA}

---

## Troubleshooting

### Issue: {Common Issue 1}

**Symptoms**: {What the user sees}

**Cause**: {Why it happens}

**Solution**:
1. {Step 1}
2. {Step 2}

### Issue: {Common Issue 2}

{Repeat structure}

---

## References

- Official Documentation: {url}
- API Reference: {url}
- n8n Node Docs: {url}

---

## Changelog

| Date | Change |
|------|--------|
| {date} | Initial documentation |

---

*Documentation version: 1.0.0*
*Last updated: {date}*
