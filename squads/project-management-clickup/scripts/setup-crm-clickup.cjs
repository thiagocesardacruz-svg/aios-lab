/**
 * Setup CRM no ClickUp via API
 * Squad: Project Management ClickUp
 *
 * Este script cria a estrutura completa do CRM:
 * - Space COMERCIAL
 * - Folders (Pipeline, Clientes, Perdidos)
 * - Lists com Statuses
 * - Custom Fields
 */

const https = require('https');
require('dotenv').config({ path: '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.env' });

// Configurações
const API_TOKEN = process.env.CLICKUP_API_TOKEN;
const WORKSPACE_ID = process.env.CLICKUP_WORKSPACE_ID;

// Verificar token
if (!API_TOKEN) {
  console.error('❌ CLICKUP_API_TOKEN não encontrado no .env');
  process.exit(1);
}

console.log('🚀 Iniciando setup do CRM no ClickUp...');
console.log(`📍 Workspace ID: ${WORKSPACE_ID}`);

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

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Função para aguardar (rate limiting)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// CONFIGURAÇÃO DO CRM
// ============================================

const CRM_CONFIG = {
  space: {
    name: 'COMERCIAL',
    color: '#40BC86', // Verde
    features: {
      due_dates: { enabled: true },
      time_tracking: { enabled: true },
      tags: { enabled: true },
      priorities: { enabled: true },
      custom_fields: { enabled: true },
      dependency_warning: { enabled: true }
    }
  },

  folders: [
    {
      name: 'Pipeline de Vendas',
      lists: [
        {
          name: '🎯 Leads (Geral)',
          statuses: [
            { name: '📥 Novo Lead', color: '#808080', type: 'open' },
            { name: '🔍 Em Qualificação', color: '#4194f6', type: 'custom' },
            { name: '🎯 Qualificado (Low)', color: '#f9d900', type: 'custom' },
            { name: '📈 Qualificado (Mid/High)', color: '#ff7800', type: 'custom' },
            { name: '➡️ Movido para Pipeline', color: '#6bc950', type: 'done' },
            { name: '❌ Desqualificado', color: '#e50000', type: 'closed' }
          ]
        },
        {
          name: '🛒 Low Ticket (Funil Perpétuo)',
          statuses: [
            { name: '📥 Capturado', color: '#808080', type: 'open' },
            { name: '🔥 Engajado', color: '#81B1FF', type: 'custom' },
            { name: '🛒 Iniciou Checkout', color: '#f9d900', type: 'custom' },
            { name: '💳 Pagamento Pendente', color: '#ff7800', type: 'custom' },
            { name: '✅ Comprou', color: '#6bc950', type: 'done' },
            { name: '📈 Upsell Oferecido', color: '#7C4DFF', type: 'custom' },
            { name: '✅ Aceitou Upsell', color: '#2E7D32', type: 'done' },
            { name: '❌ Recusou Upsell', color: '#ff9999', type: 'closed' }
          ]
        },
        {
          name: '📈 Upsell/Cross-sell',
          statuses: [
            { name: '🎯 Elegível', color: '#808080', type: 'open' },
            { name: '📧 Oferta Enviada', color: '#4194f6', type: 'custom' },
            { name: '🤔 Considerando', color: '#f9d900', type: 'custom' },
            { name: '✅ Converteu', color: '#6bc950', type: 'done' },
            { name: '❌ Não Interessou', color: '#e50000', type: 'closed' }
          ]
        },
        {
          name: '🚀 Lançamento (MCPM)',
          statuses: [
            { name: '📥 Lista de Espera', color: '#808080', type: 'open' },
            { name: '🔥 CPL 1', color: '#81B1FF', type: 'custom' },
            { name: '🔥 CPL 2', color: '#4194f6', type: 'custom' },
            { name: '🔥 CPL 3', color: '#1565C0', type: 'custom' },
            { name: '🚀 Carrinho Aberto', color: '#f9d900', type: 'custom' },
            { name: '💳 Iniciou Checkout', color: '#ff7800', type: 'custom' },
            { name: '💰 Comprou', color: '#6bc950', type: 'done' },
            { name: '❌ Não Comprou', color: '#e50000', type: 'closed' },
            { name: '🔄 Remarketing', color: '#7C4DFF', type: 'custom' }
          ]
        },
        {
          name: '💎 High Ticket (Mentoria MAV)',
          statuses: [
            { name: '📥 Aplicação Recebida', color: '#808080', type: 'open' },
            { name: '🤖 Triagem IA', color: '#81B1FF', type: 'custom' },
            { name: '✅ Qualificado', color: '#A5D6A7', type: 'custom' },
            { name: '📅 Call Agendada', color: '#f9d900', type: 'custom' },
            { name: '📞 Call Realizada', color: '#ff7800', type: 'custom' },
            { name: '📝 Proposta Enviada', color: '#7C4DFF', type: 'custom' },
            { name: '🤝 Em Negociação', color: '#E91E63', type: 'custom' },
            { name: '💰 Fechado', color: '#6bc950', type: 'done' },
            { name: '❌ Não Fechou', color: '#e50000', type: 'closed' },
            { name: '🔄 Nurture', color: '#1565C0', type: 'custom' }
          ]
        }
      ]
    },
    {
      name: 'Clientes',
      lists: [
        {
          name: '👥 Base de Clientes',
          statuses: [
            { name: '🟢 Ativo', color: '#6bc950', type: 'open' },
            { name: '⏸️ Inativo', color: '#808080', type: 'custom' },
            { name: '🔄 Em Renovação', color: '#f9d900', type: 'custom' }
          ]
        },
        {
          name: '🌟 Clientes VIP',
          statuses: [
            { name: '🟢 Ativo', color: '#6bc950', type: 'open' },
            { name: '⏸️ Inativo', color: '#808080', type: 'custom' },
            { name: '🔄 Em Renovação', color: '#f9d900', type: 'custom' }
          ]
        },
        {
          name: '🔄 Recompra/Renovação',
          statuses: [
            { name: '🎯 Oportunidade', color: '#808080', type: 'open' },
            { name: '📧 Contato Feito', color: '#4194f6', type: 'custom' },
            { name: '🤔 Considerando', color: '#f9d900', type: 'custom' },
            { name: '✅ Recomprou', color: '#6bc950', type: 'done' },
            { name: '❌ Não Renovou', color: '#e50000', type: 'closed' }
          ]
        }
      ]
    },
    {
      name: 'Perdidos & Nurture',
      lists: [
        {
          name: '❌ Não Convertidos',
          statuses: [
            { name: '📊 Para Análise', color: '#808080', type: 'open' },
            { name: '✅ Analisado', color: '#6bc950', type: 'done' }
          ]
        },
        {
          name: '🌱 Nurture (Longo Prazo)',
          statuses: [
            { name: '🌱 Em Nutrição', color: '#A5D6A7', type: 'open' },
            { name: '🔥 Reaquecido', color: '#ff7800', type: 'custom' },
            { name: '🎯 Pronto para Recontato', color: '#f9d900', type: 'custom' },
            { name: '✅ Converteu', color: '#6bc950', type: 'done' }
          ]
        }
      ]
    }
  ],

  // Custom Fields no nível do Space
  customFields: [
    {
      name: 'Origem',
      type: 'drop_down',
      type_config: {
        options: [
          { name: '📱 Tráfego Pago - Meta', color: '#4194f6' },
          { name: '📱 Tráfego Pago - Google', color: '#e50000' },
          { name: '🎬 YouTube Orgânico', color: '#ff0000' },
          { name: '📸 Instagram Orgânico', color: '#E91E63' },
          { name: '🚀 Lançamento MCPM', color: '#7C4DFF' },
          { name: '🔄 Funil Perpétuo', color: '#00BCD4' },
          { name: '👥 Indicação', color: '#4CAF50' },
          { name: '📧 Email Marketing', color: '#ff7800' },
          { name: '💬 WhatsApp Direto', color: '#25D366' },
          { name: '📱 Direct Instagram', color: '#C13584' },
          { name: '🎯 Lead Magnet', color: '#f9d900' }
        ]
      }
    },
    {
      name: 'Produto de Interesse',
      type: 'drop_down',
      type_config: {
        options: [
          { name: '📕 Manual dos Pontos Gatilhos', color: '#e50000' },
          { name: '📗 Protocolos de Atendimento', color: '#4CAF50' },
          { name: '📘 A Fórmula do Sucesso', color: '#4194f6' },
          { name: '📙 Método Agenda Mágica', color: '#ff7800' },
          { name: '📒 Manual Pós Operatório', color: '#f9d900' },
          { name: '🎓 Método Cura Pelas Mãos', color: '#7C4DFF' },
          { name: '💎 Mentoria MAV', color: '#00BCD4' },
          { name: '❓ Não definido', color: '#808080' }
        ]
      }
    },
    {
      name: 'WhatsApp',
      type: 'phone'
    },
    {
      name: 'Valor',
      type: 'currency',
      type_config: {
        precision: 2,
        currency_type: 'BRL'
      }
    },
    {
      name: 'Último Contato',
      type: 'date'
    },
    {
      name: 'Próximo Follow-up',
      type: 'date'
    }
  ]
};

