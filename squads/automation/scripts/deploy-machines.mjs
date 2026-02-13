#!/usr/bin/env node
/**
 * Deploy Marketing & Sales Machine Workflows to n8n
 * Uses HTTP Request pattern (not langchain) for API-created credentials compatibility
 *
 * Usage: node deploy-machines.mjs [--activate] [--test]
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

// Credential IDs (created via API)
const CREDS = {
  openAiBearer: { id: 'iEQwK7Eks8bQtAO1', name: 'OpenAI Bearer' },
  clickUp: { id: 'lxQWvraJgTMHRLuZ', name: 'AIOS - ClickUp' }
};

const ACTIVATE = process.argv.includes('--activate');
const TEST = process.argv.includes('--test');

// ═══════════════════════════════════════════════════════════
// Helper: Create OpenAI HTTP Request node
// ═══════════════════════════════════════════════════════════
function openAiNode(name, systemPrompt, userExpr, opts = {}) {
  const model = opts.model || 'gpt-4o-mini';
  const temp = opts.temperature ?? 0.3;
  const maxTokens = opts.maxTokens || 2000;
  return {
    parameters: {
      method: 'POST',
      url: 'https://api.openai.com/v1/chat/completions',
      authentication: 'genericCredentialType',
      genericAuthType: 'httpHeaderAuth',
      sendBody: true,
      specifyBody: 'json',
      jsonBody: `={{ JSON.stringify({ model: '${model}', messages: [{ role: 'system', content: ${JSON.stringify(systemPrompt)} }, { role: 'user', content: ${userExpr} }], temperature: ${temp}, max_tokens: ${maxTokens}, response_format: { type: 'json_object' } }) }}`,
      options: {}
    },
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: opts.position || [480, 300],
    id: opts.id || 'oai-' + Math.random().toString(36).slice(2, 8),
    name,
    credentials: { httpHeaderAuth: CREDS.openAiBearer }
  };
}

// Helper: Parse OpenAI response
function parseNode(name, extraCode = '', pos = [720, 300]) {
  return {
    parameters: {
      jsCode: `const r = $input.item.json;\nconst content = r.choices?.[0]?.message?.content || '{}';\nlet parsed;\ntry { parsed = JSON.parse(content); } catch(e) { const m = content.match(/\\\`\\\`\\\`json?\\n?([\\s\\S]*?)\\\`\\\`\\\`/); parsed = m ? JSON.parse(m[1]) : { raw: content }; }\n${extraCode}\nreturn [{ json: { ...parsed, _meta: { model: r.model, tokens: r.usage, timestamp: new Date().toISOString() } } }];`
    },
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: pos,
    id: 'parse-' + Math.random().toString(36).slice(2, 8),
    name
  };
}

// Helper: Webhook trigger
function webhookNode(path, opts = {}) {
  return {
    parameters: {
      httpMethod: 'POST',
      path,
      responseMode: 'lastNode',
      options: {}
    },
    type: 'n8n-nodes-base.webhook',
    typeVersion: 2,
    position: opts.position || [240, 300],
    id: 'wh-' + Math.random().toString(36).slice(2, 8),
    name: opts.name || 'Receive Request',
    webhookId: path
  };
}

// ═══════════════════════════════════════════════════════════
// WORKFLOW DEFINITIONS
// ═══════════════════════════════════════════════════════════

const WORKFLOWS = [
  // ─── 1. LEAD QUALIFIER ────────────────────────────────
  {
    name: '[AIOS] Inbound Lead Qualifier',
    nodes: [
      webhookNode('aios-lead-qualifier'),
      {
        parameters: {
          jsCode: `const b = $json.body || $json;\nconst lead = { name: b.name || '', email: b.email || '', company: b.company || '', source: b.source || 'unknown', message: b.message || '', phone: b.phone || '' };\nif (!lead.email) throw new Error('Email is required');\nreturn [{ json: lead }];`
        },
        type: 'n8n-nodes-base.code', typeVersion: 2,
        position: [480, 300], id: 'validate', name: 'Validate Lead'
      },
      openAiNode('Qualify Lead',
        'You are an expert lead qualifier for a tourism/hotel digital marketing agency (Travel Tech Digital). Analyze leads and return JSON with: score (HOT/WARM/COLD), confidence (0-100), reasoning (brief), next_action (specific recommended action), priority (1-5). Hotels/tourism = higher score. Complete contact info = higher score. Urgent/specific messages = higher score.',
        '`Lead: ${JSON.stringify($json)}`',
        { position: [720, 300], maxTokens: 500 }
      ),
      parseNode('Format Result', '', [960, 300])
    ],
    connections: {
      'Receive Request': { main: [[{ node: 'Validate Lead', type: 'main', index: 0 }]] },
      'Validate Lead': { main: [[{ node: 'Qualify Lead', type: 'main', index: 0 }]] },
      'Qualify Lead': { main: [[{ node: 'Format Result', type: 'main', index: 0 }]] }
    }
  },

  // ─── 2. EMAIL SEQUENCE BUILDER ────────────────────────
  {
    name: '[AIOS] Email Sequence Builder',
    nodes: [
      webhookNode('aios-email-builder'),
      {
        parameters: {
          jsCode: `const b = $json.body || $json;\nconst frameworks = {\n  'soap-opera': 'Andre Chaperon Soap Opera Sequence: story-driven, open loops, each email ends with cliffhanger leading to next. Emotional journey.',\n  'hormozi': 'Alex Hormozi value-first: lead with massive value, make the offer irresistible, stack bonuses, create urgency.',\n  'settle': 'Ben Settle infotainment: personality-driven, daily email style, contrarian takes, edutainment that sells.',\n  'classic': 'Classic nurture: educate > case study > objection handling > offer > urgency. Professional progression.'\n};\nconst fw = frameworks[b.framework] || frameworks['classic'];\nreturn [{ json: { topic: b.topic || 'Product launch', audience: b.audience || 'Business owners', goal: b.goal || 'Book a demo', num_emails: b.num_emails || 5, tone: b.tone || 'professional', framework: b.framework || 'classic', framework_instructions: fw, language: b.language || 'pt-BR' } }];`
        },
        type: 'n8n-nodes-base.code', typeVersion: 2,
        position: [480, 300], id: 'prep', name: 'Prepare Context'
      },
      openAiNode('Generate Sequence',
        'You are an expert email copywriter. Generate a complete email sequence following the specified framework. For each email include: number, subject_line, preview_text, body_html (with <p> tags), body_text, send_delay_hours (from sequence start), purpose (hook/story/value/offer/urgency). Return JSON: { sequence_name, emails: [...], estimated_open_rate, key_angles: [...] }',
        '`Write ${$json.num_emails} emails about "${$json.topic}" for "${$json.audience}". Goal: ${$json.goal}. Tone: ${$json.tone}. Language: ${$json.language}. Framework: ${$json.framework_instructions}`',
        { position: [720, 300], maxTokens: 4000 }
      ),
      parseNode('Format Output', '', [960, 300])
    ],
    connections: {
      'Receive Request': { main: [[{ node: 'Prepare Context', type: 'main', index: 0 }]] },
      'Prepare Context': { main: [[{ node: 'Generate Sequence', type: 'main', index: 0 }]] },
      'Generate Sequence': { main: [[{ node: 'Format Output', type: 'main', index: 0 }]] }
    }
  },

  // ─── 3. CONTENT REPURPOSER ────────────────────────────
  {
    name: '[AIOS] Content Repurposer',
    nodes: [
      webhookNode('aios-content-repurposer'),
      openAiNode('Repurpose Content',
        'You are an expert content strategist. Transform the original content into optimized versions for each target platform. Platform rules: LinkedIn (professional, 1300 chars, hook first line, 3-5 hashtags), Instagram (carousel slides + caption 2200 chars, 20-30 hashtags, emoji-friendly), Twitter/X (thread 5-10 tweets each <280 chars), Email (newsletter: subject + preview + body), YouTube (script: hook 15s + intro + points + CTA with timestamps). Return JSON: { repurposed: { linkedin: {post, hashtags}, instagram: {caption, slides, hashtags}, twitter: {thread}, email: {subject, preview, body}, youtube_script: {title, hook, script, timestamps} }, summary, key_angles }',
        '`Repurpose this ${($json.body||$json).content_type||"content"} for: ${(($json.body||$json).target_platforms||["linkedin","instagram","twitter"]).join(", ")}. Brand: ${($json.body||$json).brand||"Travel Tech Digital"}. Language: ${($json.body||$json).language||"pt-BR"}. Tone: ${($json.body||$json).tone||"professional"}. Original content: ${($json.body||$json).original_content||""}`',
        { position: [480, 300], maxTokens: 4000 }
      ),
      parseNode('Format Output', '', [720, 300])
    ],
    connections: {
      'Receive Request': { main: [[{ node: 'Repurpose Content', type: 'main', index: 0 }]] },
      'Repurpose Content': { main: [[{ node: 'Format Output', type: 'main', index: 0 }]] }
    }
  },

  // ─── 4. SOCIAL MEDIA FACTORY ──────────────────────────
  {
    name: '[AIOS] Social Media Factory',
    nodes: [
      webhookNode('aios-social-factory'),
      openAiNode('Generate Posts',
        'You are a social media expert for tourism/hotel industry. Generate multiple post variations per platform. Specs: LinkedIn (professional, 1300 chars, hook+insights+CTA), Instagram (visual caption, emojis, 2200 chars, 25 hashtags, carousel suggested), Facebook (conversational, question hooks, 500 chars, link), Twitter/X (punchy <280 chars, thread option, 3-5 hashtags). Content pillars: education (teach, authority), case_study (results, numbers), behind_scenes (human, process), industry_news (trends commentary), social_proof (testimonials). Return JSON: { posts: { platform: [{ text, hashtags, cta, best_time, format, suggested_visual }] }, content_calendar_suggestion, engagement_hooks }',
        '`Create ${($json.body||$json).num_variations||3} post variations about "${($json.body||$json).topic}" for: ${(($json.body||$json).platforms||["linkedin","instagram"]).join(", ")}. Brand: ${($json.body||$json).brand||"Travel Tech Digital"}. Pillars: ${(($json.body||$json).content_pillars||["education"]).join(", ")}. Language: ${($json.body||$json).language||"pt-BR"}. Include hashtags: ${($json.body||$json).include_hashtags!==false}. Include CTA: ${($json.body||$json).include_cta!==false}.`',
        { position: [480, 300], maxTokens: 4000 }
      ),
      parseNode('Format Output', '', [720, 300])
    ],
    connections: {
      'Receive Request': { main: [[{ node: 'Generate Posts', type: 'main', index: 0 }]] },
      'Generate Posts': { main: [[{ node: 'Format Output', type: 'main', index: 0 }]] }
    }
  },

  // ─── 5. BLOG POST GENERATOR ───────────────────────────
  {
    name: '[AIOS] Blog Post Generator',
    nodes: [
      webhookNode('aios-blog-generator'),
      openAiNode('Create Outline',
        'You are an SEO content strategist for tourism/hotel industry. Create a detailed article outline. Return JSON: { outline: { h1, meta_title (60 chars), meta_description (155 chars), sections: [{ h2, h3s: [], key_points: [], word_target }] }, keyword_density_targets: {}, suggested_slug }',
        '`Topic: "${($json.body||$json).topic}". Keywords: ${(($json.body||$json).keywords||[]).join(", ")}. Target audience: ${($json.body||$json).target_audience||"Hotel owners"}. Word count: ${($json.body||$json).word_count||1500}. Language: ${($json.body||$json).language||"pt-BR"}.`',
        { position: [480, 300], maxTokens: 1500, id: 'outline' }
      ),
      {
        parameters: {
          jsCode: `const r = $input.item.json;\nconst content = r.choices?.[0]?.message?.content || '{}';\nlet outline;\ntry { outline = JSON.parse(content); } catch(e) { const m = content.match(/\\\`\\\`\\\`json?\\n?([\\s\\S]*?)\\\`\\\`\\\`/); outline = m ? JSON.parse(m[1]) : { raw: content }; }\nreturn [{ json: { outline, original_request: { topic: '${'{'}$json.body?.topic||$json.topic||""}', language: '${'{'}$json.body?.language||$json.language||"pt-BR"}', word_count: ${'{'}$json.body?.word_count||$json.word_count||1500} } } }];`.replace(/\$\{/g, '${')
        },
        type: 'n8n-nodes-base.code', typeVersion: 2,
        position: [720, 300], id: 'parse-outline', name: 'Parse Outline'
      },
      openAiNode('Write Article',
        'You are an expert content writer for tourism industry. Write a full SEO article based on the outline. Rules: follow H2/H3 structure exactly, keywords 2-3% density, short paragraphs (2-3 sentences), bullet points and lists, compelling intro+conclusion, FAQ section (3-5 questions). Return JSON: { article: { title, slug, meta_title, meta_description, content_markdown, word_count, reading_time_minutes, faq: [{question, answer}] } }',
        '`Write the full article based on this outline: ${JSON.stringify($json.outline)}. Language: ${$json.original_request?.language||"pt-BR"}. Target word count: ${$json.original_request?.word_count||1500}.`',
        { position: [960, 300], maxTokens: 4000, id: 'write' }
      ),
      parseNode('Format Article', '', [1200, 300])
    ],
    connections: {
      'Receive Request': { main: [[{ node: 'Create Outline', type: 'main', index: 0 }]] },
      'Create Outline': { main: [[{ node: 'Parse Outline', type: 'main', index: 0 }]] },
      'Parse Outline': { main: [[{ node: 'Write Article', type: 'main', index: 0 }]] },
      'Write Article': { main: [[{ node: 'Format Article', type: 'main', index: 0 }]] }
    }
  },

  // ─── 6. HOTEL REVIEW RESPONSE ─────────────────────────
  {
    name: '[AIOS] Hotel Review Response Generator',
    nodes: [
      webhookNode('aios-review-response'),
      {
        parameters: {
          jsCode: `const b = $json.body || $json;\nconst rating = parseInt(b.rating) || 3;\nlet strategy, tone;\nif (rating <= 2) { strategy = 'crisis_recovery'; tone = 'empathetic, apologetic, solution-focused'; }\nelse if (rating === 3) { strategy = 'improvement'; tone = 'grateful, acknowledging, improvement-committed'; }\nelse { strategy = 'amplify_positive'; tone = 'warm, grateful, subtle upsell'; }\nreturn [{ json: { hotel_name: b.hotel_name||'Our Hotel', review_text: b.review_text||'', rating, platform: b.platform||'google', reviewer_name: b.reviewer_name||'Guest', language: b.language||'pt-BR', hotel_style: b.hotel_style||'boutique', strategy, tone } }];`
        },
        type: 'n8n-nodes-base.code', typeVersion: 2,
        position: [480, 300], id: 'classify', name: 'Classify Review'
      },
      openAiNode('Generate Response',
        'You are a hospitality reputation manager. Generate a professional review response. Rules: address reviewer by name, acknowledge specific points, for negative (apologize, offer solution, invite return), for mixed (thank positives, address concerns), for positive (thank warmly, highlight what they loved, suggest other experiences). Keep 80-150 words. Sound human, not templated. Return JSON: { response_text, sentiment (positive/mixed/negative), strategy_used, key_topics_addressed: [], suggested_internal_action, confidence (0-100) }',
        '`Hotel: ${$json.hotel_name} (${$json.hotel_style}). Platform: ${$json.platform}. Rating: ${$json.rating}/5. Strategy: ${$json.strategy}. Tone: ${$json.tone}. Language: ${$json.language}. Reviewer: ${$json.reviewer_name}. Review: "${$json.review_text}"`',
        { position: [720, 300], maxTokens: 800 }
      ),
      parseNode('Format Output', '', [960, 300])
    ],
    connections: {
      'Receive Request': { main: [[{ node: 'Classify Review', type: 'main', index: 0 }]] },
      'Classify Review': { main: [[{ node: 'Generate Response', type: 'main', index: 0 }]] },
      'Generate Response': { main: [[{ node: 'Format Output', type: 'main', index: 0 }]] }
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
  console.log('  AIOS Marketing & Sales Machines - Deploy');
  console.log('═══════════════════════════════════════════════\n');

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
      console.log(`  ✅ ${wf.name}`);
      console.log(`     ID: ${result.id}`);

      // Find webhook path
      const whNode = wf.nodes.find(n => n.type === 'n8n-nodes-base.webhook');
      const webhookPath = whNode?.parameters?.path;
      if (webhookPath) {
        console.log(`     Webhook: ${N8N_URL}/webhook/${webhookPath}`);
      }

      if (ACTIVATE) {
        await api('POST', `/workflows/${result.id}/activate`);
        console.log(`     Status: ACTIVE`);
      } else {
        console.log(`     Status: inactive (use --activate to enable)`);
      }

      deployed.push({ id: result.id, name: wf.name, webhook: webhookPath ? `${N8N_URL}/webhook/${webhookPath}` : null });
      console.log('');
    } else {
      console.log(`  ❌ ${wf.name}: ${result.message}`);
    }
  }

  console.log('═══════════════════════════════════════════════');
  console.log(`  Deployed: ${deployed.length}/${WORKFLOWS.length} workflows`);
  console.log('═══════════════════════════════════════════════\n');

  // Test if requested
  if (TEST && deployed.length > 0) {
    console.log('🧪 Running smoke tests...\n');

    const tests = [
      {
        name: 'Lead Qualifier',
        url: `${N8N_URL}/webhook/aios-lead-qualifier`,
        body: { name: 'Test User', email: 'test@hotel.com', company: 'Hotel Test', source: 'api-test', message: 'Interested in marketing services', phone: '+351999999999' }
      },
      {
        name: 'Review Response',
        url: `${N8N_URL}/webhook/aios-review-response`,
        body: { hotel_name: 'Hotel Test', review_text: 'Great location and friendly staff!', rating: 5, platform: 'google', reviewer_name: 'Test Guest', language: 'en', hotel_style: 'boutique' }
      }
    ];

    for (const test of tests) {
      try {
        console.log(`  Testing ${test.name}...`);
        const res = await fetch(test.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(test.body)
        });
        const data = await res.json();
        if (data.error || data.message === 'Error in workflow') {
          console.log(`  ❌ ${test.name}: Workflow error`);
        } else {
          console.log(`  ✅ ${test.name}: OK (${data._meta?.tokens?.total_tokens || '?'} tokens)`);
        }
      } catch (e) {
        console.log(`  ❌ ${test.name}: ${e.message}`);
      }
    }
    console.log('');
  }

  // Output summary
  console.log('📋 Webhook Endpoints:\n');
  for (const d of deployed) {
    if (d.webhook) console.log(`  ${d.name}\n  POST ${d.webhook}\n`);
  }
}

deploy().catch(console.error);
