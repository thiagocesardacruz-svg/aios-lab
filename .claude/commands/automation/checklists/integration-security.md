# Integration Security Checklist

## Quando Usar
- Antes de adicionar nova integração
- Durante audit de integrações existentes
- Antes de deploy de workflows com integrações críticas

## Integração Sendo Avaliada

| Campo | Valor |
|-------|-------|
| Nome da Integração | |
| Tipo | API / Webhook / MCP / OAuth |
| Classificação de Dados | PII / Financeiro / Público |
| Ambiente | Dev / Staging / Production |

---

## 1. Autenticação

### 1.1 Tipo de Auth
- [ ] API Key
- [ ] OAuth 2.0
- [ ] JWT
- [ ] Basic Auth
- [ ] Custom

### 1.2 Segurança de Credentials
- [ ] Credentials armazenadas no n8n credential store (não hardcoded)?
- [ ] Credentials têm escopo mínimo necessário (least privilege)?
- [ ] Credentials podem ser rotacionadas?
- [ ] Existe processo de rotação definido?
- [ ] Tokens de longa duração são evitados?

### 1.3 OAuth Específico (se aplicável)
- [ ] Refresh token é usado corretamente?
- [ ] Scopes são mínimos necessários?
- [ ] Token expiration é tratada?

**Notas de Auth:**
```
```

---

## 2. Transporte de Dados

### 2.1 Criptografia
- [ ] Comunicação usa HTTPS/TLS?
- [ ] Certificados são válidos?
- [ ] TLS 1.2+ é requerido?

### 2.2 Dados em Trânsito
- [ ] Dados sensíveis são criptografados no payload?
- [ ] Headers sensíveis são protegidos?
- [ ] Logs não expõem dados sensíveis?

---

## 3. Webhooks (se aplicável)

### 3.1 Webhooks Inbound (recebendo dados)
- [ ] Webhook tem autenticação?
  - [ ] API Key no header
  - [ ] HMAC signature verification
  - [ ] IP whitelist
- [ ] Payload é validado antes de processar?
- [ ] Rate limiting está configurado?
- [ ] Webhook path é único e não previsível?

### 3.2 Webhooks Outbound (enviando dados)
- [ ] Destino é confiável?
- [ ] Retries não causam duplicação?
- [ ] Timeout adequado configurado?

---

## 4. Rate Limiting e Proteção

### 4.1 Rate Limits
- [ ] Rate limits da API são conhecidos?
- [ ] Throttling está implementado?
- [ ] Backoff exponential em caso de 429?

| Limite | Valor |
|--------|-------|
| Requests por segundo | |
| Requests por minuto | |
| Requests por dia | |

### 4.2 Circuit Breaker
- [ ] Circuit breaker implementado para APIs instáveis?
- [ ] Fallback definido quando circuit abre?

---

## 5. Dados e Privacidade

### 5.1 Classificação de Dados
| Tipo de Dado | Presente? | Proteção |
|--------------|-----------|----------|
| PII (nome, email, etc) | ⬜ | |
| Dados financeiros | ⬜ | |
| Dados de saúde | ⬜ | |
| Senhas/Secrets | ⬜ | |
| Tokens de acesso | ⬜ | |

### 5.2 Data Handling
- [ ] Dados são minimizados (só o necessário)?
- [ ] Dados sensíveis não são logados?
- [ ] Retenção de dados está definida?
- [ ] Processo de exclusão existe?

### 5.3 Compliance
- [ ] GDPR compliance (se aplicável)?
- [ ] LGPD compliance (se aplicável)?
- [ ] Data Processing Agreement existe com provider?

---

## 6. Error Handling Seguro

- [ ] Erros não expõem informações sensíveis?
- [ ] Stack traces não são retornadas para usuários?
- [ ] Erros de auth não revelam se user existe?
- [ ] Mensagens de erro são genéricas o suficiente?

---

## 7. Monitoring e Auditoria

### 7.1 Logging
- [ ] Acessos são logados?
- [ ] Erros são logados?
- [ ] Logs não contêm dados sensíveis?
- [ ] Logs têm retenção adequada?

### 7.2 Alertas
- [ ] Alertas para falhas de auth?
- [ ] Alertas para rate limit?
- [ ] Alertas para erros anormais?

---

## 8. Testes de Segurança

- [ ] Testado com credentials inválidas?
- [ ] Testado com payload malformado?
- [ ] Testado com payload grande (DoS)?
- [ ] Testado com injection attempts?

---

## Resultado da Avaliação

### Risk Score

| Área | Score (1-5) | Peso | Weighted |
|------|-------------|------|----------|
| Autenticação | | 25% | |
| Transporte | | 20% | |
| Webhooks | | 15% | |
| Rate Limiting | | 10% | |
| Dados/Privacidade | | 20% | |
| Monitoring | | 10% | |
| **TOTAL** | | | /5.0 |

### Risk Level
- [ ] **LOW** (4.0-5.0): Aprovado
- [ ] **MEDIUM** (3.0-3.9): Aprovado com mitigações
- [ ] **HIGH** (2.0-2.9): Revisão necessária
- [ ] **CRITICAL** (<2.0): Não aprovado

### Issues Identificados

| # | Severidade | Issue | Mitigação |
|---|------------|-------|-----------|
| 1 | | | |
| 2 | | | |

### Plano de Mitigação

1. _______________
2. _______________

---

**Avaliador:** _______________
**Data:** _______________
**Próxima Revisão:** _______________
