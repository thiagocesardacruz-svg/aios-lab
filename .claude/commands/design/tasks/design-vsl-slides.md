# Design VSL Slides

## Identity
- **ID:** design-vsl-slides
- **Squad:** design
- **Agent:** motion-video-specialist
- **Type:** task

## Purpose

Create visual slides and motion graphics for Video Sales Letters (VSLs).

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `script` | string | Yes | VSL script with timestamps |
| `duration` | string | Yes | Target video length |
| `style` | string | No | kinetic/slides/mixed |
| `brand` | string | No | Brand guidelines reference |

## Process

### 1. Script Breakdown
- Analyze script sections
- Identify key visuals
- Map emotional beats
- Plan transitions

### 2. Storyboard
- Sketch key frames
- Plan text animations
- Note timing
- Identify assets needed

### 3. Slide Design
- Create master slides
- Design section templates
- Build text animations
- Add visual elements

### 4. Motion Design
- Animate key elements
- Create transitions
- Add emphasis effects
- Sync to script timing

## Output

```yaml
vsl_slides:
  duration: "{total_duration}"
  style: "{style}"

  sections:
    - name: "hook"
      duration: "0:00-0:30"
      slides: 5
      files: ["{paths}"]
    - name: "problem"
      duration: "0:30-2:00"
      slides: 10
      files: ["{paths}"]
    # ... additional sections

  assets:
    - type: "animated_text"
      file: "{path}"
    - type: "transition"
      file: "{path}"

  specs:
    resolution: "1920x1080"
    format: "png/mov"
    fps: 30
```

## VSL Structure

### Hook (0-30 sec)
- Pattern interrupt
- Big promise
- Curiosity builder

### Problem (30 sec - 3 min)
- Identify pain
- Agitate consequences
- Show understanding

### Solution (3-6 min)
- Introduce solution
- Explain mechanism
- Build credibility

### Proof (6-10 min)
- Testimonials
- Case studies
- Results/data

### Offer (10-15 min)
- Stack value
- Present price
- Add bonuses

### Close (15-20 min)
- Summarize
- Handle objections
- Final CTA
- Urgency/scarcity

## Visual Guidelines

### Text Animation
- Max 7 words per frame
- 3-5 second per concept
- Highlight keywords
- Consistent timing

### Color Usage
- Dark background (reduce eye strain)
- High contrast text
- Accent for emphasis
- Brand colors for CTA

### Transitions
- Clean cuts
- Subtle motion
- Consistent style
- Don't distract

## Quality Criteria

- [ ] Script timing matched
- [ ] Text readable at all sizes
- [ ] Emotional beats visualized
- [ ] Brand consistent
- [ ] Mobile-viewable

## Related

- **Workflow:** `/design/vsl-kit`
- **Checklist:** `visual-hierarchy.md`
