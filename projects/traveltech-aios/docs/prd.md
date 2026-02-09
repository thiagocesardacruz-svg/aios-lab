# TravelTech AIOS Platform - PRD v3.1

> **Status:** Final Draft
> **Created:** 2026-02-06
> **Updated:** 2026-02-09
> **Author:** Morgan (PM Agent) + Thiago + Squad AIOS + AI Review (ChatGPT, Gemini, Claude)
> **Target:** ITB Berlin - March 3-5, 2026
> **Domain:** app.traveltech.digital

---

## 1. Executive Summary

### 1.1 Company Context

**Travel Tech Digital** is an **AI & Digital Solutions for Tourism Growth and Intelligence** company.

The focus is not technology for its own sake. The focus is **practical results, competitive advantage, and real AI adoption in tourism**.

**Core Promise:** A reliable shortcut to practical AI adoption in tourism, with applied strategy, smarter decisions, and ready-to-execute processes.

### 1.2 Product Vision

TravelTech AIOS is the **main product-system** of Travel Tech Digital - a **curation and facilitation platform** that helps tourism businesses use AI effectively.

**Master phrase:** "AI doesn't scale tourism. Systems do. AIOS is the system."

**Product North Star:**
> Prove, in minutes, that AI understands THIS specific business, in THIS specific location.

### 1.3 What It IS

- **Curator** of AI resources (prompts, templates, GPT experts, tools)
- **Facilitator** that connects users to external LLMs (ChatGPT, Custom GPTs)
- **Personalizer** that adapts content with Business DNA
- **Guide** that provides Growth Trails (curated step-by-step paths)
- **Context Factory** - Template 80% (proven structure) + Data 20% (Business DNA) = Personalized Super Prompt

### 1.4 What It's NOT

- Not building AI internally
- Not a complex SaaS with AI generation
- Not trying to replace ChatGPT
- Not a white-label solution (V1)
- Not an education platform - it's an **application platform**

### 1.5 Key Differentiators

| Differentiator | Description |
|----------------|-------------|
| **Business DNA** | User context that personalizes all prompts automatically |
| **Segment = Product** | Each segment is a separate product with complete isolation |
| **Growth Trails** | Curated sequences of prompts to achieve specific goals |
| **7 Languages** | Global reach from day one (EN, PT, ES, FR, DE, IT, AR) |
| **External Orchestrator** | Prepares perfect prompts for ChatGPT/Custom GPTs |
| **AI Tutor** | Meta-expert that teaches HOW to use AI effectively |

---

## 2. Fundamental Product Model

### 2.1 Segments ARE Products (Critical Architecture Decision)

**THIS IS NON-NEGOTIABLE AND MUST GUIDE ALL DECISIONS.**

Each segment is a **separate product**, not a user state or preference:

| Concept | Correct Understanding | Wrong Understanding |
|---------|----------------------|---------------------|
| Segment | Product purchased | User preference |
| Selection | Happens at checkout | Happens in onboarding |
| Switching | Not possible (buy another product) | "Change segment" option |
| Isolation | Guaranteed by design | Conditional logic |
| Context | Implicit from purchase | User input |

**Examples:**
- **Hotel AIOS** = Product
- **Travel Agency AIOS** = Product
- **DMC AIOS** = Product
- **DMO AIOS** = Product

**Technical Implications:**

```
✅ Correct:
- User buys "Hotel AIOS" → token includes product_id = "hotel-aios"
- Platform shows ONLY hotel content
- Zero segment selection in UI
- Gating by product, not conditional logic

❌ Wrong:
- User signs up → selects segment → can change later
- Segment stored as user preference
- Content filtered by if/else logic
```

**Why This Matters:**
- Simplifies auth (product_id in token)
- Simplifies UX (no ambiguity)
- Simplifies gating (product = access)
- Enables clear pricing per product
- Enables accurate metrics per product

### 2.2 User Journey (Correct Flow)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CORRECT USER JOURNEY                                │
│                                                                             │
│   1. DISCOVER          2. PURCHASE           3. ACTIVATE        4. USE     │
│   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐   ┌─────────┐ │
│   │ Landing     │      │ Checkout    │      │ First Login │   │ Library │ │
│   │ Page        │  →   │ (Stripe)    │  →   │ + DNA Setup │ → │ Prompts │ │
│   │             │      │             │      │             │   │ Trails  │ │
│   │ See product │      │ Buy product │      │ Name+Location│  │ Experts │ │
│   │ for segment │      │ (segment    │      │ in < 3 min  │   │         │ │
│   │             │      │  implicit)  │      │             │   │         │ │
│   └─────────────┘      └─────────────┘      └─────────────┘   └─────────┘ │
│                                                                             │
│   Segment decided      Payment done         DNA collected     Value seen   │
│   by user choice       segment locked       (required fields) immediately  │
│   of PRODUCT           in subscription      business context               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Modular Product Architecture (Critical)

**Products are modular and composable.** AIOS bundles contain multiple modules, but modules can also be sold standalone.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PRODUCT HIERARCHY                                        │
│                                                                             │
│  BUNDLES (AIOS)                         STANDALONE MODULES                  │
│  ┌─────────────────────────┐           ┌─────────────────────────┐         │
│  │ 🏨 Hotel AIOS           │           │ 📦 Hotel Experts        │         │
│  │    $199/year            │           │    $49 one-time         │         │
│  │                         │           │    Access: experts only │         │
│  │ Includes ALL modules:   │           └─────────────────────────┘         │
│  │ ✓ Experts (hotel)       │                                               │
│  │ ✓ Prompts (hotel)       │           ┌─────────────────────────┐         │
│  │ ✓ Tools (all)           │           │ 📦 Hotel Prompts        │         │
│  │ ✓ Trails (hotel)        │           │    $39 one-time         │         │
│  │ ✓ SOPs (hotel)          │           │    Access: prompts only │         │
│  │ ✓ AI Tutor              │           └─────────────────────────┘         │
│  └─────────────────────────┘                                               │
│                                        ┌─────────────────────────┐         │
│  ┌─────────────────────────┐           │ 🔧 Marketing Tools      │         │
│  │ ✈️ Agency AIOS          │           │    $29 one-time         │         │
│  │    $199/year            │           │    Access: tools only   │         │
│  │    (same structure)     │           │    (cross-segment)      │         │
│  └─────────────────────────┘           └─────────────────────────┘         │
│                                                                             │
│  USER CAN:                                                                  │
│  • Buy standalone module → Entry point, lower commitment                   │
│  • Buy AIOS bundle → Full access, better value                             │
│  • Buy multiple standalones → Accumulate access                            │
│  • Upgrade standalone to bundle → Upsell path                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Why This Architecture:**
- **Multiple price points** = higher conversion (entry at $29, not $199)
- **Clear upgrade path** = higher LTV (standalone → bundle)
- **Easy to add modules** = 2 SQL queries, zero code changes
- **Segment isolation maintained** = hotel user never sees agency content
- **Cross-segment modules possible** = tools can be shared

