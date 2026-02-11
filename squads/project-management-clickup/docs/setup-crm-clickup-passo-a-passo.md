# Setup CRM ClickUp - Passo a Passo

## Guia Completo para Configurar o Space COMERCIAL

---

## FASE 1: Criar o Space

### Passo 1.1: Criar o Space COMERCIAL

1. No ClickUp, clique em **"+ Add Space"** (barra lateral esquerda)
2. Configure:
   - **Name:** `COMERCIAL`
   - **Icon:** 💰 (ou escolha um ícone de dinheiro)
   - **Color:** Verde ou dourado (representa vendas/dinheiro)
3. Clique em **"Create Space"**

### Passo 1.2: Configurar o Space

1. Clique no ícone de **engrenagem (⚙️)** ao lado do nome do Space
2. Em **"Space Settings"**, configure:
   - ✅ **Statuses** (vamos configurar depois)
   - ✅ **ClickApps:** Habilite:
     - ✅ Custom Fields
     - ✅ Time Tracking
     - ✅ Dependencies
     - ✅ Multiple Assignees
     - ✅ Tags
     - ✅ Priorities
     - ✅ Automations

---

## FASE 2: Criar os Folders

### Passo 2.1: Folder "Pipeline de Vendas"

1. Dentro do Space COMERCIAL, clique em **"+ Add Folder"**
2. **Name:** `Pipeline de Vendas`
3. Clique em **"Create Folder"**

### Passo 2.2: Folder "Clientes"

1. Clique em **"+ Add Folder"**
2. **Name:** `Clientes`
3. Clique em **"Create Folder"**

### Passo 2.3: Folder "Perdidos & Nurture"

1. Clique em **"+ Add Folder"**
2. **Name:** `Perdidos & Nurture`
3. Clique em **"Create Folder"**

---

## FASE 3: Criar as Lists

### 📂 Dentro de "Pipeline de Vendas":

#### List 1: 🎯 Leads (Geral)

1. Dentro do Folder "Pipeline de Vendas", clique **"+ Add List"**
2. **Name:** `🎯 Leads (Geral)`
3. **Statuses** (clique em "Add Status" para cada um):

| Status | Cor | Tipo |
|--------|-----|------|
| 📥 Novo Lead | Cinza | To Do |
| 🔍 Em Qualificação | Azul | In Progress |
| 🎯 Qualificado (Low) | Amarelo | In Progress |
| 📈 Qualificado (Mid/High) | Laranja | In Progress |
| ➡️ Movido para Pipeline | Verde | Complete |
| ❌ Desqualificado | Vermelho | Closed |

#### List 2: 🛒 Low Ticket (Funil Perpétuo)

1. Clique **"+ Add List"**
2. **Name:** `🛒 Low Ticket (Funil Perpétuo)`
3. **Statuses:**

| Status | Cor | Tipo |
|--------|-----|------|
| 📥 Capturado | Cinza | To Do |
| 🔥 Engajado | Azul claro | In Progress |
| 🛒 Iniciou Checkout | Amarelo | In Progress |
| 💳 Pagamento Pendente | Laranja | In Progress |
| ✅ Comprou | Verde | Complete |
| 📈 Upsell Oferecido | Roxo | In Progress |
| ✅ Aceitou Upsell | Verde escuro | Complete |
| ❌ Recusou Upsell | Vermelho claro | Closed |

#### List 3: 📈 Upsell/Cross-sell

1. Clique **"+ Add List"**
2. **Name:** `📈 Upsell/Cross-sell`
3. **Statuses:**

| Status | Cor | Tipo |
|--------|-----|------|
| 🎯 Elegível | Cinza | To Do |
| 📧 Oferta Enviada | Azul | In Progress |
| 🤔 Considerando | Amarelo | In Progress |
| ✅ Converteu | Verde | Complete |
| ❌ Não Interessou | Vermelho | Closed |

#### List 4: 🚀 Lançamento (MCPM)

1. Clique **"+ Add List"**
2. **Name:** `🚀 Lançamento (MCPM)`
3. **Statuses:**

