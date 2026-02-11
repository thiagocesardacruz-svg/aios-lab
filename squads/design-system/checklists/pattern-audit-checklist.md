# Pattern Audit Checklist

**Purpose:** Systematic audit of UI patterns in a codebase
**Standard:** Identify redundancy and consolidation opportunities

---

## SCOPE DEFINITION

- [ ] Target directories identified
- [ ] File types to scan defined
- [ ] Exclusions documented (node_modules, etc.)
- [ ] Framework/library identified (React, Vue, etc.)

---

## COLOR PATTERNS

### Extraction
- [ ] All hex colors extracted
- [ ] All RGB/RGBA colors extracted
- [ ] All HSL/HSLA colors extracted
- [ ] Tailwind color classes extracted
- [ ] CSS variable colors noted

### Analysis
- [ ] Similar colors grouped (ΔE < 3)
- [ ] Near-duplicates identified
- [ ] Brand colors mapped
- [ ] Semantic usage documented
- [ ] Consolidation recommendations made

### Metrics
- **Before:** ___ unique colors
- **After:** ___ recommended colors
- **Reduction:** ___%

---

## TYPOGRAPHY PATTERNS

### Extraction
- [ ] Font families extracted
- [ ] Font sizes extracted
- [ ] Font weights extracted
- [ ] Line heights extracted
- [ ] Letter spacing extracted

### Analysis
- [ ] Type scale identified
- [ ] Redundant sizes flagged
- [ ] Font pairing evaluated
- [ ] Hierarchy mapped

### Metrics
- **Before:** ___ unique combinations
- **After:** ___ recommended
- **Reduction:** ___%

---

## SPACING PATTERNS

### Extraction
- [ ] Margin values extracted
- [ ] Padding values extracted
- [ ] Gap values extracted
- [ ] Arbitrary values flagged

### Analysis
- [ ] Spacing scale identified
- [ ] Base unit determined (4px, 8px, etc.)
- [ ] Outliers documented
- [ ] Consolidation plan created

### Metrics
- **Before:** ___ unique values
- **After:** ___ recommended
- **Reduction:** ___%

---

## COMPONENT PATTERNS

### Extraction
- [ ] Button variants counted
- [ ] Input variants counted
- [ ] Card variants counted
- [ ] Modal variants counted
- [ ] Other components inventoried

### Analysis
- [ ] Similar components grouped
- [ ] Naming patterns analyzed
- [ ] Prop patterns identified
- [ ] Consolidation opportunities noted

### Metrics
- **Total components:** ___
- **Redundant components:** ___
- **Consolidation target:** ___

---

## SHADOW PATTERNS

- [ ] Box shadows extracted
- [ ] Similar shadows grouped
- [ ] Elevation scale proposed

---

## BORDER PATTERNS

- [ ] Border radius values extracted
- [ ] Border widths extracted
- [ ] Border colors mapped
- [ ] Consolidation proposed

---

## REPORT GENERATION

- [ ] Pattern inventory JSON created
- [ ] Consolidation map generated
- [ ] Shock report HTML created
- [ ] ROI calculation included
- [ ] Migration strategy drafted

---

## DELIVERABLES

| Deliverable | Status |
|-------------|--------|
| pattern-inventory.json | [ ] |
| consolidation-map.json | [ ] |
| shock-report.html | [ ] |
| tokens.yaml | [ ] |
| migration-strategy.md | [ ] |

---

**Audit Complete:** [ ] Yes [ ] No

**Auditor:** _______________ **Date:** _______________
