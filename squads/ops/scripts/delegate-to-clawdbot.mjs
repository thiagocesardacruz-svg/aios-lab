#!/usr/bin/env node
/**
 * Delegate to Clawdbot - Create tasks for Clawdbot to execute
 *
 * Creates a ClickUp task with tag 'clawdbot:execute' that Clawdbot
 * polls and executes automatically (every 5 min).
 *
 * Usage:
 *   node delegate-to-clawdbot.mjs "Task name" --script=health_check.py
 *   node delegate-to-clawdbot.mjs "Run daily digest" --script=daily_digest.py --priority=2
 *   node delegate-to-clawdbot.mjs "Sync context" --script=context_sync.py --args="--full"
 */

const CLICKUP_API = 'https://api.clickup.com/api/v2';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';

const IDS = {
  lists: {
    INBOX: '901521080779'
  },
  fields: {
    EXECUTOR: '8eaa8398-8740-49d4-9bea-7164e76eb7ba',
    AGENT: '743649c2-7132-4e65-9370-a161e7719949'
  },
  executor: {
    AI: '2efd6fb6-b150-4bfb-bbe4-954e46864f89'
  },
  agents: {
    '@clawdbot': '34e38aaf-5774-4678-bcbd-240b03146b1a'
  }
};

const USER_ID = 278673009;

const PRIORITY_MAP = {
  'urgent': 1, '1': 1,
  'high': 2, '2': 2,
  'normal': 3, '3': 3,
  'low': 4, '4': 4
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

/**
 * Create a task for Clawdbot to execute
 */
async function delegateToClawdbot(taskName, options = {}) {
  const {
    script = null,
    args = '',
    priority = 3,
    description = ''
  } = options;

  if (!script) {
    console.error('Error: --script is required');
    console.error('Usage: node delegate-to-clawdbot.mjs "Task name" --script=script_name.py');
    process.exit(1);
  }

  const priorityNum = PRIORITY_MAP[String(priority).toLowerCase()] || 3;

  // Build description with execution details
  const execDetails = [
    '## Clawdbot Execution Details',
    '',
    `**Script:** \`${script}\``,
    args ? `**Arguments:** \`${args}\`` : '',
    `**Execution Mode:** DAEMON`,
    `**Tag:** clawdbot:execute`,
    '',
    '---',
    '',
    description || `Delegated task for Clawdbot to execute script: ${script}`
  ].filter(Boolean).join('\n');

  // Create task
  const taskData = {
    name: `[CLAWDBOT] ${taskName}`,
    description: execDetails,
    status: 'daemon_queue',  // Special status for Clawdbot queue
    priority: priorityNum,
    assignees: [USER_ID],
    tags: ['clawdbot:execute']  // Tag that Clawdbot polls for
  };

  const task = await api(`/list/${IDS.lists.INBOX}/task`, 'POST', taskData);

  if (task.err) {
    console.error('Error creating task:', task.err);
    process.exit(1);
  }

  const taskId = task.id;

  // Set Executor Type = AI
  await api(`/task/${taskId}/field/${IDS.fields.EXECUTOR}`, 'POST', {
    value: IDS.executor.AI
  });

  // Set Agent = @clawdbot
  await api(`/task/${taskId}/field/${IDS.fields.AGENT}`, 'POST', {
    value: IDS.agents['@clawdbot']
  });

  // Add execution instruction comment
  await api(`/task/${taskId}/comment`, 'POST', {
    comment_text: [
      '## Execution Instructions for Clawdbot',
      '',
      '```json',
      JSON.stringify({
        script,
        args: args || null,
        execution_mode: 'DAEMON',
        created_by: 'Claude Code (AIOS Lab)',
        timestamp: new Date().toISOString()
      }, null, 2),
      '```',
      '',
      '_This task was delegated from Claude Code. Clawdbot should poll and execute._'
    ].join('\n')
  });

  const result = {
    success: true,
    task_id: taskId,
    url: task.url,
    name: task.name,
    script,
    args: args || null,
    priority: priorityNum,
    message: `Task delegated to Clawdbot. It will be executed within 5 minutes.`
  };

  console.log(JSON.stringify(result, null, 2));
  return result;
}

// Parse CLI arguments
const args = process.argv.slice(2);
const taskName = args[0];

function getArg(name) {
  const arg = args.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=').slice(1).join('=') : null;
}

async function main() {
  if (!taskName || taskName.startsWith('--')) {
    console.log(`
Delegate to Clawdbot - Create tasks for AWS daemon execution

Usage:
  node delegate-to-clawdbot.mjs "Task name" --script=script.py [options]

Options:
  --script=NAME     Python script to execute (required)
  --args="..."      Arguments to pass to the script
  --priority=N      Priority (1=urgent, 2=high, 3=normal, 4=low)
  --description="." Additional description

Available Scripts (EC2):
  health_check.py     System health monitoring
  spend_monitor.py    Cost tracking, SAFE_MODE
  context_sync.py     Sync Notion -> AWS cache
  so_executor.py      Execute Service Orders
  daily_digest.py     Generate daily summary
  clickup_sync.py     ClickUp bidirectional sync

Examples:
  node delegate-to-clawdbot.mjs "Check health" --script=health_check.py
  node delegate-to-clawdbot.mjs "Run digest" --script=daily_digest.py --priority=2
  node delegate-to-clawdbot.mjs "Sync context" --script=context_sync.py --args="--full"

How it works:
  1. Creates ClickUp task with tag 'clawdbot:execute'
  2. Sets status to 'daemon_queue'
  3. Clawdbot polls ClickUp every 5 minutes
  4. Clawdbot executes script and updates status
    `);
    return;
  }

  await delegateToClawdbot(taskName, {
    script: getArg('script'),
    args: getArg('args') || '',
    priority: getArg('priority') || 3,
    description: getArg('description') || ''
  });
}

main().catch(console.error);
