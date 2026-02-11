# Automações do CRM - Guia de Configuração

## Importante: Limitação da API

A API do ClickUp **não permite criar Automations programaticamente**. As automações devem ser configuradas manualmente através da interface web.

Este guia fornece instruções passo a passo para configurar cada automação.

---

## Como Criar uma Automação no ClickUp

1. Acesse a **List** onde quer criar a automação
2. Clique no ícone de **raio (⚡)** ou **"Automate"**
3. Clique em **"+ Create Automation"**
4. Configure **Trigger** → **Conditions** (opcional) → **Actions**
5. Dê um nome e clique em **"Create"**

---

## Automações por Pipeline

### 🎯 List: Leads (Geral)

#### Automação 1: Novo Lead - Setar Data de Entrada
```
📍 List: 🎯 Leads (Geral)

TRIGGER: When a task is created

ACTIONS:
  1. Set Custom Field "Último Contato" → Today
  2. Add comment → "📥 Novo lead capturado em {date}"
```

**Passo a passo:**
1. Abra a List "🎯 Leads (Geral)"
2. Clique em ⚡ Automate → + Create Automation
3. Trigger: "When task is created"
4. Action 1: "Set Custom Field" → "Último Contato" → "Today"
5. Action 2: "Add comment" → "📥 Novo lead capturado em {date}"
6. Nome: "Novo Lead - Setar Data"
7. Create

---

### 🛒 List: Low Ticket (Funil Perpétuo)

#### Automação 2: Carrinho Abandonado (2h)
```
📍 List: 🛒 Low Ticket (Funil Perpétuo)

TRIGGER: When status changes to "🛒 Iniciou Checkout"

CONDITIONS:
  - Wait 2 hours
  - Status is still "🛒 Iniciou Checkout"

ACTIONS:
  1. Set Priority → High
  2. Add comment → "⚠️ CARRINHO ABANDONADO há 2h - Recuperar urgente!"
  3. Send notification to Assignee
```

**Passo a passo:**
1. Abra a List "🛒 Low Ticket"
2. Clique em ⚡ Automate → + Create Automation
3. Trigger: "When status changes" → "to 🛒 Iniciou Checkout"
4. Condition: "Wait" → "2 hours"
5. Condition: "Status" → "is 🛒 Iniciou Checkout" (ainda está no mesmo status)
6. Action 1: "Set Priority" → "High"
7. Action 2: "Add comment" → "⚠️ CARRINHO ABANDONADO há 2h - Recuperar urgente!"
8. Action 3: "Send notification" → "Assignee"
9. Nome: "Carrinho Abandonado 2h"
10. Create

#### Automação 3: Compra Confirmada - Mover para Upsell
```
📍 List: 🛒 Low Ticket (Funil Perpétuo)

TRIGGER: When status changes to "✅ Comprou"

ACTIONS:
  1. Change status → "📈 Upsell Oferecido"
  2. Add comment → "🎉 COMPRA CONFIRMADA! Iniciando sequência de upsell."
  3. Send notification to Assignee
```

#### Automação 4: Boleto Pendente - Lembrete D+1
```
📍 List: 🛒 Low Ticket (Funil Perpétuo)

TRIGGER: When status changes to "💳 Pagamento Pendente"

CONDITIONS:
  - Wait 1 day

ACTIONS:
  1. Add comment → "📩 Lembrete D+1: Boleto ainda não pago. Enviar mensagem de recuperação."
  2. Send notification to Assignee
```

#### Automação 5: Boleto Pendente - Lembrete D+2
```
📍 List: 🛒 Low Ticket (Funil Perpétuo)

TRIGGER: When status changes to "💳 Pagamento Pendente"

CONDITIONS:
  - Wait 2 days

ACTIONS:
  1. Add comment → "📩 Lembrete D+2: Verificar se cliente precisa de ajuda com o boleto."
```

#### Automação 6: Boleto Pendente - Último Lembrete D+3
```
📍 List: 🛒 Low Ticket (Funil Perpétuo)

TRIGGER: When status changes to "💳 Pagamento Pendente"

CONDITIONS:
  - Wait 3 days

ACTIONS:
  1. Set Priority → Urgent
  2. Add comment → "🚨 ÚLTIMO LEMBRETE D+3: Boleto vence hoje! Contato urgente."
```

---

### 🚀 List: Lançamento (MCPM)

#### Automação 7: Novo Lead de Lançamento
```
📍 List: 🚀 Lançamento (MCPM)

TRIGGER: When a task is created

ACTIONS:
  1. Set status → "📥 Lista de Espera"
  2. Set Custom Field "Último Contato" → Today
  3. Add comment → "📥 Lead capturado para lançamento MCPM"
```

