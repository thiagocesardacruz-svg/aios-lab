---
task: Extract Thinking DNA
responsavel: "@oalanicolas"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - sources: Decision records, frameworks used, meeting notes, strategy documents (array, required)
Saida: |
  - thinking_dna_profile: Structured profile containing decision_frameworks, mental_models, cognitive_biases, risk_tolerance, priorities (object)
Checklist:
  - "[ ] Load and classify source documents by type"
  - "[ ] Extract decision patterns from records and meeting notes"
  - "[ ] Identify mental models and frameworks in use"
  - "[ ] Detect cognitive biases from decision history"
  - "[ ] Assess risk tolerance from past choices"
  - "[ ] Map priority hierarchies"
  - "[ ] Compile thinking_dna_profile"
---

# *extract-thinking-dna

Analyzes decision-oriented sources to extract the cognitive fingerprint of a person. Produces a structured Thinking DNA profile that captures how someone thinks — their decision frameworks, mental models, biases, and priorities.

## Uso

```
*extract-thinking-dna sources=["./docs/strategy-q4.md", "./notes/meeting-2025-01.md", "./decisions/adr-001.md"]
```

## Parametros

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| sources | array | yes | Paths to decision records, strategy docs, meeting notes, ADRs, retrospectives |

## Implementation

### Step 1: Source Classification
- Load each source document
- Classify type: decision record, meeting notes, strategy doc, retrospective, ADR, email thread
- Extract structured decisions where present (explicit choices with reasoning)
- Extract implicit decisions from narrative text

### Step 2: Decision Framework Detection
- Identify recurring decision-making patterns
- Detect use of known frameworks: RICE, WSJF, Eisenhower Matrix, First Principles, etc.
- Map custom/informal frameworks unique to this person
- Classify decision speed: deliberate vs. intuitive
- Note collaboration patterns: solo decider, consensus builder, delegator

### Step 3: Mental Model Identification
- Detect referenced mental models: systems thinking, feedback loops, Pareto principle, etc.
- Identify metaphors used to reason about problems
- Map abstraction level preferences (detail-oriented vs. big-picture)
- Note preferred analogies and reference domains

### Step 4: Cognitive Bias Detection
- Analyze decisions for recurring bias patterns
- Check for: confirmation bias, anchoring, recency bias, sunk cost, optimism bias
- Measure awareness of biases (self-correction language)
- Score bias intensity: mild, moderate, strong
- Note: this is observational, not judgmental

### Step 5: Risk Tolerance Assessment
- Classify risk appetite: conservative, moderate, aggressive
- Detect variation by domain (tech risk vs. business risk vs. people risk)
- Identify risk mitigation patterns (hedging, fallbacks, reversibility preference)
- Note threshold patterns: when does this person escalate or defer

### Step 6: Priority Mapping
- Extract explicit priority statements
- Infer implicit priorities from time/resource allocation patterns
- Build priority hierarchy: what consistently wins when trade-offs arise
- Identify non-negotiables vs. flexible items
- Map value system: speed vs. quality, innovation vs. stability, people vs. process

### Step 7: Profile Compilation
- Merge all analysis dimensions into thinking_dna_profile
- Assign confidence scores per dimension
- Flag dimensions with insufficient evidence
- Include representative quotes/examples for each dimension

## Error Handling

- **No decision records found**: Attempt to infer decisions from narrative sources, warn about lower confidence
- **Contradictory patterns**: Flag contradictions as potential context-dependent behavior, include both patterns with contexts
- **Insufficient sources**: If fewer than 3 decision points found, warn that profile will be incomplete
- **Ambiguous reasoning**: Mark as "unclear rationale" rather than guessing intent
- **Source overlap**: Deduplicate decisions referenced in multiple sources

## Related

- `clone-mind.md` — Parent pipeline that calls this task
- `extract-voice-dna.md` — Companion extraction for voice patterns
- `update-mind.md` — Can trigger re-extraction with new sources
