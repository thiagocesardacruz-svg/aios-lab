# Task: Create Component

> Implement UI component following Design System specifications

## Metadata

| Field | Value |
|-------|-------|
| **ID** | create-component |
| **Agent** | application-developer |
| **Type** | implementation |
| **Complexity** | medium |

## Objective

Create a production-ready UI component that adheres to Design System tokens and patterns.

## Prerequisites

- [ ] Design System tokens available
- [ ] Component spec from design team
- [ ] shadcn/ui configured in project

## Inputs

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| `component_name` | text | yes | Name of the component |
| `design_spec` | file | yes | Figma/spec link or file |
| `tokens` | yaml | yes | Design tokens to use |
| `variants` | list | no | Component variants needed |

## Process

### Step 1: Analyze Design Spec
- Review Figma/design spec
- Identify tokens used (colors, spacing, typography)
- List all states (default, hover, active, disabled, error)
- Document variants needed

### Step 2: Check Existing Components
- Search shadcn/ui for base component
- Check if similar component exists
- Identify what can be reused

### Step 3: Implementation

```typescript
// Component structure
components/
├── ui/
│   └── {component-name}/
│       ├── index.tsx        // Main component
│       ├── variants.ts      // cva variants
│       └── types.ts         // TypeScript types
```

#### Implementation Checklist
- [ ] Use Design System tokens (no hardcoded values)
- [ ] Implement all states
- [ ] Add TypeScript types
- [ ] Add accessibility attributes
- [ ] Support className override
- [ ] Use cva for variants

### Step 4: Testing
- [ ] Visual matches design spec
- [ ] All states work correctly
- [ ] Responsive behavior
- [ ] Accessibility (keyboard, screen reader)
- [ ] Works in light/dark mode

### Step 5: Documentation
- [ ] Props documented
- [ ] Usage examples
- [ ] Storybook story (if applicable)

## Output

| Output | Type | Description |
|--------|------|-------------|
| `component_files` | files | Component implementation |
| `types` | file | TypeScript definitions |
| `usage_example` | code | Example usage |

## Quality Gates

- [ ] No hardcoded colors/spacing (uses tokens)
- [ ] TypeScript types complete
- [ ] All states implemented
- [ ] Accessibility tested
- [ ] Matches design spec exactly

## Anti-Patterns

- **DON'T** invent UI patterns not in Design System
- **DON'T** hardcode colors, spacing, or typography
- **DON'T** skip accessibility attributes
- **DON'T** create without design spec approval

---

*Task v1.0 - Tech Squad*
