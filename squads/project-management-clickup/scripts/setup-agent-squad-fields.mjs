#!/usr/bin/env node
/**
 * Setup Agent & Squad Custom Fields - ClickUp
 *
 * Creates/updates custom fields for AIOS agent tracking:
 * 1. "Squad" dropdown - All AIOS squads
 * 2. "Agent" dropdown - All agents with squad mapping
 *
 * Usage:
 *   node setup-agent-squad-fields.mjs              # Dry run (show what would be created)
 *   node setup-agent-squad-fields.mjs --execute    # Actually create the fields
 *   node setup-agent-squad-fields.mjs --update-ids # Update clickup-workspace-ids.json
 *
 * @author AIOS - project-management-clickup squad
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURATION
// ============================================================================

const CLICKUP_API = 'https://api.clickup.com/api/v2';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';
const TEAM_ID = '90152366829';

// Space ID for AI OPS (where we create custom fields)
const AI_OPS_SPACE_ID = '901510017091';

// Existing Agent field ID (to update)
const EXISTING_AGENT_FIELD_ID = '936e8499-160f-4028-a85a-26234954bd1b';

// ============================================================================
// SQUADS DEFINITION
// ============================================================================

const SQUADS = [
  { id: 'ops', name: 'Ops', domain: 'Orquestração', color: '#6B7280' },
  { id: 'tech', name: 'Tech', domain: 'Infraestrutura', color: '#3B82F6' },
  { id: 'qa', name: 'QA', domain: 'Qualidade', color: '#10B981' },
  { id: 'design', name: 'Design', domain: 'Criativo', color: '#EC4899' },
  { id: 'design-system', name: 'Design System', domain: 'UI/Tokens', color: '#8B5CF6' },
  { id: 'marketing', name: 'Marketing', domain: 'Go-to-Market', color: '#F59E0B' },
  { id: 'ghl', name: 'GHL', domain: 'GoHighLevel', color: '#EF4444' },
  { id: 'finance', name: 'Finance', domain: 'Financeiro', color: '#059669' },
  { id: 'growth', name: 'Growth', domain: 'Growth Hacking', color: '#7C3AED' },
  { id: 'customer', name: 'Customer', domain: 'Customer Success', color: '#0EA5E9' },
  { id: 'sales', name: 'Sales', domain: 'Vendas', color: '#DC2626' },
  { id: 'sales-pages', name: 'Sales Pages', domain: 'Landing Pages', color: '#F97316' },
  { id: 'copywriting-masters', name: 'Copywriting', domain: 'Copy', color: '#84CC16' },
  { id: 'deep-research', name: 'Deep Research', domain: 'Pesquisa', color: '#14B8A6' },
  { id: 'project-management-clickup', name: 'PM ClickUp', domain: 'Project Management', color: '#6366F1' },
  { id: 'board', name: 'Board', domain: 'Advisors', color: '#78716C' },
  { id: 'hotel-mkt', name: 'Hotel MKT', domain: 'Hotel Marketing', color: '#0891B2' },
  { id: 'hormozi', name: 'Hormozi', domain: 'Frameworks', color: '#BE185D' },
  { id: 'translator', name: 'Translator', domain: 'Tradução', color: '#65A30D' }
];

// ============================================================================
// AGENTS DEFINITION
// ============================================================================

const AGENTS = [
  // Core Agents (from .claude/commands/AIOS/agents/)
  { id: '@aios-master', name: 'AIOS Master (Orion)', squads: ['ops'], lead: true },
  { id: '@architect', name: 'Architect', squads: ['tech', 'core'], lead: false },
  { id: '@dev', name: 'Dev (Code)', squads: ['tech', 'core'], lead: false },
  { id: '@devops', name: 'DevOps (Gage)', squads: ['tech', 'core'], lead: false },
  { id: '@pm', name: 'PM', squads: ['ops', 'core'], lead: false },
  { id: '@po', name: 'PO', squads: ['core'], lead: false },
  { id: '@sm', name: 'SM', squads: ['core'], lead: false },
  { id: '@qa', name: 'QA (Shield)', squads: ['qa', 'core'], lead: true },
  { id: '@analyst', name: 'Analyst', squads: ['deep-research', 'core'], lead: false },
  { id: '@data-engineer', name: 'Data Engineer', squads: ['tech', 'core'], lead: false },
  { id: '@ux-design-expert', name: 'UX Design Expert', squads: ['design', 'core'], lead: false },
  { id: '@squad-creator', name: 'Squad Creator', squads: ['ops'], lead: false },

  // Tech Squad
  { id: '@tech-lead', name: 'Tech Lead (Forge)', squads: ['tech'], lead: true },
  { id: '@automation-engineer', name: 'Automation Engineer (Circuit)', squads: ['tech', 'project-management-clickup'], lead: false },
  { id: '@ghl-specialist', name: 'GHL Specialist (Funnel)', squads: ['tech'], lead: false },
  { id: '@ai-ops', name: 'AI Ops (Token)', squads: ['tech'], lead: false },
  { id: '@application-developer', name: 'Application Developer (Code)', squads: ['tech'], lead: false },

  // Ops Squad
  { id: '@ops-lead', name: 'Ops Lead (Orion)', squads: ['ops'], lead: true },
  { id: '@ops-manager', name: 'Ops Manager (Maxwell)', squads: ['ops'], lead: false },
  { id: '@clawdbot', name: 'Clawdbot', squads: ['ops'], lead: false },

  // QA Squad
  { id: '@qa-lead', name: 'QA Lead (Shield)', squads: ['qa'], lead: true },
  { id: '@content-reviewer', name: 'Content Reviewer (Echo)', squads: ['qa'], lead: false },
  { id: '@process-auditor', name: 'Process Auditor (Audit)', squads: ['qa'], lead: false },

  // Design Squad
  { id: '@design-lead', name: 'Design Lead (Pixel)', squads: ['design'], lead: true },
  { id: '@performance-designer', name: 'Performance Designer (Blaze)', squads: ['design'], lead: false },
  { id: '@motion-video-specialist', name: 'Motion/Video (Flux)', squads: ['design'], lead: false },
  { id: '@visual-systems-designer', name: 'Visual Systems (Grid)', squads: ['design'], lead: false },

  // Marketing Squad
  { id: '@marketing-lead', name: 'Marketing Lead (Aurora)', squads: ['marketing'], lead: true },
  { id: '@offer-engine', name: 'Offer Engine (Viktor)', squads: ['marketing'], lead: false },
  { id: '@content-strategist', name: 'Content Strategist (Luna)', squads: ['marketing'], lead: false },
  { id: '@copy-specialist', name: 'Copy Specialist (Marcus)', squads: ['marketing'], lead: false },
  { id: '@seo-specialist', name: 'SEO Specialist (Atlas)', squads: ['marketing'], lead: false },
  { id: '@funnel-architect', name: 'Funnel Architect (Nova)', squads: ['marketing'], lead: false },

  // GHL Squad
  { id: '@ghl-automation-specialist', name: 'GHL Automation Specialist', squads: ['ghl'], lead: true },
  { id: '@ghl-snapshot-architect', name: 'GHL Snapshot Architect', squads: ['ghl'], lead: false },
  { id: '@ghl-funnel-engineer', name: 'GHL Funnel Engineer', squads: ['ghl'], lead: false },
  { id: '@ghl-crm-structuralist', name: 'GHL CRM Structuralist', squads: ['ghl'], lead: false },
  { id: '@ghl-email-strategist', name: 'GHL Email Strategist', squads: ['ghl'], lead: false },

  // Project Management ClickUp Squad
  { id: '@pm-orchestrator', name: 'PM Orchestrator', squads: ['project-management-clickup'], lead: true },
  { id: '@process-diagnostician', name: 'Process Diagnostician', squads: ['project-management-clickup'], lead: false },
  { id: '@clickup-architect', name: 'ClickUp Architect', squads: ['project-management-clickup'], lead: false },
  { id: '@launch-operations-manager', name: 'Launch Operations Manager', squads: ['project-management-clickup'], lead: false },
  { id: '@content-operations-manager', name: 'Content Operations Manager', squads: ['project-management-clickup'], lead: false },
  { id: '@crm-builder', name: 'CRM Builder', squads: ['project-management-clickup'], lead: false },
  { id: '@saas-operations-specialist', name: 'SaaS Operations Specialist', squads: ['project-management-clickup'], lead: false },
  { id: '@support-operations-specialist', name: 'Support Operations Specialist', squads: ['project-management-clickup'], lead: false }
];

// ============================================================================
// API HELPERS
// ============================================================================

async function api(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/json'
    }
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${CLICKUP_API}${endpoint}`, options);
  const text = await response.text();

  if (!response.ok) {
    console.error(`API Error ${response.status}:`, text);
    throw new Error(`API Error: ${response.status}`);
  }

  return text ? JSON.parse(text) : {};
}

// ============================================================================
// FIELD CREATION
// ============================================================================

/**
 * Create Squad dropdown field
 */
