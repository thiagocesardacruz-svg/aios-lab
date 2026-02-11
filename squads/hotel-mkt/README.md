# hotel-mkt — Marketing Hoteleiro Brasil AB

> Squad especializado em marketing digital para hotéis e pousadas do Brasil, focado no público classe AB.

**Filosofia:** *"Não vendemos quartos. Vendemos sonhos, memórias e sentimentos."*

**DNA Triplo:** Hormozi (conversão) + Chip Conley (hospitalidade) + Ian Schrager (desejo visual)

---

## Arquitetura

```
═══════════════════════════════════════════════════════════════
TIER 0 — ORCHESTRATOR
═══════════════════════════════════════════════════════════════
  hotel-mkt-chief           Orquestra, diagnostica, roteia

═══════════════════════════════════════════════════════════════
TIER 1 — NÚCLEO ESTRATÉGICO
═══════════════════════════════════════════════════════════════
  hotel-trend-hunter        Tendências, buscas, sazonalidade
  hotel-offer-architect     Pacotes irresistíveis (Grand Slam)
  hotel-guest-strategist    Jornada emocional do hóspede

═══════════════════════════════════════════════════════════════
TIER 2 — EXECUÇÃO
═══════════════════════════════════════════════════════════════
  hotel-copywriter          Copy emocional multi-canal
  hotel-social-creator      Instagram, Reels, TikTok, blog
  hotel-ads-specialist      Meta, Google, Bing, TikTok Ads
  hotel-email-maestro       Email lifecycle completo
  hotel-seo-architect       SEO anti-OTA

═══════════════════════════════════════════════════════════════
TIER 3 — ESPECIALISTAS
═══════════════════════════════════════════════════════════════
  hotel-reputation-guardian Reviews, TripAdvisor, reputação
  hotel-ugc-curator         Conteúdo gerado por hóspedes
  hotel-direct-booking      Conversão direta, anti-OTA, WhatsApp
  hotel-pr-advertorial      Matérias, advertoriais, native ads
```

---

## Ativação

```
@hotel-mkt-chief    → Ativa o orchestrador (roteia para especialistas)
@hotel-trend-hunter → Ativa pesquisador de tendências
@hotel-copywriter   → Ativa copywriter
... (qualquer agente pode ser ativado diretamente)
```

---

## Comandos

| Comando | Descrição |
|---------|-----------|
| `*help` | Lista todos os comandos |
| `*campaign {tema}` | Inicia campanha sazonal completa |
| `*trend-report` | Gera relatório de tendências |
| `*create-offer {tipo}` | Cria pacote/oferta Grand Slam |
| `*email-sequence {tipo}` | Cria sequência de emails |
| `*create-ads {campanha}` | Cria set de 150+ ads |
| `*seo-audit` | Auditoria SEO completa |
| `*reputation-report` | Relatório de reputação online |
| `*ugc-campaign` | Programa de UGC para hóspedes |
| `*direct-booking-audit` | Auditoria de reservas diretas |
| `*advertorial {tema}` | Cria matéria/advertorial |
| `*content-calendar` | Gera calendário de conteúdo |
| `*exit` | Sai do modo squad |

---

## Workflows

| Workflow | Fases | Duração | Agentes |
|----------|-------|---------|---------|
| `wf-seasonal-campaign` | 7 | 4-6 semanas | Todos |
| `wf-direct-booking-funnel` | 6 | 2-4 semanas | 4 agentes |
| `wf-content-machine` | 5 | Contínuo | 4 agentes |
| `wf-email-lifecycle` | 5 | 2-3 semanas | 4 agentes |
| `wf-paid-ads-scale` | 5 | 1-2 semanas | 3 agentes |
| `wf-reputation-engine` | 6 | Contínuo | 3 agentes |
| `wf-advertorial-seeding` | 6 | 2-4 semanas | 4 agentes |

---

## Mind DNA Sources

### Primário (50%) — Alex Hormozi
- Grand Slam Offer, Value Equation, GOATed Ads (50×3×1)
- Hook-Meat-CTA, Proof>Promise>Plan, Core Four
- 4 Pillars of Nurture, LTV:CAC 3:1, Rule of 100
- 17 arquivos de DNA completos em `data/minds/`

### Secundário (30%) — Chip Conley
- Peak Pyramid (Survival → Success → Transformation)
- Customer Transformation (Expectations → Desires → Unrecognized Needs)
- 5 Adjectives Brand Identity, Identity Refreshment
- H2H (Human-to-Human), Psychographics Over Demographics

### Terciário (20%) — Ian Schrager
- Hotel as Theater, Lobby as Marketing Engine
- Velvet Rope (FOMO), Democratization of Luxury
- Design as Marketing Tool, Visual Storytelling

### Complementar
- **Neil Patel**: SEO anti-OTA, content multiplication
- **PMWeb**: CRM/dados, lifecycle automation, RFM
- **Mapie**: WhatsApp conversion, hospitalidade brasileira
- **Tribuzana**: Social media hoteleiro
- **Propeller/O'Rourke**: Performance marketing, reputação

---

## Frameworks Exclusivos

### 1. Emotional Value Equation
```
Valor = (Sonho × Certeza × Identidade) / (Esforço + Tempo + Risco)
```

### 2. Theater Content Framework
```
Conteúdo = Atmosfera (Schrager) + Hook-Retain-Reward (Hormozi)
         = Capturar SENTIMENTO + Estrutura que CONVERTE
```

