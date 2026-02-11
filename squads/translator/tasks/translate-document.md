# Task: Translate Document

## Identity
- **ID:** translate-document
- **Squad:** translator
- **Type:** task

---

## Objective

Translate a document from source language to target language while maintaining meaning, tone, and formatting.

---

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| document | Yes | Document content or file path |
| source_language | No | Source language (default: EN) |
| target_language | Yes | Target language code |
| content_type | No | Type: marketing, technical, legal, ui |
| preserve_formatting | No | Keep original formatting (default: true) |

---

## Process

### Step 1: Document Analysis
```markdown
- [ ] Identify document type and purpose
- [ ] Count words/characters
- [ ] Note formatting requirements
- [ ] Identify technical terms
- [ ] Check glossary for existing terms
```

### Step 2: Pre-Translation Setup
```markdown
- [ ] Load relevant glossary
- [ ] Note style requirements
- [ ] Identify cultural references
- [ ] Plan section-by-section approach
```

### Step 3: Translation
```markdown
- [ ] Translate section by section
- [ ] Maintain consistent terminology
- [ ] Preserve formatting markers
- [ ] Note uncertainties for review
```

### Step 4: Self-Review
```markdown
- [ ] Read full translation
- [ ] Check against original
- [ ] Verify terminology consistency
- [ ] Check formatting preservation
```

### Step 5: Finalize
```markdown
- [ ] Apply final formatting
- [ ] Document translation notes
- [ ] List new glossary terms
- [ ] Prepare deliverable
```

---

## Output Format

```markdown
## Document Translation

### Metadata
- **Source:** [language]
- **Target:** [language]
- **Word Count:** [original] → [translated]
- **Content Type:** [type]

### Translated Document
[Full translated content with formatting]

### Translation Notes
- [Key decisions made]
- [Cultural adaptations]
- [Uncertainties flagged]

### New Glossary Terms
| Term | Translation | Context |
|------|-------------|---------|
| [term] | [translation] | [context] |

### Quality Confidence: [High/Medium/Low]
```

---

## Quality Criteria

- [ ] Meaning accurately conveyed
- [ ] Tone matches original
- [ ] Formatting preserved
- [ ] Terminology consistent
- [ ] No untranslated sections
- [ ] Grammar correct in target language

---

## Handoff

| Next Agent | Condition |
|------------|-----------|
| translation-lead | For review |
| localization-specialist | If cultural adaptation needed |
