/**
 * Servidor de Webhooks do CRM ClickUp
 * Squad: Project Management ClickUp
 *
 * Este servidor recebe webhooks do ClickUp e executa ações automatizadas:
 * - Enviar mensagens no WhatsApp (via WAHA ou ManyChat)
 * - Atualizar ActiveCampaign
 * - Criar tasks de follow-up
 * - Notificar no Slack/Discord
 *
 * Para usar:
 * 1. Configure as variáveis de ambiente
 * 2. Execute: node webhook-server.cjs
 * 3. Configure os webhooks no ClickUp apontando para este servidor
 */

const http = require('http');
const https = require('https');
const crypto = require('crypto');
require('dotenv').config({ path: '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.env' });

// ============================================
// CONFIGURAÇÕES
// ============================================

const PORT = process.env.WEBHOOK_PORT || 3456;
const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;

// URLs das integrações (configure no .env)
const WAHA_API_URL = process.env.WAHA_API_URL || 'http://localhost:3000';
const WAHA_SESSION = process.env.WAHA_SESSION || 'default';
const MANYCHAT_API_KEY = process.env.MANYCHAT_API_KEY;
const ACTIVECAMPAIGN_URL = process.env.ACTIVECAMPAIGN_URL;
const ACTIVECAMPAIGN_KEY = process.env.ACTIVECAMPAIGN_KEY;

// IDs das Lists do CRM (carregados do arquivo ou definidos aqui)
const LIST_IDS = {
  LEADS_GERAL: '901325077568',
  LOW_TICKET: '901325077571',
  UPSELL: '901325077575',
  LANCAMENTO: '901325077580',
  HIGH_TICKET: '901325077585',
  CLIENTES: '901325077592',
  VIP: '901325077600',
  RECOMPRA: '901325077604',
  NAO_CONVERTIDOS: '901325077610',
  NURTURE: '901325077615'
};

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function log(message, data = null) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  if (data) console.log(JSON.stringify(data, null, 2));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve(body);
      }
    });
    req.on('error', reject);
  });
}

