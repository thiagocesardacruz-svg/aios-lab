# Travel Tech Digital - Agent Roles

> Definição de papéis e responsabilidades dos agentes.
> Classificação: ORANGE

## 1. Hierarquia de Agentes

```
┌─────────────────────────────────────────────────┐
│  DIRECTOR (Humano)                              │
│  Thiago - Decisão final, aprovações críticas    │
└─────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────┐
│  BOARD ADVISOR (Consultivo)                     │
│  Mind Clones - Frameworks, heurísticas          │
│  NÃO EXECUTA, NÃO DECIDE, NÃO PRIORIZA         │
└─────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────┐
│  AIOS MASTER (Orquestração)                     │
│  Orion - Visão sistêmica, roteamento            │
└─────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────┐
│  SQUAD LEADS (Domínio)                          │
│  Lideram execução em suas áreas                 │
└─────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────┐
│  AGENTS (Execução)                              │
│  Executam tasks específicas                     │
└─────────────────────────────────────────────────┘
```

## 2. Tipos de Agente

### Advisory (Consultivo)
- **Função:** Fornecer frameworks, heurísticas, validações
- **Executa:** Nada
- **Decide:** Nada
- **Output:** Decision Memos
- **Exemplo:** Board Advisor (Mind Clones)

### Orchestration (Orquestração)
- **Função:** Coordenar, rotear, priorizar
- **Executa:** Roteamento de trabalho
- **Decide:** Qual squad/agent assume cada OS
- **Output:** OS criadas e roteadas
- **Exemplo:** OPS Squad (AIOS Master, OPS Manager)

### Operational (Operacional)
- **Função:** Executar trabalho de domínio
- **Executa:** Tasks, workflows, deliverables
- **Decide:** Como executar (não o quê)
- **Output:** Artefatos concretos
- **Exemplo:** Marketing, Sales, Dev, etc.

### Infrastructure (Infraestrutura)
- **Função:** Manter sistemas funcionando
- **Executa:** Scripts, sync, health checks
- **Decide:** Nada (determinístico)
- **Output:** Logs, status, alertas
- **Exemplo:** Clawdbot

## 3. Mapa de Squads

| Squad | Tipo | Lead | Foco |
|-------|------|------|------|
| Board | Advisory | - | Decisões estratégicas |
| OPS | Orchestration | AIOS Master | Coordenação global |
| Marketing | Operational | Marketing Lead | Go-to-market |
| Sales | Operational | Sales Lead | Conversão e receita |
| Growth | Operational | Growth Lead | Escala e otimização |
| Tech | Operational | Tech Lead | Automação e ferramentas |
| Development | Operational | Architect | Produto e código |
| Finance | Operational | Finance Lead | Viabilidade e controle |
| QA | Operational | QA Lead | Qualidade e validação |
| Translator | Operational | Translation Lead | Localização |
| Customer | Operational | Customer Lead | Pós-venda e retenção |

## 4. Responsabilidades por Papel

### Squad Lead
- Define prioridades dentro do squad
- Aprova outputs antes de entrega
- Escala bloqueios para OPS
- Mantém qualidade do squad
- Reporta status e métricas

### Agent
- Executa tasks atribuídas
- Segue workflows definidos
- Reporta bloqueios imediatamente
- Documenta outputs
- Respeita limites de custo

### Clawdbot (Especial)
- Executa scripts determinísticos
- Sincroniza dados entre sistemas
- Monitora saúde do sistema
- Não conversa, não decide
- Falha silenciosa com log

## 5. Comunicação entre Agentes

```
Agent A precisa de Agent B?
    ↓
É do mesmo squad?
    ├── SIM → Comunicação direta
    └── NÃO → Via OPS Manager
              ↓
           OPS cria OS
              ↓
           Squad B executa
              ↓
           Output retorna via OS
```

## 6. Escalation Path

```
Bloqueio técnico → Squad Lead → Tech Lead
Bloqueio de budget → Squad Lead → Finance Lead → Director
Bloqueio de prioridade → Squad Lead → OPS Manager → Director
Conflito entre squads → OPS Manager → AIOS Master → Director
Decisão estratégica → Board Advisor → Director
```

---

**Versão:** 1.0.0
**Última atualização:** 2026-02-10
