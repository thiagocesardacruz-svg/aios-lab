# Write Landing Page

> Task ID: sugarman-write-landing-page
> Agent: Joe Sugarman (The Slippery Slide Master)
> Version: 1.0.0

## Execution Modes

**Choose your execution mode:**

### 1. YOLO Mode - Fast, Autonomous (0-1 prompts)
- Autonomous decision making with logging
- Minimal user interaction
- **Best for:** Simple lead-capture pages with clear product

### 2. Interactive Mode - Balanced, Educational (5-10 prompts) **[DEFAULT]**
- Explicit decision checkpoints at each section
- Educational explanations of Sugarman's principles
- **Best for:** Complex offers, learning copy architecture

### 3. Pre-Flight Planning - Comprehensive Upfront Planning
- Full audience research and wireframe planning first
- Zero ambiguity execution
- **Best for:** High-ticket offers, critical sales pages

**Parameter:** `mode` (optional, default: `interactive`)

---

## Task Definition (AIOS Task Format V1.0)

```yaml
task: Write Landing Page
responsavel: "@joe-sugarman"
responsavel_type: agent
atomic_layer: task
elicit: true

**Entrada:**
- campo: product_name
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: Must be non-empty product or service name

- campo: page_goal
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: "lead-capture | sales | webinar-registration | waitlist | free-trial"

- campo: target_audience
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: Must describe specific audience segment with pain points or desires

- campo: main_benefit
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: Must be a clear, specific outcome the customer achieves

**Saida:**
- campo: landing_page_copy
  tipo: object
  destino: Output Document
  persistido: true

- campo: wireframe_sections
  tipo: array
  destino: Output Document
  persistido: true
```

---

## Pre-Conditions

**Purpose:** Validate prerequisites BEFORE task execution (blocking)

**Checklist:**

```yaml
pre-conditions:
  - [ ] Product/service is clearly defined with identifiable benefits
    tipo: pre-condition
    blocker: true
    validacao: |
      Check that product_name has enough context to write persuasive copy
    error_message: "Pre-condition failed: Product must be clearly defined with benefits"

  - [ ] Page goal is one of the valid types
    tipo: pre-condition
    blocker: true
    validacao: |
      Validate page_goal is one of: lead-capture, sales, webinar-registration, waitlist, free-trial
    error_message: "Pre-condition failed: Page goal must be a valid type"

  - [ ] Target audience is specific enough for Kennedy 10 Questions
    tipo: pre-condition
    blocker: true
    validacao: |
      Check that target_audience has enough detail for psychographic profiling
    error_message: "Pre-condition failed: Target audience must be specific for profiling"

  - [ ] Main benefit is outcome-focused (not feature-focused)
    tipo: pre-condition
    blocker: true
    validacao: |
      Check that main_benefit describes a result, not a feature
    error_message: "Pre-condition failed: Main benefit must describe a customer outcome"
```

---

## Post-Conditions

**Purpose:** Validate execution success AFTER task completes

**Checklist:**

```yaml
post-conditions:
  - [ ] Complete landing page copy with all sections written
    tipo: post-condition
    blocker: true
    validacao: |
      Verify landing_page_copy contains: hero, problem, solution, proof, offer, CTA sections
    error_message: "Post-condition failed: Landing page missing required sections"

  - [ ] Wireframe sections documented with copy placement
    tipo: post-condition
    blocker: true
    validacao: |
      Verify wireframe_sections array maps each section to visual layout guidance
    error_message: "Post-condition failed: Wireframe sections not documented"

  - [ ] Conversion audit completed (Wiebe Seven Sweeps)
    tipo: post-condition
    blocker: true
    validacao: |
      Verify all 7 sweeps have been applied and documented
    error_message: "Post-condition failed: Conversion audit not completed"

  - [ ] Persuasion audit completed (Cialdini 7 Principles)
    tipo: post-condition
    blocker: true
    validacao: |
      Verify all 7 Cialdini principles have been checked against copy
    error_message: "Post-condition failed: Persuasion audit not completed"
```

---

## Acceptance Criteria

**Purpose:** Definitive pass/fail criteria for task completion

**Checklist:**

