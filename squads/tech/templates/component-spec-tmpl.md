# Component Spec: {COMPONENT_NAME}

> Technical specification for UI component implementation

**Version:** 1.0
**Date:** {DATE}
**Author:** {AUTHOR}
**Status:** Draft | Ready | Implemented

---

## Overview

**Component Name:** {name}
**Category:** [Button | Input | Card | Modal | Layout | etc.]
**Design System Reference:** [Link to Figma/design]

### Purpose
[Brief description of what this component does]

### Usage Context
[Where and when this component should be used]

---

## Design Tokens

### Colors
| Token | Usage |
|-------|-------|
| `--color-{name}` | [Usage] |

### Spacing
| Token | Usage |
|-------|-------|
| `--spacing-{name}` | [Usage] |

### Typography
| Token | Usage |
|-------|-------|
| `--font-{name}` | [Usage] |

### Border Radius
| Token | Usage |
|-------|-------|
| `--radius-{name}` | [Usage] |

---

## Variants

| Variant | Description | Use Case |
|---------|-------------|----------|
| `default` | Default appearance | [When to use] |
| `{variant}` | [Description] | [When to use] |

---

## States

| State | Visual Changes | Interaction |
|-------|----------------|-------------|
| Default | [Description] | - |
| Hover | [Description] | Mouse over |
| Active | [Description] | Click/tap |
| Focus | [Description] | Keyboard focus |
| Disabled | [Description] | Non-interactive |
| Loading | [Description] | Async operation |
| Error | [Description] | Validation failed |

---

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | enum | 'default' | no | Visual variant |
| `size` | enum | 'md' | no | Size variant |
| `disabled` | boolean | false | no | Disabled state |
| `className` | string | - | no | Additional classes |
| `children` | ReactNode | - | depends | Content |

---

## Accessibility

### ARIA
- [ ] `role` defined (if needed)
- [ ] `aria-label` for icon-only
- [ ] `aria-disabled` for disabled state
- [ ] `aria-expanded` (if applicable)

### Keyboard
| Key | Action |
|-----|--------|
| Tab | Focus element |
| Enter | Activate |
| Space | Activate |
| Escape | Close (if applicable) |

### Screen Reader
[Notes on screen reader behavior]

---

## Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Mobile (<640px) | [Behavior] |
| Tablet (640-1024px) | [Behavior] |
| Desktop (>1024px) | [Behavior] |

---

## Code Example

```tsx
import { {ComponentName} } from '@/components/ui/{component-name}'

// Basic usage
<{ComponentName}>
  Content
</{ComponentName}>

// With variants
<{ComponentName} variant="primary" size="lg">
  Content
</{ComponentName}>

// Disabled
<{ComponentName} disabled>
  Content
</{ComponentName}>
```

---

## Implementation Notes

### Dependencies
- [ ] shadcn/ui base component: [name]
- [ ] Icons: [icon library]
- [ ] Animation: [library if any]

### Files to Create
```
components/ui/{component-name}/
├── index.tsx
├── variants.ts
└── types.ts
```

### Edge Cases
- [Edge case 1]
- [Edge case 2]

---

## Testing Checklist

- [ ] Visual matches design spec
- [ ] All variants render correctly
- [ ] All states work
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Mobile responsive
- [ ] Dark mode works

---

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Design | | | [ ] |
| Tech | | | [ ] |
| QA | | | [ ] |

---

*Template v1.0 - Tech Squad*
