#!/usr/bin/env node
/**
 * Deploy Wave 2 Machines - Strategic & Squad-requested workflows
 * 10 new machines from inter-squad consultation (Marketing, Hotel, Copywriting, Customer, Hormozi)
 *
 * Usage: node deploy-wave2-machines.mjs [--activate] [--test]
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

const CREDS = {
  openAiBearer: { id: 'iEQwK7Eks8bQtAO1', name: 'OpenAI Bearer' }
};

const ACTIVATE = process.argv.includes('--activate');
const TEST = process.argv.includes('--test');

// ═══════════════════════════════════════════════════════════
// HELPER: Standard node builders
// ═══════════════════════════════════════════════════════════

function webhookNode(id, name, path) {
  return {
    parameters: { httpMethod: 'POST', path, responseMode: 'lastNode', options: {} },
    type: 'n8n-nodes-base.webhook', typeVersion: 2,
    position: [240, 300], id, name, webhookId: path
  };
}

function codeNode(id, name, jsCode, position) {
  return {
    parameters: { jsCode },
    type: 'n8n-nodes-base.code', typeVersion: 2,
    position, id, name
  };
}

function openAiNode(id, name, jsonBodyExpr, position) {
  return {
    parameters: {
      method: 'POST', url: 'https://api.openai.com/v1/chat/completions',
      authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth',
      sendBody: true, specifyBody: 'json',
      jsonBody: jsonBodyExpr,
      options: {}
    },
    type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2,
    position, id, name,
    credentials: { httpHeaderAuth: CREDS.openAiBearer }
  };
}

function parseNode(id, name, position) {
  return codeNode(id, name, `const r = $input.item.json;\nconst content = r.choices?.[0]?.message?.content || '{}';\nlet result;\ntry { result = JSON.parse(content); } catch(e) { result = { error: 'Parse failed', raw: content }; }\nresult._meta = { model: r.model, tokens: r.usage, timestamp: new Date().toISOString() };\nreturn [{ json: result }];`, position);
}

function chain(...nodeNames) {
  const connections = {};
  for (let i = 0; i < nodeNames.length - 1; i++) {
    connections[nodeNames[i]] = { main: [[{ node: nodeNames[i + 1], type: 'main', index: 0 }]] };
  }
  return connections;
}

// ═══════════════════════════════════════════════════════════
// WORKFLOW DEFINITIONS - 10 NEW MACHINES
// ═══════════════════════════════════════════════════════════

const WORKFLOWS = [

  // ─── HZ1. GRAND SLAM OFFER BUILDER (Hormozi) ─────────────
  {
    name: '[AIOS] Grand Slam Offer Builder',
    nodes: [
      webhookNode('wh1', 'Receive Request', 'aios-offer-builder'),
      codeNode('v1', 'Validate Input', `const b = $json.body || $json;\nif (!b.product && !b.service) throw new Error('Send { product/service, market, current_price?, pain_points? }');\nreturn [{ json: { product: b.product || b.service || '', market: b.market || '', current_price: b.current_price || '', pain_points: b.pain_points || [], target_audience: b.target_audience || '', competitors: b.competitors || [], language: b.language || 'pt-BR' } }];`, [440, 300]),
      openAiNode('ai1', 'Build Offer',
        `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are Alex Hormozi, author of $100M Offers. Build a Grand Slam Offer using the Value Equation: Value = (Dream Outcome x Perceived Likelihood) / (Time Delay x Effort & Sacrifice). Return JSON: { value_equation: { dream_outcome: { description: string, score: 1-10 }, perceived_likelihood: { description: string, score: 1-10, proof_elements: [string] }, time_delay: { current: string, with_offer: string, score: 1-10 }, effort_sacrifice: { current: string, with_offer: string, score: 1-10 }, total_value_score: number }, offer_stack: { core_offer: { name: string, description: string, delivery: string }, bonuses: [{ name: string, description: string, real_value: string, perceived_value: string, why_it_works: string }], guarantee: { type: "unconditional"|"conditional"|"anti-guarantee"|"performance", description: string, risk_reversal_level: "low"|"medium"|"high"|"total" }, scarcity: { type: "quantity"|"time"|"both"|"none", description: string }, urgency: { type: "deadline"|"bonus_removal"|"price_increase"|"none", description: string } }, naming: { options: [{ name: string, framework: string, why: string }], recommended: string }, pricing: { strategy: "premium"|"mid"|"value", recommended_price: string, anchor_price: string, price_to_value_ratio: string, payment_options: [string] }, one_liner: string, elevator_pitch: string, objection_handling: [{ objection: string, response: string }] }' }, { role: 'user', content: 'Build Grand Slam Offer for: ' + $json.product + '. Market: ' + ($json.market || 'not specified') + '. Current price: ' + ($json.current_price || 'not set') + '. Pain points: ' + ($json.pain_points.join(', ') || 'analyze from market') + '. Target: ' + ($json.target_audience || 'determine from market') + '. Competitors: ' + ($json.competitors.join(', ') || 'none specified') + '. Language: ' + $json.language }], temperature: 0.5, max_tokens: 4000, response_format: { type: 'json_object' } }) }}`,
        [680, 300]),
      parseNode('p1', 'Format Output', [920, 300])
    ],
    connections: chain('Receive Request', 'Validate Input', 'Build Offer', 'Format Output'),
    testPayload: { product: 'Pacote de Marketing Digital para Hoteis - SEO + Social Media + Reputacao Online', market: 'Hoteis independentes em Portugal, 20-80 quartos', current_price: '1500 EUR/mes', pain_points: ['baixa ocupacao fora de temporada', 'dependencia de OTAs', 'reviews negativos sem resposta', 'zero presenca digital'], target_audience: 'Donos e gestores de hoteis independentes', language: 'pt-BR' }
  },

  // ─── C1. COPY BRIEF GENERATOR (Copywriting) ──────────────
  {
    name: '[AIOS] Copy Brief Generator',
    nodes: [
      webhookNode('wh2', 'Receive Request', 'aios-copy-brief'),
      codeNode('v2', 'Validate Input', `const b = $json.body || $json;\nif (!b.product && !b.service && !b.objective) throw new Error('Send { product/service, audience, objective, channel }');\nreturn [{ json: { product: b.product || b.service || '', audience: b.audience || b.target_audience || '', objective: b.objective || b.goal || '', channel: b.channel || 'all', tone: b.tone || '', brand: b.brand || '', examples: b.examples || [], constraints: b.constraints || '', language: b.language || 'pt-BR' } }];`, [440, 300]),
      openAiNode('ai2', 'Generate Brief',
        `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are Maverick, Copy Chief with 22 master copywriters. Generate a structured creative brief using Eugene Schwartz awareness levels and direct response frameworks. Return JSON: { brief: { project_name: string, objective: string, deliverable_type: "sales_letter"|"email_sequence"|"landing_page"|"vsl"|"ad_copy"|"social"|"blog"|"funnel", deadline_suggestion: string }, audience_analysis: { awareness_level: "unaware"|"problem_aware"|"solution_aware"|"product_aware"|"most_aware", sophistication_level: 1-5, primary_desire: string, primary_fear: string, objections: [string], language_they_use: [string] }, creative_direction: { tone: string, voice: string, angle: string, big_idea: string, hook_suggestions: [string], proof_elements_needed: [string] }, recommended_copywriter: { primary: { name: string, framework: string, why: string }, alternative: { name: string, framework: string, when_to_use: string } }, structure: { sections: [{ name: string, purpose: string, key_elements: [string] }], word_count_estimate: string, cta: string }, references: [{ what: string, why: string }], success_metrics: [string] }' }, { role: 'user', content: 'Create copy brief for: ' + $json.product + '. Audience: ' + $json.audience + '. Objective: ' + $json.objective + '. Channel: ' + $json.channel + '. Tone: ' + ($json.tone || 'determine from audience') + '. Brand: ' + ($json.brand || 'not specified') + '. Constraints: ' + ($json.constraints || 'none') + '. Language: ' + $json.language }], temperature: 0.4, max_tokens: 3000, response_format: { type: 'json_object' } }) }}`,
        [680, 300]),
      parseNode('p2', 'Format Output', [920, 300])
    ],
    connections: chain('Receive Request', 'Validate Input', 'Generate Brief', 'Format Output'),
    testPayload: { product: 'Curso online de Revenue Management para Hoteleiros', audience: 'Gestores de hoteis independentes, 35-55 anos, frustrados com baixa ocupacao', objective: 'Vender curso de 497 EUR via landing page', channel: 'landing_page', tone: 'autoritativo mas empatico', language: 'pt-BR' }
  },

  // ─── C2. HEADLINE VARIANT FACTORY (Copywriting) ──────────
  {
    name: '[AIOS] Headline Variant Factory',
    nodes: [
      webhookNode('wh3', 'Receive Request', 'aios-headline-factory'),
      codeNode('v3', 'Validate Input', `const b = $json.body || $json;\nif (!b.product && !b.topic) throw new Error('Send { product/topic, angle?, num_variants? }');\nreturn [{ json: { product: b.product || b.topic || '', angle: b.angle || '', audience: b.audience || '', benefit: b.benefit || '', num_variants: b.num_variants || 10, formats: b.formats || ['curiosity', 'how-to', 'number', 'question', 'command', 'testimonial'], language: b.language || 'pt-BR' } }];`, [440, 300]),
      openAiNode('ai3', 'Generate Headlines',
        `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are a headline specialist trained by John Caples (35 Headline Formulas), Eugene Schwartz (Breakthrough Advertising), and Joe Sugarman (31 Psychological Triggers). Generate headline variants optimized for conversion. Return JSON: { headlines: [{ text: string, formula: string, trigger: "curiosity"|"fear"|"greed"|"urgency"|"exclusivity"|"social_proof"|"authority"|"novelty", awareness_level: "unaware"|"problem_aware"|"solution_aware"|"product_aware"|"most_aware", best_for: "email_subject"|"ad"|"landing_page"|"blog"|"social"|"vsl", estimated_strength: 1-10, why_it_works: string }], ab_test_pairs: [{ variant_a: string, variant_b: string, hypothesis: string, what_to_measure: string }], power_words_used: [string], subheadline_suggestions: [{ for_headline: string, subheadline: string }] }' }, { role: 'user', content: 'Generate ' + $json.num_variants + ' headline variants. Product/Topic: ' + $json.product + '. Angle: ' + ($json.angle || 'test multiple angles') + '. Audience: ' + ($json.audience || 'determine from product') + '. Key benefit: ' + ($json.benefit || 'determine from product') + '. Formats requested: ' + $json.formats.join(', ') + '. Language: ' + $json.language }], temperature: 0.8, max_tokens: 3000, response_format: { type: 'json_object' } }) }}`,
        [680, 300]),
      parseNode('p3', 'Format Output', [920, 300])
    ],
    connections: chain('Receive Request', 'Validate Input', 'Generate Headlines', 'Format Output'),
    testPayload: { product: 'Software de Gestao Hoteleira com IA', angle: 'economia de tempo', audience: 'Gestores de hoteis sobrecarregados', benefit: 'Automatiza 80% das tarefas repetitivas', num_variants: 10, language: 'pt-BR' }
  },

  // ─── H1. SEASONAL CAMPAIGN GENERATOR (Hotel Mkt) ─────────
  {
    name: '[AIOS] Seasonal Campaign Generator',
    nodes: [
      webhookNode('wh4', 'Receive Request', 'aios-seasonal-campaign'),
      codeNode('v4', 'Validate Input', `const b = $json.body || $json;\nif (!b.hotel_type && !b.business_name) throw new Error('Send { hotel_type/business_name, season, target_audience? }');\nreturn [{ json: { hotel_type: b.hotel_type || '', business_name: b.business_name || '', season: b.season || 'current', month: b.month || new Date().toLocaleString('en', { month: 'long' }), location: b.location || '', target_audience: b.target_audience || '', unique_features: b.unique_features || [], budget_level: b.budget_level || 'medium', language: b.language || 'pt-BR' } }];`, [440, 300]),
      openAiNode('ai4', 'Generate Campaign',
        `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are a hospitality marketing expert specializing in seasonal campaigns for hotels in Portugal and Brazil. Create a complete multi-channel campaign for the given season. Return JSON: { campaign: { name: string, theme: string, duration: string, objective: string }, offer: { headline: string, description: string, package_includes: [string], price_suggestion: string, urgency_element: string, discount_vs_rack: string }, email_sequence: [{ day: number, subject: string, preview: string, body_outline: string, cta: string }], social_media: { instagram: [{ type: "post"|"story"|"reel", caption: string, visual_suggestion: string, hashtags: [string] }], facebook: [{ type: "post"|"ad", text: string, cta: string }] }, google_ads: { headlines: [string], descriptions: [string], keywords: [string] }, landing_page: { headline: string, subheadline: string, sections: [string], cta: string }, sms_templates: [{ occasion: string, text: string }], calendar: [{ week: number, channel: string, action: string }], kpis: [{ metric: string, target: string }] }' }, { role: 'user', content: 'Create seasonal campaign. Hotel: ' + ($json.business_name || $json.hotel_type) + '. Type: ' + $json.hotel_type + '. Season/Month: ' + $json.season + ' / ' + $json.month + '. Location: ' + ($json.location || 'Portugal') + '. Target: ' + ($json.target_audience || 'determine from hotel type') + '. Unique features: ' + ($json.unique_features.join(', ') || 'none specified') + '. Budget: ' + $json.budget_level + '. Language: ' + $json.language }], temperature: 0.6, max_tokens: 4000, response_format: { type: 'json_object' } }) }}`,
        [680, 300]),
      parseNode('p4', 'Format Output', [920, 300])
    ],
    connections: chain('Receive Request', 'Validate Input', 'Generate Campaign', 'Format Output'),
    testPayload: { hotel_type: 'boutique hotel beira-mar', business_name: 'Hotel Cascais Beach', season: 'verao', month: 'Junho', location: 'Cascais, Portugal', target_audience: 'Casais e familias classe AB', unique_features: ['piscina infinity', 'restaurante com estrela Michelin', 'spa com vista mar'], budget_level: 'medium', language: 'pt-BR' }
  },

  // ─── M1. CAMPAIGN PERFORMANCE REPORTER (Marketing) ───────
  {
    name: '[AIOS] Campaign Performance Reporter',
    nodes: [
      webhookNode('wh5', 'Receive Data', 'aios-campaign-report'),
      codeNode('v5', 'Validate Input', `const b = $json.body || $json;\nif (!b.metrics && !b.spend) throw new Error('Send { campaign_name, metrics: { spend, impressions, clicks, conversions, revenue }, period? }');\nconst m = b.metrics || { spend: b.spend, impressions: b.impressions, clicks: b.clicks, conversions: b.conversions, revenue: b.revenue };\nreturn [{ json: { campaign_name: b.campaign_name || 'Campaign', platform: b.platform || 'multi', period: b.period || 'last 30 days', metrics: m, goals: b.goals || {}, industry: b.industry || 'tourism/hospitality', language: b.language || 'pt-BR' } }];`, [440, 300]),
      openAiNode('ai5', 'Analyze Performance',
        `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are a performance marketing analyst specializing in tourism and hospitality. Analyze campaign metrics and generate an executive report. Return JSON: { executive_summary: string, kpis: { ctr: { value: string, benchmark: string, status: "above"|"at"|"below" }, cpc: { value: string, benchmark: string, status: "above"|"at"|"below" }, cpa: { value: string, benchmark: string, status: "above"|"at"|"below" }, roas: { value: string, benchmark: string, status: "above"|"at"|"below" }, conversion_rate: { value: string, benchmark: string, status: "above"|"at"|"below" } }, diagnosis: { strengths: [string], weaknesses: [string], opportunities: [string], threats: [string] }, recommendations: [{ priority: 1-5, action: string, expected_impact: string, effort: "low"|"medium"|"high" }], budget_allocation: { current: string, recommended: string, rationale: string }, next_steps: [{ action: string, deadline: string, owner_suggestion: string }], trend: "improving"|"stable"|"declining", confidence: "low"|"medium"|"high" }' }, { role: 'user', content: 'Analyze campaign: ' + $json.campaign_name + '. Platform: ' + $json.platform + '. Period: ' + $json.period + '. Industry: ' + $json.industry + '. Metrics: ' + JSON.stringify($json.metrics) + '. Goals: ' + JSON.stringify($json.goals) + '. Language: ' + $json.language }], temperature: 0.3, max_tokens: 3000, response_format: { type: 'json_object' } }) }}`,
        [680, 300]),
      parseNode('p5', 'Format Output', [920, 300])
    ],
    connections: chain('Receive Data', 'Validate Input', 'Analyze Performance', 'Format Output'),
    testPayload: { campaign_name: 'Verao 2026 - Google Ads', platform: 'google_ads', period: 'Junho 2026', metrics: { spend: 1500, impressions: 45000, clicks: 2100, conversions: 63, revenue: 12600 }, goals: { target_roas: 5, target_cpa: 30 }, industry: 'hotel boutique', language: 'pt-BR' }
  },

  // ─── HZ2. LEAD MAGNET GENERATOR (Hormozi) ────────────────
  {
    name: '[AIOS] Lead Magnet Generator',
    nodes: [
      webhookNode('wh6', 'Receive Request', 'aios-lead-magnet'),
      codeNode('v6', 'Validate Input', `const b = $json.body || $json;\nif (!b.business && !b.niche) throw new Error('Send { business/niche, audience, problem? }');\nreturn [{ json: { business: b.business || b.niche || '', audience: b.audience || '', problem: b.problem || '', channel: b.channel || 'all', format_preference: b.format || '', language: b.language || 'pt-BR' } }];`, [440, 300]),
      openAiNode('ai6', 'Generate Lead Magnet',
        `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are Alex Hormozi, expert in lead magnets from $100M Leads. A great lead magnet solves a specific problem completely and creates desire for the core offer. Generate lead magnet concepts using the Core Four channels. Return JSON: { lead_magnets: [{ title: string, format: "checklist"|"template"|"calculator"|"mini_course"|"swipe_file"|"cheat_sheet"|"quiz"|"report"|"toolkit"|"video_training", description: string, problem_solved: string, time_to_consume: string, time_to_create: string, core_four_channel: "warm_outreach"|"cold_outreach"|"content"|"paid_ads", delivery_method: string, landing_page_headline: string, opt_in_cta: string, follow_up_sequence: [string], bridges_to_core_offer: string, perceived_value: string, estimated_conversion_rate: string }], recommended: { pick: number, reason: string }, naming_options: [{ name: string, framework: string }], distribution_plan: { warm_outreach: string, cold_outreach: string, content: string, paid_ads: string } }' }, { role: 'user', content: 'Create lead magnet for: ' + $json.business + '. Audience: ' + ($json.audience || 'determine from business') + '. Problem: ' + ($json.problem || 'identify top problem') + '. Preferred channel: ' + $json.channel + '. Format preference: ' + ($json.format_preference || 'any') + '. Language: ' + $json.language }], temperature: 0.6, max_tokens: 3000, response_format: { type: 'json_object' } }) }}`,
        [680, 300]),
      parseNode('p6', 'Format Output', [920, 300])
    ],
    connections: chain('Receive Request', 'Validate Input', 'Generate Lead Magnet', 'Format Output'),
    testPayload: { business: 'Agencia de marketing digital para hoteis', audience: 'Donos de hoteis independentes em Portugal', problem: 'Nao sabem como reduzir dependencia de OTAs e aumentar reservas diretas', language: 'pt-BR' }
  },

  // ─── HZ3. 4-DAY CASH MACHINE (Hormozi) ──────────────────
  {
    name: '[AIOS] 4-Day Cash Machine',
    nodes: [
      webhookNode('wh7', 'Receive Request', 'aios-cash-machine'),
      codeNode('v7', 'Validate Input', `const b = $json.body || $json;\nif (!b.offer) throw new Error('Send { offer, audience, deadline?, discount? }');\nreturn [{ json: { offer: b.offer || '', audience: b.audience || '', deadline: b.deadline || '4 days from now', discount: b.discount || '', regular_price: b.regular_price || '', special_price: b.special_price || '', brand: b.brand || '', language: b.language || 'pt-BR' } }];`, [440, 300]),
      openAiNode('ai7', 'Generate Sequence',
        `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are an expert in Frank Kern 4-Day Cash Machine and Hormozi urgency frameworks. Create a 4-email sequence with escalating urgency that generates immediate revenue. Return JSON: { campaign_name: string, strategy: string, emails: [{ day: 1|2|3|4, subject_line: string, preview_text: string, body: string, ps_line: string, cta: string, urgency_level: "low"|"medium"|"high"|"final", psychological_trigger: string, send_time: string }], sms_companions: [{ day: number, text: string }], landing_page: { headline: string, subheadline: string, countdown: boolean, elements: [string] }, expected_results: { open_rate: string, click_rate: string, conversion_rate: string, revenue_estimate: string }, post_campaign: { for_buyers: string, for_non_buyers: string } }' }, { role: 'user', content: 'Create 4-Day Cash Machine for: ' + $json.offer + '. Audience: ' + ($json.audience || 'existing list/customers') + '. Deadline: ' + $json.deadline + '. Regular price: ' + ($json.regular_price || 'not specified') + '. Special price: ' + ($json.special_price || $json.discount || 'not specified') + '. Brand: ' + ($json.brand || 'not specified') + '. Language: ' + $json.language }], temperature: 0.7, max_tokens: 4000, response_format: { type: 'json_object' } }) }}`,
        [680, 300]),
      parseNode('p7', 'Format Output', [920, 300])
    ],
    connections: chain('Receive Request', 'Validate Input', 'Generate Sequence', 'Format Output'),
    testPayload: { offer: 'Pacote Verao Antecipado - 3 noites com meia pensao', audience: 'Hospedes anteriores do hotel (base de emails)', regular_price: '450 EUR', special_price: '299 EUR', deadline: '4 dias', brand: 'Hotel Cascais Beach', language: 'pt-BR' }
  },

  // ─── CS2. NPS SURVEY AUTOMATOR (Customer) ────────────────
  {
    name: '[AIOS] NPS Survey Automator',
    nodes: [
      webhookNode('wh8', 'Receive Trigger', 'aios-nps-survey'),
      codeNode('v8', 'Validate Input', `const b = $json.body || $json;\nif (!b.customer_name && !b.customer_email) throw new Error('Send { customer_name, customer_email, touchpoint, nps_score? }');\nreturn [{ json: { customer_name: b.customer_name || '', customer_email: b.customer_email || '', touchpoint: b.touchpoint || '30_day', product: b.product || b.service || '', nps_score: b.nps_score || null, feedback_text: b.feedback_text || '', business_name: b.business_name || '', language: b.language || 'pt-BR' } }];`, [440, 300]),
      openAiNode('ai8', 'Process NPS',
        `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are a customer success expert. Handle NPS survey flow: if no score provided, generate the survey email. If score provided, classify and generate appropriate follow-up. Return JSON: { mode: "survey"|"follow_up", survey_email: { subject: string, body: string, nps_question: string, follow_up_question: string } | null, classification: { score: number|null, category: "promoter"|"passive"|"detractor"|null, risk_level: "none"|"low"|"medium"|"high"|null, sentiment: string|null } | null, follow_up: { action: "request_testimonial"|"request_referral"|"schedule_call"|"send_gift"|"escalate"|"nurture", email: { subject: string, body: string }, internal_alert: { priority: "low"|"normal"|"high"|"urgent", message: string, assign_to: "cs_team"|"management"|"sales" } } | null, automation_rules: { if_promoter: [string], if_passive: [string], if_detractor: [string] } }' }, { role: 'user', content: 'Customer: ' + $json.customer_name + ' (' + $json.customer_email + '). Touchpoint: ' + $json.touchpoint + '. Product: ' + ($json.product || 'not specified') + '. NPS Score: ' + ($json.nps_score || 'NOT YET - generate survey') + '. Feedback: ' + ($json.feedback_text || 'none yet') + '. Business: ' + ($json.business_name || 'not specified') + '. Language: ' + $json.language }], temperature: 0.3, max_tokens: 2500, response_format: { type: 'json_object' } }) }}`,
        [680, 300]),
      parseNode('p8', 'Format Output', [920, 300])
    ],
    connections: chain('Receive Trigger', 'Validate Input', 'Process NPS', 'Format Output'),
    testPayload: { customer_name: 'Maria Santos', customer_email: 'maria@hotel-algarve.pt', touchpoint: '30_day', product: 'Pacote Marketing Digital Premium', business_name: 'Travel Tech Digital', language: 'pt-BR' }
  },

  // ─── CS1. CHURN RISK DETECTOR (Customer) ─────────────────
  {
    name: '[AIOS] Churn Risk Detector',
    nodes: [
      webhookNode('wh9', 'Receive Data', 'aios-churn-detector'),
      codeNode('v9', 'Validate Input', `const b = $json.body || $json;\nif (!b.customer_name && !b.customer_id) throw new Error('Send { customer_name/id, usage_data, contract_info? }');\nreturn [{ json: { customer_name: b.customer_name || b.customer_id || '', customer_email: b.customer_email || '', usage_data: b.usage_data || {}, contract_info: b.contract_info || {}, support_tickets: b.support_tickets || [], last_login: b.last_login || '', nps_score: b.nps_score || null, payment_status: b.payment_status || 'current', language: b.language || 'pt-BR' } }];`, [440, 300]),
      openAiNode('ai9', 'Assess Risk',
        `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are a customer success analyst specializing in churn prediction. Analyze customer data and calculate health/risk scores. Return JSON: { health_score: { total: 1-100, breakdown: { usage: { score: 1-100, weight: 30, signals: [string] }, engagement: { score: 1-100, weight: 25, signals: [string] }, satisfaction: { score: 1-100, weight: 25, signals: [string] }, growth: { score: 1-100, weight: 20, signals: [string] } } }, risk_assessment: { churn_risk: "critical"|"high"|"medium"|"low"|"none", churn_probability: string, risk_factors: [{ factor: string, severity: "low"|"medium"|"high"|"critical", evidence: string }], time_to_churn_estimate: string }, intervention: { urgency: "immediate"|"this_week"|"this_month"|"monitor", playbook: string, actions: [{ step: number, action: string, channel: "email"|"call"|"meeting"|"gift"|"discount", owner: "cs_manager"|"account_exec"|"vp_cs", message_template: string, deadline: string }] }, retention_offers: [{ offer: string, cost: string, expected_impact: string, when_to_use: string }], early_warnings: [{ signal: string, threshold: string, current_value: string }] }' }, { role: 'user', content: 'Analyze churn risk for: ' + $json.customer_name + '. Usage: ' + JSON.stringify($json.usage_data) + '. Contract: ' + JSON.stringify($json.contract_info) + '. Support tickets: ' + JSON.stringify($json.support_tickets) + '. Last login: ' + ($json.last_login || 'unknown') + '. NPS: ' + ($json.nps_score || 'not collected') + '. Payment: ' + $json.payment_status + '. Language: ' + $json.language }], temperature: 0.2, max_tokens: 3000, response_format: { type: 'json_object' } }) }}`,
        [680, 300]),
      parseNode('p9', 'Format Output', [920, 300])
    ],
    connections: chain('Receive Data', 'Validate Input', 'Assess Risk', 'Format Output'),
    testPayload: { customer_name: 'Hotel Algarve Premium', customer_email: 'gestao@hotel-algarve.pt', usage_data: { logins_last_30_days: 3, features_used: ['seo_keywords', 'blog_generator'], features_not_used: ['social_factory', 'ad_copy', 'reputation'], last_campaign_created: '45 days ago' }, contract_info: { plan: 'Premium', monthly_value: 1500, months_active: 4, renewal_date: '2026-06-15' }, support_tickets: [{ date: '2026-01-20', issue: 'Reports not loading', status: 'resolved' }, { date: '2026-02-05', issue: 'Need help with social media setup', status: 'open' }], last_login: '2026-02-01', nps_score: 6, language: 'pt-BR' }
  },

  // ─── H2. OTA REVIEW AGGREGATOR (Hotel Mkt) ───────────────
  {
    name: '[AIOS] OTA Review Aggregator',
    nodes: [
      webhookNode('wh10', 'Receive Reviews', 'aios-review-aggregator'),
      codeNode('v10', 'Validate Input', `const b = $json.body || $json;\nconst reviews = b.reviews || [];\nif (!reviews.length) throw new Error('Send { hotel_name, reviews: [{ text, source, rating, date?, author? }] }');\nreturn [{ json: { hotel_name: b.hotel_name || 'Hotel', reviews: reviews.slice(0, 100), period: b.period || 'all', language: b.language || 'pt-BR' } }];`, [440, 300]),
      openAiNode('ai10', 'Aggregate Analysis',
        `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are a hospitality reputation expert. Aggregate reviews from multiple OTA platforms (Booking.com, TripAdvisor, Google, Expedia) into a unified analysis. Return JSON: { hotel_name: string, total_reviews: number, period: string, platform_breakdown: [{ platform: string, count: number, avg_rating: number, trend: "up"|"stable"|"down" }], unified_score: { average: number, weighted_average: number, star_distribution: { five: number, four: number, three: number, two: number, one: number } }, cross_platform_themes: { consistent_praise: [{ theme: string, platforms: [string], frequency: number, sample_quotes: [string] }], consistent_complaints: [{ theme: string, platforms: [string], frequency: number, severity: "low"|"medium"|"high", sample_quotes: [string] }], platform_specific: [{ platform: string, unique_theme: string, sentiment: "positive"|"negative" }] }, competitive_position: { estimated_rank: string, vs_competitors: string }, response_strategy: { urgent: [{ review_summary: string, platform: string, suggested_response: string }], standard: [{ theme: string, template_response: string }] }, action_plan: [{ priority: 1-5, action: string, impact_area: string, platforms_affected: [string] }], monthly_report_summary: string }' }, { role: 'user', content: 'Aggregate reviews for: ' + $json.hotel_name + '. Period: ' + $json.period + '. Reviews: ' + JSON.stringify($json.reviews) + '. Language: ' + $json.language }], temperature: 0.3, max_tokens: 4000, response_format: { type: 'json_object' } }) }}`,
        [680, 300]),
      parseNode('p10', 'Format Output', [920, 300])
    ],
    connections: chain('Receive Reviews', 'Validate Input', 'Aggregate Analysis', 'Format Output'),
    testPayload: { hotel_name: 'Hotel Cascais Beach', reviews: [{ text: 'Fantastic location, friendly staff, beautiful pool.', source: 'Booking.com', rating: 9, author: 'John K.' }, { text: 'Excelente relacao qualidade-preco. Quarto limpo e confortavel.', source: 'Google', rating: 4, author: 'Ana M.' }, { text: 'Le petit-dejeuner est correct mais pas exceptionnel.', source: 'TripAdvisor', rating: 3, author: 'Pierre D.' }, { text: 'Wi-Fi muito lento no quarto. Reclamei e nao resolveram.', source: 'Booking.com', rating: 5, author: 'Carlos R.' }, { text: 'Amazing sunset views from the terrace. Will come back!', source: 'Expedia', rating: 5, author: 'Sarah L.' }, { text: 'Check-in demorado mas staff compensou com upgrade gratuito.', source: 'Google', rating: 4, author: 'Joana F.' }], period: 'Fevereiro 2026', language: 'pt-BR' }
  }
];

// ═══════════════════════════════════════════════════════════
// DEPLOY ENGINE
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
  console.log('  AIOS Wave 2 Machines - Deploy');
  console.log('  Strategic + Squad-Requested Workflows');
  console.log('═══════════════════════════════════════════════\n');
  console.log(`  Workflows: ${WORKFLOWS.length}`);
  console.log(`  Squads: Hormozi, Copywriting, Hotel Mkt, Marketing, Customer`);
  console.log(`  Pattern: Webhook → Validate → OpenAI → Parse\n`);

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
      deployed.push({ id: result.id, name: wf.name, webhook: webhookPath, testPayload: wf.testPayload });
      console.log('');
    } else {
      console.log(`  ❌ ${wf.name}: ${result.message}\n`);
    }
  }

  console.log('═══════════════════════════════════════════════');
  console.log(`  Deployed: ${deployed.length}/${WORKFLOWS.length}`);
  console.log('═══════════════════════════════════════════════\n');

  // Smoke tests
  if (TEST && deployed.length > 0) {
    console.log('🧪 Running smoke tests...\n');
    for (const wf of deployed) {
      if (!wf.testPayload || !wf.webhook) continue;
      try {
        const res = await fetch(`${N8N_URL}/webhook/${wf.webhook}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(wf.testPayload)
        });
        const data = await res.json();
        const hasError = data.error || data.message === 'Error in workflow';
        const status = hasError ? '❌' : '✅';
        const preview = hasError
          ? (data.error || data.message)
          : (data.campaign?.name || data.executive_summary || data.one_liner || data.headlines?.[0]?.text || data.brief?.project_name || data.lead_magnets?.[0]?.title || data.campaign_name || data.health_score?.total || data.hotel_name || data.mode || 'OK');
        console.log(`  ${status} ${wf.name.replace('[AIOS] ', '')}: ${String(preview).substring(0, 80)}`);
      } catch (e) {
        console.log(`  ❌ ${wf.name.replace('[AIOS] ', '')}: ${e.message}`);
      }
    }
    console.log('');
  }
}

deploy().catch(console.error);
