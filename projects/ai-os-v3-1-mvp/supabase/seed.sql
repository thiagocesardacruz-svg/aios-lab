-- AI OS V3.1 MVP - Seed Data
-- Segment: Hotels (Single segment for MVP)
-- Plans: 2 Growth Plans
-- Tasks: 7-14 tasks per plan

-- =============================================================================
-- TENANT (Default Core Tenant)
-- =============================================================================

INSERT INTO tenants (id, name, type, is_active) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Travel Tech Digital', 'core', true);

-- =============================================================================
-- SEGMENT
-- =============================================================================

INSERT INTO segments (id, slug, name, description, is_active) VALUES
    ('10000000-0000-0000-0000-000000000001', 'hotels', 'Hotels', 'Hotels, boutique hotels, hostels and accommodation businesses', true);

-- =============================================================================
-- PRODUCT (SKU)
-- =============================================================================

INSERT INTO products (id, slug, name, segment_slug, description, price_cents, credits_included, is_active) VALUES
    ('20000000-0000-0000-0000-000000000001', 'ai-os-hotels', 'AI OS for Hotels', 'hotels', 'AI-powered growth system for hotels and accommodation businesses', 7900, 100, true);

-- =============================================================================
-- TENANT-PRODUCT MAPPING
-- =============================================================================

INSERT INTO tenant_products (tenant_id, product_id) VALUES
    ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001');

-- =============================================================================
-- PLAN TEMPLATES
-- =============================================================================

-- Plan 1: Hotel Marketing Kickstart (7 days)
INSERT INTO plan_templates (id, product_id, segment_id, slug, title, description, primary_goal, duration_days, recommended_for, is_active, version) VALUES
    ('30000000-0000-0000-0000-000000000001',
     '20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     'hotel-marketing-kickstart',
     'Hotel Marketing Kickstart',
     'Get your hotel visible online and start attracting guests in just 7 days. Perfect for hotels that need to establish or refresh their digital presence.',
     'get_clients',
     7,
     'beginner',
     true,
     1);

-- Plan 2: Direct Booking Booster (10 days)
INSERT INTO plan_templates (id, product_id, segment_id, slug, title, description, primary_goal, duration_days, recommended_for, is_active, version) VALUES
    ('30000000-0000-0000-0000-000000000002',
     '20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     'direct-booking-booster',
     'Direct Booking Booster',
     'Reduce OTA dependency and increase direct bookings through strategic marketing and guest communication optimization.',
     'increase_conversions',
     10,
     'intermediate',
     true,
     1);

-- =============================================================================
-- TASK TEMPLATES - Plan 1: Hotel Marketing Kickstart
-- =============================================================================

-- Day 1: Define Your Unique Value Proposition
INSERT INTO task_templates (id, product_id, segment_id, plan_template_id, day_number, title, instruction_md, prompt_template, external_tool_type, external_tool_url, definition_of_done, estimated_time_minutes, is_active, version) VALUES
    ('40000000-0000-0000-0000-000000000001',
     '20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     '30000000-0000-0000-0000-000000000001',
     1,
     'Define Your Unique Value Proposition',
     '## What You''ll Do Today

Your hotel needs a clear message that tells guests exactly why they should choose you over competitors.

**Why This Matters:**
- Guests decide in seconds whether to book
- OTAs show dozens of options - you need to stand out
- A strong UVP improves all your marketing

**Steps:**
1. Copy the Super Prompt below
2. Open ChatGPT and paste it
3. Answer the follow-up questions honestly
4. Save the final UVP statement',
     'TITLE: Create Hotel Unique Value Proposition

BUSINESS CONTEXT:
Hotel Name: {{business_name}}
Target Guests: {{target_audience}}
Current Value Proposition: {{value_proposition}}

TASK GOAL:
Create a compelling Unique Value Proposition (UVP) for this hotel that clearly communicates why guests should book directly.

OUTPUT FORMAT:
1. Main UVP Statement (max 15 words)
2. Supporting Points (3 bullet points)
3. Emotional Hook (1 sentence)
4. Proof Point (1 specific fact or number)

CONSTRAINTS:
- Be specific, not generic
- Avoid cliches like "best service" or "perfect location"
- Focus on what makes this hotel genuinely different
- Use language that matches the target audience

TONE:
{{tone_of_voice}}

First, ask me 3 clarifying questions about the hotel to ensure the UVP is accurate and compelling.',
     'chatgpt',
     'https://chat.openai.com/',
     '["Copied the prompt to ChatGPT", "Answered the AI''s clarifying questions", "Received your UVP statement", "Saved the UVP for future use"]',
     30,
     true,
     1);

