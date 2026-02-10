---
name: architect-first
description: Guide for implementing the Architect-First development philosophy - perfect architecture, pragmatic execution, quality guaranteed by tests. Use this skill when starting new features, refactoring systems, or when architectural decisions are needed. Enforces non-negotiables like complete design/documentation before code, zero coupling, and validation by multiple perspectives before structural decisions.
---

# Architect First

## Overview

This skill embodies the "Architect-First" development philosophy: **Perfect architecture, pragmatic execution, quality guaranteed by tests**.

The core principle: **Architecture and documentation are non-negotiable and must precede implementation. Code quality is negotiable IF backed by tests as a safety net (escape hatch).**

## Core Philosophy

### Mantra
"Arquitetura perfeita, execução pragmática, qualidade garantida por testes"

### Quality Gates

**Non-Negotiable (STOP if violated):**
- **Architecture**: Complete design and documentation BEFORE any code
- **Documentation**: Must precede and accompany implementation
- **Capability Preservation**: Never lose capability/granularity vs previous versions
- **Zero Coupling**: Expansion packs must be independent
- **Multi-Agent Validation**: Structural decisions validated by PO/Architect/User

**Negotiable (with escape hatch):**
- **Code Style**: Acceptable if backed by tests as safety net
- **Feature Completeness**: 80% acceptable IF core use case works
- **Quick & Dirty Code**: Allowed ONLY with test plan and minimal logging

## Stop Rules (Hard Boundaries)

**STOP immediately if detecting:**

- ⛔ **Capability loss** vs baseline
- ⛔ **Structural decision** without multi-agent validation
- ⛔ **Coupling** between modules
- ⛔ **Missing architectural documentation**
- ⛔ **Quick & dirty code** WITHOUT test plan and logs
- ⛔ **Hardcoded** mutable configuration values

When stopped, consult `references/stop-rules-guide.md` for remediation.

## Acceptance Criteria

### Will Accept
- ✓ "Ugly" code WITH comprehensive tests
- ✓ 80% features IF core case covered
- ✓ Large refactors that increase flexibility
- ✓ Extensive documentation if it teaches customization

### Will Reject
- ✗ "Ugly" code WITHOUT tests
- ✗ Capability loss without explicit justification
- ✗ Hardcoded mutable values
- ✗ Deployment without core case working

## Resources

### scripts/
- `check_coupling.py` - Validates zero-coupling principle
- `validate_risk_mitigation.py` - Checks risk coverage
- `architecture_validator.py` - Validates architectural completeness

### references/
- `architecture-checklist.md` - Complete architecture validation checklist
- `pre-implementation-checklist.md` - Pre-coding validation
- `stop-rules-guide.md` - Remediation guide when stop rules trigger
- `testing-strategy-guide.md` - Test-driven development patterns

### assets/
- `architecture-template.md` - Standard architecture document template
- `config-template.yaml` - Configuration externalization template