```yaml
acceptance-criteria:
  - [ ] Definir objetivo da pagina
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert page goal is clearly defined and all copy aligns to single CTA
    error_message: "Acceptance criterion not met: Page objective not defined"

  - [ ] Pesquisa de audiencia (Kennedy 10 Questions)
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert Kennedy 10 Smart Questions answered for target audience
    error_message: "Acceptance criterion not met: Audience research not completed"

  - [ ] Aplicar Slippery Slide (Sugarman)
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert copy follows Slippery Slide structure: Hook, Engage, Intrigue, Relevance, CTA
    error_message: "Acceptance criterion not met: Slippery Slide not applied"

  - [ ] Headline com Caples Formulas
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert headline generated using Caples formulas with multiple options evaluated
    error_message: "Acceptance criterion not met: Headline not created with Caples formulas"

  - [ ] Aplicar 17 Axioms
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert Sugarman's 17 Axioms applied throughout copy
    error_message: "Acceptance criterion not met: 17 Axioms not applied"

  - [ ] Usar Psychological Triggers
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert Sugarman's Psychological Triggers used in appropriate sections
    error_message: "Acceptance criterion not met: Psychological Triggers not used"

  - [ ] Conversion audit (Wiebe Seven Sweeps)
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert all 7 sweeps completed: Clarity, Voice, So What, Prove It, Specificity, Emotion, Zero Risk
    error_message: "Acceptance criterion not met: Seven Sweeps not completed"

  - [ ] Persuasion audit (Cialdini 7 Principles)
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert all 7 Cialdini principles checked: Reciprocity, Commitment, Social Proof, Authority, Liking, Scarcity, Unity
    error_message: "Acceptance criterion not met: Cialdini audit not completed"
```

---

## Interactive Elicitation Process

### Step 1: Product & Goal Discovery

```
ELICIT: Product and Page Goal

1. What is the product or service name?
   -> Collect: product_name

2. What is the goal of this landing page?
   -> Options: lead-capture | sales | webinar-registration | waitlist | free-trial
   -> Collect: page_goal

3. What specific action should the visitor take?
   -> Extract: primary CTA action (sign up, buy, register, join)

4. What is the price point? (if sales page)
   -> Extract: pricing for offer section
```

### Step 2: Audience Deep Dive (Kennedy 10 Questions)

```
ELICIT: Audience Research - Kennedy 10 Smart Questions

1. What keeps them awake at night?
2. What are they afraid of?
3. What are they angry about?
4. What are their top 3 daily frustrations?
5. What trends are occurring in their business or life?
6. What do they secretly desire most?
7. Is there a built-in bias in how they make decisions?
8. Do they have their own language/jargon?
9. Who else is selling something similar, and how?
10. Who has tried to sell them something similar and failed? Why?

-> Output: Audience Profile Document
```

### Step 3: Benefit & Mechanism

```
ELICIT: Core Benefit and Mechanism

1. What is the MAIN benefit? (one sentence, outcome-focused)
   -> Collect: main_benefit

2. What is the unique mechanism that delivers this benefit?
   -> Extract: mechanism name and how it works

3. What proof exists? (testimonials, case studies, data)
   -> Extract: social proof inventory

4. What objections will visitors have?
   -> Extract: objection list for handling in copy
```

---

## Execution Steps

### Step 1: Research - Kennedy 10 Smart Questions + Schwartz Awareness Level
**Build the audience intelligence brief before writing any copy.**

- Answer all 10 Kennedy Smart Questions for the target audience
- Classify Schwartz Awareness Level (Unaware through Most Aware)
- Document: pains, desires, language, objections, competitor landscape
- Determine the dominant emotion to leverage (fear, desire, frustration, aspiration)

**Validation:** Audience Profile complete with Kennedy answers and awareness classification.

### Step 2: Headline - Caples 35 Formulas
**Generate headline options and select the strongest.**

- Generate 10 headline options using Caples formulas:
  - Self-Interest (benefit-driven)
  - News (announcement angle)
  - Curiosity (information gap)
  - Quick & Easy (speed/ease promise)
- Score using Caples Headline Scorecard (Clarity 30%, Benefit 25%, Curiosity 20%, Specificity 15%, Urgency 10%)
- Select the best headline
- Write 2-3 backup options

