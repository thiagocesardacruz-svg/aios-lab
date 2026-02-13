#!/usr/bin/env node
/**
 * Create/Update Command Center Doc in ClickUp
 *
 * Creates a ClickUp Doc with 9 pages of formatted tables
 * serving as the visual Command Center for AIOS.
 *
 * Usage:
 *   node create-command-center-doc.mjs             # Create new doc
 *   node create-command-center-doc.mjs --update     # Update existing pages
 */

import { readFileSync, existsSync, readdirSync, writeFileSync } from 'fs';
import { dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../../..');
const WORKSPACE_IDS_FILE = join(__dirname, '../../project-management-clickup/data/clickup-workspace-ids.json');

const API_V3 = 'https://api.clickup.com/api/v3';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';
const TEAM_ID = '90152366829';
const UPDATE_MODE = process.argv.includes('--update');

async function api3(endpoint, method = 'GET', body = null) {
  const opts = { method, headers: { 'Authorization': API_KEY, 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(`${API_V3}${endpoint}`, opts);
  const text = await r.text();
  if (!r.ok) throw new Error(`API ${method} ${endpoint}: ${r.status} - ${text}`);
  return text ? JSON.parse(text) : {};
}

async function wait(ms = 500) { await new Promise(r => setTimeout(r, ms)); }

// Escape pipes in table cells
function esc(t) { return (t || '').replace(/\|/g, '/').replace(/\n/g, ' '); }

// ============================================================
// DATA READERS
// ============================================================

function readSquads() {
  const dir = join(ROOT, 'squads');
  const squads = [];
  for (const d of readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory() && !d.name.startsWith('_'))) {
    const yp = join(dir, d.name, 'squad.yaml');
    if (!existsSync(yp)) continue;
    const c = readFileSync(yp, 'utf-8');
    squads.push({
      id: d.name,
      name: c.match(/^name:\s*"?([^"\n]*)"?/m)?.[1]?.trim() || d.name,
      desc: c.match(/^description:\s*"?([^"\n]*)"?/m)?.[1]?.trim() || '',
      domain: c.match(/domain:\s*"?([^"\n]*)"?/m)?.[1]?.trim() || '-',
      version: c.match(/^version:\s*"?([^"\n]*)"?/m)?.[1]?.trim() || '1.0',
      lead: c.match(/lead:\n\s+agent:\s*"?([^"\n]*)"?/)?.[1]?.trim() || '-',
      leadName: c.match(/lead:[\s\S]*?name:\s*"?([^"\n]*)"?/)?.[1]?.trim() || '',
      agents: (c.match(/^\s{2}-\s+id:/gm) || []).length
    });
  }
  return squads.sort((a, b) => a.domain.localeCompare(b.domain));
}

function readAgents() {
  const dir = join(ROOT, 'squads');
  const agents = [];
  for (const d of readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory() && !d.name.startsWith('_'))) {
    const yp = join(dir, d.name, 'squad.yaml');
    if (!existsSync(yp)) continue;
    const c = readFileSync(yp, 'utf-8');
    const lead = c.match(/lead:\n\s+agent:\s*"?([^"\n]*)"?/)?.[1]?.trim();
    for (const m of c.matchAll(/^\s{2}-\s+id:\s*"?([^"\n]*)"?\s*\n((?:\s{4}\w+:.*\n)*)/gm)) {
      agents.push({
        id: m[1], name: m[0].match(/name:\s*"?([^"\n]*)"?/)?.[1]?.trim() || m[1],
        role: m[0].match(/role:\s*"?([^"\n]*)"?/)?.[1]?.trim() || '',
        squad: d.name, isLead: lead === m[1]
      });
    }
  }
  return agents.sort((a, b) => a.squad.localeCompare(b.squad));
}

function readCSV() {
  const p = join(ROOT, 'docs/aios-skills-commands-map.csv');
  if (!existsSync(p)) return { skills: [], commands: [] };
  const lines = readFileSync(p, 'utf-8').split('\n').slice(1);
  const items = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const f = []; let cur = '', inQ = false;
    for (const ch of line) { if (ch === '"') { inQ = !inQ; } else if (ch === ',' && !inQ) { f.push(cur.trim()); cur = ''; } else { cur += ch; } }
    f.push(cur.trim());
    if (f.length >= 7) items.push(f);
  }
  return { skills: items.filter(i => i[0] === 'SKILL'), commands: items.filter(i => i[0] === 'COMMAND') };
}

