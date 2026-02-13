# Validate API Contract

## Meta
- **ID:** validate-api-contract
- **Squad:** qa
- **Executed by:** process-auditor
- **Idempotent:** yes
- **Estimated tokens:** medium (1-5k)

## Purpose
Validate API implementation matches its documented contract/specification.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| api_spec | yaml | yes | tech agent |
| api_endpoint | text | yes | tech agent |
| test_data | yaml | no | tech agent |

## Steps
1. Parse API specification (OpenAPI/Swagger)
2. Generate test requests for each endpoint
3. Execute requests against actual API
4. Compare responses to spec
5. Verify status codes, headers, body structure
6. Document discrepancies

## Output
| Field | Type | Destination |
|-------|------|-------------|
| contract_validation | md | tech-lead |
| discrepancies | yaml | tech agent |

## Validation
- All endpoints tested
- Response structures match spec
- Status codes correct

## Error Handling
- **If input missing:** Abort with spec requirement
- **If step fails:** Document failing endpoints
