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

### Available Agents

| Agent | Expertise |
|-------|-----------|
| `/aios-master` | Orquestrador principal, coordena squads e workflows |
| `/architect` | Arquitetura de sistemas, design patterns, decisões técnicas |
| `/dev` | Implementação de código, debugging, refactoring |
| `/pm` | Project management, timelines, stakeholder communication |
| `/po` | Product ownership, backlog, priorização de features |
| `/sm` | Scrum master, facilitação, remoção de impedimentos |
| `/qa` | Quality assurance, testes, validação |
| `/analyst` | Análise de dados, requisitos, especificações |
| `/devops` | Infraestrutura, CI/CD, MCP management |
| `/data-engineer` | Data pipelines, ETL, modelagem de dados |
| `/ux-design-expert` | UX/UI design, wireframes, protótipos |
| `/squad-creator` | Criação e configuração de novos squads |

## Skills

Skills extend agent capabilities with specialized workflows. Some skills support **auto-routing** (agents invoke automatically when needed).

### Core Skills

| Skill | Descrição | Auto-Invoke | Priority |
|-------|-----------|-------------|----------|
| `/architect-first` | Desenvolvimento architecture-first: design completo antes de código | Yes | Critical |
| `/enhance-workflow` | Pipeline multi-agente: Discovery → Research → Roundtable → Epic | Yes | High |
| `/tech-search` | Deep research técnico com WebSearch + WebFetch | Yes | Medium |
| `/mcp-builder` | Guia para criar MCP servers (FastMCP/Python ou MCP SDK/Node) | Yes | High |
| `/skill-creator` | Criar ou atualizar skills do Claude Code | No | - |

### Performance & Optimization (Tier 1)

| Skill | Descrição | Auto-Invoke | Priority |
|-------|-----------|-------------|----------|
| `/context-optimizer` | Reduz tokens via compressão inteligente e lazy loading (-50% tokens) | Yes | High |
| `/circuit-breaker` | Previne loops infinitos, custo descontrolado e falhas em cascata | Yes | Critical |
| `/learning-loop` | Agentes que melhoram a cada execução (compound intelligence) | Yes | High |

### Competitive Advantage (Tier 2)

| Skill | Descrição | Auto-Invoke | Priority |
|-------|-----------|-------------|----------|
| `/institutional-memory` | Memória organizacional acumulada que persiste entre sessões | Yes | High |
| `/cost-guardian` | Controle rigoroso de budget com enforcement automático | Yes | Critical |
| `/skill-composer` | Combina múltiplas skills em workflows complexos orquestrados | Yes | Medium |
| `/tool-discovery` | Descoberta inteligente de ferramentas com RICE/WSJF e registry global | Yes | Medium |
| `/data-insight` | Pesquisa rápida para decisões data-driven (integra com squad deep-research) | Yes | Medium |

### Skill Auto-Routing

Agents automatically invoke skills when task patterns match. See `.claude/rules/skill-auto-routing.md` for rules and `.claude/skills/_registry.yaml` for registered skills.

**Governance:** Opt-in - skills must declare `auto_invoke: true` in frontmatter to be auto-routed.

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

### Active Squads (18)

| Squad | Propósito |
|-------|-----------|
| **ops** | Orquestração AIOS, standups, reports |
| **tech** | Infraestrutura, CI/CD, desenvolvimento |
| **finance** | Controle financeiro, budgets |
| **qa** | Testes, auditorias, quality gates |
| **design** | UI/UX, wireframes, protótipos |
| **design-system** | Tokens, componentes, padrões visuais |
| **marketing** | Marketing operations, campanhas |
| **growth** | Growth hacking, métricas |
| **customer** | Customer success, suporte |
| **sales-pages** | Landing pages, conversão |
| **copywriting-masters** | Estratégia de conteúdo, copy |
| **deep-research** | Research operations |
| **board** | Strategic advisors (8 mind clones) |
| **hormozi** | Frameworks de negócio ($100M methodology) |
| **hotel-mkt** | Marketing vertical para hotéis |
| **translator** | Serviços de tradução |
| **squad-creator** | Meta-squad: cria outros squads |
| **project-management-clickup** | Gestão de projetos com ClickUp (GTD, PARA, Agile) |

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

## ClickUp Command Center

ClickUp is the **central project management hub** for AIOS. All tasks, costs, and workflows are tracked here.

### Workspace Structure

| Space | Purpose |
|-------|---------|
| **PERSONAL** | Personal life (Finance, Goals, Health, Leisure, Courses, Love) |
| **WORK** | Professional projects (Travel Tech Digital, Tripwix) |
| **AI OPS** | AI agent operations (Inbox, In Progress, Awaiting Human, Completed) |
| **RESOURCES** | Knowledge Base, Templates, Documentation, Archived |

