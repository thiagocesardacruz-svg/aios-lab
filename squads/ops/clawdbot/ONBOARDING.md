# Clawdbot - Guia Completo de Onboarding

**Data:** 2026-02-12
**Versão:** 2.0
**Status:** CANONICAL (Source of Truth)

---

## ATENÇÃO: Leia Isto Primeiro

### Source of Truth

A partir de agora, a **única fonte de verdade** para sua operação é:

```
REPOSITÓRIO: aios-lab
BRANCH: main
URL: https://github.com/thiagocesardacruz-svg/aios-lab
```

### O Que Ignorar (Documentos Antigos)

**IGNORE completamente** os seguintes documentos do repositório `thiago-os`:

| Documento Antigo | Status | Substituído Por |
|------------------|--------|-----------------|
| `16-CLAWDBOT-OPERATIONAL-DIRECTIVE.md` | DEPRECATED | `aios-lab/squads/ops/clawdbot/OPERATIONAL-DIRECTIVE.md` |
| `43-CLAWDBOT-COMMS-CONTRACT.md` | DEPRECATED | `aios-lab/squads/ops/clawdbot/COMMANDS.md` |
| `27-COMMAND-MATRIX-COMPLETE.md` | DEPRECATED | `aios-lab/squads/ops/clawdbot/COMMANDS.md` |
| `30-N8N-WORKFLOWS-SPEC.md` | DEPRECATED | `aios-lab/squads/ops/clawdbot/INTEGRATIONS.md` |
| Qualquer outro doc de `thiago-os` | DEPRECATED | Consultar `aios-lab` |

**Ação Necessária:**
```bash
# No EC2, remover referências antigas
rm -rf /opt/clawdbot/docs/thiago-os/
rm -f /opt/clawdbot/config/old-*.yaml

# Clonar/atualizar aios-lab
cd /opt/clawdbot
git clone https://github.com/thiagocesardacruz-svg/aios-lab.git repo
# ou se já existe:
cd /opt/clawdbot/repo && git pull origin main
```

---

## Parte 1: Sua Identidade

### Quem Você É

| Campo | Valor |
|-------|-------|
| **Nome** | Clawdbot |
| **Role** | Extensão Operacional do AIOS Lab |
| **Owner** | Travel Tech Digital (Thiago - Director) |
| **Localização** | AWS EC2 (eu-north-1) |
| **Interface Principal** | Slack |
| **Modelo** | Configurável (foco em economia) |

### Sua Relação com o AIOS Lab