function readWorkflows() {
  const wfs = [];
  const dir = join(ROOT, 'squads');
  for (const d of readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory() && !d.name.startsWith('_'))) {
    const wDir = join(dir, d.name, 'workflows');
    if (!existsSync(wDir)) continue;
    try {
      for (const f of readdirSync(wDir).filter(f => f.endsWith('.yaml') || f.endsWith('.md'))) {
        const c = readFileSync(join(wDir, f), 'utf-8');
        const nm = c.match(/name:\s*"?([^"\n]*)"?/) || c.match(/^#\s+(.+)/m);
        wfs.push({
          id: basename(f, f.endsWith('.yaml') ? '.yaml' : '.md'), name: nm?.[1]?.trim() || basename(f),
          squad: d.name, auto: c.includes('n8n') ? 'n8n' : c.includes('clawdbot') ? 'Clawdbot' : 'Manual'
        });
      }
    } catch {}
  }
  return wfs.sort((a, b) => a.squad.localeCompare(b.squad));
}

// ============================================================
// STACK DATA
// ============================================================

const STACK = [
  { n: 'Claude Code', t: 'API', c: 'Core', cost: 468, role: 'Motor de execucao principal do AIOS', resp: '@aios-master', crit: true, risk: 'Critical', conn: 'ClickUp, GoHighLevel' },
  { n: 'ClickUp', t: 'SaaS', c: 'Core', cost: 0, role: 'Command Center, Task Management, Budget', resp: '@clickup-architect', crit: true, risk: 'Critical', conn: 'Claude Code, n8n, Slack, Clawdbot' },
  { n: 'n8n', t: 'Self-hosted', c: 'Core', cost: 0, role: 'Automacao e orquestracao de workflows', resp: '@automation-engineer', crit: true, risk: 'High', conn: 'ClickUp, GoHighLevel, Slack' },
  { n: 'Clawdbot', t: 'Self-hosted', c: 'Core', cost: 15, role: 'Extensao operacional 24/7 via Slack', resp: '@clawdbot', crit: true, risk: 'High', conn: 'Slack, ClickUp, n8n' },
  { n: 'GoHighLevel', t: 'SaaS', c: 'Core', cost: 97, role: 'CRM, Marketing Automation, Funnels', resp: '@ghl-specialist', crit: true, risk: 'High', conn: 'Claude Code, n8n' },
  { n: 'Slack', t: 'SaaS', c: 'Core', cost: 0, role: 'Comunicacao e interface do Clawdbot', resp: '@ops-manager', crit: true, risk: 'High', conn: 'Clawdbot, ClickUp, n8n' },
  { n: 'Notion', t: 'SaaS', c: 'Supporting', cost: 0, role: 'Documentacao (legado)', resp: '@pm', crit: false, risk: 'Low', conn: '-' },
  { n: 'Google Workspace', t: 'SaaS', c: 'Supporting', cost: 6, role: 'Email, Drive, Calendar', resp: '@ops-manager', crit: false, risk: 'Medium', conn: '-' },
  { n: 'OpenAI API', t: 'API', c: 'Supporting', cost: 20, role: 'GPT para tasks especificas', resp: '@ai-ops', crit: false, risk: 'Low', conn: 'n8n' },
  { n: 'Gemini API', t: 'API', c: 'Experimental', cost: 5, role: 'Long context, processamento alternativo', resp: '@ai-ops', crit: false, risk: 'Low', conn: '-' },
  { n: 'Gamma AI', t: 'SaaS', c: 'Supporting', cost: 0, role: 'Apresentacoes e decks', resp: '@marketing-lead', crit: false, risk: 'Low', conn: '-' },
  { n: 'Manus', t: 'SaaS', c: 'Experimental', cost: 0, role: 'Agent autonomo para tasks web', resp: '@ai-ops', crit: false, risk: 'Low', conn: '-' },
  { n: 'Ollama', t: 'Local', c: 'Core', cost: 0, role: 'LLM local zero-cost (Llama 3.2)', resp: '@dev', crit: false, risk: 'Low', conn: '-' },
  { n: 'whisper.cpp', t: 'Local', c: 'Core', cost: 0, role: 'Transcricao de audio zero-cost', resp: '@dev', crit: false, risk: 'Low', conn: '-' },
  { n: 'DuckDB', t: 'Local', c: 'Supporting', cost: 0, role: 'Analytics OLAP local', resp: '@data-engineer', crit: false, risk: 'Low', conn: '-' },
];

