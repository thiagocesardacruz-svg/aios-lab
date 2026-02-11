/**
 * Mission Control - Notification Router
 *
 * Módulo helper para roteamento inteligente de notificações baseado em squad.
 * Usado em todos os workflows n8n do Mission Control.
 *
 * @module notification-router
 */

// Mapeamento Squad Slug → WhatsApp Group ID
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
  'devops': process.env.MISSION_CONTROL_WHATSAPP_DEVOPS,
};

// Squad Name Display
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
  'devops': 'DevOps',
};

// Canais fixos
const CENTRAL_GROUP = process.env.MISSION_CONTROL_WHATSAPP_CENTRAL;
const RAFAEL_TELEGRAM = process.env.MISSION_CONTROL_TELEGRAM_CHAT_ID;

/**
 * Extrai o squad de uma task do ClickUp
 * @param {Object} task - Task do ClickUp
 * @returns {string|null} Squad slug ou null
 */
function extractSquad(task) {
  if (!task.custom_fields) return null;

  const squadField = task.custom_fields.find(f =>
    f.name.toLowerCase() === 'squad'
  );

  return squadField?.value || null;
}

/**
 * Roteia notificação baseado no tipo de evento e squad
 * @param {Object} task - Task do ClickUp
 * @param {string} eventType - Tipo do evento (new_task, status_changed, blocked_alert, daily_digest)
 * @param {Object} options - Opções adicionais (oldStatus, newStatus, etc.)
 * @returns {Array} Lista de destinatários {type, id, message}
 */
function routeNotification(task, eventType, options = {}) {
  const squad = extractSquad(task);
  const destinations = [];

  switch (eventType) {
    case 'new_task':
      // 1. Notificar squad específico ou Central
      if (squad && SQUAD_GROUPS[squad]) {
        destinations.push({
          type: 'whatsapp',
          id: SQUAD_GROUPS[squad],
          squadName: SQUAD_NAMES[squad] || squad,
        });
      } else {
        destinations.push({
          type: 'whatsapp',
          id: CENTRAL_GROUP,
          squadName: 'Central (Geral)',
        });
      }

      // 2. Sempre notificar Rafael via Telegram
      destinations.push({
        type: 'telegram',
        id: RAFAEL_TELEGRAM,
      });
      break;

    case 'status_changed':
      // 1. Notificar squad específico
      if (squad && SQUAD_GROUPS[squad]) {
        destinations.push({
          type: 'whatsapp',
          id: SQUAD_GROUPS[squad],
          squadName: SQUAD_NAMES[squad] || squad,
        });
      }

      // 2. Se moveu para "Done" → notificar Central também
      if (options.newStatus?.toLowerCase() === 'done' || options.newStatus?.toLowerCase() === 'closed') {
        destinations.push({
          type: 'whatsapp',
          id: CENTRAL_GROUP,
          squadName: 'Central',
        });
      }

      // 3. Sempre notificar Rafael via Telegram
      destinations.push({
        type: 'telegram',
        id: RAFAEL_TELEGRAM,
      });
      break;

    case 'blocked_alert':
      // 1. Notificar squad específico
      if (squad && SQUAD_GROUPS[squad]) {
        destinations.push({
          type: 'whatsapp',
          id: SQUAD_GROUPS[squad],
          squadName: SQUAD_NAMES[squad] || squad,
        });
      }

      // 2. Bloqueio crítico → sempre notificar Central
      destinations.push({
        type: 'whatsapp',
        id: CENTRAL_GROUP,
        squadName: 'Central',
      });

      // 3. Sempre notificar Rafael via Telegram
      destinations.push({
        type: 'telegram',
        id: RAFAEL_TELEGRAM,
      });
      break;

    case 'daily_digest':
      // Handled differently - see generateDigestRouting()
      break;

    default:
      console.warn(`Unknown event type: ${eventType}`);
  }

  // Filtrar destinatários sem ID configurado
  return destinations.filter(d => d.id);
}

/**
 * Gera roteamento para daily digest (lógica especial)
 * @param {Object} tasksBySquad - Tasks agrupadas por squad
 * @returns {Array} Lista de destinatários com mensagens específicas
 */
function generateDigestRouting(tasksBySquad) {
  const destinations = [];

  // 1. Resumo para Central (visão geral)
  destinations.push({
    type: 'whatsapp',
    id: CENTRAL_GROUP,
    squadName: 'Central',
    messageType: 'global_digest',
    data: tasksBySquad,
  });

  // 2. Resumo específico para cada squad
  Object.keys(tasksBySquad).forEach(squadSlug => {
    if (SQUAD_GROUPS[squadSlug]) {
      destinations.push({
        type: 'whatsapp',
        id: SQUAD_GROUPS[squadSlug],
        squadName: SQUAD_NAMES[squadSlug] || squadSlug,
        messageType: 'squad_digest',
        data: {
          squad: squadSlug,
          tasks: tasksBySquad[squadSlug],
        },
      });
    }
  });

  // 3. Rafael recebe resumo completo via Telegram
  destinations.push({
    type: 'telegram',
    id: RAFAEL_TELEGRAM,
    messageType: 'admin_digest',
    data: tasksBySquad,
  });

  return destinations.filter(d => d.id);
}

