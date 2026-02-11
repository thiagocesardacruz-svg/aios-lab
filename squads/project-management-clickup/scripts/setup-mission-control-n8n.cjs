/**
 * Setup N8N Workflows + ClickUp Webhooks para Mission Control
 * Squad: Project Management ClickUp
 *
 * Cria:
 *   1. ClickUp Webhook para events do Space Mission Control
 *   2. 5 N8N workflows para processar eventos e notificar
 *
 * Canais de notificação:
 *   - Telegram Bot (primário, já configurado)
 *   - WhatsApp/WAHA (secundário, configurável via env)
 *
 * Uso:
 *   node setup-mission-control-n8n.cjs create       - Criar workflows
 *   node setup-mission-control-n8n.cjs list         - Listar workflows
 *   node setup-mission-control-n8n.cjs activate     - Ativar workflows
 *   node setup-mission-control-n8n.cjs webhook      - Criar ClickUp webhooks
 *   node setup-mission-control-n8n.cjs delete-all   - Deletar workflows MC
 */

const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.env' });

// ============================================
// CONFIGURAÇÕES
// ============================================

const N8N_API_TOKEN = process.env.N8N_API_TOKEN;
const N8N_BASE_URL = 'n8n.nataliatanaka.com.br';
const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
const WAHA_API_URL = process.env.WAHA_API_URL || 'https://waha.nataliatanaka.com.br';
const WAHA_API_TOKEN = process.env.WAHA_API_TOKEN;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Mission Control IDs
const MC_IDS_PATH = '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.aios-core/squads/project-management-clickup/data/mission-control-ids.json';
let MC_IDS;

try {
  MC_IDS = JSON.parse(fs.readFileSync(MC_IDS_PATH, 'utf8'));
} catch (e) {
  console.error('❌ Arquivo mission-control-ids.json não encontrado.');
  process.exit(1);
}

const SPACE_ID = MC_IDS.space.id;
const INBOX_ID = MC_IDS.inbox.id;
const CUSTOM_FIELDS = MC_IDS.customFieldIds;

// WhatsApp chat ID para notificações (grupo ou número pessoal)
// Formato grupo: "5511XXXXX-YYYYY@g.us"
// Formato pessoal: "5511XXXXXXXXX@c.us"
const WHATSAPP_NOTIFICATION_CHAT = process.env.MISSION_CONTROL_WHATSAPP_CHAT_ID || '';

// Telegram chat ID (será preenchido no primeiro uso via /start no bot)
const TELEGRAM_CHAT_ID = process.env.MISSION_CONTROL_TELEGRAM_CHAT_ID || '';

console.log('🚀 Setup N8N Workflows - Mission Control');
console.log(`   Space ID: ${SPACE_ID}`);
console.log(`   Inbox ID: ${INBOX_ID}`);
console.log(`   Telegram Bot: ${TELEGRAM_BOT_TOKEN ? '✅' : '❌'}`);
console.log(`   WAHA: ${WAHA_API_TOKEN ? '✅' : '❌'}`);
console.log(`   WhatsApp Chat: ${WHATSAPP_NOTIFICATION_CHAT || '⚠️  Não configurado (defina MISSION_CONTROL_WHATSAPP_CHAT_ID no .env)'}`);
console.log(`   Telegram Chat: ${TELEGRAM_CHAT_ID || '⚠️  Não configurado (defina MISSION_CONTROL_TELEGRAM_CHAT_ID no .env)'}`);

// ============================================
// HTTP REQUEST HELPERS
// ============================================

