#!/usr/bin/env node
/**
 * Quick Log - Minimal overhead activity logging
 *
 * Usage:
 *   node log.mjs "Decisão: usar JSONL para logs"
 *   node log.mjs "Implementado sistema de memory" --files=a.ts,b.ts
 *   node log.mjs "Bug no auth resolvido" --type=error
 *
 * Alias suggestion: Add to package.json scripts or create batch file
 *   alog "mensagem"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../..');
const LOG_DIR = path.join(ROOT, '.aios/logs/activity');

// Ensure dir
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

const today = new Date().toISOString().split('T')[0];
const logFile = path.join(LOG_DIR, `${today}.jsonl`);

// Parse args
const args = process.argv.slice(2);
const message = args.find(a => !a.startsWith('--'));
const options = {};
args.filter(a => a.startsWith('--')).forEach(a => {
  const [k, v] = a.slice(2).split('=');
  options[k] = v || true;
});

if (!message) {
  console.log('Usage: node log.mjs "message" [--type=TYPE] [--files=a,b] [--tags=x,y]');
  process.exit(1);
}

// Auto-detect type from keywords
let type = options.type || 'action';
const msgLower = message.toLowerCase();
if (/decid|escolh|opt|defin|chose|select/.test(msgLower)) type = 'decision';
if (/erro|error|bug|fix|fail/.test(msgLower)) type = 'error';
if (/implement|criei|create|add/.test(msgLower)) type = 'implementation';

const entry = {
  timestamp: new Date().toISOString(),
  action: message,
  type: type,
  tags: options.tags ? options.tags.split(',') : [],
  files: options.files ? options.files.split(',') : [],
  agent: options.agent || null,
  metadata: {}
};

fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');
const time = entry.timestamp.split('T')[1].split('.')[0];
const icon = { decision: '🎯', error: '❌', implementation: '🔧', action: '▶️' }[type] || '📝';
console.log(`${icon} [${time}] ${type}: ${message.slice(0, 60)}${message.length > 60 ? '...' : ''}`);
