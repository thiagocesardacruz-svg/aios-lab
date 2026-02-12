#!/usr/bin/env node
/**
 * SLA Monitor - Deterministic SLA tracking (NO AI needed)
 *
 * Monitors tasks against SLA definitions, generates alerts for violations
 * Integrates with ClickUp to track response/resolution times
 *
 * Usage:
 *   node sla-monitor.mjs                          # Check all active tasks
 *   node sla-monitor.mjs --check-violations       # Only show violations
 *   node sla-monitor.mjs --squad=tech             # Filter by squad
 *   node sla-monitor.mjs --format=json
 *
 * SLA Definitions:
 *   - Urgent (P1): Response 1h, Resolution 4h
 *   - High (P2): Response 4h, Resolution 24h
 *   - Normal (P3): Response 24h, Resolution 72h
 *   - Low (P4): Response 48h, Resolution 1 week
 *
 * Cost: €0 (deterministic, no AI)
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// SLA definitions (in hours)
const SLA_DEFINITIONS = {
  1: { // Urgent
    name: 'Urgent',
    response: 1,
    resolution: 4,
    escalation: 2
  },
  2: { // High
    name: 'High',
    response: 4,
    resolution: 24,
    escalation: 8
  },
  3: { // Normal
    name: 'Normal',
    response: 24,
    resolution: 72,
    escalation: 48
  },
  4: { // Low
    name: 'Low',
    response: 48,
    resolution: 168, // 1 week
    escalation: 96
  }
};

// ClickUp API config
const CLICKUP_API = 'https://api.clickup.com/api/v2';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';
const AI_OPS_SPACE = '90152519655';

// Fetch tasks from ClickUp
async function fetchTasks() {
  try {
    const response = await fetch(`${CLICKUP_API}/space/${AI_OPS_SPACE}/task?include_closed=false`, {
      headers: { 'Authorization': API_KEY }
    });
    const data = await response.json();
    return data.tasks || [];
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    return [];
  }
}

// Calculate time difference in hours
function hoursSince(timestamp) {
  const now = Date.now();
  const then = typeof timestamp === 'string' ? new Date(timestamp).getTime() : parseInt(timestamp);
  return (now - then) / (1000 * 60 * 60);
}

// Check SLA status for a task
function checkTaskSLA(task) {
  const priority = task.priority?.priority || 3;
  const sla = SLA_DEFINITIONS[priority] || SLA_DEFINITIONS[3];

  const created = task.date_created;
  const status = task.status?.status?.toLowerCase() || 'inbox';
  const hoursSinceCreated = hoursSince(created);

  const result = {
    taskId: task.id,
    name: task.name,
    priority: priority,
    priorityName: sla.name,
    status: status,
    created: new Date(parseInt(created)).toISOString(),
    hoursOpen: Math.round(hoursSinceCreated * 10) / 10,
    sla: {
      response: sla.response,
      resolution: sla.resolution
    },
    violations: [],
    warnings: [],
    health: 'healthy'
  };

  // Check if still in inbox (no response)
  if (status === 'inbox' || status === 'to do') {
    if (hoursSinceCreated > sla.response) {
      result.violations.push({
        type: 'response_sla',
        message: `Response SLA breached: ${result.hoursOpen}h > ${sla.response}h`,
        severity: 'critical'
      });
      result.health = 'critical';
    } else if (hoursSinceCreated > sla.response * 0.75) {
      result.warnings.push({
        type: 'response_warning',
        message: `Response SLA at risk: ${result.hoursOpen}h / ${sla.response}h (${Math.round(hoursSinceCreated/sla.response*100)}%)`,
        severity: 'warning'
      });
      result.health = 'warning';
    }
  }

  // Check resolution time for non-done tasks
  if (status !== 'done' && status !== 'completed') {
    if (hoursSinceCreated > sla.resolution) {
      result.violations.push({
        type: 'resolution_sla',
        message: `Resolution SLA breached: ${result.hoursOpen}h > ${sla.resolution}h`,
        severity: 'critical'
      });
      result.health = 'critical';
    } else if (hoursSinceCreated > sla.escalation) {
      result.warnings.push({
        type: 'escalation_warning',
        message: `Escalation threshold: ${result.hoursOpen}h > ${sla.escalation}h`,
        severity: 'warning'
      });
      if (result.health !== 'critical') result.health = 'warning';
    }
  }

  // Check for stale "waiting" status
  if (status === 'waiting' || status === 'blocked') {
    if (hoursSinceCreated > 48) {
      result.warnings.push({
        type: 'stale_blocked',
        message: `Blocked for ${Math.round(hoursSinceCreated)}h - needs attention`,
        severity: 'warning'
      });
      if (result.health !== 'critical') result.health = 'warning';
    }
  }

  return result;
}

// Generate summary statistics
function generateSummary(results) {
  const summary = {
    total: results.length,
    healthy: 0,
    warning: 0,
    critical: 0,
    violations: {
      response: 0,
      resolution: 0,
      total: 0
    },
    byPriority: {
      1: { total: 0, violations: 0 },
      2: { total: 0, violations: 0 },
      3: { total: 0, violations: 0 },
      4: { total: 0, violations: 0 }
    },
    topViolators: []
  };

  results.forEach(r => {
    // Health counts
    summary[r.health]++;

    // Priority counts
    const p = r.priority;
    summary.byPriority[p].total++;
    if (r.violations.length > 0) {
      summary.byPriority[p].violations++;
    }

    // Violation types
    r.violations.forEach(v => {
      summary.violations.total++;
      if (v.type === 'response_sla') summary.violations.response++;
      if (v.type === 'resolution_sla') summary.violations.resolution++;
    });
  });

  // Top violators (sorted by hours over SLA)
  summary.topViolators = results
    .filter(r => r.violations.length > 0)
    .sort((a, b) => b.hoursOpen - a.hoursOpen)
    .slice(0, 5)
    .map(r => ({
      name: r.name,
      priority: r.priorityName,
      hoursOpen: r.hoursOpen,
      violations: r.violations.length
    }));

  return summary;
}

// Format as markdown
function formatMarkdown(results, summary) {
  let output = `## 📊 SLA Monitor Report\n\n`;
  output += `*Generated: ${new Date().toISOString()}*\n\n`;

  // Health overview
  const healthIcon = summary.critical > 0 ? '🔴' :
                     summary.warning > 0 ? '🟡' : '🟢';

  output += `### ${healthIcon} Health Overview\n\n`;
  output += `| Status | Count |\n`;
  output += `|--------|-------|\n`;
  output += `| 🟢 Healthy | ${summary.healthy} |\n`;
  output += `| 🟡 Warning | ${summary.warning} |\n`;
  output += `| 🔴 Critical | ${summary.critical} |\n`;
  output += `| **Total Active** | **${summary.total}** |\n\n`;

  // Violations
  if (summary.violations.total > 0) {
    output += `### ⚠️ SLA Violations\n\n`;
    output += `- Response SLA: ${summary.violations.response}\n`;
    output += `- Resolution SLA: ${summary.violations.resolution}\n`;
    output += `- **Total Violations**: ${summary.violations.total}\n\n`;

    // Top violators
    if (summary.topViolators.length > 0) {
      output += `#### Worst Offenders\n\n`;
      output += `| Task | Priority | Hours Open | Violations |\n`;
      output += `|------|----------|------------|------------|\n`;
      summary.topViolators.forEach(v => {
        output += `| ${v.name.slice(0, 40)} | ${v.priority} | ${v.hoursOpen}h | ${v.violations} |\n`;
      });
      output += '\n';
    }
  } else {
    output += `### ✅ No SLA Violations\n\n`;
    output += `All tasks within SLA parameters.\n\n`;
  }

  // By priority
  output += `### By Priority\n\n`;
  output += `| Priority | Total | Violations | Rate |\n`;
  output += `|----------|-------|------------|------|\n`;
  Object.entries(SLA_DEFINITIONS).forEach(([p, def]) => {
    const stats = summary.byPriority[p];
    const rate = stats.total > 0 ? Math.round(stats.violations / stats.total * 100) : 0;
    output += `| ${def.name} (P${p}) | ${stats.total} | ${stats.violations} | ${rate}% |\n`;
  });
  output += '\n';

  // SLA Reference
  output += `### SLA Reference\n\n`;
  output += `| Priority | Response | Resolution | Escalation |\n`;
  output += `|----------|----------|------------|------------|\n`;
  Object.entries(SLA_DEFINITIONS).forEach(([p, def]) => {
    output += `| ${def.name} (P${p}) | ${def.response}h | ${def.resolution}h | ${def.escalation}h |\n`;
  });

  return output;
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const format = args.find(a => a.startsWith('--format='))?.split('=')[1] || 'markdown';
  const squadFilter = args.find(a => a.startsWith('--squad='))?.split('=')[1];
  const violationsOnly = args.includes('--check-violations');

  // Fetch tasks
  let tasks = await fetchTasks();

  // Filter by squad if specified
  if (squadFilter) {
    tasks = tasks.filter(t =>
      t.folder?.name?.toLowerCase().includes(squadFilter.toLowerCase())
    );
  }

  // Check SLA for each task
  let results = tasks.map(checkTaskSLA);

  // Filter to violations only if requested
  if (violationsOnly) {
    results = results.filter(r => r.violations.length > 0);
  }

  // Generate summary
  const summary = generateSummary(results);

  // Output
  if (format === 'json') {
    console.log(JSON.stringify({ summary, results }, null, 2));
  } else {
    console.log(formatMarkdown(results, summary));
  }

  // Exit code: 1 if critical violations
  process.exit(summary.critical > 0 ? 1 : 0);
}

main().catch(console.error);
