# Engine de Enforcement — hotel-mkt Squad

> **Sistema central de enforcement** que transforma documentação em execução real através de gates, contratos e vetos.

**Versão:** 1.0.0
**Squad:** hotel-mkt
**Filosofia:** *"Documentação sem enforcement é aspiracional. Enforcement sem documentação é caótico."*

---

## O Que É Este Engine?

Este é o **protocolo de enforcement** do squad hotel-mkt. Enquanto os agentes e workflows definem **O QUE** fazer, este engine define **COMO GARANTIR** que seja feito com qualidade, no prazo e sem desastres.

### Problema que Resolve

Sem enforcement:
- ❌ Briefings vagos geram trabalho refeito
- ❌ Ads vão ao ar sem tracking → dinheiro desperdiçado
- ❌ Copy sem proof → baixa conversão
- ❌ Campanhas sem ROI claro → impossível otimizar
- ❌ Handoffs incompletos → agentes bloqueados

Com enforcement:
- ✅ Gates bloqueiam avanço sem critérios cumpridos
- ✅ Contratos definem entregáveis específicos entre agentes
- ✅ Vetos permitem "puxar a corda" quando detectar problema
- ✅ SLAs garantem velocidade e escalação automática

---

## Três Pilares do Enforcement

### 1. **Stage-Gate Protocol** (Cooper/P&G)

Inspirado no processo de inovação da Procter & Gamble, cada workflow tem **gates** entre fases que funcionam como **decisões Go/Kill/Hold/Recycle**.

**Como funciona:**
- Cada gate tem 3 tipos de critérios:
  - **Must-Meet:** Binários e obrigatórios (se 1 falhar = BLOCK)
  - **Should-Meet:** Pontuados 1-10 (média mínima 7.0 para GO)
  - **Kill Criteria:** Se 1 for verdadeiro = KILL projeto imediatamente

**Decisões possíveis:**
- **GO:** Avança para próxima fase
- **KILL:** Projeto cancelado (não é viável)
- **HOLD:** Pausado (aguardando recurso/informação)
- **RECYCLE:** Volta para fase anterior e refaz

**Gatekeeper:** `hotel-mkt-chief` (todas as decisões passam por ele)

**SLA:** Max 48h para decisão em gate. Se ultrapassar → escala para manager.

### 2. **Pipeline Automation** (Salesforce)

Inspirado nos pipelines de vendas da Salesforce, cada handoff entre agentes tem um **contrato** que define:

- **FROM/TO:** Quem entrega e quem recebe
- **DELIVERABLES:** Arquivos/outputs específicos com formato
- **ACCEPTANCE_CRITERIA:** Condições mensuráveis para aceitar
- **SLA:** Prazo máximo para entrega
- **ON_TIMEOUT:** Ação de escalação
- **ON_REJECT:** Ação de retorno com notas

**Exemplo:**
```yaml
contract_id: HC-001
from: hotel-trend-hunter
to: hotel-copywriter
deliverables:
  - name: "trend_report.pdf"
    format: "PDF com min 20 keywords + competitor matrix 10+ properties"
acceptance_criteria:
  - "Relatório cobre mínimo 20 keywords relevantes"
  - "Competitor matrix inclui pelo menos 10 propriedades"
  - "Dados de sazonalidade cobrem 90 dias futuros"
sla: "48h após solicitação"
on_timeout: "Escalar para hotel-mkt-chief"
on_reject: "Retornar com notas específicas de gaps"
```

### 3. **Andon System** (Toyota)

Inspirado no sistema de qualidade da Toyota, **qualquer agente pode "puxar a corda" para PARAR o processo** se detectar um problema de qualidade.

**Filosofia:** Melhor parar agora do que publicar algo ruim.

**Como funciona:**
- Cada agente tem **veto conditions** específicas do seu domínio
- 3 níveis de severidade:
  - **BLOCK:** Processo PARA até resolver
  - **WARN:** Alerta emitido, pode avançar com justificativa
  - **KILL:** Projeto/peça CANCELADO, não pode ser recuperado

**Exemplo de Veto:**
```yaml
agent: hotel-ads-specialist
veto_id: ADS-V1
condition: "Campanha sem tracking pixels verificados"
severity: BLOCK
action: "Verificar todos os pixels antes de lançar"
rationale: "Ads sem tracking = dinheiro jogado fora sem dados"
```

---

## Arquitetura do Enforcement