-- Day 2: Optimize Your Google Business Profile
INSERT INTO task_templates (id, product_id, segment_id, plan_template_id, day_number, title, instruction_md, prompt_template, external_tool_type, external_tool_url, definition_of_done, estimated_time_minutes, is_active, version) VALUES
    ('40000000-0000-0000-0000-000000000002',
     '20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     '30000000-0000-0000-0000-000000000001',
     2,
     'Optimize Your Google Business Profile',
     '## What You''ll Do Today

Your Google Business Profile is often the first thing potential guests see. Let''s make it perfect.

**Why This Matters:**
- 46% of Google searches are local
- GBP appears before your website in search
- Reviews and photos directly impact bookings

**Steps:**
1. Copy the Super Prompt below
2. Get your optimized description and attributes
3. Update your Google Business Profile
4. Add the suggested photos if missing',
     'TITLE: Optimize Hotel Google Business Profile

BUSINESS CONTEXT:
Hotel Name: {{business_name}}
Target Guests: {{target_audience}}
Value Proposition: {{value_proposition}}
Segment: Hotels

TASK GOAL:
Create an optimized Google Business Profile description and identify the most important attributes and categories for this hotel.

OUTPUT FORMAT:
1. **Business Description** (750 characters max, keyword-rich)
2. **Primary Category**: [suggestion]
3. **Secondary Categories**: [3 suggestions]
4. **Key Attributes to Enable**: [list of 10]
5. **Photo Checklist**: [8 essential photos with descriptions]
6. **Posts Strategy**: [3 post ideas for the first week]

CONSTRAINTS:
- Include location-relevant keywords naturally
- Mention unique amenities and services
- Focus on what guests search for
- Be factual, not promotional

TONE:
{{tone_of_voice}}',
     'chatgpt',
     'https://chat.openai.com/',
     '["Generated optimized GBP content", "Updated your Google Business Profile description", "Verified all key attributes are enabled", "Identified missing photos to add"]',
     45,
     true,
     1);

-- Day 3: Create Social Media Bio & Highlights
INSERT INTO task_templates (id, product_id, segment_id, plan_template_id, day_number, title, instruction_md, prompt_template, external_tool_type, external_tool_url, definition_of_done, estimated_time_minutes, is_active, version) VALUES
    ('40000000-0000-0000-0000-000000000003',
     '20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     '30000000-0000-0000-0000-000000000001',
     3,
     'Create Social Media Bio & Highlights',
     '## What You''ll Do Today

Your Instagram and Facebook profiles need to convert visitors into followers and bookers.

**Why This Matters:**
- Social proof influences 71% of buying decisions
- Your bio has 3 seconds to make an impression
- Highlights showcase your best content permanently

**Steps:**
1. Copy the Super Prompt
2. Generate your optimized bio and highlights
3. Update Instagram and Facebook
4. Create your first highlight covers',
     'TITLE: Create Hotel Social Media Bio and Highlights Strategy

BUSINESS CONTEXT:
Hotel Name: {{business_name}}
Target Guests: {{target_audience}}
Value Proposition: {{value_proposition}}

TASK GOAL:
Create an optimized Instagram/Facebook bio and a strategic highlight structure that drives direct bookings.

OUTPUT FORMAT:
1. **Instagram Bio** (150 characters)
   - Line 1: What you are
   - Line 2: Unique benefit
   - Line 3: CTA
   - Link suggestion

2. **Facebook About Section** (255 characters)

3. **Instagram Highlights Structure** (6 highlights):
   - Name (emoji + title)
   - Purpose
   - Content ideas (3 per highlight)

4. **Pinned Post Ideas** (3 suggestions)

CONSTRAINTS:
- Include relevant emojis sparingly
- Add a clear call-to-action
- Make the booking link prominent
- Keep it scannable

TONE:
{{tone_of_voice}}',
     'chatgpt',
     'https://chat.openai.com/',
     '["Generated your social media bio", "Updated Instagram bio", "Updated Facebook about section", "Planned your 6 Instagram highlights"]',
     30,
     true,
     1);

-- Day 4: Write Your First Week of Posts
INSERT INTO task_templates (id, product_id, segment_id, plan_template_id, day_number, title, instruction_md, prompt_template, external_tool_type, external_tool_url, definition_of_done, estimated_time_minutes, is_active, version) VALUES
    ('40000000-0000-0000-0000-000000000004',
     '20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     '30000000-0000-0000-0000-000000000001',
     4,
     'Write Your First Week of Posts',
     '## What You''ll Do Today

Consistent posting builds trust and keeps your hotel top-of-mind. Let''s create a week of content.

**Why This Matters:**
- Hotels that post 3-5x/week see 2x more engagement
- Content planning prevents last-minute stress
- Variety keeps your audience interested

**Steps:**
1. Copy the Super Prompt
2. Generate 7 days of post content
3. Schedule posts using Meta Business Suite or your preferred tool
4. Save the content calendar for future reference',
     'TITLE: Create 7-Day Hotel Social Media Content Calendar

BUSINESS CONTEXT:
Hotel Name: {{business_name}}
Target Guests: {{target_audience}}
Value Proposition: {{value_proposition}}

TASK GOAL:
Create a complete 7-day social media content calendar with ready-to-post captions for Instagram and Facebook.

OUTPUT FORMAT:
For each of the 7 days, provide:

**Day [X] - [Theme]**
- Post Type: [photo/carousel/reel/story]
- Visual Suggestion: [what to photograph or create]
- Caption: [full caption with emojis and line breaks]
- Hashtags: [10 relevant hashtags]
- Best Time to Post: [suggestion]
- CTA: [specific call-to-action]

CONTENT MIX:
- Day 1: Behind the scenes / Team
- Day 2: Room or amenity showcase
- Day 3: Local area tip
- Day 4: Guest experience / testimonial prompt
- Day 5: Special offer or direct booking benefit
- Day 6: Food & beverage highlight
- Day 7: Weekend inspiration / lifestyle

CONSTRAINTS:
- Each caption should be 100-200 words
- Include a question or CTA in every post
- Make captions feel personal, not corporate
- Reference the local destination naturally

TONE:
{{tone_of_voice}}',
     'chatgpt',
     'https://chat.openai.com/',
     '["Generated 7 days of content", "Reviewed and customized captions", "Scheduled posts for the week", "Saved calendar for future planning"]',
     45,
     true,
     1);

