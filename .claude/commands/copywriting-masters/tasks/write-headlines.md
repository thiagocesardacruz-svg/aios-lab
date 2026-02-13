# Write Headlines

> Task ID: caples-write-headlines
> Agent: John Caples (The King of Headlines)
> Version: 1.0.0

## Execution Modes

**Choose your execution mode:**

### 1. YOLO Mode - Fast, Autonomous (0-1 prompts)
- Autonomous decision making with logging
- Minimal user interaction
- **Best for:** When product/audience is well-defined

### 2. Interactive Mode - Balanced, Educational (5-10 prompts) **[DEFAULT]**
- Explicit decision checkpoints
- Educational explanations of headline formulas
- **Best for:** Learning headline craft, complex products

### 3. Pre-Flight Planning - Comprehensive Upfront Planning
- Full audience and awareness analysis first
- Zero ambiguity execution
- **Best for:** High-stakes campaigns, new markets

**Parameter:** `mode` (optional, default: `interactive`)

---

## Task Definition (AIOS Task Format V1.0)

```yaml
task: Write Headlines
responsavel: "@john-caples"
responsavel_type: agent
atomic_layer: task
elicit: true

**Entrada:**
- campo: product_or_topic
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: Must be non-empty, descriptive product/service/topic name

- campo: target_audience
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: Must describe demographics, psychographics, or persona

- campo: headline_purpose
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: "sales-letter | landing-page | email-subject | ad | blog-post | vsl"

- campo: num_headlines
  tipo: number
  origem: User Input
  obrigatorio: false
  validacao: "default: 25, min: 10, max: 100"

**Saida:**
- campo: headlines
  tipo: array
  destino: Output Document
  persistido: true

- campo: top_5_ranked
  tipo: array
  destino: Output Document
  persistido: true

- campo: testing_plan
  tipo: object
  destino: Output Document
  persistido: true
```

---

## Pre-Conditions

**Purpose:** Validate prerequisites BEFORE task execution (blocking)

**Checklist:**

```yaml
pre-conditions:
  - [ ] Product/topic is clearly defined with at least one key benefit
    tipo: pre-condition
    blocker: true
    validacao: |
      Check that product_or_topic contains enough detail to extract benefits
    error_message: "Pre-condition failed: Product/topic must be clearly defined with identifiable benefits"

  - [ ] Target audience is specific enough to determine awareness level
    tipo: pre-condition
    blocker: true
    validacao: |
      Check that target_audience includes enough detail for Schwartz awareness classification
    error_message: "Pre-condition failed: Target audience must be specific enough to classify awareness level"

  - [ ] Headline purpose matches a valid channel
    tipo: pre-condition
    blocker: true
    validacao: |
      Validate headline_purpose is one of: sales-letter, landing-page, email-subject, ad, blog-post, vsl
    error_message: "Pre-condition failed: headline_purpose must be one of the valid channel types"
```

---

## Post-Conditions

**Purpose:** Validate execution success AFTER task completes

**Checklist:**

```yaml
post-conditions:
  - [ ] Minimum number of headlines generated (default 25)
    tipo: post-condition
    blocker: true
    validacao: |
      Verify headlines array length >= num_headlines (default 25)
    error_message: "Post-condition failed: Did not generate minimum required headlines"

  - [ ] Top 5 ranked with scores and justification
    tipo: post-condition
    blocker: true
    validacao: |
      Verify top_5_ranked has exactly 5 entries, each with score breakdown and justification
    error_message: "Post-condition failed: Top 5 must be ranked with complete scoring"

  - [ ] Testing plan includes A/B test structure
    tipo: post-condition
    blocker: true
    validacao: |
      Verify testing_plan includes test pairs, metrics, and sequence
    error_message: "Post-condition failed: Testing plan must include A/B test structure"
```

---

## Acceptance Criteria

**Purpose:** Definitive pass/fail criteria for task completion

**Checklist:**

