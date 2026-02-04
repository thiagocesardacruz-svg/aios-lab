# FAQ -- Frequently Asked Questions

> squad-creator v2.6 -- Perguntas frequentes e glossario
> Ultima atualizacao: 2026-02-04

---

## General Concepts

### What is a squad?

A squad is a self-contained package of AI agents, tasks, workflows, checklists, and data that work together to accomplish a specific domain of work. Squads follow the **task-first architecture**, meaning every squad is designed around executable tasks rather than agent personas. Agents exist to serve tasks, not the other way around. A squad is defined by its `squad.yaml` manifest, which declares all components, dependencies, sub-agents, and metadata. The squad-creator itself is a squad, demonstrating the recursive nature of the Synkra AIOS framework.

### What is task-first architecture?

Task-first architecture is the foundational design principle of Synkra AIOS squads. Instead of starting with "what agents do we need?", you start with "what tasks need to be executed?". Each task has a clear definition with inputs (Entrada), outputs (Saida), a responsible agent (responsavel), and a completion checklist. Agents are then assigned to tasks based on their expertise. This ensures that every agent in a squad has a clear purpose and that no task goes unassigned. The task definition files (in the `tasks/` folder) serve as executable workflows, not just reference documentation. When an agent receives a task, it follows the implementation steps exactly as written.

### How does sub-agent delegation work?

The squad-creator base agent can delegate work to its 4 specialist sub-agents using the `@squad-creator:agent-name` syntax. For example, `@squad-creator:oalanicolas` activates Mirror for mind cloning tasks. Each sub-agent has its own persona, commands, and dependencies. When delegated to, a sub-agent activates with its persona and operates independently within its scope. The base squad-creator agent acts as the orchestrator, knowing when to delegate and to whom. Sub-agents can also reference each other for collaboration -- for instance, Atlas (squad-architect) might request a mind clone from Mirror (oalanicolas) to create a persona for a new squad agent.

---

## Mind Cloning

### What is Mind Cloning?

Mind Cloning is the process of extracting the communicative and cognitive essence of a real person to create a high-fidelity AI agent persona. It captures two complementary dimensions: Voice DNA (how the person communicates) and Thinking DNA (how the person thinks and makes decisions). The result is a mind profile stored as YAML that can be used to configure agent personas that authentically represent a person's communication style and decision-making patterns. Mind Cloning is handled by the Mirror agent (`@oalanicolas`), and the full pipeline includes source validation, extraction, merging, and smoke testing.

### What is Voice DNA?

Voice DNA captures **how** someone communicates. It is a structured profile that includes five dimensions: (1) Communication Style -- formal vs. informal, direct vs. indirect, verbose vs. concise; (2) Vocabulary Patterns -- preferred words, jargon, technical terms, catchphrases; (3) Tone and Register -- emotional tone, authority level, warmth, humor usage; (4) Cultural Markers -- language mixing, cultural references, idioms, regional expressions; and (5) Structural Patterns -- paragraph structure, list usage, question frequency, storytelling style. Voice DNA is extracted by analyzing text sources such as blog posts, social media, transcripts, and interviews using the `*extract-voice-dna` task.

### What is Thinking DNA?

Thinking DNA captures **what** drives a person's decisions. It is a structured profile that includes six dimensions: (1) Decision Frameworks -- data-driven, intuition, consensus, authority-based approaches; (2) Mental Models -- first principles, analogies, systems thinking; (3) Cognitive Biases -- known tendencies like confirmation bias, anchoring, optimism bias; (4) Priority Hierarchy -- what matters most between speed, quality, cost, user experience, innovation; (5) Risk Tolerance -- conservative, moderate, or aggressive risk appetite; and (6) Problem-Solving Approach -- systematic vs. creative, top-down vs. bottom-up. Thinking DNA is extracted from decision records, strategy documents, meeting notes, and ADRs using the `*extract-thinking-dna` task.

### What is YOLO mode vs. QUALITY mode?

These are the two execution modes for mind cloning:

- **YOLO mode** (60-75% fidelity): Fast, autonomous extraction. Requires a minimum of 2 sources. Auto-resolves conflicts by picking the highest-confidence signal. Best for prototyping, internal tools, and quick exploration. Completes in minutes.

- **QUALITY mode** (85-95% fidelity): Thorough, validated extraction. Requires a minimum of 5 diverse sources. Prompts the user to resolve ambiguous conflicts. Includes multi-pass review. Best for production personas, client-facing agents, and critical roles. May take hours.

The mode is selected with the `--mode` parameter: `*clone-mind --person "Name" --mode yolo` or `*clone-mind --person "Name" --mode quality`.

---

## Tool Discovery

### What is RICE scoring?

RICE is a prioritization framework used to evaluate discovered tools. The acronym stands for Reach, Impact, Confidence, and Effort. The formula is `RICE = (Reach * Impact * Confidence) / Effort`. Reach (1-10) measures how many agents or workflows benefit. Impact (1-10) measures the significance of the improvement. Confidence (0.0-1.0) measures certainty in the estimates. Effort (1-10) measures the integration complexity. A high RICE score means the tool provides significant value relative to the effort required to integrate it.

### What is WSJF scoring?

