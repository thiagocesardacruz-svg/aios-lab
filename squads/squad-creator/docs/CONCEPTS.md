# Concepts -- Deep Dive

> squad-creator v2.6 -- Theoretical foundations and framework details
> Last updated: 2026-02-04

---

## Voice DNA

Voice DNA is the communicative fingerprint of a person, capturing the patterns, preferences, and idiosyncrasies of how they express themselves in writing and speech. It is one of the two pillars of Mind Cloning and is extracted by the Mirror agent (`@oalanicolas`) using the `*extract-voice-dna` task.

### The Five Dimensions of Voice DNA

**1. Communication Style**
This dimension captures the macro-level patterns of how someone structures their communication. It includes formality level (formal documents vs. casual messages), directness (blunt statements vs. diplomatic hedging), verbosity (concise bullet points vs. elaborate paragraphs), and register adaptation (how they shift style between contexts like Slack messages vs. technical documents). The extraction process analyzes the same person across multiple contexts to build a complete style map rather than a single-context snapshot.

**2. Vocabulary Patterns**
Vocabulary analysis goes beyond simple word frequency counts. It identifies domain-specific jargon (does the person favor "deploy" vs. "release" vs. "ship"?), borrowed words from other languages (code-switching patterns common in multilingual speakers), preferred synonyms (consistently choosing "leverage" over "use"), and trademark phrases unique to the individual. The analysis excludes common stop words and focuses on the top 50 distinctive vocabulary items that differentiate this person from a generic writer.

**3. Tone and Register**
Tone captures the emotional texture of communication. It includes assertiveness level (measured by the ratio of hedging language like "maybe" and "perhaps" to direct statements), emotional register range (does the person show only professional neutrality, or do they express enthusiasm, frustration, humor?), authority projection (commanding vs. collaborative vs. deferential), and warmth indicators (personal asides, empathy markers, encouragement patterns).

**4. Cultural Markers**
Cultural markers reveal the social and cultural context embedded in someone's communication. This includes primary and secondary language influences, regional expressions or slang, cultural references (pop culture, business culture, academic culture), metaphor preferences (sports metaphors, war metaphors, cooking metaphors), and generational language cues. For bilingual individuals, code-switching patterns (when and why they switch languages) are particularly revealing.

**5. Structural Patterns**
Structural patterns capture how someone organizes their thoughts in writing. This includes average sentence length, syntactic complexity (simple vs. compound vs. complex sentences), preferred structures (declarative, interrogative, imperative), rhythm patterns (short-long alternation, consistent length, building to a point), paragraph length tendencies, and organizational preferences (lists vs. prose, headers vs. flow, numbered vs. bulleted).

---

## Thinking DNA

Thinking DNA is the cognitive fingerprint of a person, capturing how they process information, make decisions, and solve problems. It is the second pillar of Mind Cloning and is extracted using the `*extract-thinking-dna` task from decision-oriented source material.

### The Six Dimensions of Thinking DNA

**1. Decision Frameworks**
This dimension identifies the structured and unstructured methods a person defaults to when making decisions. Some people rely on explicit frameworks like RICE scoring, Eisenhower Matrix, or pros-cons lists. Others use intuition honed by experience, or consensus-building through stakeholder alignment. The extraction process identifies which frameworks appear repeatedly in decision records and classifies the person's decision speed as deliberate (thorough analysis before action) or intuitive (quick judgment with iterative correction).

**2. Mental Models**
Mental models are the conceptual frameworks people use to understand and reason about the world. Common mental models include first-principles thinking (breaking problems to fundamental truths), inversion (working backward from the desired outcome), systems thinking (understanding feedback loops and emergent behavior), Pareto principle (focusing on the vital few), and probabilistic reasoning (thinking in ranges rather than point estimates). The extraction identifies which models the person references or implicitly uses, and maps their preferred abstraction level.

