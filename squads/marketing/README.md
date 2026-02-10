# Marketing Squad

> Digital Marketing, Content, SEO, Copywriting & Funnels

## Overview

The Marketing Squad handles all go-to-market activities for Travel Tech Digital. Responsible for:

- Market research and ICP definition
- Content strategy and creation
- SEO and organic growth
- Landing pages and funnels
- Email sequences
- Ad creative packs

## Agents

| Agent | Role | Focus |
|-------|------|-------|
| **Aurora** (marketing-lead) | Marketing Lead | Strategy & coordination |
| **Viktor** (offer-engine) | Offer Architect | Irresistible offers (Hormozi) |
| **Luna** (content-strategist) | Content Strategist | ICP research, content planning |
| **Marcus** (copy-specialist) | Copywriter | Headlines, copy, CTAs |
| **Atlas** (seo-specialist) | SEO Specialist | Keywords, clusters, optimization |
| **Nova** (funnel-architect) | Funnel Architect | Funnels, journeys, automation |

## Commands

| Command | Description |
|---------|-------------|
| `/mkt/market-research` | Complete market and ICP research |
| `/mkt/seo-plan` | SEO plan with keywords and calendar |
| `/mkt/create-funnel` | Complete funnel with pages and emails |
| `/mkt/landing-page` | Landing page with copy and specs |
| `/mkt/article` | SEO-optimized article |
| `/mkt/email-sequence` | Email sequence for any purpose |
| `/mkt/social-calendar` | 30-day social media calendar |
| `/mkt/ad-creative-pack` | Ad creatives for any platform |

## Structure

```
marketing/
├── squad.yaml
├── agents/
│   ├── marketing-lead.md
│   ├── offer-engine.md
│   ├── content-strategist.md
│   ├── copy-specialist.md
│   ├── seo-specialist.md
│   └── funnel-architect.md
├── workflows/
│   ├── market-research.yaml
│   ├── seo-plan.yaml
│   ├── create-funnel.yaml
│   ├── landing-page.yaml
│   ├── article.yaml
│   ├── email-sequence.yaml
│   ├── social-calendar.yaml
│   └── ad-creative-pack.yaml
├── templates/
├── checklists/
│   ├── copy-quality.md
│   └── seo-onpage.md
├── data/
└── README.md
```

## Dependencies

- **deep-research**: For market research inputs
- **sales-pages**: For sales page creation
- **design**: For visual assets

## Usage

### Create a landing page
```
/mkt/landing-page --product="Hotel AIOS" --objective="lead_capture"
```

### Research a market
```
/mkt/market-research --product="Travel Agency AIOS" --market="Portugal"
```

### Plan SEO strategy
```
/mkt/seo-plan --topic="travel tech automation" --timeframe="3_months"
```
