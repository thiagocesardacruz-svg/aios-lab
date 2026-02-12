# n8n Automations Design Document

**Travel Tech Digital - Growth Ops Automation Blueprint**

**Version:** 1.0.0
**Date:** 2026-02-12
**Author:** @automation-engineer
**Status:** Draft

---

## Executive Summary

This document defines 25 practical n8n automations across 5 operational areas for Travel Tech Digital (TTD), a tourism SaaS focused on hotels. The architecture leverages:

- **n8n** as the orchestration layer (MCP-enabled)
- **GoHighLevel** for CRM, funnels, and marketing automation (36+ MCP tools)
- **Supabase** for data persistence and real-time features
- **AIOS agents** for intelligent processing
- **Local tools** for zero-cost operations (whisper.cpp, Ollama, DuckDB)

### Tiered Agent Architecture

| Tier | Role | Examples | Cost Profile |
|------|------|----------|--------------|
| **Tier 0** | Diagnosis & Routing | Classify intent, route to specialist | Low (Haiku) |
| **Tier 1** | Execution | Execute workflows, call APIs | Medium (Sonnet) |
| **Tier 2** | Persistence & Learning | Store patterns, improve over time | Zero (Local) |

---

## Area 1: Sistema (Ops Management)

### 1.1 AIOS Health Monitor

**Purpose:** Monitor AIOS system health, detect anomalies, alert on issues.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Schedule (every 5 min) |
| **Complexity** | 4/10 |
| **Estimated ROI** | Prevent 2-3h downtime/month = ~EUR 50 saved |

**n8n Nodes:**
```
Schedule Trigger
  -> HTTP Request (ClickUp API - get tasks)
  -> HTTP Request (Supabase - health endpoint)
  -> Code (aggregate metrics)
  -> IF (anomaly detected?)
     -> Yes: Slack notification + ClickUp task
     -> No: Update DuckDB metrics
```

**Integration Points:**
- ClickUp API: Task status aggregation
- Supabase: Database health check
- Slack: Alert notifications
- DuckDB (local): Metrics persistence

---

### 1.2 Cost Guardian Automation

**Purpose:** Real-time budget monitoring with automatic SAFE MODE activation.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Webhook (cost event) + Schedule (hourly) |
| **Complexity** | 5/10 |
| **Estimated ROI** | Prevent EUR 50-100/month overspend |

**n8n Nodes:**
```
Webhook Trigger (cost event)
  -> Code (parse cost data)
  -> HTTP Request (ClickUp Goals API - update budget)
  -> IF (daily > EUR 15?)
     -> Yes: IF (daily > EUR 20?)
        -> Yes: Activate SAFE MODE
           -> Slack alert (urgent)
           -> Update .aios/config (safe_mode: true)
        -> No: Slack alert (warning)
     -> No: Log to DuckDB
```

**GHL Integration:**
- Pause high-cost campaigns when SAFE MODE active
- Resume when budget normalizes

---

### 1.3 Daily Standup Generator

**Purpose:** Auto-generate daily standup from git commits, ClickUp tasks, and costs.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Schedule (daily 9:00 AM) |
| **Complexity** | 6/10 |
| **Estimated ROI** | Save 30 min/day = EUR 100/month |

**n8n Nodes:**
```
Schedule Trigger (9:00 AM)
  -> HTTP Request (GitHub API - commits last 24h)
  -> HTTP Request (ClickUp API - completed tasks)
  -> HTTP Request (local script - cost summary)
  -> AI Agent (Ollama - summarize, EUR 0)
     OR Claude Haiku (if Ollama unavailable)
  -> Slack (post standup)
  -> HTTP Request (ClickUp - create standup task)
```

**Cost Optimization:**
- Use Ollama (local) for summarization = EUR 0
- Fallback to Haiku only if needed = EUR 0.001

---

### 1.4 SLA Monitor & Escalation

