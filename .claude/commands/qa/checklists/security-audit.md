# Security Audit Checklist

## Meta
- **ID:** security-audit
- **Squad:** qa
- **Used by:** process-auditor, audit-security task
- **Trigger:** Before release of code handling sensitive data
- **Type:** compliance

## Items

### Authentication & Authorization

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 1 | Auth required | All protected routes require authentication | 🔴 |
| 2 | Authorization enforced | Role-based access controls in place | 🔴 |
| 3 | Session management | Sessions expire and can be invalidated | 🔴 |

### Data Protection

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 4 | Sensitive data encrypted | PII and credentials encrypted at rest | 🔴 |
| 5 | HTTPS enforced | All traffic over HTTPS | 🔴 |
| 6 | No secrets in code | No API keys, passwords in source | 🔴 |

### Input Validation

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 7 | Input sanitized | All user input validated and sanitized | 🔴 |
| 8 | SQL injection prevented | Parameterized queries used | 🔴 |
| 9 | XSS prevented | Output encoding applied | 🔴 |

### Logging & Monitoring

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 10 | Security events logged | Auth failures, access denials logged | 🟡 |
| 11 | No sensitive data in logs | PII not written to logs | 🔴 |
| 12 | Audit trail maintained | Critical actions recorded | 🟡 |

## Gate Rule
- **Pass:** All 🔴 items pass + max 1 🟡 warning
- **Fail:** Any 🔴 item fails
- **Action on fail:** Block release, escalate to tech-lead and ops-lead immediately
