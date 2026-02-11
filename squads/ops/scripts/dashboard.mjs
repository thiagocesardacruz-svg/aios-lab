#!/usr/bin/env node
/**
 * AIOS Command Center Dashboard
 *
 * Generates and updates a consolidated dashboard in ClickUp
 *
 * Usage:
 *   node dashboard.mjs generate          # Generate dashboard text
 *   node dashboard.mjs update            # Update ClickUp dashboard task
 *   node dashboard.mjs sync              # Sync all data and update
 */

import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, '../data/command-center-data.json');

const CLICKUP_API = 'https://api.clickup.com/api/v2';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';
const DASHBOARD_TASK_ID = '86c86bz0w';

// Goals and Key Results IDs
const GOALS = {
  dailyBudget: {
    id: 'befc00d9-1d6b-45ad-8f4c-e968b2c04852',
    keyResult: 'da2df462-bf84-4a0d-9783-1d6849ecf49b'
  },
  monthlyBudget: {
    id: 'ca936b1b-b442-4376-9a71-1403501c0b83',
    keyResult: '8f8f345f-cd3c-432c-8296-7c43ba96b5d8'
  },
  tokenUsage: {
    id: '9a4a40fc-e30c-40fb-9e7a-ab570d09317d',
    keyResult: '14292302-f06d-47ea-8bfe-d8acba22df6a'
  }
};

// Budget limits
const BUDGET = {
  daily: { limit: 20, alertAt: 15, currency: 'EUR' },
  monthly: { limit: 468, alertAt: 374, currency: 'EUR' },
  perTask: { limit: 10, currency: 'EUR' }
};

// Load data
function loadData() {
  if (existsSync(DATA_FILE)) {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  }
  return {
    tasks: {},
    dailyUsage: {},
    monthlyUsage: {},
    totals: { tokens: { input: 0, output: 0 }, cost: 0 }
  };
}

// API helper
async function api(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/json'
    }
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${CLICKUP_API}${endpoint}`, options);
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

// Get today/month keys
function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function getMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Generate status bar
function statusBar(percentage, width = 20) {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `[${bar}]`;
}

// Generate dashboard content
function generateDashboard() {
  const data = loadData();
  const today = getTodayKey();
  const month = getMonthKey();
  const now = new Date().toISOString();

  const dailyUsage = data.dailyUsage[today] || { tokens: { input: 0, output: 0 }, cost: 0, tasks: [] };
  const monthlyUsage = data.monthlyUsage[month] || { tokens: { input: 0, output: 0 }, cost: 0, tasks: [] };

  const dailyPct = (dailyUsage.cost / BUDGET.daily.limit) * 100;
  const monthlyPct = (monthlyUsage.cost / BUDGET.monthly.limit) * 100;

  const dailyStatus = dailyUsage.cost >= BUDGET.daily.limit ? '🔴 BLOCKED' :
                      dailyUsage.cost >= BUDGET.daily.alertAt ? '🟡 WARNING' : '🟢 OK';
  const monthlyStatus = monthlyUsage.cost >= BUDGET.monthly.limit ? '🔴 BLOCKED' :
                        monthlyUsage.cost >= BUDGET.monthly.alertAt ? '🟡 WARNING' : '🟢 OK';

  // Get recent tasks
  const recentTasks = Object.entries(data.tasks)
    .map(([id, t]) => ({
      id,
      cost: t.cost,
      tokens: t.tokens.input + t.tokens.output,
      lastActivity: t.entries[t.entries.length - 1]?.timestamp || t.created
    }))
    .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))
    .slice(0, 5);

  // Build dashboard
  const dashboard = `
# 📊 AIOS Command Center Dashboard

**Last Updated:** ${now}

---

## 💰 Budget Status

