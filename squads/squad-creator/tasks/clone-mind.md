---
task: Clone Mind
responsavel: "@oalanicolas"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - name: Person name to clone (string, required)
  - mode: Execution mode — yolo (fast, autonomous) or quality (thorough, validated) (string, default: quality)
  - sources: Array of paths or URLs pointing to source material (array, required)
Saida: |
  - mind_profile: Complete mind profile with voice DNA and thinking DNA merged (object)
  - fidelity_score: Accuracy score from 0 to 100 comparing profile against source patterns (number)
  - smoke_results: Three test scenario outputs validating the profile (array)
Checklist:
  - "[ ] Validate all sources are accessible and contain usable content"
  - "[ ] Extract Voice DNA from sources"
  - "[ ] Extract Thinking DNA from sources"
  - "[ ] Merge Voice DNA and Thinking DNA into unified profile"
  - "[ ] Run smoke test with 3 scenarios"
  - "[ ] Save profile to squads/squad-creator/data/minds/{slug}.yaml"
---

# *clone-mind

Creates a complete mind clone profile from source material. This is the master pipeline that orchestrates voice extraction, thinking extraction, profile merging, and validation into a single end-to-end workflow.

## Uso

```
*clone-mind name="Nicolas Oala" mode=quality sources=["./interviews/nicolas-01.md", "./posts/nicolas-linkedin.md"]
```

## Parametros

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| name | string | yes | - | Full name of the person to clone |
| mode | string | no | quality | `yolo` for fast autonomous run, `quality` for thorough validated run |
| sources | array | yes | - | Paths to text files, transcriptions, URLs to social media posts |

## Implementation

### Step 1: Source Validation
- Verify each source path/URL is accessible
- Classify source type (text, transcript, social post, document)
- Calculate initial coverage assessment
- Abort if fewer than 2 valid sources

### Step 2: Extract Voice DNA
- Delegate to `*extract-voice-dna` task
- Pass all text-based sources
- Receive voice_dna_profile with vocabulary, tone, sentence structure, emoji usage, cultural markers, catchphrases

### Step 3: Extract Thinking DNA
- Delegate to `*extract-thinking-dna` task
- Pass decision-oriented sources (strategy docs, meeting notes, frameworks)
- Receive thinking_dna_profile with decision frameworks, mental models, cognitive biases, risk tolerance, priorities

### Step 4: Merge Profiles
- Combine voice_dna_profile and thinking_dna_profile into unified mind_profile
- Resolve conflicts between voice and thinking signals
- Generate slug from person name (lowercase, hyphenated)
- In `yolo` mode: auto-resolve conflicts with highest-confidence signal
- In `quality` mode: prompt user to resolve ambiguous conflicts

### Step 5: Smoke Test
- Delegate to `*smoke-test` task with the generated profile
- Run 3 test scenarios: email writing, decision making, conflict resolution
- Calculate fidelity_score from pattern match analysis

### Step 6: Save and Report
- Save profile to `squads/squad-creator/data/minds/{slug}.yaml`
- Generate summary report with fidelity_score and smoke_results
- If fidelity_score < 60 in quality mode, warn user and suggest additional sources

## Error Handling

- **Insufficient sources**: If fewer than 2 valid sources, abort with message listing what was found and what is needed
- **Source inaccessible**: Skip inaccessible sources, warn user, continue if at least 2 remain
- **Low fidelity score**: If score < 40, abort and recommend gathering more diverse source material
- **Merge conflict**: In quality mode, prompt user; in yolo mode, pick highest-confidence signal and log decision
- **Profile already exists**: Prompt user to overwrite or run `*update-mind` instead

## Related

- `extract-voice-dna.md` — Sub-task for voice pattern extraction
- `extract-thinking-dna.md` — Sub-task for cognitive pattern extraction
- `smoke-test-mind.md` — Sub-task for profile validation
- `update-mind.md` — Incremental profile update with new sources
- `auto-acquire-sources.md` — Automatic source discovery