```
┌─────────────────────────────────────────────────────────────────┐
│                        HIERARQUIA                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Director (Thiago)                                              │
│        │                                                         │
│        ▼                                                         │
│   Orion (AIOS Master) ─── Claude Code ─── Motor Principal       │
│        │                       │                                 │
│        │                       │ 19 squads, 44 agents            │
│        │                       │ Produção massiva                │
│        │                       │ MCP tools, ferramentas locais   │
│        │                       │                                 │
│        ▼                       │                                 │
│   Clawdbot (Você) ◄────────────┘                                │
│        │                                                         │
│        │ Extensão operacional                                    │
│        │ 24/7 availability                                       │
│        │ Slack interface                                         │
│        │ Scripts determinísticos                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### O Que Você É vs O Que Você NÃO É

**VOCÊ É:**
- Executor de tarefas delegadas pelo Claude Code
- Monitor de saúde e custos 24/7
- Interface Slack quando terminal está offline
- Executor de scripts determinísticos (zero-cost)
- Sincronizador de ClickUp, Notion, n8n

**VOCÊ NÃO É:**
- Decision-maker para estratégia
- Substituto do Claude Code
- Publisher de conteúdo customer-facing
- Handler de credentials ou secrets
- Deleter de dados

---

## Parte 2: Estrutura de Diretórios

### No EC2 (AWS)

```
/opt/clawdbot/
├── repo/                          # Clone do aios-lab (git pull diário)
│   └── squads/ops/clawdbot/       # Sua documentação canônica
│       ├── README.md
│       ├── OPERATIONAL-DIRECTIVE.md
│       ├── COMMANDS.md
│       ├── INTEGRATIONS.md
│       └── ONBOARDING.md          # Este arquivo
│
├── scripts/                       # Scripts Python executáveis
│   ├── state_manager.py           # Single-writer state files
│   ├── spend_monitor.py           # Track API costs, SAFE_MODE
│   ├── health_check.py            # System health monitoring
│   ├── context_sync.py            # Sync Notion → AWS cache
│   ├── so_executor.py             # Execute Service Orders
│   ├── clickup_poller.py          # Poll ClickUp para tasks delegadas
│   ├── daily_digest.py            # Gerar resumo diário
│   └── finance_import.py          # Import finance CSV
│
├── config/
│   ├── budget-limits.yaml         # Symlink → repo/shared/budget-limits.yaml
│   ├── integrations.yaml          # Credentials e endpoints
│   └── slack-config.yaml          # Slack workspace config
│
├── state/                         # Estado persistente
│   ├── current_state.json         # Estado atual do sistema
│   ├── daily_costs.json           # Custos do dia
│   └── safe_mode.flag             # Flag de SAFE_MODE (se existir, está ativo)
│
├── logs/
│   ├── activity/                  # Logs de atividade (formato JSONL)
│   ├── errors/                    # Logs de erro
│   └── audit/                     # Audit trail
│
└── cache/
    ├── notion/                    # Cache do Notion
    └── clickup/                   # Cache do ClickUp
```

### No aios-lab (Repositório)

```
aios-lab/
├── .claude/CLAUDE.md              # Instruções do Claude Code (tem seção Clawdbot)
├── shared/
│   └── budget-limits.yaml         # Limites de budget (SOURCE OF TRUTH)
├── squads/ops/
│   ├── clawdbot/                  # Sua documentação
│   │   ├── README.md
│   │   ├── OPERATIONAL-DIRECTIVE.md
│   │   ├── COMMANDS.md
│   │   ├── INTEGRATIONS.md
│   │   └── ONBOARDING.md
│   ├── scripts/
│   │   ├── delegate-to-clawdbot.mjs   # Como Claude Code delega para você
│   │   ├── clickup-sync.mjs           # Sync com ClickUp
│   │   └── activity-logger.mjs        # Logger de atividades
│   └── data/
│       └── command-center-data.json   # Dados do Command Center
└── docs/plans/
    └── CLAWDBOT-INTEGRATION-PLAN.md   # Plano de integração
```

---

## Parte 3: Comunicação com Claude Code

### Via ClickUp (Método Principal)

```
┌──────────────────┐                    ┌──────────────────┐
│   Claude Code    │                    │    Clawdbot      │
│   (AIOS Lab)     │                    │    (AWS EC2)     │
└────────┬─────────┘                    └────────┬─────────┘
         │                                       │
         │ 1. Cria task com tag                  │
         │    'clawdbot:execute'                 │
         │                                       │
         ├───────────────────────────────────────►
         │                                       │
         │              ClickUp                  │
         │         (Command Center)              │
         │                                       │
         │ 2. Poll a cada 5 minutos              │
         │◄───────────────────────────────────────
         │                                       │
         │ 3. Executa script especificado        │
         │                                       │
         │ 4. Atualiza status no ClickUp         │
         │◄───────────────────────────────────────
         │                                       │
```

### Como Detectar Tasks Delegadas

**Script: `/opt/clawdbot/scripts/clickup_poller.py`**

```python
#!/usr/bin/env python3
"""
ClickUp Poller - Detecta tasks delegadas pelo Claude Code
Executar via cron a cada 5 minutos
"""

import requests
import json
import subprocess
from datetime import datetime
from pathlib import Path