function n8nRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: N8N_BASE_URL,
      port: 443,
      path: `/api/v1${path}`,
      method: method,
      headers: {
        'X-N8N-API-KEY': N8N_API_TOKEN,
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

function clickupRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.clickup.com',
      port: 443,
      path: `/api/v2${path}`,
      method: method,
      headers: {
        'Authorization': CLICKUP_API_TOKEN,
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
// NOTIFICATION NODES (reusáveis)
// ============================================

/**
 * Gera um node n8n para enviar notificação via Telegram
 */
function telegramNotifyNode(id, name, position, messageExpr) {
  return {
    id,
    name,
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.1,
    position,
    parameters: {
      method: 'POST',
      url: `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      sendBody: true,
      specifyBody: 'json',
      jsonBody: `={\n  "chat_id": "${TELEGRAM_CHAT_ID}",\n  "text": ${messageExpr},\n  "parse_mode": "HTML"\n}`
    }
  };
}

/**
 * Gera um node n8n para enviar notificação via WAHA WhatsApp
 */
function wahaNotifyNode(id, name, position, messageExpr) {
  return {
    id,
    name,
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.1,
    position,
    parameters: {
      method: 'POST',
      url: `${WAHA_API_URL}/api/sendText`,
      sendHeaders: true,
      headerParameters: {
        parameters: [
          {
            name: 'Authorization',
            value: `Bearer ${WAHA_API_TOKEN}`
          }
        ]
      },
      sendBody: true,
      specifyBody: 'json',
      jsonBody: `={\n  "chatId": "${WHATSAPP_NOTIFICATION_CHAT}",\n  "text": ${messageExpr},\n  "session": "default"\n}`
    }
  };
}

/**
 * Node padrão para buscar task do ClickUp por ID
 */
function fetchTaskNode(id, name, position) {
  return {
    id,
    name,
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.1,
    position,
    parameters: {
      method: 'GET',
      url: `=https://api.clickup.com/api/v2/task/{{ $json.task_id }}?custom_fields=true`,
      sendHeaders: true,
      headerParameters: {
        parameters: [
          {
            name: 'Authorization',
            value: CLICKUP_API_TOKEN
          }
        ]
      }
    }
  };
}

/**
 * Node para extrair campos relevantes da task
 */
function extractFieldsNode(id, name, position) {
  return {
    id,
    name,
    type: 'n8n-nodes-base.set',
    typeVersion: 3.2,
    position,
    parameters: {
      mode: 'manual',
      duplicateItem: false,
      assignments: {
        assignments: [
          { id: 'task-id', name: 'taskId', value: '={{ $json.id }}', type: 'string' },
          { id: 'task-name', name: 'taskName', value: '={{ $json.name }}', type: 'string' },
          { id: 'task-url', name: 'taskUrl', value: '=https://app.clickup.com/t/{{ $json.id }}', type: 'string' },
          { id: 'status', name: 'status', value: '={{ $json.status.status }}', type: 'string' },
          { id: 'priority', name: 'priority', value: '={{ $json.priority?.priority || "none" }}', type: 'string' },
          {
            id: 'squad',
            name: 'squad',
            value: `={{ $json.custom_fields?.find(f => f.id === "${CUSTOM_FIELDS.Squad}")?.type_config?.options?.find(o => o.orderindex === $json.custom_fields?.find(f => f.id === "${CUSTOM_FIELDS.Squad}")?.value)?.name || "N/A" }}`,
            type: 'string'
          },
          {
            id: 'task-type',
            name: 'taskType',
            value: `={{ $json.custom_fields?.find(f => f.id === "${CUSTOM_FIELDS['Task Type']}")?.type_config?.options?.find(o => o.orderindex === $json.custom_fields?.find(f => f.id === "${CUSTOM_FIELDS['Task Type']}")?.value)?.name || "N/A" }}`,
            type: 'string'
          },
          { id: 'folder', name: 'folder', value: '={{ $json.folder?.name || "Inbox" }}', type: 'string' },
          { id: 'list', name: 'list', value: '={{ $json.list?.name || "N/A" }}', type: 'string' },
          { id: 'date-created', name: 'dateCreated', value: '={{ new Date(parseInt($json.date_created)).toISOString() }}', type: 'string' }
        ]
      }
    }
  };
}

// ============================================
// WORKFLOW DEFINITIONS
// ============================================

const WORKFLOWS = [
  // ──────────────────────────────────────────
  // 1. NOVA DEMANDA - Task criada no Mission Control
  // ──────────────────────────────────────────
  {
    name: 'Mission Control - Nova Demanda',
    description: 'Notifica quando uma nova demanda é criada no Mission Control',
    nodes: [
      {
        id: 'webhook',
        name: 'Webhook Nova Demanda',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1.1,
        position: [250, 300],
        webhookId: 'mc-task-created',
        parameters: {
          path: 'mission-control/task-created',
          httpMethod: 'POST',
          responseMode: 'onReceived',
          responseData: 'allEntries'
        }
      },
      fetchTaskNode('fetch-task', 'Buscar Task', [450, 300]),
      extractFieldsNode('extract', 'Extrair Campos', [650, 300]),
      {
        id: 'check-notification',
        name: 'Canal Disponível?',
        type: 'n8n-nodes-base.if',
        typeVersion: 1,
        position: [850, 300],
        parameters: {
          conditions: {
            boolean: [
              {
                value1: `={{ "${TELEGRAM_CHAT_ID}" !== "" || "${WHATSAPP_NOTIFICATION_CHAT}" !== "" }}`,
                value2: true
              }
            ]
          }
        }
      },
      ...(TELEGRAM_CHAT_ID ? [telegramNotifyNode(
        'telegram-notify',
        'Telegram - Nova Demanda',
        [1050, 200],
        '`"📥 NOVA DEMANDA\\n\\n" + "📋 " + $json.taskName + "\\n" + "🏷️ Squad: " + $json.squad + "\\n" + "📂 Tipo: " + $json.taskType + "\\n" + "⚡ Prioridade: " + $json.priority + "\\n" + "📍 Status: " + $json.status + "\\n\\n" + "🔗 " + $json.taskUrl`'
      )] : []),
      ...(WHATSAPP_NOTIFICATION_CHAT ? [wahaNotifyNode(
        'waha-notify',
        'WhatsApp - Nova Demanda',
        [1050, 400],
        '`"📥 NOVA DEMANDA\\n\\n📋 " + $json.taskName + "\\n🏷️ Squad: " + $json.squad + "\\n📂 Tipo: " + $json.taskType + "\\n⚡ Prioridade: " + $json.priority + "\\n📍 Status: " + $json.status + "\\n\\n🔗 " + $json.taskUrl`'
      )] : []),
      {
        id: 'log-only',
        name: 'Log (sem notificação)',
        type: 'n8n-nodes-base.noOp',
        typeVersion: 1,
        position: [1050, 500],
        parameters: {}
      }
    ],
    connections: {
      'Webhook Nova Demanda': {
        main: [[{ node: 'Buscar Task', type: 'main', index: 0 }]]
      },
      'Buscar Task': {
        main: [[{ node: 'Extrair Campos', type: 'main', index: 0 }]]
      },
      'Extrair Campos': {
        main: [[{ node: 'Canal Disponível?', type: 'main', index: 0 }]]
      },
      'Canal Disponível?': {
        main: [
          [
            ...(TELEGRAM_CHAT_ID ? [{ node: 'Telegram - Nova Demanda', type: 'main', index: 0 }] : []),
            ...(WHATSAPP_NOTIFICATION_CHAT ? [{ node: 'WhatsApp - Nova Demanda', type: 'main', index: 0 }] : []),
            ...(!TELEGRAM_CHAT_ID && !WHATSAPP_NOTIFICATION_CHAT ? [{ node: 'Log (sem notificação)', type: 'main', index: 0 }] : [])
          ],
          [{ node: 'Log (sem notificação)', type: 'main', index: 0 }]
        ]
      }
    },
    settings: { executionOrder: 'v1' }
  },

  // ──────────────────────────────────────────
  // 2. STATUS ALTERADO - Notifica mudanças de status
  // ──────────────────────────────────────────
  {
    name: 'Mission Control - Status Alterado',
    description: 'Notifica mudanças de status importantes (blocked, rejected, done, review)',
    nodes: [
      {
        id: 'webhook',
        name: 'Webhook Status',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1.1,
        position: [250, 300],
        webhookId: 'mc-status-updated',
        parameters: {
          path: 'mission-control/task-status-updated',
          httpMethod: 'POST',
          responseMode: 'onReceived',
          responseData: 'allEntries'
        }
      },
      fetchTaskNode('fetch-task', 'Buscar Task', [450, 300]),
      extractFieldsNode('extract', 'Extrair Campos', [650, 300]),
      {
        id: 'switch-status',
        name: 'Switch Status',
        type: 'n8n-nodes-base.switch',
        typeVersion: 2,
        position: [850, 300],
        parameters: {
          dataType: 'string',
          value1: '={{ $json.status }}',
          rules: {
            rules: [
              { value2: 'blocked', output: 0 },
              { value2: 'rejected', output: 1 },
              { value2: 'done', output: 2 },
              { value2: 'review', output: 3 }
            ]
          }
        }
      },
      ...(TELEGRAM_CHAT_ID ? [
        telegramNotifyNode('tg-blocked', 'TG - Blocked', [1100, 100],
          '`"🚫 TASK BLOQUEADA\\n\\n📋 " + $json.taskName + "\\n🏷️ Squad: " + $json.squad + "\\n\\n⚠️ Requer atenção imediata!\\n\\n🔗 " + $json.taskUrl`'),
        telegramNotifyNode('tg-rejected', 'TG - Rejected', [1100, 250],
          '`"❌ DEMANDA REJEITADA\\n\\n📋 " + $json.taskName + "\\n🏷️ Squad: " + $json.squad + "\\n\\n💡 Uma nova proposta deve ser criada.\\n\\n🔗 " + $json.taskUrl`'),
        telegramNotifyNode('tg-done', 'TG - Done', [1100, 400],
          '`"✅ TASK CONCLUÍDA\\n\\n📋 " + $json.taskName + "\\n🏷️ Squad: " + $json.squad + "\\n\\n🎉 Entrega finalizada!\\n\\n🔗 " + $json.taskUrl`'),
        telegramNotifyNode('tg-review', 'TG - Review', [1100, 550],
          '`"🔍 EM REVIEW\\n\\n📋 " + $json.taskName + "\\n🏷️ Squad: " + $json.squad + "\\n\\n👀 Aguardando revisão.\\n\\n🔗 " + $json.taskUrl`')
      ] : [
        { id: 'log-blocked', name: 'Log Blocked', type: 'n8n-nodes-base.noOp', typeVersion: 1, position: [1100, 100], parameters: {} },
        { id: 'log-rejected', name: 'Log Rejected', type: 'n8n-nodes-base.noOp', typeVersion: 1, position: [1100, 250], parameters: {} },
        { id: 'log-done', name: 'Log Done', type: 'n8n-nodes-base.noOp', typeVersion: 1, position: [1100, 400], parameters: {} },
        { id: 'log-review', name: 'Log Review', type: 'n8n-nodes-base.noOp', typeVersion: 1, position: [1100, 550], parameters: {} }
      ])
    ],
    connections: {
      'Webhook Status': {
        main: [[{ node: 'Buscar Task', type: 'main', index: 0 }]]
      },
      'Buscar Task': {
        main: [[{ node: 'Extrair Campos', type: 'main', index: 0 }]]
      },
      'Extrair Campos': {
        main: [[{ node: 'Switch Status', type: 'main', index: 0 }]]
      },
      'Switch Status': {
        main: [
          [{ node: TELEGRAM_CHAT_ID ? 'TG - Blocked' : 'Log Blocked', type: 'main', index: 0 }],
          [{ node: TELEGRAM_CHAT_ID ? 'TG - Rejected' : 'Log Rejected', type: 'main', index: 0 }],
          [{ node: TELEGRAM_CHAT_ID ? 'TG - Done' : 'Log Done', type: 'main', index: 0 }],
          [{ node: TELEGRAM_CHAT_ID ? 'TG - Review' : 'Log Review', type: 'main', index: 0 }]
        ]
      }
    },
    settings: { executionOrder: 'v1' }
  },

  // ──────────────────────────────────────────
  // 3. DAILY DIGEST - Resumo diário às 9h
  // ──────────────────────────────────────────
  {
    name: 'Mission Control - Daily Digest',
    description: 'Envia resumo diário do Mission Control às 9h (pending approvals, blocked, in progress)',
    nodes: [
      {
        id: 'cron',
        name: 'Cron 9h',
        type: 'n8n-nodes-base.scheduleTrigger',
        typeVersion: 1.1,
        position: [250, 300],
        parameters: {
          rule: {
            interval: [
              {
                field: 'cronExpression',
                expression: '0 9 * * *'
              }
            ]
          }
        }
      },
      {
        id: 'fetch-inbox',
        name: 'Buscar Tasks Inbox',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [450, 200],
        parameters: {
          method: 'GET',
          url: `https://api.clickup.com/api/v2/list/${INBOX_ID}/task?statuses[]=inbox&statuses[]=awaiting%20approval&subtasks=true&include_closed=false`,
          sendHeaders: true,
          headerParameters: {
            parameters: [{ name: 'Authorization', value: CLICKUP_API_TOKEN }]
          }
        }
      },
      {
        id: 'fetch-blocked',
        name: 'Buscar Tasks Blocked',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [450, 400],
        parameters: {
          method: 'GET',
          url: `https://api.clickup.com/api/v2/team/${process.env.CLICKUP_WORKSPACE_ID}/task?space_ids[]=${SPACE_ID}&statuses[]=blocked&subtasks=true&include_closed=false`,
          sendHeaders: true,
          headerParameters: {
            parameters: [{ name: 'Authorization', value: CLICKUP_API_TOKEN }]
          }
        }
      },
      {
        id: 'fetch-progress',
        name: 'Buscar Tasks In Progress',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [450, 600],
        parameters: {
          method: 'GET',
          url: `https://api.clickup.com/api/v2/team/${process.env.CLICKUP_WORKSPACE_ID}/task?space_ids[]=${SPACE_ID}&statuses[]=in%20progress&subtasks=true&include_closed=false`,
          sendHeaders: true,
          headerParameters: {
            parameters: [{ name: 'Authorization', value: CLICKUP_API_TOKEN }]
          }
        }
      },
      {
        id: 'merge',
        name: 'Merge Resultados',
        type: 'n8n-nodes-base.merge',
        typeVersion: 2.1,
        position: [700, 300],
        parameters: {
          mode: 'append'
        }
      },
      {
        id: 'build-digest',
        name: 'Montar Digest',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [900, 300],
        parameters: {
          jsCode: `
// Collect all items from all inputs
const allItems = $input.all();

// Parse tasks from each source
let inboxTasks = [];
let blockedTasks = [];
let progressTasks = [];

for (const item of allItems) {
  const tasks = item.json?.tasks || [];
  // Determine source by checking the node that produced this
  for (const task of tasks) {
    const status = task.status?.status?.toLowerCase() || '';
    if (status === 'inbox' || status === 'awaiting approval') {
      inboxTasks.push(task);
    } else if (status === 'blocked') {
      blockedTasks.push(task);
    } else if (status === 'in progress') {
      progressTasks.push(task);
    }
  }
}

const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });

let msg = "📊 MISSION CONTROL - DAILY DIGEST\\n";
msg += "📅 " + today + "\\n\\n";

msg += "📥 INBOX/APROVAÇÃO (" + inboxTasks.length + ")\\n";
if (inboxTasks.length === 0) {
  msg += "   ✅ Nenhuma pendência\\n";
} else {
  for (const t of inboxTasks.slice(0, 10)) {
    msg += "   • " + t.name + " [" + (t.status?.status || '?') + "]\\n";
  }
  if (inboxTasks.length > 10) msg += "   ... e mais " + (inboxTasks.length - 10) + "\\n";
}

msg += "\\n🚫 BLOCKED (" + blockedTasks.length + ")\\n";
if (blockedTasks.length === 0) {
  msg += "   ✅ Nenhuma bloqueada\\n";
} else {
  for (const t of blockedTasks.slice(0, 10)) {
    msg += "   • " + t.name + "\\n";
  }
}

msg += "\\n🔄 IN PROGRESS (" + progressTasks.length + ")\\n";
if (progressTasks.length === 0) {
  msg += "   Nenhuma em andamento\\n";
} else {
  for (const t of progressTasks.slice(0, 10)) {
    msg += "   • " + t.name + "\\n";
  }
  if (progressTasks.length > 10) msg += "   ... e mais " + (progressTasks.length - 10) + "\\n";
}

msg += "\\n📈 Total: " + (inboxTasks.length + blockedTasks.length + progressTasks.length) + " tasks ativas";

return [{ json: { digest: msg, inboxCount: inboxTasks.length, blockedCount: blockedTasks.length, progressCount: progressTasks.length } }];
`
        }
      },
      ...(TELEGRAM_CHAT_ID ? [telegramNotifyNode(
        'tg-digest',
        'Telegram - Digest',
        [1100, 300],
        '$json.digest'
      )] : [{
        id: 'log-digest',
        name: 'Log Digest',
        type: 'n8n-nodes-base.noOp',
        typeVersion: 1,
        position: [1100, 300],
        parameters: {}
      }])
    ],
    connections: {
      'Cron 9h': {
        main: [
          [
            { node: 'Buscar Tasks Inbox', type: 'main', index: 0 },
            { node: 'Buscar Tasks Blocked', type: 'main', index: 0 },
            { node: 'Buscar Tasks In Progress', type: 'main', index: 0 }
          ]
        ]
      },
      'Buscar Tasks Inbox': {
        main: [[{ node: 'Merge Resultados', type: 'main', index: 0 }]]
      },
      'Buscar Tasks Blocked': {
        main: [[{ node: 'Merge Resultados', type: 'main', index: 1 }]]
      },
      'Buscar Tasks In Progress': {
        main: [[{ node: 'Montar Digest', type: 'main', index: 0 }]]
      },
      'Merge Resultados': {
        main: [[{ node: 'Montar Digest', type: 'main', index: 0 }]]
      },
      'Montar Digest': {
        main: [[{ node: TELEGRAM_CHAT_ID ? 'Telegram - Digest' : 'Log Digest', type: 'main', index: 0 }]]
      }
    },
    settings: { executionOrder: 'v1' }
  },

  // ──────────────────────────────────────────
  // 4. BLOCKED ALERT - Escalação de tasks bloqueadas >24h
  // ──────────────────────────────────────────
  {
    name: 'Mission Control - Blocked Alert',
    description: 'Verifica tasks bloqueadas há mais de 24h e escalona',
    nodes: [
      {
        id: 'cron',
        name: 'Cron 6h',
        type: 'n8n-nodes-base.scheduleTrigger',
        typeVersion: 1.1,
        position: [250, 300],
        parameters: {
          rule: {
            interval: [
              {
                field: 'cronExpression',
                expression: '0 */6 * * *'
              }
            ]
          }
        }
      },
      {
        id: 'fetch-blocked',
        name: 'Buscar Blocked',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [450, 300],
        parameters: {
          method: 'GET',
          url: `https://api.clickup.com/api/v2/team/${process.env.CLICKUP_WORKSPACE_ID}/task?space_ids[]=${SPACE_ID}&statuses[]=blocked&subtasks=true&include_closed=false`,
          sendHeaders: true,
          headerParameters: {
            parameters: [{ name: 'Authorization', value: CLICKUP_API_TOKEN }]
          }
        }
      },
      {
        id: 'filter-old',
        name: 'Filtrar >24h',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [650, 300],
        parameters: {
          jsCode: `
const tasks = $input.first().json.tasks || [];
const now = Date.now();
const twentyFourHours = 24 * 60 * 60 * 1000;

const oldBlocked = tasks.filter(t => {
  const updated = parseInt(t.date_updated || t.date_created);
  return (now - updated) > twentyFourHours;
});

if (oldBlocked.length === 0) {
  return [{ json: { hasBlocked: false, count: 0, message: '' } }];
}

let msg = "🚨 ALERTA: " + oldBlocked.length + " TASK(S) BLOQUEADA(S) HÁ +24H\\n\\n";

for (const t of oldBlocked) {
  const hours = Math.round((now - parseInt(t.date_updated || t.date_created)) / (60 * 60 * 1000));
  msg += "• " + t.name + " (" + hours + "h bloqueada)\\n";
  msg += "  🔗 https://app.clickup.com/t/" + t.id + "\\n\\n";
}

msg += "⚡ Ação necessária: desbloquear ou reatribuir.";

return [{ json: { hasBlocked: true, count: oldBlocked.length, message: msg } }];
`
        }
      },
      {
        id: 'check-blocked',
        name: 'Tem Bloqueadas?',
        type: 'n8n-nodes-base.if',
        typeVersion: 1,
        position: [850, 300],
        parameters: {
          conditions: {
            boolean: [
              {
                value1: '={{ $json.hasBlocked }}',
                value2: true
              }
            ]
          }
        }
      },
      ...(TELEGRAM_CHAT_ID ? [telegramNotifyNode(
        'tg-blocked-alert',
        'TG - Blocked Alert',
        [1050, 200],
        '$json.message'
      )] : [{
        id: 'log-alert',
        name: 'Log Alert',
        type: 'n8n-nodes-base.noOp',
        typeVersion: 1,
        position: [1050, 200],
        parameters: {}
      }]),
      {
        id: 'no-blocked',
        name: 'Sem Bloqueadas',
        type: 'n8n-nodes-base.noOp',
        typeVersion: 1,
        position: [1050, 400],
        parameters: {}
      }
    ],
    connections: {
      'Cron 6h': {
        main: [[{ node: 'Buscar Blocked', type: 'main', index: 0 }]]
      },
      'Buscar Blocked': {
        main: [[{ node: 'Filtrar >24h', type: 'main', index: 0 }]]
      },
      'Filtrar >24h': {
        main: [[{ node: 'Tem Bloqueadas?', type: 'main', index: 0 }]]
      },
      'Tem Bloqueadas?': {
        main: [
          [{ node: TELEGRAM_CHAT_ID ? 'TG - Blocked Alert' : 'Log Alert', type: 'main', index: 0 }],
          [{ node: 'Sem Bloqueadas', type: 'main', index: 0 }]
        ]
      }
    },
    settings: { executionOrder: 'v1' }
  },

  // ──────────────────────────────────────────
  // 5. AUTO ARCHIVE - Arquivar tasks done >30 dias
  // ──────────────────────────────────────────
  {
    name: 'Mission Control - Auto Archive',
    description: 'Arquiva automaticamente tasks concluídas há mais de 30 dias',
    nodes: [
      {
        id: 'cron',
        name: 'Cron Diário 0h',
        type: 'n8n-nodes-base.scheduleTrigger',
        typeVersion: 1.1,
        position: [250, 300],
        parameters: {
          rule: {
            interval: [
              {
                field: 'cronExpression',
                expression: '0 0 * * *'
              }
            ]
          }
        }
      },
      {
        id: 'fetch-done',
        name: 'Buscar Done',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [450, 300],
        parameters: {
          method: 'GET',
          url: `https://api.clickup.com/api/v2/team/${process.env.CLICKUP_WORKSPACE_ID}/task?space_ids[]=${SPACE_ID}&statuses[]=done&subtasks=true&include_closed=true`,
          sendHeaders: true,
          headerParameters: {
            parameters: [{ name: 'Authorization', value: CLICKUP_API_TOKEN }]
          }
        }
      },
      {
        id: 'filter-old',
        name: 'Filtrar >30 dias',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [650, 300],
        parameters: {
          jsCode: `
const tasks = $input.first().json.tasks || [];
const now = Date.now();
const thirtyDays = 30 * 24 * 60 * 60 * 1000;

const oldDone = tasks.filter(t => {
  const completed = parseInt(t.date_done || t.date_updated || t.date_created);
  return (now - completed) > thirtyDays && !t.archived;
});

if (oldDone.length === 0) {
  return [{ json: { toArchive: [], count: 0 } }];
}

return oldDone.map(t => ({
  json: {
    taskId: t.id,
    taskName: t.name,
    daysOld: Math.round((now - parseInt(t.date_done || t.date_updated)) / (24 * 60 * 60 * 1000))
  }
}));
`
        }
      },
      {
        id: 'check-archive',
        name: 'Tem para Arquivar?',
        type: 'n8n-nodes-base.if',
        typeVersion: 1,
        position: [850, 300],
        parameters: {
          conditions: {
            number: [
              {
                value1: '={{ $json.count }}',
                operation: 'largerEqual',
                value2: 0
              }
            ]
          }
        }
      },
      {
        id: 'archive-task',
        name: 'Arquivar Task',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [1050, 200],
        parameters: {
          method: 'PUT',
          url: '=https://api.clickup.com/api/v2/task/{{ $json.taskId }}',
          sendHeaders: true,
          headerParameters: {
            parameters: [{ name: 'Authorization', value: CLICKUP_API_TOKEN }]
          },
          sendBody: true,
          specifyBody: 'json',
          jsonBody: '{ "archived": true }'
        }
      },
      {
        id: 'no-archive',
        name: 'Nada para Arquivar',
        type: 'n8n-nodes-base.noOp',
        typeVersion: 1,
        position: [1050, 400],
        parameters: {}
      }
    ],
    connections: {
      'Cron Diário 0h': {
        main: [[{ node: 'Buscar Done', type: 'main', index: 0 }]]
      },
      'Buscar Done': {
        main: [[{ node: 'Filtrar >30 dias', type: 'main', index: 0 }]]
      },
      'Filtrar >30 dias': {
        main: [[{ node: 'Tem para Arquivar?', type: 'main', index: 0 }]]
      },
      'Tem para Arquivar?': {
        main: [
          [{ node: 'Arquivar Task', type: 'main', index: 0 }],
          [{ node: 'Nada para Arquivar', type: 'main', index: 0 }]
        ]
      }
    },
    settings: { executionOrder: 'v1' }
  }
];

// ============================================
// CLICKUP WEBHOOK CREATION
// ============================================

async function createClickUpWebhooks() {
  console.log('\n' + '='.repeat(60));
  console.log('🔗 CRIANDO CLICKUP WEBHOOKS');
  console.log('='.repeat(60));

  // Primeiro, listar webhooks existentes para evitar duplicatas
  console.log('\n📋 Verificando webhooks existentes...');
  let existingWebhooks = [];
  try {
    const result = await clickupRequest('GET', `/team/${process.env.CLICKUP_WORKSPACE_ID}/webhook`);
    existingWebhooks = result.webhooks || [];
    console.log(`   Encontrados: ${existingWebhooks.length} webhooks`);
  } catch (error) {
    console.log(`   ⚠️  Não foi possível listar webhooks: ${JSON.stringify(error)}`);
  }

  // Remover webhooks MC antigos
  const mcWebhooks = existingWebhooks.filter(w =>
    w.endpoint && w.endpoint.includes('mission-control')
  );
  if (mcWebhooks.length > 0) {
    console.log(`\n🗑️  Removendo ${mcWebhooks.length} webhooks MC antigos...`);
    for (const wh of mcWebhooks) {
      try {
        await clickupRequest('DELETE', `/webhook/${wh.id}`);
        console.log(`   ✅ Removido: ${wh.id}`);
      } catch (e) {
        console.log(`   ⚠️  Erro ao remover ${wh.id}: ${e.error?.err || 'unknown'}`);
      }
      await sleep(300);
    }
  }

  // Obter URLs dos webhooks n8n
  // Os webhooks n8n ficam em: https://n8n.nataliatanaka.com.br/webhook/{path}
  const webhookConfigs = [
    {
      name: 'MC - Task Created',
      endpoint: `https://${N8N_BASE_URL}/webhook/mission-control/task-created`,
      events: ['taskCreated'],
      space_id: parseInt(SPACE_ID)
    },
    {
      name: 'MC - Status Updated',
      endpoint: `https://${N8N_BASE_URL}/webhook/mission-control/task-status-updated`,
      events: ['taskStatusUpdated'],
      space_id: parseInt(SPACE_ID)
    }
  ];

  const createdWebhooks = [];

  for (const config of webhookConfigs) {
    console.log(`\n📝 Criando webhook "${config.name}"...`);
    console.log(`   Endpoint: ${config.endpoint}`);
    console.log(`   Events: ${config.events.join(', ')}`);
    console.log(`   Space: ${config.space_id}`);

    try {
      const result = await clickupRequest('POST', `/team/${process.env.CLICKUP_WORKSPACE_ID}/webhook`, {
        endpoint: config.endpoint,
        events: config.events,
        space_id: config.space_id
      });
      console.log(`   ✅ Webhook criado! ID: ${result.id || result.webhook?.id}`);
      createdWebhooks.push({ ...config, id: result.id || result.webhook?.id });
    } catch (error) {
      console.log(`   ❌ Erro: ${JSON.stringify(error)}`);
    }
    await sleep(500);
  }

  return createdWebhooks;
}

// ============================================
// WORKFLOW CRUD
// ============================================

async function listWorkflows() {
  console.log('\n📋 Listando workflows existentes...');
  try {
    const result = await n8nRequest('GET', '/workflows');
    return result.data || [];
  } catch (error) {
    console.log(`   ❌ Erro: ${JSON.stringify(error)}`);
    return [];
  }
}

async function createWorkflow(workflow) {
  console.log(`\n📝 Criando workflow "${workflow.name}"...`);

  const payload = {
    name: workflow.name,
    nodes: workflow.nodes,
    connections: workflow.connections,
    settings: workflow.settings
  };

  try {
    const result = await n8nRequest('POST', '/workflows', payload);
    console.log(`   ✅ Workflow criado! ID: ${result.id}`);
    return result;
  } catch (error) {
    console.log(`   ❌ Erro: ${JSON.stringify(error)}`);
    return null;
  }
}

async function activateWorkflow(workflowId) {
  console.log(`\n🔌 Ativando workflow ${workflowId}...`);
  try {
    const result = await n8nRequest('POST', `/workflows/${workflowId}/activate`);
    console.log(`   ✅ Workflow ativado!`);
    return result;
  } catch (error) {
    console.log(`   ❌ Erro ao ativar: ${JSON.stringify(error)}`);
    return null;
  }
}

async function deleteWorkflow(workflowId) {
  console.log(`\n🗑️ Deletando workflow ${workflowId}...`);
  try {
    await n8nRequest('DELETE', `/workflows/${workflowId}`);
    console.log(`   ✅ Workflow deletado!`);
  } catch (error) {
    console.log(`   ❌ Erro: ${JSON.stringify(error)}`);
  }
}

// ============================================
// MAIN
// ============================================

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'create';

  console.log('\n' + '='.repeat(60));
  console.log('🎯 SETUP N8N WORKFLOWS - MISSION CONTROL');
  console.log('='.repeat(60));

  if (!N8N_API_TOKEN) {
    console.log('\n❌ N8N_API_TOKEN não configurado no .env');
    process.exit(1);
  }

  if (command === 'list') {
    const workflows = await listWorkflows();
    const mcWorkflows = workflows.filter(wf => wf.name.startsWith('Mission Control'));
    console.log(`\n📋 Workflows Mission Control: ${mcWorkflows.length}`);
    mcWorkflows.forEach(wf => {
      console.log(`\n   • ID: ${wf.id}`);
      console.log(`     Nome: ${wf.name}`);
      console.log(`     Ativo: ${wf.active}`);
    });
    if (mcWorkflows.length === 0) {
      console.log('   Nenhum workflow Mission Control encontrado.');
      console.log('   Execute "node setup-mission-control-n8n.cjs create" para criá-los.');
    }

  } else if (command === 'create') {
    // Deletar workflows MC existentes
    const existing = await listWorkflows();
    const mcExisting = existing.filter(wf => wf.name.startsWith('Mission Control'));
    if (mcExisting.length > 0) {
      console.log(`\n🗑️  Removendo ${mcExisting.length} workflows MC anteriores...`);
      for (const wf of mcExisting) {
        await deleteWorkflow(wf.id);
        await sleep(300);
      }
    }

    // Criar novos workflows
    const createdWorkflows = [];
    for (const workflow of WORKFLOWS) {
      const created = await createWorkflow(workflow);
      if (created) {
        createdWorkflows.push(created);
      }
      await sleep(500);
    }

    // Salvar IDs
    const outputPath = '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.aios-core/squads/project-management-clickup/data/mission-control-n8n-workflows.json';
    fs.writeFileSync(outputPath, JSON.stringify(createdWorkflows, null, 2));
    console.log(`\n💾 Workflows salvos em: ${outputPath}`);
    console.log(`\n✅ ${createdWorkflows.length} workflows criados (INATIVOS).`);
    console.log('\n⚠️  PRÓXIMOS PASSOS:');
    console.log('   1. Configure MISSION_CONTROL_TELEGRAM_CHAT_ID no .env');
    console.log('      (Envie /start para @bot no Telegram, e use a API getUpdates para obter o chat_id)');
    console.log('   2. Execute: node setup-mission-control-n8n.cjs webhook');
    console.log('   3. Execute: node setup-mission-control-n8n.cjs activate');

  } else if (command === 'webhook') {
    const webhooks = await createClickUpWebhooks();
    if (webhooks.length > 0) {
      // Salvar no IDs
      MC_IDS.webhooks = webhooks;
      fs.writeFileSync(MC_IDS_PATH, JSON.stringify(MC_IDS, null, 2));
      console.log(`\n💾 Webhook IDs salvos em mission-control-ids.json`);
    }

  } else if (command === 'activate') {
    const wfPath = '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.aios-core/squads/project-management-clickup/data/mission-control-n8n-workflows.json';
    try {
      const workflows = JSON.parse(fs.readFileSync(wfPath, 'utf8'));
      for (const wf of workflows) {
        await activateWorkflow(wf.id);
        await sleep(300);
      }
    } catch (e) {
      console.log('❌ Arquivo mission-control-n8n-workflows.json não encontrado.');
      console.log('   Execute "node setup-mission-control-n8n.cjs create" primeiro.');
    }

  } else if (command === 'delete-all') {
    const workflows = await listWorkflows();
    const mcWorkflows = workflows.filter(wf => wf.name.startsWith('Mission Control'));
    for (const wf of mcWorkflows) {
      await deleteWorkflow(wf.id);
      await sleep(300);
    }
    console.log(`\n✅ ${mcWorkflows.length} workflows Mission Control deletados.`);

  } else {
    console.log('\n📖 Uso:');
    console.log('   node setup-mission-control-n8n.cjs create       - Criar workflows');
    console.log('   node setup-mission-control-n8n.cjs list         - Listar workflows');
    console.log('   node setup-mission-control-n8n.cjs webhook      - Criar ClickUp webhooks');
    console.log('   node setup-mission-control-n8n.cjs activate     - Ativar workflows');
    console.log('   node setup-mission-control-n8n.cjs delete-all   - Deletar workflows MC');
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ CONCLUÍDO');
  console.log('='.repeat(60));
}

main().catch(console.error);
