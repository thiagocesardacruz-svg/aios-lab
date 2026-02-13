---

## Execution Modes

**Choose your execution mode:**

### 1. YOLO Mode - Fast, Autonomous (0-1 prompts)
- Kennedy executa pesquisa e escrita em fluxo continuo
- Minimal user interaction, maximum output
- **Best for:** Quando inputs do produto/audiencia ja estao claros

### 2. Interactive Mode - Balanced, Educational (5-10 prompts) **[DEFAULT]**
- Checkpoints em pesquisa, headline, body copy e review
- Explica frameworks sendo aplicados
- **Best for:** Primeira sales letter, aprendizado de direct response

### 3. Pre-Flight Planning - Comprehensive Upfront Planning
- Pesquisa profunda de mercado antes de escrever
- Analise competitiva e positioning
- **Best for:** High-ticket offers, mercados competitivos

**Parameter:** `mode` (optional, default: `interactive`)

---

## Task Definition (AIOS Task Format V1.0)

```yaml
task: Write Sales Letter
responsavel: "@dan-kennedy"
responsavel_type: agent
atomic_layer: task
elicit: true

Entrada:
  - campo: product_name
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: Must be non-empty product or service name

  - campo: target_audience
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: Description of ideal customer with demographics and psychographics

  - campo: main_benefit
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: The single most compelling benefit/transformation

  - campo: price_point
    tipo: string
    origem: User Input
    obrigatorio: false
    validacao: Numeric value or range

  - campo: awareness_level
    tipo: string
    origem: Elicitation
    obrigatorio: false
    validacao: "most-aware | product-aware | solution-aware | problem-aware | unaware"

  - campo: existing_proof
    tipo: string
    origem: User Input
    obrigatorio: false
    validacao: Testimonials, case studies, data points available

  - campo: competitors
    tipo: string
    origem: User Input
    obrigatorio: false

  - campo: unique_mechanism
    tipo: string
    origem: Elicitation
    obrigatorio: false
    validacao: What makes the solution work differently

Saida:
  - campo: sales_letter
    tipo: string
    destino: User display / file
    persistido: true

  - campo: headline_options
    tipo: array
    destino: User display
    persistido: true

  - campo: ps_options
    tipo: array
    destino: User display
    persistido: true

  - campo: word_count
    tipo: number
    destino: Metadata
    persistido: false
```

---

## Pre-Conditions

```yaml
pre-conditions:
  - [ ] Product/service name provided
    tipo: pre-condition
    blocker: true
    error_message: "Cannot write sales letter without knowing what is being sold."
  - [ ] Target audience defined
    tipo: pre-condition
    blocker: true
    error_message: "Cannot write compelling copy without knowing WHO we are writing to."
  - [ ] Main benefit/transformation articulated
    tipo: pre-condition
    blocker: true
    error_message: "Need the core promise - what transformation does the customer get?"
```

---

## Post-Conditions

```yaml
post-conditions:
  - [ ] Sales letter contains all structural elements (headline, opening, body, offer, close, PS)
    tipo: post-condition
    blocker: true
    error_message: "Sales letter is incomplete - missing structural elements."
  - [ ] At least 3 headline options provided
    tipo: post-condition
    blocker: true
    error_message: "Must provide minimum 3 headline variations."
  - [ ] At least 2 P.S. options provided
    tipo: post-condition
    blocker: false
    error_message: "Should provide P.S. variations."
  - [ ] Proof elements included in body copy
    tipo: post-condition
    blocker: true
    error_message: "Sales letter lacks proof elements - add testimonials, data, or case studies."
```

---

## Acceptance Criteria

```yaml
acceptance-criteria:
  - [ ] Headline passes the "Would I stop scrolling?" test
    tipo: acceptance-criterion
    blocker: true
  - [ ] Opening hooks reader within first 3 sentences
    tipo: acceptance-criterion
    blocker: true
  - [ ] Body copy follows logical persuasion sequence
    tipo: acceptance-criterion
    blocker: true
  - [ ] Offer is clearly stated with value stack
    tipo: acceptance-criterion
    blocker: true
  - [ ] CTA is specific, urgent, and actionable
    tipo: acceptance-criterion
    blocker: true
  - [ ] P.S. restates key benefit or adds urgency
    tipo: acceptance-criterion
    blocker: true
```

