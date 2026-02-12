# Clawdbot - Comandos Slack

**Interface:** Slack (#command-center ou DM)
**Prefixo:** `/` ou menção direta

---

## Comandos Disponíveis

### Status & Info

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `/status` | Status geral do sistema | `/status` |
| `/budget` | Budget atual (daily/monthly) | `/budget` |
| `/health` | Health check dos sistemas | `/health` |
| `/tasks` | Tasks pendentes | `/tasks` |

### Task Management

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `/create` | Criar nova task | `/create [Feature] Add login` |
| `/start` | Iniciar task | `/start 86c86xyz` |
| `/done` | Completar task | `/done 86c86xyz "Summary"` |
| `/block` | Marcar como bloqueado | `/block 86c86xyz "Reason"` |

### Automation

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `/run` | Executar script | `/run health_check.py` |
| `/workflow` | Trigger n8n workflow | `/workflow WF-01` |
| `/sync` | Forçar sync ClickUp/Notion | `/sync` |

### Emergency

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `/safemode on` | Ativar SAFE_MODE | `/safemode on` |
| `/safemode off` | Desativar SAFE_MODE | `/safemode off` (Director only) |
| `/killswitch` | Emergency stop | `/killswitch` |

---

## Formato de Resposta

Clawdbot sempre responde com estrutura:

```
STATUS: <COMPLETED | BLOCKED | WAITING_AUTH | etc>

NEXT ACTIONS:
- <ação 1>
- <ação 2>

NEEDS FROM THIAGO: <None | pedido específico>
```

---

## Exemplos de Uso

### Verificar status do dia
```
User: /status
Clawdbot: STATUS: OPERATIONAL

SUMMARY:
- Tasks completed: 5
- Tasks pending: 3
- Budget used: €8.50 / €20.00 (42%)
- Health: All systems green

NEXT ACTIONS:
- Continue monitoring

NEEDS FROM THIAGO: None
```

### Criar task rápida
```
User: /create [Bug] Fix login timeout
Clawdbot: STATUS: COMPLETED

CREATED:
- Task ID: 86c87abc
- Title: [Bug] Fix login timeout
- Agent: @dev
- Priority: 2

NEXT ACTIONS:
- Task visible in ClickUp AI OPS

NEEDS FROM THIAGO: None
```

---

## Integração com Claude Code

Para delegar do Claude Code:
```bash
node squads/ops/scripts/delegate-to-clawdbot.mjs "Task name" --script=script.py
```

Clawdbot detecta via ClickUp e executa.

---

*Referência: thiago-os/27-COMMAND-MATRIX-COMPLETE.md*