```yaml
acceptance-criteria:
  - [ ] Identificar beneficio principal
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert that the main benefit has been identified and documented
    error_message: "Acceptance criterion not met: Main benefit not identified"

  - [ ] Classificar awareness level (Schwartz)
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert awareness level classified as one of: Unaware, Problem Aware, Solution Aware, Product Aware, Most Aware
    error_message: "Acceptance criterion not met: Schwartz awareness level not classified"

  - [ ] Gerar headlines com 35 Formulas (Caples)
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert headlines generated using multiple Caples formulas (Self-Interest, News, Curiosity, Quick & Easy)
    error_message: "Acceptance criterion not met: Headlines not generated with Caples 35 Formulas"

  - [ ] Aplicar 4 Types of Headlines
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert headlines cover all 4 types: Self-Interest, News, Curiosity, Quick & Easy
    error_message: "Acceptance criterion not met: Not all 4 headline types covered"

  - [ ] Ranking com Headline Scorecard
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert all headlines scored using: Clarity 30%, Benefit 25%, Curiosity 20%, Specificity 15%, Urgency 10%
    error_message: "Acceptance criterion not met: Headlines not scored with Headline Scorecard"

  - [ ] Plano de teste A/B
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert A/B testing plan follows Caples 3-Step Testing methodology
    error_message: "Acceptance criterion not met: A/B testing plan not created"
```

---

## Interactive Elicitation Process

### Step 1: Product/Topic Discovery

```
ELICIT: Product Information

1. What is the product, service, or topic?
   → Collect: product_or_topic

2. What is the MAIN benefit for the customer?
   → Extract: primary benefit (functional + emotional)

3. What makes this different from competitors?
   → Extract: unique mechanism or differentiator

4. Any specific numbers, stats, or proof points?
   → Extract: specificity elements for headlines
```

### Step 2: Audience & Awareness Analysis

```
ELICIT: Audience Profiling

1. Who is the target audience?
   → Collect: target_audience

2. What is their biggest pain or desire related to this?
   → Classify: pain-driven vs desire-driven approach

3. How aware are they of the problem and solutions? (Schwartz Scale)
   → Classify: Unaware | Problem Aware | Solution Aware | Product Aware | Most Aware

4. What language/jargon does this audience use?
   → Extract: vocabulary for headline resonance
```

### Step 3: Channel & Purpose

```
ELICIT: Headline Context

1. Where will these headlines be used?
   → Collect: headline_purpose (sales-letter | landing-page | email-subject | ad | blog-post | vsl)

2. Are there character/length constraints?
   → Apply: channel-specific limits (email subjects ~50 chars, ads ~90 chars, etc.)

3. How many headlines do you want? (default: 25)
   → Collect: num_headlines
```

---

## Execution Steps

### Step 1: Research
**Identify the core elements before writing a single headline.**

- Extract the primary benefit (what the customer GETS)
- Identify secondary benefits (supporting arguments)
- Classify Schwartz awareness level
- Document the unique mechanism
- Note any proof points (numbers, percentages, timeframes)

**Validation:** Research brief documented with benefit, awareness level, and differentiator.

### Step 2: Generate Round 1 - Caples 35 Headline Formulas
**Apply the four fundamental headline types systematically.**

Generate headlines using each Caples category:

1. **Self-Interest Headlines** (6-8 headlines)
   - Start with "How to..."
   - Promise a specific benefit
   - Use "You" and "Your"
   - Example formula: "How to [benefit] in [timeframe]"

2. **News Headlines** (4-6 headlines)
   - Announce something new
   - Use "Introducing", "New", "At last", "Finally"
   - Example formula: "Announcing: [new thing] that [benefit]"

3. **Curiosity Headlines** (6-8 headlines)
   - Create information gaps
   - Use "Why", "What", "The secret of"
   - Example formula: "The [number] secrets of [desirable outcome]"

4. **Quick & Easy Headlines** (4-6 headlines)
   - Promise fast results with minimal effort
   - Use numbers, timeframes
   - Example formula: "[Result] in [short time] without [common objection]"

**Validation:** Minimum 20 headlines generated across all 4 types.

### Step 3: Generate Round 2 - Schwartz Awareness Adaptation
**Tailor headlines to the audience's awareness level.**

Based on the classified awareness level:

