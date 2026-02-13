# Accessibility WCAG Checklist

**Purpose:** Quick WCAG compliance check for any UI element
**Standard:** WCAG 2.1 Level AA

---

## PERCEIVABLE

### 1.1 Text Alternatives
- [ ] All images have alt text
- [ ] Decorative images use `alt=""`
- [ ] Complex images have long descriptions
- [ ] Icon-only buttons have aria-label

### 1.3 Adaptable
- [ ] Content structure conveyed through HTML
- [ ] Reading order logical
- [ ] No sensory-only instructions

### 1.4 Distinguishable
- [ ] Text contrast ≥ 4.5:1 (normal)
- [ ] Text contrast ≥ 3:1 (large 18px+)
- [ ] UI component contrast ≥ 3:1
- [ ] No color-only meaning
- [ ] Text resizable to 200%
- [ ] No horizontal scroll at 320px width

---

## OPERABLE

### 2.1 Keyboard Accessible
- [ ] All functionality via keyboard
- [ ] No keyboard traps
- [ ] Shortcuts can be disabled

### 2.4 Navigable
- [ ] Skip links present
- [ ] Page has descriptive title
- [ ] Focus order logical
- [ ] Link purpose clear
- [ ] Multiple navigation methods
- [ ] Headings and labels descriptive
- [ ] Focus visible (2px+ outline)

### 2.5 Input Modalities
- [ ] Touch targets ≥ 44x44px
- [ ] Motion not required
- [ ] Label in name

---

## UNDERSTANDABLE

### 3.1 Readable
- [ ] Language of page set
- [ ] Unusual words explained

### 3.2 Predictable
- [ ] No unexpected context changes
- [ ] Consistent navigation
- [ ] Consistent identification

### 3.3 Input Assistance
- [ ] Error identification
- [ ] Labels or instructions
- [ ] Error suggestions
- [ ] Error prevention (legal, financial)

---

## ROBUST

### 4.1 Compatible
- [ ] Valid HTML
- [ ] Name, role, value for controls
- [ ] Status messages programmatically determinable

---

## Quick Tests

1. **Keyboard:** Tab through entire page
2. **Zoom:** Test at 200% zoom
3. **Contrast:** Use contrast checker tool
4. **Screen reader:** Test with NVDA/VoiceOver

---

**Result:** [ ] WCAG AA Compliant [ ] Issues Found

**Notes:** _______________
