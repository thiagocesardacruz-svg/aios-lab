# Arquitetura de Sistemas Agênticos Autônomos para GoHighLevel

**Source:** External research document
**Date Added:** 2026-02-12
**Type:** Reference Architecture

---

## 1. Introdução: A Mudança de Paradigma para Operações de CRM Agênticas

O ecossistema de marketing digital e gestão de relacionamento com o cliente (CRM) encontra-se atualmente em um ponto de inflexão crítico. Historicamente, a eficiência operacional em plataformas como o GoHighLevel (GHL) era medida pela sofisticação das automações lineares — sequências de regras "se isso, então aquilo" (IFTTT) que, embora poderosas, permanecem fundamentalmente estáticas e frágeis. Estamos agora a transitar para uma era de **Operações Agênticas**, onde a unidade fundamental de trabalho deixa de ser o "workflow" e passa a ser o "agente autônomo".

### 1.1 O Imperativo Operacional e a Necessidade de Especialização

A solução reside na decomposição funcional baseada em papéis, ou **Role-Based Agent Orchestration**. Ao isolar domínios de conhecimento — separando a lógica de engenharia de funis da estratégia de arquitetura de dados do CRM — criamos um sistema modular onde cada agente pode ser otimizado independentemente.

**Cinco agentes especialistas primários:**

1. **O Arquiteto de Snapshots:** Responsável pela macro-configuração, versionamento de ativos e provisionamento de subcontas.
2. **O Engenheiro de Funis:** Encarregado da construção de interfaces, injeção de código e design de experiência do usuário.
3. **O Estruturalista de CRM:** O guardião do esquema de dados, definindo campos personalizados, pipelines e taxonomias de tags.
4. **O Estrategista de Email Marketing:** Focado na criação de templates, lógica de campanhas e deliverability.
5. **O Especialista em Automação:** O engenheiro de lógica que conecta gatilhos, webhooks e ações sistêmicas.

---

## 2. O Substrato Tecnológico: API v2 do GoHighLevel e Protocolo MCP

### 2.1 Arquitetura de Autenticação e Segurança

#### 2.1.1 Tokens de Integração Privada (PIT) para Agentes Internos

- **Mecanismo de Acesso:** PITs operam dentro da infraestrutura segura da v2, sem a complexidade do fluxo OAuth. Token gerado nas configurações da agência/subconta, inserido no cabeçalho `Authorization: Bearer <TOKEN>`.
- **Escopo Granular (Princípio do Privilégio Mínimo):** Gerar PIT específico por agente com escopos limitados (ex: emails.write, campaigns.read).
- **Estabilidade de Sessão:** PITs não expiram a cada 24h como tokens OAuth.

#### 2.1.2 OAuth 2.0 para Escalabilidade de Marketplace

Para produtos SaaS vendidos via Marketplace GHL:
- Implementar servidor de autenticação intermediário
- Agentes com capacidade de "auto-cura" de conexão (refresh token automático)

### 2.2 O Servidor MCP (Model Context Protocol)

Introduzido em outubro de 2025:

- **Abstração de Complexidade:** Elimina necessidade de wrappers Python para cada endpoint
- **Discovery Dinâmico de Ferramentas:** Agente "lê" ferramentas disponíveis automaticamente
- **Contexto em Tempo Real:** Estado de conexão e Location ID persistentes

### 2.3 Gestão de Limites de Taxa

- **Limites:** 100 requisições/10 segundos por recurso, 200.000/dia
- **Arquitetura de Filas:** Gateway de API Interno com Redis/Celery
- **Estratégia:** Exponential Backoff em erros 429

---

## 3. Arquitetura do Sistema Multi-Agente: O Framework CrewAI

### 3.1 A Estrutura da Equipe (The Crew)

| Agente | Função Primária | Dependências de Entrada | Saída (Artifacts) |
|--------|-----------------|-------------------------|-------------------|
| **Arquiteto de Snapshots** | Provisionamento de Contas | Dados do Cliente (Nicho, Nome) | Location_ID, Snapshot_ID |
| **Estruturalista de CRM** | Definição de Dados | Location_ID, Nicho do Cliente | IDs de Campos/Pipelines criados |
| **Engenheiro de Funis** | Construção de Páginas | Esquema de CRM, Objetivos de Venda | Funnel_URL, Mapeamento de Domínio |
| **Estrategista de Marketing** | Criação de Conteúdo | Funnel_URL, Persona do Cliente | IDs de Templates de Email/SMS |
| **Especialista em Automação** | Lógica de Workflow | Gatilhos (Formulários), Ações (Emails) | Workflow_ID (Ativo) |

### 3.2 Gerenciamento de Estado e Memória

- **Memória de Curto Prazo:** CrewAI Task Context
- **Memória de Longo Prazo:** Custom Values do GHL como banco de estado

---

## 4. Agente 1: O Arquiteto de Snapshots

