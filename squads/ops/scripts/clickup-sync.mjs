#!/usr/bin/env node
/**
 * ClickUp Sync - Automatic task synchronization for AIOS agents
 *
 * REQUIRED FIELDS:
 * - Assignee (handled by ClickUp)
 * - Priority (1=urgent, 2=high, 3=normal, 4=low)
 * - Executor Type (Human/AI/Hybrid)
 * - Agent (if AI/Hybrid)
 *
 * HANDOVER VALIDATION (GOV-001.3):
 * - The `done` command validates handover contracts before marking complete
 * - Use --skip-handover --reason="..." to bypass validation (logged for audit)
 * - Use --handover='{"from_agent":"@pm",...}' to provide contract inline
 *
 * Usage:
 *   node clickup-sync.mjs create "Task name" --agent=@dev --priority=2
 *   node clickup-sync.mjs start <task_id>
 *   node clickup-sync.mjs done <task_id> "Summary"
 *   node clickup-sync.mjs done <task_id> "Summary" --handover='{"from_agent":"@pm",...}'
 *   node clickup-sync.mjs done <task_id> "Summary" --skip-handover --reason="Emergency"
 */

// Note: handover-gate.mjs is dynamically imported in markDone() for graceful degradation

const CLICKUP_API = 'https://api.clickup.com/api/v2';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';
const TEAM_ID = '90152366829';
const USER_ID = 278673009; // Thiago

