---
task: Analyze Automation Opportunities
responsavel: "@sop-extractor"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - sop_path: Path to the SOP document to analyze (string, required)
Saida: |
  - automation_analysis: Analysis in PV_PM_001 format with per-step feasibility assessment (object)
  - automation_score: Overall automation potential from 0 to 100% (number)
  - recommendations: Prioritized list of automation recommendations (array)
  - roi_estimate: Estimated return on investment for automation efforts (object)
Checklist:
  - "[ ] Load SOP document"
  - "[ ] Classify each step by automation feasibility"
  - "[ ] Calculate effort vs. benefit per step"
  - "[ ] Identify quick wins (high benefit, low effort)"
  - "[ ] Generate prioritized recommendations"
  - "[ ] Estimate ROI for automation"
  - "[ ] Compile PV_PM_001 format report"
---

# *analyze-automation

Analyzes an SOP to identify which steps can be automated, estimates the effort and benefit of each automation opportunity, and produces a prioritized recommendation list with ROI estimates.

## Uso

```
*analyze-automation sop_path="./data/sops/onboarding-sop-001.md"
```

## Parametros

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| sop_path | string | yes | Path to the SOP document to analyze |

## Implementation

### Step 1: Load and Parse SOP
- Load SOP document
- Extract procedure steps with their cognitive and executor classifications
- If SOP lacks classifications, run inline classification (warn about lower accuracy)

### Step 2: Automation Feasibility Classification
For each SOP step, assess feasibility:
- **Fully Automatable**: Deterministic, rule-based, no judgment needed, data available
- **Partially Automatable**: Requires some human input but core logic can be automated
- **Assist-able**: Human performs but AI can prepare, suggest, or validate
- **Not Automatable**: Requires physical action, deep empathy, creative judgment, or legal authority

Factors considered:
- Cognitive classification (Remember/Apply = higher, Evaluate/Create = lower)
- Current executor type
- Data availability and structure
- Frequency of execution
- Variability of inputs

### Step 3: Effort vs. Benefit Analysis
For each automatable step:
- **Effort estimate**: Development time in hours (S: 1-4h, M: 4-16h, L: 16-40h, XL: 40+h)
- **Benefit dimensions**:
  - Time saved per execution (minutes)
  - Error reduction potential (low, medium, high)
  - Frequency of execution (daily, weekly, monthly)
  - Scalability impact (how much throughput increases)
- **Benefit score**: Composite 1-10

### Step 4: Quick Win Identification
- Flag steps where: effort <= M AND benefit_score >= 7
- These are "quick wins" — high impact, low effort automations
- Rank quick wins by benefit/effort ratio

### Step 5: Prioritized Recommendations
Generate ranked recommendation list:
1. **Priority 1 — Quick Wins**: Automate immediately, high ROI, low risk
2. **Priority 2 — Strategic**: Higher effort but significant long-term benefit
3. **Priority 3 — Future**: Worth automating but not urgent
4. **Not Recommended**: Steps where automation cost exceeds benefit

Each recommendation includes:
- Step reference
- Current state (manual/semi-auto)
- Target state (fully auto/assisted)
- Tool/technology suggestion
- Effort estimate
- Expected benefit

### Step 6: ROI Estimation
Calculate for the full automation plan:
- **Total investment**: Sum of effort estimates (converted to cost using rate assumption)
- **Annual savings**: Sum of (time_saved_per_execution * frequency * hourly_rate) across all steps
- **Payback period**: Total investment / annual savings
- **3-year ROI**: ((3 * annual_savings) - total_investment) / total_investment * 100
- Include sensitivity analysis: best case, expected case, worst case

### Step 7: Report Compilation
Structure output in PV_PM_001 format:
- Executive Summary
- Per-step feasibility table
- Quick wins section
- Prioritized roadmap
- ROI analysis
- Risk factors and assumptions

## Error Handling

- **SOP file not found**: Abort with path error
- **SOP without classifications**: Run inline classification, warn about accuracy, proceed
- **No automatable steps found**: Report that SOP is fully manual with suggestions for process redesign
- **Insufficient data for ROI**: Generate qualitative recommendations without quantitative ROI, note data gaps
- **SOP too complex**: If more than 50 steps, suggest breaking into sub-processes first

## Related

- `extract-sop.md` — Creates the SOP that feeds this analysis
- `validate-sop.md` — Ensures SOP quality before analysis
- `generate-blueprint-from-sop.md` — Uses automation analysis to inform blueprint design
