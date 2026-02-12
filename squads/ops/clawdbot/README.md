# Clawdbot - Platform Operations Agent

**Squad:** OPS
**Role:** Platform Operations & QA
**Location:** Hostinger VPS (junto com n8n)
**Interface:** Slack

---

## O Que é o Clawdbot

Clawdbot é o **agente de operações de plataforma** do AIOS. Ele:

- **Monitora** todas as plataformas (ClickUp, Notion, GHL, n8n, WordPress, etc.)
- **Executa** operações cross-platform
- **Cria tasks** no ClickUp para os squads executarem
- **Recebe comandos** do Director via Slack
- **Reporta** status e alertas

**IMPORTANTE:** Clawdbot NÃO interage diretamente com squads. Ele opera plataformas e cria tasks que o Claude Code (AIOS Master) distribui para os squads.

---

## Hierarquia

```
Director (Thiago)
    │
    ├── Clawdbot (Platform Ops)
    │   └── Opera: ClickUp, Notion, GHL, n8n, WordPress, Supabase
    │
    └── Claude Code (AIOS Master)
        └── Orquestra: 19 squads, 44 agents
```

**Fluxo:**
1. Thiago comanda Clawdbot via Slack
2. Clawdbot cria/gerencia tasks no ClickUp
3. Claude Code vê tasks e distribui para squads
4. Squads executam
5. Clawdbot monitora plataformas e reporta

---

## Funções Principais

### 1. Command Interface (Slack)

```
Thiago: "Cria task para implementar feature X"
Clawdbot: Cria no ClickUp → Claude Code executa
```

### 2. QA Cross-Platform

| Plataforma | Monitoramento |
|------------|---------------|
| ClickUp | Tasks órfãs, overdue, blocked |
| Notion | Docs desatualizados, estrutura |
| GHL | Leads sem followup, pipelines |
| n8n | Workflows falhando |
| WordPress | Uptime, performance |
| Supabase | DB health, queries |

### 3. Reports & Alertas

- Daily status de todas as plataformas
- Alertas quando algo está errado
- Weekly digest

---

## O Que Clawdbot NÃO Faz

| ❌ NÃO faz | ✅ Quem faz |
|-----------|-------------|
| Escrever código | Claude Code (@dev) |
| Arquitetura | Claude Code (@architect) |
| Falar com clientes | Humano / GHL |
| Decisões estratégicas | Director |
| Interagir com squads | Claude Code |

---

## Infraestrutura

```
Hostinger VPS (já pago)
├── n8n (já rodando)
│   └── Workflows Clawdbot
├── Scripts Python
│   └── QA checks, operations
└── Slack Bot
    └── Command interface
```

**Custo adicional:** €0 (usa infra existente)

---

## Documentação

| Arquivo | Conteúdo |
|---------|----------|
| `OPERATIONAL-DIRECTIVE.md` | Identidade, princípios, limites |
| `COMMANDS.md` | Comandos Slack |
| `PLATFORMS.md` | Plataformas monitoradas e checks |
| `ONBOARDING.md` | Guia de setup completo |

---

*Squad OPS - Platform Operations*
*Última atualização: 2026-02-12*