-- Day 5: Create Your Email Signature & Booking Link
INSERT INTO task_templates (id, product_id, segment_id, plan_template_id, day_number, title, instruction_md, prompt_template, external_tool_type, external_tool_url, definition_of_done, estimated_time_minutes, is_active, version) VALUES
    ('40000000-0000-0000-0000-000000000005',
     '20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     '30000000-0000-0000-0000-000000000001',
     5,
     'Create Your Email Signature & Booking Link',
     '## What You''ll Do Today

Every email you send is a marketing opportunity. Let''s optimize your signature.

**Why This Matters:**
- Average person sends 40+ emails per day
- Professional signatures build trust
- Direct booking links reduce OTA dependency

**Steps:**
1. Copy the Super Prompt
2. Generate your optimized email signature
3. Set up your signature in your email client
4. Test by sending yourself an email',
     'TITLE: Create Professional Hotel Email Signature

BUSINESS CONTEXT:
Hotel Name: {{business_name}}
Value Proposition: {{value_proposition}}

TASK GOAL:
Create a professional email signature that promotes direct bookings and builds credibility.

OUTPUT FORMAT:
1. **Text-Based Signature** (for maximum compatibility):
   ```
   [Full formatted signature]
   ```

2. **Information to Include**:
   - Name and title
   - Hotel name
   - Phone number format
   - Direct booking link with UTM
   - Social media icons
   - Current promotion (optional)

3. **Signature Banner Ideas** (3 options):
   - Seasonal promotion
   - Direct booking benefit
   - Review request

4. **Auto-Reply Template** (out of office):
   - Professional message
   - Alternative contact
   - Booking link

CONSTRAINTS:
- Keep under 6 lines of text
- Use minimal images (they often don''t load)
- Include mobile-friendly click-to-call
- Add UTM parameters to booking links

TONE:
{{tone_of_voice}}',
     'chatgpt',
     'https://chat.openai.com/',
     '["Generated your email signature", "Updated email client signature", "Added direct booking link with UTM", "Sent test email to verify"]',
     20,
     true,
     1);

-- Day 6: Set Up Review Request Template
INSERT INTO task_templates (id, product_id, segment_id, plan_template_id, day_number, title, instruction_md, prompt_template, external_tool_type, external_tool_url, definition_of_done, estimated_time_minutes, is_active, version) VALUES
    ('40000000-0000-0000-0000-000000000006',
     '20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     '30000000-0000-0000-0000-000000000001',
     6,
     'Set Up Review Request Template',
     '## What You''ll Do Today

Reviews are the lifeblood of hotel bookings. Let''s create a system to get more of them.

**Why This Matters:**
- 93% of travelers read reviews before booking
- Hotels with more reviews rank higher
- Responding to reviews increases bookings by 12%

**Steps:**
1. Copy the Super Prompt
2. Generate your review request templates
3. Set up the templates in your PMS or email system
4. Create a simple review response guide',
     'TITLE: Create Hotel Review Request System

BUSINESS CONTEXT:
Hotel Name: {{business_name}}
Target Guests: {{target_audience}}
Value Proposition: {{value_proposition}}

TASK GOAL:
Create a complete review request system including templates for different channels and response guidelines.

OUTPUT FORMAT:
1. **Post-Stay Email** (sent 1 day after checkout):
   - Subject line (3 options)
   - Full email body
   - Direct links to review platforms

2. **WhatsApp/SMS Message** (shorter version):
   - Message text with link

3. **In-Room Card Text** (for physical placement):
   - QR code suggestion
   - Brief message

4. **Review Response Templates**:
   - 5-star response (3 variations)
   - 4-star response (2 variations)
   - 3-star response (2 variations)
   - Negative review response framework

5. **Review Monitoring Checklist**:
   - Platforms to monitor
   - Response time goals
   - Escalation triggers

CONSTRAINTS:
- Keep requests personal, not pushy
- Make leaving a review as easy as possible
- Always thank before asking
- Address negative reviews professionally

TONE:
{{tone_of_voice}}',
     'chatgpt',
     'https://chat.openai.com/',
     '["Generated review request templates", "Set up post-stay email automation", "Created review response templates", "Listed platforms to monitor"]',
     35,
     true,
     1);

