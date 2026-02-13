# Task: Optimize Prompt

> Optimize AI prompt for cost and performance

## Metadata

| Field | Value |
|-------|-------|
| **ID** | optimize-prompt |
| **Agent** | ai-ops |
| **Type** | optimization |
| **Complexity** | medium |

## Objective

Reduce AI costs while maintaining or improving output quality.

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `current_prompt` | text | yes | Current prompt to optimize |
| `current_model` | text | yes | Model being used |
| `use_case` | text | yes | What the prompt does |
| `quality_baseline` | text | no | Expected output quality |

## Process

### Step 1: Optimization Hierarchy Check

```
1. Can a SCRIPT do this?     → Cost: ~€0
2. Is the answer CACHED?     → Cost: ~€0
3. Can HAIKU handle this?    → Cost: low
4. Does it need SONNET?      → Cost: medium
5. Only if truly complex     → Cost: high (Opus)
```

### Step 2: Analyze Current Usage

| Metric | Current | Target |
|--------|---------|--------|
| Model | | |
| Input tokens (avg) | | |
| Output tokens (avg) | | |
| Cost per call | | |
| Calls per day | | |
| Daily cost | | |

### Step 3: Optimization Strategies

#### Token Reduction
- [ ] Remove redundant instructions
- [ ] Use shorter examples
- [ ] Compress system prompt
- [ ] Remove unnecessary context

#### Model Downgrade
- [ ] Test with Haiku first
- [ ] Test with Sonnet if Haiku fails
- [ ] Only use Opus if truly needed

#### Caching Opportunities
- [ ] Identify repeated calls
- [ ] Cache static responses
- [ ] Use semantic caching for similar queries

#### Script Replacement
- [ ] Deterministic logic → script
- [ ] Formatting → script
- [ ] Validation → script
- [ ] Calculations → script

### Step 4: A/B Testing

| Version | Model | Tokens | Quality | Cost |
|---------|-------|--------|---------|------|
| Current | | | baseline | |
| Optimized | | | | |

### Step 5: Implementation
- [ ] Update prompt
- [ ] Update model routing
- [ ] Implement caching
- [ ] Add monitoring

## Output

| Output | Type | Description |
|--------|------|-------------|
| `optimized_prompt` | text | New optimized prompt |
| `model_recommendation` | text | Recommended model |
| `cost_savings` | number | Estimated savings % |
| `implementation_notes` | md | How to implement |

## Quality Gates

- [ ] Output quality maintained (or improved)
- [ ] Cost reduced by target %
- [ ] A/B test completed
- [ ] Monitoring in place

## Cost Categories Reference

| Category | Description | Target |
|----------|-------------|--------|
| BASE | Deterministic, templates | ~€0 |
| EXEC | First LLM call | Main value |
| VRFY | Verification tokens | ~€0 |
| RCVR | Retries, fallbacks | Growing = problem |

## Red Flags

| Symptom | Action |
|---------|--------|
| High VRFY costs | KB drift, update knowledge |
| High RCVR costs | System degrading, investigate |
| Repeated identical calls | Implement caching |
| Simple task using Opus | Route to Haiku |
| LLM for deterministic | Replace with script |

---

*Task v1.0 - Tech Squad*
