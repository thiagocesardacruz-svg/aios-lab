# Growth Squad

> Scaling, Optimization & Experimentation

## Overview

The Growth Squad focuses on scaling Travel Tech Digital through systematic experimentation, data analysis, and optimization. Uses the AARRR (Pirate Metrics) framework and rigorous statistical methods.

**Domain:** Go-to-Market
**Version:** 1.1.0
**Total Components:** 23

## Agents

| Agent | Name | Role | Specialization |
|-------|------|------|----------------|
| growth-lead | Phoenix | Growth Lead | Strategy, waves, experiments |
| data-analyst | Aria | Data Analyst | Metrics, cohorts, insights |
| growth-hacker | Blaze | Growth Hacker | A/B tests, optimization |
| pmf-specialist | Sage | PMF Specialist | Product-market fit validation |

## AARRR Framework

```
Acquisition → Activation → Retention → Referral → Revenue
     ↓            ↓            ↓           ↓          ↓
  Traffic    First Value   Come Back    Tell Others  Pay Us
    5-10%      40-60%        40%+         >10%       3-5%
```

### Stage Responsibilities

| Stage | Focus | Key Metrics |
|-------|-------|-------------|
| **Acquisition** | How users find us | Visitors, Signups, CAC |
| **Activation** | First value experience | Activation rate, Time to value |
| **Retention** | Users coming back | D1/D7/D30 retention, Churn |
| **Referral** | Users telling others | Viral coefficient, NPS |
| **Revenue** | Users paying | Conversion, ARPU, LTV |

## Commands

| Command | Description |
|---------|-------------|
| `/growth/experiment` | Design and run A/B experiment |
| `/growth/analyze-funnel` | Analyze conversion funnel |
| `/growth/market-research` | Deep market research |
| `/growth/competitor-analysis` | Competitor deep-dive |
| `/growth/create-wave` | Create growth wave |
| `/growth/assess-pmf` | Assess product-market fit |
| `/growth/ice-score` | Calculate ICE scores |
| `/growth/retention` | Analyze retention cohorts |

## Components

### Workflows (5)

| Workflow | Purpose |
|----------|---------|
| `experiment.yaml` | End-to-end A/B testing |
| `analyze-funnel.yaml` | Funnel analysis pipeline |
| `market-research.yaml` | Market research deep-dive |
| `competitor-analysis.yaml` | Competitor analysis |
| `create-wave.yaml` | Growth wave creation |

### Tasks (6)

| Task | Agent | Purpose |
|------|-------|---------|
| `design-experiment.md` | growth-hacker | Design experiments |
| `analyze-ab-test.md` | data-analyst | Statistical analysis |
| `calculate-ice-score.md` | growth-lead | Prioritization |
| `assess-pmf.md` | pmf-specialist | PMF assessment |
| `funnel-optimization.md` | growth-hacker | Funnel improvements |
| `retention-analysis.md` | data-analyst | Cohort analysis |

### Templates (4)

| Template | Use Case |
|----------|----------|
| `experiment-design-tmpl.md` | Experiment planning |
| `experiment-report-tmpl.md` | Results documentation |
| `pmf-assessment-tmpl.md` | PMF evaluation |
| `wave-plan-tmpl.md` | Growth wave planning |

### Checklists (2)

| Checklist | Purpose |
|-----------|---------|
| `experiment-checklist.md` | A/B test quality gates |
| `funnel-analysis-checklist.md` | Funnel analysis steps |

### Data (2)

| Data File | Contents |
|-----------|----------|
| `growth-metrics.yaml` | AARRR metrics, ICE guide |
| `retention-benchmarks.yaml` | Industry benchmarks |

## Growth vs Marketing

| Marketing Squad | Growth Squad |
|-----------------|--------------|
| Brand & messaging | Optimization & metrics |
| Content creation | A/B testing |
| Channel strategy | Funnel analysis |
| Positioning | Experimentation |
| Campaign execution | Statistical rigor |

Growth takes Marketing inputs and optimizes for scale through data-driven experimentation.

