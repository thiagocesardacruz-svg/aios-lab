# TravelTech AIOS - Onboarding & DNA Design Document

> **Version:** 1.0
> **Date:** 2026-02-09
> **Status:** Design Discovery Complete

---

## 1. Executive Summary

This document defines the evolved onboarding experience and DNA architecture for TravelTech AIOS, based on analysis of 11 Advanced Personalization forms and the existing content structure (1,697 prompts, 68 experts, 98 tools).

### Key Design Decisions

1. **Two-Layer DNA:** Person (individual) + Business (shareable across team)
2. **Progressive Profiling:** 5 mandatory fields → unlock app → advanced profiling over time
3. **Click-Based UX:** Dropdowns/chips > text fields (except business name)
4. **Typeform Style:** One question per screen, mobile-optimized
5. **LocalStorage Persistence:** Never lose progress on refresh/close

---

## 2. Analysis: Advanced Personalization Forms

### 2.1 Common Structure Across All 11 Segments

| Section | Description | Fields Count |
|---------|-------------|--------------|
| **1. Identity & Positioning** | Name, stage, ownership, brand voice | 8-12 |
| **2. Market Context** | Segment, audience, geography, competitors | 10-14 |
| **3. Operations & Services** | Core services, processes, bottlenecks | 8-15 |
| **4. Financial & Strategic** | Revenue, margins, priorities | 10-12 |
| **5. Risk & Compliance** | Legal, insurance, ESG | 5-8 |
| **6. Customer Experience** | Journey map, satisfaction, retention | 6-8 |
| **7. AI Expectations** | Use cases, integrations, success metrics | 5-6 |
| **8. Success Metrics** | Commercial, operational, customer KPIs | 4-5 |
| **9. Communication Preferences** | Tone, format, frequency | 6-7 |
| **10. Constraints** | Budget, tech, market, human limits | 5-6 |
| **11. Metrics & Data** | Current numbers (social, sales, reviews) | 15-25 |

**Total per segment:** 80-120 fields
**Conclusion:** Too much for upfront onboarding → Progressive profiling required

### 2.2 Segment-Specific Variations

| Segment | Unique Fields |
|---------|--------------|
| **Hotels** | Rooms, ADR, RevPAR, GOPPAR, distribution mix, OTA dependency |
| **Travel Agencies** | Booking value, commission margins, OTA vs direct split |
| **Tour Operators/DMCs** | Pax volume, B2B partners, quote conversion rate |
| **Tourism Observatories (DMO)** | Research scope, data coverage, stakeholder types |
| **Resorts** | All-inclusive model, F&B revenue %, ancillary services |
| **Tour Guides** | Solo vs agency, tour types, languages, capacity |

### 2.3 Variable Patterns Found

```
Current Patterns (to convert):
- [Insert your business description here]
- [Your business description here]
- [Your location here]
- [My business is]
- [Insert your location here]
- [target audience description]

Target Format:
- {{business_name}}
- {{location}}
- {{target_audience}}
- {{tone}}
- {{primary_goal}}
```

---

## 3. DNA Architecture

### 3.1 Two-Layer Model

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER DNA                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    PERSON DNA                            │   │
│  │  - cargo (role/position)                                 │   │
│  │  - functions (responsibilities)                          │   │
│  │  - experience_level                                      │   │
│  │  - preferred_ai_style                                    │   │
│  │  - communication_preference                              │   │
│  │                                                          │   │
│  │  Note: Language is handled at platform level, not DNA    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   BUSINESS DNA                           │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │              CORE (Mandatory Day 0)              │    │   │
│  │  │  - business_name (text input)                    │    │   │
│  │  │  - location (dropdown: country → city)           │    │   │
│  │  │  - segment (dropdown)                            │    │   │
│  │  │  - niche (dropdown, segment-specific options)    │    │   │
│  │  │  - target_audience (chips multi-select)          │    │   │
│  │  │  - tone (chips single-select)                    │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │           EXTENDED (Progressive Profiling)       │    │   │
│  │  │  Max 5 essential questions per area:             │    │   │
│  │  │  - Goals by Growth Vertical (checkboxes)         │    │   │
│  │  │  - Identity & Positioning (5 questions)          │    │   │
│  │  │  - Market Context (5 questions)                  │    │   │
│  │  │  - Operations (5 questions)                      │    │   │
│  │  │  - Financials (5 questions)                      │    │   │
│  │  │  - Metrics (5 questions)                         │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                          │   │
│  │  [Shareable with team members under same account]        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Database Schema Update

