# HANDOFF: TravelTech AIOS Platform

> Session: 2026-02-06
> From: Claude Code (workspace context)
> To: Claude Code (aios-lab context with squad agents)

## 0. Source Reference

**Original Prototype:** Built in Google AI Studio
**Export Location:** `aios-lab/projects/traveltech-aios/`
**Original File:** `travel-tech-digital-ai-os.zip` (extracted and moved from inbox)

---

## 1. Executive Summary

TravelTech Digital is building **AIOS — AI Operational System for Tourism**, a platform that serves as a curator and facilitator for tourism businesses to use AI effectively.

**Master phrase:** "AI doesn't scale tourism. Systems do. AIOS is the system."

**Target market:** SMBs and destinations in tourism (90% of global market)

**Business model:** Stack offers from low-ticket (scale) to high-ticket (margins)

---

## 2. What Was Done Today

### Organization
- Consolidated all projects under `C:\Users\thiag\workspace\`
- Migrated TravelTech Digital from OneDrive
- Renamed all files/folders to kebab-case
- Created inbox workflow for document processing
- Created deep-research squad framework

### Positioning
- Evolved from "AI Tourism Infrastructure™" to "AIOS — AI Operational System"
- Defined 5-level hierarchy: AIOS → Modules → Agents → Tools → Products
- Created comprehensive README in English

### Code
- Moved Google AI Studio prototype to `aios-lab/projects/traveltech-aios/`

---

## 3. Current Structure

```
workspace/
├── aios-core/                 # Synkra framework
├── aios-lab/                  # Development workspace
│   ├── squads/
│   │   ├── squad-creator/
│   │   ├── design/
│   │   └── deep-research/
│   └── projects/
│       └── traveltech-aios/   # THIS PROJECT (platform code)
├── thiago-os/                 # 45 operational docs
├── projects/
│   └── traveltech-digital/    # Business docs
│       ├── about/             # README, segments, infrastructure
│       ├── marketing/
│       ├── products/          # GPT Tools, Experts, Prompt Packs
│       └── development/       # PRD
└── inbox/                     # Document intake (empty)
```

---

## 4. AIOS Positioning

### The System (5 Levels)

```
LEVEL 1 — AIOS (Operating System)
    Rules, Structure, Flows, Standards, Governance

LEVEL 2 — MODULES (8 Operational Areas)
    Demand & Acquisition | Sales Conversion | Revenue Optimization
    Operations | Customer Experience | Data & Intelligence
    Brand Authority | Learning & Enablement

LEVEL 3 — AI AGENTS (GPT Experts)
    Sales Agent | Revenue Agent | Marketing Agent
    Ops Agent | Strategy Agent | Experience Agent

LEVEL 4 — TOOLS & AUTOMATIONS
    GPT Tools | Prompt Packs | Dashboards | Workflows | Integrations

LEVEL 5 — PRODUCTS & LICENSES
    Segment Kits | Bundles | White-Label | Memberships | Enterprise
```

### Segments (8 Verticals)

| Segment | System | Promise | Market Size |
|---------|--------|---------|-------------|
| Hotels | HotelDirectAI | +50% direct bookings in 90 days | Large |
| Resorts | ResortAI | +15% occupancy, +20% ancillary | Medium |
| Travel Agencies | TravelSalesAI | 300-500 qualified leads/month | Large |
| Operators/DMCs | TourFlowAI | Proposals in 10min (not 2h) | Medium |
| Attractions | GuestFlowAI | +25% direct sales | Medium |
| Destinations/DMOs | DestinationAI | Dashboards + proven ROI | Small (high ticket) |
| **Tour Guides** | GuideAI | More bookings, less admin | **Massive (individuals)** |
| **Holiday Rentals** | RentalAI | +occupancy, -OTA dependency | **Massive (Airbnb/VRBO)** |

> **Note:** Tour Guides and Holiday Rentals represent 90%+ of tourism operators globally. High volume, lower ticket, massive scale potential.

---

## 5. Platform Vision

### What It Is
A **curator and facilitator** that helps tourism businesses use AI effectively:
- Stores business DNA (context)
- Provides pre-built prompts adapted with DNA
- Links to external GPTs (ChatGPT, etc.)
- Guided experience without complexity

### What It's NOT
- Not building AI internally
- Not a complex SaaS
- Not trying to replace ChatGPT

### Prototype Features (Already Built)
- Dashboard with tasks
- DNA personalization (companyName, industry, targetAudience, toneOfVoice)
- GPT Experts catalog
- GPT Tools catalog
- Prompt Library with `{{variable}}` substitution
- Message Scripts
- Docs & Policies generator
- Platforms Hub (Instagram, Google Business, Booking.com tools)

---

## 6. Offer Stack

```
                    ┌─────────────────────┐
                    │   ENTERPRISE        │  $10k-25k
                    │   Apps, Automations │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   ACCELERATION      │  $1k-5k
                    │   Bundles, Mentoria │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   AIOS PLATFORM     │  $99-499/year
                    │   Guided access     │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
   ┌──────▼──────┐      ┌──────▼──────┐      ┌──────▼──────┐
   │  Prompts    │      │ GPT Tools   │      │ Canva Packs │  $19-97
   │  Packs      │      │             │      │             │
   └─────────────┘      └─────────────┘      └─────────────┘