// IDs
const IDS = {
  lists: {
    INBOX: '901521080779',
    IN_PROGRESS: '901521080780',
    AWAITING_HUMAN: '901521080781',
    COMPLETED: '901521080784'
  },
  fields: {
    EXECUTOR: '8eaa8398-8740-49d4-9bea-7164e76eb7ba',
    AGENT: '743649c2-7132-4e65-9370-a161e7719949',  // Agent (Full) - 44 agents
    SQUAD: 'fee999cb-cfbe-4c06-a806-77b71da75f40',  // Squad - 19 squads
    COST: '488870a0-7d5e-4973-a067-07df43896382',
    TOKENS: '4f1b9e06-d0c8-4a93-9b68-1826f0d4441c'
  },
  agents: {
    // Core Agents
    '@aios-master': '42e8fb26-5632-4163-ae19-6bc4b2eeabb6',
    '@architect': 'f915813c-5080-4a07-b8b0-fcdeb434490c',
    '@dev': 'a6cf735b-cbc3-44f5-895c-bbe28436cb7c',
    '@devops': '76b11abd-7762-4183-9f34-456ce05bca5c',
    '@pm': '687c93ce-74f0-4023-b35d-2c3b961ad569',
    '@po': 'c59535ac-1972-4bf7-b0e6-18e83a7d1c8f',
    '@sm': 'b96c12a6-381a-4db4-92e7-e16c21924091',
    '@qa': 'ed4ec798-f358-4ba2-8f0d-7f5f42da957a',
    '@analyst': '7d25c7f1-97ef-4c63-b824-0aa391bf31d3',
    '@data-engineer': '3ad53a46-c5be-4819-b09b-0203980db05c',
    '@ux-design-expert': '2b7e9034-0bbf-4d4e-91ec-3841948ae289',
    '@squad-creator': 'd4ee70f3-4b5e-462b-abb8-df8676dd4600',
    // Tech Squad
    '@tech-lead': '80fabbfb-995b-4816-ae40-f5a45d0549c8',
    '@automation-engineer': '3218ffa2-85e5-4968-b4a2-46a06a510076',
    '@ghl-specialist': '7e08b0f2-0617-4c6a-99c4-755a083a5d92',
    '@ai-ops': '08224e92-a975-4c29-ab57-5817f358289d',
    '@application-developer': '008a2212-00e3-48a0-93d8-67180facbd29',
    // Ops Squad
    '@ops-manager': 'c626d06a-d7ff-43cb-a485-b7caedebdb2a',
    '@clawdbot': '34e38aaf-5774-4678-bcbd-240b03146b1a',
    // QA Squad
    '@content-reviewer': 'c1e7dcf2-8073-42f5-a320-d8715b599bfc',
    '@process-auditor': '60487db1-ef2f-4136-8f15-4607a3931504',
    // Design Squad
    '@design-lead': '3a60fdf9-920f-4e5b-8038-9a34f968b88f',
    '@performance-designer': '4a9b3530-18e9-49d5-939a-6422cd0296b4',
    '@motion-video-specialist': 'c59bba32-0c0b-4dc2-be1a-74c3c31535a8',
    '@visual-systems-designer': 'f283f7e1-4f33-40af-ba16-7b5372d86eae',
    // Marketing Squad
    '@marketing-lead': 'ddeb068e-06b7-4789-a5c6-76366bc37e3c',
    '@offer-engine': '5725a4be-8385-48aa-a3dc-b0f55fae58a1',
    '@content-strategist': 'ff87747a-5bbc-4b30-b24a-8cd59bfa7419',
    '@copy-specialist': '9e1d9601-80be-4953-b09a-bec3b7e0cc89',
    '@seo-specialist': '2ea6d7f9-4b82-47d5-8506-3dd42d47791c',
    '@funnel-architect': '24e78457-f0b5-474e-aab5-ab96ddd1c95b',
    // GHL Squad
    '@ghl-automation-specialist': '94124751-fd6a-45fb-baa2-8b8928f9afa0',
    '@ghl-snapshot-architect': '94f8dca9-f13e-438e-a300-9bb5a1ffc5fa',
    '@ghl-funnel-engineer': '98f50433-036c-4b72-90ea-772800633f2c',
    '@ghl-crm-structuralist': 'c723a85f-6479-45ed-829c-6f906b169274',
    '@ghl-email-strategist': '585de7c6-f43e-4d44-bae9-075f48d1ca37',
    // PM ClickUp Squad
    '@pm-orchestrator': 'd5ed0b41-1d65-4998-8f0a-eb2b6aeb4e6f',
    '@process-diagnostician': 'fe82a783-8aae-4364-8c13-ffa457095a84',
    '@clickup-architect': 'a21107e0-a823-489e-a935-f345d6176e59',
    '@launch-operations-manager': 'f8898091-26bc-47f8-a9b4-d1ce1b52d688',
    '@content-operations-manager': '2db54ba8-063e-4e60-8bf1-5093b98e64f4',
    '@crm-builder': '38785c1f-5211-4654-8a10-ffc816940b4c',
    '@saas-operations-specialist': '5e4245e3-aad6-4b69-bff5-34b2fe2deb89',
    '@support-operations-specialist': 'd268995b-10a6-4220-92cb-e3ab1cdbc116'
  },
  squads: {
    'ops': '6f818eed-aa97-445c-8bb0-54167868868e',
    'tech': '6f6286b6-812a-4f43-97ff-107bfdc6011e',
    'qa': '222c69f6-247c-4ab8-8f11-042da3de8d7b',
    'design': 'a5cb688b-6761-4cd8-88be-7c270ee81a7d',
    'design-system': '2ffbcfb4-87db-4568-9095-21caf1030aee',
    'marketing': '7d07cafe-04be-47fb-bb38-be55e67e4acf',
    'ghl': '2e41453c-9514-4efa-ba10-3a56910c12b4',
    'finance': '997bb375-5cb7-4594-8685-754525fdd3f2',
    'growth': '773acd85-1a2e-494b-a722-2312a91d96a4',
    'customer': '718ed52e-7b23-4fc4-a57c-4d8350e888c4',
    'sales': 'af001b91-2feb-4d56-a357-9c948a49dade',
    'sales-pages': 'dc282434-83be-4c8c-b299-e6cad85ca9e1',
    'copywriting-masters': '4a664a1e-4d7c-41c0-9ea8-cc7fca02da55',
    'deep-research': '28482392-0e23-4130-bcfe-233d32139bdb',
    'project-management-clickup': '0f523143-a929-4338-806d-148fa945e6f6',
    'board': '9ab43a88-1e8c-4c91-b5cc-5b275be4cc81',
    'hotel-mkt': 'ce1834cf-09bc-44d2-ab01-9b6e69e91539',
    'hormozi': 'f0b4d4f8-5b8e-4f66-b055-010cb48e6bfc',
    'translator': '9cabee47-0172-48f5-9ff4-ea7d81aa1f89'
  },
  executor: {
    HUMAN: 'c870ff8d-7fd7-4b3b-92dc-f6760650e39b',
    AI: '2efd6fb6-b150-4bfb-bbe4-954e46864f89',
    HYBRID: 'a9cf8d49-5f3b-48db-9c69-02b892ebb539'
  }
};

