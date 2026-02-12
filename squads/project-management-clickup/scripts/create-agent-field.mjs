#!/usr/bin/env node
/**
 * Create Agent (Full) field in ClickUp
 */

const CLICKUP_API = 'https://api.clickup.com/api/v2';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';
const AI_OPS_SPACE_ID = '901510017091';

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

async function createAgentField() {
  const options = AGENTS.map((agent, index) => ({
    name: agent.name,
    color: agent.color,
    orderindex: index
  }));

  const fieldData = {
    name: 'Agent (Full)',
    type: 'drop_down',
    type_config: { options }
  };

  console.log('Creating Agent (Full) field with', options.length, 'options...');

  const response = await fetch(`${CLICKUP_API}/space/${AI_OPS_SPACE_ID}/field`, {
    method: 'POST',
    headers: {
      'Authorization': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(fieldData)
  });

  const text = await response.text();

  if (!response.ok) {
    console.error('Error:', response.status, text);
    process.exit(1);
  }

  const result = JSON.parse(text);
  console.log('✅ Created! Field ID:', result.id);
  console.log('\nOptions created:');

  result.type_config?.options?.forEach(opt => {
    console.log(`  ${opt.name}: ${opt.id}`);
  });

  return result;
}

createAgentField().catch(console.error);
