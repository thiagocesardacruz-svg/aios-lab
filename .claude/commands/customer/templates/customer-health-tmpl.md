# Customer Health Report Template

## Identity
- **Template ID:** customer-health-tmpl
- **Squad:** customer
- **Version:** 1.0.0

---

# Customer Health Report: {CUSTOMER_NAME}

## Report Metadata
- **Customer ID:** {customer_id}
- **Report Date:** {date}
- **Report Period:** {start_date} to {end_date}
- **CSM:** {csm_name}
- **Next Review:** {next_date}

---

## Health Score Summary

### Overall Health Score: {SCORE}/100

```
Health Score Trend (Last 90 Days)
100 ┤
 80 ┤     ████
 60 ┤ ████    ████
 40 ┤             ████
 20 ┤
  0 ┴─────────────────
    M1   M2   M3   Now
```

| Zone | Range | Current Status |
|------|-------|----------------|
| 🟢 Healthy | 80-100 | {[ ] / [x]} |
| 🟡 At Risk | 50-79 | {[ ] / [x]} |
| 🔴 Critical | 0-49 | {[ ] / [x]} |

### Score Trend
| Period | Score | Change |
|--------|-------|--------|
| 90 days ago | {score} | - |
| 60 days ago | {score} | {+/-} |
| 30 days ago | {score} | {+/-} |
| Current | {score} | {+/-} |

---

## Customer Profile

| Attribute | Value |
|-----------|-------|
| **Company** | {company_name} |
| **Tier** | {enterprise/business/starter} |
| **ARR** | ${amount} |
| **Contract Start** | {date} |
| **Contract End** | {date} |
| **Days to Renewal** | {n} days |
| **Seats/Users** | {n} / {n} purchased |
| **Primary Contact** | {name} |
| **Champion** | {name} |
| **Executive Sponsor** | {name} |

---

## Health Score Breakdown

### Usage Score: {score}/30 (Weight: 30%)

| Metric | Value | Score | Benchmark |
|--------|-------|-------|-----------|
| Login frequency | {value} | {n}/10 | Daily |
| Feature adoption | {value}% | {n}/10 | >80% |
| Active users ratio | {value}% | {n}/10 | >75% |

**Usage Trend:** {increasing/stable/declining}

**Key Observations:**
- {observation_1}
- {observation_2}

### Engagement Score: {score}/25 (Weight: 25%)

| Metric | Value | Score | Benchmark |
|--------|-------|-------|-----------|
| Avg session duration | {value} | {n}/10 | >10 min |
| Actions per session | {value} | {n}/10 | >15 |
| Return frequency | {value} | {n}/5 | Weekly |

**Engagement Trend:** {increasing/stable/declining}

**Key Observations:**
- {observation_1}
- {observation_2}

### Relationship Score: {score}/25 (Weight: 25%)

| Metric | Value | Score | Benchmark |
|--------|-------|-------|-----------|
| NPS score | {value} | {n}/10 | >50 |
| Support sentiment | {value} | {n}/10 | Positive |
| CSM engagement | {value} | {n}/5 | Regular |

**Relationship Trend:** {improving/stable/declining}

**Key Observations:**
- {observation_1}
- {observation_2}

### Business Score: {score}/20 (Weight: 20%)

| Metric | Value | Score | Benchmark |
|--------|-------|-------|-----------|
| Revenue trend | {value} | {n}/10 | Growing |
| Payment history | {value} | {n}/5 | On-time |
| Expansion signals | {value} | {n}/5 | Present |

**Business Trend:** {growing/stable/declining}

**Key Observations:**
- {observation_1}
- {observation_2}

---

## Risk Assessment

### Current Risk Level: {LOW/MEDIUM/HIGH/CRITICAL}

### Risk Signals Detected

| Signal | Severity | First Detected | Action Taken |
|--------|----------|----------------|--------------|
| {signal_1} | {severity} | {date} | {action} |
| {signal_2} | {severity} | {date} | {action} |
| {signal_3} | {severity} | {date} | {action} |

### Churn Probability
Based on current signals: **{X}%** likelihood of churn in next 90 days

---

## Expansion Opportunities

### Identified Opportunities

| Opportunity | Type | Potential Value | Readiness |
|-------------|------|-----------------|-----------|
| {opportunity_1} | {upsell/cross-sell} | ${amount} | {high/medium/low} |
| {opportunity_2} | {upsell/cross-sell} | ${amount} | {high/medium/low} |

### Expansion Signals
- [ ] Usage approaching limits
- [ ] New team members added
- [ ] Feature requests for higher tier
- [ ] Positive feedback/high NPS
- [ ] Business growth indicators

**Total Expansion Potential:** ${amount}

---

## Recent Activity

### Support Interactions (Last 30 Days)
| Date | Type | Issue | Status | Sentiment |
|------|------|-------|--------|-----------|
| {date} | {ticket/call} | {issue} | {status} | {pos/neg/neutral} |
| {date} | {ticket/call} | {issue} | {status} | {pos/neg/neutral} |

### Feature Usage (Last 30 Days)
| Feature | Usage | Trend | Notes |
|---------|-------|-------|-------|
| {feature_1} | {frequency} | {↑/↓/→} | {notes} |
| {feature_2} | {frequency} | {↑/↓/→} | {notes} |
| {feature_3} | {frequency} | {↑/↓/→} | {notes} |

### CSM Touchpoints
| Date | Type | Summary | Next Step |
|------|------|---------|-----------|
| {date} | {call/email/meeting} | {summary} | {next_step} |

---

## Action Plan

### Immediate Actions (This Week)
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| {action_1} | {owner} | {date} | {status} |
| {action_2} | {owner} | {date} | {status} |

### Short-term Actions (This Month)
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| {action_1} | {owner} | {date} | {status} |
| {action_2} | {owner} | {date} | {status} |

### Strategic Actions (This Quarter)
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| {action_1} | {owner} | {date} | {status} |

---

## Stakeholder Map

| Role | Name | Engagement | Sentiment | Notes |
|------|------|------------|-----------|-------|
| Champion | {name} | {high/med/low} | {pos/neg} | {notes} |
| Decision Maker | {name} | {high/med/low} | {pos/neg} | {notes} |
| End User | {name} | {high/med/low} | {pos/neg} | {notes} |
| Executive | {name} | {high/med/low} | {pos/neg} | {notes} |

---

## Historical Context

### Previous Health Reports
| Date | Score | Key Issues | Actions Taken |
|------|-------|------------|---------------|
| {date} | {score} | {issues} | {actions} |
| {date} | {score} | {issues} | {actions} |

### Major Events
- {date}: {event}
- {date}: {event}

---

## Renewal Forecast

| Factor | Assessment |
|--------|------------|
| **Renewal Likelihood** | {likely/possible/unlikely} |
| **Expansion Likelihood** | {likely/possible/unlikely} |
| **Risk of Downgrade** | {high/medium/low} |
| **Recommended Strategy** | {retain/expand/save} |

---

**Report generated by:** {agent}
**Next health review:** {date}
