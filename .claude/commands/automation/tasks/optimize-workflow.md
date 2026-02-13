# Task: Optimize Workflow

## Metadata
```yaml
task_id: optimize-workflow
agent: n8n-builder
priority: P2
estimated_time: 1-3h
inputs:
  - workflow_id: string (required)
  - optimization_goal: enum [performance, cost, reliability] (default: all)
outputs:
  - optimized_workflow: json
  - improvements: array
  - metrics_before_after: object
```

## Objetivo
Otimizar workflow n8n para melhor performance, menor custo ou maior confiabilidade.

## Steps

### 1. Baseline Metrics
```yaml
baseline:
  execution_time_avg: "{ms}"
  execution_time_p95: "{ms}"
  tokens_per_run: {n}
  api_calls_per_run: {n}
  error_rate: "{%}"
  cost_per_run: "€{value}"
```

### 2. Análise de Performance

#### 2.1 Identificar Gargalos
```
□ Quais nodes demoram mais?
□ Há chamadas de API sequenciais que poderiam ser paralelas?
□ Dados grandes sendo processados ineficientemente?
□ Loops desnecessários?
```

#### 2.2 Otimizações de Performance
| Problema | Solução |
|----------|---------|
| APIs sequenciais | Paralelizar com SplitInBatches |
| Loop grande | Usar SplitInBatches com batches menores |
| Transformação lenta | Otimizar Code node |
| Dados duplicados | Deduplicar antes de processar |
| Polling frequente | Usar webhooks se disponível |

### 3. Análise de Custo

#### 3.1 Identificar Custos
```
□ Quais nodes usam AI? Quantos tokens?
□ Quais APIs têm custo por chamada?
□ Há chamadas desnecessárias?
□ Dados sendo processados mais de uma vez?
```

#### 3.2 Otimizações de Custo
| Problema | Solução |
|----------|---------|
| AI tokens excessivos | Reduzir prompt, usar modelo menor |
| API calls duplicados | Cache resultados |
| Dados processados 2x | Reorganizar fluxo |
| Execuções desnecessárias | Adicionar filtros no início |

### 4. Análise de Confiabilidade

#### 4.1 Identificar Riscos
```
□ Quais nodes podem falhar?
□ Error handling adequado?
□ Retry configurado?
□ Timeouts definidos?
□ Circuit breaker para APIs instáveis?
```

#### 4.2 Otimizações de Confiabilidade
| Problema | Solução |
|----------|---------|
| Sem error handling | Adicionar Error Trigger |
| API instável | Adicionar retry com backoff |
| Timeout não definido | Configurar timeout adequado |
| Falha silenciosa | Adicionar notificação de erro |
| Sem idempotência | Adicionar deduplicação |

### 5. Aplicar Otimizações

#### 5.1 Performance
```javascript
// Antes: APIs sequenciais
// Node1 → API Call A → Node2 → API Call B → Node3

// Depois: APIs paralelas
// Node1 → SplitInBatches → [API Call A, API Call B] → Merge → Node3
```

#### 5.2 Custo
```javascript
// Antes: AI processa tudo
const response = await ai.process(fullDocument);

// Depois: Filtrar antes, AI processa menos
const relevant = filterRelevant(fullDocument);
const response = await ai.process(relevant);
```

#### 5.3 Confiabilidade
```javascript
// Adicionar retry pattern
const maxRetries = 3;
const baseDelay = 1000;

for (let i = 0; i < maxRetries; i++) {
  try {
    return await apiCall();
  } catch (error) {
    if (i === maxRetries - 1) throw error;
    await sleep(baseDelay * Math.pow(2, i));
  }
}
```

### 6. Validar Otimizações
```bash
# Validar workflow otimizado
mcp__n8n-mcp__validate_workflow --workflow {optimized_json} --profile strict
```

### 7. Testar
```
□ Testar com dados reais
□ Comparar métricas antes/depois
□ Confirmar que funcionalidade não foi afetada
□ Testar cenários de erro
```

### 8. Documentar Mudanças
```yaml
optimization_report:
  workflow_id: "{id}"
  optimized_at: "{timestamp}"
  optimized_by: "@n8n-builder"

  goal: "{goal}"

  changes:
    - type: "performance | cost | reliability"
      description: "{o que foi feito}"
      impact: "{resultado esperado}"

  metrics:
    before:
      execution_time_avg: "{ms}"
      cost_per_run: "€{value}"
      error_rate: "{%}"
    after:
      execution_time_avg: "{ms}"
      cost_per_run: "€{value}"
      error_rate: "{%}"
    improvement:
      execution_time: "-{%}"
      cost: "-{%}"
      reliability: "+{%}"
```

### 9. Deploy (se aprovado)
```bash
# Atualizar workflow em produção
mcp__n8n-mcp__n8n_update_full_workflow --id {workflow_id} --workflow {optimized_json}
```

## Optimization Checklist Quick Reference

### Performance ⚡
- [ ] Paralelizar quando possível
- [ ] Batch processing para loops grandes
- [ ] Cache dados que não mudam frequentemente
- [ ] Usar webhooks em vez de polling
- [ ] Otimizar Code nodes

### Cost 💰
- [ ] Reduzir tokens de AI (prompts menores)
- [ ] Filtrar dados antes de processar
- [ ] Cache resultados de APIs pagas
- [ ] Usar modelo AI mais barato quando possível
- [ ] Eliminar chamadas redundantes

### Reliability 🛡️
- [ ] Error handling em todos os paths
- [ ] Retry com exponential backoff
- [ ] Timeouts adequados
- [ ] Notificação de falhas
- [ ] Idempotência

## Output
```yaml
optimization_complete:
  workflow_id: "{id}"
  improvements:
    - "{melhoria 1}"
    - "{melhoria 2}"
  metrics_improvement:
    performance: "+{%}"
    cost: "-{%}"
    reliability: "+{%}"
  deployed: true|false
```

## Quality Gate
- [ ] Baseline metrics coletados
- [ ] Otimizações aplicadas
- [ ] Validação passou
- [ ] Testes confirmam funcionalidade
- [ ] Métricas melhoraram
- [ ] Documentação atualizada
