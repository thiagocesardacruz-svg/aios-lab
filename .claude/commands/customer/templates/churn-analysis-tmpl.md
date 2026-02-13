# Churn Analysis Report Template

## Identity
- **Template ID:** churn-analysis-tmpl
- **Squad:** customer
- **Version:** 1.0.0

---

# Churn Analysis Report

## Report Metadata
- **Analysis Period:** {start_date} to {end_date}
- **Report Date:** {date}
- **Analyst:** {agent}
- **Segment:** {all/specific_segment}

---

## Executive Summary

### Key Metrics

| Metric | Value | vs Previous | vs Target |
|--------|-------|-------------|-----------|
| **Total Churn Rate** | {X}% | {+/-}% | {above/below} |
| **Logo Churn** | {n} customers | {+/-}n | - |
| **Revenue Churn** | ${amount} | {+/-}% | - |
| **Net Revenue Retention** | {X}% | {+/-}% | {above/below} 100% |

### TL;DR
{2-3 sentence summary of key findings and recommended actions}

---

## Churn Overview

### Churn by Type

| Type | Count | Rate | Revenue Impact |
|------|-------|------|----------------|
| Voluntary - Competitor | {n} | {%} | ${amount} |
| Voluntary - No need | {n} | {%} | ${amount} |
| Voluntary - Price | {n} | {%} | ${amount} |
| Involuntary - Payment | {n} | {%} | ${amount} |
| Involuntary - Business closed | {n} | {%} | ${amount} |
| **Total** | **{n}** | **{%}** | **${amount}** |

### Churn Trend

```
Monthly Churn Rate (Last 12 Months)
10% ┤
 8% ┤     █
 6% ┤  █  █  █     █
 4% ┤  █  █  █  █  █  █
 2% ┤  █  █  █  █  █  █  █  █
 0% ┴──────────────────────────
    J  F  M  A  M  J  J  A  S
```

---

## Churn by Segment

### By Customer Tier

| Tier | Customers | Churned | Rate | Revenue Lost | Index |
|------|-----------|---------|------|--------------|-------|
| Enterprise | {n} | {n} | {%} | ${amount} | {vs avg} |
| Business | {n} | {n} | {%} | ${amount} | {vs avg} |
| Starter | {n} | {n} | {%} | ${amount} | {vs avg} |

### By Acquisition Source

| Source | Customers | Churned | Rate | Index |
|--------|-----------|---------|------|-------|
| Organic | {n} | {n} | {%} | {vs avg} |
| Paid | {n} | {n} | {%} | {vs avg} |
| Referral | {n} | {n} | {%} | {vs avg} |
| Partner | {n} | {n} | {%} | {vs avg} |

### By Customer Age

| Tenure | Customers | Churned | Rate | Index |
|--------|-----------|---------|------|-------|
| 0-3 months | {n} | {n} | {%} | {vs avg} |
| 3-6 months | {n} | {n} | {%} | {vs avg} |
| 6-12 months | {n} | {n} | {%} | {vs avg} |
| 12+ months | {n} | {n} | {%} | {vs avg} |

### By Industry/Vertical

| Industry | Customers | Churned | Rate | Index |
|----------|-----------|---------|------|-------|
| {industry_1} | {n} | {n} | {%} | {vs avg} |
| {industry_2} | {n} | {n} | {%} | {vs avg} |
| {industry_3} | {n} | {n} | {%} | {vs avg} |

---

## Churn Drivers Analysis

### Top Churn Drivers

| Rank | Driver | Impact | % of Churns | Actionable |
|------|--------|--------|-------------|------------|
| 1 | {driver_1} | High | {%} | Yes/No |
| 2 | {driver_2} | High | {%} | Yes/No |
| 3 | {driver_3} | Medium | {%} | Yes/No |
| 4 | {driver_4} | Medium | {%} | Yes/No |
| 5 | {driver_5} | Low | {%} | Yes/No |

### Driver Deep-Dive

#### Driver 1: {Driver Name}
- **Description:** {what_is_happening}
- **Affected Segment:** {who_is_affected}
- **Root Cause:** {why_it_happens}
- **Evidence:** {data_supporting}
- **Recommended Action:** {what_to_do}

