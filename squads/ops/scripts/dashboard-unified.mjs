#!/usr/bin/env node
/**
 * Unified Dashboard — AIOS "3-Second" Metrics
 *
 * Combines 5 key metrics from existing scripts into one view.
 * Board recommendation: "5 metrics, dashboard of 3 seconds" — Steve Jobs
 *
 * Usage:
 *   node dashboard-unified.mjs              # Full dashboard
 *   node dashboard-unified.mjs --format=json # JSON output
 *
 * Cost: €0 (deterministic)
 */

import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CLICKUP_API = 'https://api.clickup.com/api/v2';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';
const TEAM_ID = '90152366829';
const AI_OPS_SPACE_ID = '901510017091';

const FIELD_IDS = {
  AGENT: '743649c2-7132-4e65-9370-a161e7719949',
  PROJECT_GOAL: '66da50fb-4e96-4f2b-bdb2-4180e807699b',
};

const PROJECT_MAP = {
  'traveltech': ['c9002fea-faca-485c-a10d-fe38431c1d72'],
  'framework': ['457e8721-7ebb-4e7a-86ef-6dedd4a9478f', '27ce6720-2e51-4d6d-b268-c5a42a780778', 'dc12ad34-2546-460f-b418-f461d7f2d15b', 'f678e62b-1e9f-4831-be10-7a47400d5bca']
};

const PROJECT_LABELS = { 'traveltech': 'TravelTech', 'framework': 'AIOS Framework' };

const TARGETS = {
  cycle_time: 24,     // hours
  wip: 5,             // count
  daily_budget: 20,   // EUR
  monthly_budget: 468,// EUR
  outliers: 0,
};

// ── API ──────────────────────────────────────────────────────────────────────

