#!/usr/bin/env node
/**
 * Handover Gate - Standalone handover contract validation
 * Story: GOV-001.3
 *
 * Validates handover contracts before ClickUp status transitions.
 * Can be used standalone or integrated with clickup-sync.mjs.
 *
 * Usage:
 *   node handover-gate.mjs --contract contract.json
 *   node handover-gate.mjs --quick --contract contract.json
 *   echo '{"from_agent":"@pm",...}' | node handover-gate.mjs --stdin
 *   node handover-gate.mjs --validate-inline '{"from_agent":"@pm",...}'
 */

import { readFileSync, writeFileSync, existsSync, appendFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve paths
const PROJECT_ROOT = resolve(__dirname, '../../../');
const SCHEMA_PATH = join(PROJECT_ROOT, 'governance/schemas/handover-contract-schema.json');
const METRICS_PATH = join(PROJECT_ROOT, '.aios/logs/handover-metrics.json');
const SKIPS_LOG_PATH = join(PROJECT_ROOT, '.aios/logs/handover-skips.log');

// =============================================================================
// VALIDATION LOGIC (imported from skill, duplicated for standalone use)
// =============================================================================

function loadSchema() {
  if (!existsSync(SCHEMA_PATH)) {
    return null; // Graceful degradation
  }
  return JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'));
}

function formatErrors(errors) {
  return errors.map((err, idx) => `${idx + 1}. ${err}`);
}

function generateSuggestions(errors, contract) {
  const suggestions = [];

  for (const error of errors) {
    if (error.includes('from_agent') && error.includes('Missing')) {
      suggestions.push('Add from_agent field: from_agent: "@your-agent"');
    } else if (error.includes('to_agent') && error.includes('Missing')) {
      suggestions.push('Add to_agent field: to_agent: "@receiving-agent"');
    } else if (error.includes('artifact_type')) {
      suggestions.push('Add artifact_type: "epic" | "story" | "task" | "document" | "review"');
    } else if (error.includes('verification')) {
      suggestions.push('Add verification block with checklist_completed (boolean) and confidence (low|medium|high)');
    } else if (error.includes('Evidence required')) {
      suggestions.push('Add evidence array: evidence: ["Item 1", "Item 2", ...]');
    } else if (error.includes('Invalid') && error.includes('agent')) {
      suggestions.push('Agent names must start with @: "@pm", "@dev", "@architect"');
    }
  }

  return [...new Set(suggestions)];
}

function validateQuick(contract) {
  const errors = [];

  if (!contract.from_agent) {
    errors.push('Missing required field: from_agent');
  } else if (!contract.from_agent.match(/^@[a-z][a-z0-9-]*$/)) {
    errors.push(`Invalid from_agent format: ${contract.from_agent}`);
  }

  if (!contract.to_agent) {
    errors.push('Missing required field: to_agent');
  } else if (!contract.to_agent.match(/^@[a-z][a-z0-9-]*$/)) {
    errors.push(`Invalid to_agent format: ${contract.to_agent}`);
  }

  if (!contract.artifact_type) {
    errors.push('Missing required field: artifact_type');
  }

  return {
    valid: errors.length === 0,
    mode: 'quick',
    errors: formatErrors(errors),
    suggestions: generateSuggestions(errors, contract)
  };
}

function validateFull(contract, schema) {
  const errors = [];

  // Required fields
  const required = schema?.required || ['from_agent', 'to_agent', 'artifact_type', 'verification'];
  for (const field of required) {
    if (!(field in contract)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Agent format validation
  if (contract.from_agent && !contract.from_agent.match(/^@[a-z][a-z0-9-]*$/)) {
    errors.push(`Invalid from_agent format: ${contract.from_agent}`);
  }
  if (contract.to_agent && !contract.to_agent.match(/^@[a-z][a-z0-9-]*$/)) {
    errors.push(`Invalid to_agent format: ${contract.to_agent}`);
  }

  // Artifact type validation
  const validTypes = ['epic', 'story', 'task', 'document', 'review', 'deployment', 'research'];
  if (contract.artifact_type && !validTypes.includes(contract.artifact_type)) {
    errors.push(`Invalid artifact_type: ${contract.artifact_type}`);
  }

  // Verification block validation
  if (contract.verification) {
    if (typeof contract.verification.checklist_completed !== 'boolean') {
      errors.push('verification.checklist_completed must be a boolean');
    }

    const validConfidence = ['low', 'medium', 'high'];
    if (!validConfidence.includes(contract.verification.confidence)) {
      errors.push(`Invalid verification.confidence: ${contract.verification.confidence}`);
    }

    // Five Trust Behaviors: Evidence required when confidence < high
    if (
      (contract.verification.confidence === 'low' || contract.verification.confidence === 'medium') &&
      (!contract.verification.evidence || contract.verification.evidence.length === 0)
    ) {
      errors.push('Evidence required when confidence is "low" or "medium"');
    }

    if (contract.verification.checklist_completed === false) {
      errors.push('checklist_completed must be true before handover');
    }
  }

  return {
    valid: errors.length === 0,
    mode: 'full',
    errors: formatErrors(errors),
    suggestions: generateSuggestions(errors, contract)
  };
}

// =============================================================================
// METRICS TRACKING
// =============================================================================

function loadMetrics() {
  try {
    if (existsSync(METRICS_PATH)) {
      return JSON.parse(readFileSync(METRICS_PATH, 'utf8'));
    }
  } catch (err) {
    // Ignore errors, return default
  }
  return {
    total_validations: 0,
    valid_handovers: 0,
    invalid_handovers: 0,
    skipped_handovers: 0,
    by_agent: {},
    by_artifact_type: {},
    last_updated: null
  };
}

function saveMetrics(metrics) {
  try {
    const logDir = dirname(METRICS_PATH);
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }
    metrics.last_updated = new Date().toISOString();
    writeFileSync(METRICS_PATH, JSON.stringify(metrics, null, 2));
  } catch (err) {
    console.warn('Warning: Could not save metrics:', err.message);
  }
}

function updateMetrics(result, contract) {
  const metrics = loadMetrics();

  metrics.total_validations++;

  if (result.valid) {
    metrics.valid_handovers++;
  } else {
    metrics.invalid_handovers++;
  }

  // Track by agent
  const fromAgent = contract?.from_agent || 'unknown';
  metrics.by_agent[fromAgent] = (metrics.by_agent[fromAgent] || 0) + 1;

  // Track by artifact type
  const artifactType = contract?.artifact_type || 'unknown';
  metrics.by_artifact_type[artifactType] = (metrics.by_artifact_type[artifactType] || 0) + 1;

  saveMetrics(metrics);
  return metrics;
}

function recordSkip(taskId, reason) {
  const metrics = loadMetrics();
  metrics.skipped_handovers++;
  saveMetrics(metrics);

  // Log to skip file
  try {
    const logDir = dirname(SKIPS_LOG_PATH);
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }
    const entry = {
      timestamp: new Date().toISOString(),
      task_id: taskId,
      reason
    };
    appendFileSync(SKIPS_LOG_PATH, JSON.stringify(entry) + '\n');
  } catch (err) {
    console.warn('Warning: Could not log skip:', err.message);
  }
}

// =============================================================================
// MAIN VALIDATION FUNCTION
// =============================================================================

export async function validateHandover(contract, options = {}) {
  const { quick = false, trackMetrics = true } = options;

  if (!contract || typeof contract !== 'object') {
    return {
      valid: false,
      mode: quick ? 'quick' : 'full',
      errors: ['1. Contract must be a non-null object'],
      suggestions: ['Provide a valid handover contract object'],
      degraded: false
    };
  }

  let result;
  let degraded = false;

  if (quick) {
    result = validateQuick(contract);
  } else {
    const schema = loadSchema();
    if (!schema) {
      // Graceful degradation
      console.warn('⚠️ Schema not found. Using basic validation.');
      result = validateQuick(contract);
      result.mode = 'full (degraded)';
      degraded = true;
    } else {
      result = validateFull(contract, schema);
    }
  }

  result.degraded = degraded;

  // Track metrics
  if (trackMetrics) {
    updateMetrics(result, contract);
  }

  return result;
}

export function formatResult(result, verbose = false) {
  const lines = [];

  if (result.valid) {
    lines.push('✅ Handover Validation Passed');
    lines.push(`   Mode: ${result.mode}`);
    if (result.degraded) {
      lines.push('   ⚠️ Running in degraded mode (schema not found)');
    }
  } else {
    lines.push('❌ Handover Validation Failed');
    lines.push(`   Mode: ${result.mode}`);
    lines.push('');
    lines.push('Errors:');
    for (const error of result.errors) {
      lines.push(`   ${error}`);
    }
    if (result.suggestions.length > 0) {
      lines.push('');
      lines.push('Suggestions:');
      for (const suggestion of result.suggestions) {
        lines.push(`   • ${suggestion}`);
      }
    }
    if (verbose) {
      lines.push('');
      lines.push('References:');
      lines.push('   Schema: governance/schemas/handover-contract-schema.json');
      lines.push('   Rules: .claude/rules/handover-contracts.md');
    }
  }

  return lines.join('\n');
}

export function generatePaperTrailComment(contract) {
  const lines = [
    '## Handover Contract Validated',
    '',
    `**From**: ${contract.from_agent}`,
    `**To**: ${contract.to_agent}`,
    `**Artifact**: ${contract.artifact_type}${contract.artifact_id ? ` (${contract.artifact_id})` : ''}`,
  ];

  if (contract.verification) {
    lines.push(`**Confidence**: ${contract.verification.confidence}`);
    if (contract.verification.evidence) {
      lines.push(`**Evidence**: ${contract.verification.evidence.length} items`);
    }
  }

  if (contract.next_actions && contract.next_actions.length > 0) {
    lines.push('');
    lines.push('**Next Actions**:');
    contract.next_actions.forEach((action, idx) => {
      lines.push(`${idx + 1}. ${action}`);
    });
  }

  lines.push('');
  lines.push(`*Validated at: ${new Date().toISOString()}*`);

  return lines.join('\n');
}

export { recordSkip, loadMetrics };

// =============================================================================
// CLI
// =============================================================================

async function main() {
  const args = process.argv.slice(2);

  const quick = args.includes('--quick');
  const verbose = args.includes('--verbose');
  const metricsOnly = args.includes('--metrics');

  // Show metrics only
  if (metricsOnly) {
    const metrics = loadMetrics();
    console.log(JSON.stringify(metrics, null, 2));
    return;
  }

  // Get contract from various sources
  let contractJson;

  if (args.includes('--contract')) {
    const idx = args.indexOf('--contract');
    const contractPath = args[idx + 1];
    if (!contractPath || !existsSync(contractPath)) {
      console.error('Error: Contract file not found');
      process.exit(1);
    }
    contractJson = readFileSync(contractPath, 'utf8');
  } else if (args.includes('--validate-inline')) {
    const idx = args.indexOf('--validate-inline');
    contractJson = args[idx + 1];
  } else if (args.includes('--stdin')) {
    contractJson = readFileSync(0, 'utf8');
  } else if (args.includes('--help') || args.length === 0) {
    console.log(`
Handover Gate - Validate handover contracts

Usage:
  node handover-gate.mjs --contract contract.json
  node handover-gate.mjs --quick --contract contract.json
  node handover-gate.mjs --validate-inline '{"from_agent":"@pm",...}'
  echo '{"from_agent":"@pm",...}' | node handover-gate.mjs --stdin
  node handover-gate.mjs --metrics

Options:
  --contract <file>     Read contract from JSON file
  --validate-inline     Validate inline JSON string
  --stdin               Read contract from stdin
  --quick               Use quick validation (minimal checks)
  --verbose             Show detailed output with references
  --metrics             Show validation metrics

Exit Codes:
  0 - Validation passed
  1 - Validation failed
    `);
    return;
  } else {
    console.error('Error: No contract provided. Use --help for usage.');
    process.exit(1);
  }

  try {
    const contract = JSON.parse(contractJson);
    const result = await validateHandover(contract, { quick });

    console.log(formatResult(result, verbose));

    if (verbose && result.valid) {
      console.log('\n--- Paper Trail Comment ---');
      console.log(generatePaperTrailComment(contract));
    }

    process.exit(result.valid ? 0 : 1);
  } catch (err) {
    console.error('Error parsing contract:', err.message);
    process.exit(1);
  }
}

// Run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}
