# Compliance Report Template

## Meta
- **ID:** compliance-report-tmpl
- **Squad:** qa
- **Used by:** verify-compliance, audit-security
- **Output format:** md
- **Version:** 1.0.0

## Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `{{report_id}}` | Unique report identifier | yes | none |
| `{{compliance_type}}` | Type (WCAG, GDPR, brand, etc.) | yes | none |
| `{{artifact}}` | What was assessed | yes | none |
| `{{assessment_date}}` | Date of assessment | yes | none |
| `{{assessor}}` | Who performed assessment | yes | none |
| `{{compliance_status}}` | Compliant, Partial, Non-Compliant | yes | none |
| `{{requirements_checked}}` | Requirements evaluated | yes | none |
| `{{compliant_items}}` | Items that pass | yes | none |
| `{{non_compliant_items}}` | Items that fail | no | "None" |
| `{{remediation_plan}}` | Plan to fix non-compliance | no | "N/A" |

## Template

---BEGIN TEMPLATE---

# Compliance Report — {{report_id}}

**Compliance Type:** {{compliance_type}}
**Artifact:** {{artifact}}
**Date:** {{assessment_date}}
**Assessor:** {{assessor}}

---

## Compliance Status: {{compliance_status}}

## Requirements Evaluated

{{requirements_checked}}

## Compliant Items

{{compliant_items}}

## Non-Compliant Items

{{non_compliant_items}}

## Remediation Plan

{{remediation_plan}}

---

*Compliance assessment by {{assessor}}*

---END TEMPLATE---

## Usage Notes
- Non-compliance must include specific requirement violated
- Remediation plan must have owner and deadline
- Partial compliance requires percentage breakdown
