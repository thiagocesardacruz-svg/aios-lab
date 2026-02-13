# Review Pricing Model

## Meta
- **ID:** review-pricing-model
- **Squad:** finance
- **Executed by:** pricing-strategist
- **Idempotent:** yes
- **Estimated tokens:** medium (1-5k)

## Purpose
Review and update pricing model based on costs, competition, and value.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| current_pricing | yaml | yes | sales/data/pricing-tiers.yaml |
| cost_data | yaml | yes | controller |
| competitor_data | yaml | no | marketing squad |
| customer_feedback | yaml | no | customer squad |

## Steps
1. Analyze current cost structure
2. Calculate required price for target margin
3. Compare to competitor pricing
4. Review customer price sensitivity
5. Identify pricing opportunities
6. Generate pricing recommendations

## Output
| Field | Type | Destination |
|-------|------|-------------|
| pricing_review | md | finance-lead |
| recommendations | yaml | pricing-strategist |

## Validation
- Cost basis is current
- Margin targets calculated
- Recommendations actionable

## Error Handling
- **If input missing:** Focus on cost-plus analysis
- **If step fails:** Note limitations in report
