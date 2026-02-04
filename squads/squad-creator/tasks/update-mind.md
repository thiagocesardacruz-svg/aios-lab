---
task: Update Mind Profile
responsavel: "@oalanicolas"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - slug: Mind profile identifier, e.g. "nicolas-oala" (string, required)
  - new_sources: Array of new material paths or URLs to incorporate (array, required)
Saida: |
  - updated_profile: The updated mind profile with new patterns merged (object)
  - delta_report: Report of what changed — new patterns detected, modified dimensions, fidelity impact (object)
Checklist:
  - "[ ] Load existing mind profile by slug"
  - "[ ] Validate new sources are accessible"
  - "[ ] Extract Voice DNA from new sources"
  - "[ ] Extract Thinking DNA from new sources"
  - "[ ] Compute delta between existing and new extractions"
  - "[ ] Merge new patterns into existing profile"
  - "[ ] Re-run smoke test on updated profile"
  - "[ ] Save updated profile and delta report"
---

# *update-mind

Incrementally updates an existing mind profile with new source material. Performs differential analysis to identify what changed, what new patterns emerged, and how the update affects fidelity.

## Uso

```
*update-mind slug="nicolas-oala" new_sources=["./transcripts/recent-talk.md", "./posts/new-blog.md"]
```

## Parametros

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| slug | string | yes | Identifier for the existing mind profile (kebab-case) |
| new_sources | array | yes | Paths or URLs to new source material |

## Implementation

### Step 1: Load Existing Profile
- Load mind profile from `squads/squad-creator/data/minds/{slug}.yaml`
- Verify profile exists and is valid
- Record current fidelity_score as baseline

### Step 2: Source Validation
- Validate each new source is accessible
- Classify source types
- Check for overlap with previously processed sources (avoid duplicate analysis)

### Step 3: Incremental Extraction
- Run `*extract-voice-dna` on new sources only
- Run `*extract-thinking-dna` on new sources only
- Produce new_voice_dna and new_thinking_dna partial profiles

### Step 4: Delta Computation
- Compare new extractions against existing profile dimensions
- Identify: new patterns not in existing profile, reinforced patterns (higher confidence), contradicted patterns (conflicting signals), unchanged dimensions
- Generate delta_report with categorized changes

### Step 5: Profile Merge
- Apply new patterns to existing profile using weighted merge
- Newer sources get recency weight but existing patterns retain accumulated confidence
- Resolve contradictions: flag for user review if in quality mode, use recency bias in yolo mode
- Update confidence scores across all dimensions

### Step 6: Re-validate
- Run `*smoke-test` on updated profile
- Compare new fidelity_score against baseline
- If fidelity dropped by more than 10 points, warn user and offer rollback

### Step 7: Save
- Save updated profile to same path
- Archive previous version as `{slug}.v{n}.yaml`
- Save delta_report to `squads/squad-creator/data/minds/{slug}-delta-{date}.md`

## Error Handling

- **Profile not found**: Abort with message suggesting `*clone-mind` instead
- **No new patterns detected**: Complete successfully but note in delta_report that sources did not add new information
- **Fidelity regression**: If score drops more than 10 points, warn user and offer to rollback; if more than 20 points, recommend manual review
- **Source already processed**: Skip duplicate sources, warn user
- **Merge conflict in critical dimension**: In quality mode, pause and prompt user; in yolo mode, log decision and use recency

## Related

- `clone-mind.md` — Initial profile creation pipeline
- `extract-voice-dna.md` — Voice extraction used for incremental analysis
- `extract-thinking-dna.md` — Thinking extraction used for incremental analysis
- `smoke-test-mind.md` — Validation after update
