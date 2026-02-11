---

## Execution Modes

**Choose your execution mode:**

### 1. YOLO Mode - Fast, Autonomous (0-1 prompts)
- Benson executa o 3X VSL Formula completo sem pausa
- Aplica RMBC Research de Georgi automaticamente
- **Best for:** Quando produto, audiencia e problema ja estao claros

### 2. Interactive Mode - Balanced, Educational (5-10 prompts) **[DEFAULT]**
- Checkpoints em pesquisa, cada Step do VSL, e review
- Explica principios de NLP e persuasao aplicados
- **Best for:** Primeiro VSL, entender a estrutura de video selling

### 3. Pre-Flight Planning - Comprehensive Upfront Planning
- RMBC Research completo antes de qualquer escrita
- Competitive analysis e mechanism identification
- **Best for:** VSLs de 20+ minutos, high-ticket offers, mercados saturados

**Parameter:** `mode` (optional, default: `interactive`)

---

## Task Definition (AIOS Task Format V1.0)

```yaml
task: Write VSL Script
responsavel: "@jon-benson"
responsavel_type: agent
atomic_layer: task
elicit: true

Entrada:
  - campo: product_name
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: Must be non-empty product or service name

  - campo: duration_target
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: "1-min | 5-min | 20-min | custom"

  - campo: target_audience
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: Description of ideal viewer with demographics and psychographics

  - campo: main_problem
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: The core problem the product solves

  - campo: unique_mechanism
    tipo: string
    origem: Elicitation
    obrigatorio: false
    validacao: What makes the solution work (the "why behind the why")

  - campo: price_point
    tipo: string
    origem: User Input
    obrigatorio: false

  - campo: proof_assets
    tipo: string
    origem: User Input
    obrigatorio: false
    validacao: Available testimonials, before/after, data, studies

  - campo: competitor_landscape
    tipo: string
    origem: User Input
    obrigatorio: false

Saida:
  - campo: vsl_script
    tipo: string
    destino: User display / file
    persistido: true

  - campo: slide_count
    tipo: number
    destino: Metadata
    persistido: true

  - campo: slide_breakdown
    tipo: object
    destino: Reference / production guide
    persistido: true

  - campo: estimated_duration
    tipo: string
    destino: Metadata
    persistido: false

  - campo: word_count
    tipo: number
    destino: Metadata
    persistido: false
```

---

## Pre-Conditions

```yaml
pre-conditions:
  - [ ] Product/service clearly identified
    tipo: pre-condition
    blocker: true
    error_message: "Cannot write VSL without knowing what is being sold."
  - [ ] Duration target selected
    tipo: pre-condition
    blocker: true
    error_message: "Need target duration to calibrate script length and density."
  - [ ] Target audience defined
    tipo: pre-condition
    blocker: true
    error_message: "VSL must speak to a specific viewer - need audience profile."
  - [ ] Main problem articulated
    tipo: pre-condition
    blocker: true
    error_message: "VSL is problem-first - need the core problem to build the script around."
```

---

## Post-Conditions

```yaml
post-conditions:
  - [ ] VSL script contains all 4 Steps of Benson 3X Formula
    tipo: post-condition
    blocker: true
    error_message: "Script incomplete - must include Snap Suggestion, Big Problem, Bigger Solution, Grand Offer."
  - [ ] Slide count matches duration target (approx 1 slide per 10-15 seconds)
    tipo: post-condition
    blocker: true
    error_message: "Slide count does not match target duration."
  - [ ] Each slide has text content and speaker notes
    tipo: post-condition
    blocker: true
    error_message: "All slides must have both display text and narration notes."
  - [ ] Unique mechanism identified and integrated into script
    tipo: post-condition
    blocker: true
    error_message: "VSL lacks unique mechanism - this is the persuasion engine."
  - [ ] Cialdini audit passed with minimum 5 of 7 principles applied
    tipo: post-condition
    blocker: false
    error_message: "Persuasion audit should show at least 5 of 7 Cialdini principles."
```

---

## Acceptance Criteria