### 2.4 Adding New Modules (Zero Code)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ADDING A NEW MODULE (Example: "AI SOPs Pack")                              │
│                                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │ 1.STRIPE │ →  │ 2.SQL    │ →  │ 3.NOTION │ →  │ 4.SYNC   │             │
│  │          │    │          │    │          │    │          │             │
│  │ Create   │    │ INSERT   │    │ Create   │    │ npm run  │             │
│  │ product  │    │ 2 rows   │    │ database │    │ sync     │             │
│  │          │    │          │    │ + content│    │          │             │
│  │ 2 min    │    │ 1 min    │    │ Variable │    │ 1 min    │             │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘             │
│                                                                             │
│  CODE CHANGES: 0 lines                                                      │
│  DEPLOY NEEDED: No (content is static JSON)                                 │
│                                                                             │
│  SQL Example:                                                               │
│  INSERT INTO products (id, name, type, segment, price_type)                 │
│  VALUES ('hotel-sops', 'AI SOPs - Hotels', 'standalone', 'hotel', 'one_time');│
│                                                                             │
│  INSERT INTO product_access (product_id, content_type, segment_filter)      │
│  VALUES ('hotel-sops', 'sops', 'hotel');                                    │
│                                                                             │
│  -- Optional: Add to existing bundle                                        │
│  INSERT INTO product_access (product_id, content_type, segment_filter)      │
│  VALUES ('hotel-aios', 'sops', 'hotel');                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Business Model

### 3.1 Monetization Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MONETIZATION TIERS                                  │
│                                                                             │
│   LOW TICKET (Scale)       MID TICKET (Bundles)        HIGH TICKET          │
│   ┌─────────────────┐      ┌─────────────────┐        ┌──────────────────┐ │
│   │ Individual      │      │ Segment Packs   │        │ Full Access      │ │
│   │ Modules         │  →   │ (all modules    │   →    │ Annual           │ │
│   │ $19-49 USD      │      │ per segment)    │        │ Subscription     │ │
│   │                 │      │ $149-249 USD    │        │ Varies by segment│ │
│   └─────────────────┘      └─────────────────┘        └──────────────────┘ │
│                                                                             │
│   Entry point              Upsell                     Recurrence           │
│   Volume + Validation      Perceived value            Retention            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Pricing Reference (from Money Matrix)

| Product Type | Price USD | Price EUR | Price GBP | Billing |
|--------------|-----------|-----------|-----------|---------|
| Entry Guides | $25 | €20 | £19 | One-time |
| Prompt Packs (Standard) | $29 | €23 | £23 | One-time |
| Prompt Packs (Premium) | $39-49 | €35-45 | £29-39 | One-time |
| GPT Experts (Standard) | $29 | €25 | £23 | One-time |
| GPT Experts (Premium) | $39-49 | €35-45 | £29-39 | One-time |
| Segment Full Access | Varies | Varies | Varies | Annual |

### 3.3 Trial & Payment Model (Final)

| Aspect | Rule |
|--------|------|
| **Trial Period** | 15 days free |
| **Trial End** | Automatic charge (no manual decision) |
| **Downgrade** | Does not exist |
| **One-time Products** | Access for defined period (e.g., 12 months) |
| **Expiration** | `access_expires_at` in database |
| **Post-expiration** | Content blocked, CTA for renewal/upgrade |

**Critical:** Stripe is infrastructure from Day 1, not a "final feature".

### 3.4 Product Categories

| Category | Slug | Description |
|----------|------|-------------|
| AI Guides | `ai-gpt-guides` | Setup guides, playbooks, tutorials |
| AI Prompts | `ai-prompts` | Prompt packs by segment |
| GPT Experts | `ai-gpt-experts` | Custom GPT specialists by role |
| GPT Tools | `ai-gpt-tools` | Specialized AI tools |
| AI Workspace | `ai-workspace` | Workbooks, dashboards |
| AI SOPs | `ai-sops` | Checklists, procedures |

### 3.5 Product Catalog (MVP)

#### AIOS Bundles (Subscription)

| Product ID | Name | Segment | Price | Billing | Includes |
|------------|------|---------|-------|---------|----------|
| `hotel-aios` | Hotel AIOS | Hotels | $199 | Annual | experts, prompts, tools, trails, sops, tutor |
| `agency-aios` | Agency AIOS | Travel Agencies | $199 | Annual | experts, prompts, tools, trails, sops, tutor |
| `dmc-aios` | DMC AIOS | Tour Operators/DMCs | $199 | Annual | experts, prompts, tools, trails, sops, tutor |
| `dmo-aios` | DMO AIOS | Destinations/DMOs | $199 | Annual | experts, prompts, tools, trails, sops, tutor |

#### Standalone Modules (One-Time)

| Product ID | Name | Segment | Price | Access | Includes |
|------------|------|---------|-------|--------|----------|
| `hotel-experts` | Hotel GPT Experts | Hotels | $49 | 12 months | experts (hotel) |
| `hotel-prompts` | Hotel Prompt Pack | Hotels | $39 | 12 months | prompts (hotel) |
| `agency-experts` | Agency GPT Experts | Agencies | $49 | 12 months | experts (agency) |
| `agency-prompts` | Agency Prompt Pack | Agencies | $39 | 12 months | prompts (agency) |
| `marketing-tools` | Marketing Tools | All | $29 | 12 months | tools (marketing) |
| `finance-tools` | Finance Tools | All | $29 | 12 months | tools (finance) |

#### Product Access Matrix

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         PRODUCT ACCESS MATRIX                                │
│                                                                              │
│                    │ experts │ prompts │ tools │ trails │ sops │ tutor │    │
│ ───────────────────┼─────────┼─────────┼───────┼────────┼──────┼───────┼    │
│ hotel-aios         │    ✓    │    ✓    │   ✓   │   ✓    │  ✓   │   ✓   │    │
│ agency-aios        │    ✓    │    ✓    │   ✓   │   ✓    │  ✓   │   ✓   │    │
│ dmc-aios           │    ✓    │    ✓    │   ✓   │   ✓    │  ✓   │   ✓   │    │
│ dmo-aios           │    ✓    │    ✓    │   ✓   │   ✓    │  ✓   │   ✓   │    │
│ ───────────────────┼─────────┼─────────┼───────┼────────┼──────┼───────┼    │
│ hotel-experts      │    ✓    │         │       │        │      │       │    │
│ hotel-prompts      │         │    ✓    │       │        │      │       │    │
│ agency-experts     │    ✓    │         │       │        │      │       │    │
│ agency-prompts     │         │    ✓    │       │        │      │       │    │
│ marketing-tools    │         │         │   ✓   │        │      │       │    │
│ finance-tools      │         │         │   ✓   │        │      │       │    │
│                                                                              │
│ ✓ = has access to this content type for the product's segment               │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### Upgrade Paths

| From (Standalone) | To (Bundle) | Incentive |
|-------------------|-------------|-----------|
| hotel-experts | hotel-aios | "Get full access, save 40%" |
| hotel-prompts | hotel-aios | "Unlock Experts + Trails + Tools" |
| Any standalone | Respective AIOS | Show value of what they're missing |

---

## 4. Business DNA (Critical Feature)

### 4.1 DNA Philosophy

Business DNA is what makes generic prompts become **personalized super prompts**.

Without DNA, prompts are templates. With DNA, prompts understand:
- The specific business
- The specific location
- The specific audience
- The specific goals

### 4.2 Mandatory DNA Fields (Day 0)

These fields are **non-negotiable** because they radically change output quality:

| Field | Why It's Mandatory | Example Impact |
|-------|-------------------|----------------|
| **Business Name** | Fundamental identity | "Hotel & Spa Belvedere" vs generic |
| **Location** | Cultural context, seasonality, pricing, channels | Paris ≠ Bali ≠ Algarve |
| **Target Audience** | Communication style, offers, channels | Luxury travelers vs backpackers |
| **Tone/Vibe** | Brand voice consistency | Professional vs casual vs playful |
| **Primary Goal** | Focus and prioritization | More bookings vs better reviews vs efficiency |

