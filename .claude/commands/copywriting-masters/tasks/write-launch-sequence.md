# Write Launch Sequence

> Task ID: walker-write-launch-sequence
> Agent: Jeff Walker (The $400 Million Man)
> Version: 1.0.0

## Execution Modes

**Choose your execution mode:**

### 1. YOLO Mode - Fast, Autonomous (0-1 prompts)
- Autonomous decision making with logging
- Minimal user interaction
- **Best for:** Internal launches with well-defined products

### 2. Interactive Mode - Balanced, Educational (5-10 prompts) **[DEFAULT]**
- Explicit decision checkpoints at each phase
- Educational explanations of PLF methodology
- **Best for:** First launches, learning the PLF framework

### 3. Pre-Flight Planning - Comprehensive Upfront Planning
- Full launch strategy mapping first
- Zero ambiguity execution
- **Best for:** JV launches, high-ticket products, complex sequences

**Parameter:** `mode` (optional, default: `interactive`)

---

## Task Definition (AIOS Task Format V1.0)

```yaml
task: Write Launch Sequence
responsavel: "@jeff-walker"
responsavel_type: agent
atomic_layer: task
elicit: true

**Entrada:**
- campo: product_name
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: Must be non-empty product or program name

- campo: launch_type
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: "seed | internal | jv"

- campo: target_audience
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: Must describe audience with enough detail for launch positioning

- campo: price_point
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: Must include currency and amount (e.g., "$497", "$1997", "R$297")

- campo: launch_date
  tipo: string
  origem: User Input
  obrigatorio: false
  validacao: "ISO date format or descriptive (e.g., 'March 15, 2026'). Default: TBD"

**Saida:**
- campo: launch_plan
  tipo: object
  destino: Output Document
  persistido: true

- campo: plc_scripts
  tipo: array
  destino: Output Document
  persistido: true

- campo: email_sequences
  tipo: object
  destino: Output Document
  persistido: true

- campo: cart_emails
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
  - [ ] Product is defined with clear value proposition and deliverables
    tipo: pre-condition
    blocker: true
    validacao: |
      Check that product_name has enough context for launch positioning
    error_message: "Pre-condition failed: Product must have clear value proposition"

  - [ ] Launch type is valid (seed, internal, or jv)
    tipo: pre-condition
    blocker: true
    validacao: |
      Validate launch_type is one of: seed, internal, jv
    error_message: "Pre-condition failed: Launch type must be seed, internal, or jv"

  - [ ] Target audience is specific enough for PLC content creation
    tipo: pre-condition
    blocker: true
    validacao: |
      Check that target_audience includes pain points, desires, and awareness level
    error_message: "Pre-condition failed: Target audience must be specific for PLC scripting"

  - [ ] Price point is defined for offer structuring
    tipo: pre-condition
    blocker: true
    validacao: |
      Check that price_point is a valid amount for value stack creation
    error_message: "Pre-condition failed: Price point required for offer structure"
```

---

## Post-Conditions

**Purpose:** Validate execution success AFTER task completes

**Checklist:**

```yaml
post-conditions:
  - [ ] Launch plan includes all 4 phases (Pre-Prelaunch, Prelaunch, Open Cart, Cart Close)
    tipo: post-condition
    blocker: true
    validacao: |
      Verify launch_plan object contains all 4 phase definitions with timelines
    error_message: "Post-condition failed: Launch plan must cover all 4 phases"

  - [ ] 3 PLC scripts written with complete structure
    tipo: post-condition
    blocker: true
    validacao: |
      Verify plc_scripts array contains 3 entries, each with title, hook, content, CTA
    error_message: "Post-condition failed: Must have 3 complete PLC scripts"

  - [ ] Email sequences cover open cart through close
    tipo: post-condition
    blocker: true
    validacao: |
      Verify email_sequences contains prelaunch, open_cart, and close sequences
    error_message: "Post-condition failed: Email sequences must cover full launch"

  - [ ] Cart close emails include day-final urgency sequence
    tipo: post-condition
    blocker: true
    validacao: |
      Verify cart_emails array contains 3-4 final day emails with escalating urgency
    error_message: "Post-condition failed: Cart close must have 3-4 urgency emails"

  - [ ] Cialdini persuasion audit completed on full sequence
    tipo: post-condition
    blocker: true
    validacao: |
      Verify all 7 Cialdini principles mapped across launch sequence
    error_message: "Post-condition failed: Persuasion audit not completed"
```

---

## Acceptance Criteria

