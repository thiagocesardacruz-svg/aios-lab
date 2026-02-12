# n8n Automations Quick Reference

**Companion to:** n8n-automations-design.md
**Version:** 1.0.0

---

## Automation Index by Priority

### P0 - Deploy Immediately (Week 1)

| ID | Name | Trigger | Key Nodes | GHL Tools |
|----|------|---------|-----------|-----------|
| 1.2 | Cost Guardian | Webhook + Schedule | IF, Slack, DuckDB | - |
| 3.1 | Inbound Lead Triage | Webhook | AI Agent, Switch | upsert-contact, create-opportunity, add-tags |
| 4.2 | Review Response | Schedule | Loop, AI Agent | - (external APIs) |

### P1 - Deploy Week 2-3

| ID | Name | Trigger | Key Nodes | GHL Tools |
|----|------|---------|-----------|-----------|
| 1.3 | Daily Standup | Schedule 9AM | Ollama, Slack | - |
| 3.2 | Outbound Sequence | Schedule + Webhook | Loop, AI Agent, Switch | create-message, add-contact-to-workflow |
| 4.1 | Direct Booking | Webhook | AI Agent, IF | upsert-contact, create-message |
| 2.1 | Blog Generator | Webhook | AI Agents (3), HTTP | create-blog-post |

### P2 - Deploy Week 4-6

| ID | Name | Trigger | Key Nodes | GHL Tools |
|----|------|---------|-----------|-----------|
| 3.3 | Meeting Prep | Schedule | Loop, AI Agent | get-contact, get-opportunity |
| 2.2 | Social Content | Schedule | Loop, Switch | create-post, get-social-media-statistics |
| 4.3 | Guest Lifecycle | Webhook (PMS) | Switch, Delay | send-message, add-contact-to-workflow |
| 4.5 | WhatsApp Concierge | Webhook | Switch, AI Agents | get-conversations, create-message |

---

## GHL MCP Tool Cheat Sheet

### Contacts
```javascript
// Create or update contact
mcp__gohighlevel__upsert-contact({
  Version: "2021-07-28",
  requestBody: {
    locationId: "xxx",
    email: "guest@hotel.com",
    firstName: "John",
    lastName: "Doe",
    phone: "+5511999999999",
    tags: ["lead", "direct-booking"],
    customFields: [
      { id: "field_id", field_value: "value" }
    ]
  }
})

// Add tags
mcp__gohighlevel__add-tags({
  Version: "2021-07-28",
  contactId: "xxx",
  requestBody: { tags: ["hot-lead", "hotel-inquiry"] }
})
```

### Opportunities (Pipeline)
```javascript
// Create opportunity
mcp__gohighlevel__create-opportunity({
  Version: "2021-07-28",
  requestBody: {
    locationId: "xxx",
    contactId: "xxx",
    pipelineId: "xxx",
    pipelineStageId: "xxx",
    name: "Hotel Booking - John Doe",
    monetaryValue: 5000
  }
})

// Update stage
mcp__gohighlevel__update-opportunity-status({
  Version: "2021-07-28",
  id: "opportunity_id",
  requestBody: {
    pipelineStageId: "new_stage_id"
  }
})
```

### Conversations
```javascript
// Send message (WhatsApp/SMS/Email)
mcp__gohighlevel__send-a-new-message({
  Version: "2021-07-28",
  requestBody: {
    type: "WhatsApp", // or "SMS", "Email"
    contactId: "xxx",
    message: "Hello! Thank you for your inquiry..."
  }
})
```

### Workflows
```javascript
// Add contact to workflow
mcp__gohighlevel__add-contact-to-workflow({
  Version: "2021-07-28",
  contactId: "xxx",
  workflowId: "xxx",
  requestBody: {}
})
```

### Blogs
```javascript
// Create blog post
mcp__gohighlevel__create-blog-post({
  Version: "2021-07-28",
  requestBody: {
    locationId: "xxx",
    blogId: "xxx",
    title: "10 Tips for Direct Bookings",
    description: "Meta description...",
    rawHTML: "<p>Content...</p>",
    status: "PUBLISHED",
    imageUrl: "https://...",
    imageAltText: "Hotel room",
    categories: ["cat_id"],
    author: "author_id",
    urlSlug: "10-tips-direct-bookings",
    publishedAt: "2026-02-12T10:00:00Z"
  }
})
```

---

## n8n Node Patterns

### AI Agent Pattern (Tiered)
```javascript
// Tier 0: Classification (Haiku)
{
  "type": "n8n-nodes-langchain.agent",
  "parameters": {
    "model": "claude-3-haiku",
    "systemMessage": "You are a lead classifier. Respond with JSON only.",
    "maxIterations": 1
  }
}

// Tier 1: Execution (Sonnet)
{
  "type": "n8n-nodes-langchain.agent",
  "parameters": {
    "model": "claude-3-sonnet",
    "systemMessage": "You are a sales email writer using Gap Selling.",
    "tools": ["web_search", "calculator"]
  }
}

// Tier 2: Local (Ollama - EUR 0)
{
  "type": "n8n-nodes-base.executeCommand",
  "parameters": {
    "command": "node squads/ops/scripts/llm-local.mjs \"{{ $json.prompt }}\""
  }
}
```

