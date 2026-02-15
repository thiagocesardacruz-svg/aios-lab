#!/usr/bin/env node
/**
 * ClickUp Sync - Automatic task synchronization for AIOS agents
 *
 * REQUIRED FIELDS:
 * - Assignee (handled by ClickUp)
 * - Priority (1=urgent, 2=high, 3=normal, 4=low)
 * - Agent (core agent or squad lead)
 * - Squad (squad responsible)
 * - Tool/LLM (auto-detected from current model)
 *
 * OPTIONAL FIELDS:
 * - Task Objective (short why)
 * - Impact (revenue/efficiency/infra/strategic)
 * - Project/Goal (AI OS V3.1 MVP, AIOS Framework, etc.)
 * - Dependencies (text describing task dependencies)
 * - Context Packet (structured context: Why/What/How)
 *
 * HANDOVER VALIDATION (GOV-001.3):
 * - The `done` command validates handover contracts before marking complete
 * - Use --skip-handover --reason="..." to bypass validation (logged for audit)
 * - Use --handover='{"from_agent":"@pm",...}' to provide contract inline
 *
 * Usage:
 *   node clickup-sync.mjs create "Task name" --agent=@dev --squad=tech --priority=2 --impact=efficiency
 *   node clickup-sync.mjs create "Task" --agent=@dev --project="AIOS Framework" --context="Why: ... | What: ..."
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

// IDs - Synced from workspace-ids.json (2026-02-13)
const IDS = {
  lists: {
    INBOX: '901521080779',
    IN_PROGRESS: '901521080780',
    AWAITING_HUMAN: '901521080781',
    COMPLETED: '901521080784'
  },
  fields: {
    AGENT: '743649c2-7132-4e65-9370-a161e7719949',
    SQUAD: 'fee999cb-cfbe-4c06-a806-77b71da75f40',
    OBJECTIVE: '83a9af52-3330-498b-95ed-a33f21e2634e',
    IMPACT: 'cad1ac7b-2d62-4baa-9b93-856b116f6a60',
    TOOL_LLM: '1af96c15-77f7-473f-b15b-390ffcc47ea8',
    PROJECT_GOAL: '66da50fb-4e96-4f2b-bdb2-4180e807699b',
    DEPENDENCIES: '9a704a37-97bd-4187-9547-e82a48044c56',
    CONTEXT_PACKET: '5b015b4f-42c9-4292-8e48-5666595bedea'
  },
  // Core Agents + Squad Leads only (30 options)
  agents: {
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
    '@clawdbot': '34e38aaf-5774-4678-bcbd-240b03146b1a',
    '@tech-lead': '80fabbfb-995b-4816-ae40-f5a45d0549c8',
    '@automation-lead': '3218ffa2-85e5-4968-b4a2-46a06a510076',
    '@clickup-lead': 'd5ed0b41-1d65-4998-8f0a-eb2b6aeb4e6f',
    '@design-lead': '3a60fdf9-920f-4e5b-8038-9a34f968b88f',
    '@design-system-lead': '120231bd-e418-43f5-817b-760707842956',
    '@marketing-lead': 'ddeb068e-06b7-4789-a5c6-76366bc37e3c',
    '@ghl-lead': '94124751-fd6a-45fb-baa2-8b8928f9afa0',
    '@sales-pages-lead': 'a063f663-487d-48ad-884d-dc6ab03357ee',
    '@copywriting-lead': '0b80c71a-2aec-461b-a7c4-e268eb14caea',
    '@hotel-mkt-lead': '1f48b39f-ae97-4c45-961a-080978c1cc64',
    '@hormozi-lead': '1f538697-3289-4f1f-8389-09d444553194',
    '@research-lead': '1f1e4328-0b9a-4d8c-b8b5-3cd4aeefa574',
    '@finance-lead': '8a21d44a-57d6-493b-9d8c-025134efa1a0',
    '@growth-lead': '53aa96a3-6ac1-403f-a0d5-a97e34c45af5',
    '@customer-lead': 'e09638ca-62e6-459a-98bf-e1ab3324abf8',
    '@sales-lead': '5794f43c-4f9d-4753-961b-5a6e3d17d145',
    '@translation-lead': '8633c3ce-6d14-405b-8b4c-90ce90fa7025'
  },
  squads: {
    'ops': '6f818eed-aa97-445c-8bb0-54167868868e',
    'tech': '6f6286b6-812a-4f43-97ff-107bfdc6011e',
    'automation': '199f3585-ff2a-4baa-9542-47e864d080e0',
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
  // Impact dropdown orderindex values
  impact: { 'revenue': 0, 'efficiency': 1, 'infra': 2, 'strategic': 3 },
  // Tool/LLM dropdown orderindex values
  toolLlm: { 'opus': 0, 'sonnet': 1, 'haiku': 2, 'gpt4': 3, 'ollama': 4, 'whisper': 5, 'n8n': 6, 'manual': 7 },
  // Project/Goal dropdown option IDs (friendly key => UUID)
  projects: {
    'AI OS V3.1 MVP': 'c9002fea-faca-485c-a10d-fe38431c1d72',
    'AIOS Framework': '457e8721-7ebb-4e7a-86ef-6dedd4a9478f',
    'Clawdbot Operations': '27ce6720-2e51-4d6d-b268-c5a42a780778',
    'Infrastructure': 'dc12ad34-2546-460f-b418-f461d7f2d15b',
    'Research & Planning': 'f678e62b-1e9f-4831-be10-7a47400d5bca'
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

// Auto-detect current LLM model from environment
function detectToolLlm() {
  const model = process.env.CLAUDE_MODEL || process.env.ANTHROPIC_MODEL || '';
  if (model.includes('opus')) return 'opus';
  if (model.includes('sonnet')) return 'sonnet';
  if (model.includes('haiku')) return 'haiku';
  // Default to opus (Claude Code runs on Opus)
  return 'opus';
}

// CREATE task with required fields
async function createTask(name, agent, options = {}) {
  const {
    description = '',
    priority = 3,
    dueDate = null,
    squad = null,
    objective = null,
    impact = null,
    tool = null,
    project = null,
    dependencies = null,
    context = null
  } = options;

  // Validate priority
  const priorityNum = PRIORITY_MAP[String(priority).toLowerCase()] || 3;

  // Create task with required fields
  const taskData = {
    name,
    description: description || `Created by ${agent} via AIOS`,
    status: 'to do',
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

  // Set Agent
  if (IDS.agents[agent]) {
    await api(`/task/${taskId}/field/${IDS.fields.AGENT}`, 'POST', {
      value: IDS.agents[agent]
    });
  }

  // Set Squad
  if (squad && IDS.squads[squad]) {
    await api(`/task/${taskId}/field/${IDS.fields.SQUAD}`, 'POST', {
      value: IDS.squads[squad]
    });
  }

  // Set Task Objective (short why)
  if (objective) {
    await api(`/task/${taskId}/field/${IDS.fields.OBJECTIVE}`, 'POST', {
      value: objective
    });
  }

  // Set Impact
  if (impact && IDS.impact[impact.toLowerCase()] !== undefined) {
    await api(`/task/${taskId}/field/${IDS.fields.IMPACT}`, 'POST', {
      value: IDS.impact[impact.toLowerCase()]
    });
  }

  // Set Tool/LLM (auto-detect if not specified)
  const toolKey = tool ? tool.toLowerCase() : detectToolLlm();
  if (IDS.toolLlm[toolKey] !== undefined) {
    await api(`/task/${taskId}/field/${IDS.fields.TOOL_LLM}`, 'POST', {
      value: IDS.toolLlm[toolKey]
    });
  }

  // Set Project/Goal
  if (project && IDS.projects[project]) {
    await api(`/task/${taskId}/field/${IDS.fields.PROJECT_GOAL}`, 'POST', {
      value: IDS.projects[project]
    });
  }

  // Set Dependencies (text field)
  if (dependencies) {
    await api(`/task/${taskId}/field/${IDS.fields.DEPENDENCIES}`, 'POST', {
      value: dependencies
    });
  }

  // Set Context Packet (text field)
  if (context) {
    await api(`/task/${taskId}/field/${IDS.fields.CONTEXT_PACKET}`, 'POST', {
      value: context
    });
  }

  const result = {
    success: true,
    task_id: taskId,
    url: task.url,
    name: task.name,
    priority: priorityNum,
    agent,
    squad,
    objective: objective || null,
    impact: impact || null,
    tool_llm: toolKey,
    project: project || null,
    dependencies: dependencies || null,
    context: context || null
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

// LIST RECENT tasks from AI OPS space
const AI_OPS_SPACE_ID = '901510017091';

async function listRecent(options = {}) {
  const { limit = 10, json = false, status = null } = options;

  // Fetch tasks from AI OPS space via team endpoint (supports ordering)
  const params = new URLSearchParams({
    'space_ids[]': AI_OPS_SPACE_ID,
    include_closed: 'false',
    order_by: 'updated',
    reverse: 'true',
    page: '0'
  });

  if (status) {
    params.append('statuses[]', status);
  }

  const result = await api(`/team/${TEAM_ID}/task?${params.toString()}`);

  if (result.err) {
    console.error('Error fetching tasks:', result.err);
    return;
  }

  const tasks = (result.tasks || []).slice(0, limit);

  if (json) {
    const output = tasks.map(t => {
      const af = t.custom_fields?.find(f => f.id === IDS.fields.AGENT);
      let agentName = '-';
      if (af?.value != null) {
        const opts = af.type_config?.options || [];
        const val = String(af.value);
        const opt = opts.find(o => o.id === val) || opts.find(o => String(o.orderindex) === val);
        agentName = opt?.label || opt?.name || val;
      }

      const pf = t.custom_fields?.find(f => f.id === IDS.fields.PROJECT_GOAL);
      let projectName = null;
      if (pf?.value != null) {
        const opts = pf.type_config?.options || [];
        const val = String(pf.value);
        const opt = opts.find(o => o.id === val);
        projectName = opt?.name || null;
      }

      return {
        id: t.id,
        name: t.name,
        status: t.status?.status || '-',
        agent: agentName,
        project: projectName,
        created: new Date(parseInt(t.date_created)).toISOString().split('T')[0],
        updated: new Date(parseInt(t.date_updated)).toISOString().split('T')[0],
        url: t.url
      };
    });
    console.log(JSON.stringify(output, null, 2));
    return;
  }

  // Console table output
  console.log(`\nRecent Tasks (AI OPS) - Top ${limit}\n`);
  console.log('  ID         | Status       | Agent            | Project              | Updated    | Name');
  console.log('  -----------|--------------|------------------|----------------------|------------|-----');

  for (const t of tasks) {
    const id = t.id.padEnd(9);
    const st = (t.status?.status || '-').padEnd(12);
    const agentField = t.custom_fields?.find(f => f.id === IDS.fields.AGENT);
    // Extract agent label: value can be UUID or orderindex depending on field type
    let agentLabel = '-';
    if (agentField?.value != null) {
      const opts = agentField.type_config?.options || [];
      const val = String(agentField.value);
      // Try match by id first, then by orderindex
      const opt = opts.find(o => o.id === val) || opts.find(o => String(o.orderindex) === val);
      agentLabel = opt?.label || opt?.name || val.substring(0, 16);
    }
    const agent = String(agentLabel).padEnd(16);

    const projectField = t.custom_fields?.find(f => f.id === IDS.fields.PROJECT_GOAL);
    let projectLabel = '-';
    if (projectField?.value != null) {
      const opts = projectField.type_config?.options || [];
      const val = String(projectField.value);
      const opt = opts.find(o => o.id === val);
      projectLabel = opt?.name || val.substring(0, 20);
    }
    const project = String(projectLabel).padEnd(20);

    const updated = new Date(parseInt(t.date_updated)).toISOString().split('T')[0];
    const name = t.name.length > 40 ? t.name.substring(0, 37) + '...' : t.name;
    console.log(`  ${id} | ${st} | ${agent} | ${project} | ${updated} | ${name}`);
  }

  console.log(`\n  Total: ${tasks.length} task(s)\n`);
}

// PRE-FLIGHT CHECKS (Poka-Yoke — Board recommendation 2026-02-15)
async function preFlightCheck(taskId) {
  const task = await api(`/task/${taskId}`);
  if (task.err) return { pass: false, errors: [`Task ${taskId} not found`] };

  const errors = [];
  const warnings = [];

  // 1. Agent assigned?
  const agentField = task.custom_fields?.find(f => f.id === IDS.fields.AGENT);
  if (!agentField?.value) errors.push('No agent assigned (--agent required)');

  // 2. Squad assigned?
  const squadField = task.custom_fields?.find(f => f.id === IDS.fields.SQUAD);
  if (!squadField?.value) warnings.push('No squad assigned');

  // 3. WIP limit check (<5 in progress)
  const params = new URLSearchParams({
    'space_ids[]': AI_OPS_SPACE_ID,
    'statuses[]': 'in progress',
    include_closed: 'false',
    page: '0'
  });
  const wipResult = await api(`/team/${TEAM_ID}/task?${params.toString()}`);
  const wipCount = wipResult.tasks?.length || 0;
  if (wipCount >= 5) errors.push(`WIP limit exceeded: ${wipCount}/5 tasks already in progress`);
  else if (wipCount >= 4) warnings.push(`WIP near limit: ${wipCount}/5`);

  // 4. Duplicate check — same agent already has task in progress?
  if (agentField?.value && wipResult.tasks) {
    const agentVal = String(agentField.value);
    const duplicateWip = wipResult.tasks.find(t => {
      const af = t.custom_fields?.find(f => f.id === IDS.fields.AGENT);
      return af && String(af.value) === agentVal && t.id !== taskId;
    });
    if (duplicateWip) {
      warnings.push(`Agent already has WIP: "${duplicateWip.name}" (${duplicateWip.id})`);
    }
  }

  return {
    pass: errors.length === 0,
    errors,
    warnings,
    wip_count: wipCount
  };
}

// START
async function startTask(taskId) {
  // Pre-flight validation
  const check = await preFlightCheck(taskId);

  if (check.warnings.length > 0) {
    check.warnings.forEach(w => console.warn(`⚠️ ${w}`));
  }

  if (!check.pass) {
    console.error('❌ Pre-flight check FAILED:');
    check.errors.forEach(e => console.error(`   ${e}`));
    console.error('\nFix issues before starting. Use --force to override.');
    if (!args.includes('--force')) {
      process.exit(1);
    }
    console.warn('⚠️ --force used, proceeding despite errors');
  }

  await updateStatus(taskId, 'in progress');
  await addComment(taskId, `🚀 **Started**\n\nPre-flight: ${check.pass ? '✅ PASS' : '⚠️ FORCED'} | WIP: ${check.wip_count}/5`);
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
        priority: getArg('priority') || 3,
        dueDate: getArg('due'),
        squad: getArg('squad'),
        objective: getArg('objective'),
        impact: getArg('impact'),
        tool: getArg('tool'),
        project: getArg('project'),
        dependencies: getArg('depends-on'),
        context: getArg('context')
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

    case 'list-recent':
      await listRecent({
        limit: parseInt(getArg('limit') || '10', 10),
        json: args.includes('--json'),
        status: getArg('status')
      });
      break;

    default:
      console.log(`
ClickUp Sync - AIOS Command Center

Commands:
  create "Task" --agent=@dev --squad=tech --priority=2 --objective="Why" --impact=efficiency --tool=opus
  create "Task" --agent=@dev --project="AIOS Framework" --context="Why: ... | What: ..." --depends-on="Task A, Task B"
  start <task_id>
  update <task_id> --status="in progress"
  comment <task_id> "text"
  await-human <task_id> "what I need"
  done <task_id> "summary" [--handover='{"from_agent":"@pm",...}']
  done <task_id> "summary" --skip-handover --reason="Emergency hotfix"
  list-recent                                    # Last 10 tasks from AI OPS
  list-recent --limit=5                          # Last 5 tasks
  list-recent --json                             # JSON output
  list-recent --status=waiting                   # Filter by status

Priority: 1=urgent, 2=high, 3=normal, 4=low
Impact: revenue, efficiency, infra, strategic
Tool/LLM: opus (default), sonnet, haiku, gpt4, ollama, whisper, n8n, manual
Project/Goal: "AI OS V3.1 MVP", "AIOS Framework", "Clawdbot Operations", "Infrastructure", "Research & Planning"
Dependencies: Text describing task dependencies (--depends-on="...")
Context Packet: Structured context (--context="Why: ... | What: ... | How: ...")

Squads: ops, tech, automation, qa, design, design-system, marketing, ghl, finance,
        growth, customer, sales, sales-pages, copywriting-masters, deep-research,
        project-management-clickup, board, hotel-mkt, hormozi, translator

Core Agents: @aios-master, @architect, @dev, @devops, @pm, @po, @sm, @qa,
             @analyst, @data-engineer, @ux-design-expert, @squad-creator, @clawdbot

Squad Leads: @tech-lead, @automation-lead, @clickup-lead, @design-lead,
             @design-system-lead, @marketing-lead, @ghl-lead, @sales-pages-lead,
             @copywriting-lead, @hotel-mkt-lead, @hormozi-lead, @research-lead,
             @finance-lead, @growth-lead, @customer-lead, @sales-lead, @translation-lead

Handover Validation (GOV-001.3):
  --handover='JSON'       Provide handover contract for validation
  --skip-handover         Skip validation (requires --reason)
  --reason="text"         Reason for skipping (logged for audit)

Auto-filled Fields:
  - Assignee: Thiago (always)
  - Tool/LLM: auto-detected from current model (override with --tool)
      `);
  }
}

main().catch(console.error);
