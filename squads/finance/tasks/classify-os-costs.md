# Classify OS Costs

## Meta
- **ID:** classify-os-costs
- **Squad:** finance
- **Executed by:** controller
- **Idempotent:** yes
- **Estimated tokens:** low (<1k)

## Purpose
Classify OS costs to appropriate categories for tracking and reporting.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| os_id | text | yes | ops-manager |
| os_type | text | yes | ops-manager |
| squad_id | text | yes | ops-manager |
| token_count | number | yes | ops-manager |
| tools_used | yaml | no | ops-manager |
| cost_categories | yaml | yes | data/cost-categories.yaml |

## Steps
1. Analyze OS type and tools used
2. Map to primary cost category
3. Calculate cost using category rate
4. Apply any multipliers (EXTM, EXTA)
5. Generate classified cost entry

## Output
| Field | Type | Destination |
|-------|------|-------------|
| classified_cost | yaml | track-expenses |
| category | text | ops-manager |

## Validation
- Category is valid per cost-categories.yaml
- Rate applied correctly
- Cost is positive number

## Error Handling
- **If input missing:** Use highest-cost category (conservative)
- **If step fails:** Log for manual classification