**Location is as essential as Business Name.** Without it, the system loses:
- Cultural context
- Seasonality awareness
- Pricing logic
- Experience type
- Priority channels

### 4.3 DNA Collection Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DNA COLLECTION (< 3 minutes)                        │
│                                                                             │
│   Step 1              Step 2              Step 3              Step 4       │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐│
│   │ Business    │    │ Location    │    │ Audience +  │    │ Goal        ││
│   │ Name        │ →  │             │ →  │ Tone        │ →  │             ││
│   │             │    │ City/Region │    │             │    │ What to     ││
│   │ "Hotel     │    │ Country     │    │ Who + How   │    │ achieve     ││
│   │  Belvedere" │    │ "Lisbon,PT" │    │ you speak   │    │ first       ││
│   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘│
│                                                                             │
│   Required           Required           Required           Required        │
│                                                                             │
│   After these 4 steps → User sees first personalized prompt                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.4 Optional DNA Fields (Progressive Profiling)

Collected over time, not at onboarding:

- USP (Unique Selling Proposition)
- Team size
- Current tools/systems
- Main challenges
- Segment-specific fields

### 4.5 DNA Variable Format

**Standard format:** `{{variable_name}}`

| Variable | Example Value |
|----------|---------------|
| `{{business_name}}` | Hotel & Spa Belvedere |
| `{{location}}` | Lisbon, Portugal |
| `{{target_audience}}` | Business travelers and couples |
| `{{tone}}` | Professional yet warm |
| `{{primary_goal}}` | Increase direct bookings |

**Critical Rule:** Variables are ALWAYS in English, never translated.

---

## 5. Content Inventory (Actual)

### 5.1 GPT Experts (~65+ total)

| Team | Count | Examples |
|------|-------|----------|
| Travel Experts | ~20 | Hotel Management, Tour Guide, DMC Specialist, Destination Expert |
| Travel Marketing | ~11 | SEO, Social Media, Email, Paid Ads, CRO |
| Leadership & Strategy | ~8 | General Manager, Innovation, Sales Leader, Legal |
| Finance | ~6 | Revenue Manager, Accountant, Accounts Receivable |
| Branding & Content | ~5 | Copywriter, Content Strategist, PR |
| Sales | ~5 | Business Development, CRM, Partnerships |
| Customer Service | ~4 | Customer Experience, Guest Relations, Loyalty |
| HR | ~3 | HR Manager, L&D Manager |
| Technology | ~4 | AI & Automation, IT Manager, Machine Learning |
| Sustainability | ~3 | Sustainability Consultant, CSR Expert |

**Location:** `projects/traveltech-digital/products/gpt-teams/`

**Structure per Expert:**
- Orientation & Education (learning prompts)
- Optimization Steps (5 phases)
- Routines & Process (operational prompts)
- Growth Tactics (action prompts)
- Essential Documents (templates)
- Common Tasks (quick wins)

**Custom GPT Links:** All exist and are functional

### 5.2 GPT Tools (~30+)

| Category | Examples |
|----------|----------|
| Travel Packages | Custom Tour Pricing, Cruise Itinerary, Adventure Safety |
| Management | SWOT to SMART Goals, Profit Plan Generator, AI Readiness |
| Content & Copywriting | Meta Ads Copy, Landing Page Copy, 30-Day Calendar |
| Finance | Cash Flow Forecast, Budget Planner, Break-Even Calculator |

**Location:** `projects/traveltech-digital/products/gpt-tools/`

### 5.3 Prompt Packs

| Segment | Status | Estimated Count |
|---------|--------|-----------------|
| Hotels | ZIP ready | ~100+ |
| Tour Guides | MD files ready | ~100+ |
| Attractions | ZIP ready | ~50+ |
| Holiday Rentals | ZIP ready | ~50+ |
| Tourism Observatory | ZIP ready | ~50+ |
| Travel Agencies | In Money Matrix | ~100+ |
| Tour Operators/DMCs | In Money Matrix | ~100+ |
| Destinations/DMOs | In Money Matrix | ~100+ |
| Resorts | In Money Matrix | ~100+ |
| Associations | In Money Matrix | ~50+ |

**Location:** `projects/traveltech-digital/products/prompt-packs/`

**Current Variable Format:** `[My business is]` → needs standardization to `{{business_name}}`

### 5.4 Learning Resources (Cross-Segment)

| Resource | Type | Status | Description |
|----------|------|--------|-------------|
| **AI Tutor** | Custom GPT (external) | ✅ Published | Meta-expert that teaches HOW to use AI effectively. 18 structured documents covering persona, context gates, modes of operation, tool playbooks. |
| **Personalization Guide** | Guide (PDF/link) | ✅ Ready | Step-by-step guide to set up ChatGPT with Custom Instructions, Memory, Business Profile. 6 documents with setup checklist. |

**AI Tutor Content (18 docs):**
- Tutor Persona & User Profile
- Smart Context Gate
- Modes of Operation
- Playbook of ChatGPT Tools & Capabilities
- Response Templates
- Standard Phrases & Micro-Explanations
- Quality & Specificity Standards
- Perfect Execution Examples
- Travel Tech Digital & GPT Travel System Overview
- Operating Principles
- Prompt Recognition & Execution Protocols (5 modules)
- Master Index & Priority Resolver

**Personalization Guide Content (6 docs):**
- Overview & Goals
- Define Your Custom Instructions
- Prompts for Basic Personalization
- Advanced Personalization
- ChatGPT Memory
- Setup Checklist

**Location:** `projects/traveltech-digital/products/ai-tutor/` and `products/personalization-guide/`

### 5.5 Expert Images

**Location:** `projects/traveltech-digital/products/gpt-experts-icons/`
**Count:** ~65+ humanized avatars
**Style:** Ultra-realistic, globally diverse

### 5.6 Languages Available

| Language | Code | Content Status | UI Status |
|----------|------|----------------|-----------|
| English | EN | Complete | Primary (canonical) |
| Portuguese | PT | Complete | Ready |
| Spanish | ES | Complete | Ready |
| French | FR | Complete | Ready |
| German | DE | Complete | Ready |
| Italian | IT | Complete | Ready |
| Arabic | AR | Not started | RTL needed |

**Note:** Translations done via Notion AI - may need review

---

## 6. Content Workflow

### 6.1 Notion → Export → Platform

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CONTENT WORKFLOW                                    │
│                                                                             │
│   ┌─────────────┐      ┌─────────────┐      ┌─────────────────────────┐   │
│   │   NOTION    │      │   EXPORT    │      │      PLATFORM           │   │
│   │   (Editor)  │  →   │   (Script)  │  →   │      (Renders)          │   │
│   │             │      │             │      │                         │   │
│   │ • Edit MD   │      │ • Notion API│      │ • Apply Business DNA    │   │
│   │ • Organize  │      │ • Transform │      │ • Substitute {{vars}}   │   │
│   │ • Collaborate│     │ • Validate  │      │ • Professional UI       │   │
│   │ • Translate │      │ • Publish   │      │ • Gate by product       │   │
│   └─────────────┘      └─────────────┘      └─────────────────────────┘   │
│                                                                             │
│   You work here         Automatic           End user sees                  │
│   (comfortable)         (1 command)         professional product           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Sync Script Features

