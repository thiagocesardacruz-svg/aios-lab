# Component QA Checklist

> Quality assurance checklist for UI components

## Metadata
- **Component:**
- **Tester:**
- **Date:**
- **Design Spec:**

---

## 1. Visual Match

### Design Fidelity
- [ ] Matches Figma/design spec exactly
- [ ] Colors match tokens
- [ ] Spacing matches tokens
- [ ] Typography matches tokens
- [ ] Border radius matches tokens
- [ ] Icons are correct

### Pixel Perfect
- [ ] Dimensions are correct
- [ ] Padding is correct
- [ ] Margins are correct
- [ ] Alignment is correct

---

## 2. States

### Interactive States
- [ ] **Default** - Initial appearance correct
- [ ] **Hover** - Hover effect works
- [ ] **Active** - Click/press effect works
- [ ] **Focus** - Focus ring visible
- [ ] **Disabled** - Appears disabled, not clickable

### Data States
- [ ] **Empty** - Empty state displays
- [ ] **Loading** - Loading indicator shows
- [ ] **Error** - Error state displays
- [ ] **Success** - Success state displays

---

## 3. Variants

| Variant | Tested | Pass |
|---------|--------|------|
| Default | [ ] | [ ] |
| Primary | [ ] | [ ] |
| Secondary | [ ] | [ ] |
| Destructive | [ ] | [ ] |
| Ghost | [ ] | [ ] |
| Link | [ ] | [ ] |

### Sizes
| Size | Tested | Pass |
|------|--------|------|
| sm | [ ] | [ ] |
| md | [ ] | [ ] |
| lg | [ ] | [ ] |

---

## 4. Responsive

### Breakpoints
| Breakpoint | Tested | Pass | Notes |
|------------|--------|------|-------|
| Mobile (320px) | [ ] | [ ] | |
| Mobile (375px) | [ ] | [ ] | |
| Tablet (768px) | [ ] | [ ] | |
| Desktop (1024px) | [ ] | [ ] | |
| Desktop (1440px) | [ ] | [ ] | |

### Touch
- [ ] Tap targets are at least 44x44px
- [ ] Touch interactions work
- [ ] No hover-only features on mobile

---

## 5. Accessibility

### Keyboard
- [ ] Focusable with Tab
- [ ] Activates with Enter
- [ ] Activates with Space (if applicable)
- [ ] Escape closes (if applicable)
- [ ] Focus order logical

### Screen Reader
- [ ] Announces component type
- [ ] Announces state (disabled, expanded, etc.)
- [ ] Has accessible name
- [ ] Role is appropriate

### Visual
- [ ] Contrast ratio passes WCAG AA
- [ ] Focus indicator visible
- [ ] Not color-only indicators
- [ ] Text resizable to 200%

---

## 6. Dark Mode

- [ ] Colors adapt correctly
- [ ] Contrast still acceptable
- [ ] No hard-coded colors
- [ ] Icons visible
- [ ] Borders visible

---

## 7. Edge Cases

### Content
- [ ] Long text truncates/wraps correctly
- [ ] Short text displays correctly
- [ ] Empty content handled
- [ ] Special characters display

### Interaction
- [ ] Rapid clicking handled
- [ ] Double-click handled
- [ ] Right-click behavior
- [ ] Drag behavior (if applicable)

---

## 8. Performance

- [ ] No layout shifts
- [ ] Animations are smooth (60fps)
- [ ] No memory leaks
- [ ] Bundle size acceptable

---

## 9. Browser Testing

| Browser | Version | Pass | Notes |
|---------|---------|------|-------|
| Chrome | latest | [ ] | |
| Firefox | latest | [ ] | |
| Safari | latest | [ ] | |
| Edge | latest | [ ] | |
| Safari iOS | latest | [ ] | |
| Chrome Android | latest | [ ] | |

---

## 10. Integration

- [ ] Works in page context
- [ ] Props pass correctly
- [ ] Events fire correctly
- [ ] State management works
- [ ] No console errors

---

## Test Results

### Summary
| Category | Pass | Fail | Blocked |
|----------|------|------|---------|
| Visual | | | |
| States | | | |
| Responsive | | | |
| Accessibility | | | |
| Browser | | | |

### Issues Found
| Issue | Severity | Status |
|-------|----------|--------|
| | High/Med/Low | Open/Fixed |

---

## Sign-off

- [ ] **Approved** - Ready for production
- [ ] **Needs Fix** - Issues must be resolved
- [ ] **Blocked** - Cannot complete testing

### Comments
[Additional comments]

---

*Checklist v1.0 - Tech Squad*
