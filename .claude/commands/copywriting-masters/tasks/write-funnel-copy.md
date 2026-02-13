# Write Funnel Copy

> Task ID: brunson-write-funnel-copy
> Agent: Russell Brunson (The Funnel Hacker)
> Version: 1.0.0

## Execution Modes

**Choose your execution mode:**

### 1. YOLO Mode - Fast, Autonomous (0-1 prompts)
- Autonomous decision making with logging
- Minimal user interaction
- **Best for:** Simple lead-magnet or tripwire funnels

### 2. Interactive Mode - Balanced, Educational (5-10 prompts) **[DEFAULT]**
- Explicit decision checkpoints at each funnel stage
- Educational explanations of funnel architecture
- **Best for:** Learning funnel craft, complex funnels

### 3. Pre-Flight Planning - Comprehensive Upfront Planning
- Full Value Ladder and funnel mapping first
- Zero ambiguity execution
- **Best for:** High-ticket funnels, multi-step sequences

**Parameter:** `mode` (optional, default: `interactive`)

---

## Task Definition (AIOS Task Format V1.0)

```yaml
task: Write Funnel Copy
responsavel: "@russell-brunson"
responsavel_type: agent
atomic_layer: task
elicit: true

**Entrada:**
- campo: funnel_type
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: "lead-magnet | tripwire | webinar | product-launch | high-ticket"

- campo: product_name
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: Must be non-empty product or service name

- campo: target_audience
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: Must describe specific audience with pains, desires, and awareness level

- campo: value_ladder_position
  tipo: string
  origem: User Input
  obrigatorio: false
  validacao: "free | low-ticket | mid-ticket | high-ticket. Default: inferred from funnel_type"

**Saida:**
- campo: funnel_copy
  tipo: object
  destino: Output Document
  persistido: true

- campo: pages
  tipo: array
  destino: Output Document
  persistido: true

- campo: email_sequences
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
  - [ ] Product is defined with clear deliverables and transformation promise
    tipo: pre-condition
    blocker: true
    validacao: |
      Check that product_name has enough context to describe the transformation
    error_message: "Pre-condition failed: Product must have clear deliverables and transformation"

  - [ ] Funnel type is valid and appropriate for the product
    tipo: pre-condition
    blocker: true
    validacao: |
      Validate funnel_type is one of: lead-magnet, tripwire, webinar, product-launch, high-ticket
    error_message: "Pre-condition failed: Funnel type must be valid"

  - [ ] Target audience is specific enough for Hook-Story-Offer creation
    tipo: pre-condition
    blocker: true
    validacao: |
      Check that target_audience includes enough detail for Attractive Character alignment
    error_message: "Pre-condition failed: Audience must be specific for Attractive Character"

  - [ ] Value Ladder position is defined or inferable
    tipo: pre-condition
    blocker: true
    validacao: |
      Check that value_ladder_position is set or can be inferred from funnel_type
    error_message: "Pre-condition failed: Value Ladder position must be determinable"
```

---

## Post-Conditions

**Purpose:** Validate execution success AFTER task completes

**Checklist:**

```yaml
post-conditions:
  - [ ] All funnel pages have complete copy (opt-in through thank you/upsell)
    tipo: post-condition
    blocker: true
    validacao: |
      Verify pages array contains copy for every page in the funnel sequence
    error_message: "Post-condition failed: All funnel pages must have complete copy"

  - [ ] Email follow-up sequences written for buyers and non-buyers
    tipo: post-condition
    blocker: true
    validacao: |
      Verify email_sequences contains both buyer nurture and non-buyer follow-up
    error_message: "Post-condition failed: Email sequences must cover both paths"

  - [ ] Hook-Story-Offer applied to every page
    tipo: post-condition
    blocker: true
    validacao: |
      Verify each page in the funnel uses Hook-Story-Offer structure
    error_message: "Post-condition failed: Hook-Story-Offer must be on every page"

  - [ ] Wiebe Seven Sweeps completed on each page
    tipo: post-condition
    blocker: true
    validacao: |
      Verify Seven Sweeps audit run on each funnel page
    error_message: "Post-condition failed: Seven Sweeps not completed on all pages"

  - [ ] Cialdini 7 Principles audited across the full funnel
    tipo: post-condition
    blocker: true
    validacao: |
      Verify all 7 Cialdini principles mapped across the complete funnel flow
    error_message: "Post-condition failed: Cialdini audit not completed on full funnel"
```

