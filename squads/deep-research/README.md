# Deep Research Framework

Framework de pesquisa profunda para iniciar novos projetos com clareza estratégica.

## Objetivo

Transformar uma ideia ou oportunidade em um documento estratégico completo antes de iniciar desenvolvimento, garantindo:
- Clareza sobre o problema e mercado
- Entendimento profundo do público-alvo
- Análise de concorrência e posicionamento
- Definição de proposta de valor única
- Base sólida para PRD e desenvolvimento

## Fases da Pesquisa

```
┌─────────────────────────────────────────────────────────────────────┐
│  FASE 1: DISCOVERY       │  FASE 2: ANALYSIS      │  FASE 3: STRATEGY │
│  ─────────────────       │  ───────────────       │  ─────────────── │
│  • Problem Definition    │  • Market Analysis     │  • Positioning    │
│  • Audience Research     │  • Competitor Mapping  │  • Value Prop     │
│  • Market Signals        │  • Gap Analysis        │  • Go-to-Market   │
│  • Opportunity Scan      │  • SWOT                │  • Roadmap        │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
                    📄 Strategic Brief
```

## Estrutura do Squad

```
deep-research/
├── agents/
│   └── researcher.md           # Agente pesquisador
├── tasks/
│   ├── 01-problem-definition.md
│   ├── 02-audience-research.md
│   ├── 03-market-analysis.md
│   ├── 04-competitor-mapping.md
│   ├── 05-gap-analysis.md
│   ├── 06-positioning.md
│   └── 07-strategic-brief.md
├── templates/
│   ├── project-brief-tmpl.md
│   ├── audience-persona-tmpl.md
│   ├── competitor-analysis-tmpl.md
│   ├── swot-tmpl.md
│   └── strategic-brief-tmpl.md
├── checklists/
│   ├── discovery-checklist.md
│   ├── analysis-checklist.md
│   └── strategy-checklist.md
├── workflows/
│   └── full-research.yaml
├── data/
│   └── schwartz-levels.md      # Referência de sofisticação
├── config.yaml
└── README.md
```

## Como Usar

### 1. Iniciar Nova Pesquisa
```bash
# Criar pasta do projeto
mkdir -p workspace/projects/[nome-projeto]/research

# Copiar templates
cp -r aios-lab/squads/deep-research/templates/* workspace/projects/[nome-projeto]/research/
```

### 2. Executar Tarefas em Ordem
1. `01-problem-definition` - Definir o problema claramente
2. `02-audience-research` - Pesquisar público-alvo em profundidade
3. `03-market-analysis` - Analisar mercado e tendências
4. `04-competitor-mapping` - Mapear concorrentes
5. `05-gap-analysis` - Identificar gaps e oportunidades
6. `06-positioning` - Definir posicionamento
7. `07-strategic-brief` - Consolidar em brief estratégico

### 3. Output Final
- `strategic-brief.md` - Documento estratégico completo
- Pronto para criar PRD e iniciar desenvolvimento

## Integração com TravelTech Digital

Este framework segue a metodologia TTD:
- **Estrutura sobre caos** - Transformar informação dispersa em clareza
- **Aprender enquanto faz** - Pesquisa gera conhecimento aplicável
- **Ciclo de crescimento** - Outputs alimentam próximas fases

## Níveis de Profundidade

| Nível | Tempo | Quando Usar |
|-------|-------|-------------|
| **Quick** | 2-4h | Validação rápida de ideia |
| **Standard** | 1-2 dias | Novo produto ou feature |
| **Deep** | 1 semana | Novo mercado ou pivô estratégico |

---

*Framework v1.0 - TravelTech Digital*