async function api(endpoint) {
  const res = await fetch(`${CLICKUP_API}${endpoint}`, {
    headers: { 'Authorization': API_KEY }
  });
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

// ── Data Collection ─────────────────────────────────────────────────────────

async function collectMetrics(projectFilter = null) {
  // 1. Fetch tasks
  const data = await api(`/team/${TEAM_ID}/task?include_closed=true&subtasks=true&order_by=updated&reverse=true`);
  let tasks = data.tasks || [];

  // Filter by project
  if (projectFilter && projectFilter !== 'all') {
    const uuids = PROJECT_MAP[projectFilter];
    if (uuids) {
      tasks = tasks.filter(t => {
        const pf = t.custom_fields?.find(f => f.id === FIELD_IDS.PROJECT_GOAL);
        return pf?.value && uuids.includes(pf.value);
      });
    }
  }

  // 2. Cycle Time
  const completed = tasks.filter(t => {
    const s = t.status?.status?.toLowerCase();
    return s === 'done' || s === 'completed' || s === 'closed';
  });

  const cycleTimes = completed.map(t => {
    const created = parseInt(t.date_created);
    const done = t.date_done ? parseInt(t.date_done) : parseInt(t.date_updated);
    return (done - created) / (1000 * 60 * 60);
  }).filter(ct => ct > 0);

  const avgCt = cycleTimes.length ? cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length : 0;
  const sd = cycleTimes.length > 1
    ? Math.sqrt(cycleTimes.reduce((s, v) => s + (v - avgCt) ** 2, 0) / (cycleTimes.length - 1))
    : 0;
  const outlierCount = sd > 0 ? cycleTimes.filter(ct => ct > avgCt + 2 * sd).length : 0;

  // 3. WIP
  const wip = tasks.filter(t => t.status?.status?.toLowerCase() === 'in progress');

  // 4. Budget
  let dailyCost = 0;
  let monthlyCost = 0;
  const ccPath = join(__dirname, '../data/command-center-data.json');
  if (existsSync(ccPath)) {
    try {
      const cc = JSON.parse(readFileSync(ccPath, 'utf-8'));
      const today = new Date().toISOString().split('T')[0];
      dailyCost = cc.dailyUsage?.[today]?.cost || 0;

      const monthKey = today.substring(0, 7);
      monthlyCost = cc.monthlyUsage?.[monthKey]?.cost || 0;
    } catch {}
  }

  // 5. Handover failures
  let handoverSkips = 0;
  const handoverPath = join(__dirname, '../../../.aios/logs/handover-skips.log');
  if (existsSync(handoverPath)) {
    try {
      const content = readFileSync(handoverPath, 'utf-8');
      handoverSkips = content.split('\n').filter(l => l.trim()).length;
    } catch {}
  }

  // 6. Error rate (from activity logs)
  let errorCount = 0;
  let totalLogs = 0;
  const today = new Date().toISOString().split('T')[0];
  const logPath = join(__dirname, '../../../.aios/logs/activity', `${today}.jsonl`);
  if (existsSync(logPath)) {
    try {
      const lines = readFileSync(logPath, 'utf-8').split('\n').filter(l => l.trim());
      totalLogs = lines.length;
      errorCount = lines.filter(l => {
        try { return JSON.parse(l).type === 'error'; } catch { return false; }
      }).length;
    } catch {}
  }

  return {
    cycle_time: Math.round(avgCt * 10) / 10,
    wip_count: wip.length,
    daily_budget: Math.round(dailyCost * 100) / 100,
    monthly_budget: Math.round(monthlyCost * 100) / 100,
    outliers: outlierCount,
    handover_skips: handoverSkips,
    error_count: errorCount,
    total_completed: completed.length,
    total_tasks: tasks.length,
  };
}

// ── Output ──────────────────────────────────────────────────────────────────

function icon(value, target, inverse = true) {
  if (inverse) {
    if (value <= target) return '🟢';
    if (value <= target * 1.5) return '🟡';
    return '🔴';
  }
  return '⚪';
}

function formatH(h) {
  if (h < 1) return `${Math.round(h * 60)}min`;
  if (h < 24) return `${Math.round(h * 10) / 10}h`;
  return `${Math.round(h / 24 * 10) / 10}d`;
}

function formatDashboard(m, projectLabel = 'All Projects') {
  let out = `\n`;
  out += `┌─────────────────────────────────────────────┐\n`;
  out += `│         📊 AIOS UNIFIED DASHBOARD           │\n`;
  out += `│         ${new Date().toISOString().split('T')[0]}  [${projectLabel.padEnd(16)}] │\n`;
  out += `├─────────────────────────────────────────────┤\n`;
  out += `│                                             │\n`;
  out += `│  ${icon(m.cycle_time, TARGETS.cycle_time)} Cycle Time    ${formatH(m.cycle_time).padEnd(8)} target: <${TARGETS.cycle_time}h  │\n`;
  out += `│  ${icon(m.wip_count, TARGETS.wip)} WIP Count     ${String(m.wip_count).padEnd(8)} target: <${TARGETS.wip}    │\n`;
  out += `│  ${icon(m.daily_budget, TARGETS.daily_budget)} Daily Budget  €${String(m.daily_budget).padEnd(7)} limit: €${TARGETS.daily_budget}  │\n`;
  out += `│  ${icon(m.monthly_budget, TARGETS.monthly_budget)} Monthly Cost  €${String(m.monthly_budget).padEnd(7)} limit: €${TARGETS.monthly_budget} │\n`;
  out += `│  ${icon(m.outliers, TARGETS.outliers)} Outliers      ${String(m.outliers).padEnd(8)} target: ${TARGETS.outliers}    │\n`;
  out += `│                                             │\n`;
  out += `├─────────────────────────────────────────────┤\n`;
  out += `│  Tasks: ${m.total_completed} done / ${m.total_tasks} total              │\n`;
  out += `│  Handover skips: ${m.handover_skips} | Errors today: ${m.error_count}     │\n`;
  out += `├─────────────────────────────────────────────┤\n`;

  // Overall health
  const greens = [
    m.cycle_time <= TARGETS.cycle_time,
    m.wip_count <= TARGETS.wip,
    m.daily_budget <= TARGETS.daily_budget,
    m.monthly_budget <= TARGETS.monthly_budget,
    m.outliers <= TARGETS.outliers,
  ].filter(Boolean).length;

  const health = greens >= 4 ? '🟢 HEALTHY' : greens >= 3 ? '🟡 WARNING' : '🔴 CRITICAL';
  out += `│  System Health: ${health}                   │\n`;
  out += `└─────────────────────────────────────────────┘\n`;
  out += `\n_€0 — deterministic | node dashboard-unified.mjs_\n`;

  return out;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const format = args.find(a => a.startsWith('--format='))?.split('=')[1];
  const project = args.find(a => a.startsWith('--project='))?.split('=')[1] || null;
  const projectLabel = project ? (PROJECT_LABELS[project] || project) : 'All Projects';

  const metrics = await collectMetrics(project);

  if (format === 'json') {
    console.log(JSON.stringify({ generated: new Date().toISOString(), project: project || 'all', ...metrics }, null, 2));
  } else {
    console.log(formatDashboard(metrics, projectLabel));
  }
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