**Purpose:** Track SLA compliance, auto-escalate violations.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Schedule (every 15 min) |
| **Complexity** | 5/10 |
| **Estimated ROI** | Improve client satisfaction, reduce churn 5% |

**n8n Nodes:**
```
Schedule Trigger
  -> HTTP Request (ClickUp - tasks with due dates)
  -> Code (calculate SLA status)
  -> Filter (SLA at risk or violated)
  -> Switch (severity)
     -> Warning: Slack DM to owner
     -> Violation: Slack channel + ClickUp priority bump
     -> Critical: Slack + Email + Phone (Twilio)
```

---

### 1.5 Workflow Optimizer

**Purpose:** Analyze workflow execution metrics, suggest optimizations.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Schedule (weekly) |
| **Complexity** | 7/10 |
| **Estimated ROI** | 10-20% efficiency gain = EUR 50/month |

**n8n Nodes:**
```
Schedule Trigger (Sunday 8 PM)
  -> n8n API (get all workflow executions)
  -> Code (calculate metrics per workflow)
  -> AI Agent (Claude Sonnet - analyze patterns)
  -> Code (generate optimization report)
  -> Notion/ClickUp (create optimization tasks)
  -> Slack (weekly optimization digest)
```

---

## Area 2: Conteudo (Content Generation)

### 2.1 Blog Post Generator for Hotels

**Purpose:** Generate SEO-optimized blog posts for hotel marketing.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Webhook (content request) OR Schedule (2x/week) |
| **Complexity** | 7/10 |
| **Estimated ROI** | 4 posts/month x EUR 50/post = EUR 200 saved |

**n8n Nodes:**
```
Webhook Trigger (topic, hotel_id, target_keywords)
  -> HTTP Request (Supabase - get hotel data)
  -> AI Agent (Research - Perplexity/EXA)
     -> Search trending topics
     -> Competitor content analysis
  -> AI Agent (Writer - Claude Sonnet)
     -> Apply Hormozi hooks framework
     -> Apply Conley emotional journey
  -> AI Agent (SEO - Claude Haiku)
     -> Optimize meta, headers, keywords
  -> HTTP Request (GHL - create blog post)
  -> Slack (notify content team)
```

**Mind Clone Integration:**
- Hormozi DNA for hooks and CTAs
- Conley DNA for emotional hospitality angle
- Schrager DNA for visual storytelling prompts

---

### 2.2 Social Media Content Factory

**Purpose:** Generate and schedule social media content across platforms.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Schedule (daily) + Webhook (on-demand) |
| **Complexity** | 6/10 |
| **Estimated ROI** | 20 posts/week x EUR 10/post = EUR 800/month |

**n8n Nodes:**
```
Schedule Trigger (daily 6 AM)
  -> HTTP Request (Supabase - content calendar)
  -> AI Agent (Content Creator - Claude Haiku)
     -> Generate 5 variations per post
     -> Apply platform-specific formatting
  -> Loop (for each platform)
     -> IF Instagram: Generate image prompt -> DALL-E/Midjourney
     -> IF LinkedIn: Professional tone adjustment
     -> IF TikTok: Script with hooks
  -> HTTP Request (GHL - schedule social posts)
  -> HTTP Request (Buffer/Later - cross-post)
```

**GHL MCP Tools:**
- `create-post` - Schedule social media posts
- `get-posts` - Check existing content
- `get-social-media-statistics` - Performance tracking

---

### 2.3 Email Sequence Builder

**Purpose:** Generate nurture email sequences using copywriting frameworks.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Webhook (sequence request) |
| **Complexity** | 8/10 |
| **Estimated ROI** | 2 sequences/month x EUR 200 = EUR 400 saved |

