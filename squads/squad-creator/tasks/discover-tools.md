---
task: Discover Tools
responsavel: "@squad-architect"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - domain: Area of need, e.g. "web scraping", "database management", "CI/CD" (string, required)
  - capability_gaps: Description of what capabilities are currently missing (string, required)
  - constraints: Budget limit, license requirements, security requirements (object, optional)
Saida: |
  - candidates: Array of discovered tools with name, description, category, url, source_channel (array)
  - evaluation: RICE and WSJF scores for each candidate (array)
  - decision_matrix: Classification of each tool as DO NOW / DO NEXT / DO LATER / DON'T DO (object)
Checklist:
  - "[ ] Execute 5 parallel search channels"
  - "[ ] Deduplicate and normalize results"
  - "[ ] Evaluate each candidate with RICE scoring"
  - "[ ] Evaluate each candidate with WSJF scoring"
  - "[ ] Run security gate on candidates"
  - "[ ] Run social proof gate on candidates"
  - "[ ] Classify into decision tiers"
  - "[ ] Generate decision matrix"
  - "[ ] Update tool-registry.yaml with discoveries"
---

# *discover-tools

Searches across multiple channels to discover tools that fill capability gaps. Evaluates each candidate using RICE and WSJF frameworks, applies security and social proof gates, and produces a prioritized decision matrix.

## Uso

```
*discover-tools domain="web scraping" capability_gaps="Need to extract structured data from dynamic JS-rendered pages" constraints={"budget": "free", "license": "MIT/Apache", "security": "no-cloud-required"}
```

## Parametros

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| domain | string | yes | - | Area of need for tool discovery |
| capability_gaps | string | yes | - | What capabilities are missing |
| constraints | object | no | none | Budget, license, and security constraints |

## Implementation

### Step 1: Parallel Search (5 Channels)
Execute searches simultaneously across:

1. **MCP Catalog**: Search Docker MCP catalog and community MCP registries for relevant servers
2. **API Marketplaces**: Search RapidAPI, ProgrammableWeb, and similar for relevant APIs
3. **CLI Registries**: Search npm (npx), pip, brew, and cargo for CLI tools
4. **Package Managers**: Search npm, PyPI, crates.io for libraries
5. **GitHub**: Search repositories by topic, stars, and recent activity

Collect for each result: name, description, URL, source channel, stars/downloads, license, last updated

### Step 2: Deduplication and Normalization
- Merge results from all channels
- Deduplicate by tool name and URL
- Normalize metadata into consistent schema
- Filter out archived, unmaintained (no updates in 12+ months), or deprecated tools

### Step 3: RICE Scoring
For each candidate, score:
- **Reach**: How many team members or workflows would benefit (1-10)
- **Impact**: How much it would improve capability (1-3: minimal, notable, massive)
- **Confidence**: How certain we are about reach and impact (0.5, 0.8, 1.0)
- **Effort**: Estimated integration effort in person-weeks (1-10)
- **RICE Score** = (Reach x Impact x Confidence) / Effort

### Step 4: WSJF Scoring
For each candidate, score:
- **Business Value**: Contribution to business goals (1-10)
- **Time Criticality**: How urgent is the need (1-10)
- **Risk Reduction**: How much risk it mitigates (1-10)
- **Job Size**: Integration complexity (1-10)
- **WSJF Score** = (Business Value + Time Criticality + Risk Reduction) / Job Size

### Step 5: Security Gate
For each candidate:
- Check for known vulnerabilities (CVE databases, Snyk)
- Verify license compatibility with constraints
- Assess data privacy implications (cloud vs. local)
- Flag tools that fail security gate as "BLOCKED"

### Step 6: Social Proof Gate
For each candidate:
- Check GitHub stars (minimum threshold: 100 for libraries, 50 for niche tools)
- Check download counts / weekly installs
- Look for corporate backing or notable maintainers
- Check community activity (issues, PRs, discussions)
- Flag tools with insufficient social proof as "LOW_CONFIDENCE"

### Step 7: Decision Matrix Classification
Based on combined RICE + WSJF scores and gate results:
- **DO NOW**: High RICE + High WSJF, passes all gates
- **DO NEXT**: High score in one framework, moderate in other, passes gates
- **DO LATER**: Moderate scores, passes gates, not urgent
- **DON'T DO**: Low scores, fails gates, or blocked by constraints

### Step 8: Output Generation
- Generate formatted decision matrix
- Update `squads/squad-creator/data/tool-registry.yaml` with new discoveries
- Produce summary with top 3 recommendations

## Error Handling

- **Search channel timeout**: Skip timed-out channel, note in results, continue with remaining channels
- **No results found**: Broaden search terms automatically, retry once; if still empty, report "no tools found" with suggestions for manual search
- **Constraint conflict**: If no tools pass all constraints, relax constraints one at a time and report trade-offs
- **Rate limiting**: Back off and retry; if persistent, skip channel and note in output
- **Stale registry data**: If tool-registry.yaml has entries older than 6 months, flag for re-evaluation

## Related

- `show-tools.md` — View discovered tools from registry
- `add-tool.md` — Manually add a tool to the registry
- `wf-discover-tools.yaml` — Workflow definition for the full discovery pipeline
- `squads/squad-creator/data/tool-registry.yaml` — Persistent tool registry
- `squads/squad-creator/data/tool-evaluation-framework.md` — Evaluation criteria reference
