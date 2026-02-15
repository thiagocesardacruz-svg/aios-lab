#!/usr/bin/env node
/**
 * Value Stream Mapping — AIOS Quarterly Analysis
 *
 * Analyzes flow across squads/agents to identify waste:
 * - Handover frequency and time between agents
 * - "Rubber stamp" handovers (<5min = probably unnecessary)
 * - Squad throughput and cycle time distribution
 * - Recommendations to eliminate waste
 *
 * Usage:
 *   node value-stream-map.mjs                 # Full analysis
 *   node value-stream-map.mjs --days=90       # Last 90 days (quarter)
 *   node value-stream-map.mjs --format=json   # JSON output
 *
 * Cost: €0 (deterministic)
 * Schedule: Quarterly via cron
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = join(__dirname, '../../../.aios/reports/quarterly');

const CLICKUP_API = 'https://api.clickup.com/api/v2';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';
const TEAM_ID = '90152366829';

const FIELD_IDS = {
  AGENT: '743649c2-7132-4e65-9370-a161e7719949',
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

function extractField(task, fieldId) {
  const field = task.custom_fields?.find(f => f.id === fieldId);
  if (field?.value == null) return null;
  const opts = field.type_config?.options || [];
  const val = String(field.value);
  const opt = opts.find(o => o.id === val) || opts.find(o => String(o.orderindex) === val);
  return opt?.label || opt?.name || val;
}

function formatH(h) {
  if (h < 1) return `${Math.round(h * 60)}min`;
  if (h < 24) return `${Math.round(h * 10) / 10}h`;
  return `${Math.round(h / 24 * 10) / 10}d`;
}

// ── Analysis ────────────────────────────────────────────────────────────────

function analyzeValueStream(tasks, days) {
  const now = Date.now();
  const cutoff = days ? now - days * 24 * 60 * 60 * 1000 : 0;

  // Filter and enrich
  const enriched = tasks
    .filter(t => parseInt(t.date_updated) >= cutoff)
    .map(t => {
      const created = parseInt(t.date_created);
      const done = t.date_done ? parseInt(t.date_done) : parseInt(t.date_updated);
      const status = t.status?.status?.toLowerCase();
      return {
        id: t.id,
        name: t.name,
        status,
        agent: extractField(t, FIELD_IDS.AGENT) || 'unassigned',
        squad: extractField(t, FIELD_IDS.SQUAD) || 'unassigned',
        created,
        done: (status === 'done' || status === 'completed') ? done : null,
        cycle_hours: (status === 'done' || status === 'completed') ? (done - created) / 3600000 : null,
      };
    });

  // Squad metrics
  const squads = {};
  for (const t of enriched) {
    if (!squads[t.squad]) squads[t.squad] = { tasks: 0, completed: 0, total_ct: 0, agents: new Set() };
    squads[t.squad].tasks++;
    squads[t.squad].agents.add(t.agent);
    if (t.cycle_hours !== null) {
      squads[t.squad].completed++;
      squads[t.squad].total_ct += t.cycle_hours;
    }
  }

  // Agent flow (who hands off to whom — approximated by sequential task patterns)
  const agentLoad = {};
  for (const t of enriched) {
    if (!agentLoad[t.agent]) agentLoad[t.agent] = { tasks: 0, completed: 0, total_ct: 0, squads: new Set() };
    agentLoad[t.agent].tasks++;
    agentLoad[t.agent].squads.add(t.squad);
    if (t.cycle_hours !== null) {
      agentLoad[t.agent].completed++;
      agentLoad[t.agent].total_ct += t.cycle_hours;
    }
  }

  // Handover analysis (from handover-skips.log)
  let handoverSkips = 0;
  const skipPath = join(__dirname, '../../../.aios/logs/handover-skips.log');
  if (existsSync(skipPath)) {
    const content = readFileSync(skipPath, 'utf-8');
    handoverSkips = content.split('\n').filter(l => l.trim()).length;
  }

  // Fast-completion tasks (<5min = potential rubber stamp)
  const rubberStamps = enriched.filter(t => t.cycle_hours !== null && t.cycle_hours < 5 / 60);

  // Waste detection
  const waste = [];

  // 1. Agents in multiple squads (context switching)
  for (const [agent, data] of Object.entries(agentLoad)) {
    if (data.squads.size > 2) {
      waste.push({ type: 'context_switching', agent, squad_count: data.squads.size, detail: `${agent} works across ${data.squads.size} squads` });
    }
  }

  // 2. Squads with high cycle time
  for (const [squad, data] of Object.entries(squads)) {
    const avgCt = data.completed > 0 ? data.total_ct / data.completed : 0;
    if (avgCt > 24) {
      waste.push({ type: 'slow_squad', squad, avg_ct: Math.round(avgCt * 10) / 10, detail: `${squad} avg cycle time: ${formatH(avgCt)}` });
    }
  }

  // 3. Rubber stamp handovers
  if (rubberStamps.length > enriched.length * 0.3 && rubberStamps.length > 3) {
    waste.push({ type: 'rubber_stamps', count: rubberStamps.length, detail: `${rubberStamps.length} tasks completed in <5min — review if needed` });
  }

  return {
    period: days ? `${days} days` : 'all time',
    total_tasks: enriched.length,
    completed: enriched.filter(t => t.cycle_hours !== null).length,
    squads: Object.fromEntries(
      Object.entries(squads).map(([k, v]) => [k, {
        tasks: v.tasks,
        completed: v.completed,
        avg_ct: v.completed > 0 ? Math.round(v.total_ct / v.completed * 10) / 10 : 0,
        agents: v.agents.size,
      }])
    ),
    agents: Object.fromEntries(
      Object.entries(agentLoad).map(([k, v]) => [k, {
        tasks: v.tasks,
        completed: v.completed,
        avg_ct: v.completed > 0 ? Math.round(v.total_ct / v.completed * 10) / 10 : 0,
        squads: v.squads.size,
      }])
    ),
    rubber_stamps: rubberStamps.length,
    handover_skips: handoverSkips,
    waste,
  };
}

// ── Output ──────────────────────────────────────────────────────────────────

function formatMarkdown(vsm) {
  let out = `# 🗺️ Value Stream Map — AIOS (${vsm.period})\n\n`;
  out += `Generated: ${new Date().toISOString().split('T')[0]}\n\n`;

  // Overview
  out += `## Overview\n\n`;
  out += `| Metric | Value |\n|--------|-------|\n`;
  out += `| Total Tasks | ${vsm.total_tasks} |\n`;
  out += `| Completed | ${vsm.completed} |\n`;
  out += `| Rubber Stamps (<5min) | ${vsm.rubber_stamps} |\n`;
  out += `| Handover Skips | ${vsm.handover_skips} |\n`;
  out += `| Waste Items | ${vsm.waste.length} |\n\n`;

  // Squad flow
  const squadEntries = Object.entries(vsm.squads).sort((a, b) => b[1].tasks - a[1].tasks);
  out += `## Squad Flow\n\n`;
  out += `| Squad | Tasks | Completed | Avg CT | Agents |\n`;
  out += `|-------|-------|-----------|--------|--------|\n`;
  for (const [name, s] of squadEntries) {
    out += `| ${name} | ${s.tasks} | ${s.completed} | ${formatH(s.avg_ct)} | ${s.agents} |\n`;
  }
  out += `\n`;

  // Agent distribution
  const agentEntries = Object.entries(vsm.agents).sort((a, b) => b[1].tasks - a[1].tasks);
  out += `## Agent Load Distribution\n\n`;
  out += `| Agent | Tasks | Completed | Avg CT | Squads |\n`;
  out += `|-------|-------|-----------|--------|--------|\n`;
  for (const [name, a] of agentEntries) {
    const flag = a.squads > 2 ? ' ⚠️' : '';
    out += `| ${name}${flag} | ${a.tasks} | ${a.completed} | ${formatH(a.avg_ct)} | ${a.squads} |\n`;
  }
  out += `\n`;

  // Waste
  if (vsm.waste.length > 0) {
    out += `## 🗑️ Waste Detected\n\n`;
    for (const w of vsm.waste) {
      out += `- **${w.type}:** ${w.detail}\n`;
    }
    out += `\n`;
  }

  // Recommendations
  out += `## 🎯 Recommendations\n\n`;
  if (vsm.waste.length === 0) {
    out += `✅ No significant waste detected. Process is lean.\n`;
  } else {
    for (const w of vsm.waste) {
      if (w.type === 'context_switching') out += `- Reduce context switching: dedicate **${w.agent}** to fewer squads\n`;
      if (w.type === 'slow_squad') out += `- Investigate **${w.squad}** bottleneck (avg CT: ${formatH(w.avg_ct)})\n`;
      if (w.type === 'rubber_stamps') out += `- Review ${w.count} rubber-stamp tasks — automate or eliminate if no value\n`;
    }
  }
  out += `\n---\n_Cost: €0 | Deterministic analysis_\n`;

  return out;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const daysArg = args.find(a => a.startsWith('--days='));
  const days = daysArg ? parseInt(daysArg.split('=')[1]) : 90;
  const format = args.find(a => a.startsWith('--format='))?.split('=')[1] || 'markdown';

  const tasks = await fetchAllTasks();
  const vsm = analyzeValueStream(tasks, days);

  if (format === 'json') {
    console.log(JSON.stringify({ generated: new Date().toISOString(), ...vsm }, null, 2));
  } else {
    const report = formatMarkdown(vsm);
    console.log(report);

    if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true });
    const quarter = `Q${Math.ceil((new Date().getMonth() + 1) / 3)}`;
    const filepath = join(REPORTS_DIR, `${new Date().getFullYear()}-${quarter}.md`);
    writeFileSync(filepath, report);
    console.error(`\nSaved: ${filepath}`);
  }
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