---

## Checklist

- [ ] Pesquisa de mercado (Kennedy 10 Smart Market Diagnosis Questions)
- [ ] Analise de awareness (Schwartz 5 Levels)
- [ ] Definir headline (Caples 35 Formulas)
- [ ] Aplicar PAS ou AIDA como estrutura primaria
- [ ] Escrever body copy com Kennedy 29 Steps
- [ ] Incluir proof elements (Makepeace 18 Proof Strategies)
- [ ] Criar oferta irresistivel com value stack
- [ ] Escrever P.S. estrategico (Kennedy Step 14)
- [ ] Aplicar Kennedy 27 Copy Cosmetic Enhancements
- [ ] Review com Carlton SWS 17-point checklist
- [ ] Review com Wiebe Seven Sweeps

---

# Write Sales Letter

## Purpose

Escrever uma sales letter completa de direct response, aplicando os frameworks comprovados de Dan Kennedy (29 Steps, 27 Copy Cosmetics, 10 Smart Questions), com headline options usando Caples 35 Formulas, proof stack via Makepeace 18 Strategies, e review final com Carlton SWS 17-point checklist.

## Prerequisites

- Produto/servico claramente definido
- Publico-alvo identificado (quanto mais especifico, melhor a copy)
- Beneficio principal / transformacao articulada
- Idealmente: proof elements disponiveis (testimonials, dados, estudos)

## Interactive Elicitation Process

### Step 1: Research - Kennedy 10 Smart Market Diagnosis Questions

```
ELICIT: Market Research (Kennedy 10 Questions)

Responda as 10 perguntas de diagnostico de mercado:

1. Qual e a DOR PRINCIPAL do seu prospect? (O que tira o sono dele?)
2. O que ele TEME que aconteca se nao resolver?
3. O que o deixa com RAIVA sobre este problema?
4. Quais sao as suas TOP 3 FRUSTRACOES diarias com isso?
5. Quais TENDENCIAS estao afetando o mercado dele?
6. O que ele SECRETAMENTE deseja mais do que tudo?
7. Existe um VIES de decisao que podemos alavancar?
8. Quem mais esta vendendo para esse prospect? (Concorrentes)
9. Qual LINGUAGEM especifica ele usa para descrever o problema?
10. Por que tentativas ANTERIORES de resolver falharam?

-> Estas respostas formam a base emocional de toda a sales letter
```

### Step 2: Awareness Check - Schwartz 5 Stages

```
PROCESS: Awareness Classification

Baseado nas respostas do Step 1, classificar:

[5] MOST AWARE    -> Lead com oferta direta, preco, deadline
[4] PRODUCT AWARE -> Lead com diferencial, prova, comparacao
[3] SOLUTION AWARE -> Lead com mecanismo unico, credibilidade
[2] PROBLEM AWARE  -> Lead com agitacao da dor, empatia
[1] UNAWARE        -> Lead com historia, identificacao, curiosidade

-> Awareness level determina o tipo de headline e abertura
```

### Step 3: Headline Creation - Caples 35 Formulas

```
PROCESS: Generate 10+ Headlines

Aplicar as formulas mais relevantes de Caples:
- How To [Benefit] Without [Pain]
- [Number] Ways to [Desired Outcome]
- The Secret of [Desired Result]
- Warning: [Fear-Based Hook]
- Who Else Wants [Desired Outcome]?
- They Laughed When I [Action]... But When I [Result]
- Do You Make These [Number] Mistakes in [Area]?
- [Testimony Format] "Quote Headline"
- If You [Condition], You Can [Benefit]
- Announcing [New/Different Approach]

OUTPUT: 10 headlines ranked by predicted impact
SELECT: Top 3 for final consideration
```

### Step 4: Opening - PAS or Collier Entry

```
PROCESS: Write Opening (first 300-500 words)

IF awareness >= solution-aware:
  Apply PAS (Problem-Agitation-Solution):
  - Problem: State the pain clearly
  - Agitation: Twist the knife - make them FEEL it
  - Solution: Introduce your answer

IF awareness <= problem-aware:
  Apply Collier "Enter the Conversation":
  - Match the mental dialogue already in their head
  - Use their exact language (from Kennedy Q9)
  - Build bridge from where they are to where you are taking them

RULE: First sentence must HOOK. No throat-clearing.
```

