---
task: Extract Voice DNA
responsavel: "@oalanicolas"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - sources: Text files, transcriptions, social media posts — raw material for voice analysis (array, required)
Saida: |
  - voice_dna_profile: Structured profile containing vocabulary, tone, sentence_structure, emoji_usage, cultural_markers, catchphrases (object)
Checklist:
  - "[ ] Load and normalize all source texts"
  - "[ ] Run vocabulary frequency analysis"
  - "[ ] Classify tone patterns"
  - "[ ] Analyze sentence structure (length, complexity, rhythm)"
  - "[ ] Detect emoji and punctuation usage patterns"
  - "[ ] Identify cultural markers and language preferences"
  - "[ ] Extract catchphrases and recurring expressions"
  - "[ ] Compile voice_dna_profile"
---

# *extract-voice-dna

Analyzes source texts to extract the unique voice fingerprint of a person. Produces a structured Voice DNA profile that captures how someone communicates — their word choices, tone, sentence patterns, and cultural markers.

## Uso

```
*extract-voice-dna sources=["./transcripts/interview-01.md", "./posts/twitter-export.json"]
```

## Parametros

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| sources | array | yes | Paths to text files, transcriptions, social media exports, or chat logs |

## Implementation

### Step 1: Source Normalization
- Load each source file
- Strip formatting artifacts (HTML tags, markdown syntax where irrelevant)
- Segment into individual utterances or paragraphs
- Tag each segment with source type (formal writing, social post, conversation, presentation)

### Step 2: Vocabulary Analysis
- Build word frequency distribution
- Identify top 50 most-used unique words (excluding common stop words)
- Detect domain-specific jargon
- Identify borrowed words from other languages (code-switching patterns)
- Note formality level distribution across sources

### Step 3: Tone Classification
- Classify overall tone: formal, casual, authoritative, empathetic, humorous, analytical
- Detect tone shifts between contexts (e.g., formal in docs, casual on social)
- Measure assertiveness level (hedging language vs. direct statements)
- Identify emotional register range

### Step 4: Sentence Structure Analysis
- Calculate average sentence length (words)
- Measure syntactic complexity (clause depth)
- Identify preferred structures: declarative, interrogative, imperative
- Detect rhythm patterns: short-long alternation, list-heavy, parenthetical-heavy
- Note paragraph length tendencies

### Step 5: Emoji and Punctuation Patterns
- Catalog emoji usage frequency and preferred emojis
- Detect exclamation mark and ellipsis habits
- Identify capitalization patterns (ALL CAPS for emphasis, etc.)
- Note hashtag and mention patterns (social media sources)

### Step 6: Cultural Markers
- Detect primary language and secondary language influences
- Identify regional expressions or slang
- Note references to cultural frameworks (Brazilian, American, tech culture, etc.)
- Catalog metaphor preferences and analogy styles

### Step 7: Catchphrase Extraction
- Identify phrases repeated across multiple sources (minimum 3 occurrences)
- Rank by frequency and distinctiveness
- Categorize: greeting, closing, emphasis, transition, filler

### Step 8: Profile Compilation
- Merge all analysis results into voice_dna_profile structure
- Assign confidence scores to each dimension
- Flag dimensions with insufficient data (fewer than 5 data points)

## Error Handling

- **Empty source file**: Skip with warning, continue if other sources remain
- **Unsupported format**: Log format type, attempt plain-text extraction, skip if extraction fails
- **Insufficient data**: If total text is under 500 words, warn that profile will have low confidence
- **Mixed languages**: Detect and separate by language, analyze each independently, merge with language tags
- **Encoding issues**: Attempt UTF-8 fallback, then Latin-1, then skip file with warning

## Related

- `clone-mind.md` — Parent pipeline that calls this task
- `extract-thinking-dna.md` — Companion extraction for cognitive patterns
- `update-mind.md` — Can trigger re-extraction with new sources