-- Day 7: Create Your 30-Day Content Plan
INSERT INTO task_templates (id, product_id, segment_id, plan_template_id, day_number, title, instruction_md, prompt_template, external_tool_type, external_tool_url, definition_of_done, estimated_time_minutes, is_active, version) VALUES
    ('40000000-0000-0000-0000-000000000007',
     '20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     '30000000-0000-0000-0000-000000000001',
     7,
     'Create Your 30-Day Content Plan',
     '## What You''ll Do Today

You''ve built the foundation. Now let''s plan for sustained success.

**Why This Matters:**
- Consistency beats intensity in marketing
- Planning prevents burnout
- A content calendar keeps you accountable

**Steps:**
1. Copy the Super Prompt
2. Generate your 30-day content framework
3. Block time in your calendar for content creation
4. Celebrate completing the Marketing Kickstart!',
     'TITLE: Create 30-Day Hotel Content Strategy

BUSINESS CONTEXT:
Hotel Name: {{business_name}}
Target Guests: {{target_audience}}
Value Proposition: {{value_proposition}}

TASK GOAL:
Create a sustainable 30-day content strategy framework that the hotel team can follow without daily planning.

OUTPUT FORMAT:
1. **Weekly Themes** (4 weeks):
   - Week 1 Theme: [theme] + focus
   - Week 2 Theme: [theme] + focus
   - Week 3 Theme: [theme] + focus
   - Week 4 Theme: [theme] + focus

2. **Content Pillars** (5 categories that repeat):
   - Pillar 1: [name] - post every [day]
   - Pillar 2: [name] - post every [day]
   - Pillar 3: [name] - post every [day]
   - Pillar 4: [name] - post every [day]
   - Pillar 5: [name] - post every [day]

3. **Monthly Calendar Template**:
   | Mon | Tue | Wed | Thu | Fri | Sat | Sun |
   [Fill with pillar assignments]

4. **Content Batch Days**:
   - Photo day suggestions
   - Caption writing blocks
   - Scheduling time

5. **Key Dates This Month**:
   - Local events
   - Holidays
   - Industry observances

6. **Success Metrics to Track**:
   - Engagement rate goal
   - Follower growth goal
   - Direct booking goal

CONSTRAINTS:
- Make it achievable for a small team
- Include both planned and spontaneous content
- Balance promotional with value-giving
- Account for seasonal factors

TONE:
{{tone_of_voice}}',
     'chatgpt',
     'https://chat.openai.com/',
     '["Generated 30-day content strategy", "Set up content calendar system", "Blocked content creation time", "Completed Marketing Kickstart plan!"]',
     45,
     true,
     1);

-- =============================================================================
-- TASK TEMPLATES - Plan 2: Direct Booking Booster
-- =============================================================================

-- Day 1: Audit Your Current Booking Channels
INSERT INTO task_templates (id, product_id, segment_id, plan_template_id, day_number, title, instruction_md, prompt_template, external_tool_type, external_tool_url, definition_of_done, estimated_time_minutes, is_active, version) VALUES
    ('40000000-0000-0000-0000-000000000008',
     '20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     '30000000-0000-0000-0000-000000000002',
     1,
     'Audit Your Current Booking Channels',
     '## What You''ll Do Today

Before optimizing, we need to understand where your bookings currently come from.

**Why This Matters:**
- You can''t improve what you don''t measure
- OTA commissions eat 15-25% of revenue
- Identifying patterns reveals opportunities

**Steps:**
1. Gather your booking data from the last 3 months
2. Copy the Super Prompt
3. Input your numbers for analysis
4. Save the insights for the upcoming tasks',
     'TITLE: Analyze Hotel Booking Channel Distribution

BUSINESS CONTEXT:
Hotel Name: {{business_name}}
Target Guests: {{target_audience}}

TASK GOAL:
Help me analyze my booking channel distribution and identify opportunities to increase direct bookings.

I will provide my booking data, and you will:

OUTPUT FORMAT:
1. **Channel Analysis Table**:
   | Channel | Bookings | Revenue | Commission | Net Revenue | % of Total |

2. **Key Findings** (3-5 insights):
   - Highest commission channel
   - Best performing channel
   - Biggest opportunity

3. **OTA Dependency Score**: [X/10]
   - Interpretation

4. **Quick Wins** (3 immediate actions):
   - Action 1
   - Action 2
   - Action 3

5. **90-Day Goal**:
   - Current direct booking %: [X]
   - Target direct booking %: [Y]
   - Revenue impact: [Z]

FIRST, ask me for:
1. Total bookings last 3 months
2. Breakdown by channel (Booking.com, Expedia, Direct, etc.)
3. Average booking value per channel
4. Current website traffic (if known)

CONSTRAINTS:
- Be realistic about achievable improvements
- Consider seasonal factors
- Factor in marketing costs for direct bookings
- Account for different guest segments per channel

TONE:
{{tone_of_voice}}',
     'chatgpt',
     'https://chat.openai.com/',
     '["Gathered booking data from last 3 months", "Analyzed channel distribution", "Identified top 3 opportunities", "Set 90-day direct booking goal"]',
     40,
     true,
     1);

-- Day 2: Optimize Your Direct Booking Page
INSERT INTO task_templates (id, product_id, segment_id, plan_template_id, day_number, title, instruction_md, prompt_template, external_tool_type, external_tool_url, definition_of_done, estimated_time_minutes, is_active, version) VALUES
    ('40000000-0000-0000-0000-000000000009',
     '20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     '30000000-0000-0000-0000-000000000002',
     2,
     'Optimize Your Direct Booking Page',
     '## What You''ll Do Today

Your website booking page is where conversions happen. Let''s make it irresistible.

**Why This Matters:**
- 52% of travelers visit hotel websites before booking
- Most booking pages lose guests in the first 10 seconds
- Small improvements compound into big revenue gains

**Steps:**
1. Open your current booking page
2. Copy the Super Prompt
3. Get your optimization checklist
4. Implement the quick fixes today',
     'TITLE: Optimize Hotel Direct Booking Page

BUSINESS CONTEXT:
Hotel Name: {{business_name}}
Target Guests: {{target_audience}}
Value Proposition: {{value_proposition}}

TASK GOAL:
Create a comprehensive booking page optimization plan that increases conversion rates.

OUTPUT FORMAT:
1. **Above-the-Fold Checklist**:
   - [ ] Clear value proposition visible
   - [ ] Book Now button prominent
   - [ ] Trust signals present
   - [ ] Price comparison visible
   - [ ] Mobile-optimized

2. **Essential Elements to Add**:
   - Headlines (3 options)
   - Subheadlines (2 options)
   - Trust badges needed
   - Urgency elements

3. **Direct Booking Benefits Section**:
   - Benefit 1 with icon
   - Benefit 2 with icon
   - Benefit 3 with icon
   - Benefit 4 with icon

4. **Price Comparison Widget Copy**:
   - Headline
   - OTA price label
   - Direct price label
   - Savings message

5. **FAQ Section** (5 common questions):
   - Question + Answer for each

6. **Exit Intent Popup**:
   - Headline
   - Offer
   - CTA button text

CONSTRAINTS:
- Focus on mobile experience first
- Keep load time under 3 seconds
- Don''t overwhelm with information
- Make the next step obvious

TONE:
{{tone_of_voice}}',
     'chatgpt',
     'https://chat.openai.com/',
     '["Audited current booking page", "Generated optimization checklist", "Implemented at least 3 quick fixes", "Added direct booking benefits section"]',
     50,
     true,
     1);