**Purpose:** Definitive pass/fail criteria for task completion

**Checklist:**

```yaml
acceptance-criteria:
  - [ ] Definir tipo de lancamento
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert launch type defined and strategy tailored accordingly
    error_message: "Acceptance criterion not met: Launch type not defined"

  - [ ] Fase 1: Pre-Prelaunch planning
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert pre-prelaunch includes sneak peeks, survey, and anticipation building
    error_message: "Acceptance criterion not met: Pre-Prelaunch not planned"

  - [ ] Fase 2: Prelaunch - 3 PLCs (Sideways Sales Letter)
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert 3 PLCs follow Walker Sideways Sales Letter structure
    error_message: "Acceptance criterion not met: PLCs not structured correctly"

  - [ ] PLC 1: The Opportunity
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert PLC 1 shares story, names problem, and paints vision of solution
    error_message: "Acceptance criterion not met: PLC 1 not complete"

  - [ ] PLC 2: The Transformation
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert PLC 2 includes case studies, results, and demonstration
    error_message: "Acceptance criterion not met: PLC 2 not complete"

  - [ ] PLC 3: The Ownership Experience
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert PLC 3 hints at offer, creates ownership feeling, and maximizes anticipation
    error_message: "Acceptance criterion not met: PLC 3 not complete"

  - [ ] Fase 3: Open Cart emails (5-7 dias)
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert open cart has 5-7 daily emails with different angles
    error_message: "Acceptance criterion not met: Open Cart emails not complete"

  - [ ] Fase 4: Cart Close emails (ultimo dia)
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert cart close has 3-4 emails on final day with escalating urgency
    error_message: "Acceptance criterion not met: Cart Close emails not complete"

  - [ ] Epiphany Bridge story (Brunson)
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert origin story follows Brunson Epiphany Bridge 5-step structure
    error_message: "Acceptance criterion not met: Epiphany Bridge not applied"

  - [ ] Review com Cialdini Persuasion Audit
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert all 7 Cialdini principles reviewed across entire launch sequence
    error_message: "Acceptance criterion not met: Cialdini audit not completed"
```

---

## Interactive Elicitation Process

### Step 1: Product & Launch Type

```
ELICIT: Launch Foundation

1. What is the product or program name?
   -> Collect: product_name

2. What type of launch?
   -> Options:
      a) Seed Launch - first time, small list, validating the offer
      b) Internal Launch - established list, proven product
      c) JV Launch - partner-driven, affiliate traffic
   -> Collect: launch_type

3. What is the price point?
   -> Collect: price_point

4. When is the planned launch date? (optional)
   -> Collect: launch_date
```

### Step 2: Audience & Positioning

```
ELICIT: Audience Intelligence

1. Who is the target audience?
   -> Collect: target_audience

2. What is their #1 problem or desire this product solves?
   -> Extract: core pain/desire for PLC scripting

3. What transformation does the product deliver?
   -> Extract: before/after story arc

4. What is the origin story? (how/why was this product created?)
   -> Extract: founder story for Epiphany Bridge

5. What proof or results exist? (testimonials, case studies, personal results)
   -> Extract: proof inventory for PLC 2 and emails
```

### Step 3: Launch Parameters

```
ELICIT: Launch Configuration

1. How long should the open cart window be? (default: 7 days)
   -> Configure: cart duration

2. Are there bonuses? If so, list them.
   -> Extract: bonus stack for offer and emails

3. Is there a guarantee? What type?
   -> Extract: risk reversal for cart emails

4. Are there any scarcity elements? (limited spots, early bird pricing, deadline)
   -> Extract: real scarcity for urgency emails
```

---

## Execution Steps

### Step 1: Launch Strategy - Define Launch Type (Walker PLF)
**Map the complete launch architecture based on type.**

**Seed Launch:**
- Small audience (even 50-100 people)
- Validate offer in real-time
- Co-create product with early adopters
- Lower price point, gather testimonials

**Internal Launch:**
- Full PLF sequence to existing list
- 3 PLCs + Open Cart + Cart Close
- Proven product with social proof
- Full bonus stack and urgency

**JV Launch:**
- Partner recruitment phase added
- Affiliate tools and swipe copy
- Coordinated launch calendar
- Revenue share structure

Document: Launch timeline, phases, key dates, milestones.

**Validation:** Launch strategy document with type-specific adaptations and timeline.

### Step 2: Pre-Prelaunch - Build Anticipation
**Plant the seeds before the formal launch begins.**