- **Unaware:** Use shocking statistics, stories, or pattern interrupts. Do NOT mention the product.
- **Problem Aware:** Name the problem directly. Agitate. Show understanding.
- **Solution Aware:** Present the unique mechanism. Differentiate from known solutions.
- **Product Aware:** Compare. Stack benefits. Emphasize what makes THIS product superior.
- **Most Aware:** Lead with the offer. Price, guarantee, urgency, bonuses.

Generate 5-8 additional headlines adapted to the identified awareness level.

**Validation:** Headlines match the classified awareness level strategy.

### Step 4: Generate Round 3 - Variations
**Create structural variations of the best headlines.**

Apply these variation patterns to the top performers from Rounds 1 and 2:

- **With numbers:** "7 Ways to...", "The 3 Secrets..."
- **With "How to":** Convert statements to how-to format
- **With "Why":** "Why [audience] [do/feel] [problem]"
- **With quotes:** "I [result] and you can too" (testimonial style)
- **With questions:** "Do you [common situation]?"

Generate 5-10 additional variations.

**Validation:** Total headlines meet or exceed the requested num_headlines.

### Step 5: Scoring - Caples Headline Scorecard
**Rank every headline using the weighted scoring system.**

Score each headline on a 1-10 scale for each criterion:

| Criterion    | Weight | Description                                      |
|-------------|--------|--------------------------------------------------|
| Clarity     | 30%    | Is the message instantly clear? No ambiguity?     |
| Benefit     | 25%    | Does it promise a specific, desirable outcome?    |
| Curiosity   | 20%    | Does it create an information gap?                |
| Specificity | 15%    | Does it use concrete numbers, details, proof?     |
| Urgency     | 10%    | Does it create a reason to act now?               |

**Formula:** `Score = (Clarity * 0.30) + (Benefit * 0.25) + (Curiosity * 0.20) + (Specificity * 0.15) + (Urgency * 0.10)`

**Validation:** All headlines scored and sorted by total score descending.

### Step 6: Top 5 Selection
**Select the 5 highest-scoring headlines with justification.**

For each of the Top 5:
- Show the headline text
- Show the score breakdown (each criterion)
- Explain WHY this headline works (psychological trigger, formula used)
- Suggest which channel/placement it works best for

**Validation:** Top 5 selected with complete score breakdown and strategic rationale.

### Step 7: Test Plan - Caples 3-Step Testing
**Create a sequential A/B testing plan.**

Design the testing sequence:

1. **Test 1: Champion vs Challenger**
   - Pair the #1 and #2 headlines
   - Define: metric (CTR, open rate, conversion), sample size, duration
   - Winner becomes the Champion

2. **Test 2: Champion vs Next Challenger**
   - Pair the winner of Test 1 with headline #3
   - Same metric framework
   - Winner becomes the new Champion

3. **Test 3: Champion vs Variation**
   - Take the current Champion and create a variation (different angle, same benefit)
   - Test to find the absolute winner

Include:
- Recommended sample size per variation
- Statistical significance threshold (95% confidence)
- Expected test duration per round
- Key metrics to track per channel

**Validation:** Testing plan includes 3 sequential tests with metrics, sample size, and confidence levels.

---

## Output Format

### Section 1: Research Brief

```markdown
## Research Brief
- **Product/Topic:** {product_or_topic}
- **Primary Benefit:** {main benefit}
- **Unique Mechanism:** {differentiator}
- **Awareness Level:** {Schwartz level}
- **Target Audience:** {target_audience}
- **Proof Points:** {numbers, stats, testimonials}
```

### Section 2: Headlines by Type

```markdown
## Headlines

### Self-Interest Headlines
1. {headline}
2. {headline}
...

### News Headlines
1. {headline}
2. {headline}
...

### Curiosity Headlines
1. {headline}
2. {headline}
...

### Quick & Easy Headlines
1. {headline}
2. {headline}
...

### Awareness-Adapted Headlines ({level})
1. {headline}
2. {headline}
...

### Variations
1. {headline}
2. {headline}
...
```

### Section 3: Top 5 Ranked

