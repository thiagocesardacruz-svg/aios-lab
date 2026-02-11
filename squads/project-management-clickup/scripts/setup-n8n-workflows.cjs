/**
 * Setup Workflows N8N para CRM ClickUp
 * Squad: Project Management ClickUp
 *
 * Cria os workflows no N8N via API para processar eventos do ClickUp
 */

const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.env' });

// Configurações N8N
const N8N_API_TOKEN = process.env.N8N_API_TOKEN;
const N8N_BASE_URL = 'n8n.nataliatanaka.com.br';

// Carregar IDs do CRM
const CRM_IDS_PATH = '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.aios-core/squads/project-management-clickup/data/crm-clickup-ids.json';
let CRM_IDS;

try {
  CRM_IDS = JSON.parse(fs.readFileSync(CRM_IDS_PATH, 'utf8'));
} catch (e) {
  console.error('❌ Arquivo crm-clickup-ids.json não encontrado.');
  process.exit(1);
}

console.log('🚀 Criando Workflows N8N para CRM ClickUp...');

// Função para fazer requisições à API do N8N
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// DEFINIÇÃO DOS WORKFLOWS
// ============================================

const WORKFLOWS = [
  {
    name: 'CRM ClickUp - Novo Lead Criado',
    description: 'Processa novos leads criados no CRM do ClickUp',
    nodes: [
      {
        id: 'webhook',
        name: 'Webhook ClickUp',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1.1,
        position: [250, 300],
        webhookId: 'clickup-crm-task-created',
        parameters: {
          path: 'clickup-crm/task-created',
          httpMethod: 'POST',
          responseMode: 'onReceived',
          responseData: 'allEntries'
        }
      },
      {
        id: 'get-task',
        name: 'Buscar Task ClickUp',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [450, 300],
        parameters: {
          method: 'GET',
          url: '=https://api.clickup.com/api/v2/task/{{ $json.task_id }}',
          authentication: 'genericCredentialType',
          genericAuthType: 'httpHeaderAuth',
          sendHeaders: true,
          headerParameters: {
            parameters: [
              {
                name: 'Authorization',
                value: process.env.CLICKUP_API_TOKEN
              }
            ]
          }
        }
      },
      {
        id: 'check-whatsapp',
        name: 'Tem WhatsApp?',
        type: 'n8n-nodes-base.if',
        typeVersion: 1,
        position: [650, 300],
        parameters: {
          conditions: {
            string: [
              {
                value1: '={{ $json.custom_fields.find(f => f.name === "WhatsApp")?.value }}',
                operation: 'isNotEmpty'
              }
            ]
          }
        }
      },
      {
        id: 'activecampaign',
        name: 'ActiveCampaign - Criar Contato',
        type: 'n8n-nodes-base.activeCampaign',
        typeVersion: 1,
        position: [850, 200],
        parameters: {
          operation: 'create',
          resource: 'contact',
          email: '={{ $json.custom_fields.find(f => f.name === "Email")?.value || $json.name + "@lead.temp" }}',
          additionalFields: {
            firstName: '={{ $json.name.split(" ")[0] }}',
            lastName: '={{ $json.name.split(" ").slice(1).join(" ") }}',
            phone: '={{ $json.custom_fields.find(f => f.name === "WhatsApp")?.value }}'
          }
        }
      },
      {
        id: 'waha-welcome',
        name: 'WAHA - Mensagem Boas-vindas',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [850, 400],
        parameters: {
          method: 'POST',
          url: process.env.WAHA_API_URL + '/api/sendText',
          authentication: 'genericCredentialType',
          genericAuthType: 'httpHeaderAuth',
          sendHeaders: true,
          headerParameters: {
            parameters: [
              {
                name: 'Authorization',
                value: 'Bearer ' + process.env.WAHA_API_TOKEN
              }
            ]
          },
          sendBody: true,
          bodyParameters: {
            parameters: [
              {
                name: 'chatId',
                value: '={{ $json.custom_fields.find(f => f.name === "WhatsApp")?.value.replace(/\\D/g, "") }}@c.us'
              },
              {
                name: 'text',
                value: 'Olá {{ $json.name.split(" ")[0] }}! 👋\n\nObrigada por se interessar!\n\nSou a assistente virtual da Natália Tanaka e estou aqui para te ajudar.\n\nTem alguma dúvida que eu possa esclarecer?'
              },
              {
                name: 'session',
                value: 'default'
              }
            ]
          }
        }
      },
      {
        id: 'no-action',
        name: 'Sem WhatsApp - Log',
        type: 'n8n-nodes-base.noOp',
        typeVersion: 1,
        position: [850, 500],
        parameters: {}
      }
    ],
    connections: {
      'Webhook ClickUp': {
        main: [[{ node: 'Buscar Task ClickUp', type: 'main', index: 0 }]]
      },
      'Buscar Task ClickUp': {
        main: [[{ node: 'Tem WhatsApp?', type: 'main', index: 0 }]]
      },
      'Tem WhatsApp?': {
        main: [
          [{ node: 'ActiveCampaign - Criar Contato', type: 'main', index: 0 }, { node: 'WAHA - Mensagem Boas-vindas', type: 'main', index: 0 }],
          [{ node: 'Sem WhatsApp - Log', type: 'main', index: 0 }]
        ]
      }
    },
    settings: {
      executionOrder: 'v1'
    }
  },
  {
    name: 'CRM ClickUp - Status Alterado',
    description: 'Processa mudanças de status no pipeline do CRM',
    nodes: [
      {
        id: 'webhook',
        name: 'Webhook Status',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1.1,
        position: [250, 300],
        webhookId: 'clickup-crm-status-updated',
        parameters: {
          path: 'clickup-crm/task-status-updated',
          httpMethod: 'POST',
          responseMode: 'onReceived',
          responseData: 'allEntries'
        }
      },
      {
        id: 'get-task',
        name: 'Buscar Task',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [450, 300],
        parameters: {
          method: 'GET',
          url: '=https://api.clickup.com/api/v2/task/{{ $json.task_id }}',
          authentication: 'genericCredentialType',
          genericAuthType: 'httpHeaderAuth',
          sendHeaders: true,
          headerParameters: {
            parameters: [
              {
                name: 'Authorization',
                value: process.env.CLICKUP_API_TOKEN
              }
            ]
          }
        }
      },
      {
        id: 'extract-status',
        name: 'Extrair Status',
        type: 'n8n-nodes-base.set',
        typeVersion: 3.2,
        position: [650, 300],
        parameters: {
          mode: 'manual',
          duplicateItem: false,
          assignments: {
            assignments: [
              {
                id: 'new-status',
                name: 'newStatus',
                value: '={{ $json.status.status }}',
                type: 'string'
              },
              {
                id: 'task-name',
                name: 'taskName',
                value: '={{ $json.name }}',
                type: 'string'
              },
              {
                id: 'whatsapp',
                name: 'whatsapp',
                value: '={{ $json.custom_fields.find(f => f.name === "WhatsApp")?.value }}',
                type: 'string'
              }
            ]
          }
        }
      },
      {
        id: 'switch-status',
        name: 'Switch Status',
        type: 'n8n-nodes-base.switch',
        typeVersion: 2,
        position: [850, 300],
        parameters: {
          dataType: 'string',
          value1: '={{ $json.newStatus }}',
          rules: {
            rules: [
              { value2: 'Comprou', output: 0 },
              { value2: 'Carrinho Abandonado', output: 1 },
              { value2: 'Qualificado', output: 2 },
              { value2: 'Não Qualificado', output: 3 }
            ]
          }
        }
      },
      {
        id: 'comprou-tag',
        name: 'AC - Tag Cliente',
        type: 'n8n-nodes-base.activeCampaign',
        typeVersion: 1,
        position: [1100, 100],
        parameters: {
          operation: 'addTag',
          resource: 'contactTag',
          tagId: 'cliente'
        }
      },
      {
        id: 'carrinho-wait',
        name: 'Aguardar 30min',
        type: 'n8n-nodes-base.wait',
        typeVersion: 1,
        position: [1100, 250],
        parameters: {
          amount: 30,
          unit: 'minutes'
        }
      },
      {
        id: 'carrinho-msg',
        name: 'WAHA - Recuperação',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [1300, 250],
        parameters: {
          method: 'POST',
          url: process.env.WAHA_API_URL + '/api/sendText',
          sendBody: true,
          bodyParameters: {
            parameters: [
              {
                name: 'chatId',
                value: '={{ $json.whatsapp.replace(/\\D/g, "") }}@c.us'
              },
              {
                name: 'text',
                value: 'Oi {{ $json.taskName.split(" ")[0] }}!\n\nVi que você se interessou mas não finalizou a compra.\n\nAconteceu algum problema? Posso te ajudar com alguma dúvida?'
              },
              {
                name: 'session',
                value: 'default'
              }
            ]
          }
        }
      },
      {
        id: 'qualificado-notify',
        name: 'Notificar Closer',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [1100, 400],
        parameters: {
          method: 'POST',
          url: process.env.WAHA_API_URL + '/api/sendText',
          sendBody: true,
          bodyParameters: {
            parameters: [
              {
                name: 'chatId',
                value: '5511999999999@c.us' // TODO: Configurar número do closer
              },
              {
                name: 'text',
                value: '🎯 NOVO LEAD QUALIFICADO\n\nNome: {{ $json.taskName }}\nWhatsApp: {{ $json.whatsapp }}\n\nAcessar no ClickUp: https://app.clickup.com/t/{{ $json.task_id }}'
              },
              {
                name: 'session',
                value: 'default'
              }
            ]
          }
        }
      },
      {
        id: 'nao-qualificado',
        name: 'Mover para Nurture',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4.1,
        position: [1100, 550],
        parameters: {
          method: 'PUT',
          url: '=https://api.clickup.com/api/v2/task/{{ $json.task_id }}',
          sendHeaders: true,
          headerParameters: {
            parameters: [
              {
                name: 'Authorization',
                value: process.env.CLICKUP_API_TOKEN
              }
            ]
          },
          sendBody: true,
          bodyParameters: {
            parameters: [
              {
                name: 'list_id',
                value: '901325077615' // Lista Nurture
              }
            ]
          }
        }
      }
    ],
    connections: {
      'Webhook Status': {
        main: [[{ node: 'Buscar Task', type: 'main', index: 0 }]]
      },
      'Buscar Task': {
        main: [[{ node: 'Extrair Status', type: 'main', index: 0 }]]
      },
      'Extrair Status': {
        main: [[{ node: 'Switch Status', type: 'main', index: 0 }]]
      },
      'Switch Status': {
        main: [
          [{ node: 'AC - Tag Cliente', type: 'main', index: 0 }],
          [{ node: 'Aguardar 30min', type: 'main', index: 0 }],
          [{ node: 'Notificar Closer', type: 'main', index: 0 }],
          [{ node: 'Mover para Nurture', type: 'main', index: 0 }]
        ]
      },
      'Aguardar 30min': {
        main: [[{ node: 'WAHA - Recuperação', type: 'main', index: 0 }]]
      }
    },
    settings: {
      executionOrder: 'v1'
    }
  },
  {
    name: 'CRM ClickUp - Task Atualizada',
    description: 'Processa atualizações de campos em tasks do CRM',
    nodes: [
      {
        id: 'webhook',
        name: 'Webhook Update',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1.1,
        position: [250, 300],
        webhookId: 'clickup-crm-task-updated',
        parameters: {
          path: 'clickup-crm/task-updated',
          httpMethod: 'POST',
          responseMode: 'onReceived',
          responseData: 'allEntries'
        }
      },
      {
        id: 'log-update',
        name: 'Log Atualização',
        type: 'n8n-nodes-base.set',
        typeVersion: 3.2,
        position: [450, 300],
        parameters: {
          mode: 'manual',
          duplicateItem: false,
          assignments: {
            assignments: [
              {
                id: 'task-id',
                name: 'taskId',
                value: '={{ $json.task_id }}',
                type: 'string'
              },
              {
                id: 'event',
                name: 'event',
                value: '={{ $json.event }}',
                type: 'string'
              },
              {
                id: 'timestamp',
                name: 'timestamp',
                value: '={{ new Date().toISOString() }}',
                type: 'string'
              }
            ]
          }
        }
      }
    ],
    connections: {
      'Webhook Update': {
        main: [[{ node: 'Log Atualização', type: 'main', index: 0 }]]
      }
    },
    settings: {
      executionOrder: 'v1'
    }
  },
  {
    name: 'CRM ClickUp - Comentário Adicionado',
    description: 'Processa comentários adicionados em tasks do CRM',
    nodes: [
      {
        id: 'webhook',
        name: 'Webhook Comment',
        type: 'n8n-nodes-base.webhook',
        typeVersion: 1.1,
        position: [250, 300],
        webhookId: 'clickup-crm-task-comment',
        parameters: {
          path: 'clickup-crm/task-comment',
          httpMethod: 'POST',
          responseMode: 'onReceived',
          responseData: 'allEntries'
        }
      },
      {
        id: 'log-comment',
        name: 'Log Comentário',
        type: 'n8n-nodes-base.set',
        typeVersion: 3.2,
        position: [450, 300],
        parameters: {
          mode: 'manual',
          duplicateItem: false,
          assignments: {
            assignments: [
              {
                id: 'task-id',
                name: 'taskId',
                value: '={{ $json.task_id }}',
                type: 'string'
              },
              {
                id: 'event',
                name: 'event',
                value: 'comment_added',
                type: 'string'
              }
            ]
          }
        }
      }
    ],
    connections: {
      'Webhook Comment': {
        main: [[{ node: 'Log Comentário', type: 'main', index: 0 }]]
      }
    },
    settings: {
      executionOrder: 'v1'
    }
  }
];

