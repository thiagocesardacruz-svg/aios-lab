# Model Routing Rules

## Overview

Agents SHOULD route tasks to the most cost-effective model. Using Haiku for simple tasks saves up to 95% vs Opus.

## Model Selection Matrix

| Complexity | Model | Cost (per 1k tokens) | Use For |
|------------|-------|---------------------|---------|
| 1-3 | **Haiku** | €0.0008 in, €0.004 out | Simple, well-defined tasks |
| 4-7 | **Sonnet** | €0.003 in, €0.015 out | Moderate complexity, code |
| 8-10 | **Opus** | €0.015 in, €0.075 out | Complex reasoning, ambiguity |

**Cost Ratios:** Haiku is **4x cheaper** than Sonnet, **19x cheaper** than Opus.

## Quick Reference by Task Type

### Use Haiku (⚡ Fastest, Cheapest)

| Task | Keywords | Complexity |
|------|----------|------------|
| Data extraction | extract, parse, get, find, list | 2 |
| Classification | classify, categorize, label, tag | 2 |
| Formatting | format, convert, transform | 1 |
| Validation | validate, check, verify | 2 |
| Simple Q&A | what is, when, where, who | 2 |
| Template filling | fill, template, generate from | 2 |
| Simple translation | translate (short text) | 3 |

### Use Sonnet (🎯 Balanced)

| Task | Keywords | Complexity |
|------|----------|------------|
| Simple code changes | fix bug, small change, add method | 5 |
| Summarization | summarize, summary, tldr | 4 |
| Moderate analysis | analyze, review, evaluate | 5 |
| Debugging | debug, error, fix issue | 6 |
| Refactoring | refactor, improve, optimize | 6 |
| Documentation | document, docs, explain code | 4 |

### Use Opus (🧠 Most Capable)

| Task | Keywords | Complexity |
|------|----------|------------|
| Architecture | architect, design system, structure | 9 |
| Complex reasoning | complex, multi-step, strategy | 9 |
| Ambiguous tasks | unclear, decide, choose approach | 8 |
| Long creative content | create, write, generate content | 8 |
| Strategic planning | plan, roadmap, prioritize | 8 |
| Full implementation | implement feature, new system | 9 |

## Complexity Modifiers

Factors that **increase** complexity (+1 to +2):
- Multiple files involved
- Integration with external systems
- Security-sensitive
- Production environment
- Long context history

Factors that **decrease** complexity (-1):
- Single file only
- Example provided
- Explicitly simple/small
- Quick/minor change

## Using the Model Router

### Analyze a Task

```bash
node squads/ops/scripts/model-router.mjs analyze "Extract all email addresses from this JSON file"
```

Output:
```
⚡ Recommended Model: Haiku 3.5

Complexity Score: 2/10
Confidence: high
Reason: Matched patterns: extraction

Savings vs Opus: €0.0142 (95%)
```

### Quick Recommendation by Type

```bash
node squads/ops/scripts/model-router.mjs recommend --task-type=extraction
```

### View Savings Report

```bash
node squads/ops/scripts/model-router.mjs savings
```

## Agent Integration

When spawning sub-agents via Task tool, agents SHOULD specify the optimal model:

```javascript
// For simple extraction task
Task({
  description: "Extract data",
  prompt: "Extract all dates from this text...",
  subagent_type: "Explore",
  model: "haiku"  // Explicitly use Haiku
})

// For complex architecture task
Task({
  description: "Design system architecture",
  prompt: "Design the authentication system...",
  subagent_type: "Plan",
  model: "opus"  // Requires Opus
})
```

## Decision Flowchart

```
Task received
│
├─ Is it extraction/classification/formatting?
│   └─ YES → Haiku
│
├─ Is it code changes or debugging?
│   ├─ Simple (one file, clear fix)? → Haiku
│   └─ Moderate (multiple concerns)? → Sonnet
│
├─ Is it analysis or summarization?
│   ├─ Factual/straightforward? → Haiku
│   └─ Requires judgment? → Sonnet
│
├─ Is it architecture/planning/complex reasoning?
│   └─ YES → Opus
│
├─ Is it ambiguous or requires creativity?
│   └─ YES → Opus
│
└─ Default (when unsure) → Sonnet
```

## Examples

### Example 1: User asks to extract data

```
User: "Liste todos os emails neste arquivo CSV"

Analysis:
- Pattern match: "liste" → extraction
- Single file
- No complexity modifiers
- Complexity: 2/10

Recommendation: Haiku
Savings: ~€0.02 vs Opus per request
```

### Example 2: User asks to implement a feature

```
User: "Implementa autenticação OAuth2 com refresh tokens"

Analysis:
- Pattern match: "implementa" → code_complex
- Security-sensitive (+2)
- Integration required (+1)
- Complexity: 9+3 = 10/10

Recommendation: Opus
Reason: Security-critical, multi-step implementation
```

### Example 3: User asks to fix a bug

```
User: "Corrige esse erro de TypeScript nesta função"

Analysis:
- Pattern match: "corrige", "erro" → debugging
- Single file implied (-1)
- Complexity: 6-1 = 5/10

Recommendation: Sonnet
Savings: ~€0.01 vs Opus per request
```

## Estimated Monthly Savings

If 50% of tasks can use Haiku and 30% can use Sonnet:

| Without Routing | With Routing | Savings |
|-----------------|--------------|---------|
| €468 (all Opus) | €150-200 | **€268-318/month** |

---

*Model Routing Rules v1.0 - AIOS Cost Optimization*
