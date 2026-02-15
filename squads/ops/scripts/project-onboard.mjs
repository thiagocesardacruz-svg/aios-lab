#!/usr/bin/env node
/**
 * Project Onboard - Register new project/niche in AIOS holding
 *
 * Creates:
 *   - Entry in .aios/projects.yaml
 *   - Memory directories (decisions, errors, tacit)
 *   - Learning directories (patterns, preferences, domain)
 *   - Project folder in projects/
 *
 * Usage:
 *   node project-onboard.mjs "gastrotech" --niche="Restaurants" --product="GastroOS"
 *   node project-onboard.mjs "gastrotech" --niche="Restaurants" --product="GastroOS" --dry-run
 *
 * Cost: €0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../..');

function parseArgs() {
  const args = process.argv.slice(2);
  const projectKey = args.find(a => !a.startsWith('--'));
  const options = {};
  args.filter(a => a.startsWith('--')).forEach(arg => {
    const eqIdx = arg.indexOf('=');
    if (eqIdx > -1) {
      options[arg.slice(2, eqIdx)] = arg.slice(eqIdx + 1);
    } else {
      options[arg.slice(2)] = true;
    }
  });
  return { projectKey, ...options };
}

function log(action, detail, dryRun) {
  const prefix = dryRun ? '[DRY-RUN]' : '[CREATE]';
  console.log(`${prefix} ${action}: ${detail}`);
}

function ensureDir(dir, dryRun) {
  log('mkdir', dir.replace(ROOT + '/', ''), dryRun);
  if (!dryRun) fs.mkdirSync(dir, { recursive: true });
}

async function onboard(config) {
  const { projectKey, niche, product, 'dry-run': dryRun } = config;

  if (!projectKey) {
    console.log(`
Project Onboard - Register new project in AIOS holding

Usage:
  node project-onboard.mjs <key> --niche="Niche" --product="Product Name"

Options:
  --niche=NAME        Business niche (e.g., "Restaurants", "Clinics")
  --product=NAME      Product name (e.g., "GastroOS", "ClinicOS")
  --dry-run           Preview changes without executing

Examples:
  node project-onboard.mjs gastrotech --niche="Restaurants" --product="GastroOS"
  node project-onboard.mjs clinictech --niche="Clinics" --product="ClinicOS" --dry-run
`);
    return;
  }

  if (!niche) {
    console.error('Error: --niche is required');
    process.exit(1);
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Project Onboard: ${projectKey} ${dryRun ? '(DRY RUN)' : ''}`);
  console.log(`Niche: ${niche} | Product: ${product || 'TBD'}`);
  console.log(`${'='.repeat(60)}\n`);

  // 1. Check if project already exists
  const projectsFile = path.join(ROOT, '.aios/projects.yaml');
  if (fs.existsSync(projectsFile)) {
    const content = fs.readFileSync(projectsFile, 'utf-8');
    if (content.includes(`  ${projectKey}:`)) {
      console.error(`Error: Project "${projectKey}" already exists in projects.yaml`);
      process.exit(1);
    }
  }

  // 2. Create memory directories
  console.log('--- Step 1: Memory directories ---');
  const memoryDirs = ['decisions', 'errors', 'tacit', 'context'];
  for (const dir of memoryDirs) {
    ensureDir(path.join(ROOT, `.aios/memory/projects/${projectKey}/${dir}`), dryRun);
  }

  // 3. Create learning directories
  console.log('\n--- Step 2: Learning directories ---');
  const learningDirs = ['patterns', 'preferences', 'domain', 'metrics'];
  for (const dir of learningDirs) {
    ensureDir(path.join(ROOT, `.aios/learning/projects/${projectKey}/${dir}`), dryRun);
  }

  // 4. Create project folder
  console.log('\n--- Step 3: Project folder ---');
  const projectDir = path.join(ROOT, `projects/${projectKey}`);
  ensureDir(projectDir, dryRun);

  if (!dryRun) {
    const readmeContent = `# ${product || projectKey}

**Niche:** ${niche}
**Status:** Active
**Created:** ${new Date().toISOString().split('T')[0]}

## Overview

${product || projectKey} — part of the AIOS holding (Synkra).

## Structure

\`\`\`
${projectKey}/
├── README.md
└── (app structure TBD)
\`\`\`

---
*Registered via project-onboard.mjs*
`;
    fs.writeFileSync(path.join(projectDir, 'README.md'), readmeContent);
    log('write', `projects/${projectKey}/README.md`, false);
  } else {
    log('write', `projects/${projectKey}/README.md`, true);
  }

  // 5. Append to projects.yaml
  console.log('\n--- Step 4: Register in projects.yaml ---');
  const yamlEntry = `
  ${projectKey}:
    name: "${product || projectKey}"
    type: "niche"
    niche: "${niche}"
    product: "${product || 'TBD'}"
    path: "projects/${projectKey}"
    memory_scope: "projects/${projectKey}"
    squad_focus: []
    status: "active"
    created: "${new Date().toISOString().split('T')[0]}"
`;

  log('append', `.aios/projects.yaml → ${projectKey}`, dryRun);
  if (!dryRun && fs.existsSync(projectsFile)) {
    const content = fs.readFileSync(projectsFile, 'utf-8');
    // Insert before clickup_mapping section
    const insertPoint = content.indexOf('\n# ClickUp');
    if (insertPoint > -1) {
      const updated = content.slice(0, insertPoint) + yamlEntry + content.slice(insertPoint);
      fs.writeFileSync(projectsFile, updated);
    } else {
      // Fallback: append at end of projects section
      fs.appendFileSync(projectsFile, yamlEntry);
    }
  }

  // 6. Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('Onboarding Summary:');
  console.log(`  Project: ${projectKey}`);
  console.log(`  Niche: ${niche}`);
  console.log(`  Product: ${product || 'TBD'}`);
  console.log(`  Memory: .aios/memory/projects/${projectKey}/`);
  console.log(`  Learning: .aios/learning/projects/${projectKey}/`);
  console.log(`  Code: projects/${projectKey}/`);

  console.log('\nManual steps remaining:');
  console.log(`  1. Add "${product || projectKey}" to ClickUp Project/Goal dropdown`);
  console.log(`  2. Update PROJECT_MAP in cycle-time.mjs, dashboard-unified.mjs, weekly-report.mjs`);
  console.log(`  3. Update PROJECT_KEY_MAP in lib/project-filter.mjs`);
  console.log(`  4. Update clickup_mapping in .aios/projects.yaml with new ClickUp option`);
  console.log(`  5. Run: *switch-project ${projectKey}`);

  if (dryRun) {
    console.log('\nRun without --dry-run to execute.');
  } else {
    console.log('\nOnboarding complete.');
  }
  console.log(`${'='.repeat(60)}\n`);
}

onboard(parseArgs()).catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
