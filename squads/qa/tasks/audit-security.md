# Audit Security

## Meta
- **ID:** audit-security
- **Squad:** qa
- **Executed by:** process-auditor
- **Idempotent:** yes
- **Estimated tokens:** medium (1-5k)

## Purpose
Audit application or system for security vulnerabilities.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| target | text | yes | tech agent |
| security_checklist | md | yes | checklists/security-audit.md |
| scope | text | yes | qa-lead |

## Steps
1. Run security checklist
2. Check authentication mechanisms
3. Verify authorization controls
4. Test for common vulnerabilities (OWASP Top 10)
5. Check data protection measures
6. Review logging and monitoring
7. Document findings by severity

## Output
| Field | Type | Destination |
|-------|------|-------------|
| security_report | md | tech-lead |
| vulnerabilities | yaml | ops-lead (if critical) |

## Validation
- All checklist items evaluated
- OWASP Top 10 checked
- Findings categorized by severity

## Error Handling
- **If input missing:** Use standard scope
- **If step fails:** Escalate immediately if partial findings include critical
