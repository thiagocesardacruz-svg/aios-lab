#!/usr/bin/env node
/**
 * Cost Calculator
 *
 * Calculates and reports costs from Service Order logs.
 * Tracks daily, weekly, and monthly spend against budget limits.
 *
 * Usage:
 *   node cost-calculator.js             # Show current period summary
 *   node cost-calculator.js --daily     # Daily breakdown
 *   node cost-calculator.js --squad     # Breakdown by squad
 *   node cost-calculator.js --category  # Breakdown by cost category
 *   node cost-calculator.js --json      # Output as JSON
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const LOGS_DIR = path.join(ROOT_DIR, 'logs', 'service-orders');

// Budget limits from cost-policy.md
const LIMITS = {
  MONTHLY_EUR: 470,
  DAILY_ALERT_EUR: 15,
  DAILY_HARD_EUR: 20,
  SINGLE_TASK_EUR: 10,
  SUBAGENT_EUR: 5
};

// Cost categories
const CATEGORIES = ['BASE', 'EXEC', 'VRFY', 'RCVR', 'EXTA', 'EXTM', 'DEV_'];
const MODES = ['OP', 'CLIENT', 'DEV'];

/**
 * Load all OS documents
 * @returns {Promise<object[]>}
 */
async function loadAllOs() {
  const docs = [];

  if (!fs.existsSync(LOGS_DIR)) {
    return docs;
  }

  const files = await glob('**/*.yaml', {
    cwd: LOGS_DIR,
    ignore: ['_schema.yaml', '_template.yaml']
  });

  for (const file of files) {
    const filePath = path.join(LOGS_DIR, file);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const doc = yaml.load(content);
      if (doc && doc.os_id) {
        docs.push(doc);
      }
    } catch (err) {
      // Skip files that can't be parsed
    }
  }

  return docs;
}

/**
 * Get cost from an OS document
 * @param {object} os
 * @returns {{ estimated: number, actual: number, category: string, mode: string }}
 */
function getOsCost(os) {
  const cost = os.cost || {};
  return {
    estimated: cost.estimated_eur || 0,
    actual: cost.actual_eur || cost.estimated_eur || 0,
    category: cost.category || 'EXEC',
    mode: cost.mode || 'OP'
  };
}

/**
 * Parse date string to Date object
 * @param {string} dateStr
 * @returns {Date | null}
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Get date key (YYYY-MM-DD) from Date
 * @param {Date} date
 * @returns {string}
 */
