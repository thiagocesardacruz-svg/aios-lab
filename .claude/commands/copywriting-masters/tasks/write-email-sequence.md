---

## Execution Modes

**Choose your execution mode:**

### 1. YOLO Mode - Fast, Autonomous (0-1 prompts)
- Chaperon escreve a sequencia completa com SOS framework
- Minimal user interaction, full open-loop architecture
- **Best for:** Quando tipo de sequencia e audiencia ja estao definidos

### 2. Interactive Mode - Balanced, Educational (5-10 prompts) **[DEFAULT]**
- Checkpoints no planejamento, emotional journey e cada email
- Explica open loops e Zeigarnik Effect
- **Best for:** Primeira sequencia, aprendizado de email storytelling

### 3. Pre-Flight Planning - Comprehensive Upfront Planning
- Mapeamento completo da jornada emocional antes de escrever
- Outline detalhado de todos os open loops
- **Best for:** Launch sequences, sequencias longas (7+ emails)

**Parameter:** `mode` (optional, default: `interactive`)

---

## Task Definition (AIOS Task Format V1.0)

```yaml
task: Write Email Sequence
responsavel: "@andre-chaperon"
responsavel_type: agent
atomic_layer: task
elicit: true

Entrada:
  - campo: sequence_type
    tipo: string
    origem: Elicitation
    obrigatorio: true
    validacao: "soap-opera | welcome | launch | nurture | re-engagement"

  - campo: product_name
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: Must be non-empty product or service name

  - campo: num_emails
    tipo: number
    origem: User Input
    obrigatorio: false
    validacao: "default: 5, min: 3, max: 12"

  - campo: target_audience
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: Description of ideal subscriber/prospect

  - campo: emotional_temperature
    tipo: string
    origem: Elicitation
    obrigatorio: false
    validacao: "cold | warm | hot"

  - campo: primary_cta
    tipo: string
    origem: User Input
    obrigatorio: false
    validacao: Where are we sending them? (sales page, webinar, call, etc.)

  - campo: brand_voice
    tipo: string
    origem: Elicitation
    obrigatorio: false
    validacao: "formal | conversational | provocative | empathetic | authoritative"

Saida:
  - campo: email_sequence
    tipo: array
    destino: User display / file
    persistido: true

  - campo: subject_lines
    tipo: array
    destino: User display
    persistido: true

  - campo: open_loops_map
    tipo: object
    destino: Reference / metadata
    persistido: true

  - campo: emotional_journey_map
    tipo: object
    destino: Reference / metadata
    persistido: true
```

---

## Pre-Conditions

```yaml
pre-conditions:
  - [ ] Sequence type selected (soap-opera, welcome, launch, nurture, re-engagement)
    tipo: pre-condition
    blocker: true
    error_message: "Cannot write sequence without knowing the type. Choose: soap-opera | welcome | launch | nurture | re-engagement"
  - [ ] Product/service identified
    tipo: pre-condition
    blocker: true
    error_message: "Need product/service context to write relevant emails."
  - [ ] Target audience defined
    tipo: pre-condition
    blocker: true
    error_message: "Cannot write compelling emails without knowing the subscriber profile."
```

---

## Post-Conditions

```yaml
post-conditions:
  - [ ] All emails in sequence written with complete structure
    tipo: post-condition
    blocker: true
    error_message: "Sequence incomplete - not all emails were written."
  - [ ] Each email has at least 2 subject line options
    tipo: post-condition
    blocker: true
    error_message: "Each email needs minimum 2 subject line options."
  - [ ] Open loops are mapped and resolved across the sequence
    tipo: post-condition
    blocker: true
    error_message: "Open loops must be tracked - some loops may be left unresolved."
  - [ ] Emotional journey follows planned arc
    tipo: post-condition
    blocker: false
    error_message: "Emotional temperature should progress as planned."
```

---

## Acceptance Criteria

