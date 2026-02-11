/**
 * Setup Mission Control no ClickUp via API
 * Squad: Project Management ClickUp
 *
 * Este script cria a estrutura completa do Mission Control:
 * - Space MISSION CONTROL
 * - Inbox (folderless list)
 * - 14 Folders com suas Lists
 * - Custom Fields (Squad, Task Type, Project, Requested By, Approval Status)
 * - Statuses globais
 *
 * Baseado na arquitetura: docs/mission-control-architecture.md
 */

const https = require('https');
require('dotenv').config({ path: '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.env' });

// ============================================
// CONFIGURAÇÃO
// ============================================

const API_TOKEN = process.env.CLICKUP_API_TOKEN;
const WORKSPACE_ID = process.env.CLICKUP_WORKSPACE_ID;

if (!API_TOKEN) {
  console.error('❌ CLICKUP_API_TOKEN não encontrado no .env');
  process.exit(1);
}

if (!WORKSPACE_ID) {
  console.error('❌ CLICKUP_WORKSPACE_ID não encontrado no .env');
  process.exit(1);
}

console.log('🎯 Setup Mission Control - ClickUp');
console.log(`📍 Workspace ID: ${WORKSPACE_ID}`);

// ============================================
// API HELPER
// ============================================

function clickupRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.clickup.com',
      port: 443,
      path: `/api/v2${path}`,
      method: method,
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
            reject({ status: res.statusCode, error: parsed });
          }
        } catch (e) {
          reject({ status: res.statusCode, error: body });
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
// MISSION CONTROL CONFIG
// ============================================

const MC_CONFIG = {
  space: {
    name: 'MISSION CONTROL',
    color: '#7C4DFF', // Purple
    features: {
      due_dates: { enabled: true, start_date: true },
      time_tracking: { enabled: true },
      tags: { enabled: true },
      priorities: { enabled: true },
      custom_fields: { enabled: true },
      dependency_warning: { enabled: true },
      multiple_assignees: { enabled: true },
      remap_dependencies: { enabled: true }
    }
  },

  // Global statuses at space level
  statuses: [
    { status: 'inbox', color: '#87909e', orderindex: 0 },
    { status: 'awaiting approval', color: '#ff7800', orderindex: 1 },
    { status: 'rejected', color: '#e50000', orderindex: 2 },
    { status: 'backlog', color: '#4194f6', orderindex: 3 },
    { status: 'in progress', color: '#A875FF', orderindex: 4 },
    { status: 'blocked', color: '#f9d900', orderindex: 5 },
    { status: 'review', color: '#81B1FF', orderindex: 6 },
    { status: 'done', color: '#6bc950', orderindex: 7 },
    { status: 'archived', color: '#808080', orderindex: 8 }
  ],

  // Inbox - folderless list at space level
  inbox: {
    name: '📥 Inbox',
    content: 'Central intake for all AIOS squad demands. All new tasks land here for triage.'
  },

  // Folders and their Lists
  folders: [
    {
      name: 'Content Ecosystem',
      lists: [
        { name: 'Content Tasks' },
        { name: 'YouTube Lives Tasks' }
      ]
    },
    {
      name: 'Copywriting',
      lists: [
        { name: 'Copy Tasks' }
      ]
    },
    {
      name: 'Creative Studio',
      lists: [
        { name: 'Creative Tasks' }
      ]
    },
    {
      name: 'Full Stack Dev',
      lists: [
        { name: 'Dev Tasks' },
        { name: 'AIOS Core Dev Tasks' }
      ]
    },
    {
      name: 'Funnel Creator',
      lists: [
        { name: 'Funnel Tasks' }
      ]
    },
    {
      name: 'Media Buy',
      lists: [
        { name: 'Campaign Tasks' }
      ]
    },
    {
      name: 'Data & Research',
      lists: [
        { name: 'Analytics Tasks' },
        { name: 'Deep Scraper Tasks' }
      ]
    },
    {
      name: 'Sales',
      lists: [
        { name: 'Sales Tasks' }
      ]
    },
    {
      name: 'Infoproduct Creation',
      lists: [
        { name: 'Product Tasks' }
      ]
    },
    {
      name: 'Design System',
      lists: [
        { name: 'Design Tasks' }
      ]
    },
    {
      name: 'Suporte e Comunidade',
      lists: [
        { name: 'Communication Tasks' },
        { name: 'Community Tasks' },
        { name: 'Strategy Tasks' }
      ]
    },
    {
      name: 'Operations',
      lists: [
        { name: 'Project Management Tasks' },
        { name: 'DevOps Tasks' }
      ]
    },
    {
      name: 'Advisory',
      lists: [
        { name: 'Conselho Tasks' }
      ]
    },
    {
      name: 'Projects',
      lists: [
        { name: 'Multi-Squad Projects' }
      ]
    }
  ],

  // Custom Fields (created on Inbox list, shared across Space)
  customFields: [
    {
      name: 'Squad',
      type: 'drop_down',
      type_config: {
        options: [
          { name: 'content-ecosystem', color: '#ff0000' },
          { name: 'youtube-lives', color: '#ff4444' },
          { name: 'copywriting', color: '#ff7800' },
          { name: 'creative-studio', color: '#E91E63' },
          { name: 'full-stack-dev', color: '#4194f6' },
          { name: 'aios-core-dev', color: '#1565C0' },
          { name: 'funnel-creator', color: '#7C4DFF' },
          { name: 'media-buy', color: '#00BCD4' },
          { name: 'data-analytics', color: '#4CAF50' },
          { name: 'deep-scraper', color: '#2E7D32' },
          { name: 'sales', color: '#f9d900' },
          { name: 'infoproduct-creation', color: '#FF6F00' },
          { name: 'design-system', color: '#795548' },
          { name: 'communication-nt', color: '#9C27B0' },
          { name: 'community-nt', color: '#BA68C8' },
          { name: 'strategy-nt', color: '#CE93D8' },
          { name: 'project-management', color: '#607D8B' },
          { name: 'devops', color: '#455A64' },
          { name: 'conselho', color: '#FFD700' }
        ]
      }
    },
    {
      name: 'Task Type',
      type: 'drop_down',
      type_config: {
        options: [
          // Content
          { name: 'script', color: '#ff0000' },
          { name: 'brief', color: '#ff4444' },
          { name: 'thumbnail', color: '#ff6666' },
          { name: 'live-plan', color: '#ff8888' },
          { name: 'seo-optimization', color: '#ffaaaa' },
          // Copy
          { name: 'vsl-script', color: '#ff7800' },
          { name: 'sales-copy', color: '#ff9933' },
          { name: 'email-sequence', color: '#ffbb66' },
          { name: 'headline', color: '#ffcc88' },
          { name: 'ad-copy', color: '#ffddaa' },
          // Creative
          { name: 'ad-creative', color: '#E91E63' },
          { name: 'page-asset', color: '#F06292' },
          { name: 'social-asset', color: '#F48FB1' },
          { name: 'brand-asset', color: '#F8BBD0' },
          // Development
          { name: 'feature', color: '#4194f6' },
          { name: 'bugfix', color: '#1565C0' },
          { name: 'landing-page', color: '#64B5F6' },
          { name: 'api', color: '#90CAF9' },
          { name: 'infrastructure', color: '#BBDEFB' },
          // Strategy
          { name: 'analysis', color: '#7C4DFF' },
          { name: 'okr', color: '#9575CD' },
          { name: 'funnel-strategy', color: '#B39DDB' },
          { name: 'market-research', color: '#D1C4E9' },
          // Analytics
          { name: 'dashboard', color: '#4CAF50' },
          { name: 'report', color: '#66BB6A' },
          { name: 'tracking-setup', color: '#81C784' },
          { name: 'ab-test', color: '#A5D6A7' },
          // Operations
          { name: 'process', color: '#607D8B' },
          { name: 'automation', color: '#78909C' },
          { name: 'setup', color: '#90A4AE' },
          { name: 'integration', color: '#B0BEC5' },
          // Sales
          { name: 'lead-qualification', color: '#f9d900' },
          { name: 'outreach', color: '#FDD835' },
          { name: 'follow-up', color: '#FFF176' },
          { name: 'onboarding', color: '#FFF9C4' },
          // Research
          { name: 'scraping', color: '#2E7D32' },
          { name: 'benchmark', color: '#388E3C' },
          { name: 'competitor-analysis', color: '#43A047' },
          { name: 'audience-profile', color: '#4CAF50' },
          // Community
          { name: 'engagement', color: '#9C27B0' },
          { name: 'member-onboarding', color: '#AB47BC' },
          { name: 'health-check', color: '#BA68C8' },
          { name: 'event', color: '#CE93D8' },
          // Product
          { name: 'course-module', color: '#FF6F00' },
          { name: 'lms-setup', color: '#FF8F00' },
          { name: 'pricing', color: '#FFA000' },
          { name: 'launch-plan', color: '#FFB300' }
        ]
      }
    },
    {
      name: 'Project',
      type: 'short_text'
    },
    {
      name: 'Requested By',
      type: 'drop_down',
      type_config: {
        options: [
          { name: 'user', color: '#4194f6' },
          { name: 'orquestrador-global', color: '#7C4DFF' },
          { name: 'squad-chief', color: '#4CAF50' },
          { name: 'automation', color: '#607D8B' }
        ]
      }
    },
    {
      name: 'Approval Status',
      type: 'drop_down',
      type_config: {
        options: [
          { name: 'pending', color: '#f9d900' },
          { name: 'approved', color: '#6bc950' },
          { name: 'rejected', color: '#e50000' }
        ]
      }
    }
  ]
};

// ============================================
// SETUP FUNCTIONS
// ============================================

async function getTeams() {
  console.log('\n📋 Buscando workspaces...');
  const result = await clickupRequest('GET', '/team');
  return result.teams;
}

async function getSpaces(teamId) {
  console.log(`📋 Buscando spaces existentes...`);
  const result = await clickupRequest('GET', `/team/${teamId}/space`);
  return result.spaces;
}

async function createSpace(teamId, config) {
  console.log(`\n🏗️  Criando Space "${config.name}"...`);

  const payload = {
    name: config.name,
    multiple_assignees: true,
    features: config.features
  };

  const result = await clickupRequest('POST', `/team/${teamId}/space`, payload);
  console.log(`   ✅ Space criado! ID: ${result.id}`);
  return result;
}

async function updateSpaceStatuses(spaceId, statuses) {
  console.log(`\n📊 Configurando ${statuses.length} statuses no Space...`);

  try {
    await clickupRequest('PUT', `/space/${spaceId}`, {
      statuses: statuses
    });
    console.log(`   ✅ Statuses configurados!`);
  } catch (error) {
    console.log(`   ⚠️  Não foi possível configurar statuses via API`);
    console.log(`   📝 Configure manualmente:`);
    statuses.forEach((s, i) => {
      console.log(`      ${i + 1}. ${s.status} (${s.color})`);
    });
  }
}

async function createFolderlessList(spaceId, listData) {
  console.log(`\n📥 Criando List "${listData.name}" (folderless)...`);

  const payload = {
    name: listData.name,
    content: listData.content || ''
  };

  const result = await clickupRequest('POST', `/space/${spaceId}/list`, payload);
  console.log(`   ✅ List criada! ID: ${result.id}`);
  return result;
}

async function createFolder(spaceId, folderName) {
  console.log(`\n📂 Criando Folder "${folderName}"...`);
  const result = await clickupRequest('POST', `/space/${spaceId}/folder`, {
    name: folderName
  });
  console.log(`   ✅ Folder criado! ID: ${result.id}`);
  return result;
}

async function createList(folderId, listData) {
  console.log(`   📋 Criando List "${listData.name}"...`);
  const result = await clickupRequest('POST', `/folder/${folderId}/list`, {
    name: listData.name,
    content: listData.content || ''
  });
  console.log(`      ✅ List criada! ID: ${result.id}`);
  return result;
}

async function createCustomField(listId, fieldData) {
  console.log(`   🏷️  Criando campo "${fieldData.name}" (${fieldData.type})...`);

  try {
    const payload = {
      name: fieldData.name,
      type: fieldData.type
    };

    if (fieldData.type_config) {
      payload.type_config = fieldData.type_config;
    }

    const result = await clickupRequest('POST', `/list/${listId}/field`, payload);
    console.log(`      ✅ Campo criado! ID: ${result.id}`);
    return result;
  } catch (error) {
    if (error.status === 400) {
      const errMsg = typeof error.error === 'object' ? JSON.stringify(error.error) : error.error;
      if (errMsg.includes('already exists')) {
        console.log(`      ⚠️  Campo "${fieldData.name}" já existe`);
      } else {
        console.log(`      ❌ Erro ao criar campo: ${errMsg}`);
      }
    } else {
      console.log(`      ❌ Erro ${error.status}: ${JSON.stringify(error.error)}`);
    }
    return null;
  }
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  const startTime = Date.now();

  try {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 SETUP MISSION CONTROL - AIOS SQUADS');
    console.log('='.repeat(60));

    // 1. Verify workspace
    const teams = await getTeams();
    const team = teams.find(t => t.id === WORKSPACE_ID) || teams[0];
    console.log(`\n✅ Workspace: ${team.name} (ID: ${team.id})`);

    // 2. Check if Mission Control already exists
    const existingSpaces = await getSpaces(team.id);
    let mcSpace = existingSpaces.find(s =>
      s.name === 'MISSION CONTROL' || s.name.includes('MISSION CONTROL')
    );

    if (mcSpace) {
      console.log(`\n⚠️  Space MISSION CONTROL já existe! ID: ${mcSpace.id}`);
      console.log('   Continuando com estrutura existente...');
    } else {
      // 3. Create Space
      mcSpace = await createSpace(team.id, MC_CONFIG.space);
      await sleep(1000);
    }

    // 4. Configure statuses
    await updateSpaceStatuses(mcSpace.id, MC_CONFIG.statuses);
    await sleep(500);

    // Track all created resources
    const resources = {
      space: mcSpace,
      inbox: null,
      folders: [],
      lists: [],
      customFields: []
    };

    // 5. Create Inbox (folderless list)
    console.log('\n' + '-'.repeat(40));
    console.log('📥 INBOX');
    console.log('-'.repeat(40));
    resources.inbox = await createFolderlessList(mcSpace.id, MC_CONFIG.inbox);
    resources.lists.push({ ...resources.inbox, folder: 'Inbox (folderless)' });
    await sleep(500);

    // 6. Create Folders and Lists
    for (const folderConfig of MC_CONFIG.folders) {
      console.log('\n' + '-'.repeat(40));
      console.log(`📂 ${folderConfig.name.toUpperCase()}`);
      console.log('-'.repeat(40));

      const folder = await createFolder(mcSpace.id, folderConfig.name);
      resources.folders.push(folder);
      await sleep(500);

      for (const listConfig of folderConfig.lists) {
        const list = await createList(folder.id, listConfig);
        resources.lists.push({ ...list, folder: folderConfig.name });
        await sleep(300);
      }
    }

    // 7. Create Custom Fields on Inbox list
    console.log('\n' + '-'.repeat(40));
    console.log('🏷️  CUSTOM FIELDS');
    console.log('-'.repeat(40));
    console.log(`   Criando no Inbox (ID: ${resources.inbox.id})...`);

    for (const fieldConfig of MC_CONFIG.customFields) {
      const field = await createCustomField(resources.inbox.id, fieldConfig);
      if (field) {
        resources.customFields.push({ name: fieldConfig.name, id: field.id, type: fieldConfig.type });
      }
      await sleep(300);
    }

    // 8. Summary
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n' + '='.repeat(60));
    console.log('✅ MISSION CONTROL SETUP COMPLETE!');
    console.log('='.repeat(60));

    console.log(`\n⏱️  Tempo: ${elapsed}s`);
    console.log(`\n📊 Recursos criados:`);
    console.log(`   • Space: ${mcSpace.name} (ID: ${mcSpace.id})`);
    console.log(`   • Inbox: ${resources.inbox.name} (ID: ${resources.inbox.id})`);
    console.log(`   • Folders: ${resources.folders.length}`);
    console.log(`   • Lists: ${resources.lists.length}`);
    console.log(`   • Custom Fields: ${resources.customFields.length}`);

    console.log('\n📂 Folders:');
    resources.folders.forEach(f => {
      console.log(`   • ${f.name} (ID: ${f.id})`);
    });

    console.log('\n📋 Lists:');
    resources.lists.forEach(l => {
      console.log(`   • [${l.folder}] ${l.name} (ID: ${l.id})`);
    });

    if (resources.customFields.length > 0) {
      console.log('\n🏷️  Custom Fields:');
      resources.customFields.forEach(f => {
        console.log(`   • ${f.name} (${f.type}) → ID: ${f.id}`);
      });
    }

    console.log('\n📝 Próximos passos MANUAIS no ClickUp:');
    console.log('   1. ✅ Verificar statuses do Space (inbox → ... → archived)');
    console.log('   2. 🏷️  Compartilhar Custom Fields com todas as Lists do Space');
    console.log('      (Inbox > campo > ⚙️ > "Share with Space")');
    console.log('   3. 📊 Criar Views:');
    console.log('      - Mission Control Board (Board, group by Status)');
    console.log('      - Squad Workload (Workload, group by Squad field)');
    console.log('      - Timeline (Gantt)');
    console.log('      - Inbox (List, filter: status = inbox/awaiting approval)');
    console.log('      - My Queue (List, filter: status = awaiting approval)');
    console.log('      - Project Tracker (Board, filter: folder = Projects)');
    console.log('      - Blocked Items (List, filter: status = blocked)');
    console.log('   4. ⚡ Criar Automações (Phase 3):');
    console.log('      - Auto-route: task in Inbox + Squad set → move to squad folder');
    console.log('      - Auto-assign: task enters folder → assign chief');
    console.log('      - Priority due date: priority set → auto due date');
    console.log('      - Archive: done > 30 days → archived');

    // 9. Save IDs for future reference
    const outputPath = '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.aios-core/squads/project-management-clickup/data/mission-control-ids.json';
    const fs = require('fs');
    fs.writeFileSync(outputPath, JSON.stringify(resources, null, 2));
    console.log(`\n💾 IDs salvos em: ${outputPath}`);

    // Also output env vars for .env
    console.log('\n📋 Adicionar ao .env:');
    console.log(`CLICKUP_MISSION_CONTROL_SPACE_ID=${mcSpace.id}`);
    console.log(`CLICKUP_MISSION_CONTROL_INBOX_ID=${resources.inbox.id}`);

  } catch (error) {
    console.error('\n❌ Erro durante o setup:', error);
    process.exit(1);
  }
}

// Execute
main();
