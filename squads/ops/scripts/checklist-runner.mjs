#!/usr/bin/env node
/**
 * Checklist Runner - Deterministic checklist validation (NO AI needed)
 *
 * Replaces AI agents in run-checklist.yaml workflow
 * Parses markdown checklists, validates items, generates pass/fail report
 *
 * Usage:
 *   node checklist-runner.mjs --checklist=path/to/checklist.md
 *   node checklist-runner.mjs --checklist=qa/release-readiness --artifact=./docs/release.md
 *   node checklist-runner.mjs --checklist=finance/expense-approval --interactive
 *   node checklist-runner.mjs --list                              # List all checklists
 *   node checklist-runner.mjs --format=json
 *
 * Checklist Format:
 *   - Items in tables: | # | Check | Pass Criteria | Severity |
 *   - Severity: 🔴 (critical/blocking), 🟡 (warning), 🟢 (info)
 *   - Gate rules parsed from "## Gate Rule" section
 *
 * Cost: €0 (deterministic, no AI)
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import * as readline from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '../../..');
const SQUADS_DIR = join(PROJECT_ROOT, 'squads');

// Severity mapping
const SEVERITY = {
  '🔴': { level: 'critical', weight: 3, blocks: true },
  '🟡': { level: 'warning', weight: 2, blocks: false },
  '🟢': { level: 'info', weight: 1, blocks: false },
  'critical': { level: 'critical', weight: 3, blocks: true },
  'warning': { level: 'warning', weight: 2, blocks: false },
  'info': { level: 'info', weight: 1, blocks: false }
};

// Find checklist file
function findChecklist(path) {
  // Direct path
  if (existsSync(path)) return path;

  // Relative to project root
  const fromRoot = join(PROJECT_ROOT, path);
  if (existsSync(fromRoot)) return fromRoot;

  // squad/checklist-name format
  if (path.includes('/') && !path.endsWith('.md')) {
    const [squad, name] = path.split('/');
    const checklistPath = join(SQUADS_DIR, squad, 'checklists', `${name}.md`);
    if (existsSync(checklistPath)) return checklistPath;
  }

  // Search in all squads
  const squads = readdirSync(SQUADS_DIR).filter(d =>
    existsSync(join(SQUADS_DIR, d, 'checklists'))
  );

  for (const squad of squads) {
    const checklistDir = join(SQUADS_DIR, squad, 'checklists');
    const files = readdirSync(checklistDir);
    const match = files.find(f =>
      f === path ||
      f === `${path}.md` ||
      f.includes(path)
    );
    if (match) return join(checklistDir, match);
  }

  return null;
}

// List all available checklists
function listChecklists() {
  const checklists = [];

  const squads = readdirSync(SQUADS_DIR).filter(d => {
    const checklistDir = join(SQUADS_DIR, d, 'checklists');
    return existsSync(checklistDir);
  });

  for (const squad of squads) {
    const checklistDir = join(SQUADS_DIR, squad, 'checklists');
    const files = readdirSync(checklistDir).filter(f => f.endsWith('.md'));

    files.forEach(f => {
      checklists.push({
        squad,
        name: f.replace('.md', ''),
        path: `${squad}/${f.replace('.md', '')}`,
        fullPath: join(checklistDir, f)
      });
    });
  }

  return checklists;
}

// Parse checklist markdown
function parseChecklist(content) {
  const lines = content.split('\n');
  const checklist = {
    id: null,
    name: null,
    squad: null,
    type: null,
    items: [],
    gateRule: null,
    sections: []
  };

  let currentSection = null;
  let inTable = false;
  let tableHeaders = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Parse meta section
    if (line.startsWith('- **ID:**')) {
      checklist.id = line.replace('- **ID:**', '').trim();
    } else if (line.startsWith('- **Squad:**')) {
      checklist.squad = line.replace('- **Squad:**', '').trim();
    } else if (line.startsWith('- **Type:**')) {
      checklist.type = line.replace('- **Type:**', '').trim();
    }

    // Parse title
    if (line.startsWith('# ') && !checklist.name) {
      checklist.name = line.replace('# ', '').replace(' Checklist', '');
    }

    // Parse sections
    if (line.startsWith('### ') && !line.includes('Meta')) {
      currentSection = line.replace('### ', '');
      checklist.sections.push(currentSection);
    }

    // Parse gate rule
    if (line.startsWith('## Gate Rule') || line.startsWith('### Gate Rule')) {
      const ruleLines = [];
      for (let j = i + 1; j < lines.length && !lines[j].startsWith('#'); j++) {
        if (lines[j].trim().startsWith('-')) {
          ruleLines.push(lines[j].trim().replace(/^-\s*/, ''));
        }
      }
      checklist.gateRule = parseGateRule(ruleLines);
    }

    // Parse table
    if (line.startsWith('|') && line.includes('Check')) {
      inTable = true;
      tableHeaders = line.split('|').map(h => h.trim().toLowerCase()).filter(h => h);
      continue;
    }

    if (inTable && line.startsWith('|---')) {
      continue;
    }

    if (inTable && line.startsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      if (cells.length >= 3) {
        const item = {
          number: parseInt(cells[0]) || checklist.items.length + 1,
          check: cells[1],
          criteria: cells[2],
          severity: parseSeverity(cells[3] || '🟡'),
          section: currentSection,
          passed: null // To be filled during validation
        };
        checklist.items.push(item);
      }
    } else if (inTable && !line.startsWith('|')) {
      inTable = false;
    }
  }

  return checklist;
}

