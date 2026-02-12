#!/usr/bin/env node
/**
 * Migrate Agent field to Agent (Full) and set Squad
 */

const CLICKUP_API = 'https://api.clickup.com/api/v2';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';
const TEAM_ID = '90152366829';

// Field IDs
const FIELDS = {
  AGENT_OLD: '936e8499-160f-4028-a85a-26234954bd1b',
  AGENT_FULL: '743649c2-7132-4e65-9370-a161e7719949',
  SQUAD: 'fee999cb-cfbe-4c06-a806-77b71da75f40'
};

// Mapping: old Agent orderindex → new Agent (Full) option ID
const AGENT_MIGRATION = {
  0: { // @dev
    agentFullId: 'a6cf735b-cbc3-44f5-895c-bbe28436cb7c', // Dev (Code)
    squadId: '6f6286b6-812a-4f43-97ff-107bfdc6011e',     // Tech
    name: 'Dev (Code)',
    squad: 'Tech'
  },
  1: { // @architect
    agentFullId: 'f915813c-5080-4a07-b8b0-fcdeb434490c', // Architect
    squadId: '6f6286b6-812a-4f43-97ff-107bfdc6011e',     // Tech
    name: 'Architect',
    squad: 'Tech'
  },
  2: { // @pm
    agentFullId: '687c93ce-74f0-4023-b35d-2c3b961ad569', // PM
    squadId: '6f818eed-aa97-445c-8bb0-54167868868e',     // Ops
    name: 'PM',
    squad: 'Ops'
  },
  3: { // @po
    agentFullId: 'c59535ac-1972-4bf7-b0e6-18e83a7d1c8f', // PO
    squadId: '6f818eed-aa97-445c-8bb0-54167868868e',     // Ops
    name: 'PO',
    squad: 'Ops'
  },
  4: { // @qa
    agentFullId: 'ed4ec798-f358-4ba2-8f0d-7f5f42da957a', // QA (Shield)
    squadId: '222c69f6-247c-4ab8-8f11-042da3de8d7b',     // QA
    name: 'QA (Shield)',
    squad: 'QA'
  },
  5: { // @sm
    agentFullId: 'b96c12a6-381a-4db4-92e7-e16c21924091', // SM
    squadId: '6f818eed-aa97-445c-8bb0-54167868868e',     // Ops
    name: 'SM',
    squad: 'Ops'
  },
  6: { // @analyst
    agentFullId: '7d25c7f1-97ef-4c63-b824-0aa391bf31d3', // Analyst
    squadId: '28482392-0e23-4130-bcfe-233d32139bdb',     // Deep Research
    name: 'Analyst',
    squad: 'Deep Research'
  },
  7: { // @devops
    agentFullId: '76b11abd-7762-4183-9f34-456ce05bca5c', // DevOps (Gage)
    squadId: '6f6286b6-812a-4f43-97ff-107bfdc6011e',     // Tech
    name: 'DevOps (Gage)',
    squad: 'Tech'
  },
  8: { // @data-engineer
    agentFullId: '3ad53a46-c5be-4819-b09b-0203980db05c', // Data Engineer
    squadId: '6f6286b6-812a-4f43-97ff-107bfdc6011e',     // Tech
    name: 'Data Engineer',
    squad: 'Tech'
  }
};

async function api(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/json'
    }
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${CLICKUP_API}${endpoint}`, options);
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

async function getTasks() {
  const result = await api(`/team/${TEAM_ID}/task?subtasks=true&include_closed=true`);
  return result.tasks || [];
}

async function migrateTask(task) {
  // Find old Agent value
  const oldAgentField = task.custom_fields?.find(f => f.id === FIELDS.AGENT_OLD);
  const agentFullField = task.custom_fields?.find(f => f.id === FIELDS.AGENT_FULL);
  const squadField = task.custom_fields?.find(f => f.id === FIELDS.SQUAD);

  const oldValue = oldAgentField?.value;

  // Skip if no old value or already migrated
  if (oldValue === null || oldValue === undefined) {
    return { skipped: true, reason: 'no old agent value' };
  }

  if (agentFullField?.value !== null && agentFullField?.value !== undefined) {
    return { skipped: true, reason: 'already has Agent (Full)' };
  }

  const mapping = AGENT_MIGRATION[oldValue];
  if (!mapping) {
    return { skipped: true, reason: `unknown old value: ${oldValue}` };
  }

  // Set Agent (Full)
  await api(`/task/${task.id}/field/${FIELDS.AGENT_FULL}`, 'POST', {
    value: mapping.agentFullId
  });

  // Set Squad (only if not already set)
  if (squadField?.value === null || squadField?.value === undefined) {
    await api(`/task/${task.id}/field/${FIELDS.SQUAD}`, 'POST', {
      value: mapping.squadId
    });
  }

  return {
    success: true,
    agent: mapping.name,
    squad: mapping.squad
  };
}

async function main() {
  console.log('═'.repeat(60));
  console.log('🔄 Migrating Agent → Agent (Full) + Squad');
  console.log('═'.repeat(60));

  const tasks = await getTasks();
  console.log(`\nFound ${tasks.length} tasks to process\n`);

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const task of tasks) {
    process.stdout.write(`Processing: ${task.name.substring(0, 50)}...`);

    try {
      const result = await migrateTask(task);

      if (result.success) {
        console.log(` ✅ → ${result.agent} (${result.squad})`);
        migrated++;
      } else if (result.skipped) {
        console.log(` ⏭️  ${result.reason}`);
        skipped++;
      }
    } catch (err) {
      console.log(` ❌ ${err.message}`);
      errors++;
    }

    // Rate limiting
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('\n' + '═'.repeat(60));
  console.log('📋 Summary');
  console.log('═'.repeat(60));
  console.log(`✅ Migrated: ${migrated}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`📊 Total: ${tasks.length}`);
}

main().catch(console.error);
