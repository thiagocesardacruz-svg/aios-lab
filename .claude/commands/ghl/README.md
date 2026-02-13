# GoHighLevel Squad

Squad especializado em automação e gestão do GoHighLevel CRM.

## Overview

| Aspecto | Detalhes |
|---------|----------|
| **Domain** | Go-to-Market |
| **Lead** | @ghl-automation-specialist |
| **Integração Principal** | GoHighLevel MCP Server (36+ tools) |
| **Rate Limits** | 100 req/10s, 200k/day |

## Agentes

### 1. @ghl-snapshot-architect
**Arquiteto de Snapshots**

Responsável por:
- Provisionamento de subcontas (`POST /locations`)
- Versionamento de snapshots
- Gestão de "Master Account"
- Deploy de AI Agents em snapshots

### 2. @ghl-funnel-engineer
**Engenheiro de Funis**

Responsável por:
- Clonagem e modificação de steps
- Injeção de HTML/CSS/JS
- Mapeamento de domínios
- Validação SSL

### 3. @ghl-crm-structuralist
**Estruturalista de CRM**

Responsável por:
- Campos personalizados
- Pipelines de vendas
- Objetos customizados
- Taxonomias de tags

### 4. @ghl-email-strategist
**Estrategista de Email Marketing**

Responsável por:
- Templates de email
- Campanhas e sequências
- Deliverability
- Conformidade LGPD/CAN-SPAM

### 5. @ghl-automation-specialist (Lead)
**Especialista em Automação**

Responsável por:
- Workflows e gatilhos
- Webhooks e integrações
- Lógica de automação
- Integração com n8n

## Arquitetura de Execução

```
┌─────────────────────────────────────────────────────────────┐
│                    Fluxo Sequencial                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Snapshot Architect ──→ CRM Structuralist ──→ Funnel Eng.  │
│        │                      │                    │        │
│   location_id            custom_field_ids     funnel_url    │
│   snapshot_id            pipeline_ids                       │
│                                                             │
│                              ↓                              │
│                                                             │
│  Email Strategist ←──────────────────── Funnel Engineer    │
│        │                                                    │
│   template_ids                                              │
│                                                             │
│                              ↓                              │
│                                                             │
│              Automation Specialist (Lead)                   │
│                     workflow_id                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Integração MCP

### Endpoint
```
URL: https://services.leadconnectorhq.com/mcp/
Transport: HTTP Streamable
Auth: Bearer {Private Integration Token}
```

### Tools Disponíveis (36)

| Categoria | Tools |
|-----------|-------|
| Contacts | CRUD, search, tags |
| Conversations | SMS, email, calls |
| Calendars | Events, appointments |
| Opportunities | Pipeline, stages |
| Payments | Invoices, transactions |
| Social Media | Posts, scheduling |
| Blogs | Create, edit, publish |
| Email | Campaigns, templates |

## Rate Limiting

| Tipo | Limite | Estratégia |
|------|--------|------------|
| Burst | 100 req/10s | Token Bucket |
| Daily | 200k/day | Monitoring |
| Backoff | Exponential | 3 retries max |

### Implementação
```yaml
rate_limiting:
  strategy: "token-bucket"
  delay_between_requests: "0.1s"
  queue: "redis"
```

## Security

### Princípio do Privilégio Mínimo

Cada agente tem PIT com escopos específicos:

| Agente | Escopos |
|--------|---------|
| Snapshot Architect | locations.*, snapshots.read |
| Funnel Engineer | funnels.*, sites.write |
| CRM Structuralist | contacts.*, opportunities.*, customFields.* |
| Email Strategist | emails.*, campaigns.* |
| Automation Specialist | workflows.*, webhooks.*, contacts.write |

### Human-in-the-Loop (HITL)

Ações que requerem aprovação humana:
- Disparar email para >1000 contatos
- Deletar pipeline
- Deletar contatos em massa
- Modificar configurações de DNS

## Comandos

| Comando | Descrição |
|---------|-----------|
| `/ghl/provision` | Provisionar nova subconta |
| `/ghl/setup-crm` | Configurar esquema CRM |
| `/ghl/deploy-funnel` | Deploy de funil |
| `/ghl/create-campaign` | Criar campanha email |

## Dependências

### Requer
- `tech/` - Setup de MCP e infraestrutura
- `marketing/` - Estratégia de campanhas
- `customer/` - CRM e atendimento

### Provê
- `ghl-automation` - Automações GHL
- `funnel-deployment` - Deploy de funis
- `crm-configuration` - Configuração CRM
- `email-campaigns` - Campanhas de email

## Referências

- [Research: GHL Agentic Architecture](../../docs/research/2026-02-12-platform-automation-capabilities/04-ghl-agentic-architecture-reference.md)
- [HighLevel MCP Server Docs](https://marketplace.gohighlevel.com/docs/other/mcp/index.html)
- [HighLevel API v2](https://marketplace.gohighlevel.com/docs/)

---

*Squad GHL v1.0.0 - AIOS Framework*
