# Board Advisor Squad

> Strategic Mind Clones for High-Impact Decisions

## Overview

The Board Advisor Squad provides strategic guidance through mind clones of legendary business thinkers. This squad:

- **Does NOT execute** any work
- **Does NOT enter** operational Kanban
- **Does NOT make** final decisions
- **ONLY provides** frameworks, heuristics, and validation
- **OUTPUTS** Decision Memos that can become OS via `/ops/new-task`

## Mind Clones

| Advisor | Domain | When to Consult |
|---------|--------|-----------------|
| **Elon Musk** | Systems & First Principles | Architecture, cost reduction, complexity |
| **Bill Gates** | Platform & Long-Term | Infrastructure, 10-year decisions |
| **Alex Hormozi** | Revenue & Offers | Pricing, offers, value |
| **Dan Kennedy** | Positioning & Direct Response | Message, positioning, differentiation |
| **Peter Thiel** | Moat & Asymmetry | Competition, focus, secrets |
| **Charlie Munger** | Risk & Bias | Risk assessment, decision quality |
| **Ray Dalio** | Principles & Governance | Recurring decisions, systems |
| **Steve Jobs** | Product & Experience | UX, simplicity, focus |

## Individual Commands

### Elon Musk
- `/board/elon/system-review` - First principles analysis
- `/board/elon/architecture-direction` - Architecture simplification

### Bill Gates
- `/board/gates/platform-direction` - Platform strategy
- `/board/gates/long-term-review` - 5-10 year thinking

### Alex Hormozi
- `/board/hormozi/offer-review` - Offer architecture
- `/board/hormozi/pricing-strategy` - Pricing optimization

### Dan Kennedy
- `/board/kennedy/positioning-review` - Market positioning
- `/board/kennedy/message-clarity` - Message clarity

### Peter Thiel
- `/board/thiel/moat-review` - Competitive moat analysis
- `/board/thiel/focus-decision` - Focus vs expansion

### Charlie Munger
- `/board/munger/risk-assessment` - Risk analysis
- `/board/munger/bias-check` - Bias detection

### Ray Dalio
- `/board/dalio/principles-check` - Principles alignment
- `/board/dalio/governance-review` - Governance structure

### Steve Jobs
- `/board/jobs/product-review` - Product simplicity
- `/board/jobs/simplicity-check` - UX simplification

## Multi-Advisor Workflows

| Workflow | Advisors | Use Case |
|----------|----------|----------|
| `/board/strategic-review` | Gates, Thiel, Dalio | High-impact strategic decisions |
| `/board/offer-review` | Hormozi, Kennedy | Offers, pricing, positioning |
| `/board/risk-assessment` | Munger, Musk | Before irreversible decisions |
| `/board/platform-direction` | Gates, Musk, Thiel | AIOS, infrastructure, white-label |
| `/board/principles-check` | Dalio | Governance, conflicts, recurring issues |

## Output Format

All workflows produce a **Decision Memo**:

```markdown
# Decision Memo: [Topic]

## Context
[What is being decided]

## Advisors Consulted
[List of advisors]

## Key Arguments
[Main points from each advisor]

## Conflicts of View
[Where advisors disagree]

## Risks Identified
[Key risks to consider]

## Recommended Decision
[The recommendation]

## Conditions for Execution
[What must be true to proceed]
```

## Rules

1. **Consult, don't execute** - Board provides guidance, squads execute
2. **Memos, not actions** - Output is always a document
3. **Multiple perspectives** - Use multi-advisor workflows for big decisions
4. **Challenge assumptions** - Advisors should disagree and debate
5. **Final decision is human** - Director makes final call