```javascript
// sync-notion.js responsibilities:
1. Fetch content from Notion via API
2. Transform to standardized format
3. Standardize variables: [Business Name] → {{business_name}}
4. Validate structure and required fields
5. Validate i18n rules (see Section 7)
6. Save as JSON/MD to content folder
7. Block deploy if validation fails
8. Trigger Vercel deploy (automatic)
```

### 6.3 Content Validation Suite (Epic 0)

**Validation runs BEFORE any deploy:**

| Check | Rule | Action if Fail |
|-------|------|----------------|
| Variable format | Must be `{{snake_case}}` | Block deploy |
| Variable consistency | Same variables in all languages | Block deploy |
| Variable translation | Variables must NOT be translated | Block deploy |
| Required fields | title, template present | Block deploy |
| Segment assignment | Every prompt has segment | Block deploy |
| Growth vertical | Every prompt has vertical | Block deploy |

### 6.4 Content Folder Structure

```
projects/traveltech-aios/
├── content/                    ← Exported from Notion
│   ├── experts/
│   │   ├── en/
│   │   │   ├── hotel-management-expert.json
│   │   │   └── ...
│   │   ├── pt/
│   │   └── ...
│   ├── prompts/
│   │   ├── hotels/
│   │   ├── agencies/
│   │   └── ...
│   ├── tools/
│   ├── trails/
│   └── resources/
│       ├── ai-tutor.json       ← Link to Custom GPT
│       └── personalization-guide.json
├── scripts/
│   ├── sync-notion.js
│   └── validate-content.js
├── src/
└── docs/
    └── prd.md
```

---

## 7. i18n Governance (Critical)

### 7.1 Core Rules

| Rule | Description |
|------|-------------|
| **English is canonical** | All content is created in EN first |
| **Translations are static** | Generated ONCE, not on every request |
| **Variables never translate** | `{{business_name}}` stays `{{business_name}}` in all languages |
| **DNA values inject dynamically** | Only the VALUES are localized, not variable names |

### 7.2 Variable Validation Rules

```
✅ Correct:
EN: "Welcome to {{business_name}} in {{location}}"
PT: "Bem-vindo ao {{business_name}} em {{location}}"
ES: "Bienvenido a {{business_name}} en {{location}}"

❌ Wrong (variable translated):
FR: "Bienvenue à {{nom_entreprise}} à {{emplacement}}"

❌ Wrong (variable missing):
DE: "Willkommen bei in {{location}}"

❌ Wrong (extra variable):
IT: "Benvenuto a {{business_name}} in {{location}} - {{extra}}"
```

### 7.3 Validation Automation

```javascript
// validate-i18n.js
function validateTranslation(enContent, translatedContent, lang) {
  const enVars = extractVariables(enContent);      // ["business_name", "location"]
  const transVars = extractVariables(translatedContent);

  if (!arraysEqual(enVars, transVars)) {
    throw new Error(`${lang}: Variable mismatch. Expected ${enVars}, got ${transVars}`);
  }
  return true;
}
```

### 7.4 Fallback Strategy

| Scenario | Behavior |
|----------|----------|
| Translation exists | Show translation |
| Translation missing | Show EN version |
| Translation outdated | Show existing (flag for review) |
| Variable missing | Block deploy (validation error) |

**Never:** Mix languages in the same card/screen.

---

## 8. Target Users & Segments

### 8.1 MVP Products (V1)

| Product | Segment | Priority | Content Ready |
|---------|---------|----------|---------------|
| **Agency AIOS** | Travel Agencies | P0 | Yes |
| **Hotel AIOS** | Hotels | P0 | Yes |
| **DMC AIOS** | Tour Operators / DMCs | P0 | Yes |
| **DMO AIOS** | Destinations / DMOs | P0 | Yes |

### 8.2 V2 Products (Post-ITB)

| Product | Segment |
|---------|---------|
| Resort AIOS | Resorts |
| Association AIOS | Tourism associations |
| Rental AIOS | Holiday Rentals (Airbnb/VRBO) |
| Guide AIOS | Tour Guides |

### 8.3 User Persona

**Primary User:** Tourism professional (owner in small business, manager in medium/large)

| Attribute | Description |
|-----------|-------------|
| Role | Business owner, Marketing Manager, Operations Manager |
| Age | 30-55 |
| Tech Level | Medium (WhatsApp, Instagram, basic tools) |
| Pain | Knows AI can help but doesn't know how to apply it |
| Goal | Improve marketing, sales, operations with AI |
| Device | Mobile-first (always on the move) |
| Language | English primary, local language secondary |

---

## 9. Requirements

### 9.1 Key Performance Indicator (North Star)

**Time to First Personalized Prompt: < 3 minutes on mobile**

Definition:
> A user who just purchased a product can: enter → provide minimum DNA (name + location) → see a prompt that clearly shows their business name and location → in less than 3 minutes, on mobile.

Everything that doesn't contribute to this is not P0.

### 9.2 Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| **FR1** | Authentication with signup/login via Supabase Auth | P0 | Product ID from purchase |
| **FR2** | DNA collection (4 mandatory fields) on first login | P0 | Name, Location, Audience, Tone, Goal |
| **FR3** | Prompt Library with filters by Growth Vertical (9 categories) | P0 | Cards + detail pages |
| **FR4** | GPT Experts catalog with humanized avatars and external links | P0 | Links to Custom GPTs |
| **FR5** | GPT Tools catalog with external links | P0 | Links to Custom GPTs |
| **FR6** | Automatic `{{DNA}}` variable substitution in prompts | P0 | Replace with user data |
| **FR7** | Pre-defined Growth Trails (static sequence of prompts) | P0 | Shared across segments, DNA adapts |
| **FR8** | Learning Resources section (AI Tutor, Personalization Guide) | P0 | External links |
| **FR9** | Favorites system for prompts, experts, and tools | P1 | Star/save functionality |
| **FR10** | Full internationalization (7 languages) | P0 | EN base, static translations |
| **FR11** | Sales landing page with clear value proposition | P0 | traveltech.digital/store |
| **FR12** | Stripe checkout with product-based pricing | P0 | 15-day trial, auto-charge |
| **FR13** | User profile with DNA editing and export capability | P1 | Export for other AIs |
| **FR14** | Docs/Templates section with DNA-based generation | P1 | Copy-paste templates |
| **FR15** | Scripts/Messages section with DNA-based generation | P1 | Copy-paste scripts |
| **FR16** | Notion sync script with content validation | P0 | Block deploy on validation fail |
| **FR17** | Chatbase integration for support bot | P1 | Existing account |

### 9.3 Non-Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| **NFR0** | Time to First Prompt < 3 minutes on mobile | P0 | North Star KPI |
| **NFR1** | Mobile-first design - 100% functional on mobile | P0 | Primary use case |
| **NFR2** | Page load time < 3s on 4G connection | P1 | Performance |
| **NFR3** | Complete content isolation by product | P0 | User never sees other products |
| **NFR4** | UI inspired by Notion + Microsoft Copilot | P1 | Clean, minimalist, low cognitive load |
| **NFR5** | Dark/Light mode toggle | P1 | User preference |
| **NFR6** | Basic RTL support for Arabic | P1 | CSS dir="rtl" |
| **NFR7** | Cinematic travel imagery on entry | P2 | Unsplash, random exotic photos |
| **NFR8** | Humanized expert avatars (global diversity) | P1 | Already generated |

### 9.4 Compatibility Requirements