**Validation:** 10 headlines generated, scored, best selected with rationale.

### Step 3: Subheadline
**Expand the promise made in the headline.**

- Subheadline should answer "How?" or "Why?" from the headline
- Add specificity: numbers, timeframe, mechanism
- Reduce skepticism while increasing desire
- Keep it to 1-2 sentences maximum

**Validation:** Subheadline expands on headline promise with specificity.

### Step 4: Opening Hook - Slippery Slide Element 1 (Hook)
**Create an irresistible opening that forces the reader to continue.**

Apply Sugarman's Slippery Slide principles:
- First sentence must be short and compelling
- Create an environment that pulls the reader in
- Use pattern interrupt, provocative statement, or relatable scenario
- Every sentence must compel reading the NEXT sentence

**Validation:** Opening hook is short, compelling, and creates reading momentum.

### Step 5: Story/Problem - Slippery Slide Elements 2 & 3 (Engage + Intrigue)
**Build emotional engagement through problem agitation.**

- **Engage:** Connect with the reader's situation. Show you understand their world.
- **Intrigue:** Introduce the problem at a deeper level. Use Sugarman Axiom #7 (selling a concept, not a product)
- Agitate the pain or desire
- Use the audience's own language (from Kennedy research)
- Build the gap between where they are and where they want to be

**Validation:** Problem section uses audience language and creates emotional engagement.

### Step 6: Solution & Benefits - Slippery Slide Element 4 (Relevance) + Triggers
**Present the solution with psychological triggers.**

- Introduce the product as the bridge from problem to desired outcome
- Apply Sugarman Psychological Triggers:
  - **Consistency:** Align with beliefs they already hold
  - **Involvement & Ownership:** Help them imagine using the product
  - **Storytelling:** Use narrative to deliver benefits
  - **Authority:** Position expertise and credibility
  - **Satisfaction Conviction:** Guarantee the outcome
  - **Linking:** Connect product to something they already trust/value
  - **Exclusivity:** Make them feel part of a select group

- Present benefits as outcomes (not features)
- Use bullet points for scannable benefit list
- Apply Sugarman Axiom #10: "Incubation process" - let the idea settle

**Validation:** Solution section applies 3+ psychological triggers with benefit-focused language.

### Step 7: Social Proof - Cialdini Social Proof + Authority
**Build credibility through evidence.**

- **Social Proof (Cialdini):** Testimonials, case studies, user counts, logos
- **Authority (Cialdini):** Expert endorsements, media mentions, certifications, credentials
- Structure proof in order of impact:
  1. Specific results with numbers ("increased revenue by 47% in 30 days")
  2. Named testimonials with photos/roles
  3. Aggregate proof ("10,000+ customers")
  4. Authority signals (logos, certifications, media)

**Validation:** Social proof section includes at least 2 types of proof with specificity.

### Step 8: Offer - Value Stack + Guarantee + Scarcity
**Construct the irresistible offer.**

- **Value Stack:** List everything included with individual values
  - Core product: ${value}
  - Bonus 1: ${value}
  - Bonus 2: ${value}
  - Total Value: ${total}
  - Your Price: ${price}

- **Guarantee (Cialdini - Commitment/Consistency):**
  - Risk reversal: money-back, satisfaction guarantee
  - Name the guarantee (e.g., "30-Day No-Questions-Asked Guarantee")
  - Make the guarantee bold and visible

- **Scarcity (Cialdini):**
  - Real scarcity: limited spots, limited time, limited quantity
  - Deadline or countdown
  - Reason WHY it is scarce (credibility)

**Validation:** Offer includes value stack, named guarantee, and scarcity element with reason.

### Step 9: CTA - Slippery Slide Element 5 (CTA) + Urgency
**Close with a compelling call to action.**

- CTA button text: action-oriented, first-person ("Get My Free Guide", "Start My Trial")
- Surrounding text: urgency + risk reversal recap
- Below CTA: address final objection or add micro-commitment
- Apply Sugarman Axiom #15: "Desire to belong"
- Consider adding a P.S. for most compelling argument restated

**Validation:** CTA is action-oriented, surrounded by urgency and risk reversal.

### Step 10: Conversion Audit - Wiebe Seven Sweeps
**Run the final quality check on the complete page.**

