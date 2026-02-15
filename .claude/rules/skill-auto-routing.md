# Skill Auto-Routing (Summary)

## TL;DR
Skills can auto-invoke when task patterns match triggers. Opt-in system: skills must declare `auto_invoke: true` in frontmatter. Agents check registry (`.claude/skills/_registry.yaml`), match triggers, and inform user before invoking.

## Critical Rules
- MUST: Check skill registry for matching triggers before starting work
- MUST: Inform user with "🔄 Auto-invoking /skill-name..." before execution
- MUST: Verify current agent is in `agents_allowed` list
- NEVER: Auto-invoke if user says "don't use skills" or "manual only"
- NEVER: Auto-invoke for trivial tasks (< 3 steps, single file change)

## Skill Metadata (Opt-In)

```yaml
---
auto_invoke: true                    # Must explicitly enable
triggers:
  keywords:                          # Substring match
    - "implement story"
    - "research"
  patterns:                          # Regex match (optional)
    - "Story \\d+\\.\\d+"
agents_allowed:                      # Default: all
  - dev
  - architect
priority: high                       # low | medium | high | critical
---
```

## Registered Auto-Invoke Skills

| Skill | Triggers | Agents | Priority |
|-------|----------|--------|----------|
| `/architect-first` | architecture, design system, nova feature complexa | architect, dev, aios-master | critical |
| `/tech-search` | pesquisar, research, best practice | all | medium |
| `/enhance-workflow` | melhorar feature, enhance | aios-master, pm, architect | high |

## Full Documentation
See: `docs/rules/skill-auto-routing-full.md` for complete workflow, metadata schema, notification format, and examples.

Registry: `.claude/skills/_registry.yaml`
