#!/usr/bin/env node
/**
 * Budget Calculator - Deterministic cost calculations (NO AI needed)
 *
 * Replaces AI agents in budget-check.yaml workflow
 * Reads cost data and calculates totals, alerts, projections
 *
 * Usage:
 *   node budget-calculator.mjs                    # Today's summary
 *   node budget-calculator.mjs --period=week      # Weekly summary
 *   node budget-calculator.mjs --period=month     # Monthly summary
 *   node budget-calculator.mjs --format=json      # JSON output
 *   node budget-calculator.mjs --check-limits     # Check and return alerts only
 *
 * Cost: €0 (deterministic, no AI)
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Budget limits from governance
const LIMITS = {
  daily: {
    alert: 15,    // €15 - trigger warning
    hard: 20      // €20 - SAFE MODE
  },
  monthly: {
    budget: 468   // €468/month
  },
  perTask: {
    approval: 10  // €10 - requires approval
  }
};

// Token pricing (Claude models)
const PRICING = {
  'claude-opus-4': { input: 0.015, output: 0.075 },      // per 1k tokens
  'claude-sonnet-4': { input: 0.003, output: 0.015 },
  'claude-haiku-3.5': { input: 0.0008, output: 0.004 },
  'default': { input: 0.015, output: 0.075 }
};

// Load data file
function loadData() {
  const dataPath = join(__dirname, '../data/command-center-data.json');

  if (!existsSync(dataPath)) {
    return {
      tasks: {},
      dailyUsage: {},
      monthlyUsage: {},
      totals: { tokens: { input: 0, output: 0 }, cost: 0, tasks: 0 }
    };
  }

  return JSON.parse(readFileSync(dataPath, 'utf-8'));
}

// Get date keys
function getDateKeys() {
  const now = new Date();
  return {
    today: now.toISOString().split('T')[0],
    month: now.toISOString().slice(0, 7),
    weekStart: getWeekStart(now)
  };
}

function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

// Calculate daily total
function getDailyTotal(data, date) {
  const usage = data.dailyUsage[date];
  if (!usage) return { cost: 0, tokens: { input: 0, output: 0 }, tasks: 0 };

  return {
    cost: usage.cost || 0,
    tokens: usage.tokens || { input: 0, output: 0 },
    tasks: usage.tasks?.length || 0
  };
}

// Calculate weekly total
function getWeeklyTotal(data, weekStart) {
  let total = { cost: 0, tokens: { input: 0, output: 0 }, tasks: 0 };

  const startDate = new Date(weekStart);
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateKey = date.toISOString().split('T')[0];

    const daily = getDailyTotal(data, dateKey);
    total.cost += daily.cost;
    total.tokens.input += daily.tokens.input;
    total.tokens.output += daily.tokens.output;
    total.tasks += daily.tasks;
  }

  return total;
}

// Calculate monthly total
function getMonthlyTotal(data, month) {
  const usage = data.monthlyUsage[month];
  if (!usage) return { cost: 0, tokens: { input: 0, output: 0 }, tasks: 0 };

  return {
    cost: usage.cost || 0,
    tokens: usage.tokens || { input: 0, output: 0 },
    tasks: usage.tasks?.length || 0
  };
}

// Check limits and generate alerts
function checkLimits(dailyCost, monthlyCost) {
  const alerts = [];
  const status = { daily: 'ok', monthly: 'ok' };

  // Daily checks
  if (dailyCost >= LIMITS.daily.hard) {
    alerts.push({
      level: 'critical',
      type: 'daily_hard_limit',
      message: `🔴 DAILY HARD LIMIT EXCEEDED: €${dailyCost.toFixed(2)} >= €${LIMITS.daily.hard}`,
      action: 'SAFE MODE - Block new AI tasks'
    });
    status.daily = 'critical';
  } else if (dailyCost >= LIMITS.daily.alert) {
    alerts.push({
      level: 'warning',
      type: 'daily_alert',
      message: `🟡 Daily alert threshold: €${dailyCost.toFixed(2)} >= €${LIMITS.daily.alert}`,
      action: 'Review ongoing tasks, consider pausing non-critical'
    });
    status.daily = 'warning';
  }

  // Monthly checks
  const monthlyPercent = (monthlyCost / LIMITS.monthly.budget) * 100;
  if (monthlyPercent >= 100) {
    alerts.push({
      level: 'critical',
      type: 'monthly_exceeded',
      message: `🔴 MONTHLY BUDGET EXCEEDED: €${monthlyCost.toFixed(2)} (${monthlyPercent.toFixed(1)}%)`,
      action: 'SAFE MODE - No new AI tasks until next month'
    });
    status.monthly = 'critical';
  } else if (monthlyPercent >= 80) {
    alerts.push({
      level: 'warning',
      type: 'monthly_high',
      message: `🟡 Monthly budget at ${monthlyPercent.toFixed(1)}%: €${monthlyCost.toFixed(2)} / €${LIMITS.monthly.budget}`,
      action: 'Reduce AI usage, prioritize critical tasks only'
    });
    status.monthly = 'warning';
  } else if (monthlyPercent >= 50) {
    alerts.push({
      level: 'info',
      type: 'monthly_half',
      message: `📊 Monthly budget at ${monthlyPercent.toFixed(1)}%: €${monthlyCost.toFixed(2)} / €${LIMITS.monthly.budget}`,
      action: 'On track - continue monitoring'
    });
  }

  return { alerts, status };
}

// Calculate projections
function calculateProjections(data, dailyCost, monthlyCost) {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const daysRemaining = daysInMonth - dayOfMonth;

  // Simple projection based on current daily average
  const dailyAverage = monthlyCost / dayOfMonth;
  const projectedMonthly = dailyAverage * daysInMonth;
  const remainingBudget = LIMITS.monthly.budget - monthlyCost;
  const dailyBudgetRemaining = daysRemaining > 0 ? remainingBudget / daysRemaining : 0;

  return {
    dailyAverage: dailyAverage,
    projectedMonthly: projectedMonthly,
    remainingBudget: remainingBudget,
    daysRemaining: daysRemaining,
    recommendedDailyLimit: Math.min(dailyBudgetRemaining, LIMITS.daily.hard),
    willExceed: projectedMonthly > LIMITS.monthly.budget
  };
}

// Format output
function formatMarkdown(result) {
  const { daily, weekly, monthly, alerts, projections, dates } = result;

  let output = `## 📊 Budget Report - ${dates.today}\n\n`;

  // Alerts first
  if (alerts.length > 0) {
    output += `### ⚠️ Alerts\n\n`;
    alerts.forEach(a => {
      output += `${a.message}\n`;
      output += `   → ${a.action}\n\n`;
    });
  }

  // Daily
  output += `### Today (${dates.today})\n`;
  output += `- Cost: €${daily.cost.toFixed(2)} / €${LIMITS.daily.hard}\n`;
  output += `- Tokens: ${(daily.tokens.input / 1000).toFixed(1)}k in, ${(daily.tokens.output / 1000).toFixed(1)}k out\n`;
  output += `- Tasks: ${daily.tasks}\n\n`;

  // Monthly
  const monthlyPercent = (monthly.cost / LIMITS.monthly.budget) * 100;
  output += `### This Month (${dates.month})\n`;
  output += `- Cost: €${monthly.cost.toFixed(2)} / €${LIMITS.monthly.budget} (${monthlyPercent.toFixed(1)}%)\n`;
  output += `- Tokens: ${(monthly.tokens.input / 1000).toFixed(1)}k in, ${(monthly.tokens.output / 1000).toFixed(1)}k out\n`;
  output += `- Tasks: ${monthly.tasks}\n\n`;

  // Projections
  output += `### Projections\n`;
  output += `- Daily average: €${projections.dailyAverage.toFixed(2)}\n`;
  output += `- Projected month-end: €${projections.projectedMonthly.toFixed(2)}`;
  output += projections.willExceed ? ' ⚠️ WILL EXCEED\n' : ' ✅\n';
  output += `- Remaining budget: €${projections.remainingBudget.toFixed(2)}\n`;
  output += `- Recommended daily limit: €${projections.recommendedDailyLimit.toFixed(2)}\n`;

  return output;
}

// Main
function main() {
  const args = process.argv.slice(2);
  const format = args.find(a => a.startsWith('--format='))?.split('=')[1] || 'markdown';
  const period = args.find(a => a.startsWith('--period='))?.split('=')[1] || 'today';
  const checkOnly = args.includes('--check-limits');

  const data = loadData();
  const dates = getDateKeys();

  const daily = getDailyTotal(data, dates.today);
  const weekly = getWeeklyTotal(data, dates.weekStart);
  const monthly = getMonthlyTotal(data, dates.month);

  const { alerts, status } = checkLimits(daily.cost, monthly.cost);
  const projections = calculateProjections(data, daily.cost, monthly.cost);

  const result = {
    dates,
    daily,
    weekly,
    monthly,
    alerts,
    status,
    projections,
    limits: LIMITS
  };

  if (checkOnly) {
    // Just return alerts for workflow integration
    if (format === 'json') {
      console.log(JSON.stringify({ alerts, status }, null, 2));
    } else {
      if (alerts.length === 0) {
        console.log('✅ All budget limits OK');
      } else {
        alerts.forEach(a => console.log(a.message));
      }
    }
    process.exit(alerts.some(a => a.level === 'critical') ? 1 : 0);
  }

  if (format === 'json') {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatMarkdown(result));
  }
}

main();
