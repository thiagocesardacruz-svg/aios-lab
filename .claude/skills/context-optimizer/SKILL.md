---
name: context-optimizer
description: |
  Context Optimizer - Reduz consumo de tokens via compressão inteligente e lazy loading.

  Analisa e otimiza o contexto antes de cada chamada de LLM, removendo redundâncias,
  comprimindo informações e carregando apenas o necessário sob demanda.

  Impacto estimado: -50% tokens por task.

  Use quando: iniciar tasks complexas, contexto muito grande, otimizar custos,
  ou quando detectar redundância no contexto.

# Auto-routing configuration (opt-in)
auto_invoke: true
triggers:
  keywords:
    - "otimizar contexto"
    - "optimize context"
    - "reduzir tokens"
    - "reduce tokens"
    - "contexto grande"
    - "large context"
    - "economizar tokens"
    - "save tokens"
  patterns:
    - "(?i)context.*too.*large"
    - "(?i)token.*optim"
    - "(?i)comprimir.*contexto"
agents_allowed: all
priority: high
confirm_before_invoke: false
---

# Context Optimizer

Reduz consumo de tokens via compressão inteligente e lazy loading.

## Overview

Este skill implementa a filosofia de Elon Musk: **"Delete before optimize."**

Antes de otimizar o uso de tokens, primeiro ELIMINE tokens desnecessários.

```
Token Cost = (Context Size) × (Model Calls) × (Redundancy Factor)

Com Context Optimizer:
- Context Size: -40% via compressão
- Redundancy Factor: -60% via deduplicação
- Total: ~50% redução
```

## Princípios (First Principles)

1. **Delete First**: Remover antes de comprimir
2. **Lazy Load**: Carregar apenas quando necessário
3. **Delta Only**: Enviar apenas diferenças, não arquivo inteiro
4. **Cache Intelligence**: Não perguntar duas vezes a mesma coisa

## Workflow

### Phase 1: Context Audit

Antes de qualquer task, auditar o contexto atual:

```
1. Listar todos os elementos no contexto
2. Para cada elemento, perguntar:
   - "Este token PRECISA existir para a task?"
   - "Pode ser resumido sem perder capacidade?"
   - "Já existe informação duplicada?"
3. Gerar relatório de otimização
```

**Output esperado:**
```markdown
## Context Audit Report

| Element | Tokens | Action | Savings |
|---------|--------|--------|---------|
| Full file content | 2,500 | Summarize | -2,000 |
| Repeated instructions | 800 | Deduplicate | -600 |
| Unused agent context | 1,200 | Remove | -1,200 |

**Total Savings: 3,800 tokens (47%)**
```

### Phase 2: Compression Strategies

Aplicar estratégias de compressão na ordem:

#### Strategy 1: Structural Compression
```
ANTES:
"The function calculateTotal takes parameters a, b, and c.
It returns the sum of a, b, and c multiplied by the tax rate."

DEPOIS:
"calculateTotal(a,b,c) → (a+b+c)*taxRate"
```

#### Strategy 2: Reference Compression
```
ANTES:
[Full 500-line file content]

DEPOIS:
"File: src/utils.ts (500 lines)
Key exports: calculateTotal, formatCurrency, validateInput
Relevant section (lines 45-60): [only relevant code]"
```

#### Strategy 3: Semantic Deduplication
```
ANTES:
"User wants to create a login page"
"The task is to implement login functionality"
"We need to build the login feature"

DEPOIS:
"Task: Implement login page"
```

### Phase 3: Lazy Loading Protocol

Implementar carregamento sob demanda:

```yaml
lazy_load_rules:
  files:
    - Load only file names initially
    - Load content only when agent requests specific file
    - Load only relevant sections, not entire file

  skills:
    - Load only skill metadata (name + description)
    - Load SKILL.md body only when triggered
    - Load references/ only when explicitly needed

  agents:
    - Load only active agent definition
    - Don't load all available agents
    - Load collaboration context only when needed

  history:
    - Summarize old conversation turns
    - Keep only last 3-5 turns in full
    - Reference summaries for older context
```

### Phase 4: Delta Communication

Para edições e atualizações:

```
ANTI-PATTERN (expensive):
"Here is the complete updated file: [2000 tokens]"

PATTERN (efficient):
"Edit lines 45-50:
- old: function calc(a) { return a * 2; }
+ new: function calc(a, b) { return (a + b) * 2; }
"
```

## Integration with Agents

### Before Task Execution

Agentes DEVEM executar context optimization antes de tasks complexas:

```markdown
## Pre-Task Context Check

1. Current context size: X tokens
2. Task complexity: [simple|medium|complex]
3. Optimization needed: [yes|no]

If yes:
- Run /context-optimizer
- Apply recommendations
- Proceed with optimized context
```

### Auto-Trigger Conditions

Este skill é auto-invocado quando:

| Condition | Threshold | Action |
|-----------|-----------|--------|
| Context size | > 10,000 tokens | Suggest compression |
| Redundancy detected | > 20% duplicate | Auto-deduplicate |
| File load requested | > 500 lines | Offer lazy load |
| Conversation length | > 10 turns | Summarize history |

## Metrics

Track optimization effectiveness:

```yaml
metrics:
  tokens_before: number
  tokens_after: number
  savings_percent: number
  strategies_applied: list
  time_to_optimize: ms
```

## Commands

| Command | Description |
|---------|-------------|
| `*audit` | Run context audit, show report |
| `*compress` | Apply compression strategies |
| `*lazy` | Enable lazy loading mode |
| `*delta` | Switch to delta-only communication |
| `*report` | Show optimization metrics |

## Hard Rules

1. NEVER remove context that would lose capability
2. ALWAYS preserve semantic meaning when compressing
3. NEVER lazy-load security-critical information
4. ALWAYS offer to restore full context if needed

## Example Usage

```
User: "Implement the payment module based on the architecture doc"

Agent (with context-optimizer):
1. Audit: Architecture doc is 3,000 tokens
2. Compress: Extract only payment-related sections (800 tokens)
3. Lazy load: Load payment files on-demand
4. Delta: Send only code changes, not full files

Result: Task completed with 60% fewer tokens
```

---

*Context Optimizer v1.0 - "The best token is no token" — Elon Musk*
