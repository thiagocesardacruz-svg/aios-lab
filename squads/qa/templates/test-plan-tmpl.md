# Test Plan Template

## Meta
- **ID:** test-plan-tmpl
- **Squad:** qa
- **Used by:** test-integration, validate-api-contract
- **Output format:** md
- **Version:** 1.0.0

## Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `{{plan_id}}` | Unique plan identifier | yes | none |
| `{{feature_name}}` | Feature being tested | yes | none |
| `{{scope}}` | What is in/out of scope | yes | none |
| `{{test_types}}` | Types of tests (unit, integration, e2e) | yes | none |
| `{{test_cases}}` | List of test cases | yes | none |
| `{{test_data}}` | Required test data | yes | none |
| `{{environment}}` | Test environment | yes | none |
| `{{success_criteria}}` | What defines pass | yes | none |
| `{{risks}}` | Known risks | no | "None identified" |

## Template

---BEGIN TEMPLATE---

# Test Plan — {{plan_id}}

**Feature:** {{feature_name}}

---

## Scope

{{scope}}

## Test Types

{{test_types}}

## Test Environment

{{environment}}

## Test Cases

{{test_cases}}

## Test Data Requirements

{{test_data}}

## Success Criteria

{{success_criteria}}

## Risks

{{risks}}

---

*Test plan created for {{feature_name}}*

---END TEMPLATE---

## Usage Notes
- Test cases should be numbered and traceable to requirements
- Include both positive and negative test scenarios
- Define clear pass/fail criteria for each test case