-- Day 3: Create Direct Booking Incentive
INSERT INTO task_templates (id, product_id, segment_id, plan_template_id, day_number, title, instruction_md, prompt_template, external_tool_type, external_tool_url, definition_of_done, estimated_time_minutes, is_active, version) VALUES
    ('40000000-0000-0000-0000-000000000010',
     '20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     '30000000-0000-0000-0000-000000000002',
     3,
     'Create Direct Booking Incentive',
     '## What You''ll Do Today

Give guests a compelling reason to book directly instead of through OTAs.

**Why This Matters:**
- 65% of guests will book direct for the right incentive
- Your incentive can cost less than OTA commission
- It creates immediate competitive advantage

**Steps:**
1. Copy the Super Prompt
2. Design your incentive structure
3. Calculate the cost vs. OTA commission savings
4. Prepare the marketing materials',
     'TITLE: Design Direct Booking Incentive Program

BUSINESS CONTEXT:
Hotel Name: {{business_name}}
Target Guests: {{target_audience}}
Value Proposition: {{value_proposition}}

TASK GOAL:
Create a compelling direct booking incentive that costs less than OTA commissions while providing real value to guests.

First, I''ll need to know:
1. Your average daily rate (ADR)
2. Average OTA commission percentage
3. Average length of stay
4. Most valued amenities by guests

OUTPUT FORMAT:
1. **Primary Incentive Options** (choose one):
   - Option A: [incentive] - Cost: [X] - Perceived Value: [Y]
   - Option B: [incentive] - Cost: [X] - Perceived Value: [Y]
   - Option C: [incentive] - Cost: [X] - Perceived Value: [Y]

2. **Recommended Package**:
   - Name: "[Creative Name]"
   - Includes:
     - Item 1
     - Item 2
     - Item 3
   - Real Cost: $[X]
   - Perceived Value: $[Y]
   - Savings vs OTA Commission: $[Z]

3. **Marketing Copy**:
   - Headline
   - 3 bullet points
   - CTA

4. **Terms & Conditions** (simple version)

5. **How to Promote**:
   - Website placement
   - Email template
   - Social post

CONSTRAINTS:
- Incentive must cost less than 10% of booking value
- Must be operationally feasible
- Should appeal to your target guests
- Easy to understand and redeem

TONE:
{{tone_of_voice}}',
     'chatgpt',
     'https://chat.openai.com/',
     '["Designed direct booking incentive", "Calculated cost vs. OTA savings", "Created marketing materials", "Added incentive to website"]',
     35,
     true,
     1);

-- Day 4: Write Booking Confirmation Email Sequence
INSERT INTO task_templates (id, product_id, segment_id, plan_template_id, day_number, title, instruction_md, prompt_template, external_tool_type, external_tool_url, definition_of_done, estimated_time_minutes, is_active, version) VALUES
    ('40000000-0000-0000-0000-000000000011',
     '20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     '30000000-0000-0000-0000-000000000002',
     4,
     'Write Booking Confirmation Email Sequence',
     '## What You''ll Do Today

The post-booking experience determines whether guests become repeat bookers.

**Why This Matters:**
- 70% of guests read every email from the hotel
- Pre-arrival communication reduces no-shows
- It''s your chance to upsell and build excitement

**Steps:**
1. Copy the Super Prompt
2. Generate your email sequence
3. Set up emails in your PMS or email tool
4. Test the sequence yourself',
     'TITLE: Create Hotel Post-Booking Email Sequence

BUSINESS CONTEXT:
Hotel Name: {{business_name}}
Target Guests: {{target_audience}}
Value Proposition: {{value_proposition}}

TASK GOAL:
Create a 4-email post-booking sequence that builds excitement, reduces cancellations, and increases upsell revenue.

OUTPUT FORMAT:

**Email 1: Booking Confirmation** (sent immediately)
- Subject Line: [3 options]
- Preview Text:
- Body:
  - Thank you section
  - Booking details summary
  - What''s included (direct booking benefits)
  - Next steps
  - Contact information
- CTA: [action]

**Email 2: Trip Planning** (sent 7 days before arrival)
- Subject Line: [3 options]
- Preview Text:
- Body:
  - Countdown/excitement builder
  - Local recommendations
  - Upsell opportunity (room upgrade, experience)
  - Practical information
- CTA: [action]

**Email 3: Pre-Arrival** (sent 2 days before arrival)
- Subject Line: [3 options]
- Preview Text:
- Body:
  - Check-in information
  - Transportation tips
  - Weather forecast mention
  - Final upsell (late checkout, dinner reservation)
  - WhatsApp/contact for questions
- CTA: [action]

**Email 4: Day of Arrival** (sent morning of check-in)
- Subject Line: [3 options]
- Preview Text:
- Body:
  - Welcome message
  - Room ready time
  - Team introduction
  - App download (if applicable)
  - Emergency contact
- CTA: [action]

CONSTRAINTS:
- Each email under 200 words
- Mobile-friendly formatting
- Clear single CTA per email
- Personalization tokens included

TONE:
{{tone_of_voice}}',
     'chatgpt',
     'https://chat.openai.com/',
     '["Generated 4-email sequence", "Set up emails in PMS/email tool", "Added personalization fields", "Tested sequence with a sample booking"]',
     45,
     true,
     1);

