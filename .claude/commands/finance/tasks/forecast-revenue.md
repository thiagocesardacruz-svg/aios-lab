# Forecast Revenue

## Meta
- **ID:** forecast-revenue
- **Squad:** finance
- **Executed by:** financial-analyst
- **Idempotent:** yes
- **Estimated tokens:** medium (1-5k)

## Purpose
Project revenue for upcoming period based on current trends and pipeline.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| historical_revenue | yaml | yes | finance records |
| current_mrr | number | yes | finance records |
| pipeline_data | yaml | no | sales squad |
| forecast_months | number | yes | finance-lead |

## Steps
1. Analyze historical revenue trends
2. Calculate growth rate (MoM, YoY)
3. Factor in known pipeline deals
4. Apply churn rate to existing revenue
5. Generate monthly projections
6. Calculate confidence intervals

## Output
| Field | Type | Destination |
|-------|------|-------------|
| revenue_forecast | yaml | finance-lead |
| forecast_report | md | monthly-report workflow |

## Validation
- Projections are for requested period
- Assumptions clearly stated
- Confidence level calculated

## Error Handling
- **If input missing:** Use linear extrapolation of available data
- **If step fails:** Provide conservative estimate with caveats