```yaml
acceptance-criteria:
  - [ ] First 3 slides hook and retain attention (Snap Suggestion)
    tipo: acceptance-criterion
    blocker: true
  - [ ] Problem section creates genuine emotional discomfort
    tipo: acceptance-criterion
    blocker: true
  - [ ] Solution feels like a discovery, not a pitch
    tipo: acceptance-criterion
    blocker: true
  - [ ] Offer section has clear value stack with pricing contrast
    tipo: acceptance-criterion
    blocker: true
  - [ ] Multiple CTAs placed at strategic points
    tipo: acceptance-criterion
    blocker: true
  - [ ] Script reads naturally when spoken aloud
    tipo: acceptance-criterion
    blocker: true
```

---

## Checklist

- [ ] Definir duracao-alvo e calcular slide count
- [ ] Pesquisa com RMBC Research (Georgi) - triggers, pain points, linguagem
- [ ] Identificar mecanismo unico com RMBC Mechanism (Georgi)
- [ ] Construir outline com RMBC Brief (Georgi)
- [ ] Step 1: Snap Suggestion (4 sub-parts) - hook NLP
- [ ] Step 2: The Big Problem (8 sub-parts) - agitacao e credibilidade
- [ ] Step 3: The Bigger Solution (8 sub-parts) - esperanca e prova
- [ ] Step 4: The Grand Offer (15 sub-parts) - oferta e multiplos CTAs
- [ ] Mapear slides por step com timing
- [ ] Review com Cialdini 7 Principles Persuasion Audit
- [ ] Read-aloud test para naturalidade do script

---

# Write VSL Script

## Purpose

Escrever um script completo de VSL (Video Sales Letter) usando o 3X VSL Formula de Jon Benson como framework principal (4 Steps: Snap Suggestion, Big Problem, Bigger Solution, Grand Offer), com pesquisa via RMBC de Stefan Georgi (Research, Mechanism, Brief, Copy), identificacao de mecanismo unico, slides mapeados por timing, e auditoria final de persuasao usando os 7 principios de Cialdini.

## Prerequisites

- Produto/servico definido com proposta de valor clara
- Duracao-alvo do video selecionada
- Publico-alvo com dores, desejos e linguagem mapeados
- Problema principal claramente articulado
- Idealmente: proof elements disponiveis (testimonials, dados, before/after)

## Duration-to-Slide Mapping

```
REFERENCE: Slide Calculation

Rule of thumb: 1 slide = 10-15 seconds of narration
               1 slide = 20-40 words of text displayed
               1 slide = 50-100 words of speaker notes

| Duration | Total Slides | Step 1 | Step 2  | Step 3  | Step 4  |
|----------|-------------|--------|---------|---------|---------|
| 1-min    | 4-6         | 1      | 1-2     | 1-2     | 1       |
| 5-min    | 20-30       | 2-3    | 6-8     | 5-7     | 7-12    |
| 20-min   | 80-120      | 5-8    | 20-35   | 15-25   | 20-30   |
| 45-min   | 180-270     | 10-15  | 50-75   | 40-60   | 50-80   |

DISTRIBUTION RATIO:
  Step 1 (Snap Suggestion): ~5-7% of total slides
  Step 2 (Big Problem):     ~30-35% of total slides
  Step 3 (Bigger Solution): ~25-30% of total slides
  Step 4 (Grand Offer):     ~30-35% of total slides
```

## Interactive Elicitation Process

### Step 1: Research - RMBC Research (Georgi)

```
ELICIT: Deep Research Phase

Stefan Georgi RMBC Research Framework:

1. PAIN POINTS (list the top 5):
   - What keeps the prospect up at night?
   - What have they tried that failed?
   - What do they complain about most?

2. DESIRE POINTS (list the top 5):
   - What is their ideal outcome?
   - What would their life look like if solved?
   - What status/identity do they aspire to?

3. LANGUAGE MINING:
   - Exact words and phrases the prospect uses
   - Forums, reviews, social media comments
   - "I just wish..." / "I am so tired of..." / "If only..."

4. TRIGGER EVENTS:
   - What makes them search for a solution NOW?
   - What event escalates the problem?
   - What is the tipping point?

5. COMPETITIVE LANDSCAPE:
   - What alternatives exist?
   - Why have alternatives failed them?
   - What gap does your product fill?

OUTPUT: Research document feeding all 4 Steps
```