function getDateKey(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Calculate cost summaries
 * @param {object[]} osList
 * @returns {object}
 */
function calculateCosts(osList) {
  const now = new Date();
  const today = getDateKey(now);
  const thisMonth = today.substring(0, 7); // YYYY-MM

  const summary = {
    total: { estimated: 0, actual: 0, count: 0 },
    today: { estimated: 0, actual: 0, count: 0 },
    thisMonth: { estimated: 0, actual: 0, count: 0 },
    byDate: {},
    bySquad: {},
    byCategory: {},
    byMode: {}
  };

  // Initialize categories and modes
  for (const cat of CATEGORIES) {
    summary.byCategory[cat] = { estimated: 0, actual: 0, count: 0 };
  }
  for (const mode of MODES) {
    summary.byMode[mode] = { estimated: 0, actual: 0, count: 0 };
  }

  for (const os of osList) {
    const cost = getOsCost(os);
    const date = parseDate(os.created_at);
    const dateKey = date ? getDateKey(date) : 'unknown';

    // Total
    summary.total.estimated += cost.estimated;
    summary.total.actual += cost.actual;
    summary.total.count++;

    // By date
    if (!summary.byDate[dateKey]) {
      summary.byDate[dateKey] = { estimated: 0, actual: 0, count: 0 };
    }
    summary.byDate[dateKey].estimated += cost.estimated;
    summary.byDate[dateKey].actual += cost.actual;
    summary.byDate[dateKey].count++;

    // Today
    if (dateKey === today) {
      summary.today.estimated += cost.estimated;
      summary.today.actual += cost.actual;
      summary.today.count++;
    }

    // This month
    if (dateKey.startsWith(thisMonth)) {
      summary.thisMonth.estimated += cost.estimated;
      summary.thisMonth.actual += cost.actual;
      summary.thisMonth.count++;
    }

    // By squad
    const squad = os.squad || 'unknown';
    if (!summary.bySquad[squad]) {
      summary.bySquad[squad] = { estimated: 0, actual: 0, count: 0 };
    }
    summary.bySquad[squad].estimated += cost.estimated;
    summary.bySquad[squad].actual += cost.actual;
    summary.bySquad[squad].count++;

    // By category
    if (summary.byCategory[cost.category]) {
      summary.byCategory[cost.category].estimated += cost.estimated;
      summary.byCategory[cost.category].actual += cost.actual;
      summary.byCategory[cost.category].count++;
    }

    // By mode
    if (summary.byMode[cost.mode]) {
      summary.byMode[cost.mode].estimated += cost.estimated;
      summary.byMode[cost.mode].actual += cost.actual;
      summary.byMode[cost.mode].count++;
    }
  }

  return summary;
}

/**
 * Check budget alerts
 * @param {object} summary
 * @returns {string[]}
 */
function checkAlerts(summary) {
  const alerts = [];

  if (summary.today.actual >= LIMITS.DAILY_HARD_EUR) {
    alerts.push(`CRITICAL: Daily spend (€${summary.today.actual.toFixed(2)}) exceeds hard limit (€${LIMITS.DAILY_HARD_EUR}). SAFE MODE should be active.`);
  } else if (summary.today.actual >= LIMITS.DAILY_ALERT_EUR) {
    alerts.push(`WARNING: Daily spend (€${summary.today.actual.toFixed(2)}) exceeds alert threshold (€${LIMITS.DAILY_ALERT_EUR}).`);
  }

  if (summary.thisMonth.actual >= LIMITS.MONTHLY_EUR) {
    alerts.push(`CRITICAL: Monthly spend (€${summary.thisMonth.actual.toFixed(2)}) exceeds limit (€${LIMITS.MONTHLY_EUR}).`);
  } else if (summary.thisMonth.actual >= LIMITS.MONTHLY_EUR * 0.8) {
    alerts.push(`WARNING: Monthly spend (€${summary.thisMonth.actual.toFixed(2)}) is at 80%+ of limit (€${LIMITS.MONTHLY_EUR}).`);
  }

  return alerts;
}

/**
 * Format currency
 * @param {number} value
 * @returns {string}
 */
function formatEur(value) {
  return `€${value.toFixed(2)}`;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const showDaily = args.includes('--daily');
  const showSquad = args.includes('--squad');
  const showCategory = args.includes('--category');
  const jsonOutput = args.includes('--json');

  const osList = await loadAllOs();
  const summary = calculateCosts(osList);
  const alerts = checkAlerts(summary);

  if (jsonOutput) {
    console.log(JSON.stringify({
      limits: LIMITS,
      summary,
      alerts
    }, null, 2));
    return;
  }

  // Header
  console.log('=== AIOS Cost Report ===\n');

  // Alerts
  if (alerts.length > 0) {
    console.log('ALERTS:');
    for (const alert of alerts) {
      console.log(`  ${alert}`);
    }
    console.log('');
  }

  // Current period
  console.log('CURRENT PERIOD:');
  console.log(`  Today:      ${formatEur(summary.today.actual)} / ${formatEur(LIMITS.DAILY_HARD_EUR)} (${summary.today.count} OS)`);
  console.log(`  This Month: ${formatEur(summary.thisMonth.actual)} / ${formatEur(LIMITS.MONTHLY_EUR)} (${summary.thisMonth.count} OS)`);
  console.log(`  All Time:   ${formatEur(summary.total.actual)} (${summary.total.count} OS)`);
  console.log('');

  // Daily breakdown
  if (showDaily) {
    console.log('DAILY BREAKDOWN:');
    const dates = Object.keys(summary.byDate).sort().reverse().slice(0, 14);
    for (const date of dates) {
      const data = summary.byDate[date];
      console.log(`  ${date}: ${formatEur(data.actual)} (${data.count} OS)`);
    }
    console.log('');
  }

  // Squad breakdown
  if (showSquad) {
    console.log('BY SQUAD:');
    const squads = Object.entries(summary.bySquad)
      .sort((a, b) => b[1].actual - a[1].actual);
    for (const [squad, data] of squads) {
      if (data.count > 0) {
        console.log(`  ${squad.padEnd(12)}: ${formatEur(data.actual)} (${data.count} OS)`);
      }
    }
    console.log('');
  }

  // Category breakdown
  if (showCategory) {
    console.log('BY CATEGORY:');
    for (const cat of CATEGORIES) {
      const data = summary.byCategory[cat];
      if (data.count > 0) {
        console.log(`  ${cat.padEnd(6)}: ${formatEur(data.actual)} (${data.count} OS)`);
      }
    }
    console.log('');

    console.log('BY MODE:');
    for (const mode of MODES) {
      const data = summary.byMode[mode];
      if (data.count > 0) {
        console.log(`  ${mode.padEnd(8)}: ${formatEur(data.actual)} (${data.count} OS)`);
      }
    }
    console.log('');
  }

  // Budget status
  const monthlyPercent = (summary.thisMonth.actual / LIMITS.MONTHLY_EUR * 100).toFixed(1);
  const dailyPercent = (summary.today.actual / LIMITS.DAILY_HARD_EUR * 100).toFixed(1);

  console.log('BUDGET STATUS:');
  console.log(`  Monthly: ${monthlyPercent}% used`);
  console.log(`  Daily:   ${dailyPercent}% used`);

  if (alerts.length > 0) {
    process.exit(1);
  }
}

main();