Create:
- **Sneak Peek Content** (3-5 pieces): Behind-the-scenes, teasers, early reveals
- **2-Question Survey:** "What is your biggest challenge with {topic}?" + "If I could help you with one thing, what would it be?"
- **Anticipation Posts:** Social media and email hints that something big is coming
- **Seed the Idea:** Begin conditioning the audience for the topic without selling

Timeline: 2-4 weeks before PLC 1.

**Validation:** Pre-prelaunch content plan with 3-5 sneak peeks, survey template, and anticipation schedule.

### Step 3: PLC 1 - The Opportunity (Walker Sideways Sales Letter)
**Share your story, name the problem, paint the vision.**

Script structure:
1. **Hook:** Open with a bold claim or relatable struggle
2. **Personal Story:** Share your journey (how you discovered the solution)
3. **The Problem:** Name the specific problem the audience faces
4. **The Opportunity:** Show why NOW is the time (trends, data, urgency)
5. **Vision of the Solution:** Paint the picture of what is possible (without revealing the product)
6. **Deliver Value:** Teach one actionable concept (reciprocity trigger)
7. **Tease PLC 2:** Create anticipation for the next piece

Format: Video script (15-25 minutes) or written content equivalent.

**Validation:** PLC 1 script with all 7 elements, teaching real value while building desire.

### Step 4: PLC 2 - The Transformation (Walker)
**Show proof through case studies, results, and demonstration.**

Script structure:
1. **Recap PLC 1:** Brief summary + acknowledge feedback/comments
2. **Case Studies:** 2-3 transformation stories (before/after with specifics)
3. **The Method:** Introduce the framework or methodology (teach another concept)
4. **Demonstration:** Show a piece of the product or system in action
5. **Results:** Data, numbers, screenshots, testimonials
6. **Objection Handling:** Address the top 1-2 objections naturally
7. **Tease PLC 3:** Create anticipation for the reveal

Format: Video script (20-30 minutes) or written content equivalent.

**Validation:** PLC 2 script with case studies, demonstration, and objection handling.

### Step 5: PLC 3 - The Ownership Experience (Walker)
**Hint at the offer and maximize anticipation for cart open.**

Script structure:
1. **Recap PLC 2:** Summary + community feedback showcase
2. **The Ownership Experience:** Help them imagine OWNING the product (Sugarman involvement trigger)
3. **FAQ/Objections:** Address remaining concerns
4. **The Hint:** Reveal what the product IS and what is included (without price)
5. **Social Proof Stack:** Biggest testimonials and results
6. **The Reveal:** "Tomorrow I am opening the doors to {product_name}..."
7. **Urgency Seed:** "But it will only be available for {timeframe}"

Format: Video script (15-20 minutes) or written content equivalent.

**Validation:** PLC 3 script creates ownership feeling and maximum anticipation.

### Step 6: Origin Story - Brunson Epiphany Bridge (5 Steps)
**Craft the founder origin story for use across the launch.**

Follow Brunson's 5-step Epiphany Bridge:
1. **The Backstory:** Where you were before (relatable struggle)
2. **The Journey:** What you tried and failed
3. **The Epiphany:** The moment everything changed (the "aha" moment)
4. **The Framework:** What you built as a result
5. **The Achievement:** Where you are now (proof of transformation)

This story is woven into PLC 1 and referenced throughout the launch.

**Validation:** Epiphany Bridge story complete with all 5 steps, emotionally compelling.

### Step 7: Open Cart Emails - Days 1-5 (Walker)
**Send daily emails with different persuasion angles during open cart.**

| Day | Email Focus | Angle |
|-----|------------|-------|
| Day 1 | Cart Open | Excitement + full offer reveal + CTA |
| Day 2 | Story | Epiphany Bridge story + personal connection |
| Day 3 | Social Proof | Testimonials + case studies + results |
| Day 4 | FAQ/Objections | Address top objections + reassurance |
| Day 5 | Bonus Reveal | Stack additional bonuses + increased value |

Each email includes:
- Subject line (2-3 options)
- Body copy
- CTA with link
- P.S. with urgency element

**Validation:** 5 open cart emails written with varied angles, each with subject line options.

### Step 8: Cart Close Emails - Final Day (Walker + Kern)
**Create maximum urgency on the final day of cart open.**

Apply Walker urgency principles + Kern 4 Day Cash Machine insights:

| Email | Timing | Focus |
|-------|--------|-------|
| Email 1 | Morning | "Last day" announcement + recap of value |
| Email 2 | Afternoon | "Hours remaining" + missed opportunity angle |
| Email 3 | Evening (2h before) | "Final call" + strongest testimonial |
| Email 4 | Final hour | "Doors closing" + last chance + what they lose |

Urgency elements:
- Real deadline (cart closes at specific time)
- Bonus removal ("Bonus X disappears at midnight")
- Price increase ("Price goes up to ${higher} after tonight")
- Loss aversion: what they miss by NOT joining

**Validation:** 3-4 cart close emails with escalating urgency and clear deadlines.

### Step 9: Bonus Stack - Brunson Value Ladder Logic
**Structure bonuses that amplify the core offer value.**

Design bonuses using Brunson's Value Ladder logic:
- Each bonus should solve a specific sub-problem
- Bonuses should be stacked with individual values
- At least one bonus should address the top objection
- Order bonuses from most to least universally appealing
- Consider a "fast action" bonus for early buyers

Bonus Stack Template:
```
Bonus #1: {name} (Value: ${amount})
- What it is
- Why it matters
- Problem it solves

Bonus #2: {name} (Value: ${amount})
...

Total Bonus Value: ${total}
```

**Validation:** Bonus stack with 3-5 bonuses, each with clear value and problem-solving angle.

### Step 10: Review - Cialdini 7 Principles Audit
**Audit the entire launch sequence for persuasion completeness.**

Review all content (PLCs + emails) against Cialdini's 7 Principles:

| Principle | Where Applied | Strength | Notes |
|-----------|--------------|----------|-------|
| **Reciprocity** | PLCs (free value), bonuses | | Must teach real value in PLCs |
| **Commitment/Consistency** | Survey, micro-commitments | | Small yeses leading to big yes |
| **Social Proof** | PLC 2, Day 3 email, testimonials | | Specific results with names |
| **Authority** | PLC 1, credentials, media | | Expert positioning throughout |
| **Liking** | Origin story, personality | | Attractive Character elements |
| **Scarcity** | Cart close, bonuses, deadline | | Must be REAL, not manufactured |
| **Unity** | Community, shared identity | | "You are one of us" messaging |

Fix any weak or missing principles before completing.

**Validation:** All 7 principles present with at least "Medium" strength across the launch.

---

## Output Format

### Section 1: Launch Plan Overview

```markdown
## Launch Plan: {product_name}

### Launch Type: {seed | internal | jv}
### Target Launch Date: {date or TBD}
### Price Point: {price}

### Phase Timeline

| Phase | Duration | Dates | Key Activities |
|-------|----------|-------|----------------|
| Pre-Prelaunch | 2-4 weeks | {dates} | Sneak peeks, survey, anticipation |
| Prelaunch (PLCs) | 7-10 days | {dates} | PLC 1, PLC 2, PLC 3 |
| Open Cart | 5-7 days | {dates} | Daily emails, offer live |
| Cart Close | 1 day | {date} | 3-4 urgency emails, deadline |
```

### Section 2: PLC Scripts

```markdown
## PLC 1: The Opportunity
**Duration:** 15-25 min
**Format:** Video Script

### Hook
{opening hook}

### Personal Story
{story content}

### The Problem
{problem statement}

### The Opportunity
{why now}

### Vision of Solution
{what is possible}

### Value Delivery
{teachable concept}

### Tease PLC 2
{anticipation builder}

---

## PLC 2: The Transformation
(same structure)

---

## PLC 3: The Ownership Experience
(same structure)
```

### Section 3: Email Sequences

```markdown
## Pre-Launch Emails
(emails announcing each PLC)

## Open Cart Emails

### Day 1: Cart Open
**Subject Line Options:**
1. {option 1}
2. {option 2}

**Body:**
{email copy}

**CTA:** {call to action}
**P.S.:** {urgency element}

(Repeat for Days 2-5)

## Cart Close Emails

### Email 1: Morning - Last Day
(same format)

### Email 2: Afternoon - Hours Remaining
(same format)

### Email 3: Evening - Final Call
(same format)

### Email 4: Final Hour - Doors Closing
(same format)
```

### Section 4: Supporting Materials

```markdown
## Origin Story (Epiphany Bridge)
{5-step story}

## Bonus Stack
{bonus details with values}

## Cialdini Persuasion Audit
{7 principles audit table}
```

---

## Tools

**External/shared resources used by this task:**

- **Tool:** Walker Product Launch Formula (PLF)
  - **Purpose:** Core launch sequence architecture and PLC structure
  - **Source:** Agent knowledge base (jeff-walker agent)

