#!/usr/bin/env node
/**
 * Validate OS Files
 *
 * Validates Service Order YAML files against the schema.
 * Reports errors and warnings for each file.
 *
 * Usage:
 *   node validate-os.js                 # Validate all OS files
 *   node validate-os.js <file>          # Validate specific file
 *   node validate-os.js --strict        # Fail on warnings
 *   node validate-os.js --json          # Output as JSON
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const LOGS_DIR = path.join(ROOT_DIR, 'logs', 'service-orders');
const SCHEMA_FILE = path.join(LOGS_DIR, '_schema.yaml');

// Schema definition (extracted from _schema.yaml)
const SCHEMA = {
  required: ['os_id', 'title', 'squad', 'workflow', 'status', 'priority', 'requester', 'created_at'],
  fields: {
    os_id: {
      type: 'string',
      pattern: /^OS-\d{4}-\d{4}$/
    },
    title: {
      type: 'string',
      maxLength: 100
    },
    squad: {
      type: 'string',
      enum: ['ops', 'marketing', 'sales', 'growth', 'tech', 'development', 'finance', 'qa', 'translator', 'customer', 'board']
    },
    workflow: {
      type: 'string',
      pattern: /^\/[a-z]+\/[a-z0-9-]+$/
    },
    status: {
      type: 'string',
      enum: ['intake', 'running', 'blocked', 'qa', 'done', 'cancelled']
    },
    priority: {
      type: 'string',
      enum: ['critical', 'high', 'medium', 'low']
    },
    requester: {
      type: 'string'
    },
    created_at: {
      type: 'string',
      format: 'datetime'
    },
    started_at: {
      type: 'string',
      format: 'datetime'
    },
    completed_at: {
      type: 'string',
      format: 'datetime'
    },
    duration_minutes: {
      type: 'number',
      min: 0
    },
    agents_used: {
      type: 'array',
      items: 'string'
    },
    tokens: {
      type: 'object',
      properties: {
        input: { type: 'number' },
        output: { type: 'number' }
      }
    },
    cost: {
      type: 'object',
      properties: {
        estimated_eur: { type: 'number' },
        actual_eur: { type: 'number' },
        category: {
          type: 'string',
          enum: ['BASE', 'EXEC', 'VRFY', 'RCVR', 'EXTA', 'EXTM', 'DEV_']
        },
        mode: {
          type: 'string',
          enum: ['OP', 'CLIENT', 'DEV']
        }
      }
    },
    outputs: {
      type: 'array',
      items: 'object'
    },
    blocked_reason: {
      type: 'string'
    },
    blocked_by: {
      type: 'string',
      pattern: /^OS-\d{4}-\d{4}$/
    },
    project_id: {
      type: 'string',
      pattern: /^PRJ-\d{3}$/
    },
    project_name: {
      type: 'string'
    },
    tags: {
      type: 'array',
      items: 'string'
    },
    notes: {
      type: 'string'
    }
  }
};

/**
 * Validate a single field value
 * @param {string} fieldName
 * @param {any} value
 * @param {object} fieldSchema
 * @returns {{ errors: string[], warnings: string[] }}
 */
function validateField(fieldName, value, fieldSchema) {
  const errors = [];
  const warnings = [];

  if (value === undefined || value === null) {
    return { errors, warnings };
  }

  // Type check
  if (fieldSchema.type === 'string' && typeof value !== 'string') {
    errors.push(`${fieldName}: expected string, got ${typeof value}`);
    return { errors, warnings };
  }

  if (fieldSchema.type === 'number' && typeof value !== 'number') {
    errors.push(`${fieldName}: expected number, got ${typeof value}`);
    return { errors, warnings };
  }

  if (fieldSchema.type === 'array' && !Array.isArray(value)) {
    errors.push(`${fieldName}: expected array, got ${typeof value}`);
    return { errors, warnings };
  }

  if (fieldSchema.type === 'object' && (typeof value !== 'object' || Array.isArray(value))) {
    errors.push(`${fieldName}: expected object, got ${typeof value}`);
    return { errors, warnings };
  }

  // Pattern check
  if (fieldSchema.pattern && typeof value === 'string') {
    if (!fieldSchema.pattern.test(value)) {
      errors.push(`${fieldName}: "${value}" does not match pattern ${fieldSchema.pattern}`);
    }
  }

  // Enum check
  if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
    errors.push(`${fieldName}: "${value}" is not one of: ${fieldSchema.enum.join(', ')}`);
  }

  // Max length check
  if (fieldSchema.maxLength && typeof value === 'string' && value.length > fieldSchema.maxLength) {
    warnings.push(`${fieldName}: length ${value.length} exceeds max ${fieldSchema.maxLength}`);
  }

  // Min check
  if (fieldSchema.min !== undefined && typeof value === 'number' && value < fieldSchema.min) {
    errors.push(`${fieldName}: ${value} is less than minimum ${fieldSchema.min}`);
  }

  // Datetime format check
  if (fieldSchema.format === 'datetime' && typeof value === 'string') {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      errors.push(`${fieldName}: "${value}" is not a valid datetime`);
    }
  }

  return { errors, warnings };
}

