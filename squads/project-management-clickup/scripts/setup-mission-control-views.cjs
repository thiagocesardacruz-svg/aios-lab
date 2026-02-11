/**
 * Setup Mission Control - Phase 2 & 3
 * Views + Custom Field sharing via ClickUp API
 *
 * Phase 2: Fetch custom field IDs, create Space/Folder views
 * Phase 3: Custom field propagation to all lists
 *
 * NOTE: ClickUp API v2 does NOT support automation creation.
 *       Automations must be created via the UI.
 */

const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.env' });

const API_TOKEN = process.env.CLICKUP_API_TOKEN;
const WORKSPACE_ID = process.env.CLICKUP_WORKSPACE_ID;
const MC_SPACE_ID = process.env.CLICKUP_MISSION_CONTROL_SPACE_ID || '901313156043';
const MC_INBOX_ID = process.env.CLICKUP_MISSION_CONTROL_INBOX_ID || '901325202828';

if (!API_TOKEN) {
  console.error('❌ CLICKUP_API_TOKEN not found');
  process.exit(1);
}

// ============================================
// API HELPER
// ============================================

function clickupRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.clickup.com',
      port: 443,
      path: `/api/v2${path}`,
      method,
      headers: {
        'Authorization': API_TOKEN,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject({ status: res.statusCode, error: parsed, path });
          }
        } catch (e) {
          reject({ status: res.statusCode, error: body, path });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// PHASE 2A: DISCOVER CUSTOM FIELD IDs
// ============================================

async function discoverCustomFields() {
  console.log('\n🔍 Buscando Custom Fields do Inbox...');
  const result = await clickupRequest('GET', `/list/${MC_INBOX_ID}/field`);
  const fields = result.fields || [];

  const fieldMap = {};
  fields.forEach(f => {
    fieldMap[f.name] = f.id;
    console.log(`   • ${f.name} → ${f.id} (${f.type})`);
  });

  return fieldMap;
}

// ============================================
// PHASE 2B: DISCOVER FOLDERS & LISTS
// ============================================

async function discoverStructure() {
  console.log('\n📂 Mapeando estrutura do Space...');

  const foldersResult = await clickupRequest('GET', `/space/${MC_SPACE_ID}/folder`);
  const folders = foldersResult.folders || [];

  const structure = { folders: [], lists: [] };

  for (const folder of folders) {
    structure.folders.push({ id: folder.id, name: folder.name });

    const listsResult = await clickupRequest('GET', `/folder/${folder.id}/list`);
    const lists = listsResult.lists || [];

    for (const list of lists) {
      structure.lists.push({ id: list.id, name: list.name, folderId: folder.id, folderName: folder.name });
    }
    await sleep(200);
  }

  // Also get folderless lists (Inbox)
  const folderlessResult = await clickupRequest('GET', `/space/${MC_SPACE_ID}/list`);
  const folderlessLists = folderlessResult.lists || [];
  for (const list of folderlessLists) {
    structure.lists.push({ id: list.id, name: list.name, folderId: null, folderName: 'Space (folderless)' });
  }

  console.log(`   ✅ ${structure.folders.length} folders, ${structure.lists.length} lists`);
  return structure;
}

// ============================================
// PHASE 2C: CREATE VIEWS
// ============================================

async function createSpaceView(name, type, config = {}) {
  console.log(`   📊 Criando view "${name}" (${type})...`);

  const payload = {
    name,
    type,
    ...config
  };

  try {
    const result = await clickupRequest('POST', `/space/${MC_SPACE_ID}/view`, payload);
    console.log(`      ✅ View criada! ID: ${result.view?.id || 'ok'}`);
    return result;
  } catch (error) {
    if (error.status === 400 || error.status === 409) {
      console.log(`      ⚠️  View "${name}" pode já existir ou tipo não suportado`);
      console.log(`      Detail: ${JSON.stringify(error.error?.err || error.error).substring(0, 100)}`);
    } else {
      console.log(`      ❌ Erro ${error.status}: ${JSON.stringify(error.error).substring(0, 150)}`);
    }
    return null;
  }
}

async function createFolderView(folderId, name, type, config = {}) {
  const payload = { name, type, ...config };

  try {
    const result = await clickupRequest('POST', `/folder/${folderId}/view`, payload);
    return result;
  } catch (error) {
    return null;
  }
}

async function createAllViews(fieldMap) {
  console.log('\n' + '-'.repeat(50));
  console.log('📊 CRIANDO VIEWS (Space-Level)');
  console.log('-'.repeat(50));

  const squadFieldId = fieldMap['Squad'];
  const views = [];

  // 1. Mission Control Board - Kanban by status
  views.push(await createSpaceView('Mission Control Board', 'board', {
    grouping: {
      field: 'status',
      dir: 1,
      collapsed: [],
      ignore: false
    },
    settings: {
      show_task_locations: true,
      show_subtasks: 3,
      show_assignees: true,
      show_images: true,
      show_closed_subtasks: false,
      me_comments: true,
      me_subtasks: true,
      me_checklists: true
    }
  }));
  await sleep(500);

  // 2. Squad Workload - Group by Squad field
  if (squadFieldId) {
    views.push(await createSpaceView('Squad Workload', 'board', {
      grouping: {
        field: squadFieldId,
        dir: 1,
        collapsed: [],
        ignore: false
      },
      settings: {
        show_task_locations: true,
        show_subtasks: 1,
        show_assignees: true,
        show_images: false,
        me_comments: false,
        me_subtasks: false,
        me_checklists: false
      }
    }));
  } else {
    views.push(await createSpaceView('Squad Workload', 'board', {
      grouping: { field: 'status', dir: 1, collapsed: [], ignore: false }
    }));
  }
  await sleep(500);

  // 3. Timeline - Gantt view
  views.push(await createSpaceView('Timeline', 'gantt', {
    settings: {
      show_task_locations: true,
      show_assignees: true,
      show_subtasks: 3
    }
  }));
  await sleep(500);

  // 4. Inbox View - List filtered by inbox/awaiting approval statuses
  views.push(await createSpaceView('Inbox Queue', 'list', {
    filters: {
      op: 'AND',
      fields: [
        {
          field: 'status',
          op: 'any',
          values: ['inbox', 'awaiting approval']
        }
      ],
      show_closed: false
    },
    sorting: {
      fields: [
        { field: 'priority', dir: 1 }
      ]
    },
    settings: {
      show_task_locations: true,
      show_subtasks: 1,
      show_assignees: true,
      show_images: false
    }
  }));
  await sleep(500);

  // 5. My Queue - Awaiting Approval only
  views.push(await createSpaceView('My Queue (Approval)', 'list', {
    filters: {
      op: 'AND',
      fields: [
        {
          field: 'status',
          op: 'any',
          values: ['awaiting approval']
        }
      ],
      show_closed: false
    },
    sorting: {
      fields: [
        { field: 'priority', dir: 1 },
        { field: 'date_created', dir: -1 }
      ]
    },
    settings: {
      show_task_locations: true,
      show_subtasks: 1,
      show_assignees: true,
      show_images: false
    }
  }));
  await sleep(500);

  // 6. Blocked Items - status = blocked
  views.push(await createSpaceView('Blocked Items', 'list', {
    filters: {
      op: 'AND',
      fields: [
        {
          field: 'status',
          op: 'any',
          values: ['blocked']
        }
      ],
      show_closed: false
    },
    sorting: {
      fields: [
        { field: 'date_updated', dir: -1 }
      ]
    },
    settings: {
      show_task_locations: true,
      show_subtasks: 1,
      show_assignees: true,
      show_images: false
    }
  }));
  await sleep(500);

  // 7. All Tasks Table - comprehensive table view
  views.push(await createSpaceView('All Tasks (Table)', 'table', {
    settings: {
      show_task_locations: true,
      show_subtasks: 3,
      show_assignees: true,
      show_closed_subtasks: false
    }
  }));
  await sleep(500);

  const created = views.filter(v => v !== null).length;
  console.log(`\n   ✅ ${created}/7 views criadas no Space`);
  return views;
}

// ============================================
// PHASE 2D: CREATE FOLDER-LEVEL VIEWS
// ============================================

async function createFolderViews(structure) {
  console.log('\n' + '-'.repeat(50));
  console.log('📂 CRIANDO VIEWS POR FOLDER');
  console.log('-'.repeat(50));

  let created = 0;
  let failed = 0;

  for (const folder of structure.folders) {
    process.stdout.write(`   📂 ${folder.name}: `);

    // Board view
    const board = await createFolderView(folder.id, 'Squad Board', 'board', {
      grouping: { field: 'status', dir: 1, collapsed: [], ignore: false },
      settings: {
        show_task_locations: false,
        show_subtasks: 3,
        show_assignees: true,
        show_images: true,
        show_closed_subtasks: false
      }
    });
    await sleep(300);

    // Backlog list view
    const backlog = await createFolderView(folder.id, 'Squad Backlog', 'list', {
      filters: {
        op: 'AND',
        fields: [
          { field: 'status', op: 'any', values: ['backlog'] }
        ],
        show_closed: false
      },
      sorting: {
        fields: [
          { field: 'priority', dir: 1 }
        ]
      },
      settings: {
        show_task_locations: false,
        show_subtasks: 1,
        show_assignees: true,
        show_images: false
      }
    });
    await sleep(300);

    const boardOk = board ? '✅' : '⚠️';
    const backlogOk = backlog ? '✅' : '⚠️';
    console.log(`Board ${boardOk} | Backlog ${backlogOk}`);

    if (board) created++;
    else failed++;
    if (backlog) created++;
    else failed++;
  }

  console.log(`\n   ✅ ${created} views criadas, ${failed} falhas`);
}

// ============================================
// PHASE 3: CUSTOM FIELD PROPAGATION
// ============================================

async function propagateCustomFields(structure, fieldMap) {
  console.log('\n' + '-'.repeat(50));
  console.log('🏷️  PROPAGANDO CUSTOM FIELDS');
  console.log('-'.repeat(50));

  // Get the field definitions from Inbox to replicate
  const inboxFields = await clickupRequest('GET', `/list/${MC_INBOX_ID}/field`);
  const fieldsToPropagate = (inboxFields.fields || []).filter(f =>
    ['Squad', 'Task Type', 'Project', 'Requested By', 'Approval Status'].includes(f.name)
  );

  console.log(`   📋 ${fieldsToPropagate.length} campos para propagar`);

  // For each non-inbox list, create the same fields
  const nonInboxLists = structure.lists.filter(l => l.id !== MC_INBOX_ID);
  let propagated = 0;
  let skipped = 0;

  for (const list of nonInboxLists) {
    process.stdout.write(`   📋 ${list.name}: `);

    const results = [];
    for (const field of fieldsToPropagate) {
      const payload = {
        name: field.name,
        type: field.type
      };

      if (field.type_config) {
        payload.type_config = field.type_config;
      }

      try {
        await clickupRequest('POST', `/list/${list.id}/field`, payload);
        results.push('✅');
        propagated++;
      } catch (error) {
        results.push('⚠️');
        skipped++;
      }
      await sleep(200);
    }

    console.log(results.join(' '));
  }

  console.log(`\n   ✅ ${propagated} campos criados, ${skipped} já existiam/skipped`);
}

// ============================================
// AUTOMATION GUIDE (can't create via API)
// ============================================

function printAutomationGuide(structure) {
  console.log('\n' + '='.repeat(60));
  console.log('⚡ AUTOMAÇÕES - GUIA MANUAL');
  console.log('='.repeat(60));

  console.log(`
A ClickUp API v2 NÃO suporta criação de automações.
Crie as seguintes automações no UI do ClickUp:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ AUTOMAÇÃO 1: Auto-Triage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Onde: Space MISSION CONTROL > ⚡ Automations
  Trigger: When STATUS changes to "inbox"
  Condition: Custom Field "Squad" IS SET
  Action: Change STATUS to "awaiting approval"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ AUTOMAÇÃO 2: Auto-Route por Squad
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Para CADA folder, crie uma automação:`);

  const squadFolderMap = [
    { squad: 'content-ecosystem', folder: 'Content Ecosystem' },
    { squad: 'youtube-lives', folder: 'Content Ecosystem' },
    { squad: 'copywriting', folder: 'Copywriting' },
    { squad: 'creative-studio', folder: 'Creative Studio' },
    { squad: 'full-stack-dev', folder: 'Full Stack Dev' },
    { squad: 'aios-core-dev', folder: 'Full Stack Dev' },
    { squad: 'funnel-creator', folder: 'Funnel Creator' },
    { squad: 'media-buy', folder: 'Media Buy' },
    { squad: 'data-analytics', folder: 'Data & Research' },
    { squad: 'deep-scraper', folder: 'Data & Research' },
    { squad: 'sales', folder: 'Sales' },
    { squad: 'infoproduct-creation', folder: 'Infoproduct Creation' },
    { squad: 'design-system', folder: 'Design System' },
    { squad: 'communication-nt', folder: 'Suporte e Comunidade' },
    { squad: 'community-nt', folder: 'Suporte e Comunidade' },
    { squad: 'strategy-nt', folder: 'Suporte e Comunidade' },
    { squad: 'project-management', folder: 'Operations' },
    { squad: 'devops', folder: 'Operations' },
    { squad: 'conselho', folder: 'Advisory' },
  ];

  // Get unique folders with their squad mappings
  const folderSquadMap = {};
  squadFolderMap.forEach(({ squad, folder }) => {
    if (!folderSquadMap[folder]) folderSquadMap[folder] = [];
    folderSquadMap[folder].push(squad);
  });

  const folderIdMap = {};
  structure.folders.forEach(f => { folderIdMap[f.name] = f.id; });

  Object.entries(folderSquadMap).forEach(([folder, squads]) => {
    const folderId = folderIdMap[folder] || 'N/A';
    console.log(`
  Folder: ${folder} (ID: ${folderId})
  Trigger: When STATUS changes to "backlog"
  Condition: Custom Field "Squad" IS ${squads.join(' OR ')}
  Action: Move task to ${folder} > first list`);
  });

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ AUTOMAÇÃO 3: Priority Due Date
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Onde: Space MISSION CONTROL
  Trigger: When PRIORITY is set
  Actions (4 automações separadas):
    • Priority = Urgent → Set due date = today + 1 day
    • Priority = High → Set due date = today + 3 days
    • Priority = Normal → Set due date = today + 7 days
    • Priority = Low → Set due date = today + 14 days

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ AUTOMAÇÃO 4: Archive Done Tasks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Onde: Space MISSION CONTROL
  Trigger: When STATUS changes to "done"
  Wait: 30 days
  Action: Change STATUS to "archived"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ AUTOMAÇÃO 5: Notify on Assignment (via n8n)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Implementar via n8n webhook + WAHA WhatsApp.
  Configurar em Phase 4.
`);
}

// ============================================
// MAIN
// ============================================

async function main() {
  const startTime = Date.now();

  try {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 MISSION CONTROL - Phase 2 & 3');
    console.log('   Views + Custom Field Propagation');
    console.log('='.repeat(60));

    // Phase 2A: Discover custom fields
    const fieldMap = await discoverCustomFields();
    await sleep(500);

    // Phase 2B: Discover structure
    const structure = await discoverStructure();
    await sleep(500);

    // Phase 2C: Create Space-level views
    await createAllViews(fieldMap);

    // Phase 2D: Create Folder-level views
    await createFolderViews(structure);

    // Phase 3: Propagate custom fields to all lists
    await propagateCustomFields(structure, fieldMap);

    // Automation guide
    printAutomationGuide(structure);

    // Summary
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('='.repeat(60));
    console.log('✅ PHASE 2 & 3 COMPLETE!');
    console.log('='.repeat(60));
    console.log(`\n⏱️  Tempo: ${elapsed}s`);
    console.log(`\n📊 Resumo:`);
    console.log(`   • Custom Fields descobertos: ${Object.keys(fieldMap).length}`);
    console.log(`   • Views Space-level: 7`);
    console.log(`   • Views Folder-level: ${structure.folders.length * 2}`);
    console.log(`   • Custom Fields propagados para: ${structure.lists.length - 1} lists`);
    console.log(`\n⚡ Automações: Seguir guia manual acima (API não suporta)`);

    // Update the IDs file with field mappings
    const idsPath = '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.aios-core/squads/project-management-clickup/data/mission-control-ids.json';
    let existingData = {};
    try {
      existingData = JSON.parse(fs.readFileSync(idsPath, 'utf8'));
    } catch (e) {}

    existingData.customFieldIds = fieldMap;
    existingData.structure = structure;
    fs.writeFileSync(idsPath, JSON.stringify(existingData, null, 2));
    console.log(`\n💾 IDs atualizados em: ${idsPath}`);

  } catch (error) {
    console.error('\n❌ Erro:', error);
    process.exit(1);
  }
}

main();