Sweep through the entire page copy for each criterion:

| Sweep | Question | Pass/Fail |
|-------|----------|-----------|
| **1. Clarity** | Can a stranger understand the offer in 5 seconds? | |
| **2. Voice** | Does the copy sound like the audience talks? | |
| **3. So What** | Does every claim answer "so what?" for the reader? | |
| **4. Prove It** | Is every claim backed by evidence? | |
| **5. Specificity** | Are vague claims replaced with specific numbers/details? | |
| **6. Emotion** | Does the copy make the reader FEEL something? | |
| **7. Zero Risk** | Is the risk completely on the seller, not the buyer? | |

Fix any sweep that fails before completing.

**Validation:** All 7 sweeps pass. Cialdini 7 Principles verified across page.

---

## Output Format

### Section 1: Audience Intelligence Brief

```markdown
## Audience Intelligence Brief

### Kennedy 10 Questions Summary
- **Keeps them awake:** {answer}
- **Afraid of:** {answer}
- **Angry about:** {answer}
- **Top 3 frustrations:** {answer}
- **Trends:** {answer}
- **Secret desires:** {answer}
- **Decision bias:** {answer}
- **Language/jargon:** {answer}
- **Competitor landscape:** {answer}
- **Failed attempts:** {answer}

### Schwartz Awareness Level: {level}
### Dominant Emotion: {emotion}
```

### Section 2: Landing Page Copy (by section)

```markdown
## Landing Page Copy

### HERO SECTION
**Headline:** {headline}
**Subheadline:** {subheadline}
**CTA Button:** {button text}
**Hero Visual Suggestion:** {image/video recommendation}

---

### PROBLEM SECTION
{Opening hook - Slippery Slide Element 1}
{Problem agitation - Elements 2 & 3}

---

### SOLUTION SECTION
{Solution introduction}
{Benefits list with psychological triggers}

---

### PROOF SECTION
{Testimonials}
{Case studies / results}
{Authority signals}

---

### OFFER SECTION
{Value stack}
{Guarantee}
{Scarcity element}

---

### CTA SECTION
{Final CTA with urgency}
{Risk reversal recap}
{P.S. (optional)}
```

### Section 3: Wireframe Sections

```markdown
## Wireframe Guide

| Section | Content | Layout Notes |
|---------|---------|-------------|
| Hero | Headline + Subheadline + CTA + Visual | Full-width, above fold |
| Problem | Hook + Problem Agitation | Text-focused, dark/contrasting bg |
| Solution | Benefits + Mechanism | Icons + text, 2-3 columns |
| Proof | Testimonials + Authority | Cards/grid layout |
| Offer | Value Stack + Guarantee | Centered, highlighted box |
| CTA | Button + Urgency + P.S. | Sticky or prominent, contrasting color |
```

### Section 4: Audits

```markdown
## Conversion Audit (Wiebe Seven Sweeps)

| Sweep | Status | Notes |
|-------|--------|-------|
| Clarity | PASS/FAIL | {notes} |
| Voice | PASS/FAIL | {notes} |
| So What | PASS/FAIL | {notes} |
| Prove It | PASS/FAIL | {notes} |
| Specificity | PASS/FAIL | {notes} |
| Emotion | PASS/FAIL | {notes} |
| Zero Risk | PASS/FAIL | {notes} |

## Persuasion Audit (Cialdini 7 Principles)

| Principle | Applied Where | Strength |
|-----------|--------------|----------|
| Reciprocity | {section} | Strong/Medium/Weak |
| Commitment/Consistency | {section} | Strong/Medium/Weak |
| Social Proof | {section} | Strong/Medium/Weak |
| Authority | {section} | Strong/Medium/Weak |
| Liking | {section} | Strong/Medium/Weak |
| Scarcity | {section} | Strong/Medium/Weak |
| Unity | {section} | Strong/Medium/Weak |
```

---

## Tools

**External/shared resources used by this task:**

- **Tool:** Sugarman Slippery Slide Framework
  - **Purpose:** Structure copy for maximum reading momentum
  - **Source:** Agent knowledge base (joe-sugarman agent)

- **Tool:** Sugarman 17 Axioms
  - **Purpose:** Apply advertising principles throughout copy
  - **Source:** Agent knowledge base (joe-sugarman agent)

