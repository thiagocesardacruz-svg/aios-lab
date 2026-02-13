#!/usr/bin/env python3
"""
Context Window Usage Display - Run manually to check current context usage.
Usage: python .claude/hooks/show-context-usage.py [transcript_path]

Note: Claude Code doesn't expose context window size directly.
This provides an estimate based on transcript file size.
"""

import sys
import os
import json
from datetime import datetime
from pathlib import Path

# Fix Windows encoding for Unicode
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Claude Opus 4.5 context window
MAX_CONTEXT_TOKENS = 200000

def format_number(n):
    """Format number with K/M suffix"""
    if n >= 1_000_000:
        return f"{n/1_000_000:.1f}M"
    elif n >= 1_000:
        return f"{n/1_000:.1f}K"
    return str(n)

def create_progress_bar(percentage, width=30):
    """Create ASCII progress bar"""
    filled = int(width * percentage / 100)
    empty = width - filled

    if percentage >= 90:
        color_start, color_end = "\033[91m", "\033[0m"  # Red
    elif percentage >= 75:
        color_start, color_end = "\033[93m", "\033[0m"  # Yellow
    else:
        color_start, color_end = "\033[92m", "\033[0m"  # Green

    bar = f"{color_start}{'█' * filled}{'░' * empty}{color_end}"
    return f"[{bar}] {percentage:.1f}%"

def estimate_context_usage(transcript_path=None):
    """Estimate context window usage from transcript"""
    tokens_estimate = 0

    if transcript_path and os.path.exists(transcript_path):
        try:
            with open(transcript_path, 'r', encoding='utf-8') as f:
                content = f.read()
                # Rough estimate: 4 chars per token
                tokens_estimate = len(content) // 4
        except Exception:
            pass

    return tokens_estimate

def get_budget_status():
    """Get current budget status"""
    data_file = Path(__file__).parent.parent.parent / "squads" / "ops" / "data" / "command-center-data.json"

    try:
        if data_file.exists():
            with open(data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                today = datetime.now().strftime('%Y-%m-%d')
                month = datetime.now().strftime('%Y-%m')

                # Handle existing format
                daily_raw = data.get('dailyUsage', {}).get(today, {})
                monthly_raw = data.get('monthlyUsage', {}).get(month, {})

                # Extract tokens (handle nested format)
                daily_tokens = daily_raw.get('tokens', {})
                if isinstance(daily_tokens, dict):
                    daily_tokens = daily_tokens.get('input', 0) + daily_tokens.get('output', 0)

                monthly_tokens = monthly_raw.get('tokens', {})
                if isinstance(monthly_tokens, dict):
                    monthly_tokens = monthly_tokens.get('input', 0) + monthly_tokens.get('output', 0)

                daily = {
                    "tokens": daily_tokens,
                    "cost_eur": daily_raw.get('cost', 0),
                    "sessions": len(daily_raw.get('tasks', []))
                }

                monthly = {
                    "tokens": monthly_tokens,
                    "cost_eur": monthly_raw.get('cost', 0)
                }

                return {
                    "daily": daily,
                    "monthly": monthly,
                    "daily_limit": 20,
                    "monthly_limit": 468
                }
    except Exception:
        pass

    return None

def main():
    print("\n" + "="*60)
    print("  CLAUDE CODE USAGE DASHBOARD")
    print("="*60)

    # Current date/time
    now = datetime.now()
    print(f"\n[DATE] {now.strftime('%Y-%m-%d %H:%M')} ({now.strftime('%A')})")

    # Context window estimate
    transcript_path = sys.argv[1] if len(sys.argv) > 1 else None
    if transcript_path:
        tokens_used = estimate_context_usage(transcript_path)
        context_pct = (tokens_used / MAX_CONTEXT_TOKENS) * 100

        print(f"\n[CONTEXT WINDOW]")
        print(f"   {format_number(tokens_used)} / {format_number(MAX_CONTEXT_TOKENS)} tokens")
        print(f"   {create_progress_bar(context_pct)}")
    else:
        print(f"\n[CONTEXT] Run with transcript path for estimate")

    # Budget status
    budget = get_budget_status()
    if budget:
        daily_pct = (budget['daily']['cost_eur'] / budget['daily_limit']) * 100
        monthly_pct = (budget['monthly']['cost_eur'] / budget['monthly_limit']) * 100

        print(f"\n[DAILY BUDGET] EUR {budget['daily_limit']} limit")
        print(f"   EUR {budget['daily']['cost_eur']:.2f} spent | {budget['daily'].get('sessions', 0)} sessions")
        print(f"   {create_progress_bar(daily_pct)}")

        print(f"\n[MONTHLY BUDGET] EUR {budget['monthly_limit']} limit")
        print(f"   EUR {budget['monthly']['cost_eur']:.2f} spent | {format_number(budget['monthly']['tokens'])} tokens")
        print(f"   {create_progress_bar(monthly_pct)}")

        # Remaining budget
        daily_remaining = budget['daily_limit'] - budget['daily']['cost_eur']
        monthly_remaining = budget['monthly_limit'] - budget['monthly']['cost_eur']

        print(f"\n[REMAINING]")
        print(f"   Today:  EUR {max(0, daily_remaining):.2f}")
        print(f"   Month:  EUR {max(0, monthly_remaining):.2f}")
    else:
        print(f"\n[BUDGET] No tracking data found")
        print(f"   Data file: squads/ops/data/command-center-data.json")

    print("\n" + "="*60)
    print("  TIP: Check console.anthropic.com for accurate usage")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