### Step 5: Body Copy - Kennedy 29 Steps (Core 15)

```
PROCESS: Write Body Copy

Follow Kennedy's sales letter framework:
1. Get attention (DONE - headline)
2. Identify the problem (DONE - opening)
3. Provide the solution
4. Present your credentials / why you
5. Show benefits (not features)
6. Give proof and testimonials
7. Make the offer
8. Explain your pricing rationale
9. Give a guarantee (risk reversal)
10. Inject urgency / scarcity
11. Call to action (be specific)
12. Give a warning (what happens if they dont act)
13. Close with confidence
14. Write compelling P.S. (Kennedy Creative P.S.)
15. Format with 27 Copy Cosmetics

IMPORTANT: Each step builds on the previous - maintain emotional momentum
```

### Step 6: Proof Stack - Makepeace 18 Proof Strategies

```
PROCESS: Build Proof Stack

Select and apply relevant proof types:
1. Specific testimonials with names and details
2. Case studies with before/after
3. Statistics and data points
4. Expert endorsements
5. Media mentions
6. Demonstration of mechanism
7. Credentials and track record
8. Guarantees as implicit proof
9. Specificity (exact numbers vs round numbers)
10. Third-party validation

RULE: Stack minimum 3 types of proof throughout the letter
RULE: Place strongest proof near the offer
```

### Step 7: Offer and Close

```
PROCESS: Construct Irresistible Offer

1. VALUE STACK:
   - Core product/service: ${value}
   - Bonus 1: {name} (value ${X})
   - Bonus 2: {name} (value ${X})
   - Bonus 3: {name} (value ${X})
   - Total Value: ${total}
   - Your Price: ${actual_price}

2. GUARANTEE:
   - Type: 30-day | 60-day | 90-day | lifetime
   - Framing: Risk-free, nothing-to-lose
   - Bold guarantee = stronger close

3. URGENCY/SCARCITY:
   - Deadline (real, with reason)
   - Limited quantity (if true)
   - Price increase (if planned)
   - Bonus removal (time-limited)

4. CTA:
   - Specific action: "Click the button below"
   - Restate key benefit in CTA
   - Reduce friction: "Takes 60 seconds"
```

### Step 8: P.S. - Kennedy Creative P.S.

```
PROCESS: Write Strategic P.S.

P.S. strategies (pick 2):
1. Restate the main benefit and CTA
2. Add a NEW benefit not mentioned in body
3. Restate the guarantee
4. Add social proof (quick testimonial)
5. Create urgency (deadline reminder)
6. Ask a provocative question
7. Add a personal note

OUTPUT: 2 P.S. options for user selection
```

### Step 9: Copy Cosmetics - Kennedy 27 Enhancements

```
PROCESS: Apply Visual Formatting

Kennedy 27 Copy Cosmetic Enhancements:
- Short paragraphs (2-4 lines max)
- Subheadlines every 3-5 paragraphs
- Bold key phrases and benefits
- Italics for emphasis and quotes
- Bullet points for benefit lists
- Numbered lists for steps/processes
- Indented paragraphs for quotes/testimony
- ALL CAPS sparingly for critical words
- Ellipsis... for suspense and flow
- Dashes -- for parenthetical emphasis
- Johnson boxes for key sections
- Pull quotes for testimonials
- Handwritten-style notes (simulated)
- Margin notes
- Color/highlight for CTA
- Varying line lengths
- White space as design element
```

### Step 10: Review - Carlton SWS 17-Point + Wiebe Seven Sweeps

