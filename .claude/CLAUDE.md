# CLAUDE.md

Synkra AIOS Lab — AI-Orchestrated System meta-framework. Coordinates agents via hierarchical squad system. Deployed for Travel Tech Digital's AI OS V3.1 MVP (SaaS for Hotels).

## Core Principle

**All execution happens via Squad.** Every formal execution is a Service Order tracked in ClickUp.

## Agent System

Agents: `@dev`, `@qa`, `@architect`, `@pm`, `@po`, `@sm`, `@analyst`, `@devops`, `@data-engineer`, `@ux-design-expert`, `@squad-creator`
Master: `@aios-master` | Commands: `*help`, `*task {name}`, `*workflow {name}`, `*exit`

Hierarchy: Director → Board Advisor (consultivo) → AIOS Master → Squad Leads → Agents

## Skills (Auto-Routing)

Skills with `auto_invoke: true` are triggered by keyword match. See `.claude/skills/_registry.yaml`.

| Skill | Purpose | Priority |
|-------|---------|----------|
| `/architect-first` | Architecture-first dev | Critical |
| `/circuit-breaker` | Prevent loops/cost overflow | Critical |
| `/cost-guardian` | Budget enforcement | Critical |
| `/enhance-workflow` | Multi-agent pipeline | High |
| `/context-optimizer` | Token reduction | High |
| `/tech-search` | Deep technical research | Medium |
| `/mcp-builder` | Create MCP servers | High |

## Repository Structure

```
aios-lab/
├── .claude/commands/AIOS/   # Agent profiles
├── .claude/rules/           # Governance (compressed summaries)
├── .claude/skills/          # Claude Code skills
├── docs/rules/              # Full rule documentation
├── governance/              # RED rules (constitution, costs)
├── squads/                  # 18 operational squads
│   └── ops/scripts/         # ClickUp sync, budget, tools
└── projects/ai-os-v3-1-mvp/ # Main product (Next.js + Supabase)
```

Squad pattern: `squad.yaml` + `README.md` + `agents/` + `workflows/` + `tasks/` + `templates/` + `checklists/`

## Development

**Story-Driven:** Work from `docs/stories/`, update checkboxes, follow acceptance criteria.
**Git:** Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`). Reference: `feat: add login [Story 2.1]`

### MVP Commands
```bash
npx supabase start          # Local Supabase
npx supabase db reset       # Run migrations
cd projects/ai-os-v3-1-mvp/app && npm run dev  # Next.js
npm run lint && npm run typecheck && npm test   # Validation
```

## Tech Stack

Frontend: Next.js 16, React 19, TypeScript 5, Tailwind 4, shadcn/ui
Backend: Supabase (PostgreSQL 15, Auth, Edge Functions)
Infra: Vercel, GitHub, Docker | Automation: n8n, GoHighLevel | AI: Claude, GPT

## Governance

### Budget
| Limit | Value | Action |
|-------|-------|--------|
| Monthly | €468 | Hard limit |
| Daily Alert | €15 | Notification |
| Daily Hard | €20 | SAFE MODE |
| Per Task | €10 | Approval required |

### NEVER
- Display credentials in plaintext
- Execute `DROP DATABASE` or mass `DELETE`
- Deploy to production without approval
- Send external communications without approval

### OK (Autonomous)
- Create/update tasks in ClickUp, read files, health checks, generate reports, update docs

## ClickUp (Command Center)

Spaces: PERSONAL | WORK | AI OPS (To Do → In Progress → Awaiting Human → Done)

```bash
# Task lifecycle
node squads/ops/scripts/clickup-sync.mjs create "[Type] Name" --agent=@dev --squad=tech --impact=efficiency
node squads/ops/scripts/clickup-sync.mjs start <task_id>
node squads/ops/scripts/clickup-sync.mjs done <task_id> "Summary"
```

Key files: `squads/project-management-clickup/data/clickup-workspace-ids.json` (IDs), `squads/ops/data/command-center-data.json` (usage)

## Clawdbot

24/7 operational extension on Hostinger VPS. Slack interface, polls ClickUp every 5min.
Use for: quick commands, status checks, background tasks, when terminal offline.
Delegate: `node squads/ops/scripts/delegate-to-clawdbot.mjs "Task" --script=script.py`
Docs: `squads/ops/clawdbot/`

## MCP Usage

**Native tools ALWAYS preferred** (Read, Edit, Bash, Glob, Grep — NOT docker-gateway).
Docker MCPs (when needed): EXA (search), Context7 (docs), Apify (scraping).
Direct MCPs: playwright (browser), desktop-commander (containers).

## Local Tools (€0 cost)

| Tool | Command | For |
|------|---------|-----|
| whisper.cpp | `node squads/ops/scripts/transcribe.mjs <file>` | Audio → Text |
| Tesseract | `node squads/ops/scripts/ocr.mjs <file>` | Image → Text |
| pdftotext | `node squads/ops/scripts/pdf-extract.mjs <file>` | PDF → Text |
| MarkItDown | `node squads/ops/scripts/markitdown-convert.mjs <file>` | Universal → MD |
| Calibre | `node squads/ops/scripts/ebook-etl.mjs <file> --to md` | Ebook ETL |
| Ollama | `node squads/ops/scripts/llm-local.mjs "<prompt>"` | Simple LLM tasks |

Config: `squads/ops/config/local-tools.json`

---
*Synkra AIOS v3.1 — Full rules in `.claude/rules/` (summaries) and `docs/rules/` (complete)*
