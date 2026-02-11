#!/usr/bin/env node
/**
 * AIOS Command Center
 *
 * Central hub for task management, cost tracking, and token usage.
 *
 * Usage:
 *   node command-center.mjs status                    # Show current status
 *   node command-center.mjs track <task_id> <tokens> <cost>  # Track usage
 *   node command-center.mjs report [daily|weekly|monthly]    # Generate report
 *   node command-center.mjs budget                    # Show budget status
 *   node command-center.mjs sync-clickup              # Sync costs to ClickUp
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '../data/command-center-data.json');

// Budget limits (from CLAUDE.md governance)
const BUDGET = {
  monthly: { limit: 400, currency: 'GBP', alertAt: 320 },  // £400, alert at 80%
  daily: { limit: 20, currency: 'EUR', alertAt: 15 },      // €20 hard, €15 alert
  perTask: { limit: 10, currency: 'EUR' }                   // €10 per task
};

// Token costs (approximate, Claude pricing)
const TOKEN_COSTS = {
  'claude-opus-4': { input: 0.015, output: 0.075 },      // per 1K tokens
  'claude-sonnet-4': { input: 0.003, output: 0.015 },
  'claude-haiku': { input: 0.00025, output: 0.00125 }
};

// Initialize or load data
function loadData() {
  if (existsSync(DATA_FILE)) {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  }
  return {
    tasks: {},
    dailyUsage: {},
    monthlyUsage: {},
    totals: {
      tokens: { input: 0, output: 0 },
      cost: 0,
      tasks: 0
    },
    lastUpdated: new Date().toISOString()
  };
}

function saveData(data) {
  data.lastUpdated = new Date().toISOString();
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Get today's date key
function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

// Get month key
function getMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Track usage for a task
function trackUsage(taskId, inputTokens, outputTokens, model = 'claude-opus-4') {
  const data = loadData();
  const today = getTodayKey();
  const month = getMonthKey();

  // Calculate cost
  const rates = TOKEN_COSTS[model] || TOKEN_COSTS['claude-opus-4'];
  const cost = (inputTokens / 1000 * rates.input) + (outputTokens / 1000 * rates.output);

  // Update task data
  if (!data.tasks[taskId]) {
    data.tasks[taskId] = {
      created: new Date().toISOString(),
      tokens: { input: 0, output: 0 },
      cost: 0,
      entries: []
    };
  }

  data.tasks[taskId].tokens.input += inputTokens;
  data.tasks[taskId].tokens.output += outputTokens;
  data.tasks[taskId].cost += cost;
  data.tasks[taskId].entries.push({
    timestamp: new Date().toISOString(),
    inputTokens,
    outputTokens,
    cost,
    model
  });

  // Update daily usage
  if (!data.dailyUsage[today]) {
    data.dailyUsage[today] = { tokens: { input: 0, output: 0 }, cost: 0, tasks: [] };
  }
  data.dailyUsage[today].tokens.input += inputTokens;
  data.dailyUsage[today].tokens.output += outputTokens;
  data.dailyUsage[today].cost += cost;
  if (!data.dailyUsage[today].tasks.includes(taskId)) {
    data.dailyUsage[today].tasks.push(taskId);
  }

  // Update monthly usage
  if (!data.monthlyUsage[month]) {
    data.monthlyUsage[month] = { tokens: { input: 0, output: 0 }, cost: 0, tasks: [] };
  }
  data.monthlyUsage[month].tokens.input += inputTokens;
  data.monthlyUsage[month].tokens.output += outputTokens;
  data.monthlyUsage[month].cost += cost;
  if (!data.monthlyUsage[month].tasks.includes(taskId)) {
    data.monthlyUsage[month].tasks.push(taskId);
  }

  // Update totals
  data.totals.tokens.input += inputTokens;
  data.totals.tokens.output += outputTokens;
  data.totals.cost += cost;

  saveData(data);

  // Check budget alerts
  const alerts = checkBudgetAlerts(data);

  return {
    taskId,
    added: { inputTokens, outputTokens, cost: cost.toFixed(4) },
    taskTotal: {
      tokens: data.tasks[taskId].tokens,
      cost: data.tasks[taskId].cost.toFixed(4)
    },
    dailyTotal: {
      cost: data.dailyUsage[today].cost.toFixed(4),
      remaining: (BUDGET.daily.limit - data.dailyUsage[today].cost).toFixed(2)
    },
    alerts
  };
}

// Check budget alerts
function checkBudgetAlerts(data) {
  const alerts = [];
  const today = getTodayKey();
  const month = getMonthKey();

  const dailyCost = data.dailyUsage[today]?.cost || 0;
  const monthlyCost = data.monthlyUsage[month]?.cost || 0;

  // Daily alerts
  if (dailyCost >= BUDGET.daily.limit) {
    alerts.push({ level: 'CRITICAL', message: `DAILY LIMIT REACHED: €${dailyCost.toFixed(2)} / €${BUDGET.daily.limit}` });
  } else if (dailyCost >= BUDGET.daily.alertAt) {
    alerts.push({ level: 'WARNING', message: `Daily spend high: €${dailyCost.toFixed(2)} / €${BUDGET.daily.limit}` });
  }

  // Monthly alerts (convert GBP to EUR approximately)
  const monthlyLimitEur = BUDGET.monthly.limit * 1.17; // ~€470
  if (monthlyCost >= monthlyLimitEur) {
    alerts.push({ level: 'CRITICAL', message: `MONTHLY LIMIT REACHED: €${monthlyCost.toFixed(2)} / €${monthlyLimitEur.toFixed(0)}` });
  } else if (monthlyCost >= BUDGET.monthly.alertAt * 1.17) {
    alerts.push({ level: 'WARNING', message: `Monthly spend at 80%: €${monthlyCost.toFixed(2)} / €${monthlyLimitEur.toFixed(0)}` });
  }

  return alerts;
}

// Get budget status
function getBudgetStatus() {
  const data = loadData();
  const today = getTodayKey();
  const month = getMonthKey();

  const dailyCost = data.dailyUsage[today]?.cost || 0;
  const monthlyCost = data.monthlyUsage[month]?.cost || 0;
  const monthlyLimitEur = BUDGET.monthly.limit * 1.17;

  return {
    daily: {
      spent: dailyCost.toFixed(2),
      limit: BUDGET.daily.limit,
      remaining: (BUDGET.daily.limit - dailyCost).toFixed(2),
      percentage: ((dailyCost / BUDGET.daily.limit) * 100).toFixed(1),
      status: dailyCost >= BUDGET.daily.limit ? 'BLOCKED' :
              dailyCost >= BUDGET.daily.alertAt ? 'WARNING' : 'OK'
    },
    monthly: {
      spent: monthlyCost.toFixed(2),
      limit: monthlyLimitEur.toFixed(0),
      remaining: (monthlyLimitEur - monthlyCost).toFixed(2),
      percentage: ((monthlyCost / monthlyLimitEur) * 100).toFixed(1),
      status: monthlyCost >= monthlyLimitEur ? 'BLOCKED' :
              monthlyCost >= BUDGET.monthly.alertAt * 1.17 ? 'WARNING' : 'OK'
    },
    perTask: {
      limit: BUDGET.perTask.limit,
      currency: 'EUR'
    }
  };
}

// Get current status
function getStatus() {
  const data = loadData();
  const today = getTodayKey();
  const month = getMonthKey();
  const budget = getBudgetStatus();

  const activeTasks = Object.entries(data.tasks)
    .filter(([_, t]) => t.entries.length > 0)
    .sort((a, b) => new Date(b[1].entries[b[1].entries.length - 1].timestamp) -
                    new Date(a[1].entries[a[1].entries.length - 1].timestamp))
    .slice(0, 5);

  return {
    timestamp: new Date().toISOString(),
    budget,
    today: {
      date: today,
      tokens: data.dailyUsage[today]?.tokens || { input: 0, output: 0 },
      cost: (data.dailyUsage[today]?.cost || 0).toFixed(4),
      taskCount: data.dailyUsage[today]?.tasks?.length || 0
    },
    month: {
      period: month,
      tokens: data.monthlyUsage[month]?.tokens || { input: 0, output: 0 },
      cost: (data.monthlyUsage[month]?.cost || 0).toFixed(4),
      taskCount: data.monthlyUsage[month]?.tasks?.length || 0
    },
    recentTasks: activeTasks.map(([id, t]) => ({
      id,
      cost: t.cost.toFixed(4),
      tokens: t.tokens.input + t.tokens.output
    })),
    totals: {
      tokens: data.totals.tokens,
      cost: data.totals.cost.toFixed(4),
      tasks: Object.keys(data.tasks).length
    }
  };
}

// Generate report
function generateReport(period = 'daily') {
  const data = loadData();
  const today = getTodayKey();
  const month = getMonthKey();

  let report = {
    generated: new Date().toISOString(),
    period,
    data: {}
  };

  switch (period) {
    case 'daily':
      report.data = data.dailyUsage[today] || { tokens: { input: 0, output: 0 }, cost: 0, tasks: [] };
      break;
    case 'weekly':
      // Last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      report.data = {
        tokens: { input: 0, output: 0 },
        cost: 0,
        tasks: [],
        days: {}
      };
      Object.entries(data.dailyUsage).forEach(([date, usage]) => {
        if (new Date(date) >= weekAgo) {
          report.data.tokens.input += usage.tokens.input;
          report.data.tokens.output += usage.tokens.output;
          report.data.cost += usage.cost;
          report.data.tasks.push(...usage.tasks);
          report.data.days[date] = usage;
        }
      });
      report.data.tasks = [...new Set(report.data.tasks)];
      break;
    case 'monthly':
      report.data = data.monthlyUsage[month] || { tokens: { input: 0, output: 0 }, cost: 0, tasks: [] };
      break;
  }

  report.budget = getBudgetStatus();
  return report;
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'status':
      console.log(JSON.stringify(getStatus(), null, 2));
      break;

    case 'track':
      const taskId = args[1];
      const inputTokens = parseInt(args[2]) || 0;
      const outputTokens = parseInt(args[3]) || 0;
      const model = args[4] || 'claude-opus-4';
      const result = trackUsage(taskId, inputTokens, outputTokens, model);
      console.log(JSON.stringify(result, null, 2));
      break;

    case 'budget':
      console.log(JSON.stringify(getBudgetStatus(), null, 2));
      break;

    case 'report':
      const period = args[1] || 'daily';
      console.log(JSON.stringify(generateReport(period), null, 2));
      break;

    default:
      console.log(`
AIOS Command Center

Commands:
  status                              Show current status
  track <task_id> <in_tokens> <out_tokens> [model]   Track token usage
  budget                              Show budget status
  report [daily|weekly|monthly]       Generate usage report

Budget Limits:
  Daily:   €20 (alert at €15)
  Monthly: £400 (~€470)
  Per Task: €10

Examples:
  node command-center.mjs status
  node command-center.mjs track 86c86bxdy 5000 2000
  node command-center.mjs budget
  node command-center.mjs report weekly
      `);
  }
}

main().catch(console.error);
