#!/usr/bin/env node
/**
 * Memory Recall - Pre-task memory search
 *
 * Searches institutional memory before starting work.
 * Checks both framework (shared) and project-specific memory.
 *
 * Usage:
 *   node memory-recall.mjs "authentication"
 *   node memory-recall.mjs "supabase auth" --project=traveltech
 *   node memory-recall.mjs "deploy" --scope=framework
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../..');

function loadCurrentProject() {
  const file = path.join(ROOT, '.aios/projects.yaml');
  if (!fs.existsSync(file)) return 'framework';
  const content = fs.readFileSync(file, 'utf-8');
  const match = content.match(/current_project:\s*"?([^"\n]+)"?/);
  return match ? match[1].trim() : 'framework';
}

function searchDir(dir, query, scope) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') || f.endsWith('.yaml'));

  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lower = content.toLowerCase();
    const queryTerms = query.toLowerCase().split(/\s+/);

    // Score: how many query terms match
    const matchCount = queryTerms.filter(t => lower.includes(t)).length;
    if (matchCount === 0) continue;

    // Extract title from first line
    const firstLine = content.split('\n').find(l => l.trim().length > 0) || file;
    const title = firstLine.replace(/^#+\s*/, '').trim();

    // Extract ID if present
    const idMatch = file.match(/(DEC|ERR|TAC)-\d{4}-\d{3}/);

    results.push({
      file: file,
      id: idMatch ? idMatch[0] : null,
      title: title.slice(0, 80),
      scope,
      score: matchCount / queryTerms.length,
      matchCount
    });
  }

  return results;
}

function searchActivityLogs(query, days = 7) {
  const results = [];
  const logDir = path.join(ROOT, '.aios/logs/activity');
  if (!fs.existsSync(logDir)) return results;

  const now = new Date();
  const queryLower = query.toLowerCase();

  for (let i = 0; i < days; i++) {
    const date = new Date(now - i * 86400000).toISOString().split('T')[0];
    const logFile = path.join(logDir, `${date}.jsonl`);
    if (!fs.existsSync(logFile)) continue;

    const lines = fs.readFileSync(logFile, 'utf-8').split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        if (entry.action && entry.action.toLowerCase().includes(queryLower)) {
          results.push({
            date,
            type: entry.type,
            action: entry.action.slice(0, 100),
            tags: entry.tags || []
          });
        }
      } catch (e) { /* skip malformed lines */ }
    }
  }

  return results.slice(0, 5);
}

function recall(query, options = {}) {
  const currentProject = options.project || loadCurrentProject();
  const scopeFilter = options.scope; // 'framework', 'project', or undefined (both)

  const memoryTypes = ['decisions', 'errors', 'tacit'];
  const allResults = [];

  // Search framework memory
  if (!scopeFilter || scopeFilter === 'framework') {
    for (const type of memoryTypes) {
      const dir = path.join(ROOT, '.aios/memory/framework', type);
      allResults.push(...searchDir(dir, query, 'framework'));
    }
  }

  // Search project-specific memory
  if (!scopeFilter || scopeFilter === 'project' || scopeFilter === currentProject) {
    for (const type of memoryTypes) {
      const dir = path.join(ROOT, '.aios/memory/projects', currentProject, type);
      allResults.push(...searchDir(dir, query, currentProject));
    }
  }

  // Search activity logs
  const recentActivity = searchActivityLogs(query);

  // Sort by score (relevance)
  allResults.sort((a, b) => b.score - a.score);
  const topResults = allResults.slice(0, 10);

  // Output
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Memory Recall: "${query}"`);
  console.log(`Scopes: framework${currentProject !== 'framework' ? ` + ${currentProject}` : ''}`);
  console.log(`${'─'.repeat(60)}`);

  if (topResults.length > 0) {
    console.log('\nMemory Entries:');
    topResults.forEach(r => {
      const icon = r.file.startsWith('DEC') ? '📋' :
                   r.file.startsWith('ERR') ? '❌' :
                   r.file.startsWith('TAC') ? '💡' : '📄';
      const relevance = Math.round(r.score * 100);
      console.log(`  ${icon} [${r.scope}] ${r.id || r.file} — ${r.title} (${relevance}% match)`);
    });
  }

  if (recentActivity.length > 0) {
    console.log('\nRecent Activity:');
    recentActivity.forEach(a => {
      console.log(`  🔄 [${a.date}] (${a.type}) ${a.action}`);
    });
  }

  if (topResults.length === 0 && recentActivity.length === 0) {
    console.log('\nNo relevant memory found. Starting fresh.');
  }

  console.log(`\n${'─'.repeat(60)}\n`);

  return { entries: topResults, activity: recentActivity };
}

// CLI
const query = process.argv[2];
if (!query || query.startsWith('--')) {
  console.log(`
Memory Recall - Pre-task memory search (€0)

Usage:
  node memory-recall.mjs "query"                    Search all scopes
  node memory-recall.mjs "query" --project=NAME     Search specific project
  node memory-recall.mjs "query" --scope=framework  Framework only

Examples:
  node memory-recall.mjs "authentication"
  node memory-recall.mjs "supabase" --project=traveltech
  node memory-recall.mjs "deploy" --scope=framework
`);
  process.exit(0);
}

const options = {};
process.argv.slice(3).forEach(arg => {
  if (arg.startsWith('--')) {
    const eqIdx = arg.indexOf('=');
    if (eqIdx > -1) {
      options[arg.slice(2, eqIdx)] = arg.slice(eqIdx + 1);
    }
  }
});

recall(query, options);
