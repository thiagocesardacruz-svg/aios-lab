/**
 * Handover Contract Validator
 * Story: GOV-001.2
 *
 * Validates handover contracts between AIOS agents, ensuring complete
 * context transfer and enforcement of the Five Trust Behaviors.
 *
 * @module validate-handover
 */

import { readFileSync, existsSync, appendFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve project root (4 levels up from scripts/)
const PROJECT_ROOT = resolve(__dirname, '../../../../');
const SCHEMA_PATH = join(PROJECT_ROOT, 'governance/schemas/handover-contract-schema.json');
const LOG_PATH = join(PROJECT_ROOT, '.aios/logs/handovers.log');

/**
 * Load the handover contract JSON schema
 * @returns {Object} The JSON schema
 */
function loadSchema() {
  if (!existsSync(SCHEMA_PATH)) {
    throw new Error(`Schema not found: ${SCHEMA_PATH}`);
  }
  return JSON.parse(readFileSync(SCHEMA_PATH, 'utf8'));
}

/**
 * Format validation errors into user-friendly messages
 * @param {Array} errors - Array of error objects
 * @returns {Array} Formatted error messages
 */
function formatErrors(errors) {
  return errors.map((err, idx) => `${idx + 1}. ${err}`);
}

/**
 * Generate suggestions based on validation errors
 * @param {Array} errors - Array of error strings
 * @param {Object} contract - The contract being validated
 * @returns {Array} Suggestion messages
 */
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
    } else if (error.includes('checklist_completed')) {
      suggestions.push('Set checklist_completed: true (after completing pre-handover checklist)');
    } else if (error.includes('confidence')) {
      suggestions.push('Set confidence: "low" | "medium" | "high"');
    }
  }

  // Remove duplicates
  return [...new Set(suggestions)];
}

/**
 * Validate contract in quick mode (minimal validation)
 * @param {Object} contract - The handover contract
 * @returns {Object} Validation result
 */
function validateQuick(contract) {
  const errors = [];

  // Only validate essential fields
  if (!contract.from_agent) {
    errors.push('Missing required field: from_agent');
  } else if (!contract.from_agent.match(/^@[a-z][a-z0-9-]*$/)) {
    errors.push(`Invalid from_agent format: ${contract.from_agent} (should be @agent-name)`);
  }

  if (!contract.to_agent) {
    errors.push('Missing required field: to_agent');
  } else if (!contract.to_agent.match(/^@[a-z][a-z0-9-]*$/)) {
    errors.push(`Invalid to_agent format: ${contract.to_agent} (should be @agent-name)`);
  }

  if (!contract.artifact_type) {
    errors.push('Missing required field: artifact_type');
  }

  const valid = errors.length === 0;

  return {
    valid,
    mode: 'quick',
    errors: valid ? [] : formatErrors(errors),
    suggestions: valid ? [] : generateSuggestions(errors, contract),
    contract: valid ? contract : null
  };
}

/**
 * Validate contract fully against JSON schema and trust behaviors
 * @param {Object} contract - The handover contract
 * @param {Object} schema - The JSON schema
 * @returns {Object} Validation result
 */
function validateFull(contract, schema) {
  const errors = [];

  // Check required fields from schema
  const required = schema.required || ['from_agent', 'to_agent', 'artifact_type', 'verification'];
  for (const field of required) {
    if (!(field in contract)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate from_agent format
  if (contract.from_agent) {
    if (!contract.from_agent.match(/^@[a-z][a-z0-9-]*$/)) {
      errors.push(`Invalid from_agent format: ${contract.from_agent} (should be @agent-name)`);
    }
  }

  // Validate to_agent format
  if (contract.to_agent) {
    if (!contract.to_agent.match(/^@[a-z][a-z0-9-]*$/)) {
      errors.push(`Invalid to_agent format: ${contract.to_agent} (should be @agent-name)`);
    }
  }

  // Validate artifact_type enum
  const validTypes = ['epic', 'story', 'task', 'document', 'review', 'deployment', 'research'];
  if (contract.artifact_type && !validTypes.includes(contract.artifact_type)) {
    errors.push(`Invalid artifact_type: ${contract.artifact_type}. Valid: ${validTypes.join(', ')}`);
  }

  // Validate verification block
  if (contract.verification) {
    // Check checklist_completed
    if (typeof contract.verification.checklist_completed !== 'boolean') {
      errors.push('verification.checklist_completed must be a boolean');
    }

    // Check confidence
    const validConfidence = ['low', 'medium', 'high'];
    if (!validConfidence.includes(contract.verification.confidence)) {
      errors.push(`Invalid verification.confidence: ${contract.verification.confidence}. Valid: ${validConfidence.join(', ')}`);
    }

    // Five Trust Behaviors: Evidence required when confidence < high
    if (
      (contract.verification.confidence === 'low' || contract.verification.confidence === 'medium') &&
      (!contract.verification.evidence || contract.verification.evidence.length === 0)
    ) {
      errors.push('Evidence required when confidence is "low" or "medium" (Five Trust Behaviors)');
    }

    // Diligent Execution: checklist must be completed
    if (contract.verification.checklist_completed === false) {
      errors.push('checklist_completed must be true before handover (Diligent Execution behavior)');
    }
  }

  // Check for additional properties not in schema
  const knownFields = [
    'from_agent', 'to_agent', 'artifact_type', 'artifact_id', 'artifact_path',
    'required_fields', 'verification', 'paper_trail', 'context', 'next_actions', 'metadata'
  ];
  for (const field of Object.keys(contract)) {
    if (!knownFields.includes(field)) {
      errors.push(`Unknown field: ${field} (not in schema)`);
    }
  }

  const valid = errors.length === 0;

  return {
    valid,
    mode: 'full',
    errors: valid ? [] : formatErrors(errors),
    suggestions: valid ? [] : generateSuggestions(errors, contract),
    contract: valid ? contract : null
  };
}

/**
 * Log handover validation to paper trail
 * @param {Object} result - Validation result
 * @param {Object} contract - The contract
 * @param {Object} options - Validation options
 */
function logHandover(result, contract, options) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    valid: result.valid,
    mode: result.mode,
    from_agent: contract?.from_agent || 'unknown',
    to_agent: contract?.to_agent || 'unknown',
    artifact_type: contract?.artifact_type || 'unknown',
    errors: result.errors,
    quick_mode: options.quick || false
  };

  try {
    // Ensure log directory exists
    const logDir = dirname(LOG_PATH);
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }

    appendFileSync(LOG_PATH, JSON.stringify(logEntry) + '\n');
  } catch (err) {
    // Silent fail on logging - don't break validation
    console.warn('Warning: Could not write to handover log:', err.message);
  }

  return logEntry;
}

