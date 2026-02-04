---
task: Auto-Acquire Sources
responsavel: "@oalanicolas"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - person_name: Full name of the person to find sources for (string, required)
  - domain: Professional area or field, e.g. "AI engineering", "product management" (string, required)
  - search_depth: How deep to search — shallow (quick, top results) or deep (exhaustive) (string, optional, default: shallow)
Saida: |
  - acquired_sources: Array of discovered sources with path, type, and confidence score (array)
  - total_sources: Total number of sources found (number)
  - coverage_assessment: Qualitative assessment of source diversity and completeness (string)
Checklist:
  - "[ ] Search LinkedIn for professional profile and posts"
  - "[ ] Search GitHub for repositories and contributions"
  - "[ ] Search Medium/blog platforms for written content"
  - "[ ] Search Twitter/X for posts and threads"
  - "[ ] Search YouTube for talk transcripts"
  - "[ ] Search podcast directories for interview transcripts"
  - "[ ] Evaluate source quality and confidence"
  - "[ ] Download or reference accessible content"
  - "[ ] Generate coverage assessment"
---

# *auto-acquire-sources

Automatically discovers and collects public source material for a person to feed into the mind cloning pipeline. Searches across multiple platforms and evaluates source quality.

## Uso

```
*auto-acquire-sources person_name="Nicolas Oala" domain="AI engineering" search_depth=deep
```

## Parametros

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| person_name | string | yes | - | Full name of the person |
| domain | string | yes | - | Professional field to focus search |
| search_depth | string | no | shallow | `shallow` for top results only, `deep` for exhaustive search |

## Implementation

### Step 1: Search Channel Execution
Run searches in parallel across 6 channels:

1. **LinkedIn**: Search for profile, posts, articles. Extract bio, experience descriptions, published articles
2. **GitHub**: Search for user profile, pinned repos, README files, commit messages, PR descriptions, issue comments
3. **Medium / Blog platforms**: Search for authored articles, cross-reference with person name and domain
4. **Twitter/X**: Search for account, recent threads, quoted tweets, replies with substantive content
5. **YouTube**: Search for talks, interviews, panel appearances. Extract or reference transcripts
6. **Podcasts**: Search podcast directories (Spotify, Apple Podcasts) for guest appearances. Reference transcript services

In `deep` mode, also search:
- Conference talk archives (SlideShare, SpeakerDeck)
- Academic papers (Google Scholar, arXiv)
- Company blog posts
- Newsletter archives (Substack)

### Step 2: Source Quality Evaluation
For each discovered source, assess:
- **Authenticity**: Confidence this is actually the target person (0-100)
- **Content richness**: Amount of usable text/content (low, medium, high)
- **Recency**: How recent the content is
- **Type classification**: voice-relevant, thinking-relevant, or both
- Assign overall confidence score (0-100)

### Step 3: Content Acquisition
- For publicly accessible text: download and save to `squads/squad-creator/data/sources/{slug}/`
- For restricted content: save reference (URL, title, date) for manual acquisition
- For multimedia: reference transcript services or note as "transcript needed"
- Respect robots.txt and rate limits

### Step 4: Coverage Assessment
- Evaluate diversity: how many source types are represented
- Identify gaps: missing source types that would improve profile quality
- Rate overall coverage: insufficient (< 3 sources), adequate (3-6), good (7-12), excellent (13+)
- Generate recommendations for manual source acquisition to fill gaps

## Error Handling

- **Person not found on platform**: Log as "not found", continue with other channels
- **Ambiguous results (multiple people)**: Use domain field to disambiguate, flag remaining ambiguity for user review
- **Rate limited by platform**: Back off, retry once, then skip with warning
- **No sources found at all**: Abort with message that person has insufficient public presence for auto-acquisition; suggest manual source collection
- **Content behind paywall/login**: Save reference URL, mark as "manual acquisition needed"
- **Privacy concerns**: Only collect publicly available content; never attempt to access private or restricted material

## Related

- `clone-mind.md` — Parent pipeline that uses acquired sources
- `extract-voice-dna.md` — Consumes acquired sources for voice analysis
- `extract-thinking-dna.md` — Consumes acquired sources for thinking analysis
