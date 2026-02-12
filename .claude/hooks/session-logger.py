#!/usr/bin/env python3
"""
Claude Code Stop Hook - Auto-logs session activity.
Extracts key actions from transcript and saves to activity log.

Cost: €0 (deterministic extraction, no AI)

What it captures:
- Files modified (from Edit/Write tool calls)
- Commands run (from Bash tool calls)
- Decisions detected (keyword matching)
- Session duration estimate
"""

import json
import sys
import os
import re
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent
ACTIVITY_LOG_DIR = ROOT / ".aios" / "logs" / "activity"

def ensure_dir():
    ACTIVITY_LOG_DIR.mkdir(parents=True, exist_ok=True)

def get_log_file():
    today = datetime.now().strftime('%Y-%m-%d')
    return ACTIVITY_LOG_DIR / f"{today}.jsonl"

def log_entry(entry):
    """Append entry to today's log"""
    ensure_dir()
    log_file = get_log_file()
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(json.dumps(entry) + '\n')

def extract_from_transcript(transcript_path):
    """Extract key information from transcript file"""
    if not transcript_path or not os.path.exists(transcript_path):
        return None

    try:
        with open(transcript_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        return None

    # Extract patterns
    files_modified = set()
    commands_run = []
    decisions = []
    errors = []

    # File modifications (Edit/Write tool patterns)
    file_patterns = [
        r'file_path["\']?\s*:\s*["\']([^"\']+)["\']',
        r'Edit.*?([a-zA-Z0-9_\-/\\\.]+\.(ts|tsx|js|jsx|py|md|yaml|json))',
        r'Write.*?([a-zA-Z0-9_\-/\\\.]+\.(ts|tsx|js|jsx|py|md|yaml|json))',
    ]
    for pattern in file_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        for match in matches:
            if isinstance(match, tuple):
                files_modified.add(match[0])
            else:
                files_modified.add(match)

    # Bash commands
    bash_pattern = r'Bash.*?command["\']?\s*:\s*["\']([^"\']+)["\']'
    commands_run = re.findall(bash_pattern, content)[:10]  # Limit to 10

    # Decision keywords
    decision_keywords = [
        'decidimos', 'escolhemos', 'optamos', 'definimos',
        'decided', 'chose', 'selected', 'determined'
    ]
    for keyword in decision_keywords:
        pattern = rf'[^.]*{keyword}[^.]*\.'
        matches = re.findall(pattern, content, re.IGNORECASE)
        decisions.extend(matches[:5])  # Limit to 5

    # Error keywords
    error_keywords = ['erro', 'error', 'fix', 'bug', 'issue', 'failed']
    for keyword in error_keywords:
        pattern = rf'[^.]*{keyword}[^.]*\.'
        matches = re.findall(pattern, content, re.IGNORECASE)
        errors.extend(matches[:5])

    return {
        'files': list(files_modified)[:20],  # Limit
        'commands': commands_run[:10],
        'decisions': decisions[:5],
        'errors': errors[:5],
        'char_count': len(content)
    }

def main():
    # Read hook input
    try:
        hook_input = json.loads(sys.stdin.read()) if not sys.stdin.isatty() else {}
    except Exception:
        hook_input = {}

    transcript_path = hook_input.get('transcript_path')

    # Extract info
    info = extract_from_transcript(transcript_path)

    if not info:
        sys.exit(0)

    # Log session end
    session_entry = {
        'timestamp': datetime.now().isoformat(),
        'action': 'Session ended',
        'type': 'session',
        'tags': ['auto-captured', 'session-end'],
        'files': info['files'],
        'metadata': {
            'commands_count': len(info['commands']),
            'decisions_detected': len(info['decisions']),
            'errors_detected': len(info['errors']),
            'char_count': info['char_count']
        }
    }
    log_entry(session_entry)

    # Log detected decisions
    for decision in info['decisions']:
        decision_entry = {
            'timestamp': datetime.now().isoformat(),
            'action': decision.strip()[:200],  # Truncate
            'type': 'decision',
            'tags': ['auto-captured', 'from-transcript'],
            'files': [],
            'metadata': {}
        }
        log_entry(decision_entry)

    # Log detected errors
    for error in info['errors']:
        error_entry = {
            'timestamp': datetime.now().isoformat(),
            'action': error.strip()[:200],
            'type': 'error',
            'tags': ['auto-captured', 'from-transcript'],
            'files': [],
            'metadata': {}
        }
        log_entry(error_entry)

    sys.exit(0)

if __name__ == "__main__":
    main()
