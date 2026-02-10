# Pre-Implementation Checklist

Use this checklist before writing any code to ensure architectural validation is complete.

## Architecture Validation

- [ ] **Architecture documented and validated?**
- [ ] Architecture diagrams created
- [ ] Component interactions defined
- [ ] Multi-agent validation completed
- [ ] Architecture Decision Record (ADR) written

## Core Use Case Definition

- [ ] **Core use case clearly defined?**
- [ ] Primary user workflow documented
- [ ] Success criteria specified
- [ ] Acceptance criteria written

## Configuration Externalization

- [ ] **Configuration externalized to YAML?**
- [ ] All mutable values identified
- [ ] YAML schema defined
- [ ] No hardcoded values in planned implementation

## Test Strategy

- [ ] **Test strategy defined?**
- [ ] Test plan written
- [ ] Coverage targets set
- [ ] Test data requirements identified

## Logging Strategy

- [ ] **Logging/observation points identified?**
- [ ] Key decision points for logging marked
- [ ] Log levels assigned
- [ ] Debugging hooks planned

## Quality Escape Hatch Acknowledgment

**Remember**: Code quality is negotiable IF backed by tests.

You may proceed with:
- ✓ "Ugly" code WITH comprehensive tests
- ✓ Quick implementation WITH test plan + logging
- ✓ 80% feature completeness IF core case works

You must NOT proceed with:
- ✗ "Ugly" code WITHOUT tests
- ✗ Hardcoded mutable values
- ✗ Implementation without core case defined