### 4.1 Estratégia de Criação e Gestão

- **Padrão "Master Account":** Gerenciar Subconta Mestre para configurações
- **Acionamento de Snapshot:** Notificar admin ou usar automação de navegador
- **Listagem:** `GET /snapshots` para catálogo atualizado

### 4.2 Provisionamento Automatizado de Subcontas

- **Endpoint:** `POST /locations`
- **Carregamento Atômico:** Passar `snapshotId` na criação

### 4.3 Snapshots de Agentes de IA (LevelUp Out/2025)

- Incluir Conversation AI, prompts, bases de conhecimento nos snapshots
- Push Updates para atualização diferencial

---

## 5. Agente 2: O Engenheiro de Funis

### 5.1 Limitações da API

**Não existe endpoint para criar funis do zero via API.**

- **Estratégia de Clonagem:** `POST /funnels/{funnelId}/steps/{stepId}/clone`
- **Integração com Funnel AI:** Formular prompts para geração interna

### 5.2 Injeção de Código

- **Campos:** `headIncludes`, `bodyIncludes`
- **Endpoint:** `PATCH /funnels/{id}`

### 5.3 Mapeamento de Domínios

- API de Domínios para path mappings
- Validação SSL programática

---

## 6. Agente 3: O Estruturalista de CRM

### 6.1 Campos Personalizados

- **Verificação:** `GET /locations/{id}/customFields`
- **Criação:** `POST /locations/{id}/customFields`
- **Tipos:** TEXT, NUMERICAL, DATE

### 6.2 Pipelines de Vendas

- `POST /opportunities/pipelines`
- Configurar probabilidades por estágio

### 6.3 Objetos Personalizados

- Criar entidades (Apólice, Veículo)
- Estabelecer relacionamentos (1:N, N:M)

---

## 7. Agente 4: O Estrategista de Email Marketing

### 7.1 Templates

- Geração de copy com Brand Voice
- HTML responsivo ou JSON drag-and-drop
- Validação de variáveis (cruzar com campos CRM)

### 7.2 Campanhas e Deliverability

- Database Reactivation com "Stop on Response"
- Conformidade: unsubscribe link, LGPD, CAN-SPAM

---

## 8. Agente 5: O Especialista em Automação

### 8.1 Desafios da API de Workflows

Criar nós IF/ELSE aninhados via JSON é complexo.

- **Padrão "Template Skeleton":** Carregar de Snapshot base
- **Configuração Dinâmica:** Atualizar nós existentes via API

### 8.2 Arquitetura de Webhooks

- Gatilho externo → Processamento off-platform → Fechamento do loop
- Integração com n8n/Make para lógica complexa

### 8.3 Workflow AI

- Configurar prompts de nós de IA internos
- Harmonia entre IA interna (GHL) e externa (CrewAI)

---

## 9. Segurança, Governança e Escala

### 9.1 Gestão de Erros

- Wrappers de resiliência (retry, exponential backoff)
- Validação Pydantic antes de enviar payloads

### 9.2 Human-in-the-Loop (HITL)

Para ações destrutivas:
- Parar e pedir aprovação
- Criar tarefa manual ou notificar via Slack/Discord

---

## Tabelas de Referência

### Mapeamento de Ferramentas MCP

| Ferramenta MCP | Agente Responsável | Uso Prático |
|----------------|-------------------|-------------|
| locations_get-custom-fields | Estruturalista CRM | Verificar campos existentes |
| contacts_upsert-contact | Automação / Todos | Criar/atualizar leads |
| conversations_create-message | Marketing / Automação | SMS/Email follow-up |
| calendars_get-slots | Automação | Verificar disponibilidade |
| opportunities_update-stage | Automação | Mover card no pipeline |

### Estratégia de Rate Limit

| Recurso | Limite GHL | Estratégia |
|---------|------------|------------|
| Requests Gerais | 100/10s | Token Bucket, delay 0.1s |
| Bulk Operations | Variável | Endpoints de batch |
| Webhooks | N/A | Endpoint receptor assíncrono |

---

## Fontes

1. [CrewAI Documentation](https://docs.crewai.com/en/concepts/agents)
2. [HighLevel API Documentation](https://help.gohighlevel.com/support/solutions/articles/48001060529-highlevel-api-documentation)
3. [Highlevel MCP Server](https://marketplace.gohighlevel.com/docs/other/mcp/index.html)
4. [GoHighLevel AI Agent Templates](https://ghl-services-playbooks-automation-crm-marketing.ghost.io/gohighlevel-ai-agent-templates-snapshots-levelup-october-2025-release/)
5. [Create Custom Field API](https://marketplace.gohighlevel.com/docs/ghl/locations/create-custom-field/index.html)
6. [Create Custom Object API](https://marketplace.gohighlevel.com/docs/ghl/objects/create-custom-object-schema/index.html)

---

*Reference document for AIOS GHL Squad implementation*
