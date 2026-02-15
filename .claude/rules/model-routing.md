# Model Routing (Summary)

## TL;DR
Route tasks to cost-effective models: Haiku for simple tasks (extraction, validation), Sonnet for code/analysis, Opus for architecture/complex reasoning. Haiku is 19x cheaper than Opus.

## Critical Rules
- MUST: Use Haiku (complexity 1-3) for extraction, classification, formatting, validation
- MUST: Use Sonnet (complexity 4-7) for code changes, debugging, summarization
- MUST: Use Opus (complexity 8-10) for architecture, complex reasoning, ambiguous tasks
- SHOULD: Analyze task complexity before selecting model
- NEVER: Use Opus for simple extraction/formatting tasks

## Model Selection Matrix

| Complexity | Model | Cost/1k tokens | Use For |
|------------|-------|----------------|---------|
| 1-3 | **Haiku** | €0.0008/€0.004 | Extract, classify, format, validate |
| 4-7 | **Sonnet** | €0.003/€0.015 | Code changes, debug, summarize |
| 8-10 | **Opus** | €0.015/€0.075 | Architecture, strategy, complex reasoning |

**Complexity modifiers:** +1-2 for multi-file, security-sensitive, production; -1 for single file, example provided.

## Quick Analysis Tool

```bash
# Analyze task complexity and get model recommendation
node squads/ops/scripts/model-router.mjs analyze "Extract all email addresses from JSON"

# View savings report
node squads/ops/scripts/model-router.mjs savings
```

## Full Documentation
See: `docs/rules/model-routing-full.md` for complete task type breakdown, decision flowchart, examples, and estimated monthly savings.