// ============================================================
// PAGE CONTENT GENERATORS (with improved formatting)
// ============================================================

function pageOverview(squads, agents, workflows, skills) {
  const today = new Date().toISOString().split('T')[0];
  const totalCost = STACK.reduce((s, t) => s + t.cost, 0);
  const domains = [...new Set(squads.map(s => s.domain))].sort();

  return `# AIOS Command Center

> Central de consulta do sistema AIOS Lab. Atualizado automaticamente a partir do repositorio Git.
> Ultima sincronizacao: **${today}**

---

## Painel de Numeros

| | Metrica | Quantidade |
| --- | --- | --- |
| :busts_in_silhouette: | **Squads** | ${squads.length} |
| :robot_face: | **Agents** | ${agents.length} |
| :gear: | **Workflows** | ${workflows.length} |
| :zap: | **Skills** | ${skills.length} |
| :hammer_and_wrench: | **Ferramentas** | ${STACK.length} |
| :moneybag: | **Custo Mensal** | EUR ${totalCost} |

---

## Dominios Ativos

${domains.map(d => {
  const ds = squads.filter(s => s.domain === d);
  const da = ds.reduce((s, sq) => s + sq.agents, 0);
  return `- **${d}** — ${ds.length} squad${ds.length > 1 ? 's' : ''}, ${da} agents`;
}).join('\n')}

---

## Arquitetura de Dados

| Camada | O que contem | Onde vive | Editavel? |
| --- | --- | --- | --- |
| :file_folder: **Definicoes** | Squads, agents, skills, workflows | Git Repo | Sim (codigo) |
| :bar_chart: **Estado Operacional** | Tasks, status, budget, custos | ClickUp | Sim (UI/API) |
| :repeat: **Automacao** | Webhooks, schedules, triggers | n8n + Clawdbot | Sim (n8n UI) |
| :book: **Command Center** | Este documento | ClickUp Doc | Auto-sync |

---

## Como Atualizar Este Documento

\`\`\`bash
node squads/ops/scripts/create-command-center-doc.mjs --update
\`\`\`

---

## Indice de Paginas

1. **Overview** — Esta pagina
2. **Organograma** — Hierarquia completa: Director > Board > AIOS Master > Squads
3. **Squads** — ${squads.length} squads com dominio, lead, agents
4. **Agents** — ${agents.length} agents com squad, role, tipo
5. **Tools** — ${STACK.length} ferramentas com tipo e funcionalidade
6. **Skills Library** — ${skills.length} skills com triggers e auto-invoke
7. **Command Library** — 55+ comandos por agente e tipo
8. **Workflow Library** — ${workflows.length} workflows por squad
9. **Session Log** — Briefing, atividades recentes e ultimo digest`;
}

