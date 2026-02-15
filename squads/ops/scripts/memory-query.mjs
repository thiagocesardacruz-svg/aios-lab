#!/usr/bin/env node
/**
 * Memory Query - Search decisions, patterns, and tacit knowledge
 *
 * Usage:
 *   node memory-query.mjs decisions [--date=2025-02-11] [--keyword=logging]
 *   node memory-query.mjs patterns [--type=success]
 *   node memory-query.mjs timeline [--month=2025-02]
 *   node memory-query.mjs search "termo"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Simple YAML parser for our specific format (key: value, lists)
function parseSimpleYaml(content) {
  const result = { entries: [], keywords: {}, by_date: {}, by_month: {} };
  let currentEntry = null;
  let currentList = null;
  let currentKey = null;

  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Entry start
    if (trimmed === '- id:' || trimmed.startsWith('- id:')) {
      if (currentEntry) result.entries.push(currentEntry);
      currentEntry = { id: trimmed.split(':')[1]?.trim() || '' };
      currentList = null;
      continue;
    }

    // Inside entry
    if (currentEntry) {
      if (trimmed.startsWith('- ') && currentList) {
        const value = trimmed.slice(2).trim().replace(/^["']|["']$/g, '');
        currentEntry[currentList].push(value);
      } else if (trimmed.includes(':')) {
        const [key, ...valueParts] = trimmed.split(':');
        const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
        const cleanKey = key.trim();

        if (!value) {
          currentEntry[cleanKey] = [];
          currentList = cleanKey;
        } else {
          currentEntry[cleanKey] = value;
          currentList = null;
        }
      }
    }

    // Keywords and indexes (outside entries)
    if (!currentEntry && trimmed.includes(':')) {
      const [key, ...valueParts] = trimmed.split(':');
      const value = valueParts.join(':').trim();
      const cleanKey = key.trim();

      if (value.startsWith('[') && value.endsWith(']')) {
        const items = value.slice(1, -1).split(',').map(s => s.trim());
        result.keywords[cleanKey] = items;
      }
    }
  }

  if (currentEntry) result.entries.push(currentEntry);
  return result;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../..');

// Project-aware: searches framework + project scopes
function getMemoryScopes(options = {}) {
  const scope = options.project || 'all';
  const scopes = [];
  if (scope === 'all' || scope === 'framework') {
    scopes.push({ label: 'framework', decisions: path.join(ROOT, '.aios/memory/framework/decisions'), patterns: path.join(ROOT, '.aios/learning/framework/patterns') });
  }
  if (scope === 'all' || (scope !== 'framework')) {
    const proj = scope === 'all' ? 'traveltech' : scope;
    scopes.push({ label: proj, decisions: path.join(ROOT, `.aios/memory/projects/${proj}/decisions`), patterns: path.join(ROOT, `.aios/learning/projects/${proj}/patterns`) });
  }
  return scopes;
}

// Default paths (framework — backward compat)
const PATHS = {
  decisions: path.join(ROOT, '.aios/memory/framework/decisions'),
  patterns: path.join(ROOT, '.aios/learning/framework/patterns'),
  searchIndex: path.join(ROOT, '.aios/memory/search-index.yaml')
};

function loadYaml(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return parseSimpleYaml(content);
  } catch (e) {
    return null;
  }
}

function listDecisions(options = {}) {
  // Search all scopes (framework + project)
  const scopes = getMemoryScopes(options);
  let entries = [];

  for (const scope of scopes) {
    const indexPath = path.join(scope.decisions, 'index.yaml');
    const index = loadYaml(indexPath);
    if (index && index.entries) {
      entries = entries.concat(index.entries.map(e => ({ ...e, _scope: scope.label })));
    }
  }

  if (entries.length === 0) {
    console.log('No decisions found.');
    return [];
  }

  // Filter by date
  if (options.date) {
    entries = entries.filter(e => e.date === options.date);
  }

  // Filter by month
  if (options.month) {
    entries = entries.filter(e => e.date.startsWith(options.month));
  }

  // Filter by keyword
  if (options.keyword) {
    entries = entries.filter(e =>
      e.keywords && e.keywords.includes(options.keyword.toLowerCase())
    );
  }

  // Filter by category
  if (options.category) {
    entries = entries.filter(e => e.category === options.category);
  }

  console.log('\n📋 Decisions');
  console.log('─'.repeat(60));

  if (entries.length === 0) {
    console.log('No decisions found with the given filters.');
    return [];
  }

  entries.forEach(e => {
    const outcome = { positive: '✅', negative: '❌', neutral: '⚪', pending: '⏳' }[e.outcome] || '?';
    const scope = e._scope ? ` (${e._scope})` : '';
    console.log(`${outcome} [${e.date}] ${e.id}: ${e.title}${scope}`);
    console.log(`   Category: ${e.category} | Participants: ${(e.participants || []).join(', ')}`);
    if (e.keywords) console.log(`   Keywords: ${e.keywords.slice(0, 5).join(', ')}${e.keywords.length > 5 ? '...' : ''}`);
    console.log('');
  });

  console.log(`Total: ${entries.length} decisions\n`);
  return entries;
}

function listPatterns(options = {}) {
  const types = ['success', 'failure', 'efficiency'];
  const type = options.type || 'all';

  console.log('\n🧠 Learning Patterns');
  console.log('─'.repeat(60));

  let total = 0;

  for (const t of types) {
    if (type !== 'all' && type !== t) continue;

    const filePath = path.join(PATHS.patterns, `${t}-patterns.yaml`);
    const data = loadYaml(filePath);

    if (!data || !data.patterns || data.patterns.length === 0) continue;

    console.log(`\n### ${t.charAt(0).toUpperCase() + t.slice(1)} Patterns`);

    data.patterns.forEach(p => {
      const conf = Math.round(p.confidence * 100);
      console.log(`  [${p.id}] (${conf}% confidence)`);
      console.log(`    Trigger: ${p.trigger}`);
      console.log(`    Action: ${p.action.split('\n')[0]}`);
      total++;
    });
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`Total: ${total} patterns\n`);
}

function showTimeline(options = {}) {
  const indexPath = path.join(PATHS.decisions, 'index.yaml');
  const index = loadYaml(indexPath);

  if (!index) {
    console.log('No decisions index found.');
    return;
  }

  console.log('\n📅 Decision Timeline');
  console.log('─'.repeat(60));

  // Group by date
  const byDate = {};
  (index.entries || []).forEach(e => {
    if (!byDate[e.date]) byDate[e.date] = [];
    byDate[e.date].push(e);
  });

  // Filter by month if specified
  const dates = Object.keys(byDate).sort().reverse();
  const filteredDates = options.month
    ? dates.filter(d => d.startsWith(options.month))
    : dates;

  filteredDates.forEach(date => {
    console.log(`\n${date}:`);
    byDate[date].forEach(e => {
      console.log(`  • ${e.id}: ${e.title}`);
    });
  });

  console.log('\n');
}

function search(query) {
  const searchIndex = loadYaml(PATHS.searchIndex);
  const decisionsIndex = loadYaml(path.join(PATHS.decisions, 'index.yaml'));

  if (!searchIndex || !decisionsIndex) {
    console.log('Search indexes not found.');
    return;
  }

  console.log(`\n🔍 Search: "${query}"`);
  console.log('─'.repeat(60));

  const queryLower = query.toLowerCase();
  const results = new Set();

  // Search in keywords
  Object.entries(searchIndex.keywords || {}).forEach(([keyword, ids]) => {
    if (keyword.includes(queryLower)) {
      ids.forEach(id => results.add(id));
    }
  });

  // Search in entry titles and keywords
  (decisionsIndex.entries || []).forEach(e => {
    if (e.title.toLowerCase().includes(queryLower)) {
      results.add(e.id);
    }
    if (e.keywords && e.keywords.some(k => k.includes(queryLower))) {
      results.add(e.id);
    }
  });

  if (results.size === 0) {
    console.log('No results found.');
    return;
  }

  console.log(`Found ${results.size} result(s):\n`);

  results.forEach(id => {
    const entry = decisionsIndex.entries.find(e => e.id === id);
    if (entry) {
      console.log(`📄 ${entry.id}: ${entry.title}`);
      console.log(`   Date: ${entry.date} | Category: ${entry.category}`);
      console.log(`   File: .aios/memory/decisions/${entry.id.toLowerCase()}-*.md`);
      console.log('');
    }
  });
}

function showStats() {
  const decisionsIndex = loadYaml(path.join(PATHS.decisions, 'index.yaml'));
  const searchIndex = loadYaml(PATHS.searchIndex);

  console.log('\n📊 Memory Statistics');
  console.log('─'.repeat(40));
  console.log(`Decisions: ${decisionsIndex?.entries?.length || 0}`);
  console.log(`Keywords indexed: ${Object.keys(searchIndex?.keywords || {}).length}`);

  // Count patterns
  let patternCount = 0;
  ['success', 'failure', 'efficiency'].forEach(type => {
    const data = loadYaml(path.join(PATHS.patterns, `${type}-patterns.yaml`));
    patternCount += data?.patterns?.length || 0;
  });
  console.log(`Patterns: ${patternCount}`);

  // By category
  const byCategory = {};
  (decisionsIndex?.entries || []).forEach(e => {
    byCategory[e.category] = (byCategory[e.category] || 0) + 1;
  });
  console.log('\nBy category:');
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });

  console.log('');
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
  case 'decisions':
    listDecisions(parseOptions(args.slice(1)));
    break;

  case 'patterns':
    listPatterns(parseOptions(args.slice(1)));
    break;

  case 'timeline':
    showTimeline(parseOptions(args.slice(1)));
    break;

  case 'search':
    const query = args[1];
    if (!query) {
      console.log('Usage: node memory-query.mjs search "query"');
      process.exit(1);
    }
    search(query);
    break;

  case 'stats':
    showStats();
    break;

  default:
    console.log(`
Memory Query - Search institutional memory

Commands:
  decisions    List decisions [--date=YYYY-MM-DD] [--month=YYYY-MM] [--keyword=X] [--project=X]
  patterns     List learning patterns [--type=success|failure|efficiency]
  timeline     Show decision timeline [--month=YYYY-MM]
  search "X"   Full-text search across all memory
  stats        Show memory statistics

Scoping:
  --project=all          Search framework + all projects (default)
  --project=framework    Framework only
  --project=traveltech   TravelTech only

Examples:
  node memory-query.mjs decisions --date=2025-02-12
  node memory-query.mjs decisions --project=framework
  node memory-query.mjs decisions --keyword=logging
  node memory-query.mjs patterns --type=success
  node memory-query.mjs timeline
  node memory-query.mjs search "hooks"
  node memory-query.mjs stats
`);
}
