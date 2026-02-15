#!/usr/bin/env node
/**
 * Weekly Kaizen Report — AIOS Continuous Improvement
 *
 * Generates weekly report comparing this week vs last week.
 * Identifies trends, outliers, bottlenecks, and suggests 1 improvement.
 *
 * Usage:
 *   node weekly-report.mjs                # Current week report
 *   node weekly-report.mjs --format=json  # JSON output
 *   node weekly-report.mjs --slack        # Format for Slack posting
 *
 * Cost: €0 (deterministic, no AI)
 * Schedule: Cron — Sunday 20:00 via Clawdbot
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = join(__dirname, '../../../.aios/reports/weekly');

const CLICKUP_API = 'https://api.clickup.com/api/v2';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';
const TEAM_ID = '90152366829';
const AI_OPS_SPACE_ID = '901510017091';

const PROJECT_MAP = {
  'traveltech': ['c9002fea-faca-485c-a10d-fe38431c1d72'],
  'framework': ['457e8721-7ebb-4e7a-86ef-6dedd4a9478f', '27ce6720-2e51-4d6d-b268-c5a42a780778', 'dc12ad34-2546-460f-b418-f461d7f2d15b', 'f678e62b-1e9f-4831-be10-7a47400d5bca']
};

const PROJECT_LABELS = { 'traveltech': 'TravelTech', 'framework': 'AIOS Framework' };

const FIELD_IDS = {
  AGENT: '743649c2-7132-4e65-9370-a161e7719949',
  PROJECT_GOAL: '66da50fb-4e96-4f2b-bdb2-4180e807699b',
  SQUAD: 'fee999cb-cfbe-4c06-a806-77b71da75f40',
};

// ── API ──────────────────────────────────────────────────────────────────────

async function api(endpoint) {
  const res = await fetch(`${CLICKUP_API}${endpoint}`, {
    headers: { 'Authorization': API_KEY }
  });
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

async function fetchAllTasks() {
  const data = await api(`/team/${TEAM_ID}/task?include_closed=true&subtasks=true&order_by=updated&reverse=true`);
  return data.tasks || [];
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function extractField(task, fieldId) {
  const field = task.custom_fields?.find(f => f.id === fieldId);
  if (field?.value == null) return null;
  const opts = field.type_config?.options || [];
  const val = String(field.value);
  const opt = opts.find(o => o.id === val) || opts.find(o => String(o.orderindex) === val);
  return opt?.label || opt?.name || val;
}

function msToHours(ms) { return ms / (1000 * 60 * 60); }

function formatH(h) {
  if (h < 1) return `${Math.round(h * 60)}min`;
  if (h < 24) return `${Math.round(h * 10) / 10}h`;
  return `${Math.round(h / 24 * 10) / 10}d`;
}

function getWeekBounds(weeksAgo = 0) {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diff = day === 0 ? 6 : day - 1; // Monday start
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff - (weeksAgo * 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday.getTime(), end: sunday.getTime() };
}

function weekLabel(weeksAgo = 0) {
  const { start } = getWeekBounds(weeksAgo);
  const d = new Date(start);
  const year = d.getFullYear();
  const oneJan = new Date(year, 0, 1);
  const weekNum = Math.ceil(((d - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
  return `${year}-W${String(weekNum).padStart(2, '0')}`;
}

// ── Analysis ────────────────────────────────────────────────────────────────

function analyzeWeek(tasks, bounds) {
  const completed = [];
  const wip = [];
  const waiting = [];

  for (const t of tasks) {
    const status = t.status?.status?.toLowerCase();
    const created = parseInt(t.date_created);
    const done = t.date_done ? parseInt(t.date_done) : parseInt(t.date_updated);

    if ((status === 'done' || status === 'completed' || status === 'closed') && done >= bounds.start && done <= bounds.end) {
      const ct = msToHours(done - created);
      completed.push({
        id: t.id, name: t.name, cycle_hours: ct,
        agent: extractField(t, FIELD_IDS.AGENT) || 'unknown',
        squad: extractField(t, FIELD_IDS.SQUAD) || 'unknown',
      });
    } else if (status === 'in progress') {
      wip.push({ id: t.id, name: t.name, agent: extractField(t, FIELD_IDS.AGENT) || 'unknown', elapsed: msToHours(Date.now() - created) });
    } else if (status === 'waiting') {
      waiting.push({ id: t.id, name: t.name, elapsed: msToHours(Date.now() - created) });
    }
  }

  const cycleTimes = completed.map(t => t.cycle_hours);
  const avg = cycleTimes.length ? cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length : 0;
  const sorted = [...cycleTimes].sort((a, b) => a - b);
  const p90 = sorted.length ? sorted[Math.ceil(sorted.length * 0.9) - 1] : 0;
  const sd = cycleTimes.length > 1
    ? Math.sqrt(cycleTimes.reduce((s, v) => s + (v - avg) ** 2, 0) / (cycleTimes.length - 1))
    : 0;

  // Top waiting (bottleneck humano)
  const topWaiting = waiting.sort((a, b) => b.elapsed - a.elapsed).slice(0, 3);

  // Outliers
  const threshold = avg + 2 * sd;
  const outliers = sd > 0 ? completed.filter(t => t.cycle_hours > threshold) : [];

  // By agent
  const byAgent = {};
  for (const t of completed) {
    if (!byAgent[t.agent]) byAgent[t.agent] = { count: 0, totalCt: 0 };
    byAgent[t.agent].count++;
    byAgent[t.agent].totalCt += t.cycle_hours;
  }

  return {
    completed: completed.length,
    wip: wip.length,
    waiting: waiting.length,
    avg_ct: Math.round(avg * 10) / 10,
    p90_ct: Math.round(p90 * 10) / 10,
    stddev: Math.round(sd * 10) / 10,
    outliers,
    top_waiting: topWaiting,
    by_agent: byAgent,
    wip_details: wip,
  };
}

// ── Kaizen Suggestions (deterministic rules) ────────────────────────────────

function generateSuggestions(thisWeek, lastWeek) {
  const suggestions = [];

  // Compare trends
  if (lastWeek) {
    if (thisWeek.avg_ct > lastWeek.avg_ct * 1.3)
      suggestions.push('📈 Cycle time increased >30%. Review task granularity — are tasks too large?');
    if (thisWeek.completed < lastWeek.completed * 0.7)
      suggestions.push('📉 Throughput dropped >30%. Check for blockers or resource constraints.');
    if (thisWeek.wip > lastWeek.wip + 2)
      suggestions.push('🔄 WIP growing. Finish existing tasks before starting new ones.');
  }

  // Absolute checks
  if (thisWeek.avg_ct > 24)
    suggestions.push('⏱️ Avg cycle time >24h. Break tasks into smaller units.');
  if (thisWeek.wip >= 5)
    suggestions.push('🚫 WIP at limit (5). Apply Theory of Constraints — clear bottleneck first.');
  if (thisWeek.waiting > 3)
    suggestions.push('⏸️ Multiple tasks awaiting human. Schedule review block to clear queue.');
  if (thisWeek.outliers.length > 0)
    suggestions.push(`🔍 ${thisWeek.outliers.length} outlier(s) detected. Investigate root cause.`);
  if (thisWeek.stddev > thisWeek.avg_ct)
    suggestions.push('📊 High variability (σ > mean). Process unstable — standardize task types.');

  // Default positive
  if (suggestions.length === 0)
    suggestions.push('✅ Process stable. Consider raising the bar — reduce cycle time target.');

  return suggestions;
}

// ── Output ──────────────────────────────────────────────────────────────────

function formatMarkdown(thisWeek, lastWeek, suggestions) {
  const trend = (curr, prev) => {
    if (!prev || prev === 0) return '';
    const pct = Math.round(((curr - prev) / prev) * 100);
    if (pct > 10) return ` (↑${pct}%)`;
    if (pct < -10) return ` (↓${Math.abs(pct)}%)`;
    return ` (→)`;
  };

  let out = `# 📊 Weekly Kaizen Report — ${weekLabel(0)}\n\n`;
  out += `Generated: ${new Date().toISOString().split('T')[0]}\n\n`;

  // Summary
  out += `## Summary\n\n`;
  out += `| Metric | This Week | Last Week | Trend |\n`;
  out += `|--------|-----------|-----------|-------|\n`;
  out += `| Tasks Completed | ${thisWeek.completed} | ${lastWeek?.completed ?? '—'} | ${trend(thisWeek.completed, lastWeek?.completed)} |\n`;
  out += `| Avg Cycle Time | ${formatH(thisWeek.avg_ct)} | ${lastWeek ? formatH(lastWeek.avg_ct) : '—'} | ${trend(thisWeek.avg_ct, lastWeek?.avg_ct)} |\n`;
  out += `| P90 Cycle Time | ${formatH(thisWeek.p90_ct)} | ${lastWeek ? formatH(lastWeek.p90_ct) : '—'} | ${trend(thisWeek.p90_ct, lastWeek?.p90_ct)} |\n`;
  out += `| Std Deviation | ${formatH(thisWeek.stddev)} | ${lastWeek ? formatH(lastWeek.stddev) : '—'} | |\n`;
  out += `| WIP | ${thisWeek.wip} | ${lastWeek?.wip ?? '—'} | |\n`;
  out += `| Awaiting Human | ${thisWeek.waiting} | ${lastWeek?.waiting ?? '—'} | |\n`;
  out += `| Outliers | ${thisWeek.outliers.length} | ${lastWeek?.outliers.length ?? '—'} | |\n\n`;

  // By agent
  const agents = Object.entries(thisWeek.by_agent).sort((a, b) => b[1].count - a[1].count);
  if (agents.length > 0) {
    out += `## By Agent\n\n`;
    out += `| Agent | Tasks | Avg CT |\n`;
    out += `|-------|-------|--------|\n`;
    for (const [name, stats] of agents) {
      out += `| ${name} | ${stats.count} | ${formatH(stats.totalCt / stats.count)} |\n`;
    }
    out += `\n`;
  }

  // Bottlenecks
  if (thisWeek.top_waiting.length > 0) {
    out += `## Bottlenecks (Awaiting Human)\n\n`;
    out += `| Task | Waiting |\n`;
    out += `|------|---------|\n`;
    for (const t of thisWeek.top_waiting) {
      out += `| ${t.name} | ${formatH(t.elapsed)} |\n`;
    }
    out += `\n`;
  }

  // Outliers
  if (thisWeek.outliers.length > 0) {
    out += `## Outliers (>2σ)\n\n`;
    for (const o of thisWeek.outliers) {
      out += `- **${o.name}** — ${formatH(o.cycle_hours)} (${o.agent})\n`;
    }
    out += `\n`;
  }

  // Kaizen suggestion
  out += `## 🎯 Kaizen — This Week's Improvement\n\n`;
  for (const s of suggestions) {
    out += `${s}\n`;
  }
  out += `\n---\n_Cost: €0 | Deterministic analysis | No AI used_\n`;

  return out;
}

function formatSlack(thisWeek, lastWeek, suggestions) {
  const trend = (curr, prev) => {
    if (!prev || prev === 0) return '';
    const pct = Math.round(((curr - prev) / prev) * 100);
    if (pct > 10) return ` ↑${pct}%`;
    if (pct < -10) return ` ↓${Math.abs(pct)}%`;
    return ` →`;
  };

  let out = `*📊 Weekly Kaizen — ${weekLabel(0)}*\n\n`;
  out += `*Completed:* ${thisWeek.completed}${trend(thisWeek.completed, lastWeek?.completed)} | `;
  out += `*Avg CT:* ${formatH(thisWeek.avg_ct)}${trend(thisWeek.avg_ct, lastWeek?.avg_ct)} | `;
  out += `*WIP:* ${thisWeek.wip} | `;
  out += `*Outliers:* ${thisWeek.outliers.length}\n\n`;

  if (suggestions.length > 0) {
    out += `*🎯 Kaizen:* ${suggestions[0]}\n`;
  }

  return out;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const format = args.find(a => a.startsWith('--format='))?.split('=')[1] || 'markdown';
  const isSlack = args.includes('--slack');

  const project = args.find(a => a.startsWith('--project='))?.split('=')[1] || null;
  const projectLabel = project ? (PROJECT_LABELS[project] || project) : 'All Projects';

  let tasks = await fetchAllTasks();

  // Filter by project
  if (project && project !== 'all') {
    const uuids = PROJECT_MAP[project];
    if (uuids) {
      tasks = tasks.filter(t => {
        const pf = t.custom_fields?.find(f => f.id === FIELD_IDS.PROJECT_GOAL);
        return pf?.value && uuids.includes(pf.value);
      });
    }
  }

  const thisWeekBounds = getWeekBounds(0);
  const lastWeekBounds = getWeekBounds(1);

  const thisWeek = analyzeWeek(tasks, thisWeekBounds);
  const lastWeek = analyzeWeek(tasks, lastWeekBounds);
  const suggestions = generateSuggestions(thisWeek, lastWeek);

  if (format === 'json') {
    console.log(JSON.stringify({
      generated: new Date().toISOString(),
      week: weekLabel(0),
      this_week: thisWeek,
      last_week: lastWeek,
      suggestions,
    }, null, 2));
  } else if (isSlack) {
    console.log(formatSlack(thisWeek, lastWeek, suggestions));
  } else {
    const report = formatMarkdown(thisWeek, lastWeek, suggestions);
    console.log(report);

    // Save to file
    if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true });
    const filepath = join(REPORTS_DIR, `${weekLabel(0)}.md`);
    writeFileSync(filepath, report);
    console.error(`\nSaved: ${filepath}`);
  }
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