function pageOrganogram(squads) {
  const domains = {};
  for (const s of squads) { if (!domains[s.domain]) domains[s.domain] = []; domains[s.domain].push(s); }

  let tree = '';
  for (const [domain, ds] of Object.entries(domains)) {
    tree += `    +-- ${domain.toUpperCase()}\n`;
    for (const s of ds) tree += `    |   +-- ${s.id} (Lead: @${s.lead}, ${s.agents} agents)\n`;
    tree += `    |\n`;
  }

  return `# Organograma AIOS

> Mapa organizacional completo do sistema.

---

## Hierarquia

\`\`\`
:crown: DIRECTOR (Thiago)
|
+-- :crystal_ball: BOARD (8 Mind Clones)
|   Consultivo - NAO executa
|   @elon-musk / @bill-gates / @alex-hormozi / @dan-kennedy
|   @peter-thiel / @charlie-munger / @ray-dalio / @steve-jobs
|
+-- :trophy: AIOS MASTER (Orion)
|   Orquestracao Global
|
${tree}\`\`\`

---

## Squad Leads

| Squad | Dominio | Lead | Nome | Agents |
| --- | --- | --- | --- | --- |
${squads.map(s => `| **${esc(s.id)}** | ${esc(s.domain)} | @${esc(s.lead)} | ${esc(s.leadName)} | ${s.agents} |`).join('\n')}

---

## Resumo por Dominio

| Dominio | Squads | Total Agents |
| --- | --- | --- |
${Object.entries(domains).map(([d, ds]) => `| **${esc(d)}** | ${ds.map(s => s.id).join(', ')} | ${ds.reduce((s, sq) => s + sq.agents, 0)} |`).join('\n')}`;
}

function pageSquads(squads) {
  return `# Squads

> ${squads.length} squads ativos. Fonte: \`squads/*/squad.yaml\`

---

## Todos os Squads

| Squad | Dominio | Descricao | Lead | Agents | Versao |
| --- | --- | --- | --- | --- | --- |
${squads.map(s => {
  const d = s.desc.length > 55 ? s.desc.substring(0, 52) + '...' : s.desc;
  return `| **${esc(s.id)}** | ${esc(s.domain)} | ${esc(d)} | @${esc(s.lead)} | ${s.agents} | ${esc(s.version)} |`;
}).join('\n')}

---

## Por Dominio

${[...new Set(squads.map(s => s.domain))].sort().map(domain => {
  const ds = squads.filter(s => s.domain === domain);
  return `### ${domain}\n\n${ds.map(s => `- **${s.id}** — @${s.lead} (${s.agents} agents) — ${s.desc.substring(0, 60)}`).join('\n')}`;
}).join('\n\n')}`;
}

function pageAgents(agents) {
  const bySquad = {};
  for (const a of agents) { if (!bySquad[a.squad]) bySquad[a.squad] = []; bySquad[a.squad].push(a); }

  let content = `# Agents

> ${agents.length} agents em ${Object.keys(bySquad).length} squads. Fonte: \`squads/*/squad.yaml\`

---

## Resumo por Squad

| Squad | Total | Lead |
| --- | --- | --- |
${Object.entries(bySquad).sort().map(([sq, as]) => {
  const lead = as.find(a => a.isLead);
  return `| **${esc(sq)}** | ${as.length} | ${lead ? '@' + esc(lead.id) : '-'} |`;
}).join('\n')}

---

## Todos os Agents

`;

  for (const [squad, as] of Object.entries(bySquad).sort()) {
    content += `### ${squad} (${as.length})\n\n`;
    content += `| Agent | Nome | Role | Lead |\n| --- | --- | --- | --- |\n`;
    for (const a of as) {
      const r = a.role.length > 45 ? a.role.substring(0, 42) + '...' : a.role;
      content += `| @${esc(a.id)} | ${esc(a.name)} | ${esc(r)} | ${a.isLead ? ':star:' : '-'} |\n`;
    }
    content += '\n';
  }

  return content;
}

function pageStack() {
  const core = STACK.filter(t => t.c === 'Core');
  const support = STACK.filter(t => t.c === 'Supporting');
  const experimental = STACK.filter(t => t.c === 'Experimental');

  function toolTable(tools) {
    return `| Ferramenta | Tipo | Funcionalidade | Responsavel |\n| --- | --- | --- | --- |\n` +
      tools.map(t => `| **${esc(t.n)}** | ${esc(t.t)} | ${esc(t.role)} | ${esc(t.resp)} |`).join('\n');
  }

  return `# Tools

> ${STACK.length} ferramentas no stack AIOS.

---

## Resumo

| Classificacao | Qtd |
| --- | --- |
| :red_circle: **Core** | ${core.length} |
| :large_blue_circle: **Supporting** | ${support.length} |
| :white_circle: **Experimental** | ${experimental.length} |
| **TOTAL** | **${STACK.length}** |

---

## :red_circle: Core (${core.length})

${toolTable(core)}

---

## :large_blue_circle: Supporting (${support.length})

${toolTable(support)}

---

## :white_circle: Experimental (${experimental.length})

${toolTable(experimental)}

---

## Conexoes entre Ferramentas

| Ferramenta | Conecta com |
| --- | --- |
${STACK.filter(t => t.conn !== '-').map(t => `| **${esc(t.n)}** | ${esc(t.conn)} |`).join('\n')}

---

## Dependencias Criticas

| Ferramenta | Se cair... |
| --- | --- |
${STACK.filter(t => t.crit).map(t => `| **${esc(t.n)}** | :warning: ${esc(t.risk)} — ${esc(t.role)} |`).join('\n')}`;
}