```
┌─────────────────────────────────────────────────────────────┐
│                    WORKFLOW EXECUTION                        │
│  ┌────────────┐  Gate G1  ┌────────────┐  Gate G2  ┌──────┐│
│  │  Phase 1   │──────────▶│  Phase 2   │──────────▶│ ...  ││
│  └────────────┘            └────────────┘            └──────┘│
│        │                          │                          │
│        ▼                          ▼                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              STAGE-GATE PROTOCOL                        ││
│  │  Must-Meet (BLOCK) + Should-Meet (7.0) + Kill (KILL)   ││
│  │  Gatekeeper: hotel-mkt-chief | SLA: 48h                ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│        Agent A ──────────▶ Agent B                          │
│                 Handoff                                      │
│                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────┐│
│  │           HANDOFF CONTRACT HC-XXX                       ││
│  │  Deliverables | Acceptance Criteria | SLA | Escalation ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │      VETO MATRIX (ANDON SYSTEM)                         ││
│  │  Qualquer agente pode "puxar a corda" se detectar:     ││
│  │  - Ads sem tracking (BLOCK)                             ││
│  │  - Copy sem proof (WARN)                                ││
│  │  - Campanha sem brief (BLOCK)                           ││
│  │  - Review negativa agressiva (KILL)                     ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Fluxo de Enforcement Típico

### Cenário: Campanha de Carnaval 2026

**1. Início (Gate G0 - Idea Screen)**
- Chief recebe demanda: "Campanha de Carnaval"
- **Must-Meet:**
  - [ ] Brief preenchido com datas, budget, objetivo
  - [ ] Budget alocado (mínimo R$ 10k)
  - [ ] Inventory disponível para período
- **Decisão:** GO (critérios cumpridos)

**2. Research → Strategy (Gate G1)**
- Trend Hunter entrega: `trend_report.pdf`, `competitor_matrix.xlsx`
- **Handoff Contract HC-001** valida:
  - ✅ 25 keywords pesquisadas
  - ✅ 12 competitors analisados
  - ✅ Dados de 90 dias
- **Should-Meet:**
  - Data completeness: 9.5/10
  - Actionability: 8.0/10
  - Média: 8.75 (> 7.0) → GO
- **Decisão:** GO

**3. Strategy → Offer (Gate G2)**
- Guest Strategist + Chief entregam: `strategy_doc.pdf`, `segment_profiles.json`
- **Must-Meet:**
  - [ ] 3+ segmentos definidos
  - [ ] Budget alocado por canal
  - [ ] Timeline validado com ops
- **Veto Triggered:** Chief detecta que brief não tem objetivo claro de ROI
  - **Severity:** BLOCK
  - **Action:** Definir meta de ROI antes de avançar
- Budget refeito com meta: ROI > 4x
- **Decisão:** GO (após correção)

**4. Creative → Deploy (Gate G3)**
- Copywriter entrega: `ad_copy_library.json` (150 ads)
- **Veto Triggered:** Ads Specialist detecta que 30% das ads não têm CTA claro
  - **Severity:** WARN
  - **Action:** Revisar CTAs ou documentar justificativa
- CTAs revisados
- **Must-Meet:**
  - ✅ 150+ ad variations
  - ✅ Landing pages com tracking
  - ✅ Pixels verificados
- **Decisão:** GO

**5. Deploy → Live (Gate G4)**
- Ads Specialist configura campanhas
- **Must-Meet:**
  - [ ] Tracking pixels firing 100%
  - [ ] Budget caps configurados
  - [ ] A/B tests prontos
- **Veto Triggered:** Direct Booking detecta que booking engine está com bug no checkout
  - **Severity:** BLOCK
  - **Action:** Corrigir bug antes de gastar em ads
- Bug corrigido
- **Decisão:** GO

**6. Live → Optimize (Gate G5)**
- Após 7 dias live, checkpoint:
- **Kill Criteria:**
  - [ ] ROI < 2x após 7 dias? NÃO (ROI = 3.2x)
  - [ ] Reviews negativas > 3 em 48h? NÃO
  - [ ] Budget > 120% planejado? NÃO
- **Should-Meet:**
  - Direct booking %: 58% (target 60%) → 9/10
  - Email open rate: 37% (target 35%) → 10/10
  - ROAS: 380% (target 400%) → 9/10
  - Média: 9.3 → GO
- **Decisão:** GO para fase de scaling

---

## Quick Reference: Gates por Workflow

### wf-seasonal-campaign (7 phases, 6 gates)

| Gate | Nome | Must-Meet | Should-Meet | Kill Criteria |
|------|------|-----------|-------------|---------------|
| G0 | Idea Screen | Brief + Budget + Inventory | — | Sem budget, hotel lotado |
| G1 | Research Validated | 20+ keywords, 10+ competitors, 90d data | Completeness > 7, Actionability > 7 | Dados < 30 dias |
| G2 | Strategy Approved | 3+ segmentos, budget alocado, timeline OK | Clarity > 7, ROI projection > 4x | Sem objetivo claro |
| G3 | Creative Ready | 150+ ads, landing pages, tracking | Readability > 7, CTA clarity > 9 | Sem CTAs, typos graves |
| G4 | Launch Approved | Pixels 100%, budget caps, A/B tests | Tracking 100%, load time < 3s | Booking engine down |
| G5 | Performance Check | 7 dias de dados, ROI calculado | ROI > 4x, Direct booking > 60% | ROI < 2x, reviews ruins |

### wf-direct-booking-funnel (6 phases, 5 gates)

| Gate | Nome | Must-Meet | Should-Meet | Kill Criteria |
|------|------|-----------|-------------|---------------|
| G1 | Audit Complete | Baseline direto %, CAC vs OTA, funnel mapped | Data > 95%, Actionability > 8 | Sem dados de booking |
| G2 | SEO Foundation | 100+ keywords, schema markup, GMB optimized | Site speed < 3s, Core Web Vitals green | Site speed > 5s |
| G3 | Conversion Ready | Booking engine otimizado, Pix, WhatsApp | Load time < 3s, Mobile score > 90 | Checkout quebrado |
| G4 | Retargeting Live | Pixels 100%, 100+ users/audience | Pixel accuracy 100% | Pixels não disparam |
| G5 | Email Automated | Sequences testadas, deliverability > 95% | Spam score < 3, Mobile rendering OK | Spam score > 5 |

### wf-paid-ads-scale (5 phases, 4 gates)

| Gate | Nome | Must-Meet | Should-Meet | Kill Criteria |
|------|------|-----------|-------------|---------------|
| G1 | Hooks Validated | 50+ hooks, scores > 7 | Clarity > 7, Impact > 7 | Hooks genéricos |
| G2 | Meat Produced | 3-5 formats, specs OK, UGC cleared | Quality > 8, Relevance > 7 | Vídeos pixelados |
| G3 | Ads Assembled | 150+ variations, platform specs OK | Platform compliance 100% | Violações de policy |
| G4 | Campaigns Live | Tracking 100%, budgets OK | Campaigns spending within 24h | Tracking falha |

### wf-content-machine (4 phases, 3 gates)

| Gate | Nome | Must-Meet | Should-Meet | Kill Criteria |
|------|------|-----------|-------------|---------------|
| G1 | Calendar Approved | 30 dias planejado, formatos definidos | Variety > 7, Engagement potential > 7 | Calendário vazio |
| G2 | Assets Produced | 20+ peças/semana, specs OK | Quality > 8, Brand consistency > 9 | Off-brand |
| G3 | Published & Tracked | Publicado on-time, engagement tracked | Engagement rate > 5% | Taxa < 1% por 2 semanas |

### wf-email-lifecycle (5 phases, 4 gates)

| Gate | Nome | Must-Meet | Should-Meet | Kill Criteria |
|------|------|-----------|-------------|---------------|
| G1 | Segments Defined | RFM segments, triggers mapeados | Segment clarity > 8 | Sem segmentação |
| G2 | Sequences Written | 7-10 emails, CTAs claros | Readability > 7, CTA clarity > 9 | Sem CTAs |
| G3 | Templates Ready | Mobile OK, spam < 3, tracking OK | Rendering 100%, Deliverability > 95% | Spam > 5 |
| G4 | Automation Live | Triggers testados, enviando | Open rate > 25%, Click rate > 3% | Open < 10% por 2 semanas |

### wf-reputation-engine (4 phases, 3 gates)

| Gate | Nome | Must-Meet | Should-Meet | Kill Criteria |
|------|------|-----------|-------------|---------------|
| G1 | Monitoring Setup | Todas plataformas conectadas, alertas OK | Response rate > 95% | Sem monitoramento |
| G2 | Response Protocol | Templates aprovados, SLA < 24h | Tone score > 8, Professionalism > 9 | Respostas agressivas |
| G3 | Generation Active | Solicitações automáticas, incentivos OK | Review generation > 10/mês | Sem novos reviews |

### wf-advertorial-seeding (4 phases, 3 gates)

| Gate | Nome | Must-Meet | Should-Meet | Kill Criteria |
|------|------|-----------|-------------|---------------|
| G1 | Media List | 20+ sites mapeados, contatos validados | Relevance > 7, Authority > 7 | Sites spam |
| G2 | Content Ready | 3-5 advertoriais, SEO OK, disclosure OK | Quality > 8, SEO optimization > 7 | Sem disclosure |
| G3 | Published & Tracked | Links live, backlinks rastreados | DA > 30, Traffic potential > 1k/mês | Links nofollow |

---

## Como Usar Este Engine

### Para Agentes

1. **Antes de iniciar trabalho:** Consulte handoff contracts para saber exatamente o que precisa entregar
2. **Durante execução:** Use veto conditions para detectar problemas cedo
3. **Ao finalizar:** Valide que deliverables atendem acceptance criteria
4. **Se bloquear:** Documente por que e acione SLA de escalação

### Para Chief (Gatekeeper)

1. **Em cada gate:** Execute checklist de must-meet, should-meet, kill criteria
2. **Decisão GO:** Avança fase
3. **Decisão KILL:** Cancela projeto, documenta motivo
4. **Decisão HOLD:** Pausa, define o que falta
5. **Decisão RECYCLE:** Volta fase anterior, documenta gaps
6. **Sempre:** Respeitar SLA de 48h para decisão

### Para Squad Leader

1. **Weekly:** Revisar gates executados e decisões tomadas
2. **Monthly:** Analisar taxa de GO/KILL/HOLD/RECYCLE por workflow
3. **Quarterly:** Otimizar gates baseado em aprendizados

---

## Métricas do Engine

### Gate Efficiency
- **Gate Pass Rate:** % de GO decisions
- **Gate Block Rate:** % de HOLD/RECYCLE
- **Gate Kill Rate:** % de KILL decisions
- **Time at Gate:** Tempo médio para decisão

**Target:**
- Pass rate: 70-80% (se > 90% = gates muito fracos, se < 60% = gates muito duros)
- Block rate: 15-25%
- Kill rate: 5-10%
- Time at gate: < 24h (max 48h)

### Contract Efficiency
- **On-Time Delivery:** % handoffs dentro do SLA
- **First-Time Acceptance:** % aceitos sem retrabalho
- **Escalation Rate:** % handoffs que escalaram

**Target:**
- On-time: > 85%
- First-time acceptance: > 75%
- Escalation rate: < 10%

### Veto Effectiveness
- **Veto Rate:** Quantos vetos acionados / total de execuções
- **Veto Resolution Time:** Tempo médio para resolver veto
- **False Positive Rate:** % vetos que não eram problemas reais

**Target:**
- Veto rate: 5-15% (se > 20% = processo ruim, se < 2% = vetos não usados)
- Resolution time: < 4h para BLOCK, < 1h para KILL
- False positive: < 5%

---

## Arquivos do Engine

| Arquivo | Descrição | Linhas |
|---------|-----------|--------|
| `README.md` | Este arquivo — visão geral e guia de uso | 400+ |
| `stage-gate-protocol.yaml` | Definição de todos os gates para todos os workflows | 500+ |
| `handoff-contracts.yaml` | Contratos entre todos os 13 agentes | 400+ |
| `veto-matrix.yaml` | Condições de veto de todos os agentes | 300+ |

---

## Próximos Passos

1. **Implementar logging:** Registrar todas as decisões de gate
2. **Dashboard:** Visualizar métricas de gate efficiency em tempo real
3. **Automação:** Validar must-meet criteria automaticamente onde possível
4. **Training:** Treinar agentes em como usar vetos corretamente

---

## Referências

- **Cooper Stage-Gate (P&G):** Process de inovação com gates Go/Kill
- **Salesforce Pipeline:** Automação de handoffs e SLAs
- **Toyota Andon:** Sistema de qualidade com stop-the-line
- **Poka-yoke (Toyota):** Mistake-proofing em processos

---

**Engine de Enforcement v1.0.0 | hotel-mkt squad | 7 workflows | 13 agentes | 28 gates | 35+ contratos | 50+ vetos**

*"Enforcement transforma aspiração em execução."*