// ============================================
// FUNÇÕES DE SETUP
// ============================================

async function getTeams() {
  console.log('\n📋 Buscando workspaces...');
  const result = await clickupRequest('GET', '/team');
  return result.teams;
}

async function getSpaces(teamId) {
  console.log(`\n📋 Buscando spaces do workspace ${teamId}...`);
  const result = await clickupRequest('GET', `/team/${teamId}/space`);
  return result.spaces;
}

async function createSpace(teamId, spaceData) {
  console.log(`\n🏗️ Criando Space "${spaceData.name}"...`);
  const result = await clickupRequest('POST', `/team/${teamId}/space`, {
    name: spaceData.name,
    multiple_assignees: true,
    features: spaceData.features
  });
  console.log(`   ✅ Space criado! ID: ${result.id}`);
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
  console.log(`\n📋 Criando List "${listData.name}"...`);

  const result = await clickupRequest('POST', `/folder/${folderId}/list`, {
    name: listData.name
  });

  console.log(`   ✅ List criada! ID: ${result.id}`);

  // Aguardar antes de configurar statuses
  await sleep(500);

  // Configurar statuses
  if (listData.statuses && listData.statuses.length > 0) {
    await updateListStatuses(result.id, listData.statuses);
  }

  return result;
}

async function updateListStatuses(listId, statuses) {
  console.log(`   📊 Configurando ${statuses.length} statuses...`);

  // A API do ClickUp requer que os statuses sejam atualizados de forma específica
  // Vamos usar o endpoint de update list

  const statusesPayload = statuses.map((s, index) => ({
    status: s.name,
    color: s.color,
    orderindex: index
  }));

  try {
    await clickupRequest('PUT', `/list/${listId}`, {
      statuses: statusesPayload
    });
    console.log(`   ✅ Statuses configurados!`);
  } catch (error) {
    console.log(`   ⚠️ Não foi possível configurar statuses via API (limitação do plano)`);
    console.log(`   📝 Configure manualmente: ${statuses.map(s => s.name).join(' → ')}`);
  }

  await sleep(300);
}

