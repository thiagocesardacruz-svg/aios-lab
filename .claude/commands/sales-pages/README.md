# Sales Pages Squad

> Páginas de Vendas de Alta Conversão

## Overview

Squad especializado em criar páginas de vendas de alta conversão para produtos digitais, usando frameworks de persuasão comprovados (Schwartz, Cialdini, Hormozi, Halbert, Dan Kennedy).

**Domain:** Conversion
**Version:** 1.1.0
**Total Components:** 23

## Posição no Funil

```
Marketing → Traz o lead → SALES PAGES → Converte → Customer → Retém
 (awareness)              (CONVERSÃO)              (retention)
```

Este squad é responsável pelo **momento mais crítico**: transformar interesse em compra.

## Agentes

| Agent | Name | Role | Especialidade |
|-------|------|------|---------------|
| copy-chief | Marcus | Copy Chief | Copywriting, headlines, storytelling |
| offer-architect | Victoria | Offer Architect | Estrutura de oferta, pricing, bônus |
| conversion-optimizer | Rafael | CRO Specialist | Layout, prova social, otimização |

## Commands

| Command | Alias | Description |
|---------|-------|-------------|
| `/sales-pages/full-sales-page` | `*sp` | Página completa (5 fases) |
| `/sales-pages/quick-page` | `*qsp` | Página rápida com templates |
| `/sales-pages/analyze-product` | | Analisar produto para copy |
| `/sales-pages/define-avatar` | | Definir avatar/persona |
| `/sales-pages/structure-offer` | | Estruturar oferta irresistível |
| `/sales-pages/write-headlines` | | Headlines de alto impacto |
| `/sales-pages/optimize-page` | | Otimizar para conversão |

## Workflows

### Full Sales Page (`*sp`)
Processo completo em 5 fases:

```
1. Discovery    → Análise de produto e avatar
2. Strategy     → Estruturação da oferta
3. Creation     → Copy e prova social
4. Assembly     → Montagem da página
5. Optimization → Otimização para conversão
```

### Quick Page (`*qsp`)
Versão acelerada:
1. Briefing rápido (5 perguntas)
2. Preenchimento de template
3. Revisão básica

## Components

### Tasks (9)

| Task | Fase | Propósito |
|------|------|-----------|
| `01-analyze-product.md` | Discovery | Análise profunda do produto |
| `02-define-avatar.md` | Discovery | Definição do comprador ideal |
| `03-structure-offer.md` | Strategy | Arquitetura da oferta |
| `04-write-headlines.md` | Creation | Headlines de impacto |
| `05-write-copy.md` | Creation | Body copy persuasivo |
| `06-create-proof.md` | Creation | Prova social e credibilidade |
| `07-design-layout.md` | Assembly | Layout de conversão |
| `08-assemble-page.md` | Assembly | Montagem final |
| `09-optimize-page.md` | Optimization | CRO e testes |

### Templates (3)

| Template | Uso |
|----------|-----|
| `sales-page.md` | Template de página completa |
| `headline-formulas.md` | Fórmulas de headlines |
| `offer-stack.md` | Value stack structure |

### Checklists (3)

| Checklist | Propósito |
|-----------|-----------|
| `copy-quality.md` | Qualidade do copy |
| `conversion-elements.md` | Elementos de conversão |
| `compliance.md` | Conformidade legal |

### Data (3)

| Data | Conteúdo |
|------|----------|
| `schwartz-awareness.md` | 5 níveis de consciência |
| `persuasion-frameworks.md` | Frameworks de persuasão |
| `power-words.md` | Palavras de impacto |

## Frameworks Utilizados

### Eugene Schwartz - 5 Níveis de Consciência

| Nível | Descrição | Abordagem |
|-------|-----------|-----------|
| **Unaware** | Não sabe que tem problema | Educação, história |
| **Problem Aware** | Sabe do problema, não da solução | Agitar a dor |
| **Solution Aware** | Sabe que existe solução | Mostrar sua solução |
| **Product Aware** | Conhece seu produto | Diferenciação |
| **Most Aware** | Pronto para comprar | Oferta direta |