---

## Acceptance Criteria

**Purpose:** Definitive pass/fail criteria for task completion

**Checklist:**

```yaml
acceptance-criteria:
  - [ ] Definir tipo de funil
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert funnel type defined and page structure matches type requirements
    error_message: "Acceptance criterion not met: Funnel type not defined"

  - [ ] Mapear Value Ladder
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert Value Ladder mapped showing product position and adjacent offers
    error_message: "Acceptance criterion not met: Value Ladder not mapped"

  - [ ] Criar Attractive Character (Brunson)
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert Attractive Character defined with Backstory, Parables, Flaws, Polarity, and Identity type
    error_message: "Acceptance criterion not met: Attractive Character not created"

  - [ ] Hook-Story-Offer para cada pagina
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert every funnel page uses Hook-Story-Offer framework
    error_message: "Acceptance criterion not met: Hook-Story-Offer not on every page"

  - [ ] Opt-in page copy
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert opt-in page has headline, benefit, and form with clear value exchange
    error_message: "Acceptance criterion not met: Opt-in page not complete"

  - [ ] Thank you / bridge page
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert thank you page introduces Attractive Character and previews next offer
    error_message: "Acceptance criterion not met: Thank you page not complete"

  - [ ] Sales page / webinar registration
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert sales page uses appropriate format (Perfect Webinar or Slippery Slide)
    error_message: "Acceptance criterion not met: Sales page not complete"

  - [ ] Order form / checkout
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert order form has stack slide, guarantee, and scarcity elements
    error_message: "Acceptance criterion not met: Order form not complete"

  - [ ] Upsell / downsell pages
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert upsell uses OTO with Epiphany Bridge and downsell offers alternative
    error_message: "Acceptance criterion not met: Upsell/downsell pages not complete"

  - [ ] Email follow-up sequence
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert email sequences include SOS for non-buyers and daily nurture for all
    error_message: "Acceptance criterion not met: Email follow-up not complete"

  - [ ] Review com Seven Sweeps (Wiebe)
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assert Seven Sweeps audit completed on each page with all sweeps passing
    error_message: "Acceptance criterion not met: Seven Sweeps not completed"
```

---

## Interactive Elicitation Process

### Step 1: Funnel Architecture

```
ELICIT: Funnel Configuration

1. What type of funnel do you need?
   -> Options:
      a) Lead Magnet Funnel - Free offer to capture emails
      b) Tripwire Funnel - Low-ticket offer ($7-$47) to create buyers
      c) Webinar Funnel - Webinar registration leading to mid/high-ticket offer
      d) Product Launch Funnel - Launch sequence with PLCs
      e) High-Ticket Funnel - Application funnel for premium offers ($997+)
   -> Collect: funnel_type

2. What is the product name?
   -> Collect: product_name

3. Where does this sit on your Value Ladder?
   -> Options: free | low-ticket | mid-ticket | high-ticket
   -> Collect: value_ladder_position

4. What comes BEFORE this in your Value Ladder? (if anything)
   -> Extract: preceding offer for continuity

5. What comes AFTER this in your Value Ladder? (if anything)
   -> Extract: next offer for upsell path
```

### Step 2: Attractive Character