```sql
-- Person DNA (individual user context)
CREATE TABLE public.person_dna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,

  -- Core person fields
  cargo TEXT,                    -- Role/position
  functions TEXT[],              -- Array of responsibilities
  experience_level TEXT CHECK (experience_level IN ('junior', 'mid', 'senior', 'director', 'c-level')),

  -- AI interaction preferences
  preferred_ai_style TEXT CHECK (preferred_ai_style IN ('concise', 'detailed', 'conversational', 'formal')),
  communication_preference TEXT CHECK (communication_preference IN ('bullet_points', 'paragraphs', 'mixed')),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: Language preference is handled at users.language, not in DNA

-- Business DNA (shareable context)
ALTER TABLE public.business_dna ADD COLUMN IF NOT EXISTS segment TEXT
  CHECK (segment IN ('hotel', 'agency', 'dmc', 'dmo', 'resort', 'tour_guide', 'attraction', 'rental'));

ALTER TABLE public.business_dna ADD COLUMN IF NOT EXISTS niche TEXT;
-- Niche options are segment-specific (see Section 4.3)

-- Add extended fields as JSONB for flexibility
ALTER TABLE public.business_dna ADD COLUMN IF NOT EXISTS extended JSONB DEFAULT '{}';

-- Extended fields structure (max 5 questions per area):
-- {
--   "goals": {
--     "customer_acquisition": ["increase_direct_bookings", "improve_ota_visibility"],
--     "sales_conversion": ["reduce_quote_time"],
--     "retention": ["launch_loyalty_program"],
--     ...
--   },
--   "identity": { "stage": "growth", "ownership": "family", "brand_voice": "...", "usp": "...", "certifications": [] },
--   "market": { "geographies": ["USA", "UK"], "budget_range": "mid", "competitors": [], "trends": [] },
--   "operations": { "core_services": [], "tech_stack": [], "team_size": 25, "bottlenecks": [] },
--   "financials": { "revenue_bracket": "2M-5M", "margin": 12 },
--   "metrics": { "social": {}, "sales": {}, "reviews": {} }
-- }
```

---

## 4. Onboarding Flow Design

### 4.1 Day 0 Flow (Mandatory - 7 Steps)

**Note:** Segment is implicit from the product purchased (e.g., hotel-aios → segment = hotel)

