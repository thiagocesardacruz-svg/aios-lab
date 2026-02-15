# Decision Memo: Processos de Engenharia de Produção para AIOS

**Data:** 2026-02-15
**Advisors Consultados:** Elon Musk, Ray Dalio, Steve Jobs, Charlie Munger
**Contexto:** Validação de processos industriais a adotar no AIOS Method, com engenheira de produção especialista em transformação digital.

---

## Processos de Eng. Produção já presentes no AIOS

| Conceito Industrial | Equivalente AIOS | Onde vive |
|---|---|---|
| Lean Manufacturing | 80% templates, lazy rendering, zero AI calls desnecessárias | `CLAUDE.md` — Execution Tunnel |
| Kanban | Flow To Do → In Progress → Review → Done no ClickUp. WIP limit implícito | `clickup-auto-sync.md` |
| Six Sigma (DMAIC) | Quality gates, handover contracts com confidence levels | `handover-contracts.md` |
| SOP (Standard Operating Procedures) | Tasks são SOPs executáveis com elicitation | `squads/*/tasks/` |
| OEE (Overall Equipment Effectiveness) | Model routing (Haiku/Sonnet/Opus) + budget tracking | `model-routing.md` |
| Supply Chain Management | Tool hierarchy: local (€0) → native → MCP | `local-tools-auto-use.md` |
| TPM (Total Productive Maintenance) | Circuit breaker, activity logging | `.claude/skills/circuit-breaker` |
| Gestão de Qualidade (ISO 9001) | Governance RED rules, checklists, DoD por story | `governance/` |
| PDCA (Plan-Do-Check-Act) | Plan mode → Execute → QA checklist → Learning loop | Skills: `architect-first` |
| Poka-Yoke (Error Proofing) | Auto-invoke skills, skill registry com triggers | `skill-auto-routing.md` |
| Value Stream Mapping | Squad structure = value streams (18 squads) | `squads/` |

---

## Board Recommendation: ADOTAR

| Processo | Por quê | Advisor |
|---|---|---|
| **Theory of Constraints** | Sistema tão rápido quanto o bottleneck. Identificar onde tasks acumulam | Musk |
| **Poka-Yoke (Error-Proofing)** | Pre-flight checks antes de iniciar, não só checklists depois | Musk, Dalio |
| **Statistical Process Control (leve)** | Cycle time por agent, First-Time-Right rate, rework % | Musk, Dalio |
| **Value Stream Mapping (1x/quarter)** | Mapear flow real, matar handovers desnecessários | Musk, Dalio |
| **Kaizen focado** | 1 melhoria/semana, medida | Musk, Dalio |
| **5 métricas observáveis** | Completion rate, budget burn, error rate, handover failures, incidents | Jobs |
| **Closed-loop corrective action** | Weekly auto-review, monthly SOP audit, quarterly optimization | Dalio |

## Board Recommendation: REJEITAR

| Processo | Por quê | Advisor |
|---|---|---|
| **Six Sigma formal** | Overkill. Poka-yoke previne o defeito | Musk |
| **OEE para agents** | Agents escalam horizontalmente. "Uptime" irrelevante | Musk |
| **Heijunka** | Só relevante se capacity-constrained. API escala | Musk |
| **TPM** | Agents não degradam como máquinas | Musk |
| **CMMI / Maturity Models** | O mercado diz o nível de maturidade | Jobs |
| **Observability tooling sprawl** | Já temos ClickUp + logs. Zero novos vendors | Jobs |

---

## Alertas de Risco (Munger)

1. **Agents não são máquinas** — outputs probabilísticos, não determinísticos. Process control dá falsa confiança
2. **Goodhart's Law** — medir "tasks completed" cria incentivo a fragmentar trabalho artificialmente
3. **Slack é necessário** — eliminar "desperdício" demais mata capacidade de insight criativo
4. **Falhas invisíveis** — erros reais (arquitetura errada, problema mal entendido) não aparecem no Kanban
5. **Man-with-a-Hammer Syndrome** — Lean Manufacturing elimina variação; AI agent orchestration requer flexibilidade cognitiva
6. **Scale Illusion** — mais agents ≠ melhor; é como mais tradutores num jogo de telefone
7. **Usar como toolkit, não religião** — quality gates para high-risk, liberdade total para exploração

---

## Status de Implementação

| Processo Recomendado | Status | Evidência |
|---|---|---|
| Theory of Constraints | Parcial | ClickUp Kanban mostra filas, mas sem bottleneck detection automático |
| Poka-Yoke | Forte | Handover contracts, skill auto-routing, circuit breaker. Falta pre-flight |
| SPC | **Implementado** | `node squads/ops/scripts/cycle-time.mjs` — cycle time, p50/p90, outliers, stddev |
| Value Stream Mapping | Inexistente | Squad structure existe, mapeamento formal não |
| Kaizen focado | Informal | Learning loop skill existe, sem ritual semanal |
| 5 métricas observáveis | Parcial | Budget tracking + cycle time. Faltam 3 métricas |
| Closed-loop corrective action | Fraco | Daily digest existe, não propõe melhorias |
| 5S Digital | Forte | Squad pattern padronizado, rules comprimidas |

---

## Cycle Time Report (dados reais 2026-02-15)

```
| Metric         | Value  | Target | Status |
|----------------|--------|--------|--------|
| Avg Cycle Time | 5.4h   | <24h   | ✅     |
| P50            | 2.8h   | —      | —      |
| P90            | 20.2h  | —      | —      |
| Std Deviation  | 7.8h   | —      | —      |
| WIP Count      | 0      | <5     | ✅     |
| Throughput     | 15     | —      | —      |
| Outliers       | 1      | 0      | 🔴     |

SPC Insight: Alta variabilidade (stddev > mean). 1 outlier: Epic Clawdbot (22.1h).

By Agent:
| Agent           | Avg CT | Tasks |
|-----------------|--------|-------|
| Dev (Code)      | 6min   | 5     |
| DevOps (Infra)  | 6.7h   | 6     |
| Project Manager | 11.3h  | 2     |
| Automation Lead | 17.7h  | 1     |
```

**Comando:** `node squads/ops/scripts/cycle-time.mjs [--by=agent|squad] [--days=N] [--format=json]`

---

## Perguntas para Validação com Especialista

1. "Dos processos que adotamos, qual está mais frágil?"
2. "Concordas com o que rejeitamos (Six Sigma, OEE, Heijunka, TPM)?"
3. "Como adaptar SPC para outputs não-determinísticos?"
4. "Qual o risco #1 onde a analogia industrial vai quebrar?"

---

*Gerado por Orion (@aios-master) via Board of Advisors consultation.*
*Dados de cycle time via `squads/ops/scripts/cycle-time.mjs` (€0 — determinístico).*
