# Commands Reference

> squad-creator v2.6 -- Complete command reference for all 5 agents
> Last updated: 2026-02-04

---

## Overview

The squad-creator v2.6 includes 5 agents (1 base + 4 specialists), each with their own set of commands. All commands use the `*` prefix when invoked. To use a sub-agent's commands, first activate the sub-agent with `@squad-creator:agent-name`.

### Agent Summary

| Agent ID | Name | Archetype | Primary Domain |
|----------|------|-----------|---------------|
| squad-creator | Craft | Creator | Squad creation and management |
| squad-architect | Atlas | Strategist | Squad composition and tool discovery |
| sop-extractor | Scribe | Analyst | SOP extraction and classification |
| oalanicolas | Mirror | Empath | Mind Cloning and DNA extraction |
| pedro-valerio | Forge | Engineer | Workflow and checklist design |

---

## 1. squad-creator (Craft) -- Base Agent

Activation: `@squad-creator`

The base agent handles squad lifecycle management: creation, validation, listing, migration, analysis, and extension.

### *create-squad

Creates a new squad with full directory structure and manifest.

- **Syntax**: `*create-squad {name}`
- **Parameters**:
  - `name` (string, required): The squad name in kebab-case
- **Interactive**: Yes (elicit=true) -- prompts for description, domain, and agent definitions
- **Example**:
  ```
  *create-squad my-new-squad
  ```
- **Expected Output**: Full directory structure under `squads/{name}/` with `squad.yaml`, agent files, and empty component directories.

### *design-squad

Designs squad structure from requirements documentation, analyzing docs to propose agent compositions, tasks, and workflows.

- **Syntax**: `*design-squad` or `*design-squad --docs {path}`
- **Parameters**:
  - `--docs` (string, optional): Path to requirements document or PRD
- **Interactive**: Yes -- guided design process
- **Example**:
  ```
  *design-squad --docs ./docs/prd/my-feature.md
  ```
- **Expected Output**: Squad composition blueprint with proposed agents, tasks, workflows, and tool recommendations.

### *validate-squad

Validates squad structure, checking manifest integrity, file existence, and schema compliance.

- **Syntax**: `*validate-squad {name}`
- **Parameters**:
  - `name` (string, required): The squad name to validate
- **Example**:
  ```
  *validate-squad my-new-squad
  ```
- **Expected Output**: Pass/fail report with details on missing files, schema errors, and warnings.

### *list-squads

Lists all available squads in the `squads/` directory with their metadata.

- **Syntax**: `*list-squads`
- **Parameters**: None
- **Example**:
  ```
  *list-squads
  ```
- **Expected Output**: Table showing squad name, version, description, agent count, and task count for each squad.

### *migrate-squad

Migrates a squad to a newer AIOS version or squad schema format.

- **Syntax**: `*migrate-squad {name}`
- **Parameters**:
  - `name` (string, required): The squad to migrate
- **Example**:
  ```
  *migrate-squad legacy-squad
  ```
- **Expected Output**: Migration report showing changes made, files updated, and any manual steps required.

### *analyze-squad

Performs deep analysis of a squad's structure, dependencies, and coverage gaps.

- **Syntax**: `*analyze-squad {name}`
- **Parameters**:
  - `name` (string, required): The squad to analyze
- **Example**:
  ```
  *analyze-squad my-squad
  ```
- **Expected Output**: Analysis report with dependency graph, coverage gaps, and optimization recommendations.

### *extend-squad

Extends an existing squad with new components (agents, tasks, workflows).

- **Syntax**: `*extend-squad {name}`
- **Parameters**:
  - `name` (string, required): The squad to extend
- **Interactive**: Yes -- guides through adding new components
- **Example**:
  ```
  *extend-squad my-squad
  ```
- **Expected Output**: Updated squad manifest and newly generated component files.

---

## 2. squad-architect (Atlas) -- Strategist

Activation: `@squad-creator:squad-architect`

Atlas handles squad composition design, quality assessment, and tool discovery.

### *design-squad

Designs squad structure from requirements analysis with macro-vision composition.

- **Syntax**: `*design-squad` or `*design-squad --docs {path}`
- **Parameters**:
  - `--docs` (string, optional): Path to requirements or PRD documentation
