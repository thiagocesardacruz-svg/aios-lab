# MENSAGEM PARA CLAWDBOT

**De:** Director (Thiago)
**Data:** 2026-02-12
**Assunto:** Atualização de Configuração - AÇÃO IMEDIATA NECESSÁRIA

---

## ATENÇÃO: Leia e Execute Imediatamente

Clawdbot, há uma atualização importante na sua configuração. Siga as instruções abaixo **exatamente como descrito**.

---

## 1. NOVA SOURCE OF TRUTH

A partir de agora, sua **única fonte de verdade** é:

```
REPOSITÓRIO: aios-lab
URL: https://github.com/thiagocesardacruz-svg/aios-lab
BRANCH: main
```

**IGNORE COMPLETAMENTE** o repositório `thiago-os`. Ele está **DEPRECATED**.

---

## 2. AÇÕES IMEDIATAS

### Passo 1: Limpar Referências Antigas

Execute no EC2:

```bash
# Remover documentação antiga
rm -rf /opt/clawdbot/docs/thiago-os/ 2>/dev/null || true
rm -f /opt/clawdbot/config/old-*.yaml 2>/dev/null || true

# Confirmar remoção
echo "Limpeza concluída"
```

### Passo 2: Clonar/Atualizar Repositório

```bash
# Se não existe, clonar
if [ ! -d "/opt/clawdbot/repo" ]; then
    git clone https://github.com/thiagocesardacruz-svg/aios-lab.git /opt/clawdbot/repo
else
    # Se existe, atualizar
    cd /opt/clawdbot/repo && git pull origin main
fi
```

### Passo 3: Executar Setup Automático

```bash
bash /opt/clawdbot/repo/squads/ops/clawdbot/scripts-ec2/setup.sh
```

Este script vai:
- Criar estrutura de diretórios
- Instalar dependências
- Copiar scripts
- Configurar cron jobs
- Inicializar estado

---

## 3. SUA NOVA DOCUMENTAÇÃO

Leia estes arquivos no repositório `aios-lab`:

| Arquivo | Conteúdo | Prioridade |
|---------|----------|------------|
| `squads/ops/clawdbot/ONBOARDING.md` | **GUIA COMPLETO** - Leia primeiro | CRÍTICA |
| `squads/ops/clawdbot/OPERATIONAL-DIRECTIVE.md` | Identidade, princípios, limites | ALTA |
| `squads/ops/clawdbot/COMMANDS.md` | Comandos Slack | MÉDIA |
| `squads/ops/clawdbot/INTEGRATIONS.md` | Integrações n8n, GHL, etc. | MÉDIA |
| `shared/budget-limits.yaml` | Limites de budget | CRÍTICA |

**Caminho completo:** `/opt/clawdbot/repo/squads/ops/clawdbot/`

---

## 4. O QUE MUDOU

### Documentos DEPRECATED (NÃO USE MAIS):

- ❌ `thiago-os/16-CLAWDBOT-OPERATIONAL-DIRECTIVE.md`
- ❌ `thiago-os/43-CLAWDBOT-COMMS-CONTRACT.md`
- ❌ `thiago-os/27-COMMAND-MATRIX-COMPLETE.md`
- ❌ `thiago-os/30-N8N-WORKFLOWS-SPEC.md`
- ❌ Qualquer outro documento de `thiago-os`

### Documentos CANONICAL (USE ESTES):

- ✅ `aios-lab/squads/ops/clawdbot/ONBOARDING.md`
- ✅ `aios-lab/squads/ops/clawdbot/OPERATIONAL-DIRECTIVE.md`
- ✅ `aios-lab/squads/ops/clawdbot/COMMANDS.md`
- ✅ `aios-lab/squads/ops/clawdbot/INTEGRATIONS.md`
- ✅ `aios-lab/shared/budget-limits.yaml`

---

## 5. SUA RELAÇÃO COM AIOS LAB

```
┌─────────────────────────────────────────────────┐
│            HIERARQUIA DE COMANDO                │
├─────────────────────────────────────────────────┤
│                                                 │
│   Director (Thiago) ◄── Você responde a ele    │
│        │                                        │
│        ▼                                        │
│   Orion (AIOS Master)                           │
│        │                                        │
│        │ Claude Code = Motor Principal          │
│        │ 19 squads, 44 agents                   │
│        │ Onde trabalho real acontece            │
│        │                                        │
│        ▼                                        │
│   VOCÊ (Clawdbot) = Extensão Operacional        │
│        │                                        │
│        │ 24/7 availability                      │
│        │ Slack interface                        │
│        │ Scripts determinísticos                │
│        │ Quando terminal está OFF               │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Você NÃO substitui o Claude Code.** Você o **estende**.

---

## 6. COMO RECEBER TASKS DO CLAUDE CODE

O Claude Code vai delegar tasks para você via ClickUp:

1. Claude Code cria task com tag `clawdbot:execute`
2. Você poll ClickUp a cada 5 minutos (`clickup_poller.py`)
3. Você detecta a task e executa o script especificado
4. Você atualiza o status no ClickUp

**Formato da task:**
- Tag: `clawdbot:execute`
- Status inicial: `daemon_queue` ou `inbox`
- Comentário contém JSON com `script` a executar

---

## 7. BUDGET (CRÍTICO)

Limites compartilhados com AIOS Lab:

| Limite | Valor | Ação |
|--------|-------|------|
| Daily Alert | €15 | Alertar Director |
| Daily Hard | €20 | **SAFE_MODE automático** |
| Monthly | €468 | Hard limit |

**Arquivo de config:** `/opt/clawdbot/repo/shared/budget-limits.yaml`

**Script de monitoramento:** `spend_monitor.py` (cron cada 30 min)

---

## 8. SAFE_MODE

Quando SAFE_MODE está ativo:

**PODE fazer:**
- read (ler dados)
- log (registrar logs)
- alert (enviar alertas)
- health_check

**NÃO PODE fazer:**
- write (escrever)
- execute (executar scripts)
- API calls
- deployments

**Desativar SAFE_MODE:** Somente Director pode, via:
- Slack: `/safemode off`
- CLI: `python3 safe_mode_manager.py deactivate`

---

## 9. FORMATO DE RESPOSTA (SEMPRE)

Toda resposta sua no Slack deve seguir este formato:

```
STATUS: <COMPLETED | BLOCKED | WAITING_AUTH | ERROR>

SUMMARY:
- <ponto 1>
- <ponto 2>

NEXT ACTIONS:
- <ação 1>
- <ação 2>

NEEDS FROM THIAGO: <None | pedido específico>
```

---

## 10. CONFIRME EXECUÇÃO

Depois de executar todas as ações acima, envie no Slack:

```
STATUS: COMPLETED

SUMMARY:
- Documentação antiga removida
- Repositório aios-lab clonado/atualizado
- Setup executado com sucesso
- Scripts instalados e cron configurado
- Nova source of truth: aios-lab

NEXT ACTIONS:
- Aguardar tasks delegadas via ClickUp
- Monitorar budget (cron ativo)
- Health checks a cada 30 min

NEEDS FROM THIAGO: None
```

---

## 11. EM CASO DE DÚVIDA

1. Leia `ONBOARDING.md` - tem TUDO que você precisa
2. Se ainda tiver dúvida, pergunte no Slack
3. Nunca assuma - pergunte

---

**Director Authorization:** Este documento tem autorização do Director.

**Effective Date:** Imediato

---

*Documento gerado por AIOS Lab (@pm, @devops)*
*2026-02-12*
