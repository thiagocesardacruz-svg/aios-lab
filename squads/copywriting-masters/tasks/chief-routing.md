---

## Execution Modes

**Choose your execution mode:**

### 1. YOLO Mode - Fast, Autonomous (0-1 prompts)
- Copy Chief analisa a missao e roteia automaticamente
- Minimal user interaction
- **Best for:** Missoes claras com deliverable obvio

### 2. Interactive Mode - Balanced, Educational (5-10 prompts) **[DEFAULT]**
- Diagnostico passo-a-passo com checkpoints
- Explica o racional de cada recomendacao
- **Best for:** Missoes complexas, multiplos deliverables

### 3. Pre-Flight Planning - Comprehensive Upfront Planning
- Analise completa do projeto antes de rotear
- Mapeamento de pipeline multi-copywriter
- **Best for:** Lancamentos, funnels completos, campanhas

**Parameter:** `mode` (optional, default: `interactive`)

---

## Task Definition (AIOS Task Format V1.0)

```yaml
task: Chief Routing
responsavel: "@copy-chief"
responsavel_type: agent
atomic_layer: task
elicit: true

Entrada:
  - campo: mission_description
    tipo: string
    origem: User Input
    obrigatorio: true
    validacao: Must be non-empty, describe the copy need

  - campo: deliverable_type
    tipo: string
    origem: Elicitation
    obrigatorio: true
    validacao: "sales-letter | email-single | email-sequence | vsl | sales-page | headlines | market-analysis | product-launch | funnel-copy | seo-content | content-marketing | webinar-script | quick-cash | conversion-optimization | strategy-8020 | direct-marketing | copy-review | brand-voice | persuasion-audit"

  - campo: target_audience
    tipo: string
    origem: User Input
    obrigatorio: false
    validacao: Description of the ideal customer/prospect

  - campo: awareness_level
    tipo: string
    origem: Elicitation
    obrigatorio: false
    validacao: "most-aware | product-aware | solution-aware | problem-aware | unaware"

  - campo: product_service
    tipo: string
    origem: User Input
    obrigatorio: false

  - campo: channel
    tipo: string
    origem: Elicitation
    obrigatorio: false
    validacao: "email | web | social | print | video | webinar | multi-channel"

Saida:
  - campo: recommended_copywriter
    tipo: string
    destino: Agent activation
    persistido: false

  - campo: justification
    tipo: string
    destino: User display
    persistido: false

  - campo: alternative_copywriter
    tipo: string
    destino: User display
    persistido: false

  - campo: pipeline
    tipo: array
    destino: Workflow orchestration
    persistido: false

  - campo: framework_recommendation
    tipo: string
    destino: Agent context
    persistido: false
```

---

## Pre-Conditions

**Purpose:** Validate prerequisites BEFORE routing execution (blocking)

**Checklist:**

```yaml
pre-conditions:
  - [ ] Mission description provided by user
    tipo: pre-condition
    blocker: true
    validacao: |
      Check mission_description is non-empty and contains actionable copy request
    error_message: "Pre-condition failed: No mission description provided. Ask user to describe what they need."
  - [ ] Squad agents are available (squad.yaml loaded)
    tipo: pre-condition
    blocker: true
    validacao: |
      Verify specialist-map from squad.yaml is accessible
    error_message: "Pre-condition failed: Cannot access specialist-map. Ensure squad.yaml is loaded."
```

---

## Post-Conditions

**Purpose:** Validate routing success AFTER task completes

**Checklist:**

```yaml
post-conditions:
  - [ ] Recommended copywriter identified with justification
    tipo: post-condition
    blocker: true
    validacao: |
      Verify recommended_copywriter is a valid agent from specialist-map
    error_message: "Post-condition failed: No valid copywriter recommendation generated."
  - [ ] Alternative copywriter identified
    tipo: post-condition
    blocker: false
    validacao: |
      Verify alternative_copywriter differs from primary recommendation
    error_message: "Post-condition warning: No alternative copywriter suggested."
```

---

## Acceptance Criteria

