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
 * Usage:
 *   node clickup-sync.mjs create "Task name" --agent=@dev --priority=2
 *   node clickup-sync.mjs start <task_id>
 *   node clickup-sync.mjs done <task_id> "Summary"
 */

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
    AGENT: '936e8499-160f-4028-a85a-26234954bd1b',
    COST: '488870a0-7d5e-4973-a067-07df43896382',
    TOKENS: '4f1b9e06-d0c8-4a93-9b68-1826f0d4441c'
  },
  agents: {
    '@dev': 'f5f666ba-4d4b-4f7a-95eb-e97dd7c54f7b',
    '@architect': '04456f05-4df2-4761-bc47-65ee461c377c',
    '@pm': '25f26a86-5c54-44ad-a32e-636acf855761',
    '@po': '91614908-c013-42e4-851b-40e8a1eefd8f',
    '@qa': '6d2a33bd-d6b2-4f30-8b3f-d8c1a6428744',
    '@sm': 'e641f3bb-e67a-48ee-abad-a8231d494b70',
    '@analyst': '518b22a1-50e0-4d6d-8f48-6b79c9fe37fe',
    '@devops': '5e80e8e4-b551-4f19-b56d-3f3694a38414',
    '@data-engineer': '3521bf9b-778b-4e67-9502-f6b51c02ba99'
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
    dueDate = null
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

  const result = {
    success: true,
    task_id: taskId,
    url: task.url,
    name: task.name,
    priority: priorityNum,
    executor,
    agent
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

// DONE
async function markDone(taskId, summary) {
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
      await createTask(args[1], getArg('agent') || '@aios', {
        description: getArg('description') || '',
        executor: getArg('executor') || 'AI',
        priority: getArg('priority') || 3,
        dueDate: getArg('due')
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
      await markDone(args[1], args[2]);
      break;

    case 'cost':
      await updateCost(args[1], parseFloat(args[2]) || 0, parseInt(args[3]) || 0);
      break;

    default:
      console.log(`
ClickUp Sync - AIOS Command Center

Commands:
  create "Task" --agent=@dev --priority=2 --executor=AI --due=2026-02-15
  start <task_id>
  update <task_id> --status="in progress"
  comment <task_id> "text"
  await-human <task_id> "what I need"
  done <task_id> "summary"
  cost <task_id> <eur> <tokens>

Priority: 1=urgent, 2=high, 3=normal, 4=low
Executor: HUMAN, AI, HYBRID

Required Fields (auto-set):
  - Assignee: Thiago
  - Priority: from --priority
  - Executor Type: from --executor
  - Agent: from --agent (if AI/Hybrid)
      `);
  }
}

main().catch(console.error);