### Daily (${today})
\`\`\`
${statusBar(dailyPct)} ${dailyPct.toFixed(1)}%
€${dailyUsage.cost.toFixed(2)} / €${BUDGET.daily.limit} ${dailyStatus}
\`\`\`

### Monthly (${month})
\`\`\`
${statusBar(monthlyPct)} ${monthlyPct.toFixed(1)}%
€${monthlyUsage.cost.toFixed(2)} / €${BUDGET.monthly.limit} ${monthlyStatus}
\`\`\`

---

## 📈 Token Usage

| Period | Input | Output | Total |
|--------|-------|--------|-------|
| Today | ${dailyUsage.tokens.input.toLocaleString()} | ${dailyUsage.tokens.output.toLocaleString()} | ${(dailyUsage.tokens.input + dailyUsage.tokens.output).toLocaleString()} |
| Month | ${monthlyUsage.tokens.input.toLocaleString()} | ${monthlyUsage.tokens.output.toLocaleString()} | ${(monthlyUsage.tokens.input + monthlyUsage.tokens.output).toLocaleString()} |
| All Time | ${data.totals.tokens.input.toLocaleString()} | ${data.totals.tokens.output.toLocaleString()} | ${(data.totals.tokens.input + data.totals.tokens.output).toLocaleString()} |

---

## 📋 Task Summary

| Period | Tasks | Cost |
|--------|-------|------|
| Today | ${dailyUsage.tasks?.length || 0} | €${dailyUsage.cost.toFixed(2)} |
| Month | ${monthlyUsage.tasks?.length || 0} | €${monthlyUsage.cost.toFixed(2)} |
| All Time | ${Object.keys(data.tasks).length} | €${data.totals.cost.toFixed(2)} |

---

## 🕐 Recent Tasks

| Task ID | Tokens | Cost |
|---------|--------|------|
${recentTasks.map(t => `| ${t.id} | ${t.tokens.toLocaleString()} | €${t.cost.toFixed(4)} |`).join('\n')}

---

## ⚙️ Budget Limits

| Limit | Value | Alert At |
|-------|-------|----------|
| Daily | €${BUDGET.daily.limit} | €${BUDGET.daily.alertAt} |
| Monthly | €${BUDGET.monthly.limit} | €${BUDGET.monthly.alertAt} |
| Per Task | €${BUDGET.perTask.limit} | - |

---

*Auto-generated by AIOS Command Center*
`;

  return dashboard.trim();
}

// Update Goals with current values
async function updateGoals() {
  const data = loadData();
  const today = getTodayKey();
  const month = getMonthKey();

  const dailyCost = data.dailyUsage[today]?.cost || 0;
  const monthlyCost = data.monthlyUsage[month]?.cost || 0;
  const totalTokens = (data.monthlyUsage[month]?.tokens?.input || 0) +
                      (data.monthlyUsage[month]?.tokens?.output || 0);

  // Update Daily Budget
  await api(`/key_result/${GOALS.dailyBudget.keyResult}`, 'PUT', {
    steps_current: dailyCost,
    note: `Auto-sync: €${dailyCost.toFixed(2)}`
  });

  // Update Monthly Budget
  await api(`/key_result/${GOALS.monthlyBudget.keyResult}`, 'PUT', {
    steps_current: monthlyCost,
    note: `Auto-sync: €${monthlyCost.toFixed(2)}`
  });

  // Update Token Usage
  await api(`/key_result/${GOALS.tokenUsage.keyResult}`, 'PUT', {
    steps_current: totalTokens,
    note: `Auto-sync: ${totalTokens.toLocaleString()} tokens`
  });

  return { dailyCost, monthlyCost, totalTokens };
}

// Update ClickUp task with dashboard
async function updateClickUpDashboard() {
  const content = generateDashboard();

  // Update task description
  const result = await api(`/task/${DASHBOARD_TASK_ID}`, 'PUT', {
    description: content
  });

  if (result.err) {
    console.error('Error updating dashboard:', result.err);
    return false;
  }

  // Update Goals
  const goalStats = await updateGoals();

  // Add comment with timestamp
  await api(`/task/${DASHBOARD_TASK_ID}/comment`, 'POST', {
    comment_text: `📊 Dashboard synced | Daily: €${goalStats.dailyCost.toFixed(2)} | Monthly: €${goalStats.monthlyCost.toFixed(2)} | Tokens: ${goalStats.totalTokens.toLocaleString()}`
  });

  console.log(JSON.stringify({
    success: true,
    task_id: DASHBOARD_TASK_ID,
    goals_updated: true,
    updated_at: new Date().toISOString()
  }));

  return true;
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'generate':
      console.log(generateDashboard());
      break;

    case 'update':
    case 'sync':
      await updateClickUpDashboard();
      break;

    default:
      console.log(`
AIOS Command Center Dashboard

Commands:
  generate    Generate dashboard text (stdout)
  update      Update ClickUp dashboard task
  sync        Alias for update

Dashboard Task: https://app.clickup.com/t/${DASHBOARD_TASK_ID}
      `);
  }
}

main().catch(console.error);
