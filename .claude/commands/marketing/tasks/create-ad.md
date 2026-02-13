# Create Ad

## Identity
- **ID:** create-ad
- **Squad:** marketing
- **Agent:** copy-specialist
- **Type:** task

## Purpose

Create ad copy for any platform: Facebook/Instagram, Google, LinkedIn, TikTok, or YouTube.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `platform` | string | Yes | facebook/google/linkedin/tiktok/youtube |
| `format` | string | Yes | image/video/carousel/story/search |
| `objective` | string | Yes | awareness/traffic/leads/conversions |
| `product` | string | Yes | Product/offer name |
| `angle` | string | No | pain/desire/curiosity/social_proof |

## Platform Specs

### Facebook/Instagram
- **Image:** 1080x1080, 125 char primary, 30 char headline
- **Video:** 1:1 or 9:16, 15-60 sec
- **Carousel:** Up to 10 cards
- **Story:** 9:16, 15 sec max

### Google Ads
- **Search:** 30 char headlines (x3), 90 char descriptions (x2)
- **Display:** Various sizes, 25 char headline, 90 char description
- **YouTube:** 5 sec skip, 15-30 sec non-skip

### LinkedIn
- **Single Image:** 1200x627, 150 char intro, 70 char headline
- **Video:** 1:1 or 16:9, 15-30 sec
- **Carousel:** Up to 10 cards

### TikTok
- **Video:** 9:16, 15-60 sec, native style
- **Spark Ads:** Boost organic content

## Process

### 1. Hook Development
- First 3 seconds critical
- Pattern interrupt
- Emotional trigger
- Curiosity gap

### 2. Body/Script
- Problem → Solution
- Benefits, not features
- Social proof
- Urgency (ethical)

### 3. CTA
- Platform-native language
- Clear next step
- Low friction

### 4. Variations
- Multiple angles
- Different hooks
- A/B test candidates

## Output

```yaml
ad_creative:
  platform: "{platform}"
  format: "{format}"
  objective: "{objective}"

  variations:
    - name: "Pain Angle"
      hook: "{pain_hook}"
      primary_text: |
        {main_copy}
      headline: "{headline}"
      description: "{description}"
      cta: "{cta_button}"

    - name: "Desire Angle"
      hook: "{desire_hook}"
      primary_text: |
        {main_copy}
      headline: "{headline}"
      description: "{description}"
      cta: "{cta_button}"

    - name: "Social Proof Angle"
      hook: "{proof_hook}"
      primary_text: |
        {main_copy}
      headline: "{headline}"
      description: "{description}"
      cta: "{cta_button}"

  video_script:
    hook: "{0-3_sec}"
    problem: "{3-10_sec}"
    solution: "{10-20_sec}"
    proof: "{20-25_sec}"
    cta: "{25-30_sec}"

  creative_direction:
    visual_style: "{style}"
    colors: "{brand_colors}"
    imagery: "{suggested_visuals}"

  targeting_suggestions:
    interests: []
    behaviors: []
    lookalikes: []
```

## Quality Criteria

- [ ] Hook captures attention in <3 sec
- [ ] Copy fits platform character limits
- [ ] CTA matches objective
- [ ] Multiple variations provided
- [ ] Compliance with platform policies

## Related

- **Workflow:** `/mkt/ad-creative-pack`
- **Template:** `ad-copy-tmpl.md`
- **Data:** `icp-profiles.yaml`