/**
 * Formata mensagem de notificação baseado no tipo
 * @param {string} eventType - Tipo do evento
 * @param {Object} task - Task do ClickUp
 * @param {Object} options - Opções adicionais
 * @returns {string} Mensagem formatada
 */
function formatMessage(eventType, task, options = {}) {
  const squad = extractSquad(task);
  const squadName = squad ? (SQUAD_NAMES[squad] || squad) : 'Geral';
  const taskUrl = task.url || `https://app.clickup.com/t/${task.id}`;

  switch (eventType) {
    case 'new_task':
      return `🆕 *Nova demanda criada*

📋 ${task.name}
👥 Squad: ${squadName}
👤 Solicitado por: ${task.creator?.username || 'Desconhecido'}
⚡ Prioridade: ${task.priority?.priority || 'Normal'}

📎 ${taskUrl}`;

    case 'status_changed':
      return `📊 *Status alterado*

📋 ${task.name}
👥 Squad: ${squadName}
📈 ${options.oldStatus || '?'} → ${options.newStatus || '?'}
👤 Assignee: ${task.assignees?.[0]?.username || 'Não atribuído'}

📎 ${taskUrl}`;

    case 'blocked_alert':
      const blockedDuration = options.blockedDuration || 'desconhecido';
      return `⚠️ *BLOQUEIO CRÍTICO*

📋 ${task.name}
👥 Squad: ${squadName}
⏱️ Bloqueada há: ${blockedDuration}
👤 Assignee: ${task.assignees?.[0]?.username || 'Não atribuído'}
💬 Motivo: ${task.status?.status || 'Blocked'}

📎 ${taskUrl}`;

    default:
      return `📬 Notificação: ${task.name}\n\n📎 ${taskUrl}`;
  }
}

/**
 * Formata mensagem de daily digest (global - Central)
 * @param {Object} tasksBySquad - Tasks agrupadas por squad
 * @returns {string} Mensagem formatada
 */
function formatGlobalDigest(tasksBySquad) {
  let message = '📊 *Resumo Diário - Mission Control*\n\n';

  // Estatísticas gerais
  const allTasks = Object.values(tasksBySquad).flat();
  const inboxCount = allTasks.filter(t => t.list?.name === 'Inbox').length;
  const approvalCount = allTasks.filter(t => t.status?.status === 'awaiting approval').length;
  const blockedCount = allTasks.filter(t => t.status?.status === 'blocked').length;
  const doneToday = allTasks.filter(t => {
    const updated = new Date(t.date_updated);
    const today = new Date();
    return t.status?.status === 'done' && updated.toDateString() === today.toDateString();
  }).length;

  message += `📥 Inbox: ${inboxCount} tasks\n`;
  message += `⏳ Aguardando aprovação: ${approvalCount}\n`;
  message += `🚧 Bloqueadas: ${blockedCount}\n`;
  message += `✅ Concluídas hoje: ${doneToday}\n\n`;

  // Por squad
  message += '*Por Squad:*\n';
  Object.entries(tasksBySquad)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10)
    .forEach(([squad, tasks]) => {
      const squadName = SQUAD_NAMES[squad] || squad;
      message += `• ${squadName}: ${tasks.length} tasks\n`;
    });

  return message;
}

/**
 * Formata mensagem de daily digest (específica do squad)
 * @param {string} squadSlug - Slug do squad
 * @param {Array} tasks - Tasks do squad
 * @returns {string} Mensagem formatada
 */
function formatSquadDigest(squadSlug, tasks) {
  const squadName = SQUAD_NAMES[squadSlug] || squadSlug;
  let message = `📊 *Resumo Diário - ${squadName}*\n\n`;

  const inboxCount = tasks.filter(t => t.list?.name === 'Inbox').length;
  const approvalCount = tasks.filter(t => t.status?.status === 'awaiting approval').length;
  const blockedCount = tasks.filter(t => t.status?.status === 'blocked').length;
  const doneToday = tasks.filter(t => {
    const updated = new Date(t.date_updated);
    const today = new Date();
    return t.status?.status === 'done' && updated.toDateString() === today.toDateString();
  }).length;

  message += `📥 No Inbox: ${inboxCount}\n`;
  message += `⏳ Aguardando aprovação: ${approvalCount}\n`;
  message += `🚧 Bloqueadas: ${blockedCount}\n`;
  message += `✅ Concluídas hoje: ${doneToday}\n\n`;

  // Top 3 prioridades
  const topPriorities = tasks
    .filter(t => t.status?.status !== 'done')
    .sort((a, b) => (b.priority?.orderindex || 0) - (a.priority?.orderindex || 0))
    .slice(0, 3);

  if (topPriorities.length > 0) {
    message += '*Top 3 prioridades:*\n';
    topPriorities.forEach((task, i) => {
      message += `${i + 1}. ${task.name}\n`;
    });
  }

  return message;
}

module.exports = {
  routeNotification,
  generateDigestRouting,
  formatMessage,
  formatGlobalDigest,
  formatSquadDigest,
  extractSquad,
  SQUAD_GROUPS,
  SQUAD_NAMES,
  CENTRAL_GROUP,
  RAFAEL_TELEGRAM,
};
