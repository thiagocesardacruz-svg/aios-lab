# Finance Squad

> Financial Viability, Pricing & Budget Control

## Mission

Ensure financial health of Travel Tech Digital through rigorous analysis, pricing strategy, and budget enforcement.

## Agents

| Agent | Name | Role |
|-------|------|------|
| `finance-lead` | **Sterling** | Strategy, decisions, oversight |
| `financial-analyst` | **Morgan** | Unit economics, KPIs, viability |
| `pricing-strategist` | **Price** | Pricing tiers, margins, value |
| `controller` | **Ledger** | Cost control, budget enforcement |

## Commands

### Workflows

| Command | Description |
|---------|-------------|
| `/finance/report` | Monthly financial report |
| `/finance/kpi` | KPI dashboard and analysis |
| `/finance/pricing-review` | Review pricing strategy |
| `/finance/budget-check` | Budget check and alerts |

### Tasks

| Command | Description |
|---------|-------------|
| `/finance/track-expenses` | Track and categorize expenses |
| `/finance/forecast` | Revenue forecast |
| `/finance/cashflow` | Cashflow projection |
| `/finance/unit-economics` | Unit economics analysis |
| `/finance/runway` | Calculate financial runway |
| `/finance/audit` | Audit costs and expenses |
| `/finance/classify` | Classify OS costs |

## Structure

```
finance/
├── squad.yaml                     # v1.1.0 - Configuration
├── README.md
├── agents/
│   ├── finance-lead.md            # Sterling
│   ├── financial-analyst.md       # Morgan
│   ├── pricing-strategist.md      # Price
│   └── controller.md              # Ledger
├── tasks/
│   ├── track-expenses.md
│   ├── forecast-revenue.md
│   ├── project-cashflow.md
│   ├── analyze-unit-economics.md
│   ├── calculate-runway.md
│   ├── audit-costs.md
│   ├── review-pricing-model.md
│   └── classify-os-costs.md
├── workflows/
│   ├── monthly-report.yaml
│   ├── kpi-dashboard.yaml
│   ├── pricing-review.yaml
│   └── budget-check.yaml
├── templates/
│   ├── financial-report-tmpl.md
│   ├── budget-template-tmpl.yaml
│   ├── pricing-model-tmpl.md
│   ├── cashflow-projection-tmpl.md
│   └── unit-economics-tmpl.md
├── checklists/
│   ├── month-end-close.md
│   ├── expense-approval.md
│   ├── pricing-change.md
│   └── budget-review.md
└── data/
    ├── financial-metrics.yaml
    ├── cost-categories.yaml
    └── budget-limits.yaml
```

## Key Metrics

| Metric | Target | Formula |
|--------|--------|---------|
| CAC | < €50 | Total acquisition cost / New customers |
| LTV | > €150 | ARPU × Average lifetime |
| LTV:CAC | > 3:1 | LTV / CAC |
| Payback | < 6 months | CAC / Monthly ARPU |
| Gross Margin | > 70% | (Revenue - COGS) / Revenue |
| MRR Growth | > 10%/mo | (MRR₁ - MRR₀) / MRR₀ |

## Budget Limits

| Limit | Amount | Action |
|-------|--------|--------|
| Monthly | £400 (~€468) | Hard limit |
| Daily Alert | €15 | Warning notification |
| Daily Hard | €20 | SAFE MODE activation |
| Per Task | €10 | Approval required |

## Cost Categories

| Category | Code | Description |
|----------|------|-------------|
| BASE | `BASE` | Templates, CRON, deterministic |
| EXEC | `EXEC` | Main LLM execution |
| VRFY | `VRFY` | Verification tokens |
| RCVR | `RCVR` | Retries, fallbacks |
| EXTA | `EXTA` | External AI (Gemini/GPT) |
| DEV_ | `DEV_` | Development (not prod) |

## Tasks

| Task | Agent | Purpose |
|------|-------|---------|
| `track-expenses` | controller | Track and categorize expenses |
| `forecast-revenue` | financial-analyst | Revenue forecasting |
| `project-cashflow` | financial-analyst | Cashflow projection |
| `analyze-unit-economics` | financial-analyst | Unit economics analysis |
| `calculate-runway` | finance-lead | Financial runway calculation |
| `audit-costs` | controller | Cost audit |
| `review-pricing-model` | pricing-strategist | Pricing model review |
| `classify-os-costs` | controller | Classify OS costs |

## Templates

| Template | Purpose |
|----------|---------|
| `financial-report-tmpl.md` | Monthly financial report |
| `budget-template-tmpl.yaml` | Budget allocation template |
| `pricing-model-tmpl.md` | Pricing model documentation |
| `cashflow-projection-tmpl.md` | Cashflow projection |
| `unit-economics-tmpl.md` | Unit economics analysis |

## Checklists

| Checklist | Purpose |
|-----------|---------|
| `month-end-close.md` | Month-end closing procedures |
| `expense-approval.md` | Expense approval workflow |
| `pricing-change.md` | Pricing change validation |
| `budget-review.md` | Budget review checklist |

## Data Files

| File | Purpose |
|------|---------|
| `financial-metrics.yaml` | KPI definitions and targets |
| `cost-categories.yaml` | Cost classification rules |
| `budget-limits.yaml` | Budget limits and thresholds |

## Red Flags

| Symptom | Cause | Action |
|---------|-------|--------|
| LTV:CAC < 3 | High acquisition cost | Review channels, optimize |
| Payback > 6mo | Low ARPU or high CAC | Pricing review |
| Runway < 6mo | Burn rate too high | Cost cutting |
| VRFY costs high | KB drift | Update knowledge base |
| RCVR costs high | System issues | Investigate failures |

---

*Finance Squad v1.1.0 - Travel Tech Digital AIOS*
