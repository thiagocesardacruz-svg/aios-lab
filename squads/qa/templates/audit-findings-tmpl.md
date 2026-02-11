# Audit Findings Template

## Meta
- **ID:** audit-findings-tmpl
- **Squad:** qa
- **Used by:** audit-process, process-auditor
- **Output format:** md
- **Version:** 1.0.0

## Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `{{audit_id}}` | Unique audit identifier | yes | none |
| `{{audit_scope}}` | What was audited | yes | none |
| `{{audit_date}}` | When audit was conducted | yes | none |
| `{{auditor}}` | Who performed audit | yes | none |
| `{{criteria_used}}` | Standards/checklists applied | yes | none |
| `{{summary}}` | Executive summary | yes | none |
| `{{findings_critical}}` | Critical findings | no | "None" |
| `{{findings_major}}` | Major findings | no | "None" |
| `{{findings_minor}}` | Minor findings | no | "None" |
| `{{observations}}` | Observations/improvements | no | "None" |
| `{{recommendations}}` | Recommended actions | yes | none |

## Template

---BEGIN TEMPLATE---

# Audit Report — {{audit_id}}

**Scope:** {{audit_scope}}
**Date:** {{audit_date}}
**Auditor:** {{auditor}}

---

## Executive Summary

{{summary}}

## Criteria Applied

{{criteria_used}}

---

## Findings

### Critical

{{findings_critical}}

### Major

{{findings_major}}

### Minor

{{findings_minor}}

### Observations

{{observations}}

---

## Recommendations

{{recommendations}}

---

*Audit conducted by {{auditor}} on {{audit_date}}*

---END TEMPLATE---

## Usage Notes
- Each finding must include evidence reference
- Recommendations must be actionable and assigned
- Critical findings require immediate escalation
