# Travel Tech Digital - Cost Policy

> Política de custos e budget para operações AIOS.
> Classificação: ORANGE (requer revisão para alterações)

## 1. Budget Global

| Período | Limite | Moeda |
|---------|--------|-------|
| Mensal | £400 | GBP |
| Mensal | ~€470 | EUR |
| Mensal | ~$500 | USD |

## 2. Limites Operacionais

| Tipo | Valor | Ação Automática |
|------|-------|-----------------|
| Alerta Diário | €15 | Notificação ao Director |
| Hard Limit Diário | €20 | Ativa SAFE MODE |
| Por Task (single) | €10 | Requer aprovação |
| Sub-Agent Default | €5 | Requer aprovação se exceder |

## 3. Categorias de Custo

Cada custo deve ser classificado em uma categoria mutuamente exclusiva:

| Código | Categoria | Descrição | Meta |
|--------|-----------|-----------|------|
| `BASE` | Baseline | Execução determinística, templates, CRON | ~0 |
| `EXEC` | Execution | Primeira chamada LLM em estado delegando | Valor principal |
| `VRFY` | Verification | Tokens durante verificação | ~0 (spike = KB drift) |
| `RCVR` | Recovery | Tokens em fallback, retries, cascades | Crescendo = degradação |
| `EXTA` | External Auto | Chamadas diretas a Gemini/GPT | Budget separado |
| `EXTM` | External Manual | Humano executa em Claude/ChatGPT | Zero após handoff |
| `DEV_` | Development | Qualquer custo em modo dev | Não conta para prod |

## 4. Modos de Budget

| Modo | Código | Uso |
|------|--------|-----|
| Operations | `OP` | Budget de automação de produção |
| Client | `CLIENT` | Trabalho billable isolado |
| Development | `DEV` | Runway isolado para experimentação |

## 5. Tracking Obrigatório

Cada OS deve registrar:

```yaml
cost:
  tokens_in: 0
  tokens_out: 0
  estimated_eur: 0.00
  actual_eur: null  # Preenchido após conclusão
  category: "EXEC"  # BASE|EXEC|VRFY|RCVR|EXTA|EXTM|DEV_
  mode: "OP"        # OP|CLIENT|DEV
```

## 6. Relatórios

| Relatório | Frequência | Responsável |
|-----------|------------|-------------|
| Daily Burn | Diário | Clawdbot (auto) |
| Squad Cost | Semanal | OPS Manager |
| Monthly Close | Mensal | Finance Lead |

## 7. SAFE MODE

Quando ativado (custo diário > €20):

1. Todas as execuções não-críticas pausadas
2. Notificação imediata ao Director
3. Apenas health checks permitidos
4. Requer aprovação manual para continuar

## 8. Otimização

Prioridade de economia de tokens:

1. **Scripts determinísticos** (custo zero)
2. **Cache de contexto** (reduz re-processamento)
3. **Templates pré-definidos** (reduz geração)
4. **Haiku para tarefas simples** (menor custo por token)

---

**Versão:** 1.0.0
**Última atualização:** 2026-02-10
