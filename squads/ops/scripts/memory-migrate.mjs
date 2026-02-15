#!/usr/bin/env node
/**
 * Memory Migration - Restructure for project-scoped memory
 *
 * Moves existing entries to framework/ (they're AIOS decisions)
 * Creates projects/traveltech/ structure
 * Safe: --dry-run first, copies then removes originals
 *
 * Usage:
 *   node memory-migrate.mjs --dry-run   # Preview changes
 *   node memory-migrate.mjs             # Execute migration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../..');
const MEMORY = path.join(ROOT, '.aios/memory');
const LEARNING = path.join(ROOT, '.aios/learning');
const dryRun = process.argv.includes('--dry-run');

function log(action, detail) {
  const prefix = dryRun ? '[DRY-RUN]' : '[MIGRATE]';
  console.log(`${prefix} ${action}: ${detail}`);
}

function ensureDir(dir) {
  log('mkdir', dir.replace(ROOT + '/', ''));
  if (!dryRun) fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  log('copy', `${src.replace(ROOT + '/', '')} → ${dest.replace(ROOT + '/', '')}`);
  if (!dryRun) fs.copyFileSync(src, dest);
}

function removeFile(src) {
  log('remove', src.replace(ROOT + '/', ''));
  if (!dryRun) fs.unlinkSync(src);
}

async function migrate() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Memory Migration ${dryRun ? '(DRY RUN)' : '(EXECUTING)'}`);
  console.log(`${'='.repeat(60)}\n`);

  // 1. Create new directory structure
  console.log('--- Step 1: Create directories ---');
  const memoryDirs = [
    'framework/decisions', 'framework/errors', 'framework/tacit', 'framework/context',
    'projects/traveltech/decisions', 'projects/traveltech/errors',
    'projects/traveltech/tacit', 'projects/traveltech/context'
  ];
  for (const dir of memoryDirs) {
    ensureDir(path.join(MEMORY, dir));
  }

  const learningDirs = [
    'framework/patterns', 'framework/preferences', 'framework/domain', 'framework/metrics',
    'projects/traveltech/patterns', 'projects/traveltech/preferences',
    'projects/traveltech/domain', 'projects/traveltech/metrics'
  ];
  for (const dir of learningDirs) {
    ensureDir(path.join(LEARNING, dir));
  }

  // Ensure activity logs dir exists
  ensureDir(path.join(ROOT, '.aios/logs/activity'));
  ensureDir(path.join(ROOT, '.aios/logs/digests'));

  // 2. Move existing memory entries to framework/
  console.log('\n--- Step 2: Migrate existing entries to framework/ ---');
  const categories = ['decisions', 'errors', 'tacit', 'context'];

  for (const cat of categories) {
    const oldDir = path.join(MEMORY, cat);
    const newDir = path.join(MEMORY, 'framework', cat);

    if (!fs.existsSync(oldDir)) continue;

    const files = fs.readdirSync(oldDir).filter(f => {
      const fullPath = path.join(oldDir, f);
      return fs.statSync(fullPath).isFile();
    });

    for (const file of files) {
      copyFile(path.join(oldDir, file), path.join(newDir, file));
    }
  }

  // 3. Move existing learning entries to framework/
  console.log('\n--- Step 3: Migrate learning patterns to framework/ ---');
  const learningCats = ['patterns', 'preferences', 'domain', 'metrics'];

  for (const cat of learningCats) {
    const oldDir = path.join(LEARNING, cat);
    const newDir = path.join(LEARNING, 'framework', cat);

    if (!fs.existsSync(oldDir)) continue;

    const files = fs.readdirSync(oldDir).filter(f => {
      const fullPath = path.join(oldDir, f);
      return fs.statSync(fullPath).isFile();
    });

    for (const file of files) {
      copyFile(path.join(oldDir, file), path.join(newDir, file));
    }
  }

  // 4. Keep search-index.yaml and README.md at root level
  console.log('\n--- Step 4: Root-level files stay in place ---');
  log('keep', '.aios/memory/search-index.yaml (global)');
  log('keep', '.aios/memory/README.md (global)');

  // 5. Remove old top-level category dirs (after confirming copy)
  if (!dryRun) {
    console.log('\n--- Step 5: Clean up old directories ---');
    for (const cat of categories) {
      const oldDir = path.join(MEMORY, cat);
      const newDir = path.join(MEMORY, 'framework', cat);

      if (!fs.existsSync(oldDir)) continue;

      // Verify all files were copied
      const oldFiles = fs.readdirSync(oldDir).filter(f =>
        fs.statSync(path.join(oldDir, f)).isFile()
      );
      const newFiles = fs.readdirSync(newDir).filter(f =>
        fs.statSync(path.join(newDir, f)).isFile()
      );

      if (oldFiles.length <= newFiles.length) {
        // Remove old files (keep dir for now to avoid breaking anything)
        for (const file of oldFiles) {
          removeFile(path.join(oldDir, file));
        }
        fs.rmdirSync(oldDir);
        log('rmdir', `.aios/memory/${cat}`);
      } else {
        console.warn(`⚠️ Skipping cleanup of ${cat} — file count mismatch`);
      }
    }

    // Clean old learning dirs
    for (const cat of learningCats) {
      const oldDir = path.join(LEARNING, cat);
      const newDir = path.join(LEARNING, 'framework', cat);

      if (!fs.existsSync(oldDir)) continue;

      const oldFiles = fs.readdirSync(oldDir).filter(f =>
        fs.statSync(path.join(oldDir, f)).isFile()
      );
      const newFiles = fs.readdirSync(newDir).filter(f =>
        fs.statSync(path.join(newDir, f)).isFile()
      );

      if (oldFiles.length <= newFiles.length) {
        for (const file of oldFiles) {
          removeFile(path.join(oldDir, file));
        }
        fs.rmdirSync(oldDir);
        log('rmdir', `.aios/learning/${cat}`);
      }
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('Migration Summary:');
  console.log(`  Memory: framework/ + projects/traveltech/`);
  console.log(`  Learning: framework/ + projects/traveltech/`);
  console.log(`  Logs: .aios/logs/activity/ + digests/ created`);
  if (dryRun) {
    console.log('\n  Run without --dry-run to execute.');
  } else {
    console.log('\n  Migration complete.');
  }
  console.log(`${'='.repeat(60)}\n`);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
