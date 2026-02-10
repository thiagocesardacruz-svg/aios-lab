# Task: Market Analysis

## Objective
Entender o tamanho, dinâmica e tendências do mercado para validar a oportunidade.

## Context
Antes de construir, precisamos saber se o mercado existe, se está crescendo, e se há espaço para mais um player.

## Process

### Step 1: Market Definition
Defina claramente o mercado:

```markdown
## Market Scope

**Broad Market:** [Ex: Travel Technology]
**Target Market:** [Ex: AI tools for tourism SMEs]
**Niche:** [Ex: AI prompt packs for hotel managers]

**Geographic Focus:** [Global / Regional / Local]
**Time Horizon:** [2024-2027]
```

### Step 2: Market Sizing (TAM/SAM/SOM)

```
┌─────────────────────────────────────────┐
│  TAM - Total Addressable Market         │
│  Todo o mercado possível                │
│  $_____ / _____ empresas               │
├─────────────────────────────────────────┤
│  SAM - Serviceable Addressable Market   │
│  Mercado que podemos atender            │
│  $_____ / _____ empresas               │
├─────────────────────────────────────────┤
│  SOM - Serviceable Obtainable Market    │
│  Mercado que vamos capturar (realista)  │
│  $_____ / _____ empresas               │
└─────────────────────────────────────────┘
```

### Step 3: Market Trends

| Trend | Impact | Timeframe | Evidence |
|-------|--------|-----------|----------|
| [Trend 1] | High/Med/Low | Short/Med/Long | [Source] |
| [Trend 2] | | | |
| [Trend 3] | | | |

**Macro Trends:**
- Tecnológicas:
- Econômicas:
- Sociais:
- Regulatórias:

### Step 4: Market Maturity Assessment

Baseado no modelo de Eugene Schwartz:

| Level | Description | Your Market |
|-------|-------------|-------------|
| 1 - Pioneer | Market never seen solution like this | ☐ |
| 2 - Competition | Others entered, need to show better | ☐ |
| 3 - Saturation | Many similar promises, need mechanism | ☐ |
| 4 - Skeptical | Market doesn't believe, need proof | ☐ |
| 5 - Sophisticated | Seen everything, need identity/philosophy | ☐ |

**Your Assessment:** Level ___
**Implication:** _______________

### Step 5: Entry Barriers & Enablers

**Barriers:**
- [ ] Capital requirements
- [ ] Technical complexity
- [ ] Regulatory
- [ ] Network effects
- [ ] Brand/trust requirements

**Enablers:**
- [ ] Technology changes
- [ ] Market shifts
- [ ] Competitor weaknesses
- [ ] New distribution channels

## Output
- Market sizing (TAM/SAM/SOM)
- Trend analysis
- Maturity assessment
- Entry strategy implications

## Next Task
→ `04-competitor-mapping.md`

---

## Prompts de Apoio

### Para Market Sizing
```
Ajude-me a calcular o tamanho de mercado para:
[DESCRIÇÃO DO MERCADO]

Forneça estimativas para:
1. TAM (Total Addressable Market)
2. SAM (Serviceable Addressable Market)
3. SOM (Serviceable Obtainable Market - 3 anos)

Inclua:
- Metodologia de cálculo
- Fontes de dados
- Premissas utilizadas
- Range de estimativa (conservador/otimista)
```

### Para Trend Analysis
```
Analise as tendências do mercado de [MERCADO]:

1. Liste 5 tendências macro que impactam o setor
2. Para cada uma, indique:
   - Direção (crescente/decrescente)
   - Velocidade de mudança
   - Impacto no seu produto/serviço
   - Oportunidades e ameaças
3. Identifique 2-3 "sinais fracos" que podem se tornar tendências
```
