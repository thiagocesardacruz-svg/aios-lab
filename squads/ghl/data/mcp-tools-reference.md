# GoHighLevel MCP Tools Reference

## Connection Details

```yaml
endpoint: https://services.leadconnectorhq.com/mcp/
transport: HTTP Streamable
auth: Bearer {Private Integration Token}
```

## Available Tools (36)

### Contacts (8 tools)

| Tool | Method | Description |
|------|--------|-------------|
| `contacts_get-contact` | GET | Obter detalhes de contato |
| `contacts_create-contact` | POST | Criar novo contato |
| `contacts_update-contact` | PUT | Atualizar contato |
| `contacts_delete-contact` | DELETE | Deletar contato |
| `contacts_search-contacts` | GET | Buscar contatos |
| `contacts_add-tag` | POST | Adicionar tag |
| `contacts_remove-tag` | DELETE | Remover tag |
| `contacts_upsert-contact` | POST | Criar ou atualizar |

### Conversations (5 tools)

| Tool | Method | Description |
|------|--------|-------------|
| `conversations_get-conversations` | GET | Listar conversas |
| `conversations_get-conversation` | GET | Detalhes da conversa |
| `conversations_create-message` | POST | Enviar mensagem (SMS/Email) |
| `conversations_update-conversation` | PUT | Atualizar conversa |
| `conversations_delete-conversation` | DELETE | Deletar conversa |

### Calendars (5 tools)

| Tool | Method | Description |
|------|--------|-------------|
| `calendars_get-calendars` | GET | Listar calendários |
| `calendars_get-calendar` | GET | Detalhes do calendário |
| `calendars_get-slots` | GET | Slots disponíveis |
| `calendars_create-appointment` | POST | Criar agendamento |
| `calendars_update-appointment` | PUT | Atualizar agendamento |

### Opportunities (5 tools)

| Tool | Method | Description |
|------|--------|-------------|
| `opportunities_get-opportunities` | GET | Listar oportunidades |
| `opportunities_get-opportunity` | GET | Detalhes da oportunidade |
| `opportunities_create-opportunity` | POST | Criar oportunidade |
| `opportunities_update-opportunity` | PUT | Atualizar oportunidade |
| `opportunities_update-stage` | PUT | Mover estágio pipeline |

### Pipelines (3 tools)

| Tool | Method | Description |
|------|--------|-------------|
| `pipelines_get-pipelines` | GET | Listar pipelines |
| `pipelines_get-pipeline` | GET | Detalhes do pipeline |
| `pipelines_create-pipeline` | POST | Criar pipeline |

### Custom Fields (3 tools)

| Tool | Method | Description |
|------|--------|-------------|
| `locations_get-custom-fields` | GET | Listar campos custom |
| `locations_create-custom-field` | POST | Criar campo custom |
| `locations_delete-custom-field` | DELETE | Deletar campo custom |

### Locations (4 tools)

| Tool | Method | Description |
|------|--------|-------------|
| `locations_get-locations` | GET | Listar subcontas |
| `locations_get-location` | GET | Detalhes da subconta |
| `locations_create-location` | POST | Criar subconta |
| `locations_update-location` | PUT | Atualizar subconta |

### Snapshots (2 tools)

| Tool | Method | Description |
|------|--------|-------------|
| `snapshots_get-snapshots` | GET | Listar snapshots |
| `snapshots_load-snapshot` | POST | Carregar snapshot em conta |

### Emails (3 tools)

| Tool | Method | Description |
|------|--------|-------------|
| `emails_get-templates` | GET | Listar templates |
| `emails_create-template` | POST | Criar template |
| `emails_send-email` | POST | Enviar email |

## Agent Tool Mapping

| Agent | Primary Tools |
|-------|---------------|
| @ghl-snapshot-architect | locations_*, snapshots_* |
| @ghl-crm-structuralist | contacts_*, locations_get-custom-fields, pipelines_* |
| @ghl-funnel-engineer | funnels_* (API v2), sites_* |
| @ghl-email-strategist | emails_*, campaigns_* |
| @ghl-automation-specialist | workflows_*, webhooks_*, conversations_* |

## Tool Naming Convention

```
{resource}_{action}
```

Examples:
- `contacts_get-contact`
- `opportunities_update-stage`
- `locations_create-custom-field`

## Authentication Header

```http
Authorization: Bearer {PIT}
Version: 2021-07-28
Content-Type: application/json
```

---

*MCP Tools Reference v1.0 - GHL Squad*