### Webhook Pattern
```javascript
{
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "path": "lead-intake",
    "httpMethod": "POST",
    "responseMode": "responseNode",
    "options": {
      "rawBody": true
    }
  }
}
```

### Loop with Rate Limiting
```javascript
{
  "type": "n8n-nodes-base.splitInBatches",
  "parameters": {
    "batchSize": 10,
    "options": {
      "reset": false
    }
  }
}
// After batch processing, add Wait node (100ms)
{
  "type": "n8n-nodes-base.wait",
  "parameters": {
    "amount": 100,
    "unit": "milliseconds"
  }
}
```

---

## Mind Clone DNA Quick Reference

### Hormozi Frameworks (for Sales/Marketing)
```yaml
Grand Slam Offer:
  - Dream Outcome (10x value perception)
  - Perceived Likelihood (proof stacking)
  - Time Delay (speed to result)
  - Effort & Sacrifice (minimize friction)

Hook-Meat-CTA:
  - Hook: Pattern interrupt (3-5 seconds)
  - Meat: Value delivery (education/entertainment)
  - CTA: Single clear action

GOATed Ads (50x3x1):
  - 50 hooks
  - 3 bodies
  - 1 CTA
```

### Conley Frameworks (for Hospitality)
```yaml
Peak Pyramid:
  - Base: Survival (basic needs met)
  - Middle: Success (expectations exceeded)
  - Peak: Transformation (identity refreshment)

Guest Journey Emotions:
  - Anticipation (pre-arrival)
  - Discovery (check-in)
  - Immersion (stay)
  - Reflection (check-out)
  - Evangelism (post-stay)
```

### Keenan Gap Selling (for B2B Sales)
```yaml
Current State:
  - What's happening now?
  - Impact on business?

Future State:
  - What do they want?
  - Why is it important?

Gap:
  - Difference = opportunity
  - Quantify the gap in EUR/time/pain
```

---

## Cost Optimization Cheat Sheet

| Task | Use This | Not This | Savings |
|------|----------|----------|---------|
| Lead classification | Haiku | Sonnet | 75% |
| Simple summarization | Ollama local | Any API | 100% |
| Content generation | Sonnet | Opus | 80% |
| PDF text extraction | pdftotext local | Document AI | 100% |
| Audio transcription | whisper.cpp | Whisper API | 100% |
| Analytics queries | DuckDB local | Cloud DB | 100% |

---

## Webhook Endpoints Reference

| Automation | Endpoint Path | Method | Payload |
|------------|---------------|--------|---------|
| Lead Triage | `/webhook/lead-intake` | POST | GHL form data |
| Direct Booking | `/webhook/booking-inquiry` | POST | Website form |
| Review Response | `/webhook/new-review` | POST | Review platform |
| WhatsApp Concierge | `/webhook/whatsapp` | POST | GHL conversation |
| Guest Lifecycle | `/webhook/pms-event` | POST | PMS webhook |
| Content Request | `/webhook/content-request` | POST | Content spec |

---

## Error Handling Patterns

### Retry with Exponential Backoff
```javascript
{
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "url": "https://api.example.com",
    "options": {
      "retry": {
        "maxAttempts": 3,
        "initialInterval": 1000,
        "maxInterval": 10000
      }
    }
  }
}
```

### GHL Rate Limit Handler
```javascript
// In Code node after GHL request
if ($input.item.json.statusCode === 429) {
  // Wait and retry
  await new Promise(r => setTimeout(r, 10000));
  // Re-queue the item
  return { requeue: true };
}
return $input.item;
```

### Graceful Degradation
```javascript
// If primary AI fails, use fallback
try {
  result = await callClaude(prompt);
} catch (e) {
  result = await callOllama(prompt); // Local fallback, EUR 0
}
```

---

## Monitoring Queries (DuckDB)

```sql
-- Daily cost by automation
SELECT
  workflow_name,
  SUM(cost_eur) as total_cost,
  COUNT(*) as executions
FROM automation_costs
WHERE date = CURRENT_DATE
GROUP BY workflow_name
ORDER BY total_cost DESC;

-- Success rate by automation
SELECT
  workflow_name,
  COUNT(CASE WHEN status = 'success' THEN 1 END) * 100.0 / COUNT(*) as success_rate
FROM automation_executions
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY workflow_name;

-- Average execution time
SELECT
  workflow_name,
  AVG(duration_ms) as avg_duration,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration_ms) as p95
FROM automation_executions
WHERE date = CURRENT_DATE
GROUP BY workflow_name;
```

---

## Quick Deploy Commands

```bash
# Validate workflow before deploy
node squads/ops/scripts/n8n-validate.mjs workflow.json

# Deploy workflow
n8n workflow:import --input=workflow.json

# Test webhook locally
curl -X POST http://localhost:5678/webhook/lead-intake \
  -H "Content-Type: application/json" \
  -d '{"email":"test@hotel.com","name":"Test Lead"}'

# Check workflow status
n8n workflow:list --active

# View recent executions
n8n execution:list --limit=10
```

---

*Quick Reference v1.0.0 - Travel Tech Digital*
