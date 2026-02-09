# TravelTech AIOS - Claude Code Instructions

## Project Overview

TravelTech AIOS is a **curation and facilitation platform** for tourism businesses to use AI effectively.

- **Target:** ITB Berlin - March 3-5, 2026
- **Domain:** app.traveltech.digital
- **North Star:** First personalized prompt in < 3 minutes on mobile

## Quick Start

```bash
# Navigate to project
cd projects/traveltech-aios

# Check current status
cat docs/stories/INDEX.md

# Start working on a story
# Read the story file first, then implement
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 + TypeScript |
| Styling | Tailwind CSS |
| Backend | Supabase (Auth, Database, Storage) |
| Payments | Stripe |
| Hosting | Vercel |
| Content | JSON exported from Notion |

## Key Concepts

### 1. Segment = Product
Each segment (hotel, agency, dmc, dmo) is a **separate product**, not a user preference.

### 2. Modular Products
- **Bundles** (AIOS): Full access to all content for a segment
- **Standalones**: Individual modules (experts, prompts, tools)

### 3. Business DNA
User context that personalizes all prompts:
- `{{business_name}}` - Hotel & Spa Belvedere
- `{{location}}` - Lisbon, Portugal
- `{{target_audience}}` - Business travelers
- `{{tone}}` - Professional yet warm
- `{{primary_goal}}` - Increase direct bookings

### 4. Access Control
Single `hasAccess()` function controls all content gating.

## File Structure

```
projects/traveltech-aios/
├── docs/
│   ├── prd.md              # Product Requirements (v3.1)
│   ├── ROADMAP.md          # Implementation guide
│   └── stories/            # User stories
│       ├── INDEX.md        # Story tracker
│       ├── 1.1-*.md        # Phase 1 stories
│       └── 2.1-*.md        # Phase 2 stories
├── supabase/
│   └── migrations/         # Database schema
├── scripts/                # Utility scripts
├── content/                # Exported content (JSON)
└── src/                    # Application code (to be created)
```

## Working with Stories

### Start a Story
1. Read the story file completely
2. Check dependencies are done
3. Update story status to 🔄 IN_PROGRESS
4. Implement following acceptance criteria
5. Check all boxes as you complete them
6. Update status to ✅ DONE

### Story Format
Each story has:
- Objective
- Acceptance Criteria (checkboxes)
- Technical Notes (code snippets)
- Files Changed
- Definition of Done

## Commands Reference

```bash
# Database
supabase db push          # Apply migrations
supabase db reset         # Reset and reseed

# Development
npm run dev               # Start dev server
npm run build             # Build for production
npm run lint              # Check code style

# Content
npm run sync-notion       # Sync from Notion
npm run validate-content  # Validate content

# Stripe
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Important Rules

1. **Mobile First** - Always design for mobile, adapt for desktop
2. **DNA Always** - Every prompt must use DNA substitution
3. **Gating Centralized** - Use `hasAccess()` for all access checks
4. **English Variables** - `{{business_name}}` never translated
5. **Atomic Commits** - Small, focused commits with story reference

## Current Phase

**Phase 1: Foundation** (Days 1-5)
- Setting up Supabase, Stripe, Auth
- See `docs/stories/INDEX.md` for details

## Key Files to Know

| File | Purpose |
|------|---------|
| `docs/prd.md` | Full product requirements |
| `docs/stories/INDEX.md` | Story tracker |
| `supabase/migrations/001_*.sql` | Database schema |
| `supabase/migrations/002_*.sql` | Product catalog |

## Common Patterns

### Check User Access
```typescript
const canAccess = await hasAccess(userId, 'experts', 'hotel');
```

### Substitute DNA
```typescript
const personalized = substituteDNA(template, userDNA);
```

### Protected Route
```typescript
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

## Need Help?

- PRD questions → Read `docs/prd.md`
- Implementation → Read story file + technical notes
- Architecture → Check `docs/architecture/` (to be created)
- AIOS Framework → Use `@aios-master *help`
