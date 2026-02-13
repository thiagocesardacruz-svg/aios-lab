#!/usr/bin/env node
/**
 * Daily Briefing Generator - Zero cost, deterministic
 *
 * Generates a concise briefing from:
 * - Git log (last 24h)
 * - Activity logs (.aios/logs/activity/)
 * - Budget status
 * - Recent decisions
 *
 * Output: .aios/briefings/latest.md
 *
 * Usage:
 *   node briefing.mjs              # Generate today's briefing
 *   node briefing.mjs --date=2026-02-12  # Generate for specific date
 *   node briefing.mjs --stdout     # Print to stdout only (no file save)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../..');
const BRIEFINGS_DIR = path.join(ROOT, '.aios/briefings');
const LOGS_DIR = path.join(ROOT, '.aios/logs/activity');
const DECISIONS_DIR = path.join(ROOT, '.aios/memory/decisions');
const BUDGET_FILE = path.join(ROOT, 'squads/ops/data/command-center-data.json');

// Ensure directories exist
[BRIEFINGS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// --- Parse args ---
const args = process.argv.slice(2);
const dateArg = args.find(a => a.startsWith('--date='));
const stdoutOnly = args.includes('--stdout');
const targetDate = dateArg ? dateArg.split('=')[1] : new Date().toISOString().split('T')[0];

// --- Data collectors ---

function getGitActivity(since) {
  try {
    const log = execSync(
      `git log --since="${since}" --oneline --no-merges --format="%h %s (%ar)"`,
      { cwd: ROOT, encoding: 'utf8', timeout: 5000 }
    ).trim();
    return log ? log.split('\n') : [];
  } catch {
    return [];
  }
}

function getUncommittedChanges() {
  try {
    const status = execSync(
      'git status --porcelain',
      { cwd: ROOT, encoding: 'utf8', timeout: 5000 }
    ).trim();
    if (!status) return { modified: 0, added: 0, staged: 0, total: 0 };
    const lines = status.split('\n');
    const modified = lines.filter(l => l.startsWith(' M') || l.startsWith('M ')).length;
    const added = lines.filter(l => l.startsWith('??')).length;
    const staged = lines.filter(l => /^[MADRC]/.test(l)).length;
    return { modified, added, staged, total: lines.length };
  } catch {
    return { modified: 0, added: 0, staged: 0, total: 0 };
  }
}

function getActivityLogs(date) {
  const logFile = path.join(LOGS_DIR, `${date}.jsonl`);
  if (!fs.existsSync(logFile)) return [];
  try {
    return fs.readFileSync(logFile, 'utf8')
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(line => JSON.parse(line));
  } catch {
    return [];
  }
}

function getRecentDecisions(limit = 3) {
  const indexFile = path.join(DECISIONS_DIR, 'index.yaml');
  if (!fs.existsSync(indexFile)) return [];
  try {
    const content = fs.readFileSync(indexFile, 'utf8');
    const entries = [];
    const entryRegex = /- id: (DEC-\S+)\s+title: "([^"]+)"\s+date: "([^"]+)"/g;
    let match;
    while ((match = entryRegex.exec(content)) !== null) {
      entries.push({ id: match[1], title: match[2], date: match[3] });
    }
    return entries.slice(-limit);
  } catch {
    return [];
  }
}

function getBudgetStatus() {
  const limits = { monthly: 468, dailyAlert: 15, dailyHard: 20 };
  let usage = { daily: 0, monthly: 0 };

  if (fs.existsSync(BUDGET_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(BUDGET_FILE, 'utf8'));
      usage = {
        daily: data.daily_cost || 0,
        monthly: data.monthly_cost || 0
      };
    } catch { /* use defaults */ }
  }

  return {
    daily: { used: usage.daily, limit: limits.dailyHard, alert: limits.dailyAlert },
    monthly: { used: usage.monthly, limit: limits.monthly },
    status: usage.daily >= limits.dailyHard ? 'SAFE_MODE' :
            usage.daily >= limits.dailyAlert ? 'ALERT' : 'OK'
  };
}

function getCurrentBranch() {
  try {
    return execSync('git branch --show-current', { cwd: ROOT, encoding: 'utf8', timeout: 3000 }).trim();
  } catch {
    return 'unknown';
  }
}

// --- Build briefing ---