### Command Center Scripts

Located in `squads/ops/scripts/`:

| Script | Purpose | Usage |
|--------|---------|-------|
| `clickup-sync.mjs` | Task CRUD | `node clickup-sync.mjs create "Task" --agent=@dev` |
| `command-center.mjs` | Cost/token tracking | `node command-center.mjs track <task_id> <tokens>` |
| `dashboard.mjs` | Dashboard & Goals sync | `node dashboard.mjs sync` |

### Automatic Task Sync

Agents MUST sync tasks to ClickUp (see `.claude/rules/clickup-auto-sync.md`):

```bash
# Create task
node squads/ops/scripts/clickup-sync.mjs create "[Feature] Task name" --agent=@dev --priority=2

# Start work
node squads/ops/scripts/clickup-sync.mjs start <task_id>

# Mark done
node squads/ops/scripts/clickup-sync.mjs done <task_id> "Summary"
```

### Budget Tracking (Goals)

ClickUp Goals track budget in real-time:
- **Daily Budget**: €20 limit (alert at €15)
- **Monthly Budget**: €468 limit
- **Token Usage**: Total tokens consumed

Dashboard: https://app.clickup.com/t/86c86bz0w

### Key Files

| File | Purpose |
|------|---------|
| `squads/project-management-clickup/data/clickup-workspace-ids.json` | All Space, List, Field, Goal IDs |
| `squads/ops/data/command-center-data.json` | Usage tracking data |
| `.claude/rules/clickup-auto-sync.md` | Agent sync rules |

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

## Local Tools (Zero Cost)

Ferramentas instaladas localmente para processamento offline. **Custo: €0 por uso.**

### Available Tools

| Tool | Script | Função | Economia vs API |
|------|--------|--------|-----------------|
| **whisper.cpp** | `transcribe.mjs` | Áudio → Texto | ~€0.006/min (Whisper API) |
| **Tesseract** | `ocr.mjs` | Imagem → Texto | ~€0.05/página (serviços OCR) |
| **pdftotext** | `pdf-extract.mjs` | PDF → Texto | ~€0.02/página |
| **Pandoc** | `pdf-to-md.mjs` | PDF/DOCX → Markdown | ~€0.10/doc (serviços) |
| **Calibre** | `ebook-etl.mjs` | Ebook ETL (EPUB/MOBI → MD) | ~€0.20/livro |
| **Ollama** | `llm-local.mjs` | LLM local (Llama 3.2) | ~€0.03/1k tokens (GPT-4) |
| **FFmpeg** | (direto) | Conversão mídia | - |

### Usage (Agents SHOULD use these automatically)

```bash
# Transcrever áudio (whisper.cpp)
node squads/ops/scripts/transcribe.mjs audio.mp3 --lang pt

# OCR de imagem (Tesseract)
node squads/ops/scripts/ocr.mjs screenshot.png --json

# Extrair texto de PDF (pdftotext)
node squads/ops/scripts/pdf-extract.mjs document.pdf

# PDF para Markdown (Pandoc)
node squads/ops/scripts/pdf-to-md.mjs document.pdf --extract-media

# ETL de ebook (Calibre) - EPUB/MOBI/AZW → Markdown
node squads/ops/scripts/ebook-etl.mjs book.epub --to md
node squads/ops/scripts/ebook-etl.mjs book.mobi --metadata --json

# Query LLM local (Ollama) - para tasks simples, economiza tokens Claude
node squads/ops/scripts/llm-local.mjs "Resuma este texto em 2 frases: ..."

# Converter áudio para whisper (FFmpeg)
ffmpeg -i video.mp4 -ar 16000 -ac 1 audio.wav
```

### When to Use Local Tools

| Cenário | Use Local Tool | Economia |
|---------|----------------|----------|
| Transcrever reunião/vídeo | `transcribe.mjs` | 100% |
| OCR de screenshots/docs | `ocr.mjs` | 100% |
| Extrair texto de PDF | `pdf-extract.mjs` | 100% |
| Converter PDF para Markdown | `pdf-to-md.mjs` | 100% |
| ETL de livros (EPUB/MOBI/AZW) | `ebook-etl.mjs` | 100% |
| Resumir/traduzir texto simples | `llm-local.mjs` | 90%+ |
| Converter formatos de mídia | `ffmpeg` | 100% |

### Configuration

Tool paths and settings: `squads/ops/config/local-tools.json`

### Installed Models

| Tool | Model | Size |
|------|-------|------|
| whisper.cpp | ggml-base | 141MB |
| Ollama | llama3.2:1b | 1.3GB |

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
