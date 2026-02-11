# Performance Audit Checklist

## Meta
- **ID:** performance-audit
- **Squad:** qa
- **Used by:** process-auditor, audit-performance task
- **Trigger:** Before release of performance-critical features
- **Type:** quality-gate

## Items

### Page Load

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 1 | First Contentful Paint | FCP < 1.8s | 🔴 |
| 2 | Largest Contentful Paint | LCP < 2.5s | 🔴 |
| 3 | Time to Interactive | TTI < 3.8s | 🟡 |

### Core Web Vitals

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 4 | Cumulative Layout Shift | CLS < 0.1 | 🔴 |
| 5 | First Input Delay | FID < 100ms | 🔴 |
| 6 | Interaction to Next Paint | INP < 200ms | 🟡 |

### Resources

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 7 | Bundle size acceptable | JS bundle < 300KB gzipped | 🟡 |
| 8 | Images optimized | All images compressed and sized correctly | 🟡 |
| 9 | No render-blocking resources | Critical CSS inlined or preloaded | 🟡 |

### API Performance

| # | Check | Pass Criteria | Severity |
|---|-------|--------------|----------|
| 10 | API response time | P95 response < 500ms | 🔴 |
| 11 | No N+1 queries | Database queries optimized | 🟡 |
| 12 | Caching configured | Appropriate cache headers set | 🟡 |

## Gate Rule
- **Pass:** All 🔴 items pass + max 4 🟡 warnings
- **Fail:** Any 🔴 item fails
- **Action on fail:** Return to tech squad with specific metrics to improve
