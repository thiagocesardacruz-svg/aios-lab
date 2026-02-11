# Golden Spec v2 — Validation Schema

> Validation rules and schema for squad components.
> Version: 2.0 | Status: CANONICAL

---

## Schema Overview

```yaml
schema_version: "2.0"
compatible_with: "AIOS >= 2.1.0"

validation_levels:
  BLOCKING: "Fails validation completely — must fix"
  WARNING: "Passes with warnings — should fix"
  INFO: "Informational — nice to have"
```

---

## Agent Validation Schema

```yaml
agent_schema:

  # Always required sections
  required_sections:
    - identity
    - commands
    - responsibilities
    - interface
    - hard_rules
    - failure_behavior

  # Conditional sections based on type
  conditional_sections:
    persona:
      required_when: "identity.type in ['expert', 'hybrid']"
      enforcement: BLOCKING

    voice_dna:
      required_when: "identity.type == 'expert'"
      optional_when: "identity.type == 'hybrid'"
      not_applicable_when: "identity.type == 'operational'"
      enforcement: BLOCKING

    thinking_dna:
      required_when: "identity.type == 'expert'"
      optional_when: "identity.type == 'hybrid'"
      not_applicable_when: "identity.type == 'operational'"
      enforcement: BLOCKING

  # Field-level rules
  field_rules:

    identity:
      id:
        pattern: "^[a-z][a-z0-9-]*$"
        must_match: filename
        enforcement: BLOCKING

      squad:
        must_match: parent_folder
        enforcement: BLOCKING

      type:
        enum: [operational, hybrid, expert]
        enforcement: BLOCKING

      role:
        max_words: 20
        must_start_with: verb
        enforcement: BLOCKING

      supervisor:
        must_exist_in: "agents/"
        or_value: "none"
        enforcement: BLOCKING

    commands:
      min_count: 2
      max_count: 8
      required_columns:
        - command
        - description
        - input
        - output
      command_pattern: "^[a-z][a-z0-9-]*$"
      enforcement: BLOCKING

    responsibilities:
      always:
        min_count: 3
        item_starts_with: verb
        enforcement: BLOCKING
      never:
        min_count: 2
        enforcement: BLOCKING

    hard_rules:
      min_count: 2
      max_count: 6
      must_contain: ["MUST", "MUST NOT"]
      enforcement: BLOCKING

    failure_behavior:
      required_fields:
        - on_error
        - on_ambiguity
      escalation_target_must_exist: true
      enforcement: BLOCKING
```

---

## Workflow Validation Schema

```yaml
workflow_schema:

  required_fields:
    - id
    - name
    - squad
    - version
    - description
    - trigger
    - participants
    - steps
    - completion
    - constraints

  field_rules:

    id:
      pattern: "^[a-z][a-z0-9-]*$"
      must_match: filename
      enforcement: BLOCKING

    trigger:
      type:
        enum: [manual, scheduled, event, webhook]
        enforcement: BLOCKING
      source:
        must_be: agent_or_user_or_system
        enforcement: BLOCKING

    participants:
      min_count: 1
      agent_must_exist: true
      role_required: true
      enforcement: BLOCKING

    steps:
      min_count: 2
      max_count: 10
      required_fields:
        - id
        - name
        - agent
        - task
        - input
        - output
        - depends_on
        - on_fail

      step_id_pattern: "^step-[0-9]{2}$"
      first_step_depends_on: "[]"
      no_circular_dependencies: true
      task_must_exist: true
      agent_in_participants: true
      enforcement: BLOCKING

    completion:
      required_fields:
        - condition
        - output
        - notify
      condition_is_testable: true
      enforcement: BLOCKING

    constraints:
      required_fields:
        - timeout_minutes
        - retry_policy
      enforcement: BLOCKING
```

---

## Task Validation Schema

```yaml
task_schema:

  required_sections:
    - meta
    - purpose
    - input
    - steps
    - output
    - validation
    - error_handling

  field_rules:

    meta:
      id:
        pattern: "^[a-z][a-z0-9-]*$"
        must_match: filename
        must_start_with: verb
        enforcement: BLOCKING

      squad:
        must_match: parent_folder
        enforcement: BLOCKING

      executed_by:
        must_exist_in: "agents/"
        enforcement: BLOCKING

      idempotent:
        enum: [yes, no]
        enforcement: BLOCKING

      estimated_tokens:
        enum: [low, medium, high]
        enforcement: WARNING

    purpose:
      max_words: 25
      describes_output: true
      enforcement: BLOCKING

    input:
      format: table
      required_columns:
        - field
        - type
        - required
        - source
      min_rows: 1
      type_is_explicit: true
      source_is_traceable: true
      enforcement: BLOCKING

    steps:
      format: numbered_list
      min_count: 2
      max_count: 8
      verb_first: true
      no_branching: true
      enforcement: BLOCKING

    output:
      format: table
      required_columns:
        - field
        - type
        - destination
      min_rows: 1
      enforcement: BLOCKING

    validation:
      min_criteria: 1
      criteria_is_binary: true
      enforcement: BLOCKING

    error_handling:
      required_scenarios:
        - if_input_missing
        - if_step_fails
      escalation_target_exists: true
      enforcement: BLOCKING
```

