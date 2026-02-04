# Squad Creator Knowledge Base

> Comprehensive reference for squad-creator v2.6 methodologies, frameworks, and standards.
> Squad: squad-creator
> Version: 2.6.0

---

## 1. Mind Cloning Methodology

Mind cloning captures the cognitive and communicative essence of a subject into an AI-reproducible profile. The process decomposes identity into two complementary strands:

### Voice DNA

Voice DNA encodes **how** someone communicates. It includes:

- **Communication Patterns:** Sentence structure preferences, paragraph rhythm, use of lists vs prose, formality level, humor frequency.
- **Vocabulary:** Domain-specific jargon, preferred synonyms, word frequency signatures, filler words, trademark phrases.
- **Tone:** Assertive vs collaborative, optimistic vs cautious, direct vs diplomatic, energy level in written text.
- **Cultural Markers:** Regional idioms, bilingual code-switching patterns, cultural references, generational language cues.

### Thinking DNA

Thinking DNA encodes **what** drives decisions. It includes:

- **Decision Frameworks:** Which structured methods the subject defaults to (RICE, pros/cons, gut feel, data-driven).
- **Mental Models:** First-principles thinking, inversion, second-order effects, probabilistic reasoning.
- **Cognitive Biases:** Known tendencies (confirmation bias, anchoring, recency bias) and how the subject compensates.
- **Priorities:** What the subject optimizes for -- speed, quality, cost, learning, team morale, or customer impact.

### Fidelity Modes

| Mode | Fidelity | Sources Required | Use Case |
|------|----------|-----------------|----------|
| YOLO | 60-75% | 2-3 sources, minimal review | Quick prototyping, internal tools, low-stakes agents |
| QUALITY | 85-95% | 5+ sources, multi-pass review, interview | Production agents, client-facing personas, critical roles |

### Source Types

| Source Type | Description | Quality Weight |
|-------------|-------------|---------------|
| Written content | Blog posts, articles, documentation authored by subject | High |
| Transcriptions | Meeting recordings, podcast appearances, presentations | High |
| Decisions log | Historical decisions with rationale and outcomes | Very High |
| Social media | Twitter/X threads, LinkedIn posts, forum comments | Medium |
| Interviews | Structured Q&A sessions with the subject | Very High |

---

## 2. Tool Discovery Methodology

Tool discovery runs **5 parallel search channels** simultaneously to maximize coverage and speed:

| Channel | Target | Examples |
|---------|--------|----------|
| MCP Servers | Model Context Protocol integrations | Context7, Playwright MCP, Apify |
| APIs | REST/GraphQL services | EXA Search, OpenAI, Stripe |
| CLI Tools | Command-line utilities | gh, jq, ffmpeg, terraform |
| Libraries/Packages | npm, PyPI, crates.io packages | zod, pydantic, serde |
| GitHub Repos | Open-source projects and tools | langchain, autogen, crew-ai |

Each discovered tool passes through a structured evaluation pipeline (see Tool Evaluation Framework) before being added to the tool registry.

---

## 3. SOP Extraction (SC-PE-001 Format)

Every Standard Operating Procedure follows the SC-PE-001 format comprising 11 mandatory parts:

1. **Title** -- Clear, action-oriented name (e.g., "Deploy Production Release")
2. **Objective** -- Single sentence stating the purpose and expected outcome
3. **Scope** -- Boundaries: what is included, what is excluded
4. **Prerequisites** -- Required tools, access, knowledge, or completed prior SOPs
5. **Procedure Steps** -- Numbered, atomic steps with expected duration per step
6. **Decision Points** -- Branch logic (IF/THEN/ELSE) within the procedure
7. **Error Handling** -- Known failure modes and recovery actions
8. **Outputs** -- Artifacts produced (files, reports, state changes)
9. **Quality Checks** -- Verification steps to confirm correctness
10. **Handoffs** -- Who/what receives the outputs and what they do next
11. **Revision History** -- Version, date, author, and change summary

### Cognitive Taxonomy (Bloom's)

Each procedure step is classified by cognitive complexity:

| Level | Verb Examples | Automation Potential |
|-------|--------------|---------------------|
| Remember | List, recall, identify | Very High |
| Understand | Explain, summarize, classify | High |
| Apply | Execute, implement, use | High |
| Analyze | Compare, differentiate, examine | Medium |
| Evaluate | Judge, assess, prioritize | Low |
| Create | Design, compose, invent | Very Low |

### Executor Types

| Type | Description | Criteria |
|------|-------------|----------|
| Human | Requires human judgment, creativity, or authority | Evaluate/Create level tasks, approval gates |
| AI | Fully automatable by AI agent | Remember/Understand/Apply level, deterministic |
| Hybrid | AI performs with human oversight or approval | Analyze level, high-stakes Apply tasks |

---

## 4. Decision Frameworks

### RICE Scoring

**Formula:** `RICE = (Reach * Impact * Confidence) / Effort`

- **Reach** (1-10): How many users/processes benefit
- **Impact** (1-10): How significant the benefit is
- **Confidence** (0.0-1.0): How certain we are of estimates
- **Effort** (1-10): Person-weeks or complexity units

### WSJF (Weighted Shortest Job First)

**Formula:** `WSJF = Cost_of_Delay / Duration`

Cost of Delay = User/Business Value + Time Criticality + Risk Reduction/Opportunity Enablement

### Decision Matrix

| Quadrant | Criteria | Action |
|----------|----------|--------|
| DO NOW | Score > 80, both gates pass | Implement immediately |
| DO NEXT | Score > 60, gates pass | Queue for next sprint |
| DO LATER | Score > 40, one gate pending | Backlog with review date |
| DON'T DO | Score < 40 or any gate fails | Document rationale, archive |

---

## 5. Quality Gates

### Structure Validation
- All required directories exist per squad manifest
- All referenced files are present and parseable
- No orphan files (files not referenced by any component)

### Schema Compliance
- YAML files pass schema validation
- Markdown files follow required template structure
- Naming conventions enforced (kebab-case IDs, semver versions)

### Coverage Metrics
- Agent coverage: every workflow step has an assigned agent
- Task coverage: every acceptance criterion maps to a task
- Test coverage: every task has at least one validation check

### Documentation Completeness
- README exists with minimum 200 words
- All commands documented with usage examples
- Architecture diagrams present for complex workflows

### Dependency Resolution
- All inter-squad dependencies declared and available
- Version compatibility verified against aios.minVersion
- No circular dependencies in the dependency graph

---

*Squad Creator Knowledge Base v2.6.0 -- Synkra AIOS*