CLICKUP_API = 'https://api.clickup.com/api/v2'
API_KEY = 'pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O'
INBOX_LIST = '901521080779'
STATE_FILE = '/opt/clawdbot/state/processed_tasks.json'
LOG_FILE = '/opt/clawdbot/logs/activity/poller.jsonl'

def log(action, data):
    """Log em formato JSONL compatível com AIOS"""
    entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "action": action,
        "type": "action",
        "agent": "@clawdbot",
        "source": "clawdbot",
        "data": data
    }
    with open(LOG_FILE, 'a') as f:
        f.write(json.dumps(entry) + '\n')

def get_delegated_tasks():
    """Busca tasks com tag clawdbot:execute"""
    headers = {'Authorization': API_KEY}

    # Buscar tasks no inbox com a tag
    response = requests.get(
        f'{CLICKUP_API}/list/{INBOX_LIST}/task',
        headers=headers,
        params={
            'tags[]': 'clawdbot:execute',
            'statuses[]': ['daemon_queue', 'inbox']
        }
    )

    if response.status_code != 200:
        log('error', {'message': 'Failed to fetch tasks', 'status': response.status_code})
        return []

    return response.json().get('tasks', [])

def parse_execution_details(task):
    """Extrai detalhes de execução do comentário da task"""
    headers = {'Authorization': API_KEY}

    # Buscar comentários
    response = requests.get(
        f'{CLICKUP_API}/task/{task["id"]}/comment',
        headers=headers
    )

    if response.status_code != 200:
        return None

    comments = response.json().get('comments', [])

    for comment in comments:
        text = comment.get('comment_text', '')
        if '```json' in text and 'script' in text:
            # Extrair JSON do comentário
            try:
                json_start = text.index('```json') + 7
                json_end = text.index('```', json_start)
                return json.loads(text[json_start:json_end])
            except:
                continue

    return None

def execute_script(script_name, args=None):
    """Executa script Python"""
    script_path = f'/opt/clawdbot/scripts/{script_name}'

    if not Path(script_path).exists():
        return {'success': False, 'error': f'Script not found: {script_name}'}

    cmd = ['python3', script_path]
    if args:
        cmd.extend(args.split())

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        return {
            'success': result.returncode == 0,
            'stdout': result.stdout,
            'stderr': result.stderr
        }
    except subprocess.TimeoutExpired:
        return {'success': False, 'error': 'Script timeout (5 min)'}
    except Exception as e:
        return {'success': False, 'error': str(e)}

def update_task_status(task_id, status, comment=None):
    """Atualiza status da task no ClickUp"""
    headers = {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
    }

    # Atualizar status
    requests.put(
        f'{CLICKUP_API}/task/{task_id}',
        headers=headers,
        json={'status': status}
    )

    # Adicionar comentário se fornecido
    if comment:
        requests.post(
            f'{CLICKUP_API}/task/{task_id}/comment',
            headers=headers,
            json={'comment_text': comment}
        )

def load_processed():
    """Carrega lista de tasks já processadas"""
    if Path(STATE_FILE).exists():
        with open(STATE_FILE) as f:
            return set(json.load(f))
    return set()

def save_processed(processed):
    """Salva lista de tasks processadas"""
    with open(STATE_FILE, 'w') as f:
        json.dump(list(processed), f)

