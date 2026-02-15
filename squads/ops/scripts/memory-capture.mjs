#!/usr/bin/env node
/**
 * Memory Capture - Auto-capture to institutional memory
 *
 * Called by:
 *   - Git post-commit hook
 *   - clickup-sync.mjs (done command)
 *   - Session end hook
 *
 * All captures are deterministic (€0). Keywords detected → entry created.
 *
 * Usage:
 *   node memory-capture.mjs git --message="feat: ..." --files="a.ts,b.ts" --sha="abc123"
 *   node memory-capture.mjs clickup --task-id=123 --summary="Fixed X" --project=traveltech
 *   node memory-capture.mjs session --summary="Implemented auth flow"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../..');

// ── Project scoping ──────────────────────────────────────

function loadProjects() {
  const file = path.join(ROOT, '.aios/projects.yaml');
  if (!fs.existsSync(file)) return { current_project: 'framework', clickup_mapping: { options: {} } };

  // Simple YAML parse for our format
  const content = fs.readFileSync(file, 'utf-8');
  const result = { current_project: 'framework', clickup_mapping: { options: {} } };

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('current_project:')) {
      result.current_project = trimmed.split(':').slice(1).join(':').trim().replace(/"/g, '');
    }
    // Parse clickup mapping options (simple key: value in options block)
    if (trimmed.startsWith('"') && trimmed.includes('":')) {
      const match = trimmed.match(/"([^"]+)":\s*"([^"]+)"/);
      if (match) {
        result.clickup_mapping.options[match[1]] = match[2];
      }
    }
  }
  return result;
}

function resolveScope(options = {}) {
  const projects = loadProjects();

  // Explicit project
  if (options.project) {
    return options.project === 'framework' ? 'framework' : `projects/${options.project}`;
  }

  // ClickUp project name mapping
  if (options.clickupProject) {
    const mapped = projects.clickup_mapping.options[options.clickupProject];
    if (mapped) return mapped === 'framework' ? 'framework' : `projects/${mapped}`;
  }

  // Default to current project
  const current = projects.current_project || 'framework';
  return current === 'framework' ? 'framework' : `projects/${current}`;
}

// ── Activity logging ─────────────────────────────────────

function logActivity(entry) {
  const today = new Date().toISOString().split('T')[0];
  const logDir = path.join(ROOT, '.aios/logs/activity');
  fs.mkdirSync(logDir, { recursive: true });

  const logFile = path.join(logDir, `${today}.jsonl`);
  const full = { timestamp: new Date().toISOString(), ...entry };
  fs.appendFileSync(logFile, JSON.stringify(full) + '\n');
}

// ── Decision capture ─────────────────────────────────────

const DECISION_KEYWORDS = [
  'decision', 'decided', 'chose', 'selected', 'adopted', 'switched',
  'decisão', 'decidimos', 'escolhemos', 'optamos', 'adotamos',
  'breaking', 'architecture', 'migration'
];

const ERROR_KEYWORDS = [
  'error', 'bug', 'fix', 'fixed', 'issue', 'crash', 'fail', 'broke',
  'erro', 'bug', 'corrigir', 'corrigido', 'falha', 'quebrou'
];

const TACIT_KEYWORDS = [
  'always', 'never', 'must', 'avoid', 'prefer', 'tip', 'trick', 'gotcha',
  'sempre', 'nunca', 'deve', 'evitar', 'preferir', 'dica', 'cuidado'
];

function detectType(text) {
  const lower = text.toLowerCase();
  if (DECISION_KEYWORDS.some(k => lower.includes(k))) return 'decision';
  if (ERROR_KEYWORDS.some(k => lower.includes(k))) return 'error';
  if (TACIT_KEYWORDS.some(k => lower.includes(k))) return 'tacit';
  return null;
}

function generateId(type, scope) {
  const prefix = { decision: 'DEC', error: 'ERR', tacit: 'TAC' }[type];
  const year = new Date().getFullYear();
  const dir = path.join(ROOT, '.aios/memory', scope, `${type}s`);
  fs.mkdirSync(dir, { recursive: true });

  const existing = fs.readdirSync(dir).filter(f => f.startsWith(`${prefix}-${year}`));
  const num = String(existing.length + 1).padStart(3, '0');
  return `${prefix}-${year}-${num}`;
}

function createMemoryEntry(type, scope, data) {
  const id = generateId(type, scope);
  const date = new Date().toISOString().split('T')[0];
  const dir = path.join(ROOT, '.aios/memory', scope, `${type}s`);

  // Create markdown entry
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);

  const mdContent = `# ${id}: ${data.title}

**Date:** ${date}
**Source:** ${data.source}
**Scope:** ${scope}
**Auto-captured:** true

## Context

${data.context || data.summary || 'Auto-captured from ' + data.source}

## Details

${data.details || ''}

${data.files ? `## Files\n${data.files.map(f => `- \`${f}\``).join('\n')}` : ''}
${data.sha ? `\n## Git\nCommit: \`${data.sha}\`` : ''}
${data.taskId ? `\n## ClickUp\nTask: \`${data.taskId}\`` : ''}

---
*Auto-captured by memory-capture.mjs*
`;

  fs.writeFileSync(path.join(dir, `${id}-${slug}.md`), mdContent);

  // Update index.yaml (append entry)
  const indexPath = path.join(dir, 'index.yaml');
  const indexEntry = `
  - id: ${id}
    title: "${data.title}"
    date: "${date}"
    category: ${data.category || 'technical'}
    source: ${data.source}
    scope: ${scope}
    auto_captured: true
    participants:
      - "${data.agent || '@aios-master'}"
    keywords:
      ${(data.keywords || []).map(k => `- ${k}`).join('\n      ')}
    outcome: ${data.outcome || 'neutral'}
    superseded_by: null
    related: []
`;

  if (fs.existsSync(indexPath)) {
    fs.appendFileSync(indexPath, indexEntry);
  }

  return id;
}

// ── Git commit capture ───────────────────────────────────

function captureGit(options) {
  const message = options.message || '';
  const files = (options.files || '').split(',').filter(Boolean);
  const sha = options.sha || '';
  const scope = resolveScope(options);

  const type = detectType(message);
  if (!type) {
    // Still log the activity even if no memory entry
    logActivity({
      type: 'git-commit',
      action: message.slice(0, 200),
      tags: ['git', scope],
      metadata: { sha, files_count: files.length }
    });
    return;
  }

  // Extract title from commit message (first line)
  const title = message.split('\n')[0].slice(0, 100);

  const keywords = [];
  // Extract from conventional commit prefix
  const prefixMatch = message.match(/^(feat|fix|docs|chore|refactor|test|style)(\(([^)]+)\))?:/);
  if (prefixMatch) {
    keywords.push(prefixMatch[1]);
    if (prefixMatch[3]) keywords.push(prefixMatch[3]);
  }
  // Extract from file paths
  files.slice(0, 5).forEach(f => {
    const parts = f.split('/');
    if (parts.length > 1) keywords.push(parts[parts.length - 2]);
  });

  const id = createMemoryEntry(type, scope, {
    title,
    source: 'git-commit',
    summary: message,
    context: message,
    details: `Commit \`${sha}\` with ${files.length} file(s) changed.`,
    files,
    sha,
    keywords: [...new Set(keywords)],
    category: type === 'error' ? 'technical' : 'architectural'
  });

  logActivity({
    type: `memory-${type}`,
    action: `Auto-captured ${type}: ${id} — ${title}`,
    tags: ['auto-captured', 'git', scope],
    metadata: { memory_id: id, sha }
  });

  console.log(`  Memory: ${id} (${type}, ${scope})`);
}

// ── ClickUp task done capture ────────────────────────────

function captureClickUp(options) {
  const taskId = options['task-id'] || options.taskId || '';
  const summary = options.summary || '';
  const scope = resolveScope(options);

  const type = detectType(summary);

  // Always log the activity
  logActivity({
    type: 'task-done',
    action: `Task ${taskId} completed: ${summary.slice(0, 200)}`,
    tags: ['clickup', scope],
    metadata: { task_id: taskId }
  });

  if (!type) return;

  const title = summary.split('\n')[0].slice(0, 100);

  // Extract keywords from summary
  const keywords = [];
  const words = summary.toLowerCase().split(/\s+/);
  const stopWords = new Set(['the', 'a', 'an', 'is', 'was', 'were', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'de', 'da', 'do', 'em', 'no', 'na', 'para', 'com', 'que', 'um', 'uma', 'os', 'as']);
  words.forEach(w => {
    const clean = w.replace(/[^a-z0-9-]/g, '');
    if (clean.length > 3 && !stopWords.has(clean)) keywords.push(clean);
  });

  const id = createMemoryEntry(type, scope, {
    title,
    source: 'clickup-done',
    summary,
    context: summary,
    details: `ClickUp task \`${taskId}\` completed.`,
    taskId,
    keywords: [...new Set(keywords)].slice(0, 10),
    category: type === 'error' ? 'technical' : 'process',
    outcome: type === 'error' ? 'negative' : 'positive'
  });

  logActivity({
    type: `memory-${type}`,
    action: `Auto-captured ${type}: ${id} — ${title}`,
    tags: ['auto-captured', 'clickup', scope],
    metadata: { memory_id: id, task_id: taskId }
  });

  console.log(`  Memory: ${id} (${type}, ${scope})`);
}

// ── Session end capture ──────────────────────────────────

function captureSession(options) {
  const summary = options.summary || '';
  const scope = resolveScope(options);

  logActivity({
    type: 'session-end',
    action: summary.slice(0, 200) || 'Session ended',
    tags: ['session', scope],
    metadata: {}
  });

  const type = detectType(summary);
  if (!type || !summary) return;

  const title = summary.split('\n')[0].slice(0, 100);

  const id = createMemoryEntry(type, scope, {
    title,
    source: 'session-end',
    summary,
    context: summary,
    details: 'Captured at session end.',
    keywords: [],
    category: 'process'
  });

  console.log(`  Memory: ${id} (${type}, ${scope})`);
}

// ── CLI ──────────────────────────────────────────────────

const command = process.argv[2];
const options = {};
process.argv.slice(3).forEach(arg => {
  if (arg.startsWith('--')) {
    const eqIdx = arg.indexOf('=');
    if (eqIdx > -1) {
      options[arg.slice(2, eqIdx)] = arg.slice(eqIdx + 1);
    } else {
      options[arg.slice(2)] = true;
    }
  }
});

switch (command) {
  case 'git':
    captureGit(options);
    break;
  case 'clickup':
    captureClickUp(options);
    break;
  case 'session':
    captureSession(options);
    break;
  default:
    console.log(`
Memory Capture - Auto-capture to institutional memory (€0)

Commands:
  git       Capture from git commit
  clickup   Capture from ClickUp task done
  session   Capture from session end

Options:
  --message=MSG          Commit message (git)
  --files=a.ts,b.ts      Changed files (git)
  --sha=abc123           Commit SHA (git)
  --task-id=ID           ClickUp task ID (clickup)
  --summary=TEXT         Summary text (clickup, session)
  --project=NAME         Explicit scope (traveltech, framework)
  --clickup-project=NAME ClickUp project name for mapping

Examples:
  node memory-capture.mjs git --message="DECISION: use Redis" --sha=abc123
  node memory-capture.mjs clickup --task-id=123 --summary="Fixed auth bug"
  node memory-capture.mjs session --summary="Implemented login flow"
`);
}
