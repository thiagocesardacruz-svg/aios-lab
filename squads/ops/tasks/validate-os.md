# Validate OS

## Meta
- **ID:** validate-os
- **Squad:** ops
- **Executed by:** ops-manager
- **Idempotent:** yes
- **Estimated tokens:** low (<1k)

## Purpose
Validate OS structure and content against schema and requirements.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| os_record | yaml | yes | create-os |
| os_schema | yaml | yes | templates/os-template.yaml |
| os_validation_checklist | md | yes | checklists/os-validation.md |

## Steps
1. Parse OS record structure
2. Check required fields against schema
3. Validate field types and formats
4. Run os-validation checklist
5. Compile validation report

## Output
| Field | Type | Destination |
|-------|------|-------------|
| validation_result | text | ops-manager |
| validation_errors | yaml | user (if failed) |

## Validation
- All required fields present
- Field formats match schema
- Checklist passes (all 🔴 items)

## Error Handling
- **If input missing:** Abort with schema error
- **If step fails:** Return detailed error list
