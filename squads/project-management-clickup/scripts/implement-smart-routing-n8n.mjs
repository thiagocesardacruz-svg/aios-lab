#!/usr/bin/env node
/**
 * Implement Smart Routing in Mission Control n8n Workflows via API
 *
 * This script:
 * 1. Fetches existing workflows
 * 2. Adds/updates "Route to Squad Groups" Function node
 * 3. Updates connections to route through new node
 * 4. Pushes updated workflows back to n8n
 */

import fs from 'fs';
import https from 'https';

// Config
const N8N_API_URL = 'https://n8n.nataliatanaka.com.br';
const N8N_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzZjczMWFiZi0wN2QyLTRhMjItOTZlYi1jMzg1ZDAwMWZmMjgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY5OTcwOTQ2fQ.PKArd-d6Ce2EOSPrk0HOjMz604gm7IVpdEiuY_8-bGk';

// Workflow IDs
const WORKFLOWS = {
  'nova-demanda': 'HHzwCo0rneqzaNK4',
  'status-alterado': 'Phq1pBEo9jgG6t8x'
};

// Routing code for Nova Demanda
const NOVA_DEMANDA_ROUTING_CODE = `// SMART ROUTING - Nova Demanda
const SQUAD_GROUPS = {
  'youtube-content': '120363424196533902@g.us',
  'copywriting': '120363406587885552@g.us',
  'full-stack-dev': '120363406026510701@g.us',
  'deep-scraper': '120363423300665938@g.us',
  'project-management': '120363407597476119@g.us',
  'orquestrador': '120363406314822971@g.us',
  'content-ecosystem': '120363404710981133@g.us',
  'squad-creator': '120363406656215906@g.us',
  'infoproduct-creation': '120363422153688546@g.us',
  'sales': '120363405780687881@g.us',
  'conselho': '120363425327638973@g.us',
  'design-system': '120363423380627383@g.us',
  'creative-studio': '120363425012662387@g.us',
  'youtube-lives': '120363404442774199@g.us',
  'data-analytics': '120363422673222745@g.us',
  'media-buy': '120363405238158159@g.us',
  'funnel-creator': '120363426405865296@g.us',
  'devops': '120363423692903314@g.us'
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

const CENTRAL_GROUP = '120363406314168390@g.us';
const RAFAEL_TELEGRAM = '726437877';

// Extract task and squad
const task = $json;
const squad = task.squad;
const squadName = squad && squad !== 'N/A' ? (SQUAD_NAMES[squad] || squad) : 'Geral';

// Route to destinations
const destinations = [];

// 1. Squad group or Central
if (squad && squad !== 'N/A' && SQUAD_GROUPS[squad]) {
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
const message = \`📥 *NOVA DEMANDA*

📋 \${task.taskName}
👥 Squad: \${squadName}
📂 Tipo: \${task.taskType}
⚡ Prioridade: \${task.priority}
📍 Status: \${task.status}

🔗 \${task.taskUrl}\`;

// Return one item per destination
return destinations.filter(d => d.chatId).map(dest => ({
  json: {
    ...task,
    destination: dest,
    message: message
  }
}));`;

// Routing code for Status Alterado
const STATUS_ALTERADO_ROUTING_CODE = `// SMART ROUTING - Status Alterado
const SQUAD_GROUPS = {
  'youtube-content': '120363424196533902@g.us',
  'copywriting': '120363406587885552@g.us',
  'full-stack-dev': '120363406026510701@g.us',
  'deep-scraper': '120363423300665938@g.us',
  'project-management': '120363407597476119@g.us',
  'orquestrador': '120363406314822971@g.us',
  'content-ecosystem': '120363404710981133@g.us',
  'squad-creator': '120363406656215906@g.us',
  'infoproduct-creation': '120363422153688546@g.us',
  'sales': '120363405780687881@g.us',
  'conselho': '120363425327638973@g.us',
  'design-system': '120363423380627383@g.us',
  'creative-studio': '120363425012662387@g.us',
  'youtube-lives': '120363404442774199@g.us',
  'data-analytics': '120363422673222745@g.us',
  'media-buy': '120363405238158159@g.us',
  'funnel-creator': '120363426405865296@g.us',
  'devops': '120363423692903314@g.us'
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

const CENTRAL_GROUP = '120363406314168390@g.us';
const RAFAEL_TELEGRAM = '726437877';

// Extract data
const task = $json;
const oldStatus = task.oldStatus || 'unknown';
const newStatus = task.status || 'unknown';
const squad = task.squad;
const squadName = squad && squad !== 'N/A' ? (SQUAD_NAMES[squad] || squad) : 'Geral';

// Route to destinations
const destinations = [];

// 1. Squad group
if (squad && squad !== 'N/A' && SQUAD_GROUPS[squad]) {
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
const message = \`📊 *STATUS ALTERADO*

📋 \${task.taskName}
👥 Squad: \${squadName}
📈 \${oldStatus} → \${newStatus}

🔗 \${task.taskUrl}\`;

// Return one item per destination
return destinations.filter(d => d.chatId).map(dest => ({
  json: {
    ...task,
    destination: dest,
    message: message
  }
}));`;