**n8n Nodes:**
```
Webhook Trigger (sequence_type, audience, offer)
  -> HTTP Request (Supabase - get audience data)
  -> AI Agent (Strategist - Claude Sonnet)
     -> Determine sequence length
     -> Map customer journey stages
  -> Loop (for each email)
     -> AI Agent (Copywriter - applies framework)
        -> Email 1: Soap Opera Sequence (Chaperon)
        -> Email 2-4: Value + Story
        -> Email 5: Urgency CTA (Hormozi)
     -> Code (format HTML template)
  -> HTTP Request (GHL - create email templates)
  -> HTTP Request (GHL - create campaign)
```

**Frameworks Applied:**
- Andre Chaperon's Soap Opera Sequence
- Ben Settle's Infotainment style
- Hormozi's Hook-Meat-CTA structure

---

### 2.4 UGC Content Curator

**Purpose:** Collect, curate, and repurpose user-generated content.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Schedule (daily) + Webhook (mention detected) |
| **Complexity** | 6/10 |
| **Estimated ROI** | Increase engagement 20% = indirect revenue |

**n8n Nodes:**
```
Schedule Trigger (daily scan)
  -> HTTP Request (Apify - Instagram hashtag scraper)
  -> HTTP Request (Apify - TripAdvisor reviews)
  -> AI Agent (Curator - Claude Haiku)
     -> Score content quality (1-10)
     -> Extract key quotes
     -> Identify permission requirements
  -> Filter (score >= 7)
  -> HTTP Request (Supabase - store UGC library)
  -> IF (needs permission)
     -> HTTP Request (GHL - send permission request)
  -> Slack (daily UGC digest)
```

---

### 2.5 Content Repurposer

**Purpose:** Transform long-form content into multiple formats.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Webhook (source content URL) |
| **Complexity** | 7/10 |
| **Estimated ROI** | 10x content from 1 source = EUR 300/month |

**n8n Nodes:**
```
Webhook Trigger (content_url, content_type)
  -> Switch (content_type)
     -> Video: whisper.cpp transcription (local, EUR 0)
     -> PDF: pdf-extract.mjs (local, EUR 0)
     -> Blog: HTTP Request (fetch content)
  -> AI Agent (Repurposer - Claude Sonnet)
     -> Extract key points
     -> Generate: Twitter thread, LinkedIn post,
        Instagram carousel, Email snippet,
        Blog summary, Video script
  -> Loop (for each format)
     -> Code (format output)
     -> HTTP Request (save to content library)
  -> Slack (repurposed content ready)
```

---

## Area 3: Vendas (Sales)

### 3.1 Inbound Lead Triage

**Purpose:** Automatically qualify and route inbound leads.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Webhook (form submission) |
| **Complexity** | 6/10 |
| **Estimated ROI** | Reduce response time 80% = +15% conversion |

**n8n Nodes:**
```
Webhook Trigger (GHL form submission)
  -> Code (normalize lead data)
  -> AI Agent (Qualifier - Claude Haiku, Tier 0)
     -> Score lead (1-100)
     -> Classify: Hot/Warm/Cold
     -> Identify hotel type & size
  -> HTTP Request (GHL - upsert contact with score)
  -> Switch (lead_score)
     -> Hot (80+):
        -> GHL - add to "Sales Call" pipeline
        -> GHL - trigger instant callback workflow
        -> Slack - alert sales team
     -> Warm (50-79):
        -> GHL - add to "Nurture" sequence
        -> GHL - schedule follow-up task
     -> Cold (<50):
        -> GHL - add to "Education" drip
```

**GHL MCP Tools:**
- `upsert-contact` - Create/update lead
- `create-opportunity` - Add to pipeline
- `add-contact-to-workflow` - Trigger sequences
- `add-tags` - Categorize leads

---

### 3.2 Outbound Sequence Engine

**Purpose:** Multi-channel outbound sequences with AI personalization.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Schedule (daily) + Webhook (new prospect) |
| **Complexity** | 8/10 |
| **Estimated ROI** | 20% more meetings = EUR 500/month |

