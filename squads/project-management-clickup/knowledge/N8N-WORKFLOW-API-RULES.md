# n8n Workflow API Rules - MANDATORY for ALL Agents

## CRITICAL: webhookId is REQUIRED on Webhook Nodes

When creating or updating n8n workflows via the REST API (`POST/PUT /api/v1/workflows`), any node of type `n8n-nodes-base.webhook` **MUST** include a `webhookId` field at the **NODE level** (sibling of `id`, `name`, `type`).

**Without `webhookId`, the webhook returns 404** even when the workflow is active and appears in n8n's activation logs. This is because n8n uses this field to register the webhook listener path.

### Correct Pattern

```json
{
  "id": "webhook-node-id",
  "webhookId": "unique-webhook-identifier",
  "name": "Webhook Trigger",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 1.1,
  "position": [240, 300],
  "parameters": {
    "httpMethod": "POST",
    "path": "my-webhook-path",
    "responseMode": "onReceived",
    "responseData": "allEntries"
  }
}
```

### Wrong Pattern (causes 404)

```json
{
  "id": "webhook-node-id",
  "name": "Webhook Trigger",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 1.1,
  "parameters": {
    "httpMethod": "POST",
    "path": "my-webhook-path"
  }
}
```

### Rules

| Rule | Detail |
|------|--------|
| `webhookId` placement | At NODE level — sibling of `id`, `name`, `type`. **NOT** inside `parameters`. |
| `webhookId` value | Any unique string (kebab-case recommended). Example: `creative-approval-sync` |
| `typeVersion` | Use `1.1` (not `2`). Version 2 has different parameter structure. |
| `responseMode` | Use `"onReceived"` for immediate response. |
| `responseData` | Use `"allEntries"` to return full payload. |

---

## CRITICAL: $env Vars Are DENIED

This n8n instance (self-hosted) blocks `$env.*` access in expressions. Using `={{ $env.MY_TOKEN }}` causes "access to env vars denied" error at runtime.

### Workaround: Hardcode Tokens in headerParameters

```json
{
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      { "name": "Authorization", "value": "pk_42953089_ACTUAL_TOKEN_HERE" }
    ]
  }
}
```

**DO NOT use:**
```json
{ "name": "Authorization", "value": "={{ $env.CLICKUP_API_TOKEN }}" }
```

This pattern is used by ALL working Mission Control workflows.

---

## Workflow Lifecycle via API

| Operation | Method | Endpoint | Notes |
|-----------|--------|----------|-------|
| Create | `POST` | `/api/v1/workflows` | Include `webhookId` on webhook nodes |
| Update | `PUT` | `/api/v1/workflows/{id}` | `active` field is **READ-ONLY** on PUT |
| Activate | `POST` | `/api/v1/workflows/{id}/activate` | Separate call required |
| Deactivate | `POST` | `/api/v1/workflows/{id}/deactivate` | |
| Delete | `DELETE` | `/api/v1/workflows/{id}` | |

### Auth Header

```
X-N8N-API-KEY: {token from N8N_API_TOKEN in .env}
```

---

## HTTP Request Node: Reliable Body Pattern

The only reliable way to build dynamic JSON payloads in HTTP Request nodes:

```json
{
  "sendBody": true,
  "contentType": "raw",
  "rawContentType": "application/json",
  "body": "={{ JSON.stringify({key: $json.field, other: $json.value}) }}"
}
```

**DO NOT use** `specifyBody: 'json'` with template literals — they are unreliable.

---

## Error Handling on HTTP Nodes

Always add `neverError: true` to prevent one failing HTTP node from blocking parallel downstream nodes:

```json
{
  "options": {
    "response": {
      "response": {
        "neverError": true
      }
    }
  }
}
```

---

## Checklist: Before Deploying a Webhook Workflow via API

- [ ] Every `n8n-nodes-base.webhook` node has `webhookId` at node level
- [ ] `webhookId` is a unique string (not inside `parameters`)
- [ ] No `$env.*` expressions anywhere — use hardcoded values
- [ ] HTTP body uses `contentType: "raw"` + `JSON.stringify()` pattern
- [ ] HTTP nodes have `neverError: true` for resilience
- [ ] Workflow is activated via separate `POST .../activate` call after creation
- [ ] Webhook responds 200 after activation (test with `curl -X POST`)

---

## Reference

- n8n instance: `https://n8n.nataliatanaka.com.br`
- Webhook base URL: `https://n8n.nataliatanaka.com.br/webhook/`
- Working example: `.aios-core/squads/creative-studio/workflows/n8n/wf-creative-approval-webhook.json`
- Memory patterns: `memory/n8n-patterns.md`
- Bug discovered: 2026-02-10 — webhook 404 despite active workflow (missing `webhookId`)