function pageSkills(skills) {
  return `# Skills Library

> ${skills.length} skills do Claude Code. Auto-invoke: agents detectam patterns e ativam automaticamente.

---

## Todos os Skills

| Skill | Tier | Owner | Auto-Invoke | Prioridade | Descricao |
| --- | --- | --- | --- | --- | --- |
${skills.map(s => {
  const d = s[6].length > 45 ? s[6].substring(0, 42) + '...' : s[6];
  return `| **${esc(s[1])}** | ${esc(s[2])} | ${esc(s[3])} | ${esc(s[4])} | ${esc(s[5])} | ${esc(d)} |`;
}).join('\n')}

---

## Triggers e Uso

| Skill | Keywords que ativam | Como usar |
| --- | --- | --- |
${skills.map(s => `| **${esc(s[1])}** | ${esc(s[7])} | \`${esc(s[8])}\` |`).join('\n')}

---

## Por Prioridade

### Critical
${skills.filter(s => s[5] === 'Critical').map(s => `- **${s[1]}** — ${s[6]}`).join('\n') || '_Nenhum_'}

### High
${skills.filter(s => s[5] === 'High').map(s => `- **${s[1]}** — ${s[6]}`).join('\n') || '_Nenhum_'}

### Medium
${skills.filter(s => s[5] === 'Medium').map(s => `- **${s[1]}** — ${s[6]}`).join('\n') || '_Nenhum_'}`;
}

function pageCommands(commands) {
  const byType = {};
  for (const c of commands) { const t = c[2] || 'Other'; if (!byType[t]) byType[t] = []; byType[t].push(c); }

  let content = `# Command Library

> ${commands.length} comandos disponiveis no AIOS.

---

## Resumo por Tipo

| Tipo | Comandos |
| --- | --- |
${Object.entries(byType).sort().map(([t, cs]) => `| **${esc(t)}** | ${cs.length} |`).join('\n')}

---

`;

  for (const [type, cmds] of Object.entries(byType).sort()) {
    content += `## ${type} (${cmds.length})\n\n`;
    content += `| Comando | Owner | Descricao | Como Usar |\n| --- | --- | --- | --- |\n`;
    for (const c of cmds) {
      const d = c[6].length > 35 ? c[6].substring(0, 32) + '...' : c[6];
      content += `| **${esc(c[1])}** | ${esc(c[3])} | ${esc(d)} | \`${esc(c[8])}\` |\n`;
    }
    content += '\n';
  }

  return content;
}

function pageWorkflows(workflows) {
  const bySquad = {};
  for (const w of workflows) { if (!bySquad[w.squad]) bySquad[w.squad] = []; bySquad[w.squad].push(w); }

  let content = `# Workflow Library

> ${workflows.length} workflows em ${Object.keys(bySquad).length} squads.

---

## Resumo por Squad

| Squad | Workflows | Manual | n8n | Clawdbot |
| --- | --- | --- | --- | --- |
${Object.entries(bySquad).sort().map(([sq, ws]) => {
  return `| **${esc(sq)}** | ${ws.length} | ${ws.filter(w => w.auto === 'Manual').length} | ${ws.filter(w => w.auto === 'n8n').length} | ${ws.filter(w => w.auto === 'Clawdbot').length} |`;
}).join('\n')}

---

`;

  for (const [squad, ws] of Object.entries(bySquad).sort()) {
    content += `## ${squad} (${ws.length})\n\n`;
    content += `| Workflow | Nome | Automacao |\n| --- | --- | --- |\n`;
    for (const w of ws) {
      content += `| ${esc(squad)}/${esc(w.id)} | ${esc(w.name)} | ${esc(w.auto)} |\n`;
    }
    content += '\n';
  }

  return content;
}

