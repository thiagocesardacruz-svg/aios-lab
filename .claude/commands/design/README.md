# Design Squad

> Creative Design for Conversion

## Mission

Transform strategy into visual assets that sell. Every design must stop scrolls, communicate value, and drive action.

## Golden Rule

**Design does not decide strategy, write offers, or run media.** It receives validated briefs and produces conversion-focused assets.

## Agents

| Agent | Name | Role |
|-------|------|------|
| `design-lead` | **Pixel** | Creative direction, brand QA |
| `performance-designer` | **Blaze** | Ads, conversion creatives |
| `motion-video-specialist` | **Flux** | VSLs, video ads, reels |
| `visual-systems-designer` | **Grid** | Carousels, infographics, templates |
| `ai-image-creator` | **Canvas** | AI image generation (OpenRouter) |

## Commands

### Workflows

| Command | Description |
|---------|-------------|
| `/design/ad-creative-pack` | Complete ad pack (6-12 creatives) |
| `/design/social-content-pack` | Social posts and templates |
| `/design/vsl-kit` | VSL slides and visual structure |
| `/design/brand-kit` | Minimal brand identity |
| `/design/landing-visual` | Landing page design |

### Tasks

| Command | Description |
|---------|-------------|
| `/design/ad-creative` | Design single ad creative |
| `/design/social-post` | Design social media post |
| `/design/vsl-slides` | Design VSL slides |
| `/design/review` | Review creative assets |
| `/design/brand-assets` | Create brand assets |
| `/design/generate-image` | Generate single AI image |

### AI Image Generation (NEW)

| Command | Description |
|---------|-------------|
| `/design/ai-image-pack` | Generate complete AI image pack |
| `/design/ai-image` | Direct CLI for image generation |

## AI Image Generation

Generate images using OpenRouter API with multiple models:

### Available Models

| Model | Alias | Cost/Image | Best For |
|-------|-------|------------|----------|
| Gemini 2.5 Flash Image | `nano-banana` | €0.02 | Quick concepts, drafts |
| GPT-5 Image Mini | `gpt-5-image-mini` | €0.03 | Production assets |
| Seedream 4.5 | `seedream` | €0.04 | Edits, portraits |
| Riverflow V2 Pro | `riverflow` | €0.05 | Text in images |
| GPT-5 Image | `gpt-5-image` | €0.08 | Premium/hero images |

### Quick Start

```bash
# Generate image with Nano Banana (recommended for drafts)
node scripts/image-generator.mjs generate "Modern hotel lobby with plants" --style=luxury

# Generate ad creative
node scripts/image-generator.mjs generate "Facebook ad for hotel booking" --size=fb-ad --style=ad

# Generate with specific model
node scripts/image-generator.mjs generate "Premium hero image" --model=gpt-5-image

# Cost estimate
node scripts/image-generator.mjs cost "My prompt" --model=nano-banana --n=5
```

### Style Presets

| Preset | Description |
|--------|-------------|
| `photorealistic` | Professional photography style |
| `luxury` | Premium, elegant aesthetic |
| `ad` | Advertising, conversion-focused |
| `social` | Social media optimized |
| `minimal` | Clean, minimalist design |
| `tech` | Modern tech aesthetic |
| `travel` | Travel photography style |

### Size Presets

| Preset | Dimensions | Platform |
|--------|------------|----------|
| `ig-post` | 1080x1080 | Instagram feed |
| `ig-story` | 1080x1920 | Instagram stories |
| `fb-ad` | 1200x628 | Facebook ads |
| `wide` | 1920x1080 | Hero images |
| `square` | 1024x1024 | General purpose |

### Setup