#### Automação 8: Carrinho Aberto - Alerta
```
📍 List: 🚀 Lançamento (MCPM)

TRIGGER: When status changes to "🚀 Carrinho Aberto"

ACTIONS:
  1. Set Priority → High
  2. Add comment → "🚀 CARRINHO ABERTO! Iniciar sequência de vendas."
  3. Send notification to Watchers
```

#### Automação 9: Compra no Lançamento
```
📍 List: 🚀 Lançamento (MCPM)

TRIGGER: When status changes to "💰 Comprou"

ACTIONS:
  1. Add comment → "🎉🎉🎉 VENDA NO LANÇAMENTO! Método Cura Pelas Mãos"
  2. Send notification to @rafael
```

#### Automação 10: Não Comprou - Mover para Remarketing
```
📍 List: 🚀 Lançamento (MCPM)

TRIGGER: When status changes to "❌ Não Comprou"

CONDITIONS:
  - Wait 1 day (após fim do carrinho)

ACTIONS:
  1. Change status → "🔄 Remarketing"
  2. Add comment → "🔄 Movido para remarketing. Nutrir para próximo lançamento."
```

---

### 💎 List: High Ticket (Mentoria MAV)

#### Automação 11: Nova Aplicação Recebida
```
📍 List: 💎 High Ticket (Mentoria MAV)

TRIGGER: When a task is created

ACTIONS:
  1. Set status → "📥 Aplicação Recebida"
  2. Set Custom Field "Data da Aplicação" → Today
  3. Add comment → "📝 Nova aplicação para Mentoria MAV recebida!"
  4. Send notification to @rafael
```

#### Automação 12: Lead Qualificado - Agendar Call
```
📍 List: 💎 High Ticket (Mentoria MAV)

TRIGGER: When status changes to "✅ Qualificado"

ACTIONS:
  1. Set due date → 2 days from now
  2. Add comment → "✅ Lead QUALIFICADO! Agendar call em até 48h."
  3. Send notification to Closer
```

#### Automação 13: Lembrete de Call (D-1)
```
📍 List: 💎 High Ticket (Mentoria MAV)

TRIGGER: When Custom Field "Data da Call" is tomorrow

ACTIONS:
  1. Add comment → "📅 CALL AMANHÃ! Preparar roteiro e revisar perfil do lead."
  2. Send notification to Closer
  3. Add checklist "Preparação Call" com itens:
     - [ ] Revisar formulário de aplicação
     - [ ] Preparar perguntas de diagnóstico
     - [ ] Verificar objeções comuns
     - [ ] Ter proposta pronta
```

#### Automação 14: Call Realizada - Follow-up
```
📍 List: 💎 High Ticket (Mentoria MAV)

TRIGGER: When status changes to "📞 Call Realizada"

CONDITIONS:
  - Wait 24 hours
  - Status is still "📞 Call Realizada"

ACTIONS:
  1. Set Priority → High
  2. Add comment → "⚠️ Call realizada há 24h sem proposta enviada. Definir próximo passo!"
  3. Send notification to Closer
```

#### Automação 15: Proposta Sem Resposta (3 dias)
```
📍 List: 💎 High Ticket (Mentoria MAV)

TRIGGER: When status changes to "📝 Proposta Enviada"

CONDITIONS:
  - Wait 3 days
  - Status is still "📝 Proposta Enviada"

ACTIONS:
  1. Set Priority → Urgent
  2. Add comment → "🚨 PROPOSTA SEM RESPOSTA há 3 dias! Follow-up urgente."
  3. Send notification to Closer
```

#### Automação 16: Proposta Sem Resposta (7 dias)
```
📍 List: 💎 High Ticket (Mentoria MAV)

TRIGGER: When status changes to "📝 Proposta Enviada"

CONDITIONS:
  - Wait 7 days
  - Status is still "📝 Proposta Enviada"

ACTIONS:
  1. Add comment → "📊 Proposta sem resposta há 7 dias. Considerar mover para Nurture."
```

#### Automação 17: VENDA FECHADA! 🎉
```
📍 List: 💎 High Ticket (Mentoria MAV)

TRIGGER: When status changes to "💰 Fechado"

ACTIONS:
  1. Add comment → "🎉🎉🎉 MENTORIA MAV VENDIDA! Parabéns! Valor: R$ 10.997"
  2. Send notification to @rafael
  3. Send notification to @natalia
  4. Set Priority → None
  5. Create task in "🌟 Clientes VIP" → "Onboarding: {task_name}"
```

