# Task: Document Product

## Metadata
```yaml
task_id: document-product
agent: product-engineer
priority: P2
estimated_time: 2-4h
inputs:
  - product_id: string (required)
  - product_spec: yaml (required)
outputs:
  - user_guide: markdown
  - setup_guide: markdown
  - faq: markdown
  - sales_materials: object
```

## Objetivo
Criar documentação completa para produto de automação.

## Steps

### 1. Criar User Guide
```markdown
# {Product Name} - Guia do Usuário

## Visão Geral

{O que o produto faz e para quem é}

### Benefícios
- {Benefício 1}
- {Benefício 2}

### Como Funciona
{Explicação em alto nível do fluxo}

## Requisitos

### Integrações Necessárias
| Integração | Obrigatória | Como Configurar |
|------------|-------------|-----------------|
| {Nome} | Sim/Não | [Link para docs] |

### Credenciais
- {Credential 1}: {onde obter}
- {Credential 2}: {onde obter}

## Configuração Inicial

### Passo 1: {Título}
{Instruções detalhadas}

### Passo 2: {Título}
{Instruções detalhadas}

## Uso Diário

### {Cenário de Uso 1}
{Como usar para este cenário}

### {Cenário de Uso 2}
{Como usar para este cenário}

## Métricas e Relatórios

### Onde Ver Resultados
{Explicação de onde acompanhar}

### Métricas Principais
| Métrica | Significado | Meta |
|---------|-------------|------|
| {Métrica} | {O que significa} | {Valor bom} |

## Troubleshooting

### Problema: {Problema comum 1}
**Causa:** {Por que acontece}
**Solução:** {Como resolver}

### Problema: {Problema comum 2}
**Causa:** {Por que acontece}
**Solução:** {Como resolver}

## Suporte

### Como Obter Ajuda
- Email: suporte@example.com
- Chat: {link}
- Docs: {link}

### SLA
| Tier | Tempo de Resposta |
|------|-------------------|
| Starter | 48h |
| Professional | 24h |
| Enterprise | 4h |
```

Salvar em: `products/{product-id}/user-guide.md`

### 2. Criar Setup Guide
```markdown
# {Product Name} - Guia de Setup

## Checklist de Setup

- [ ] Passo 1 completo
- [ ] Passo 2 completo
- [ ] ...

## Tempo Estimado: {X} minutos

## Pré-requisitos

Antes de começar, você precisa:
- [ ] {Pré-requisito 1}
- [ ] {Pré-requisito 2}

## Setup Passo a Passo

### 1. {Primeiro Passo}

{Instruções detalhadas com screenshots se necessário}

```
{Código ou comandos se aplicável}
```

### 2. {Segundo Passo}

{Instruções}

### 3. Verificação

Para confirmar que tudo está funcionando:

1. {Teste 1}
2. {Teste 2}

### Primeiro Sucesso 🎉

Você saberá que o setup está completo quando:
- {Indicador de sucesso 1}
- {Indicador de sucesso 2}

## Problemas Comuns no Setup

### Erro: {Erro comum}
{Solução}

## Próximos Passos

Agora que o setup está completo:
1. {Próximo passo sugerido}
2. {Outro passo}
```

Salvar em: `products/{product-id}/setup-guide.md`

### 3. Criar FAQ
```markdown
# {Product Name} - FAQ

## Geral

### O que é o {Product Name}?
{Resposta}

### Para quem é indicado?
{Resposta}

### Quanto custa?
{Resposta com tiers}

## Funcionalidades

### O produto faz X?
{Resposta}

### Posso personalizar Y?
{Resposta}

## Técnico

### Quais integrações são necessárias?
{Resposta}

### Os dados são seguros?
{Resposta sobre segurança/GDPR}

### Qual o uptime/SLA?
{Resposta}

## Billing

### Como funciona a cobrança?
{Resposta}

### Posso cancelar a qualquer momento?
{Resposta}

### Tem período de teste?
{Resposta}

## Suporte

### Como obtenho ajuda?
{Resposta}

### Qual o tempo de resposta?
{Resposta por tier}
```

Salvar em: `products/{product-id}/faq.md`

### 4. Criar Sales Materials

#### 4.1 One-Pager
```markdown
# {Product Name}

## {Tagline}

**O Problema:**
{Descrição do problema em 2-3 frases}

**A Solução:**
{O que o produto faz}

**Benefícios:**
✅ {Benefício 1}
✅ {Benefício 2}
✅ {Benefício 3}

**Resultados:**
- {Métrica de sucesso 1}
- {Métrica de sucesso 2}

**Preços:**
| Tier | Preço | Ideal Para |
|------|-------|------------|
| Starter | €X/mês | {quem} |
| Professional | €X/mês | {quem} |

**Próximo Passo:**
{CTA}
```

#### 4.2 Pitch Script
```markdown
# Pitch Script - {Product Name}

## Opening (30s)
"{Pergunta que identifica a dor}"

## Problem (1min)
"{Descrição do problema e consequências}"

## Solution (1min)
"{Como o produto resolve}"

## Demo (2-3min)
1. Mostrar {feature 1}
2. Mostrar {feature 2}
3. Mostrar resultado

## Social Proof (30s)
"{Case study ou estatística}"

## Close (30s)
"{CTA e próximos passos}"

## Objections Handling
| Objeção | Resposta |
|---------|----------|
| "É caro" | "{Resposta}" |
| "Não tenho tempo" | "{Resposta}" |
```

### 5. Organizar Assets
```
products/{product-id}/
├── spec.yaml
├── user-guide.md
├── setup-guide.md
├── faq.md
├── sales/
│   ├── one-pager.md
│   ├── pitch-script.md
│   └── demo-script.md
└── assets/
    ├── screenshots/
    ├── videos/
    └── diagrams/
```

### 6. Validar Documentação
```
□ User guide completo e claro?
□ Setup guide testado (funciona)?
□ FAQ cobre perguntas comuns?
□ Sales materials prontos para uso?
□ Screenshots atualizados?
```

## Output
```yaml
documentation_complete:
  product_id: "{id}"
  documents_created:
    - user_guide: "products/{id}/user-guide.md"
    - setup_guide: "products/{id}/setup-guide.md"
    - faq: "products/{id}/faq.md"
    - one_pager: "products/{id}/sales/one-pager.md"
    - pitch_script: "products/{id}/sales/pitch-script.md"
  ready_for_launch: true
```

## Quality Gate
- [ ] User guide completo
- [ ] Setup guide testado
- [ ] FAQ com pelo menos 10 perguntas
- [ ] One-pager criado
- [ ] Pitch script pronto
- [ ] Assets organizados