```yaml
acceptance-criteria:
  - [ ] Each email can stand alone AND build on the sequence
    tipo: acceptance-criterion
    blocker: true
  - [ ] Open loops create genuine anticipation for next email
    tipo: acceptance-criterion
    blocker: true
  - [ ] Subject lines would get opened (pass the "inbox test")
    tipo: acceptance-criterion
    blocker: true
  - [ ] CTA is present in appropriate emails (not all need hard CTA)
    tipo: acceptance-criterion
    blocker: true
  - [ ] Emotional ratio maintained: ~50% emotion, ~25% logic, ~25% urgency
    tipo: acceptance-criterion
    blocker: false
```

---

## Checklist

- [ ] Definir tipo de sequencia
- [ ] Coletar informacoes do produto e audiencia
- [ ] Mapear jornada emocional (50% emocao, 25% logica, 25% urgencia)
- [ ] Projetar open loops entre emails (Zeigarnik Effect)
- [ ] Escrever Email 1: Set The Stage
- [ ] Escrever Email 2: High Drama
- [ ] Escrever Email 3: Epiphany
- [ ] Escrever Email 4: Hidden Benefits
- [ ] Escrever Email 5: Urgency CTA
- [ ] Criar subject lines com Belgray Subject Line Formulas
- [ ] Review com EFAB checklist (Belgray)
- [ ] Review com ETS checklist (Belgray)
- [ ] Validar open loops map (all loops resolved or intentionally left open)

---

# Write Email Sequence

## Purpose

Escrever uma sequencia de emails completa usando o Soap Opera Sequence (SOS) de Andre Chaperon como framework narrativo principal, com subject lines aplicando Laura Belgray formulas, voz adaptavel usando Belgray/Settle principles, e open loops estrategicos baseados no Zeigarnik Effect para maximizar open rates e engajamento ao longo da sequencia.

## Prerequisites

- Tipo de sequencia definido (SOS para storytelling, Settle para daily, Belgray para voz)
- Produto/servico e oferta claros
- Publico-alvo e temperatura emocional identificados
- CTA principal definido (para onde os emails levam)

## Interactive Elicitation Process

### Step 1: Sequence Planning

```
ELICIT: Sequence Configuration

1. Qual tipo de sequencia?
   [1] Soap Opera Sequence (SOS) - Storytelling que vende (Chaperon)
       Best for: Launches, onboarding com narrativa, educacao + venda
   [2] Welcome Sequence - Primeiros emails apos opt-in
       Best for: Novos subscribers, construir rapport
   [3] Launch Sequence - Pre-launch, launch, cart close
       Best for: Product launches, promotions com deadline
   [4] Nurture Sequence - Relacionamento de longo prazo
       Best for: Listas frias, educacao, autoridade
   [5] Re-engagement Sequence - Reativar subscribers inativos
       Best for: Listas dormentes, win-back

2. Quantos emails na sequencia?
   Default: 5 (ideal para SOS)
   Range: 3-12

3. Qual a temperatura do lead?
   [1] Cold - Nao te conhece, acabou de entrar na lista
   [2] Warm - Te conhece, consumiu conteudo, mas nao comprou
   [3] Hot - Ja demonstrou interesse, quase comprou

4. Qual o CTA principal? (Para onde os emails levam?)
   Ex: Sales page, webinar registration, call booking, reply

5. Qual a voz/tom desejado?
   [1] Formal/Autoritativo
   [2] Conversacional/Amigavel (Belgray style)
   [3] Provocativo/Confrontador (Settle style)
   [4] Empatico/Story-driven (Chaperon style)
   [5] Mix customizado
```

### Step 2: Emotional Journey Map

```
PROCESS: Map Emotional Arc

Distribuicao emocional ao longo da sequencia (Chaperon principle):

EMAIL 1 (Emocao 80%):     [████████░░] Empatia, identificacao, curiosidade
EMAIL 2 (Emocao 90%):     [█████████░] Drama, tensao, cliffhanger
EMAIL 3 (Emocao 60%):     [██████░░░░] Revelacao, AHA moment, esperanca
EMAIL 4 (Logica 60%):     [░░░░██████] Prova, beneficios, racional
EMAIL 5 (Urgencia 70%):   [░░░░░░░███] Escassez, FOMO, ultima chance

RATIO TOTAL: ~50% emocao | ~25% logica | ~25% urgencia

For custom num_emails, distribute proportionally:
- First 50% of emails: Heavy emotion
- Next 25%: Logic and proof
- Final 25%: Urgency and close
```