// Fazer requisição HTTP
function httpRequest(url, method, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const client = urlObj.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
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

// ============================================
// INTEGRAÇÕES
// ============================================

// Enviar mensagem no WhatsApp via WAHA
async function sendWhatsApp(phone, message) {
  if (!WAHA_API_URL) {
    log('⚠️ WAHA não configurado');
    return null;
  }

  // Formatar número (remover caracteres não numéricos, adicionar código do país)
  let formattedPhone = phone.replace(/\D/g, '');
  if (!formattedPhone.startsWith('55')) {
    formattedPhone = '55' + formattedPhone;
  }

  try {
    const result = await httpRequest(
      `${WAHA_API_URL}/api/sendText`,
      'POST',
      {
        session: WAHA_SESSION,
        chatId: `${formattedPhone}@c.us`,
        text: message
      }
    );
    log(`📱 WhatsApp enviado para ${formattedPhone}`);
    return result;
  } catch (error) {
    log(`❌ Erro ao enviar WhatsApp: ${error.message}`);
    return null;
  }
}

// Atualizar contato no ActiveCampaign
async function updateActiveCampaign(email, data) {
  if (!ACTIVECAMPAIGN_URL || !ACTIVECAMPAIGN_KEY) {
    log('⚠️ ActiveCampaign não configurado');
    return null;
  }

  try {
    const result = await httpRequest(
      `${ACTIVECAMPAIGN_URL}/api/3/contacts`,
      'POST',
      { contact: { email, ...data } },
      { 'Api-Token': ACTIVECAMPAIGN_KEY }
    );
    log(`📧 ActiveCampaign atualizado para ${email}`);
    return result;
  } catch (error) {
    log(`❌ Erro ao atualizar ActiveCampaign: ${error.message}`);
    return null;
  }
}

// Adicionar comentário no ClickUp
async function addClickUpComment(taskId, comment) {
  try {
    const result = await httpRequest(
      `https://api.clickup.com/api/v2/task/${taskId}/comment`,
      'POST',
      { comment_text: comment },
      { 'Authorization': CLICKUP_API_TOKEN }
    );
    log(`💬 Comentário adicionado na task ${taskId}`);
    return result;
  } catch (error) {
    log(`❌ Erro ao adicionar comentário: ${error.message}`);
    return null;
  }
}

// Atualizar task no ClickUp
async function updateClickUpTask(taskId, data) {
  try {
    const result = await httpRequest(
      `https://api.clickup.com/api/v2/task/${taskId}`,
      'PUT',
      data,
      { 'Authorization': CLICKUP_API_TOKEN }
    );
    log(`📝 Task ${taskId} atualizada`);
    return result;
  } catch (error) {
    log(`❌ Erro ao atualizar task: ${error.message}`);
    return null;
  }
}

// ============================================
// HANDLERS DE EVENTOS
// ============================================

// Handler: Task criada
async function handleTaskCreated(payload) {
  const task = payload.task || payload;
  const listId = task.list?.id;

  log(`📥 Nova task criada: ${task.name} (List: ${listId})`);

  // Extrair dados customizados
  const customFields = task.custom_fields || [];
  const whatsapp = customFields.find(f => f.name === 'WhatsApp')?.value;
  const origem = customFields.find(f => f.name === 'Origem')?.type_config?.options?.find(
    o => o.orderindex === customFields.find(f => f.name === 'Origem')?.value
  )?.name;

  // Ações baseadas na List
  if (listId === LIST_IDS.HIGH_TICKET) {
    // Nova aplicação para Mentoria MAV
    log('💎 Nova aplicação para Mentoria MAV!');

    if (whatsapp) {
      await sendWhatsApp(whatsapp,
        `Olá! 👋\n\n` +
        `Recebemos sua aplicação para a *Mentoria MAV* da Natália Tanaka!\n\n` +
        `Nossa equipe está analisando seu perfil e em breve entraremos em contato para agendar uma conversa.\n\n` +
        `Enquanto isso, quer saber mais sobre a mentoria? Me conta suas principais dúvidas! 💬`
      );
    }
  } else if (listId === LIST_IDS.LOW_TICKET) {
    // Novo lead no funil perpétuo
    log('🛒 Novo lead no funil perpétuo');
  } else if (listId === LIST_IDS.LANCAMENTO) {
    // Novo lead de lançamento
    log('🚀 Novo lead de lançamento');
  }
}

// Handler: Status alterado
async function handleStatusUpdated(payload) {
  const task = payload.task || payload;
  const historyItems = payload.history_items || [];
  const statusChange = historyItems.find(h => h.field === 'status');

  if (!statusChange) return;

  const oldStatus = statusChange.before?.status;
  const newStatus = statusChange.after?.status;
  const listId = task.list?.id;

  log(`🔄 Status alterado: ${oldStatus} → ${newStatus} (Task: ${task.name})`);

  // Extrair WhatsApp
  const customFields = task.custom_fields || [];
  const whatsapp = customFields.find(f => f.name === 'WhatsApp')?.value;

  // === LOW TICKET ===
  if (listId === LIST_IDS.LOW_TICKET) {

    // Iniciou Checkout
    if (newStatus === '🛒 Iniciou Checkout') {
      log('🛒 Lead iniciou checkout - aguardando para recuperação');
      // A automação de carrinho abandonado é feita no ClickUp com delay
    }

    // Comprou!
    if (newStatus === '✅ Comprou') {
      log('🎉 COMPRA CONFIRMADA no Low Ticket!');

      if (whatsapp) {
        await sendWhatsApp(whatsapp,
          `🎉 *Parabéns pela sua compra!*\n\n` +
          `Seu acesso já está liberado! Acesse a área de membros:\n` +
          `👉 [LINK DA ÁREA DE MEMBROS]\n\n` +
          `Qualquer dúvida, estamos aqui! 💬`
        );
      }
    }

    // Carrinho abandonado (se vier do webhook - normalmente é automação interna)
    if (oldStatus === '🛒 Iniciou Checkout' && newStatus !== '✅ Comprou') {
      log('⚠️ Possível abandono de carrinho');
    }
  }

  // === HIGH TICKET ===
  if (listId === LIST_IDS.HIGH_TICKET) {

    // Qualificado
    if (newStatus === '✅ Qualificado') {
      log('✅ Lead qualificado para Mentoria MAV');

      if (whatsapp) {
        await sendWhatsApp(whatsapp,
          `Olá! 👋\n\n` +
          `*Ótima notícia!* Seu perfil foi aprovado para a Mentoria MAV!\n\n` +
          `Agora precisamos agendar uma conversa para entender melhor seus objetivos e ver se a mentoria é realmente para você.\n\n` +
          `Qual o melhor dia e horário para você esta semana? 📅`
        );
      }
    }

    // Call Agendada
    if (newStatus === '📅 Call Agendada') {
      log('📅 Call agendada');

      if (whatsapp) {
        const dataCall = customFields.find(f => f.name === 'Data da Call')?.value;
        const dataFormatada = dataCall ? new Date(parseInt(dataCall)).toLocaleDateString('pt-BR') : 'em breve';

        await sendWhatsApp(whatsapp,
          `✅ *Call confirmada!*\n\n` +
          `Sua conversa com nosso especialista está agendada para *${dataFormatada}*.\n\n` +
          `📌 Dicas para a call:\n` +
          `• Esteja em um lugar tranquilo\n` +
          `• Tenha suas dúvidas anotadas\n` +
          `• Prepare-se para falar sobre seus objetivos\n\n` +
          `Até lá! 🚀`
        );
      }
    }

    // Fechou!
    if (newStatus === '💰 Fechado') {
      log('🎉🎉🎉 MENTORIA MAV VENDIDA!');

      if (whatsapp) {
        await sendWhatsApp(whatsapp,
          `🎉 *PARABÉNS!* 🎉\n\n` +
          `Bem-vinda à *Mentoria MAV*!\n\n` +
          `Você acaba de dar o passo mais importante da sua carreira como massoterapeuta.\n\n` +
          `Em breve você receberá todas as instruções de acesso e onboarding.\n\n` +
          `A Natália e toda a equipe estão muito felizes em ter você conosco! 💜`
        );
      }

      // Adicionar tag no ActiveCampaign
      const email = task.custom_fields?.find(f => f.name === 'email')?.value;
      if (email) {
        await updateActiveCampaign(email, {
          tags: ['mentoria_mav', 'cliente_vip']
        });
      }
    }

    // Não fechou
    if (newStatus === '❌ Não Fechou') {
      log('❌ Lead não fechou');

      // Não enviar mensagem automática - deixar para o closer fazer follow-up manual
    }
  }

  // === LANÇAMENTO ===
  if (listId === LIST_IDS.LANCAMENTO) {

    // Comprou no lançamento
    if (newStatus === '💰 Comprou') {
      log('🎉 VENDA NO LANÇAMENTO - Método Cura Pelas Mãos!');

      if (whatsapp) {
        await sendWhatsApp(whatsapp,
          `🎉 *PARABÉNS!* Sua inscrição no *Método Cura Pelas Mãos* foi confirmada!\n\n` +
          `Você está prestes a transformar sua carreira como massoterapeuta.\n\n` +
          `📚 Seu acesso será liberado em breve. Fique de olho no email!\n\n` +
          `Bem-vinda à família MCPM! 💜`
        );
      }
    }
  }
}

// Handler: Task atualizada
async function handleTaskUpdated(payload) {
  const task = payload.task || payload;
  log(`📝 Task atualizada: ${task.name}`);

  // Verificar se foi atualizado o campo "Próximo Follow-up"
  const historyItems = payload.history_items || [];
  const followupChange = historyItems.find(h =>
    h.field === 'custom_field' &&
    h.custom_field?.name === 'Próximo Follow-up'
  );

  if (followupChange) {
    log('📅 Data de follow-up atualizada');
    // O lembrete é feito via automação no ClickUp
  }
}

// ============================================
// SERVIDOR HTTP
// ============================================

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }

  // Webhook endpoints
  if (req.method === 'POST') {
    const body = await parseBody(req);

    log(`\n${'='.repeat(50)}`);
    log(`📨 Webhook recebido: ${req.url}`);

    try {
      switch (req.url) {
        case '/webhooks/clickup/task-created':
          await handleTaskCreated(body);
          break;

        case '/webhooks/clickup/task-status-updated':
          await handleStatusUpdated(body);
          break;

        case '/webhooks/clickup/task-updated':
          await handleTaskUpdated(body);
          break;

        case '/webhooks/clickup/task-comment':
          log('💬 Novo comentário (não processado)');
          break;

        default:
          log(`⚠️ Endpoint desconhecido: ${req.url}`);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));

    } catch (error) {
      log(`❌ Erro ao processar webhook: ${error.message}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }

    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

// ============================================
// INICIAR SERVIDOR
// ============================================

server.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 SERVIDOR DE WEBHOOKS CRM CLICKUP');
  console.log('='.repeat(60));
  console.log(`\n📍 Servidor rodando em: http://localhost:${PORT}`);
  console.log('\n📌 Endpoints disponíveis:');
  console.log(`   POST /webhooks/clickup/task-created`);
  console.log(`   POST /webhooks/clickup/task-status-updated`);
  console.log(`   POST /webhooks/clickup/task-updated`);
  console.log(`   POST /webhooks/clickup/task-comment`);
  console.log(`   GET  /health`);
  console.log('\n⚙️ Integrações configuradas:');
  console.log(`   WAHA (WhatsApp): ${WAHA_API_URL ? '✅' : '❌'}`);
  console.log(`   ActiveCampaign: ${ACTIVECAMPAIGN_URL ? '✅' : '❌'}`);
  console.log(`   ClickUp API: ${CLICKUP_API_TOKEN ? '✅' : '❌'}`);
  console.log('\n📝 Para expor publicamente, use ngrok:');
  console.log(`   ngrok http ${PORT}`);
  console.log('\n' + '='.repeat(60));
  console.log('👂 Aguardando webhooks...\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado.');
    process.exit(0);
  });
});
