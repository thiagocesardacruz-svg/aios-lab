#!/usr/bin/env python3
"""
Claude Code SessionStart Hook - Injects current date and session context.
Exit code 0 = success, stdout is added to Claude's context.
"""

import json
import sys
import os
import subprocess
from datetime import datetime, timedelta
from pathlib import Path

def get_budget_status():
    """Read current budget status from command-center-data.json"""
    data_file = Path(__file__).parent.parent.parent / "squads" / "ops" / "data" / "command-center-data.json"
    try:
        if data_file.exists():
            with open(data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                today = datetime.now().strftime('%Y-%m-%d')
                month = datetime.now().strftime('%Y-%m')

                # Handle both old and new format
                daily = data.get('dailyUsage', {}).get(today, data.get('daily_usage', {}).get(today, {}))
                monthly = data.get('monthlyUsage', {}).get(month, data.get('monthly_usage', {}))

                # Extract tokens (handle nested format)
                daily_tokens = daily.get('tokens', {})
                if isinstance(daily_tokens, dict):
                    daily_tokens = daily_tokens.get('input', 0) + daily_tokens.get('output', 0)

                monthly_tokens = monthly.get('tokens', {})
                if isinstance(monthly_tokens, dict):
                    monthly_tokens = monthly_tokens.get('input', 0) + monthly_tokens.get('output', 0)

                return {
                    "daily_tokens": daily_tokens,
                    "daily_cost_eur": daily.get('cost', 0),
                    "monthly_tokens": monthly_tokens,
                    "monthly_cost_eur": monthly.get('cost', 0),
                    "daily_limit_eur": 20,
                    "monthly_limit_eur": 468
                }
    except Exception:
        pass
    return None

def get_last_session_summary():
    """Build a concise summary of last session: git commits, activity, pending items."""
    root = Path(__file__).parent.parent.parent
    lines = []

    # Recent git commits (last 3)
    try:
        result = subprocess.run(
            ["git", "log", "--oneline", "-3"],
            capture_output=True, text=True, cwd=str(root), timeout=5
        )
        if result.returncode == 0 and result.stdout.strip():
            lines.append("Recent commits:")
            for commit in result.stdout.strip().split('\n'):
                lines.append(f"  {commit}")
    except Exception:
        pass

    # Last activity log entry
    today = datetime.now().strftime('%Y-%m-%d')
    yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')

    activity_count = 0
    last_activity_time = None
    for date_str in [today, yesterday]:
        log_file = root / ".aios" / "logs" / "activity" / f"{date_str}.jsonl"
        if log_file.exists():
            try:
                log_lines = log_file.read_text(encoding='utf-8').strip().split('\n')
                log_lines = [l for l in log_lines if l.strip()]
                activity_count = len(log_lines)
                if log_lines:
                    last = json.loads(log_lines[-1])
                    ts = last.get('timestamp', '')
                    last_activity_time = f"{date_str} {ts[11:16]}" if len(ts) > 16 else date_str
                break
            except Exception:
                pass

    if last_activity_time:
        lines.append(f"Last activity: {last_activity_time} - {activity_count} actions logged")

    return lines


def get_briefing_summary():
    """Check briefing status and return compact info."""
    root = Path(__file__).parent.parent.parent
    briefing_path = root / ".aios" / "briefings" / "latest.md"
    lines = []

    if briefing_path.exists():
        try:
            content = briefing_path.read_text(encoding='utf-8')
            # Check if briefing is from today
            today = datetime.now().strftime('%Y-%m-%d')
            if today in content[:200]:
                lines.append(f"Briefing: available (today)")
            else:
                lines.append(f"Briefing: OUTDATED (not from today)")
                lines.append("  Run: node squads/ops/scripts/briefing.mjs")

            # Extract key numbers from briefing (compact)
            for line in content.split('\n'):
                if 'commit(s)' in line.lower():
                    clean = line.strip().lstrip('- ').replace('**', '')
                    lines.append(f"  {clean}")
                    break
        except Exception:
            pass
    else:
        lines.append("Briefing: not available")
        lines.append("  Run: node squads/ops/scripts/briefing.mjs")

    lines.append("Full briefing: node squads/ops/scripts/briefing.mjs --stdout")
    return lines


def main():
    # Read hook input from stdin
    try:
        hook_input = json.loads(sys.stdin.read()) if not sys.stdin.isatty() else {}
    except Exception:
        hook_input = {}

    # Current date and time info
    now = datetime.now()

    # Build context message
    context_parts = []

    # Date context
    context_parts.append(f"[SESSION CONTEXT]")
    context_parts.append(f"Current Date: {now.strftime('%Y-%m-%d')}")
    context_parts.append(f"Day of Week: {now.strftime('%A')}")
    context_parts.append(f"Time: {now.strftime('%H:%M')} (local)")
    context_parts.append(f"Timezone: {datetime.now().astimezone().tzname()}")

    # Budget status if available
    budget = get_budget_status()
    if budget:
        daily_pct = (budget['daily_cost_eur'] / budget['daily_limit_eur']) * 100
        monthly_pct = (budget['monthly_cost_eur'] / budget['monthly_limit_eur']) * 100

        context_parts.append("")
        context_parts.append("[BUDGET STATUS]")
        context_parts.append(f"Today: {budget['daily_cost_eur']:.2f}/{budget['daily_limit_eur']} EUR ({daily_pct:.1f}%)")
        context_parts.append(f"Month: {budget['monthly_cost_eur']:.2f}/{budget['monthly_limit_eur']} EUR ({monthly_pct:.1f}%)")

        if daily_pct >= 75:
            context_parts.append("WARNING: Approaching daily budget limit!")
        if monthly_pct >= 90:
            context_parts.append("ALERT: Near monthly budget limit!")

    # Last session summary
    session_summary = get_last_session_summary()
    if session_summary:
        context_parts.append("")
        context_parts.append("[LAST SESSION SUMMARY]")
        context_parts.extend(session_summary)

    # Briefing availability
    briefing_info = get_briefing_summary()
    if briefing_info:
        context_parts.append("")
        context_parts.append("[BRIEFING]")
        context_parts.extend(briefing_info)

    # Session info
    session_id = hook_input.get('session_id', 'unknown')
    source = hook_input.get('source', 'startup')
    context_parts.append("")
    context_parts.append(f"[SESSION INFO]")
    context_parts.append(f"Session: {session_id[:8]}... ({source})")

    # Output context (will be injected into Claude's context)
    print("\n".join(context_parts))

    # Exit 0 = success
    sys.exit(0)

if __name__ == "__main__":
    main()
