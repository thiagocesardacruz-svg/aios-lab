# Tool Discovery Storage

> Registry global de ferramentas avaliadas e preferências aprendidas.

## Structure

```
tools/
├── registry.yaml      # Master registry of all tools
├── preferences.yaml   # Squad/agent preferences
└── evaluations/       # Individual evaluation records
    └── EVAL-YYYY-NNN.yaml
```

## Usage

This storage is managed by the `/tool-discovery` skill.

### Commands

- `*discover {domain}` - Full discovery pipeline
- `*evaluate {tool}` - RICE/WSJF evaluation
- `*compare {tool1} {tool2}` - Side-by-side comparison
- `*registry` - Show full registry
- `*recommend {need}` - Get recommendation

## Tool IDs

| Category | Format | Example |
|----------|--------|---------|
| MCP | TOOL-mcp-NNN | TOOL-mcp-001 |
| Library | TOOL-lib-NNN | TOOL-lib-015 |
| Framework | TOOL-framework-NNN | TOOL-framework-003 |
| API | TOOL-api-NNN | TOOL-api-007 |
| CLI | TOOL-cli-NNN | TOOL-cli-002 |
| SaaS | TOOL-saas-NNN | TOOL-saas-004 |

## RICE Score

```
RICE = (Reach × Impact × Confidence) / Effort

Reach:      1-10 (quantos se beneficiam)
Impact:     0.25-2 (quanto melhora)
Confidence: 0.5-1 (certeza da avaliação)
Effort:     1-10 (esforço de adoção)
```

## Adoption Status

| Status | Meaning |
|--------|---------|
| candidate | Identified, not yet evaluated |
| evaluated | RICE scored, decision pending |
| adopted | In use by one or more squads |
| deprecated | No longer recommended |

---

*Managed by /tool-discovery skill*