async function createSquadField(dryRun = true) {
  const options = SQUADS.map((squad, index) => ({
    name: `${squad.name} (${squad.domain})`,
    color: squad.color,
    orderindex: index
  }));

  const fieldData = {
    name: 'Squad',
    type: 'drop_down',
    type_config: {
      options
    }
  };

  console.log('\n📦 Squad Field Configuration:');
  console.log('   Name: Squad');
  console.log('   Type: drop_down');
  console.log('   Options:', SQUADS.length);
  SQUADS.forEach(s => console.log(`     - ${s.name} (${s.domain})`));

  if (dryRun) {
    console.log('\n   ⏸️  Dry run - not creating');
    return { id: 'DRY_RUN_SQUAD_FIELD_ID', options };
  }

  const result = await api(`/space/${AI_OPS_SPACE_ID}/field`, 'POST', fieldData);
  console.log('\n   ✅ Created! Field ID:', result.id);

  return result;
}

/**
 * Get existing Agent field options
 */
async function getExistingAgentField() {
  try {
    const fields = await api(`/space/${AI_OPS_SPACE_ID}/field`);
    const agentField = fields.fields?.find(f => f.id === EXISTING_AGENT_FIELD_ID);
    return agentField;
  } catch (err) {
    console.warn('Could not fetch existing field:', err.message);
    return null;
  }
}