-- Day 5: Create Abandoned Booking Recovery
INSERT INTO task_templates (id, product_id, segment_id, plan_template_id, day_number, title, instruction_md, prompt_template, external_tool_type, external_tool_url, definition_of_done, estimated_time_minutes, is_active, version) VALUES
    ('40000000-0000-0000-0000-000000000012',
     '20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     '30000000-0000-0000-0000-000000000002',
     5,
     'Create Abandoned Booking Recovery',
     '## What You''ll Do Today

Most website visitors don''t book on their first visit. Let''s bring them back.

**Why This Matters:**
- 81% of booking sessions are abandoned
- Recovery emails have 45% open rates
- Even 5% recovery = significant revenue

**Steps:**
1. Copy the Super Prompt
2. Create your recovery messages
3. Set up retargeting (if possible)
4. Implement exit intent popup',
     'TITLE: Create Abandoned Booking Recovery System

BUSINESS CONTEXT:
Hotel Name: {{business_name}}
Target Guests: {{target_audience}}
Value Proposition: {{value_proposition}}

TASK GOAL:
Create a multi-channel abandoned booking recovery system to recapture lost revenue.

OUTPUT FORMAT:

**1. Exit Intent Popup**:
- Headline:
- Subheadline:
- Offer:
- Email capture field
- CTA button text:
- Privacy note:

**2. Recovery Email Sequence**:

*Email 1* (sent 1 hour after abandonment):
- Subject: [3 options]
- Preview:
- Body: [gentle reminder, no pressure]
- CTA:

*Email 2* (sent 24 hours later):
- Subject: [3 options]
- Preview:
- Body: [add urgency, mention availability]
- CTA:

*Email 3* (sent 72 hours later):
- Subject: [3 options]
- Preview:
- Body: [special offer, last chance]
- CTA:

**3. Retargeting Ad Copy**:
- Ad 1: Reminder (no offer)
- Ad 2: Urgency
- Ad 3: Incentive

**4. WhatsApp/SMS Message**:
- Short message version
- Include link

**5. Recovery Offer Structure**:
- What to offer
- How to position
- Expiration strategy

CONSTRAINTS:
- Don''t be annoying or desperate
- Personalize with dates they searched
- Make it easy to complete booking
- GDPR/privacy compliant

TONE:
{{tone_of_voice}}',
     'chatgpt',
     'https://chat.openai.com/',
     '["Created exit intent popup content", "Set up recovery email sequence", "Prepared retargeting ad copy", "Implemented at least one recovery method"]',
     40,
     true,
     1);

-- Day 6: Build Guest Loyalty Program
INSERT INTO task_templates (id, product_id, segment_id, plan_template_id, day_number, title, instruction_md, prompt_template, external_tool_type, external_tool_url, definition_of_done, estimated_time_minutes, is_active, version) VALUES
    ('40000000-0000-0000-0000-000000000013',
     '20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     '30000000-0000-0000-0000-000000000002',
     6,
     'Build Guest Loyalty Program',
     '## What You''ll Do Today

Repeat guests are 5x cheaper to acquire than new ones. Let''s give them a reason to return.

**Why This Matters:**
- A 5% increase in retention = 25-95% profit increase
- Loyal guests book direct
- They become brand ambassadors

**Steps:**
1. Copy the Super Prompt
2. Design your loyalty program
3. Create the communication materials
4. Plan the launch announcement',
     'TITLE: Design Hotel Guest Loyalty Program

BUSINESS CONTEXT:
Hotel Name: {{business_name}}
Target Guests: {{target_audience}}
Value Proposition: {{value_proposition}}

TASK GOAL:
Create a simple but effective guest loyalty program that encourages repeat bookings and direct reservations.

OUTPUT FORMAT:

**1. Program Structure**:
- Program Name: "[Creative Name]"
- Tagline:
- How it works (simple explanation)

**2. Tier System** (optional, 2-3 tiers max):
| Tier | Requirement | Benefits |
| --- | --- | --- |
| [Name] | [X nights] | [benefits] |
| [Name] | [Y nights] | [benefits] |

**3. Benefits Menu**:
- Immediate benefits (join now):
  - Benefit 1
  - Benefit 2
- Earned benefits (after stays):
  - Benefit 1
  - Benefit 2

**4. Point/Reward System** (if applicable):
- Earning structure
- Redemption options
- Expiration policy

**5. Marketing Materials**:
- Website section copy
- Sign-up confirmation email
- Social media announcement
- In-room card text

**6. Operational Checklist**:
- How to enroll guests
- How to track stays
- How to deliver benefits
- Team training points

CONSTRAINTS:
- Keep it simple (no complex point math)
- Make benefits feel exclusive
- Ensure operational feasibility
- Consider your PMS capabilities

TONE:
{{tone_of_voice}}',
     'chatgpt',
     'https://chat.openai.com/',
     '["Designed loyalty program structure", "Created benefit tiers", "Wrote marketing materials", "Planned launch communication"]',
     45,
     true,
     1);