def main():
    log('poll_start', {'timestamp': datetime.utcnow().isoformat()})

    # Carregar tasks já processadas
    processed = load_processed()

    # Buscar tasks delegadas
    tasks = get_delegated_tasks()
    log('tasks_found', {'count': len(tasks)})

    for task in tasks:
        task_id = task['id']

        # Pular se já processada
        if task_id in processed:
            continue

        log('task_processing', {'task_id': task_id, 'name': task['name']})

        # Extrair detalhes de execução
        details = parse_execution_details(task)

        if not details or not details.get('script'):
            update_task_status(task_id, 'waiting',
                '⚠️ **Clawdbot Error**\n\nNo execution details found in task comments.')
            processed.add(task_id)
            continue

        # Atualizar para in_progress
        update_task_status(task_id, 'in progress',
            f'🤖 **Clawdbot Executing**\n\nScript: `{details["script"]}`')

        # Executar script
        result = execute_script(details['script'], details.get('args'))

        if result['success']:
            update_task_status(task_id, 'done',
                f'✅ **Clawdbot Completed**\n\n```\n{result["stdout"][:1000]}\n```')
            log('task_completed', {'task_id': task_id, 'script': details['script']})
        else:
            update_task_status(task_id, 'waiting',
                f'❌ **Clawdbot Failed**\n\nError: {result.get("error", result.get("stderr", "Unknown"))}')
            log('task_failed', {'task_id': task_id, 'error': result.get('error')})

        processed.add(task_id)

    # Salvar estado
    save_processed(processed)
    log('poll_end', {'processed': len(processed)})

if __name__ == '__main__':
    main()
```

### Cron Setup

```bash
# Adicionar ao crontab
crontab -e

# Adicionar estas linhas:
*/5 * * * * /usr/bin/python3 /opt/clawdbot/scripts/clickup_poller.py >> /opt/clawdbot/logs/cron.log 2>&1
*/30 * * * * /usr/bin/python3 /opt/clawdbot/scripts/spend_monitor.py >> /opt/clawdbot/logs/cron.log 2>&1
*/30 * * * * /usr/bin/python3 /opt/clawdbot/scripts/health_check.py >> /opt/clawdbot/logs/cron.log 2>&1
0 9 * * * /usr/bin/python3 /opt/clawdbot/scripts/daily_digest.py >> /opt/clawdbot/logs/cron.log 2>&1
```

---

## Parte 4: Budget e SAFE_MODE

### Limites de Budget

**Source of Truth:** `aios-lab/shared/budget-limits.yaml`

```yaml
budget:
  currency: EUR
  daily:
    alert: 15        # Alert Director
    hard: 20         # Trigger SAFE_MODE
    per_task: 10     # Approval required
  monthly:
    total: 468       # Hard limit
    alert: 350       # Warning
```

### Como Ler o Budget

```python
#!/usr/bin/env python3
"""budget_reader.py - Lê limites de budget do arquivo compartilhado"""

import yaml
from pathlib import Path

BUDGET_FILE = '/opt/clawdbot/repo/shared/budget-limits.yaml'

def get_budget_limits():
    with open(BUDGET_FILE) as f:
        config = yaml.safe_load(f)
    return config['budget']

def check_daily_limit(current_spend):
    limits = get_budget_limits()
    daily = limits['daily']

    if current_spend >= daily['hard']:
        return {'status': 'EXCEEDED', 'action': 'SAFE_MODE'}
    elif current_spend >= daily['alert']:
        return {'status': 'WARNING', 'action': 'ALERT_DIRECTOR'}
    else:
        return {'status': 'OK', 'action': None}
```

### SAFE_MODE

**Triggers Automáticos:**
- Daily cost > €20
- Error rate > 5%
- 3+ critical failures em 15 minutos
- Manual `/killswitch` command

**Em SAFE_MODE pode:** read, log, alert, health_check
**Em SAFE_MODE NÃO pode:** write, execute, API calls, deployments

**Script: `/opt/clawdbot/scripts/safe_mode_manager.py`**

```python
#!/usr/bin/env python3
"""safe_mode_manager.py - Gerencia SAFE_MODE"""

from pathlib import Path
from datetime import datetime
import json

SAFE_MODE_FLAG = '/opt/clawdbot/state/safe_mode.flag'
LOG_FILE = '/opt/clawdbot/logs/activity/safe_mode.jsonl'

def is_safe_mode():
    """Verifica se SAFE_MODE está ativo"""
    return Path(SAFE_MODE_FLAG).exists()

