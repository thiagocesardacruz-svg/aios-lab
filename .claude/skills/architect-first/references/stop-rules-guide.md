# Stop Rules Remediation Guide

When a stop rule is triggered, HALT immediately and follow the remediation steps below.

## Stop Rule 1: Capability Loss Detected

**Trigger**: New design/implementation loses functionality vs baseline.

### Remediation Steps

1. **Document the loss** - List specific capabilities lost
2. **Analyze root cause** - Why was capability lost?
3. **Choose remediation path**:
   - Option A: Restore capability
   - Option B: Justify and migrate
   - Option C: Revert design

---

## Stop Rule 2: Structural Decision Without Multi-Agent Validation

**Trigger**: Architectural change proposed/implemented without PO/Architect/User validation.

### Remediation Steps

1. **HALT implementation** - Stop all coding immediately
2. **Prepare validation package** - Create architecture document with A/B/C options
3. **Multi-agent validation sequence** - PO → Architect → User
4. **Document decision** - Create ADR
5. **Proceed only after approval**

---

## Stop Rule 3: Coupling Between Modules

**Trigger**: Dependencies detected between modules that should be independent.

### Remediation Steps

1. **Run coupling check**: `python scripts/check_coupling.py`
2. **Design decoupling strategy**
3. **Implement zero-coupling**
4. **Validate independence**

---

## Stop Rule 4: Missing Architectural Documentation

**Trigger**: Implementation started without complete architectural documentation.

### Remediation Steps

1. **HALT implementation**
2. **Complete architecture documentation** using template
3. **Review and validate**
4. **Resume implementation** only after documentation complete

---

## Stop Rule 5: Quick & Dirty Code Without Test Plan

**Trigger**: "Ugly" or rushed code written without test coverage or logging.

### Remediation Steps

1. **Acknowledge the escape hatch rules**
2. **Define test plan**
3. **Add logging/observation**
4. **Implement tests BEFORE continuing**

---

## Stop Rule 6: Hardcoded Mutable Configuration

**Trigger**: Configuration values hardcoded in source instead of externalized to YAML.

### Remediation Steps

1. **Identify all hardcoded values**
2. **Create YAML configuration schema**
3. **Refactor to use configuration**
4. **Document configuration**

---

## General Remediation Process

1. **HALT**: Stop all implementation immediately
2. **ASSESS**: Understand the violation and its scope
3. **PLAN**: Choose remediation strategy
4. **VALIDATE**: Get approval for remediation approach
5. **EXECUTE**: Implement remediation
6. **VERIFY**: Confirm stop rule no longer triggered
7. **RESUME**: Continue with validated approach
