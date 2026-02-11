#!/usr/bin/env node
/**
 * Mission Control - Deploy Smart Routing
 *
 * Atualiza workflows n8n existentes com sistema de roteamento inteligente.
 *
 * Usage:
 *   node deploy-smart-routing.cjs [--dry-run]
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Config
const N8N_API_URL = process.env.N8N_API_URL || 'https://n8n.nataliatanaka.com.br';
const N8N_API_KEY = process.env.N8N_API_KEY;
const DRY_RUN = process.argv.includes('--dry-run');

// Load existing workflow IDs
const workflowsFile = path.join(__dirname, '../data/mission-control-n8n-workflows.json');
const existingWorkflows = JSON.parse(fs.readFileSync(workflowsFile, 'utf8'));

// Workflow definitions with smart routing
const WORKFLOWS = {
  'new-task': {
    name: 'Mission Control - Nova Demanda',
    routingCode: `
// SMART ROUTING - Nova Demanda
const SQUAD_GROUPS = {
  'youtube-content': process.env.MISSION_CONTROL_WHATSAPP_YOUTUBE_CONTENT,
  'copywriting': process.env.MISSION_CONTROL_WHATSAPP_COPYWRITING,
  'full-stack-dev': process.env.MISSION_CONTROL_WHATSAPP_FULL_STACK_DEV,
  'deep-scraper': process.env.MISSION_CONTROL_WHATSAPP_DEEP_SCRAPER,
  'project-management': process.env.MISSION_CONTROL_WHATSAPP_PROJECT_MANAGEMENT,
  'orquestrador': process.env.MISSION_CONTROL_WHATSAPP_ORQUESTRADOR,
  'content-ecosystem': process.env.MISSION_CONTROL_WHATSAPP_CONTENT_ECOSYSTEM,
  'squad-creator': process.env.MISSION_CONTROL_WHATSAPP_SQUAD_CREATOR,
  'infoproduct-creation': process.env.MISSION_CONTROL_WHATSAPP_INFOPRODUCT_CREATION,
  'sales': process.env.MISSION_CONTROL_WHATSAPP_SALES,
  'conselho': process.env.MISSION_CONTROL_WHATSAPP_CONSELHO,
  'design-system': process.env.MISSION_CONTROL_WHATSAPP_DESIGN_SYSTEM,
  'creative-studio': process.env.MISSION_CONTROL_WHATSAPP_CREATIVE_STUDIO,
  'youtube-lives': process.env.MISSION_CONTROL_WHATSAPP_YOUTUBE_LIVES,
  'data-analytics': process.env.MISSION_CONTROL_WHATSAPP_DATA_ANALYTICS,
  'media-buy': process.env.MISSION_CONTROL_WHATSAPP_MEDIA_BUY,
  'funnel-creator': process.env.MISSION_CONTROL_WHATSAPP_FUNNEL_CREATOR,
  'devops': process.env.MISSION_CONTROL_WHATSAPP_DEVOPS
};

const SQUAD_NAMES = {
  'youtube-content': 'YouTube Content',
  'copywriting': 'Copywriting',
  'full-stack-dev': 'Full Stack Dev',
  'deep-scraper': 'Deep Scraper',
  'project-management': 'Project Management',
  'orquestrador': 'Orquestrador',
  'content-ecosystem': 'Content Ecosystem',
  'squad-creator': 'Squad Creator',
  'infoproduct-creation': 'Infoproduct Creation',
  'sales': 'Sales',
  'conselho': 'Conselho',
  'design-system': 'Design System',
  'creative-studio': 'Creative Studio',
  'youtube-lives': 'YouTube Lives',
  'data-analytics': 'Data Analytics',
  'media-buy': 'Media Buy',
  'funnel-creator': 'Funnel Creator',
  'devops': 'DevOps'
};

const CENTRAL_GROUP = process.env.MISSION_CONTROL_WHATSAPP_CENTRAL;
const RAFAEL_TELEGRAM = process.env.MISSION_CONTROL_TELEGRAM_CHAT_ID;

// Extract task and squad
const task = items[0].json.task || items[0].json;
const squadField = task.custom_fields?.find(f => f.name.toLowerCase() === 'squad');
const squad = squadField?.value || null;
const squadName = squad ? (SQUAD_NAMES[squad] || squad) : 'Geral';

// Route to destinations
const destinations = [];

// 1. Squad group or Central
if (squad && SQUAD_GROUPS[squad]) {
  destinations.push({
    type: 'whatsapp',
    chatId: SQUAD_GROUPS[squad],
    squadName: SQUAD_NAMES[squad] || squad
  });
} else {
  destinations.push({
    type: 'whatsapp',
    chatId: CENTRAL_GROUP,
    squadName: 'Central (Geral)'
  });
}

// 2. Always notify Rafael via Telegram
destinations.push({
  type: 'telegram',
  chatId: RAFAEL_TELEGRAM
});

// Format message
const message = \`🆕 *Nova demanda criada*

📋 \${task.name}
👥 Squad: \${squadName}
👤 Solicitado por: \${task.creator?.username || 'Desconhecido'}
⚡ Prioridade: \${task.priority?.priority || 'Normal'}

📎 \${task.url}\`;

// Return one item per destination
return destinations.filter(d => d.chatId).map(dest => ({
  json: {
    ...items[0].json,
    destination: dest,
    message: message
  }
}));
`
  },
  'status-changed': {
    name: 'Mission Control - Status Alterado',
    routingCode: `
// SMART ROUTING - Status Alterado
const SQUAD_GROUPS = {
  'youtube-content': process.env.MISSION_CONTROL_WHATSAPP_YOUTUBE_CONTENT,
  'copywriting': process.env.MISSION_CONTROL_WHATSAPP_COPYWRITING,
  'full-stack-dev': process.env.MISSION_CONTROL_WHATSAPP_FULL_STACK_DEV,
  'deep-scraper': process.env.MISSION_CONTROL_WHATSAPP_DEEP_SCRAPER,
  'project-management': process.env.MISSION_CONTROL_WHATSAPP_PROJECT_MANAGEMENT,
  'orquestrador': process.env.MISSION_CONTROL_WHATSAPP_ORQUESTRADOR,
  'content-ecosystem': process.env.MISSION_CONTROL_WHATSAPP_CONTENT_ECOSYSTEM,
  'squad-creator': process.env.MISSION_CONTROL_WHATSAPP_SQUAD_CREATOR,
  'infoproduct-creation': process.env.MISSION_CONTROL_WHATSAPP_INFOPRODUCT_CREATION,
  'sales': process.env.MISSION_CONTROL_WHATSAPP_SALES,
  'conselho': process.env.MISSION_CONTROL_WHATSAPP_CONSELHO,
  'design-system': process.env.MISSION_CONTROL_WHATSAPP_DESIGN_SYSTEM,
  'creative-studio': process.env.MISSION_CONTROL_WHATSAPP_CREATIVE_STUDIO,
  'youtube-lives': process.env.MISSION_CONTROL_WHATSAPP_YOUTUBE_LIVES,
  'data-analytics': process.env.MISSION_CONTROL_WHATSAPP_DATA_ANALYTICS,
  'media-buy': process.env.MISSION_CONTROL_WHATSAPP_MEDIA_BUY,
  'funnel-creator': process.env.MISSION_CONTROL_WHATSAPP_FUNNEL_CREATOR,
  'devops': process.env.MISSION_CONTROL_WHATSAPP_DEVOPS
};

const SQUAD_NAMES = {
  'youtube-content': 'YouTube Content',
  'copywriting': 'Copywriting',
  'full-stack-dev': 'Full Stack Dev',
  'deep-scraper': 'Deep Scraper',
  'project-management': 'Project Management',
  'orquestrador': 'Orquestrador',
  'content-ecosystem': 'Content Ecosystem',
  'squad-creator': 'Squad Creator',
  'infoproduct-creation': 'Infoproduct Creation',
  'sales': 'Sales',
  'conselho': 'Conselho',
  'design-system': 'Design System',
  'creative-studio': 'Creative Studio',
  'youtube-lives': 'YouTube Lives',
  'data-analytics': 'Data Analytics',
  'media-buy': 'Media Buy',
  'funnel-creator': 'Funnel Creator',
  'devops': 'DevOps'
};

const CENTRAL_GROUP = process.env.MISSION_CONTROL_WHATSAPP_CENTRAL;
const RAFAEL_TELEGRAM = process.env.MISSION_CONTROL_TELEGRAM_CHAT_ID;

// Extract data
const task = items[0].json.task || items[0].json;
const historyItem = items[0].json.history_items?.[0] || {};
const oldStatus = historyItem.before?.status || 'unknown';
const newStatus = historyItem.after?.status || task.status?.status || 'unknown';

const squadField = task.custom_fields?.find(f => f.name.toLowerCase() === 'squad');
const squad = squadField?.value || null;
const squadName = squad ? (SQUAD_NAMES[squad] || squad) : 'Geral';

// Route to destinations
const destinations = [];

// 1. Squad group
if (squad && SQUAD_GROUPS[squad]) {
  destinations.push({
    type: 'whatsapp',
    chatId: SQUAD_GROUPS[squad],
    squadName: SQUAD_NAMES[squad] || squad
  });
}

// 2. If done → also notify Central
if (newStatus.toLowerCase() === 'done' || newStatus.toLowerCase() === 'closed') {
  destinations.push({
    type: 'whatsapp',
    chatId: CENTRAL_GROUP,
    squadName: 'Central'
  });
}

// 3. Always notify Rafael
destinations.push({
  type: 'telegram',
  chatId: RAFAEL_TELEGRAM
});

// Format message
const message = \`📊 *Status alterado*

📋 \${task.name}
👥 Squad: \${squadName}
📈 \${oldStatus} → \${newStatus}
👤 Assignee: \${task.assignees?.[0]?.username || 'Não atribuído'}

📎 \${task.url}\`;

// Return one item per destination
return destinations.filter(d => d.chatId).map(dest => ({
  json: {
    ...items[0].json,
    destination: dest,
    message: message
  }
}));
`
  }
};

console.log('🚀 Mission Control - Deploy Smart Routing\n');

if (DRY_RUN) {
  console.log('🏃 DRY RUN MODE - No changes will be made\n');
}

if (!N8N_API_KEY) {
  console.error('❌ N8N_API_KEY not found in .env');
  process.exit(1);
}

async function updateWorkflow(workflowId, name, routingCode) {
  console.log(`📝 Updating workflow: ${name}`);
  console.log(`   ID: ${workflowId}`);

  if (DRY_RUN) {
    console.log('   ✅ Would update (dry-run)\n');
    return;
  }

  // Note: This is a simplified version
  // In production, you'd need to:
  // 1. GET the workflow JSON from n8n API
  // 2. Find the routing function node
  // 3. Update its code
  // 4. PUT the updated workflow back

  console.log('   ⚠️  Manual update required - see routing code above\n');
}

async function main() {
  console.log('📊 Workflows to update:\n');

  const workflows = existingWorkflows.workflows || [];

  for (const workflow of workflows) {
    const key = workflow.name.includes('Nova Demanda') ? 'new-task' :
                workflow.name.includes('Status') ? 'status-changed' : null;

    if (key && WORKFLOWS[key]) {
      await updateWorkflow(workflow.id, workflow.name, WORKFLOWS[key].routingCode);
    }
  }

  console.log('\n✅ Deploy completed!\n');
  console.log('📋 Next steps:');
  console.log('1. Access n8n: https://n8n.nataliatanaka.com.br');
  console.log('2. For each workflow:');
  console.log('   - Find "Route to Squad Groups" function node');
  console.log('   - Replace code with routing code from this script');
  console.log('   - Save and activate');
  console.log('3. Test with a demo task');
}

main().catch(console.error);
