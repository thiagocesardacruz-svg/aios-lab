#!/usr/bin/env node
/**
 * Cost Tracker - Deterministic token/cost tracking (NO AI needed)
 *
 * Tracks token usage and costs per task, agent, and squad
 * Updates command-center-data.json and syncs to ClickUp Goals
 *
 * Usage:
 *   node cost-tracker.mjs log <task_id> <input_tokens> <output_tokens> [--model=claude-opus-4]
 *   node cost-tracker.mjs report                          # Daily report
 *   node cost-tracker.mjs report --period=week            # Weekly report
 *   node cost-tracker.mjs by-agent                        # Usage by agent
 *   node cost-tracker.mjs by-squad                        # Usage by squad
 *   node cost-tracker.mjs sync-goals                      # Sync to ClickUp Goals
 *
 * Cost: €0 (deterministic, no AI)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../data/command-center-data.json');

// Token pricing (per 1k tokens)
const PRICING = {
  'claude-opus-4': { input: 0.015, output: 0.075 },
  'claude-opus-4-5': { input: 0.015, output: 0.075 },
  'claude-sonnet-4': { input: 0.003, output: 0.015 },
  'claude-sonnet-3-5': { input: 0.003, output: 0.015 },
  'claude-haiku-3-5': { input: 0.0008, output: 0.004 },
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'default': { input: 0.015, output: 0.075 }
};

// Budget limits
const LIMITS = {
  daily: { alert: 15, hard: 20 },
  monthly: { budget: 468 }
};

// ClickUp Goals API
const CLICKUP_API = 'https://api.clickup.com/api/v2';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';
const GOALS = {
  dailyBudget: '67c5d8a1-4c5c-44b7-be00-55f44c1f3d2a',
  monthlyBudget: '8c0323fc-cc20-4b1a-a1bf-cad8cd5c6d2b',
  tokenUsage: 'e08b9f5a-5e0e-49f1-a406-ba8f8e2fb3ec'
};

// Load data
function loadData() {
  if (!existsSync(DATA_PATH)) {
    return {
      tasks: {},
      dailyUsage: {},
      monthlyUsage: {},
      byAgent: {},
      bySquad: {},
      totals: { tokens: { input: 0, output: 0 }, cost: 0, tasks: 0 },
      lastUpdated: null
    };
  }
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
}

// Save data
function saveData(data) {
  data.lastUpdated = new Date().toISOString();
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// Calculate cost from tokens
function calculateCost(inputTokens, outputTokens, model = 'claude-opus-4') {
  const pricing = PRICING[model] || PRICING['default'];
  return (inputTokens / 1000 * pricing.input) + (outputTokens / 1000 * pricing.output);
}

// Get date keys
function getDateKeys(date = new Date()) {
  return {
    day: date.toISOString().split('T')[0],
    month: date.toISOString().slice(0, 7),
    week: getWeekKey(date)
  };
}

function getWeekKey(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

// Log token usage
function logUsage(taskId, inputTokens, outputTokens, options = {}) {
  const { model = 'claude-opus-4', agent = null, squad = null } = options;

  const data = loadData();
  const cost = calculateCost(inputTokens, outputTokens, model);
  const dates = getDateKeys();
  const timestamp = new Date().toISOString();

  const entry = {
    timestamp,
    inputTokens,
    outputTokens,
    cost,
    model,
    agent,
    squad
  };

  // Update task
  if (!data.tasks[taskId]) {
    data.tasks[taskId] = {
      created: timestamp,
      tokens: { input: 0, output: 0 },
      cost: 0,
      entries: []
    };
  }
  data.tasks[taskId].tokens.input += inputTokens;
  data.tasks[taskId].tokens.output += outputTokens;
  data.tasks[taskId].cost += cost;
  data.tasks[taskId].entries.push(entry);

  // Update daily
  if (!data.dailyUsage[dates.day]) {
    data.dailyUsage[dates.day] = { tokens: { input: 0, output: 0 }, cost: 0, tasks: [] };
  }
  data.dailyUsage[dates.day].tokens.input += inputTokens;
  data.dailyUsage[dates.day].tokens.output += outputTokens;
  data.dailyUsage[dates.day].cost += cost;
  if (!data.dailyUsage[dates.day].tasks.includes(taskId)) {
    data.dailyUsage[dates.day].tasks.push(taskId);
  }

  // Update monthly
  if (!data.monthlyUsage[dates.month]) {
    data.monthlyUsage[dates.month] = { tokens: { input: 0, output: 0 }, cost: 0, tasks: [] };
  }
  data.monthlyUsage[dates.month].tokens.input += inputTokens;
  data.monthlyUsage[dates.month].tokens.output += outputTokens;
  data.monthlyUsage[dates.month].cost += cost;
  if (!data.monthlyUsage[dates.month].tasks.includes(taskId)) {
    data.monthlyUsage[dates.month].tasks.push(taskId);
  }

  // Update by agent
  if (agent) {
    if (!data.byAgent) data.byAgent = {};
    if (!data.byAgent[agent]) {
      data.byAgent[agent] = { tokens: { input: 0, output: 0 }, cost: 0, tasks: 0 };
    }
    data.byAgent[agent].tokens.input += inputTokens;
    data.byAgent[agent].tokens.output += outputTokens;
    data.byAgent[agent].cost += cost;
    data.byAgent[agent].tasks++;
  }

  // Update by squad
  if (squad) {
    if (!data.bySquad) data.bySquad = {};
    if (!data.bySquad[squad]) {
      data.bySquad[squad] = { tokens: { input: 0, output: 0 }, cost: 0, tasks: 0 };
    }
    data.bySquad[squad].tokens.input += inputTokens;
    data.bySquad[squad].tokens.output += outputTokens;
    data.bySquad[squad].cost += cost;
    data.bySquad[squad].tasks++;
  }

  // Update totals
  data.totals.tokens.input += inputTokens;
  data.totals.tokens.output += outputTokens;
  data.totals.cost += cost;
  data.totals.tasks++;

  saveData(data);

  // Check limits
  const dailyCost = data.dailyUsage[dates.day].cost;
  const alerts = [];

  if (dailyCost >= LIMITS.daily.hard) {
    alerts.push({ level: 'critical', message: `🔴 DAILY LIMIT EXCEEDED: €${dailyCost.toFixed(2)}` });
  } else if (dailyCost >= LIMITS.daily.alert) {
    alerts.push({ level: 'warning', message: `🟡 Daily alert: €${dailyCost.toFixed(2)}` });
  }

  return {
    logged: {
      taskId,
      inputTokens,
      outputTokens,
      cost,
      model
    },
    daily: {
      cost: dailyCost,
      remaining: LIMITS.daily.hard - dailyCost
    },
    alerts
  };
}

// Generate report
function generateReport(period = 'today') {
  const data = loadData();
  const dates = getDateKeys();

  let usage;
  let periodLabel;

  switch (period) {
    case 'week':
      // Aggregate week data
      usage = { tokens: { input: 0, output: 0 }, cost: 0, tasks: [] };
      const weekStart = new Date(dates.week);
      for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        const key = d.toISOString().split('T')[0];
        if (data.dailyUsage[key]) {
          usage.tokens.input += data.dailyUsage[key].tokens.input;
          usage.tokens.output += data.dailyUsage[key].tokens.output;
          usage.cost += data.dailyUsage[key].cost;
          usage.tasks.push(...data.dailyUsage[key].tasks);
        }
      }
      periodLabel = `Week of ${dates.week}`;
      break;

    case 'month':
      usage = data.monthlyUsage[dates.month] || { tokens: { input: 0, output: 0 }, cost: 0, tasks: [] };
      periodLabel = `Month ${dates.month}`;
      break;

    default: // today
      usage = data.dailyUsage[dates.day] || { tokens: { input: 0, output: 0 }, cost: 0, tasks: [] };
      periodLabel = `Today (${dates.day})`;
  }

  return {
    period: periodLabel,
    tokens: usage.tokens,
    cost: usage.cost,
    taskCount: new Set(usage.tasks).size,
    limits: period === 'month'
      ? { budget: LIMITS.monthly.budget, used: (usage.cost / LIMITS.monthly.budget * 100).toFixed(1) + '%' }
      : { budget: LIMITS.daily.hard, used: (usage.cost / LIMITS.daily.hard * 100).toFixed(1) + '%' }
  };
}

// Report by agent
function reportByAgent() {
  const data = loadData();
  if (!data.byAgent || Object.keys(data.byAgent).length === 0) {
    return { agents: [], total: 0 };
  }

  const agents = Object.entries(data.byAgent)
    .map(([agent, stats]) => ({
      agent,
      ...stats,
      avgCostPerTask: stats.tasks > 0 ? stats.cost / stats.tasks : 0
    }))
    .sort((a, b) => b.cost - a.cost);

  return {
    agents,
    total: agents.reduce((sum, a) => sum + a.cost, 0)
  };
}

// Report by squad
function reportBySquad() {
  const data = loadData();
  if (!data.bySquad || Object.keys(data.bySquad).length === 0) {
    return { squads: [], total: 0 };
  }

  const squads = Object.entries(data.bySquad)
    .map(([squad, stats]) => ({
      squad,
      ...stats,
      avgCostPerTask: stats.tasks > 0 ? stats.cost / stats.tasks : 0
    }))
    .sort((a, b) => b.cost - a.cost);

  return {
    squads,
    total: squads.reduce((sum, s) => sum + s.cost, 0)
  };
}

// Sync to ClickUp Goals
async function syncGoals() {
  const data = loadData();
  const dates = getDateKeys();

  const daily = data.dailyUsage[dates.day] || { cost: 0, tokens: { input: 0, output: 0 } };
  const monthly = data.monthlyUsage[dates.month] || { cost: 0 };

  const results = [];

  // Update daily budget goal
  try {
    const dailyPercent = Math.min(100, (daily.cost / LIMITS.daily.hard) * 100);
    await fetch(`${CLICKUP_API}/goal/${GOALS.dailyBudget}/key_result`, {
      method: 'PUT',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ steps_current: Math.round(dailyPercent) })
    });
    results.push({ goal: 'dailyBudget', value: dailyPercent, status: 'synced' });
  } catch (e) {
    results.push({ goal: 'dailyBudget', error: e.message });
  }

  // Update monthly budget goal
  try {
    const monthlyPercent = Math.min(100, (monthly.cost / LIMITS.monthly.budget) * 100);
    await fetch(`${CLICKUP_API}/goal/${GOALS.monthlyBudget}/key_result`, {
      method: 'PUT',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ steps_current: Math.round(monthlyPercent) })
    });
    results.push({ goal: 'monthlyBudget', value: monthlyPercent, status: 'synced' });
  } catch (e) {
    results.push({ goal: 'monthlyBudget', error: e.message });
  }

  return results;
}

// Format markdown output
function formatMarkdown(report, type = 'report') {
  let output = `## 📊 Cost Report\n\n`;

  if (type === 'report') {
    output += `### ${report.period}\n\n`;
    output += `| Metric | Value |\n`;
    output += `|--------|-------|\n`;
    output += `| Input Tokens | ${(report.tokens.input / 1000).toFixed(1)}k |\n`;
    output += `| Output Tokens | ${(report.tokens.output / 1000).toFixed(1)}k |\n`;
    output += `| Cost | €${report.cost.toFixed(2)} |\n`;
    output += `| Tasks | ${report.taskCount} |\n`;
    output += `| Budget Used | ${report.limits.used} of €${report.limits.budget} |\n`;
  } else if (type === 'agent') {
    output += `### By Agent\n\n`;
    output += `| Agent | Cost | Tasks | Avg/Task |\n`;
    output += `|-------|------|-------|----------|\n`;
    report.agents.forEach(a => {
      output += `| ${a.agent} | €${a.cost.toFixed(2)} | ${a.tasks} | €${a.avgCostPerTask.toFixed(2)} |\n`;
    });
    output += `| **Total** | **€${report.total.toFixed(2)}** | | |\n`;
  } else if (type === 'squad') {
    output += `### By Squad\n\n`;
    output += `| Squad | Cost | Tasks | Avg/Task |\n`;
    output += `|-------|------|-------|----------|\n`;
    report.squads.forEach(s => {
      output += `| ${s.squad} | €${s.cost.toFixed(2)} | ${s.tasks} | €${s.avgCostPerTask.toFixed(2)} |\n`;
    });
    output += `| **Total** | **€${report.total.toFixed(2)}** | | |\n`;
  }

  return output;
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const format = args.find(a => a.startsWith('--format='))?.split('=')[1] || 'markdown';

  switch (command) {
    case 'log': {
      const taskId = args[1];
      const inputTokens = parseInt(args[2]) || 0;
      const outputTokens = parseInt(args[3]) || 0;
      const model = args.find(a => a.startsWith('--model='))?.split('=')[1] || 'claude-opus-4';
      const agent = args.find(a => a.startsWith('--agent='))?.split('=')[1];
      const squad = args.find(a => a.startsWith('--squad='))?.split('=')[1];

      if (!taskId) {
        console.error('Usage: node cost-tracker.mjs log <task_id> <input_tokens> <output_tokens>');
        process.exit(1);
      }

      const result = logUsage(taskId, inputTokens, outputTokens, { model, agent, squad });

      if (format === 'json') {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(`✅ Logged: ${inputTokens} in, ${outputTokens} out = €${result.logged.cost.toFixed(4)}`);
        console.log(`   Daily total: €${result.daily.cost.toFixed(2)} (€${result.daily.remaining.toFixed(2)} remaining)`);
        result.alerts.forEach(a => console.log(`   ${a.message}`));
      }
      break;
    }

    case 'report': {
      const period = args.find(a => a.startsWith('--period='))?.split('=')[1] || 'today';
      const report = generateReport(period);

      if (format === 'json') {
        console.log(JSON.stringify(report, null, 2));
      } else {
        console.log(formatMarkdown(report, 'report'));
      }
      break;
    }

    case 'by-agent': {
      const report = reportByAgent();
      if (format === 'json') {
        console.log(JSON.stringify(report, null, 2));
      } else {
        console.log(formatMarkdown(report, 'agent'));
      }
      break;
    }

    case 'by-squad': {
      const report = reportBySquad();
      if (format === 'json') {
        console.log(JSON.stringify(report, null, 2));
      } else {
        console.log(formatMarkdown(report, 'squad'));
      }
      break;
    }

    case 'sync-goals': {
      const results = await syncGoals();
      console.log(JSON.stringify(results, null, 2));
      break;
    }

    default:
      console.log(`
Cost Tracker - Token and cost tracking for AIOS

Commands:
  log <task_id> <input> <output>  Log token usage
      --model=claude-opus-4       Pricing model
      --agent=@dev                Agent attribution
      --squad=tech                Squad attribution

  report                          Daily cost report
      --period=today|week|month   Report period

  by-agent                        Usage breakdown by agent
  by-squad                        Usage breakdown by squad
  sync-goals                      Sync to ClickUp Goals

Options:
  --format=json|markdown          Output format

Examples:
  node cost-tracker.mjs log 86c86xyz 15000 3000 --model=claude-opus-4 --agent=@dev
  node cost-tracker.mjs report --period=month
  node cost-tracker.mjs by-agent --format=json
      `);
  }
}

main().catch(console.error);