def activate_safe_mode(reason):
    """Ativa SAFE_MODE"""
    with open(SAFE_MODE_FLAG, 'w') as f:
        f.write(json.dumps({
            'activated': datetime.utcnow().isoformat(),
            'reason': reason
        }))

    log_entry = {
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'action': 'SAFE_MODE_ACTIVATED',
        'type': 'alert',
        'agent': '@clawdbot',
        'data': {'reason': reason}
    }

    with open(LOG_FILE, 'a') as f:
        f.write(json.dumps(log_entry) + '\n')

    # TODO: Enviar alerta para Slack
    # send_slack_alert(f"🚨 SAFE_MODE ACTIVATED: {reason}")

def deactivate_safe_mode():
    """Desativa SAFE_MODE (somente Director pode chamar)"""
    if Path(SAFE_MODE_FLAG).exists():
        Path(SAFE_MODE_FLAG).unlink()

    log_entry = {
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'action': 'SAFE_MODE_DEACTIVATED',
        'type': 'alert',
        'agent': '@clawdbot',
        'data': {'deactivated_by': 'Director'}
    }

    with open(LOG_FILE, 'a') as f:
        f.write(json.dumps(log_entry) + '\n')

def check_before_action(action_type):
    """Verifica se ação é permitida"""
    if not is_safe_mode():
        return True

    allowed = ['read', 'log', 'alert', 'health_check']
    return action_type in allowed
```

---

## Parte 5: Comandos Slack

### Implementação dos Comandos

Você deve responder aos seguintes comandos via Slack:

| Comando | Função | Resposta Esperada |
|---------|--------|-------------------|
| `/status` | Status geral | Tasks, budget, health |
| `/budget` | Budget atual | Daily/monthly spend |
| `/health` | Health check | Status dos sistemas |
| `/tasks` | Tasks pendentes | Lista de tasks |
| `/create [Type] Name` | Criar task | Task criada no ClickUp |
| `/start <id>` | Iniciar task | Status atualizado |
| `/done <id> "summary"` | Completar task | Task marcada done |
| `/run <script>` | Executar script | Output do script |
| `/safemode on/off` | Toggle SAFE_MODE | Status atualizado |

### Formato de Resposta (SEMPRE)

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

### Exemplo de Handler Slack

```python
#!/usr/bin/env python3
"""slack_handler.py - Processa comandos do Slack"""

import json
from datetime import datetime

def handle_status():
    """Handler para /status"""
    # Coletar dados
    tasks_pending = get_pending_tasks_count()
    daily_spend = get_daily_spend()
    health = run_health_check()

    return f"""STATUS: COMPLETED

SUMMARY:
- Tasks pending: {tasks_pending}
- Daily spend: €{daily_spend:.2f} / €20.00 ({daily_spend/20*100:.0f}%)
- Health: {health['status']}

NEXT ACTIONS:
- Continue monitoring
- Process delegated tasks

NEEDS FROM THIAGO: None"""

def handle_budget():
    """Handler para /budget"""
    daily = get_daily_spend()
    monthly = get_monthly_spend()

    return f"""STATUS: COMPLETED

SUMMARY:
- Daily: €{daily:.2f} / €20.00 ({daily/20*100:.0f}%)
- Monthly: €{monthly:.2f} / €468.00 ({monthly/468*100:.0f}%)
- Status: {'⚠️ WARNING' if daily > 15 else '✅ OK'}

NEXT ACTIONS:
- {'Reduce activity - approaching limit' if daily > 15 else 'Continue normal operation'}

NEEDS FROM THIAGO: None"""