```
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1/7: LANGUAGE                                             │
│                                                                 │
│  Choose your language                                           │
│                                                                 │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                       │
│  │ 🇬🇧    │ │ 🇧🇷    │ │ 🇪🇸    │ │ 🇫🇷    │                       │
│  │English│ │Português│ │Español│ │Français│                     │
│  └───────┘ └───────┘ └───────┘ └───────┘                       │
│  ┌───────┐ ┌───────┐ ┌───────┐                                 │
│  │ 🇩🇪    │ │ 🇮🇹    │ │ 🇦🇪    │                                 │
│  │Deutsch│ │Italiano│ │العربية │                                 │
│  └───────┘ └───────┘ └───────┘                                 │
│                                                                 │
│  [This sets the platform language for the user]                 │
│                                                                 │
│                              [Continue →]                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STEP 2/7: BUSINESS NAME                                        │
│                                                                 │
│  What's your business name?                                     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Hotel Belvedere & Spa                                      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [This is the only text field - everything else is click-based]│
│                                                                 │
│                              [Continue →]                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STEP 3/7: LOCATION                                             │
│                                                                 │
│  Where is your business located?                                │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Portugal                                                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Lisbon (optional)                                          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [Simple text fields - product is global]                       │
│                                                                 │
│                         [← Back]  [Continue →]                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STEP 4/7: NICHE                                                │
│                                                                 │
│  What's your focus?                                             │
│  As a Hotel, what's your specialty?                             │
│                                                                 │
│  [Segment is implicit from product - niche options shown:]      │
│                                                                 │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │ Boutique Hotel  │ │ Business Hotel  │ │ Resort Hotel    │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │ All-Inclusive   │ │ Eco-Lodge       │ │ Luxury          │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
│  ┌─────────────────┐ ┌─────────────────┐                       │
│  │ Family Hotel    │ │ Urban Lifestyle │                       │
│  └─────────────────┘ └─────────────────┘                       │
│                                                                 │
│                         [← Back]  [Continue →]                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STEP 5/7: TARGET AUDIENCE                                      │
│                                                                 │
│  Who are your main customers? (Select all that apply)           │
│                                                                 │
│  ┌─────────┐ ┌─────────────┐ ┌──────────────┐ ┌──────────────┐ │
│  │ Leisure │ │ Business    │ │ Families     │ │ Couples      │ │
│  └─────────┘ └─────────────┘ └──────────────┘ └──────────────┘ │
│  ┌─────────┐ ┌─────────────┐ ┌──────────────┐ ┌──────────────┐ │
│  │ Groups  │ │ Luxury      │ │ Budget       │ │ Adventure    │ │
│  └─────────┘ └─────────────┘ └──────────────┘ └──────────────┘ │
│  ┌─────────────────┐ ┌─────────────────┐                       │
│  │ MICE/Corporate  │ │ Senior Citizens │                       │
│  └─────────────────┘ └─────────────────┘                       │
│                                                                 │
│                         [← Back]  [Continue →]                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STEP 6/7: COMMUNICATION TONE                                   │
│                                                                 │
│  What tone should AI responses use?                             │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  ✓  Professional & Formal                                  ││
│  │      Clear, structured, business-oriented                  ││
│  └────────────────────────────────────────────────────────────┘│
│  ┌────────────────────────────────────────────────────────────┐│
│  │     Warm & Welcoming                                       ││
│  │      Friendly, approachable, hospitality-focused           ││
│  └────────────────────────────────────────────────────────────┘│
│  ┌────────────────────────────────────────────────────────────┐│
│  │     Luxury & Exclusive                                     ││
│  │      Refined, sophisticated, high-end                      ││
│  └────────────────────────────────────────────────────────────┘│
│  ┌────────────────────────────────────────────────────────────┐│
│  │     Casual & Conversational                                ││
│  │      Relaxed, easy-going, authentic                        ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│                         [← Back]  [Continue →]                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STEP 7/7: READY TO GO!                                         │
│                                                                 │
│  ✅ Your AI workspace is personalized for:                      │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Language     │ English                                     │ │
│  │ Business     │ Hotel Belvedere & Spa                       │ │
│  │ Location     │ Lisbon, Portugal                            │ │
│  │ Type         │ Hotel - Boutique Hotel                      │ │
│  │ Audience     │ Leisure, Couples, Luxury                    │ │
│  │ Tone         │ Warm & Welcoming                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  You can edit your DNA anytime in Settings.                     │
│                                                                 │
│                              [Start Using AIOS →]               │
└─────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **Language First** - Sets platform language before onboarding content
2. **Segment Implicit** - Inferred from product purchase (hotel-aios → hotel)
3. **Location as Text** - Simple text fields, product is global
4. **DNA Editing** - Users can edit text in Settings without breaking prompts
   (variable names stay the same: `{{business_name}}`, `{{tone}}`, etc.)

### 4.2 Niche Options by Segment

| Segment | Niche Options |
|---------|---------------|
| **Hotel** | Boutique, Business, Resort, All-Inclusive, Eco-Lodge, Luxury, Family, Urban Lifestyle, Hostel |
| **Agency** | Luxury Specialist, Corporate Travel, Adventure, Groups, Online OTA, Destination Weddings, MICE |
| **DMC** | Inbound Leisure, Outbound, Incentives & MICE, Adventure & Eco, Educational, Luxury FIT |
| **DMO** | City Tourism Board, Regional, National, Thematic (Gastronomy, Wine, etc.) |
| **Resort** | Beach Resort, Ski Resort, Spa & Wellness, Golf Resort, Family Resort, Adults-Only |
| **Tour Guide** | Walking Tours, Cultural & Heritage, Adventure, Food & Wine, Private VIP, Group Tours |
| **Attraction** | Museum, Theme Park, Natural Site, Cultural Venue, Entertainment, Sports |
| **Rental** | Vacation Homes, Apartments, Villas, Glamping, Rural Tourism |

### 4.3 Goals by Growth Vertical (Extended - Checkboxes)

After onboarding, users can set goals by Growth Vertical. This powers the "MY PLAN" recommendations.

```
┌─────────────────────────────────────────────────────────────────┐
│  SET YOUR GOALS                                                 │
│                                                                 │
│  Select what you want to achieve in each area:                  │
│                                                                 │
│  🎯 CUSTOMER ACQUISITION                                        │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ ☑ Increase direct bookings                                 ││
│  │ ☑ Improve OTA profile visibility                           ││
│  │ ☐ Launch lead magnet campaigns                             ││
│  │ ☐ Grow social media following                              ││
│  │ ☐ Improve website conversion rate                          ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  💰 SALES CONVERSION                                            │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ ☐ Reduce quote-to-booking time                             ││
│  │ ☐ Increase upsell success rate                             ││
│  │ ☐ Improve pricing strategy                                 ││
│  │ ☐ Train staff on sales techniques                          ││
│  │ ☐ Optimize premium package positioning                     ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  🔄 CUSTOMER RETENTION                                          │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ ☐ Launch loyalty program                                   ││
│  │ ☐ Improve follow-up process                                ││
│  │ ☐ Increase repeat booking rate                             ││
│  │ ☐ Build referral program                                   ││
│  │ ☐ Enhance guest satisfaction                               ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  [Continue to more areas...]                                    │
│                                                                 │
│  ⚡ Operational Efficiency    📊 Data Intelligence              │
│  🌟 Brand Visibility          📈 Revenue Growth                 │
│  🌱 Sustainability            👥 Team Development               │
│                                                                 │
│                              [Save Goals →]                     │
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 Extended Profiling (Max 5 Questions per Area)

