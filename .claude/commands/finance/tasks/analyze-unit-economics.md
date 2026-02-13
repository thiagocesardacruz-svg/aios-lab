# Analyze Unit Economics

## Meta
- **ID:** analyze-unit-economics
- **Squad:** finance
- **Executed by:** financial-analyst
- **Idempotent:** yes
- **Estimated tokens:** medium (1-5k)

## Purpose
Calculate and analyze key unit economics metrics (CAC, LTV, etc.).

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| customer_data | yaml | yes | customer squad |
| revenue_data | yaml | yes | finance records |
| marketing_spend | yaml | yes | marketing squad |
| financial_metrics | yaml | yes | data/financial-metrics.yaml |

## Steps
1. Calculate Customer Acquisition Cost (CAC)
2. Calculate Customer Lifetime Value (LTV)
3. Calculate LTV:CAC ratio
4. Calculate payback period
5. Calculate gross margin
6. Analyze trends vs previous period
7. Generate unit economics report

## Output
| Field | Type | Destination |
|-------|------|-------------|
| unit_economics | md | finance-lead |
| key_metrics | yaml | monthly-report workflow |

## Validation
- All metrics calculated
- LTV:CAC ratio computed
- Trends analyzed

## Error Handling
- **If input missing:** Calculate available metrics, note gaps
- **If step fails:** Escalate if LTV:CAC <3
