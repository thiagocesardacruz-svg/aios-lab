# Golden Spec v2 — Minds (Voice DNA & Thinking DNA)

> Canonical standard for mind cloning data structures.
> Version: 2.0 | Status: CANONICAL

---

## Purpose

Mind files capture the authentic voice and thinking patterns of real people (or well-defined personas) to enable expert agents to embody them faithfully.

## File Convention

- **Voice DNA:** `data/minds/{person-id}-voice.yaml`
- **Thinking DNA:** `data/minds/{person-id}-thinking.yaml`
- **Location:** `squads/{squad-id}/data/minds/`
- **One concern per file. Voice and Thinking are separate.**

---

## Voice DNA Structure

```yaml
# {Person Name} — Voice DNA
#
# Meta:
#   id: {person-id}-voice
#   squad: {squad-id}
#   consumed_by: [{agent-ids that use this}]
#   token_estimate: {approximate tokens}
#   last_updated: {YYYY-MM-DD}
#   source_fidelity: {high | medium | low}
#   sources: [{list of source materials used}]

voice_dna:

  # Signature phrases this person uses repeatedly
  signature_phrases:
    - "{exact phrase 1}"
    - "{exact phrase 2}"
    - "{exact phrase 3}"

  # Vocabulary patterns
  vocabulary:
    always_use:
      - term: "{word or phrase}"
        context: "{when/how they use it}"
        frequency: {high | medium | low}

    never_use:
      - term: "{word or phrase}"
        reason: "{why they avoid it}"

  # Sentence construction patterns
  sentence_patterns:
    opening:
      - "{how they start sentences/paragraphs}"
    emphasis:
      - "{how they emphasize points}"
    transition:
      - "{how they connect ideas}"
    closing:
      - "{how they end/conclude}"

  # Tone variations by context
  tone_markers:
    default: "{their baseline tone}"
    when_teaching: "{tone shift when explaining}"
    when_correcting: "{tone when pointing out errors}"
    when_celebrating: "{tone when acknowledging success}"
    when_challenging: "{tone when pushing back}"

  # Concrete examples of authentic responses
  examples:
    - context: "{situation type}"
      stimulus: "{what prompted the response}"
      response: "{actual/reconstructed response}"
      source: "{where this came from}"
```

---

## Thinking DNA Structure

```yaml
# {Person Name} — Thinking DNA
#
# Meta:
#   id: {person-id}-thinking
#   squad: {squad-id}
#   consumed_by: [{agent-ids that use this}]
#   token_estimate: {approximate tokens}
#   last_updated: {YYYY-MM-DD}
#   source_fidelity: {high | medium | low}
#   sources: [{list of source materials used}]

thinking_dna:

  # Core mental models they apply
  mental_models:
    primary: "{their main framework for understanding}"
    secondary:
      - "{supporting model 1}"
      - "{supporting model 2}"

  # How they make decisions
  decision_framework:
    first_question: "{what they ask first when facing a problem}"
    priority_stack:
      1: "{highest priority consideration}"
      2: "{second priority}"
      3: "{third priority}"
    deal_breakers:
      - "{absolute no-go criteria}"
    tiebreaker: "{how they decide when options are equal}"

  # Encoded heuristics (rules of thumb)
  heuristics:
    - id: "{INITIALS}_{CATEGORY}_{NUMBER}"
      name: "{short name}"
      trigger: "{when to apply this heuristic}"
      rule: "{the actual heuristic}"
      source: "{where this comes from - book, interview, etc}"
      confidence: {high | medium | low}

  # Thinking patterns to avoid
  anti_patterns:
    - pattern: "{bad thinking they explicitly reject}"
      correction: "{what they do instead}"
      source: "{where they stated this}"

  # Questions they characteristically ask
  diagnostic_questions:
    - question: "{question they always ask}"
      purpose: "{what it reveals}"
      timing: "{when they ask it}"

  # How they frame problems
  problem_framing:
    reframes:
      - from: "{common framing}"
        to: "{their reframe}"
    metaphors:
      - "{metaphor they use to explain concepts}"
```

---

## Field Rules

### Meta Section (Both Files)

| Field | Rule | Enforcement |
|-------|------|-------------|
| id | Must match filename pattern: {person}-voice or {person}-thinking | BLOCKING |
| squad | Must match parent squad folder | BLOCKING |
| consumed_by | At least 1 agent must reference this | BLOCKING |
| token_estimate | Honest approximation | WARNING |
| source_fidelity | One of: high, medium, low | BLOCKING |
| sources | At least 1 source documented | WARNING |

### Voice DNA Specific

| Field | Rule | Enforcement |
|-------|------|-------------|
| signature_phrases | Min 3 phrases | BLOCKING |
| vocabulary.always_use | Min 5 terms | WARNING |
| vocabulary.never_use | Min 3 terms | WARNING |
| sentence_patterns | At least opening and closing | BLOCKING |
| tone_markers.default | Must be defined | BLOCKING |
| examples | Min 2 concrete examples | WARNING |

### Thinking DNA Specific

| Field | Rule | Enforcement |
|-------|------|-------------|
| mental_models.primary | Must be defined | BLOCKING |
| decision_framework.first_question | Must be defined | BLOCKING |
| decision_framework.priority_stack | Min 3 items | BLOCKING |
| heuristics | Min 3 heuristics with proper ID format | BLOCKING |
| anti_patterns | Min 2 patterns | WARNING |
| diagnostic_questions | Min 2 questions | WARNING |

---

## Heuristic ID Convention

Format: `{INITIALS}_{CATEGORY}_{NUMBER}`

**Categories:**
- `BS` — Business Strategy
- `MK` — Marketing
- `SL` — Sales
- `PR` — Pricing
- `OF` — Offers
- `CP` — Copywriting
- `PS` — Psychology
- `OP` — Operations
- `FN` — Finance
- `PM` — Product Management

**Examples:**
- `AH_OF_001` — Alex Hormozi, Offers, #1
- `GH_CP_003` — Gary Halbert, Copywriting, #3
- `DK_SL_007` — Dan Kennedy, Sales, #7

---

## Source Fidelity Levels

| Level | Definition | Requirements |
|-------|------------|--------------|
| **high** | Direct quotes, verified sources | Books, interviews, courses by the person |
| **medium** | Reconstructed from multiple sources | Secondary sources, analysis, patterns |
| **low** | Inferred or estimated | Limited sources, educated guesses |

---

## Anti-Patterns (FAIL if detected)

| Pattern | Why it fails |
|---------|-------------|
| Generic phrases not unique to person | Not authentic voice |
| Heuristics without source attribution | Unverifiable |
| No concrete examples | Can't validate accuracy |
| Copy-pasted from another mind file | Duplicate, not unique |
| Token estimate > 4000 | Context flooding risk |
| No consumed_by agents | Orphan data |

---

## Integration with Agents

Expert agents reference mind files in their definition:

```markdown
## Voice DNA
- **Source:** data/minds/gary-halbert-voice.yaml
- **Vocabulary:** "A-pile", "gun to head", "kitchen table"
- **Never say:** "synergy", "leverage", "utilize"
- **Sentence patterns:** Starts with story, ends with CTA

## Thinking DNA
- **Source:** data/minds/gary-halbert-thinking.yaml
- **Decision framework:** "Would this work if I mailed it?"
- **Priority stack:** Offer > List > Copy
- **Anti-patterns:** Never start with features
```

---

*Golden Spec v2.0 — Minds Standard*