| ID | Requirement |
|----|-------------|
| **CR1** | React + TypeScript + Vite + Tailwind (existing stack) |
| **CR2** | Content synced from Notion via export script |
| **CR3** | Supabase for auth, database, storage |
| **CR4** | Stripe for payments (existing account, production ready) |
| **CR5** | Vercel for hosting (needs project setup) |
| **CR6** | WordPress + Divi for main site (existing) |

---

## 10. User Interface

### 10.1 Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Mobile First** | Design for phones, adapt for desktop |
| **One Action Per Screen** | Clear CTAs, no cognitive overload |
| **Always "Continue"** | Execution-oriented, not exploration |
| **Product Exclusivity** | User feels "this was made for my business" |
| **Low Cognitive Load** | Simple buttons, filters, cards, clear hierarchy |
| **Notion-Inspired** | Familiar UX for content navigation |

### 10.2 Navigation Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🏠 Home      │  📚 Library   │  🎯 Trails    │  ⚙️ Profile               │
│  (Active      │  (Browse      │  (Growth      │  (DNA, Settings,          │
│   Trail)      │   Content)    │   Plans)      │   Export)                 │
└─────────────────────────────────────────────────────────────────────────────┘

Library Tabs:
├── GPT Experts [filter: Growth Vertical]
├── GPT Tools [filter: Growth Vertical]
├── Prompts [filter: Growth Vertical]
├── Docs/Templates
├── Scripts/Messages
├── 📚 Resources (AI Tutor, Guides)
└── ⭐ Favorites
```

### 10.3 Key Screens

| Screen | Purpose | Priority |
|--------|---------|----------|
| Landing Page | Convert visitors (per product) | P0 |
| Checkout | Stripe payment (product selection) | P0 |
| First Login | DNA collection (4 fields) | P0 |
| Home/Dashboard | My products + active trail | P0 |
| Library | Browse prompts, experts, tools | P0 |
| Prompt Detail | View prompt + copy with DNA | P0 |
| Expert Detail | View expert + sections + prompts | P0 |
| Resources | AI Tutor link, Personalization Guide | P0 |
| Trail View | Step-by-step guide | P0 |
| Profile | Edit DNA, export, settings | P1 |

### 10.4 Dashboard Layout (My Products)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  app.traveltech.digital                                    [EN ▼] [👤]     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  👋 Welcome back, {{business_name}}                                        │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ 📦 MY PRODUCTS                                                        │ │
│  │                                                                       │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │ │
│  │  │ 🏨              │  │ 🔧              │  │ ➕              │      │ │
│  │  │ Hotel AIOS      │  │ Marketing       │  │                 │      │ │
│  │  │ Full Access     │  │ Tools           │  │ Add More        │      │ │
│  │  │                 │  │                 │  │ Products        │      │ │
│  │  │ [Open →]        │  │ [Open →]        │  │ [Browse Store]  │      │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘      │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ 🎯 CONTINUE YOUR TRAIL                                                │ │
│  │                                                                       │ │
│  │  Marketing Optimization Trail                          Step 3 of 7   │ │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░░░░░░░░░░░░   43%            │ │
│  │                                                                       │ │
│  │  Next: Create your social media content calendar                      │ │
│  │  [Continue →]                                                         │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ 💡 UPGRADE SUGGESTION                                                 │ │
│  │                                                                       │ │
│  │  You have Hotel Experts. Get Hotel AIOS for Prompts + Trails + SOPs  │ │
│  │  Save 40% compared to buying separately.  [See Offer →]               │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│  🏠 Home     │  📚 Library    │  🎯 Trails     │  ⚙️ Profile               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.5 Product-Specific Library View

When user opens a product (e.g., "Hotel AIOS"), they see only content included in that product:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ← Back     Hotel AIOS Library                             [EN ▼] [👤]     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [👥 Experts] [💬 Prompts] [🔧 Tools] [🎯 Trails] [📋 SOPs] [📚 Resources] │
│                                                                             │
│  Filter by Growth Vertical:                                                 │
│  [All] [Revenue] [Marketing] [Operations] [Guest Service] [HR] [Finance]   │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ 👤 Revenue Manager Expert                                          │    │
│  │ Optimize pricing, forecasting, and yield management                │    │
│  │                                                                    │    │
│  │ [Open GPT ↗]                                      [View Prompts →] │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ 👤 Digital Marketing Expert                                        │    │
│  │ SEO, social media, email campaigns for hotels                      │    │
│  │                                                                    │    │
│  │ [Open GPT ↗]                                      [View Prompts →] │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│  🏠 Home     │  📚 Library    │  🎯 Trails     │  ⚙️ Profile               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.6 Visual Style

| Element | Specification |
|---------|---------------|
| **Overall** | Tech/modern, clean, minimalist, tourism connection |
| **Reference** | Notion UX + Microsoft Copilot aesthetics |
| **Colors** | From traveltech.digital brand |
| **Mode** | Dark/Light toggle |
| **Imagery** | Cinematic travel photos (Unsplash) |
| **Avatars** | Ultra-realistic, globally diverse (existing) |
| **Typography** | Clean sans-serif, readable on mobile |
| **Cards** | Clear hierarchy, easy scanning |
| **Filters** | Visible, accessible, not hidden in menus |

---

## 11. Technical Architecture

### 11.1 Stack

| Layer | Technology | Status |
|-------|------------|--------|
| Frontend | React + TypeScript | Existing prototype |
| Build | Vite | Existing |
| Styling | Tailwind CSS | Existing |
| Icons | Lucide | Existing |
| Backend | Supabase | Account exists, project needed |
| Auth | Supabase Auth | To implement |
| Database | Supabase PostgreSQL | To implement |
| Storage | Supabase Storage | For avatars, images |
| Payments | Stripe | Account ready, production |
| i18n | i18next | To implement |
| Hosting | Vercel | Project needed |
| Support Bot | Chatbase | Account exists |
| Content Sync | Custom script | To build |

### 11.2 Infrastructure

| Service | Domain/URL | Status |
|---------|------------|--------|
| Main Site | traveltech.digital | WordPress + Divi, exists |
| Store | traveltech.digital/store | WordPress, exists |
| Platform | app.traveltech.digital | To deploy on Vercel |
| Supabase | (auto-generated) | Region: TBD (global) |

### 11.3 Database Schema

```sql
-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

-- Users (linked to Stripe customer)
users (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  stripe_customer_id text,
  language text DEFAULT 'en',
  created_at timestamp DEFAULT now()
)

-- ============================================================================
-- MODULAR PRODUCT ARCHITECTURE (v3.1)
-- ============================================================================

-- Products catalog (mirrors Stripe products)
products (
  id text PRIMARY KEY,                    -- 'hotel-aios', 'hotel-experts', etc.
  name text NOT NULL,
  type text NOT NULL,                     -- 'bundle' or 'standalone'
  segment text,                           -- 'hotel', 'agency', 'dmc', 'dmo', 'all'
  price_type text NOT NULL,               -- 'subscription' or 'one_time'
  stripe_product_id text,
  stripe_price_id text,
  created_at timestamp DEFAULT now()
)

-- What each product grants access to
product_access (
  product_id text REFERENCES products(id),
  content_type text NOT NULL,             -- 'experts', 'prompts', 'tools', 'trails', 'sops', 'tutor'
  segment_filter text,                    -- 'hotel', 'agency', 'all', null (null = all)
  PRIMARY KEY (product_id, content_type, segment_filter)
)

