# Tool Evaluation Framework

> Comprehensive methodology for evaluating, scoring, and classifying tools for squad integration.
> Squad: squad-creator
> Version: 2.6.0

---

## Overview

Every tool discovered through the 5 parallel search channels (MCP servers, APIs, CLI tools, Libraries/Packages, GitHub repos) must pass through this evaluation framework before being added to the tool registry. The framework combines quantitative scoring (RICE, WSJF) with qualitative gates (Security, Social Proof) to produce a final decision and tier assignment.

---

## 1. RICE Scoring

RICE provides a prioritization score that balances potential impact against required effort.

**Formula:** `RICE = (Reach * Impact * Confidence) / Effort`

### Scale Definitions

| Factor | Scale | Description |
|--------|-------|-------------|
| **Reach** | 1-10 | How many users, agents, or workflows will use this tool. 1 = single niche use case. 5 = multiple squads benefit. 10 = every squad or workflow uses it. |
| **Impact** | 1-10 | How significant the benefit is when adopted. 1 = marginal improvement. 5 = meaningful productivity gain. 10 = transformative capability unlocked. |
| **Confidence** | 0.0-1.0 | How certain we are about Reach and Impact estimates. 1.0 = measured data available. 0.8 = strong evidence. 0.5 = educated guess. 0.2 = speculation. |
| **Effort** | 1-10 | Integration complexity measured in person-days equivalent. 1 = drop-in, no config. 3 = minor config and docs. 5 = moderate integration work. 10 = major project with custom adapters. |

### RICE Score Examples

| Tool | Reach | Impact | Confidence | Effort | RICE Score |
|------|-------|--------|-----------|--------|------------|
| Context7 (MCP) | 9 | 8 | 0.9 | 2 | 32.4 |
| Custom CLI wrapper | 3 | 4 | 0.5 | 7 | 0.86 |
| Zod (validation) | 10 | 8 | 1.0 | 1 | 80.0 |

**Note:** Raw RICE scores are normalized to a 0-100 scale for the tool registry using `normalized = min(raw * scaling_factor, 100)`.

---

## 2. WSJF Scoring (Weighted Shortest Job First)

WSJF prioritizes items that deliver the highest value in the shortest time, accounting for urgency.

**Formula:** `WSJF = Cost_of_Delay / Duration`

### Cost of Delay Components

| Component | Scale | Description |
|-----------|-------|-------------|
| **User/Business Value** | 1-10 | Direct value to end users or the business. Revenue impact, user satisfaction, capability enablement. |
| **Time Criticality** | 1-10 | Urgency of adoption. 10 = competitive disadvantage if delayed. 1 = can wait indefinitely without consequence. |
| **Risk Reduction / Opportunity Enablement** | 1-10 | How much this tool reduces technical risk or unlocks future opportunities. Security patches score high. Experimental nice-to-haves score low. |

**Cost of Delay** = User/Business Value + Time Criticality + Risk Reduction

### Duration Estimation

| Duration Score | Meaning |
|---------------|---------|
| 1 | Hours -- trivial integration |
| 2-3 | Days -- straightforward setup |
| 4-5 | 1-2 weeks -- moderate work |
| 6-8 | 2-4 weeks -- significant effort |
| 9-10 | 1+ months -- major initiative |

### WSJF Calculation Example

| Tool | User Value | Time Criticality | Risk Reduction | CoD | Duration | WSJF |
|------|-----------|-----------------|----------------|-----|----------|------|
| Playwright MCP | 8 | 7 | 6 | 21 | 2 | 10.5 |
| Experimental LLM lib | 5 | 2 | 3 | 10 | 6 | 1.67 |

**Note:** Raw WSJF scores are normalized to 0-100 for the tool registry.

---

## 3. Security Gate

The security gate is a **pass/fail** checkpoint. Tools that fail are marked `dont-do` regardless of their scores.

### CVE Database Check

- Query the National Vulnerability Database (NVD) and GitHub Security Advisories for known CVEs against the tool and its dependencies.
- **Pass:** No critical or high-severity CVEs in the last 12 months, or all CVEs have published patches applied.
- **Fail:** Any unpatched critical CVE, or 3+ unpatched high-severity CVEs.

### License Compatibility Matrix

| License | Status | Notes |
|---------|--------|-------|
| MIT | OK | Fully permissive, no restrictions |
| Apache 2.0 | OK | Permissive with patent grant |
| BSD (2/3 clause) | OK | Permissive, minimal restrictions |
| ISC | OK | Functionally equivalent to MIT |
| GPL v2/v3 | Caution | Copyleft -- requires legal review for linked usage |
| LGPL | Caution | Dynamic linking generally OK, static linking requires review |
| AGPL | Caution | Network copyleft -- high risk for SaaS usage |
| Proprietary | Block | Requires explicit vendor agreement and legal approval |
| No License | Block | No license means all rights reserved -- cannot legally use |

### Maintenance Health