After completing onboarding, users can progressively add more context through:

1. **DNA Card on Dashboard** - "Complete your profile" progress bar
2. **Contextual Prompts** - When using a prompt that needs more context
3. **Settings > My Business** - Extended profiling by area

```
┌─────────────────────────────────────────────────────────────────┐
│  DNA PROFILE                                         60% ████░  │
│                                                                 │
│  ✓ Core Profile Complete                                        │
│  ✓ Goals Set (6 areas configured)                               │
│  ○ Identity & Positioning (5 questions)                         │
│  ○ Market Context (5 questions)                                 │
│  ○ Operations (5 questions)                                     │
│  ○ Financials (5 questions)                                     │
│  ○ Metrics & Data (5 questions)                                 │
│                                                                 │
│  [+ Complete Identity & Positioning →]                          │
│                                                                 │
│  The more context you add, the better AI results you'll get.    │
└─────────────────────────────────────────────────────────────────┘
```

### 4.5 Extended Questions (5 per Area)

| Area | 5 Essential Questions |
|------|----------------------|
| **Identity** | 1. Business stage (Startup/Growth/Established/Legacy) <br> 2. Ownership type <br> 3. Brand voice description <br> 4. Unique selling proposition (USP) <br> 5. Key certifications |
| **Market** | 1. Main source geographies <br> 2. Budget range of guests <br> 3. Average stay duration <br> 4. Top 3 competitors <br> 5. Key market trends affecting you |
| **Operations** | 1. Core services offered <br> 2. Team size <br> 3. Main tech tools in use <br> 4. Top operational bottlenecks <br> 5. Distribution channel split |
| **Financials** | 1. Annual revenue bracket <br> 2. Gross margin % <br> 3. Marketing budget % <br> 4. Main cost pressure points <br> 5. Cash flow challenges |
| **Metrics** | 1. Social media followers <br> 2. Email list size <br> 3. Website monthly visitors <br> 4. Main review scores <br> 5. Customer retention % |