```
ELICIT: Attractive Character Definition

1. What is the Attractive Character identity type?
   -> Options:
      a) Leader - "Follow me, I will show you the way"
      b) Adventurer/Crusader - "Come with me on this journey"
      c) Reporter/Evangelist - "I researched everything so you do not have to"
      d) Reluctant Hero - "I did not want this role, but I cannot ignore the calling"
   -> Collect: identity_type

2. What is the backstory? (origin, struggle, transformation)
   -> Extract: backstory elements

3. What are the character's parables? (teaching stories)
   -> Extract: 2-3 key stories

4. What are the character's flaws? (relatable imperfections)
   -> Extract: humanizing elements

5. What is the character's polarity? (strong opinion/stance)
   -> Extract: polarizing position
```

### Step 3: Audience & Offer

```
ELICIT: Audience and Offer Details

1. Who is the target audience?
   -> Collect: target_audience

2. What is their #1 pain or desire?
   -> Extract: core pain for hook

3. What is the main benefit/transformation?
   -> Extract: promise for headlines and CTAs

4. What objections will they have?
   -> Extract: objection list for sales page and emails

5. What is included in the offer? (deliverables)
   -> Extract: offer components for stack slide
```

---

## Execution Steps

### Step 1: Funnel Architecture - Map Value Ladder (Brunson)
**Map the complete Value Ladder and position this funnel within it.**

Create the Value Ladder visualization:

```
Value Ladder:
[FREE] Lead Magnet → [LOW] Tripwire → [MID] Core Offer → [HIGH] Premium
   |                    |                  |                    |
   $0                   $7-47              $97-497              $997+
   |                    |                  |                    |
   {name}               {name}             {name}              {name}
```

Define for THIS funnel:
- Position on the ladder
- Entry point (where traffic comes from)
- Ascension path (where they go next)
- Funnel page sequence based on type:

| Funnel Type | Pages |
|------------|-------|
| Lead Magnet | Opt-in -> Thank You/Bridge -> (optional) Tripwire |
| Tripwire | Opt-in -> Sales Page -> Order Form -> Upsell -> Downsell -> Thank You |
| Webinar | Opt-in -> Registration Confirm -> Webinar -> Sales Page -> Order Form -> Upsell |
| Product Launch | PLC Sequence -> Sales Page -> Order Form -> Upsell -> Thank You |
| High-Ticket | Opt-in -> Application -> Sales Video -> Call Booking -> Follow-up |

**Validation:** Value Ladder mapped with this funnel's position and page sequence defined.

### Step 2: Attractive Character - Define the Brand Voice (Brunson)
**Create the Attractive Character that will appear throughout the funnel.**

Document all 4 elements:

1. **Backstory:** The origin story. Where did you start? What was the struggle?
2. **Parables:** 2-3 teaching stories that illustrate key principles
3. **Character Flaws:** What makes you human and relatable?
4. **Polarity:** What strong stance do you take? What do you stand AGAINST?

Define the identity type:
- **Leader:** "I have been where you are. Follow me."
- **Adventurer:** "Let us discover this together."
- **Reporter:** "I have done all the research. Here is what works."
- **Reluctant Hero:** "I never planned this, but I cannot stay silent."

**Validation:** Attractive Character profile complete with all 4 elements and identity type.

### Step 3: Opt-in Page - Hook-Story-Offer (Brunson)
**Create the entry point of the funnel.**

Apply Hook-Story-Offer:
- **Hook:** Headline that stops the scroll (use Caples formulas)
- **Story:** 2-3 sentences connecting to their pain/desire
- **Offer:** Clear value exchange (what they get for their email)

Page elements:
- Headline (benefit-driven)
- Subheadline (specificity)
- Bullet points (3-5 key benefits of the lead magnet)
- Visual mockup description (ebook cover, checklist preview, etc.)
- Form: Name + Email
- CTA button: First-person action ("Get My Free [Resource]")
- Trust elements: privacy note, social proof micro-element

**Validation:** Opt-in page has Hook-Story-Offer with clear value exchange and compelling CTA.