**n8n Nodes:**
```
Schedule Trigger (daily 9 AM)
  -> HTTP Request (Supabase - prospects for today)
  -> Loop (for each prospect)
     -> HTTP Request (Clay/Apollo - enrich data)
     -> AI Agent (Researcher - EXA search)
        -> Recent news about hotel
        -> LinkedIn activity
        -> Tech stack signals
     -> AI Agent (Personalizer - Claude Sonnet)
        -> Apply Keenan's Gap Selling framework
        -> Craft personalized hook
     -> Switch (sequence_day)
        -> Day 1: Email (GHL)
        -> Day 3: LinkedIn (Phantombuster)
        -> Day 5: Email follow-up (GHL)
        -> Day 7: Call task (GHL)
        -> Day 10: Video email (Loom API)
  -> HTTP Request (GHL - log activity)
  -> Code (update sequence status in Supabase)
```

**Elite Mind Clone Integration:**
- **Keenan (Gap Selling):** Problem-centric messaging
- **Braun:** Challenger approach for emails
- **Michael:** Enterprise discovery questions
- **Ross:** Predictable outreach cadence
- **Nelson:** Outbound system architecture

---

### 3.3 Meeting Prep Automation

**Purpose:** Generate comprehensive meeting prep docs before sales calls.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Schedule (1h before calendar event) |
| **Complexity** | 7/10 |
| **Estimated ROI** | Better close rate +10% = EUR 300/month |

**n8n Nodes:**
```
Schedule Trigger (every 30 min)
  -> HTTP Request (Google Calendar - upcoming meetings)
  -> Filter (sales meeting in next 60 min)
  -> Loop (for each meeting)
     -> HTTP Request (GHL - get contact details)
     -> HTTP Request (GHL - get opportunity history)
     -> HTTP Request (LinkedIn - company page via Apify)
     -> HTTP Request (EXA - recent news)
     -> HTTP Request (Supabase - previous interactions)
     -> AI Agent (Prep Generator - Claude Sonnet)
        -> Company summary
        -> Key stakeholders
        -> Potential pain points
        -> Recommended talking points
        -> Objection handling scripts
     -> HTTP Request (Notion - create prep doc)
     -> Slack DM (send prep link to rep)
```

---

### 3.4 Deal Velocity Tracker

**Purpose:** Monitor deal progression, alert on stalled opportunities.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Schedule (daily) |
| **Complexity** | 5/10 |
| **Estimated ROI** | Recover 2 deals/month = EUR 1,000 |

**n8n Nodes:**
```
Schedule Trigger (daily 8 AM)
  -> HTTP Request (GHL - get all opportunities)
  -> Code (calculate days in stage)
  -> Filter (stalled > threshold)
  -> AI Agent (Analyzer - Claude Haiku)
     -> Diagnose likely blockers
     -> Suggest next best action
  -> Loop (for each stalled deal)
     -> HTTP Request (GHL - add task for follow-up)
     -> Slack (alert account owner)
  -> Code (aggregate pipeline metrics)
  -> HTTP Request (DuckDB - store velocity data)
```

---

### 3.5 Win/Loss Analysis Automation

**Purpose:** Automatically analyze closed deals for patterns.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Webhook (opportunity status change to Won/Lost) |
| **Complexity** | 6/10 |
| **Estimated ROI** | Improve win rate 5% = EUR 500/month |

**n8n Nodes:**
```
Webhook Trigger (GHL opportunity webhook)
  -> Filter (status = Won OR Lost)
  -> HTTP Request (GHL - full opportunity details)
  -> HTTP Request (GHL - contact timeline)
  -> HTTP Request (Supabase - all interactions)
  -> AI Agent (Analyst - Claude Sonnet)
     -> Identify winning/losing patterns
     -> Time-to-close analysis
     -> Touchpoint effectiveness
     -> Competitive factors
  -> HTTP Request (Supabase - store analysis)
  -> IF (Lost)
     -> AI Agent (suggest improvement actions)
     -> ClickUp (create improvement task)
  -> Schedule (monthly: aggregate win/loss report)
```

