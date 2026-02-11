# Skill Auto-Routing Rules

## Overview

Skills can be automatically invoked by agents when task patterns match defined triggers. This system uses **opt-in** governance - skills must explicitly declare `auto_invoke: true` to be auto-routed.

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                     User Request                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Agent Activated                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 1. Parse user request                                 │  │
│  │ 2. Check skill registry for matching triggers         │  │
│  │ 3. If match found AND auto_invoke: true:              │  │
│  │    → Inform user: "🔄 Auto-invoking /skill-name..."   │  │
│  │    → Load and execute skill                           │  │
│  │ 4. Continue with agent expertise                      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Skill Metadata Schema

Skills that want auto-routing MUST include this in their YAML frontmatter:

```yaml
---
name: skill-name
description: |
  Skill description...

# Auto-routing configuration (opt-in)
auto_invoke: true                    # Default: false - must explicitly enable
triggers:
  keywords:                          # Words/phrases that trigger this skill
    - "implement story"
    - "desenvolver story"
    - "start development"
  patterns:                          # Regex patterns (optional)
    - "Story \\d+\\.\\d+"
    - "implement.*feature"
  file_context:                      # File patterns that suggest this skill (optional)
    - "docs/stories/*.md"
    - "*.story.md"
  conditions:                        # Contextual conditions (optional)
    - "no_existing_tests"
    - "greenfield_project"
agents_allowed:                      # Which agents can auto-invoke (default: all)
  - dev
  - architect
  - aios-master
priority: high                       # low | medium | high | critical
confirm_before_invoke: false         # Ask user before invoking? (default: false)
---
```

## Agent Behavior

When an agent receives a task, it MUST:

1. **Check the skill registry** (`.claude/skills/_registry.yaml`)
2. **Match triggers** against the user request:
   - Keywords: case-insensitive substring match
   - Patterns: regex match
   - File context: if working with matching files
   - Conditions: evaluate contextual state
3. **Verify permissions**: Check if current agent is in `agents_allowed`
4. **Respect priority**: If multiple skills match, use highest priority
5. **Inform user**: Always notify before auto-invoking
6. **Execute skill**: Load SKILL.md and follow its workflow

## Notification Format

When auto-invoking a skill, agents MUST inform the user:

```
🔄 Auto-invoking `/skill-name` for this task...
   Trigger: [matched keyword/pattern]
   Reason: [brief explanation]
```

## Registered Skills (Auto-Invoke Enabled)

| Skill | Triggers | Agents | Priority |
|-------|----------|--------|----------|
| `/architect-first` | architecture, design system, nova feature complexa | architect, dev, aios-master | critical |
| `/tech-search` | pesquisar, research, best practice, como fazer | all | medium |
| `/enhance-workflow` | melhorar feature, enhance, evolução de projeto | aios-master, pm, architect | high |

## Skills Registry Location

The central registry is at: `.claude/skills/_registry.yaml`

Agents should read this file to know which skills support auto-routing.

## Opt-In Default

**IMPORTANT:** Skills are NOT auto-invoked by default. To enable:

1. Add `auto_invoke: true` to skill's YAML frontmatter
2. Define `triggers` (at least keywords)
3. Register in `_registry.yaml`

Skills without these settings remain **user-invocable only** (via `/skill-name`).

## When NOT to Auto-Invoke

Even if triggers match, do NOT auto-invoke if:

1. User explicitly says "don't use skills" or "manual only"
2. Skill has `confirm_before_invoke: true` and user hasn't confirmed
3. Current agent is not in `agents_allowed`
4. Task is trivial (< 3 steps, single file change)
5. User is asking a question (not requesting execution)

## Adding New Skills to Auto-Routing

When creating skills via `/skill-creator`:

1. During creation, you'll be asked: "Enable auto-routing for this skill?"
2. If yes, provide triggers and allowed agents
3. The skill will be added to `_registry.yaml` automatically

To add auto-routing to existing skills:

1. Edit the skill's `SKILL.md` frontmatter
2. Add `auto_invoke: true` and `triggers`
3. Run: update `_registry.yaml` with new entry

## Examples

### Example 1: Story Implementation

User: "Implement Story 2.3 - Add login button"

Agent (@dev):
1. Detects "Story 2.3" matches pattern `Story \d+\.\d+`
2. Checks registry → `/story-implement` has this trigger (when created)
3. Informs: "🔄 Auto-invoking `/story-implement`..."
4. Loads and executes skill workflow

### Example 2: Research Task

User: "What's the best way to handle auth in Next.js 16?"

Agent (@dev):
1. Detects "best way" matches keyword in `/tech-search`
2. Checks registry → `/tech-search` allows all agents
3. Informs: "🔄 Auto-invoking `/tech-search`..."
4. Executes research workflow

### Example 3: Architecture Decision

User: "We need to add a new payment module"

Agent (@architect):
1. Detects "new module" + "payment" suggests architecture work
2. Checks registry → `/architect-first` triggers on "nova feature complexa"
3. Informs: "🔄 Auto-invoking `/architect-first`..."
4. Executes architecture-first workflow

---

*Skill Auto-Routing System v1.0 - AIOS Framework*
