#!/usr/bin/env python3
"""
Claude Code Stop Hook - Tracks token usage and cost per session.
Saves data to command-center-data.json for budget monitoring.

NOTE: Claude Code doesn't expose actual token counts via hooks.
This tracks session counts and estimates based on conversation length.
For accurate token counts, use the Claude Code API or dashboard.
"""

import json
import sys
import os
from datetime import datetime
from pathlib import Path

# Pricing (Claude Opus 4.5 - approximate)
COST_PER_1K_INPUT_TOKENS = 0.015   # $15/MTok input
COST_PER_1K_OUTPUT_TOKENS = 0.075  # $75/MTok output
USD_TO_EUR = 0.92

def estimate_tokens_from_transcript(transcript_path):
    """
    Estimate tokens from transcript file.
    Very rough estimate: ~4 chars per token on average.
    """
    try:
        if transcript_path and os.path.exists(transcript_path):
            with open(transcript_path, 'r', encoding='utf-8') as f:
                content = f.read()
                # Rough estimate: 4 chars per token
                estimated_tokens = len(content) // 4
                return estimated_tokens
    except Exception:
        pass
    return 0

def update_usage_data(tokens_estimate, cost_estimate):
    """Update the command-center-data.json with usage info (compatible with existing format)"""
    data_file = Path(__file__).parent.parent.parent / "squads" / "ops" / "data" / "command-center-data.json"

    try:
        # Ensure directory exists
        data_file.parent.mkdir(parents=True, exist_ok=True)

        # Load existing data or create new
        if data_file.exists():
            with open(data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            data = {
                "tasks": {},
                "dailyUsage": {},
                "monthlyUsage": {},
                "totals": {"tokens": {"input": 0, "output": 0}, "cost": 0, "tasks": 0},
                "lastUpdated": datetime.now().isoformat()
            }

        today = datetime.now().strftime('%Y-%m-%d')
        month = datetime.now().strftime('%Y-%m')

        # Estimate input/output split (60/40)
        input_tokens = int(tokens_estimate * 0.6)
        output_tokens = int(tokens_estimate * 0.4)

        # Update daily usage (using existing format)
        if 'dailyUsage' not in data:
            data['dailyUsage'] = {}
        if today not in data['dailyUsage']:
            data['dailyUsage'][today] = {
                "tokens": {"input": 0, "output": 0},
                "cost": 0,
                "tasks": []
            }

        data['dailyUsage'][today]['tokens']['input'] += input_tokens
        data['dailyUsage'][today]['tokens']['output'] += output_tokens
        data['dailyUsage'][today]['cost'] += cost_estimate

        # Update monthly usage (using existing format)
        if 'monthlyUsage' not in data:
            data['monthlyUsage'] = {}
        if month not in data['monthlyUsage']:
            data['monthlyUsage'][month] = {
                "tokens": {"input": 0, "output": 0},
                "cost": 0,
                "tasks": []
            }

        data['monthlyUsage'][month]['tokens']['input'] += input_tokens
        data['monthlyUsage'][month]['tokens']['output'] += output_tokens
        data['monthlyUsage'][month]['cost'] += cost_estimate

        # Update totals
        if 'totals' not in data:
            data['totals'] = {"tokens": {"input": 0, "output": 0}, "cost": 0, "tasks": 0}
        data['totals']['tokens']['input'] += input_tokens
        data['totals']['tokens']['output'] += output_tokens
        data['totals']['cost'] += cost_estimate

        data['lastUpdated'] = datetime.now().isoformat()

        # Save
        with open(data_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)

        return True
    except Exception as e:
        sys.stderr.write(f"Failed to update usage data: {e}\n")
        return False

def main():
    # Read hook input from stdin
    try:
        hook_input = json.loads(sys.stdin.read()) if not sys.stdin.isatty() else {}
    except Exception:
        hook_input = {}

    transcript_path = hook_input.get('transcript_path')

    # Estimate tokens
    tokens_estimate = estimate_tokens_from_transcript(transcript_path)

    # Estimate cost (very rough - assumes 50/50 input/output split)
    input_tokens = tokens_estimate // 2
    output_tokens = tokens_estimate // 2
    cost_usd = (input_tokens / 1000) * COST_PER_1K_INPUT_TOKENS + (output_tokens / 1000) * COST_PER_1K_OUTPUT_TOKENS
    cost_eur = cost_usd * USD_TO_EUR

    # Update tracking data
    if tokens_estimate > 0:
        update_usage_data(tokens_estimate, cost_eur)

    # Exit 0 = success (non-blocking)
    sys.exit(0)

if __name__ == "__main__":
    main()