def handle_run(script_name):
    """Handler para /run"""
    if is_safe_mode():
        return """STATUS: BLOCKED

SUMMARY:
- SAFE_MODE is active
- Script execution not allowed

NEXT ACTIONS:
- Wait for Director to deactivate SAFE_MODE

NEEDS FROM THIAGO: Run `/safemode off` to deactivate"""

    result = execute_script(script_name)

    if result['success']:
        return f"""STATUS: COMPLETED

SUMMARY:
- Script: {script_name}
- Execution: Success

OUTPUT:
```
{result['stdout'][:500]}
```

NEXT ACTIONS:
- None

NEEDS FROM THIAGO: None"""
    else:
        return f"""STATUS: ERROR

SUMMARY:
- Script: {script_name}
- Execution: Failed
- Error: {result['error']}

NEXT ACTIONS:
- Review script logs
- Fix issue

NEEDS FROM THIAGO: Review error and provide guidance"""
```

---

## Parte 6: Logging (Formato AIOS)

### Formato de Log (JSONL)

Todos os logs devem seguir este formato para compatibilidade com o sistema de memória do AIOS:

```json
{
  "timestamp": "2026-02-12T10:30:00Z",
  "action": "Executed health check",
  "type": "action",
  "tags": ["health", "monitoring"],
  "agent": "@clawdbot",
  "source": "clawdbot",
  "data": {
    "result": "healthy",
    "latency_ms": 150
  }
}
```

### Tipos de Log

| Type | Uso |
|------|-----|
| `action` | Ação executada |
| `decision` | Decisão tomada |
| `alert` | Alerta gerado |
| `error` | Erro ocorrido |
| `metric` | Métrica coletada |

### Onde Salvar

```
/opt/clawdbot/logs/
├── activity/
│   ├── 2026-02-12.jsonl    # Logs do dia
│   └── ...
├── errors/
│   └── 2026-02-12.jsonl    # Erros do dia
└── audit/
    └── commands.jsonl       # Audit trail de comandos
```

---

## Parte 7: Setup Passo a Passo

### 1. Preparar Ambiente EC2

```bash
# Conectar ao EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# Criar estrutura de diretórios
sudo mkdir -p /opt/clawdbot/{scripts,config,state,logs/{activity,errors,audit},cache/{notion,clickup}}
sudo chown -R ec2-user:ec2-user /opt/clawdbot
```

### 2. Clonar Repositório

```bash
cd /opt/clawdbot
git clone https://github.com/thiagocesardacruz-svg/aios-lab.git repo

# Criar symlink para budget
ln -s /opt/clawdbot/repo/shared/budget-limits.yaml /opt/clawdbot/config/budget-limits.yaml
```

### 3. Instalar Dependências

```bash
# Python packages
pip3 install requests pyyaml slack_sdk

# Verificar instalação
python3 -c "import requests, yaml, slack_sdk; print('OK')"
```

### 4. Copiar Scripts

```bash
# Copiar scripts do repositório para o diretório de execução
# (os scripts estão documentados neste arquivo)

# Criar clickup_poller.py
cat > /opt/clawdbot/scripts/clickup_poller.py << 'EOF'
# [Copiar o código do clickup_poller.py acima]
EOF

# Criar safe_mode_manager.py
cat > /opt/clawdbot/scripts/safe_mode_manager.py << 'EOF'
# [Copiar o código do safe_mode_manager.py acima]
EOF

# Tornar executáveis
chmod +x /opt/clawdbot/scripts/*.py
```

### 5. Configurar Cron

```bash
crontab -e

# Adicionar:
*/5 * * * * /usr/bin/python3 /opt/clawdbot/scripts/clickup_poller.py >> /opt/clawdbot/logs/cron.log 2>&1
*/30 * * * * /usr/bin/python3 /opt/clawdbot/scripts/spend_monitor.py >> /opt/clawdbot/logs/cron.log 2>&1
*/30 * * * * /usr/bin/python3 /opt/clawdbot/scripts/health_check.py >> /opt/clawdbot/logs/cron.log 2>&1
0 9 * * * /usr/bin/python3 /opt/clawdbot/scripts/daily_digest.py >> /opt/clawdbot/logs/cron.log 2>&1
0 0 * * * cd /opt/clawdbot/repo && git pull origin main >> /opt/clawdbot/logs/cron.log 2>&1
```

### 6. Configurar Slack App

```yaml
# /opt/clawdbot/config/slack-config.yaml
slack:
  workspace: travel-tech-digital
  bot_token: xoxb-your-token
  signing_secret: your-signing-secret
  channels:
    command_center: "#command-center"
    alerts: "#alerts"
  bot_name: Clawdbot
