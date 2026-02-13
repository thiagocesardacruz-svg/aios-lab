# Squad Automation

> **Missão:** Construir e manter a infraestrutura de automação que potencializa todos os outros squads. Agnóstico de nicho.

## Visão Geral

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AUTOMATION SQUAD                                    │
│                    "Build once, use everywhere"                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │         FORNECE PARA          │
                    └───────────────┬───────────────┘
                                    │
        ┌───────────────┬───────────┼───────────────┬───────────────┐
        ▼               ▼           ▼               ▼               ▼
   hotel-mkt       sales       marketing       growth         [qualquer]
```

Este squad **NÃO executa** tarefas de negócio. Ele **CONSTRÓI** as máquinas que outros squads usam.

## Agentes

| Agente | Nome | Papel |
|--------|------|-------|
| **automation-lead** | Flux ⚡ | Estratégia, priorização, ROI |
| **n8n-architect** | Blueprint 📐 | Design de workflows |
| **n8n-builder** | Forge 🔨 | Implementação de código |
| **integration-engineer** | Bridge 🔗 | APIs, webhooks, MCPs |
| **product-engineer** | Package 📦 | Productização, pricing |

## Comandos Rápidos

```bash
# Solicitar automação
/auto request "Preciso de um workflow para X"

# Ver catálogo de produtos
/auto catalog

# Build workflow
/auto build --design ./designs/my-workflow.yaml

# Validar workflow
/auto validate ./workflows/my-workflow.json

# Deploy para n8n
/auto deploy ./workflows/my-workflow.json

# Empacotar como produto
/auto package --workflow wf-id --name "Product Name"
```

## Catálogo de Produtos

### Máquina de Aquisição 🎯

| Produto | Status | Preço |
|---------|--------|-------|
| Lead Ads Engine | Planned | €97-197/mês |
| Referral Machine | Planned | €147-297/mês |
| Affiliate Tracker | Planned | €97+/mês |

### Máquina de Conversão 💰

| Produto | Status | Preço |
|---------|--------|-------|
| WhatsApp Qualifier | Planned | €197-397/mês |
| Cart Recovery Pro | Planned | €147+/mês |
| Call Analyzer | Planned | €97+/mês |

### Máquina de Conteúdo ✍️

| Produto | Status | Preço |
|---------|--------|-------|
| Blog SEO Machine | Planned | €297-597/mês |
| Newsletter Engine | Planned | €97-197/mês |
| Social Repurposer | Planned | €147-297/mês |

### Máquina de Dados 📊

| Produto | Status | Preço |
|---------|--------|-------|
| GA4 Intelligence | Planned | €147-297/mês |
| Ads Optimizer | Planned | €197+/mês |
| Competitor Watch | Planned | €197-397/mês |

### Máquina de Retenção 🔄

| Produto | Status | Preço |
|---------|--------|-------|
| Review Harvester | Planned | €97-197/mês |
| Cross-sell Engine | Planned | €147+/mês |
| Reactivation Bot | Planned | €147-297/mês |
| NPS Automator | Planned | €97-197/mês |

Ver catálogo completo: `data/product-catalog.yaml`

## Fluxo de Trabalho

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   REQUEST   │────►│   DESIGN    │────►│    BUILD    │────►│   DEPLOY    │
│ (Flux)      │     │ (Blueprint) │     │ (Forge)     │     │ (Forge)     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                          │                   │
                          ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐
                    │ INTEGRATIONS│     │  VALIDATE   │
                    │ (Bridge)    │     │ (n8n MCP)   │
                    └─────────────┘     └─────────────┘
                                              │
                                              ▼
                                        ┌─────────────┐
                                        │ PRODUCTIZE  │
                                        │ (Package)   │
                                        └─────────────┘
```

## Integrações Disponíveis

### MCPs

| MCP | Ferramentas | Uso |
|-----|-------------|-----|
| **n8n** | validate_workflow, search_nodes, create_workflow, etc | Core |
| **GoHighLevel** | contacts, opportunities, workflows, etc | CRM |
| **Context7** | get-library-docs | Documentação |

### APIs Tier 1

| API | Auth | Rate Limit |
|-----|------|------------|
| GoHighLevel | OAuth 2.0 | 100 req/10s |
| Supabase | API Key | 500 req/min |
| OpenAI | API Key | Varies |
| Slack | OAuth 2.0 | Varies |

Ver catálogo completo: `data/integration-catalog.yaml`

## Estrutura de Arquivos

```
squads/automation/
├── squad.yaml                    # Manifest
├── README.md                     # Este arquivo
│
├── agents/
│   ├── automation-lead.md        # Flux - Estratégia
│   ├── n8n-architect.md          # Blueprint - Design
│   ├── n8n-builder.md            # Forge - Build
│   ├── integration-engineer.md   # Bridge - APIs
│   └── product-engineer.md       # Package - Products
│
├── workflows/                    # Workflows n8n JSON
│   ├── request-workflow.yaml
│   └── ...
│
├── templates/                    # Templates reutilizáveis
│   ├── tmpl-webhook-receiver.json
│   ├── tmpl-ai-classifier.json
│   └── ...
│
├── checklists/
│   ├── pre-deploy-validation.md
│   └── product-launch-ready.md
│
├── data/
│   ├── product-catalog.yaml      # Catálogo de produtos
│   ├── workflow-registry.yaml    # Registro de workflows
│   └── integration-catalog.yaml  # Integrações disponíveis
│
└── scripts/
    ├── workflow-validator.mjs
    ├── workflow-deployer.mjs
    └── product-packager.mjs
```

## Métricas

| Métrica | Target | Frequência |
|---------|--------|------------|
| Workflows entregues | 10/mês | Semanal |
| Produtos lançados | 5/trimestre | Mensal |
| Taxa de reuso | > 60% | Mensal |
| Validation pass rate | > 95% | Semanal |
| ROI médio | > 5x | Trimestral |

## Como Solicitar Automação

### De outro squad:

```bash
# Via comando
/auto request "Descrição do que preciso automatizar"

# Ou via handoff formal
automation-lead:
  artifact_type: "automation_request"
  required_fields:
    - use_case
    - triggers
    - expected_outputs
    - integrations_needed
    - urgency
```

### Informações necessárias:

1. **O que** precisa ser automatizado
2. **Quando** o workflow deve executar (trigger)
3. **O que** deve acontecer (outputs)
4. **Quais** sistemas estão envolvidos
5. **Por que** isso é importante (ROI)

## Princípios

1. **Build once, use everywhere** - Workflows reutilizáveis
2. **Agnóstico de vertical** - Funciona para qualquer nicho
3. **Productização** - Todo workflow pode virar produto
4. **Custo zero quando possível** - Ferramentas locais primeiro
5. **Documentação é produto** - Sem docs, não está pronto

---

*Squad Automation v1.0.0 - AIOS Platform Infrastructure*