```yaml
acceptance-criteria:
  - [ ] Deliverable type correctly identified and mapped to specialist-map
    tipo: acceptance-criterion
    blocker: true
  - [ ] Primary copywriter recommendation matches deliverable expertise
    tipo: acceptance-criterion
    blocker: true
  - [ ] Justification explains WHY this copywriter is the best fit
    tipo: acceptance-criterion
    blocker: true
  - [ ] For complex missions, multi-copywriter pipeline is defined
    tipo: acceptance-criterion
    blocker: false
```

---

## Checklist

- [ ] Coletar descricao da missao
- [ ] Identificar tipo de deliverable
- [ ] Avaliar nivel de awareness do prospect (Schwartz 5 Levels)
- [ ] Identificar canal de distribuicao
- [ ] Consultar routing matrix (specialist-map do squad.yaml)
- [ ] Recomendar copywriter primario com justificativa
- [ ] Sugerir copywriter alternativo
- [ ] Se missao complexa, montar pipeline multi-copywriter
- [ ] Confirmar recomendacao com usuario
- [ ] Ativar copywriter recomendado

---

# Chief Routing

## Purpose

O Copy Chief (Maverick) analisa a missao do usuario, diagnostica o tipo de deliverable, avalia o contexto (audiencia, awareness, canal), consulta a routing matrix do squad e recomenda o copywriter especialista ideal para a missao. Para missoes complexas, monta um pipeline multi-copywriter com ordem de execucao.

## Prerequisites

- Squad copywriting-masters carregado com specialist-map acessivel
- Usuario tem uma missao/necessidade de copy definida (mesmo que vaga)
- Copy Chief (Maverick) ativado como agente orquestrador

## Interactive Elicitation Process

### Step 1: Diagnostico da Missao

```
ELICIT: Mission Analysis

1. Descreva sua missao de copy:
   O que voce precisa? Qual o objetivo?
   (Ex: "Preciso vender meu curso online", "Quero uma sequencia de emails para lancamento")

2. Qual o tipo de deliverable?
   [1] Sales Letter (carta de vendas longa)
   [2] Email unico
   [3] Sequencia de emails
   [4] VSL (Video Sales Letter)
   [5] Sales Page / Landing Page
   [6] Headlines / Subject Lines
   [7] Lancamento (Product Launch)
   [8] Funnel completo
   [9] Conteudo SEO
   [10] Webinar Script
   [11] Copy Review / Auditoria
   [12] Outro (descreva)

   -> Mapeia para: specialist-map key do squad.yaml
```

### Step 2: Analise de Contexto

```
ELICIT: Context Analysis

1. Qual e o produto/servico?
   Nome, tipo, faixa de preco

2. Quem e o publico-alvo?
   Demografia, dores, desejos, linguagem

3. Nivel de awareness do prospect (Schwartz):
   [1] Most Aware - Ja conhece seu produto, so precisa do deal
   [2] Product Aware - Conhece seu produto, nao esta convencido
   [3] Solution Aware - Sabe que solucoes existem, nao conhece a sua
   [4] Problem Aware - Sente a dor, nao conhece solucoes
   [5] Unaware - Nao sabe que tem o problema

4. Canal de distribuicao:
   [1] Email
   [2] Web (landing page, blog)
   [3] Social Media
   [4] Video (YouTube, VSL)
   [5] Webinar
   [6] Multi-channel
```

### Step 3: Consulta ao Routing Matrix