```markdown
## Top 5 Headlines (Ranked)

### #1: "{headline}"
| Criterion    | Score (1-10) | Weighted |
|-------------|-------------|----------|
| Clarity     | {x}         | {x*0.30} |
| Benefit     | {x}         | {x*0.25} |
| Curiosity   | {x}         | {x*0.20} |
| Specificity | {x}         | {x*0.15} |
| Urgency     | {x}         | {x*0.10} |
| **TOTAL**   |             | **{sum}**|

**Why it works:** {justification}
**Best for:** {channel recommendation}

(Repeat for #2 through #5)
```

### Section 4: Testing Plan

```markdown
## A/B Testing Plan (Caples 3-Step)

### Test 1: {headline A} vs {headline B}
- **Metric:** {CTR / open rate / conversion}
- **Sample Size:** {n per variation}
- **Duration:** {days}
- **Confidence:** 95%

### Test 2: Winner of Test 1 vs {headline C}
...

### Test 3: Champion vs Variation
...

### Key Metrics Dashboard
- Primary: {metric}
- Secondary: {metric}
- Sample size calculator: {formula or tool}
```

---

## Tools

**External/shared resources used by this task:**

- **Tool:** Caples 35 Headline Formulas
  - **Purpose:** Systematic headline generation using proven patterns
  - **Source:** Agent knowledge base (john-caples agent)

- **Tool:** Schwartz Awareness Scale
  - **Purpose:** Classify audience awareness for headline targeting
  - **Source:** Agent knowledge base (eugene-schwartz agent)

- **Tool:** Headline Scorecard
  - **Purpose:** Objective headline ranking system
  - **Source:** Weighted scoring formula (Clarity 30%, Benefit 25%, Curiosity 20%, Specificity 15%, Urgency 10%)

---

## Error Handling

**Strategy:** retry

**Common Errors:**

1. **Error:** Insufficient Product Information
   - **Cause:** product_or_topic too vague to extract benefits
   - **Resolution:** Re-elicit with specific prompts for benefits, features, and differentiators
   - **Recovery:** Ask follow-up questions to gather missing detail

2. **Error:** Ambiguous Awareness Level
   - **Cause:** Target audience description too broad to classify
   - **Resolution:** Ask clarifying questions about audience knowledge and experience
   - **Recovery:** Default to "Problem Aware" as safest middle ground, note assumption

3. **Error:** Headlines Too Similar
   - **Cause:** Insufficient variation in angles and formulas applied
   - **Resolution:** Force-apply underused formula categories (News, Curiosity)
   - **Recovery:** Generate additional round with constraints on formula type

4. **Error:** Low Scores Across All Headlines
   - **Cause:** Weak benefit or unclear messaging
   - **Resolution:** Revisit Research Brief, redefine primary benefit
   - **Recovery:** Re-run generation with refined benefit statement

5. **Error:** Invalid headline_purpose
   - **Cause:** User provided purpose not in valid list
   - **Resolution:** Present valid options and ask user to select
   - **Recovery:** Map closest match and confirm with user

---

## Performance

**Expected Metrics:**

```yaml
duration_expected: 10-20 min (estimated)
cost_estimated: $0.01-0.05
token_usage: ~3,000-8,000 tokens
```

**Optimization Notes:**
- Generate all headlines in batch before scoring to minimize passes
- Use parallel formula application (all 4 types simultaneously)
- Cache research brief for reuse in scoring and test plan steps

---

## Metadata

```yaml
story: N/A
version: 1.0.0
squad: copywriting-masters
dependencies:
  agents:
    - john-caples
    - eugene-schwartz
  tasks: []
  checklists: []
tags:
  - headlines
  - copywriting
  - testing
  - direct-response
updated_at: 2026-02-11
```

---

## Notes

- Caples tested 50+ headlines per ad campaign -- quantity matters before quality filtering
- The difference between the best and worst headline can be 10x in conversion
- Never rely on opinion for headline selection -- use data (scoring + testing)
- Headlines should be evaluated independently of the body copy
- Each headline type serves a different psychological trigger
- Self-Interest headlines consistently outperform clever/creative headlines in direct response
- The testing plan is not optional -- it is the scientific method applied to copywriting