**3. Cognitive Biases**
Every decision-maker has cognitive biases that influence their judgment. The extraction process identifies recurring bias patterns such as confirmation bias (seeking information that confirms existing beliefs), anchoring (over-weighting the first piece of information), recency bias (over-weighting recent events), sunk cost fallacy (continuing past the point of rationality due to prior investment), and optimism bias (underestimating risks). Importantly, it also measures the person's self-awareness of these biases through self-correction language in their writing.

**4. Priority Hierarchy**
Priority hierarchy captures what the person consistently optimizes for when trade-offs arise. Common priority dimensions include speed vs. quality, innovation vs. stability, user experience vs. technical elegance, cost efficiency vs. capability, and team morale vs. individual performance. The extraction identifies both explicit priority statements and implicit priorities revealed by resource allocation patterns and trade-off decisions.

**5. Risk Tolerance**
Risk tolerance measures the person's appetite for uncertainty and potential downside. It is classified as conservative (prefers proven approaches, builds fallbacks, avoids irreversible decisions), moderate (accepts calculated risks with mitigation plans), or aggressive (embraces uncertainty, moves fast, accepts occasional failures). The extraction also captures variation by domain -- a person might be aggressive with technology risks but conservative with financial decisions.

**6. Problem-Solving Approach**
This dimension captures the person's default approach to solving problems. It includes systematic vs. creative (methodical analysis vs. lateral thinking), top-down vs. bottom-up (starting from the big picture vs. starting from details), solo vs. collaborative (individual deep work vs. brainstorming sessions), and iterative vs. comprehensive (shipping MVPs vs. polishing before release).

---

## Mind Cloning Methodology

### Source Types and Quality Weights

Not all source material contributes equally to a mind profile. The framework assigns quality weights to different source types:

| Source Type | Quality Weight | Best For |
|-------------|---------------|----------|
| Interviews (structured Q&A) | Very High | Both Voice and Thinking DNA |
| Decision logs (ADRs, rationale docs) | Very High | Thinking DNA |
| Written content (blog posts, articles) | High | Voice DNA |
| Transcriptions (meetings, talks) | High | Voice DNA, some Thinking DNA |
| Social media (LinkedIn, Twitter/X) | Medium | Voice DNA cultural markers |
| Chat logs (Slack, Teams) | Medium | Voice DNA informal register |

### Fidelity Scoring

Fidelity is measured across four weighted dimensions:

| Dimension | Weight | What It Measures |
|-----------|--------|-----------------|
| Voice Accuracy | 30% | How well the profile captures communication patterns |
| Thinking Accuracy | 30% | How well the profile captures decision-making patterns |
| Source Coverage | 20% | Breadth and depth of source material analyzed |
| Consistency | 20% | Internal consistency of the extracted profile |

The final fidelity score is a weighted sum, producing a value from 0 to 100. In YOLO mode, a score of 60-75 is expected and acceptable. In QUALITY mode, the target is 85-95. Scores below 40 trigger an automatic abort with recommendations for additional source material.

### YOLO vs. QUALITY Mode

| Characteristic | YOLO | QUALITY |
|---------------|------|---------|
| Minimum sources | 2 | 5 |
| Source diversity required | No | Yes (multiple types) |
| Conflict resolution | Automatic (highest confidence) | Interactive (user decides) |
| Multi-pass review | No | Yes |
| Smoke test scenarios | 3 (standard) | 3-5 (extended possible) |
| Expected fidelity | 60-75% | 85-95% |
| Use case | Prototyping, internal, low-stakes | Production, client-facing, critical |
| Typical duration | Minutes | Hours |

---

## Tier System

The tier system is a percentile-based classification for evaluated tools. After RICE and WSJF scoring, all candidate tools are ranked by their composite score, and tiers are assigned based on where each tool falls in the distribution.

### Composite Score Calculation

```
composite = (RICE_normalized * weight_RICE) + (WSJF_normalized * weight_WSJF)
```

The default weights are 50/50 (RICE * 0.5 + WSJF * 0.5), though the workflow definition in `wf-discover-tools.yaml` specifies weights of 0.4/0.3/0.2/0.1 for RICE/WSJF/Security/Social when including gate results.