```
PROCESS: Routing Matrix Lookup

specialist-map:
  sales-letter:         [dan-kennedy, gary-halbert, clayton-makepeace, robert-collier]
  email-single:         [ben-settle, laura-belgray]
  email-sequence:       [andre-chaperon, ben-settle, laura-belgray]
  vsl:                  [jon-benson, stefan-georgi]
  sales-page:           [joe-sugarman, joanna-wiebe, clayton-makepeace]
  headlines:            [john-caples, eugene-schwartz]
  market-analysis:      [eugene-schwartz, robert-cialdini]
  product-launch:       [jeff-walker, russell-brunson, frank-kern]
  funnel-copy:          [russell-brunson, jeff-walker, frank-kern]
  seo-content:          [brian-dean, ann-handley]
  content-marketing:    [ann-handley, brian-dean]
  persuasion-audit:     [robert-cialdini, eugene-schwartz]
  brand-voice:          [laura-belgray, ann-handley]
  quick-cash:           [frank-kern, dan-kennedy]
  conversion-optimization: [joanna-wiebe, perry-marshall]
  webinar-script:       [russell-brunson, jon-benson]
  strategy-8020:        [perry-marshall, dan-kennedy]
  direct-marketing:     [drayton-bird, dan-kennedy]
  copy-review:          [john-carlton, clayton-makepeace, joanna-wiebe]

RULES:
  - First agent in array = primary recommendation
  - Second agent = alternative
  - Awareness level may shift recommendation (unaware -> schwartz-first, most-aware -> closer-first)
  - Complex missions trigger pipeline mode
```

### Step 4: Recomendacao

```
OUTPUT FORMAT:

## Recomendacao do Copy Chief

**Missao:** {mission_description}
**Deliverable:** {deliverable_type}
**Awareness Level:** {awareness_level}

### Copywriter Recomendado
**@{recommended_copywriter}**
- Especialidade: {expertise_area}
- Framework principal: {primary_framework}
- Justificativa: {why_this_copywriter}

### Alternativa
**@{alternative_copywriter}**
- Quando usar: {when_to_use_alternative}

### Pipeline (se aplicavel)
1. @{agent_1} - {role_in_pipeline} - {deliverable}
2. @{agent_2} - {role_in_pipeline} - {deliverable}
3. @{agent_3} - {role_in_pipeline} - {deliverable}

### Proximo Passo
Confirme para ativar @{recommended_copywriter} ou escolha a alternativa.
```

### Step 5: Ativacao

```
ELICIT: Confirmation

Confirma a ativacao de @{recommended_copywriter} para esta missao?
[1] Sim, ativar recomendado
[2] Usar alternativa @{alternative_copywriter}
[3] Quero outro especialista (listar opcoes)
[4] Montar pipeline customizado

-> On confirmation: Activate selected copywriter with mission context
```

---

## Error Handling

**Strategy:** fallback-with-guidance

**Common Errors:**

1. **Error:** Deliverable Type Not Recognized
   - **Cause:** User described a deliverable that does not map to specialist-map
   - **Resolution:** Present full list of available deliverables and ask user to choose
   - **Recovery:** Map to closest category or suggest copy-review for general assessment

2. **Error:** Ambiguous Mission
   - **Cause:** Mission description too vague to determine deliverable type
   - **Resolution:** Ask targeted follow-up questions to narrow down
   - **Recovery:** Default to copy-review with john-carlton for diagnostic

3. **Error:** Complex Multi-Deliverable Mission
   - **Cause:** Mission requires multiple deliverable types (e.g., full launch)
   - **Resolution:** Decompose into pipeline steps with appropriate specialists
   - **Recovery:** Create ordered pipeline with handoff points between copywriters

4. **Error:** Awareness Level Unknown
   - **Cause:** User cannot determine prospect awareness level
   - **Resolution:** Use diagnostic questions to infer awareness
   - **Recovery:** Default to problem-aware (most common) and adjust during copy creation

---

## Performance

**Expected Metrics:**

```yaml
duration_expected: 2-5 min
cost_estimated: $0.002-0.005
token_usage: ~1,000-3,000 tokens
```

**Optimization Notes:**
- Cache specialist-map in session for repeated routing
- For returning users, remember previous deliverable preferences
- Pipeline mode adds ~2 min for decomposition

---

## Metadata

```yaml
story: N/A
version: 1.0.0
squad: copywriting-masters
dependencies:
  agents:
    - copy-chief.md
  data:
    - squad.yaml (specialist-map)
tags:
  - routing
  - orchestration
  - diagnostico
  - copy-chief
updated_at: 2026-02-11
```
