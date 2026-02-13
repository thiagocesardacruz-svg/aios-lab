# Sales Squad

> Lead Qualification, Proposals, Pipeline & Closing

## Overview

The Sales Squad handles all revenue-generating activities for Travel Tech Digital. Responsible for:

- Lead qualification and prospecting
- Discovery and diagnosis
- Proposal creation
- Objection handling
- Deal closing
- Pipeline management

## Agents

| Agent | Role | Focus |
|-------|------|-------|
| **Victor** (sales-lead) | Sales Lead | Strategy & coordination |
| **Maya** (sdr) | SDR | Prospecting & qualification |
| **Drake** (closer) | Closer | Discovery & closing |
| **Nadia** (sales-analyst) | Analyst | Pipeline & metrics |

## Commands

| Command | Description |
|---------|-------------|
| `/sales/prospect` | Prospect and qualify leads |
| `/sales/discovery` | Deep discovery session |
| `/sales/create-proposal` | Create commercial proposal |
| `/sales/follow-up-sequence` | Follow-up sequence |
| `/sales/pipeline-review` | Pipeline review & forecast |

## Structure

```
sales/
├── squad.yaml
├── agents/
│   ├── sales-lead.md
│   ├── sdr.md
│   ├── closer.md
│   └── sales-analyst.md
├── workflows/
│   ├── prospect.yaml
│   ├── discovery.yaml
│   ├── create-proposal.yaml
│   ├── follow-up-sequence.yaml
│   └── pipeline-review.yaml
├── templates/
├── checklists/
└── README.md
```

## Sales Process

```
Lead → Qualify → Discovery → Proposal → Negotiate → Close → Onboard
  ↓        ↓          ↓          ↓          ↓         ↓
 SDR      SDR      Closer    Closer     Closer    Closer
```

## Usage

### Qualify a lead
```
/sales/prospect --lead="Company ABC" --source="inbound"
```

### Create proposal
```
/sales/create-proposal --client="Hotel XYZ" --product="Hotel AIOS Pro"
```

### Review pipeline
```
/sales/pipeline-review --period="month"
```
