#!/usr/bin/env node

/**
 * Universal AIOS Indexer - Adapted for AIOS Lab (Windows)
 *
 * Indexes all AIOS assets automatically:
 * - Squads (squads/ → .claude/commands/{squad}/)
 * - Skills (.claude/skills/ → scan & report only, already discovered by Claude)
 *
 * Key differences from original:
 * - No js-yaml dependency (zero deps)
 * - Windows-compatible (copies instead of symlinks as fallback)
 * - Skills at .claude/skills/ with SKILL.md marker (not .aios/skills/ + README.md)
 * - MEMORY.md at Claude Code project memory path
 * - No tools/ directory (local tools in squads/ops/scripts/)
 *
 * Usage:
 *   node squads/ops/scripts/universal-indexer.mjs --scan
 *   node squads/ops/scripts/universal-indexer.mjs --index
 *   node squads/ops/scripts/universal-indexer.mjs --validate
 *   node squads/ops/scripts/universal-indexer.mjs --clean
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..', '..');

// Configuration
const CONFIG = {
  // Squads
  squadsDir: path.join(ROOT, 'squads'),
  squadsCommandsDir: path.join(ROOT, '.claude', 'commands'),

  // Skills (Claude Code discovers these directly - we just scan/report)
  skillsDir: path.join(ROOT, '.claude', 'skills'),

  // Agents (existing - we don't touch these)
  agentsCommandsDir: path.join(ROOT, '.claude', 'commands', 'AIOS', 'agents'),

  // Manifest (tracks what we indexed for clean operations)
  manifestFile: path.join(ROOT, '.claude', 'commands', '.indexer-manifest.json'),

  // Memory
  memoryFile: path.join(
    process.env.USERPROFILE || process.env.HOME || '',
    '.claude', 'projects',
    'C--Users-thiag-workspace-aios-lab',
    'memory', 'MEMORY.md'
  ),

  // Squad components to index as slash commands
  squadComponents: ['agents', 'tasks', 'workflows', 'checklists', 'templates'],

  // File extensions to index
  indexableExtensions: ['.md', '.yaml', '.yml'],

  // Directories to skip
  excludePatterns: [
    /^_template$/,
    /^\.backup/,
    /^\.DS_Store$/,
    /^node_modules$/,
    /^\.git$/,
    /^data$/,
  ]
};

// Colors
const C = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  magenta: '\x1b[35m'
};

const log = {
  info: (msg) => console.log(`${C.blue}i${C.reset} ${msg}`),
  ok: (msg) => console.log(`${C.green}+${C.reset} ${msg}`),
  warn: (msg) => console.log(`${C.yellow}!${C.reset} ${msg}`),
  err: (msg) => console.log(`${C.red}x${C.reset} ${msg}`),
  section: (msg) => console.log(`\n${C.bright}${C.cyan}${msg}${C.reset}\n`),
  dim: (msg) => console.log(`${C.gray}  ${msg}${C.reset}`)
};

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function shouldExclude(name) {
  return CONFIG.excludePatterns.some(p => p.test(name));
}

function trySymlink(target, linkPath) {
  try {
    if (fs.existsSync(linkPath)) {
      const stat = fs.lstatSync(linkPath);
      if (stat.isSymbolicLink() || stat.isFile()) fs.unlinkSync(linkPath);
    }
    const relative = path.relative(path.dirname(linkPath), target);
    fs.symlinkSync(relative, linkPath);
    return 'symlink';
  } catch {
    // Fallback: copy file
    try {
      fs.copyFileSync(target, linkPath);
      return 'copy';
    } catch (e) {
      return null;
    }
  }
}

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG.manifestFile, 'utf8'));
  } catch {
    return { indexed: [], lastRun: null, method: null };
  }
}

function saveManifest(manifest) {
  manifest.lastRun = new Date().toISOString();
  fs.writeFileSync(CONFIG.manifestFile, JSON.stringify(manifest, null, 2), 'utf8');
}

function countFiles(dir, extensions) {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).filter(f =>
    extensions.some(ext => f.endsWith(ext))
  ).length;
}

// ---------------------------------------------------------------------------
// SQUADS SCANNER
// ---------------------------------------------------------------------------

function scanSquads() {
  const squads = [];
  if (!fs.existsSync(CONFIG.squadsDir)) return squads;

  for (const entry of fs.readdirSync(CONFIG.squadsDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || shouldExclude(entry.name)) continue;

    const squadPath = path.join(CONFIG.squadsDir, entry.name);
    const hasReadme = fs.existsSync(path.join(squadPath, 'README.md'));

    if (hasReadme) {
      const components = {};
      for (const comp of CONFIG.squadComponents) {
        components[comp] = countFiles(path.join(squadPath, comp), CONFIG.indexableExtensions);
      }

      squads.push({
        name: entry.name,
        path: squadPath,
        components
      });
    }
  }

  return squads;
}

function getIndexedSquads() {
  const indexed = [];
  if (!fs.existsSync(CONFIG.squadsCommandsDir)) return indexed;

  for (const entry of fs.readdirSync(CONFIG.squadsCommandsDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'AIOS') continue;
    indexed.push(entry.name);
  }

  return indexed;
}

// ---------------------------------------------------------------------------
// SKILLS SCANNER
// ---------------------------------------------------------------------------

function scanSkills() {
  const skills = [];
  if (!fs.existsSync(CONFIG.skillsDir)) return skills;

  for (const entry of fs.readdirSync(CONFIG.skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || shouldExclude(entry.name)) continue;
    if (entry.name === '_registry.yaml') continue;

    const skillPath = path.join(CONFIG.skillsDir, entry.name);
    const hasSkillMd = fs.existsSync(path.join(skillPath, 'SKILL.md'));

    if (hasSkillMd) {
      skills.push({
        name: entry.name,
        path: skillPath
      });
    }
  }

  // Also check standalone .md files (non-directory skills)
  for (const entry of fs.readdirSync(CONFIG.skillsDir)) {
    if (entry.endsWith('.md') && entry !== '_registry.yaml') {
      skills.push({
        name: entry.replace('.md', ''),
        path: path.join(CONFIG.skillsDir, entry),
        standalone: true
      });
    }
  }

  return skills;
}

// ---------------------------------------------------------------------------
// SQUAD INDEXER
// ---------------------------------------------------------------------------

function indexSquad(squad) {
  const targetDir = path.join(CONFIG.squadsCommandsDir, squad.name);
  let count = 0;
  let method = null;

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Index README.md
  const readmeSrc = path.join(squad.path, 'README.md');
  if (fs.existsSync(readmeSrc)) {
    const result = trySymlink(readmeSrc, path.join(targetDir, 'README.md'));
    if (result) { count++; method = result; }
  }

  // Index component files
  for (const comp of CONFIG.squadComponents) {
    const srcCompDir = path.join(squad.path, comp);
    if (!fs.existsSync(srcCompDir)) continue;

    const dstCompDir = path.join(targetDir, comp);
    if (!fs.existsSync(dstCompDir)) {
      fs.mkdirSync(dstCompDir, { recursive: true });
    }

    const files = fs.readdirSync(srcCompDir).filter(f =>
      CONFIG.indexableExtensions.some(ext => f.endsWith(ext))
    );

    for (const file of files) {
      const result = trySymlink(
        path.join(srcCompDir, file),
        path.join(dstCompDir, file)
      );
      if (result) { count++; method = result; }
    }
  }

  return { count, method };
}

function indexAllSquads(squads) {
  const results = [];

  for (const squad of squads) {
    const { count, method } = indexSquad(squad);
    if (count > 0) {
      results.push({ name: squad.name, count, method });
      log.dim(`${squad.name}: ${count} files (${method})`);
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// MEMORY UPDATER
// ---------------------------------------------------------------------------

function updateMemory(squads, skills) {
  if (!fs.existsSync(CONFIG.memoryFile)) {
    log.warn(`MEMORY.md not found at ${CONFIG.memoryFile}`);
    return false;
  }

  let content = fs.readFileSync(CONFIG.memoryFile, 'utf8');
  const today = new Date().toISOString().split('T')[0];

  // Update or append Indexed Assets section
  const sectionRegex = /## Indexed Assets \([\d-]+\)([\s\S]*?)(?=\n## |$)/;

  const dirSkills = skills.filter(s => !s.standalone);
  const totalComponents = squads.reduce((sum, s) => {
    return sum + Object.values(s.components).reduce((a, b) => a + b, 0);
  }, 0);

  const assetsSection = `## Indexed Assets (${today})

| Type | Count | Location |
|------|-------|----------|
| Squads | ${squads.length} | \`.claude/commands/{squad}/\` |
| Skills | ${dirSkills.length} | \`.claude/skills/{skill}/\` |
| Squad components | ${totalComponents} | agents, tasks, workflows, etc. |

Last indexed: ${today}
`;

  if (content.match(sectionRegex)) {
    content = content.replace(sectionRegex, assetsSection);
  } else {
    content += `\n${assetsSection}\n`;
  }

  fs.writeFileSync(CONFIG.memoryFile, content, 'utf8');
  return true;
}

// ---------------------------------------------------------------------------
// VALIDATOR
// ---------------------------------------------------------------------------

function validateAll() {
  log.section('Validating Indexes');

  const indexedSquads = getIndexedSquads();
  let valid = 0;
  let orphaned = 0;
  const orphanList = [];

  for (const name of indexedSquads) {
    const squadPath = path.join(CONFIG.squadsDir, name);
    if (fs.existsSync(squadPath)) {
      valid++;
      log.ok(name);
    } else {
      orphaned++;
      orphanList.push(name);
      log.err(`${name} (orphaned - source missing)`);
    }
  }

  // Check for broken symlinks in commands dir
  for (const name of indexedSquads) {
    const cmdDir = path.join(CONFIG.squadsCommandsDir, name);
    if (!fs.existsSync(cmdDir)) continue;

    for (const file of fs.readdirSync(cmdDir, { withFileTypes: true })) {
      const filePath = path.join(cmdDir, file.name);
      if (file.isSymbolicLink()) {
        try {
          fs.readFileSync(filePath);
        } catch {
          log.err(`Broken symlink: ${name}/${file.name}`);
          orphaned++;
        }
      }
    }
  }

  log.section('Validation Summary');
  console.log(`  Valid: ${C.green}${valid}${C.reset}`);
  console.log(`  Orphaned: ${orphaned > 0 ? C.red : C.green}${orphaned}${C.reset}`);

  if (orphanList.length > 0) {
    console.log(`\n  Run with --clean to remove orphaned indexes`);
  }

  return { valid, orphaned, orphanList };
}

// ---------------------------------------------------------------------------
// CLEANER
// ---------------------------------------------------------------------------

function cleanOrphans() {
  log.section('Cleaning Orphaned Indexes');

  const { orphanList } = validateAll();

  if (orphanList.length === 0) {
    log.ok('No orphans to clean');
    return;
  }

  for (const name of orphanList) {
    const cmdDir = path.join(CONFIG.squadsCommandsDir, name);
    if (fs.existsSync(cmdDir)) {
      fs.rmSync(cmdDir, { recursive: true, force: true });
      log.ok(`Removed orphaned index: ${name}`);
    }
  }
}

// ---------------------------------------------------------------------------
// MAIN COMMANDS
// ---------------------------------------------------------------------------

function cmdScan() {
  log.section('Universal Asset Scanner');

  const squads = scanSquads();
  const skills = scanSkills();
  const indexedSquads = getIndexedSquads();

  const unindexed = squads.filter(s => !indexedSquads.includes(s.name));

  // Squads
  console.log(`${C.bright}Squads${C.reset}`);
  log.info(`Found: ${squads.length}`);
  log.info(`Indexed: ${indexedSquads.length}`);
  log.info(`Unindexed: ${unindexed.length}`);

  if (unindexed.length > 0) {
    unindexed.forEach(s => log.warn(`  ${s.name}`));
  }

  // Skills
  console.log(`\n${C.bright}Skills${C.reset}`);
  const dirSkills = skills.filter(s => !s.standalone);
  const standaloneSkills = skills.filter(s => s.standalone);
  log.info(`Directory skills: ${dirSkills.length}`);
  log.info(`Standalone skills: ${standaloneSkills.length}`);
  log.info(`Total: ${skills.length}`);

  // Summary
  log.section('Summary');
  console.log(`  Total assets: ${squads.length + skills.length}`);
  console.log(`  Squads: ${squads.length} (${unindexed.length} unindexed)`);
  console.log(`  Skills: ${skills.length} (auto-discovered by Claude Code)`);

  if (unindexed.length > 0) {
    console.log(`\n  Run with --index to index all unindexed squads`);
  }
}

function cmdIndex() {
  log.section('Universal Asset Indexer');

  const squads = scanSquads();
  const skills = scanSkills();
  const indexedSquads = getIndexedSquads();

  // Index ALL squads (re-index for freshness)
  console.log(`${C.bright}Indexing ${squads.length} squads${C.reset}`);
  const results = indexAllSquads(squads);
  const totalFiles = results.reduce((sum, r) => sum + r.count, 0);
  const method = results[0]?.method || 'none';
  log.ok(`${results.length} squads indexed (${totalFiles} files via ${method})`);

  // Update MEMORY.md
  console.log(`\n${C.bright}Updating MEMORY.md${C.reset}`);
  if (updateMemory(squads, skills)) {
    log.ok('MEMORY.md updated');
  }

  // Save manifest
  const manifest = {
    indexed: results.map(r => r.name),
    totalFiles,
    method,
    squads: squads.length,
    skills: skills.length,
    lastRun: null
  };
  saveManifest(manifest);

  // Summary
  log.section('Indexing Complete');
  console.log(`  Squads: ${C.green}${results.length}${C.reset} indexed`);
  console.log(`  Skills: ${skills.length} (auto-discovered)`);
  console.log(`  Total files: ${C.green}${totalFiles}${C.reset}`);
  console.log(`  Method: ${method}`);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const command = process.argv[2];

switch (command) {
  case '--scan':
    cmdScan();
    break;
  case '--index':
    cmdIndex();
    break;
  case '--validate':
    validateAll();
    break;
  case '--clean':
    cleanOrphans();
    break;
  default:
    console.log(`
${C.bright}Universal AIOS Indexer - AIOS Lab Edition${C.reset}

${C.cyan}Usage:${C.reset}
  node squads/ops/scripts/universal-indexer.mjs --scan       ${C.gray}# Scan all assets${C.reset}
  node squads/ops/scripts/universal-indexer.mjs --index      ${C.gray}# Index everything${C.reset}
  node squads/ops/scripts/universal-indexer.mjs --validate   ${C.gray}# Check for broken indexes${C.reset}
  node squads/ops/scripts/universal-indexer.mjs --clean      ${C.gray}# Remove orphaned indexes${C.reset}

${C.cyan}What gets indexed:${C.reset}
  Squads    squads/ → .claude/commands/{squad}/
  Skills    .claude/skills/ (auto-discovered, scan only)
    `);
    process.exit(1);
}