---

## Mind File Validation Schema

```yaml
mind_schema:

  voice_dna:
    required_fields:
      - meta
      - voice_dna.signature_phrases
      - voice_dna.vocabulary
      - voice_dna.sentence_patterns
      - voice_dna.tone_markers

    field_rules:
      meta:
        id_pattern: "^[a-z-]+-voice$"
        consumed_by_min: 1
        source_fidelity_enum: [high, medium, low]
        enforcement: BLOCKING

      signature_phrases:
        min_count: 3
        enforcement: BLOCKING

      vocabulary.always_use:
        min_count: 5
        enforcement: WARNING

      vocabulary.never_use:
        min_count: 3
        enforcement: WARNING

      sentence_patterns:
        required: [opening, closing]
        enforcement: BLOCKING

      tone_markers.default:
        required: true
        enforcement: BLOCKING

      examples:
        min_count: 2
        enforcement: WARNING

  thinking_dna:
    required_fields:
      - meta
      - thinking_dna.mental_models
      - thinking_dna.decision_framework
      - thinking_dna.heuristics

    field_rules:
      meta:
        id_pattern: "^[a-z-]+-thinking$"
        consumed_by_min: 1
        enforcement: BLOCKING

      mental_models.primary:
        required: true
        enforcement: BLOCKING

      decision_framework:
        required: [first_question, priority_stack]
        priority_stack_min: 3
        enforcement: BLOCKING

      heuristics:
        min_count: 3
        id_pattern: "^[A-Z]{2,3}_[A-Z]{2}_[0-9]{3}$"
        required_fields: [id, trigger, rule, source]
        enforcement: BLOCKING

      anti_patterns:
        min_count: 2
        enforcement: WARNING
```

---

## Cross-Reference Validation

```yaml
cross_reference_checks:

  - id: XREF-001
    name: "Agent supervisor exists"
    check: "agent.identity.supervisor exists in agents/ or is 'none'"
    enforcement: BLOCKING

  - id: XREF-002
    name: "Agent receives_from exists"
    check: "all agents in interface.receives_from exist or are 'user'"
    enforcement: BLOCKING

  - id: XREF-003
    name: "Agent sends_to exists"
    check: "all agents in interface.sends_to exist or are 'user'"
    enforcement: BLOCKING

  - id: XREF-004
    name: "Workflow participant agents exist"
    check: "all participants.agent exist in agents/"
    enforcement: BLOCKING

  - id: XREF-005
    name: "Workflow step tasks exist"
    check: "all steps.task exist in tasks/"
    enforcement: BLOCKING

  - id: XREF-006
    name: "Task executed_by exists"
    check: "task.meta.executed_by exists in agents/"
    enforcement: BLOCKING

  - id: XREF-007
    name: "Mind files consumed"
    check: "all mind files have at least 1 agent in consumed_by"
    enforcement: BLOCKING

  - id: XREF-008
    name: "Voice DNA referenced"
    check: "expert agents reference existing voice_dna file"
    enforcement: BLOCKING

  - id: XREF-009
    name: "Thinking DNA referenced"
    check: "expert agents reference existing thinking_dna file"
    enforcement: BLOCKING
```

---

## Validation Commands

```bash
# Validate single agent
*validate-squad {squad} --component agent --file {agent-id}

# Validate all agents in squad
*validate-squad {squad} --component agents

# Validate entire squad
*validate-squad {squad}

# Validate with verbose output
*validate-squad {squad} --verbose

# Validate and auto-fix warnings
*validate-squad {squad} --fix
```

---

## Validation Report Format

```yaml
validation_report:
  squad: {squad-id}
  timestamp: {ISO-8601}
  schema_version: "2.0"

  summary:
    status: {PASS | FAIL | PASS_WITH_WARNINGS}
    blocking_errors: {count}
    warnings: {count}
    info: {count}

  results:
    agents:
      - file: {filename}
        status: {PASS | FAIL}
        errors: [{message, rule_id, line}]
        warnings: [{message, rule_id}]

    workflows:
      - file: {filename}
        status: {PASS | FAIL}
        errors: [...]

    tasks:
      - file: {filename}
        status: {PASS | FAIL}
        errors: [...]

    cross_references:
      - check_id: {XREF-XXX}
        status: {PASS | FAIL}
        details: {description}
```

---

*Golden Spec v2.0 — Validation Schema*
