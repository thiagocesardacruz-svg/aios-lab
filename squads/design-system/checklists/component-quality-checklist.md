# Component Quality Checklist

**Purpose:** Validate component quality before release
**Standard:** Production-ready components

---

## DESIGN TOKEN COMPLIANCE

- [ ] All colors from design tokens
- [ ] All spacing from design tokens
- [ ] All typography from design tokens
- [ ] All shadows from design tokens
- [ ] All border-radius from design tokens
- [ ] Zero hardcoded values

---

## CODE QUALITY

### TypeScript
- [ ] Strict mode enabled
- [ ] No `any` types
- [ ] Props interface defined
- [ ] Return type explicit
- [ ] No type assertions unless necessary

### React Best Practices
- [ ] Functional component
- [ ] Props destructured
- [ ] Default props handled
- [ ] Keys used correctly in lists
- [ ] No unnecessary re-renders
- [ ] useCallback/useMemo where needed

### Naming
- [ ] Component PascalCase
- [ ] Props interface named `{Component}Props`
- [ ] Event handlers prefixed with `on`
- [ ] Boolean props prefixed with `is/has/should`

---

## VARIANTS & STATES

- [ ] All variants implemented (size, color, etc.)
- [ ] Default variant defined
- [ ] Hover state styled
- [ ] Focus state styled
- [ ] Active state styled
- [ ] Disabled state implemented
- [ ] Loading state (if applicable)
- [ ] Error state (if applicable)

---

## ACCESSIBILITY

- [ ] Semantic HTML elements
- [ ] ARIA attributes correct
- [ ] Keyboard navigable
- [ ] Focus visible
- [ ] Color contrast passing
- [ ] Screen reader tested

---

## RESPONSIVE

- [ ] Mobile-first approach
- [ ] Works at all breakpoints
- [ ] Touch-friendly (44x44 min)
- [ ] No horizontal overflow

---

## TESTING

- [ ] Unit tests written
- [ ] All variants tested
- [ ] Edge cases covered
- [ ] Coverage > 80%
- [ ] Tests passing

---

## DOCUMENTATION

- [ ] Props documented
- [ ] Usage examples
- [ ] Variant examples
- [ ] Accessibility notes
- [ ] Changelog entry

---

**Quality Gate:** [ ] PASS [ ] FAIL

**Reviewer:** _______________ **Date:** _______________