- **Example**:
  ```
  *design-squad --docs ./docs/prd/onboarding-system.md
  ```
- **Expected Output**: Detailed blueprint with agent compositions, task mappings, collaboration patterns, and tool recommendations.

### *review-squad

Reviews an existing squad for quality and completeness against task-first architecture principles.

- **Syntax**: `*review-squad {name}` or `*review-squad {name} --verbose`
- **Parameters**:
  - `name` (string, required): Squad to review
  - `--verbose` (flag, optional): Include file-level analysis
- **Example**:
  ```
  *review-squad my-squad --verbose
  ```
- **Expected Output**: Quality review with scores for structure, tasks, agents, and improvement recommendations.

### *quality-dashboard

Displays comprehensive quality metrics and coverage for a squad.

- **Syntax**: `*quality-dashboard {name}` or `*quality-dashboard {name} --export markdown`
- **Parameters**:
  - `name` (string, required): Squad to assess
  - `--export` (string, optional): Export format (markdown)
- **Example**:
  ```
  *quality-dashboard squad-creator
  ```
- **Expected Output**: Dashboard showing Structure Coverage %, Task Coverage %, Doc Coverage %, Agent Health %, Overall Score /100, and prioritized improvement suggestions.

### *discover-tools

Deep tool discovery with RICE/WSJF evaluation across 5 parallel search channels.

- **Syntax**: `*discover-tools {domain}` or with scoring option
- **Parameters**:
  - `domain` (string, required): Area of need
  - `capability_gaps` (string, required): Description of missing capabilities
  - `constraints` (object, optional): Budget, license, security constraints
  - `--score` (string, optional): Scoring framework to emphasize (`rice` or `wsjf`)
- **Examples**:
  ```
  *discover-tools "web scraping"
  *discover-tools "database management" --score rice
  *discover-tools "CI/CD" --score wsjf
  ```
- **Expected Output**: Decision matrix table with RICE scores, WSJF scores, gate results, tier assignments, and DO NOW/DO NEXT/DO LATER/DON'T DO classification.

### *show-tools

View discovered tools from the tool registry.

- **Syntax**: `*show-tools` or `*show-tools --tier {n}` or `*show-tools --category {cat}`
- **Parameters**:
  - `--tier` (number, optional): Filter by tier (1-4)
  - `--category` (string, optional): Filter by category (mcp, api, cli, library, github)
- **Example**:
  ```
  *show-tools --tier 1
  ```
- **Expected Output**: Table of registered tools with name, category, tier, decision, and last evaluated date.

### *add-tool

Manually add a tool to the tool registry with RICE/WSJF evaluation.

- **Syntax**: `*add-tool`
- **Parameters**: Interactive -- prompts for tool details and scoring
- **Example**:
  ```
  *add-tool
  ```
- **Expected Output**: New entry in `tool-registry.yaml` with full evaluation metadata.

---

## 3. sop-extractor (Scribe) -- Analyst

Activation: `@squad-creator:sop-extractor`

Scribe handles SOP extraction, validation, blueprint generation, and automation analysis.

### *extract-sop

Extracts SOP from source material and structures into SC-PE-001 format.

- **Syntax**: `*extract-sop --source {path} --source_type {type}`
- **Parameters**:
  - `--source` (string, required): Path to the source document
  - `--source_type` (string, required): One of `document`, `transcript`, `interview`, `observation`
  - `--format` (string, optional): SOP format (default: `sc-pe-001`)
- **Examples**:
  ```
  *extract-sop --source ./docs/onboarding-process.md --source_type document
  *extract-sop --source ./transcripts/expert-interview.md --source_type interview
  ```
- **Expected Output**: Complete SOP in SC-PE-001 format with cognitive taxonomy classification and executor type assignment for each step. Saved to `data/sops/`.

### *validate-sop

Validates SOP completeness and quality against SC-PE-001 standard.

- **Syntax**: `*validate-sop {sop-id}` or `*validate-sop {sop-id} --verbose`
- **Parameters**:
  - `sop-id` (string, required): The SOP identifier to validate
  - `--verbose` (flag, optional): Per-part detailed analysis