-- Day 7: Create Rate Parity Strategy
INSERT INTO task_templates (id, product_id, segment_id, plan_template_id, day_number, title, instruction_md, prompt_template, external_tool_type, external_tool_url, definition_of_done, estimated_time_minutes, is_active, version) VALUES
    ('40000000-0000-0000-0000-000000000014',
     '20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     '30000000-0000-0000-0000-000000000002',
     7,
     'Create Rate Parity Strategy',
     '## What You''ll Do Today

Understanding and managing rate parity is crucial for direct booking success.

**Why This Matters:**
- Guests compare prices across channels
- Price differences confuse and frustrate
- Legal parity rules vary by region

**Steps:**
1. Copy the Super Prompt
2. Understand your parity obligations
3. Find legal ways to offer direct value
4. Set up price monitoring',
     'TITLE: Create Rate Parity Management Strategy

BUSINESS CONTEXT:
Hotel Name: {{business_name}}
Target Guests: {{target_audience}}

TASK GOAL:
Develop a rate parity management strategy that maximizes direct booking appeal while respecting OTA agreements.

First, tell me:
1. Your primary OTA partners
2. Your region (for legal context)
3. Your current parity situation

OUTPUT FORMAT:

**1. Parity Rules Summary**:
- What you CAN do
- What you CANNOT do
- Gray areas to explore

**2. Legal Value-Add Strategy**:
Methods to make direct booking more valuable without breaking parity:
- Method 1: [description + implementation]
- Method 2: [description + implementation]
- Method 3: [description + implementation]
- Method 4: [description + implementation]

**3. Price Positioning Framework**:
| Channel | Public Rate | Value Adds | Effective Rate |
| --- | --- | --- | --- |

**4. Closed User Group Strategy**:
- What it is
- How to implement
- Terms required

**5. Package Strategy**:
- Non-commissionable packages
- Added value packages
- Opaque pricing options

**6. Monitoring System**:
- Tools to use
- Check frequency
- Action triggers

**7. Communication Strategy**:
- How to explain direct benefits
- Price match messaging
- Comparison table for website

CONSTRAINTS:
- Stay within legal boundaries
- Consider OTA relationship impact
- Focus on value, not just price
- Be transparent with guests

TONE:
{{tone_of_voice}}',
     'chatgpt',
     'https://chat.openai.com/',
     '["Understood parity obligations", "Identified legal value-add methods", "Created value positioning table", "Set up basic price monitoring"]',
     35,
     true,
     1);

-- Day 8: Optimize OTA Profiles for Website Traffic
INSERT INTO task_templates (id, product_id, segment_id, plan_template_id, day_number, title, instruction_md, prompt_template, external_tool_type, external_tool_url, definition_of_done, estimated_time_minutes, is_active, version) VALUES
    ('40000000-0000-0000-0000-000000000015',
     '20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     '30000000-0000-0000-0000-000000000002',
     8,
     'Optimize OTA Profiles for Website Traffic',
     '## What You''ll Do Today

OTAs can actually drive traffic to your website if you optimize correctly.

**Why This Matters:**
- Many guests discover hotels on OTAs but book on the hotel website
- Your OTA profile is often your most-viewed page
- Strategic optimization sends curious guests to your site

**Steps:**
1. Copy the Super Prompt
2. Audit your OTA profiles
3. Optimize descriptions to drive curiosity
4. Ensure your hotel name is Google-friendly',
     'TITLE: Optimize OTA Profiles for Website Traffic

BUSINESS CONTEXT:
Hotel Name: {{business_name}}
Target Guests: {{target_audience}}
Value Proposition: {{value_proposition}}

TASK GOAL:
Optimize OTA listings to drive guests from OTAs to your direct website without violating OTA terms.

OUTPUT FORMAT:

**1. Profile Audit Checklist**:
- [ ] Hotel name is easily searchable
- [ ] Photos are high quality and branded
- [ ] Description creates curiosity
- [ ] Amenities list is complete
- [ ] Reviews are being responded to

**2. Optimized Descriptions**:

*Booking.com* (1000 chars):
[description that creates curiosity about unique features]

*Expedia* (2000 chars):
[description with subtle brand personality]

**3. Photo Strategy**:
- Hero photo requirements
- Branded photo opportunities
- Photo order recommendation

**4. Review Response Templates** (that build brand):
- Template 1: [creates curiosity]
- Template 2: [mentions unique feature]
- Template 3: [builds connection]

**5. Name Optimization**:
- Current name analysis
- Searchability score
- Suggestions (if needed)

**6. Curiosity Triggers** (compliant methods):
- Unique amenity mentions
- Location highlights
- Experience teasers
- Award/recognition mentions

CONSTRAINTS:
- Must comply with OTA terms
- No direct "book on our website" language
- Focus on building brand curiosity
- Keep it authentic

TONE:
{{tone_of_voice}}',
     'chatgpt',
     'https://chat.openai.com/',
     '["Audited all OTA profiles", "Updated descriptions", "Optimized photo order", "Created curiosity-building content"]',
     40,
     true,
     1);

