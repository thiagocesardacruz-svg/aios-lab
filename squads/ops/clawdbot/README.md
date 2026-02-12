# Clawdbot - Extensão Operacional do AIOS

**Status:** Ativo (AWS EC2)
**Interface:** Slack
**Modelo:** Configurável (economia em foco)

---

## O Que é o Clawdbot

Clawdbot é uma **extensão** do AIOS Lab que permite:

- **Acesso quando terminal está OFF** - via Slack
- **Automações background** - n8n, GHL, scripts
- **Sync contínuo** - ClickUp, Notion
- **Monitoramento 24/7** - health checks, budget

**IMPORTANTE:** O foco principal continua sendo Claude Code (AIOS Lab). Clawdbot é complementar.

---

## Arquitetura

```
Claude Code (AIOS Lab)          Clawdbot (AWS EC2)
═══════════════════════         ═══════════════════
Motor Principal                 Extensão
├── 19 squads, 44 agents        ├── Slack interface
├── Produção massiva            ├── Scripts Python
├── MCP tools (GHL 36 tools)    ├── n8n workflows
├── Ferramentas locais          ├── Background tasks
└── ONDE TRABALHO ACONTECE      └── Quando terminal OFF
         │                               │
         └───────── ClickUp ─────────────┘
                (Command Center)
```

---

## Quando Usar Cada Um

| Cenário | Use |
|---------|-----|
| Desenvolver código | Claude Code |
| Arquitetura/Design | Claude Code |
| Criar workflows n8n | Claude Code |
| Estruturar GHL | Claude Code |
| Tasks complexas | Claude Code |
| **Quick command via Slack** | **Clawdbot** |
| **Verificar status (mobile)** | **Clawdbot** |
| **Automação 24/7** | **Clawdbot** |
| **Quando longe do terminal** | **Clawdbot** |

---

## Comandos Slack

Ver: [COMMANDS.md](./COMMANDS.md)

## Integrações

Ver: [INTEGRATIONS.md](./INTEGRATIONS.md)

## Diretiva Operacional

Ver: [OPERATIONAL-DIRECTIVE.md](./OPERATIONAL-DIRECTIVE.md)

---

## Como Delegar para Clawdbot

No Claude Code:
```bash
node squads/ops/scripts/delegate-to-clawdbot.mjs "Nome da task" --script=script_name.py
```

Isso cria task no ClickUp com tag `clawdbot:execute`. Clawdbot detecta e executa.

---

## Budget

Clawdbot compartilha o mesmo budget do AIOS:
- Daily Alert: €15
- Daily Hard: €20 (SAFE_MODE)
- Monthly: €468

Limites em: `shared/budget-limits.yaml`

---

## Repositório de Referência

Documentação original: `C:\Users\thiag\workspace\thiago-os`

Scripts EC2: `/opt/clawdbot/` (AWS)

---

*Última atualização: 2026-02-12*