| Status | Cor | Tipo |
|--------|-----|------|
| 📥 Lista de Espera | Cinza | To Do |
| 🔥 CPL 1 | Azul claro | In Progress |
| 🔥 CPL 2 | Azul | In Progress |
| 🔥 CPL 3 | Azul escuro | In Progress |
| 🚀 Carrinho Aberto | Amarelo | In Progress |
| 💳 Iniciou Checkout | Laranja | In Progress |
| 💰 Comprou | Verde | Complete |
| ❌ Não Comprou | Vermelho | Closed |
| 🔄 Remarketing | Roxo | In Progress |

#### List 5: 💎 High Ticket (Mentoria MAV)

1. Clique **"+ Add List"**
2. **Name:** `💎 High Ticket (Mentoria MAV)`
3. **Statuses:**

| Status | Cor | Tipo |
|--------|-----|------|
| 📥 Aplicação Recebida | Cinza | To Do |
| 🤖 Triagem IA | Azul claro | In Progress |
| ✅ Qualificado | Verde claro | In Progress |
| 📅 Call Agendada | Amarelo | In Progress |
| 📞 Call Realizada | Laranja | In Progress |
| 📝 Proposta Enviada | Roxo | In Progress |
| 🤝 Em Negociação | Rosa | In Progress |
| 💰 Fechado | Verde | Complete |
| ❌ Não Fechou | Vermelho | Closed |
| 🔄 Nurture | Azul escuro | In Progress |

---

### 📂 Dentro de "Clientes":

#### List 6: 👥 Base de Clientes

1. Dentro do Folder "Clientes", clique **"+ Add List"**
2. **Name:** `👥 Base de Clientes`
3. **Statuses:**

| Status | Cor | Tipo |
|--------|-----|------|
| 🟢 Ativo | Verde | Active |
| ⏸️ Inativo | Cinza | On Hold |
| 🔄 Em Renovação | Amarelo | In Progress |

#### List 7: 🌟 Clientes VIP

1. Clique **"+ Add List"**
2. **Name:** `🌟 Clientes VIP`
3. **Statuses:** (mesmos do Base de Clientes)

#### List 8: 🔄 Recompra/Renovação

1. Clique **"+ Add List"**
2. **Name:** `🔄 Recompra/Renovação`
3. **Statuses:**

| Status | Cor | Tipo |
|--------|-----|------|
| 🎯 Oportunidade | Cinza | To Do |
| 📧 Contato Feito | Azul | In Progress |
| 🤔 Considerando | Amarelo | In Progress |
| ✅ Recomprou | Verde | Complete |
| ❌ Não Renovou | Vermelho | Closed |

---

### 📂 Dentro de "Perdidos & Nurture":

#### List 9: ❌ Não Convertidos

1. Dentro do Folder "Perdidos & Nurture", clique **"+ Add List"**
2. **Name:** `❌ Não Convertidos`
3. **Statuses:**

| Status | Cor | Tipo |
|--------|-----|------|
| 📊 Para Análise | Cinza | To Do |
| ✅ Analisado | Verde | Complete |

#### List 10: 🌱 Nurture (Longo Prazo)

1. Clique **"+ Add List"**
2. **Name:** `🌱 Nurture (Longo Prazo)`
3. **Statuses:**

| Status | Cor | Tipo |
|--------|-----|------|
| 🌱 Em Nutrição | Verde claro | In Progress |
| 🔥 Reaquecido | Laranja | In Progress |
| 🎯 Pronto para Recontato | Amarelo | In Progress |
| ✅ Converteu | Verde | Complete |

---

## FASE 4: Criar Custom Fields

### Passo 4.1: Custom Fields no NÍVEL DO SPACE

> Esses campos aparecerão em TODAS as Lists do Space

1. Vá em **Space Settings** (⚙️) > **Custom Fields**
2. Clique em **"+ Add Field"** e crie:

#### Campo 1: Origem
- **Type:** Dropdown
- **Name:** `Origem`
- **Options** (clique em "Add Option" para cada):
  ```
  📱 Tráfego Pago - Meta
  📱 Tráfego Pago - Google
  🎬 YouTube Orgânico
  📸 Instagram Orgânico
  🚀 Lançamento MCPM
  🔄 Funil Perpétuo
  👥 Indicação
  📧 Email Marketing
  💬 WhatsApp Direto
  📱 Direct Instagram
  🎯 Lead Magnet
  ```

