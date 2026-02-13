# Usage Dashboard Command

Shows current token/cost usage and context window estimate.

## Execution

Run the usage dashboard script:

```bash
python "$CLAUDE_PROJECT_DIR/.claude/hooks/show-context-usage.py"
```

## What It Shows

- **Current Date/Time**: Confirms the AI knows the current date
- **Context Window**: Estimated usage (if transcript path available)
- **Daily Budget**: Today's spending vs €20 limit
- **Monthly Budget**: This month's spending vs €468 limit
- **Remaining Budget**: How much is left today and this month

## Quick Access

Type `/usage` or ask "show my usage" to run this dashboard.

## Notes

- Token counts are estimates based on transcript file size
- For accurate usage, check: https://console.anthropic.com/settings/usage
- Budget limits: €20/day (hard), €15/day (alert), €468/month
