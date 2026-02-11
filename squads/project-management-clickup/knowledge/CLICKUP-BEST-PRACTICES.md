# ClickUp Best Practices - Domain Knowledge

## Hierarchy Rules

### When to Use Each Level

| Level | Use For | Example |
|-------|---------|---------|
| **Space** | Major business areas (PARA Areas) | LANCAMENTOS, CONTEUDO, COMERCIAL |
| **Folder** | Projects or sub-areas within a Space | Lancamento PLF Mar/26, YouTube |
| **List** | Groups of related tasks | Pre-Lancamento, Sprint Atual |
| **Task** | Individual work items | Criar landing page, Gravar video |
| **Subtask** | Breakdown of a task | Escrever headline, Revisar copy |

### Anti-Patterns

- **Never** put unrelated tasks in the same List
- **Never** create a Space for a single project (use Folder)
- **Never** nest more than 3 levels of subtasks
- **Never** use Tasks as categories — use Lists instead

---

## Status Configuration

### Universal Statuses (recommended for most Lists)
1. `Inbox` — Captured but not processed
2. `To Do` — Processed, ready to start
3. `In Progress` — Actively being worked on
4. `Review` — Waiting for approval/review
5. `Done` — Completed
6. `Blocked` — Cannot proceed (requires action)

### Domain-Specific Statuses
- **Content:** Ideia > Rascunho > Producao > Revisao > Aprovado > Publicado
- **Sales:** Novo Lead > Contato Feito > Negociando > Proposta > Fechado/Perdido
- **Dev:** Backlog > Sprint > Dev > Code Review > Testing > Deployed
- **Support:** Novo > Em Atendimento > Aguardando Cliente > Resolvido > Fechado

### Rules
- Max 7 statuses per List (cognitive overload above that)
- Every status must have a clear "exit criteria"
- Use `Blocked` status sparingly — prefer adding blockers as comments
- Color-code consistently across the workspace

---

## Custom Fields Strategy

### Must-Have Fields (every List)
- **Priority** (Dropdown): Urgente, Alta, Media, Baixa
- **Effort** (Dropdown): XS, S, M, L, XL

### Area-Specific Fields
- See `data/custom-fields-library.yaml` for complete catalog
- Don't create duplicate fields — use Space-level fields shared across Lists
- Dropdown is almost always better than Text (for filtering and reporting)

### Naming Convention
- Title Case, no abbreviations
- Consistent across Spaces (same concept = same name)
- Prefix with area if ambiguous: "CRM - Origem do Lead" vs "Content - Canal"

---

## Views Best Practices

### Essential Views (every List)
1. **Board (Kanban)** — Group by Status — daily workflow
2. **List** — Sort by Due Date — weekly planning
3. **Calendar** — Due date view — scheduling

### Power Views
- **My Tasks** — Filter: Assignee = Me — personal focus
- **Overdue** — Filter: Due Date < Today AND Status != Done — accountability
- **This Week** — Filter: Due Date = This Week — sprint view
- **By Assignee** — Board grouped by Assignee — workload balancing

### View Naming
- Use emoji prefix for quick scanning
- Keep names under 20 characters

---

## Automations Guidelines

### When to Automate
- Repetitive status changes that follow a pattern
- Notifications that are always needed
- Assignment rules that are consistent
- Due date calculations that are formulaic

### When NOT to Automate
- Decisions that require human judgment
- One-time actions
- Processes that change frequently
- Complex conditional logic (use n8n instead)

### ClickUp Automations vs n8n
| Scenario | Use |
|----------|-----|
| Status change triggers notification | **ClickUp** |
| Task creation assigns to person | **ClickUp** |
| Complex multi-step workflow | **n8n** |
| Cross-tool integration (Hotmart > ClickUp) | **n8n** |
| Conditional logic with 3+ branches | **n8n** |
| Scheduled batch operations | **n8n** |

---

## Templates Usage

### Task Templates
- Create template tasks for recurring work (weekly reports, content briefs)
- Include subtask checklists in templates
- Set relative due dates in templates

### List Templates
- Great for launch phases — copy entire List structure
- Include default custom field values
- Pre-populate statuses and views

---

## Time Tracking

### Rules
- Estimates are mandatory for tasks with due dates
- Use T-shirt sizing for quick estimates (XS/S/M/L/XL)
- Timer auto-starts on "In Progress", auto-stops on "Done"
- Review time vs estimate weekly
- Track at task level, roll up to Folder/Space

---

## PARA Method in ClickUp

| PARA | ClickUp | Example |
|------|---------|---------|
| **Projects** | Folders with deadlines | Lancamento Agenda Magica Mar/26 |
| **Areas** | Spaces (ongoing) | CONTEUDO, COMERCIAL, SUPORTE |
| **Resources** | Space or Docs | RECURSOS, SOPs, Templates |
| **Archives** | Archived Folders | ARQUIVO, Lancamentos 2025 |

### Review Cadence
- **Daily:** Check "My Tasks" + "Overdue" views
- **Weekly:** Review all active Projects, update statuses
- **Monthly:** Review Areas for neglected responsibilities
- **Quarterly:** Archive completed Projects, review processes

---

## Integration Points

### MCP Tools Available
- `mcp__clickup__*` — 12 tools for CRUD operations
- `mcp__mission-control__*` — 6 tools for webhook automations

### n8n Workflows
- See `data/mission-control-n8n-workflows.json` for active workflows
- See `knowledge/N8N-WORKFLOW-API-RULES.md` for webhook rules
