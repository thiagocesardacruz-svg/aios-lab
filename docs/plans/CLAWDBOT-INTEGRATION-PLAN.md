# Plano de Integração: Clawdbot + AIOS Lab

**Criado:** 2026-02-12
**Status:** Waves 1-3 Completas
**Owner:** @pm
**Última Atualização:** 2026-02-12
**Contexto:** Sessão de planejamento com @aios-master, @architect, @devops, Board

---

## Visão Geral

### Arquitetura

```
Claude Code (AIOS Lab) = Motor Principal de Produção
├── 19 squads, 44 agents
├── Otimização de custos (model routing)
├── Ferramentas locais (DuckDB, FastMCP, etc.)
├── ONDE O TRABALHO REAL ACONTECE
│
Clawdbot = Extensão (não substituto)
├── Acesso quando terminal está OFF
├── Comandos via Slack
├── Automações n8n/GHL background
├── Scripts determinísticos (zero-cost)
├── Sync ClickUp contínuo
└── Modelo configurável (economia em foco)
```

### Princípios

1. **Claude Code é o foco principal** - produção massiva aqui
2. **Clawdbot estende capacidades** - não me limita ao terminal
3. **Economia sempre** - scripts determinísticos, model routing
4. **Documentação unificada** - single source of truth
5. **Memória compartilhada** - activity-logger, memory-query (PR#30)

---

## Wave 1: Documentação Unificada (Prioridade Alta)

### Objetivo
Migrar e consolidar documentação de `thiago-os` para `aios-lab`

### Tasks

#### 1.1 Criar estrutura Clawdbot no squad ops
- [x] Criar pasta `squads/ops/clawdbot/`
- [x] Criar `squads/ops/clawdbot/README.md` (overview)
- **Arquivos a criar:**
  ```
  squads/ops/clawdbot/
  ├── README.md                  # Overview, como usar
  ├── OPERATIONAL-DIRECTIVE.md   # Identidade, princípios, limites
  ├── COMMANDS.md                # Comandos Slack disponíveis
  ├── INTEGRATIONS.md            # n8n, GHL, Notion, ClickUp
  └── scripts/                   # Python scripts EC2 (referência)
  ```

#### 1.2 Migrar documentos essenciais de thiago-os
- [x] Copiar conteúdo relevante de:
  - `16-CLAWDBOT-OPERATIONAL-DIRECTIVE.md` → `OPERATIONAL-DIRECTIVE.md`
  - `43-CLAWDBOT-COMMS-CONTRACT.md` → `COMMANDS.md`
  - `27-COMMAND-MATRIX-COMPLETE.md` → Extrair comandos Slack
  - `30-N8N-WORKFLOWS-SPEC.md` → `INTEGRATIONS.md`

#### 1.3 Atualizar CLAUDE.md
- [x] Adicionar seção "Clawdbot Integration"
- [x] Documentar como delegar tarefas para Clawdbot
- [x] Listar comandos Slack disponíveis

**Estimativa:** 3-4 horas
**Owner:** @pm

---

## Wave 2: Integração ClickUp (Prioridade Alta)

### Objetivo
Sincronizar tasks entre Claude Code e Clawdbot via ClickUp

### Tasks

#### 2.1 Adicionar campos customizados no ClickUp
- [ ] Campo: "Execution Mode" (SESSION | DAEMON)
- [ ] Campo: "Clawdbot Script" (texto)
- [ ] Status: "daemon_queue" (para tasks do Clawdbot)
- **Script:** `node squads/project-management-clickup/scripts/create-fields-all-spaces.mjs`

#### 2.2 Criar script de delegação
- [x] Criar `squads/ops/scripts/delegate-to-clawdbot.mjs`
- **Funcionalidade:**
  - Cria task no ClickUp com tag `clawdbot:execute`
  - Define Execution Mode = DAEMON
  - Especifica script a executar
  - Retorna task_id para tracking

#### 2.3 Criar webhook/poller no Clawdbot (AWS)
- [ ] Script Python que poll ClickUp a cada 5 min
- [ ] Filtra tasks com tag `clawdbot:execute`
- [ ] Executa e atualiza status
- **Localização:** EC2 `/opt/clawdbot/task_poller.py`

**Estimativa:** 4-5 horas
**Owner:** @devops

---

## Wave 3: Budget Unificado (Prioridade Média)

### Objetivo
Single source of truth para tracking de custos

### Tasks

#### 3.1 Unificar budget tracking
- [ ] Atualizar `squads/ops/scripts/cost-tracker.mjs` para suportar fonte "clawdbot"
- [ ] Criar endpoint/webhook para Clawdbot reportar custos
- [ ] Ou: Clawdbot atualiza ClickUp Goals diretamente

#### 3.2 Sincronizar limites
- [x] Criar `shared/budget-limits.yaml`:
  ```yaml
  daily_alert: 15  # EUR
  daily_hard: 20   # EUR
  monthly: 468     # EUR
  per_task: 10     # EUR
  ```
- [ ] Claude Code lê deste arquivo
- [ ] Clawdbot faz git pull e lê mesmo arquivo

#### 3.3 SAFE_MODE unificado
- [ ] Definir como SAFE_MODE propaga entre sistemas
- [ ] Clawdbot pode ativar SAFE_MODE via ClickUp status
- [ ] Claude Code respeita SAFE_MODE do Clawdbot

**Estimativa:** 3-4 horas
**Owner:** @devops

---

## Wave 4: Scripts Determinísticos (Prioridade Média)

### Objetivo
Criar scripts zero-cost no Clawdbot (mesma filosofia do AIOS Lab)

### Tasks

#### 4.1 Documentar scripts existentes
- [ ] Listar 6 scripts Python do EC2:
  - `state_manager.py` - Single writer state
  - `spend_monitor.py` - Cost tracking
  - `health_check.py` - System health
  - `context_sync.py` - Notion sync
  - `so_executor.py` - Service Order execution
  - `finance_import.py` - Finance CSV import

#### 4.2 Criar novos scripts determinísticos
- [ ] `clickup_sync.py` - Sync bidirecional com ClickUp
- [ ] `daily_digest.py` - Gera resumo diário (sem AI)
- [ ] `lead_processor.py` - Processa leads do GHL

#### 4.3 Integrar com sistema de memória (PR#30)
- [ ] Clawdbot usa mesmo formato de logs
- [ ] Logs salvos em `.aios/logs/activity/`
- [ ] Pode ser queryado via `memory-query.mjs`

**Estimativa:** 5-6 horas
**Owner:** @dev

---

## Wave 5: Memória Compartilhada (Prioridade Baixa)

### Objetivo
Ambos sistemas acessam mesma memória institucional

### Tasks

#### 5.1 Sincronizar logs
- [ ] Clawdbot escreve logs no mesmo formato JSONL
- [ ] Git sync: EC2 → aios-lab (ou vice-versa)
- [ ] Ou: Logs em ClickUp comments (acessível por ambos)

#### 5.2 Decisões compartilhadas
- [ ] Clawdbot pode registrar decisões via `activity-logger.mjs` format
- [ ] Queries funcionam em ambos sistemas

**Estimativa:** 2-3 horas
**Owner:** @dev

---

## Wave 6: Testes e Validação (Prioridade Alta após Waves 1-4)

### Tasks

#### 6.1 Testar fluxo completo
- [ ] Criar task no Claude Code → Delegar para Clawdbot
- [ ] Clawdbot executa → Atualiza ClickUp
- [ ] Claude Code vê resultado

#### 6.2 Testar budget enforcement
- [ ] Simular gasto próximo ao limite
- [ ] Verificar SAFE_MODE propaga

#### 6.3 Documentação final
- [ ] Atualizar todos os docs
- [ ] Criar guia de uso rápido

**Estimativa:** 2-3 horas
**Owner:** @qa

---

## Resumo de Arquivos a Criar/Modificar

### Novos Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `squads/ops/clawdbot/README.md` | Overview Clawdbot |
| `squads/ops/clawdbot/OPERATIONAL-DIRECTIVE.md` | Identidade e princípios |
| `squads/ops/clawdbot/COMMANDS.md` | Comandos Slack |
| `squads/ops/clawdbot/INTEGRATIONS.md` | n8n, GHL, Notion |
| `squads/ops/scripts/delegate-to-clawdbot.mjs` | Delegação via ClickUp |
| `shared/budget-limits.yaml` | Limites unificados |
| `docs/architecture/clawdbot-integration.md` | Arquitetura |

### Arquivos a Modificar

| Arquivo | Modificação |
|---------|-------------|
| `.claude/CLAUDE.md` | Adicionar seção Clawdbot |
| `squads/ops/agents/clawdbot.md` | Atualizar com info completa |
| `squads/ops/config/local-tools.json` | Adicionar referência Clawdbot |
| `squads/project-management-clickup/data/clickup-workspace-ids.json` | Adicionar novos campos |

---

## Timeline

| Wave | Descrição | Tempo Est. | Dependências |
|------|-----------|------------|--------------|
| 1 | Documentação Unificada | 3-4h | Nenhuma |
| 2 | Integração ClickUp | 4-5h | Wave 1 |
| 3 | Budget Unificado | 3-4h | Wave 2 |
| 4 | Scripts Determinísticos | 5-6h | Wave 1 |
| 5 | Memória Compartilhada | 2-3h | Wave 4, PR#30 |
| 6 | Testes e Validação | 2-3h | Waves 1-4 |

**Total Estimado:** 19-25 horas (dividido em ~1-2 semanas)

---

## Próximos Passos Imediatos

1. **Criar estrutura `squads/ops/clawdbot/`** ← COMEÇAR AQUI
2. **Migrar OPERATIONAL-DIRECTIVE**
3. **Atualizar CLAUDE.md**

---

## Referências

- **thiago-os:** `C:\Users\thiag\workspace\thiago-os`
- **PR#30:** Activity logging system
- **ClickUp IDs:** `squads/project-management-clickup/data/clickup-workspace-ids.json`
- **Memory system:** `squads/ops/scripts/activity-logger.mjs`, `memory-query.mjs`

---

*Plano criado por @pm em 2026-02-12*
*Revisado por: @aios-master, @architect, @devops, Board*