### Step 2: Mechanism - RMBC Mechanism (Georgi)

```
PROCESS: Identify Unique Mechanism

The mechanism is the "engine" that makes the solution work.
It is the ANSWER to "Why does this work when everything else failed?"

FRAMEWORK:
1. What is the MECHANISM that drives the result?
   - Name it (create a proprietary name if needed)
   - Ex: "The 3X Formula", "The Enzyme Switch", "The 80/20 Protocol"

2. Why is it DIFFERENT from everything else?
   - What does it do that alternatives do not?
   - What is the unique insight or approach?

3. Why is it BELIEVABLE?
   - What science, data, or logic supports it?
   - Who has validated it?

4. Why is it SIMPLE to understand?
   - Can you explain it in one sentence?
   - Use analogy: "It is like [familiar concept] but for [their problem]"

OUTPUT: Named mechanism with 1-sentence explanation + supporting logic
```

### Step 3: Brief - RMBC Brief (Georgi)

```
PROCESS: Build Script Outline

Fill-in-the-blanks brief:

TARGET: [audience] who struggle with [problem]
HOOK: What if you could [desired outcome] without [main objection]?
MECHANISM: The [mechanism name] works by [simple explanation]
PROOF: [Type of proof] showing [specific result]
OFFER: [Product name] gives you [benefit 1], [benefit 2], [benefit 3]
PRICE: Worth [anchor price], yours for [actual price]
GUARANTEE: [Duration] [type] guarantee
URGENCY: [Reason for acting now]

This brief becomes the skeleton for the 4 Steps.
```

### Step 4: Step 1 - Snap Suggestion (Benson)

```
PROCESS: Write Snap Suggestion (~5-7% of slides)

The Snap Suggestion is the HOOK - first 15-30 seconds that determine if they watch.

4 SUB-PARTS:

1. PRESUPPOSITIONAL ANCHOR:
   - Start with an assumption that frames their reality
   - "You already know that [common frustration]..."
   - "If you are like most [audience], you have tried..."
   - Sets the mental stage before the pitch

2. NLP INCLUSION PATTERN:
   - Language that makes them feel included
   - "Whether you are [type A] or [type B]..."
   - "No matter if you [scenario 1] or [scenario 2]..."
   - Makes them think: "This is for me"

3. CURIOSITY HOOK:
   - The promise that keeps them watching
   - "In the next [X] minutes, I am going to show you..."
   - "What you are about to discover..."
   - Be specific about the benefit, vague about the method

4. OPEN LOOP:
   - Create unresolved tension
   - "And at the end, I will reveal the one thing that..."
   - "But first, there is something you need to understand..."
   - Makes it psychologically painful to click away

SLIDE FORMAT:
  Slide N:
    [TEXT ON SCREEN] - Large, bold, 1-2 sentences max
    [NARRATION] - What the voiceover says (fuller version)
    [TIMING] - Estimated seconds for this slide
```

### Step 5: Step 2 - The Big Problem (Benson)

