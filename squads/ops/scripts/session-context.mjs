#!/usr/bin/env node
/**
 * Session Context - Quick startup context for Claude Code sessions
 *
 * Shows:
 * - Budget status (daily/monthly)
 * - Open ClickUp tasks (AI OPS)
 * - Infra health (Clawdbot)
 *
 * Features:
 * - 15-min cache with TTL
 * - 3s timeout for API calls
 * - Graceful degradation on failures
 * - Zero external dependencies
 *
 * Usage:
 *   node session-context.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Constants (reuse from clickup-sync.mjs)
const CLICKUP_API = 'https://api.clickup.com/api/v2';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';
const TEAM_ID = '90152366829';
const AI_OPS_SPACE_ID = '901510017091';

// IDs
const IDS = {
  fields: {
    AGENT: '743649c2-7132-4e65-9370-a161e7719949'
  }
};

// Budget limits
const BUDGET_LIMITS = {
  daily: 20,    // €20
  monthly: 468  // €468
};

// Cache config
const CACHE_DIR = join(__dirname, '../../../.aios/cache');
const CACHE_FILE = join(CACHE_DIR, 'session-context-cache.json');
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// Budget data file
const BUDGET_FILE = join(__dirname, '../data/command-center-data.json');

// API helper with timeout
async function api(endpoint, timeout = 3000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${CLICKUP_API}${endpoint}`, {
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Timeout');
    }
    throw err;
  }
}

// Load cache
function loadCache() {
  if (!existsSync(CACHE_FILE)) return null;

  try {
    const cache = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
    const age = Date.now() - cache.timestamp;

    if (age < CACHE_TTL) {
      return cache.data;
    }
    return null; // Expired
  } catch (err) {
    return null;
  }
}

// Save cache
function saveCache(data) {
  try {
    if (!existsSync(CACHE_DIR)) {
      mkdirSync(CACHE_DIR, { recursive: true });
    }

    const cache = {
      timestamp: Date.now(),
      data
    };

    writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (err) {
    // Silent fail - cache is optional
  }
}

// Get budget data
function getBudget() {
  if (!existsSync(BUDGET_FILE)) {
    return { daily: 0, monthly: 0 };
  }

  try {
    const data = JSON.parse(readFileSync(BUDGET_FILE, 'utf-8'));
    const today = new Date().toISOString().split('T')[0];
    const month = today.substring(0, 7);

    const dailyData = data.dailyUsage?.[today] || { cost: 0 };
    const monthlyData = data.monthlyUsage?.[month] || { cost: 0 };

    return {
      daily: dailyData.cost || 0,
      monthly: monthlyData.cost || 0
    };
  } catch (err) {
    return { daily: 0, monthly: 0 };
  }
}

// Get open tasks from ClickUp
async function getOpenTasks() {
  const params = new URLSearchParams({
    'space_ids[]': AI_OPS_SPACE_ID,
    include_closed: 'false',
    order_by: 'updated',
    reverse: 'true',
    page: '0'
  });

  const result = await api(`/team/${TEAM_ID}/task?${params.toString()}`);

  if (result.err) {
    throw new Error(result.err);
  }

  // Filter to active statuses and take top 5
  const tasks = (result.tasks || [])
    .filter(t => {
      const status = t.status?.status || '';
      return ['to do', 'in progress', 'waiting'].includes(status);
    })
    .slice(0, 5);

  return tasks.map(t => {
    // Extract agent
    const agentField = t.custom_fields?.find(f => f.id === IDS.fields.AGENT);
    let agentLabel = '-';
    if (agentField?.value != null) {
      const opts = agentField.type_config?.options || [];
      const val = String(agentField.value);
      const opt = opts.find(o => o.id === val) || opts.find(o => String(o.orderindex) === val);
      agentLabel = opt?.label || opt?.name || val.substring(0, 16);
    }

    return {
      id: t.id,
      name: t.name,
      status: t.status?.status || '-',
      agent: agentLabel
    };
  });
}

// Check Clawdbot status
function getClawdbotStatus() {
  try {
    const output = execSync('systemctl is-active clawdbot 2>/dev/null', {
      encoding: 'utf-8',
      timeout: 1000
    }).trim();
    return output === 'active';
  } catch (err) {
    return false;
  }
}

// Format output
function formatOutput(data) {
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const budget = data.budget;
  const tasks = data.tasks;
  const clawdbot = data.clawdbot;

  console.log(`📋 Session Context | ${now} UTC`);
  console.log(`💰 Budget: €${budget.daily.toFixed(2)} / €${BUDGET_LIMITS.daily} daily | €${budget.monthly.toFixed(2)} / €${BUDGET_LIMITS.monthly} monthly`);

  // Task summary
  const inProgress = tasks.filter(t => t.status === 'in progress').length;
  const toDo = tasks.filter(t => t.status === 'to do').length;
  const waiting = tasks.filter(t => t.status === 'waiting').length;

  console.log(`📌 Open: ${tasks.length} tasks (${inProgress} in_progress, ${toDo} to_do, ${waiting} waiting)`);

  if (tasks.length > 0) {
    tasks.forEach(t => {
      console.log(`  → ${t.id} - [${t.status}] ${t.name} (${t.agent})`);
    });
  }

  console.log(`🖥️  Infra: Clawdbot ${clawdbot ? '✅' : '❌'}`);
}

// Main
async function main() {
  try {
    // Try to load from cache first
    const cached = loadCache();
    if (cached) {
      formatOutput(cached);
      return;
    }

    // Fetch fresh data
    const data = {
      budget: getBudget(),
      tasks: [],
      clawdbot: false
    };

    // Get tasks (with fallback to cache on failure)
    try {
      data.tasks = await getOpenTasks();
    } catch (err) {
      // Try to use stale cache
      const staleCache = loadCache();
      if (staleCache) {
        console.warn('⚠️  ClickUp API unavailable, using cached data');
        data.tasks = staleCache.tasks;
      } else {
        console.warn('⚠️  ClickUp API unavailable, no cache available');
        data.tasks = [];
      }
    }

    // Get Clawdbot status (non-blocking)
    data.clawdbot = getClawdbotStatus();

    // Save to cache
    saveCache(data);

    // Output
    formatOutput(data);

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main().catch(console.error);
