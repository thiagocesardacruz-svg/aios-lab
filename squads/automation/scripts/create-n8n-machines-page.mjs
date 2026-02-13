#!/usr/bin/env node
/**
 * Create "n8n Machines" page in ClickUp Command Center
 * Lists all 16 active machines with descriptions, webhook URLs, and demo payloads
 */

const API_V3 = 'https://api.clickup.com/api/v3';
const API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O';
const TEAM_ID = '90152366829';
const DOC_ID = '2kyqzwqd-1415';
const BASE = 'https://n8n.srv855345.hstgr.cloud';
const today = new Date().toISOString().split('T')[0];

const content = `# n8n Machines - Catalogo de Automacoes

> **16 maquinas ativas** prontas para uso. Cada uma tem um webhook que pode ser acionado via POST.
> Instancia: ${BASE}
> Ultima atualizacao: **${today}**

---

## Como Testar Qualquer Maquina

Todas as maquinas funcionam da mesma forma:

1. Copie a **URL do webhook**
2. Envie um **POST** com o payload de exemplo (via Postman, curl, ou qualquer ferramenta)
3. Receba o resultado em JSON em segundos

\`\`\`bash
# Exemplo generico com curl
curl -X POST URL_DO_WEBHOOK \\
  -H "Content-Type: application/json" \\
  -d '{"campo": "valor"}'
\`\`\`

---

## Maquinas por Categoria

---

### VENDAS & CRM (3)

#### 1. Lead Qualifier (standalone)

Qualifica leads inbound com AI. Retorna score (HOT/WARM/COLD), confianca e proxima acao.

| | |
| --- | --- |
| **Webhook** | \`${BASE}/webhook/aios-lead-qualifier\` |
| **Metodo** | POST |
| **Uso** | Formularios de contato, landing pages, chatbots |

**Payload de demo:**
\`\`\`json
{
  "name": "Maria Santos",
  "email": "maria@hotel-algarve.pt",
  "company": "Hotel Algarve Premium",
  "source": "website",
  "message": "Gostaria de saber mais sobre servicos de marketing digital para o nosso hotel de 45 quartos",
  "phone": "+351912345678"
}
\`\`\`

---

#### 2. Lead Qualifier → GHL CRM

Qualifica lead E cria contato + oportunidade no GoHighLevel automaticamente.

| | |
| --- | --- |
| **Webhook** | \`${BASE}/webhook/aios-lead-to-crm\` |
| **Metodo** | POST |
| **Uso** | Formularios que devem ir direto para o CRM com pipeline |

**Payload de demo:**
\`\`\`json
{
  "name": "Joao Ferreira",
  "email": "joao@resort-cascais.pt",
  "company": "Resort Cascais Bay",
  "source": "linkedin",
  "message": "Preciso de ajuda com SEO e gestao de reputacao online",
  "phone": "+351923456789"
}
\`\`\`

---

#### 3. Outbound Sequence Engine

Gera sequencias de outreach personalizadas para prospeccao ativa.

| | |
| --- | --- |
| **Webhook** | \`${BASE}/webhook/aios-outbound-sequence\` |
| **Metodo** | POST |
| **Uso** | Campanhas de prospeccao, cold outreach |

**Payload de demo:**
\`\`\`json
{
  "prospect_name": "Ana Costa",
  "prospect_company": "Boutique Hotel Porto",
  "prospect_role": "Diretora de Marketing",
  "our_service": "Gestao de marketing digital para hotelaria",
  "language": "pt-BR"
}
\`\`\`

---

### CONTEUDO & SEO (4)

#### 4. SEO Keyword Engine

Pesquisa de keywords com clusters, long-tail e calendario de conteudo.

| | |
| --- | --- |
| **Webhook** | \`${BASE}/webhook/aios-seo-keywords\` |
| **Metodo** | POST |
| **Uso** | Estrategia SEO, planeamento de conteudo |

**Payload de demo:**
\`\`\`json
{
  "business_type": "boutique hotel",
  "location": "Algarve, Portugal",
  "target_audience": "luxury travelers",
  "language": "pt-BR"
}
\`\`\`

---

#### 5. Blog Post Generator

Gera artigos SEO completos: outline > artigo full com meta tags e FAQ.

| | |
| --- | --- |
| **Webhook** | \`${BASE}/webhook/aios-blog-generator\` |
| **Metodo** | POST |
| **Uso** | Marketing de conteudo, blog posts |

**Payload de demo:**
\`\`\`json
{
  "topic": "10 estrategias de marketing digital para hoteis em 2026",
  "keywords": ["marketing digital hotelaria", "marketing hotel", "SEO hotel"],
  "target_audience": "Donos e gestores de hoteis independentes",
  "word_count": 1500,
  "language": "pt-BR"
}
\`\`\`

---

#### 6. Content Repurposer

Transforma um conteudo em versoes para LinkedIn, Instagram, Twitter, Email e YouTube.

| | |
| --- | --- |
| **Webhook** | \`${BASE}/webhook/aios-content-repurposer\` |
| **Metodo** | POST |
| **Uso** | Multiplicar alcance de conteudo existente |

**Payload de demo:**
\`\`\`json
{
  "original_content": "O turismo no Algarve cresceu 15% em 2025, com destaque para hoteis boutique que viram ocupacao media de 78%. As principais tendencias sao: experiencias personalizadas, sustentabilidade e reservas diretas via website.",
  "content_type": "article excerpt",
  "target_platforms": ["linkedin", "instagram", "twitter"],
  "brand": "Travel Tech Digital",
  "language": "pt-BR"
}
\`\`\`

---

#### 7. Social Media Factory

Gera posts otimizados por plataforma com hashtags, CTAs e sugestao visual.

| | |
| --- | --- |
| **Webhook** | \`${BASE}/webhook/aios-social-factory\` |
| **Metodo** | POST |
| **Uso** | Calendario de redes sociais, posts diarios |

**Payload de demo:**
\`\`\`json
{
  "topic": "Como aumentar reservas diretas no verao",
  "platforms": ["linkedin", "instagram"],
  "brand": "Travel Tech Digital",
  "num_variations": 3,
  "content_pillars": ["education", "case_study"],
  "language": "pt-BR"
}
\`\`\`

---

### REPUTACAO & ANALISE (3)

#### 8. Reputation Analyzer

Analisa reviews em lote com sentimento, temas e sugestoes de resposta.

| | |
| --- | --- |
| **Webhook** | \`${BASE}/webhook/aios-reputation-analyzer\` |
| **Metodo** | POST |
| **Uso** | Auditoria de reputacao, relatorios mensais |

**Payload de demo:**
\`\`\`json
{
  "business_name": "Hotel Cascais Beach",
  "reviews": [
    { "text": "Excelente localizacao e staff muito simpatico.", "rating": 5, "source": "Google" },
    { "text": "O check-in demorou 40 minutos. Wi-Fi pessimo.", "rating": 2, "source": "Booking.com" },
    { "text": "Bom custo-beneficio, pequeno-almoco razoavel.", "rating": 3, "source": "TripAdvisor" }
  ],
  "language": "pt-BR"
}
\`\`\`

---

#### 9. Review Response Generator

Gera respostas profissionais para reviews com estrategia por rating.

| | |
| --- | --- |
| **Webhook** | \`${BASE}/webhook/aios-review-response\` |
| **Metodo** | POST |
| **Uso** | Responder a reviews no Google, Booking, TripAdvisor |

**Payload de demo:**
\`\`\`json
{
  "hotel_name": "Hotel Algarve Premium",
  "review_text": "O quarto era limpo mas o pequeno-almoco decepcionou. Pouca variedade para o preco cobrado.",
  "rating": 3,
  "platform": "booking",
  "reviewer_name": "Carlos M.",
  "language": "pt-BR",
  "hotel_style": "resort"
}
\`\`\`

---

#### 10. Competitor Intel

Analise competitiva completa: forcas, fraquezas, oportunidades e recomendacoes.

| | |
| --- | --- |
| **Webhook** | \`${BASE}/webhook/aios-competitor-intel\` |
| **Metodo** | POST |
| **Uso** | Analise de mercado, posicionamento estrategico |

**Payload de demo:**
\`\`\`json
{
  "competitor_name": "Pestana Hotels",
  "competitor_description": "Grande cadeia hoteleira portuguesa com propriedades na Europa, Africa e America do Sul. Foco em 4-5 estrelas.",
  "our_business": "Agencia boutique de marketing digital para negocios de turismo independentes",
  "language": "pt-BR"
}
\`\`\`

---

### EMAIL & COMUNICACAO (3)

#### 11. Email Sequence Builder

Cria sequencias de email com frameworks: Soap Opera, Hormozi, Ben Settle ou Classic.

| | |
| --- | --- |
| **Webhook** | \`${BASE}/webhook/aios-email-builder\` |
| **Metodo** | POST |
| **Uso** | Nurture sequences, lancamentos, onboarding |

**Payload de demo:**
\`\`\`json
{
  "topic": "Lancamento do pacote Verao 2026",
  "audience": "Hospedes anteriores do hotel",
  "goal": "Reservar pacote de verao com 15% desconto early bird",
  "num_emails": 5,
  "framework": "hormozi",
  "language": "pt-BR"
}
\`\`\`

---

#### 12. Smart Email Classifier

Classifica emails recebidos, extrai dados e sugere resposta automatica.

| | |
| --- | --- |
| **Webhook** | \`${BASE}/webhook/aios-email-classifier\` |
| **Metodo** | POST |
| **Uso** | Triagem de inbox, atendimento ao cliente |

**Payload de demo:**
\`\`\`json
{
  "from": "maria.santos@empresa.pt",
  "subject": "Orcamento para evento corporativo - 50 pessoas",
  "body": "Boa tarde, gostaria de solicitar um orcamento para um evento corporativo para 50 pessoas em Marco. Precisamos de sala de reunioes, coffee break e almoco. Podem enviar proposta?",
  "business_context": "hotel com salas de eventos e restaurante"
}
\`\`\`

---

#### 13. Ad Copy Machine

Gera copy para Google Ads, Meta Ads, email e redes sociais com A/B test suggestions.

| | |
| --- | --- |
| **Webhook** | \`${BASE}/webhook/aios-ad-copy\` |
| **Metodo** | POST |
| **Uso** | Campanhas pagas, criativos de anuncios |

**Payload de demo:**
\`\`\`json
{
  "product": "Pacote Escapada Romantica - 2 noites em suite com jacuzzi, jantar a luz de velas e late checkout",
  "target_audience": "casais 30-50 anos, rendimento medio-alto",
  "platform": "all",
  "tone": "luxuoso mas acessivel",
  "language": "pt-BR",
  "unique_selling_points": ["Vista mar", "Spa incluido", "Restaurante premiado"]
}
\`\`\`

---

### OPERACOES (3)

#### 14. Customer Feedback Digest

Analisa feedback em lote com NPS estimado, temas criticos e recomendacoes.

| | |
| --- | --- |
| **Webhook** | \`${BASE}/webhook/aios-feedback-digest\` |
| **Metodo** | POST |
| **Uso** | Relatorios mensais de satisfacao, board reports |

**Payload de demo:**
\`\`\`json
{
  "business_name": "Tour Operator Lisboa",
  "feedbacks": [
    { "text": "Tour excelente! Guia muito conhecedor.", "rating": 5, "source": "Google" },
    { "text": "Boa experiencia mas o autocarro chegou 20 min atrasado.", "rating": 3, "source": "GetYourGuide" },
    { "text": "Nao recomendo. Muito caro para o que oferece.", "rating": 1, "source": "TripAdvisor" },
    { "text": "Perfeito para familias! As criancas adoraram.", "rating": 5, "source": "Viator" }
  ],
  "language": "pt-BR"
}
\`\`\`

---

#### 15. Meeting Notes Processor

Processa notas de reuniao: extrai decisoes, action items, riscos e proximos passos.

| | |
| --- | --- |
| **Webhook** | \`${BASE}/webhook/aios-meeting-processor\` |
| **Metodo** | POST |
| **Uso** | Reunioes de equipa, calls com clientes |

**Payload de demo:**
\`\`\`json
{
  "meeting_type": "sales",
  "participants": ["Thiago", "Maria", "Joao"],
  "notes": "Discutimos a proposta para Hotel Algarve Premium. Maria apresentou o pacote de marketing digital: SEO + Social Media + Email por 2000 EUR/mes. Joao sugeriu incluir gestao de reputacao por +500 EUR. Cliente pediu desconto para contrato anual. Decidimos oferecer 2 meses gratis no contrato anual. Thiago vai enviar proposta ate sexta.",
  "language": "pt-BR"
}
\`\`\`

---

#### 16. Hotel Guest Lifecycle

Gera comunicacoes personalizadas para cada fase da jornada do hospede (pre-arrival, check-in, in-stay, checkout, post-stay).

| | |
| --- | --- |
| **Webhook** | \`${BASE}/webhook/aios-guest-lifecycle\` |
| **Metodo** | POST |
| **Uso** | Automacao de comunicacao com hospedes |

**Payload de demo:**
\`\`\`json
{
  "guest_name": "Ana Costa",
  "event": "pre-arrival",
  "hotel_name": "Hotel Cascais Beach",
  "check_in": "2026-03-15",
  "check_out": "2026-03-18",
  "room_type": "Suite Ocean View",
  "language": "pt-BR"
}
\`\`\`

---

## Resumo Rapido

| # | Maquina | Categoria | Webhook Path |
| --- | --- | --- | --- |
| 1 | Lead Qualifier | Vendas | /webhook/aios-lead-qualifier |
| 2 | Lead to GHL CRM | Vendas | /webhook/aios-lead-to-crm |
| 3 | Outbound Sequence | Vendas | /webhook/aios-outbound-sequence |
| 4 | SEO Keywords | SEO | /webhook/aios-seo-keywords |
| 5 | Blog Generator | Conteudo | /webhook/aios-blog-generator |
| 6 | Content Repurposer | Conteudo | /webhook/aios-content-repurposer |
| 7 | Social Media Factory | Conteudo | /webhook/aios-social-factory |
| 8 | Reputation Analyzer | Reputacao | /webhook/aios-reputation-analyzer |
| 9 | Review Response | Reputacao | /webhook/aios-review-response |
| 10 | Competitor Intel | Analise | /webhook/aios-competitor-intel |
| 11 | Email Sequence | Email | /webhook/aios-email-builder |
| 12 | Email Classifier | Email | /webhook/aios-email-classifier |
| 13 | Ad Copy Machine | Ads | /webhook/aios-ad-copy |
| 14 | Feedback Digest | Operacoes | /webhook/aios-feedback-digest |
| 15 | Meeting Notes | Operacoes | /webhook/aios-meeting-processor |
| 16 | Guest Lifecycle | Operacoes | /webhook/aios-guest-lifecycle |

---

## Status Script

\`\`\`bash
node squads/automation/scripts/n8n-status.mjs
\`\`\`
`;

async function main() {
  // Check if page already exists
  const listRes = await fetch(`${API_V3}/workspaces/${TEAM_ID}/docs/${DOC_ID}/pages`, {
    headers: { 'Authorization': API_KEY }
  });
  const pages = await listRes.json();
  const list = Array.isArray(pages) ? pages : (pages.pages || []);
  const existing = list.find(p => p.name === 'n8n Machines');

  if (existing) {
    // Update existing page
    const res = await fetch(`${API_V3}/workspaces/${TEAM_ID}/docs/${DOC_ID}/pages/${existing.id}`, {
      method: 'PUT',
      headers: { 'Authorization': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'n8n Machines', content, content_format: 'text/md' })
    });
    console.log(`Updated page: ${existing.id} (status: ${res.status})`);
  } else {
    // Create new page
    const res = await fetch(`${API_V3}/workspaces/${TEAM_ID}/docs/${DOC_ID}/pages`, {
      method: 'POST',
      headers: { 'Authorization': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'n8n Machines', content, content_format: 'text/md' })
    });
    const result = await res.json();
    console.log(`Created page: ${result.id} (status: ${res.status})`);
  }

  console.log('Done!');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