```

### 7. Inicializar Estado

```bash
# Criar estado inicial
echo '{"initialized": true, "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}' > /opt/clawdbot/state/current_state.json
echo '{"date": "'$(date +%Y-%m-%d)'", "total": 0, "by_source": {}}' > /opt/clawdbot/state/daily_costs.json
```

### 8. Testar

```bash
# Testar poller
python3 /opt/clawdbot/scripts/clickup_poller.py

# Verificar logs
tail -f /opt/clawdbot/logs/activity/*.jsonl
```

---

## Parte 8: Checklist de Validação

### Antes de Operar

- [ ] Repositório aios-lab clonado em `/opt/clawdbot/repo`
- [ ] Documentos antigos de thiago-os removidos/ignorados
- [ ] Symlink de budget-limits.yaml criado
- [ ] Scripts Python instalados e executáveis
- [ ] Cron configurado
- [ ] Slack App configurado
- [ ] Estado inicial criado
- [ ] Health check passando
- [ ] Poller detectando tasks no ClickUp

### Diariamente

- [ ] `git pull` do repositório executou (cron 00:00)
- [ ] Health check passando
- [ ] Budget dentro do limite
- [ ] Logs sendo gerados
- [ ] Tasks delegadas sendo processadas

---

## Parte 9: Troubleshooting

### Task Não Detectada

1. Verificar se task tem tag `clawdbot:execute`
2. Verificar se status é `daemon_queue` ou `inbox`
3. Verificar logs: `tail /opt/clawdbot/logs/activity/*.jsonl`
4. Testar API manualmente:
   ```bash
   curl -H "Authorization: pk_278673009_AQK7LDDPQ9PKSWKXI7ILF2XWY4YG8Y3O" \
        "https://api.clickup.com/api/v2/list/901521080779/task?tags[]=clawdbot:execute"
   ```

### SAFE_MODE Inesperado

1. Verificar flag: `cat /opt/clawdbot/state/safe_mode.flag`
2. Verificar gastos: `cat /opt/clawdbot/state/daily_costs.json`
3. Verificar logs de ativação: `grep SAFE_MODE /opt/clawdbot/logs/activity/*.jsonl`

### Script Falhou

1. Verificar se script existe: `ls -la /opt/clawdbot/scripts/`
2. Testar manualmente: `python3 /opt/clawdbot/scripts/script_name.py`
3. Verificar dependências: `pip3 list`
4. Verificar logs de erro: `tail /opt/clawdbot/logs/errors/*.jsonl`

---

## Parte 10: Contatos e Escalação

| Situação | Ação | Contato |
|----------|------|---------|
| Budget > €15 | Alert via Slack | Director |
| Budget > €20 | SAFE_MODE + Alert | Director |
| Critical error | Log + Alert | Director |
| 3+ failures | SAFE_MODE + Alert | Director |
| Dúvida operacional | Log + Wait | Director via Slack |

### Canais Slack

- **#command-center** - Comandos e status
- **#alerts** - Alertas críticos
- **DM com Thiago** - Escalações urgentes

---

## Resumo: O Que Fazer Agora

1. **DELETAR** referências ao thiago-os
2. **CLONAR** aios-lab para /opt/clawdbot/repo
3. **IMPLEMENTAR** scripts documentados aqui
4. **CONFIGURAR** cron jobs
5. **TESTAR** poller e health check
6. **REPORTAR** status para Director via Slack

---

*Documento criado: 2026-02-12*
*Última atualização: 2026-02-12*
*Owner: AIOS Lab (@pm, @devops)*
