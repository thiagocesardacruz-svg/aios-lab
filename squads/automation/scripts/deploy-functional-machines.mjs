#!/usr/bin/env node
/**
 * Deploy Functional Marketing & Sales Machines to n8n
 * Segment-agnostic workflows usable by any tourism business
 *
 * Usage: node deploy-functional-machines.mjs [--activate] [--test]
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
  openAiBearer: { id: 'iEQwK7Eks8bQtAO1', name: 'OpenAI Bearer' },
  ghlBearer: { id: 'IRB8AlwbxduOFkvO', name: 'GHL Bearer' }
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

function openAiNode(id, name, jsonBodyExpr, position, maxTokens = 2000) {
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

function httpScrapeNode(id, name, urlExpr, position) {
  return {
    parameters: {
      method: 'GET',
      url: urlExpr,
      options: { response: { response: { fullResponse: true } } }
    },
    type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2,
    position, id, name
  };
}

function parseNode(id, name, jsCode, position) {
  return codeNode(id, name, jsCode, position);
}

function chain(...nodeNames) {
  const connections = {};
  for (let i = 0; i < nodeNames.length - 1; i++) {
    connections[nodeNames[i]] = { main: [[{ node: nodeNames[i + 1], type: 'main', index: 0 }]] };
  }
  return connections;
}

// ═══════════════════════════════════════════════════════════
// WORKFLOW DEFINITIONS
// ═══════════════════════════════════════════════════════════

const WORKFLOWS = [

  // ─── 1. SEO KEYWORD ENGINE ──────────────────────────────
  {
    name: '[AIOS] SEO Keyword Engine',
    nodes: [
      webhookNode('wh1', 'Receive Request', 'aios-seo-keywords'),
      codeNode('v1', 'Validate Input', `const b = $json.body || $json;\nreturn [{ json: { business_type: b.business_type || 'tourism business', location: b.location || '', target_audience: b.target_audience || 'travelers', language: b.language || 'pt-BR', competitors: b.competitors || [], num_keywords: b.num_keywords || 30 } }];`, [440, 300]),
      openAiNode('ai1', 'Generate Keywords',
        `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are an expert SEO strategist specializing in tourism and hospitality. Generate comprehensive keyword research. Return JSON: { seed_keywords: [{ keyword, search_intent: "informational"|"transactional"|"navigational"|"commercial", estimated_volume: "high"|"medium"|"low", difficulty: "easy"|"medium"|"hard", priority: 1-5 }], keyword_clusters: [{ theme, keywords: [string], content_type: "blog"|"landing"|"faq"|"guide" }], long_tail: [string], local_seo: [string], content_calendar: [{ week: 1-12, topic, target_keyword, content_type, title_suggestion }] }' }, { role: 'user', content: 'Generate ' + $json.num_keywords + ' SEO keywords for: ' + $json.business_type + '. Location: ' + ($json.location || 'not specified') + '. Target audience: ' + $json.target_audience + '. Competitors: ' + ($json.competitors.join(', ') || 'none specified') + '. Language: ' + $json.language }], temperature: 0.4, max_tokens: 3000, response_format: { type: 'json_object' } }) }}`,
        [680, 300]),
      parseNode('p1', 'Format Output', `const r = $input.item.json;\nconst content = r.choices?.[0]?.message?.content || '{}';\nlet result;\ntry { result = JSON.parse(content); } catch(e) { result = { error: 'Parse failed', raw: content }; }\nresult._meta = { model: r.model, tokens: r.usage, timestamp: new Date().toISOString() };\nreturn [{ json: result }];`, [920, 300])
    ],
    connections: chain('Receive Request', 'Validate Input', 'Generate Keywords', 'Format Output'),
    testPayload: { business_type: 'boutique hotel', location: 'Algarve, Portugal', target_audience: 'luxury travelers', language: 'pt-BR' }
  },

  // ─── 2. REPUTATION ANALYZER ─────────────────────────────
  {
    name: '[AIOS] Reputation Analyzer',
    nodes: [
      webhookNode('wh2', 'Receive Reviews', 'aios-reputation-analyzer'),
      codeNode('v2', 'Prepare Reviews', `const b = $json.body || $json;\nconst reviews = b.reviews || [];\nif (!reviews.length && b.review) reviews.push({ text: b.review, source: b.source || 'manual' });\nif (!reviews.length) throw new Error('No reviews provided. Send { reviews: [{ text, author?, rating?, source? }] }');\nreturn [{ json: { reviews: reviews.slice(0, 50), business_name: b.business_name || 'Business', language: b.language || 'pt-BR' } }];`, [440, 300]),
      openAiNode('ai2', 'Analyze Sentiment',
        `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are a reputation management expert. Analyze customer reviews and return JSON: { overall_score: 1-10, overall_sentiment: "very_negative"|"negative"|"neutral"|"positive"|"very_positive", total_analyzed: number, sentiment_distribution: { positive: %, neutral: %, negative: % }, top_praise: [{ theme, count, example_quote }], top_complaints: [{ theme, count, severity: "low"|"medium"|"high", example_quote }], response_suggestions: [{ review_index, tone, suggested_response }], trends: [string], action_items: [{ priority: 1-5, action, expected_impact }] }' }, { role: 'user', content: 'Analyze these reviews for ' + $json.business_name + ' (respond in ' + $json.language + '): ' + JSON.stringify($json.reviews) }], temperature: 0.3, max_tokens: 3000, response_format: { type: 'json_object' } }) }}`,
        [680, 300]),
      parseNode('p2', 'Format Output', `const r = $input.item.json;\nconst content = r.choices?.[0]?.message?.content || '{}';\nlet result;\ntry { result = JSON.parse(content); } catch(e) { result = { error: 'Parse failed' }; }\nresult._meta = { model: r.model, tokens: r.usage, timestamp: new Date().toISOString() };\nreturn [{ json: result }];`, [920, 300])
    ],
    connections: chain('Receive Reviews', 'Prepare Reviews', 'Analyze Sentiment', 'Format Output'),
    testPayload: { business_name: 'Hotel Cascais Beach', reviews: [{ text: 'Excelente localização e staff muito simpático. Quarto limpo e confortável.', rating: 5, source: 'Google' }, { text: 'O check-in demorou 40 minutos. Wi-Fi péssimo.', rating: 2, source: 'Booking.com' }, { text: 'Bom custo-benefício, pequeno-almoço razoável mas podia melhorar.', rating: 3, source: 'TripAdvisor' }], language: 'pt-BR' }
  },

  // ─── 3. COMPETITOR INTEL ─────────────────────────────────
  {
    name: '[AIOS] Competitor Intel',
    nodes: [
      webhookNode('wh3', 'Receive Request', 'aios-competitor-intel'),
      codeNode('v3', 'Validate', `const b = $json.body || $json;\nif (!b.competitor_url && !b.competitor_description) throw new Error('Send { competitor_url or competitor_description, our_business? }');\nreturn [{ json: { competitor_url: b.competitor_url || '', competitor_name: b.competitor_name || '', competitor_description: b.competitor_description || '', our_business: b.our_business || '', language: b.language || 'pt-BR', analysis_depth: b.analysis_depth || 'standard' } }];`, [440, 300]),
      openAiNode('ai3', 'Analyze Competitor',
        `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are a competitive intelligence analyst specializing in tourism and hospitality. Analyze the competitor and return JSON: { competitor_profile: { name, positioning, target_market, unique_selling_points: [string] }, strengths: [{ area, detail, threat_level: "low"|"medium"|"high" }], weaknesses: [{ area, detail, opportunity_level: "low"|"medium"|"high" }], pricing_signals: { strategy, positioning: "budget"|"mid"|"premium"|"luxury", observations: [string] }, marketing_analysis: { channels: [string], messaging_tone, key_messages: [string], content_strategy }, opportunities: [{ opportunity, how_to_exploit, effort: "low"|"medium"|"high", impact: "low"|"medium"|"high" }], threats: [{ threat, mitigation }], recommendations: [{ priority: 1-5, action, rationale }] }' }, { role: 'user', content: 'Analyze competitor: ' + ($json.competitor_name || $json.competitor_url || 'Unknown') + '. Description/URL: ' + ($json.competitor_description || $json.competitor_url) + '. Our business: ' + ($json.our_business || 'tourism/hospitality company') + '. Language: ' + $json.language + '. Depth: ' + $json.analysis_depth }], temperature: 0.4, max_tokens: 3000, response_format: { type: 'json_object' } }) }}`,
        [680, 300]),
      parseNode('p3', 'Format Output', `const r = $input.item.json;\nconst content = r.choices?.[0]?.message?.content || '{}';\nlet result;\ntry { result = JSON.parse(content); } catch(e) { result = { error: 'Parse failed' }; }\nresult._meta = { model: r.model, tokens: r.usage, timestamp: new Date().toISOString() };\nreturn [{ json: result }];`, [920, 300])
    ],
    connections: chain('Receive Request', 'Validate', 'Analyze Competitor', 'Format Output'),
    testPayload: { competitor_name: 'Pestana Hotels', competitor_description: 'Large Portuguese hotel chain with properties across Europe, Africa and South America. Focus on 4-5 star properties.', our_business: 'Boutique digital marketing agency for independent tourism businesses', language: 'pt-BR' }
  },

  // ─── 4. SMART EMAIL CLASSIFIER ──────────────────────────
  {
    name: '[AIOS] Smart Email Classifier',
    nodes: [
      webhookNode('wh4', 'Receive Email', 'aios-email-classifier'),
      codeNode('v4', 'Validate Email', `const b = $json.body || $json;\nif (!b.body && !b.subject) throw new Error('Send { from, subject, body }');\nreturn [{ json: { from: b.from || 'unknown', subject: b.subject || '', body: b.body || '', language: b.language || 'auto-detect', business_context: b.business_context || 'tourism and hospitality business' } }];`, [440, 300]),
      openAiNode('ai4', 'Classify & Draft',
        `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are an expert email assistant for a tourism/hospitality business. Classify the email and draft a response. Return JSON: { classification: { category: "booking_inquiry"|"complaint"|"feedback"|"partnership"|"support"|"spam"|"newsletter"|"invoice"|"other", sub_category: string, priority: "urgent"|"high"|"normal"|"low", sentiment: "very_negative"|"negative"|"neutral"|"positive"|"very_positive", intent: string, requires_human: boolean, reason_for_human: string|null }, extracted_data: { dates_mentioned: [string], amounts_mentioned: [string], names_mentioned: [string], key_requests: [string] }, suggested_response: { subject: string, body: string, tone: string, follow_up_needed: boolean, follow_up_date: string|null }, action_items: [{ action, assignee_suggestion: "sales"|"support"|"management"|"marketing", deadline_suggestion }] }' }, { role: 'user', content: 'Business context: ' + $json.business_context + '. Classify and draft response for this email:\\n\\nFrom: ' + $json.from + '\\nSubject: ' + $json.subject + '\\nBody: ' + $json.body + '\\n\\nLanguage: ' + $json.language }], temperature: 0.3, max_tokens: 2000, response_format: { type: 'json_object' } }) }}`,
        [680, 300]),
      parseNode('p4', 'Format Output', `const r = $input.item.json;\nconst content = r.choices?.[0]?.message?.content || '{}';\nlet result;\ntry { result = JSON.parse(content); } catch(e) { result = { error: 'Parse failed' }; }\nresult._meta = { model: r.model, tokens: r.usage, timestamp: new Date().toISOString() };\nreturn [{ json: result }];`, [920, 300])
    ],
    connections: chain('Receive Email', 'Validate Email', 'Classify & Draft', 'Format Output'),
    testPayload: { from: 'maria.santos@empresa.pt', subject: 'Orçamento para evento corporativo - 50 pessoas', body: 'Boa tarde, gostaria de solicitar um orçamento para um evento corporativo para 50 pessoas em Março. Precisamos de sala de reuniões, coffee break e almoço. Podem enviar proposta? Obrigada, Maria Santos - Diretora de RH', business_context: 'hotel com salas de eventos e restaurante' }
  },

  // ─── 5. AD COPY MACHINE ─────────────────────────────────
  {
    name: '[AIOS] Ad Copy Machine',
    nodes: [
      webhookNode('wh5', 'Receive Brief', 'aios-ad-copy'),
      codeNode('v5', 'Validate Brief', `const b = $json.body || $json;\nif (!b.product && !b.offer) throw new Error('Send { product/offer, target_audience, platform, language }');\nreturn [{ json: { product: b.product || b.offer || '', target_audience: b.target_audience || 'general', platform: b.platform || 'all', tone: b.tone || 'professional', language: b.language || 'pt-BR', num_variations: b.num_variations || 3, unique_selling_points: b.unique_selling_points || [], constraints: b.constraints || '' } }];`, [440, 300]),
      openAiNode('ai5', 'Generate Ad Copy',
        `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are a world-class direct response copywriter specializing in tourism and hospitality ads. Create high-converting ad copy. Return JSON: { google_ads: { headlines_30char: [string], headlines_90char: [string], descriptions: [string] }, meta_ads: [{ headline, primary_text, description, cta: "Learn More"|"Book Now"|"Sign Up"|"Contact Us"|"Get Offer" }], hooks: [{ hook, psychological_trigger: "curiosity"|"urgency"|"social_proof"|"fear_of_missing"|"authority"|"reciprocity", platform_best_for: string }], email_subject_lines: [string], cta_variations: [string], hashtags: [string], a_b_test_suggestions: [{ element, version_a, version_b, hypothesis }] }' }, { role: 'user', content: 'Create ' + $json.num_variations + ' ad variations. Product/Offer: ' + $json.product + '. Target audience: ' + $json.target_audience + '. Platform: ' + $json.platform + '. Tone: ' + $json.tone + '. USPs: ' + ($json.unique_selling_points.join(', ') || 'none specified') + '. Constraints: ' + ($json.constraints || 'none') + '. Language: ' + $json.language }], temperature: 0.7, max_tokens: 3000, response_format: { type: 'json_object' } }) }}`,
        [680, 300]),
      parseNode('p5', 'Format Output', `const r = $input.item.json;\nconst content = r.choices?.[0]?.message?.content || '{}';\nlet result;\ntry { result = JSON.parse(content); } catch(e) { result = { error: 'Parse failed' }; }\nresult._meta = { model: r.model, tokens: r.usage, timestamp: new Date().toISOString() };\nreturn [{ json: result }];`, [920, 300])
    ],
    connections: chain('Receive Brief', 'Validate Brief', 'Generate Ad Copy', 'Format Output'),
    testPayload: { product: 'Pacote Escapada Romântica - 2 noites em suite com jacuzzi, jantar à luz de velas e late checkout', target_audience: 'casais 30-50 anos, rendimento médio-alto', platform: 'all', tone: 'luxuoso mas acessível', language: 'pt-BR', unique_selling_points: ['Vista mar', 'Spa incluído', 'Restaurante premiado'] }
  },

  // ─── 6. CUSTOMER FEEDBACK DIGEST ────────────────────────
  {
    name: '[AIOS] Customer Feedback Digest',
    nodes: [
      webhookNode('wh6', 'Receive Feedback', 'aios-feedback-digest'),
      codeNode('v6', 'Validate Feedback', `const b = $json.body || $json;\nconst feedbacks = b.feedbacks || b.feedback || [];\nconst items = Array.isArray(feedbacks) ? feedbacks : [{ text: feedbacks }];\nif (!items.length) throw new Error('Send { feedbacks: [{ text, source?, rating?, date? }], business_name? }');\nreturn [{ json: { feedbacks: items.slice(0, 100), business_name: b.business_name || 'Business', period: b.period || 'recent', language: b.language || 'pt-BR' } }];`, [440, 300]),
      openAiNode('ai6', 'Analyze Feedback',
        `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are a customer experience analyst. Analyze batch feedback and return JSON: { executive_summary: string, total_analyzed: number, nps_estimate: number, sentiment_distribution: { positive: number, neutral: number, negative: number }, satisfaction_score: 1-10, top_themes: [{ theme, frequency, sentiment, example_quotes: [string] }], critical_issues: [{ issue, frequency, severity: "low"|"medium"|"high"|"critical", customer_impact, recommended_fix }], bright_spots: [{ area, description, leverage_opportunity }], trend_analysis: { improving: [string], declining: [string], stable: [string] }, competitive_insights: [string], recommendations: [{ priority: 1-5, action, expected_outcome, effort: "low"|"medium"|"high" }], response_templates: [{ scenario, template }] }' }, { role: 'user', content: 'Analyze feedback for ' + $json.business_name + ' (' + $json.period + '). Language: ' + $json.language + '. Feedbacks: ' + JSON.stringify($json.feedbacks) }], temperature: 0.3, max_tokens: 3500, response_format: { type: 'json_object' } }) }}`,
        [680, 300]),
      parseNode('p6', 'Format Output', `const r = $input.item.json;\nconst content = r.choices?.[0]?.message?.content || '{}';\nlet result;\ntry { result = JSON.parse(content); } catch(e) { result = { error: 'Parse failed' }; }\nresult._meta = { model: r.model, tokens: r.usage, timestamp: new Date().toISOString() };\nreturn [{ json: result }];`, [920, 300])
    ],
    connections: chain('Receive Feedback', 'Validate Feedback', 'Analyze Feedback', 'Format Output'),
    testPayload: { business_name: 'Tour Operator Lisboa', feedbacks: [{ text: 'Tour excelente! Guia muito conhecedor.', rating: 5, source: 'Google' }, { text: 'Boa experiência mas o autocarro chegou 20 min atrasado.', rating: 3, source: 'GetYourGuide' }, { text: 'Não recomendo. Muito caro para o que oferece.', rating: 1, source: 'TripAdvisor' }, { text: 'Perfeito para famílias! As crianças adoraram.', rating: 5, source: 'Viator' }, { text: 'Guia falava rápido demais, difícil acompanhar.', rating: 2, source: 'Google' }], language: 'pt-BR' }
  },

  // ─── 7. MEETING NOTES PROCESSOR ─────────────────────────
  {
    name: '[AIOS] Meeting Notes Processor',
    nodes: [
      webhookNode('wh7', 'Receive Notes', 'aios-meeting-processor'),
      codeNode('v7', 'Validate Input', `const b = $json.body || $json;\nif (!b.transcript && !b.notes) throw new Error('Send { transcript/notes, participants?, context? }');\nreturn [{ json: { transcript: b.transcript || b.notes || '', participants: b.participants || [], context: b.context || '', meeting_type: b.meeting_type || 'general', language: b.language || 'pt-BR' } }];`, [440, 300]),
      openAiNode('ai7', 'Process Meeting',
        `={{ JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: 'You are an expert meeting analyst. Process meeting notes and extract actionable insights. Return JSON: { summary: { one_liner: string, detailed: string, duration_estimate: string }, key_decisions: [{ decision, rationale, impact, decided_by }], action_items: [{ task, owner: string, deadline_suggestion: string, priority: "urgent"|"high"|"normal"|"low", dependencies: [string] }], discussion_topics: [{ topic, conclusion, open_questions: [string] }], follow_ups: [{ what, who, when, method: "email"|"call"|"meeting"|"async" }], risks_identified: [{ risk, mitigation, owner }], metrics_mentioned: [{ metric, value, context }], next_meeting: { suggested_agenda: [string], suggested_date: string, required_participants: [string] } }' }, { role: 'user', content: 'Meeting type: ' + $json.meeting_type + '. Participants: ' + ($json.participants.join(', ') || 'not specified') + '. Context: ' + ($json.context || 'none') + '. Language: ' + $json.language + '. Transcript/Notes:\\n' + $json.transcript }], temperature: 0.2, max_tokens: 3000, response_format: { type: 'json_object' } }) }}`,
        [680, 300]),
      parseNode('p7', 'Format Output', `const r = $input.item.json;\nconst content = r.choices?.[0]?.message?.content || '{}';\nlet result;\ntry { result = JSON.parse(content); } catch(e) { result = { error: 'Parse failed' }; }\nresult._meta = { model: r.model, tokens: r.usage, timestamp: new Date().toISOString() };\nreturn [{ json: result }];`, [920, 300])
    ],
    connections: chain('Receive Notes', 'Validate Input', 'Process Meeting', 'Format Output'),
    testPayload: { meeting_type: 'sales', participants: ['Thiago', 'Maria', 'João'], notes: 'Discutimos a proposta para Hotel Algarve Premium. Maria apresentou o pacote de marketing digital: SEO + Social Media + Email por €2000/mês. João sugeriu incluir gestão de reputação por +€500. Cliente pediu desconto para contrato anual. Decidimos oferecer 2 meses grátis no contrato anual em vez de desconto. Thiago vai enviar proposta até sexta. Maria prepara case study do Hotel Cascais para anexar. Próxima reunião com cliente na terça às 14h.', language: 'pt-BR' }
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
  console.log('  AIOS Functional Machines - Deploy');
  console.log('═══════════════════════════════════════════════\n');
  console.log(`  Workflows: ${WORKFLOWS.length}`);
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
          : (data.executive_summary || data.summary?.one_liner || data.overall_sentiment || data.seed_keywords?.[0]?.keyword || data.classification?.category || data.google_ads?.headlines_30char?.[0] || data.sequence_name || 'OK');
        console.log(`  ${status} ${wf.name.replace('[AIOS] ', '')}: ${String(preview).substring(0, 80)}`);
      } catch (e) {
        console.log(`  ❌ ${wf.name.replace('[AIOS] ', '')}: ${e.message}`);
      }
    }
    console.log('');
  }
}

deploy().catch(console.error);