#### Automação 18: Não Fechou - Documentar e Nurture
```
📍 List: 💎 High Ticket (Mentoria MAV)

TRIGGER: When status changes to "❌ Não Fechou"

ACTIONS:
  1. Add comment → "❌ Não fechou. Documentar motivo e mover para Nurture em 30 dias."
  2. Create subtask → "Documentar motivo da perda"
```

---

### 📞 Automações de Follow-up (Todas as Lists)

#### Automação 19: Lembrete de Follow-up
```
📍 Space: COMERCIAL (aplica a todas as Lists)

TRIGGER: When Custom Field "Próximo Follow-up" arrives (is today)

ACTIONS:
  1. Send notification to Assignee → "📞 Follow-up agendado para HOJE!"
  2. Set Priority → High
```

#### Automação 20: Lead Esfriando (7 dias sem contato)
```
📍 Space: COMERCIAL

TRIGGER: When Custom Field "Último Contato" is 7 days ago

CONDITIONS:
  - Status is not "✅ Comprou" / "💰 Fechado" / "❌ Não Fechou"

ACTIONS:
  1. Add comment → "⚠️ LEAD ESFRIANDO! Sem contato há 7 dias."
  2. Set Priority → High
  3. Send notification to Assignee
```

---

## Resumo das Automações

| # | Nome | List | Trigger | Ação Principal |
|---|------|------|---------|----------------|
| 1 | Novo Lead | Leads | Task created | Setar data |
| 2 | Carrinho Abandonado 2h | Low Ticket | Status → Checkout + 2h | Alerta urgente |
| 3 | Compra → Upsell | Low Ticket | Status → Comprou | Mover para upsell |
| 4 | Boleto D+1 | Low Ticket | Status → Pag. Pendente + 1d | Lembrete |
| 5 | Boleto D+2 | Low Ticket | Status → Pag. Pendente + 2d | Lembrete |
| 6 | Boleto D+3 | Low Ticket | Status → Pag. Pendente + 3d | Urgente |
| 7 | Novo Lead Lançamento | Lançamento | Task created | Setar status |
| 8 | Carrinho Aberto | Lançamento | Status → Carrinho | Alerta |
| 9 | Compra Lançamento | Lançamento | Status → Comprou | Celebrar |
| 10 | Não Comprou → Remarketing | Lançamento | Status → Não Comprou | Mover |
| 11 | Nova Aplicação MAV | High Ticket | Task created | Notificar Rafael |
| 12 | Qualificado → Call | High Ticket | Status → Qualificado | Agendar |
| 13 | Lembrete Call D-1 | High Ticket | Data Call = Amanhã | Preparar |
| 14 | Call sem Proposta | High Ticket | Status → Call + 24h | Follow-up |
| 15 | Proposta 3 dias | High Ticket | Status → Proposta + 3d | Urgente |
| 16 | Proposta 7 dias | High Ticket | Status → Proposta + 7d | Avaliar |
| 17 | VENDA MAV | High Ticket | Status → Fechado | Celebrar! |
| 18 | Não Fechou | High Ticket | Status → Não Fechou | Documentar |
| 19 | Lembrete Follow-up | COMERCIAL | Próximo Follow-up = Hoje | Notificar |
| 20 | Lead Esfriando | COMERCIAL | Último Contato = 7d atrás | Alerta |

---

## Tempo Estimado de Configuração

| Automações | Tempo por automação | Total |
|------------|---------------------|-------|
| 20 automações | ~3-5 min cada | ~60-90 min |

---

## Dicas

1. **Comece pelas mais críticas**: Carrinho Abandonado, Nova Aplicação MAV, Venda Fechada
2. **Teste cada automação** criando uma task de teste
3. **Use "Send notification"** com parcimônia para não sobrecarregar
4. **Automações de Wait** podem ser configuradas com minutos, horas ou dias
5. **Combine múltiplas actions** em uma única automação quando fizer sentido

---

## Integração com WhatsApp/Email

Para enviar mensagens automáticas para o **lead** (não apenas notificações internas), você precisará:

1. **Usar Webhooks** (script `setup-crm-webhooks.cjs`)
2. **Conectar a uma ferramenta de automação** (n8n, Make, Zapier)
3. **Integrar com WhatsApp** (ManyChat, WAHA) ou **Email** (ActiveCampaign)

Exemplo de fluxo:
```
ClickUp (Webhook) → n8n → ManyChat → WhatsApp do Lead
```

---

**Documento criado pelo Squad Project Management ClickUp**
**Versão:** 1.0 | **Data:** 2025-02-03