## ICE Scoring Framework

```
ICE = (Impact + Confidence + Ease) / 3
```

| Factor | Scale | Description |
|--------|-------|-------------|
| **Impact** | 1-10 | How much will this move the needle? |
| **Confidence** | 1-10 | How sure are we it will work? |
| **Ease** | 1-10 | How easy to implement? |

### Priority Bands
- **ICE 8-10:** Execute immediately
- **ICE 6-8:** High priority backlog
- **ICE 4-6:** Medium priority
- **ICE 1-4:** Low priority/revisit

## PMF Assessment Framework

### PMF Levels

| Level | Sean Ellis Survey | Retention | Description |
|-------|-------------------|-----------|-------------|
| 0 | <20% disappointed | High churn | No fit |
| 1 | 20-30% disappointed | Some retention | Early signals |
| 2 | 30-40% disappointed | Clear segment | Emerging |
| 3 | >40% disappointed | Growing organically | Strong |
| 4 | >50% disappointed | Category defining | Leader |

### Key PMF Signals
- Sean Ellis "very disappointed" survey
- Retention curves flattening
- Organic/word-of-mouth growth
- Net Revenue Retention >100%

## Retention Benchmarks

### B2B SaaS (Our Target)

| Day | Benchmark | Good | World-Class |
|-----|-----------|------|-------------|
| Day 1 | 80% | 85% | 90%+ |
| Day 7 | 60% | 65% | 75%+ |
| Day 30 | 40% | 45% | 55%+ |
| Steady | 30% | 35% | 40%+ |

### Hotel Management SaaS (Our Vertical)

| Day | Benchmark |
|-----|-----------|
| Day 1 | 85% |
| Day 7 | 70% |
| Day 30 | 50% |
| Steady | 35-40% |

## Experiment Methodology

### Statistical Defaults
- **Confidence Level:** 95%
- **Power:** 80%
- **Minimum Detectable Effect:** 5%

### Experiment Lifecycle
```
Design → Build → QA → Launch → Monitor → Analyze → Document
```

### Red Flags
- SRM (Sample Ratio Mismatch) > 1%
- Guardrail metric breach
- External event during test
- Novelty effect detected

## Integration Points

### Inputs From
- **Marketing:** Campaign data, channel performance
- **Tech:** Product analytics, feature flags
- **Customer:** Support tickets, feedback
- **Finance:** Revenue data, LTV calculations

### Outputs To
- **Product:** Feature prioritization based on data
- **Marketing:** Optimized messaging and channels
- **Board:** Growth metrics and PMF status
- **Tech:** A/B test requirements

## Quality Metrics

| Metric | Target |
|--------|--------|
| Experiment win rate | >30% |
| Experiments per wave | 5-10 |
| Funnel conversion lift | >5% per quarter |
| PMF score improvement | +1 level per quarter |

## File Structure

```
squads/growth/
├── squad.yaml
├── README.md
├── agents/
│   ├── growth-lead.md
│   ├── data-analyst.md
│   ├── growth-hacker.md
│   └── pmf-specialist.md
├── workflows/
│   ├── experiment.yaml
│   ├── analyze-funnel.yaml
│   ├── market-research.yaml
│   ├── competitor-analysis.yaml
│   └── create-wave.yaml
├── tasks/
│   ├── design-experiment.md
│   ├── analyze-ab-test.md
│   ├── calculate-ice-score.md
│   ├── assess-pmf.md
│   ├── funnel-optimization.md
│   └── retention-analysis.md
├── templates/
│   ├── experiment-design-tmpl.md
│   ├── experiment-report-tmpl.md
│   ├── pmf-assessment-tmpl.md
│   └── wave-plan-tmpl.md
├── checklists/
│   ├── experiment-checklist.md
│   └── funnel-analysis-checklist.md
└── data/
    ├── growth-metrics.yaml
    └── retention-benchmarks.yaml
```

---

*Growth Squad v1.1.0 - AIOS 2.1.0 Compliant*
