# TravelTech AIOS - Roadmap & Implementation Guide

> **Target:** ITB Berlin - March 3-5, 2026
> **Start:** February 9, 2026
> **Days Available:** 22 days
> **North Star:** First personalized prompt in < 3 minutes on mobile

---

## Phase Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         22-DAY IMPLEMENTATION PLAN                          │
│                                                                             │
│  PHASE 1: Foundation (Days 1-5)                                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                            │
│  • Supabase setup + schema                                                  │
│  • Stripe products + webhook                                                │
│  • Basic auth flow                                                          │
│  • Content validation suite                                                 │
│                                                                             │
│  PHASE 2: Core App (Days 6-12)                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                            │
│  • DNA collection flow                                                      │
│  • Dashboard (my products)                                                  │
│  • Library views (experts, prompts, tools)                                  │
│  • DNA variable substitution                                                │
│  • Copy to clipboard                                                        │
│                                                                             │
│  PHASE 3: Content & Polish (Days 13-18)                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                            │
│  • Notion sync script                                                       │
│  • Import all content                                                       │
│  • Growth Trails                                                            │
│  • Mobile responsiveness                                                    │
│  • i18n (7 languages)                                                       │
│                                                                             │
│  PHASE 4: Launch Prep (Days 19-22)                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                            │
│  • QA & bug fixes                                                           │
│  • Performance optimization                                                 │
│  • Production deployment                                                    │
│  • ITB demo preparation                                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Daily Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  DAILY ROUTINE                                                              │
│                                                                             │
│  MORNING (Planning)                                                         │
│  ├── Check current story status                                             │
│  ├── Review blockers                                                        │
│  └── Prioritize tasks for the day                                           │
│                                                                             │
│  DURING DAY (Execution)                                                     │
│  ├── Work on current story                                                  │
│  ├── Update checkboxes as tasks complete                                    │
│  ├── Commit frequently (atomic commits)                                     │
│  └── Test as you go                                                         │
│                                                                             │
│  END OF DAY (Review)                                                        │
│  ├── Update story progress                                                  │
│  ├── Note any blockers                                                      │
│  └── Plan next day                                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Story Management

Stories are in `docs/stories/` with format: `{epic}.{story}-{title}.md`

Example: `1.1-supabase-setup.md`

### Story Status Flow

```
DRAFT → READY → IN_PROGRESS → REVIEW → DONE
```

### Story Template

Each story has:
- Objective
- Acceptance Criteria (checkboxes)
- Technical Notes
- Files Changed
- Definition of Done

---

## Commands Quick Reference

```bash
# Start working on a story
@dev *story 1.1

# Check project status
@aios-master *status

# Create next story
@aios-master *create-next-story

# Run tests
npm test

# Deploy preview
vercel

# Sync content from Notion
npm run sync-notion

# Validate content
npm run validate-content
```

---

## Risk Mitigation

| Risk | Mitigation | Owner |
|------|------------|-------|
| Timeline slip | Daily progress check, cut scope if needed | PM |
| Content not ready | Start Notion sync early (Day 6) | Thiago |
| Stripe issues | Test in sandbox first | Dev |
| Mobile bugs | Mobile-first development | Dev |
| i18n quality | Focus EN/PT/ES, others best-effort | Dev |

---

## Go/No-Go Checklist (Day 20)

- [ ] User can purchase product via Stripe
- [ ] User can login and see dashboard
- [ ] DNA collection works (4 fields)
- [ ] At least 1 product has full content
- [ ] {{variables}} substitute correctly
- [ ] Works on mobile
- [ ] EN language complete
- [ ] Copy to clipboard works

**If all checked → GO**
**If any unchecked → Evaluate scope cut**

---

## Contact & Support

- **Product Questions:** Thiago
- **Technical Questions:** @dev (Dex)
- **Architecture Questions:** @architect (Aria)
- **AIOS Framework:** @aios-master (Orion)
