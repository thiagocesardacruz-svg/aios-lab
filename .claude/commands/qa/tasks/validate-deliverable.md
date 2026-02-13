# Validate Deliverable

## Meta
- **ID:** validate-deliverable
- **Squad:** qa
- **Executed by:** qa-lead
- **Idempotent:** yes
- **Estimated tokens:** medium (1-5k)

## Purpose
Validate any deliverable against its Definition of Done and applicable checklists.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| deliverable | any | yes | squad agent |
| artifact_type | text | yes | squad agent |
| dod_definitions | yaml | yes | data/dod-definitions.yaml |
| applicable_checklist | md | yes | checklists/ |

## Steps
1. Identify artifact type and load corresponding DoD
2. Select applicable checklist based on artifact type
3. Run checklist against deliverable
4. Document pass/fail for each item
5. Generate QA report using qa-report-tmpl

## Output
| Field | Type | Destination |
|-------|------|-------------|
| qa_report | md | squad agent (for fixes if failed) |
| validation_status | text | ops-manager |

## Validation
- All required DoD items checked
- Checklist fully executed
- Report generated with clear status

## Error Handling
- **If input missing:** Ask source agent for artifact type
- **If step fails:** Generate partial report, escalate to qa-lead
