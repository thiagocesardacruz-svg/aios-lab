# Keyword Research

## Identity
- **ID:** keyword-research
- **Squad:** marketing
- **Agent:** seo-specialist
- **Type:** task

## Purpose

Comprehensive keyword research to identify high-value search terms, clusters, and content opportunities.

## Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `topic` | string | Yes | Main topic/niche |
| `seed_keywords` | list | No | Starting keywords |
| `competitors` | list | No | Competitor domains |
| `intent` | string | No | informational/commercial/transactional |
| `language` | string | No | Target language (default: en) |

## Process

### 1. Seed Expansion
- Expand seed keywords
- Related searches
- Question keywords (how, what, why)
- Long-tail variations

### 2. Competitor Analysis
- Top ranking pages
- Keyword gaps
- Content opportunities
- Backlink analysis

### 3. Intent Classification
- Informational (learn)
- Navigational (find)
- Commercial (compare)
- Transactional (buy)

### 4. Metrics Gathering
- Search volume
- Keyword difficulty
- CPC (commercial value)
- SERP features

### 5. Cluster Formation
- Group by topic
- Identify pillar content
- Map content hierarchy
- Internal linking strategy

## Output

```yaml
keyword_research:
  topic: "{topic}"
  date: "{date}"

  summary:
    total_keywords: 0
    total_volume: 0
    avg_difficulty: 0
    clusters: 0

  clusters:
    - name: "{cluster_name}"
      pillar_keyword: ""
      volume: 0
      difficulty: ""
      intent: ""
      keywords:
        - keyword: ""
          volume: 0
          difficulty: 0
          cpc: 0.00
          intent: ""
          serp_features: []

  quick_wins:
    # Low difficulty, decent volume
    - keyword: ""
      volume: 0
      difficulty: 0
      opportunity: ""

  content_gaps:
    # Competitors rank, we don't
    - keyword: ""
      competitor: ""
      their_page: ""
      our_opportunity: ""

  recommendations:
    pillar_content: []
    cluster_content: []
    priority_order: []
```

## Quality Criteria

- [ ] Minimum 50 keywords analyzed
- [ ] Intent classified for all keywords
- [ ] Clusters are logically grouped
- [ ] Quick wins identified
- [ ] Content gaps documented

## Related

- **Workflow:** `/mkt/seo-plan`
- **Data:** `keyword-clusters.yaml`
- **Checklist:** `seo-onpage.md`