### Step 3: Open Loops Design

```
PROCESS: Plan Open Loops (Zeigarnik Effect)

Open loops create unresolved tension that compels opening the next email.

LOOP ARCHITECTURE:
  Email 1: OPEN Loop A (main story) + OPEN Loop B (teaser)
  Email 2: PROGRESS Loop A + CLOSE Loop B + OPEN Loop C
  Email 3: CLOSE Loop A (epiphany) + OPEN Loop D
  Email 4: CLOSE Loop C + CLOSE Loop D + OPEN Loop E (urgency)
  Email 5: CLOSE Loop E + FINAL resolution

LOOP TYPES:
  - Story Loop: "Tomorrow I will tell you what happened next..."
  - Curiosity Loop: "There is one thing about {topic} most people miss..."
  - Benefit Loop: "In my next email, the strategy that changed everything..."
  - Identity Loop: "Are you a {type A} or {type B}? Tomorrow we find out..."
  - Cliffhanger Loop: "And then, just when I thought it was over..."

OUTPUT: Open Loops Map showing which loops open and close in each email
```

### Step 4: Email 1 - Set The Stage

```
PROCESS: Write Email 1

STRUCTURE (Chaperon SOS):
1. SUBJECT LINE: Curiosity-driven, no clickbait
2. OPENING: Enter the conversation (Collier)
   - "You know that feeling when..."
   - Identify with reader's current situation
3. BACKSTORY SETUP: Introduce the character (you or client)
   - Set the scene, time, place
   - Make the character relatable
4. THE WALL: Hint at the problem that was faced
   - Create emotional resonance
5. OPEN LOOP: Leave them wanting more
   - "Tomorrow, I will share what happened next..."
   - Specific enough to create anticipation
6. SIGN-OFF: Warm, personal

LENGTH: 300-500 words
CTA: None or soft (just "hit reply if this resonates")
TONE: Personal, vulnerable, story-driven
```

### Step 5: Email 2 - High Drama

```
PROCESS: Write Email 2

STRUCTURE:
1. SUBJECT LINE: Callback to Email 1 loop
2. BRIDGE: Quick recap of Email 1 ending
   - "Yesterday I told you about..."
3. THE CONFLICT: Full dramatic moment
   - Paint the worst moment
   - Make them FEEL the pain
   - Use sensory language
4. THE WALL (expanded): Everything seemed hopeless
   - Stack the obstacles
   - Show what was at stake
5. THE TURN: Hint at the breakthrough
   - "And then something unexpected happened..."
6. CLOSE Loop B from Email 1
7. OPEN Loop C: New curiosity element

LENGTH: 400-600 words
CTA: None or soft
TONE: Dramatic, emotional, cinematic
```

### Step 6: Email 3 - Epiphany

```
PROCESS: Write Email 3

STRUCTURE:
1. SUBJECT LINE: Promise of revelation
2. BRIDGE: "Remember the moment I described yesterday..."
3. THE DISCOVERY: The AHA moment
   - What changed everything
   - The insight, method, or shift
   - Make it feel earned (not sold)
4. CLOSE Loop A (main story resolution)
5. EDUCATION: Teach the principle
   - Connect the story to the reader's situation
   - "Here is why this matters for YOU..."
6. INTRODUCE THE SOLUTION (soft)
   - Not a hard sell - just connect the dots
7. OPEN Loop D: "But there is something most people miss about this..."

LENGTH: 400-600 words
CTA: Soft mention of product/solution
TONE: Enlightened, generous, insightful
```

### Step 7: Email 4 - Hidden Benefits

