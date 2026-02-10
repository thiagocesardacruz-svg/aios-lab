# AIOS Scripts

> Utility scripts for Service Order management, validation, and sync.

## Installation

```bash
cd scripts
npm install
```

## Available Scripts

| Script | Description | Command |
|--------|-------------|---------|
| `generate-os-id.js` | Generate next OS ID | `npm run generate-os` |
| `validate-os.js` | Validate OS files against schema | `npm run validate` |
| `cost-calculator.js` | Calculate and report costs | `npm run costs` |
| `health-check.js` | System health validation | `npm run health` |
| `sync-yaml-to-notion.js` | Sync OS to Notion | `npm run sync` |

## Usage Examples

### Generate OS ID

```bash
# Generate next ID for current year
node generate-os-id.js
# Output: OS-2026-0001

# Generate for specific year
node generate-os-id.js --year 2025

# JSON output
node generate-os-id.js --json
```

### Validate OS Files

```bash
# Validate all OS files
node validate-os.js

# Validate specific file
node validate-os.js logs/service-orders/2026/os-2026-0001.yaml

# Strict mode (fail on warnings)
node validate-os.js --strict

# JSON output
node validate-os.js --json
```

### Cost Calculator

```bash
# Show current period summary
node cost-calculator.js

# Daily breakdown (last 14 days)
node cost-calculator.js --daily

# Breakdown by squad
node cost-calculator.js --squad

# Breakdown by cost category
node cost-calculator.js --category

# All breakdowns
node cost-calculator.js --daily --squad --category

# JSON output
node cost-calculator.js --json
```

### Health Check

```bash
# Run all checks
node health-check.js

# Quick checks only
node health-check.js --quick

# JSON output
node health-check.js --json
```

### Sync to Notion

```bash
# Preview mode (no API key)
node sync-yaml-to-notion.js

# Dry run (with API key)
export NOTION_API_KEY="secret_..."
export NOTION_OS_DB="database-id"
node sync-yaml-to-notion.js --dry-run

# Full sync
node sync-yaml-to-notion.js

# JSON output
node sync-yaml-to-notion.js --json
```

## Environment Variables

For Notion sync:

| Variable | Required | Description |
|----------|----------|-------------|
| `NOTION_API_KEY` | Yes | Notion integration token |
| `NOTION_OS_DB` | Yes | Service Orders database ID |
| `NOTION_AGENTS_DB` | No | Agents database ID |
| `NOTION_COMMANDS_DB` | No | Commands database ID |

## Budget Limits

The cost calculator uses these limits from `governance/cost-policy.md`:

| Limit | Value | Action |
|-------|-------|--------|
| Monthly | €470 | Alert at 80% |
| Daily Alert | €15 | Notification |
| Daily Hard | €20 | SAFE MODE |
| Single Task | €10 | Approval required |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Errors found / validation failed |

## Requirements

- Node.js 18+
- npm packages: `js-yaml`, `glob`, `chalk`
- Optional: `@notionhq/client` for Notion sync