---

## Area 4: Produtos (White-Label for Hotels)

### 4.1 Direct Booking Optimizer

**Purpose:** White-label product to increase direct bookings vs OTAs.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Webhook (booking inquiry) |
| **Complexity** | 8/10 |
| **Potential Revenue** | EUR 200-500/month per hotel client |

**n8n Nodes:**
```
Webhook Trigger (website inquiry)
  -> HTTP Request (GHL - create/update contact)
  -> AI Agent (Concierge - Claude Haiku)
     -> Understand inquiry intent
     -> Check availability (PMS API)
     -> Generate personalized response
  -> HTTP Request (GHL - send WhatsApp/Email)
  -> IF (booking intent high)
     -> Generate direct booking link with discount
     -> Track attribution (UTM)
  -> Schedule (follow-up sequence if no booking)
     -> Day 1: Price match guarantee
     -> Day 3: Room upgrade offer
     -> Day 5: Scarcity message
```

**Anti-OTA Features:**
- Real-time price matching
- Exclusive direct booking perks
- WhatsApp-first communication

---

### 4.2 Review Response Automation

**Purpose:** White-label review management for hotels.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Webhook (new review detected) |
| **Complexity** | 6/10 |
| **Potential Revenue** | EUR 100-200/month per hotel client |

**n8n Nodes:**
```
Schedule Trigger (every 2 hours)
  -> HTTP Request (Apify - TripAdvisor reviews)
  -> HTTP Request (Apify - Google Reviews)
  -> HTTP Request (Apify - Booking.com reviews)
  -> Loop (for each new review)
     -> AI Agent (Sentiment Analyzer - Haiku)
        -> Classify: Positive/Neutral/Negative
        -> Extract key themes
     -> Switch (sentiment)
        -> Positive:
           -> AI Agent (Thank you response - Haiku)
           -> Apply Conley hospitality voice
        -> Negative:
           -> AI Agent (Recovery response - Sonnet)
           -> Flag for human review
           -> Create recovery task
     -> HTTP Request (Supabase - store response draft)
     -> Slack (notify hotel manager for approval)
  -> After approval:
     -> HTTP Request (post response via platform API)
```

---

### 4.3 Guest Lifecycle Automation

**Purpose:** Complete guest journey automation from inquiry to loyalty.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Multiple (booking, check-in, check-out, anniversary) |
| **Complexity** | 9/10 |
| **Potential Revenue** | EUR 300-600/month per hotel client |

**n8n Nodes:**
```
Webhook Trigger (PMS event)
  -> Switch (event_type)
     -> BOOKING_CONFIRMED:
        -> AI Agent (generate confirmation email)
        -> GHL - send pre-arrival sequence
        -> Schedule check-in reminder
     -> CHECK_IN:
        -> AI Agent (welcome message)
        -> GHL - send WiFi/amenities info
        -> Schedule mid-stay check
     -> CHECK_OUT:
        -> Delay (2 hours)
        -> AI Agent (thank you + review request)
        -> GHL - trigger feedback survey
        -> Schedule loyalty offer
     -> ANNIVERSARY (stay anniversary):
        -> AI Agent (personalized offer)
        -> GHL - send special rate
```

**GHL Workflows Triggered:**
- Pre-arrival experience builder
- Mid-stay satisfaction check
- Post-stay review generation
- Loyalty program enrollment

---

### 4.4 Seasonal Campaign Generator

**Purpose:** Auto-generate seasonal marketing campaigns.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Schedule (60 days before season) |
| **Complexity** | 8/10 |
| **Potential Revenue** | EUR 200-400/month per hotel client |