/**
 * Main validation function
 * @param {Object} contract - The handover contract to validate
 * @param {Object} options - Validation options
 * @param {boolean} options.quick - Use quick mode (minimal validation)
 * @param {boolean} options.log - Log to paper trail (default: true)
 * @returns {Object} Validation result
 */
export async function validateHandover(contract, options = {}) {
  const { quick = false, log = true } = options;

  // Input validation
  if (!contract || typeof contract !== 'object') {
    return {
      valid: false,
      mode: quick ? 'quick' : 'full',
      errors: ['1. Contract must be a non-null object'],
      suggestions: ['Provide a valid handover contract object'],
      contract: null
    };
  }

  let result;

  if (quick) {
    // Quick mode: minimal validation
    result = validateQuick(contract);
  } else {
    // Full mode: schema + trust behaviors
    try {
      const schema = loadSchema();
      result = validateFull(contract, schema);
    } catch (err) {
      // Graceful degradation if schema not found
      console.warn(`Warning: ${err.message}. Falling back to basic validation.`);
      result = validateQuick(contract);
      result.mode = 'full (degraded)';
      result.warnings = [`Schema not found at ${SCHEMA_PATH}. Using basic validation.`];
    }
  }

  // Log to paper trail
  if (log) {
    result.log_entry = logHandover(result, contract, options);
  }

  return result;
}

/**
 * Format validation result for display
 * @param {Object} result - Validation result
 * @returns {string} Formatted string for display
 */
export function formatResult(result) {
  const lines = [];

  if (result.valid) {
    lines.push('✅ Handover Validation Passed');
    lines.push(`   Mode: ${result.mode}`);
    if (result.contract) {
      lines.push(`   From: ${result.contract.from_agent}`);
      lines.push(`   To: ${result.contract.to_agent}`);
      lines.push(`   Artifact: ${result.contract.artifact_type}`);
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
    lines.push('');
    lines.push('References:');
    lines.push('   Schema: governance/schemas/handover-contract-schema.json');
    lines.push('   Rules: .claude/rules/handover-contracts.md');
  }

  if (result.warnings) {
    lines.push('');
    lines.push('Warnings:');
    for (const warning of result.warnings) {
      lines.push(`   ⚠️ ${warning}`);
    }
  }

  return lines.join('\n');
}

// CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const quick = args.includes('--quick');

  // Read contract from stdin or file
  let contractJson;

  if (args.includes('--contract')) {
    const contractPath = args[args.indexOf('--contract') + 1];
    if (!contractPath || !existsSync(contractPath)) {
      console.error('Error: Contract file not found');
      process.exit(1);
    }
    contractJson = readFileSync(contractPath, 'utf8');
  } else if (args.includes('--stdin')) {
    // Read from stdin (for piping)
    contractJson = readFileSync(0, 'utf8');
  } else {
    // Demo with example contract
    contractJson = JSON.stringify({
      from_agent: '@pm',
      to_agent: '@sm',
      artifact_type: 'epic',
      verification: {
        checklist_completed: true,
        confidence: 'high'
      }
    });
    console.log('No contract provided. Running demo validation...\n');
  }

  try {
    const contract = JSON.parse(contractJson);
    const result = await validateHandover(contract, { quick, log: false });
    console.log(formatResult(result));
    process.exit(result.valid ? 0 : 1);
  } catch (err) {
    console.error('Error parsing contract JSON:', err.message);
    process.exit(1);
  }
}

export default validateHandover;