```

---

## 7. Technical Context

### Prototype Stack
- React + TypeScript
- Vite
- Tailwind CSS
- Lucide icons

### What Needs to Be Added
1. **Auth** — Supabase Auth
2. **Database** — Supabase (users, profiles, segments, subscriptions)
3. **Payments** — Stripe (gating by plan)
4. **i18n** — 7 languages (EN, PT, ES, FR, DE, IT, **AR**)
5. **Real content** — Migrate from Notion to code (seeds)

### Strategic Language: Arabic 🇸🇦🇦🇪🇶🇦

**Priority:** HIGH

**Why Arabic matters:**
- GCC (Gulf Cooperation Council) = wealthy tourism market
- UAE, Saudi Arabia, Qatar investing heavily in tourism
- Little to no AI tourism solutions in Arabic
- High willingness to pay for quality solutions
- Unique competitive advantage

**Technical considerations:**
- RTL (right-to-left) support required
- Arabic typography (proper fonts)
- Cultural adaptation (not just translation)

### Key Files
| File | Purpose |
|------|---------|
| `App.tsx` | Main app with routing and DNA state |
| `types.ts` | TypeScript interfaces |
| `constants.ts` | Mock data (GPT Tools, Experts, Scripts, Docs) |
| `components/TaskPlayer.tsx` | Task execution modal |
| `pages/Dashboard.tsx` | Home with active tasks |
| `pages/Personalize.tsx` | DNA configuration |

---

## 8. Reference Documents

### Business Context
- `workspace/projects/traveltech-digital/about/README.md` — Full positioning
- `workspace/projects/traveltech-digital/about/segments/` — 6 segment briefings
- `workspace/projects/traveltech-digital/development/prd-ai-os.txt` — Original PRD (complex)

### Operational Context
- `workspace/thiago-os/` — 45 docs on governance, agents, costs, etc.
- `workspace/thiago-os/33-MULTI-AI-GOVERNANCE.md` — Multi-AI architecture
- `workspace/thiago-os/05-AGENT-ROLES.md` — Agent boundaries

---

## 9. Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Documentation language | English | Better for LLMs, code, dev |
| Platform approach | Curator, not builder | Don't compete with ChatGPT |
| MVP segment | Hotels (suggested) | Clearest value prop |
| Complexity | Simplified from PRD | Hub > Complex SaaS |
| Squads | AI agents from Syncra | Use existing infrastructure |
| Arabic support | HIGH PRIORITY | GCC = rich market, zero competition |
| Volume segments | Tour Guides + Holiday Rentals | 90% of market, massive scale |

### Market Priorities

```
TIER 1 (Volume + Scale)
├── Tour Guides        → Millions globally, low ticket, high volume
├── Holiday Rentals    → Airbnb/VRBO hosts, massive market
└── Travel Agencies    → Established, ready to pay

TIER 2 (Value + Margins)
├── Hotels             → Clear ROI, good ticket
├── Operators/DMCs     → B2B, higher complexity
└── Attractions        → Growing segment

TIER 3 (Strategic)
├── Resorts            → High ticket, longer sales cycle
├── DMOs/Destinations  → Government/public, high ticket
└── GCC Market         → Arabic-first, premium positioning
```

---

## 10. Next Steps (Priority Order)

| # | Task | Squad/Agent |
|---|------|-------------|
| 1 | Review prototype, understand code | @dev |
| 2 | Setup Supabase (auth + DB schema) | @data-engineer |
| 3 | Create content squad for Notion migration | @squad-creator |
| 4 | Define i18n architecture (including RTL for Arabic) | @architect |
| 5 | Add Stripe integration | @dev |
| 6 | Create segment briefings: Tour Guides, Holiday Rentals | @analyst / deep-research |
| 7 | Research Arabic market + localization requirements | @analyst / deep-research |
| 8 | Build Hotels vertical MVP | All |
| 9 | Plan GCC market entry | @pm |

---

## 11. Open Questions

1. **Notion content** — How much is ready? What format?
2. **Stripe** — Which plan? Do you have account?
3. **Domain** — What domain for the platform?
4. **Timeline** — ITB Berlin (March 2026) still target?
5. **Arabic** — Do you have Arabic content? Translation partner? RTL experience?
6. **Tour Guides segment** — Content ready? Specific pain points documented?
7. **Holiday Rentals segment** — Content ready? Differentiation from Hotels?
8. **GCC contacts** — Any existing relationships in UAE/Saudi/Qatar?

---

## 12. How to Continue

```bash
# Navigate to aios-lab
cd C:\Users\thiag\workspace\aios-lab

# Start Claude Code
claude

# Activate squad-creator to explore or create squads
@squad-creator
*list-squads

# Or activate dev agent to work on code
@dev
*help
```

---

*Handoff created: 2026-02-06*
*Ready for aios-lab session*
