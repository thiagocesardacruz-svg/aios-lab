# Customer Squad

> Post-Sale Success, Retention & LTV

## Overview

The Customer Squad ensures customers achieve success with Travel Tech Digital products. Focuses on maximizing customer lifetime value through excellent onboarding, proactive retention, and strategic expansion.

**Domain:** Customer Success
**Version:** 1.1.0
**Total Components:** 21

## Agents

| Agent | Name | Role | Specialization |
|-------|------|------|----------------|
| customer-lead | Haven | Customer Lead | Success strategy, retention |
| onboarding-architect | Guide | Onboarding Architect | Time-to-value, activation |
| retention-strategist | Renew | Retention Strategist | Churn, upsell, health scoring |

## Customer Lifecycle

```
Purchase → Onboarding → Adoption → Expansion → Advocacy
    ↓          ↓            ↓          ↓          ↓
 Welcome   First Value    Habits    Upsell    Referrals
  < 1h      < 7 days     30-90d    Ongoing    Ongoing
```

### Stage Goals

| Stage | Goal | Key Metric |
|-------|------|------------|
| **Purchase** | Welcome & access | Time to first login |
| **Onboarding** | First value experience | Activation rate |
| **Adoption** | Deep feature usage | Feature adoption % |
| **Expansion** | Grow account value | Expansion revenue |
| **Advocacy** | Generate referrals | NPS & referral rate |

## Commands

| Command | Description |
|---------|-------------|
| `/customer/onboarding-sequence` | Create onboarding sequence |
| `/customer/retention-system` | Design retention system |
| `/customer/upsell-campaign` | Create upsell campaign |
| `/customer/analyze-churn` | Analyze churn patterns |
| `/customer/health-score` | Create health score model |
| `/customer/escalation` | Handle customer escalation |
| `/customer/playbook` | Create CS playbook |

## Components

### Workflows (3)

| Workflow | Purpose |
|----------|---------|
| `onboarding-sequence.yaml` | End-to-end onboarding design |
| `retention-system.yaml` | Health scoring & interventions |
| `upsell-campaign.yaml` | Expansion campaigns |

### Tasks (6)

| Task | Agent | Purpose |
|------|-------|---------|
| `design-onboarding.md` | onboarding-architect | Design onboarding flow |
| `analyze-churn.md` | retention-strategist | Churn analysis |
| `create-health-score.md` | retention-strategist | Health score model |
| `design-upsell.md` | retention-strategist | Upsell campaigns |
| `handle-escalation.md` | customer-lead | Escalation handling |
| `create-playbook.md` | retention-strategist | CS playbooks |

### Templates (4)

| Template | Use Case |
|----------|----------|
| `onboarding-sequence-tmpl.md` | Onboarding documentation |
| `customer-health-tmpl.md` | Health score reports |
| `churn-analysis-tmpl.md` | Churn analysis reports |
| `upsell-campaign-tmpl.md` | Campaign planning |

### Checklists (2)

| Checklist | Purpose |
|-----------|---------|
| `onboarding-checklist.md` | Onboarding quality gates |
| `churn-prevention-checklist.md` | Retention intervention steps |

### Data (2)

| Data File | Contents |
|-----------|----------|
| `customer-lifecycle.yaml` | Lifecycle stages, definitions |
| `health-score-model.yaml` | Health score algorithm |

## Health Score Model

### Score Components

| Component | Weight | Metrics |
|-----------|--------|---------|
| **Usage** | 30% | Login frequency, feature adoption, active users |
| **Engagement** | 25% | Session duration, actions, return frequency |
| **Relationship** | 25% | NPS, support sentiment, CSM engagement |
| **Business** | 20% | Revenue trend, payments, expansion signals |

### Health Zones

| Zone | Score | Action |
|------|-------|--------|
| 🟢 Healthy | 80-100 | Expansion focus |
| 🟡 At Risk | 50-79 | Proactive outreach |
| 🔴 Critical | 0-49 | Immediate intervention |

## Key Metrics & Targets

| Metric | Target | Benchmark |
|--------|--------|-----------|
| **Time to First Value** | < 3 min | < 5 min |
| **Activation Rate** | 50% | 40-60% |
| **Day 7 Retention** | 65% | 60% |
| **Day 30 Retention** | 45% | 40% |
| **Monthly Churn** | < 3% | 3-5% |
| **NPS** | > 50 | 30-50 |
| **NRR** | > 110% | 100-110% |

## Churn Prevention Framework

### Risk Signals

| Signal | Severity | Action |
|--------|----------|--------|
| No login 14+ days | Medium | Re-engagement email |
| Support ticket spike | High | CSM check-in |
| Feature usage drop | Medium | Training offer |
| Payment failure | Critical | Immediate outreach |
| NPS detractor (0-6) | High | CSM follow-up |
| Champion left | High | Stakeholder mapping |

### Save Play Framework

| Risk Level | Response Time | Owner | Approach |
|------------|---------------|-------|----------|
| Critical | 1 hour | Executive | Discount + exec call |
| High | 4 hours | CSM Manager | Personal outreach |
| Medium | 24 hours | CSM | Value reinforcement |
| Low | 1 week | Automated | Nurture sequence |

## Customer Segmentation

### By Tier

| Tier | Criteria | Service Level |
|------|----------|---------------|
| **Enterprise** | ARR > $50K | Dedicated CSM |
| **Business** | ARR $10-50K | Pooled CSM |
| **Starter** | ARR < $10K | Tech touch |

### By Lifecycle

| Stage | Age | Focus |
|-------|-----|-------|
| New | < 90 days | Activation |
| Established | 90d - 1yr | Adoption |
| Mature | > 1 year | Expansion |

## Integration Points

### Inputs From
- **Tech:** Product analytics, usage data
- **Growth:** Funnel data, cohort analysis
- **Finance:** Billing, payment data
- **Support:** Ticket history, sentiment

### Outputs To
- **Growth:** Retention insights, cohort feedback
- **Product:** Feature requests, usage patterns
- **Marketing:** Success stories, testimonials
- **Sales:** Expansion opportunities

## File Structure

```
squads/customer/
├── squad.yaml
├── README.md
├── agents/
│   ├── customer-lead.md
│   ├── onboarding-architect.md
│   └── retention-strategist.md
├── workflows/
│   ├── onboarding-sequence.yaml
│   ├── retention-system.yaml
│   └── upsell-campaign.yaml
├── tasks/
│   ├── design-onboarding.md
│   ├── analyze-churn.md
│   ├── create-health-score.md
│   ├── design-upsell.md
│   ├── handle-escalation.md
│   └── create-playbook.md
├── templates/
│   ├── onboarding-sequence-tmpl.md
│   ├── customer-health-tmpl.md
│   ├── churn-analysis-tmpl.md
│   └── upsell-campaign-tmpl.md
├── checklists/
│   ├── onboarding-checklist.md
│   └── churn-prevention-checklist.md
└── data/
    ├── customer-lifecycle.yaml
    └── health-score-model.yaml
```

---

*Customer Squad v1.1.0 - AIOS 2.1.0 Compliant*
