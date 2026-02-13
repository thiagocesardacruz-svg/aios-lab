# Design System Squad

> Brad Frost Atomic Design Methodology

## Mission

Build and maintain a 100% independent design system for consistent, accessible, and scalable UI components across all Travel Tech Digital products.

## Independence

**This squad is 100% self-contained:**
- No database required
- No external APIs
- No cloud services
- Works with any codebase (React, Vue, HTML/CSS)
- All operations are filesystem-based

## Agent

| Agent | Name | Role |
|-------|------|------|
| `design-system` | **Atlas** | UI audit, tokens, components, accessibility |

## Commands

### Workflows

| Command | Description |
|---------|-------------|
| `/ds/brownfield` | Complete brownfield audit and migration |
| `/ds/greenfield` | New design system from scratch |
| `/ds/audit-only` | Audit only, no migration |

### Audit & Analysis

| Command | Description |
|---------|-------------|
| `/ds/audit` | Audit codebase for UI patterns |
| `/ds/consolidate` | Consolidate patterns via clustering |
| `/ds/shock-report` | Generate visual shock report |
| `/ds/calculate-roi` | Calculate ROI and cost savings |

### Token Management

| Command | Description |
|---------|-------------|
| `/ds/tokenize` | Extract design tokens |
| `/ds/export-tokens` | Export tokens (CSS/Tailwind/SCSS) |
| `/ds/token-analytics` | Analyze token usage |

### Component Building

| Command | Description |
|---------|-------------|
| `/ds/setup` | Initialize design system |
| `/ds/build` | Build component with tests |
| `/ds/compose` | Compose molecule from atoms |
| `/ds/extend` | Extend existing pattern |
| `/ds/document` | Generate documentation |
| `/ds/bootstrap-shadcn` | Setup shadcn/ui library |

### Accessibility

| Command | Description |
|---------|-------------|
| `/ds/a11y-audit` | Full accessibility audit |
| `/ds/aria-audit` | ARIA attributes audit |
| `/ds/contrast` | Color contrast analysis |
| `/ds/focus-order` | Focus order validation |

### Refactoring

| Command | Description |
|---------|-------------|
| `/ds/refactor-plan` | Plan atomic refactoring |
| `/ds/refactor-execute` | Execute refactoring |
| `/ds/dead-code` | Detect unused patterns |

### Maintenance

| Command | Description |
|---------|-------------|
| `/ds/health` | Design system health score |
| `/ds/bundle-audit` | Analyze bundle impact |
| `/ds/tailwind-upgrade` | Upgrade Tailwind version |
| `/ds/validate-fidelity` | Check design fidelity |
| `/ds/migrate` | Generate migration strategy |

## Structure

```
design-system/
├── squad.yaml                     # v2.3.0 - Configuration
├── README.md
├── agents/
│   └── design-system.md           # Atlas
├── tasks/                         # 33 tasks
│   ├── ds-audit-codebase.md
│   ├── ds-build-component.md
│   ├── ds-extract-tokens.md
│   ├── a11y-audit.md
│   └── ...
├── workflows/
│   ├── brownfield-complete.yaml
│   ├── greenfield-new.yaml
│   └── audit-only.yaml
├── templates/                     # 10 templates
│   ├── component-visual-spec-tmpl.md
│   ├── design-fidelity-report-tmpl.md
│   ├── ds-tokens-schema-tmpl.yaml
│   └── ...
├── checklists/                    # 11 checklists
│   ├── accessibility-wcag-checklist.md
│   ├── component-quality-checklist.md
│   ├── pattern-audit-checklist.md
│   └── ...
└── data/                          # 9 knowledge base files
    ├── atomic-design-principles.md
    ├── design-token-best-practices.md
    ├── wcag-compliance-guide.md
    └── ...
```

## Atomic Design Methodology

> "Show the horror, then fix it" - Brad Frost

```
Atoms → Molecules → Organisms → Templates → Pages
  │         │           │           │          │
Button    FormField    Form      FormLayout  LoginPage
Input     SearchBar    Header    PageLayout  Dashboard
```

## Workflows

### 1. Brownfield (70% of use cases)

Audit existing codebase → consolidate → migrate

```bash
/ds/audit ./src          # Scan for pattern redundancy
/ds/consolidate          # Reduce via HSL clustering
/ds/tokenize             # Generate design tokens
/ds/migrate              # Generate migration strategy
/ds/build button         # Generate Button component
```

### 2. Greenfield (20% of use cases)

Start fresh with token-based design system

```bash
/ds/setup                # Initialize structure
/ds/build button         # Generate components
/ds/compose form-field   # Create molecules
/ds/document             # Generate docs
```

### 3. Audit Only (10% of use cases)

Generate reports for stakeholders

```bash
/ds/audit ./src          # Scan codebase
/ds/shock-report         # Visual HTML report
/ds/calculate-roi        # Cost analysis
```

## Templates

| Template | Purpose |
|----------|---------|
| `component-visual-spec-tmpl.md` | Component specification |
| `design-fidelity-report-tmpl.md` | Design fidelity report |
| `ds-health-report-tmpl.md` | System health report |
| `ds-migration-strategy-tmpl.md` | Migration strategy |
| `ds-tokens-schema-tmpl.yaml` | Token schema |
| `migration-strategy-tmpl.md` | Migration plan |
| `state-persistence-tmpl.yaml` | State persistence |
| `tokens-schema-tmpl.yaml` | Token structure |

## Checklists

| Checklist | Purpose |
|-----------|---------|
| `accessibility-wcag-checklist.md` | WCAG AA compliance |
| `component-quality-checklist.md` | Component quality |
| `pattern-audit-checklist.md` | Pattern audit |
| `migration-readiness-checklist.md` | Migration readiness |
| `atomic-refactor-checklist.md` | Refactoring |
| `design-fidelity-checklist.md` | Design fidelity |
| `reading-accessibility-checklist.md` | Reading accessibility |

## Data / Knowledge Base

| File | Purpose |
|------|---------|
| `atomic-design-principles.md` | Atomic Design methodology |
| `design-token-best-practices.md` | Token naming and structure |
| `consolidation-algorithms.md` | HSL clustering algorithms |
| `roi-calculation-guide.md` | ROI and cost analysis |
| `integration-patterns.md` | Framework integration |
| `wcag-compliance-guide.md` | Accessibility guidelines |
| `high-retention-reading-guide.md` | Reading UX |
| `atomic-refactor-rules.md` | Refactoring rules |
| `design-tokens-spec.yaml` | Token specification |

## ROI Example

```
Pattern Count: 176 → 24 (86.4% reduction)
Developer Hours Saved: 240h/year
Cost Savings: $374,400/year
ROI: 34.6x
Breakeven: 10 days
```

## Token Output Example

```css
:root {
  /* Colors */
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;

  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;

  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
}
```

## Component Standards

Generated components follow:
- **React TypeScript** with strict mode
- **Token-based styling** (zero hardcoded values)
- **WCAG AA accessibility** minimum
- **Unit tests** with >80% coverage
- **Storybook stories** included
- **Atomic Design structure**

## Integration

Design System delivers to Tech squad:
- Design tokens (CSS, Tailwind, SCSS)
- React/Vue components
- Accessibility guidelines
- Component documentation

---

*Design System Squad v2.3.0 - Travel Tech Digital AIOS*
