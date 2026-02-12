# DEC-2025-002: Sistema de Activity Logging Automático

## Metadata

| Field | Value |
|-------|-------|
| **ID** | DEC-2025-002 |
| **Date** | 2025-02-12 |
| **Category** | architectural |
| **Participants** | Director (Thiago), @aios-master (Orion) |
| **Outcome** | positive |

## Context

### Situation
Precisávamos de um sistema para capturar automaticamente tudo que acontece no AIOS (decisões, implementações, erros) para alimentar as skills de memória (`/institutional-memory` e `/learning-loop`).

### Constraints
- Custo DEVE ser zero ou mínimo
- Não pode impactar performance das sessões
- Deve capturar automaticamente (sem depender de ação manual)
- Precisa ser processável em batch para extrair insights

### Alternatives Considered
1. **Logging via Claude API** - Rejected: custo de tokens para processar cada evento
2. **Database para eventos** - Rejected: overhead de setup, manutenção
3. **JSONL + Stop Hooks + Batch Processing** - Selected: zero cost, async, offline processing

## Decision

Implementar sistema de 3 camadas:

### Camada 1: Captura (€0)
- **Stop Hook** (`session-logger.py`): Captura automática no fim de cada sessão
- **Manual Log** (`log.mjs`): Para eventos importantes durante sessão
- **Git Commits**: Já existente, captura mudanças de código

### Camada 2: Storage
- `.aios/logs/activity/YYYY-MM-DD.jsonl` - Raw logs em JSON Lines
- Append-only, sem processamento

### Camada 3: Batch Processing (€0)
- `daily-digest.mjs`: Processa logs no fim do dia
- Usa Ollama local (custo zero) para summarização
- Fallback determinístico se Ollama indisponível
- Extrai decisões → `.aios/memory/decisions/`
- Extrai patterns → `.aios/learning/patterns/`

### Rationale
1. **Zero cost**: Toda captura é append-only (sem AI), processamento usa Ollama local
2. **Non-blocking**: Hooks rodam async, não atrasam sessão
3. **Complete capture**: Stop hook + manual log cobrem todos os cenários
4. **Offline processing**: Batch diário permite análise profunda sem impacto real-time

## Implementation

### Files Created
- `.claude/hooks/session-logger.py` - Stop hook para captura automática
- `squads/ops/scripts/log.mjs` - Quick manual logging
- `squads/ops/scripts/activity-logger.mjs` - Full logging CLI
- `squads/ops/scripts/daily-digest.mjs` - Batch processing
- `.claude/rules/activity-logging.md` - Documentação

### Configuration
- Added session-logger.py to `.claude/settings.local.json` Stop hooks

## Outcomes

### Expected
- 100% das sessões capturadas automaticamente
- Decisões importantes registradas para memória institucional
- Patterns de sucesso/erro detectados para learning loop
- Zero custo adicional

### Metrics to Track
- Entries per day
- Decisions captured
- Patterns extracted
- Digest generation time

## Lessons

1. **JSONL > JSON**: Para append-only logs, JSONL é superior (não precisa ler arquivo inteiro)
2. **Async hooks**: Claude Code suporta `async: true` em hooks, essencial para não bloquear
3. **Ollama fallback**: Sempre ter fallback determinístico quando usar LLM local

## Related

- DEC-2025-001: Skills de Performance (criou necessidade)
- `/institutional-memory` skill (consumidor dos dados)
- `/learning-loop` skill (consumidor dos dados)

## Keywords

logging, activity, capture, hooks, jsonl, batch, digest, zero-cost, memory, learning

---

*Recorded by @aios-master (Orion)*