/**
 * Validate an OS document
 * @param {object} doc
 * @param {string} filePath
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
function validateOs(doc, filePath) {
  const errors = [];
  const warnings = [];

  if (!doc || typeof doc !== 'object') {
    errors.push('Document is empty or not an object');
    return { valid: false, errors, warnings };
  }

  // Check required fields
  for (const field of SCHEMA.required) {
    if (doc[field] === undefined || doc[field] === null || doc[field] === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate each field
  for (const [fieldName, value] of Object.entries(doc)) {
    const fieldSchema = SCHEMA.fields[fieldName];

    if (!fieldSchema) {
      warnings.push(`Unknown field: ${fieldName}`);
      continue;
    }

    const result = validateField(fieldName, value, fieldSchema);
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  // Business logic validations
  if (doc.status === 'blocked' && !doc.blocked_reason) {
    warnings.push('Status is "blocked" but no blocked_reason provided');
  }

  if (doc.status === 'done' && !doc.completed_at) {
    warnings.push('Status is "done" but no completed_at timestamp');
  }

  if (doc.status === 'done' && doc.cost && !doc.cost.actual_eur) {
    warnings.push('Status is "done" but actual_eur not filled');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate a file
 * @param {string} filePath
 * @returns {Promise<{ file: string, valid: boolean, errors: string[], warnings: string[] }>}
 */
async function validateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const doc = yaml.load(content);
    const result = validateOs(doc, filePath);
    return {
      file: filePath,
      ...result
    };
  } catch (err) {
    return {
      file: filePath,
      valid: false,
      errors: [`Parse error: ${err.message}`],
      warnings: []
    };
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const strictMode = args.includes('--strict');
  const jsonOutput = args.includes('--json');

  // Get files to validate
  const fileArgs = args.filter(a => !a.startsWith('--'));
  let files;

  if (fileArgs.length > 0) {
    files = fileArgs;
  } else {
    // Find all YAML files in logs directory
    if (!fs.existsSync(LOGS_DIR)) {
      console.log('No service-orders directory found. Nothing to validate.');
      process.exit(0);
    }

    files = await glob('**/*.yaml', {
      cwd: LOGS_DIR,
      ignore: ['_schema.yaml', '_template.yaml'],
      absolute: true
    });
  }

  if (files.length === 0) {
    console.log('No OS files found to validate.');
    process.exit(0);
  }

  // Validate all files
  const results = [];
  for (const file of files) {
    const result = await validateFile(file);
    results.push(result);
  }

  // Output results
  if (jsonOutput) {
    console.log(JSON.stringify({
      total: results.length,
      valid: results.filter(r => r.valid).length,
      invalid: results.filter(r => !r.valid).length,
      results
    }, null, 2));
  } else {
    let hasErrors = false;
    let hasWarnings = false;

    for (const result of results) {
      const relativePath = path.relative(ROOT_DIR, result.file);

      if (result.errors.length > 0 || result.warnings.length > 0) {
        console.log(`\n${relativePath}:`);

        for (const error of result.errors) {
          console.log(`  ERROR: ${error}`);
          hasErrors = true;
        }

        for (const warning of result.warnings) {
          console.log(`  WARN: ${warning}`);
          hasWarnings = true;
        }
      }
    }

    console.log(`\n--- Summary ---`);
    console.log(`Total: ${results.length}`);
    console.log(`Valid: ${results.filter(r => r.valid).length}`);
    console.log(`Invalid: ${results.filter(r => !r.valid).length}`);

    if (hasErrors || (strictMode && hasWarnings)) {
      process.exit(1);
    }
  }
}

main();
