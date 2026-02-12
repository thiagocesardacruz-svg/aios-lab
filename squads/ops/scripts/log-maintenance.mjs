#!/usr/bin/env node
/**
 * Log Maintenance - Rotation, archival, and cleanup
 *
 * Usage:
 *   node log-maintenance.mjs status           # Show current status
 *   node log-maintenance.mjs rotate           # Archive old logs (> 90 days)
 *   node log-maintenance.mjs cleanup          # Remove archived logs (> 180 days)
 *   node log-maintenance.mjs compress         # Compress old digests
 *   node log-maintenance.mjs all              # Run all maintenance tasks
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import zlib from 'zlib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../..');

const PATHS = {
  activity: path.join(ROOT, '.aios/logs/activity'),
  digests: path.join(ROOT, '.aios/logs/digests'),
  archive: path.join(ROOT, '.aios/logs/archive')
};

const CONFIG = {
  rotateAfterDays: 90,      // Move to archive after 90 days
  deleteAfterDays: 180,     // Delete from archive after 180 days
  compressAfterDays: 30     // Compress digests after 30 days
};

function ensureDirs() {
  Object.values(PATHS).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function getFilesOlderThan(dir, days, extension = '') {
  if (!fs.existsSync(dir)) return [];

  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
  const files = fs.readdirSync(dir);

  return files.filter(file => {
    if (extension && !file.endsWith(extension)) return false;

    // Extract date from filename (YYYY-MM-DD.ext)
    const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
    if (!dateMatch) return false;

    const fileDate = new Date(dateMatch[1]).getTime();
    return fileDate < cutoff;
  });
}

function getDirSize(dir) {
  if (!fs.existsSync(dir)) return 0;

  let size = 0;
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    size += stats.size;
  });

  return size;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function status() {
  ensureDirs();

  console.log('\n📊 Log Maintenance Status\n');
  console.log('─'.repeat(50));

  // Activity logs
  const activityFiles = fs.existsSync(PATHS.activity)
    ? fs.readdirSync(PATHS.activity).filter(f => f.endsWith('.jsonl'))
    : [];
  const activitySize = getDirSize(PATHS.activity);
  const oldActivity = getFilesOlderThan(PATHS.activity, CONFIG.rotateAfterDays, '.jsonl');

  console.log(`\n📋 Activity Logs (${PATHS.activity})`);
  console.log(`   Files: ${activityFiles.length}`);
  console.log(`   Size: ${formatBytes(activitySize)}`);
  console.log(`   Ready to rotate (>${CONFIG.rotateAfterDays} days): ${oldActivity.length}`);

  // Digests
  const digestFiles = fs.existsSync(PATHS.digests)
    ? fs.readdirSync(PATHS.digests).filter(f => f.endsWith('.md'))
    : [];
  const digestSize = getDirSize(PATHS.digests);
  const oldDigests = getFilesOlderThan(PATHS.digests, CONFIG.compressAfterDays, '.md');

  console.log(`\n📝 Digests (${PATHS.digests})`);
  console.log(`   Files: ${digestFiles.length}`);
  console.log(`   Size: ${formatBytes(digestSize)}`);
  console.log(`   Ready to compress (>${CONFIG.compressAfterDays} days): ${oldDigests.length}`);

  // Archive
  const archiveFiles = fs.existsSync(PATHS.archive)
    ? fs.readdirSync(PATHS.archive)
    : [];
  const archiveSize = getDirSize(PATHS.archive);
  const oldArchive = getFilesOlderThan(PATHS.archive, CONFIG.deleteAfterDays);

  console.log(`\n📦 Archive (${PATHS.archive})`);
  console.log(`   Files: ${archiveFiles.length}`);
  console.log(`   Size: ${formatBytes(archiveSize)}`);
  console.log(`   Ready to delete (>${CONFIG.deleteAfterDays} days): ${oldArchive.length}`);

  // Total
  const totalSize = activitySize + digestSize + archiveSize;
  console.log(`\n📈 Total: ${formatBytes(totalSize)}`);
  console.log('─'.repeat(50));
  console.log('');

  return {
    activity: { files: activityFiles.length, size: activitySize, toRotate: oldActivity.length },
    digests: { files: digestFiles.length, size: digestSize, toCompress: oldDigests.length },
    archive: { files: archiveFiles.length, size: archiveSize, toDelete: oldArchive.length }
  };
}

function rotate() {
  ensureDirs();

  const oldFiles = getFilesOlderThan(PATHS.activity, CONFIG.rotateAfterDays, '.jsonl');

  if (oldFiles.length === 0) {
    console.log('✅ No files to rotate');
    return 0;
  }

  console.log(`\n📦 Rotating ${oldFiles.length} files to archive...\n`);

  let rotated = 0;
  oldFiles.forEach(file => {
    const src = path.join(PATHS.activity, file);
    const dest = path.join(PATHS.archive, file);

    try {
      // Compress while moving
      const content = fs.readFileSync(src);
      const compressed = zlib.gzipSync(content);
      fs.writeFileSync(dest + '.gz', compressed);
      fs.unlinkSync(src);

      console.log(`   📁 ${file} → archive (compressed)`);
      rotated++;
    } catch (e) {
      console.log(`   ❌ ${file}: ${e.message}`);
    }
  });

  console.log(`\n✅ Rotated ${rotated} files\n`);
  return rotated;
}

function compress() {
  ensureDirs();

  const oldFiles = getFilesOlderThan(PATHS.digests, CONFIG.compressAfterDays, '.md');

  if (oldFiles.length === 0) {
    console.log('✅ No digests to compress');
    return 0;
  }

  console.log(`\n🗜️ Compressing ${oldFiles.length} digests...\n`);

  let compressed = 0;
  oldFiles.forEach(file => {
    const src = path.join(PATHS.digests, file);

    try {
      const content = fs.readFileSync(src);
      const compressedContent = zlib.gzipSync(content);
      fs.writeFileSync(src + '.gz', compressedContent);
      fs.unlinkSync(src);

      const originalSize = content.length;
      const newSize = compressedContent.length;
      const savings = Math.round((1 - newSize / originalSize) * 100);

      console.log(`   📄 ${file} (${savings}% smaller)`);
      compressed++;
    } catch (e) {
      console.log(`   ❌ ${file}: ${e.message}`);
    }
  });

  console.log(`\n✅ Compressed ${compressed} files\n`);
  return compressed;
}

function cleanup() {
  ensureDirs();

  const oldFiles = getFilesOlderThan(PATHS.archive, CONFIG.deleteAfterDays);

  if (oldFiles.length === 0) {
    console.log('✅ No archived files to delete');
    return 0;
  }

  console.log(`\n🗑️ Deleting ${oldFiles.length} old archived files...\n`);

  let deleted = 0;
  oldFiles.forEach(file => {
    const filePath = path.join(PATHS.archive, file);

    try {
      fs.unlinkSync(filePath);
      console.log(`   🗑️ ${file}`);
      deleted++;
    } catch (e) {
      console.log(`   ❌ ${file}: ${e.message}`);
    }
  });

  console.log(`\n✅ Deleted ${deleted} files\n`);
  return deleted;
}

function runAll() {
  console.log('\n🔧 Running all maintenance tasks...\n');
  console.log('═'.repeat(50));

  status();

  console.log('\n--- Rotate ---');
  rotate();

  console.log('\n--- Compress ---');
  compress();

  console.log('\n--- Cleanup ---');
  cleanup();

  console.log('═'.repeat(50));
  console.log('\n✅ Maintenance complete!\n');
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'status':
    status();
    break;

  case 'rotate':
    rotate();
    break;

  case 'compress':
    compress();
    break;

  case 'cleanup':
    cleanup();
    break;

  case 'all':
    runAll();
    break;

  default:
    console.log(`
Log Maintenance - Rotation, archival, and cleanup

Commands:
  status     Show current status and sizes
  rotate     Archive activity logs older than ${CONFIG.rotateAfterDays} days
  compress   Compress digests older than ${CONFIG.compressAfterDays} days
  cleanup    Delete archived files older than ${CONFIG.deleteAfterDays} days
  all        Run all maintenance tasks

Configuration:
  Rotate after:   ${CONFIG.rotateAfterDays} days
  Compress after: ${CONFIG.compressAfterDays} days
  Delete after:   ${CONFIG.deleteAfterDays} days

Recommendation: Run 'node log-maintenance.mjs all' monthly
`);
}