-- User's purchased products
user_products (
  user_id uuid REFERENCES users(id),
  product_id text REFERENCES products(id),
  status text NOT NULL DEFAULT 'active',  -- 'active', 'expired', 'cancelled'
  stripe_subscription_id text,            -- null for one-time purchases
  purchased_at timestamp DEFAULT now(),
  expires_at timestamp,                   -- null = lifetime/subscription
  purchased_from text,                    -- 'landing', 'upsell', 'checkout' (for analytics)
  PRIMARY KEY (user_id, product_id)
)

-- ============================================================================
-- EXAMPLE DATA: INITIAL PRODUCT CATALOG
-- ============================================================================

-- Products
-- INSERT INTO products VALUES
-- ('hotel-aios', 'Hotel AIOS', 'bundle', 'hotel', 'subscription', 'prod_xxx', 'price_xxx'),
-- ('agency-aios', 'Agency AIOS', 'bundle', 'agency', 'subscription', 'prod_xxx', 'price_xxx'),
-- ('dmc-aios', 'DMC AIOS', 'bundle', 'dmc', 'subscription', 'prod_xxx', 'price_xxx'),
-- ('dmo-aios', 'DMO AIOS', 'bundle', 'dmo', 'subscription', 'prod_xxx', 'price_xxx'),
-- ('hotel-experts', 'Hotel GPT Experts', 'standalone', 'hotel', 'one_time', 'prod_xxx', 'price_xxx'),
-- ('hotel-prompts', 'Hotel Prompt Pack', 'standalone', 'hotel', 'one_time', 'prod_xxx', 'price_xxx'),
-- ('marketing-tools', 'Marketing Tools', 'standalone', 'all', 'one_time', 'prod_xxx', 'price_xxx');

-- Product Access (what each product includes)
-- INSERT INTO product_access VALUES
-- Hotel AIOS bundle includes everything for hotel segment
-- ('hotel-aios', 'experts', 'hotel'),
-- ('hotel-aios', 'prompts', 'hotel'),
-- ('hotel-aios', 'tools', 'all'),
-- ('hotel-aios', 'trails', 'hotel'),
-- ('hotel-aios', 'sops', 'hotel'),
-- ('hotel-aios', 'tutor', 'all'),
-- Standalone products include only their specific content
-- ('hotel-experts', 'experts', 'hotel'),
-- ('hotel-prompts', 'prompts', 'hotel'),
-- ('marketing-tools', 'tools', 'all');

-- ============================================================================
-- BUSINESS DNA
-- ============================================================================

business_dna (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) UNIQUE,
  -- Mandatory fields (Day 0)
  business_name text NOT NULL,
  location text NOT NULL,                 -- "City, Country"
  target_audience text NOT NULL,
  tone text NOT NULL,
  primary_goal text NOT NULL,
  -- Optional fields (progressive profiling)
  usp text,
  team_size text,
  current_tools text,
  challenges text,
  segment_specific jsonb,
  updated_at timestamp DEFAULT now()
)

-- ============================================================================
-- USER PROGRESS & PREFERENCES
-- ============================================================================

-- Content is stored as JSON files, not in database
-- Database only tracks user interactions

user_favorites (
  user_id uuid REFERENCES users(id),
  item_type text NOT NULL,                -- 'expert', 'tool', 'prompt', 'trail'
  item_id text NOT NULL,                  -- matches content JSON id
  created_at timestamp DEFAULT now(),
  PRIMARY KEY (user_id, item_type, item_id)
)

trail_progress (
  user_id uuid REFERENCES users(id),
  trail_id text NOT NULL,
  current_step int DEFAULT 0,
  completed_steps int[] DEFAULT '{}',
  started_at timestamp DEFAULT now(),
  PRIMARY KEY (user_id, trail_id)
)
```

### 11.4 Gating Logic (Centralized)

**Single function controls all access decisions.** This simplifies testing and ensures consistent behavior.

```typescript
// Access control (server-side) - SINGLE SOURCE OF TRUTH
async function hasAccess(
  userId: string,
  contentType: 'experts' | 'prompts' | 'tools' | 'trails' | 'sops' | 'tutor',
  segment: string
): Promise<boolean> {

  // 1. Get user's active products
  const userProducts = await db.query(`
    SELECT product_id FROM user_products
    WHERE user_id = $1
    AND status = 'active'
    AND (expires_at IS NULL OR expires_at > NOW())
  `, [userId]);

  if (userProducts.length === 0) return false;

  // 2. Check if any product grants access to this content
  const access = await db.query(`
    SELECT 1 FROM product_access
    WHERE product_id = ANY($1)
    AND content_type = $2
    AND (segment_filter = $3 OR segment_filter = 'all' OR segment_filter IS NULL)
    LIMIT 1
  `, [userProducts.map(p => p.product_id), contentType, segment]);

  return access.length > 0;
}

// Usage examples:
await hasAccess(userId, 'experts', 'hotel')   // true if has hotel-aios OR hotel-experts
await hasAccess(userId, 'prompts', 'hotel')   // true if has hotel-aios OR hotel-prompts
await hasAccess(userId, 'tools', 'marketing') // true if has ANY aios OR marketing-tools
await hasAccess(userId, 'tutor', 'all')       // true if has ANY aios bundle

// Middleware for protected routes
async function requireAccess(contentType: string, segment: string) {
  return async (req, res, next) => {
    const userId = req.user.id;
    if (await hasAccess(userId, contentType, segment)) {
      next();
    } else {
      res.status(403).json({
        error: 'Access denied',
        upgrade_url: `/upgrade?content=${contentType}&segment=${segment}`
      });
    }
  };
}
```

**Benefits of centralized gating:**
- One function to test, not dozens of conditionals
- Easy to add caching (Redis/memory) for performance
- Clear upgrade path when access denied
- Analytics-friendly (can log all access checks)

### 11.5 Stripe Webhook Integration

```typescript
// POST /api/webhooks/stripe
async function handleStripeWebhook(req: Request) {
  const event = stripe.webhooks.constructEvent(
    req.body,
    req.headers['stripe-signature'],
    process.env.STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.client_reference_id;  // Passed from checkout
      const productId = session.metadata.product_id;
      const isSubscription = session.mode === 'subscription';

      // Create user_products record
      await db.query(`
        INSERT INTO user_products (user_id, product_id, status, stripe_subscription_id, expires_at, purchased_from)
        VALUES ($1, $2, 'active', $3, $4, $5)
        ON CONFLICT (user_id, product_id) DO UPDATE SET
          status = 'active',
          stripe_subscription_id = EXCLUDED.stripe_subscription_id,
          expires_at = EXCLUDED.expires_at
      `, [
        userId,
        productId,
        isSubscription ? session.subscription : null,
        isSubscription ? null : addMonths(new Date(), 12),  // One-time = 12 months
        session.metadata.purchased_from || 'checkout'
      ]);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await db.query(`
        UPDATE user_products SET status = 'cancelled'
        WHERE stripe_subscription_id = $1
      `, [subscription.id]);
      break;
    }

    case 'invoice.payment_failed': {
      // Handle failed payment (grace period, notifications, etc.)
      break;
    }
  }

  return { received: true };
}
```

### 11.6 Checkout Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STRIPE CHECKOUT FLOW                                │
│                                                                             │
│  1. LANDING PAGE                                                            │
│     traveltech.digital/products/hotel-aios                                  │
│     └── Button: "Start Free Trial" or "Buy Now"                             │
│         └── Creates Stripe Checkout Session with:                           │
│             • price_id (from products table)                                │
│             • client_reference_id (user_id if logged in)                    │
│             • metadata.product_id = 'hotel-aios'                            │
│             • metadata.purchased_from = 'landing'                           │
│             • success_url = app.traveltech.digital/welcome                  │
│             • cancel_url = traveltech.digital/products/hotel-aios           │
│                                                                             │
│  2. STRIPE CHECKOUT                                                         │
│     checkout.stripe.com/...                                                 │
│     └── User enters payment info                                            │
│     └── For subscriptions: 15-day trial, then auto-charge                   │
│                                                                             │
│  3. WEBHOOK (checkout.session.completed)                                    │
│     └── Creates user if new (from Stripe customer email)                    │
│     └── Creates user_products record                                        │
│     └── Sends welcome email                                                 │
│                                                                             │
│  4. SUCCESS PAGE                                                            │
│     app.traveltech.digital/welcome                                          │
│     └── If new user: DNA collection flow                                    │
│     └── If existing user: Redirect to dashboard                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.7 Content JSON Schema

```typescript
// Expert
interface Expert {
  id: string;
  slug: string;
  team: string;
  role: string;
  expertise: string;
  gptLink: string;
  avatarUrl: string;
  products: string[];  // ['hotel-aios', 'agency-aios']
  translations: {
    [lang: string]: {
      name: string;
      description: string;
      sections: {
        orientationEducation: Prompt[];
        optimizationSteps: OptimizationPhase[];
        routinesProcess: Prompt[];
        growthTactics: Prompt[];
        essentialDocuments: Prompt[];
        commonTasks: TaskCategory[];
      };
    };
  };
}