#### Campo 2: Produto de Interesse
- **Type:** Dropdown
- **Name:** `Produto de Interesse`
- **Options:**
  ```
  📕 Manual dos Pontos Gatilhos
  📗 Protocolos de Atendimento
  📘 A Fórmula do Sucesso
  📙 Método Agenda Mágica
  📒 Manual Pós Operatório
  🎓 Método Cura Pelas Mãos
  💎 Mentoria MAV
  ❓ Não definido
  ```

#### Campo 3: WhatsApp
- **Type:** Phone
- **Name:** `WhatsApp`

#### Campo 4: Valor
- **Type:** Currency (R$)
- **Name:** `Valor`

#### Campo 5: Último Contato
- **Type:** Date
- **Name:** `Último Contato`

#### Campo 6: Próximo Follow-up
- **Type:** Date
- **Name:** `Próximo Follow-up`

---

### Passo 4.2: Custom Fields ESPECÍFICOS por List

#### Para List "🛒 Low Ticket":

1. Abra a List "Low Ticket"
2. Clique em **"+ Add Field"** (no topo da List)
3. Crie:

| Campo | Tipo | Opções |
|-------|------|--------|
| Etapa do Funil | Dropdown | Lead Magnet, Página de Vendas, Checkout |
| Order Bump | Checkbox | - |
| Upsell Aceito | Dropdown | Nenhum, Fórmula do Sucesso, Agenda Mágica, Ambos |
| Valor Total Compra | Currency | - |
| ID Hotmart | Text | - |

#### Para List "🚀 Lançamento (MCPM)":

| Campo | Tipo | Opções |
|-------|------|--------|
| Lançamento | Dropdown | MCPM Mar/25, MCPM Mai/25, MCPM Jul/25... |
| CPL 1 Assistiu | Checkbox | - |
| CPL 2 Assistiu | Checkbox | - |
| CPL 3 Assistiu | Checkbox | - |
| Presença em Lives | Number | - |
| Engajamento Score | Number | - |
| No Grupo WhatsApp | Checkbox | - |

#### Para List "💎 High Ticket (Mentoria MAV)":

| Campo | Tipo | Opções |
|-------|------|--------|
| Score IA | Number | - |
| Fit Score | Dropdown | 🟢 Ideal, 🟡 Bom, 🔴 Baixo |
| Data da Aplicação | Date | - |
| Data da Call | Date | - |
| Closer | People | - |
| Objeção Principal | Dropdown | (ver lista abaixo) |
| Forma de Pagamento | Dropdown | À vista, 12x, 6x |
| Motivo Não Fechou | Dropdown | (ver lista abaixo) |

**Objeções:**
```
💰 Preço / Não tenho dinheiro
⏰ Timing / Não é o momento
🤔 Preciso pensar
👥 Preciso consultar alguém
📚 Já fiz outros cursos
❓ Dúvida sobre resultado
🏠 Mercado local pequeno
```

**Motivos Não Fechou:**
```
💰 Preço
⏰ Timing
🏆 Concorrência
🚫 Não qualificado
📵 Sem resposta
🔄 Desistiu
❓ Outro
```

---

## FASE 5: Criar Views

### Passo 5.1: Views no Space COMERCIAL

1. No Space COMERCIAL, clique em **"+ Add View"**

#### View 1: 💰 Pipeline Geral (Kanban)
- **Type:** Board
- **Name:** `💰 Pipeline Geral`
- **Group by:** Status
- **Show Lists:** Todas (ou filtrar as principais)

#### View 2: 📞 Follow-ups Hoje
- **Type:** List
- **Name:** `📞 Follow-ups Hoje`
- **Filter:**
  - "Próximo Follow-up" = Today
  - OR "Due Date" = Today
- **Sort:** Priority (High to Low)

#### View 3: 🔥 Hot Leads
- **Type:** List
- **Name:** `🔥 Hot Leads`
- **Filter:**
  - Status contains "Checkout" OR "Qualificado" OR "Call"
- **Sort:** Created (Newest first)

#### View 4: 📊 Por Origem
- **Type:** Board
- **Name:** `📊 Por Origem`
- **Group by:** Origem
- **Show:** Count por grupo

---