/**
 * Create/Update Agent dropdown field with all agents
 */
async function updateAgentField(dryRun = true) {
  const options = AGENTS.map((agent, index) => ({
    name: agent.lead ? `⭐ ${agent.name}` : agent.name,
    color: getAgentColor(agent.squads[0]),
    orderindex: index
  }));

  console.log('\n👤 Agent Field Configuration:');
  console.log('   Name: Agent');
  console.log('   Type: drop_down');
  console.log('   Options:', AGENTS.length);

  // Group by squad for display
  const bySquad = {};
  AGENTS.forEach(a => {
    const squad = a.squads[0];
    if (!bySquad[squad]) bySquad[squad] = [];
    bySquad[squad].push(a);
  });

  Object.entries(bySquad).forEach(([squad, agents]) => {
    console.log(`\n   ${squad}:`);
    agents.forEach(a => console.log(`     - ${a.id}: ${a.name}${a.lead ? ' ⭐' : ''}`));
  });

  if (dryRun) {
    console.log('\n   ⏸️  Dry run - not updating');
    return { id: EXISTING_AGENT_FIELD_ID, options };
  }

  // Note: ClickUp API doesn't support updating dropdown options directly
  // We need to delete and recreate, or create a new field
  console.log('\n   ⚠️  To update existing field options, you need to:');
  console.log('      1. Delete the old field in ClickUp UI');
  console.log('      2. Run this script with --create-new-agent-field');
  console.log('      Or manually update options in ClickUp UI');

  return { id: EXISTING_AGENT_FIELD_ID, options, needsManualUpdate: true };
}

/**
 * Create a NEW Agent field (if updating existing is not possible)
 */
async function createNewAgentField(dryRun = true) {
  const options = AGENTS.map((agent, index) => ({
    name: agent.lead ? `⭐ ${agent.name}` : agent.name,
    color: getAgentColor(agent.squads[0]),
    orderindex: index
  }));

  const fieldData = {
    name: 'Agent (Full)',
    type: 'drop_down',
    type_config: {
      options
    }
  };

  console.log('\n👤 Creating NEW Agent Field:');
  console.log('   Name: Agent (Full)');
  console.log('   Type: drop_down');
  console.log('   Options:', AGENTS.length);

  if (dryRun) {
    console.log('\n   ⏸️  Dry run - not creating');
    return { id: 'DRY_RUN_AGENT_FIELD_ID', options };
  }

  const result = await api(`/space/${AI_OPS_SPACE_ID}/field`, 'POST', fieldData);
  console.log('\n   ✅ Created! Field ID:', result.id);

  return result;
}

/**
 * Get color for agent based on primary squad
 */
function getAgentColor(squadId) {
  const squad = SQUADS.find(s => s.id === squadId);
  return squad?.color || '#6B7280';
}

// ============================================================================
// OUTPUT GENERATION
// ============================================================================

/**
 * Generate agent mapping for clickup-sync.mjs
 */
function generateAgentMapping(agentFieldResult) {
  console.log('\n📋 Agent Mapping for clickup-sync.mjs:');
  console.log('─'.repeat(60));
  console.log('// Add to IDS.agents in clickup-sync.mjs:');
  console.log('agents: {');

  AGENTS.forEach(agent => {
    // Placeholder ID - will be replaced with actual option IDs after creation
    console.log(`  '${agent.id}': 'OPTION_ID_${agent.id.replace('@', '').toUpperCase()}',`);
  });

  console.log('}');
}

/**
 * Generate YAML mapping for data files
 */