- **Tool:** Walker Sideways Sales Letter
  - **Purpose:** PLC scripting methodology
  - **Source:** Agent knowledge base (jeff-walker agent)

- **Tool:** Brunson Epiphany Bridge
  - **Purpose:** Origin story construction (5 steps)
  - **Source:** Agent knowledge base (russell-brunson agent)

- **Tool:** Brunson Value Ladder
  - **Purpose:** Bonus stack logic and offer positioning
  - **Source:** Agent knowledge base (russell-brunson agent)

- **Tool:** Kern 4 Day Cash Machine
  - **Purpose:** Cart close urgency principles
  - **Source:** Agent knowledge base (frank-kern agent)

- **Tool:** Cialdini 7 Principles
  - **Purpose:** Persuasion audit across entire launch sequence
  - **Source:** Agent knowledge base (robert-cialdini agent)

---

## Error Handling

**Strategy:** retry

**Common Errors:**

1. **Error:** Launch Type Mismatch
   - **Cause:** Strategy does not match the selected launch type complexity
   - **Resolution:** Seed launches should be simpler; JV launches need partner materials
   - **Recovery:** Adjust sequence depth: Seed (shorter PLCs, fewer emails), JV (add affiliate tools)

2. **Error:** PLCs Too Salesy
   - **Cause:** PLCs pushing product instead of delivering value
   - **Resolution:** PLCs must teach real, usable value. The sale happens through demonstrated expertise.
   - **Recovery:** Review each PLC for the value-to-pitch ratio (80% value, 20% anticipation)

3. **Error:** No Origin Story
   - **Cause:** Founder story not provided or too generic
   - **Resolution:** Every launch needs an Epiphany Bridge. If no real story exists, find the "aha moment"
   - **Recovery:** Interview the founder/creator with the 5 Epiphany Bridge prompts

4. **Error:** Fake Scarcity
   - **Cause:** Scarcity elements are not genuine (manufactured urgency)
   - **Resolution:** Scarcity must be REAL or it destroys trust
   - **Recovery:** Find genuine limits: time, capacity, pricing tier, bonus availability

5. **Error:** Cart Close Too Aggressive
   - **Cause:** Final day emails feel pushy or desperate
   - **Resolution:** Urgency should come from service (helping them decide), not pressure
   - **Recovery:** Frame as "I do not want you to miss this" not "BUY NOW OR ELSE"

6. **Error:** Insufficient Social Proof for PLC 2
   - **Cause:** No testimonials or case studies available (common in Seed launches)
   - **Resolution:** For Seed launches, use personal results. For Internal/JV, gather testimonials first.
   - **Recovery:** Offer to create a testimonial collection plan or use logical proof instead

---

## Performance

**Expected Metrics:**

```yaml
duration_expected: 45-90 min (estimated)
cost_estimated: $0.05-0.20
token_usage: ~10,000-30,000 tokens
```

**Optimization Notes:**
- Complete launch plan and strategy before writing any scripts
- Write PLCs sequentially (each builds on the previous)
- Write open cart emails in batch (varied angles, shared structure)
- Write cart close emails last (they reference the full launch arc)
- Run Cialdini audit only after all content is complete

---

## Metadata

```yaml
story: N/A
version: 1.0.0
squad: copywriting-masters
dependencies:
  agents:
    - jeff-walker
    - russell-brunson
    - frank-kern
    - robert-cialdini
  tasks:
    - write-headlines.md
  checklists: []
tags:
  - launch
  - product-launch
  - plf
  - email-sequence
  - copywriting
  - direct-response
updated_at: 2026-02-11
```

---

## Notes

- Walker's PLF is built on the principle that anticipation is the most powerful selling force. The sale is made BEFORE the cart opens.
- PLCs are NOT webinars. They are short, value-packed content pieces that build desire sequentially.
- The Sideways Sales Letter concept means spreading a sales letter across multiple pieces of content over days, not sending one long piece.
- Seed launches are the starting point for new products. They validate the offer with real buyers before scaling.
- 50-70% of launch revenue typically comes in the last 24-48 hours. Cart close emails are critical.
- The 2-Question Survey in Pre-Prelaunch is not just research -- it is a commitment device (Cialdini).
- Always pair Walker's launch structure with Brunson's storytelling (Epiphany Bridge) for maximum emotional impact.
- Kern's 4 Day Cash Machine principles apply to cart close: escalating urgency, multiple touches, loss aversion.
