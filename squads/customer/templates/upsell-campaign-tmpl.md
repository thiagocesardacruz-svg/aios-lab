# Upsell Campaign Template

## Identity
- **Template ID:** upsell-campaign-tmpl
- **Squad:** customer
- **Version:** 1.0.0

---

# Upsell Campaign: {CAMPAIGN_NAME}

## Campaign Metadata
- **Campaign ID:** USC-{YYYY}-{NNN}
- **Type:** {upsell/cross-sell/expansion}
- **Created:** {date}
- **Owner:** {agent}
- **Status:** {draft/active/paused/completed}

---

## Campaign Overview

### Objective
{One sentence describing what this campaign aims to achieve}

### Target Metric
| Metric | Current | Target | Lift |
|--------|---------|--------|------|
| {primary_metric} | {current} | {target} | {%} |

### Campaign Timeline
| Phase | Start | End |
|-------|-------|-----|
| Design | {date} | {date} |
| Soft Launch | {date} | {date} |
| Full Rollout | {date} | {date} |
| Analysis | {date} | {date} |

---

## Target Audience

### Segment Definition
**Target:** {description of target customers}

### Qualification Criteria

| Criteria | Requirement | Why |
|----------|-------------|-----|
| Health Score | > {score} | Healthy customers more receptive |
| Tenure | > {months} months | Established relationship |
| Usage | {criteria} | Shows need for upgrade |
| {criteria} | {requirement} | {reason} |

### Exclusion Criteria
- [ ] Customers in active support escalation
- [ ] Customers with pending renewal < 30 days
- [ ] Customers who declined in last 90 days
- [ ] {other_exclusion}

### Audience Size
| Segment | Total | Qualified | Excluded | Final |
|---------|-------|-----------|----------|-------|
| {segment} | {n} | {n} | {n} | {n} |

---

## Offer Strategy

### The Offer

| Element | Details |
|---------|---------|
| **Product/Feature** | {what_you're_selling} |
| **Value Proposition** | {why_they_need_it} |
| **List Price** | ${amount} |
| **Offer Price** | ${amount} |
| **Discount** | {%} |
| **Urgency** | {limited_time/limited_seats/etc} |
| **Guarantee** | {risk_reversal} |

### Offer Positioning

**Headline:** {compelling_headline}

**Key Benefits:**
1. {benefit_1}
2. {benefit_2}
3. {benefit_3}

**Social Proof:** {testimonial/case_study/stat}

---

## Campaign Triggers

### Behavioral Triggers

| Trigger | Condition | Action | Timing |
|---------|-----------|--------|--------|
| Usage limit | >80% of limit | Email + In-app | Immediate |
| Feature request | Requested {feature} | Personalized email | Next day |
| High engagement | >X sessions/week | In-app upgrade prompt | Real-time |
| {trigger} | {condition} | {action} | {timing} |

### Time-Based Triggers

| Trigger | Condition | Action |
|---------|-----------|--------|
| Contract anniversary | 30 days before | Renewal + upgrade offer |
| After activation | 30 days post | Expansion email |
| {trigger} | {condition} | {action} |

---

## Campaign Sequence

### Channel Mix

| Channel | Role | % of Touches |
|---------|------|--------------|
| Email | Primary outreach | {%} |
| In-App | Contextual prompts | {%} |
| CSM | High-touch accounts | {%} |
| {channel} | {role} | {%} |

### Sequence Timeline

#### Day 0: Initial Outreach
- **Channel:** Email
- **Subject:** {subject_line}
- **Goal:** Introduce offer, create awareness
- **CTA:** {call_to_action}

```
Email Content:
{email_body}
```

#### Day 3: Follow-up (Non-responders)
- **Channel:** Email
- **Subject:** {subject_line}
- **Goal:** Reinforce value, create urgency
- **CTA:** {call_to_action}

#### Day 5: In-App Message
- **Channel:** In-App
- **Trigger:** User logs in
- **Message:** {message}
- **CTA:** {call_to_action}

#### Day 7: CSM Outreach (Enterprise)
- **Channel:** Call/Email
- **Script:** {talking_points}
- **Goal:** Personal consultation

#### Day 10: Final Reminder
- **Channel:** Email
- **Subject:** {subject_line}
- **Goal:** Last chance, urgency
- **CTA:** {call_to_action}

---

## Sales Enablement

### Talk Track

**Opening:**
> "{opening_script}"

**Discovery Questions:**
1. {question_1}
2. {question_2}
3. {question_3}

**Value Pitch:**
> "{value_pitch}"

**Close:**
> "{closing_script}"

### Objection Handling

| Objection | Response |
|-----------|----------|
| "Too expensive" | {response} |
| "Not right now" | {response} |
| "Need to think about it" | {response} |
| "Need approval" | {response} |
| "{objection}" | {response} |

### Case Studies
1. **{Company A}:** {result achieved}
2. **{Company B}:** {result achieved}

---

## Tracking & Analytics

### Success Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Reach rate | {%} | {%} | {on/off track} |
| Open rate | {%} | {%} | {on/off track} |
| Click rate | {%} | {%} | {on/off track} |
| Conversion rate | {%} | {%} | {on/off track} |
| Revenue generated | ${amount} | ${amount} | {on/off track} |
| ROI | {X}x | {X}x | {on/off track} |

### Tracking Events
- `upsell_email_sent`
- `upsell_email_opened`
- `upsell_cta_clicked`
- `upsell_page_viewed`
- `upsell_started`
- `upsell_completed`

### A/B Tests Running

| Test | Variant A | Variant B | Metric | Status |
|------|-----------|-----------|--------|--------|
| Subject line | {variant_a} | {variant_b} | Open rate | {status} |
| CTA | {variant_a} | {variant_b} | Click rate | {status} |

---

## Budget & Resources

### Campaign Budget

| Item | Cost |
|------|------|
| {item_1} | ${amount} |
| {item_2} | ${amount} |
| **Total** | **${amount}** |

### Team Allocation

| Role | Person | Hours/Week |
|------|--------|------------|
| Campaign Owner | {name} | {hours} |
| CSM Team | {name} | {hours} |
| {role} | {name} | {hours} |

---

## Rollout Checklist

### Pre-Launch
- [ ] Audience list finalized
- [ ] Email templates approved
- [ ] In-app messages configured
- [ ] Tracking implemented
- [ ] Sales team briefed
- [ ] Support team briefed

### Launch
- [ ] Soft launch to 10% of audience
- [ ] Monitor initial results (24 hours)
- [ ] Full rollout decision

### Post-Launch
- [ ] Daily metric review
- [ ] Weekly optimization
- [ ] Final analysis and learnings

---

## Results & Learnings

### Final Results
*To be completed after campaign*

| Metric | Target | Actual | vs Target |
|--------|--------|--------|-----------|
| {metric} | {target} | {actual} | {%} |

### What Worked
- {learning_1}
- {learning_2}

### What Didn't Work
- {learning_1}
- {learning_2}

### Recommendations for Next Campaign
- {recommendation_1}
- {recommendation_2}

---

**Campaign created by:** {agent}
**Approved by:** {approver}
**Last updated:** {date}