### Step 4: Thank You / Bridge Page
**Introduce the Attractive Character and bridge to the next offer.**

Purpose: This is NOT a dead-end "check your email" page. It is a strategic bridge.

Content:
- Confirmation: "Your [resource] is on its way!"
- Attractive Character introduction: short video script or text
- Bridge to next offer: "While you wait, I want to share something..."
- Preview of the next step in the Value Ladder
- Soft CTA to the next offer (tripwire or core offer)

**Validation:** Thank you page introduces Attractive Character and bridges to next offer.

### Step 5: Sales Page - Perfect Webinar Script or Slippery Slide
**Write the core sales page based on funnel type.**

**If Webinar Funnel:** Apply Brunson Perfect Webinar Script (3 parts):

Part 1 - The Big Domino:
- Identify the ONE belief that, if they believe it, makes all other objections irrelevant
- State the Big Domino statement

Part 2 - The 3 Secrets:
- Secret 1: The Vehicle (why THIS solution)
  - Epiphany Bridge story for the vehicle
- Secret 2: Internal Beliefs (why THEY can do it)
  - Epiphany Bridge story for internal belief
- Secret 3: External Beliefs (why NOW is the time)
  - Epiphany Bridge story for external belief

Part 3 - The Stack and Close:
- Stack slide (everything included with values)
- Price reveal
- Guarantee
- Urgency/scarcity
- CTA

**If Direct Sales:** Apply Sugarman Slippery Slide:
- Hook (first sentence)
- Engage (story/problem)
- Intrigue (mechanism)
- Relevance (benefits + triggers)
- CTA (close with urgency)

**Validation:** Sales page follows the correct framework (Perfect Webinar or Slippery Slide) completely.

### Step 6: Order Form - Stack Slide + Guarantee + Scarcity
**Create the checkout experience that reinforces the decision.**

Elements:
- **Order Summary:** Recap of what they get
- **Stack Slide:** Visual value stack
  ```
  Component 1: {name} .............. Value: ${amount}
  Component 2: {name} .............. Value: ${amount}
  Bonus 1: {name} .................. Value: ${amount}
  Bonus 2: {name} .................. Value: ${amount}
  ─────────────────────────────────────────────
  Total Value: ${total}
  Your Price Today: ${price}
  ```
- **Guarantee:** Named guarantee with specifics (duration, terms, ease)
- **Scarcity:** Limited time, limited quantity, or bonus expiration
- **Trust Signals:** Secure checkout badge, testimonial, payment logos
- **Order Bump** (optional): Small add-on offer on the checkout form

**Validation:** Order form has stack slide, guarantee, scarcity, and trust signals.

### Step 7: Upsell Page - One-Time-Offer with Epiphany Bridge
**Create the immediate post-purchase upsell.**

Structure:
- **Hook:** "Wait! Your order is not complete yet..."
- **Epiphany Bridge (simplified):** Short story about WHY this additional offer matters
- **The Offer:** What they get + why it complements the main purchase
- **One-Time-Offer framing:** "This is only available RIGHT NOW on this page"
- **Price anchoring:** Show value vs. price
- **Two CTA buttons:**
  - "YES! Add this to my order for just ${price}"
  - "No thanks, I will pass on this opportunity"

**Validation:** Upsell page uses OTO framing with Epiphany Bridge and two clear CTAs.

### Step 8: Downsell Page
**Create the fallback offer for those who declined the upsell.**

Options:
- **Reduced version:** Same product, fewer features, lower price
- **Payment plan:** Same product, split into installments
- **Alternative:** Different but complementary offer at lower price

Structure:
- Acknowledge the decline: "I understand, maybe {upsell} is not for you right now..."
- Present the alternative: "But what about..."
- Lower barrier: reduced price, payment plan, or simpler version
- Same two-button CTA format

**Validation:** Downsell page offers a legitimate alternative with lower barrier to entry.

