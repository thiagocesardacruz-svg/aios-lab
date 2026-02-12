# ADR-003: Activity Logging System

## Status
**Accepted** - 2025-02-12

## Context

O AIOS Lab precisa de um sistema para capturar automaticamente todas as atividades, decisões, erros e implementações que ocorrem durante as sessões de desenvolvimento. Este sistema alimenta as skills de memória institucional (`/institutional-memory`) e aprendizado (`/learning-loop`).

### Requisitos

1. **Custo zero** - Não pode usar APIs pagas para logging básico
2. **Non-blocking** - Não pode impactar performance das sessões
3. **Automático** - Captura deve acontecer sem intervenção manual
4. **Processável** - Deve permitir análise batch posterior
5. **Persistente** - Dados devem sobreviver entre sessões

### Constraints

- Budget limitado (€468/mês total para todo AIOS)
- Sessões Claude Code não expõem métricas diretamente
- Processamento em tempo real aumentaria custo de tokens

## Decision

Implementar sistema de logging em 3 camadas:

### Camada 1: Captura (€0)

| Componente | Função | Trigger |
|------------|--------|---------|
| `session-logger.py` | Stop hook que extrai info do transcript | Fim de cada sessão |
| `log.mjs` | Logging manual rápido | Quando necessário |
| Git commits | Captura mudanças de código | Cada commit |

### Camada 2: Storage

- **Formato**: JSONL (JSON Lines) - append-only, uma entrada por linha
- **Organização**: Um arquivo por dia (`YYYY-MM-DD.jsonl`)
- **Localização**: `.aios/logs/activity/`

### Camada 3: Batch Processing (€0)

- `daily-digest.mjs` processa logs acumulados
- Usa processamento determinístico (sem AI)
- Extrai decisões e patterns automaticamente
- Gera digest em Markdown

### Formato de Entrada

```json
{
  "timestamp": "2025-02-12T20:04:36.123Z",
  "action": "Implementado sistema de logging",
  "type": "implementation",
  "tags": ["logging", "hooks"],
  "files": ["activity-logger.mjs", "log.mjs"],
  "agent": "@aios-master",
  "metadata": {}
}
```

### Tipos de Entrada

| Type | Auto-detected Keywords |
|------|----------------------|
| `decision` | decidir, escolher, optar, definir, chose, select |
| `error` | erro, error, bug, fix, fail |
| `implementation` | implementar, criar, adicionar, create, add |
| `action` | default |

## Consequences

### Positivas

1. **€0/mês de custo** - Toda operação é local
2. **Zero latência** - Hooks são async, não bloqueiam
3. **Escalável** - JSONL escala infinitamente
4. **Auditável** - Logs são texto puro, versionáveis
5. **Processável** - Pode usar qualquer ferramenta para análise

### Negativas

1. **Sem real-time analytics** - Precisa rodar digest manualmente
2. **Detecção por keywords** - Pode ter falsos positivos/negativos
3. **Sem backup automático** - Depende de git para persistência

### Mitigações

- Rotation policy remove logs > 90 dias
- Keywords são conservadores (preferem falso negativo)
- `.aios/` é commitado no repositório

## Alternatives Considered

### 1. Logging via Claude API
- **Rejected**: Custo de tokens para cada entrada
- Estimativa: €50-100/mês só para logging

### 2. Database (SQLite/Postgres)
- **Rejected**: Overhead de setup e manutenção
- Overkill para append-only logs

### 3. Cloud logging (Datadog, etc)
- **Rejected**: Custo mensal, vendor lock-in
- Overkill para projeto individual

## Implementation

### Scripts Criados

| Script | Função |
|--------|--------|
| `.claude/hooks/session-logger.py` | Stop hook para captura automática |
| `squads/ops/scripts/log.mjs` | CLI para logging rápido |
| `squads/ops/scripts/activity-logger.mjs` | CLI completo |
| `squads/ops/scripts/daily-digest.mjs` | Processamento batch |
| `squads/ops/scripts/memory-query.mjs` | Consulta de memória |
| `squads/ops/scripts/log-maintenance.mjs` | Rotation e cleanup |

### Configuração

Hook registrado em `.claude/settings.local.json`:

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "python \"$CLAUDE_PROJECT_DIR/.claude/hooks/session-logger.py\"",
        "timeout": 5,
        "async": true
      }]
    }]
  }
}
```

## Related Decisions

- **DEC-2025-001**: Criação de Skills de Alta Performance
- **DEC-2025-002**: Sistema de Activity Logging Automático

## References

- `.claude/rules/activity-logging.md` - Regras para agentes
- `/institutional-memory` skill - Consumidor dos dados
- `/learning-loop` skill - Consumidor dos dados

---

*ADR-003 | Activity Logging System | Accepted 2025-02-12*
