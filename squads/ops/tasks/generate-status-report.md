# Generate Status Report

## Meta
- **ID:** generate-status-report
- **Squad:** ops
- **Executed by:** ops-manager
- **Idempotent:** yes
- **Estimated tokens:** medium (1-5k)

## Purpose
Generate daily or weekly status report summarizing OS activity, costs, and SLA compliance.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| report_type | text | yes | ops-lead |
| period_start | text | yes | ops-lead |
| period_end | text | yes | ops-lead |
| os_records | yaml | yes | ops-manager |
| cost_summary | yaml | yes | calculate-daily-cost |
| sla_status | yaml | yes | monitor-sla |

## Steps
1. Aggregate OS metrics (created, completed, blocked, in-progress)
2. Calculate completion rate and average resolution time
3. Compile cost breakdown by squad and category
4. Summarize SLA compliance
5. Identify blockers and escalations
6. Apply appropriate template (daily-report-tmpl or weekly-summary-tmpl)
7. Generate final report

## Output
| Field | Type | Destination |
|-------|------|-------------|
| status_report | md | ops-lead |
| report_metrics | yaml | weekly-review (if weekly) |

## Validation
- All metrics calculated correctly
- Report follows template structure
- No missing sections

## Error Handling
- **If input missing:** Generate partial report with available data
- **If step fails:** Notify ops-lead with raw metrics