### Step 9: Email Follow-up - Chaperon SOS + Settle Daily
**Write email sequences for both paths: bought and did not buy.**

**For Non-Buyers (Chaperon SOS - Soap Opera Sequence):**

| Email | Day | Content |
|-------|-----|---------|
| Email 1 | Day 0 | Deliver lead magnet + set stage |
| Email 2 | Day 1 | High drama open + Backstory (Epiphany Bridge) |
| Email 3 | Day 2 | Epiphany moment + Wall (the obstacle) |
| Email 4 | Day 3 | Hidden benefit + turning point |
| Email 5 | Day 4 | Urgency + scarcity + CTA to offer |

**For All Subscribers (Settle Daily - Ongoing Nurture):**

| Email | Frequency | Content |
|-------|-----------|---------|
| Daily Email Template | Daily/3x week | Hook (subject line curiosity) -> Story (Attractive Character parable) -> Lesson -> CTA (soft sell to next Value Ladder step) |

Email principles:
- Subject lines: curiosity-driven, personal, never clickbait
- Each email tells ONE story with ONE lesson
- CTA is always natural, never forced
- Attractive Character voice throughout
- Reference Seinfeld style: entertaining + valuable

**Validation:** SOS sequence complete (5 emails) + Daily email template with 3 examples.

### Step 10: Review - Wiebe Seven Sweeps + Cialdini 7 Principles
**Run the final quality audit on every page and the funnel as a whole.**

**Page-Level Audit (Wiebe Seven Sweeps):**

Run on EACH page individually:

| Sweep | Opt-in | Thank You | Sales | Order | Upsell | Downsell |
|-------|--------|-----------|-------|-------|--------|----------|
| Clarity | | | | | | |
| Voice | | | | | | |
| So What | | | | | | |
| Prove It | | | | | | |
| Specificity | | | | | | |
| Emotion | | | | | | |
| Zero Risk | | | | | | |

**Funnel-Level Audit (Cialdini 7 Principles):**

| Principle | Where in Funnel | Strength | Notes |
|-----------|----------------|----------|-------|
| Reciprocity | Lead magnet, free value | | |
| Commitment/Consistency | Opt-in, micro-commitments | | |
| Social Proof | Sales page, testimonials | | |
| Authority | Attractive Character, credentials | | |
| Liking | Stories, Attractive Character flaws | | |
| Scarcity | Order form, upsell OTO | | |
| Unity | Community, shared identity | | |

Fix any failing sweeps or weak principles before completing.

**Validation:** All pages pass Seven Sweeps. All 7 Cialdini principles present at Medium or Strong.

---

## Output Format

### Section 1: Funnel Architecture

```markdown
## Funnel Map: {product_name}

### Funnel Type: {type}
### Value Ladder Position: {position}

### Page Flow:
{opt-in} -> {thank you/bridge} -> {sales page} -> {order form} -> {upsell} -> {downsell} -> {thank you}

### Value Ladder:
[FREE] {name} -> [LOW] {name} -> [MID] {name} -> [HIGH] {name}
```

### Section 2: Attractive Character Profile

```markdown
## Attractive Character

### Identity Type: {Leader | Adventurer | Reporter | Reluctant Hero}

### Backstory
{origin story}

### Parables
1. {teaching story 1}
2. {teaching story 2}
3. {teaching story 3}

### Character Flaws
{relatable imperfections}

### Polarity
{strong stance - what you stand FOR and AGAINST}
```

### Section 3: Funnel Pages Copy

```markdown
## Page 1: Opt-in Page
**Headline:** {headline}
**Subheadline:** {subheadline}
**Bullets:**
- {benefit 1}
- {benefit 2}
- {benefit 3}
**CTA Button:** {button text}
**Trust Element:** {privacy/proof}

---

## Page 2: Thank You / Bridge Page
{copy}

---

## Page 3: Sales Page
### Hook
{hook}
### Story
{story using appropriate framework}
### Offer
{offer details}
### Stack Slide
{value stack}
### Guarantee
{guarantee details}
### CTA
{call to action}

---

## Page 4: Order Form
{order form copy}

---

## Page 5: Upsell (OTO)
{upsell copy}

---

## Page 6: Downsell
{downsell copy}
```