**n8n Nodes:**
```
Schedule Trigger (calendar-based)
  -> Code (determine upcoming season/holiday)
  -> HTTP Request (Supabase - hotel profile & history)
  -> AI Agent (Campaign Strategist - Sonnet)
     -> Apply Hormozi Grand Slam Offer
     -> Create irresistible package
     -> Define urgency/scarcity
  -> AI Agent (Content Generator - Sonnet)
     -> Landing page copy
     -> Email sequence (5-7 emails)
     -> Social media posts (15-20)
     -> Ad creatives (10 variations)
  -> HTTP Request (GHL - create campaign)
  -> HTTP Request (GHL - schedule emails)
  -> HTTP Request (GHL - create landing page)
  -> Slack (campaign ready for review)
```

---

### 4.5 WhatsApp Concierge Bot

**Purpose:** AI-powered WhatsApp assistant for hotel guests.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Webhook (WhatsApp message via GHL) |
| **Complexity** | 9/10 |
| **Potential Revenue** | EUR 150-300/month per hotel client |

**n8n Nodes:**
```
Webhook Trigger (GHL conversation webhook)
  -> HTTP Request (GHL - get conversation history)
  -> AI Agent (Intent Classifier - Haiku, Tier 0)
     -> Categories: Booking, Info, Complaint,
        Request, General
  -> Switch (intent)
     -> BOOKING:
        -> AI Agent (Booking Assistant - Sonnet)
        -> Check availability
        -> Generate quote
        -> Send booking link
     -> INFO:
        -> AI Agent (Info Bot - Haiku)
        -> Query hotel knowledge base
        -> Respond with relevant info
     -> COMPLAINT:
        -> AI Agent (Recovery Specialist - Sonnet)
        -> Empathetic response
        -> Create urgent task for staff
        -> Escalate to human
     -> REQUEST:
        -> Create task in hotel PMS
        -> Confirm to guest
  -> HTTP Request (GHL - send response)
  -> HTTP Request (Supabase - log interaction)
```

---

## Area 5: Turismo (Tourism Vertical)

### 5.1 Destination Trend Analyzer

**Purpose:** Monitor and analyze tourism trends for destinations.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Schedule (weekly) |
| **Complexity** | 7/10 |
| **Estimated ROI** | Strategic insights = competitive advantage |

**n8n Nodes:**
```
Schedule Trigger (Monday 6 AM)
  -> HTTP Request (Google Trends API - destination searches)
  -> HTTP Request (EXA - travel news/articles)
  -> HTTP Request (Apify - Instagram hashtag volume)
  -> HTTP Request (Apify - TikTok trending sounds)
  -> AI Agent (Trend Analyst - Sonnet)
     -> Identify emerging destinations
     -> Seasonal pattern analysis
     -> Competitor positioning
     -> Content opportunity gaps
  -> Code (generate trend report)
  -> HTTP Request (Notion - save report)
  -> HTTP Request (GHL - update hotel clients)
  -> Slack (weekly trend digest)
```

---

### 5.2 Tourism Package Builder

**Purpose:** AI-assisted creation of tourism packages.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Webhook (package request) |
| **Complexity** | 8/10 |
| **Estimated ROI** | Faster package creation = more offerings |

**n8n Nodes:**
```
Webhook Trigger (destination, duration, audience)
  -> HTTP Request (EXA - destination attractions)
  -> HTTP Request (Apify - local experiences)
  -> HTTP Request (Supabase - supplier database)
  -> AI Agent (Package Architect - Sonnet)
     -> Apply Hormozi Value Equation
     -> Design itinerary
     -> Calculate pricing (3:1 value ratio)
     -> Create bonuses and guarantees
  -> AI Agent (Copywriter - Sonnet)
     -> Package name (Hormozi naming formula)
     -> Description with hooks
     -> FAQ generation
  -> HTTP Request (GHL - create package page)
  -> HTTP Request (Supabase - save package)
```

---

### 5.3 Multi-Property Coordinator