### Passo 5.2: Views na List "💎 High Ticket"

1. Abra a List "High Ticket"
2. Clique em **"+ Add View"**

#### View: 💎 Pipeline MAV (Kanban)
- **Type:** Board
- **Name:** `Pipeline MAV`
- **Group by:** Status
- **Show fields:** Nome, Fit Score, Data da Call, Closer

#### View: 📅 Calls da Semana
- **Type:** List
- **Name:** `Calls da Semana`
- **Filter:** "Data da Call" is This Week
- **Sort:** Data da Call (Ascending)

#### View: 💵 Forecast
- **Type:** List
- **Name:** `Forecast`
- **Filter:** Status in [Proposta Enviada, Em Negociação]
- **Show:** Sum of "Valor"

---

## FASE 6: Criar Automações

### Passo 6.1: Automações do Space

1. Vá em **Space Settings** > **Automations**
2. Clique em **"+ Add Automation"**

#### Automação 1: Novo Lead - Setar data de entrada

```
TRIGGER: When task is created
ACTION: Set Custom Field "Último Contato" to Today
```

#### Automação 2: Lembrete de Follow-up

```
TRIGGER: When Custom Field "Próximo Follow-up" arrives
ACTION: Send notification to Assignee
        Message: "📞 Follow-up agendado para hoje!"
```

---

### Passo 6.2: Automações da List "Low Ticket"

1. Abra a List "Low Ticket"
2. Vá em **List Settings** > **Automations**

#### Automação: Carrinho Abandonado

```
TRIGGER: When Status changes to "🛒 Iniciou Checkout"
CONDITION: Status unchanged for 2 hours
ACTION:
  - Set Priority to "High"
  - Add Comment: "⚠️ Carrinho abandonado há 2h - recuperar!"
  - Notify Assignee
```

#### Automação: Comprou - Mover para Upsell

```
TRIGGER: When Status changes to "✅ Comprou"
ACTION:
  - Set Status to "📈 Upsell Oferecido"
  - Add Comment: "🎉 Compra confirmada! Iniciar sequência de upsell."
```

---

### Passo 6.3: Automações da List "High Ticket"

#### Automação: Nova Aplicação

```
TRIGGER: When task is created
ACTION:
  - Set Status to "📥 Aplicação Recebida"
  - Set Custom Field "Data da Aplicação" to Today
  - Notify @rafael
  - Add Comment: "📝 Nova aplicação recebida - aguardando triagem"
```

#### Automação: Qualificado - Agendar Call

```
TRIGGER: When Status changes to "✅ Qualificado"
ACTION:
  - Set Due Date to 2 days from now
  - Notify Closer
  - Add Comment: "✅ Lead qualificado! Agendar call em até 48h."
```

#### Automação: Lembrete de Call

```
TRIGGER: When Custom Field "Data da Call" is tomorrow
ACTION:
  - Notify Assignee
  - Notify Closer
  - Add Comment: "📅 Call amanhã! Preparar roteiro."
```

#### Automação: Fechou - Celebrar!

```
TRIGGER: When Status changes to "💰 Fechado"
ACTION:
  - Notify @rafael
  - Add Comment: "🎉🎉🎉 VENDA FECHADA! Mentoria MAV!"
  - Set Priority to "None"
```

#### Automação: Proposta sem resposta

```
TRIGGER: When Status is "📝 Proposta Enviada"
CONDITION: Status unchanged for 3 days
ACTION:
  - Set Priority to "High"
  - Notify Closer
  - Add Comment: "⚠️ Proposta sem resposta há 3 dias - fazer follow-up!"
```

---

## FASE 7: Criar Templates de Task

### Passo 7.1: Template para Lead

1. Crie uma task modelo em "Leads (Geral)"
2. Preencha:
   - **Title:** `[NOME] - [PRODUTO]`
   - **Description:**
   ```
   ## Dados do Lead

   **Nome:**
   **Email:**
   **WhatsApp:**
   **Origem:**
   **Produto de Interesse:**

   ## Histórico de Contatos

   | Data | Canal | Resumo |
   |------|-------|--------|
   |  |  |  |

   ## Próximos Passos

   - [ ]
   ```
3. Clique nos **3 pontinhos** > **Save as Template**
4. **Name:** `Template - Novo Lead`

