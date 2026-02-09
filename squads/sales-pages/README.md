# Squad: Sales Pages

Squad especializado em criar páginas de vendas de alta conversão para produtos digitais.

## Estrutura

```
sales-pages/
├── squad.yaml              # Manifesto do squad
├── README.md               # Este arquivo
│
├── agents/                 # Agentes especializados
│   ├── copy-chief.md           # Marcus - Copywriter
│   ├── offer-architect.md      # Victoria - Arquiteta de Ofertas
│   └── conversion-optimizer.md # Rafael - CRO Specialist
│
├── tasks/                  # Tasks executáveis
│   ├── 01-analyze-product.md
│   ├── 02-define-avatar.md
│   ├── 03-structure-offer.md
│   ├── 04-write-headlines.md
│   ├── 05-write-copy.md
│   ├── 06-create-proof.md
│   ├── 07-design-layout.md
│   ├── 08-assemble-page.md
│   └── 09-optimize-page.md
│
├── templates/              # Templates reutilizáveis
│   ├── sales-page.md           # Template de página completa
│   ├── headline-formulas.md    # Fórmulas de headlines
│   └── offer-stack.md          # Template de value stack
│
├── checklists/             # Checklists de validação
│   ├── copy-quality.md         # Qualidade do copy
│   ├── conversion-elements.md  # Elementos de conversão
│   └── compliance.md           # Conformidade legal
│
├── data/                   # Dados de referência
│   ├── schwartz-awareness.md   # Níveis de consciência
│   ├── persuasion-frameworks.md# Frameworks de persuasão
│   └── power-words.md          # Palavras de impacto
│
└── workflows/              # Workflows orquestrados
    ├── full-sales-page.yaml    # Workflow completo
    └── quick-page.yaml         # Workflow acelerado
```

## Como Usar

### Workflow Completo
```
*create-sales-page
```
ou
```
*sp
```

Cria página de vendas completa passando por todas as 5 fases:
1. **Discovery** - Análise de produto e avatar
2. **Strategy** - Estruturação da oferta
3. **Creation** - Copy e prova social
4. **Assembly** - Montagem da página
5. **Optimization** - Otimização para conversão

**Duração:** 3-5 horas

### Workflow Rápido
```
*quick-sales-page
```
ou
```
*qsp
```

Versão acelerada usando templates pré-definidos:
1. Briefing rápido (5 perguntas)
2. Preenchimento de template
3. Revisão básica

**Duração:** 30-60 minutos

## Agentes

| Agente | Especialidade | Quando Usar |
|--------|---------------|-------------|
| **Marcus** (copy-chief) | Copywriting, headlines, storytelling | Escrita de copy |
| **Victoria** (offer-architect) | Estrutura de oferta, pricing, bônus | Criação de oferta |
| **Rafael** (conversion-optimizer) | CRO, layout, prova social | Otimização |

## Inputs Necessários

### Mínimo Viável
- Nome do produto
- Tipo de produto
- Descrição do produto

### Recomendado
- Faixa de preço
- Depoimentos existentes
- URLs de concorrentes

## Outputs Gerados

1. **sales-page.md** - Página de vendas em Markdown
2. **sales-page.html** - Esqueleto HTML
3. **optimization-report.md** - Relatório de CRO
4. **assets-needed.md** - Lista de assets necessários

## Referências Teóricas

Este squad é baseado em:
- Eugene Schwartz - Níveis de Consciência
- Robert Cialdini - 6 Armas da Persuasão
- Alex Hormozi - Offer Architecture
- Gary Halbert - Direct Response Copy
- Dan Kennedy - PASTOR Framework

## Exemplos de Uso

### Curso Online
```
*sp
> Nome: Curso de Python
> Tipo: curso_online
> Descrição: Aprenda Python do zero ao avançado...
```

### Ebook
```
*qsp
> Nome: Guia de Investimentos
> Benefício: Construir patrimônio mesmo ganhando pouco
> Público: Iniciantes em investimentos
> Preço: R$ 47
> Dor: Não saber por onde começar a investir
```

---

*Squad criado por Synkra AIOS*