### Alex Hormozi - Value Equation

```
Value = (Dream Outcome × Perceived Likelihood)
        ────────────────────────────────────
        (Time Delay × Effort & Sacrifice)
```

### Cialdini - 6 Armas da Persuasão

1. **Reciprocidade** - Dê antes de pedir
2. **Compromisso** - Pequenos "sim" levam a grandes "sim"
3. **Prova Social** - Outros já compraram
4. **Autoridade** - Expertise comprovada
5. **Escassez** - Limitação aumenta valor
6. **Afeição** - Pessoas compram de quem gostam

### PASTOR Framework (Dan Kennedy)

- **P**roblem - Identifique a dor
- **A**mplify - Amplifique as consequências
- **S**tory - Conte uma história
- **T**estimonials - Prove com depoimentos
- **O**ffer - Apresente a oferta
- **R**esponse - Chame para ação

## Inputs Necessários

### Mínimo Viável
- Nome do produto
- Tipo de produto
- Descrição do produto

### Recomendado
- Faixa de preço
- Depoimentos existentes
- URLs de concorrentes
- Avatar/persona definido

## Outputs Gerados

| Output | Formato | Descrição |
|--------|---------|-----------|
| `sales-page.md` | Markdown | Página completa |
| `sales-page.html` | HTML | Esqueleto para devs |
| `optimization-report.md` | Markdown | Relatório de CRO |
| `assets-needed.md` | Markdown | Lista de assets |

## Exemplos de Uso

### Curso Online
```
*sp
> Nome: Curso de Python
> Tipo: curso_online
> Descrição: Aprenda Python do zero ao avançado
> Preço: R$ 497
> Avatar: Iniciantes em programação
```

### SaaS B2B
```
*sp
> Nome: AI OS para Hotéis
> Tipo: saas_b2b
> Descrição: Sistema de operações com IA para hotéis
> Preço: €99/mês
> Avatar: Gerentes de hotel independente
```

### Ebook Rápido
```
*qsp
> Nome: Guia de Investimentos
> Benefício: Construir patrimônio ganhando pouco
> Público: Iniciantes em investimentos
> Preço: R$ 47
> Dor: Não saber por onde começar
```

## Quality Metrics

| Metric | Target | Como Medir |
|--------|--------|------------|
| Conversion Rate | > 3% | Analytics |
| Time on Page | > 3 min | Analytics |
| Scroll Depth | > 70% | Hotjar |
| CTA Click Rate | > 5% | Analytics |

## Diferencial vs Marketing Squad

| Aspecto | Marketing Squad | Sales Pages Squad |
|---------|-----------------|-------------------|
| Foco | Multi-canal | Uma única entrega |
| Frameworks | Copy geral | Persuasão profunda |
| Posição | Topo/meio funil | Fundo do funil |
| Objetivo | Awareness/nurture | Conversão |

## File Structure

```
squads/sales-pages/
├── squad.yaml
├── README.md
├── agents/
│   ├── copy-chief.md
│   ├── offer-architect.md
│   └── conversion-optimizer.md
├── workflows/
│   ├── full-sales-page.yaml
│   └── quick-page.yaml
├── tasks/
│   ├── 01-analyze-product.md
│   ├── 02-define-avatar.md
│   ├── 03-structure-offer.md
│   ├── 04-write-headlines.md
│   ├── 05-write-copy.md
│   ├── 06-create-proof.md
│   ├── 07-design-layout.md
│   ├── 08-assemble-page.md
│   └── 09-optimize-page.md
├── templates/
│   ├── sales-page.md
│   ├── headline-formulas.md
│   └── offer-stack.md
├── checklists/
│   ├── copy-quality.md
│   ├── conversion-elements.md
│   └── compliance.md
└── data/
    ├── schwartz-awareness.md
    ├── persuasion-frameworks.md
    └── power-words.md
```

---

*Sales Pages Squad v1.1.0 - AIOS 2.1.0 Compliant*
*Criado por Synkra AIOS*