### Tier Assignments

| Tier | Percentile Range | Composite Score (typical) | Characteristics |
|------|-----------------|--------------------------|-----------------|
| Tier 1 | Top 10% | > 80 | Battle-tested, widely adopted, both gates pass |
| Tier 2 | Top 25% | > 60 | Growing adoption, strong scores, both gates pass |
| Tier 3 | Top 50% | > 40 | Emerging tools, moderate scores, gates may be pending |
| Tier 4 | Bottom 50% | <= 40 | Niche use cases, low scores, gate concerns |

### Override Rules

- Any tool failing a gate is capped at Tier 3 maximum, regardless of score.
- Tools with the `[core]` flag and composite > 60 are automatically upgraded to Tier 1.
- Tools with the `[deprecated]` flag cannot be classified above Tier 3.

---

## Quality Gates

Quality gates are validation checkpoints applied to squads to ensure structural integrity, completeness, and documentation quality. They are measured by the `*quality-dashboard` command.

### Four Gate Categories

**1. Structure Validation (25% weight)**
Checks that all files declared in the `squad.yaml` manifest actually exist on disk. Missing files reduce the structure coverage score. Orphan files (present on disk but not declared in the manifest) are flagged as warnings. A perfect structure score means every declared component exists and no undeclared components are present.

**2. Schema Compliance (part of Structure, 25% weight)**
YAML files must pass schema validation. Markdown task files must contain required frontmatter fields: task, responsavel, Entrada, Saida, and Checklist. Agent definition files must include persona, commands, and dependencies sections. Naming conventions are enforced: kebab-case for IDs, semver for versions.

**3. Coverage Metrics (30% weight -- Task Coverage)**
Task coverage measures the completeness of each task definition file. Full marks require: complete frontmatter (task, responsavel, Entrada, Saida, Checklist all present), Implementation section with clear steps, Error Handling section, and Related section. The task coverage score is the average completeness across all declared tasks.

**4. Documentation Completeness (20% weight)**
Documentation coverage checks for squad-level documentation (description in squad.yaml, knowledge base, README or equivalent), agent-level documentation (purpose, capabilities, constraints in each agent file), and checklist quality (actionable items with clear criteria). Each item is scored and the average produces the documentation coverage metric.

### Overall Score Formula

```
overall = (structure * 0.25) + (task_coverage * 0.30) + (doc_coverage * 0.20) + (agent_health * 0.25)
```

Scores below 80% in any category trigger specific improvement suggestions prioritized by impact.

---

## RICE Framework

RICE is a product management prioritization framework adopted by squad-creator for tool evaluation. It provides a quantitative way to compare options that balances potential benefit against required investment.

### Formula

```
RICE = (Reach * Impact * Confidence) / Effort
```

### Factor Definitions

- **Reach** (1-10): The number of users, agents, or workflows that would benefit from this tool. A tool used by every squad in the organization scores 10. A tool for a single niche use case scores 1.
- **Impact** (1-10): The magnitude of benefit when adopted. A transformative capability scores 10. A marginal improvement scores 1.
- **Confidence** (0.0-1.0): Certainty in the Reach and Impact estimates. Measured data = 1.0. Strong evidence = 0.8. Educated guess = 0.5. Speculation = 0.2.
- **Effort** (1-10): Integration complexity measured in person-days equivalent. Drop-in, no config = 1. Major project with custom adapters = 10.

Raw RICE scores are normalized to a 0-100 scale for the tool registry.

---

## WSJF Framework

WSJF (Weighted Shortest Job First) comes from the Scaled Agile Framework (SAFe) and prioritizes items that deliver the most value in the least time, factoring in urgency.

### Formula

```
WSJF = Cost_of_Delay / Duration
```

Where:

```
Cost_of_Delay = User_Business_Value + Time_Criticality + Risk_Reduction
```

### Component Definitions

