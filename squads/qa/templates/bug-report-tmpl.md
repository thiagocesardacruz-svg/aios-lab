# Bug Report Template

## Meta
- **ID:** bug-report-tmpl
- **Squad:** qa
- **Used by:** validate-deliverable, test-integration
- **Output format:** md
- **Version:** 1.0.0

## Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `{{bug_id}}` | Unique bug identifier | yes | none |
| `{{title}}` | Brief bug description | yes | none |
| `{{severity}}` | critical, major, minor, observation | yes | none |
| `{{reporter}}` | Who found the bug | yes | none |
| `{{date_found}}` | When bug was found | yes | none |
| `{{artifact}}` | Affected artifact/component | yes | none |
| `{{environment}}` | Where bug was found | yes | none |
| `{{steps_to_reproduce}}` | Steps to reproduce | yes | none |
| `{{expected_result}}` | What should happen | yes | none |
| `{{actual_result}}` | What actually happens | yes | none |
| `{{evidence}}` | Screenshots, logs, etc. | no | "None attached" |
| `{{assigned_to}}` | Who should fix | no | "Unassigned" |

## Template

---BEGIN TEMPLATE---

# Bug Report — {{bug_id}}

## {{title}}

| Field | Value |
|-------|-------|
| Severity | {{severity}} |
| Reporter | {{reporter}} |
| Date Found | {{date_found}} |
| Artifact | {{artifact}} |
| Environment | {{environment}} |
| Assigned To | {{assigned_to}} |

## Steps to Reproduce

{{steps_to_reproduce}}

## Expected Result

{{expected_result}}

## Actual Result

{{actual_result}}

## Evidence

{{evidence}}

---

*Bug reported by {{reporter}} on {{date_found}}*

---END TEMPLATE---

## Usage Notes
- Severity must match severity-definitions.yaml
- Steps to reproduce must be numbered and specific
- Evidence should include screenshots or log snippets when possible
