/**
 * Handover Validator Skill Tests
 * Story: GOV-001.2
 *
 * Tests the handover validator skill functionality.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { validateHandover, formatResult } from '../scripts/validate-handover.js';

describe('Handover Validator Skill', () => {

  // ==========================================================================
  // Full Mode Tests
  // ==========================================================================

  describe('Full Validation Mode', () => {

    test('Valid minimal contract passes validation', async () => {
      const contract = {
        from_agent: '@pm',
        to_agent: '@sm',
        artifact_type: 'epic',
        verification: {
          checklist_completed: true,
          confidence: 'high'
        }
      };

      const result = await validateHandover(contract, { log: false });
      assert.strictEqual(result.valid, true, `Should be valid but got: ${result.errors?.join(', ')}`);
      assert.strictEqual(result.mode, 'full');
    });

    test('Valid full contract passes validation', async () => {
      const contract = {
        from_agent: '@architect',
        to_agent: '@dev',
        artifact_type: 'story',
        artifact_id: 'GOV-001.2',
        artifact_path: 'docs/stories/GOV-001.2.md',
        required_fields: ['acceptance_criteria', 'technical_specs'],
        verification: {
          checklist_completed: true,
          checklist_path: 'checklists/story-ready.md',
          confidence: 'high',
          evidence: ['Schema created', 'Tests passing']
        },
        paper_trail: {
          clickup_task_id: '86c86efzy',
          timestamp: '2026-02-12T15:30:00Z'
        },
        next_actions: ['@dev: Implement skill']
      };

      const result = await validateHandover(contract, { log: false });
      assert.strictEqual(result.valid, true, `Should be valid but got: ${result.errors?.join(', ')}`);
    });

    test('Missing from_agent fails validation', async () => {
      const contract = {
        to_agent: '@sm',
        artifact_type: 'epic',
        verification: {
          checklist_completed: true,
          confidence: 'high'
        }
      };

      const result = await validateHandover(contract, { log: false });
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('from_agent')));
    });

    test('Invalid agent format fails validation', async () => {
      const contract = {
        from_agent: 'pm',  // Missing @ prefix
        to_agent: '@sm',
        artifact_type: 'epic',
        verification: {
          checklist_completed: true,
          confidence: 'high'
        }
      };

      const result = await validateHandover(contract, { log: false });
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('from_agent') && e.includes('Invalid')));
    });

    test('Invalid artifact_type fails validation', async () => {
      const contract = {
        from_agent: '@pm',
        to_agent: '@sm',
        artifact_type: 'invalid_type',
        verification: {
          checklist_completed: true,
          confidence: 'high'
        }
      };

      const result = await validateHandover(contract, { log: false });
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('artifact_type')));
    });

    test('Missing verification block fails validation', async () => {
      const contract = {
        from_agent: '@pm',
        to_agent: '@sm',
        artifact_type: 'epic'
      };

      const result = await validateHandover(contract, { log: false });
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('verification')));
    });

  });

  // ==========================================================================
  // Five Trust Behaviors Tests
  // ==========================================================================

  describe('Five Trust Behaviors Enforcement', () => {

    test('Low confidence without evidence fails (Honest Uncertainty)', async () => {
      const contract = {
        from_agent: '@pm',
        to_agent: '@sm',
        artifact_type: 'epic',
        verification: {
          checklist_completed: true,
          confidence: 'low'
          // No evidence
        }
      };

      const result = await validateHandover(contract, { log: false });
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('Evidence required')));
    });

    test('Medium confidence without evidence fails (Honest Uncertainty)', async () => {
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

      const result = await validateHandover(contract, { log: false });
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('Evidence required')));
    });

    test('Low confidence with evidence passes', async () => {
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

      const result = await validateHandover(contract, { log: false });
      assert.strictEqual(result.valid, true, `Should be valid but got: ${result.errors?.join(', ')}`);
    });

    test('High confidence without evidence passes', async () => {
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

      const result = await validateHandover(contract, { log: false });
      assert.strictEqual(result.valid, true);
    });

    test('checklist_completed: false fails (Diligent Execution)', async () => {
      const contract = {
        from_agent: '@pm',
        to_agent: '@sm',
        artifact_type: 'epic',
        verification: {
          checklist_completed: false,  // Not completed
          confidence: 'high'
        }
      };

      const result = await validateHandover(contract, { log: false });
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('checklist_completed')));
    });

  });

  // ==========================================================================
  // Quick Mode Tests
  // ==========================================================================

  describe('Quick Validation Mode', () => {

    test('Valid quick contract passes', async () => {
      const contract = {
        from_agent: '@pm',
        to_agent: '@sm',
        artifact_type: 'task'
      };

      const result = await validateHandover(contract, { quick: true, log: false });
      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.mode, 'quick');
    });

    test('Quick mode ignores verification block', async () => {
      const contract = {
        from_agent: '@pm',
        to_agent: '@sm',
        artifact_type: 'task'
        // No verification block - quick mode doesn't require it
      };

      const result = await validateHandover(contract, { quick: true, log: false });
      assert.strictEqual(result.valid, true);
    });

    test('Quick mode still validates agent format', async () => {
      const contract = {
        from_agent: 'pm',  // Invalid
        to_agent: '@sm',
        artifact_type: 'task'
      };

      const result = await validateHandover(contract, { quick: true, log: false });
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('from_agent')));
    });

    test('Quick mode still validates required fields', async () => {
      const contract = {
        from_agent: '@pm'
        // Missing to_agent and artifact_type
      };

      const result = await validateHandover(contract, { quick: true, log: false });
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('to_agent')));
    });

  });

  // ==========================================================================
  // Error Messages & Suggestions Tests
  // ==========================================================================

  describe('Error Messages and Suggestions', () => {

    test('Provides suggestions for missing fields', async () => {
      const contract = {
        from_agent: '@pm'
        // Missing to_agent, artifact_type, verification
      };

      const result = await validateHandover(contract, { log: false });
      assert.strictEqual(result.valid, false);
      assert.ok(result.suggestions.length > 0, 'Should provide suggestions');
    });

    test('Provides specific suggestion for invalid agent format', async () => {
      const contract = {
        from_agent: 'pm',
        to_agent: '@sm',
        artifact_type: 'epic',
        verification: {
          checklist_completed: true,
          confidence: 'high'
        }
      };

      const result = await validateHandover(contract, { log: false });
      assert.ok(result.suggestions.some(s => s.includes('@')), 'Should suggest @ prefix');
    });

    test('formatResult produces readable output', async () => {
      const contract = {
        from_agent: '@pm',
        to_agent: '@sm',
        artifact_type: 'epic',
        verification: {
          checklist_completed: true,
          confidence: 'high'
        }
      };

      const result = await validateHandover(contract, { log: false });
      const formatted = formatResult(result);

      assert.ok(formatted.includes('✅'), 'Should include success indicator');
      assert.ok(formatted.includes('@pm'), 'Should include from_agent');
    });

  });

  // ==========================================================================
  // Edge Cases
  // ==========================================================================

  describe('Edge Cases', () => {

    test('Null contract fails gracefully', async () => {
      const result = await validateHandover(null, { log: false });
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('object')));
    });

    test('Empty object fails gracefully', async () => {
      const result = await validateHandover({}, { log: false });
      assert.strictEqual(result.valid, false);
    });

    test('Unknown fields are flagged', async () => {
      const contract = {
        from_agent: '@pm',
        to_agent: '@sm',
        artifact_type: 'epic',
        verification: {
          checklist_completed: true,
          confidence: 'high'
        },
        unknown_field: 'should be flagged'
      };

      const result = await validateHandover(contract, { log: false });
      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some(e => e.includes('unknown_field')));
    });

    test('All valid artifact types are accepted', async () => {
      const validTypes = ['epic', 'story', 'task', 'document', 'review', 'deployment', 'research'];

      for (const type of validTypes) {
        const contract = {
          from_agent: '@pm',
          to_agent: '@sm',
          artifact_type: type,
          verification: {
            checklist_completed: true,
            confidence: 'high'
          }
        };

        const result = await validateHandover(contract, { log: false });
        assert.strictEqual(result.valid, true, `Type "${type}" should be valid`);
      }
    });

  });

});

// Summary
console.log('\n✅ Handover Validator Skill Tests');
console.log('Run with: node --test .claude/skills/handover-validator/tests/validate-handover.test.mjs');