### Section 4: Email Sequences

```markdown
## Soap Opera Sequence (Non-Buyers)

### Email 1: Delivery + Stage Setting
**Subject:** {subject}
**Body:** {copy}

(Repeat for Emails 2-5)

---

## Daily Email Template (All Subscribers)

### Template Structure:
**Subject:** {curiosity hook}
**Hook:** {opening line}
**Story:** {Attractive Character parable}
**Lesson:** {teaching point}
**CTA:** {soft sell to next ladder step}

### Example Emails:
(3 complete examples)
```

### Section 5: Audits

```markdown
## Seven Sweeps Audit (Per Page)
{sweep table for each page}

## Cialdini 7 Principles Audit (Full Funnel)
{principles table}

## Funnel Visual Map
{ASCII or text-based funnel flow diagram}
```

---

## Tools

**External/shared resources used by this task:**

- **Tool:** Brunson Value Ladder
  - **Purpose:** Map product positioning and ascension path
  - **Source:** Agent knowledge base (russell-brunson agent)

- **Tool:** Brunson Attractive Character
  - **Purpose:** Define brand voice and storytelling character
  - **Source:** Agent knowledge base (russell-brunson agent)

- **Tool:** Brunson Hook-Story-Offer
  - **Purpose:** Page-level copy structure
  - **Source:** Agent knowledge base (russell-brunson agent)

- **Tool:** Brunson Perfect Webinar Script
  - **Purpose:** Webinar and sales page framework (Big Domino + 3 Secrets)
  - **Source:** Agent knowledge base (russell-brunson agent)

- **Tool:** Brunson Epiphany Bridge
  - **Purpose:** Story construction for belief shifts
  - **Source:** Agent knowledge base (russell-brunson agent)

- **Tool:** Sugarman Slippery Slide
  - **Purpose:** Direct sales page framework (alternative to Perfect Webinar)
  - **Source:** Agent knowledge base (joe-sugarman agent)

- **Tool:** Chaperon Soap Opera Sequence (SOS)
  - **Purpose:** Non-buyer email follow-up sequence structure
  - **Source:** Agent knowledge base (andre-chaperon agent)

- **Tool:** Settle Daily Email Framework
  - **Purpose:** Ongoing nurture email structure
  - **Source:** Agent knowledge base (ben-settle agent)

- **Tool:** Wiebe Seven Sweeps
  - **Purpose:** Page-level conversion audit
  - **Source:** Agent knowledge base (joanna-wiebe agent)

- **Tool:** Cialdini 7 Principles
  - **Purpose:** Funnel-level persuasion audit
  - **Source:** Agent knowledge base (robert-cialdini agent)

- **Tool:** Caples Headline Formulas
  - **Purpose:** Headline generation for opt-in and sales pages
  - **Source:** Agent knowledge base (john-caples agent)

---

## Error Handling

**Strategy:** retry

**Common Errors:**

1. **Error:** Funnel Type Mismatch
   - **Cause:** Page structure does not match the selected funnel_type
   - **Resolution:** Verify page count and sequence against funnel type table
   - **Recovery:** Add missing pages or remove unnecessary ones per funnel type spec

2. **Error:** Value Ladder Gap
   - **Cause:** No logical progression between offers in the funnel
   - **Resolution:** Each step must naturally lead to the next (free -> low -> mid -> high)
   - **Recovery:** Adjust offer positioning or add bridge offers to fill gaps