```
PROCESS: Write The Big Problem (~30-35% of slides)

This is where you make the viewer FEEL the problem deeply.

8 SUB-PARTS:

1. QUICK-HIT PROBLEM STATEMENT:
   - State the problem directly in 1-2 slides
   - "The truth is, [problem] is ruining your [area of life]"

2. FIVE-PART CASE (Problem Amplification):
   a. "It is not your fault..." (remove blame)
   b. "Here is what is really going on..." (reveal hidden cause)
   c. "And it is getting worse..." (escalation)
   d. "The so-called solutions do not work because..." (discredit alternatives)
   e. "Unless you fix this, here is what happens..." (consequences)

3. EMOTIONAL CONSEQUENCES:
   - Paint the picture of continued suffering
   - Use sensory language (see, feel, hear)
   - "Imagine six months from now, still dealing with..."

4. FINANCIAL CONSEQUENCES:
   - Quantify the cost of inaction
   - "This is costing you $[amount] every [time period]"

5. SOCIAL CONSEQUENCES:
   - How the problem affects relationships/status
   - "While others [success], you are still [struggling]"

6. CREDIBILITY ESTABLISHMENT:
   - Why should they listen to YOU?
   - Quick credentials, story of transformation
   - "I discovered this after [relatable struggle]"

7. ENEMY IDENTIFICATION:
   - Give the problem a villain (industry, misinformation, etc.)
   - "The [industry] does not want you to know this..."
   - Creates us-vs-them bond

8. TRANSITION TO SOLUTION:
   - "But what if there was another way?"
   - Bridge from despair to hope
   - This is the emotional low point -> pivot up
```

### Step 6: Step 3 - The Bigger Solution (Benson)

```
PROCESS: Write The Bigger Solution (~25-30% of slides)

This is the HOPE section. Viewer goes from pain to possibility.

8 SUB-PARTS:

1. GOOD NEWS HOOK:
   - "Here is the good news..."
   - Tonal shift from dark to light
   - Relief after the emotional pressure of Step 2

2. MECHANISM REVEAL:
   - Introduce the [Mechanism Name]
   - Explain HOW it works (simple, visual, analogy)
   - "It works because [simple logic]..."

3. FORMULA/METHOD INTRODUCTION:
   - Name the process/framework
   - "The [3/5/7]-Step [Name] Method"
   - Overview of steps (do not give away too much)

4. SOCIAL PROOF - TESTIMONIALS:
   - 2-3 customer stories/results
   - Specific numbers and transformations
   - "Sarah went from [before] to [after] in [timeframe]"

5. SOCIAL PROOF - DATA:
   - Statistics, studies, expert validation
   - "[N] people have already used this..."
   - Third-party credibility

6. OBJECTION HANDLING:
   - Address top 3 objections preemptively
   - "You might be thinking [objection]... but [reframe]"
   - Each objection gets 1-2 slides

7. LOOP CLOSURE:
   - Close the open loop from Step 1
   - "Remember when I said I would reveal [X]? Here it is..."
   - Reward for watching this far

8. TRANSITION TO OFFER:
   - "So the question is... how do you get started?"
   - "I put everything into one place for you..."
   - Natural bridge to the commercial portion
```

### Step 7: Step 4 - The Grand Offer (Benson)

```
PROCESS: Write The Grand Offer (~30-35% of slides)

This is the CLOSE. Longest section because it must overcome all remaining resistance.

15 SUB-PARTS:

1. PRODUCT INTRODUCTION:
   - "Introducing [Product Name]..."
   - Positioned as the VEHICLE for the mechanism

2. WHAT IS INCLUDED (Core):
   - List main components/modules/features
   - Frame as benefits, not features

3. BENEFIT STACKING:
   - Deep dive into top 3 benefits
   - Each benefit = 2-3 slides with proof

4. BONUS 1: (Value Add)
   - Name, description, value
   - "And because I want to make this a no-brainer..."

5. BONUS 2: (Value Add)
   - Name, description, value

6. BONUS 3: (Value Add)
   - Name, description, value

7. VALUE STACK RECAP:
   - Total everything up
   - "Total value: $[X,XXX]"

8. PRICE ANCHOR:
   - "If you were to get all of this separately, it would cost $[high]"
   - "Some of my private clients pay $[very high] for this"

9. PRICE REVEAL:
   - "But you are not going to pay anywhere near that..."
   - Build suspense before revealing
   - "Your investment today is just $[price]"

10. PRICE JUSTIFICATION:
    - "That is less than [daily cost comparison]"
    - "Consider what [problem] is already costing you"

11. GUARANTEE:
    - Bold, specific, risk-free
    - "[30/60/90]-day [type] guarantee"
    - "If you do not [specific result], I will [specific action]"

12. CTA #1 (Primary):
    - "Click the button below right now"
    - Specific, clear, immediate

13. URGENCY/SCARCITY:
    - Deadline, limited spots, price increase
    - Must be real and justified
    - "I can only keep this at this price until [reason]"

14. FINAL OBJECTION CRUSH:
    - "Still on the fence? Consider this..."
    - Address the last remaining doubt
    - Future pacing: "Imagine [X days/weeks] from now..."

15. CTA #2 (Final):
    - Restate the offer in 1-2 sentences
    - Final CTA with urgency
    - "Do not wait. Click below and start your [transformation] today."
```

