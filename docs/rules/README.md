# Rules Documentation

## Overview

This directory contains the **full reference documentation** for all AIOS rules. The files in `.claude/rules/` are **compressed summaries** (20-35 lines) that load on every session startup, while the full documentation (150-300 lines) lives here.

## Compression Results

| Rule File | Before (lines) | After (lines) | Reduction |
|-----------|----------------|---------------|-----------|
| clickup-auto-sync.md | 208 | 30 | 85.6% |
| handover-contracts.md | 306 | 35 | 88.6% |
| activity-logging.md | 145 | 29 | 80.0% |
| local-tools-auto-use.md | 172 | 28 | 83.7% |
| model-routing.md | 202 | 34 | 83.2% |
| skill-auto-routing.md | 170 | 42 | 75.3% |
| mcp-usage.md | 176 | 33 | 81.3% |
| **TOTAL** | **1379 lines** | **231 lines** | **83.2%** |

**Token Reduction:** ~4,213 words removed (76.7% reduction)
**Estimated Session Startup Savings:** ~10,000 tokens per session

## Structure

Each compressed rule file follows this format:

```markdown
# [Rule Name] (Summary)

## TL;DR
[2-3 sentences max]

## Critical Rules
- MUST: ...
- MUST: ...
- NEVER: ...

## Quick Reference
[Most essential table or command]

## Full Documentation
See: docs/rules/[filename]-full.md
```

## Files in This Directory

| File | Purpose |
|------|---------|
| `activity-logging-full.md` | Complete activity logging system documentation |
| `clickup-auto-sync-full.md` | Full ClickUp sync workflow and handover validation |
| `handover-contracts-full.md` | Complete handover contracts schema and examples |
| `local-tools-auto-use-full.md` | Full local tools catalog and decision tree |
| `mcp-usage-full.md` | Complete MCP architecture and usage patterns |
| `model-routing-full.md` | Full model selection matrix and examples |
| `skill-auto-routing-full.md` | Complete skill auto-routing system |

## When to Reference

Agents should reference these full documents when:
- Implementing complex features from a rule
- Debugging rule-related issues
- Needing examples or edge cases
- Creating new workflows based on existing patterns

For routine operations, the compressed rules in `.claude/rules/` are sufficient.

---

*Rules Documentation - AIOS Framework v3.0*
*Compressed: 2026-02-15*