async function createCustomField(listId, fieldData) {
  console.log(`   🏷️ Criando campo "${fieldData.name}"...`);

  try {
    const payload = {
      name: fieldData.name,
      type: fieldData.type
    };

    if (fieldData.type_config) {
      payload.type_config = fieldData.type_config;
    }

    const result = await clickupRequest('POST', `/list/${listId}/field`, payload);
    console.log(`   ✅ Campo criado!`);
    return result;
  } catch (error) {
    if (error.status === 400 && error.error?.err?.includes('already exists')) {
      console.log(`   ⚠️ Campo "${fieldData.name}" já existe`);
    } else {
      console.log(`   ❌ Erro ao criar campo: ${JSON.stringify(error)}`);
    }
  }

  await sleep(300);
}

// ============================================
// EXECUÇÃO PRINCIPAL
// ============================================

async function main() {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 SETUP CRM CLICKUP - NATÁLIA TANAKA');
    console.log('='.repeat(60));

    // 1. Verificar workspace
    const teams = await getTeams();
    const team = teams.find(t => t.id === WORKSPACE_ID) || teams[0];
    console.log(`\n✅ Workspace encontrado: ${team.name} (ID: ${team.id})`);

    // 2. Verificar se Space COMERCIAL já existe
    const existingSpaces = await getSpaces(team.id);
    let comercialSpace = existingSpaces.find(s => s.name === 'COMERCIAL' || s.name.includes('COMERCIAL'));

    if (comercialSpace) {
      console.log(`\n⚠️ Space COMERCIAL já existe! ID: ${comercialSpace.id}`);
      console.log('   Pulando criação do Space...');
    } else {
      // 3. Criar Space COMERCIAL
      comercialSpace = await createSpace(team.id, CRM_CONFIG.space);
    }

    await sleep(1000);

    // 4. Criar Folders e Lists
    const createdResources = {
      space: comercialSpace,
      folders: [],
      lists: []
    };

    for (const folderConfig of CRM_CONFIG.folders) {
      console.log('\n' + '-'.repeat(40));

      // Criar Folder
      const folder = await createFolder(comercialSpace.id, folderConfig.name);
      createdResources.folders.push(folder);

      await sleep(500);

      // Criar Lists dentro do Folder
      for (const listConfig of folderConfig.lists) {
        const list = await createList(folder.id, listConfig);
        createdResources.lists.push(list);
        await sleep(500);
      }
    }

    // 5. Criar Custom Fields na primeira List (serão herdados pelo Space)
    // Nota: Custom Fields no nível de Space requerem plano Business+
    // Vamos criar na List principal como alternativa

    console.log('\n' + '-'.repeat(40));
    console.log('\n🏷️ Criando Custom Fields...');

    const mainList = createdResources.lists[0]; // Leads (Geral)

    for (const fieldConfig of CRM_CONFIG.customFields) {
      await createCustomField(mainList.id, fieldConfig);
    }

    // 6. Resumo final
    console.log('\n' + '='.repeat(60));
    console.log('✅ SETUP CONCLUÍDO!');
    console.log('='.repeat(60));

    console.log('\n📊 Recursos criados:');
    console.log(`   • Space: ${comercialSpace.name} (ID: ${comercialSpace.id})`);
    console.log(`   • Folders: ${createdResources.folders.length}`);
    console.log(`   • Lists: ${createdResources.lists.length}`);

    console.log('\n📋 Lists criadas:');
    createdResources.lists.forEach(list => {
      console.log(`   • ${list.name} (ID: ${list.id})`);
    });

    console.log('\n🔗 Acesse o ClickUp para:');
    console.log('   1. Verificar e ajustar os statuses de cada List');
    console.log('   2. Adicionar Custom Fields específicos por List');
    console.log('   3. Criar Views e Automações');
    console.log('   4. Configurar permissões do time');

    // Salvar IDs para uso futuro
    const outputPath = '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.aios-core/squads/project-management-clickup/data/crm-clickup-ids.json';
    const fs = require('fs');
    fs.writeFileSync(outputPath, JSON.stringify(createdResources, null, 2));
    console.log(`\n💾 IDs salvos em: ${outputPath}`);

  } catch (error) {
    console.error('\n❌ Erro durante o setup:', error);
    process.exit(1);
  }
}

// Executar
main();
