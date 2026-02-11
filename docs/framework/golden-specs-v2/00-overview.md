# Golden Specs v2 — Overview

> Canonical standards for AIOS squad components.
> Version: 2.0 | Status: CANONICAL

## Design Philosophy

```yaml
principle: "One spec, conditional sections"

rationale:
  - Single validator/schema to maintain
  - Operational squads use core sections only
  - Expert squads add personality sections
  - All squads have clear contracts

benefits:
  - Interoperability between squads
  - Testable contracts and interfaces
  - Personality preservation for expert agents
  - Automated validation possible
```

## Squad Classification

| Type | Rigidity | Personality | Use Cases |
|------|----------|-------------|-----------|
| **Operational** | HIGH | LOW | Automation, processes, quality gates |
| **Hybrid** | MEDIUM | MEDIUM | Marketing, sales, design, customer |
| **Expert** | MEDIUM | HIGH | Mind clones, advisors, specialists |

### Squad Type Assignment

| Squad | Type | Voice DNA | Thinking DNA |
|-------|------|-----------|--------------|
| ops, tech, qa, finance, translator, devops | operational | N/A | N/A |
| marketing, sales, design, design-system, customer, growth, hotel-mkt | hybrid | optional | optional |
| board, hormozi, copywriting-masters, storytelling | expert | required | required |

## Spec Documents

| Document | Purpose |
|----------|---------|
| [01-agents.md](./01-agents.md) | Agent definition standard |
| [02-workflows.md](./02-workflows.md) | Workflow definition standard |
| [03-tasks.md](./03-tasks.md) | Task definition standard |
| [04-checklists.md](./04-checklists.md) | Checklist definition standard |
| [05-templates.md](./05-templates.md) | Template definition standard |
| [06-data.md](./06-data.md) | Data/knowledge definition standard |
| [07-minds.md](./07-minds.md) | Voice DNA & Thinking DNA standard |
| [08-validation.md](./08-validation.md) | Validation schema and rules |

## Section Requirements by Type

| Section | Operational | Hybrid | Expert |
|---------|-------------|--------|--------|
| Identity | REQUIRED | REQUIRED | REQUIRED |
| Persona | optional | REQUIRED | REQUIRED |
| Commands | REQUIRED | REQUIRED | REQUIRED |
| Responsibilities | REQUIRED | REQUIRED | REQUIRED |
| Interface | REQUIRED | REQUIRED | REQUIRED |
| Hard Rules | REQUIRED | REQUIRED | REQUIRED |
| Failure Behavior | REQUIRED | REQUIRED | REQUIRED |
| Voice DNA | N/A | optional | REQUIRED |
| Thinking DNA | N/A | optional | REQUIRED |
| Context | optional | optional | optional |

## Examples

| Type | Example | File |
|------|---------|------|
| Operational | QA Lead | [examples/operational-qa-lead.md](./examples/operational-qa-lead.md) |
| Hybrid | Marketing Lead | [examples/hybrid-marketing-lead.md](./examples/hybrid-marketing-lead.md) |
| Expert | Gary Halbert | [examples/expert-gary-halbert.md](./examples/expert-gary-halbert.md) |

## Migration Path

1. Classify existing squad by type
2. Add missing required sections
3. Validate against schema
4. Add optional sections as needed

---

*Golden Specs v2.0 — AIOS Squad Standards*
