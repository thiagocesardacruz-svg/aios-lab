#!/usr/bin/env node
/**
 * Health Check
 *
 * Validates system health across squads, governance, and logs.
 * Reports issues and recommendations.
 *
 * Usage:
 *   node health-check.js            # Run all checks
 *   node health-check.js --quick    # Quick checks only
 *   node health-check.js --json     # Output as JSON
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Expected directories
const EXPECTED_DIRS = [
  'squads',
  'governance',
  'logs',
  'logs/service-orders',
  '.aios-core'
];

// Expected squads
const EXPECTED_SQUADS = [
  'ops', 'marketing', 'sales', 'growth', 'tech',
  'finance', 'qa', 'translator', 'customer', 'board'
];

// Health check results
const results = {
  checks: [],
  passed: 0,
  failed: 0,
  warnings: 0
};

/**
 * Add a check result
 * @param {string} category
 * @param {string} name
 * @param {'pass' | 'fail' | 'warn'} status
 * @param {string} message
 */
function addCheck(category, name, status, message) {
  results.checks.push({ category, name, status, message });
  if (status === 'pass') results.passed++;
  else if (status === 'fail') results.failed++;
  else results.warnings++;
}

/**
 * Check if a directory exists
 * @param {string} dirPath
 * @returns {boolean}
 */
function dirExists(dirPath) {
  return fs.existsSync(path.join(ROOT_DIR, dirPath)) &&
         fs.statSync(path.join(ROOT_DIR, dirPath)).isDirectory();
}

/**
 * Check if a file exists
 * @param {string} filePath
 * @returns {boolean}
 */
function fileExists(filePath) {
  return fs.existsSync(path.join(ROOT_DIR, filePath));
}

/**
 * Load YAML file
 * @param {string} filePath
 * @returns {object | null}
 */
function loadYaml(filePath) {
  try {
    const content = fs.readFileSync(path.join(ROOT_DIR, filePath), 'utf8');
    return yaml.load(content);
  } catch {
    return null;
  }
}

/**
 * Check directory structure
 */
async function checkDirectoryStructure() {
  for (const dir of EXPECTED_DIRS) {
    if (dirExists(dir)) {
      addCheck('structure', `Directory: ${dir}`, 'pass', 'Exists');
    } else {
      addCheck('structure', `Directory: ${dir}`, 'fail', 'Missing');
    }
  }
}

/**
 * Check squads
 */
async function checkSquads() {
  for (const squad of EXPECTED_SQUADS) {
    const squadDir = `squads/${squad}`;

    if (!dirExists(squadDir)) {
      addCheck('squads', `Squad: ${squad}`, 'fail', 'Directory missing');
      continue;
    }

    // Check squad.yaml
    const squadYaml = `${squadDir}/squad.yaml`;
    if (!fileExists(squadYaml)) {
      addCheck('squads', `Squad: ${squad}`, 'fail', 'squad.yaml missing');
      continue;
    }

    const squadConfig = loadYaml(squadYaml);
    if (!squadConfig) {
      addCheck('squads', `Squad: ${squad}`, 'fail', 'squad.yaml invalid');
      continue;
    }

    // Check required fields
    const requiredFields = ['name', 'version', 'description'];
    const missingFields = requiredFields.filter(f => !squadConfig[f]);

    if (missingFields.length > 0) {
      addCheck('squads', `Squad: ${squad}`, 'warn', `Missing fields: ${missingFields.join(', ')}`);
    } else {
      addCheck('squads', `Squad: ${squad}`, 'pass', 'Valid');
    }

    // Check agents directory
    const agentsDir = `${squadDir}/agents`;
    if (!dirExists(agentsDir)) {
      addCheck('squads', `Squad: ${squad} agents`, 'warn', 'No agents directory');
    } else {
      const agentFiles = await glob('*.md', { cwd: path.join(ROOT_DIR, agentsDir) });
      if (agentFiles.length === 0) {
        addCheck('squads', `Squad: ${squad} agents`, 'warn', 'No agent files');
      } else {
        addCheck('squads', `Squad: ${squad} agents`, 'pass', `${agentFiles.length} agents`);
      }
    }
  }
}

/**
 * Check governance documents
 */
async function checkGovernance() {
  const governanceDocs = [
    'governance/constitution.md',
    'governance/cost-policy.md',
    'governance/boundaries.md',
    'governance/agent-roles.md'
  ];

  for (const doc of governanceDocs) {
    if (fileExists(doc)) {
      addCheck('governance', path.basename(doc), 'pass', 'Exists');
    } else {
      addCheck('governance', path.basename(doc), 'fail', 'Missing');
    }
  }
}

