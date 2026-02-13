# Task: Generate AI Image

## Meta

| Field | Value |
|-------|-------|
| **ID** | generate-ai-image |
| **Agent** | ai-image-creator |
| **Type** | generation |
| **Complexity** | 3/10 |

## Description

Generate AI images using OpenRouter models (Nano Banana, GPT-5 Image, etc.) based on a creative brief or prompt.

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Image description/prompt |
| `style` | enum | No | Style preset (luxury, minimal, ad, etc.) |
| `size` | enum | No | Size preset or WxH |
| `model` | enum | No | Model override (default: auto-select) |
| `quantity` | number | No | Number of variations (default: 1) |
| `brand_context` | object | No | Brand guidelines reference |

## Process

### Step 1: Analyze Brief
```yaml
actions:
  - Parse prompt for key elements
  - Identify target use case (ad, social, hero, etc.)
  - Check brand context if provided
  - Determine optimal size
```

### Step 2: Select Model
```yaml
decision_tree:
  draft_or_concept:
    model: nano-banana
    reason: "Cheap iterations"

  production_asset:
    model: gpt-5-image-mini
    reason: "Good quality, reasonable cost"

  needs_text_rendering:
    model: riverflow
    reason: "Best text in images"

  premium_hero:
    model: gpt-5-image
    reason: "Highest quality"

  image_edit:
    model: seedream
    reason: "Best for edits"
```

### Step 3: Engineer Prompt
```yaml
prompt_structure:
  - subject: "What is in the image"
  - style: "Visual style and aesthetic"
  - mood: "Emotional tone"
  - technical: "Lighting, composition, quality"
  - brand: "Brand-specific elements"

example: |
  Modern hotel lobby with tropical plants [subject],
  luxury minimalist design style [style],
  warm and inviting atmosphere [mood],
  professional photography, soft natural light, wide angle [technical],
  brand colors: teal accents, clean white surfaces [brand]
```

### Step 4: Generate
```bash
# Execute generation
node scripts/image-generator.mjs generate "{enhanced_prompt}" \
  --model={selected_model} \
  --size={target_size} \
  --style={style_preset} \
  --n={quantity}
```

### Step 5: Evaluate & Iterate
```yaml
evaluation:
  - Does it match the brief?
  - Is the style consistent?
  - Are brand elements present?
  - Is the quality sufficient?

if_needs_improvement:
  - Refine prompt
  - Try different model
  - Generate more variations
```

### Step 6: Deliver
```yaml
outputs:
  - Save to appropriate folder
  - Document generation parameters
  - Note model and cost for tracking
```

## Outputs

| Output | Type | Location |
|--------|------|----------|
| Generated image(s) | PNG/JPG | `outputs/images/{category}/` |
| Generation log | JSON | `outputs/images/logs/` |
| Cost summary | YAML | (for cost tracking) |

## Examples

### Example 1: Ad Creative Concept
```bash
# Input
prompt: "Facebook ad for hotel booking platform"
style: ad
size: fb-ad
quantity: 3

# Execution
node scripts/image-generator.mjs generate \
  "Facebook advertisement for hotel booking platform, eye-catching design,
  clear space for CTA button, travel imagery, professional" \
  --model=nano-banana --size=fb-ad --style=ad --n=3

# Output
3 concept images at €0.06 total
```

### Example 2: Hero Image for Landing Page
```bash
# Input
prompt: "Hero image for luxury hotel website"
style: luxury
size: wide
model: gpt-5-image  # Force high quality

# Execution
node scripts/image-generator.mjs generate \
  "Stunning luxury hotel exterior at golden hour, Mediterranean villa style,
  infinity pool overlooking ocean, warm sunset colors, aspirational,
  professional architecture photography, premium quality" \
  --model=gpt-5-image --size=wide --style=luxury

# Output
1 premium hero image at €0.08
```

### Example 3: Social Media Pack
```bash
# Input
prompt: "Instagram content for travel brand"
style: social
size: ig-post
quantity: 5

# Execution (iterate with cheap model)
node scripts/image-generator.mjs generate \
  "Instagram post for travel brand, wanderlust aesthetic,
  beautiful destination, engaging, scroll-stopping,
  vibrant colors, lifestyle photography" \
  --model=nano-banana --size=ig-post --style=social --n=5

# Output
5 social images at €0.10 total
```

## Quality Checklist

- [ ] Image matches the brief description
- [ ] Style is consistent with preset/brand
- [ ] Appropriate quality for use case
- [ ] Correct dimensions for platform
- [ ] No obvious AI artifacts
- [ ] Cost is within budget expectations

## Cost Reference

| Use Case | Recommended Model | Cost/Image |
|----------|------------------|------------|
| Concepts/Drafts | Nano Banana | €0.02 |
| Social Posts | Nano Banana or GPT-5 Mini | €0.02-0.03 |
| Ad Creatives | GPT-5 Image Mini | €0.03 |
| Blog/Article Images | Nano Banana | €0.02 |
| Hero Images | GPT-5 Image | €0.08 |
| Images with Text | Riverflow | €0.05 |

---

*Task: generate-ai-image | Design Squad*
