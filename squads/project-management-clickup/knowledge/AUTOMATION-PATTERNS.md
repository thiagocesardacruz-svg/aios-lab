# Automation Patterns - Domain Knowledge

## Overview

This document describes proven automation patterns for ClickUp + n8n integration. For the raw pattern library, see `data/automation-patterns-library.yaml`.

---

## Pattern Categories

### 1. Status-Driven Automations

The most common pattern. Triggered when a task changes status.

**Use cases:**
- Notify reviewer when task moves to "Review"
- Start timer when task moves to "In Progress"
- Create follow-up subtask when task is "Done"
- Escalate when task moves to "Blocked"

**Best practice:** Keep actions to 2-3 per automation. If you need more, chain automations or use n8n.

### 2. Date-Driven Automations

Triggered by due dates or custom date fields.

**Use cases:**
- Alert 2 days before deadline
- Escalate overdue tasks
- Schedule follow-up reminders (CRM)
- Launch countdown notifications

**Limitation:** ClickUp native automations have limited date math. For complex date logic, use n8n scheduled triggers.

### 3. Assignment Automations

Auto-assign tasks based on criteria.

**Use cases:**
- Round-robin for support tickets
- Assign by task type (bugs → dev lead)
- Auto-assign on status change (Review → Natalia)

**Warning:** Avoid circular assignments (A assigns to B, B assigns to A).

### 4. Cross-List Automations

Move or create tasks across Lists/Spaces.

**Use cases:**
- Move approved content to "Calendario Editorial"
- Create support ticket from sales complaint
- Archive completed tasks monthly

**Limitation:** ClickUp automations can't move tasks between Spaces. Use n8n API for cross-Space operations.

---

## ClickUp vs n8n Decision Matrix

| Complexity | Tools | Latency | Choose |
|-----------|-------|---------|--------|
| Single trigger → 1-2 actions | ClickUp only | Instant | **ClickUp** |
| Single trigger → 3+ actions | ClickUp only | Instant | **ClickUp** (chain if needed) |
| Cross-tool (Hotmart, WhatsApp, etc) | ClickUp + external | Varies | **n8n** |
| Conditional branching (3+ paths) | Logic required | Seconds | **n8n** |
| Scheduled/batch operations | Time-based | Minutes | **n8n** |
| Webhook-driven from external | External trigger | Seconds | **n8n** |

---

## n8n Integration Patterns

### Pattern: ClickUp Webhook → n8n → Action
```
ClickUp Automation:
  WHEN status changes TO "X"
  THEN call webhook: https://n8n.nataliatanaka.com.br/webhook/{path}

n8n Workflow:
  Webhook Node → Process → Action (send WhatsApp, update Hotmart, etc.)
```

### Pattern: External Event → n8n → ClickUp
```
External Trigger (Hotmart sale, form submission, etc.)
  → n8n Webhook
  → Process data
  → Create/Update ClickUp task via API
```

### Critical Rule
See `knowledge/N8N-WORKFLOW-API-RULES.md`:
- `webhookId` is REQUIRED on all n8n webhook nodes created via API
- Without it, webhooks return 404 even when active

---

## Automation Naming Convention

```
[Area] - [Trigger] → [Action]
```

Examples:
- `[Content] - Status to Review → Notify Natalia`
- `[CRM] - Follow-up Date Today → Alert Assignee`
- `[Launch] - All Subtasks Done → Move to Next Phase`
- `[Support] - New Ticket → Assign Round-Robin`

---

## Testing Protocol

Before activating any automation:

1. **Create test task** matching the trigger conditions
2. **Trigger the automation** by making the expected change
3. **Verify all actions** executed correctly
4. **Check edge cases:**
   - What if the task already has the target status?
   - What if the assignee field is empty?
   - What if there's no due date?
5. **Document** the automation using `templates/automation-documentation.md`

---

## Maintenance

### Weekly
- Check for failed automations in ClickUp Activity log
- Review n8n execution history for errors

### Monthly
- Audit all active automations — are they still needed?
- Remove or update stale automations
- Review notification volume (too many = people ignore them)

### Per Change
- When changing statuses, update all automations that reference them
- When renaming custom fields, update automation conditions
- When restructuring Spaces/Lists, verify automation scope
