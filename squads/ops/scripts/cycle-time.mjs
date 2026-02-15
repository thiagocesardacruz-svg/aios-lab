#!/usr/bin/env node
/**
 * Cycle Time Tracking - Statistical Process Control for AIOS
 *
 * Fetches completed tasks from ClickUp, calculates cycle time metrics,
 * groups by agent/squad, detects outliers (>2σ).
 *
 * Usage:
 *   node cycle-time.mjs                    # Full report
 *   node cycle-time.mjs --by=agent         # Group by agent
 *   node cycle-time.mjs --by=squad         # Group by squad
 *   node cycle-time.mjs --days=7           # Last N days only
 *   node cycle-time.mjs --format=json      # JSON output
 *
 * Cost: €0 (deterministic, no AI)
 */

const CLICKUP_API = 'https://api.clickup.com/api/v2';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';
const TEAM_ID = '90152366829';

// Custom field IDs
const FIELD_IDS = {
  AGENT: '743649c2-7132-4e65-9370-a161e7719949',
  SQUAD: 'fee999cb-cfbe-4c06-a806-77b71da75f40',
  PROJECT_GOAL: '66da50fb-4e96-4f2b-bdb2-4180e807699b'
};

// Project key → ClickUp option UUID(s)
const PROJECT_MAP = {
  'traveltech': ['c9002fea-faca-485c-a10d-fe38431c1d72'],
  'framework': ['457e8721-7ebb-4e7a-86ef-6dedd4a9478f', '27ce6720-2e51-4d6d-b268-c5a42a780778', 'dc12ad34-2546-460f-b418-f461d7f2d15b', 'f678e62b-1e9f-4831-be10-7a47400d5bca']
};

// Targets
const TARGETS = {
  cycle_time: 24,    // hours
  lead_time: 48,     // hours
  wip_limit: 5,      // count
  outliers: 0        // count
};

// --- API ---