// Priority mapping: 1=urgent, 2=high, 3=normal, 4=low
const PRIORITY_MAP = {
  'urgent': 1, '1': 1,
  'high': 2, '2': 2,
  'normal': 3, '3': 3,
  'low': 4, '4': 4
};

// API call helper
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

// CREATE task with required fields
async function createTask(name, agent, options = {}) {
  const {
    description = '',
    executor = 'AI',
    priority = 3,
    dueDate = null,
    squad = null
  } = options;

  // Validate priority
  const priorityNum = PRIORITY_MAP[String(priority).toLowerCase()] || 3;

  // Create task with required fields
  const taskData = {
    name,
    description: description || `Created by ${agent} via AIOS`,
    status: 'inbox',
    priority: priorityNum,
    assignees: [USER_ID]  // Always assign to Thiago
  };

  if (dueDate) {
    taskData.due_date = new Date(dueDate).getTime();
  }

  const task = await api(`/list/${IDS.lists.INBOX}/task`, 'POST', taskData);

  if (task.err) {
    console.error('Error creating task:', task.err);
    return null;
  }

  const taskId = task.id;

  // Set Executor Type (required)
  await api(`/task/${taskId}/field/${IDS.fields.EXECUTOR}`, 'POST', {
    value: IDS.executor[executor.toUpperCase()] || IDS.executor.AI
  });

  // Set Agent (if AI or Hybrid)
  if (IDS.agents[agent] && executor.toUpperCase() !== 'HUMAN') {
    await api(`/task/${taskId}/field/${IDS.fields.AGENT}`, 'POST', {
      value: IDS.agents[agent]
    });
  }

  // Set Squad (if provided)
  if (squad && IDS.squads[squad]) {
    await api(`/task/${taskId}/field/${IDS.fields.SQUAD}`, 'POST', {
      value: IDS.squads[squad]
    });
  }

  const result = {
    success: true,
    task_id: taskId,
    url: task.url,
    name: task.name,
    priority: priorityNum,
    executor,
    agent,
    squad
  };

  console.log(JSON.stringify(result));
  return result;
}

// UPDATE status
async function updateStatus(taskId, status) {
  const result = await api(`/task/${taskId}`, 'PUT', { status });

  if (result.err) {
    console.error('Error updating status:', result.err);
    return false;
  }

  console.log(JSON.stringify({
    success: true,
    task_id: taskId,
    new_status: status
  }));

  return true;
}

// ADD comment
async function addComment(taskId, text) {
  const timestamp = new Date().toISOString();
  const result = await api(`/task/${taskId}/comment`, 'POST', {
    comment_text: `${text}\n\n---\n_${timestamp}_`
  });

  if (result.err) {
    console.error('Error adding comment:', result.err);
    return false;
  }

  console.log(JSON.stringify({
    success: true,
    task_id: taskId,
    comment_id: result.id
  }));

  return true;
}

// AWAIT HUMAN
async function awaitHuman(taskId, message) {
  await updateStatus(taskId, 'waiting');
  await addComment(taskId, `⏸️ **Awaiting Human Input**\n\n${message}`);
}

// DONE with Handover Validation (GOV-001.3)
async function markDone(taskId, summary, options = {}) {
  const { handoverContract, skipHandover, skipReason } = options;

  // Handle skip handover
  if (skipHandover) {
    if (!skipReason) {
      console.error('❌ Error: --reason required when using --skip-handover');
      process.exit(1);
    }

    // Log the skip
    try {
      const { recordSkip } = await import('./handover-gate.mjs');
      recordSkip(taskId, skipReason);
    } catch (err) {
      console.warn('Warning: Could not record skip:', err.message);
    }

    // Add warning comment
    await addComment(taskId, `⚠️ **Handover validation skipped**\n\nReason: ${skipReason}\n\n_This skip is logged for audit purposes._`);
    console.warn('⚠️ Handover validation skipped. This is logged for audit.');

    // Proceed with completion
    await addComment(taskId, `✅ **Completed**\n\n${summary}`);
    await updateStatus(taskId, 'done');
    return;
  }

  // Validate handover contract if provided
  if (handoverContract) {
    try {
      const { validateHandover, generatePaperTrailComment } = await import('./handover-gate.mjs');

      let contract;
      try {
        contract = typeof handoverContract === 'string'
          ? JSON.parse(handoverContract)
          : handoverContract;
      } catch (parseErr) {
        console.error('❌ Error: Invalid handover contract JSON');
        process.exit(1);
      }

      const result = await validateHandover(contract, { quick: false });

      if (!result.valid) {
        console.error('❌ Handover Validation Failed\n');
        console.error('Errors:');
        result.errors.forEach(err => console.error(`   ${err}`));
        if (result.suggestions.length > 0) {
          console.error('\nSuggestions:');
          result.suggestions.forEach(s => console.error(`   • ${s}`));
        }
        console.error('\nUse --skip-handover --reason="..." to bypass (logged for audit)');
        process.exit(1);
      }

      // Handover valid - add paper trail comment
      const paperTrail = generatePaperTrailComment(contract);
      await addComment(taskId, paperTrail);
      console.log('✅ Handover contract validated');

    } catch (importErr) {
      // Graceful degradation - handover-gate.mjs not available
      console.warn('⚠️ Handover validation unavailable (graceful degradation)');
    }
  }

  // Mark as done
  await addComment(taskId, `✅ **Completed**\n\n${summary}`);
  await updateStatus(taskId, 'done');
}

