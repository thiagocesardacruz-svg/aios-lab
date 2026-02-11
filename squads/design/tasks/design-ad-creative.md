# Design Ad Creative

## Identity
- **ID:** design-ad-creative
- **Squad:** design
- **Agent:** performance-designer
- **Type:** task

## Purpose

Create conversion-focused ad creatives for paid media campaigns.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `platform` | string | Yes | facebook/instagram/linkedin/google/tiktok |
| `format` | string | Yes | static/carousel/video |
| `copy` | object | Yes | Approved headline, body, CTA |
| `brand` | string | No | Brand guidelines reference |
| `references` | list | No | Visual references/inspiration |

## Process

### 1. Brief Review
- Verify all copy is approved
- Confirm platform specs
- Check brand guidelines
- Review references

### 2. Concept Development
- Create 3 visual concepts
- Focus on scroll-stopping hook
- Ensure clear hierarchy
- Plan CTA placement

### 3. Design Execution
- Design to platform specs
- Apply brand colors/fonts
- Optimize for mobile
- Create size variations

### 4. Quality Check
- Run creative-conversion checklist
- Verify text legibility
- Check file sizes
- Test on device

## Output

```yaml
ad_creative:
  platform: "{platform}"
  format: "{format}"

  deliverables:
    - name: "{creative_name}_v1"
      size: "1080x1080"
      format: "png"
      file: "{path}"
    - name: "{creative_name}_v2"
      size: "1080x1920"
      format: "png"
      file: "{path}"

  specs:
    file_size: "{kb}"
    color_profile: "sRGB"
    resolution: "72dpi"

  notes: "{any_design_notes}"
```

## Platform Specs

| Platform | Format | Size | Max Text |
|----------|--------|------|----------|
| Facebook Feed | 1:1 | 1080x1080 | 20% |
| Facebook Story | 9:16 | 1080x1920 | 20% |
| Instagram Feed | 1:1 | 1080x1080 | 20% |
| Instagram Story | 9:16 | 1080x1920 | 20% |
| LinkedIn | 1.91:1 | 1200x627 | No limit |
| Google Display | Various | Multiple | Follow specs |

## Quality Criteria

- [ ] Scroll-stopping hook
- [ ] Clear visual hierarchy
- [ ] CTA prominent
- [ ] Mobile-optimized
- [ ] Brand compliant
- [ ] Platform specs met

## Related

- **Workflow:** `/design/ad-creative-pack`
- **Checklist:** `creative-conversion.md`
- **Template:** `creative-brief.md`
