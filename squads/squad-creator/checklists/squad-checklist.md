# Squad Quality Validation Checklist

> Comprehensive validation checklist ensuring squad completeness, correctness, and distribution readiness.
> Squad: squad-creator
> Created: 2025-01-01

---

## Pre-Conditions

Before starting, verify:

- [ ] AIOS project is initialized (`aios.minVersion` is met)
- [ ] Squad directory exists at the expected path under `squads/`
- [ ] `squad.yaml` manifest file is present in the squad root
- [ ] All dependencies (node, python, squads) are available

---

## Checklist Items

### Category 1: Manifest Validation

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1.1 | `squad.yaml` has all required fields: `name`, `version`, `description`, `author`, `license` | [ ] | |
| 1.2 | `version` follows semver format (e.g., `2.6.0`) | [ ] | |
| 1.3 | `name` is kebab-case (e.g., `squad-creator`) | [ ] | |
| 1.4 | `aios.minVersion` is set and valid semver | [ ] | |
| 1.5 | `aios.type` is set to `squad` | [ ] | |
| 1.6 | `components` section lists all agent, task, workflow, checklist, template, and data files | [ ] | |
| 1.7 | `dependencies` section declares node, python, and squad dependencies | [ ] | |
| 1.8 | `tags` array is populated with relevant keywords | [ ] | |

### Category 2: Structure Validation

| # | Item | Status | Notes |
|---|------|--------|-------|
| 2.1 | Required directory `agents/` exists | [ ] | |
| 2.2 | Required directory `tasks/` exists | [ ] | |
| 2.3 | Optional directories created as needed: `workflows/`, `checklists/`, `templates/`, `data/`, `scripts/`, `tools/` | [ ] | |
| 2.4 | All files listed in `components.agents` exist in `agents/` | [ ] | |
| 2.5 | All files listed in `components.tasks` exist in `tasks/` | [ ] | |
| 2.6 | All files listed in `components.workflows` exist in `workflows/` | [ ] | |
| 2.7 | All files listed in `components.checklists` exist in `checklists/` | [ ] | |
| 2.8 | All files listed in `components.data` exist in `data/` | [ ] | |
| 2.9 | No orphan files (files present in directories but not listed in `components`) | [ ] | |
| 2.10 | Empty directories contain `.gitkeep` placeholder | [ ] | |

### Category 3: Agent Validation

| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.1 | All agent files have an `activation-instructions` section | [ ] | |
| 3.2 | All agent files define a `persona` (name, role, expertise) | [ ] | |
| 3.3 | All agent files list available `commands` with descriptions | [ ] | |
| 3.4 | Agent dependencies on other agents or tools are declared and resolvable | [ ] | |
| 3.5 | Agent activation syntax uses `@agent-name` convention | [ ] | |
| 3.6 | No duplicate agent names across the squad | [ ] | |

### Category 4: Task Validation

| # | Item | Status | Notes |
|---|------|--------|-------|
| 4.1 | All task files have YAML frontmatter block | [ ] | |
| 4.2 | Required field `task` (task name) is present | [ ] | |
| 4.3 | Required field `responsavel` (responsible agent) is present | [ ] | |
| 4.4 | Required field `responsavel_type` (Human/AI/Hybrid) is present | [ ] | |
| 4.5 | Required field `atomic_layer` is present | [ ] | |
| 4.6 | Required field `Entrada` (inputs) is present and non-empty | [ ] | |
| 4.7 | Required field `Saida` (outputs) is present and non-empty | [ ] | |
| 4.8 | Required field `Checklist` references a valid checklist file | [ ] | |
| 4.9 | Implementation section exists with step-by-step instructions | [ ] | |
| 4.10 | Task command prefix uses `*task-name` convention | [ ] | |

### Category 5: Documentation

| # | Item | Status | Notes |
|---|------|--------|-------|
| 5.1 | `README.md` exists in the squad root | [ ] | |
| 5.2 | README contains minimum 200 words | [ ] | |
| 5.3 | All agent commands are documented with usage examples | [ ] | |
| 5.4 | Architecture diagrams or flowcharts are present for complex workflows | [ ] | |
| 5.5 | Installation and setup instructions are included | [ ] | |
| 5.6 | Version history or changelog section is present | [ ] | |

### Category 6: Distribution Readiness

| # | Item | Status | Notes |
|---|------|--------|-------|
| 6.1 | No secrets, API keys, or credentials in any files | [ ] | |
| 6.2 | License file (`LICENSE` or `LICENSE.md`) is present | [ ] | |
| 6.3 | Version has been bumped appropriately for the release | [ ] | |
| 6.4 | Changelog is updated with current version entries | [ ] | |
| 6.5 | All `.env.example` files are present (no actual `.env` files committed) | [ ] | |
| 6.6 | `.gitignore` covers sensitive and generated files | [ ] | |
| 6.7 | Package size is reasonable (no large binary files) | [ ] | |

---

## Post-Conditions

After completion, verify:

- [ ] All checklist items are checked (status = `[x]`)
- [ ] Validation score calculated: `(passed / total) * 100`
- [ ] Validation report generated with pass/fail summary
- [ ] Any failing items have documented remediation notes
- [ ] Squad is approved for distribution or issues are filed

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Creator | | | |
| Reviewer | | | |
| Approver | | | |

---

## Usage

```bash
# Use this checklist with:
*checklist squad-checklist

# Or reference in tasks:
checklist: squad-checklist.md
```

---

*Checklist created by squad-creator*
