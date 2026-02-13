# Task: Audit Integrations

## Metadata
```yaml
task_id: audit-integrations
agent: integration-engineer
priority: P2
estimated_time: 1-2h
inputs:
  - workflow_id: string (optional - audita workflow específico)
  - scope: enum [workflow, squad, all] (default: squad)
outputs:
  - audit_report: yaml
  - issues: array
  - recommendations: array
```

## Objetivo
Auditar integrações e conexões para identificar problemas de segurança, performance e manutenção.

## Steps

### 1. Definir Escopo
```
□ Workflow específico? → Auditar apenas este
□ Squad inteiro? → Auditar todas as integrações usadas
□ All? → Auditar catálogo completo
```

### 2. Coletar Informações
```bash
# Para workflow específico
mcp__n8n-mcp__n8n_get_workflow --id {workflow_id} --mode standard

# Extrair integrações usadas
# - Nodes que usam APIs externas
# - Credentials referenciadas
# - Webhooks configurados
```

### 3. Checklist de Segurança

#### 3.1 Credentials
```
□ Nenhum API key hardcoded no workflow?
□ Credentials usam n8n credential store?
□ Permissões são mínimas necessárias?
□ Tokens não expirados?
□ Rotação de secrets configurada?
```

#### 3.2 Webhooks
```
□ Webhooks têm autenticação?
□ HTTPS only?
□ Validação de payload?
□ Rate limiting?
□ IP whitelist (se aplicável)?
```

#### 3.3 Data Handling
```
□ PII é tratado corretamente?
□ Dados sensíveis não são logados?
□ GDPR/LGPD compliance?
□ Data retention definido?
```

### 4. Checklist de Performance

#### 4.1 Rate Limits
```
□ Rate limits da API conhecidos?
□ Throttling implementado?
□ Retry com backoff?
□ Circuit breaker para APIs instáveis?
```

#### 4.2 Timeouts
```
□ Timeouts configurados?
□ Adequados para a API?
□ Fallback em caso de timeout?
```

#### 4.3 Caching
```
□ Dados cacheaveis estão sendo cacheados?
□ Cache TTL apropriado?
□ Cache invalidation definido?
```

### 5. Checklist de Manutenção

#### 5.1 Documentação
```
□ Integração documentada?
□ Auth flow documentado?
□ Endpoints usados listados?
□ Error codes mapeados?
```

#### 5.2 Monitoramento
```
□ Health check configurado?
□ Alertas de falha?
□ Métricas de uso?
```

#### 5.3 Dependências
```
□ Versão da API documentada?
□ Breaking changes monitorados?
□ Plano de migração se deprecado?
```

### 6. Classificar Issues

| Severidade | Definição | Ação |
|------------|-----------|------|
| **Critical** | Segurança comprometida | Corrigir imediatamente |
| **High** | Risco de falha em produção | Corrigir em 24h |
| **Medium** | Performance degradada | Corrigir em 1 semana |
| **Low** | Melhoria recomendada | Backlog |

### 7. Gerar Relatório
```yaml
integration_audit:
  scope: "{scope}"
  audited_at: "{timestamp}"
  audited_by: "@integration-engineer"

  summary:
    integrations_checked: {n}
    issues_found: {n}
    critical: {n}
    high: {n}
    medium: {n}
    low: {n}

  integrations:
    - name: "{integration_name}"
      type: "api | webhook | mcp"
      status: "healthy | degraded | critical"
      last_checked: "{timestamp}"

      security:
        score: {0-10}
        issues:
          - severity: "critical"
            issue: "{descrição}"
            recommendation: "{como resolver}"

      performance:
        score: {0-10}
        avg_latency: "{ms}"
        error_rate: "{%}"
        issues: []

      maintenance:
        score: {0-10}
        documentation: "complete | partial | missing"
        issues: []

  recommendations:
    immediate:
      - "{ação urgente 1}"
    short_term:
      - "{ação em 1 semana}"
    long_term:
      - "{melhoria futura}"
```

### 8. Atualizar Integration Catalog
Se encontrar novas integrações não catalogadas:
```yaml
# Adicionar em data/integration-catalog.yaml
- name: "{integration}"
  type: "{type}"
  auth: "{auth_type}"
  rate_limit: "{rate}"
  docs: "{url}"
  last_audit: "{timestamp}"
```

## Output
```yaml
audit_complete:
  scope: "{scope}"
  integrations_checked: {n}
  issues_found: {n}
  critical_issues: {n}
  report_path: "reports/integration-audit-{date}.yaml"
  next_audit: "{date + 30 days}"
```

## Quality Gate
- [ ] Todas integrações no escopo auditadas
- [ ] Issues classificados por severidade
- [ ] Recommendations documentadas
- [ ] Catálogo atualizado
- [ ] Próximo audit agendado