### 3. Direct Booking Funnel (Anti-OTA)
```
SEO/Social → WhatsApp/AI → Qualifica → Oferta Direta → Pix → Reserva
Target: 60%+ reservas diretas
```

### 4. Reputation = Revenue
```
+1 estrela TripAdvisor = +5-9% receita
MRR 95%+ | Resposta <48h | Review Generation
```

### 5. Guest Transformation Journey
```
Expectativa → Desejo → Necessidade Não-Reconhecida → EVANGELISTA
(cama limpa)   (spa)   (travesseiro preferido no      (indica pra
                        quarto sem pedir)               todo mundo)
```

---

## KPIs do Squad

| KPI | Meta |
|-----|------|
| Reservas diretas | 60%+ |
| LTV:CAC | 3:1 mínimo |
| Taxa de resposta reviews | 95%+ |
| Email open rate | 25%+ |
| Variações de ads/campanha | 150+ |
| Peças de conteúdo/semana | 20+ |
| Conversão WhatsApp | 25-40% |
| Crescimento tráfego orgânico | 20-35% em 6 meses |

---

## Estrutura de Arquivos

```
squads/hotel-mkt/
├── config.yaml                          # Configuração do squad
├── README.md                            # Este arquivo
├── agents/
│   ├── hotel-mkt-chief.md              # Tier 0: Orchestrator
│   ├── hotel-trend-hunter.md           # Tier 1: Tendências
│   ├── hotel-offer-architect.md        # Tier 1: Ofertas
│   ├── hotel-guest-strategist.md       # Tier 1: Jornada do hóspede
│   ├── hotel-copywriter.md             # Tier 2: Copy
│   ├── hotel-social-creator.md         # Tier 2: Social media
│   ├── hotel-ads-specialist.md         # Tier 2: Ads
│   ├── hotel-email-maestro.md          # Tier 2: Email
│   ├── hotel-seo-architect.md          # Tier 2: SEO
│   ├── hotel-reputation-guardian.md    # Tier 3: Reputação
│   ├── hotel-ugc-curator.md            # Tier 3: UGC
│   ├── hotel-direct-booking.md         # Tier 3: Reserva direta
│   └── hotel-pr-advertorial.md         # Tier 3: PR/Advertorial
├── workflows/
│   ├── wf-seasonal-campaign.yaml       # Campanha sazonal
│   ├── wf-direct-booking-funnel.yaml   # Funil anti-OTA
│   ├── wf-content-machine.yaml         # Máquina de conteúdo
│   ├── wf-email-lifecycle.yaml         # Lifecycle email
│   ├── wf-paid-ads-scale.yaml          # Escalar ads
│   ├── wf-reputation-engine.yaml       # Motor de reputação
│   └── wf-advertorial-seeding.yaml     # Seeding editorial
├── data/
│   └── minds/
│       ├── hormozi-voice-dna.yaml      # Voice DNA Hormozi
│       ├── hormozi-thinking-dna.yaml   # Thinking DNA Hormozi
│       ├── hormozi-ads_dna.yaml        # Ads DNA
│       ├── hormozi-content_dna.yaml    # Content DNA
│       ├── hormozi-copy_dna.yaml       # Copy DNA
│       ├── hormozi-hooks_dna.yaml      # Hooks DNA
│       ├── hormozi-leads_dna.yaml      # Leads DNA
│       ├── hormozi-models_dna.yaml     # Models DNA
│       ├── hormozi-offers_dna.yaml     # Offers DNA
│       ├── hormozi-pricing_dna.yaml    # Pricing DNA
│       ├── hormozi-retention_dna.yaml  # Retention DNA
│       ├── hormozi-launch_dna.yaml     # Launch DNA
│       ├── hormozi-advisor_dna.yaml    # Advisor DNA
│       ├── hormozi-audit_dna.yaml      # Audit DNA
│       ├── hormozi-closer_dna.yaml     # Closer DNA
│       ├── hormozi-scale_dna.yaml      # Scale DNA
│       ├── hormozi-workshop_dna.yaml   # Workshop DNA
│       ├── conley-hospitality-dna.yaml # Chip Conley DNA
│       └── schrager-theater-dna.yaml   # Ian Schrager DNA
├── tasks/                               # (a criar conforme necessidade)
├── checklists/                          # (a criar conforme necessidade)
└── templates/                           # (a criar conforme necessidade)
```

---

## Métricas do Squad

| Componente | Quantidade | Linhas Totais |
|------------|-----------|---------------|
| Agentes | 14 | 18.624 |
| Workflows | 7 | 6.652 |
| Mind DNA | 19 | ~2.500 |
| Config | 1 | 240 |
| **TOTAL** | **41 arquivos** | **~28.000** |

---

## Uso Rápido

**Campanha de Carnaval:**
```
@hotel-mkt-chief
*campaign Carnaval 2026
```

**Auditoria de reservas diretas:**
```
@hotel-direct-booking
*direct-booking-audit
```

**Criar pacote romântico:**
```
@hotel-offer-architect
*create-offer romance
```

**Relatório de tendências:**
```
@hotel-trend-hunter
*trend-report
```

---

*Squad Creator v2.5.0 | hotel-mkt v1.0.0 | 14 agents | 7 workflows | 19 mind DNA files*
*DNA: Hormozi (50%) + Conley (30%) + Schrager (20%)*
