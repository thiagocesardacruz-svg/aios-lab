# Funnel Map Template

> Visual and structural mapping of marketing funnels.

## Funnel Overview

| Field | Value |
|-------|-------|
| **Funnel Name** | {funnel_name} |
| **Type** | {lead_magnet/webinar/sales/tripwire} |
| **Product** | {product_name} |
| **Price Point** | €{price} |
| **Target ICP** | {icp_name} |
| **Traffic Source** | {primary_traffic_source} |

---

## Funnel Flow Diagram

```
┌─────────────────┐
│   TRAFFIC       │
│  {source}       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   LANDING PAGE  │
│  Opt-in: {xx}%  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   THANK YOU     │
│  + Delivery     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌───────┐
│ Email │ │ Sales │
│Sequence│ │ Page  │
└───┬───┘ └───┬───┘
    │         │
    └────┬────┘
         │
         ▼
┌─────────────────┐
│    CHECKOUT     │
│  Conv: {xx}%    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    UPSELL       │
│  Take: {xx}%    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  CONFIRMATION   │
│  + Onboarding   │
└─────────────────┘
```

---

## Stage Details

### Stage 1: Traffic

| Source | Budget | Target |
|--------|--------|--------|
| {Facebook Ads} | €{budget} | {visitors} |
| {Google Ads} | €{budget} | {visitors} |
| {Organic} | €0 | {visitors} |

**Total Expected Visitors:** {number}

---

### Stage 2: Landing Page

**Page Type:** {opt_in/sales}

**Elements:**
- [ ] Headline
- [ ] Lead magnet description
- [ ] Opt-in form
- [ ] Social proof
- [ ] Trust badges

**Conversion Target:** {30}%

**Expected Opt-ins:** {number}

---

### Stage 3: Thank You / Delivery

**Purpose:** Deliver value, set expectations

**Elements:**
- [ ] Confirmation message
- [ ] Lead magnet delivery
- [ ] Next steps
- [ ] Soft upsell (optional)

---

### Stage 4: Email Sequence

| Email | Day | Subject | Purpose |
|-------|-----|---------|---------|
| 1 | 0 | {subject} | Welcome + delivery |
| 2 | 1 | {subject} | Quick win |
| 3 | 2 | {subject} | Story/value |
| 4 | 3 | {subject} | Soft pitch |
| 5 | 5 | {subject} | Hard pitch |
| 6 | 7 | {subject} | Last chance |

**Open Rate Target:** {40}%
**Click Rate Target:** {5}%

---

### Stage 5: Sales Page

**Page Type:** Long-form sales

**Sections:**
1. [ ] Hero + headline
2. [ ] Problem agitation
3. [ ] Solution introduction
4. [ ] Benefits breakdown
5. [ ] Social proof
6. [ ] Features/What's included
7. [ ] Guarantee
8. [ ] FAQ
9. [ ] Final CTA

**Conversion Target:** {5}%

**Expected Sales:** {number}

---

### Stage 6: Checkout

**Elements:**
- [ ] Order summary
- [ ] Payment options
- [ ] Guarantee reminder
- [ ] Trust seals

**Checkout Completion:** {70}%

---

### Stage 7: Upsell

**Offer:** {upsell_product}
**Price:** €{price}
**Take Rate Target:** {20}%

**Elements:**
- [ ] One-time offer headline
- [ ] Value stack
- [ ] Easy yes/no buttons

---

### Stage 8: Confirmation + Onboarding

**Elements:**
- [ ] Purchase confirmation
- [ ] Access instructions
- [ ] Next steps
- [ ] Support info
- [ ] Onboarding sequence trigger

---

## Metrics Dashboard

| Metric | Target | Actual |
|--------|--------|--------|
| Visitors | {n} | - |
| Opt-in Rate | {30}% | - |
| Email Open Rate | {40}% | - |
| Sales Page Views | {n} | - |
| Sales Conversion | {5}% | - |
| Checkout Completion | {70}% | - |
| Upsell Take Rate | {20}% | - |
| Revenue | €{n} | - |
| CPA | €{n} | - |
| ROAS | {x}:1 | - |

---

## Automation Triggers

| Trigger | Action | Timing |
|---------|--------|--------|
| Opt-in | Start welcome sequence | Immediate |
| No open 3 days | Re-engagement email | Day 3 |
| Sales page visit | Hot lead sequence | Immediate |
| Cart abandon | Abandon sequence | 1 hour |
| Purchase | Stop sales, start onboard | Immediate |
| No purchase 7 days | Long-term nurture | Day 7 |

---

## Pages Needed

| Page | Status | URL |
|------|--------|-----|
| Landing Page | [ ] | /lp/{slug} |
| Thank You | [ ] | /thank-you |
| Sales Page | [ ] | /offer/{slug} |
| Checkout | [ ] | /checkout |
| Upsell | [ ] | /oto |
| Confirmation | [ ] | /confirmation |

---

## Tech Stack

- **Pages:** {GHL/ClickFunnels/Custom}
- **Email:** {GHL/ActiveCampaign}
- **Payment:** {Stripe/PayPal}
- **Tracking:** {GA4/Pixel/GTM}

---

## Launch Checklist

- [ ] All pages live and tested
- [ ] Email sequences active
- [ ] Tracking verified
- [ ] Payment tested
- [ ] Mobile responsive
- [ ] Load time <3s
- [ ] Links working
- [ ] Legal pages linked