/**
 * Check OS schema
 */
async function checkOsSchema() {
  const schemaPath = 'logs/service-orders/_schema.yaml';

  if (!fileExists(schemaPath)) {
    addCheck('os', 'Schema', 'fail', '_schema.yaml missing');
    return;
  }

  const schema = loadYaml(schemaPath);
  if (!schema) {
    addCheck('os', 'Schema', 'fail', '_schema.yaml invalid');
    return;
  }

  addCheck('os', 'Schema', 'pass', 'Valid');
}

/**
 * Check OS files
 */
async function checkOsFiles() {
  const osDir = path.join(ROOT_DIR, 'logs', 'service-orders');

  if (!fs.existsSync(osDir)) {
    addCheck('os', 'Files', 'warn', 'No service-orders directory');
    return;
  }

  const osFiles = await glob('**/*.yaml', {
    cwd: osDir,
    ignore: ['_schema.yaml', '_template.yaml']
  });

  if (osFiles.length === 0) {
    addCheck('os', 'Files', 'warn', 'No OS files found');
    return;
  }

  let validCount = 0;
  let invalidCount = 0;

  for (const file of osFiles) {
    const doc = loadYaml(`logs/service-orders/${file}`);
    if (doc && doc.os_id && doc.status) {
      validCount++;
    } else {
      invalidCount++;
    }
  }

  if (invalidCount > 0) {
    addCheck('os', 'Files', 'warn', `${validCount} valid, ${invalidCount} invalid`);
  } else {
    addCheck('os', 'Files', 'pass', `${validCount} valid OS files`);
  }
}

/**
 * Check scripts
 */
async function checkScripts() {
  const scripts = [
    'scripts/generate-os-id.js',
    'scripts/validate-os.js',
    'scripts/cost-calculator.js',
    'scripts/health-check.js',
    'scripts/sync-yaml-to-notion.js'
  ];

  for (const script of scripts) {
    if (fileExists(script)) {
      addCheck('scripts', path.basename(script), 'pass', 'Exists');
    } else {
      addCheck('scripts', path.basename(script), 'fail', 'Missing');
    }
  }
}

/**
 * Check AIOS core
 */
async function checkAiosCore() {
  const coreDir = '.aios-core';

  if (!dirExists(coreDir)) {
    addCheck('core', 'AIOS Core', 'fail', 'Directory missing');
    return;
  }

  const subdirs = ['development', 'development/agents'];
  for (const subdir of subdirs) {
    const fullPath = `${coreDir}/${subdir}`;
    if (dirExists(fullPath)) {
      addCheck('core', subdir, 'pass', 'Exists');
    } else {
      addCheck('core', subdir, 'warn', 'Missing');
    }
  }
}

/**
 * Output results
 */
function outputResults(jsonOutput) {
  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  console.log('=== AIOS Health Check ===\n');

  // Group by category
  const categories = [...new Set(results.checks.map(c => c.category))];

  for (const category of categories) {
    console.log(`[${category.toUpperCase()}]`);
    const checks = results.checks.filter(c => c.category === category);

    for (const check of checks) {
      const icon = check.status === 'pass' ? '+' :
                   check.status === 'fail' ? 'X' :
                   '!';
      console.log(`  [${icon}] ${check.name}: ${check.message}`);
    }
    console.log('');
  }

  // Summary
  console.log('--- Summary ---');
  console.log(`  Passed:   ${results.passed}`);
  console.log(`  Failed:   ${results.failed}`);
  console.log(`  Warnings: ${results.warnings}`);

  const healthScore = results.passed / (results.passed + results.failed + results.warnings) * 100;
  console.log(`  Health:   ${healthScore.toFixed(0)}%`);

  if (results.failed > 0) {
    console.log('\nAction Required: Fix failed checks before proceeding.');
    process.exit(1);
  } else if (results.warnings > 0) {
    console.log('\nRecommendation: Review warnings for optimal configuration.');
  } else {
    console.log('\nAll systems operational.');
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const quickMode = args.includes('--quick');
  const jsonOutput = args.includes('--json');

  // Run checks
  await checkDirectoryStructure();
  await checkGovernance();
  await checkOsSchema();

  if (!quickMode) {
    await checkSquads();
    await checkOsFiles();
    await checkScripts();
    await checkAiosCore();
  }

  outputResults(jsonOutput);
}

main();
