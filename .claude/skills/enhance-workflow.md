# Enhance Workflow v2.0 - Multi-Agent Orchestration

Pipeline de enhancement com análise de determinismo, roundtable dinâmico por domínio, e validação QA.

**Fluxo:** Pre-flight → Determinism Check → Discovery → Research → Roundtable (dinâmico) → Create Epic → QA Validation

---

## Domain Roundtable Map

O roundtable é selecionado automaticamente baseado no domínio do projeto:

```yaml
domain_roundtable_map:
  # Development (default)
  code_app:
    keywords: [app, api, database, frontend, backend, feature, refactor, bug]
    agents: [architect, data-engineer, devops, ux]

  # Copywriting & Marketing
  copy_marketing:
    keywords: [copy, sales page, vsl, email sequence, headline, funnel, launch, marketing]
    agents: [copy-chief, story-chief, funnel-architect, ads-analyst]

  # Mind Cloning (MMOS)
  mmos_minds:
    keywords: [mind, clone, persona, cognitive, behavioral, dna, emulator, personality]
    agents: [barbara-cognitive-architect, daniel-behavioral-analyst, charlie-synthesis-expert, quinn-quality-specialist]

  # Design & Brand
  design_brand:
    keywords: [design, ui, ux, brand, visual, logo, design system, component]
    agents: [design-chief, brad-frost, marty-neumeier, ux]

  # Storytelling & Content
  storytelling_content:
    keywords: [story, narrative, content, course, curriculum, blog, video script]
    agents: [story-chief, nancy-duarte, donald-miller, content-pm]

  # Paid Traffic & Ads
  traffic_ads:
    keywords: [ads, traffic, campaign, facebook, google ads, meta, tiktok, media buyer]
    agents: [traffic-masters-chief, ads-analyst, creative-analyst, media-buyer]

  # Squad & Workflow Creation
  squad_workflow:
    keywords: [squad, skill, workflow, agent, pipeline, orchestration]
    agents: [pedro-valerio, squad-architect, qa, devops]
```

---

## Activation

Quando o usuario invocar `/enhance-workflow`, execute o fluxo completo.

---

## Phase 0: Pre-flight Check

Antes de qualquer coisa, valide:

```
PRE-FLIGHT CHECKLIST:
[ ] Diretório outputs/enhance/ existe ou pode ser criado
[ ] Contexto do projeto foi fornecido (não vazio)
[ ] Agent files necessários existem em .claude/commands/
[ ] Ferramentas externas disponíveis (exa, context7) - graceful degradation se não

Se FALHAR: Abortar com mensagem clara do que falta.
Timeout: 30s
```

---

## Phase 0.5: Determinism Analysis

**ANTES de gastar tokens com agentes**, avaliar se o enhancement pode ser resolvido deterministicamente:

```yaml
determinism_check:
  types:
    rename:
      patterns: ["renomear", "rename", "mudar nome"]
      deterministic: true
      action: "sed, IDE refactor tools"

    migration:
      patterns: ["migrar", "atualizar dependências", "upgrade"]
      deterministic: true
      action: "npm update, migration scripts"

    format:
      patterns: ["formatar", "lint", "estilo de código"]
      deterministic: true
      action: "prettier, eslint --fix"

    bug_fix:
      patterns: ["corrigir", "fix", "bug", "erro"]
      deterministic: false
      action: "pipeline (requer análise)"

    feature:
      patterns: ["adicionar", "criar", "implementar", "nova feature"]
      deterministic: false
      action: "pipeline completo"
```

---

## Phase 0.7: Domain Classification

Analisar o contexto e classificar o domínio para selecionar o roundtable correto:

```
1. Extrair keywords do contexto fornecido pelo usuário
2. Fazer match com domain_roundtable_map
3. Se múltiplos matches: perguntar ao usuário qual domínio
4. Se nenhum match: usar code_app (default)
5. Registrar em .state.json: { "domain": "copy_marketing", "roundtable_agents": [...] }
```

---

## Setup

### Diretório de Artefatos

```
outputs/enhance/{slug}/
├── 00-INDEX.md        # Hub de navegação (criado no início)
├── .state.json        # Checkpoint state
├── .metrics.json      # Métricas de execução
└── ...artefatos...
```

---

## Phase Execution

### Phase 1: Discovery (@architect)
Spawn agent com prompt incluindo Context Preamble do AIOS.

### Phase 2: Research (@analyst)
Spawn agent que lê 01-discovery.md e pesquisa.

### Phase 3: Roundtable (DINÂMICO)
Spawn 4 agents em paralelo baseado no domínio classificado.

### Phase 4: Create Epic (@pm)
Spawn pm que lê todos os artefatos e cria o Epic.

### Phase 5: QA Validation (@qa)
Spawn qa para validar o Epic com checklist.

---

## Finalizacao

1. **Atualizar 00-INDEX.md final** com todos os links e status ✅

2. **Apresentar resumo** ao usuario:
```
## Enhance Workflow Completo: {nome}

### Artefatos Gerados
- `00-INDEX.md` - Hub de navegação
- `01-discovery.md` - Análise técnica
- `02-research.md` - Pesquisa estratégica
- `03-roundtable.md` - Consenso ({domain})
- `04-epic.md` - Epic completo
- `05-qa-report.md` - Validação QA

### Próximos Passos
1. Revisar epic em 04-epic.md
2. Executar com /execute-epic {slug}
```

3. **Cleanup**: Shutdown agents, TeamDelete

---

## Retry Policy

```yaml
per_phase:
  discovery: { max_attempts: 3, on_max: fail_fast }
  research: { max_attempts: 5, on_max: graceful_skip }
  roundtable: { max_attempts: 2, on_max: continue_partial }
  epic: { max_attempts: 3, on_max: fail_with_partial }
  qa: { max_attempts: 2, on_max: deliver_with_warning }
```
