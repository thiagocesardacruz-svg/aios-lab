# Learning Loop Storage

> Compound intelligence - agentes que melhoram a cada execução.

## Structure

```
learning/
├── patterns/              # Learned patterns
│   ├── success-patterns.yaml    # What works
│   ├── failure-patterns.yaml    # What doesn't work
│   └── efficiency-patterns.yaml # Shortcuts and optimizations
├── preferences/           # User and project preferences
│   ├── user-preferences.yaml    # User style, communication
│   └── project-conventions.yaml # Code style, naming, etc.
├── domain/                # Domain-specific knowledge
│   ├── codebase-knowledge.yaml  # How this codebase works
│   └── business-rules.yaml      # Business logic learned
└── metrics/               # Learning effectiveness
    ├── learning-effectiveness.yaml
    └── pattern-usage.yaml
```

## Usage

This storage is managed by the `/learning-loop` skill.

### Commands

- `*capture` - Manually capture learning from current context
- `*patterns` - List all patterns (filter by type/confidence)
- `*apply {task}` - Get relevant learnings for a task
- `*validate {pattern_id}` - Validate/update a pattern
- `*metrics` - Show learning effectiveness metrics
- `*export` - Export learnings for backup/sharing

## Pattern IDs

| Type | Format | Example |
|------|--------|---------|
| Success | SP-NNN | SP-001 |
| Failure | FP-NNN | FP-015 |
| Efficiency | EP-NNN | EP-007 |
| Preference | UP-NNN | UP-003 |
| Convention | PC-NNN | PC-012 |
| Codebase | CK-NNN | CK-005 |
| Business | BR-NNN | BR-002 |

## Confidence Levels

| Level | Range | Meaning |
|-------|-------|---------|
| Low | 0.0-0.5 | Tentative, needs more evidence |
| Medium | 0.5-0.8 | Reasonable confidence |
| High | 0.8-1.0 | Well-validated pattern |

## Governance

- Patterns with confidence < 0.5 require confirmation before auto-apply
- Confidence decays if pattern not used in 30 days
- No sensitive data (credentials, PII) in learnings
- User explicit instructions always override learned patterns

---

*Managed by /learning-loop skill*
