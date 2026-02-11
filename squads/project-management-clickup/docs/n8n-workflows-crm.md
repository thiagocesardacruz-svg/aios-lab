# Workflows N8N - CRM ClickUp

## Webhooks Configurados no ClickUp

Os seguintes webhooks foram criados e estão enviando eventos para o N8N:

| Webhook ID | Evento | Endpoint N8N |
|------------|--------|--------------|
| `61f1fe1a-d231-411c-8209-cba171b546e5` | Task Criada | `https://n8n.nataliatanaka.com.br/webhook/clickup-crm/task-created` |
| `957fb155-1c05-4131-bd48-1ca364459b39` | Status Alterado | `https://n8n.nataliatanaka.com.br/webhook/clickup-crm/task-status-updated` |
| `80233de5-4c4a-4d4a-8d88-b63b7fbbb27f` | Task Atualizada | `https://n8n.nataliatanaka.com.br/webhook/clickup-crm/task-updated` |
| `3b86c6f7-1d32-44cd-9abc-6eff93ab1cf9` | Comentário | `https://n8n.nataliatanaka.com.br/webhook/clickup-crm/task-comment` |

---

## Workflows a Criar no N8N

### 1. Workflow: Novo Lead Criado

**Endpoint:** `POST /webhook/clickup-crm/task-created`

**Trigger:** Webhook Node
- Method: POST
- Path: `clickup-crm/task-created`

**Payload do ClickUp:**
```json
{
  "event": "taskCreated",
  "task_id": "abc123",
  "webhook_id": "61f1fe1a-d231-411c-8209-cba171b546e5",
  "history_items": [
    {
      "id": "...",
      "type": 1,
      "date": "1234567890",
      "field": "status",
      "before": {...},
      "after": {...}
    }
  ]
}
```

**Ações Sugeridas:**
1. **Buscar detalhes da task** (HTTP Request para ClickUp API)
2. **Criar/atualizar contato no ActiveCampaign**
3. **Enviar mensagem de boas-vindas via WhatsApp (WAHA)**
4. **Adicionar tag no ActiveCampaign** baseado na origem

**Nodes:**
```
[Webhook] → [HTTP Request: Get Task] → [Switch: Verificar Origem]
                                            ↓
                        [ActiveCampaign: Create/Update Contact]
                                            ↓
                        [IF: Tem WhatsApp?] → [WAHA: Send Message]
```

---

### 2. Workflow: Status Alterado (Pipeline)

**Endpoint:** `POST /webhook/clickup-crm/task-status-updated`

**Trigger:** Webhook Node
- Method: POST
- Path: `clickup-crm/task-status-updated`

**Payload do ClickUp:**
```json
{
  "event": "taskStatusUpdated",
  "task_id": "abc123",
  "webhook_id": "957fb155-1c05-4131-bd48-1ca364459b39",
  "history_items": [
    {
      "field": "status",
      "before": {
        "status": "Novo Lead",
        "type": "open"
      },
      "after": {
        "status": "Comprou",
        "type": "closed"
      }
    }
  ]
}
```

**Ações por Status:**

| De | Para | Ação |
|----|------|------|
| * | Qualificado | Notificar closer via WhatsApp |
| * | Em Negociação | Iniciar sequência de follow-up |
| * | Carrinho Abandonado | Disparar recuperação (WhatsApp + Email) |
| * | Comprou | Mover para Base de Clientes, tag "cliente" no AC |
| * | Não Qualificado | Mover para Nurture, remover de sequências |

**Nodes:**
```
[Webhook] → [HTTP Request: Get Task] → [Switch: Status Anterior/Novo]
                                            ↓
            ┌───────────────────────────────┼───────────────────────────────┐
            ↓                               ↓                               ↓
    [Comprou]                       [Carrinho Abandonado]           [Qualificado]
        ↓                                   ↓                               ↓
[AC: Add Tag "cliente"]           [Wait 30min]                    [WAHA: Notificar Closer]
        ↓                                   ↓
[ClickUp: Move to Clientes]       [WAHA: Msg Recuperação]
                                            ↓
                                  [AC: Trigger Automation]
```

---

### 3. Workflow: Task Atualizada

**Endpoint:** `POST /webhook/clickup-crm/task-updated`

**Trigger:** Webhook Node
- Method: POST
- Path: `clickup-crm/task-updated`

**Casos de Uso:**
- Campo "Próximo Follow-up" atualizado → Agendar lembrete
- Campo "Valor" atualizado → Atualizar no ActiveCampaign
- Campo "WhatsApp" preenchido → Enviar mensagem inicial

**Nodes:**
```
[Webhook] → [Switch: Campo Alterado]
                    ↓
    ┌───────────────┼───────────────┐
    ↓               ↓               ↓
[Follow-up]     [Valor]         [WhatsApp]
    ↓               ↓               ↓
[Schedule]    [AC: Update]    [WAHA: Send]
```

---

### 4. Workflow: Comentário Adicionado

**Endpoint:** `POST /webhook/clickup-crm/task-comment`

**Trigger:** Webhook Node
- Method: POST
- Path: `clickup-crm/task-comment`

**Casos de Uso:**
- Comentário com "@closer" → Notificar closer via WhatsApp
- Comentário com "#urgente" → Criar tarefa de follow-up imediato

---

## Configuração de Credenciais no N8N

### ClickUp API
```
Name: ClickUp CRM
API Token: (usar do .env)
```

### ActiveCampaign
```
Name: ActiveCampaign Natália
API URL: https://nataliatanaka.api-us1.com
API Key: (usar do .env)
```

### WAHA (WhatsApp)
```
Name: WAHA API
Base URL: https://waha.nataliatanaka.com.br
API Token: (usar do .env)
```

---

## Templates de Mensagem WhatsApp

### Boas-vindas Novo Lead
```
Olá {{nome}}! 👋

Obrigada por se interessar pelo {{produto}}!

Sou a assistente virtual da Natália Tanaka e estou aqui para te ajudar.

Tem alguma dúvida específica que eu possa esclarecer?
```

### Recuperação de Carrinho
```
Oi {{nome}}!

Vi que você se interessou pelo {{produto}} mas não finalizou a compra.

Aconteceu algum problema? Posso te ajudar com alguma dúvida?

O link ainda está disponível: {{link_checkout}}
```

### Notificação Closer (Lead Qualificado)
```
🎯 NOVO LEAD QUALIFICADO

Nome: {{nome}}
Produto: Mentoria MAV
WhatsApp: {{whatsapp}}
Fit Score: {{fit_score}}

Acessar no ClickUp: {{task_url}}
```

---

## IDs Importantes

```javascript
// Space COMERCIAL
const SPACE_ID = "901313097927";

// Listas do Pipeline
const LISTS = {
  leads: "901325077568",
  lowTicket: "901325077571",
  upsell: "901325077575",
  lancamento: "901325077580",
  highTicket: "901325077585",
  clientes: "901325077592",
  vip: "901325077600",
  recompra: "901325077604",
  naoConvertidos: "901325077610",
  nurture: "901325077615"
};
```

---

## Testando os Webhooks

1. Acesse o N8N e crie um workflow simples com Webhook trigger
2. Configure o path correto (ex: `clickup-crm/task-created`)
3. Ative o workflow
4. Crie uma task no Space COMERCIAL do ClickUp
5. Verifique se o N8N recebeu o evento

Para verificar webhooks existentes:
```bash
node setup-crm-webhooks.cjs list
```

Para recriar webhooks:
```bash
node setup-crm-webhooks.cjs delete-all
node setup-crm-webhooks.cjs create
```
