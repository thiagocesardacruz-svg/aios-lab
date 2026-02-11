# Onboarding Sequence Template

## Identity
- **Template ID:** onboarding-sequence-tmpl
- **Squad:** customer
- **Version:** 1.0.0

---

# Onboarding Sequence: {PRODUCT_NAME}

## Metadata
- **Product:** {product}
- **Segment:** {segment}
- **Created:** {date}
- **Owner:** {agent}
- **Version:** {version}

## Executive Summary

| Metric | Current | Target |
|--------|---------|--------|
| **Time to First Value** | {current} | {target} |
| **Activation Rate** | {current}% | {target}% |
| **Day 7 Retention** | {current}% | {target}% |
| **Completion Rate** | {current}% | {target}% |

---

## Aha Moment Definition

### The Moment
> "{Description of what makes users 'get it'}"

### Trigger Action
The user experiences the aha moment when they: **{specific_action}**

### Time Target
Users should reach this moment within **{X minutes/hours}** of signup.

### Success Indicator
We know they've experienced it when: **{measurable_indicator}**

---

## Customer Journey Map

### Phase 1: Welcome (Day 0)

| Step | User Action | System Response | Success Criteria |
|------|-------------|-----------------|------------------|
| 1.1 | Signs up | Welcome email sent | Email delivered |
| 1.2 | First login | Onboarding wizard starts | Wizard displayed |
| 1.3 | {action} | {response} | {criteria} |

### Phase 2: Setup (Day 0-1)

| Step | User Action | System Response | Success Criteria |
|------|-------------|-----------------|------------------|
| 2.1 | {action} | {response} | {criteria} |
| 2.2 | {action} | {response} | {criteria} |

### Phase 3: First Value (Day 1-3)

| Step | User Action | System Response | Success Criteria |
|------|-------------|-----------------|------------------|
| 3.1 | {action} | {response} | {criteria} |
| 3.2 | Achieves aha moment | Celebration + next step | Value experienced |

### Phase 4: Habit Formation (Day 3-14)

| Step | User Action | System Response | Success Criteria |
|------|-------------|-----------------|------------------|
| 4.1 | {action} | {response} | {criteria} |
| 4.2 | Returns regularly | Engagement tracking | Retention measured |

---

## Milestones & Progress

### Milestone 1: Account Setup
- **Trigger:** Signup complete
- **Criteria:** Profile filled, settings configured
- **Celebration:** Welcome badge, progress update
- **Time target:** < 5 minutes

### Milestone 2: First Value
- **Trigger:** Core action completed
- **Criteria:** {specific_criteria}
- **Celebration:** Success message, share prompt
- **Time target:** < {X} minutes

### Milestone 3: Activated
- **Trigger:** Aha moment reached
- **Criteria:** {activation_definition}
- **Celebration:** Achievement unlocked, tips for next level
- **Time target:** < {X} hours

### Milestone 4: Engaged
- **Trigger:** Return visit with action
- **Criteria:** 2+ sessions with value actions
- **Celebration:** Power user tips
- **Time target:** Within 7 days

---

## Email Sequence

### Email 1: Welcome (Day 0, Immediate)
- **Subject:** {subject_line}
- **Goal:** Get first login
- **CTA:** {call_to_action}
- **Template:**
```
{email_body}
```

### Email 2: Quick Win (Day 1)
- **Subject:** {subject_line}
- **Goal:** Complete first action
- **CTA:** {call_to_action}
- **Send condition:** Has logged in but not completed {action}

### Email 3: Value Reminder (Day 3)
- **Subject:** {subject_line}
- **Goal:** Return for second session
- **CTA:** {call_to_action}
- **Send condition:** Completed first action, hasn't returned

### Email 4: Tips & Tricks (Day 7)
- **Subject:** {subject_line}
- **Goal:** Deepen engagement
- **CTA:** {call_to_action}
- **Send condition:** Active user

### Email 5: Check-in (Day 14)
- **Subject:** {subject_line}
- **Goal:** Feedback and expansion
- **CTA:** {call_to_action}
- **Send condition:** All users

---

## In-App Guidance

### Welcome Modal
- **Trigger:** First login
- **Content:** Brief intro, 3 key benefits, start button
- **Dismiss:** User clicks "Get Started"

### Tooltip Tour
- **Trigger:** After welcome modal
- **Steps:**
  1. {element} - "{tooltip_text}"
  2. {element} - "{tooltip_text}"
  3. {element} - "{tooltip_text}"

### Progress Checklist
- **Location:** Sidebar/Dashboard
- **Items:**
  - [ ] Complete profile
  - [ ] {action_1}
  - [ ] {action_2}
  - [ ] Invite team member

### Contextual Help
- **Trigger:** User hovers/struggles
- **Content:** Relevant tip or video link

---

## Automation Rules

### Trigger: Signup
```yaml
event: user.signup
actions:
  - send_email: welcome
  - start_sequence: onboarding
  - create_task: csm_review (if enterprise)
```

### Trigger: First Login
```yaml
event: user.first_login
actions:
  - show_modal: welcome
  - start_tour: getting_started
  - track_event: onboarding_started
```

### Trigger: Milestone Complete
```yaml
event: milestone.complete
actions:
  - show_celebration: "{milestone}"
  - update_progress: true
  - track_event: milestone_reached
```

### Trigger: Inactivity (3 days)
```yaml
event: user.inactive_3d
conditions:
  - not_activated: true
actions:
  - send_email: re_engagement
  - notify_csm: if_enterprise
```

---

## Content Assets Needed

| Asset | Type | Owner | Status |
|-------|------|-------|--------|
| Welcome video | Video (60s) | {owner} | {status} |
| Getting started guide | Help doc | {owner} | {status} |
| Quick start checklist | PDF | {owner} | {status} |
| Feature tour | In-app | {owner} | {status} |
| FAQ page | Help doc | {owner} | {status} |

---

## Segment Variations

### Enterprise Customers
- Add: CSM intro call (Day 1)
- Add: Custom onboarding session
- Modify: Higher-touch email sequence
- Add: Implementation plan

### SMB Customers
- Standard self-serve flow
- Optional webinar invite
- Chatbot assistance

### Free Trial
- Add: Trial expiration reminders
- Add: Conversion-focused emails
- Modify: Urgency messaging

---

## Success Metrics & Tracking

### Funnel Metrics
| Stage | Metric | Target | Current |
|-------|--------|--------|---------|
| Signup → Login | Login rate | 80% | {current}% |
| Login → Setup | Setup completion | 70% | {current}% |
| Setup → First Value | Value rate | 60% | {current}% |
| First Value → Activated | Activation rate | 50% | {current}% |

### Tracking Events
- `onboarding_started`
- `milestone_1_complete`
- `milestone_2_complete`
- `activated`
- `onboarding_complete`

---

## Review & Optimization

### Weekly Review
- [ ] Check funnel drop-offs
- [ ] Review email performance
- [ ] Analyze support tickets from new users

### Monthly Optimization
- [ ] A/B test email subject lines
- [ ] Optimize slowest funnel step
- [ ] Update based on user feedback

---

**Created by:** {agent}
**Last updated:** {date}
**Next review:** {date}