```
PROCESS: Write Email 4

STRUCTURE:
1. SUBJECT LINE: Intriguing benefit angle
2. BRIDGE: "After sharing my story, many people asked..."
3. SOCIAL PROOF: Testimonial or case study
   - Someone who applied the insight from Email 3
   - Specific results with numbers
4. HIDDEN BENEFITS: Non-obvious advantages
   - Things they would never expect
   - Second-order effects of the solution
5. CLOSE Loop C and Loop D
6. THE OFFER (first real pitch):
   - Introduce the product naturally
   - Frame as "if you want to shortcut this process..."
   - Link to sales page
7. OPEN Loop E: Urgency teaser
   - "I should mention this will not be available at this price for long..."

LENGTH: 500-700 words
CTA: Clear but not aggressive - first real link to offer
TONE: Logical, proof-driven, helpful
```

### Step 8: Email 5 - Urgency CTA

```
PROCESS: Write Email 5

STRUCTURE:
1. SUBJECT LINE: Urgency-driven (Belgray "last chance" formulas)
2. DIRECT OPENING: No story - get to the point
   - "This is my final email about {topic}..."
3. QUICK RECAP: What they learned across the sequence
   - Bullet the key insights from Emails 1-4
4. THE COST OF INACTION: What happens if they do nothing
   - Paint the "same place next year" picture
5. RESTATE THE OFFER: Full value stack
   - Everything included
   - Price vs value contrast
6. GUARANTEE: Risk reversal
7. CLOSE Loop E: Final deadline/scarcity
   - Specific time/date
   - What goes away
8. FINAL CTA: Strong, specific, repeated
   - "Click here to [specific action]"
   - Repeat CTA 2-3 times
9. CLOSE ALL REMAINING LOOPS

LENGTH: 400-600 words
CTA: Multiple, clear, urgent
TONE: Direct, urgent, caring (not desperate)
```

### Step 9: Subject Lines - Belgray Formulas

```
PROCESS: Create Subject Lines

Apply Laura Belgray Subject Line Formulas for each email:

FORMULA CATEGORIES:
  Curiosity:  "The thing about {X} nobody talks about"
  Story:      "What happened when I {unexpected action}"
  Benefit:    "How to {desired result} without {pain}"
  Urgency:    "Last chance: {specific thing expiring}"
  Personal:   "I probably should not tell you this"
  Question:   "Do you {common behavior}? Read this."
  Contrast:   "I used to {old way}. Now I {new way}."
  Specificity: "{Exact number/date/name} changed my mind"

OUTPUT per email: 2-3 subject line options
  - Option A: Primary (best predicted open rate)
  - Option B: Alternative angle
  - Option C: Preview text pairing suggestion

RULES:
  - Max 50 characters (mobile-friendly)
  - Lowercase preferred (Belgray style)
  - No spam trigger words
  - Must match email content (no false promises)
```

### Step 10: Review - EFAB + ETS Checklists

```
PROCESS: Quality Review

BELGRAY EFAB CHECKLIST (per email):
  E - ENGAGING: Would you actually READ this if it landed in your inbox?
  F - FUNNY/FRESH: Does it have personality? Does it sound human?
  A - ACTIONABLE: Is the next step clear (even if it is just "wait for tomorrow")?
  B - BRIEF-ENOUGH: Could any paragraph be cut without losing value?

BELGRAY ETS CHECKLIST (sequence level):
  E - EMOTIONAL ARC: Does the sequence take them on a journey?
  T - THROUGH-LINE: Is there a clear narrative thread connecting all emails?
  S - SELLING WITHOUT SELLING: Do they feel helped, not pitched?

CHAPERON SEQUENCE AUDIT:
  - [ ] Each email has at minimum 1 open loop
  - [ ] Loops resolve at appropriate times
  - [ ] Emotional temperature follows planned arc
  - [ ] Story is consistent across all emails
  - [ ] The "world" created in Email 1 persists through Email 5
  - [ ] CTA escalation is gradual (none -> soft -> clear -> urgent)

FAIL on any blocker -> Revise before output
```

---

## Output Format