function buildBriefing() {
  const now = new Date();
  const since = `${targetDate}T00:00:00`;

  const gitCommits = getGitActivity(since);
  const uncommitted = getUncommittedChanges();
  const activityLogs = getActivityLogs(targetDate);
  const decisions = getRecentDecisions(3);
  const budget = getBudgetStatus();
  const branch = getCurrentBranch();

  // Categorize activity logs
  const logsByType = {};
  activityLogs.forEach(entry => {
    const type = entry.type || 'action';
    if (!logsByType[type]) logsByType[type] = [];
    logsByType[type].push(entry);
  });

  const lines = [];

  lines.push(`# Daily Briefing - ${targetDate}`);
  lines.push(`> Generated at ${now.toISOString().slice(0, 19)} | Branch: \`${branch}\``);
  lines.push('');

  // 1. What happened
  lines.push('## What Happened');
  if (gitCommits.length > 0) {
    lines.push(`**${gitCommits.length} commit(s):**`);
    gitCommits.slice(-10).forEach(c => lines.push(`- ${c}`));
  } else {
    lines.push('_No commits today._');
  }
  lines.push('');

  if (activityLogs.length > 0) {
    lines.push(`**${activityLogs.length} logged activit(ies):**`);
    if (logsByType.decision) lines.push(`- ${logsByType.decision.length} decision(s)`);
    if (logsByType.implementation) lines.push(`- ${logsByType.implementation.length} implementation(s)`);
    if (logsByType.error) lines.push(`- ${logsByType.error.length} error(s)/fix(es)`);
    if (logsByType.action) lines.push(`- ${logsByType.action.length} general action(s)`);
  }
  lines.push('');

  // 2. What needs attention
  lines.push('## Needs Attention');
  let hasAlerts = false;
  if (uncommitted.total > 0) {
    lines.push(`- **${uncommitted.total} file(s) with uncommitted changes** (${uncommitted.modified} modified, ${uncommitted.added} untracked)`);
    hasAlerts = true;
  }
  if (budget.status === 'SAFE_MODE') {
    lines.push(`- **SAFE_MODE ACTIVE** - Daily budget exceeded (EUR ${budget.daily.used}/${budget.daily.limit})`);
    hasAlerts = true;
  } else if (budget.status === 'ALERT') {
    lines.push(`- **Budget alert** - Approaching limit (EUR ${budget.daily.used}/${budget.daily.limit})`);
    hasAlerts = true;
  }
  if (!hasAlerts) {
    lines.push('_Nothing urgent._');
  }
  lines.push('');

  // 3. Budget
  lines.push('## Budget');
  lines.push('| Period | Used | Limit | Status |');
  lines.push('|--------|------|-------|--------|');
  lines.push(`| Daily | EUR ${budget.daily.used.toFixed(2)} | EUR ${budget.daily.limit} | ${budget.status} |`);
  lines.push(`| Monthly | EUR ${budget.monthly.used.toFixed(2)} | EUR ${budget.monthly.limit} | ${budget.monthly.used >= budget.monthly.limit ? 'EXCEEDED' : 'OK'} |`);
  lines.push('');

  // 4. Recent decisions
  if (decisions.length > 0) {
    lines.push('## Recent Decisions');
    decisions.forEach(d => lines.push(`- **${d.id}** (${d.date}): ${d.title}`));
    lines.push('');
  }

  // 5. Quick actions
  lines.push('## Quick Actions');
  lines.push('```bash');
  lines.push('# View today\'s activity logs');
  lines.push('node squads/ops/scripts/activity-logger.mjs view --today');
  lines.push('');
  lines.push('# Log a manual action');
  lines.push('node squads/ops/scripts/log.mjs "Description of action"');
  lines.push('');
  lines.push('# Generate daily digest');
  lines.push('node squads/ops/scripts/daily-digest.mjs');
  lines.push('```');
  lines.push('');
  lines.push('---');
  lines.push('*Auto-generated by briefing.mjs | Zero cost*');

  return lines.join('\n');
}

// --- Main ---

const briefing = buildBriefing();

if (stdoutOnly) {
  console.log(briefing);
} else {
  const latestPath = path.join(BRIEFINGS_DIR, 'latest.md');
  const datedPath = path.join(BRIEFINGS_DIR, `${targetDate}.md`);

  fs.writeFileSync(latestPath, briefing, 'utf8');
  fs.writeFileSync(datedPath, briefing, 'utf8');

  console.log(`Briefing saved to:`);
  console.log(`  ${latestPath}`);
  console.log(`  ${datedPath}`);
  console.log('');
  console.log(briefing);
}
