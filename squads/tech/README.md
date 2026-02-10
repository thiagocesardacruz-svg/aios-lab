# Tech Squad

> Systems that Scale

## Mission

Transform design, decisions, and workflows into stable, scalable, and cheap-to-operate systems.

## Golden Rules

1. **No UI enters production without passing through Design System**
2. **No Design System exists without technical adherence**
3. **Dev doesn't invent UI, doesn't redefine UX, doesn't improvise components**

## Agents

| Agent | Role | Focus |
|-------|------|-------|
| **Forge** (tech-lead) | Lead | Architecture, stack, quality |
| **Circuit** (automation-engineer) | Automation | n8n, integrations, pipelines |
| **Funnel** (ghl-specialist) | CRM | GHL, pipelines, tracking |
| **Token** (ai-ops) | AI Ops | Costs, prompts, optimization |
| **Code** (application-developer) | Developer | Implementation, APIs |

## Commands

### App Development

| Command | Description |
|---------|-------------|
| `/tech/app-setup` | Create app base with Design System |
| `/tech/component-implementation` | Implement component from spec |
| `/tech/vibe-coding-integration` | Transform Vibe Coding to prod |
| `/tech/ui-refactor` | Eliminate inconsistencies |

### AI & Optimization

| Command | Description |
|---------|-------------|
| `/tech/ai-cost-optimization` | Reduce AI costs |

### Automation & CRM

| Command | Description |
|---------|-------------|
| `/tech/create-automation` | Create n8n workflow |
| `/tech/ghl-setup` | Setup GHL funnel/CRM |

## Coupling with Design System

### Decided by Design System
- Tokens (colors, spacing, radius)
- Components, States
- Base layouts, Standard flows

### Decided by Tech
- Real implementation
- Performance
- Technical accessibility
- Code reuse, Repository organization

### Decided Together (80% of value)
- Component viability
- Variation limits
- Complexity vs value
- Vibe Coding patterns
- Componentization strategy

## Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js, React, Tailwind, shadcn/ui |
| Backend | Supabase, Node.js |
| Automation | n8n, webhooks |
| CRM | GoHighLevel |
| AI | Claude, GPT (routed by AI Ops) |

## What Tech Does NOT Do

- No UI invention (follows Design System)
- No strategy (receives from Ops)
- No creative (receives from Design)
- No business decisions (implements what's decided)
