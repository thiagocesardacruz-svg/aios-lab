#!/usr/bin/env node
/**
 * Fill missing Agent (Full) and Squad fields for tasks
 */

const CLICKUP_API = 'https://api.clickup.com/api/v2';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';

const FIELDS = {
  AGENT_FULL: '743649c2-7132-4e65-9370-a161e7719949',
  SQUAD: 'fee999cb-cfbe-4c06-a806-77b71da75f40'
};

// Agent option IDs
const AGENTS = {
  '@devops': '76b11abd-7762-4183-9f34-456ce05bca5c',
  '@dev': 'a6cf735b-cbc3-44f5-895c-bbe28436cb7c',
  '@architect': 'f915813c-5080-4a07-b8b0-fcdeb434490c',
  '@pm': '687c93ce-74f0-4023-b35d-2c3b961ad569',
  '@squad-creator': 'd4ee70f3-4b5e-462b-abb8-df8676dd4600'
};

// Squad option IDs
const SQUADS = {
  'tech': '6f6286b6-812a-4f43-97ff-107bfdc6011e',
  'ops': '6f818eed-aa97-445c-8bb0-54167868868e'
};

// Tasks to update with their values (removed deleted tasks)
const TASKS_TO_UPDATE = [
  { id: '86c86erc3', agent: '@squad-creator', squad: 'ops', name: '[Squad] GHL Squad' },
  { id: '86c86ephe', agent: '@devops', squad: 'tech', name: '[Integration] Configure GHL MCP' },
  { id: '86c86ephd', agent: '@devops', squad: 'tech', name: '[Integration] Configure n8n MCP' },
  { id: '86c86eg00', agent: '@dev', squad: 'tech', name: '[Story] GOV-001.3' },
  { id: '86c86efzy', agent: '@dev', squad: 'tech', name: '[Story] GOV-001.2' },
  { id: '86c86efzv', agent: '@architect', squad: 'tech', name: '[Story] GOV-001.1' },
  { id: '86c86efw9', agent: '@pm', squad: 'ops', name: '[Epic] AIOS-GOV-001' },
  { id: '86c86bz0w', agent: '@devops', squad: 'tech', name: '[Dashboard] Command Center' },
  { id: '86c86bxdy', agent: '@devops', squad: 'tech', name: '[Feature] Command Center' }
];

async function updateTask(task) {
  const agentId = AGENTS[task.agent];
  const squadId = SQUADS[task.squad];

  // Update Agent (Full)
  const agentRes = await fetch(`${CLICKUP_API}/task/${task.id}/field/${FIELDS.AGENT_FULL}`, {
    method: 'POST',
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ value: agentId })
  });

  if (!agentRes.ok) {
    const err = await agentRes.text();
    return { error: true, message: err };
  }

  // Update Squad
  const squadRes = await fetch(`${CLICKUP_API}/task/${task.id}/field/${FIELDS.SQUAD}`, {
    method: 'POST',
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ value: squadId })
  });

  if (!squadRes.ok) {
    const err = await squadRes.text();
    return { error: true, message: err };
  }

  return { success: true };
}

async function main() {
  console.log('═'.repeat(60));
  console.log('🔧 Filling missing Agent and Squad fields');
  console.log('═'.repeat(60));
  console.log(`\nTasks to update: ${TASKS_TO_UPDATE.length}\n`);

  let success = 0;
  let errors = 0;

  for (const task of TASKS_TO_UPDATE) {
    process.stdout.write(`${task.name}... `);

    const result = await updateTask(task);

    if (result.success) {
      console.log(`✅ ${task.agent} → ${task.squad}`);
      success++;
    } else {
      console.log(`❌ ${result.message}`);
      errors++;
    }

    // Rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Errors: ${errors}`);
}

main().catch(console.error);
