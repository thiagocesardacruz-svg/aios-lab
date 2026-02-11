# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Synkra AIOS Lab is an AI-Orchestrated System (AIOS) meta-framework that coordinates AI agents through a hierarchical squad system for full-stack product development. Currently deployed for Travel Tech Digital's AI OS V3.1 MVP (single-segment SaaS for Hotels).

## Core Principle

**All execution happens via Squad.** No task, analysis, or output exists outside a squad context. Every formal execution is a Service Order (OS-YYYY-NNNN) tracked in Kanban.

## Agent System

### Activation
- Agents: `@dev`, `@qa`, `@architect`, `@pm`, `@po`, `@sm`, `@analyst`
- Master: `@aios-master`
- Commands: `*help`, `*create-story`, `*task {name}`, `*workflow {name}`, `*exit`

### Agent Hierarchy
```
Director (Thiago)
    ↓
Board Advisor (Consultivo - NÃO executa)
    ↓
AIOS Master (Orquestração - Orion)
    ↓
Squad Leads (Execução por domínio)
    ↓
Agents (Execução de tasks)
```

## Repository Structure

```
aios-lab/
├── .aios/                  # Framework config (AIOS 2.1.0)
├── .claude/                # Claude Code integration
│   ├── commands/AIOS/      # Agent activation profiles
│   ├── rules/              # MCP governance, usage rules
│   └── skills/             # Claude Code skills
├── governance/             # RED-classified rules (constitution, boundaries, costs)
├── docs/                   # Stories, PRDs, architecture, guides
├── squads/                 # Operational units (17 squads)
│   ├── _template/          # Blueprint for new squads
│   ├── board/              # Strategic advisors (8 mind clones)
│   ├── ops/                # AIOS Master orchestration
│   ├── tech/               # Infrastructure & development
│   ├── design-system/      # UI tokens, components (100% independent)
│   └── ...                 # finance, marketing, growth, qa, etc.
└── projects/               # Active development
    ├── ai-os-v3-1-mvp/     # Main product (Next.js + Supabase)
    └── traveltech-aios/    # Reference implementation
```

### Squad Structure Pattern
Each squad follows: `squad.yaml` + `README.md` + `agents/` + `workflows/` + `tasks/` + `templates/` + `checklists/` + `data/`

## Development Methodology

### Story-Driven Development
1. Work from stories in `docs/stories/`
2. Update checkboxes: `[ ]` → `[x]`
3. Maintain File List section
4. Follow acceptance criteria exactly

### Git Conventions
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
- Reference story: `feat: implement IDE detection [Story 2.1]`

## Commands

### MVP Project (projects/ai-os-v3-1-mvp)
```bash
# Start Supabase locally
npx supabase start

# Run migrations
npx supabase db reset

# Start Next.js dev
cd projects/ai-os-v3-1-mvp/app && npm run dev
```

### Validation (when package.json exists)
```bash
npm run lint
npm run typecheck
npm test
```

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | Next.js 16, React 19, TypeScript 5, Tailwind 4, shadcn/ui |
| Backend | Supabase (PostgreSQL 15, Auth, Edge Functions) |
| Infrastructure | Vercel, GitHub, Docker |
| Automation | n8n, GoHighLevel |
| AI | Claude, GPT (routed by AI Ops) |

## Governance Rules

### Budget Limits
| Limit | Value | Action |
|-------|-------|--------|
| Monthly | £400 (~€470) | Hard limit |
| Daily Alert | €15 | Notification |
| Daily Hard | €20 | SAFE MODE |
| Per Task | €10 | Approval required |

### Prohibited Actions (NEVER)
- Display credentials in plaintext
- Execute `DROP DATABASE` or mass `DELETE`
- Deploy to production without approval
- Send external communications without approval
- Modify IAM or infrastructure without PR

### Autonomous Actions (OK)
- Create/update OS in Kanban
- Read files, health checks
- Generate reports
- Update documentation
- Execute approved workflows

## MCP Usage

### Native Claude Code Tools (ALWAYS preferred)
- `Read` - read files (not docker-gateway)
- `Edit` - modify files (not docker-gateway)
- `Bash` - run commands (not docker-gateway)
- `Glob` - find files (not docker-gateway)
- `Grep` - search content (not docker-gateway)

### Docker MCPs (only when needed)
- **EXA** - web search, research
- **Context7** - library documentation
- **Apify** - web scraping, social media data

### Direct MCPs
- **playwright** - browser automation, screenshots, web testing
- **desktop-commander** - Docker container operations

**CRITICAL:** Avoid docker-gateway for local file operations - causes path mismatches.

## Key Architectural Decisions

### Design System Coupling
- Design System defines: tokens, components, states, layouts
- Tech implements: real code, performance, accessibility
- Neither invents UI independently

### MVP Philosophy (AI OS V3.1)
- NOT a content generator or chatbot
- IS an execution orchestrator
- Generates contextualized prompts (user executes in ChatGPT/GPT Experts)
- 80% hardcoded templates + 20% Business DNA personalization
- Lazy rendering, zero unnecessary AI calls
- Mobile-first, one task at a time (Execution Tunnel)

---
*Synkra AIOS Claude Code Configuration v3.0*
