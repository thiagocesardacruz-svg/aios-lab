#!/usr/bin/env node
/**
 * Status Aggregator - Deterministic status collection (NO AI needed)
 *
 * Replaces AI agents in status.yaml and daily-standup.yaml workflows
 * Aggregates OS data, counts by status, identifies blockers
 *
 * Usage:
 *   node status-aggregator.mjs                    # Full status report
 *   node status-aggregator.mjs --format=json      # JSON output
 *   node status-aggregator.mjs --blocked-only     # Only show blocked items
 *   node status-aggregator.mjs --squad=tech       # Filter by squad
 *   node status-aggregator.mjs --include-cost     # Include cost data
 *
 * Cost: €0 (deterministic, no AI)
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '../../..');

// Status definitions
const STATUS_ORDER = ['inbox', 'to do', 'in progress', 'waiting', 'review', 'done'];
const STATUS_EMOJI = {
  'inbox': '📥',
  'to do': '📋',
  'in progress': '🔄',
  'waiting': '⏸️',
  'review': '👀',
  'done': '✅',
  'blocked': '🚫'
};

// ClickUp API config (reuse from clickup-sync)
const CLICKUP_API = 'https://api.clickup.com/api/v2';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';
const AI_OPS_SPACE = '90152519655';

// Fetch tasks from ClickUp
async function fetchClickUpTasks(spaceId = AI_OPS_SPACE) {
  try {
    const response = await fetch(`${CLICKUP_API}/space/${spaceId}/task?include_closed=false&subtasks=true`, {
      headers: { 'Authorization': API_KEY }
    });
    const data = await response.json();
    return data.tasks || [];
  } catch (error) {
    console.error('Warning: Could not fetch ClickUp tasks:', error.message);
    return [];
  }
}

// Parse local OS files (if they exist)
function parseLocalOSFiles() {
  const osDir = join(PROJECT_ROOT, 'logs/service-orders');
  if (!existsSync(osDir)) return [];

  const files = readdirSync(osDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
  const tasks = [];

  for (const file of files) {
    try {
      const content = readFileSync(join(osDir, file), 'utf-8');
      // Simple YAML parsing for status
      const statusMatch = content.match(/status:\s*["']?([^"'\n]+)/);
      const nameMatch = content.match(/name:\s*["']?([^"'\n]+)/);
      const squadMatch = content.match(/squad:\s*["']?([^"'\n]+)/);
      const agentMatch = content.match(/agent:\s*["']?([^"'\n]+)/);
      const createdMatch = content.match(/created:\s*["']?([^"'\n]+)/);

      if (nameMatch) {
        tasks.push({
          id: file.replace(/\.(yaml|yml)$/, ''),
          name: nameMatch[1],
          status: statusMatch?.[1]?.toLowerCase() || 'unknown',
          squad: squadMatch?.[1] || 'unknown',
          agent: agentMatch?.[1] || 'unassigned',
          created: createdMatch?.[1] || null,
          source: 'local'
        });
      }
    } catch (e) {
      // Skip invalid files
    }
  }

  return tasks;
}

// Load cost data
function loadCostData() {
  const dataPath = join(__dirname, '../data/command-center-data.json');
  if (!existsSync(dataPath)) {
    return { daily: 0, monthly: 0 };
  }

  const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
  const today = new Date().toISOString().split('T')[0];
  const month = today.slice(0, 7);

  return {
    daily: data.dailyUsage?.[today]?.cost || 0,
    monthly: data.monthlyUsage?.[month]?.cost || 0
  };
}

// Count tasks by status
function countByStatus(tasks) {
  const counts = {};
  STATUS_ORDER.forEach(s => counts[s] = 0);
  counts['other'] = 0;

  tasks.forEach(task => {
    const status = task.status?.toLowerCase() || 'other';
    if (STATUS_ORDER.includes(status)) {
      counts[status]++;
    } else {
      counts['other']++;
    }
  });

  return counts;
}

// Count tasks by squad
function countBySquad(tasks) {
  const counts = {};
  tasks.forEach(task => {
    const squad = task.squad || 'unassigned';
    counts[squad] = (counts[squad] || 0) + 1;
  });
  return counts;
}

// Count tasks by agent
function countByAgent(tasks) {
  const counts = {};
  tasks.forEach(task => {
    const agent = task.agent || 'unassigned';
    counts[agent] = (counts[agent] || 0) + 1;
  });
  return counts;
}

// Find blocked/waiting items
function findBlockedItems(tasks) {
  return tasks.filter(t => {
    const status = t.status?.toLowerCase();
    return status === 'waiting' || status === 'blocked';
  });
}

// Find items older than N hours in a status
function findStaleItems(tasks, status, hours = 24) {
  const threshold = Date.now() - (hours * 60 * 60 * 1000);

  return tasks.filter(t => {
    if (t.status?.toLowerCase() !== status) return false;
    if (!t.created && !t.date_created) return false;

    const created = new Date(t.created || t.date_created).getTime();
    return created < threshold;
  });
}

// Generate alerts
function generateAlerts(tasks, counts, costs) {
  const alerts = [];

  // Blocked items
  const blocked = findBlockedItems(tasks);
  if (blocked.length > 0) {
    alerts.push({
      level: 'warning',
      type: 'blocked_items',
      message: `⏸️ ${blocked.length} item(s) waiting/blocked`,
      items: blocked.map(t => t.name)
    });
  }

  // Stale in progress
  const staleInProgress = findStaleItems(tasks, 'in progress', 48);
  if (staleInProgress.length > 0) {
    alerts.push({
      level: 'info',
      type: 'stale_in_progress',
      message: `🔄 ${staleInProgress.length} item(s) in progress > 48h`,
      items: staleInProgress.map(t => t.name)
    });
  }

  // High inbox count
  if (counts['inbox'] > 10) {
    alerts.push({
      level: 'info',
      type: 'high_inbox',
      message: `📥 High inbox count: ${counts['inbox']} items`,
      action: 'Review and prioritize inbox items'
    });
  }

  // Cost alerts
  if (costs.daily >= 15) {
    alerts.push({
      level: costs.daily >= 20 ? 'critical' : 'warning',
      type: 'cost_alert',
      message: `💰 Daily cost: €${costs.daily.toFixed(2)}`,
      action: costs.daily >= 20 ? 'SAFE MODE - limit new tasks' : 'Monitor closely'
    });
  }

  return alerts;
}

// Format as markdown
function formatMarkdown(result) {
  const { counts, bySquad, byAgent, alerts, costs, blocked, totals, date } = result;

  let output = `## 📊 System Status - ${date}\n\n`;

  // Alerts
  if (alerts.length > 0) {
    output += `### ⚠️ Alerts\n\n`;
    alerts.forEach(a => {
      output += `${a.message}\n`;
      if (a.action) output += `   → ${a.action}\n`;
      if (a.items?.length) {
        a.items.slice(0, 5).forEach(item => output += `   • ${item}\n`);
        if (a.items.length > 5) output += `   • ... and ${a.items.length - 5} more\n`;
      }
      output += '\n';
    });
  }

  // Summary
  output += `### OS Summary\n\n`;
  output += `| Status | Count |\n`;
  output += `|--------|-------|\n`;
  STATUS_ORDER.forEach(status => {
    const emoji = STATUS_EMOJI[status] || '📌';
    output += `| ${emoji} ${status} | ${counts[status]} |\n`;
  });
  output += `| **Total** | **${totals.total}** |\n\n`;

  // By Squad (top 5)
  output += `### By Squad\n\n`;
  const squadEntries = Object.entries(bySquad).sort((a, b) => b[1] - a[1]).slice(0, 5);
  squadEntries.forEach(([squad, count]) => {
    output += `- **${squad}**: ${count}\n`;
  });
  output += '\n';

  // Cost (if included)
  if (costs) {
    output += `### Cost\n\n`;
    output += `- Today: €${costs.daily.toFixed(2)}\n`;
    output += `- Month: €${costs.monthly.toFixed(2)}\n\n`;
  }

  // Blocked items (if any)
  if (blocked.length > 0) {
    output += `### ⏸️ Waiting/Blocked Items\n\n`;
    blocked.slice(0, 10).forEach(item => {
      output += `- ${item.name} (${item.squad || 'no squad'})\n`;
    });
    if (blocked.length > 10) {
      output += `- ... and ${blocked.length - 10} more\n`;
    }
    output += '\n';
  }

  return output;
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const format = args.find(a => a.startsWith('--format='))?.split('=')[1] || 'markdown';
  const squadFilter = args.find(a => a.startsWith('--squad='))?.split('=')[1];
  const blockedOnly = args.includes('--blocked-only');
  const includeCost = args.includes('--include-cost');
  const useClickUp = !args.includes('--local-only');

  // Collect tasks
  let tasks = [];

  if (useClickUp) {
    const clickUpTasks = await fetchClickUpTasks();
    tasks = clickUpTasks.map(t => ({
      id: t.id,
      name: t.name,
      status: t.status?.status?.toLowerCase() || 'unknown',
      squad: t.folder?.name?.toLowerCase() || 'unassigned',
      agent: t.assignees?.[0]?.username || 'unassigned',
      created: t.date_created,
      url: t.url,
      source: 'clickup'
    }));
  }

  // Add local OS files
  const localTasks = parseLocalOSFiles();
  tasks = [...tasks, ...localTasks];

  // Filter by squad if specified
  if (squadFilter) {
    tasks = tasks.filter(t => t.squad?.toLowerCase() === squadFilter.toLowerCase());
  }

  // Calculate metrics
  const counts = countByStatus(tasks);
  const bySquad = countBySquad(tasks);
  const byAgent = countByAgent(tasks);
  const blocked = findBlockedItems(tasks);
  const costs = includeCost ? loadCostData() : null;
  const alerts = generateAlerts(tasks, counts, costs || { daily: 0, monthly: 0 });

  const result = {
    date: new Date().toISOString().split('T')[0],
    totals: {
      total: tasks.length,
      active: tasks.length - counts['done']
    },
    counts,
    bySquad,
    byAgent,
    blocked: blockedOnly ? blocked : blocked.slice(0, 10),
    alerts,
    costs
  };

  if (blockedOnly) {
    if (format === 'json') {
      console.log(JSON.stringify({ blocked, count: blocked.length }, null, 2));
    } else {
      console.log(`## ⏸️ Blocked/Waiting Items (${blocked.length})\n`);
      blocked.forEach(item => {
        console.log(`- ${item.name} [${item.squad}] - ${item.status}`);
      });
    }
    return;
  }

  if (format === 'json') {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatMarkdown(result));
  }
}

main().catch(console.error);
