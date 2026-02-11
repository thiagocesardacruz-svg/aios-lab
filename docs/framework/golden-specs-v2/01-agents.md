# Golden Spec v2 — Agents

> Canonical standard for all agent definitions.
> Version: 2.0 | Status: CANONICAL

---

## File Convention

- **Filename:** `{agent-id}.md` (kebab-case, lowercase)
- **Location:** `squads/{squad-id}/agents/`
- **One file per agent. No exceptions.**

---

## Mandatory Structure

Every agent file MUST contain these sections. Some sections are conditional based on squad type.

```markdown
# {Agent Name}

## Identity
- **ID:** {agent-id}
- **Squad:** {squad-id}
- **Type:** {operational | hybrid | expert}
- **Role:** {One sentence, verb-first, max 20 words}
- **Supervisor:** {agent-id | "none" for squad lead}

## Persona [REQUIRED for expert/hybrid, OPTIONAL for operational]
- **Archetype:** {Builder | Analyst | Creator | Guardian | Strategist | Advisor}
- **Style:** {2-3 adjectives + behavioral note}
- **Tone:** {formal | casual | technical | persuasive | empathetic}
- **Signature:** {Optional closing signature}

## Commands
| Command | Description | Input | Output |
|---------|-------------|-------|--------|
| `{cmd}` | {what it does} | {type: source} | {type: destination} |

## Responsibilities
### Always
- {Mandatory behavior — verb-first}

### Never
- {Prohibited behavior}

## Interface
- **Receives from:** {agent-id} — {data description}
- **Sends to:** {agent-id} — {data description}
- **Output format:** {markdown | yaml | json | mixed}

## Hard Rules
1. {MUST/MUST NOT — testable constraint}

## Failure Behavior
- **On error:** {retry | escalate to {agent-id} | abort + log}
- **On ambiguity:** {ask user | ask supervisor | use default}

## Voice DNA [REQUIRED for expert, OPTIONAL for hybrid]
- **Source:** data/minds/{agent-id}-voice.yaml
- **Vocabulary:** {5+ signature terms}
- **Never say:** {3+ forbidden phrases}
- **Sentence patterns:** {characteristic structures}

## Thinking DNA [REQUIRED for expert, OPTIONAL for hybrid]
- **Source:** data/minds/{agent-id}-thinking.yaml
- **Decision framework:** {primary mental model}
- **Priority stack:** {what matters most → least}
- **Anti-patterns:** {thinking traps to avoid}

## Context [OPTIONAL]
- **Domain knowledge:** data/{knowledge-file}.md
- **Frameworks:** {frameworks this agent applies}
```

---

## Field Rules

### Identity

| Field | Rule | Enforcement |
|-------|------|-------------|
| ID | Must match filename (without .md). Unique within squad. | BLOCKING |
| Squad | Must match parent folder name. | BLOCKING |
| Type | One of: operational, hybrid, expert | BLOCKING |
| Role | Max 20 words. Verb-first. Describes function, not persona. | BLOCKING |
| Supervisor | Must reference real agent in same squad, or "none" for lead. | BLOCKING |

### Persona (Conditional)

| Field | Rule | Enforcement |
|-------|------|-------------|
| Required when | Type is "hybrid" or "expert" | BLOCKING |
| Archetype | One of: Builder, Analyst, Creator, Guardian, Strategist, Advisor | WARNING |
| Style | Behavioral, not decorative. "Direct, data-driven" not "friendly helper". | WARNING |
| Tone | One of: formal, casual, technical, persuasive, empathetic | WARNING |

### Commands

| Rule | Enforcement |
|------|-------------|
| Every command must have all 4 columns filled | BLOCKING |
| Command names: kebab-case, verb-first | BLOCKING |
| Input column: specify data type and source | BLOCKING |
| Output column: specify format and destination | BLOCKING |
| Min 2 commands per agent | WARNING |
| Max 8 commands per agent | WARNING |

### Responsibilities

| Rule | Enforcement |
|------|-------------|
| "Always" min 3 items | BLOCKING |
| "Never" min 2 items | BLOCKING |
| Each item starts with a verb | WARNING |
| No overlap with another agent's "Always" in same squad | BLOCKING |

### Interface

| Rule | Enforcement |
|------|-------------|
| "Receives from" must reference real agents or "user" | BLOCKING |
| "Sends to" must reference real agents or "user" | BLOCKING |
| Output format must be explicit | BLOCKING |

### Hard Rules

| Rule | Enforcement |
|------|-------------|
| Min 2, max 6 hard rules | BLOCKING |
| Each rule is testable (not aspirational) | BLOCKING |
| Rules use MUST/MUST NOT, not "should" | WARNING |

### Failure Behavior

| Rule | Enforcement |
|------|-------------|
| Both "On error" and "On ambiguity" defined | BLOCKING |
| Escalation target must be a real agent | BLOCKING |

### Voice DNA (Conditional)

| Rule | Enforcement |
|------|-------------|
| Required when Type is "expert" | BLOCKING |
| Optional when Type is "hybrid" | - |
| N/A when Type is "operational" | - |
| Must reference existing file in data/minds/ | WARNING |
| Vocabulary min 5 terms | WARNING |
| Never say min 3 phrases | WARNING |

### Thinking DNA (Conditional)

| Rule | Enforcement |
|------|-------------|
| Required when Type is "expert" | BLOCKING |
| Optional when Type is "hybrid" | - |
| N/A when Type is "operational" | - |
| Must reference existing file in data/minds/ | WARNING |
| Decision framework defined | BLOCKING (for expert) |
| Priority stack has 3+ items | WARNING |

---

## Anti-Patterns (FAIL if detected)

| Pattern | Why it fails |
|---------|-------------|
| "Helpful assistant that..." | Generic. Not a role. |
| Role description > 20 words | Too vague to be useful. |
| Commands without Input/Output | Unintegrable. |
| "Never" list is empty | No boundaries = no governance. |
| Agent can do everything | Not specialized. Split it. |
| Interface says "various" or "as needed" | Undefined contract. |
| No supervisor declared | Orphan agent. |
| Expert agent without Voice DNA | Personality not captured. |
| Expert agent without Thinking DNA | Decision patterns not captured. |

---

## Type-Specific Requirements

### Operational Agents

Focus on: Contracts, interfaces, automation.

```markdown
Required: Identity, Commands, Responsibilities, Interface, Hard Rules, Failure Behavior
Optional: Persona, Context
N/A: Voice DNA, Thinking DNA
```

### Hybrid Agents

Focus on: Balanced personality and contracts.

```markdown
Required: Identity, Persona, Commands, Responsibilities, Interface, Hard Rules, Failure Behavior
Optional: Voice DNA, Thinking DNA, Context
```

### Expert Agents

Focus on: Personality preservation, authentic voice.

```markdown
Required: ALL sections including Voice DNA and Thinking DNA
Optional: Context
```

---

*Golden Spec v2.0 — Agent Standard*
