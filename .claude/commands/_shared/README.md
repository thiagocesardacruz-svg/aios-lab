# Shared Resources

This directory contains resources shared across multiple squads to avoid duplication and ensure consistency.

## Structure

```
_shared/
├── workflows/          # Consolidated workflows used by multiple squads
├── templates/          # Shared document templates
├── checklists/         # Cross-squad quality checklists
└── scripts/            # Utility scripts for shared operations
```

## Shared Workflows

| Workflow | Consumers | Description |
|----------|-----------|-------------|
| `market-research.yaml` | marketing, growth, sales | Comprehensive market research (ICP, sizing, competitors) |

### How to Use Shared Workflows

Squads can invoke shared workflows by referencing them:

```yaml
# In your squad's workflow or task
workflow:
  use: _shared/workflows/market-research.yaml
  params:
    target: "Hotel SaaS"
    focus: icp  # or: sizing, competitors, trends, full
    depth: standard
```

Or via command:
```
*workflow market-research --target="Hotel SaaS" --focus=full
```

## Adding Shared Resources

Before creating a new shared resource:

1. **Verify need**: Is this used by 2+ squads?
2. **Check for existing**: Does a similar resource exist?
3. **Design for flexibility**: Use parameters, not hardcoding
4. **Document clearly**: Include usage examples

### Workflow Consolidation Criteria

A workflow should be shared when:
- Used by 2+ squads with >70% overlap
- Core logic is identical, only parameters differ
- Maintaining separate copies creates sync issues

### Template Requirements

Shared templates must:
- Use mustache/handlebars syntax for variables
- Include all possible sections (conditionally rendered)
- Document required vs optional variables

## Governance

- **Owner**: ops squad
- **Review required**: Any changes need approval from all consuming squads
- **Versioning**: Shared resources use semver (major.minor.patch)
- **Breaking changes**: Require migration guide

## Migration Guide

### Migrating from Squad-Specific to Shared

1. Identify the shared workflow in `_shared/workflows/`
2. Update your squad's workflow reference:
   ```yaml
   # Before
   workflow: market-research.yaml

   # After
   workflow:
     use: _shared/workflows/market-research.yaml
     params:
       focus: icp  # your squad's default
   ```
3. Remove the deprecated squad-specific file (or mark as deprecated)
4. Update any documentation references

---

*Shared Resources v1.0 - AIOS Framework*
