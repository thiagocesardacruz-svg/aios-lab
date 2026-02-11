# Audit Performance

## Meta
- **ID:** audit-performance
- **Squad:** qa
- **Executed by:** process-auditor
- **Idempotent:** yes
- **Estimated tokens:** medium (1-5k)

## Purpose
Audit web page or API performance against defined thresholds.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| target_url | text | yes | tech agent |
| performance_checklist | md | yes | checklists/performance-audit.md |
| thresholds | yaml | no | tech/data/performance-thresholds.yaml |

## Steps
1. Run Lighthouse or equivalent performance scan
2. Measure Core Web Vitals (LCP, FID, CLS)
3. Analyze bundle sizes
4. Check API response times
5. Identify performance bottlenecks
6. Compare against thresholds

## Output
| Field | Type | Destination |
|-------|------|-------------|
| performance_report | md | tech-lead |
| metrics | yaml | ops-manager |

## Validation
- All Core Web Vitals measured
- Metrics compared to thresholds
- Bottlenecks identified

## Error Handling
- **If input missing:** Use default thresholds
- **If step fails:** Report partial metrics
