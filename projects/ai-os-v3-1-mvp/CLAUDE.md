# AI OS V3.1 MVP - Claude Code Configuration

You are acting as a Senior Full-Stack Engineer and Product Architect.

Your task is to IMPLEMENT (not redesign, not suggest) the AI OS V3.1 MVP exactly as specified.

## NON-NEGOTIABLE RULES

- Follow the provided PRD V3.1 and technical checklist strictly.
- Do NOT add features.
- Do NOT change architecture.
- Do NOT introduce abstractions not explicitly required.
- If something is unclear, choose the simplest implementation that matches the PRD intent.
- This is a SINGLE-SEGMENT, SINGLE-PRODUCT MVP.
- Multi-segment is handled via product duplication, not user switching.

## PRODUCT PHILOSOPHY

- This is NOT a content generator.
- This is NOT a chatbot.
- This is an EXECUTION ORCHESTRATOR.
- The system generates CONTEXTUALIZED PROMPTS, not final outputs.
- The user executes externally (ChatGPT, GPT Experts, tools).

## ARCHITECTURE PRINCIPLES

- 80% hardcoded templates (plan_templates, task_templates)
- 20% personalization via Business DNA
- Lazy rendering (render prompt only when task is opened)
- Zero unnecessary AI calls
- Mobile-first UX
- One task at a time (Execution Tunnel)

## CORE FEATURES TO IMPLEMENT

1. Authentication (Supabase)
2. Onboarding (multi-step, Sintra style)
3. Business DNA storage (JSONB)
4. Segment lock (cannot be changed)
5. Context Factory ({{variables}} replacement server-side)
6. Execution Tunnel (Task Player)
7. Trust-based completion model
8. Stripe annual subscription
9. Basic credit system
10. Seed-based content (no admin UI)

## OUT OF SCOPE (DO NOT IMPLEMENT)

- Chat UI
- Prompt editors
- Mini apps
- CMS or Admin panel
- Direct API integrations (Instagram, Google, etc.)
- Monthly plans
- Free trials
- Gamification

## DELIVERABLE EXPECTATIONS

- Clean, readable, production-grade code
- Server Actions where applicable
- shadcn/ui components only
- No over-engineering
- Every screen usable on mobile
- Seed script included and documented

## DEFINITION OF DONE

A new user can sign up, complete onboarding, start a plan, execute a task, copy a prompt, open an external tool, mark the task as done, and progress — without assistance.

## PROJECT STRUCTURE

```
/ai-os-v3-1-mvp
├── app/                    # Next.js 14 App Router
│   └── src/
│       ├── app/           # Routes
│       ├── components/    # React components
│       ├── lib/           # Utilities
│       └── actions/       # Server Actions
├── supabase/
│   ├── migrations/        # SQL migrations
│   └── seed.sql          # Seed data
└── CLAUDE.md             # This file
```

## DATABASE SCHEMA

Tables (all with RLS enabled):
- `tenants` - Multi-tenancy support
- `products` - SKU per segment
- `segments` - Content domains
- `user_profiles` - User DNA (JSONB)
- `plan_templates` - Growth plans
- `task_templates` - Tasks with prompt templates
- `user_plans` - Active user plans
- `user_tasks_log` - Task completion tracking
- `subscriptions` - Stripe sync
- `credit_ledger` - Credit transactions
- `favorites` - Resolve Now shortcuts
- `analytics_events` - Event logging

## BUSINESS DNA FIELDS

```typescript
interface BusinessDNA {
  business_name: string;
  user_role: 'owner' | 'manager' | 'freelancer' | 'consultant' | 'employee';
  target_audience: string;
  value_proposition: string;
  tone_of_voice: 'casual_friendly' | 'professional' | 'premium_luxury' | 'direct_sales';
  primary_goal: 'get_clients' | 'increase_conversions' | 'save_time' | 'improve_operations' | 'build_presence';
  ai_maturity_level: 'never_used' | 'beginner' | 'intermediate' | 'advanced';
}
```

## COMMANDS

```bash
# Start Supabase locally
npx supabase start

# Run migrations
npx supabase db reset

# Start Next.js dev server
cd app && npm run dev
```

## SEGMENT: HOTELS (MVP)

Single segment for MVP validation:
- Product: AI OS for Hotels
- Price: €79/year
- Credits: 100
- Plans: 2 (Marketing Kickstart, Direct Booking Booster)
- Tasks: 7-10 per plan
