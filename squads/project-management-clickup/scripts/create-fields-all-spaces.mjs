#!/usr/bin/env node
/**
 * Create Squad and Agent (Full) fields in all ClickUp spaces
 */

const CLICKUP_API = 'https://api.clickup.com/api/v2';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';

const SPACES = [
  { id: '901510017089', name: 'WORK' },
  { id: '901510017090', name: 'PERSONAL' },
  // { id: '901510017091', name: 'AI OPS' }, // Already has fields
  { id: '901510017092', name: 'RESOURCES' }
];

const SQUADS = [
  { name: 'Ops (Orquestração)', color: '#6B7280' },
  { name: 'Tech (Infraestrutura)', color: '#3B82F6' },
  { name: 'QA (Qualidade)', color: '#10B981' },
  { name: 'Design (Criativo)', color: '#EC4899' },
  { name: 'Design System (UI/Tokens)', color: '#8B5CF6' },
  { name: 'Marketing (Go-to-Market)', color: '#F59E0B' },
  { name: 'GHL (GoHighLevel)', color: '#EF4444' },
  { name: 'Finance (Financeiro)', color: '#059669' },
  { name: 'Growth (Growth Hacking)', color: '#7C3AED' },
  { name: 'Customer (Customer Success)', color: '#0EA5E9' },
  { name: 'Sales (Vendas)', color: '#DC2626' },
  { name: 'Sales Pages (Landing Pages)', color: '#F97316' },
  { name: 'Copywriting (Copy)', color: '#84CC16' },
  { name: 'Deep Research (Pesquisa)', color: '#14B8A6' },
  { name: 'PM ClickUp (Project Management)', color: '#6366F1' },
  { name: 'Board (Advisors)', color: '#78716C' },
  { name: 'Hotel MKT (Hotel Marketing)', color: '#0891B2' },
  { name: 'Hormozi (Frameworks)', color: '#BE185D' },
  { name: 'Translator (Tradução)', color: '#65A30D' }
];

const AGENTS = [
  { name: '⭐ AIOS Master (Orion)', color: '#6B7280' },
  { name: 'Architect', color: '#3B82F6' },
  { name: 'Dev (Code)', color: '#3B82F6' },
  { name: 'DevOps (Gage)', color: '#3B82F6' },
  { name: 'PM', color: '#6B7280' },
  { name: 'PO', color: '#6B7280' },
  { name: 'SM', color: '#6B7280' },
  { name: '⭐ QA (Shield)', color: '#10B981' },
  { name: 'Analyst', color: '#14B8A6' },
  { name: 'Data Engineer', color: '#3B82F6' },
  { name: 'UX Design Expert', color: '#EC4899' },
  { name: 'Squad Creator', color: '#6B7280' },
  { name: '⭐ Tech Lead (Forge)', color: '#3B82F6' },
  { name: 'Automation Engineer (Circuit)', color: '#3B82F6' },
  { name: 'GHL Specialist (Funnel)', color: '#3B82F6' },
  { name: 'AI Ops (Token)', color: '#3B82F6' },
  { name: 'Application Developer', color: '#3B82F6' },
  { name: 'Ops Manager (Maxwell)', color: '#6B7280' },
  { name: 'Clawdbot', color: '#6B7280' },
  { name: 'Content Reviewer (Echo)', color: '#10B981' },
  { name: 'Process Auditor (Audit)', color: '#10B981' },
  { name: '⭐ Design Lead (Pixel)', color: '#EC4899' },
  { name: 'Performance Designer (Blaze)', color: '#EC4899' },
  { name: 'Motion/Video (Flux)', color: '#EC4899' },
  { name: 'Visual Systems (Grid)', color: '#EC4899' },
  { name: '⭐ Marketing Lead (Aurora)', color: '#F59E0B' },
  { name: 'Offer Engine (Viktor)', color: '#F59E0B' },
  { name: 'Content Strategist (Luna)', color: '#F59E0B' },
  { name: 'Copy Specialist (Marcus)', color: '#F59E0B' },
  { name: 'SEO Specialist (Atlas)', color: '#F59E0B' },
  { name: 'Funnel Architect (Nova)', color: '#F59E0B' },
  { name: '⭐ GHL Automation Specialist', color: '#EF4444' },
  { name: 'GHL Snapshot Architect', color: '#EF4444' },
  { name: 'GHL Funnel Engineer', color: '#EF4444' },
  { name: 'GHL CRM Structuralist', color: '#EF4444' },
  { name: 'GHL Email Strategist', color: '#EF4444' },
  { name: '⭐ PM Orchestrator', color: '#6366F1' },
  { name: 'Process Diagnostician', color: '#6366F1' },
  { name: 'ClickUp Architect', color: '#6366F1' },
  { name: 'Launch Ops Manager', color: '#6366F1' },
  { name: 'Content Ops Manager', color: '#6366F1' },
  { name: 'CRM Builder', color: '#6366F1' },
  { name: 'SaaS Ops Specialist', color: '#6366F1' },
  { name: 'Support Ops Specialist', color: '#6366F1' }
];

async function createField(spaceId, spaceName, fieldName, options) {
  const fieldData = {
    name: fieldName,
    type: 'drop_down',
    type_config: {
      options: options.map((opt, index) => ({
        name: opt.name,
        color: opt.color,
        orderindex: index
      }))
    }
  };

  try {
    const response = await fetch(`${CLICKUP_API}/space/${spaceId}/field`, {
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fieldData)
    });

    const text = await response.text();

    if (!response.ok) {
      if (text.includes('FIELD_214')) {
        console.log(`   ⏭️  ${fieldName} already exists in ${spaceName}`);
        return { skipped: true };
      }
      console.error(`   ❌ Error creating ${fieldName} in ${spaceName}:`, text);
      return { error: true };
    }

    const result = JSON.parse(text);
    console.log(`   ✅ ${fieldName} created in ${spaceName} (ID: ${result.id})`);
    return { success: true, id: result.id };
  } catch (err) {
    console.error(`   ❌ Error:`, err.message);
    return { error: true };
  }
}

async function main() {
  console.log('═'.repeat(60));
  console.log('🔧 Creating Squad and Agent fields in all spaces');
  console.log('═'.repeat(60));

  const results = {};

  for (const space of SPACES) {
    console.log(`\n📁 Space: ${space.name} (${space.id})`);

    results[space.name] = {};

    // Create Squad field
    const squadResult = await createField(space.id, space.name, 'Squad', SQUADS);
    results[space.name].Squad = squadResult;

    // Create Agent (Full) field
    const agentResult = await createField(space.id, space.name, 'Agent (Full)', AGENTS);
    results[space.name]['Agent (Full)'] = agentResult;
  }

  console.log('\n' + '═'.repeat(60));
  console.log('📋 Summary');
  console.log('═'.repeat(60));

  for (const [spaceName, fields] of Object.entries(results)) {
    console.log(`\n${spaceName}:`);
    for (const [fieldName, result] of Object.entries(fields)) {
      if (result.success) {
        console.log(`   ✅ ${fieldName}: ${result.id}`);
      } else if (result.skipped) {
        console.log(`   ⏭️  ${fieldName}: already exists`);
      } else {
        console.log(`   ❌ ${fieldName}: failed`);
      }
    }
  }

  console.log('\n✅ Done! Fields are now available in all spaces.');
}

main().catch(console.error);