// START
async function startTask(taskId) {
  await updateStatus(taskId, 'in progress');
  await addComment(taskId, `🚀 **Started**`);
}

// UPDATE COST
async function updateCost(taskId, cost, tokens) {
  await api(`/task/${taskId}/field/${IDS.fields.COST}`, 'POST', { value: cost });
  await api(`/task/${taskId}/field/${IDS.fields.TOKENS}`, 'POST', { value: tokens });

  console.log(JSON.stringify({
    success: true,
    task_id: taskId,
    cost,
    tokens
  }));
}

// Parse CLI arguments
const args = process.argv.slice(2);
const command = args[0];

function getArg(name) {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : null;
}

// Main
async function main() {
  switch (command) {
    case 'create':
      await createTask(args[1], getArg('agent') || '@aios-master', {
        description: getArg('description') || '',
        executor: getArg('executor') || 'AI',
        priority: getArg('priority') || 3,
        dueDate: getArg('due'),
        squad: getArg('squad')
      });
      break;

    case 'start':
      await startTask(args[1]);
      break;

    case 'update':
      await updateStatus(args[1], getArg('status'));
      break;

    case 'comment':
      await addComment(args[1], args[2]);
      break;

    case 'await-human':
      await awaitHuman(args[1], args[2]);
      break;

    case 'done':
      await markDone(args[1], args[2], {
        handoverContract: getArg('handover'),
        skipHandover: args.includes('--skip-handover'),
        skipReason: getArg('reason')
      });
      break;

    case 'cost':
      await updateCost(args[1], parseFloat(args[2]) || 0, parseInt(args[3]) || 0);
      break;

    default:
      console.log(`
ClickUp Sync - AIOS Command Center

Commands:
  create "Task" --agent=@dev --squad=tech --priority=2 --executor=AI --due=2026-02-15
  start <task_id>
  update <task_id> --status="in progress"
  comment <task_id> "text"
  await-human <task_id> "what I need"
  done <task_id> "summary" [--handover='{"from_agent":"@pm",...}']
  done <task_id> "summary" --skip-handover --reason="Emergency hotfix"
  cost <task_id> <eur> <tokens>

Priority: 1=urgent, 2=high, 3=normal, 4=low
Executor: HUMAN, AI, HYBRID

Squads: ops, tech, qa, design, design-system, marketing, ghl, finance, growth,
        customer, sales, sales-pages, copywriting-masters, deep-research,
        project-management-clickup, board, hotel-mkt, hormozi, translator

Agents: @aios-master, @architect, @dev, @devops, @pm, @po, @sm, @qa, @analyst,
        @data-engineer, @ux-design-expert, @tech-lead, @automation-engineer,
        @design-lead, @marketing-lead, @ghl-automation-specialist, @pm-orchestrator...
        (44 agents total - see agent-squad-mapping.yaml for full list)

Handover Validation (GOV-001.3):
  --handover='JSON'       Provide handover contract for validation
  --skip-handover         Skip validation (requires --reason)
  --reason="text"         Reason for skipping (logged for audit)

Required Fields (auto-set):
  - Assignee: Thiago
  - Priority: from --priority
  - Executor Type: from --executor
  - Agent: from --agent (if AI/Hybrid)
      `);
  }
}

main().catch(console.error);