-- Day 9: Create Guest Re-Engagement Campaign
INSERT INTO task_templates (id, product_id, segment_id, plan_template_id, day_number, title, instruction_md, prompt_template, external_tool_type, external_tool_url, definition_of_done, estimated_time_minutes, is_active, version) VALUES
    ('40000000-0000-0000-0000-000000000016',
     '20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     '30000000-0000-0000-0000-000000000002',
     9,
     'Create Guest Re-Engagement Campaign',
     '## What You''ll Do Today

Your past guests are your best future guests. Let''s bring them back.

**Why This Matters:**
- Past guests convert 60-70% vs 2-3% for new visitors
- They already trust you
- Direct booking is natural for returners

**Steps:**
1. Segment your guest database
2. Copy the Super Prompt
3. Create targeted campaigns
4. Set up the first re-engagement email',
     'TITLE: Create Guest Re-Engagement Campaign

BUSINESS CONTEXT:
Hotel Name: {{business_name}}
Target Guests: {{target_audience}}
Value Proposition: {{value_proposition}}

TASK GOAL:
Create a multi-touchpoint re-engagement campaign to bring past guests back for direct bookings.

OUTPUT FORMAT:

**1. Guest Segmentation**:
| Segment | Criteria | Approach |
| --- | --- | --- |
| Recent (0-6 months) | | |
| Lapsed (6-12 months) | | |
| Cold (12+ months) | | |
| High-value | | |
| Special occasions | | |

**2. Email Campaign - Recent Guests**:
- Subject: [3 options]
- Body: [personal, assumes they loved it]
- Offer: [if applicable]
- CTA:

**3. Email Campaign - Lapsed Guests**:
- Subject: [3 options]
- Body: [what''s new, we miss you]
- Offer: [comeback incentive]
- CTA:

**4. Email Campaign - Special Occasions**:
- Anniversary of stay
- Birthday (if known)
- Holiday greeting with offer

**5. Re-targeting Audiences**:
- Website visitors (past guests)
- Email openers
- Lookalike audiences

**6. Personal Touch Ideas**:
- Handwritten card triggers
- Phone call triggers
- VIP gestures

**7. Campaign Calendar**:
| Month | Campaign | Segment | Offer |

CONSTRAINTS:
- GDPR/privacy compliance
- Don''t over-contact
- Personalize where possible
- Track attribution

TONE:
{{tone_of_voice}}',
     'chatgpt',
     'https://chat.openai.com/',
     '["Segmented guest database", "Created segment-specific emails", "Set up first re-engagement campaign", "Scheduled regular touchpoints"]',
     40,
     true,
     1);

-- Day 10: Build Your Direct Booking Dashboard
INSERT INTO task_templates (id, product_id, segment_id, plan_template_id, day_number, title, instruction_md, prompt_template, external_tool_type, external_tool_url, definition_of_done, estimated_time_minutes, is_active, version) VALUES
    ('40000000-0000-0000-0000-000000000017',
     '20000000-0000-0000-0000-000000000001',
     '10000000-0000-0000-0000-000000000001',
     '30000000-0000-0000-0000-000000000002',
     10,
     'Build Your Direct Booking Dashboard',
     '## What You''ll Do Today

You''ve built a direct booking system. Now let''s measure it.

**Why This Matters:**
- What gets measured gets managed
- Early wins build momentum
- Data informs future optimization

**Steps:**
1. Copy the Super Prompt
2. Set up your tracking dashboard
3. Establish your baseline metrics
4. Celebrate completing the Direct Booking Booster!',
     'TITLE: Create Direct Booking Measurement Dashboard

BUSINESS CONTEXT:
Hotel Name: {{business_name}}
Target Guests: {{target_audience}}

TASK GOAL:
Create a simple but effective dashboard to track direct booking performance and guide ongoing optimization.

OUTPUT FORMAT:

**1. Key Metrics to Track**:
| Metric | How to Measure | Target | Current |
| --- | --- | --- | --- |
| Direct Booking % | | | |
| Website Conversion Rate | | | |
| Email Recovery Rate | | | |
| Loyalty Program Sign-ups | | | |
| Cost per Direct Booking | | | |
| OTA Commission Saved | | | |

**2. Weekly Review Checklist**:
- [ ] Metric 1 check
- [ ] Metric 2 check
- [ ] Metric 3 check
- What worked this week?
- What to improve?

**3. Monthly Review Template**:
- Direct booking trend
- Channel distribution change
- Campaign performance
- Cost analysis
- Next month priorities

**4. Tool Recommendations**:
| Need | Free Option | Paid Option |
| --- | --- | --- |
| Website Analytics | | |
| Email Tracking | | |
| Revenue Tracking | | |

**5. Dashboard Layout** (simple version):
- What to put where
- Update frequency
- Who should see it

**6. 90-Day Goals** (set now):
- Goal 1:
- Goal 2:
- Goal 3:
- How you''ll celebrate achieving them:

CONSTRAINTS:
- Keep it simple enough to actually use
- Focus on actionable metrics
- Don''t track vanity metrics
- Make it visual

TONE:
{{tone_of_voice}}

FINAL NOTE: Congratulations on completing the Direct Booking Booster! Summarize the key wins and next steps.',
     'chatgpt',
     'https://chat.openai.com/',
     '["Set up tracking dashboard", "Established baseline metrics", "Created weekly review habit", "Completed Direct Booking Booster!"]',
     45,
     true,
     1);
