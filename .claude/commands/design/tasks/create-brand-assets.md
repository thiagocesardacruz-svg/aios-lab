# Create Brand Assets

## Identity
- **ID:** create-brand-assets
- **Squad:** design
- **Agent:** design-lead
- **Type:** task

## Purpose

Create or update brand identity assets including logo variations, color palettes, and brand collateral.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `brand_name` | string | Yes | Brand/company name |
| `existing_assets` | list | No | Current brand files |
| `direction` | string | No | Style direction/keywords |
| `deliverables` | list | No | Specific assets needed |

## Process

### 1. Brand Discovery
- Review existing assets
- Understand brand values
- Define style direction
- Identify deliverables

### 2. Logo System
- Primary logo
- Logo variations
- Icon/mark
- Clear space rules
- Minimum sizes

### 3. Color Palette
- Primary colors
- Secondary colors
- Accent colors
- Neutral palette
- Accessibility check

### 4. Typography
- Primary font selection
- Secondary font (if needed)
- Type scale definition
- Usage guidelines

### 5. Asset Package
- Export all formats
- Organize files
- Create guidelines doc
- Prepare handoff

## Output

```yaml
brand_assets:
  brand_name: "{name}"
  created_date: "{date}"

  logo_system:
    primary:
      svg: "{path}"
      png: "{path}"
    reversed:
      svg: "{path}"
      png: "{path}"
    icon:
      svg: "{path}"
      favicon: "{path}"

  color_palette:
    primary:
      name: "{name}"
      hex: "#{hex}"
      rgb: "rgb({r},{g},{b})"
    secondary:
      name: "{name}"
      hex: "#{hex}"
    accent:
      name: "{name}"
      hex: "#{hex}"
    neutrals:
      - name: "Dark"
        hex: "#{hex}"
      - name: "Light"
        hex: "#{hex}"

  typography:
    primary_font: "{font_name}"
    secondary_font: "{font_name}"
    source: "{google_fonts/custom}"

  files:
    guidelines: "{brand-guidelines.pdf}"
    asset_package: "{brand-assets.zip}"

  folder_structure:
    - "logos/"
    - "colors/"
    - "fonts/"
    - "templates/"
    - "guidelines/"
```

## Deliverables Checklist

### Logo Files
- [ ] SVG (vector, scalable)
- [ ] PNG transparent (1x, 2x)
- [ ] PNG on white background
- [ ] Favicon (16x16, 32x32, 180x180)
- [ ] Social profile sizes

### Color Files
- [ ] ASE/ACO swatches
- [ ] CSS variables
- [ ] Tailwind config
- [ ] Palette image

### Typography
- [ ] Font files (if custom)
- [ ] Google Fonts link
- [ ] Type scale reference

### Guidelines
- [ ] Brand guidelines PDF
- [ ] Quick reference card
- [ ] Do's and Don'ts

## Quality Criteria

- [ ] Logo works at all sizes
- [ ] Colors pass accessibility
- [ ] Typography is legible
- [ ] Files properly organized
- [ ] Guidelines documented

## Related

- **Workflow:** `/design/brand-kit`
- **Template:** `brand-guidelines.md`
- **Checklist:** `brand-consistency.md`