### Passo 7.2: Template para Aplicação MAV

1. Crie uma task modelo em "High Ticket"
2. Preencha:
   - **Title:** `[NOME] - Mentoria MAV`
   - **Description:**
   ```
   ## Dados da Aplicação

   **Nome:**
   **Email:**
   **WhatsApp:**
   **Data da Aplicação:**

   ## Respostas do Formulário

   **1. Qual sua experiência atual?**


   **2. Qual seu faturamento atual?**


   **3. Qual seu objetivo com a mentoria?**


   **4. Por que agora?**


   ## Triagem IA

   **Score:** /100
   **Fit:**
   **Recomendação:**

   ## Histórico

   | Data | Ação | Notas |
   |------|------|-------|
   |  |  |  |

   ## Call de Vendas

   **Data:**
   **Closer:**
   **Duração:**
   **Resumo:**

   ## Objeções Identificadas

   - [ ]

   ## Próximos Passos

   - [ ]
   ```
3. Salve como Template: `Template - Aplicação MAV`

---

## FASE 8: Checklist Final

### Estrutura Criada

- [ ] Space COMERCIAL criado
- [ ] Folder "Pipeline de Vendas" criado
- [ ] Folder "Clientes" criado
- [ ] Folder "Perdidos & Nurture" criado

### Lists Criadas

- [ ] 🎯 Leads (Geral)
- [ ] 🛒 Low Ticket (Funil Perpétuo)
- [ ] 📈 Upsell/Cross-sell
- [ ] 🚀 Lançamento (MCPM)
- [ ] 💎 High Ticket (Mentoria MAV)
- [ ] 👥 Base de Clientes
- [ ] 🌟 Clientes VIP
- [ ] 🔄 Recompra/Renovação
- [ ] ❌ Não Convertidos
- [ ] 🌱 Nurture (Longo Prazo)

### Custom Fields Criados

- [ ] Origem (Space level)
- [ ] Produto de Interesse (Space level)
- [ ] WhatsApp (Space level)
- [ ] Valor (Space level)
- [ ] Último Contato (Space level)
- [ ] Próximo Follow-up (Space level)
- [ ] Campos específicos de Low Ticket
- [ ] Campos específicos de Lançamento
- [ ] Campos específicos de High Ticket

### Views Criadas

- [ ] 💰 Pipeline Geral (Kanban)
- [ ] 📞 Follow-ups Hoje
- [ ] 🔥 Hot Leads
- [ ] 📊 Por Origem
- [ ] Pipeline MAV (na List High Ticket)
- [ ] Calls da Semana (na List High Ticket)
- [ ] Forecast (na List High Ticket)

### Automações Criadas

- [ ] Novo Lead - Setar data
- [ ] Lembrete de Follow-up
- [ ] Carrinho Abandonado
- [ ] Comprou - Mover para Upsell
- [ ] Nova Aplicação MAV
- [ ] Qualificado - Agendar Call
- [ ] Lembrete de Call
- [ ] Fechou - Celebrar
- [ ] Proposta sem resposta

### Templates Criados

- [ ] Template - Novo Lead
- [ ] Template - Aplicação MAV

---

## Tempo Estimado de Setup

| Fase | Tempo |
|------|-------|
| Fase 1: Space | 5 min |
| Fase 2: Folders | 5 min |
| Fase 3: Lists + Statuses | 30 min |
| Fase 4: Custom Fields | 30 min |
| Fase 5: Views | 20 min |
| Fase 6: Automações | 30 min |
| Fase 7: Templates | 15 min |
| **Total** | **~2h 15min** |

---

## Dúvidas Frequentes

**P: Posso alterar os statuses depois?**
R: Sim! Clique no status e edite. Tasks existentes serão atualizadas.

**P: Como importar leads existentes?**
R: Use a função de Import (CSV) do ClickUp ou crie manualmente.

**P: As automações funcionam em mobile?**
R: Sim, elas rodam no servidor do ClickUp automaticamente.

**P: Posso adicionar mais campos depois?**
R: Sim! Custom Fields podem ser adicionados a qualquer momento.

---

**Documento criado pelo Squad Project Management ClickUp**
**Versão:** 1.0 | **Data:** 2025-02-03