**Purpose:** Coordinate marketing across multiple hotel properties.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Schedule (daily) + Webhook (campaign request) |
| **Complexity** | 7/10 |
| **Estimated ROI** | Efficiency across portfolio |

**n8n Nodes:**
```
Webhook Trigger (campaign_type, properties[])
  -> HTTP Request (Supabase - get property profiles)
  -> AI Agent (Coordinator - Sonnet)
     -> Adapt campaign to each property
     -> Maintain brand consistency
     -> Localize messaging
  -> Loop (for each property)
     -> HTTP Request (GHL - get location context)
     -> AI Agent (Localizer - Haiku)
        -> Customize for local market
        -> Adjust pricing/offers
     -> HTTP Request (GHL - create campaign)
  -> Code (aggregate launch status)
  -> Slack (multi-property campaign launched)
```

---

### 5.4 OTA Rate Parity Monitor

**Purpose:** Monitor rate parity across OTAs and alert on violations.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Schedule (every 6 hours) |
| **Complexity** | 6/10 |
| **Estimated ROI** | Protect direct booking margins |

**n8n Nodes:**
```
Schedule Trigger (every 6 hours)
  -> HTTP Request (Supabase - hotels to monitor)
  -> Loop (for each hotel)
     -> HTTP Request (Apify - Booking.com rates)
     -> HTTP Request (Apify - Expedia rates)
     -> HTTP Request (hotel website - direct rate)
     -> Code (compare rates)
     -> IF (parity violation)
        -> HTTP Request (Supabase - log violation)
        -> Slack (alert revenue manager)
        -> HTTP Request (GHL - create task)
  -> Schedule (weekly parity report)
```

---

### 5.5 Tourism Event Calendar Sync

**Purpose:** Sync local events with marketing calendar.

| Attribute | Value |
|-----------|-------|
| **Trigger** | Schedule (weekly) |
| **Complexity** | 5/10 |
| **Estimated ROI** | Better event-based marketing |

**n8n Nodes:**
```
Schedule Trigger (Sunday 10 PM)
  -> HTTP Request (Eventbrite API - local events)
  -> HTTP Request (EXA - local event news)
  -> HTTP Request (city tourism board APIs)
  -> AI Agent (Event Curator - Haiku)
     -> Score relevance for hotels
     -> Identify marketing opportunities
     -> Suggest packages/promotions
  -> HTTP Request (Supabase - update event calendar)
  -> Loop (relevant events)
     -> HTTP Request (GHL - create campaign draft)
     -> HTTP Request (ClickUp - create marketing task)
  -> Slack (weekly event opportunities)
```

---

## Implementation Priority Matrix

| Priority | Automation | Area | Complexity | ROI | Dependencies |
|----------|------------|------|------------|-----|--------------|
| **P0** | Cost Guardian | Sistema | 5 | High | ClickUp, DuckDB |
| **P0** | Inbound Lead Triage | Vendas | 6 | High | GHL MCP |
| **P0** | Review Response | Produtos | 6 | High | Apify, GHL |
| **P1** | Daily Standup | Sistema | 6 | Medium | Ollama, ClickUp |
| **P1** | Outbound Sequence | Vendas | 8 | High | GHL, Clay |
| **P1** | Direct Booking | Produtos | 8 | High | GHL, PMS |
| **P1** | Blog Post Generator | Conteudo | 7 | Medium | GHL blogs |
| **P2** | Meeting Prep | Vendas | 7 | Medium | GHL, EXA |
| **P2** | Social Content Factory | Conteudo | 6 | Medium | GHL social |
| **P2** | Guest Lifecycle | Produtos | 9 | High | GHL, PMS |
| **P2** | WhatsApp Concierge | Produtos | 9 | High | GHL conversations |
| **P3** | All remaining | Various | 5-8 | Medium | Various |

---

## Cost Analysis

### Model Routing Strategy

