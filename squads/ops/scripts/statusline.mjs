#!/usr/bin/env node

/**
 * AIOS Visual Context System - Statusline for Claude Code
 * Cross-platform (Windows/macOS/Linux) - Zero dependencies
 *
 * Displays a 2-line statusline with session metrics and AIOS context.
 * Claude Code pipes JSON to stdin; this script outputs formatted text.
 *
 * Line 1: Model | Context Bar % tokens | Cost Duration | AIOS Context
 * Line 2: Directory:Branch | CPU/RAM | Date Time
 *
 * Adapted from: aios-visual-context-system v2.0 (Luiz Fosc)
 * Platform: Windows 11 (Node.js - no jq/bash dependency)
 *
 * Setup: Add to ~/.claude/settings.json:
 *   { "statusLine": { "type": "command", "command": "node C:/Users/thiag/workspace/aios-lab/squads/ops/scripts/statusline.mjs" } }
 */

import os from 'os';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

// ANSI Colors
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[0;36m',
  yellow: '\x1b[1;33m',
  green: '\x1b[0;32m',
  red: '\x1b[0;31m',
  blue: '\x1b[0;34m',
  gray: '\x1b[0;90m',
  magenta: '\x1b[0;35m'
};

// Read JSON from stdin (Claude Code pipes session data)
function readStdin() {
  try {
    // Try multiple methods for cross-platform stdin reading
    const fd = fs.openSync('/dev/stdin', 'r');
    const data = fs.readFileSync(fd, 'utf8');
    fs.closeSync(fd);
    return data;
  } catch {
    try {
      return fs.readFileSync(0, 'utf8');
    } catch {
      return '{}';
    }
  }
}

// Parse Claude Code JSON input
function parseInput(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

// Format token count (k/M)
function formatTokens(tokens) {
  if (tokens > 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`;
  if (tokens > 1_000) return `${Math.round(tokens / 1_000)}k`;
  return `${tokens}`;
}

// Format duration from ms
function formatDuration(ms) {
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  if (hr > 0) return `${hr}h${min % 60}m`;
  if (min > 0) return `${min}m${sec % 60}s`;
  return `${sec}s`;
}

// Get CPU usage (cross-platform)
function getCpuPercent() {
  try {
    const cpus = os.cpus();
    let totalIdle = 0, totalTick = 0;
    for (const cpu of cpus) {
      for (const type in cpu.times) totalTick += cpu.times[type];
      totalIdle += cpu.times.idle;
    }
    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    return Math.round(((total - idle) / total) * 100);
  } catch {
    return 0;
  }
}

// Get RAM percent
function getRamPercent() {
  const total = os.totalmem();
  const free = os.freemem();
  return Math.round(((total - free) / total) * 100);
}

// Get git branch
function getGitBranch(cwd) {
  if (!cwd) return '';
  try {
    return execSync('git branch --show-current', {
      cwd,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 2000
    }).trim();
  } catch {
    return '';
  }
}

// Short path (replace home dir with ~)
function shortPath(fullPath) {
  const normalized = fullPath.replace(/\\/g, '/');
  const home = os.homedir().replace(/\\/g, '/');
  if (normalized.startsWith(home)) {
    return '~' + normalized.slice(home.length);
  }
  return normalized;
}

// Read AIOS session context
function readAiosContext(cwd) {
  if (!cwd) return '';
  const sessionFile = path.join(cwd, '.aios', 'session.json');
  try {
    if (!fs.existsSync(sessionFile)) return '';
    const session = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));

    let ctx = '';
    const project = session.project || {};
    const status = session.status || {};
    const agent = session.agent || {};

    // Title with emoji
    if (project.displayTitle) {
      const emoji = project.titleEmoji || project.emoji || '';
      const title = project.displayTitle.length > 35
        ? project.displayTitle.slice(0, 32) + '...'
        : project.displayTitle;
      ctx = emoji ? `${emoji} ${title}` : title;
    } else if (project.name) {
      const emoji = project.emoji || '';
      ctx = emoji ? `${emoji} ${project.name}` : project.name;
    }

    // Active agent
    if (agent.active) {
      ctx += ` @${agent.active}`;
    }

    // Progress
    if (status.progress) {
      ctx += ` [${status.progress}]`;
    }

    // Status emoji
    if (status.emoji) {
      ctx += ` ${status.emoji}`;
    }

    return ctx;
  } catch {
    return '';
  }
}

// Build progress bar (10 blocks)
function buildProgressBar(percent) {
  const total = 10;
  const filled = Math.round(percent * total / 100);
  const empty = total - filled;

  let barColor;
  if (percent > 80) barColor = C.red;
  else if (percent > 50) barColor = C.yellow;
  else barColor = C.green;

  return barColor + '\u2588'.repeat(filled) + C.gray + '\u2591'.repeat(empty) + C.reset;
}

// Main
function main() {
  const raw = readStdin();
  const input = parseInput(raw);

  // Extract Claude Code metrics
  const model = input?.model?.display_name || 'Unknown';
  const ctxPercent = Math.round(input?.context_window?.used_percentage || 0);
  const ctxSize = input?.context_window?.context_window_size || 200000;
  const sessionCost = input?.cost?.total_cost_usd || 0;
  const durationMs = input?.cost?.total_duration_ms || 0;
  const cwd = input?.cwd || process.cwd();

  // Derived values
  const tokensUsed = Math.round(ctxSize * ctxPercent / 100);
  const tokensFmt = formatTokens(tokensUsed);
  const durationFmt = formatDuration(durationMs);
  const costFmt = sessionCost.toFixed(2);

  // System metrics
  const cpuPercent = getCpuPercent();
  const ramPercent = getRamPercent();

  // Git
  const branch = getGitBranch(cwd);
  const shortCwd = shortPath(cwd);

  // AIOS Context
  const aiosContext = readAiosContext(cwd);

  // Progress bar
  const progressBar = buildProgressBar(ctxPercent);

  // Date/Time
  const now = new Date();
  const dateFmt = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getFullYear()).slice(2)}`;
  const timeFmt = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // === LINE 1: Model | Progress Bar % tokens | Cost Duration | AIOS Context ===
  let line1 = `\u{1F916} ${C.cyan}${model}${C.reset} | ${progressBar} ${C.bold}${ctxPercent}%${C.reset} ${tokensFmt} | \u{1F4B0} ${C.yellow}$${costFmt}${C.reset} \u23F1 ${durationFmt}`;

  if (aiosContext) {
    line1 += ` | ${C.bold}${aiosContext}${C.reset}`;
  }

  // === LINE 2: Directory:Branch | CPU/RAM | Date Time ===
  let line2 = `\u{1F4C1} ${C.blue}${shortCwd}`;
  if (branch) {
    line2 += `:${branch}`;
  }
  line2 += `${C.reset} | \u{1F4BB} ${cpuPercent}%/${ramPercent}% | \u{1F4C5} ${dateFmt} \u{1F550} ${timeFmt}`;

  // Output two lines
  process.stdout.write(`${line1}\n${line2}`);
}

main();
