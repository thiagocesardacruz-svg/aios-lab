# Design Social Post

## Identity
- **ID:** design-social-post
- **Squad:** design
- **Agent:** visual-systems-designer
- **Type:** task

## Purpose

Create engaging social media post visuals for organic content.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `platform` | string | Yes | instagram/linkedin/facebook/twitter |
| `post_type` | string | Yes | single/carousel/infographic/quote |
| `content` | object | Yes | Text content, key points |
| `brand` | string | No | Brand guidelines reference |

## Process

### 1. Content Analysis
- Identify key message
- Determine visual approach
- Plan information hierarchy
- Select appropriate format

### 2. Design Execution
- Create layout
- Apply brand styling
- Add visual elements
- Optimize text placement

### 3. Carousel Flow (if applicable)
- Hook slide (stop scroll)
- Content slides (deliver value)
- CTA slide (drive action)
- Consistent design thread

### 4. Final Polish
- Check brand consistency
- Verify readability
- Test on mobile
- Export for platform

## Output

```yaml
social_post:
  platform: "{platform}"
  post_type: "{post_type}"

  deliverables:
    - slide: 1
      purpose: "hook"
      file: "{path}"
    - slide: 2
      purpose: "content"
      file: "{path}"
    # ... additional slides

  specs:
    size: "1080x1080"
    format: "png"
    color_profile: "sRGB"

  caption_suggestion: "{optional_caption}"
```

## Post Type Guidelines

### Single Image
- One clear message
- Bold visual
- Minimal text
- Strong brand presence

### Carousel (5-10 slides)
1. **Hook:** Provocative question/statement
2. **Problem:** Relate to audience pain
3-8. **Content:** Deliver value
9. **Summary:** Key takeaways
10. **CTA:** Save, share, follow

### Infographic
- Data visualization
- Clear sections
- Source citations
- Shareable insights

### Quote
- Attributed properly
- Visual impact
- Brand styling
- Conversation starter

## Quality Criteria

- [ ] Platform-optimized size
- [ ] Mobile-readable text
- [ ] Brand consistent
- [ ] Engagement-focused
- [ ] Clear hierarchy

## Related

- **Workflow:** `/design/social-content-pack`
- **Checklist:** `brand-consistency.md`