function generateYAMLMapping() {
  const yamlPath = path.join(__dirname, '..', 'data', 'agent-squad-mapping.yaml');

  let yaml = `# Agent-Squad Mapping
# Generated by setup-agent-squad-fields.mjs
# ${new Date().toISOString()}

squads:
`;

  SQUADS.forEach(squad => {
    yaml += `  - id: "${squad.id}"
    name: "${squad.name}"
    domain: "${squad.domain}"
    color: "${squad.color}"
`;
  });

  yaml += `
agents:
`;

  AGENTS.forEach(agent => {
    yaml += `  - id: "${agent.id}"
    name: "${agent.name}"
    squads: [${agent.squads.map(s => `"${s}"`).join(', ')}]
    lead: ${agent.lead}
`;
  });

  return yaml;
}

/**
 * Update clickup-workspace-ids.json with new field IDs
 */
async function updateWorkspaceIds(squadFieldId, agentFieldId) {
  const idsPath = path.join(__dirname, '..', 'data', 'clickup-workspace-ids.json');

  try {
    const content = fs.readFileSync(idsPath, 'utf8');
    const ids = JSON.parse(content);

    // Add new field IDs
    ids.custom_fields = ids.custom_fields || {};
    ids.custom_fields['Squad'] = squadFieldId;

    if (agentFieldId && agentFieldId !== EXISTING_AGENT_FIELD_ID) {
      ids.custom_fields['Agent (Full)'] = agentFieldId;
    }

    // Add agent option IDs (placeholder - need to be filled after creation)
    ids.agent_options = {};
    AGENTS.forEach(agent => {
      ids.agent_options[agent.id] = `PENDING_${agent.id.replace('@', '').toUpperCase()}`;
    });

    // Add squad option IDs (placeholder)
    ids.squad_options = {};
    SQUADS.forEach(squad => {
      ids.squad_options[squad.id] = `PENDING_${squad.id.toUpperCase().replace(/-/g, '_')}`;
    });

    ids.updated_at = new Date().toISOString().split('T')[0];

    fs.writeFileSync(idsPath, JSON.stringify(ids, null, 2));
    console.log('\n✅ Updated clickup-workspace-ids.json');

  } catch (err) {
    console.error('Error updating workspace IDs:', err.message);
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const execute = args.includes('--execute');
  const updateIds = args.includes('--update-ids');
  const createNewAgent = args.includes('--create-new-agent-field');

  console.log('═'.repeat(60));
  console.log('🔧 AIOS ClickUp Custom Fields Setup');
  console.log('═'.repeat(60));
  console.log(`\nMode: ${execute ? '🚀 EXECUTE' : '👀 DRY RUN'}`);
  console.log(`Space ID: ${AI_OPS_SPACE_ID}`);
  console.log(`Squads: ${SQUADS.length}`);
  console.log(`Agents: ${AGENTS.length}`);

  // Create Squad field
  const squadResult = await createSquadField(!execute);

  // Update/Create Agent field
  let agentResult;
  if (createNewAgent) {
    agentResult = await createNewAgentField(!execute);
  } else {
    agentResult = await updateAgentField(!execute);
  }

  // Generate mappings
  generateAgentMapping(agentResult);

  // Save YAML mapping
  if (execute || updateIds) {
    const yamlContent = generateYAMLMapping();
    const yamlPath = path.join(__dirname, '..', 'data', 'agent-squad-mapping.yaml');
    fs.writeFileSync(yamlPath, yamlContent);
    console.log('\n✅ Saved agent-squad-mapping.yaml');
  }

  // Update workspace IDs
  if (execute && squadResult.id !== 'DRY_RUN_SQUAD_FIELD_ID') {
    await updateWorkspaceIds(squadResult.id, agentResult.id);
  }

  console.log('\n' + '═'.repeat(60));
  console.log('📝 Summary');
  console.log('═'.repeat(60));
  console.log(`\nSquads defined: ${SQUADS.length}`);
  console.log(`Agents defined: ${AGENTS.length}`);
  console.log(`Lead agents: ${AGENTS.filter(a => a.lead).length}`);

  if (!execute) {
    console.log('\n⚠️  This was a DRY RUN. No changes were made.');
    console.log('   Run with --execute to create the fields.');
    console.log('\nOptions:');
    console.log('   --execute              Create Squad field in ClickUp');
    console.log('   --create-new-agent-field  Create new Agent field (instead of updating)');
    console.log('   --update-ids           Update clickup-workspace-ids.json');
  }

  // Show next steps
  console.log('\n📋 Next Steps:');
  console.log('   1. Run with --execute to create Squad field');
  console.log('   2. Copy the field ID to clickup-workspace-ids.json');
  console.log('   3. For Agent field: manually update options in ClickUp UI');
  console.log('      OR run with --execute --create-new-agent-field');
  console.log('   4. Update IDS.agents in clickup-sync.mjs with option IDs');
}

main().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
