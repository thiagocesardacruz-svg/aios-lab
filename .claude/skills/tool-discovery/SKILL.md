---
name: tool-discovery
description: |
  Tool Discovery - Descoberta inteligente de ferramentas com avaliação RICE/WSJF.

  Busca, avalia e registra ferramentas (MCPs, libs, frameworks, APIs) para todos os squads.
  Mantém registry global persistente, aprende preferências, e integra com o ecossistema AIOS.

  Usa RICE (Reach, Impact, Confidence, Effort) e WSJF (Weighted Shortest Job First)
  para priorização objetiva. Gera decision matrix visual.

  Use quando: precisar de ferramenta/lib/MCP, avaliar alternativas, ou consultar
  ferramentas já avaliadas anteriormente.

# Auto-routing configuration (opt-in)
auto_invoke: true
triggers:
  keywords:
    - "qual ferramenta"
    - "which tool"
    - "preciso de uma lib"
    - "need a library"
    - "melhor MCP para"
    - "best MCP for"
    - "avaliar ferramentas"
    - "compare tools"
    - "descobrir ferramenta"
    - "find tool"
    - "tool for"
    - "biblioteca para"
  patterns:
    - "(?i)what.*tool.*for"
    - "(?i)qual.*lib.*para"
    - "(?i)best.*framework"
    - "(?i)melhor.*package"
    - "(?i)mcp.*para"
agents_allowed: all
priority: medium
confirm_before_invoke: false
---

# Tool Discovery

Descoberta inteligente de ferramentas com avaliação RICE/WSJF.

## Overview

Este skill transforma a descoberta de ferramentas de um processo ad-hoc em um
sistema **acumulativo e inteligente**.

```
Antes: Cada agente pesquisa do zero → tempo perdido, decisões inconsistentes
Depois: Registry global + preferências aprendidas → decisões rápidas e consistentes
```

### Valor Transversal

| Squad/Agent | Como usa |
|-------------|----------|
| @devops | Descobrir MCPs, CI/CD tools |
| @architect | Avaliar frameworks, patterns |
| @dev | Encontrar packages, SDKs |
| @analyst | Ferramentas de análise |
| @qa | Testing frameworks |
| design-system | Component libraries |

## Tool Categories

```yaml
categories:
  mcp:
    description: Model Context Protocol servers
    install_via: @devops
    examples: [exa, context7, apify, playwright]

  library:
    description: Packages e dependências
    install_via: package manager
    examples: [react-query, zod, tailwind]

  framework:
    description: Frameworks de desenvolvimento
    install_via: project setup
    examples: [next.js, fastapi, supabase]

  api:
    description: APIs e serviços externos
    install_via: configuration
    examples: [stripe, sendgrid, openai]

  cli:
    description: Command-line tools
    install_via: system package manager
    examples: [gh, docker, vercel]

  saas:
    description: Serviços SaaS
    install_via: subscription
    examples: [clickup, notion, figma]
```

## RICE/WSJF Scoring

### RICE Score

```
RICE = (Reach × Impact × Confidence) / Effort

Reach:      Quantos squads/casos de uso se beneficiam? (1-10)
Impact:     Quanto melhora o workflow? (0.25=low, 0.5=med, 1=high, 2=massive)
Confidence: Quão certo estamos da avaliação? (0.5=low, 0.8=med, 1=high)
Effort:     Quanto esforço para adotar? (1=trivial, 3=medium, 5=high, 10=massive)
```

### WSJF Score (Alternativo)

```
WSJF = (Business Value + Time Criticality + Risk Reduction) / Job Size

Business Value:    Valor para o negócio (1-10)
Time Criticality:  Urgência de adoção (1-10)
Risk Reduction:    Quanto risco mitiga (1-10)
Job Size:          Esforço de implementação (1-10)
```

## Workflow

### Phase 1: Need Identification

```markdown
## Tool Discovery Request

Domain: {area de necessidade}
Current pain: {problema atual}
Ideal outcome: {resultado desejado}

### Registry Check
Existing tools in this category: [list from registry]
Previously evaluated: [list with scores]
```

### Phase 2: Discovery Search

```markdown
## Search Strategy

1. **Registry check** - Já avaliamos algo similar?
2. **Learning-loop check** - Preferências passadas?
3. **Deep search** - Se necessário:
   - WebSearch: "{domain} best tools 2025"
   - Context7: Library documentation
   - MCP catalog: docker mcp catalog ls

### Candidates Found
| Tool | Category | Source | Initial Fit |
|------|----------|--------|-------------|
| ... | ... | ... | ... |
```

### Phase 3: RICE Evaluation

