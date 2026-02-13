---
name: icp-clone
description: |
  Cognitive persona cloning system based on SYNAPSE v6.0 + Decision Intelligence.
  Creates deep psychological clones of ICPs (Ideal Customer Profiles) with 16-dimension
  extraction, humanization, and validation. Use when user wants to clone a persona,
  create an ICP, build a customer avatar, or generate a cognitive twin.
auto_invoke: false
triggers:
  keywords:
    - "clonar persona"
    - "clone persona"
    - "criar ICP"
    - "create ICP"
    - "avatar do cliente"
    - "customer avatar"
    - "perfil ideal"
    - "ideal profile"
    - "clone cognitivo"
    - "cognitive clone"
    - "mind clone"
    - "clonagem"
  patterns:
    - "(?i)clon.*persona"
    - "(?i)create.*icp"
    - "(?i)build.*avatar"
    - "(?i)perfil.*cliente.*ideal"
agents_allowed:
  - analyst
  - research-lead
  - copywriting-lead
  - aios-master
priority: high
confirm_before_invoke: true
---

# ICP Clone - Cognitive Persona Cloning System

## Overview

Sistema de clonagem cognitiva profunda baseado no Framework SYNAPSE v6.0 + Decision Intelligence. Transforma dados basicos de um ICP em uma persona completa e humanizada com profundidade psicologica, contradicoes humanas e autenticidade linguistica.

**Framework:** SYNAPSE v6.0 + Decision Intelligence (Cassie Kozyrkov)
**Resultado:** System Prompt (1000+ linhas) + 17 Knowledge Base documents
**Tempo total:** 14-18 horas (6 fases)
**Custo estimado:** EUR 30-40 por clone (tokens Opus)

## Storage

All clone outputs are stored in:
```
.aios/personas/{persona-name}/
  ├── 01_briefing/           # Input data
  ├── 02_extracao/           # 16 extraction outputs (P0-P14)
  ├── 03_synapse/            # SYNAPSE consolidation
  │   ├── consolidacao/      # 4 consolidated profiles
  │   └── framework/         # TSM, APR, MCC, PSH
  ├── 04_humanizacao/        # 6 humanization modules
  ├── 05_clone_final/        # Final outputs
  │   ├── SYSTEM_PROMPT.txt  # The clone brain
  │   └── knowledge_base/    # 17 KB documents
  └── 06_validacao/          # Quality validation
```

## CRITICAL RULES

1. **NEVER skip phases** - each builds on the previous
2. **NEVER rush extraction** - quality of input = quality of clone
3. **ALWAYS validate** - minimum 95/100 on quality checklist
4. **Save ALL outputs** - every phase output is needed later
5. **User confirmation required** - before starting each phase (cost-aware)

## Workflow - 6 Phases

### Phase 1: BRIEFING (30 min)

**Goal:** Collect comprehensive data about the target persona.

1. Ask user for target persona details using this template:

**Required data (minimum):**
- Name/Label for the persona
- Age or age range
- Gender
- Profession/occupation
- Location (city/state)
- Income range
- Main pains/frustrations (3-5)
- Main desires/goals (3-5)
- Communication style (formal/informal, keywords, emojis)
- Example phrases they would say (5-10)
- Purchase behavior (impulsive/researched, main triggers, barriers)

**Recommended data:**
- Marital status, children
- Education level
- Personality traits (3-5 words)
- Values (top 5-7)
- Digital habits (social media, content consumption)
- Emotional state
- Life events that shaped them

2. Create briefing file at `.aios/personas/{name}/01_briefing/briefing.md`
3. Run pre-validation checklist (minimum 11/11 required fields)
4. Confirm with user before proceeding

### Phase 2: DEEP EXTRACTION (6.5-7.5 hours)

**Goal:** Extract 16 psychological dimensions using structured prompts.

Execute the 16 extraction prompts IN ORDER. Each prompt produces a rich output document.

**Framework templates location:** `squads/deep-research/templates/icp-clone/`

| Block | Prompts | Duration | Focus |
|-------|---------|----------|-------|
| Block 1: Foundation | P0, P0B, P1 | 1-1.5h | Demographics, finances, Big Five |
| Block 2: Expression | P2, P3, P4 | 1.5-2h | Language, values, tribes |
| Block 3: Behavior | P5, P6, P7 | 1.5-2h | Triggers, digital habits, buying |
| Block 4: Depth | P8, P9 | 1h | Narratives, expectations |
| Block 5: Decision Intelligence | P10-P14 | 2-2.5h | Decision context, action triggers, objections, heuristics, learning |

**Extraction prompts:**

