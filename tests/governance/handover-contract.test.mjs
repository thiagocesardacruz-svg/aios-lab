/**
 * Handover Contract Schema Validation Tests
 * Story: GOV-001.1
 *
 * Tests the handover contract schema against valid and invalid contracts.
 * Uses native Node.js test runner (no external dependencies).
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { test, describe } from 'node:test';
import assert from 'node:assert';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load schema
const schemaPath = join(__dirname, '../../governance/schemas/handover-contract-schema.json');
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));

/**
 * Simple JSON Schema validator (basic implementation)
 * For production, use ajv library
 */
function validateContract(contract, schema) {
  const errors = [];

  // Check required fields
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in contract)) {
        errors.push(`Missing required field: ${field}`);
      }
    }
  }

  // Check from_agent pattern
  if (contract.from_agent && !contract.from_agent.match(/^@[a-z][a-z0-9-]*$/)) {
    errors.push(`Invalid from_agent format: ${contract.from_agent}`);
  }

  // Check to_agent pattern
  if (contract.to_agent && !contract.to_agent.match(/^@[a-z][a-z0-9-]*$/)) {
    errors.push(`Invalid to_agent format: ${contract.to_agent}`);
  }

  // Check artifact_type enum
  const validTypes = ['epic', 'story', 'task', 'document', 'review', 'deployment', 'research'];
  if (contract.artifact_type && !validTypes.includes(contract.artifact_type)) {
    errors.push(`Invalid artifact_type: ${contract.artifact_type}`);
  }

  // Check verification object
  if (contract.verification) {
    if (typeof contract.verification.checklist_completed !== 'boolean') {
      errors.push('verification.checklist_completed must be a boolean');
    }

    const validConfidence = ['low', 'medium', 'high'];
    if (!validConfidence.includes(contract.verification.confidence)) {
      errors.push(`Invalid confidence level: ${contract.verification.confidence}`);
    }

    // Check confidence + evidence rule
    if (
      (contract.verification.confidence === 'low' || contract.verification.confidence === 'medium') &&
      (!contract.verification.evidence || contract.verification.evidence.length === 0)
    ) {
      errors.push('Evidence required when confidence is low or medium');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Test Cases
describe('Handover Contract Schema', () => {

  test('Schema file exists and is valid JSON', () => {
    assert.ok(schema, 'Schema should be loaded');
    assert.strictEqual(schema.$schema, 'http://json-schema.org/draft-07/schema#');
    assert.strictEqual(schema.title, 'Handover Contract Schema');
  });

  test('Schema has required fields defined', () => {
    assert.ok(Array.isArray(schema.required), 'required should be an array');
    assert.ok(schema.required.includes('from_agent'), 'from_agent should be required');
    assert.ok(schema.required.includes('to_agent'), 'to_agent should be required');
    assert.ok(schema.required.includes('artifact_type'), 'artifact_type should be required');
    assert.ok(schema.required.includes('verification'), 'verification should be required');
  });

  test('Valid minimal contract passes validation', () => {
    const contract = {
      from_agent: '@pm',
      to_agent: '@sm',
      artifact_type: 'epic',
      verification: {
        checklist_completed: true,
        confidence: 'high'
      }
    };

    const result = validateContract(contract, schema);
    assert.strictEqual(result.valid, true, `Should be valid but got errors: ${result.errors.join(', ')}`);
  });

  test('Valid full contract passes validation', () => {
    const contract = {
      from_agent: '@pm',
      to_agent: '@sm',
      artifact_type: 'epic',
      artifact_id: 'AIOS-GOV-001',
      artifact_path: 'docs/epics/AIOS-GOV-001.md',
      required_fields: ['business_context', 'success_metrics'],
      verification: {
        checklist_completed: true,
        checklist_path: 'checklists/epic-ready.md',
        confidence: 'high',
        evidence: ['Epic created', 'ClickUp synced']
      },
      paper_trail: {
        clickup_task_id: '86c86efw9',
        timestamp: '2026-02-12T14:30:00Z'
      },
      next_actions: ['@sm: Create stories']
    };

    const result = validateContract(contract, schema);
    assert.strictEqual(result.valid, true, `Should be valid but got errors: ${result.errors.join(', ')}`);
  });

  test('Contract missing from_agent fails validation', () => {
    const contract = {
      to_agent: '@sm',
      artifact_type: 'epic',
      verification: {
        checklist_completed: true,
        confidence: 'high'
      }
    };

    const result = validateContract(contract, schema);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('from_agent')));
  });

  test('Contract with invalid agent format fails validation', () => {
    const contract = {
      from_agent: 'pm',  // Missing @ prefix
      to_agent: '@sm',
      artifact_type: 'epic',
      verification: {
        checklist_completed: true,
        confidence: 'high'
      }
    };

    const result = validateContract(contract, schema);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('from_agent')));
  });

  test('Contract with invalid artifact_type fails validation', () => {
    const contract = {
      from_agent: '@pm',
      to_agent: '@sm',
      artifact_type: 'invalid_type',
      verification: {
        checklist_completed: true,
        confidence: 'high'
      }
    };

    const result = validateContract(contract, schema);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('artifact_type')));
  });

  test('Low confidence without evidence fails validation', () => {
    const contract = {
      from_agent: '@pm',
      to_agent: '@sm',
      artifact_type: 'epic',
      verification: {
        checklist_completed: true,
        confidence: 'low'
        // No evidence provided
      }
    };

    const result = validateContract(contract, schema);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('Evidence required')));
  });

  test('Low confidence with evidence passes validation', () => {
    const contract = {
      from_agent: '@pm',
      to_agent: '@sm',
      artifact_type: 'epic',
      verification: {
        checklist_completed: true,
        confidence: 'low',
        evidence: ['Partial completion due to blockers']
      }
    };

    const result = validateContract(contract, schema);
    assert.strictEqual(result.valid, true, `Should be valid but got errors: ${result.errors.join(', ')}`);
  });

  test('Medium confidence without evidence fails validation', () => {
    const contract = {
      from_agent: '@pm',
      to_agent: '@sm',
      artifact_type: 'story',
      verification: {
        checklist_completed: true,
        confidence: 'medium'
        // No evidence
      }
    };

    const result = validateContract(contract, schema);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('Evidence required')));
  });

  test('High confidence without evidence passes validation', () => {
    const contract = {
      from_agent: '@pm',
      to_agent: '@sm',
      artifact_type: 'task',
      verification: {
        checklist_completed: true,
        confidence: 'high'
        // No evidence needed for high confidence
      }
    };

    const result = validateContract(contract, schema);
    assert.strictEqual(result.valid, true);
  });

  test('Schema example from documentation is valid', () => {
    // Use the example from the schema itself
    const example = schema.examples[0];
    const result = validateContract(example, schema);
    assert.strictEqual(result.valid, true, `Schema example should be valid but got errors: ${result.errors.join(', ')}`);
  });

});

// Run summary
console.log('\n✅ Handover Contract Schema Tests');
console.log('Run with: node --test tests/governance/handover-contract.test.mjs');
