# TravelTech AIOS - Story Index

> **Last Updated:** 2026-02-09
> **Target:** ITB Berlin - March 3-5, 2026

---

## Story Status Legend

| Status | Description |
|--------|-------------|
| ⬜ DRAFT | Story needs refinement |
| 📋 READY | Ready to start |
| 🔄 IN_PROGRESS | Currently being worked on |
| 👀 REVIEW | Needs review/testing |
| ✅ DONE | Completed |

---

## Phase 1: Foundation (Days 1-5)

| ID | Story | Status | Estimate | Dependencies |
|----|-------|--------|----------|--------------|
| 1.1 | [Supabase Setup](./1.1-supabase-setup.md) | 📋 READY | 2-3h | - |
| 1.2 | [Stripe Setup](./1.2-stripe-setup.md) | 📋 READY | 4-5h | 1.1 |
| 1.3 | [Auth Flow](./1.3-auth-flow.md) | 📋 READY | 3-4h | 1.1 |
| 1.4 | Content Validation Suite | ⬜ DRAFT | 3h | - |
| 1.5 | Project Scaffolding (Next.js + Tailwind) | ⬜ DRAFT | 2h | - |

**Phase 1 Total:** ~15-17 hours

---

## Phase 2: Core App (Days 6-12)

| ID | Story | Status | Estimate | Dependencies |
|----|-------|--------|----------|--------------|
| 2.1 | [DNA Collection Flow](./2.1-dna-collection.md) | 📋 READY | 4-5h | 1.3 |
| 2.2 | [Dashboard (My Products)](./2.2-dashboard.md) | 📋 READY | 4-5h | 1.2, 1.3, 2.1 |
| 2.3 | Library Page + Filters | ⬜ DRAFT | 5h | 2.2 |
| 2.4 | Expert Cards + Detail Pages | ⬜ DRAFT | 5h | 2.3 |
| 2.5 | Prompt Cards + Detail Pages | ⬜ DRAFT | 4h | 2.3 |
| 2.6 | Tools Cards + Pages | ⬜ DRAFT | 3h | 2.3 |
| 2.7 | DNA Variable Substitution | ⬜ DRAFT | 2h | 2.1, 2.5 |
| 2.8 | Copy to Clipboard | ⬜ DRAFT | 1h | 2.5 |
| 2.9 | Favorites System | ⬜ DRAFT | 2h | 2.4, 2.5, 2.6 |

**Phase 2 Total:** ~30-32 hours

---

## Phase 3: Content & Polish (Days 13-18)

| ID | Story | Status | Estimate | Dependencies |
|----|-------|--------|----------|--------------|
| 3.1 | Notion Sync Script | ⬜ DRAFT | 5h | - |
| 3.2 | Content Import (4 products) | ⬜ DRAFT | 4h | 3.1 |
| 3.3 | Growth Trails UI | ⬜ DRAFT | 4h | 2.2 |
| 3.4 | Trail Progress Tracking | ⬜ DRAFT | 3h | 3.3 |
| 3.5 | Resources Section (AI Tutor, Guides) | ⬜ DRAFT | 2h | 2.3 |
| 3.6 | i18n Setup (7 languages) | ⬜ DRAFT | 5h | - |
| 3.7 | Mobile Responsiveness | ⬜ DRAFT | 4h | All UI stories |
| 3.8 | Dark/Light Mode | ⬜ DRAFT | 3h | All UI stories |

**Phase 3 Total:** ~30 hours

---

## Phase 4: Launch Prep (Days 19-22)

| ID | Story | Status | Estimate | Dependencies |
|----|-------|--------|----------|--------------|
| 4.1 | QA & Bug Fixes | ⬜ DRAFT | 8h | All |
| 4.2 | Performance Optimization | ⬜ DRAFT | 4h | All |
| 4.3 | Production Deployment | ⬜ DRAFT | 3h | All |
| 4.4 | ITB Demo Preparation | ⬜ DRAFT | 4h | All |
| 4.5 | Chatbase Integration | ⬜ DRAFT | 2h | 4.3 |

**Phase 4 Total:** ~21 hours

---

## Total Estimates

| Phase | Hours | Days (8h/day) |
|-------|-------|---------------|
| Phase 1 | 17h | 2 days |
| Phase 2 | 32h | 4 days |
| Phase 3 | 30h | 4 days |
| Phase 4 | 21h | 3 days |
| **Buffer** | 24h | 3 days |
| **Total** | **124h** | **16 days** |

**Available:** 22 days
**Buffer:** 6 days

---

## Quick Commands

```bash
# Start a story
@dev *story {story-id}

# Check progress
cat docs/stories/INDEX.md

# Update status
# Edit this file, change status emoji

# Create new story
@aios-master *create-next-story
```

---

## Next Steps

1. Start with **Story 1.1** (Supabase Setup)
2. Work through Phase 1 stories in order
3. Update this index as stories complete
4. Review progress daily

---

## Notes

- Stories are designed to be completed in 2-5 hours each
- Dependencies must be completed before starting dependent stories
- Buffer time accounts for unexpected issues and refinements