// Prompt
interface Prompt {
  id: string;
  product: string;  // 'hotel-aios'
  growthVertical: string;
  category: string;
  translations: {
    [lang: string]: {
      title: string;
      problem: string;
      task: string;
      moreInfo: string;
      template: string;  // with {{variables}}
      tips: string;
    };
  };
}

// Resource (AI Tutor, Guide)
interface Resource {
  id: string;
  type: 'gpt' | 'guide' | 'pdf';
  products: string[];  // ['all'] for cross-segment
  externalUrl: string;
  translations: {
    [lang: string]: {
      title: string;
      description: string;
    };
  };
}

// Trail
interface Trail {
  id: string;
  products: string[];
  translations: {
    [lang: string]: {
      title: string;
      objective: string;
      duration: string;
      definitionOfDone: string;
    };
  };
  steps: {
    order: number;
    promptId: string;
    description: string;
    estimatedTime: string;
  }[];
}
```

---

## 12. Epic Structure (Revised Sequence)

### Epic 0: Content Validation (Days 1-2)

**Goal:** Validation suite ready before any UI work

| Story | Description | Points |
|-------|-------------|--------|
| 0.1 | Create content validation script | 3 |
| 0.2 | Implement variable format checker | 2 |
| 0.3 | Implement i18n consistency checker | 3 |
| 0.4 | Setup CI to block deploy on validation fail | 2 |
| 0.5 | Validate existing content, fix issues | 3 |

### Epic 1: Foundation + Stripe (Days 3-7)

**Goal:** Core infrastructure including payments ready

| Story | Description | Points |
|-------|-------------|--------|
| 1.1 | Setup Supabase project (auth + database) | 3 |
| 1.2 | Create database schema and migrations | 5 |
| 1.3 | Setup Vercel project and deployment | 2 |
| 1.4 | Implement Stripe checkout integration | 5 |
| 1.5 | Implement trial logic (15 days, auto-charge) | 3 |
| 1.6 | Implement access_expires_at for one-time products | 2 |
| 1.7 | Implement gating logic (server-side) | 3 |
| 1.8 | Setup i18n infrastructure (i18next + 7 languages) | 5 |

### Epic 2: Auth + DNA (Days 8-11)

**Goal:** User can login and configure DNA

| Story | Description | Points |
|-------|-------------|--------|
| 2.1 | Implement authentication flow (signup/login/logout) | 5 |
| 2.2 | Create DNA collection flow (4 mandatory fields) | 5 |
| 2.3 | Implement DNA storage and retrieval | 3 |
| 2.4 | Connect auth to Stripe customer | 3 |
| 2.5 | Implement product-based access control | 3 |

### Epic 3: Content Library (Days 12-16)

**Goal:** User can browse and use prompts, experts, tools

| Story | Description | Points |
|-------|-------------|--------|
| 3.1 | Create Notion sync script | 5 |
| 3.2 | Create Library page with Growth Vertical filters | 5 |
| 3.3 | Implement Expert cards and detail pages (with sections) | 8 |
| 3.4 | Implement Prompt cards and detail pages | 5 |
| 3.5 | Implement Tools cards and pages | 3 |
| 3.6 | Implement Resources section (AI Tutor, Guide links) | 2 |
| 3.7 | Implement `{{DNA}}` variable substitution | 3 |
| 3.8 | Add copy-to-clipboard functionality | 2 |
| 3.9 | Implement favorites system | 3 |

### Epic 4: Growth Trails (Days 17-19)

**Goal:** User can follow guided trails

| Story | Description | Points |
|-------|-------------|--------|
| 4.1 | Create Trails listing page | 3 |
| 4.2 | Implement Trail detail view with step sequence | 5 |
| 4.3 | Implement trail progress tracking | 3 |
| 4.4 | Connect trails to prompts with DNA substitution | 3 |
| 4.5 | Create initial trail content | 3 |

### Epic 5: Polish & Launch (Days 20-25)

**Goal:** Production-ready platform

| Story | Description | Points |
|-------|-------------|--------|
| 5.1 | Mobile responsiveness audit and fixes | 5 |
| 5.2 | Dark/Light mode implementation | 3 |
| 5.3 | Import and validate content for 4 products | 5 |
| 5.4 | Test all 7 languages | 3 |
| 5.5 | Integrate Chatbase support bot | 2 |
| 5.6 | Performance optimization | 3 |
| 5.7 | Bug fixes and QA | 5 |
| 5.8 | Production deployment | 2 |

---

## 13. Roadmap

### 13.1 MVP Timeline (25 Days to ITB Berlin)

```
Week 1 (Feb 7-13): Validation + Foundation + Stripe
├── Day 1-2: Content validation suite
├── Day 3-4: Supabase setup, schema, Vercel
├── Day 5-6: Stripe checkout, trial logic, gating
└── Day 7: i18n setup

Week 2 (Feb 14-20): Auth + DNA + Library
├── Day 8-9: Auth flow, DNA collection
├── Day 10-11: Notion sync, Library page
├── Day 12-13: Expert/Prompt pages, DNA substitution
└── Day 14: Resources, favorites, copy

Week 3 (Feb 21-27): Trails + Polish
├── Day 15-16: Trails UI + progress tracking
├── Day 17-18: Mobile audit, dark/light mode
├── Day 19-20: Content import, language testing
└── Day 21: Chatbase, performance

Week 4 (Feb 28 - Mar 2): QA + Launch
├── Day 22-23: Bug fixes, QA
├── Day 24: Final testing
└── Day 25: Production deployment