#### Driver 2: {Driver Name}
- **Description:** {what_is_happening}
- **Affected Segment:** {who_is_affected}
- **Root Cause:** {why_it_happens}
- **Evidence:** {data_supporting}
- **Recommended Action:** {what_to_do}

---

## Leading Indicators

### Early Warning Signals

| Signal | Days Before Churn | Reliability | Sample Size |
|--------|-------------------|-------------|-------------|
| No login 14+ days | {n} days | {%} | {n} churns |
| Support ticket spike | {n} days | {%} | {n} churns |
| Feature usage drop >50% | {n} days | {%} | {n} churns |
| Key user left company | {n} days | {%} | {n} churns |
| NPS score drop | {n} days | {%} | {n} churns |
| Payment failure | {n} days | {%} | {n} churns |

### Signal Combinations
Customers showing **3+ signals** have **{X}%** probability of churn within 30 days.

---

## Cohort Analysis

### Retention by Signup Cohort

| Cohort | Size | M1 | M3 | M6 | M12 | LTV |
|--------|------|----|----|----|----|-----|
| {month_1} | {n} | {%} | {%} | {%} | {%} | ${} |
| {month_2} | {n} | {%} | {%} | {%} | {%} | ${} |
| {month_3} | {n} | {%} | {%} | {%} | {%} | ${} |
| {month_4} | {n} | {%} | {%} | {%} | {%} | ${} |
| {month_5} | {n} | {%} | {%} | {%} | {%} | ${} |
| {month_6} | {n} | {%} | {%} | {%} | - | - |

### Cohort Insights
- Best performing cohort: **{cohort}** (Reason: {reason})
- Worst performing cohort: **{cohort}** (Reason: {reason})
- Trend: {improving/declining/stable}

---

## At-Risk Customers

### Currently At-Risk (Score < 50)

| Customer | Tier | ARR | Score | Risk Signals | Recommended Action |
|----------|------|-----|-------|--------------|-------------------|
| {customer_1} | {tier} | ${} | {score} | {signals} | {action} |
| {customer_2} | {tier} | ${} | {score} | {signals} | {action} |
| {customer_3} | {tier} | ${} | {score} | {signals} | {action} |

**Total ARR at Risk:** ${amount}

---

## Competitive Losses

### Lost to Competitors

| Competitor | Count | % of Losses | Key Reasons |
|------------|-------|-------------|-------------|
| {competitor_1} | {n} | {%} | {reasons} |
| {competitor_2} | {n} | {%} | {reasons} |
| {competitor_3} | {n} | {%} | {reasons} |
| Unknown | {n} | {%} | - |

### Competitive Insights
- {insight_1}
- {insight_2}

---

## Win-Back Analysis

### Previous Win-Back Attempts

| Period | Attempted | Won Back | Rate | Revenue Recovered |
|--------|-----------|----------|------|-------------------|
| {period_1} | {n} | {n} | {%} | ${amount} |
| {period_2} | {n} | {n} | {%} | ${amount} |

### Win-Back Opportunities

| Customer | Churned Date | Original ARR | Win-Back Likelihood |
|----------|--------------|--------------|---------------------|
| {customer_1} | {date} | ${} | {high/medium/low} |
| {customer_2} | {date} | ${} | {high/medium/low} |

---

## Recommendations

### Immediate Actions (This Week)
1. **{Action 1}**
   - Owner: {owner}
   - Impact: {high/medium/low}
   - Effort: {high/medium/low}

2. **{Action 2}**
   - Owner: {owner}
   - Impact: {high/medium/low}
   - Effort: {high/medium/low}

### Short-term Initiatives (This Month)
1. {initiative_1}
2. {initiative_2}

### Strategic Recommendations (This Quarter)
1. {recommendation_1}
2. {recommendation_2}

---

## Appendix

### Methodology
- Churn definition: {definition}
- Data sources: {sources}
- Analysis tools: {tools}

### Data Quality Notes
- {note_1}
- {note_2}

---

**Report prepared by:** {agent}
**Distribution:** {stakeholders}
**Next analysis:** {date}