| Task Type | Model | Cost per 1k tokens | Monthly Volume | Est. Cost |
|-----------|-------|-------------------|----------------|-----------|
| Classification | Haiku | EUR 0.0008 in / 0.004 out | 50k tokens | EUR 0.20 |
| Content Gen | Sonnet | EUR 0.003 in / 0.015 out | 200k tokens | EUR 3.60 |
| Complex Analysis | Opus | EUR 0.015 in / 0.075 out | 50k tokens | EUR 4.50 |
| Summarization | Ollama (local) | EUR 0 | 100k tokens | EUR 0 |
| **Total** | | | | **~EUR 8.30/month** |

### Local Tool Savings

| Tool | Use Case | API Alternative | Savings/month |
|------|----------|-----------------|---------------|
| whisper.cpp | Video transcription | Whisper API | EUR 15 |
| Ollama | Simple summarization | Claude Haiku | EUR 5 |
| DuckDB | Analytics queries | Supabase/Postgres | EUR 10 |
| pdftotext | PDF extraction | Document AI | EUR 5 |
| **Total** | | | **EUR 35/month** |

---

## Technical Requirements

### n8n Setup
```yaml
Version: 1.104+ (MCP support required)
Hosting: Self-hosted (recommended) or Cloud
Memory: 4GB minimum
Storage: 50GB for executions history
```

### Required Credentials
```yaml
GHL:
  - Private Integration Token (PIT)
  - Scopes: contacts, conversations, calendars,
    opportunities, workflows, emails, blogs, social

n8n MCP:
  - N8N_API_URL: https://your-instance.n8n.cloud
  - N8N_API_KEY: n8n_api_xxxxx

External APIs:
  - ClickUp API Key
  - Slack Bot Token
  - Google Calendar OAuth
  - Apify API Token
  - EXA API Key (in Docker MCP)
  - Clay API Key (optional)
```

### GHL MCP Tools Used

| Tool | Automations Using It |
|------|---------------------|
| `upsert-contact` | Lead Triage, Outbound, Guest Lifecycle |
| `create-opportunity` | Lead Triage, Deal Tracker |
| `add-contact-to-workflow` | All nurture automations |
| `create-message` | WhatsApp Concierge, Follow-ups |
| `get-conversations` | WhatsApp Concierge |
| `create-blog-post` | Blog Generator |
| `create-post` | Social Content Factory |
| `create-template` | Email Sequence Builder |
| `get-calendars` / `get-slots` | Meeting Prep |
| `update-opportunity` | Deal Velocity Tracker |

---

## Next Steps

1. **Phase 1 (Week 1-2):** Deploy P0 automations
   - Configure GHL MCP connection
   - Set up Cost Guardian
   - Deploy Inbound Lead Triage
   - Launch Review Response system

2. **Phase 2 (Week 3-4):** Deploy P1 automations
   - Build Outbound Sequence Engine
   - Create Direct Booking workflow
   - Set up Daily Standup automation

3. **Phase 3 (Week 5-8):** Deploy P2 automations
   - Full content generation suite
   - Guest Lifecycle automation
   - WhatsApp Concierge bot

4. **Phase 4 (Week 9-12):** Deploy P3 and optimize
   - Remaining automations
   - Performance optimization
   - A/B testing workflows

---

## References

- [n8n MCP Documentation](https://docs.n8n.io/advanced-ai/accessing-n8n-mcp-server/)
- [GoHighLevel MCP Server](https://marketplace.gohighlevel.com/docs/other/mcp/index.html)
- [AIOS Model Routing Rules](/.claude/rules/model-routing.md)
- [Local Tools Configuration](/squads/ops/config/local-tools.json)
- [Hotel Marketing Squad](/squads/hotel-mkt/config.yaml)
- [GHL Squad](/squads/ghl/squad.yaml)

---

*n8n Automations Design v1.0.0 - Travel Tech Digital Growth Ops*
*Generated by @automation-engineer - 2026-02-12*