// Parse severity from text/emoji
function parseSeverity(text) {
  const trimmed = text.trim();
  if (SEVERITY[trimmed]) return SEVERITY[trimmed];

  // Check for emoji in text
  for (const [emoji, severity] of Object.entries(SEVERITY)) {
    if (trimmed.includes(emoji)) return severity;
  }

  return SEVERITY['🟡']; // Default to warning
}

// Parse gate rule text
function parseGateRule(ruleLines) {
  const rule = {
    passCondition: null,
    failCondition: null,
    maxWarnings: null,
    action: null
  };

  ruleLines.forEach(line => {
    const lower = line.toLowerCase();
    if (lower.includes('pass:')) {
      rule.passCondition = line.replace(/pass:/i, '').trim();
      // Extract max warnings
      const warningMatch = line.match(/max\s*(\d+)\s*(🟡|warning)/i);
      if (warningMatch) {
        rule.maxWarnings = parseInt(warningMatch[1]);
      }
    } else if (lower.includes('fail:')) {
      rule.failCondition = line.replace(/fail:/i, '').trim();
    } else if (lower.includes('action')) {
      rule.action = line.replace(/action[^:]*:/i, '').trim();
    }
  });

  // Default rules if not specified
  if (!rule.maxWarnings) rule.maxWarnings = 3;

  return rule;
}

// Interactive validation
async function interactiveValidation(checklist) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

  console.log(`\n🔍 Running: ${checklist.name}\n`);
  console.log(`Total items: ${checklist.items.length}\n`);
  console.log('For each item, enter: (y)es / (n)o / (s)kip\n');
  console.log('─'.repeat(60));

  for (const item of checklist.items) {
    const severityIcon = item.severity.level === 'critical' ? '🔴' :
                         item.severity.level === 'warning' ? '🟡' : '🟢';

    console.log(`\n${severityIcon} #${item.number}: ${item.check}`);
    console.log(`   Criteria: ${item.criteria}`);

    const answer = await question('   Pass? (y/n/s): ');

    switch (answer.toLowerCase()) {
      case 'y':
      case 'yes':
        item.passed = true;
        console.log('   ✅ Passed');
        break;
      case 'n':
      case 'no':
        item.passed = false;
        console.log('   ❌ Failed');
        break;
      default:
        item.passed = null;
        console.log('   ⏭️ Skipped');
    }
  }

  rl.close();
  return checklist;
}

// Auto-validate (for non-interactive use, all items marked as needing manual check)
function autoValidate(checklist, artifact) {
  // If artifact provided, we could add file-based checks here
  // For now, mark all as needing manual verification

  checklist.items.forEach(item => {
    // Add automated checks based on criteria keywords
    const criteria = item.criteria.toLowerCase();

    // Example auto-checks (extend as needed)
    if (criteria.includes('file exists') && artifact) {
      item.passed = existsSync(artifact);
      item.autoChecked = true;
    } else {
      item.passed = null; // Needs manual verification
      item.autoChecked = false;
    }
  });

  return checklist;
}

// Calculate results
function calculateResults(checklist) {
  const results = {
    total: checklist.items.length,
    passed: 0,
    failed: 0,
    skipped: 0,
    criticalFailed: 0,
    warningFailed: 0,
    score: 0,
    gateResult: 'unknown',
    bySection: {}
  };

  checklist.items.forEach(item => {
    // Initialize section
    if (item.section && !results.bySection[item.section]) {
      results.bySection[item.section] = { passed: 0, failed: 0, skipped: 0 };
    }

    if (item.passed === true) {
      results.passed++;
      if (item.section) results.bySection[item.section].passed++;
    } else if (item.passed === false) {
      results.failed++;
      if (item.section) results.bySection[item.section].failed++;
      if (item.severity.level === 'critical') results.criticalFailed++;
      if (item.severity.level === 'warning') results.warningFailed++;
    } else {
      results.skipped++;
      if (item.section) results.bySection[item.section].skipped++;
    }
  });

  // Calculate score (excluding skipped)
  const evaluated = results.passed + results.failed;
  results.score = evaluated > 0 ? Math.round((results.passed / evaluated) * 100) : 0;

  // Determine gate result
  const gateRule = checklist.gateRule || { maxWarnings: 3 };

  if (results.criticalFailed > 0) {
    results.gateResult = 'fail';
    results.gateReason = `${results.criticalFailed} critical item(s) failed`;
  } else if (results.warningFailed > gateRule.maxWarnings) {
    results.gateResult = 'fail';
    results.gateReason = `${results.warningFailed} warnings exceed max ${gateRule.maxWarnings}`;
  } else if (results.skipped > results.total / 2) {
    results.gateResult = 'incomplete';
    results.gateReason = `${results.skipped} items skipped (> 50%)`;
  } else {
    results.gateResult = 'pass';
    results.gateReason = results.warningFailed > 0
      ? `Passed with ${results.warningFailed} warning(s)`
      : 'All checks passed';
  }

  return results;
}

