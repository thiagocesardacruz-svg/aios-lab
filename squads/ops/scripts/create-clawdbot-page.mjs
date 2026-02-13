#!/usr/bin/env node
/**
 * Create "Clawdbot - Platform Operations Agent" page in ClickUp Command Center
 * Following the same pattern as create-n8n-machines-page.mjs
 */

const API_V3 = 'https://api.clickup.com/api/v3';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';
const TEAM_ID = '90152366829';
const DOC_ID = '2kyqzwqd-1415';
const today = new Date().toISOString().split('T')[0];

const content = `# Clawdbot - Platform Operations Agent

> **Agente operacional 24/7** que estende o AIOS Lab via Slack.
> Localizacao: Hostinger VPS (srv855345.hstgr.cloud)
> Ultima atualizacao: **${today}**

---

## Perfil

| | |
| --- | --- |
| **Cargo** | Platform Operations Agent |
| **Localizacao** | Hostinger VPS (srv855345.hstgr.cloud) |
| **Interface** | Slack (DM ou mencao) |
| **LLM** | Claude Haiku 4.5 (conversacional) |
| **Runtime** | Python 3 + systemd (24/7) |
| **Custo mensal** | ~EUR 0.10 |

---

## Responsabilidades

- Responder mensagens no Slack com linguagem natural (Haiku LLM)
- Monitorar saude da infraestrutura (n8n, ClickUp, VPS)
- Monitorar budget diario/mensal e ativar SAFE_MODE se necessario
- Executar tasks delegadas via ClickUp (tag \`clawdbot:execute\`)
- Alertar sobre problemas criticos via Slack
- Fornecer status rapido do sistema quando solicitado

---

## Rotinas Programadas (Cron)

| Rotina | Script | Frequencia | Custo |
| --- | --- | --- | --- |
| Health Check | \`health_check.py\` | A cada 30 min | EUR 0 |
| Budget Monitor | \`spend_monitor.py\` | A cada 30 min | EUR 0 |
| ClickUp Poller | \`clickup_poller.py\` | A cada 5 min | EUR 0 |
| Conversacao Slack | \`clawdbot_bot.py\` | 24/7 (systemd) | ~EUR 0.001/msg |

### Health Check (\`health_check.py\`)

Verifica a saude de todos os sistemas criticos.

| | |
| --- | --- |
| **Frequencia** | \`*/30 * * * *\` |
| **Input** | ClickUp API, GHL API, disk usage, cron status, repo state, logs |
| **Output** | JSONL log + Slack alert se unhealthy |
| **Custo** | EUR 0 (scripts locais, sem LLM) |

**O que verifica:**
- ClickUp API acessivel
- GoHighLevel API acessivel
- Espaco em disco do VPS
- Cron jobs rodando
- Repositorio git atualizado
- Logs de erro recentes

---

### Budget Monitor (\`spend_monitor.py\`)

Monitora gastos e ativa SAFE_MODE automaticamente.

| | |
| --- | --- |
| **Frequencia** | \`*/30 * * * *\` |
| **Input** | ClickUp Goals, daily_costs.json |
| **Output** | JSONL log + SAFE_MODE se > EUR 20/dia |
| **Custo** | EUR 0 (scripts locais, sem LLM) |

**Limites monitorados:**
- Alerta: EUR 15/dia
- Hard stop: EUR 20/dia (ativa SAFE_MODE)
- Mensal: EUR 468

---

### ClickUp Poller (\`clickup_poller.py\`)

Verifica tasks delegadas e executa scripts automaticamente.

| | |
| --- | --- |
| **Frequencia** | \`*/5 * * * *\` |
| **Input** | ClickUp tasks com tag \`clawdbot:execute\` |
| **Output** | Executa script delegado, atualiza task status |
| **Custo** | EUR 0 (scripts locais, sem LLM) |

**Como delegar:**
\`\`\`bash
node squads/ops/scripts/delegate-to-clawdbot.mjs "Task name" --script=script_name.py
\`\`\`

---

### Conversacao Slack (\`clawdbot_bot.py\`)

Bot conversacional que responde mensagens no Slack com Haiku LLM.

| | |
| --- | --- |
| **Runtime** | systemd \`clawdbot.service\` (24/7) |
| **Input** | Mensagens Slack (DM ou mencao) |
| **Output** | Respostas em linguagem natural |
| **Custo** | ~EUR 0.001/mensagem (~EUR 0.10/mes) |

**Capacidades conversacionais:**
- Responder perguntas sobre o sistema
- Fornecer status rapido
- Executar comandos simples
- Humor sutil e personalidade

---

## Custos Estimados

| Componente | Custo/mes |
| --- | --- |
| Scripts cron (health, budget, poller) | EUR 0 |
| Conversacao Haiku (~100 msgs/mes) | ~EUR 0.10 |
| VPS (compartilhado com n8n) | EUR 0 (ja pago) |
| **Total** | **~EUR 0.10/mes** |

---

## Limites

- NAO executa tarefas complexas (delegar para Claude Code)
- NAO modifica codigo ou infraestrutura
- NAO toma decisoes estrategicas
- NAO acessa dados sensiveis
- SAFE_MODE bloqueia tudo exceto health check

---

## Como Usar

### Via Slack DM

Envie mensagem direta para o Clawdbot no Slack. Ele responde com linguagem natural.

### Via Mencao

Mencione \`@Clawdbot\` em qualquer canal do Slack.

### Via Delegacao (ClickUp)

\`\`\`bash
# Delegar task automaticamente
node squads/ops/scripts/delegate-to-clawdbot.mjs "Verificar status n8n" --script=health_check.py
\`\`\`

### Comandos Slack

| Comando | Descricao |
| --- | --- |
| \`/status\` | Status geral do sistema |
| \`/budget\` | Budget atual (daily/monthly) |
| \`/health\` | Health check dos sistemas |
| \`/tasks\` | Tasks pendentes |
| \`/safemode on/off\` | Ativar/desativar SAFE_MODE |

---

## Cron Entries (VPS)

\`\`\`cron
*/30 * * * * /root/clawdbot/venv/bin/python3 /root/clawdbot/scripts/health_check.py >> /root/clawdbot/logs/cron.log 2>&1
*/30 * * * * /root/clawdbot/venv/bin/python3 /root/clawdbot/scripts/spend_monitor.py >> /root/clawdbot/logs/cron.log 2>&1
*/5 * * * * /root/clawdbot/venv/bin/python3 /root/clawdbot/scripts/clickup_poller.py >> /root/clawdbot/logs/cron.log 2>&1
\`\`\`

---

## Arquitetura

\`\`\`
VPS Hostinger (srv855345.hstgr.cloud)
    |
    +-- systemd: clawdbot.service (24/7)
    |   +-- clawdbot_bot.py (Slack + Haiku LLM)
    |
    +-- cron jobs
    |   +-- health_check.py (*/30 min)
    |   +-- spend_monitor.py (*/30 min)
    |   +-- clickup_poller.py (*/5 min)
    |
    +-- logs/
        +-- cron.log
        +-- clawdbot.log
\`\`\`
`;