1. Get API key from [OpenRouter](https://openrouter.ai/keys)
2. Copy `config/openrouter.example.json` to `config/openrouter.json`
3. Add your API key
4. Or set `OPENROUTER_API_KEY` environment variable

## Structure

```
design/
├── squad.yaml                     # v1.1.0 - Configuration
├── README.md
├── agents/
│   ├── design-lead.md             # Pixel
│   ├── performance-designer.md    # Blaze
│   ├── motion-video-specialist.md # Flux
│   └── visual-systems-designer.md # Grid
├── tasks/
│   ├── design-ad-creative.md
│   ├── design-social-post.md
│   ├── design-vsl-slides.md
│   ├── review-creative.md
│   └── create-brand-assets.md
├── workflows/
│   ├── ad-creative-pack.yaml
│   ├── social-content-pack.yaml
│   ├── vsl-kit.yaml
│   ├── brand-kit.yaml
│   └── landing-visual.yaml
├── templates/
│   ├── creative-brief.md
│   └── brand-guidelines.md
├── checklists/
│   ├── creative-conversion.md
│   ├── brand-consistency.md
│   └── visual-hierarchy.md
└── data/
    ├── platform-specs.yaml
    └── design-tokens.yaml
```

## Tasks

| Task | Agent | Purpose |
|------|-------|---------|
| `design-ad-creative` | performance-designer | Create ad creatives |
| `design-social-post` | visual-systems-designer | Create social posts |
| `design-vsl-slides` | motion-video-specialist | Create VSL visuals |
| `review-creative` | design-lead | Review and approve |
| `create-brand-assets` | design-lead | Create brand identity |

## Templates

| Template | Purpose |
|----------|---------|
| `creative-brief.md` | Standard briefing document |
| `brand-guidelines.md` | Brand identity guidelines |

## Checklists

| Checklist | Purpose |
|-----------|---------|
| `creative-conversion.md` | Conversion optimization |
| `brand-consistency.md` | Brand compliance |
| `visual-hierarchy.md` | Visual hierarchy validation |

## Data Files

| File | Purpose |
|------|---------|
| `platform-specs.yaml` | Platform dimensions & specs |
| `design-tokens.yaml` | Brand design tokens |

## Process

```
Briefing → Design Lead Review → Execution → QA → Handoff
    ↓           ↓                  ↓         ↓       ↓
 Validated   Standards set     Specialist  Lead    Tech/Mkt
```

## Interface

### Receives From
| Squad | What |
|-------|------|
| Marketing | Offer, ICP, angle, messaging |
| Sales | Value prop, objections, proof |
| OPS | Service Order with requirements |

### Delivers To
| Squad | What |
|-------|------|
| Marketing | Creatives, templates, guidelines |
| Tech | Specs, assets, layouts |

## What Design Does NOT Do

| No | Why |
|----|-----|
| Strategy | Receives strategy, doesn't create it |
| Copywriting | Receives approved copy |
| Media buying | Creates assets, doesn't run them |
| UI components | That's Design System squad |
| Implementation | That's Tech squad |

## Quality Standards

### Conversion Focus
- Clear visual hierarchy
- Prominent CTAs
- Mobile-first design
- Fast-loading assets
- Scroll-stopping hooks

### Brand Consistency
- Color palette compliance
- Typography rules
- Logo usage guidelines
- Tone alignment

### Technical Quality
- Correct platform specs
- Optimized file sizes
- Proper color profiles
- No artifacts/blur

## Platform Quick Reference

| Platform | Feed | Story | Profile |
|----------|------|-------|---------|
| Facebook | 1080x1080 | 1080x1920 | 170x170 |
| Instagram | 1080x1080 | 1080x1920 | 320x320 |
| LinkedIn | 1200x627 | N/A | 400x400 |
| TikTok | N/A | 1080x1920 | N/A |
| YouTube | 1920x1080 | 1080x1920 | 800x800 |

## Related Squads

| Squad | Relationship |
|-------|-------------|
| **Design System** | UI components, tokens, apps |
| **Marketing** | Provides briefs, receives assets |
| **Tech** | Implements designs |
| **Growth** | Uses assets for campaigns |

---

*Design Squad v1.2.0 - Travel Tech Digital AIOS*
*Now with AI Image Generation via OpenRouter*
