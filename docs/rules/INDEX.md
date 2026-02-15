# Rules Documentation Index

Quick navigation to all AIOS rules documentation.

## Compressed Rules (Session Startup)

These files load on every session (~3,500 tokens total):

| File | Lines | Purpose | Link |
|------|-------|---------|------|
| activity-logging.md | 29 | Auto-capture system logging | [View](../../.claude/rules/activity-logging.md) |
| clickup-auto-sync.md | 30 | ClickUp task sync + handover validation | [View](../../.claude/rules/clickup-auto-sync.md) |
| handover-contracts.md | 35 | Work transfer contracts | [View](../../.claude/rules/handover-contracts.md) |
| local-tools-auto-use.md | 28 | Zero-cost local tools | [View](../../.claude/rules/local-tools-auto-use.md) |
| mcp-usage.md | 33 | MCP server usage guidelines | [View](../../.claude/rules/mcp-usage.md) |
| model-routing.md | 34 | Cost-effective model selection | [View](../../.claude/rules/model-routing.md) |
| skill-auto-routing.md | 42 | Automatic skill invocation | [View](../../.claude/rules/skill-auto-routing.md) |

## Full Reference Documentation

Complete documentation for deep dives (~13,700 tokens total):

| File | Lines | Purpose | Link |
|------|-------|---------|------|
| activity-logging-full.md | 145 | Complete logging system | [View](./activity-logging-full.md) |
| clickup-auto-sync-full.md | 208 | Full sync workflow + validation | [View](./clickup-auto-sync-full.md) |
| handover-contracts-full.md | 306 | Complete contract schema + examples | [View](./handover-contracts-full.md) |
| local-tools-auto-use-full.md | 172 | Full tool catalog + decision tree | [View](./local-tools-auto-use-full.md) |
| mcp-usage-full.md | 176 | Complete MCP architecture | [View](./mcp-usage-full.md) |
| model-routing-full.md | 202 | Full routing guide + examples | [View](./model-routing-full.md) |
| skill-auto-routing-full.md | 170 | Complete auto-routing system | [View](./skill-auto-routing-full.md) |

## Meta Documentation

| File | Purpose | Link |
|------|---------|------|
| README.md | Overview and structure | [View](./README.md) |
| COMPRESSION-LOG.md | Compression report + metrics | [View](./COMPRESSION-LOG.md) |
| BEFORE-AFTER-COMPARISON.md | Detailed comparison analysis | [View](./BEFORE-AFTER-COMPARISON.md) |
| INDEX.md | This file | - |

## Quick Reference by Topic

### Cost Optimization
- **Model Routing:** [Compressed](../../.claude/rules/model-routing.md) | [Full](./model-routing-full.md)
- **Local Tools:** [Compressed](../../.claude/rules/local-tools-auto-use.md) | [Full](./local-tools-auto-use-full.md)

### Task Management
- **ClickUp Sync:** [Compressed](../../.claude/rules/clickup-auto-sync.md) | [Full](./clickup-auto-sync-full.md)
- **Handover Contracts:** [Compressed](../../.claude/rules/handover-contracts.md) | [Full](./handover-contracts-full.md)

### System Integration
- **MCP Usage:** [Compressed](../../.claude/rules/mcp-usage.md) | [Full](./mcp-usage-full.md)
- **Activity Logging:** [Compressed](../../.claude/rules/activity-logging.md) | [Full](./activity-logging-full.md)

### Workflow Automation
- **Skill Auto-Routing:** [Compressed](../../.claude/rules/skill-auto-routing.md) | [Full](./skill-auto-routing-full.md)

## Usage Guidelines

### For Agents

**On Session Startup:**
- Compressed rules are automatically loaded (~3,500 tokens)
- Use TL;DR and Critical Rules for immediate guidance

**During Work:**
- Compressed rules sufficient for 90%+ of operations
- Reference full docs when:
  - Implementing complex features
  - Debugging edge cases
  - Needing detailed examples
  - Creating new workflows

**When Updating Rules:**
1. Update full documentation first
2. Regenerate compressed version
3. Ensure links remain valid
4. Update COMPRESSION-LOG.md with changes

### For Developers

**Adding New Rules:**
1. Create full documentation in `docs/rules/[name]-full.md`
2. Create compressed version in `.claude/rules/[name].md`
3. Follow established template (TL;DR, Critical Rules, Quick Reference)
4. Update this INDEX.md
5. Target: 20-35 lines for compressed version

**Maintaining Consistency:**
- Keep both versions in sync
- Preserve critical MUST/NEVER rules in compressed version
- Include only essential commands/tables
- Always link to full documentation

## Compression Metrics

- **Total Reduction:** 76.7% (5,493 → 1,280 words)
- **Token Savings:** ~10,200 tokens per session
- **Monthly Savings:** ~€7.65 (at 50 sessions/month, Opus rates)
- **Maintained Quality:** 100% of information preserved in full docs

---

*Rules Documentation Index - AIOS Framework v3.0*
*Last Updated: 2026-02-15*