Mar 3-5: ITB Berlin
```

### 13.2 Post-MVP (V2)

| Feature | Priority | Notes |
|---------|----------|-------|
| 4 more products | High | Resort, Association, Rental, Guide |
| AI Mastery Module | High | Full AI Tutor integration, Personalization wizard |
| Admin panel | Medium | Manage content without code |
| Analytics dashboard | Medium | User behavior, popular content |
| DNA Export | Medium | Use DNA in other AI platforms |
| Webhook sync (Notion) | Medium | Auto-update on Notion changes |
| White-label infrastructure | Future | Multi-tenant, custom domains |

---

## 14. ITB Berlin Specifics

### 14.1 Event Details

| Item | Detail |
|------|--------|
| **Event** | ITB Berlin 2026 |
| **Dates** | March 3-5, 2026 |
| **Demo** | Live platform demonstration |
| **Support** | Chatbase bot |
| **Payment** | QR code → checkout page |
| **Languages** | English primary |

### 14.2 Booth Mode (Demo Flow)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ITB DEMO FLOW (< 3 minutes)                         │
│                                                                             │
│   1. APPROACH         2. IDENTIFY          3. DNA             4. WOW       │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐│
│   │ "What type  │    │ Show        │    │ "What's your│    │ Show prompt ││
│   │  of business│ →  │ product     │ →  │  hotel name │ →  │ with their  ││
│   │  do you     │    │ landing     │    │  and where  │    │ name +      ││
│   │  have?"     │    │ page        │    │  is it?"    │    │ location    ││
│   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘│
│                                                                             │
│   Visitor says       Demo account        2 quick fields     "This AI      │
│   "Hotel"            for that product    entered            knows MY      │
│                                                             business!"    │
│                                                                             │
│   5. EXPLORE         6. SHOW VALUE       7. CLOSE                          │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                   │
│   │ Browse      │    │ "You also   │    │ QR code     │                   │
│   │ Library     │ →  │  get AI     │ →  │ to purchase │                   │
│   │ + Experts   │    │  Tutor"     │    │ or trial    │                   │
│   └─────────────┘    └─────────────┘    └─────────────┘                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Points:**
- Segment (product) is identified by asking, not by UI selection
- DNA collection is just 2 fields for demo (name + location)
- WOW moment happens fast
- AI Tutor is a differentiator to show

### 14.3 Success Metrics

| Metric | Target |
|--------|--------|
| Trial signups during fair | 50+ |
| Paid subscriptions | 10+ |
| Demo completions | 100+ |
| Contact form submissions | 200+ |

---

## 15. Go/No-Go Criteria (Launch Definition)

### 15.1 The Final Test

> **Hand a mobile phone to a Hotel GM who bought Hotel AIOS.**
>
> If they can:
> 1. Enter the platform
> 2. Provide business name + location
> 3. See a prompt that clearly shows their business name and location
> 4. Copy something useful
>
> **In under 3 minutes**
>
> ✅ The product is ready.
>
> If not:
> ❌ The product is NOT ready.

### 15.2 Technical Checklist

| Requirement | Status |
|-------------|--------|
| Stripe checkout works | ⬜ |
| Trial auto-creates | ⬜ |
| DNA collection works | ⬜ |
| `{{variables}}` substitute correctly | ⬜ |
| Content loads for all 4 products | ⬜ |
| Mobile responsive | ⬜ |
| 7 languages load | ⬜ |
| Copy to clipboard works | ⬜ |
| Chatbase bot responds | ⬜ |

### 15.3 Content Checklist

| Requirement | Status |
|-------------|--------|
| All prompts have `{{business_name}}` | ⬜ |
| All prompts have `{{location}}` | ⬜ |
| Variable format standardized | ⬜ |
| EN translations complete | ⬜ |
| At least PT, ES working | ⬜ |
| AI Tutor link works | ⬜ |
| Expert GPT links work | ⬜ |

---

## 16. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Content not ready for 4 products | Low | High | Content already exists, just needs sync |
| Variable format inconsistency | Medium | Medium | Validation suite blocks deploy |
| i18n quality issues | Medium | Medium | Focus on EN/PT/ES, others best-effort |
| Arabic RTL complexity | Low | Low | Basic support only, full polish V2 |
| Stripe integration delays | Low | High | Moved to Epic 1, test early |
| Mobile responsiveness | Medium | High | Mobile-first development |
| Timeline slippage | Medium | High | Daily progress checks, scope cuts if needed |
| Notion API limits | Low | Medium | Cache content, batch requests |

---

## 17. Out of Scope (V1)

- AI Tutor as embedded chatbot (use external GPT link)
- White-label / multi-tenant
- Affiliate / reseller system
- Real-time Notion sync (webhook)
- Custom prompt creation by users
- Advanced analytics dashboard
- Video courses / LMS features
- Gamification
- Multiple pricing tiers per product
- Team/organization features (seats)
- API for third-party integrations
- Admin panel (manage via code/Notion)
- Segment switching (buy another product)

---

## 18. Open Questions (Resolved)

| Question | Resolution |
|----------|------------|
| Segments = Products? | YES - Each segment is a separate product |
| DNA mandatory fields? | Name, Location, Audience, Tone, Goal |
| When Stripe? | Epic 1 (Day 3-6) - not final |
| One-time expiration? | access_expires_at in DB (12 months default) |
| Variable translation? | NEVER - always English |
| Content validation? | Epic 0 - blocks deploy |
| AI Tutor integration? | V1: external GPT link, V2: module |
| Time to First Prompt? | < 3 minutes on mobile (North Star) |
| **Modular products?** | **YES - Bundles (AIOS) + Standalones (experts, prompts, tools)** |
| **User multi-product?** | **YES - User can buy multiple products, access accumulates** |
| **Adding new modules?** | **2 SQL queries, zero code changes** |
| **Gating logic?** | **Centralized hasAccess() function** |
| **Product links?** | **Each product has own landing page, one app for all** |

---

## 19. Team & Responsibilities

| Agent | Responsibilities |
|-------|------------------|
| **@pm (Morgan)** | PRD, roadmap, priorities, scope decisions |
| **@architect (Aria)** | Technical architecture, schema, integrations |
| **@dev (Dex)** | Implementation, sync script, UI components |
| **@analyst (Atlas)** | Market research, content organization |
| **@ux-design-expert** | Design system, UI/UX, Figma |
| **Thiago** | Business decisions, content, Notion management |

---

## 20. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-06 | Morgan (PM) + Thiago | Initial PRD |
| 2.0 | 2026-02-06 | Squad AIOS + Thiago | Complete revision: content inventory, workflow, monetization |
| 3.0 | 2026-02-06 | Squad AIOS + Thiago + AI Review | Major revision: Segment=Product model, DNA mandatory fields, Stripe to Epic 1, i18n governance, validation suite, AI Tutor integration, Go/No-Go criteria |
| 3.1 | 2026-02-09 | Squad AIOS + Thiago | **Modular Product Architecture**: Added sections 2.3-2.4 (product hierarchy, adding modules), section 3.5 (product catalog with bundles/standalones), updated database schema (products, product_access, user_products tables), centralized gating logic with hasAccess(), new dashboard layouts (10.4-10.5), product access matrix |

---

## 21. Next Steps

1. **@dev** - Setup content validation suite (Epic 0)
2. **@dev** - Setup Supabase project and schema
3. **@dev** - Implement Stripe checkout + trial logic
4. **@architect** - Review and validate technical architecture
5. **@ux-design-expert** - Create design system and key screens
6. **Thiago** - Prepare content in Notion for export
7. **@pm** - Create detailed stories for Epic 0 and Epic 1

---

*This PRD is a living document. Updates will be tracked in the Document History section.*

— Morgan, planejando o futuro 📊