---

## 5. Growth Verticals Taxonomy

### 5.1 The 9 Growth Verticals

Based on content analysis, all prompts, experts, and tools map to these 9 verticals:

| # | Vertical | Icon | Description | Example Prompts |
|---|----------|------|-------------|-----------------|
| 1 | **Customer Acquisition** | 🎯 | Attract new guests/clients | Lead magnets, OTA optimization, social media |
| 2 | **Sales Conversion** | 💰 | Turn leads into bookings | Pricing strategies, upselling, quote templates |
| 3 | **Customer Retention** | 🔄 | Keep guests coming back | Loyalty programs, follow-ups, referrals |
| 4 | **Operational Efficiency** | ⚡ | Streamline daily operations | SOPs, scheduling, automation, cost reduction |
| 5 | **Data Intelligence** | 📊 | Make data-driven decisions | KPIs, dashboards, market research, benchmarks |
| 6 | **Brand Visibility** | 🌟 | Build recognition & trust | Content marketing, PR, reviews, partnerships |
| 7 | **Revenue Growth** | 📈 | Increase profit margins | Premium packages, ancillary revenue, yield mgmt |
| 8 | **Sustainability** | 🌱 | ESG & responsible tourism | Green certifications, community impact, waste |
| 9 | **Team Development** | 👥 | Train & empower staff | Onboarding, SOPs, performance, culture |

### 5.2 Vertical → Content Mapping

```
growth_verticals/
├── customer-acquisition/
│   ├── prompts/
│   │   ├── clarifying-lead-magnet-offers.json
│   │   ├── improving-ota-profile-quality.json
│   │   └── social-media-content-planning.json
│   ├── experts/
│   │   └── digital-marketing-manager.json
│   └── tools/
│       └── ota-profile-optimizer.json
│
├── sales-conversion/
│   ├── prompts/
│   │   ├── pricing-premium-packages-confidently.json
│   │   ├── pricing-tiers-and-upselling.json
│   │   └── pitching-high-ticket-experiences.json
│   └── experts/
│       └── sales-leader.json
│
└── ... (7 more verticals)
```

### 5.3 Content Tagging Schema

```json
{
  "id": "pricing-premium-packages",
  "title": "Pricing Premium Packages Confidently",
  "segment": "dmc",
  "growth_vertical": "sales-conversion",
  "content_type": "prompt",
  "topic": "High-Ticket Services",
  "difficulty": "intermediate",
  "time_to_complete": 15,
  "dna_variables_used": ["business_name", "location", "target_audience"],
  "tags": ["pricing", "premium", "value-communication", "presentations"],
  "languages": ["en", "pt", "es", "fr", "de", "it"]
}
```

---

## 6. Navigation Structure

### 6.1 Main Navigation

