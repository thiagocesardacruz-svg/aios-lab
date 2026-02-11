# Create OS

## Meta
- **ID:** create-os
- **Squad:** ops
- **Executed by:** ops-manager
- **Idempotent:** no
- **Estimated tokens:** low (<1k)

## Purpose
Generate a new Service Order with unique ID and validated structure.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| requester | text | yes | user |
| description | text | yes | user |
| priority | text | yes | user |
| target_squad | text | yes | user |
| deadline | text | no | user |

## Steps
1. Generate unique OS ID using format OS-YYYY-NNNN
2. Validate target_squad against squad-registry.yaml
3. Set initial status to "draft"
4. Populate OS using os-template.yaml
5. Log creation in ops activity log

## Output
| Field | Type | Destination |
|-------|------|-------------|
| os_record | yaml | ops-manager (for routing) |
| os_id | text | user (confirmation) |

## Validation
- OS ID is unique (no duplicates in system)
- Target squad exists in squad-registry.yaml
- Required fields are non-empty

## Error Handling
- **If input missing:** Ask user for missing fields
- **If step fails:** Abort and log error
