#!/usr/bin/env node
/**
 * Deploy GHL-Integrated Marketing & Sales Machine Workflows to n8n
 * Extends the base machines with GoHighLevel CRM integration
 *
 * Usage: node deploy-ghl-machines.mjs [--activate] [--test]
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = resolve(__dirname, '../config/.env');
const configContent = readFileSync(configPath, 'utf8');
const N8N_URL = configContent.match(/N8N_URL=(.*)/)?.[1]?.trim();
const N8N_API_KEY = configContent.match(/N8N_API_KEY=(.*)/)?.[1]?.trim();
const N8N_API = `${N8N_URL}/api/v1`;

// GHL Config
const GHL = JSON.parse(readFileSync(resolve(__dirname, '../../ghl/data/ghl-config.json'), 'utf8'));

// Credential IDs
const CREDS = {
  openAiBearer: { id: 'iEQwK7Eks8bQtAO1', name: 'OpenAI Bearer' },
  ghlBearer: { id: 'IRB8AlwbxduOFkvO', name: 'GHL Bearer' }
};

const ACTIVATE = process.argv.includes('--activate');
const TEST = process.argv.includes('--test');

// ═══════════════════════════════════════════════════════════
// WORKFLOW DEFINITIONS
// ═══════════════════════════════════════════════════════════

const WORKFLOWS = [
  // ─── 1. LEAD QUALIFIER + GHL CRM ─────────────────────
  {
    name: '[AIOS] Lead Qualifier → GHL CRM',
    nodes: [
      {
        parameters: { httpMethod: 'POST', path: 'aios-lead-to-crm', responseMode: 'lastNode', options: {} },
        type: 'n8n-nodes-base.webhook', typeVersion: 2,
        position: [240, 300], id: 'wh1', name: 'Receive Lead', webhookId: 'aios-lead-to-crm'
      },
      // Validate
      {
        parameters: {
          jsCode: `const b = $json.body || $json;\nconst lead = { name: b.name||'', email: b.email||'', company: b.company||'', source: b.source||'webhook', message: b.message||'', phone: b.phone||'' };\nif (!lead.email) throw new Error('Email required');\nreturn [{ json: lead }];`
        },
        type: 'n8n-nodes-base.code', typeVersion: 2,
        position: [440, 300], id: 'v1', name: 'Validate'
      },
      // AI Qualify
      {
        parameters: {
          method: 'POST', url: 'https://api.openai.com/v1/chat/completions',
          authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth',
          sendBody: true, specifyBody: 'json',
          jsonBody: `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are an expert lead qualifier for a tourism/hotel digital marketing agency. Analyze the lead and return JSON: { score: "HOT"|"WARM"|"COLD", confidence: 0-100, reasoning: "brief", next_action: "specific action", priority: 1-5, tags: ["tag1","tag2"] }. Hotels/tourism = higher score. Complete contact = higher score.' }, { role: 'user', content: 'Qualify: ' + JSON.stringify($json) }], temperature: 0.3, max_tokens: 400, response_format: { type: 'json_object' } }) }}`,
          options: {}
        },
        type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2,
        position: [640, 300], id: 'ai1', name: 'AI Qualify',
        credentials: { httpHeaderAuth: CREDS.openAiBearer }
      },
      // Parse AI + Prepare GHL
      {
        parameters: {
          jsCode: `const r = $input.item.json;\nconst content = r.choices?.[0]?.message?.content || '{}';\nlet ai;\ntry { ai = JSON.parse(content); } catch(e) { ai = { score: 'COLD', confidence: 50, reasoning: 'Parse error', next_action: 'Manual review', priority: 3, tags: [] }; }\n\n// Get original lead from Validate node output\nconst lead = $('Validate').item.json;\n\nreturn [{ json: { ...ai, lead, ghl_stage: '${GHL.pipeline.stages.novo_lead}' } }];`
        },
        type: 'n8n-nodes-base.code', typeVersion: 2,
        position: [840, 300], id: 'p1', name: 'Parse & Prepare'
      },
      // Create Contact in GHL
      {
        parameters: {
          method: 'POST', url: 'https://services.leadconnectorhq.com/contacts/',
          authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth',
          sendHeaders: true,
          headerParameters: { parameters: [{ name: 'Version', value: '2021-07-28' }] },
          sendBody: true, specifyBody: 'json',
          jsonBody: `={{ JSON.stringify({ locationId: '${GHL.location_id}', firstName: ($json.lead?.name || '').split(' ')[0] || 'Lead', lastName: ($json.lead?.name || '').split(' ').slice(1).join(' ') || '', email: $json.lead?.email || '', phone: $json.lead?.phone || '', companyName: $json.lead?.company || '', source: $json.lead?.source || 'n8n-webhook', tags: [...($json.tags || []), 'aios-qualified', 'score-' + ($json.score || 'unknown').toLowerCase()] }) }}`,
          options: {}
        },
        type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2,
        position: [1040, 300], id: 'ghl1', name: 'Create GHL Contact',
        credentials: { httpHeaderAuth: CREDS.ghlBearer }
      },
      // Create Opportunity in Pipeline
      {
        parameters: {
          method: 'POST', url: 'https://services.leadconnectorhq.com/opportunities/',
          authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth',
          sendHeaders: true,
          headerParameters: { parameters: [{ name: 'Version', value: '2021-07-28' }] },
          sendBody: true, specifyBody: 'json',
          jsonBody: `={{ JSON.stringify({ locationId: '${GHL.location_id}', pipelineId: '${GHL.pipeline.id}', pipelineStageId: '${GHL.pipeline.stages.novo_lead}', contactId: $json.contact?.id || $json.id || '', name: ($json.contact?.firstName || 'Lead') + ' - ' + ($json.contact?.companyName || 'New'), status: 'open', monetaryValue: $json.score === 'HOT' ? 5000 : $json.score === 'WARM' ? 2000 : 500 }) }}`,
          options: {}
        },
        type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2,
        position: [1240, 300], id: 'ghl2', name: 'Create Opportunity',
        credentials: { httpHeaderAuth: CREDS.ghlBearer }
      },
      // Final Response
      {
        parameters: {
          jsCode: `const opp = $input.item.json;\nreturn [{ json: { success: true, crm: { contact_id: opp.contact?.id || 'created', opportunity_id: opp.id || 'created', pipeline_stage: 'Novo Lead' }, timestamp: new Date().toISOString() } }];`
        },
        type: 'n8n-nodes-base.code', typeVersion: 2,
        position: [1440, 300], id: 'resp1', name: 'Format Response'
      }
    ],
    connections: {
      'Receive Lead': { main: [[{ node: 'Validate', type: 'main', index: 0 }]] },
      'Validate': { main: [[{ node: 'AI Qualify', type: 'main', index: 0 }]] },
      'AI Qualify': { main: [[{ node: 'Parse & Prepare', type: 'main', index: 0 }]] },
      'Parse & Prepare': { main: [[{ node: 'Create GHL Contact', type: 'main', index: 0 }]] },
      'Create GHL Contact': { main: [[{ node: 'Create Opportunity', type: 'main', index: 0 }]] },
      'Create Opportunity': { main: [[{ node: 'Format Response', type: 'main', index: 0 }]] }
    }
  },

  // ─── 2. OUTBOUND SEQUENCE ENGINE ──────────────────────
  {
    name: '[AIOS] Outbound Sequence Engine',
    nodes: [
      {
        parameters: { httpMethod: 'POST', path: 'aios-outbound-sequence', responseMode: 'lastNode', options: {} },
        type: 'n8n-nodes-base.webhook', typeVersion: 2,
        position: [240, 300], id: 'wh2', name: 'Receive Request', webhookId: 'aios-outbound-sequence'
      },
      // Generate sequence with AI
      {
        parameters: {
          method: 'POST', url: 'https://api.openai.com/v1/chat/completions',
          authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth',
          sendBody: true, specifyBody: 'json',
          jsonBody: `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are an outbound sales expert. Create a multi-touch sequence for B2B hotel marketing prospects. Return JSON: { sequence_name, steps: [{ day, channel: "email"|"sms", subject (for email), body, purpose, follow_up_trigger }], total_days, expected_reply_rate }' }, { role: 'user', content: 'Create a ' + (($json.body||$json).num_touches||5) + '-touch sequence for: ' + (($json.body||$json).target_description||'hotel owners') + '. Goal: ' + (($json.body||$json).goal||'book a demo') + '. Tone: ' + (($json.body||$json).tone||'professional') + '. Language: ' + (($json.body||$json).language||'pt-BR') }], temperature: 0.5, max_tokens: 3000, response_format: { type: 'json_object' } }) }}`,
          options: {}
        },
        type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2,
        position: [480, 300], id: 'ai2', name: 'Generate Sequence',
        credentials: { httpHeaderAuth: CREDS.openAiBearer }
      },
      // Parse + enrich with GHL context
      {
        parameters: {
          jsCode: `const r = $input.item.json;\nconst content = r.choices?.[0]?.message?.content || '{}';\nlet seq;\ntry { seq = JSON.parse(content); } catch(e) { seq = { error: 'Parse failed', raw: content }; }\nseq._meta = { model: r.model, tokens: r.usage, timestamp: new Date().toISOString(), ghl_location: '${GHL.location_id}', pipeline_id: '${GHL.pipeline.id}' };\nreturn [{ json: seq }];`
        },
        type: 'n8n-nodes-base.code', typeVersion: 2,
        position: [720, 300], id: 'p2', name: 'Format Output'
      }
    ],
    connections: {
      'Receive Request': { main: [[{ node: 'Generate Sequence', type: 'main', index: 0 }]] },
      'Generate Sequence': { main: [[{ node: 'Format Output', type: 'main', index: 0 }]] }
    }
  },

  // ─── 3. GUEST LIFECYCLE (HOTEL) ───────────────────────
  {
    name: '[AIOS] Hotel Guest Lifecycle',
    nodes: [
      {
        parameters: { httpMethod: 'POST', path: 'aios-guest-lifecycle', responseMode: 'lastNode', options: {} },
        type: 'n8n-nodes-base.webhook', typeVersion: 2,
        position: [240, 300], id: 'wh3', name: 'Receive Guest Event', webhookId: 'aios-guest-lifecycle'
      },
      // Classify lifecycle stage
      {
        parameters: {
          jsCode: `const b = $json.body || $json;\nconst event = b.event_type || 'inquiry'; // inquiry, booking, pre_arrival, check_in, during_stay, check_out, post_stay\nconst stages = {\n  inquiry: { stage: 'novo_lead', actions: ['welcome_email', 'qualify'] },\n  booking: { stage: 'respondeu', actions: ['confirmation_email', 'upsell'] },\n  pre_arrival: { stage: 'reuniao_agendada', actions: ['preparation_email', 'concierge_tips'] },\n  check_in: { stage: 'reuniao_agendada', actions: ['welcome_sms', 'amenity_offer'] },\n  during_stay: { stage: 'follow_up', actions: ['satisfaction_check', 'experience_offer'] },\n  check_out: { stage: 'follow_up', actions: ['thank_you', 'review_request'] },\n  post_stay: { stage: 'vendido', actions: ['loyalty_offer', 'referral_request'] }\n};\nconst config = stages[event] || stages.inquiry;\nreturn [{ json: { ...b, lifecycle_stage: event, config, hotel_name: b.hotel_name || 'Hotel', guest_name: b.guest_name || 'Guest', language: b.language || 'pt-BR' } }];`
        },
        type: 'n8n-nodes-base.code', typeVersion: 2,
        position: [440, 300], id: 'cls', name: 'Classify Stage'
      },
      // AI Generate personalized message
      {
        parameters: {
          method: 'POST', url: 'https://api.openai.com/v1/chat/completions',
          authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth',
          sendBody: true, specifyBody: 'json',
          jsonBody: `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are a luxury hotel guest experience specialist. Generate personalized communications for each guest lifecycle stage. Return JSON: { messages: [{ channel: "email"|"sms"|"whatsapp", subject (if email), body, send_delay_hours, purpose }], internal_actions: ["action1"], upsell_opportunities: ["opp1"] }' }, { role: 'user', content: 'Hotel: ' + $json.hotel_name + '. Guest: ' + $json.guest_name + '. Stage: ' + $json.lifecycle_stage + '. Actions needed: ' + ($json.config?.actions||[]).join(', ') + '. Language: ' + $json.language + '. Context: ' + JSON.stringify($json.context || {}) }], temperature: 0.5, max_tokens: 2000, response_format: { type: 'json_object' } }) }}`,
          options: {}
        },
        type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2,
        position: [680, 300], id: 'ai3', name: 'Generate Messages',
        credentials: { httpHeaderAuth: CREDS.openAiBearer }
      },
      // Parse and format
      {
        parameters: {
          jsCode: `const r = $input.item.json;\nconst content = r.choices?.[0]?.message?.content || '{}';\nlet result;\ntry { result = JSON.parse(content); } catch(e) { result = { error: 'Parse failed' }; }\nresult._meta = { model: r.model, tokens: r.usage, timestamp: new Date().toISOString(), ghl_location: '${GHL.location_id}' };\nreturn [{ json: result }];`
        },
        type: 'n8n-nodes-base.code', typeVersion: 2,
        position: [920, 300], id: 'p3', name: 'Format Output'
      }
    ],
    connections: {
      'Receive Guest Event': { main: [[{ node: 'Classify Stage', type: 'main', index: 0 }]] },
      'Classify Stage': { main: [[{ node: 'Generate Messages', type: 'main', index: 0 }]] },
      'Generate Messages': { main: [[{ node: 'Format Output', type: 'main', index: 0 }]] }
    }
  }
];

// ═══════════════════════════════════════════════════════════
// DEPLOY
// ═══════════════════════════════════════════════════════════

async function api(method, endpoint, body) {
  const opts = {
    method,
    headers: { 'X-N8N-API-KEY': N8N_API_KEY, 'Content-Type': 'application/json' }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${N8N_API}${endpoint}`, opts);
  return res.json();
}

async function deploy() {
  console.log('═══════════════════════════════════════════════');
  console.log('  AIOS GHL-Integrated Machines - Deploy');
  console.log('═══════════════════════════════════════════════\n');
  console.log(`  GHL Location: ${GHL.location_id}`);
  console.log(`  Pipeline: ${GHL.pipeline.name}\n`);

  const deployed = [];

  for (const wf of WORKFLOWS) {
    const payload = {
      name: wf.name,
      nodes: wf.nodes,
      connections: wf.connections,
      settings: { executionOrder: 'v1' }
    };

    const result = await api('POST', '/workflows', payload);
    if (result.id) {
      const whNode = wf.nodes.find(n => n.type === 'n8n-nodes-base.webhook');
      const webhookPath = whNode?.parameters?.path;
      console.log(`  ✅ ${wf.name}`);
      console.log(`     ID: ${result.id}`);
      if (webhookPath) console.log(`     Webhook: ${N8N_URL}/webhook/${webhookPath}`);

      if (ACTIVATE) {
        await api('POST', `/workflows/${result.id}/activate`);
        console.log(`     Status: ACTIVE`);
      }
      deployed.push({ id: result.id, name: wf.name, webhook: webhookPath });
      console.log('');
    } else {
      console.log(`  ❌ ${wf.name}: ${result.message}\n`);
    }
  }

  console.log('═══════════════════════════════════════════════');
  console.log(`  Deployed: ${deployed.length}/${WORKFLOWS.length}`);
  console.log('═══════════════════════════════════════════════\n');

  if (TEST && deployed.length > 0) {
    console.log('🧪 Smoke test: Lead → GHL CRM...\n');
    try {
      const res = await fetch(`${N8N_URL}/webhook/aios-lead-to-crm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Hotel Manager',
          email: `test-${Date.now()}@hotel-test.com`,
          company: 'Hotel Test Cascais',
          source: 'smoke-test',
          message: 'Interested in AI marketing for our 30-room boutique hotel',
          phone: '+351999000111'
        })
      });
      const data = await res.json();
      console.log('  Result:', JSON.stringify(data, null, 2).substring(0, 500));
    } catch (e) {
      console.log('  Error:', e.message);
    }
  }
}

deploy().catch(console.error);
