import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = 'C:/Users/thiag/workspace/aios-lab';
const dir = join(ROOT, 'squads');
const allAgents = [];

const dirs = readdirSync(dir, { withFileTypes: true });
for (const d of dirs) {
  if (!d.isDirectory() || d.name.startsWith('_')) continue;
  const yp = join(dir, d.name, 'squad.yaml');
  if (!existsSync(yp)) continue;
  const c = readFileSync(yp, 'utf-8');
  const leadMatch = c.match(/lead:\n\s+agent:\s*"?([^"\n]*)"?/);
  const lead = leadMatch ? leadMatch[1].trim() : null;
  const agentMatches = c.matchAll(/^\s{2}-\s+id:\s*"?([^"\n]*)"?\s*\n((?:\s{4}\w+:.*\n)*)/gm);
  for (const m of agentMatches) {
    const id = m[1].trim();
    const block = m[0];
    const nameMatch = block.match(/name:\s*"?([^"\n]*)"?/);
    const name = nameMatch ? nameMatch[1].trim() : '';
    const roleMatch = block.match(/role:\s*"?([^"\n]*)"?/);
    const role = roleMatch ? roleMatch[1].trim() : '';
    allAgents.push({ id, name, role, squad: d.name, isLead: lead === id });
  }
}

// Fetch current ClickUp options
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';
const r = await fetch(`https://api.clickup.com/api/v2/team/90152366829/field`, {
  headers: { 'Authorization': API_KEY }
});
const data = await r.json();
const field = data.fields.find(f => f.id === '743649c2-7132-4e65-9370-a161e7719949');
const clickupOptions = field?.type_config?.options || [];

// Core agents (not squad leads, but appear in ClickUp dropdown)
const CORE_AGENTS = [
  'aios-master', 'architect', 'dev', 'devops', 'pm', 'po', 'sm',
  'qa', 'analyst', 'data-engineer', 'ux-design-expert', 'squad-creator', 'clawdbot'
];

// Target dropdown names (no agent names, no emojis)
const TARGET_OPTIONS = [
  // Core
  'AIOS Master', 'Architect', 'Dev', 'DevOps', 'PM', 'PO', 'SM',
  'QA', 'Analyst', 'Data Engineer', 'UX Design Expert', 'Squad Creator', 'Clawdbot',
  // Squad Leads
  'Tech Lead', 'Automation Lead', 'ClickUp Lead', 'Design Lead', 'Design System Lead',
  'Marketing Lead', 'GHL Lead', 'Sales Pages Lead', 'Copywriting Lead',
  'Hotel Marketing Lead', 'Hormozi Lead', 'Research Lead', 'Finance Lead',
  'Growth Lead', 'Customer Lead', 'Sales Lead', 'Translation Lead',
];

const leads = allAgents.filter(a => a.isLead).sort((a, b) => a.squad.localeCompare(b.squad));
const agents = allAgents.filter(a => !a.isLead).sort((a, b) => a.squad.localeCompare(b.squad));

console.log('=== DROPDOWN ALVO (Leads + Core) ===');
console.log('');
console.log('--- Core Agents ---');
console.log('');
for (const c of CORE_AGENTS) {
  const a = allAgents.find(x => x.id === c);
  const squad = a ? a.squad : 'ops';
  const existing = clickupOptions.find(o => {
    const clean = o.name.replace(/^⭐\s*/, '').replace(/\s*\(.*\)$/, '').trim();
    return clean === TARGET_OPTIONS.find(t => t.toLowerCase().replace(/\s+/g, '-') === c) ||
           o.name.toLowerCase().includes(c.replace(/-/g, ' '));
  });
  const status = existing ? 'OK' : 'ADD';
  const rename = existing && existing.name !== TARGET_OPTIONS.find(t =>
    t.toLowerCase().replace(/\s+/g, '-') === c) ? ` (rename from "${existing.name}")` : '';
  console.log(`  [${status}] ${c.padEnd(20)} → ClickUp: "${TARGET_OPTIONS.find(t => t.toLowerCase().replace(/\s+/g, '-') === c) || c}"${rename}`);
}

console.log('');
console.log('--- Squad Leads ---');
console.log('');
for (const a of leads) {
  const targetName = a.role || a.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const existing = clickupOptions.find(o => {
    const clean = o.name.replace(/^⭐\s*/, '').replace(/\s*\(.*\)$/, '').trim();
    return clean.toLowerCase() === targetName.toLowerCase();
  });
  const status = existing ? 'OK' : 'ADD';
  console.log(`  [${status}] @${a.id.padEnd(25)} → ClickUp: "${targetName}" | squad: ${a.squad}`);
}

console.log('');
console.log(`TOTAL ALVO: ${TARGET_OPTIONS.length} opcoes (${CORE_AGENTS.length} core + ${leads.length} leads)`);
console.log(`TOTAL ATUAL: ${clickupOptions.length} opcoes`);

// Show what to DELETE
const currentNames = clickupOptions.map(o => o.name.replace(/^⭐\s*/, '').replace(/\s*\(.*\)$/, '').trim());
const toDelete = clickupOptions.filter(o => {
  const clean = o.name.replace(/^⭐\s*/, '').replace(/\s*\(.*\)$/, '').trim();
  return !TARGET_OPTIONS.includes(clean);
});

if (toDelete.length) {
  console.log('');
  console.log(`=== DELETAR DO CLICKUP (${toDelete.length}) ===`);
  console.log('');
  for (const d of toDelete) {
    console.log(`  ✗ "${d.name}"`);
  }
}

// Show what to RENAME
const toRename = clickupOptions.filter(o => {
  const clean = o.name.replace(/^⭐\s*/, '').replace(/\s*\(.*\)$/, '').trim();
  return TARGET_OPTIONS.includes(clean) && o.name !== clean;
});

if (toRename.length) {
  console.log('');
  console.log(`=== RENOMEAR NO CLICKUP (${toRename.length}) ===`);
  console.log('');
  for (const r of toRename) {
    const clean = r.name.replace(/^⭐\s*/, '').replace(/\s*\(.*\)$/, '').trim();
    console.log(`  "${r.name}" → "${clean}"`);
  }
}

// Show what to ADD
const toAdd = TARGET_OPTIONS.filter(t => {
  return !clickupOptions.some(o => {
    const clean = o.name.replace(/^⭐\s*/, '').replace(/\s*\(.*\)$/, '').trim();
    return clean === t;
  });
});

if (toAdd.length) {
  console.log('');
  console.log(`=== ADICIONAR NO CLICKUP (${toAdd.length}) ===`);
  console.log('');
  for (const a of toAdd) {
    console.log(`  + "${a}"`);
  }
}
