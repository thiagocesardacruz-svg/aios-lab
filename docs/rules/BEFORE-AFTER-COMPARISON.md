# Before/After Comparison - Rules Compression

## Visual Comparison

### BEFORE (Session Startup)
```
.claude/rules/
├── activity-logging.md           145 lines  →  532 words
├── clickup-auto-sync.md          208 lines  →  801 words
├── handover-contracts.md         306 lines  → 1016 words
├── local-tools-auto-use.md       172 lines  →  795 words
├── mcp-usage.md                  176 lines  →  833 words
├── model-routing.md              202 lines  →  786 words
└── skill-auto-routing.md         170 lines  →  730 words
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:                           1379 lines → 5493 words
ESTIMATED TOKENS:                            ~13,700 tokens
```

### AFTER (Session Startup)
```
.claude/rules/
├── activity-logging.md            29 lines  →  150 words
├── clickup-auto-sync.md           30 lines  →  165 words
├── handover-contracts.md          35 lines  →  136 words
├── local-tools-auto-use.md        28 lines  →  190 words
├── mcp-usage.md                   33 lines  →  232 words
├── model-routing.md               34 lines  →  195 words
└── skill-auto-routing.md          42 lines  →  212 words
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:                            231 lines → 1280 words
ESTIMATED TOKENS:                            ~3,500 tokens
```

## Detailed File-by-File Breakdown

### 1. activity-logging.md
- **Before:** 145 lines, 532 words
- **After:** 29 lines, 150 words
- **Reduction:** 71.8%
- **Key Preserved:**
  - Auto-capture sources (Stop Hook, Git Commits, ClickUp Sync)
  - Manual logging command: `node squads/ops/scripts/log.mjs`
  - Daily digest command
  - Zero-cost principle

### 2. clickup-auto-sync.md
- **Before:** 208 lines, 801 words
- **After:** 30 lines, 165 words
- **Reduction:** 79.4%
- **Key Preserved:**
  - MUST sync tasks to ClickUp for multi-step work
  - Task naming format: `[AREA] Brief description`
  - Handover contract requirement
  - Essential commands (create, start, done)

### 3. handover-contracts.md
- **Before:** 306 lines, 1016 words
- **After:** 35 lines, 136 words
- **Reduction:** 86.6% (highest compression)
- **Key Preserved:**
  - Five Trust Behaviors enforcement
  - Minimal contract example
  - Required fields: from_agent, to_agent, verification
  - Evidence requirement when confidence < high

### 4. local-tools-auto-use.md
- **Before:** 172 lines, 795 words
- **After:** 28 lines, 190 words
- **Reduction:** 76.1%
- **Key Preserved:**
  - Auto-use matrix (whisper.cpp, Tesseract, pdftotext, etc.)
  - Command templates for each tool
  - When NOT to use (complex reasoning stays with Claude)
  - Zero-cost principle

### 5. mcp-usage.md
- **Before:** 176 lines, 833 words
- **After:** 33 lines, 232 words
- **Reduction:** 72.1%
- **Key Preserved:**
  - ALWAYS prefer native Claude Code tools
  - Tool selection priority table
  - MCP catalog (EXA, Context7, Apify, playwright)
  - DevOps Agent manages MCP infrastructure

### 6. model-routing.md
- **Before:** 202 lines, 786 words
- **After:** 34 lines, 195 words
- **Reduction:** 75.2%
- **Key Preserved:**
  - Model selection matrix (Haiku 1-3, Sonnet 4-7, Opus 8-10)
  - Cost ratios (Haiku 19x cheaper than Opus)
  - Complexity modifiers
  - Tool router command

### 7. skill-auto-routing.md
- **Before:** 170 lines, 730 words
- **After:** 42 lines, 212 words
- **Reduction:** 71.0%
- **Key Preserved:**
  - Opt-in system: `auto_invoke: true` required
  - Skill metadata schema (triggers, agents_allowed, priority)
  - Registered auto-invoke skills table
  - When NOT to auto-invoke

## What Was Moved to Full Docs

### Examples and Edge Cases
- Detailed workflow examples (e.g., "User asks to implement Story 2.3")
- Multi-step scenario walkthroughs
- Error handling edge cases

### Extended Tables
- Agent compatibility matrix (handover-contracts)
- Required fields by artifact type (handover-contracts)
- Full complexity decision tree (model-routing)
- Tool location paths (local-tools-auto-use)

### Implementation Details
- Full contract structure examples (minimal, standard, full)
- Graceful degradation modes
- Integration patterns with other systems
- Architecture diagrams and flows

### Secondary Information
- Historical context and rationale
- Known issues and workarounds (e.g., Docker MCP secrets bug)
- Best practices DO/DON'T lists
- Related documentation links

## What Stayed in Compressed Versions

### Critical Rules (MUST/NEVER)
Every compressed file includes 3-5 critical rules that are:
- Mandatory behaviors (MUST)
- Prohibited actions (NEVER)
- Core principles (SHOULD)

### Quick Reference
- Most frequently used commands
- Essential tables (model selection, tool matrix, etc.)
- Minimal working examples

### Navigation
- Clear TL;DR (2-3 sentences)
- Link to full documentation
- File path references

## Impact on Agent Workflow

### Before Compression
1. Agent loads 13,700 tokens on session start
2. All details available immediately
3. Risk of information overload
4. High token cost per session

### After Compression
1. Agent loads 3,500 tokens on session start
2. Critical rules available immediately
3. Full docs referenced when needed
4. 74% lower token cost per session

### When to Reference Full Docs

Agents should reference `docs/rules/*-full.md` when:
- Implementing complex features from a rule
- Debugging rule-related issues
- Needing examples or edge cases
- Creating new workflows based on existing patterns
- Uncertain about edge case behavior

For 90%+ of routine operations, the compressed rules are sufficient.

## Cost-Benefit Analysis

### Benefits
- **Token Savings:** ~10,200 tokens per session
- **Monthly Savings:** ~€7.65 (at 50 sessions/month, Opus rates)
- **Faster Session Startup:** Less context to load
- **Reduced Cognitive Load:** Only essential info upfront
- **Preserved Knowledge:** Full docs remain accessible

### Trade-offs
- **Extra Navigation:** Agents may need to reference full docs occasionally
- **Two Sources of Truth:** Must keep compressed + full in sync
- **Maintenance Overhead:** Updates must be made in both places

### Net Result
✅ **Positive Impact:** The 74% token reduction significantly outweighs the minor overhead of maintaining two documentation sets. The compressed rules are sufficient for 90%+ of operations.

---

*Before/After Analysis - AIOS Rules Compression*
*Date: 2026-02-15*