### Step 8: Slide Mapping

```
PROCESS: Map Content to Slides with Timing

OUTPUT FORMAT per slide:

---
SLIDE {N} | Step {1-4} | Sub-part: {name}
[TIMING: {X} seconds]

[ON SCREEN TEXT]
{Large, bold text the viewer sees - max 2 sentences}

[NARRATION / SPEAKER NOTES]
{Full voiceover script for this slide - conversational, spoken tone}

[VISUAL NOTE]
{Optional: background color, image suggestion, animation direction}
---

TIMING CALIBRATION:
  - Text-heavy slides: 12-15 seconds
  - Emotional/pause slides: 8-10 seconds
  - CTA slides: 15-20 seconds (give time to act)
  - Transition slides: 5-8 seconds

TOTAL TIMING CHECK:
  Sum all slide timings = should match duration_target (+/- 10%)
```

### Step 9: Persuasion Audit - Cialdini 7 Principles

```
PROCESS: Final Persuasion Review

CIALDINI 7 PRINCIPLES AUDIT:

1. RECIPROCITY: [YES/NO]
   Where? {Slide numbers}
   How? Did we give value before asking? (education, insights, free tips)

2. COMMITMENT & CONSISTENCY: [YES/NO]
   Where? {Slide numbers}
   How? Did we get micro-yeses? (NLP inclusions, "If you agree...")

3. SOCIAL PROOF: [YES/NO]
   Where? {Slide numbers}
   How? Testimonials, numbers, case studies, "others like you"

4. AUTHORITY: [YES/NO]
   Where? {Slide numbers}
   How? Credentials, expert citations, data, media mentions

5. LIKING: [YES/NO]
   Where? {Slide numbers}
   How? Relatability, shared struggle, humor, vulnerability

6. SCARCITY: [YES/NO]
   Where? {Slide numbers}
   How? Limited time, limited spots, price increase, bonus expiry

7. UNITY: [YES/NO]
   Where? {Slide numbers}
   How? Shared identity, "people like us", tribe/community

SCORE: {N}/7 principles applied
TARGET: Minimum 5/7 for effective VSL

FAIL on < 5/7 -> Identify missing principles and integrate into script
```

---

## Output Format

```markdown
# VSL SCRIPT: {product_name}
## Duration: {target} | Slides: {count} | Mechanism: {mechanism_name}

---

## Script Overview

| Step | Name | Slides | Duration | % of Total |
|------|------|--------|----------|------------|
| 1    | Snap Suggestion   | {N}  | {time} | {%} |
| 2    | The Big Problem   | {N}  | {time} | {%} |
| 3    | The Bigger Solution | {N} | {time} | {%} |
| 4    | The Grand Offer   | {N}  | {time} | {%} |
| **Total** | | **{N}** | **{time}** | **100%** |

## Research Summary (RMBC)
- Pain Points: {top 3}
- Desire Points: {top 3}
- Mechanism: {name} - {1-sentence explanation}
- Key Language: {phrases from audience}

---

## STEP 1: SNAP SUGGESTION

### Slide 1
[ON SCREEN] {text}
[NARRATION] {voiceover}
[TIMING] {seconds}

[Continue for all slides...]

---

## STEP 2: THE BIG PROBLEM

[All slides...]

---

## STEP 3: THE BIGGER SOLUTION

[All slides...]

---

## STEP 4: THE GRAND OFFER

[All slides...]

---

## Persuasion Audit
| Principle | Applied | Where |
|-----------|---------|-------|
| Reciprocity | {Y/N} | Slides {N} |
| Commitment  | {Y/N} | Slides {N} |
| Social Proof | {Y/N} | Slides {N} |
| Authority   | {Y/N} | Slides {N} |
| Liking      | {Y/N} | Slides {N} |
| Scarcity    | {Y/N} | Slides {N} |
| Unity       | {Y/N} | Slides {N} |
**Score: {N}/7**

## Script Metadata
- Total Word Count: {N}
- Estimated Duration: {time}
- Total Slides: {N}
- Primary Framework: Benson 3X VSL Formula
- Research Framework: Georgi RMBC
- Persuasion Audit: Cialdini ({N}/7)
```