async function api(endpoint) {
  const response = await fetch(`${CLICKUP_API}${endpoint}`, {
    headers: { 'Authorization': API_KEY }
  });
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

async function fetchAllTasks() {
  const data = await api(`/team/${TEAM_ID}/task?include_closed=true&subtasks=true&order_by=updated&reverse=true`);
  return data.tasks || [];
}

// --- Helpers ---

function extractCustomField(task, fieldId) {
  const field = task.custom_fields?.find(f => f.id === fieldId);
  if (field?.value == null) return null;
  const opts = field.type_config?.options || [];
  const val = String(field.value);
  // Match by UUID first, then by orderindex
  const opt = opts.find(o => o.id === val) || opts.find(o => String(o.orderindex) === val);
  return opt?.label || opt?.name || val;
}

function msToHours(ms) {
  return ms / (1000 * 60 * 60);
}

function formatHours(h) {
  if (h < 1) return `${Math.round(h * 60)}min`;
  if (h < 24) return `${Math.round(h * 10) / 10}h`;
  const days = Math.floor(h / 24);
  const rem = Math.round((h % 24) * 10) / 10;
  return `${days}d ${rem}h`;
}

function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function mean(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function stddev(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const variance = arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

function statusIcon(value, target, inverse = false) {
  if (target === undefined) return '—';
  if (inverse) return value <= target ? '✅' : value <= target * 1.5 ? '⚠️' : '🔴';
  return value <= target ? '✅' : value <= target * 1.5 ? '⚠️' : '🔴';
}

// --- Core Analysis ---

function analyzeTaskSet(tasks) {
  const completed = tasks.filter(t => {
    const s = t.status?.status?.toLowerCase();
    return s === 'done' || s === 'completed' || s === 'closed';
  });

  const inProgress = tasks.filter(t => {
    const s = t.status?.status?.toLowerCase();
    return s === 'in progress';
  });

  // Calculate cycle times (hours)
  const cycleTimes = completed
    .map(t => {
      const created = parseInt(t.date_created);
      const done = t.date_done ? parseInt(t.date_done) : parseInt(t.date_updated);
      if (!created || !done) return null;
      return msToHours(done - created);
    })
    .filter(ct => ct !== null && ct > 0);

  const sorted = [...cycleTimes].sort((a, b) => a - b);
  const avg = mean(cycleTimes);
  const sd = stddev(cycleTimes);
  const outlierThreshold = avg + 2 * sd;
  const outliers = cycleTimes.filter(ct => ct > outlierThreshold);

  return {
    total_tasks: tasks.length,
    completed_count: completed.length,
    wip_count: inProgress.length,
    avg_cycle_time: Math.round(avg * 10) / 10,
    p50: Math.round(percentile(sorted, 50) * 10) / 10,
    p90: Math.round(percentile(sorted, 90) * 10) / 10,
    min: sorted.length > 0 ? Math.round(sorted[0] * 10) / 10 : 0,
    max: sorted.length > 0 ? Math.round(sorted[sorted.length - 1] * 10) / 10 : 0,
    stddev: Math.round(sd * 10) / 10,
    outlier_count: outliers.length,
    outlier_threshold: Math.round(outlierThreshold * 10) / 10,
    throughput: completed.length,
    raw_cycle_times: cycleTimes,
    outlier_tasks: completed.filter(t => {
      const created = parseInt(t.date_created);
      const done = t.date_done ? parseInt(t.date_done) : parseInt(t.date_updated);
      const ct = msToHours(done - created);
      return ct > outlierThreshold;
    }).map(t => ({ id: t.id, name: t.name, hours: Math.round(msToHours((t.date_done ? parseInt(t.date_done) : parseInt(t.date_updated)) - parseInt(t.date_created)) * 10) / 10 }))
  };
}

function groupBy(tasks, field) {
  const groups = {};
  for (const task of tasks) {
    let key;
    if (field === 'agent') {
      key = extractCustomField(task, FIELD_IDS.AGENT) || 'unassigned';
    } else if (field === 'squad') {
      key = extractCustomField(task, FIELD_IDS.SQUAD) || 'unassigned';
    } else {
      key = 'all';
    }
    if (!groups[key]) groups[key] = [];
    groups[key].push(task);
  }
  return groups;
}

// --- Output ---

function renderMarkdown(analysis, groupedAnalysis, options) {
  const lines = [];
  const days = options.days || 'all';

  lines.push(`📊 **AIOS Cycle Time Report** — ${days === 'all' ? 'All time' : `Last ${days} days`}`);
  lines.push(`Generated: ${new Date().toISOString().split('T')[0]}`);
  lines.push('');

  // Summary table
  lines.push('## Summary');
  lines.push('');
  lines.push('| Metric | Value | Target | Status |');
  lines.push('|--------|-------|--------|--------|');
  lines.push(`| Avg Cycle Time | ${formatHours(analysis.avg_cycle_time)} | <${TARGETS.cycle_time}h | ${statusIcon(analysis.avg_cycle_time, TARGETS.cycle_time)} |`);
  lines.push(`| P50 Cycle Time | ${formatHours(analysis.p50)} | — | — |`);
  lines.push(`| P90 Cycle Time | ${formatHours(analysis.p90)} | — | — |`);
  lines.push(`| Std Deviation | ${formatHours(analysis.stddev)} | — | — |`);
  lines.push(`| Min / Max | ${formatHours(analysis.min)} / ${formatHours(analysis.max)} | — | — |`);
  lines.push(`| WIP Count | ${analysis.wip_count} | <${TARGETS.wip_limit} | ${statusIcon(analysis.wip_count, TARGETS.wip_limit)} |`);
  lines.push(`| Throughput | ${analysis.throughput} tasks | — | — |`);
  lines.push(`| Outliers (>2σ) | ${analysis.outlier_count} | ${TARGETS.outliers} | ${statusIcon(analysis.outlier_count, TARGETS.outliers)} |`);
  lines.push('');

  // Grouped breakdown
  if (groupedAnalysis && Object.keys(groupedAnalysis).length > 1) {
    const groupLabel = options.by === 'agent' ? 'Agent' : options.by === 'squad' ? 'Squad' : 'Group';
    lines.push(`## By ${groupLabel}`);
    lines.push('');
    lines.push(`| ${groupLabel} | Avg CT | P90 | Tasks | WIP | Outliers |`);
    lines.push('|--------|--------|-----|-------|-----|----------|');

    const entries = Object.entries(groupedAnalysis)
      .sort((a, b) => b[1].completed_count - a[1].completed_count);

    for (const [key, stats] of entries) {
      lines.push(`| ${key} | ${formatHours(stats.avg_cycle_time)} | ${formatHours(stats.p90)} | ${stats.completed_count} | ${stats.wip_count} | ${stats.outlier_count} |`);
    }
    lines.push('');
  }

  // Outlier details
  if (analysis.outlier_tasks.length > 0) {
    lines.push('## Outliers (>2σ)');
    lines.push('');
    lines.push('| Task | Cycle Time | Threshold |');
    lines.push('|------|------------|-----------|');
    for (const t of analysis.outlier_tasks) {
      lines.push(`| ${t.name} | ${formatHours(t.hours)} | >${formatHours(analysis.outlier_threshold)} |`);
    }
    lines.push('');
  }

  // Bottleneck detection (Theory of Constraints)
  if (options.bottleneck && groupedAnalysis) {
    lines.push('## 🔍 Bottleneck Analysis (Theory of Constraints)');
    lines.push('');
    const entries = Object.entries(groupedAnalysis)
      .filter(([_, s]) => s.completed_count > 0 || s.wip_count > 0);

    // Constraint = highest P90 with activity
    const sorted = entries.sort((a, b) => b[1].p90 - a[1].p90);
    if (sorted.length > 0) {
      const [name, stats] = sorted[0];
      lines.push(`**Constraint:** ${name} — P90 cycle time: ${formatHours(stats.p90)}`);
      lines.push('');
      if (stats.wip_count > 0) lines.push(`- ${stats.wip_count} task(s) currently in progress`);
      if (stats.p90 > TARGETS.cycle_time) lines.push(`- P90 exceeds target (${formatHours(stats.p90)} > ${TARGETS.cycle_time}h)`);
      if (stats.outlier_count > 0) lines.push(`- ${stats.outlier_count} outlier(s) — investigate complexity`);
      lines.push('');
      lines.push('**Recommendation:** Focus improvement efforts here. Subordinate other squads/agents to unblock this constraint.');
    }
    lines.push('');
  }

  // SPC insight
  lines.push('## SPC Insight');
  lines.push('');
  if (analysis.stddev > analysis.avg_cycle_time) {
    lines.push('⚠️ **High variability** — Std deviation exceeds mean. Process is unstable.');
  } else if (analysis.outlier_count > 0) {
    lines.push('⚠️ **Special cause variation detected** — Outliers found. Investigate root cause.');
  } else if (analysis.avg_cycle_time <= TARGETS.cycle_time) {
    lines.push('✅ **Process stable** — Cycle time within target, no outliers.');
  } else {
    lines.push('⚠️ **Cycle time above target** — Process is stable but slow. Consider constraint analysis.');
  }

  return lines.join('\n');
}

// --- Main ---

async function main() {
  const args = process.argv.slice(2);
  const options = {};

  for (const arg of args) {
    const [key, value] = arg.replace('--', '').split('=');
    options[key] = value || true;
  }

  // Fetch tasks
  const allTasks = await fetchAllTasks();

  if (allTasks.length === 0) {
    console.log('No tasks found in ClickUp.');
    process.exit(0);
  }

  // Filter by project
  let tasks = allTasks;
  if (options.project && options.project !== 'all') {
    const uuids = PROJECT_MAP[options.project];
    if (uuids) {
      tasks = tasks.filter(t => {
        const pf = t.custom_fields?.find(f => f.id === FIELD_IDS.PROJECT_GOAL);
        return pf?.value && uuids.includes(pf.value);
      });
    }
  }

  // Filter by days
  if (options.days) {
    const cutoff = Date.now() - (parseInt(options.days) * 24 * 60 * 60 * 1000);
    tasks = allTasks.filter(t => parseInt(t.date_created) >= cutoff || parseInt(t.date_updated) >= cutoff);
  }

  // Overall analysis
  const analysis = analyzeTaskSet(tasks);

  // Grouped analysis
  let groupedAnalysis = null;
  if (options.by) {
    const groups = groupBy(tasks, options.by);
    groupedAnalysis = {};
    for (const [key, groupTasks] of Object.entries(groups)) {
      groupedAnalysis[key] = analyzeTaskSet(groupTasks);
    }
  }

  // Output
  if (options.format === 'json') {
    const output = {
      generated: new Date().toISOString(),
      period: options.days ? `last_${options.days}_days` : 'all_time',
      summary: analysis,
      ...(groupedAnalysis && { [`by_${options.by}`]: groupedAnalysis })
    };
    // Remove raw data from JSON output
    delete output.summary.raw_cycle_times;
    delete output.summary.outlier_tasks;
    if (groupedAnalysis) {
      for (const stats of Object.values(output[`by_${options.by}`])) {
        delete stats.raw_cycle_times;
        delete stats.outlier_tasks;
      }
    }
    console.log(JSON.stringify(output, null, 2));
  } else {
    console.log(renderMarkdown(analysis, groupedAnalysis, options));
  }
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