// Helper function to make HTTPS requests
function httpsRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Fetch workflow
async function fetchWorkflow(workflowId) {
  const url = `${N8N_API_URL}/api/v1/workflows/${workflowId}`;
  const options = {
    method: 'GET',
    headers: {
      'X-N8N-API-KEY': N8N_API_KEY,
      'Content-Type': 'application/json'
    }
  };

  const response = await httpsRequest(url, options);
  if (response.status !== 200) {
    throw new Error(`Failed to fetch workflow: ${response.status}`);
  }
  return response.data;
}

// Update workflow
async function updateWorkflow(workflowId, workflowData) {
  const url = `${N8N_API_URL}/api/v1/workflows/${workflowId}`;
  const options = {
    method: 'PUT',
    headers: {
      'X-N8N-API-KEY': N8N_API_KEY,
      'Content-Type': 'application/json'
    }
  };

  const response = await httpsRequest(url, options, workflowData);
  if (response.status !== 200) {
    throw new Error(`Failed to update workflow: ${response.status} - ${JSON.stringify(response.data)}`);
  }
  return response.data;
}

// Main implementation
async function implementSmartRouting() {
  console.log('🚀 Implementando Smart Routing nos workflows n8n...\n');

  try {
    // 1. Nova Demanda
    console.log('📝 Workflow: Mission Control - Nova Demanda');
    const novaDemanda = await fetchWorkflow(WORKFLOWS['nova-demanda']);

    // Find or create routing node
    let routingNode = novaDemanda.nodes.find(n => n.name === 'Route to Squad Groups');

    if (!routingNode) {
      routingNode = {
        id: 'route-squad-groups',
        name: 'Route to Squad Groups',
        type: 'n8n-nodes-base.function',
        typeVersion: 1,
        position: [850, 300],
        parameters: {
          functionCode: NOVA_DEMANDA_ROUTING_CODE
        }
      };
      novaDemanda.nodes.push(routingNode);

      // Update connections: Extrair Campos → Route → Telegram/WhatsApp
      const extractNode = novaDemanda.nodes.find(n => n.name === 'Extrair Campos');
      if (extractNode) {
        novaDemanda.connections['Extrair Campos'] = {
          main: [[{ node: 'Route to Squad Groups', type: 'main', index: 0 }]]
        };

        novaDemanda.connections['Route to Squad Groups'] = {
          main: [[
            { node: 'Telegram - Nova Demanda', type: 'main', index: 0 },
            { node: 'WhatsApp - Nova Demanda', type: 'main', index: 0 }
          ]]
        };

        // Remove old connection from Canal Disponível?
        delete novaDemanda.connections['Canal Disponível?'];
      }
    } else {
      routingNode.parameters.functionCode = NOVA_DEMANDA_ROUTING_CODE;
    }

    // Update workflow - send only writable fields
    const novaDemandaUpdate = {
      name: novaDemanda.name,
      nodes: novaDemanda.nodes,
      connections: novaDemanda.connections,
      settings: novaDemanda.settings,
      staticData: novaDemanda.staticData
    };
    await updateWorkflow(WORKFLOWS['nova-demanda'], novaDemandaUpdate);
    console.log('✅ Nova Demanda atualizado\n');

    // 2. Status Alterado
    console.log('📝 Workflow: Mission Control - Status Alterado');
    const statusAlterado = await fetchWorkflow(WORKFLOWS['status-alterado']);

    // Similar implementation for Status Alterado
    let statusRoutingNode = statusAlterado.nodes.find(n => n.name === 'Route to Squad Groups');

    if (!statusRoutingNode) {
      statusRoutingNode = {
        id: 'route-squad-groups-status',
        name: 'Route to Squad Groups',
        type: 'n8n-nodes-base.function',
        typeVersion: 1,
        position: [850, 300],
        parameters: {
          functionCode: STATUS_ALTERADO_ROUTING_CODE
        }
      };
      statusAlterado.nodes.push(statusRoutingNode);

      // Update connections
      statusAlterado.connections['Extrair Campos'] = {
        main: [[{ node: 'Route to Squad Groups', type: 'main', index: 0 }]]
      };

      statusAlterado.connections['Route to Squad Groups'] = {
        main: [[
          { node: 'Telegram - Status Alterado', type: 'main', index: 0 },
          { node: 'WhatsApp - Status Alterado', type: 'main', index: 0 }
        ]]
      };
    } else {
      statusRoutingNode.parameters.functionCode = STATUS_ALTERADO_ROUTING_CODE;
    }

    // Update workflow - send only writable fields
    const statusAlteradoUpdate = {
      name: statusAlterado.name,
      nodes: statusAlterado.nodes,
      connections: statusAlterado.connections,
      settings: statusAlterado.settings,
      staticData: statusAlterado.staticData
    };
    await updateWorkflow(WORKFLOWS['status-alterado'], statusAlteradoUpdate);
    console.log('✅ Status Alterado atualizado\n');

    console.log('🎉 Smart Routing implementado com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Verificar workflows no n8n: https://n8n.nataliatanaka.com.br');
    console.log('2. Testar com task de demo no ClickUp');
    console.log('3. Validar notificações nos grupos corretos');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

implementSmartRouting();
