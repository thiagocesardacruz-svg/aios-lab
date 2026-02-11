/**
 * Teste de Criação de Lead no CRM ClickUp
 * Cria um lead de teste para verificar webhooks e workflows N8N
 */

const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.env' });

const API_TOKEN = process.env.CLICKUP_API_TOKEN;

// Carregar IDs do CRM
const CRM_IDS_PATH = '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.aios-core/squads/project-management-clickup/data/crm-clickup-ids.json';
const CRM_IDS = JSON.parse(fs.readFileSync(CRM_IDS_PATH, 'utf8'));

// Lista de Leads (Geral)
const LEADS_LIST_ID = '901325077568';

console.log('🧪 Teste de Criação de Lead no CRM ClickUp\n');

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

async function createTestLead() {
  const leadData = {
    name: 'Maria Silva (TESTE)',
    description: 'Lead de teste criado automaticamente para verificar integração ClickUp → N8N → WhatsApp/ActiveCampaign',
    status: 'Novo Lead',
    priority: 3, // Normal
    tags: ['teste', 'automacao'],
    custom_fields: [
      {
        id: await getCustomFieldId('Origem'),
        value: 'Tráfego Pago'
      },
      {
        id: await getCustomFieldId('Produto de Interesse'),
        value: 'Manual dos Pontos Gatilhos'
      },
      {
        id: await getCustomFieldId('WhatsApp'),
        value: '+5511999998888'
      }
    ]
  };

  console.log('📝 Criando lead de teste...');
  console.log(`   Lista: ${LEADS_LIST_ID} (Leads Geral)`);
  console.log(`   Nome: ${leadData.name}`);

  try {
    // Primeiro, buscar os custom fields da lista
    const customFields = await getListCustomFields(LEADS_LIST_ID);

    // Mapear os IDs dos custom fields
    const fieldMap = {};
    customFields.forEach(f => {
      fieldMap[f.name] = f.id;
    });

    console.log('\n📋 Custom Fields disponíveis:');
    Object.keys(fieldMap).forEach(name => {
      console.log(`   • ${name}: ${fieldMap[name]}`);
    });

    // Criar o lead com os custom fields corretos
    const taskData = {
      name: 'Maria Silva (TESTE)',
      description: 'Lead de teste criado automaticamente para verificar integração ClickUp → N8N → WhatsApp/ActiveCampaign\n\n⚠️ Este é um lead de TESTE - pode ser deletado.',
      priority: 3,
      tags: ['teste', 'automacao']
    };

    // Adicionar custom fields se existirem
    if (fieldMap['Origem']) {
      taskData.custom_fields = taskData.custom_fields || [];
      taskData.custom_fields.push({
        id: fieldMap['Origem'],
        value: 0 // Índice da opção "Tráfego Pago"
      });
    }

    const result = await clickupRequest('POST', `/list/${LEADS_LIST_ID}/task`, taskData);

    console.log('\n✅ Lead criado com sucesso!');
    console.log(`   ID: ${result.id}`);
    console.log(`   URL: ${result.url}`);
    console.log('\n🔔 Webhook deve ter sido disparado para N8N!');
    console.log('   Verifique o N8N para ver a execução do workflow.');

    return result;
  } catch (error) {
    console.log(`\n❌ Erro ao criar lead: ${JSON.stringify(error, null, 2)}`);
    return null;
  }
}

async function getListCustomFields(listId) {
  try {
    const result = await clickupRequest('GET', `/list/${listId}/field`);
    return result.fields || [];
  } catch (error) {
    console.log(`Erro ao buscar custom fields: ${JSON.stringify(error)}`);
    return [];
  }
}

async function getCustomFieldId(fieldName) {
  // Placeholder - será preenchido dinamicamente
  return null;
}

async function testStatusChange(taskId) {
  console.log('\n🔄 Testando mudança de status...');

  try {
    // Mudar para "Qualificado"
    const result = await clickupRequest('PUT', `/task/${taskId}`, {
      status: 'Qualificado'
    });

    console.log('✅ Status alterado para "Qualificado"');
    console.log('🔔 Webhook de status deve ter sido disparado!');

    return result;
  } catch (error) {
    console.log(`❌ Erro: ${JSON.stringify(error)}`);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'create';

  console.log('='.repeat(50));
  console.log('🧪 TESTE CRM CLICKUP - INTEGRAÇÃO N8N');
  console.log('='.repeat(50));

  if (command === 'create') {
    await createTestLead();
  } else if (command === 'status') {
    const taskId = args[1];
    if (!taskId) {
      console.log('❌ Informe o ID da task: node test-crm-lead.cjs status <task_id>');
      return;
    }
    await testStatusChange(taskId);
  } else {
    console.log('\n📖 Uso:');
    console.log('   node test-crm-lead.cjs create         - Criar lead de teste');
    console.log('   node test-crm-lead.cjs status <id>    - Testar mudança de status');
  }

  console.log('\n' + '='.repeat(50));
}

main().catch(console.error);