```
┌─────────────────────────────────────────────────────────────────┐
│  TRAVELTECH AIOS                              [EN ▼] [🔔] [👤]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                         HOME                               │ │
│  │  - Growth Trails (guided journeys by vertical)             │ │
│  │  - Quick Actions (most used prompts)                       │ │
│  │  - Continue Where You Left Off                             │ │
│  │  - Recommendations Based on DNA                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                          DNA                               │ │
│  │  - Person Profile (my role, preferences)                   │ │
│  │  - Business Profile (company context)                      │ │
│  │  - Team Members (if applicable)                            │ │
│  │  - Progress & Completeness                                 │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                      FAVOURITES                            │ │
│  │  - Saved Prompts                                           │ │
│  │  - Saved Experts                                           │ │
│  │  - Saved Tools                                             │ │
│  │  - Recent History                                          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                     INTELLIGENCE                           │ │
│  │  ├─ MY PLAN (recommended actions based on goals)          │ │
│  │  ├─ AI EXPERTS (68 specialists)                           │ │
│  │  │   └─ Filter by: Team | Expertise | Vertical            │ │
│  │  └─ TOOLS (98 utility tools)                              │ │
│  │      └─ Filter by: Category | Vertical                    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                      RESOURCES                             │ │
│  │  ├─ PROMPT LIBRARY (1,697 prompts)                        │ │
│  │  │   └─ Filter by: Segment | Vertical | Topic             │ │
│  │  ├─ MESSAGE SCRIPTS (templates for communication)         │ │
│  │  ├─ DOCUMENTS (contracts, checklists, templates)          │ │
│  │  └─ PLATFORMS (integration guides)                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Mobile Bottom Navigation

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   🏠        🧬        ⭐        🧠        📚                   │
│  Home      DNA    Favourites  Intel   Resources                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. UX Principles

### 7.1 Clicks Over Text

| Instead of | Use |
|------------|-----|
| Free text for location | Country → City dropdowns with search |
| Free text for audience | Multi-select chips |
| Free text for tone | Single-select radio cards |
| Free text for goals | Dropdown with preset options |
| Free text for segment | Auto-detected from product purchased |

### 7.2 Typeform-Style Flow

- **One question per screen** on mobile
- **Clear progress indicator** (step X of Y)
- **Back button always visible** (except step 1)
- **Enter/Continue to proceed** (keyboard support)
- **Skip option** for optional fields (never for mandatory)

### 7.3 LocalStorage Persistence

```typescript
// Save progress on every field change
useEffect(() => {
  localStorage.setItem('onboarding_progress', JSON.stringify({
    currentStep,
    formData,
    timestamp: Date.now()
  }));
}, [currentStep, formData]);

// Restore on mount
useEffect(() => {
  const saved = localStorage.getItem('onboarding_progress');
  if (saved) {
    const { currentStep, formData, timestamp } = JSON.parse(saved);
    // Only restore if less than 24 hours old
    if (Date.now() - timestamp < 86400000) {
      setCurrentStep(currentStep);
      setFormData(formData);
    }
  }
}, []);
```

### 7.4 Design Aesthetics

- **Dark theme** with gradient accents (tech/modern feel)
- **Subtle animations** on transitions (Framer Motion)
- **Micro-interactions** on clicks and selections
- **Minimal chrome** - content-first approach
- **High contrast** for accessibility

---

## 8. Variable Substitution System

### 8.1 Core Variables (Always Available)

| Variable | Type | Example |
|----------|------|---------|
| `{{business_name}}` | String | Hotel Belvedere & Spa |
| `{{location}}` | String | Lisbon, Portugal |
| `{{segment}}` | String | hotel |
| `{{niche}}` | String | Boutique Hotel |
| `{{target_audience}}` | String | Business travelers, Luxury guests |
| `{{tone}}` | String | Professional & Formal |

### 8.2 Extended Variables (When Available)

| Variable | Source Section | Example |
|----------|----------------|---------|
| `{{team_size}}` | Operations | 45 employees |
| `{{revenue_bracket}}` | Financials | $5M-$15M |
| `{{distribution_mix}}` | Operations | 45% direct, 40% OTA, 15% corporate |
| `{{competitors}}` | Market | Hilton Rio, Sofitel Copacabana |
| `{{usp}}` | Identity | Private beach, luxury spa |
| `{{certifications}}` | Identity | Green Globe, HACCP |

### 8.3 Fallback Strategy

```typescript
function substituteDNA(template: string, dna: BusinessDNA): string {
  const fallbacks: Record<string, string> = {
    business_name: 'your business',
    location: 'your location',
    segment: 'your segment',
    niche: 'your niche',
    target_audience: 'your target customers',
    tone: 'professional',
    team_size: 'your team',
    revenue_bracket: 'your current revenue'
  };

  return template.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
    const value = dna[variable as keyof BusinessDNA];
    if (value) return String(value);
    return fallbacks[variable] || `[${variable}]`;
  });
}
```

---

## 9. Implementation Phases

### Phase 1: Core Onboarding (Week 1)
- [ ] Implement 5-step onboarding flow
- [ ] Click-based inputs (dropdowns, chips, radio cards)
- [ ] LocalStorage persistence
- [ ] Progress indicator
- [ ] Mobile-responsive design

### Phase 2: Progressive Profiling (Week 2)
- [ ] DNA completion progress card
- [ ] Extended profiling form (by section)
- [ ] Person DNA collection
- [ ] Settings page integration

### Phase 3: Variable Substitution (Week 2)
- [ ] Update substitution utility
- [ ] Add fallback system
- [ ] Test with sample prompts
- [ ] Validate all 1,697 prompts have proper variables

### Phase 4: Growth Verticals (Week 3)
- [ ] Tag all content with verticals
- [ ] Implement filter UI
- [ ] Create Growth Trails
- [ ] MY PLAN recommendations

---

## 10. Data Model Summary

```typescript
interface PersonDNA {
  id: string;
  user_id: string;
  cargo: string | null;                    // Role/position
  functions: string[];                     // Responsibilities
  experience_level: 'junior' | 'mid' | 'senior' | 'director' | 'c-level';
  preferred_ai_style: 'concise' | 'detailed' | 'conversational' | 'formal';
  communication_preference: 'bullet_points' | 'paragraphs' | 'mixed';
  // Note: Language is at users.language, not here
}