function pageSessionLog() {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

  // Read latest briefing
  let briefingContent = '_Nenhum briefing disponível._';
  const briefingPath = join(ROOT, '.aios/briefings/latest.md');
  if (existsSync(briefingPath)) {
    const raw = readFileSync(briefingPath, 'utf-8');
    // Truncate to first 40 lines to keep page manageable
    const lines = raw.split('\n').slice(0, 40);
    briefingContent = lines.join('\n');
    if (raw.split('\n').length > 40) {
      briefingContent += '\n\n_(truncado - ver arquivo completo em .aios/briefings/latest.md)_';
    }
  }

  // Read today's activity log (last 15 entries)
  let activityTable = '| Hora | Tipo | Acao | Arquivos |\n| --- | --- | --- | --- |\n';
  let activityCount = 0;
  const activityPath = join(ROOT, `.aios/logs/activity/${today}.jsonl`);
  if (existsSync(activityPath)) {
    const lines = readFileSync(activityPath, 'utf-8').trim().split('\n').filter(l => l.trim());
    const entries = [];
    for (const line of lines) {
      try { entries.push(JSON.parse(line)); } catch {}
    }
    const recent = entries.slice(-15);
    activityCount = entries.length;
    for (const e of recent) {
      const time = e.timestamp ? new Date(e.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '-';
      const files = (e.files || []).slice(0, 3).join(', ') || '-';
      activityTable += `| ${time} | ${esc(e.type || 'action')} | ${esc((e.action || '').substring(0, 60))} | ${esc(files)} |\n`;
    }
  } else {
    activityTable += `| - | - | _Nenhuma atividade registrada hoje_ | - |\n`;
  }

  // Read latest digest
  let digestContent = '_Nenhum digest disponível._';
  const digestDir = join(ROOT, '.aios/logs/digests');
  if (existsSync(digestDir)) {
    const digestFiles = readdirSync(digestDir).filter(f => f.endsWith('.md')).sort().reverse();
    if (digestFiles.length > 0) {
      const raw = readFileSync(join(digestDir, digestFiles[0]), 'utf-8');
      // Take first 30 lines
      const lines = raw.split('\n').slice(0, 30);
      digestContent = lines.join('\n');
      if (raw.split('\n').length > 30) {
        digestContent += '\n\n_(truncado)_';
      }
    }
  }

  return `# Session Log

> Ultima atualizacao: **${now}**

---

## Ultimo Briefing

${briefingContent}

---

## Atividades Recentes (${activityCount} total hoje)

${activityTable}

---

## Ultimo Digest

${digestContent}

---

## Como Atualizar

\`\`\`bash
node squads/ops/scripts/create-command-center-doc.mjs --update
\`\`\``;
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log('==========================================');
  console.log('  AIOS Command Center Doc');
  console.log('==========================================\n');

  // Read all data
  console.log('  Reading data...');
  const squads = readSquads();
  const agents = readAgents();
  const workflows = readWorkflows();
  const { skills, commands } = readCSV();
  console.log(`    ${squads.length} squads, ${agents.length} agents, ${workflows.length} workflows, ${skills.length} skills, ${commands.length} commands`);

  const wsIds = JSON.parse(readFileSync(WORKSPACE_IDS_FILE, 'utf-8'));
  let docId = wsIds.command_center?.doc_id;

  // Build pages
  const pages = [
    { name: 'Overview', content: pageOverview(squads, agents, workflows, skills) },
    { name: 'Organograma', content: pageOrganogram(squads) },
    { name: 'Squads', content: pageSquads(squads) },
    { name: 'Agents', content: pageAgents(agents) },
    { name: 'Tools', content: pageStack() },
    { name: 'Skills Library', content: pageSkills(skills) },
    { name: 'Command Library', content: pageCommands(commands) },
    { name: 'Workflow Library', content: pageWorkflows(workflows) },
    { name: 'Session Log', content: pageSessionLog() },
  ];

  // Old page names that were renamed (to archive duplicates)
  const DEPRECATED_PAGES = ['Squad Registry', 'Agent Registry', 'Stack Audit', 'Squad'];

  if (UPDATE_MODE && docId) {
    console.log(`\n  Updating doc: ${docId}`);
    const raw = await api3(`/workspaces/${TEAM_ID}/docs/${docId}/pages`);
    const existing = Array.isArray(raw) ? raw : (raw.pages || []);

    // Mark deprecated/duplicate pages (ClickUp API doesn't support DELETE on doc pages)
    const pageNames = pages.map(p => p.name);
    for (const ex of existing) {
      if (ex.name.includes('DEPRECATED')) continue;
      const baseName = ex.name.replace(/^\[DEPRECATED\]\s*/, '');
      if (DEPRECATED_PAGES.includes(baseName) && !pageNames.includes(baseName)) {
        try {
          await api3(`/workspaces/${TEAM_ID}/docs/${docId}/pages/${ex.id}`, 'PUT', {
            name: `[DEPRECATED] ${baseName}`,
            content: '> **DEPRECATED** - Esta pagina foi substituida. Favor deletar manualmente via ClickUp UI.',
            content_format: 'text/md'
          });
          console.log(`  Marked deprecated: ${baseName}`);
          await wait(500);
        } catch (e) { console.log(`  Could not deprecate ${baseName}: ${e.message}`); }
      }
    }

    for (const page of pages) {
      const ex = existing.find(p => p.name === page.name && !p.archived);
      if (ex) {
        await api3(`/workspaces/${TEAM_ID}/docs/${docId}/pages/${ex.id}`, 'PUT', {
          name: page.name, content: page.content, content_format: 'text/md'
        });
        console.log(`  Updated: ${page.name}`);
      } else {
        await api3(`/workspaces/${TEAM_ID}/docs/${docId}/pages`, 'POST', {
          name: page.name, content: page.content, content_format: 'text/md'
        });
        console.log(`  Created: ${page.name}`);
      }
      await wait(500);
    }
  } else {
    // Create new doc
    console.log('\n  Creating new Doc...');
    const doc = await api3(`/workspaces/${TEAM_ID}/docs`, 'POST', { name: 'AIOS Command Center' });
    docId = doc.id;
    console.log(`  Doc ID: ${docId}`);
    await wait();

    // Get auto-created first page and update it
    const raw = await api3(`/workspaces/${TEAM_ID}/docs/${docId}/pages`);
    const firstPageList = Array.isArray(raw) ? raw : (raw.pages || []);
    await wait();

    if (firstPageList[0]) {
      await api3(`/workspaces/${TEAM_ID}/docs/${docId}/pages/${firstPageList[0].id}`, 'PUT', {
        name: pages[0].name, content: pages[0].content, content_format: 'text/md'
      });
      console.log(`  Updated first page: ${pages[0].name}`);
      await wait(500);
    }

    for (let i = 1; i < pages.length; i++) {
      await api3(`/workspaces/${TEAM_ID}/docs/${docId}/pages`, 'POST', {
        name: pages[i].name, content: pages[i].content, content_format: 'text/md'
      });
      console.log(`  Created: ${pages[i].name}`);
      await wait(500);
    }

    // Save to workspace IDs
    wsIds.command_center = {
      type: 'doc', doc_id: docId,
      doc_url: `https://app.clickup.com/${TEAM_ID}/docs/${docId}`,
      created_at: new Date().toISOString().split('T')[0],
      created_by: '@aios-master',
      update_command: 'node squads/ops/scripts/create-command-center-doc.mjs --update'
    };
    wsIds.updated_at = new Date().toISOString().split('T')[0];
    writeFileSync(WORKSPACE_IDS_FILE, JSON.stringify(wsIds, null, 2));
    console.log('  Saved doc ID to workspace IDs');
  }

  const url = `https://app.clickup.com/${TEAM_ID}/docs/${docId}`;
  console.log(`\n==========================================`);
  console.log(`  Doc: ${url}`);
  console.log(`  Pages: ${pages.length}`);
  console.log(`==========================================`);
}

main().catch(err => { console.error(`Error: ${err.message}`); process.exit(1); });