| # | Prompt | Output |
|---|--------|--------|
| P0 | Demographics & Socioeconomic Context | Population similar, disposable income |
| P0B | Financial Reality & Debt | Real affordability, purchase timing |
| P1 | Psychometrics (Big Five + 30 Facets) | Full personality DNA (CRITICAL) |
| P2 | Linguistic Signature | 100+ authentic phrases |
| P3 | Values & Trade-offs | 5-7 hierarchized values |
| P4 | Community & Tribes | Social groups, influencers |
| P5 | Neuropsychological Triggers | 8 TSM chains, stress patterns |
| P6 | Digital Habits | 5-stage digital journey |
| P7 | Buying Behavior (5-Gate Model) | Decision criteria, triggers vs barriers |
| P8 | Narratives & Archetypes | Top 3 archetypes, hero journey |
| P9 | Expectations & Success | 3-layer expectations, WOW moments |
| P10 | Decision Context Mapping | 30+ decisions, decision budget (DI) |
| P11 | Action Triggers | Procrastination anatomy, trigger combos (DI) |
| P12 | Objection & Friction Map | Objection hierarchy, friction chains (DI) |
| P13 | Decision Heuristics | System 1/2, IF-THEN rules, biases (DI) |
| P14 | Outcome Learning | Attribution patterns, confidence calibration (DI) |

**For each prompt:**
1. Load the prompt template from the framework
2. Inject briefing data + previous outputs as context
3. Execute and save output to `.aios/personas/{name}/02_extracao/P{N}_output.md`
4. Validate output has sufficient depth before proceeding

**Recommended execution strategy:**
- Session 1 (4h): P0-P9 (base extraction)
- Session 2 (2.5h): P10-P14 (Decision Intelligence)

### Phase 3: SYNAPSE PROCESSING (2-3 hours)

**Goal:** Integrate all extractions into a unified psychological model.

**3.1 Consolidation (1h)**
Execute 4 consolidation prompts:
1. `integrar_p0_p3.md` -> Psychological base (P0 + P0B + P1 + P2 + P3)
2. `integrar_p4_p6.md` -> Social context (P4 + P5 + P6)
3. `integrar_p7_p9.md` -> Decision & expectations (P7 + P8 + P9)
4. `integrar_p10_p14_di.md` -> Decision Intelligence (P10-P14)

Save to `.aios/personas/{name}/03_synapse/consolidacao/`

**3.2 Framework Generation (1h)**
1. `gerar_tsm_triplets.md` -> 8 Trigger-State-Manifestation chains
2. `gerar_apr_mcc.md` -> Adaptive Plasticity Rules + Mental Calculation Costs

Save to `.aios/personas/{name}/03_synapse/framework/`

**3.3 PSH Shell (30-45 min)**
1. `criar_psh_completo.md` -> Master integration of ALL modules

Save as `.aios/personas/{name}/03_synapse/framework/PSH_SHELL_MASTER.md`

### Phase 4: ADVANCED HUMANIZATION (2-3 hours)

**Goal:** Transform data into a REAL person with depth, contradictions, and authentic memories.

Execute 6 humanization modules:

| Module | Output | Why it matters |
|--------|--------|----------------|
| `blind_spots.md` | 8 cognitive blind spots | Creates authenticity |
| `paradoxos_produtivos.md` | 6 unresolved contradictions | Makes human |
| `fingerprints_unicos.md` | 7 unique behavioral signatures | Distinctiveness |
| `memorias_episodicas.md` | 10+ formative memories with emotional charge | Emotional depth |
| `sistema_imunologico.md` | 3 levels of automatic rejection | Realistic limits |
| `meta_axiomas.md` | 9 pre-conscious axioms | Internal logic |

Save to `.aios/personas/{name}/04_humanizacao/`

### Phase 5: FINAL GENERATION (2-3 hours)

**Goal:** Generate the clone's brain (System Prompt) and memory (Knowledge Base).

**5.1 System Prompt (1h)**
- Use `generator.md` with ALL processed data
- Generate 1000+ line System Prompt with 8 sections:
  1. Identity & Context (150 lines)
  2. Financial Reality (detailed)
  3. Personality & Behavior
  4. Values & Decision Framework
  5. Communication Style
  6. Emotional Architecture
  7. Humanization (blind spots, paradoxes, memories)
  8. Decision Intelligence (triggers, objections, heuristics)

Save as `.aios/personas/{name}/05_clone_final/SYSTEM_PROMPT.txt`

**5.2 Knowledge Base (1.5-2.5h)**
Generate 17 specialized documents:

| # | Document | Content |
|---|----------|---------|
| KB01 | Complete Biography | Life timeline |
| KB02 | Language Swipe File | 100+ authentic phrases |
| KB03 | Thinking Frameworks | Mental models |
| KB04 | Episodic Memories | Formative experiences |
| KB05 | Meta-Axioms | Pre-conscious rules |
| KB06 | Productive Paradoxes | Unresolved contradictions |
| KB07 | Unique Fingerprints | Behavioral signatures |
| KB08 | Blind Spots | Cognitive blind spots |
| KB09 | Immune System | Rejection patterns |
| KB10 | Values & Trade-offs | Value hierarchy |
| KB11 | Financial Reality | Affordability model |
| KB12 | Synthetic Timeline | Life events |
| KB13 | Decision Context Library | Contextual decision patterns (DI) |
| KB14 | Action Trigger Playbook | What moves to action (DI) |
| KB15 | Objection Handling Matrix | Objection hierarchy (DI) |
| KB16 | Decision Heuristics Codex | IF-THEN rules, biases (DI) |
| KB17 | Outcome Learning Patterns | How they learn from results (DI) |

Save to `.aios/personas/{name}/05_clone_final/knowledge_base/`

### Phase 6: QUALITY VALIDATION (1-2 hours)

**Goal:** Ensure clone meets 95/100 quality standard.

**6.1 100-Point Checklist**
- Section 1: Psychological Foundation (20 pts)
- Section 2: Linguistic Authenticity (15 pts)
- Section 3: Deep Humanization (25 pts)
- Section 4: SYNAPSE Framework (15 pts)
- Section 5: Clone Output Quality (15 pts)
- Section 6: Decision Intelligence (10 pts)

**Minimum: 95/100 to approve**

**6.2 Conversational Tests (30 questions)**
- Load System Prompt + KB documents
- Execute 30 test questions covering:
  - Identity consistency
  - Financial realism
  - Value-based decisions
  - Emotional reactions
  - Linguistic authenticity
  - Decision-making behavior

**Minimum: 25/30 correct responses**

**6.3 If score < 95:**
1. Identify weak sections
2. Re-execute relevant extraction/humanization prompts
3. Regenerate affected KB documents
4. Re-validate

## Using a Completed Clone

### In Claude (Projects)
1. Create new Claude Project
2. Paste `SYSTEM_PROMPT.txt` as Custom Instructions
3. Upload 17 KB documents as Project Knowledge
4. Start conversing with the clone

### In ChatGPT (Custom GPT)
1. Create new GPT
2. Paste System Prompt in Instructions
3. Upload KB documents in Knowledge
4. Configure and use

### In AIOS Lab (Agent)
1. Use `squad-creator` to create an agent from the clone
2. System prompt becomes the agent definition
3. KB documents become agent context
4. Clone is now an AIOS agent

## Cost Estimation

| Phase | Tokens (est.) | Cost (Opus) |
|-------|---------------|-------------|
| Phase 2: Extraction (16 prompts) | ~300k in + 400k out | ~EUR 15-20 |
| Phase 3: SYNAPSE (7 prompts) | ~100k in + 150k out | ~EUR 5-7 |
| Phase 4: Humanization (6 prompts) | ~80k in + 120k out | ~EUR 3-5 |
| Phase 5: Generation (2 prompts) | ~150k in + 200k out | ~EUR 5-8 |
| Phase 6: Validation | ~50k in + 30k out | ~EUR 2-3 |
| **Total** | **~680k in + 900k out** | **~EUR 30-40** |

**Cost optimization:** Route extraction prompts (Phase 2) to Sonnet for ~60% savings.

## Quick Commands

```
/icp-clone start <name>          # Start new clone from scratch
/icp-clone resume <name>         # Resume interrupted clone
/icp-clone status <name>         # Check clone progress
/icp-clone validate <name>       # Run validation on completed clone
/icp-clone list                  # List all personas
```

## Integration with Existing Squads

| Phase | Primary Squad | Supporting |
|-------|--------------|------------|
| Phase 1 (Briefing) | deep-research | analyst |
| Phase 2 (Extraction) | deep-research | analyst, copywriting |
| Phase 3 (SYNAPSE) | deep-research | analyst |
| Phase 4 (Humanization) | copywriting-masters | deep-research |
| Phase 5 (Generation) | copywriting-masters | deep-research |
| Phase 6 (Validation) | qa | analyst |

## Framework Templates

The complete extraction and processing templates are stored at:
`squads/deep-research/templates/icp-clone/`

This includes all 16 extraction prompts (P0-P14), consolidation prompts, humanization modules, generators, and validation checklists from the Framework Clonagem ICP v6.0.
