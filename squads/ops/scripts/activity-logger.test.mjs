#!/usr/bin/env node
/**
 * Tests for Activity Logger
 * Run: node activity-logger.test.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_SCRIPT = path.join(__dirname, 'log.mjs');
const ACTIVITY_SCRIPT = path.join(__dirname, 'activity-logger.mjs');
const ROOT = path.resolve(__dirname, '../../..');
const TEST_LOG_DIR = path.join(ROOT, '.aios/logs/activity-test');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function setup() {
  // Create test directory
  if (!fs.existsSync(TEST_LOG_DIR)) {
    fs.mkdirSync(TEST_LOG_DIR, { recursive: true });
  }
}

function cleanup() {
  // Remove test files
  if (fs.existsSync(TEST_LOG_DIR)) {
    fs.rmSync(TEST_LOG_DIR, { recursive: true });
  }
}

// Tests
console.log('\n🧪 Activity Logger Tests\n');
console.log('─'.repeat(50));

setup();

test('log.mjs creates entry with correct structure', () => {
  const output = execSync(`node "${LOG_SCRIPT}" "Test message for unit test" --type=action`, {
    encoding: 'utf-8'
  });
  assert(output.includes('action:'), 'Should output action type');
});

test('log.mjs auto-detects decision type', () => {
  const output = execSync(`node "${LOG_SCRIPT}" "Decidimos usar nova abordagem"`, {
    encoding: 'utf-8'
  });
  assert(output.includes('decision:'), 'Should auto-detect decision');
});

test('log.mjs auto-detects error type', () => {
  const output = execSync(`node "${LOG_SCRIPT}" "Erro encontrado no sistema"`, {
    encoding: 'utf-8'
  });
  assert(output.includes('error:'), 'Should auto-detect error');
});

test('log.mjs auto-detects implementation type', () => {
  const output = execSync(`node "${LOG_SCRIPT}" "Implementamos feature X"`, {
    encoding: 'utf-8'
  });
  assert(output.includes('implementation:'), 'Should auto-detect implementation');
});

test('activity-logger.mjs view returns entries', () => {
  const output = execSync(`node "${ACTIVITY_SCRIPT}" view --today`, {
    encoding: 'utf-8'
  });
  assert(output.includes('Activity Log'), 'Should show activity log header');
  assert(output.includes('Total:'), 'Should show total count');
});

test('activity-logger.mjs stats works', () => {
  const output = execSync(`node "${ACTIVITY_SCRIPT}" stats`, {
    encoding: 'utf-8'
  });
  assert(output.includes('Activity Log Stats'), 'Should show stats header');
});

test('JSONL format is valid', () => {
  const today = new Date().toISOString().split('T')[0];
  const logFile = path.join(ROOT, '.aios/logs/activity', `${today}.jsonl`);

  if (fs.existsSync(logFile)) {
    const lines = fs.readFileSync(logFile, 'utf-8').split('\n').filter(Boolean);
    lines.forEach((line, i) => {
      try {
        JSON.parse(line);
      } catch (e) {
        throw new Error(`Line ${i + 1} is not valid JSON`);
      }
    });
  }
  assert(true, 'All lines are valid JSON');
});

test('Entry has required fields', () => {
  const today = new Date().toISOString().split('T')[0];
  const logFile = path.join(ROOT, '.aios/logs/activity', `${today}.jsonl`);

  if (fs.existsSync(logFile)) {
    const lines = fs.readFileSync(logFile, 'utf-8').split('\n').filter(Boolean);
    const entry = JSON.parse(lines[lines.length - 1]);

    assert(entry.timestamp, 'Should have timestamp');
    assert(entry.action, 'Should have action');
    assert(entry.type, 'Should have type');
    assert(Array.isArray(entry.tags), 'Should have tags array');
    assert(Array.isArray(entry.files), 'Should have files array');
  }
});

// Summary
console.log('─'.repeat(50));
console.log(`\nResults: ${passed} passed, ${failed} failed`);
console.log('');

cleanup();

process.exit(failed > 0 ? 1 : 0);