- **Example**:
  ```
  *validate-sop SC-PE-DEPLOY-2026-02-04 --verbose
  ```
- **Expected Output**: Validation report showing pass/fail for each of the 11 parts, completeness score, and specific issues found.

### *generate-blueprint

Generates squad blueprint from a validated SOP, suggesting agents, tasks, and workflows.

- **Syntax**: `*generate-blueprint {sop-id}` or `*generate-blueprint {sop-id} --agents auto`
- **Parameters**:
  - `sop-id` (string, required): The validated SOP to convert
  - `--agents` (string, optional): `auto` for auto-suggested agent roles
- **Example**:
  ```
  *generate-blueprint SC-PE-DEPLOY-2026-02-04 --agents auto
  ```
- **Expected Output**: Squad blueprint with proposed agents mapped to SOP responsibilities, tasks derived from procedure steps, and workflows from the execution sequence.

### *analyze-automation

Analyzes SOP for automation opportunities using PV_PM_001 framework.

- **Syntax**: `*analyze-automation {sop-id}` or `*analyze-automation {sop-id} --threshold {level}`
- **Parameters**:
  - `sop-id` (string, required): The SOP to analyze
  - `--threshold` (string, optional): Minimum automation potential to include (`low`, `medium`, `high`)
- **Example**:
  ```
  *analyze-automation SC-PE-DEPLOY-2026-02-04 --threshold medium
  ```
- **Expected Output**: Automation roadmap showing each step's automation potential, recommended executor type, and estimated effort to automate.

---

## 4. oalanicolas (Mirror) -- Empath

Activation: `@squad-creator:oalanicolas`

Mirror handles mind cloning, Voice DNA extraction, Thinking DNA extraction, and profile management.

### *clone-mind

Full mind cloning pipeline: source validation, Voice DNA, Thinking DNA, merge, smoke test.

- **Syntax**: `*clone-mind --person {name} --mode {mode} --sources [{paths}]`
- **Parameters**:
  - `--person` (string, required): Full name of the person to clone
  - `--mode` (string, optional, default: quality): `yolo` for fast or `quality` for thorough
  - `--sources` (array, required): Paths to source material files
- **Examples**:
  ```
  *clone-mind --person "Maria Santos" --mode yolo --sources ["./posts.md", "./notes.md"]
  *clone-mind --person "Maria Santos" --mode quality --sources ["./blog.md", "./linkedin.md", "./meeting.md", "./adr.md", "./interview.md"]
  ```
- **Expected Output**: Complete mind profile with Voice DNA, Thinking DNA, fidelity score, and 3 smoke test results. Saved to `data/minds/{slug}.yaml`.

### *extract-voice-dna

Extracts communication patterns, vocabulary, and tone from text sources.

- **Syntax**: `*extract-voice-dna --source {path}` or `*extract-voice-dna --source {path} --depth deep`
- **Parameters**:
  - `--source` (string/array, required): Path(s) to text sources
  - `--depth` (string, optional): Analysis depth (`standard` or `deep`)
- **Example**:
  ```
  *extract-voice-dna --source ./transcripts/interview-01.md --depth deep
  ```
- **Expected Output**: Voice DNA profile with vocabulary patterns, tone classification, sentence structure analysis, emoji patterns, cultural markers, and catchphrases.

### *extract-thinking-dna

Extracts decision frameworks, mental models, and priorities from decision-oriented sources.

- **Syntax**: `*extract-thinking-dna --source {path}` or `*extract-thinking-dna --source {path} --frameworks all`
- **Parameters**:
  - `--source` (string/array, required): Path(s) to decision records, strategy docs, meeting notes
  - `--frameworks` (string, optional): `all` to extract all mental models
- **Example**:
  ```
  *extract-thinking-dna --source ./docs/strategy-q4.md --frameworks all
  ```
- **Expected Output**: Thinking DNA profile with decision frameworks, mental models, cognitive biases, risk tolerance, and priority hierarchy.

### *update-mind

Updates an existing mind profile with new source material for incremental improvement.

- **Syntax**: `*update-mind {profile-id} --source {path}`
- **Parameters**:
  - `profile-id` (string, required): Existing profile identifier (slug)
  - `--source` (string/array, required): Path(s) to new source material
