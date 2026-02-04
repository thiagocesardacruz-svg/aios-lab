# Quick Start -- First Squad in 5 Minutes

> squad-creator v2.6 -- Get started fast
> Last updated: 2026-02-04

---

## Prerequisites

- Synkra AIOS v2.1.0+ installed and running
- Access to the repository containing `squads/squad-creator/`
- Basic understanding of the `@agent` activation and `*command` syntax

---

## Step 1: Activate the Squad Creator (30 seconds)

Type the following to activate the base squad-creator agent:

```
@squad-creator
```

You will see a greeting from **Craft** (the base agent), listing available commands. Wait for the prompt before proceeding.

**Expected output:**

```
squad-creator Agent ready.
Craft (Creator) ready. Let's build powerful squads!

Key Commands:
  *create-squad     Create a new squad from scratch
  *design-squad     Design squad structure from requirements
  *validate-squad   Validate squad structure and quality
  *help             Show all available commands
```

---

## Step 2: Create Your Squad (2 minutes)

Run the create command with your squad name:

```
*create-squad my-first-squad
```

The agent will guide you through an interactive setup process. Answer the prompts:

1. **Description**: Provide a 1-2 sentence description of your squad's purpose (e.g., "A squad for automating code review workflows")
2. **Domain**: The primary area your squad operates in (e.g., "Code Quality")
3. **Agents**: How many agents and what roles (e.g., "2 agents: code-reviewer and style-checker")

Once you answer, Craft generates the full directory structure:

```
squads/my-first-squad/
  squad.yaml            # Squad manifest with metadata and component declarations
  agents/
    code-reviewer.md    # Agent definition file
    style-checker.md    # Agent definition file
  tasks/                # Empty, ready for task definitions
  workflows/            # Empty, ready for workflow definitions
  checklists/           # Empty, ready for quality checklists
  data/                 # Empty, ready for data files
```

---

## Step 3: Validate Your Squad (1 minute)

Run the validation command to check structural integrity:

```
*validate-squad my-first-squad
```

**Expected output:**

```
Validating squad: my-first-squad
  [PASS] squad.yaml exists and is valid YAML
  [PASS] All declared agent files exist
  [WARN] No tasks declared yet -- consider adding tasks
  [WARN] No workflows declared yet -- consider adding workflows
  [WARN] No checklists declared yet -- consider adding checklists

Validation Result: PASS (with warnings)
```

The warnings are expected for a freshly created squad. Tasks, workflows, and checklists will be added as you build out the squad's capabilities.

---

## Step 4: Try Mind Cloning (1.5 minutes)

Now try the Mind Cloning feature to see the v2.6 capabilities in action. First, activate the mind cloning specialist:

```
@squad-creator:oalanicolas
```

Mirror (the Empath) will activate. Then run a quick YOLO-mode clone. You will need at least 2 text files with content written by or about the person you want to clone:

```
*clone-mind --person "Alex Demo" --mode yolo --sources ["./docs/sample-posts.md", "./docs/sample-notes.md"]
```

The pipeline will run through 6 steps automatically:

1. **Source Validation** -- Checks that both files exist and contain usable text
2. **Voice DNA Extraction** -- Analyzes vocabulary, tone, sentence patterns, cultural markers
3. **Thinking DNA Extraction** -- Analyzes decision patterns, mental models, priorities
4. **Profile Merge** -- Combines both DNA strands into a unified mind profile
5. **Smoke Test** -- Runs 3 test scenarios (email writing, decision making, conflict resolution)
6. **Save** -- Writes the profile to `squads/squad-creator/data/minds/alex-demo.yaml`

**Expected output:**

```
Mirror: Mind Clone complete for "Alex Demo"

Fidelity Score: 67% (YOLO mode)
Voice DNA: Casual, technical, bilingual markers detected
Thinking DNA: Data-driven, moderate risk tolerance, speed-oriented

Smoke Test Results:
  Scenario 1 (Email): PASS - 70% match
  Scenario 2 (Decision): PASS - 64% match
  Scenario 3 (Conflict): PASS - 66% match

Profile saved: squads/squad-creator/data/minds/alex-demo.yaml
```

A 60-75% fidelity score is expected and normal for YOLO mode. For higher fidelity (85-95%), use `--mode quality` with 5 or more diverse source files.

---

## What's Next?

Now that you have a working squad and have tested mind cloning, here are your next steps:

| Goal | Command | Guide |
|------|---------|-------|
| Add tasks to your squad | `*create-squad` (edit tasks/) | [TUTORIAL-COMPLETO.md](./TUTORIAL-COMPLETO.md) |
| Discover tools for your squad | `*discover-tools "domain"` | [TUTORIAL-COMPLETO.md](./TUTORIAL-COMPLETO.md#4) |
| Extract SOPs from documentation | `*extract-sop --source ./path` | [TUTORIAL-COMPLETO.md](./TUTORIAL-COMPLETO.md#5) |
| Check squad quality metrics | `*quality-dashboard my-first-squad` | [COMMANDS.md](./COMMANDS.md) |
| Understand all concepts | -- | [CONCEPTS.md](./CONCEPTS.md) |
| See all available commands | `*help` | [COMMANDS.md](./COMMANDS.md) |
| Troubleshoot issues | -- | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) |

---

## Quick Reference Card

| Action | Command |
|--------|---------|
| Activate base agent | `@squad-creator` |
| Activate sub-agent | `@squad-creator:agent-name` |
| Create squad | `*create-squad {name}` |
| Design from docs | `*design-squad --docs ./path` |
| Validate squad | `*validate-squad {name}` |
| Clone a mind (fast) | `*clone-mind --person "Name" --mode yolo` |
| Clone a mind (thorough) | `*clone-mind --person "Name" --mode quality` |
| Discover tools | `*discover-tools "domain"` |
| Extract SOP | `*extract-sop --source ./path` |
| Quality dashboard | `*quality-dashboard {name}` |
| List squads | `*list-squads` |
| Show help | `*help` |
| Exit agent | `*exit` |

---

*squad-creator docs v2.6.0 -- Synkra AIOS*