interface BusinessDNA {
  id: string;
  user_id: string;

  // Core (mandatory - Day 0 onboarding)
  business_name: string;
  location: string;
  segment: 'hotel' | 'agency' | 'dmc' | 'dmo' | 'resort' | 'tour_guide' | 'attraction' | 'rental';
  niche: string;                          // Segment-specific options
  target_audience: string;                // Comma-separated or array
  tone: string;

  // Extended (progressive profiling - max 5 per area)
  extended: {
    // Goals by Growth Vertical (checkboxes)
    goals?: {
      customer_acquisition?: string[];    // Selected goal IDs
      sales_conversion?: string[];
      retention?: string[];
      operational_efficiency?: string[];
      data_intelligence?: string[];
      brand_visibility?: string[];
      revenue_growth?: string[];
      sustainability?: string[];
      team_development?: string[];
    };
    // Identity & Positioning (5 questions)
    identity?: {
      stage?: 'startup' | 'growth' | 'established' | 'legacy';
      ownership?: string;
      brand_voice?: string;
      usp?: string;
      certifications?: string[];
    };
    // Market Context (5 questions)
    market?: {
      geographies?: string[];
      budget_range?: string;
      stay_duration?: string;
      competitors?: string[];
      trends?: string[];
    };
    // Operations (5 questions)
    operations?: {
      core_services?: string[];
      team_size?: number;
      tech_stack?: string[];
      bottlenecks?: string[];
      distribution_split?: Record<string, number>;
    };
    // Financials (5 questions)
    financials?: {
      revenue_bracket?: string;
      margin?: number;
      marketing_budget_pct?: number;
      cost_pressures?: string[];
      cashflow_challenges?: string[];
    };
    // Metrics (5 questions)
    metrics?: {
      social_followers?: Record<string, number>;
      email_list_size?: number;
      website_visitors?: number;
      review_scores?: Record<string, number>;
      retention_pct?: number;
    };
  };
}

interface GrowthVertical {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  goals: GoalOption[];                    // Available goals for this vertical
}

interface GoalOption {
  id: string;
  label: string;
  vertical: string;
}

interface ContentItem {
  id: string;
  title: string;
  segment: string;
  growth_vertical: string;
  content_type: 'prompt' | 'expert' | 'tool';
  topic: string;
  tags: string[];
  dna_variables_used: string[];
  languages: string[];
  prompt_template?: string;
}
```

---

## 11. Next Steps

1. **Validate with Thiago:**
   - Confirm 2-layer DNA approach (Person + Business)
   - Confirm Growth Vertical taxonomy
   - Confirm navigation structure
   - Confirm progressive profiling strategy

2. **Design:**
   - Create Figma mockups for onboarding flow
   - Design DNA settings page
   - Design filter/browse UI for content

3. **Implement:**
   - Update database schema
   - Build onboarding components
   - Create DNA context with new structure
   - Implement variable substitution

4. **Content:**
   - Run transformation scripts
   - Tag all content with verticals
   - Validate variable patterns

---

*Document created: 2026-02-09*
*Based on analysis of 11 Advanced Personalization forms and 1,697 prompts*
