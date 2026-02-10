# [System/Feature Name] Architecture

**Version:** 1.0
**Date:** YYYY-MM-DD
**Author:** [Your Name]
**Status:** [Draft | Review | Approved | Implemented]

---

## Overview

### Purpose
[2-3 sentences describing what this system/feature does and why it exists]

### Scope
**In Scope:**
- [Feature/capability 1]
- [Feature/capability 2]

**Out of Scope:**
- [What this will NOT do]

### Success Criteria
- [ ] [Measurable criterion 1]
- [ ] [Measurable criterion 2]

---

## Context

### Problem Statement
[Describe the problem this architecture solves]

### Goals
1. [Primary goal]
2. [Secondary goal]

---

## Architecture Design

### System Architecture Diagram

```
[Include diagram here - can be ASCII, Mermaid, or link to image]
```

### Component Architecture

#### Component 1: [Name]
- **Purpose:** [What this component does]
- **Responsibilities:** [List]
- **Interfaces:** Input/Output
- **Dependencies:** [What it depends on]

---

## Data Flow

### Primary Workflow

```
1. [Step 1] → [Component A]
2. [Step 2] → [Component B]
3. [Result/Output]
```

---

## Integration Points

### External Systems

#### Integration 1: [System Name]
- **Purpose:** [Why we integrate]
- **Type:** [API, Database, etc.]
- **Protocol:** [REST, GraphQL, etc.]

---

## Configuration

### Configuration Schema

```yaml
# config.yaml
system:
  name: string
  environment: string
```

---

## Architectural Decisions

### Decision 1: [Decision Title]

**Context:** [What situation led to this decision?]

**Options Considered:**
- Option A: [Name] - Pros/Cons
- Option B: [Name] - Pros/Cons

**Decision:** Chose Option [X] because [rationale]

---

## Risks & Mitigation

| Risk | Severity | Mitigation Strategy |
|------|----------|-------------------|
| [Risk 1] | High/Med/Low | [How to mitigate] |

---

## Approvals

| Role | Name | Date |
|------|------|------|
| Product Owner | | |
| Architect | | |
| Tech Lead | | |