```markdown
## RICE Evaluation

### Tool: {name}

| Factor | Score | Rationale |
|--------|-------|-----------|
| Reach | X/10 | {who benefits} |
| Impact | X | {how much improvement} |
| Confidence | X | {certainty level} |
| Effort | X/10 | {adoption effort} |

**RICE Score: {calculated}**

### Comparison Matrix
| Tool | Reach | Impact | Conf | Effort | RICE |
|------|-------|--------|------|--------|------|
| A | 8 | 1 | 0.8 | 3 | 2.13 |
| B | 6 | 2 | 0.8 | 5 | 1.92 |
| C | 10 | 0.5 | 1 | 2 | 2.50 |

**Recommendation:** Tool C (highest RICE)
```

### Phase 4: Decision & Registration

```markdown
## Decision

Selected: {tool_name}
Rationale: {why this one}
Next steps:
- [ ] Install/configure
- [ ] Document usage
- [ ] Add to squad tooling

### Registry Entry Created
ID: TOOL-{category}-{NNN}
Added to: .aios/tools/registry.yaml
```

## Storage Structure

```
.aios/tools/
├── registry.yaml           # Master registry of all tools
├── preferences.yaml        # Learned preferences by squad/agent
└── evaluations/
    ├── EVAL-2025-001.yaml  # Individual evaluation records
    └── ...
```

## Registry Schema

```yaml
# registry.yaml entry
tool:
  id: "TOOL-mcp-001"
  name: "context7"
  category: mcp
  description: "Library documentation lookup"

  scores:
    rice: 2.50
    wsjf: null  # if evaluated

  evaluation:
    date: "2025-02-11"
    evaluator: "@devops"
    evaluation_id: "EVAL-2025-001"

  adoption:
    status: "adopted"  # candidate | evaluated | adopted | deprecated
    adopted_date: "2025-02-11"
    used_by: [tech, deep-research]

  metadata:
    url: "https://github.com/..."
    docs: "https://..."
    install_command: "docker mcp enable context7"

  tags: [documentation, library, mcp]
```

## Commands

| Command | Description |
|---------|-------------|
| `*discover {domain}` | Full discovery pipeline for domain |
| `*evaluate {tool}` | RICE/WSJF evaluation of specific tool |
| `*compare {tool1} {tool2}` | Side-by-side comparison |
| `*registry` | Show full tool registry |
| `*registry --category mcp` | Filter by category |
| `*recommend {need}` | Get recommendation from registry |
| `*adopt {tool}` | Mark tool as adopted, delegate install |

## Integration Points

### With @devops

```yaml
integration:
  trigger: Tool category is 'mcp'
  action: Delegate installation to @devops
  command: "*add-mcp {tool_name}"
```

### With /learning-loop

```yaml
integration:
  trigger: Tool adoption or rejection
  action: Capture preference pattern
  pattern:
    id: "TP-{NNN}"
    type: "tool_preference"
    content: "Squad X prefers {tool} for {use_case}"
```

### With /cost-guardian

```yaml
integration:
  trigger: Tool is SaaS or has cost
  action: Register in cost tracking
  fields:
    - monthly_cost
    - cost_per_use
    - budget_category
```

### With /institutional-memory

```yaml
integration:
  trigger: Tool decision made
  action: Create decision record
  type: "technical"
  keywords: [tool_name, category, use_case]
```

## Auto-Invoke Behavior

When an agent says something like:
- "Preciso de uma lib para validação de forms"
- "Qual o melhor MCP para web scraping?"
- "Existe alguma ferramenta para..."

The skill:
1. Checks registry for existing matches
2. If found: presents options with scores
3. If not found: initiates discovery pipeline
4. Saves result to registry

```
🔧 Auto-invoking /tool-discovery...
   Trigger: "preciso de uma lib para"
   Domain: form validation

Checking registry... 2 tools found:
| Tool | RICE | Status |
|------|------|--------|
| zod | 2.8 | adopted |
| yup | 2.1 | evaluated |

Recommendation: zod (already adopted, higher RICE)
```

## Hard Rules

1. NEVER recommend tools without RICE evaluation
2. ALWAYS check registry before new search
3. NEVER install MCPs directly - delegate to @devops
4. ALWAYS save evaluations to registry
5. NEVER recommend deprecated tools unless explicitly asked

## Decision Matrix Template

```
                    Low Effort ────────────── High Effort
                         │                        │
    High    ┌────────────┼────────────┐          │
    Impact  │  QUICK WINS │   MAJOR    │          │
            │  (do first) │  PROJECTS  │          │
            │             │            │          │
            ├─────────────┼────────────┤          │
            │             │            │          │
    Low     │   FILL-INS  │   AVOID    │          │
    Impact  │  (if time)  │  (deprio)  │          │
            └─────────────┴────────────┘          │
```

---

*Tool Discovery v1.0 - "The right tool, objectively chosen" — Squad Architect*
