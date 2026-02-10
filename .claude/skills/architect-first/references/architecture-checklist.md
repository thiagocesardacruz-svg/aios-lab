# Architecture Validation Checklist

Use this checklist when validating architectural decisions before implementation.

## 1. Current State Documentation

- [ ] Current system architecture documented
- [ ] Component diagram created
- [ ] Data flow diagram created
- [ ] Integration points identified
- [ ] Dependencies mapped

## 2. Proposed Solution Design

- [ ] Multiple options presented (A/B/C minimum)
- [ ] Trade-offs explicitly documented
- [ ] Chosen architecture documented

## 3. Multi-Agent Validation

- [ ] Product Owner validation
- [ ] Architect validation
- [ ] User/Stakeholder validation

## 4. Capability Preservation

- [ ] Gold Standard Baseline comparison
- [ ] Feature parity verified

## 5. Zero Coupling Validation

- [ ] Module independence verified
- [ ] Configuration externalized
- [ ] Coupling check script passed

## 6. Configuration Strategy

- [ ] Mutable values identified
- [ ] YAML configuration created
- [ ] No hardcoding violations

## 7. Testing Strategy

- [ ] Test plan defined
- [ ] Test coverage targets set
- [ ] Logging strategy defined

## 8. Documentation Requirements

- [ ] Architecture Decision Record (ADR) created
- [ ] Implementation guide created
- [ ] API documentation created (if applicable)

## Stop Rules Check

**If ANY of these are true, STOP and remediate:**

- ⛔ Capability loss detected vs baseline
- ⛔ Structural decision without multi-agent validation
- ⛔ Coupling between modules detected
- ⛔ Missing architectural documentation
- ⛔ Hardcoded mutable configuration values

→ If stopped, consult `stop-rules-guide.md` for remediation steps.