3. **Error:** Attractive Character Inconsistent
   - **Cause:** Voice or personality shifts between pages/emails
   - **Resolution:** All copy must reflect the same Attractive Character profile
   - **Recovery:** Review all pages against the Attractive Character profile, unify voice

4. **Error:** Hook-Story-Offer Missing on a Page
   - **Cause:** A funnel page lacks the HSO framework structure
   - **Resolution:** Every page needs a hook (attention), story (engagement), and offer (action)
   - **Recovery:** Restructure the page to include all three HSO elements

5. **Error:** Email Sequence Disconnected from Funnel
   - **Cause:** Emails do not reference or continue the funnel narrative
   - **Resolution:** SOS must continue the Attractive Character story arc from the funnel
   - **Recovery:** Map email themes to funnel page themes for narrative continuity

6. **Error:** Perfect Webinar Script Incomplete
   - **Cause:** Missing Big Domino statement or one of the 3 Secrets
   - **Resolution:** All 3 parts required: Big Domino + 3 Secrets + Stack & Close
   - **Recovery:** Identify the missing component and add it with Epiphany Bridge story

7. **Error:** Weak Upsell/Downsell
   - **Cause:** OTO does not complement the main purchase or downsell is just "cheaper version"
   - **Resolution:** Upsell should accelerate results; downsell should offer a genuine alternative path
   - **Recovery:** Reframe the upsell as "results accelerator" and downsell as "different path to same goal"

8. **Error:** Seven Sweeps Fail on Critical Page
   - **Cause:** Sales page or opt-in fails one or more sweeps
   - **Resolution:** Fix failing sweep specifically before proceeding
   - **Recovery:** Iterate on the failing criteria until it passes, then re-sweep adjacent sections

---

## Performance

**Expected Metrics:**

```yaml
duration_expected: 60-120 min (estimated)
cost_estimated: $0.08-0.25
token_usage: ~15,000-40,000 tokens
```

**Optimization Notes:**
- Complete Value Ladder and Attractive Character BEFORE writing any page copy
- Write pages in funnel sequence order (opt-in first, downsell last)
- Generate headlines in batch for opt-in and sales pages
- Write email sequences after all pages are complete (emails reference page content)
- Run page-level audits (Seven Sweeps) as each page is completed
- Run funnel-level audit (Cialdini) only after all pages and emails are complete

---

## Metadata

```yaml
story: N/A
version: 1.0.0
squad: copywriting-masters
dependencies:
  agents:
    - russell-brunson
    - joe-sugarman
    - john-caples
    - andre-chaperon
    - ben-settle
    - joanna-wiebe
    - robert-cialdini
  tasks:
    - write-headlines.md
    - write-landing-page.md
  checklists: []
tags:
  - funnel
  - copywriting
  - value-ladder
  - hook-story-offer
  - direct-response
  - email-sequence
  - conversion
updated_at: 2026-02-11
```

---

## Notes

- Brunson's core insight: "You are one funnel away." Every business problem is a funnel problem.
- The Value Ladder is not optional. Without it, you are selling a single product instead of building a business.
- The Attractive Character is the secret weapon. People buy from people, not from companies.
- Hook-Story-Offer applies to EVERY page. Even a simple opt-in page has a hook, a micro-story, and an offer.
- The Perfect Webinar Script works for sales pages too -- it is not limited to live webinars.
- The Big Domino concept: find the ONE belief that, if true, makes all objections irrelevant.
- Epiphany Bridge stories create belief shifts. Use them for each of the 3 Secrets in Perfect Webinar.
- SOS (Soap Opera Sequence) is the most powerful email sequence for converting non-buyers because it uses narrative tension.
- Daily emails (Settle style) build long-term relationships and create consistent sales over time.
- The upsell OTO should feel like a natural next step, not a separate pitch. "Now that you have X, you need Y to get results faster."
- Always map the funnel visually before writing copy. The architecture determines the copy structure.
- High-ticket funnels replace the order form with an application and call booking -- the copy must qualify, not just sell.
