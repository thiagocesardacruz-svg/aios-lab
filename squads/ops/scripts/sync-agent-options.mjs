#!/usr/bin/env node
/**
 * Sync Agent Options - Fetches current dropdown options from ClickUp
 * and updates clickup-workspace-ids.json with correct UUIDs.
 *
 * Usage:
 *   node squads/ops/scripts/sync-agent-options.mjs          # Show current state
 *   node squads/ops/scripts/sync-agent-options.mjs --sync    # Update JSON file
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WS_IDS_FILE = join(__dirname, '../../project-management-clickup/data/clickup-workspace-ids.json');

const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';
const TEAM_ID = '90152366829';
const FIELD_ID = '743649c2-7132-4e65-9370-a161e7719949';
const SYNC_MODE = process.argv.includes('--sync');

// Map of ClickUp dropdown display name -> workspace-ids.json key
// POLICY: Only Core Agents + Squad Leads in dropdown. No agent names, no emojis.
const OPTION_TO_KEY = {
  // Core Agents
  'AIOS Master': '@aios-master',
  'Architect': '@architect',
  'Dev': '@dev',
  'Dev (Code)': '@dev',
  'DevOps': '@devops',
  'DevOps (Infra)': '@devops',
  'PM': '@pm',
  'Project Manager': '@pm',
  'PO': '@po',
  'Product Owner': '@po',
  'SM': '@sm',
  'Scrum Master': '@sm',
  'QA': '@qa',
  'Quality Assurance': '@qa',
  'Analyst': '@analyst',
  'Data Engineer': '@data-engineer',
  'UX Design Expert': '@ux-design-expert',
  'Squad Creator': '@squad-creator',
  'Clawdbot': '@clawdbot',
  // Squad Leads
  'Tech Lead': '@tech-lead',
  'Automation Lead': '@automation-lead',
  'ClickUp Lead': '@clickup-lead',
  'Design Lead': '@design-lead',
  'Design System Lead': '@design-system-lead',
  'Marketing Lead': '@marketing-lead',
  'GHL Lead': '@ghl-lead',
  'Sales Pages Lead': '@sales-pages-lead',
  'Copywriting Lead': '@copywriting-lead',
  'Hotel Marketing Lead': '@hotel-mkt-lead',
  'Hormozi Lead': '@hormozi-lead',
  'Research Lead': '@research-lead',
  'Finance Lead': '@finance-lead',
  'Growth Lead': '@growth-lead',
  'Customer Lead': '@customer-lead',
  'Sales Lead': '@sales-lead',
  'Translation Lead': '@translation-lead',
};

async function main() {
  console.log('==========================================');
  console.log('  Sync Agent Options from ClickUp');
  console.log('==========================================\n');

  // Fetch current options from ClickUp
  const r = await fetch(`https://api.clickup.com/api/v2/team/${TEAM_ID}/field`, {
    headers: { 'Authorization': API_KEY }
  });
  const data = await r.json();
  const field = data.fields.find(f => f.id === FIELD_ID);

  if (!field) {
    console.error('  Agent field not found!');
    process.exit(1);
  }

  const options = field.type_config.options;
  console.log(`  Found ${options.length} options in ClickUp\n`);

  // Read current workspace IDs
  const wsIds = JSON.parse(readFileSync(WS_IDS_FILE, 'utf-8'));
  const agentOptions = wsIds.agent_options;

  // Build new agent_options from ClickUp
  const newAgentOptions = {};
  const unmapped = [];
  const pending = [];

  for (const opt of options) {
    // Strip star emoji prefix for matching
    const cleanName = opt.name.replace(/^⭐\s*/, '').trim();
    const key = OPTION_TO_KEY[cleanName] || OPTION_TO_KEY[opt.name];

    if (key) {
      newAgentOptions[key] = opt.id;
    } else {
      unmapped.push({ name: opt.name, id: opt.id });
    }
  }

  // Check for PENDING entries in current JSON
  for (const [key, val] of Object.entries(agentOptions)) {
    if (val === 'PENDING_CLICKUP_OPTION') {
      if (!newAgentOptions[key]) {
        pending.push(key);
      }
    }
  }

  // Report
  console.log('  Mapped options:');
  for (const [key, id] of Object.entries(newAgentOptions).sort()) {
    const wasOld = agentOptions[key];
    const status = !wasOld ? ' [NEW]' : wasOld === 'PENDING_CLICKUP_OPTION' ? ' [RESOLVED]' : wasOld !== id ? ' [CHANGED]' : '';
    console.log(`    ${key} -> ${id}${status}`);
  }

  if (unmapped.length) {
    console.log('\n  Unmapped ClickUp options (add to OPTION_TO_KEY):');
    for (const u of unmapped) console.log(`    "${u.name}" -> ${u.id}`);
  }

  if (pending.length) {
    console.log('\n  Still PENDING (need to create in ClickUp UI):');
    for (const p of pending) console.log(`    ${p}`);
    console.log('\n  To add these, go to ClickUp:');
    console.log('    1. Open any task in AI OPS space');
    console.log('    2. Click "Agent (Full)" dropdown');
    console.log('    3. Click "+ Add Option" for each missing lead');
  }

  if (SYNC_MODE) {
    // Merge: keep any existing keys not in ClickUp, update all found ones
    const merged = { ...agentOptions, ...newAgentOptions };
    // Remove PENDING entries that were resolved
    for (const [key, val] of Object.entries(merged)) {
      if (val === 'PENDING_CLICKUP_OPTION' && newAgentOptions[key]) {
        merged[key] = newAgentOptions[key];
      }
    }
    wsIds.agent_options = merged;
    wsIds.updated_at = new Date().toISOString().split('T')[0];
    writeFileSync(WS_IDS_FILE, JSON.stringify(wsIds, null, 2));
    console.log('\n  Updated workspace-ids.json!');
  } else {
    console.log('\n  Run with --sync to update workspace-ids.json');
  }

  console.log('\n==========================================');
}

main().catch(err => { console.error(`Error: ${err.message}`); process.exit(1); });