- **Example**:
  ```
  *update-mind maria-santos --source ./new-interview.md
  ```
- **Expected Output**: Updated profile with revised fidelity score and change summary.

### *auto-acquire-sources

Automatically searches for and acquires source material about a person from available channels.

- **Syntax**: `*auto-acquire-sources --person {name}`
- **Parameters**:
  - `--person` (string, required): Full name of the person to research
- **Example**:
  ```
  *auto-acquire-sources --person "Maria Santos"
  ```
- **Expected Output**: List of discovered sources with type, quality assessment, and download status.

### *smoke-test

Runs fidelity smoke test on a mind profile with scenario-based validation.

- **Syntax**: `*smoke-test {profile-id}` or `*smoke-test {profile-id} --scenarios {n}`
- **Parameters**:
  - `profile-id` (string, required): Profile to test
  - `--scenarios` (number, optional): Number of test scenarios (default: 3, max: 5)
- **Example**:
  ```
  *smoke-test maria-santos --scenarios 5
  ```
- **Expected Output**: Smoke test results showing pass/fail and match percentage for each scenario (email writing, decision making, conflict resolution, and optionally more).

---

## 5. pedro-valerio (Forge) -- Engineer

Activation: `@squad-creator:pedro-valerio`

Forge handles workflow design, checklist creation, veto condition definition, and process analysis.

### *design-workflow

Designs multi-step workflows with phases, decision points, and quality gates.

- **Syntax**: `*design-workflow` or `*design-workflow --name {name}`
- **Parameters**:
  - `--name` (string, optional): Workflow name
  - `--from-sop` (string, optional): SOP ID to derive workflow from
  - `--phases` (number, optional): Number of phases
  - `--hitl` (boolean, optional): Include HITL checkpoints
- **Examples**:
  ```
  *design-workflow --name "deployment-pipeline" --phases 3 --hitl true
  *design-workflow --from-sop SC-PE-DEPLOY-2026-02-04
  ```
- **Expected Output**: Workflow specification with phases, steps, decision points, handoffs, and quality gates.

### *design-checklist

Designs validation checklists for quality gates or veto conditions.

- **Syntax**: `*design-checklist` or `*design-checklist --name {name} --type {type}`
- **Parameters**:
  - `--name` (string, optional): Checklist name
  - `--type` (string, optional): `quality-gate` or `veto`
- **Examples**:
  ```
  *design-checklist --name "release-validation" --type quality-gate
  *design-checklist --type veto
  ```
- **Expected Output**: Structured checklist with items, criteria, responsible parties, and pass/fail conditions.

### *define-veto-conditions

Defines veto conditions and approval gates that can halt workflow execution.

- **Syntax**: `*define-veto-conditions --workflow {name}`
- **Parameters**:
  - `--workflow` (string, required): Workflow to define veto conditions for
  - `--severity` (string, optional): Filter by severity level (`critical`, `high`, `medium`, `low`)
- **Example**:
  ```
  *define-veto-conditions --workflow "deployment-pipeline" --severity critical
  ```
- **Expected Output**: List of veto conditions with severity, trigger criteria, action to take, and notification targets.

### *analyze-process

Analyzes existing processes for optimization opportunities, bottlenecks, and HITL improvements.

- **Syntax**: `*analyze-process --source {path}`
- **Parameters**:
  - `--source` (string, required): Path to process documentation
  - `--focus` (string, optional): Analysis focus (`bottlenecks`, `hitl`, `automation`, `all`)
- **Examples**:
  ```
  *analyze-process --source ./docs/current-process.md --focus bottlenecks
  *analyze-process --source ./docs/current-process.md --focus hitl
  ```
- **Expected Output**: Process analysis report with identified issues, optimization recommendations, and proposed improvements.

---

## Utility Commands (All Agents)

These commands are available in every agent:

### *help

Shows all available commands with descriptions for the currently active agent.

- **Syntax**: `*help`
- **Expected Output**: Numbered list of commands grouped by category.

### *exit

Exits the current agent mode, returning to the default conversation state.

- **Syntax**: `*exit`
- **Expected Output**: Confirmation message that the agent mode has been deactivated.

---

*squad-creator docs v2.6.0 -- Synkra AIOS*
