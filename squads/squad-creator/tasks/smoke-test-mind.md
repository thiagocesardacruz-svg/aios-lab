---
task: Smoke Test Mind Profile
responsavel: "@oalanicolas"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - mind_slug: Identifier for the mind profile to test (string, required)
Saida: |
  - test_results: Array of 3 scenario results, each with scenario_name, expected_patterns, actual_output, match_score (array)
  - overall_pass: Whether the profile passes all smoke tests (boolean)
  - fidelity_score: Aggregate fidelity score from 0 to 100 (number)
Checklist:
  - "[ ] Load mind profile by slug"
  - "[ ] Generate Scenario 1: Email Writing"
  - "[ ] Generate Scenario 2: Decision Making"
  - "[ ] Generate Scenario 3: Conflict Resolution"
  - "[ ] Compare each output against source patterns"
  - "[ ] Calculate fidelity score"
  - "[ ] Determine overall pass/fail"
---

# *smoke-test

Validates a mind profile by running 3 standardized test scenarios and comparing the outputs against known patterns from the source material. Acts as the quality gate for mind cloning.

## Uso

```
*smoke-test mind_slug="nicolas-oala"
```

## Parametros

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| mind_slug | string | yes | Identifier for the mind profile (kebab-case) |

## Implementation

### Step 1: Load Profile
- Load mind profile from `squads/squad-creator/data/minds/{mind_slug}.yaml`
- Extract voice_dna and thinking_dna components
- Load original source excerpts for comparison baseline

### Step 2: Scenario 1 — Email Writing
- **Prompt**: "Write a professional email declining a meeting invitation due to scheduling conflict"
- **Generate output** using the mind profile as the persona
- **Evaluate against voice_dna**: vocabulary match, tone consistency, sentence structure adherence, emoji/punctuation patterns, cultural markers
- **Score**: 0-100 based on pattern match percentage

### Step 3: Scenario 2 — Decision Making
- **Prompt**: "You need to choose between shipping a feature with known minor bugs or delaying the release by 2 weeks for a complete fix. Explain your decision and reasoning."
- **Generate output** using the mind profile as the persona
- **Evaluate against thinking_dna**: decision framework alignment, risk tolerance match, priority hierarchy consistency, mental model usage
- **Score**: 0-100 based on cognitive pattern alignment

### Step 4: Scenario 3 — Conflict Resolution
- **Prompt**: "Two team members disagree on the technical approach for a critical feature. One wants microservices, the other wants a monolith. How do you handle this?"
- **Generate output** using the mind profile as the persona
- **Evaluate**: combination of voice_dna (communication style in conflict) and thinking_dna (conflict resolution approach, leadership style)
- **Score**: 0-100 based on combined voice and thinking alignment

### Step 5: Fidelity Scoring
- Calculate per-scenario scores
- Compute aggregate fidelity_score as weighted average: Email (30%), Decision (40%), Conflict (30%)
- Determine overall_pass: true if fidelity_score >= 60 and no single scenario below 40
- Flag specific dimensions that scored poorly for targeted improvement

### Step 6: Report Generation
- Compile test_results array with all scenario details
- Include representative excerpts showing matches and mismatches
- Provide actionable feedback: which source types would improve weak dimensions

## Error Handling

- **Profile not found**: Abort with message suggesting `*clone-mind` to create the profile first
- **Profile incomplete**: If missing voice_dna or thinking_dna, run available scenarios only and note incomplete coverage
- **Generation failure**: Retry once; if still failing, log error and score scenario as 0
- **All scenarios fail**: Report as critical failure, recommend reviewing source material quality and re-running `*clone-mind`

## Related

- `clone-mind.md` — Parent pipeline that calls smoke test as final validation
- `update-mind.md` — Re-runs smoke test after profile updates
- `extract-voice-dna.md` — Provides voice patterns used in evaluation
- `extract-thinking-dna.md` — Provides thinking patterns used in evaluation