```
PROCESS: Quality Review

CARLTON SWS 17-POINT CHECKLIST:
1. Does the headline stop them cold?
2. Is the opening impossible to stop reading?
3. Is the main promise crystal clear?
4. Are benefits concrete and specific?
5. Is proof compelling and varied?
6. Is the offer clearly stated?
7. Is the guarantee bold enough?
8. Is urgency real and compelling?
9. Is the CTA unmistakable?
10. Does the P.S. pull its weight?
11. Is the copy the right length?
12. Does it read smoothly out loud?
13. Are there any confusing sections?
14. Is there a clear single next step?
15. Does it pass the "So What?" test?
16. Would YOU buy from this letter?
17. Is there anything you can cut without losing impact?

WIEBE SEVEN SWEEPS:
1. Clarity sweep - Is every sentence clear?
2. Specificity sweep - Replace vague with specific
3. Emotion sweep - Does it FEEL something?
4. Voice sweep - Does it sound like a person?
5. Objection sweep - Are all objections handled?
6. Motivation sweep - Is there enough reason to act NOW?
7. Friction sweep - Is there anything blocking the action?

FAIL on any blocker item -> Revise before output
```

---

## Output Format

```markdown
# SALES LETTER: {product_name}

## Headline Options (Top 3)
1. {headline_1} [RECOMMENDED]
2. {headline_2}
3. {headline_3}

---

## Complete Sales Letter

[Selected Headline]

[Opening - 300-500 words]

[Body Copy - Kennedy 29 Steps]

[Proof Stack]

[Offer + Value Stack]

[Guarantee]

[CTA]

[P.S. Options]
- P.S. Option 1: {ps_1}
- P.S. Option 2: {ps_2}

---

## Metadata
- Word Count: {N}
- Awareness Level: {level}
- Primary Framework: Kennedy 29 Steps
- Proof Types Used: {list}
- Review Score: {Carlton SWS pass rate}/17
```

---

## Error Handling

**Strategy:** iterate-and-improve

**Common Errors:**

1. **Error:** Insufficient Product Information
   - **Cause:** User cannot provide enough detail about product/service
   - **Resolution:** Use Kennedy 10 Questions to extract latent knowledge
   - **Recovery:** Write with available info, mark sections needing user input as [FILL]

2. **Error:** No Proof Elements Available
   - **Cause:** New product without testimonials or case studies
   - **Resolution:** Use credibility-based proof (credentials, methodology, logic, guarantee-as-proof)
   - **Recovery:** Flag as "Proof Gap" and suggest proof-gathering strategy

3. **Error:** Awareness Level Unclear
   - **Cause:** Mixed audience or unclear market position
   - **Resolution:** Default to problem-aware (most versatile), use progressive disclosure
   - **Recovery:** Write modular sections that can be reordered for different awareness levels

4. **Error:** Sales Letter Too Long/Short
   - **Cause:** Mismatch between content depth and offer complexity
   - **Resolution:** Long copy for high-ticket/complex offers, short for simple/low-ticket
   - **Recovery:** Trim or expand based on price-point-to-length ratio

5. **Error:** Carlton Review Fails Multiple Points
   - **Cause:** Structural or persuasion weakness in the copy
   - **Resolution:** Iterate on failing points specifically, rewrite weak sections
   - **Recovery:** Maximum 2 revision passes, then output with notes on weak areas

---

## Performance

**Expected Metrics:**

```yaml
duration_expected: 15-30 min
cost_estimated: $0.02-0.08
token_usage: ~8,000-25,000 tokens
```

**Optimization Notes:**
- Research phase (Steps 1-2) can be cached for multiple variations
- Headline generation (Step 3) benefits from batch processing
- Review phase (Step 10) adds ~5 min but catches critical issues

---

## Metadata

```yaml
story: N/A
version: 1.0.0
squad: copywriting-masters
dependencies:
  agents:
    - dan-kennedy.md (primary)
    - gary-halbert.md (alternative)
    - clayton-makepeace.md (proof specialist)
    - john-carlton.md (review)
    - joanna-wiebe.md (review sweeps)
    - john-caples.md (headlines)
    - eugene-schwartz.md (awareness analysis)
    - robert-collier.md (opening - low awareness)
  checklists:
    - carlton-sws-17-point.md
    - kennedy-27-cosmetics.md
  frameworks:
    - Kennedy 29 Steps
    - Caples 35 Headline Formulas
    - Schwartz 5 Stages of Awareness
    - Makepeace 18 Proof Strategies
    - PAS (Problem-Agitation-Solution)
    - AIDA (Attention-Interest-Desire-Action)
tags:
  - sales-letter
  - direct-response
  - long-form-copy
  - dan-kennedy
updated_at: 2026-02-11
```