// Format as markdown
function formatMarkdown(checklist, results) {
  const gateIcon = results.gateResult === 'pass' ? '✅' :
                   results.gateResult === 'fail' ? '❌' : '⚠️';

  let output = `## ${gateIcon} Checklist Report: ${checklist.name}\n\n`;

  // Summary
  output += `### Summary\n\n`;
  output += `| Metric | Value |\n`;
  output += `|--------|-------|\n`;
  output += `| Total Items | ${results.total} |\n`;
  output += `| Passed | ${results.passed} ✅ |\n`;
  output += `| Failed | ${results.failed} ❌ |\n`;
  output += `| Skipped | ${results.skipped} ⏭️ |\n`;
  output += `| Score | ${results.score}% |\n`;
  output += `| **Gate Result** | **${results.gateResult.toUpperCase()}** |\n\n`;

  output += `**Reason:** ${results.gateReason}\n\n`;

  // Failed items
  const failedItems = checklist.items.filter(i => i.passed === false);
  if (failedItems.length > 0) {
    output += `### ❌ Failed Items\n\n`;
    failedItems.forEach(item => {
      const icon = item.severity.level === 'critical' ? '🔴' : '🟡';
      output += `${icon} **#${item.number}**: ${item.check}\n`;
      output += `   - Criteria: ${item.criteria}\n`;
      output += `   - Section: ${item.section || 'General'}\n\n`;
    });
  }

  // By section
  if (Object.keys(results.bySection).length > 0) {
    output += `### By Section\n\n`;
    output += `| Section | Passed | Failed | Skipped |\n`;
    output += `|---------|--------|--------|--------|\n`;
    Object.entries(results.bySection).forEach(([section, counts]) => {
      output += `| ${section} | ${counts.passed} | ${counts.failed} | ${counts.skipped} |\n`;
    });
    output += '\n';
  }

  // Timestamp
  output += `---\n`;
  output += `*Generated: ${new Date().toISOString()}*\n`;

  return output;
}

// Main
async function main() {
  const args = process.argv.slice(2);

  // List mode
  if (args.includes('--list')) {
    const checklists = listChecklists();
    console.log(`\n📋 Available Checklists (${checklists.length})\n`);

    const bySquad = {};
    checklists.forEach(c => {
      if (!bySquad[c.squad]) bySquad[c.squad] = [];
      bySquad[c.squad].push(c.name);
    });

    Object.entries(bySquad).sort().forEach(([squad, names]) => {
      console.log(`\n**${squad}** (${names.length})`);
      names.forEach(n => console.log(`  - ${squad}/${n}`));
    });
    return;
  }

  // Get checklist path
  const checklistArg = args.find(a => a.startsWith('--checklist='))?.split('=')[1];
  if (!checklistArg) {
    console.error('Usage: node checklist-runner.mjs --checklist=<path>');
    console.error('       node checklist-runner.mjs --list');
    process.exit(1);
  }

  const checklistPath = findChecklist(checklistArg);
  if (!checklistPath) {
    console.error(`Checklist not found: ${checklistArg}`);
    console.error('Use --list to see available checklists');
    process.exit(1);
  }

  // Parse checklist
  const content = readFileSync(checklistPath, 'utf-8');
  let checklist = parseChecklist(content);
  checklist.path = checklistPath;

  // Get artifact path
  const artifactArg = args.find(a => a.startsWith('--artifact='))?.split('=')[1];

  // Interactive or auto mode
  const interactive = args.includes('--interactive') || args.includes('-i');
  const format = args.find(a => a.startsWith('--format='))?.split('=')[1] || 'markdown';

  if (interactive) {
    checklist = await interactiveValidation(checklist);
  } else {
    checklist = autoValidate(checklist, artifactArg);
  }

  // Calculate results
  const results = calculateResults(checklist);

  // Output
  if (format === 'json') {
    console.log(JSON.stringify({ checklist: { ...checklist, items: checklist.items }, results }, null, 2));
  } else {
    console.log(formatMarkdown(checklist, results));
  }

  // Exit code based on gate result
  process.exit(results.gateResult === 'fail' ? 1 : 0);
}

main().catch(console.error);