- **Tool:** Sugarman Psychological Triggers
  - **Purpose:** Leverage psychological principles for persuasion
  - **Source:** Agent knowledge base (joe-sugarman agent)

- **Tool:** Caples 35 Headline Formulas
  - **Purpose:** Generate and score headline options
  - **Source:** Agent knowledge base (john-caples agent)

- **Tool:** Wiebe Seven Sweeps
  - **Purpose:** Conversion-focused copy audit
  - **Source:** Agent knowledge base (joanna-wiebe agent)

- **Tool:** Cialdini 7 Principles
  - **Purpose:** Persuasion audit across the entire page
  - **Source:** Agent knowledge base (robert-cialdini agent)

- **Tool:** Kennedy 10 Smart Questions
  - **Purpose:** Deep audience research and profiling
  - **Source:** Agent knowledge base (dan-kennedy agent)

---

## Error Handling

**Strategy:** retry

**Common Errors:**

1. **Error:** Page Goal Mismatch
   - **Cause:** Copy structure does not align with the stated page_goal
   - **Resolution:** Restructure sections for the specific goal (lead-capture has shorter copy than sales)
   - **Recovery:** Adjust section depth -- lead-capture skips extended proof, sales needs full treatment

2. **Error:** Slippery Slide Broken
   - **Cause:** Reader momentum lost at a section transition
   - **Resolution:** Review transitions between sections for continuity
   - **Recovery:** Add bridge sentences, remove friction points, ensure each paragraph ends with a hook

3. **Error:** Weak Social Proof
   - **Cause:** Insufficient or non-specific testimonials/data
   - **Resolution:** Request concrete proof points from user or suggest proof creation strategy
   - **Recovery:** Use authority signals and logic-based proof if testimonials unavailable

4. **Error:** CTA Unclear or Weak
   - **Cause:** Button text generic ("Submit") or action unclear
   - **Resolution:** Rewrite CTA in first person with specific outcome
   - **Recovery:** Apply the formula: "Get My [Benefit]" or "Start [Desired Outcome] Now"

5. **Error:** Seven Sweeps Failure
   - **Cause:** One or more sweeps did not pass audit
   - **Resolution:** Fix the failing sweep section specifically
   - **Recovery:** Iterate on the weakest sweep until it passes, then re-audit adjacent sections

6. **Error:** Insufficient Audience Information
   - **Cause:** Kennedy 10 Questions not fully answerable with given inputs
   - **Resolution:** Re-elicit from user with specific questions about their audience
   - **Recovery:** Make documented assumptions for unanswerable questions, flag for later validation

---

## Performance

**Expected Metrics:**

```yaml
duration_expected: 20-40 min (estimated)
cost_estimated: $0.03-0.10
token_usage: ~5,000-15,000 tokens
```

**Optimization Notes:**
- Complete audience research before writing any copy section
- Generate headlines in parallel batch before scoring
- Write sections sequentially (Slippery Slide requires flow)
- Run audits only after all sections complete (avoid premature optimization)

---

## Metadata

```yaml
story: N/A
version: 1.0.0
squad: copywriting-masters
dependencies:
  agents:
    - joe-sugarman
    - john-caples
    - dan-kennedy
    - eugene-schwartz
    - joanna-wiebe
    - robert-cialdini
  tasks:
    - write-headlines.md
  checklists: []
tags:
  - landing-page
  - copywriting
  - conversion
  - direct-response
  - slippery-slide
updated_at: 2026-02-11
```

---

## Notes

- Sugarman's core principle: Every element on the page exists to get the reader to read the first sentence. Every first sentence exists to get them to read the second sentence. And so on.
- The Slippery Slide is not a metaphor -- it is a structural requirement. If reading momentum breaks, the page fails.
- Kennedy's 10 Questions must be answered BEFORE writing. Copy written without audience intelligence is just words.
- The Seven Sweeps audit is the final quality gate -- no page ships without passing all 7.
- For lead-capture pages, compress the structure: Hero + Brief Problem + CTA + Trust Signals
- For sales pages, extend the structure: full problem agitation, multiple proof sections, detailed offer
- Cialdini's Unity principle (shared identity) is often the most underused and most powerful for community-based products