// ============================================
// FUNÇÕES PRINCIPAIS
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
// EXECUÇÃO PRINCIPAL
// ============================================

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'create';

  console.log('\n' + '='.repeat(60));
  console.log('📊 SETUP WORKFLOWS N8N - CRM CLICKUP');
  console.log('='.repeat(60));

  if (!N8N_API_TOKEN) {
    console.log('\n❌ N8N_API_TOKEN não configurado no .env');
    process.exit(1);
  }

  if (command === 'list') {
    const workflows = await listWorkflows();
    console.log(`\n📋 Workflows encontrados: ${workflows.length}`);
    workflows.forEach(wf => {
      console.log(`\n   • ID: ${wf.id}`);
      console.log(`     Nome: ${wf.name}`);
      console.log(`     Ativo: ${wf.active}`);
    });

  } else if (command === 'create') {
    const createdWorkflows = [];

    for (const workflow of WORKFLOWS) {
      const created = await createWorkflow(workflow);
      if (created) {
        createdWorkflows.push(created);
      }
      await sleep(500);
    }

    // Salvar IDs dos workflows criados
    const outputPath = '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.aios-core/squads/project-management-clickup/data/n8n-workflows.json';
    fs.writeFileSync(outputPath, JSON.stringify(createdWorkflows, null, 2));
    console.log(`\n💾 Workflows salvos em: ${outputPath}`);

    console.log('\n⚠️  IMPORTANTE: Os workflows foram criados mas estão INATIVOS.');
    console.log('   Execute "node setup-n8n-workflows.cjs activate" para ativá-los.');

  } else if (command === 'activate') {
    // Carregar workflows criados
    const workflowsPath = '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.aios-core/squads/project-management-clickup/data/n8n-workflows.json';
    try {
      const workflows = JSON.parse(fs.readFileSync(workflowsPath, 'utf8'));
      for (const wf of workflows) {
        await activateWorkflow(wf.id);
        await sleep(300);
      }
    } catch (e) {
      console.log('❌ Arquivo n8n-workflows.json não encontrado. Execute "create" primeiro.');
    }

  } else if (command === 'delete-all') {
    const workflows = await listWorkflows();
    const crmWorkflows = workflows.filter(wf => wf.name.startsWith('CRM ClickUp'));
    for (const wf of crmWorkflows) {
      await deleteWorkflow(wf.id);
      await sleep(300);
    }
    console.log('\n✅ Workflows CRM deletados!');

  } else {
    console.log('\n📖 Uso:');
    console.log('   node setup-n8n-workflows.cjs create      - Criar workflows');
    console.log('   node setup-n8n-workflows.cjs list        - Listar workflows');
    console.log('   node setup-n8n-workflows.cjs activate    - Ativar workflows');
    console.log('   node setup-n8n-workflows.cjs delete-all  - Deletar workflows CRM');
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ CONCLUÍDO');
  console.log('='.repeat(60));
}

main().catch(console.error);
