#!/usr/bin/env node
/**
 * Activity Logger - Zero-cost activity capture
 *
 * Append-only log of all actions. NO AI processing.
 * Processing happens in batch via daily-digest.mjs
 *
 * Usage:
 *   node activity-logger.mjs log "action" --type=decision --tags=tag1,tag2
 *   node activity-logger.mjs log "action" --files=file1.ts,file2.ts
 *   node activity-logger.mjs view [--today|--date=2025-02-12]
 *   node activity-logger.mjs stats
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../..');
const LOGS_DIR = path.join(ROOT, '.aios/logs/activity');

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

function getLogFile(date = new Date()) {
  const dateStr = date.toISOString().split('T')[0];
  return path.join(LOGS_DIR, `${dateStr}.jsonl`);
}

function log(action, options = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    action: action,
    type: options.type || 'action',
    tags: options.tags ? options.tags.split(',').map(t => t.trim()) : [],
    files: options.files ? options.files.split(',').map(f => f.trim()) : [],
    agent: options.agent || null,
    session: process.env.CLAUDE_SESSION_ID || null,
    metadata: {}
  };

  // Auto-detect decision keywords
  const decisionKeywords = ['decidimos', 'escolhemos', 'decided', 'chose', 'optamos', 'definimos'];
  if (decisionKeywords.some(k => action.toLowerCase().includes(k))) {
    entry.type = 'decision';
    entry.tags.push('auto-detected-decision');
  }

  // Auto-detect error keywords
  const errorKeywords = ['erro', 'error', 'falhou', 'failed', 'bug', 'fix'];
  if (errorKeywords.some(k => action.toLowerCase().includes(k))) {
    entry.type = 'error';
    entry.tags.push('auto-detected-error');
  }

  const logFile = getLogFile();
  fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');

  console.log(`✅ Logged: ${entry.type} at ${entry.timestamp.split('T')[1].split('.')[0]}`);
  return entry;
}

function view(options = {}) {
  let date;
  if (options.today) {
    date = new Date();
  } else if (options.date) {
    date = new Date(options.date);
  } else {
    date = new Date();
  }

  const logFile = getLogFile(date);
  if (!fs.existsSync(logFile)) {
    console.log(`No logs for ${date.toISOString().split('T')[0]}`);
    return [];
  }

  const lines = fs.readFileSync(logFile, 'utf-8').split('\n').filter(Boolean);
  const entries = lines.map(line => JSON.parse(line));

  console.log(`\n📋 Activity Log - ${date.toISOString().split('T')[0]}`);
  console.log('─'.repeat(60));

  entries.forEach((entry, i) => {
    const time = entry.timestamp.split('T')[1].split('.')[0];
    const typeIcon = {
      'decision': '🎯',
      'error': '❌',
      'action': '▶️',
      'learning': '🧠',
      'implementation': '🔧'
    }[entry.type] || '📝';

    console.log(`${time} ${typeIcon} [${entry.type}] ${entry.action}`);
    if (entry.tags.length) console.log(`         Tags: ${entry.tags.join(', ')}`);
    if (entry.files.length) console.log(`         Files: ${entry.files.join(', ')}`);
  });

  console.log('─'.repeat(60));
  console.log(`Total: ${entries.length} entries\n`);

  return entries;
}

function stats() {
  const files = fs.readdirSync(LOGS_DIR).filter(f => f.endsWith('.jsonl'));

  let totalEntries = 0;
  let byType = {};
  let byDate = {};

  files.forEach(file => {
    const date = file.replace('.jsonl', '');
    const lines = fs.readFileSync(path.join(LOGS_DIR, file), 'utf-8').split('\n').filter(Boolean);

    byDate[date] = lines.length;
    totalEntries += lines.length;

    lines.forEach(line => {
      const entry = JSON.parse(line);
      byType[entry.type] = (byType[entry.type] || 0) + 1;
    });
  });

  console.log('\n📊 Activity Log Stats');
  console.log('─'.repeat(40));
  console.log(`Total entries: ${totalEntries}`);
  console.log(`Days logged: ${files.length}`);
  console.log('\nBy type:');
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
  console.log('\nRecent days:');
  Object.entries(byDate).slice(-5).forEach(([date, count]) => {
    console.log(`  ${date}: ${count} entries`);
  });
  console.log('');

  return { totalEntries, byType, byDate };
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

function parseOptions(args) {
  const options = {};
  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      options[key] = value || true;
    }
  });
  return options;
}

switch (command) {
  case 'log':
    const action = args[1];
    if (!action) {
      console.error('Usage: node activity-logger.mjs log "action description" [--type=TYPE] [--tags=tag1,tag2]');
      process.exit(1);
    }
    log(action, parseOptions(args.slice(2)));
    break;

  case 'view':
    view(parseOptions(args.slice(1)));
    break;

  case 'stats':
    stats();
    break;

  default:
    console.log(`
Activity Logger - Zero-cost activity capture

Commands:
  log "action"    Log an action (auto-detects decisions/errors)
  view            View today's log (--date=YYYY-MM-DD for specific date)
  stats           Show statistics

Options for log:
  --type=TYPE     Type: action, decision, error, learning, implementation
  --tags=a,b      Comma-separated tags
  --files=a,b     Comma-separated files involved
  --agent=@dev    Agent that performed action

Examples:
  node activity-logger.mjs log "Implementamos sistema de logging"
  node activity-logger.mjs log "Decidimos usar JSONL para logs" --type=decision
  node activity-logger.mjs log "Fixed auth bug" --type=error --files=auth.ts
  node activity-logger.mjs view --today
`);
}

export { log, view, stats };
