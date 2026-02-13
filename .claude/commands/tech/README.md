# Tech Squad

> Systems that Scale

## Mission

Transform design, decisions, and workflows into stable, scalable, and cheap-to-operate systems.

## Golden Rules

1. **No UI enters production without passing through Design System**
2. **No Design System exists without technical adherence**
3. **Dev doesn't invent UI, doesn't redefine UX, doesn't improvise components**

## Agents

| Agent | Name | Role |
|-------|------|------|
| `tech-lead` | **Forge** | Architecture, stack, quality |
| `automation-engineer` | **Circuit** | n8n, integrations, pipelines |
| `ghl-specialist` | **Funnel** | GHL, CRM, pipelines, tracking |
| `ai-ops` | **Token** | AI costs, prompts, optimization |
| `application-developer` | **Code** | Implementation, APIs |

## Commands

### App Development

| Command | Description |
|---------|-------------|
| `/tech/app-setup` | Create app base with Design System |
| `/tech/component-implementation` | Implement component from spec |
| `/tech/vibe-coding-integration` | Transform Vibe Coding to prod |
| `/tech/ui-refactor` | Eliminate inconsistencies |
| `/tech/create-component` | Create UI component (task) |

### AI & Optimization

| Command | Description |
|---------|-------------|
| `/tech/ai-cost-optimization` | Reduce AI costs |
| `/tech/optimize-prompt` | Optimize prompt for cost (task) |

### Automation & CRM

| Command | Description |
|---------|-------------|
| `/tech/create-automation` | Create n8n workflow |
| `/tech/ghl-setup` | Setup GHL funnel/CRM |

### Technical Review

| Command | Description |
|---------|-------------|
| `/tech/review` | Architecture review (task) |

## Structure

```
tech/
├── squad.yaml                     # v2.1.0 - Configuration
├── README.md
├── agents/
│   ├── tech-lead.md               # Forge
│   ├── automation-engineer.md     # Circuit
│   ├── ghl-specialist.md          # Funnel
│   ├── ai-ops.md                  # Token
│   └── application-developer.md   # Code
├── tasks/
│   ├── review-architecture.md     # Tech reviews
│   ├── create-component.md        # Component creation
│   ├── setup-n8n-workflow.md      # n8n automation
│   ├── optimize-prompt.md         # AI optimization
│   └── configure-ghl.md           # GHL setup
├── workflows/
│   ├── app-setup.yaml
│   ├── component-implementation.yaml
│   ├── vibe-coding-integration.yaml
│   ├── ui-refactor.yaml
│   ├── ai-cost-optimization.yaml
│   ├── create-automation.yaml
│   └── ghl-setup.yaml
├── templates/
│   ├── adr-tmpl.md                # Architecture Decision Record
│   ├── component-spec-tmpl.md     # Component specification
│   ├── automation-spec-tmpl.yaml  # n8n workflow spec
│   └── cost-report-tmpl.md        # AI cost report
├── checklists/
│   ├── code-review.md             # Code review checklist
│   ├── deploy.md                  # Deployment checklist
│   └── component-qa.md            # Component QA checklist
└── data/
    ├── tech-stack.yaml            # Official tech stack
    ├── coding-standards.yaml      # Coding standards
    └── ai-pricing.yaml            # AI model pricing
```

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
| Frontend | Next.js 16, React 19, TypeScript 5, Tailwind 4, shadcn/ui |
| Backend | Supabase, Node.js, Edge Functions |
| Automation | n8n, webhooks |
| CRM | GoHighLevel |
| AI | Claude (Haiku/Sonnet/Opus), GPT-4 (fallback) |

## Tasks

| Task | Agent | Purpose |
|------|-------|---------|
| `review-architecture` | tech-lead | Technical architecture review |
| `create-component` | app-dev | Create UI component |
| `setup-n8n-workflow` | automation | Create n8n automation |
| `optimize-prompt` | ai-ops | Optimize AI prompt costs |
| `configure-ghl` | ghl-specialist | Configure GoHighLevel |

## Templates

| Template | Purpose |
|----------|---------|
| `adr-tmpl.md` | Architecture Decision Record |
| `component-spec-tmpl.md` | UI component specification |
| `automation-spec-tmpl.yaml` | n8n workflow specification |
| `cost-report-tmpl.md` | AI cost analysis report |

## Checklists

| Checklist | Purpose |
|-----------|---------|
| `code-review.md` | Code review verification |
| `deploy.md` | Pre-deployment checks |
| `component-qa.md` | Component quality assurance |

## Data Files

| File | Purpose |
|------|---------|
| `tech-stack.yaml` | Official technology stack |
| `coding-standards.yaml` | Coding standards and rules |
| `ai-pricing.yaml` | AI model pricing reference |

## AI Cost Optimization

Token (AI Ops) uses this hierarchy:

```
1. SCRIPT  → Can a script do this?     Cost: ~€0
2. CACHE   → Is the answer cached?     Cost: ~€0
3. HAIKU   → Can Haiku handle this?    Cost: low
4. SONNET  → Does it need Sonnet?      Cost: medium
5. OPUS    → Only if truly complex     Cost: high
```

## What Tech Does NOT Do

- No UI invention (follows Design System)
- No strategy (receives from Ops)
- No creative (receives from Design)
- No business decisions (implements what's decided)

---

*Tech Squad v2.1.0 - Travel Tech Digital AIOS*
