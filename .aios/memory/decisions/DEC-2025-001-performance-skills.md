# DEC-2025-001: Criação de Skills de Alta Performance

## Metadata

| Field | Value |
|-------|-------|
| **ID** | DEC-2025-001 |
| **Date** | 2025-02-11 |
| **Category** | architectural |
| **Participants** | Director (Thiago), @aios-master (Orion), Board (Musk, Thiel, Gates, Munger) |
| **Outcome** | positive |

## Context

### Situation
O sistema AIOS Lab precisava de skills que aumentassem a performance dos agentes em termos de:
- Economia de tokens
- Prevenção de erros e custos descontrolados
- Inteligência acumulada (compound intelligence)
- Vantagem competitiva (moat)

### Constraints
- Budget limitado (€468/mês)
- Necessidade de ROI rápido
- Skills devem ser auto-invocadas pelos agentes (sem intervenção do usuário)

### Alternatives Considered
1. **Otimização manual** - Rejected: não escala, depende de lembrança humana
2. **Tools externos** - Rejected: overhead de integração, custos adicionais
3. **Skills internas com auto-routing** - Selected: controle total, integração nativa

## Decision

Criar 6 skills organizadas em 2 tiers, baseadas nas filosofias dos Board Advisors:

### Tier 1 - Foundational (Performance)
| Skill | Advisor | Filosofia |
|-------|---------|-----------|
| `/context-optimizer` | Elon Musk | "Delete before optimize" |
| `/circuit-breaker` | Charlie Munger | "Invert, always invert" |
| `/learning-loop` | Peter Thiel | "Zero to one" |

### Tier 2 - Competitive Advantage
| Skill | Advisor | Filosofia |
|-------|---------|-----------|
| `/institutional-memory` | Peter Thiel | "Knowledge moat" |
| `/cost-guardian` | Charlie Munger | "Show me the incentive" |
| `/skill-composer` | Bill Gates | "Network effect multiplies value" |

### Rationale
1. **Economia de tokens**: context-optimizer ataca diretamente o maior custo
2. **Prevenção de erros**: circuit-breaker + cost-guardian criam guardrails
3. **Inteligência acumulada**: learning-loop + institutional-memory criam vantagem que cresce com uso
4. **Orquestração**: skill-composer permite combinar skills para valor exponencial

## Outcomes

### Implemented
- [x] 6 skills criadas com SKILL.md completo
- [x] Sistema de auto-routing implementado (opt-in)
- [x] Registry central em `_registry.yaml`
- [x] Estrutura de storage para memória e learning
- [x] Documentação atualizada em CLAUDE.md

### Metrics to Track
- Tokens/task (before vs after context-optimizer)
- Circuit breaker trips/week
- Patterns learned/week
- Cost per task trend

## Lessons

1. **Board consultation** agrega valor significativo - cada advisor trouxe perspectiva única
2. **Auto-routing opt-in** é mais seguro que opt-out para skills
3. **Storage structure** deve ser criado junto com skills de memória

## Related

- Skill auto-routing system (implemented same session)
- `.claude/rules/skill-auto-routing.md`
- `.claude/skills/_registry.yaml`

## Keywords

skills, performance, tokens, optimization, circuit-breaker, learning, memory, moat, compound-intelligence, cost-control, budget, auto-routing

---

*Recorded by /institutional-memory skill*