- **User/Business Value** (1-10): Direct value to end users or the business.
- **Time Criticality** (1-10): Urgency of adoption. 10 = competitive disadvantage if delayed.
- **Risk Reduction / Opportunity Enablement** (1-10): How much technical risk is reduced or future opportunity unlocked.
- **Duration** (1-10): Estimated integration time. 1 = hours. 10 = months.

---

## SC-PE-001 Format

SC-PE-001 is the standard SOP format used throughout squad-creator. The "SC" stands for Squad Creator, "PE" for Procedimento Estruturado (Structured Procedure), and "001" for the first version of the standard.

### The 11 Parts

1. **Titulo e Identificacao**: SOP title, unique ID (format: SC-PE-{DOMAIN}-{DATE}), version number, and responsible agent or person.
2. **Objetivo**: A single clear sentence stating the purpose and expected outcome of the procedure.
3. **Escopo**: Explicit boundaries defining what is included in this SOP and what is excluded.
4. **Definicoes**: Key terms, acronyms, and domain-specific vocabulary used in the procedure.
5. **Responsabilidades**: Roles and their responsibilities, typically in a RACI matrix format (Responsible, Accountable, Consulted, Informed).
6. **Pre-requisitos**: Tools, access, knowledge, or previously completed SOPs required before starting.
7. **Procedimento**: The step-by-step procedure. Each step is tagged with its cognitive taxonomy level and executor type.
8. **Pontos de Decisao**: Decision points within the procedure with IF/THEN/ELSE branching logic.
9. **Criterios de Qualidade**: Measurable criteria that define when the procedure is successfully completed.
10. **Excecoes e Tratamento de Erros**: Known failure modes, exception scenarios, and recovery actions.
11. **Referencias e Anexos**: Related documents, external references, and appendices.

---

## Cognitive Taxonomy (Bloom's)

The cognitive taxonomy used in SOP extraction is based on Bloom's Revised Taxonomy. Each procedure step is classified to determine its complexity and automation potential.

| Level | Description | Verb Examples | Automation Potential |
|-------|------------|--------------|---------------------|
| **Remember** | Recall facts and basic concepts | List, recall, identify, name | Very High -- AI handles easily |
| **Understand** | Explain ideas or concepts | Explain, summarize, classify, describe | High -- AI with good context |
| **Apply** | Use information in new situations | Execute, implement, use, demonstrate | High -- AI with templates/rules |
| **Analyze** | Draw connections among ideas | Compare, differentiate, examine, organize | Medium -- AI needs human context |
| **Evaluate** | Justify a stand or decision | Judge, assess, prioritize, recommend | Low -- requires human judgment |
| **Create** | Produce new or original work | Design, compose, invent, construct | Very Low -- requires human creativity |

### Implications for Executor Assignment

- Remember + Understand + Apply steps are typically assigned to **AI** executor
- Analyze steps are typically assigned to **Hybrid** executor (AI performs with human oversight)
- Evaluate + Create steps are typically assigned to **Human** executor

---

## PV_PM_001 Automation Analysis

PV_PM_001 is the automation analysis framework used by the sop-extractor agent (Scribe). Named after the process methodology convention, it systematically evaluates each step in a validated SOP to determine automation feasibility.

### Analysis Dimensions

For each SOP step, PV_PM_001 evaluates:

1. **Cognitive Level**: Steps at Remember/Understand/Apply have high automation potential
2. **Data Availability**: Steps requiring structured, available data are more automatable
3. **Decision Complexity**: Binary decisions are more automatable than nuanced judgment calls
4. **Risk Tolerance**: Steps where errors have low consequences are safer to automate
5. **Frequency**: High-frequency steps benefit more from automation investment
6. **Current Tool Support**: Steps with existing tool support are cheaper to automate

### Output

The analysis produces an automation roadmap classifying each step as:
- **Fully Automatable**: AI executor, no human oversight needed
- **Partially Automatable**: Hybrid executor, AI performs with human checkpoint
- **Manual Only**: Human executor, automation not recommended
- **Automation Candidate**: Currently manual but could be automated with investment

---

*squad-creator docs v2.6.0 -- Synkra AIOS*
