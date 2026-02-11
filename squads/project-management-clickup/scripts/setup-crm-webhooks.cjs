/**
 * Setup Webhooks do CRM no ClickUp via API
 * Squad: Project Management ClickUp
 *
 * A API do ClickUp não permite criar Automations diretamente.
 * Este script cria WEBHOOKS que podem disparar ações externas.
 *
 * Para automações internas do ClickUp, use a interface web.
 */

const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.env' });

// Configurações
const API_TOKEN = process.env.CLICKUP_API_TOKEN;
const WORKSPACE_ID = process.env.CLICKUP_WORKSPACE_ID;

// Carregar IDs do CRM criado
const CRM_IDS_PATH = '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.aios-core/squads/project-management-clickup/data/crm-clickup-ids.json';
let CRM_IDS;

try {
  CRM_IDS = JSON.parse(fs.readFileSync(CRM_IDS_PATH, 'utf8'));
} catch (e) {
  console.error('❌ Arquivo crm-clickup-ids.json não encontrado. Execute setup-crm-clickup.cjs primeiro.');
  process.exit(1);
}

// URL do webhook - N8N Natália Tanaka
// Cada evento terá seu próprio endpoint no N8N
const WEBHOOK_BASE_URL = process.env.WEBHOOK_BASE_URL || 'https://n8n.nataliatanaka.com.br/webhook/clickup-crm';

console.log('🚀 Configurando Webhooks do CRM no ClickUp...');
console.log(`📍 Workspace ID: ${WORKSPACE_ID}`);
console.log(`📍 Space COMERCIAL ID: ${CRM_IDS.space.id}`);

// Função para fazer requisições à API do ClickUp
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
// CONFIGURAÇÃO DOS WEBHOOKS
// ============================================

const WEBHOOKS_CONFIG = [
  {
    name: 'CRM - Nova Task Criada',
    endpoint: `${WEBHOOK_BASE_URL}/task-created`,
    events: ['taskCreated'],
    space_id: CRM_IDS.space.id,
    description: 'Dispara quando um novo lead/task é criado no CRM'
  },
  {
    name: 'CRM - Status Alterado',
    endpoint: `${WEBHOOK_BASE_URL}/task-status-updated`,
    events: ['taskStatusUpdated'],
    space_id: CRM_IDS.space.id,
    description: 'Dispara quando o status de uma task muda (ex: carrinho abandonado, comprou, etc)'
  },
  {
    name: 'CRM - Task Atualizada',
    endpoint: `${WEBHOOK_BASE_URL}/task-updated`,
    events: ['taskUpdated'],
    space_id: CRM_IDS.space.id,
    description: 'Dispara quando qualquer campo de uma task é atualizado'
  },
  {
    name: 'CRM - Comentário Adicionado',
    endpoint: `${WEBHOOK_BASE_URL}/task-comment`,
    events: ['taskCommentPosted'],
    space_id: CRM_IDS.space.id,
    description: 'Dispara quando um comentário é adicionado'
  }
];

// ============================================
// FUNÇÕES DE WEBHOOK
// ============================================

async function listWebhooks() {
  console.log('\n📋 Listando webhooks existentes...');
  const result = await clickupRequest('GET', `/team/${WORKSPACE_ID}/webhook`);
  return result.webhooks || [];
}

async function createWebhook(config) {
  console.log(`\n🔗 Criando webhook "${config.name}"...`);

  const payload = {
    endpoint: config.endpoint,
    events: config.events,
    space_id: config.space_id
  };

  try {
    const result = await clickupRequest('POST', `/team/${WORKSPACE_ID}/webhook`, payload);
    console.log(`   ✅ Webhook criado! ID: ${result.id}`);
    console.log(`   📍 Endpoint: ${config.endpoint}`);
    console.log(`   📌 Events: ${config.events.join(', ')}`);
    return result;
  } catch (error) {
    console.log(`   ❌ Erro: ${JSON.stringify(error)}`);
    return null;
  }
}

async function deleteWebhook(webhookId) {
  console.log(`\n🗑️ Deletando webhook ${webhookId}...`);
  try {
    await clickupRequest('DELETE', `/webhook/${webhookId}`);
    console.log(`   ✅ Webhook deletado!`);
  } catch (error) {
    console.log(`   ❌ Erro: ${JSON.stringify(error)}`);
  }
}

// ============================================
// EXECUÇÃO PRINCIPAL
// ============================================

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'create';

  console.log('\n' + '='.repeat(60));
  console.log('🔗 SETUP WEBHOOKS CRM CLICKUP');
  console.log('='.repeat(60));

  if (command === 'list') {
    // Listar webhooks existentes
    const webhooks = await listWebhooks();
    console.log(`\n📋 Webhooks encontrados: ${webhooks.length}`);
    webhooks.forEach(wh => {
      console.log(`\n   • ID: ${wh.id}`);
      console.log(`     Endpoint: ${wh.endpoint}`);
      console.log(`     Events: ${wh.events.join(', ')}`);
      console.log(`     Health: ${JSON.stringify(wh.health)}`);
    });

  } else if (command === 'delete-all') {
    // Deletar todos os webhooks
    const webhooks = await listWebhooks();
    for (const wh of webhooks) {
      await deleteWebhook(wh.id);
      await sleep(300);
    }
    console.log('\n✅ Todos os webhooks deletados!');

  } else if (command === 'create') {
    // Verificar se a URL do webhook está configurada
    if (WEBHOOK_BASE_URL.includes('seu-servidor.com')) {
      console.log('\n⚠️  ATENÇÃO: Configure a variável WEBHOOK_BASE_URL no .env');
      console.log('   Exemplo: WEBHOOK_BASE_URL=https://seu-n8n.com/webhook');
      console.log('\n   Sem um endpoint real, os webhooks não funcionarão.');
      console.log('   Continuando para fins de demonstração...\n');
    }

    // Criar webhooks
    const createdWebhooks = [];
    for (const config of WEBHOOKS_CONFIG) {
      const webhook = await createWebhook(config);
      if (webhook) {
        createdWebhooks.push({ ...config, id: webhook.id });
      }
      await sleep(500);
    }

    // Salvar webhooks criados
    const outputPath = '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.aios-core/squads/project-management-clickup/data/crm-webhooks.json';
    fs.writeFileSync(outputPath, JSON.stringify(createdWebhooks, null, 2));
    console.log(`\n💾 Webhooks salvos em: ${outputPath}`);

  } else {
    console.log('\n📖 Uso:');
    console.log('   node setup-crm-webhooks.cjs create     - Criar webhooks');
    console.log('   node setup-crm-webhooks.cjs list       - Listar webhooks');
    console.log('   node setup-crm-webhooks.cjs delete-all - Deletar todos');
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ CONCLUÍDO');
  console.log('='.repeat(60));
}

main().catch(console.error);