| Metric | Healthy | Warning | Unhealthy |
|--------|---------|---------|-----------|
| Last commit | < 3 months | 3-12 months | > 12 months |
| Open issues ratio | < 20% of total | 20-50% | > 50% |
| Release frequency | Monthly or more | Quarterly | > 6 months gap |
| Active maintainers | 3+ | 1-2 | 0 or unresponsive |

**Gate Result:** Pass requires no CVE failures, license OK or Caution-with-approval, and at least "Warning" on 2 of 3 maintenance metrics.

---

## 4. Social Proof Gate

The social proof gate validates community adoption and trust. It is a **pass/fail** checkpoint.

### GitHub Stars Thresholds

| Tier Target | Minimum Stars |
|------------|---------------|
| Tier 1 | > 5,000 |
| Tier 2 | > 1,000 |
| Tier 3 | > 200 |
| Tier 4 | Any |

### Download Metrics

| Platform | Strong Signal | Moderate Signal | Weak Signal |
|----------|--------------|-----------------|-------------|
| npm | > 1M weekly | > 100K weekly | < 100K weekly |
| PyPI | > 500K monthly | > 50K monthly | < 50K monthly |
| crates.io | > 100K total | > 10K total | < 10K total |

### Community Activity

| Metric | Pass | Fail |
|--------|------|------|
| Issue response time (median) | < 7 days | > 30 days |
| PR merge rate | > 50% of submitted PRs | < 20% |
| Documentation quality | Dedicated docs site or comprehensive README | Minimal or outdated docs |
| Stack Overflow / Discord presence | Active community | No community channels |

**Gate Result:** Pass requires meeting the star threshold for the target tier AND at least 2 of 4 community activity checks passing.

---

## 5. Tier System

Tiers are assigned based on combined RICE and WSJF percentile rankings across all evaluated tools.

| Tier | Percentile | Description | Typical Characteristics |
|------|-----------|-------------|------------------------|
| **Tier 1** | Top 10% | Best-in-class, core tooling | High scores, both gates pass, battle-tested, widely adopted |
| **Tier 2** | Top 25% | Strong candidates for integration | Good scores, both gates pass, growing adoption |
| **Tier 3** | Top 50% | Viable options worth monitoring | Moderate scores, gates may be pending, emerging tools |
| **Tier 4** | Bottom 50% | Low priority or not recommended | Low scores, gate concerns, niche use cases |

### Tier Assignment Process

1. Calculate RICE and WSJF normalized scores (0-100).
2. Compute composite score: `composite = (RICE * 0.5) + (WSJF * 0.5)`.
3. Rank all tools by composite score.
4. Assign tier based on percentile position in the ranked list.
5. Override: any tool failing a gate is capped at Tier 3 maximum.

---

## 6. Advisory Flags

Flags provide additional context beyond scores and tiers:

| Flag | Meaning |
|------|---------|
| `[recommended]` | Actively recommended for new squads and projects |
| `[core]` | Part of the AIOS core toolchain, expected in every squad |
| `[experimental]` | Promising but not yet production-validated, use with caution |
| `[deprecated]` | Scheduled for removal, migrate to replacement tool |
| `[security-concern]` | Passed gates but has noted security considerations to monitor |
| `[license-review]` | License requires legal review before commercial use |

---

## 7. Decision Matrix

The final decision combines scoring, gates, and flags into an actionable outcome:

| Decision | Score Criteria | Gate Criteria | Action |
|----------|---------------|---------------|--------|
| **DO NOW** | Composite > 80 | Both gates pass | Add to tool registry immediately. Integrate in current sprint. |
| **DO NEXT** | Composite > 60 | Both gates pass | Queue for next sprint. Assign integration task. |
| **DO LATER** | Composite > 40 | At least one gate pending | Add to backlog with review date. Monitor for gate resolution. |
| **DON'T DO** | Composite < 40 OR -- | Any gate fails | Document rationale. Archive evaluation. Re-evaluate only if conditions change significantly. |

### Decision Override Rules

- A tool with `[core]` flag and composite > 60 is automatically **DO NOW**.
- A tool with `[deprecated]` flag cannot be **DO NOW** regardless of score.
- A tool with `[security-concern]` flag requires explicit sign-off for **DO NOW**.
- Any tool failing the security gate is always **DON'T DO** until the gate is resolved.

---

## Evaluation Workflow Summary

```
Discovery (5 channels)
    |
    v
RICE Scoring --> WSJF Scoring
    |                 |
    v                 v
Composite Score (50/50 blend)
    |
    v
Security Gate -----> FAIL? --> DON'T DO
    |
    PASS
    |
    v
Social Proof Gate -> FAIL? --> DON'T DO
    |
    PASS
    |
    v
Tier Assignment (percentile)
    |
    v
Decision Matrix (DO NOW / DO NEXT / DO LATER)
    |
    v
Tool Registry Entry
```

---

*Tool Evaluation Framework v2.6.0 -- Synkra AIOS*