---

## Error Handling

**Strategy:** iterate-and-improve

**Common Errors:**

1. **Error:** Duration Mismatch
   - **Cause:** Script too long or short for target duration
   - **Resolution:** Recalculate slides using timing calibration
   - **Recovery:** Cut sub-parts from longest Step or add depth to shortest

2. **Error:** Mechanism Not Identified
   - **Cause:** Product does not have a clear unique mechanism
   - **Resolution:** Create a mechanism by naming the process/method
   - **Recovery:** Use Georgi naming framework - combine [Method] + [Benefit] into proprietary name

3. **Error:** Problem Section Too Aggressive
   - **Cause:** Over-agitation that creates hopelessness instead of motivation
   - **Resolution:** Balance negative with hope signals, never leave viewer in despair
   - **Recovery:** Add "bridge" slides between problem and solution that hint at light

4. **Error:** Offer Section Too Long/Boring
   - **Cause:** Too many bonuses or repetitive value stacking
   - **Resolution:** Limit to 3 bonuses max, keep each to 2-3 slides
   - **Recovery:** Cut weakest bonus, tighten value stack to essential items

5. **Error:** Cialdini Audit Fails (< 5/7)
   - **Cause:** Missing persuasion principles in the script
   - **Resolution:** Identify missing principles, find natural insertion points
   - **Recovery:** Add 1-2 slides per missing principle in most relevant Step

6. **Error:** Script Sounds Written, Not Spoken
   - **Cause:** Using formal/written language instead of conversational
   - **Resolution:** Read-aloud test - rewrite any sentence that sounds stiff
   - **Recovery:** Apply Benson conversational rules: contractions, short sentences, questions, incomplete thoughts

---

## Performance

**Expected Metrics:**

```yaml
duration_expected:
  1-min VSL: 10-15 min
  5-min VSL: 20-30 min
  20-min VSL: 40-60 min
cost_estimated: $0.03-0.15
token_usage: ~10,000-50,000 tokens
```

**Optimization Notes:**
- RMBC Research phase (Steps 1-3) can be reused across multiple VSL variations
- Shorter VSLs compress sub-parts, not eliminate them
- For 1-min VSLs, merge sub-parts into compound slides
- Review phase adds ~5-10 min but significantly improves persuasion score

---

## Metadata

```yaml
story: N/A
version: 1.0.0
squad: copywriting-masters
dependencies:
  agents:
    - jon-benson.md (primary - 3X VSL Formula)
    - stefan-georgi.md (RMBC Research, Mechanism, Brief)
    - robert-cialdini.md (Persuasion Audit - 7 Principles)
  frameworks:
    - Benson 3X VSL Formula (4 Steps)
    - Georgi RMBC (Research, Mechanism, Brief, Copy)
    - Cialdini 7 Principles of Persuasion
    - NLP Presuppositional Anchors
    - NLP Inclusion Patterns
  slide-rules:
    - "1 slide = 10-15 seconds"
    - "1 slide = 20-40 words on screen"
    - "1 slide = 50-100 words narration"
    - "Max 2 sentences on screen per slide"
tags:
  - vsl
  - video-sales-letter
  - 3x-formula
  - jon-benson
  - stefan-georgi
  - persuasion
  - scripts
updated_at: 2026-02-11
```
