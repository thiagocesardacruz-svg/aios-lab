#!/usr/bin/env node
/**
 * KPI Dashboard - Deterministic KPI aggregation (NO AI needed)
 *
 * Aggregates KPIs from multiple sources into a unified dashboard
 * Sources: ClickUp, command-center-data, local files
 *
 * Usage:
 *   node kpi-dashboard.mjs                        # Full dashboard
 *   node kpi-dashboard.mjs --category=ops         # Filter by category
 *   node kpi-dashboard.mjs --format=json
 *   node kpi-dashboard.mjs --export=./report.md   # Export to file
 *
 * Categories: ops, finance, productivity, quality, velocity
 *
 * Cost: €0 (deterministic, no AI)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '../../..');

// ClickUp API
const CLICKUP_API = 'https://api.clickup.com/api/v2';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';
const AI_OPS_SPACE = '90152519655';

// KPI definitions
const KPI_DEFINITIONS = {
  ops: [
    { id: 'tasks_completed_today', name: 'Tasks Completed Today', unit: 'count', target: 10 },
    { id: 'tasks_in_progress', name: 'Tasks In Progress', unit: 'count', target: 5 },
    { id: 'blocked_items', name: 'Blocked Items', unit: 'count', target: 0, inverse: true },
    { id: 'avg_resolution_time', name: 'Avg Resolution Time', unit: 'hours', target: 24 }
  ],
  finance: [
    { id: 'daily_cost', name: 'Daily Cost', unit: '€', target: 15, hardLimit: 20 },
    { id: 'monthly_cost', name: 'Monthly Cost', unit: '€', target: 400, hardLimit: 468 },
    { id: 'cost_per_task', name: 'Cost per Task', unit: '€', target: 2 },
    { id: 'budget_remaining', name: 'Budget Remaining', unit: '€' }
  ],
  productivity: [
    { id: 'tasks_per_day', name: 'Tasks per Day', unit: 'count', target: 8 },
    { id: 'throughput_rate', name: 'Throughput Rate', unit: '%', target: 80 },
    { id: 'automation_ratio', name: 'Automation Ratio', unit: '%', target: 70 }
  ],
  quality: [
    { id: 'sla_compliance', name: 'SLA Compliance', unit: '%', target: 95 },
    { id: 'rework_rate', name: 'Rework Rate', unit: '%', target: 5, inverse: true },
    { id: 'checklist_pass_rate', name: 'Checklist Pass Rate', unit: '%', target: 90 }
  ],
  velocity: [
    { id: 'cycle_time', name: 'Cycle Time', unit: 'hours', target: 24 },
    { id: 'lead_time', name: 'Lead Time', unit: 'hours', target: 48 },
    { id: 'wip_count', name: 'Work in Progress', unit: 'count', target: 5 }
  ]
};

// Load cost data
function loadCostData() {
  const path = join(__dirname, '../data/command-center-data.json');
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf-8'));
}

// Fetch ClickUp tasks
async function fetchClickUpTasks() {
  try {
    const response = await fetch(`${CLICKUP_API}/space/${AI_OPS_SPACE}/task?include_closed=true`, {
      headers: { 'Authorization': API_KEY }
    });
    const data = await response.json();
    return data.tasks || [];
  } catch (e) {
    return [];
  }
}

// Calculate ops KPIs
function calculateOpsKPIs(tasks) {
  const today = new Date().toISOString().split('T')[0];
  const todayStart = new Date(today).getTime();

  const completedToday = tasks.filter(t => {
    const status = t.status?.status?.toLowerCase();
    const updated = parseInt(t.date_updated);
    return (status === 'done' || status === 'completed') && updated >= todayStart;
  }).length;

  const inProgress = tasks.filter(t => {
    const status = t.status?.status?.toLowerCase();
    return status === 'in progress';
  }).length;

  const blocked = tasks.filter(t => {
    const status = t.status?.status?.toLowerCase();
    return status === 'waiting' || status === 'blocked';
  }).length;

  // Calculate average resolution time (for completed tasks)
  const completedTasks = tasks.filter(t => {
    const status = t.status?.status?.toLowerCase();
    return status === 'done' || status === 'completed';
  });

  let avgResolution = 0;
  if (completedTasks.length > 0) {
    const totalHours = completedTasks.reduce((sum, t) => {
      const created = parseInt(t.date_created);
      const updated = parseInt(t.date_updated);
      return sum + (updated - created) / (1000 * 60 * 60);
    }, 0);
    avgResolution = totalHours / completedTasks.length;
  }

  return {
    tasks_completed_today: completedToday,
    tasks_in_progress: inProgress,
    blocked_items: blocked,
    avg_resolution_time: Math.round(avgResolution * 10) / 10
  };
}

// Calculate finance KPIs
function calculateFinanceKPIs(costData) {
  if (!costData) {
    return {
      daily_cost: 0,
      monthly_cost: 0,
      cost_per_task: 0,
      budget_remaining: 468
    };
  }

  const today = new Date().toISOString().split('T')[0];
  const month = today.slice(0, 7);

  const daily = costData.dailyUsage?.[today]?.cost || 0;
  const monthly = costData.monthlyUsage?.[month]?.cost || 0;
  const taskCount = costData.monthlyUsage?.[month]?.tasks?.length || 1;

  return {
    daily_cost: Math.round(daily * 100) / 100,
    monthly_cost: Math.round(monthly * 100) / 100,
    cost_per_task: Math.round((monthly / taskCount) * 100) / 100,
    budget_remaining: Math.round((468 - monthly) * 100) / 100
  };
}

// Calculate productivity KPIs
function calculateProductivityKPIs(tasks, costData) {
  const today = new Date().toISOString().split('T')[0];
  const todayStart = new Date(today).getTime();

  // Tasks completed today
  const completedToday = tasks.filter(t => {
    const status = t.status?.status?.toLowerCase();
    const updated = parseInt(t.date_updated);
    return (status === 'done' || status === 'completed') && updated >= todayStart;
  }).length;

  // Total tasks vs completed (throughput)
  const totalActive = tasks.filter(t => {
    const status = t.status?.status?.toLowerCase();
    return status !== 'done' && status !== 'completed';
  }).length;

  const completed = tasks.filter(t => {
    const status = t.status?.status?.toLowerCase();
    return status === 'done' || status === 'completed';
  }).length;

  const throughput = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  // Automation ratio (AI vs Human tasks)
  // This would need the executor field, simplified for now
  const automationRatio = 70; // Placeholder - would calculate from executor field

  return {
    tasks_per_day: completedToday,
    throughput_rate: throughput,
    automation_ratio: automationRatio
  };
}

// Calculate quality KPIs
function calculateQualityKPIs(tasks) {
  // SLA compliance (simplified - tasks resolved within target time)
  const completedTasks = tasks.filter(t => {
    const status = t.status?.status?.toLowerCase();
    return status === 'done' || status === 'completed';
  });

  let withinSLA = 0;
  completedTasks.forEach(t => {
    const created = parseInt(t.date_created);
    const updated = parseInt(t.date_updated);
    const hours = (updated - created) / (1000 * 60 * 60);
    const priority = t.priority?.priority || 3;
    const slaTarget = { 1: 4, 2: 24, 3: 72, 4: 168 }[priority];
    if (hours <= slaTarget) withinSLA++;
  });

  const slaCompliance = completedTasks.length > 0
    ? Math.round((withinSLA / completedTasks.length) * 100)
    : 100;

  return {
    sla_compliance: slaCompliance,
    rework_rate: 5, // Placeholder - would track reopened tasks
    checklist_pass_rate: 85 // Placeholder - would track checklist results
  };
}

// Calculate velocity KPIs
function calculateVelocityKPIs(tasks) {
  const completedTasks = tasks.filter(t => {
    const status = t.status?.status?.toLowerCase();
    return status === 'done' || status === 'completed';
  });

  // Cycle time (time from start to done)
  let totalCycleTime = 0;
  let cycleCount = 0;

  completedTasks.forEach(t => {
    const created = parseInt(t.date_created);
    const updated = parseInt(t.date_updated);
    totalCycleTime += (updated - created) / (1000 * 60 * 60);
    cycleCount++;
  });

  const avgCycleTime = cycleCount > 0 ? totalCycleTime / cycleCount : 0;

  // WIP count
  const wipCount = tasks.filter(t => {
    const status = t.status?.status?.toLowerCase();
    return status === 'in progress';
  }).length;

  return {
    cycle_time: Math.round(avgCycleTime * 10) / 10,
    lead_time: Math.round(avgCycleTime * 1.5 * 10) / 10, // Simplified
    wip_count: wipCount
  };
}

// Evaluate KPI health
function evaluateHealth(value, definition) {
  if (!definition.target) return 'neutral';

  const threshold = definition.target;
  const isInverse = definition.inverse;

  if (isInverse) {
    // Lower is better
    if (value <= threshold) return 'healthy';
    if (value <= threshold * 1.5) return 'warning';
    return 'critical';
  } else {
    // Higher is better (or close to target)
    if (definition.hardLimit && value >= definition.hardLimit) return 'critical';
    if (value >= threshold * 0.9) return 'healthy';
    if (value >= threshold * 0.7) return 'warning';
    return 'critical';
  }
}

// Format dashboard as markdown
function formatMarkdown(dashboard) {
  let output = `## 📊 KPI Dashboard\n\n`;
  output += `*Generated: ${new Date().toISOString()}*\n\n`;

  const healthIcons = { healthy: '🟢', warning: '🟡', critical: '🔴', neutral: '⚪' };

  Object.entries(dashboard.categories).forEach(([category, kpis]) => {
    output += `### ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
    output += `| KPI | Value | Target | Health |\n`;
    output += `|-----|-------|--------|--------|\n`;

    kpis.forEach(kpi => {
      const icon = healthIcons[kpi.health] || '⚪';
      const unit = kpi.unit || '';
      const targetStr = kpi.target ? `${kpi.target}${unit}` : '-';
      output += `| ${kpi.name} | ${kpi.value}${unit} | ${targetStr} | ${icon} |\n`;
    });

    output += '\n';
  });

  // Summary
  output += `### Summary\n\n`;
  output += `- 🟢 Healthy: ${dashboard.summary.healthy}\n`;
  output += `- 🟡 Warning: ${dashboard.summary.warning}\n`;
  output += `- 🔴 Critical: ${dashboard.summary.critical}\n`;

  return output;
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const format = args.find(a => a.startsWith('--format='))?.split('=')[1] || 'markdown';
  const categoryFilter = args.find(a => a.startsWith('--category='))?.split('=')[1];
  const exportPath = args.find(a => a.startsWith('--export='))?.split('=')[1];

  // Load data sources
  const costData = loadCostData();
  const tasks = await fetchClickUpTasks();

  // Calculate KPIs by category
  const opsValues = calculateOpsKPIs(tasks);
  const financeValues = calculateFinanceKPIs(costData);
  const productivityValues = calculateProductivityKPIs(tasks, costData);
  const qualityValues = calculateQualityKPIs(tasks);
  const velocityValues = calculateVelocityKPIs(tasks);

  const allValues = {
    ops: opsValues,
    finance: financeValues,
    productivity: productivityValues,
    quality: qualityValues,
    velocity: velocityValues
  };

  // Build dashboard
  const dashboard = {
    timestamp: new Date().toISOString(),
    categories: {},
    summary: { healthy: 0, warning: 0, critical: 0, neutral: 0 }
  };

  Object.entries(KPI_DEFINITIONS).forEach(([category, definitions]) => {
    if (categoryFilter && category !== categoryFilter) return;

    dashboard.categories[category] = definitions.map(def => {
      const value = allValues[category]?.[def.id] ?? 0;
      const health = evaluateHealth(value, def);
      dashboard.summary[health]++;

      return {
        id: def.id,
        name: def.name,
        value,
        unit: def.unit,
        target: def.target,
        health
      };
    });
  });

  // Output
  if (format === 'json') {
    console.log(JSON.stringify(dashboard, null, 2));
  } else {
    const markdown = formatMarkdown(dashboard);
    if (exportPath) {
      writeFileSync(exportPath, markdown);
      console.log(`Dashboard exported to ${exportPath}`);
    } else {
      console.log(markdown);
    }
  }
}

main().catch(console.error);