WSJF (Weighted Shortest Job First) is a prioritization framework from SAFe (Scaled Agile Framework). The formula is `WSJF = Cost_of_Delay / Duration`, where Cost of Delay = User/Business Value + Time Criticality + Risk Reduction. It prioritizes tools that deliver the highest value in the shortest time, with urgency factored in. Tools with high time criticality or risk reduction scores get prioritized over equally valuable but less urgent alternatives.

### What is the Security Gate?

The Security Gate is a pass/fail checkpoint in the tool evaluation pipeline. Every discovered tool must pass it before being recommended. It checks four criteria: (1) CVE database check for known vulnerabilities; (2) License compatibility (MIT/Apache = pass, GPL = caution, proprietary = block); (3) Maintenance health (last commit recency, active maintainers, release frequency); and (4) Dependency audit for vulnerable transitive dependencies. A tool that fails the Security Gate is classified as "DON'T DO" regardless of its RICE or WSJF scores.

### What is the Social Proof Gate?

The Social Proof Gate validates community adoption and trust. It checks GitHub stars (minimum thresholds vary by tier target), download counts across package managers (npm, PyPI, crates.io), community activity (issue response time, PR merge rate), and documentation quality. Tools that fail this gate are flagged as "experimental" or "LOW_CONFIDENCE" and cannot achieve Tier 1 classification. Unlike the Security Gate, failing Social Proof does not automatically block a tool, but it caps the maximum tier at Tier 3.

### What is the Tier system?

Tools are classified into 4 tiers based on their composite score (a weighted blend of RICE and WSJF):

| Tier | Percentile | Description |
|------|-----------|-------------|
| Tier 1 | Top 10% | Best-in-class, core tooling |
| Tier 2 | Top 25% | Strong candidates for integration |
| Tier 3 | Top 50% | Viable options worth monitoring |
| Tier 4 | Bottom 50% | Low priority or not recommended |

---

## SOP Extraction

### What is SC-PE-001?

SC-PE-001 is the standard format for SOPs in the squad-creator framework. It defines 11 mandatory parts: (1) Titulo e Identificacao, (2) Objetivo, (3) Escopo, (4) Definicoes, (5) Responsabilidades, (6) Pre-requisitos, (7) Procedimento, (8) Pontos de Decisao, (9) Criterios de Qualidade, (10) Excecoes e Tratamento de Erros, and (11) Referencias e Anexos. Every SOP extracted by the sop-extractor agent must conform to this format and pass validation against it.

### What is cognitive taxonomy?

The cognitive taxonomy used in squad-creator is based on Bloom's Taxonomy, which classifies cognitive complexity into six levels: Remember, Understand, Apply, Analyze, Evaluate, and Create. Each step in an extracted SOP is classified by its cognitive level, which directly correlates with automation potential. Steps at the Remember and Understand levels have high automation potential (AI can handle them), while Evaluate and Create levels typically require human involvement. This classification drives executor type assignment (Human, AI, or Hybrid).

### What is PV_PM_001?

PV_PM_001 is the automation analysis framework used by the sop-extractor agent. It systematically analyzes each step in a validated SOP to determine what can be automated, what requires human oversight, and what must remain fully manual. The analysis considers cognitive level, data availability, decision complexity, and risk tolerance to produce an automation roadmap with concrete recommendations for each step.

---

## Glossary

| Term | Definition |
|------|-----------|
| **AIOS** | AI-Orchestrated System -- the Synkra meta-framework for AI agent development |
| **Bloom's Taxonomy** | Cognitive classification framework with 6 levels from Remember to Create |
| **Composite Score** | Weighted blend of RICE and WSJF scores used for tier assignment |
| **Decision Matrix** | Final classification of tools: DO NOW, DO NEXT, DO LATER, DON'T DO |
| **Elicit** | Task property indicating it requires interactive user input |
| **Entrada** | Input parameters for a task (Portuguese for "input") |
| **Executor Type** | Classification of who executes a step: Human, AI, or Hybrid |
| **Fidelity Score** | 0-100 metric measuring how accurately a mind profile represents the source person |
| **HITL** | Human-in-the-Loop -- integration points where human oversight is required |
| **Mind Profile** | Complete YAML file containing merged Voice DNA and Thinking DNA |
| **Responsavel** | The agent or person responsible for executing a task |
| **RICE** | Reach, Impact, Confidence, Effort -- prioritization scoring framework |
| **Saida** | Output produced by a task (Portuguese for "output") |
| **SC-PE-001** | Standard 11-part SOP format used in squad-creator |
| **Smoke Test** | 3-scenario validation test for mind profiles |
| **Squad Manifest** | The `squad.yaml` file that declares all components and configuration |
| **Sub-Agent** | A specialist agent within a squad that can be delegated to |
| **Task-First** | Architecture principle where tasks drive agent design, not vice versa |
| **Tier** | Percentile-based classification for discovered tools (1-4) |
| **Veto Condition** | A condition that halts workflow execution at specified severity levels |
| **Voice DNA** | Structured profile of communication patterns, vocabulary, and tone |
| **Thinking DNA** | Structured profile of decision frameworks, mental models, and biases |
| **WSJF** | Weighted Shortest Job First -- prioritization framework from SAFe |

---

*squad-creator docs v2.6.0 -- Synkra AIOS*