const PAGE_NAME = 'Clawdbot';

async function main() {
  // Check if page already exists
  const listRes = await fetch(`${API_V3}/workspaces/${TEAM_ID}/docs/${DOC_ID}/pages`, {
    headers: { 'Authorization': API_KEY }
  });
  const pages = await listRes.json();
  const list = Array.isArray(pages) ? pages : (pages.pages || []);
  const existing = list.find(p => p.name === PAGE_NAME);

  if (existing) {
    const res = await fetch(`${API_V3}/workspaces/${TEAM_ID}/docs/${DOC_ID}/pages/${existing.id}`, {
      method: 'PUT',
      headers: { 'Authorization': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: PAGE_NAME, content, content_format: 'text/md' })
    });
    console.log(`Updated page: ${existing.id} (status: ${res.status})`);
    console.log(`Page ID for workspace-ids.json: ${existing.id}`);
  } else {
    const res = await fetch(`${API_V3}/workspaces/${TEAM_ID}/docs/${DOC_ID}/pages`, {
      method: 'POST',
      headers: { 'Authorization': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: PAGE_NAME, content, content_format: 'text/md' })
    });
    const result = await res.json();
    console.log(`Created page: ${result.id} (status: ${res.status})`);
    console.log(`Page ID for workspace-ids.json: ${result.id}`);
  }

  console.log('Done!');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
