# Test Integration

## Meta
- **ID:** test-integration
- **Squad:** qa
- **Executed by:** process-auditor
- **Idempotent:** yes
- **Estimated tokens:** high (>5k)

## Purpose
Execute integration tests between connected systems or components.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| test_plan | md | yes | tech agent |
| systems | yaml | yes | tech agent |
| test_environment | text | yes | tech agent |

## Steps
1. Load test plan and identify test cases
2. Set up test environment connections
3. Execute each integration test case
4. Capture results and logs
5. Identify failures and root causes
6. Generate test report

## Output
| Field | Type | Destination |
|-------|------|-------------|
| test_results | md | tech-lead |
| failed_tests | yaml | tech agent |
| test_logs | text | ops-manager |

## Validation
- All test cases executed
- Results captured for each test
- Failures have root cause analysis

## Error Handling
- **If input missing:** Request test plan from tech
- **If step fails:** Continue with remaining tests, log failures