```markdown
# EMAIL SEQUENCE: {product_name}
## Type: {sequence_type} | Emails: {num_emails} | Voice: {brand_voice}

---

## Open Loops Map

| Loop | Opens In | Closes In | Type |
|------|----------|-----------|------|
| A    | Email 1  | Email 3   | Story |
| B    | Email 1  | Email 2   | Curiosity |
| C    | Email 2  | Email 4   | Benefit |
| D    | Email 3  | Email 4   | Identity |
| E    | Email 4  | Email 5   | Urgency |

## Emotional Journey

| Email | Emotion % | Logic % | Urgency % | Temperature |
|-------|-----------|---------|-----------|-------------|
| 1     | 80        | 15      | 5         | Warm        |
| 2     | 90        | 5       | 5         | Hot         |
| 3     | 60        | 30      | 10        | Warm        |
| 4     | 30        | 60      | 10        | Cool        |
| 5     | 20        | 10      | 70        | Hot         |

---

## Email 1: {title}
**Subject Lines:**
- A: {subject_a}
- B: {subject_b}
**Preview Text:** {preview}
**Open Loops:** Opens [A, B]
**Word Count:** {N}

{full email body}

---

[Repeat for each email]

---

## Sequence Metadata
- Total Word Count: {N}
- Avg Email Length: {N} words
- Primary Framework: Chaperon SOS
- Subject Line Framework: Belgray Formulas
- Review: EFAB {pass/fail} | ETS {pass/fail}
```

---

## Error Handling

**Strategy:** adapt-and-continue

**Common Errors:**

1. **Error:** Sequence Type Mismatch
   - **Cause:** User wants a sequence type that does not fit their goal
   - **Resolution:** Recommend the best type based on goal analysis
   - **Recovery:** Offer hybrid approach (e.g., welcome + SOS elements)

2. **Error:** Open Loops Too Complex
   - **Cause:** Too many loops for the number of emails
   - **Resolution:** Limit to max 2 open loops per email, 1 main story loop
   - **Recovery:** Simplify loop architecture, focus on main narrative thread

3. **Error:** Emotional Arc Feels Flat
   - **Cause:** All emails at same emotional temperature
   - **Resolution:** Increase contrast between emails (high drama vs calm logic)
   - **Recovery:** Rewrite weakest emotional email first, then adjust adjacent emails

4. **Error:** Subject Lines Sound Spammy
   - **Cause:** Over-use of urgency words or clickbait patterns
   - **Resolution:** Apply Belgray "would I open this?" test
   - **Recovery:** Rewrite with lowercase, conversational, curiosity-driven approach

5. **Error:** CTA Escalation Too Aggressive
   - **Cause:** Hard selling too early in the sequence
   - **Resolution:** No CTA in emails 1-2, soft in 3, clear in 4-5
   - **Recovery:** Remove or soften early CTAs, save urgency for final email

---

## Performance

**Expected Metrics:**

```yaml
duration_expected: 20-40 min
cost_estimated: $0.03-0.10
token_usage: ~10,000-30,000 tokens
```

**Optimization Notes:**
- Planning phase (Steps 1-3) can be cached for sequence variations
- Each email averages 400-600 words of output
- Review phase adds ~5 min but ensures sequence coherence

---

## Metadata

```yaml
story: N/A
version: 1.0.0
squad: copywriting-masters
dependencies:
  agents:
    - andre-chaperon.md (primary - SOS framework)
    - ben-settle.md (alternative - daily email style)
    - laura-belgray.md (subject lines, voice, EFAB/ETS review)
  frameworks:
    - Chaperon Soap Opera Sequence (SOS)
    - Belgray Subject Line Formulas
    - Belgray EFAB Checklist
    - Belgray ETS Checklist
    - Zeigarnik Effect (Open Loops)
    - Collier Enter the Conversation
  principles:
    - "50% emotion, 25% logic, 25% urgency"
    - "Each email opens at least one loop"
    - "CTA escalation: none -> soft -> clear -> urgent"
tags:
  - email-sequence
  - soap-opera-sequence
  - storytelling
  - open-loops
  - andre-chaperon
  - email-marketing
updated_at: 2026-02-11
```
