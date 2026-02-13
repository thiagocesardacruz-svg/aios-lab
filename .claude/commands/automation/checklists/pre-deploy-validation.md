# Pre-Deploy Validation Checklist

## Quando Usar
Antes de fazer deploy de qualquer workflow para produção.

## Checklist

### 1. Estrutura do Workflow

- [ ] Workflow tem nome descritivo
- [ ] Todos os nodes têm nomes claros (não "Node 1", "Node 2")
- [ ] Connections estão completas (sem nodes orphans)
- [ ] Não há nodes desabilitados esquecidos
- [ ] Settings estão corretos (executionOrder: v1)

### 2. Trigger

- [ ] Trigger está configurado corretamente
- [ ] **Webhook:** path único e descritivo
- [ ] **Schedule:** horário correto (timezone!)
- [ ] **Manual:** tem forma de testar
- [ ] Respond to Webhook existe se necessário

### 3. Nodes Individuais

- [ ] Todos os nodes têm `typeVersion` correto
- [ ] Parâmetros obrigatórios preenchidos
- [ ] Expressions usam formato correto (`{{ }}`)
- [ ] HTTP Request: timeout configurado
- [ ] Code nodes: sem console.log em produção

### 4. Credentials

- [ ] Nenhum credential hardcoded no workflow
- [ ] Credentials usam variáveis de ambiente ou n8n credentials
- [ ] Todos os credentials necessários existem na instância destino
- [ ] Credentials têm permissões adequadas

### 5. Error Handling

- [ ] Error handling configurado (workflow ou node level)
- [ ] Erros são logados ou notificados
- [ ] Retry configurado para APIs instáveis
- [ ] Timeout adequado para operações longas

### 6. Validação Técnica

- [ ] Passou em `mcp__n8n-mcp__validate_workflow`
- [ ] Zero erros críticos
- [ ] Warnings revisados e aceitos
- [ ] Profile usado: `strict` para produção

### 7. Testes

- [ ] Testado com dados reais ou mock realista
- [ ] Testado cenário de sucesso (happy path)
- [ ] Testado cenário de erro
- [ ] Testado edge cases relevantes
- [ ] Performance aceitável

### 8. Documentação

- [ ] README do workflow existe
- [ ] Inputs esperados documentados
- [ ] Outputs documentados
- [ ] Dependências documentadas (credentials, APIs)
- [ ] Notes nos nodes complexos

### 9. Security

- [ ] Não expõe dados sensíveis em logs
- [ ] Webhook tem autenticação se necessário
- [ ] Rate limits considerados
- [ ] GDPR/LGPD compliance se lida com PII

### 10. Custos

- [ ] Custo por execução estimado
- [ ] Não há loops infinitos possíveis
- [ ] Limites de rate configurados
- [ ] Budget de AI definido se usa AI

## Resultado

| Item | Status |
|------|--------|
| Estrutura | ⬜ |
| Trigger | ⬜ |
| Nodes | ⬜ |
| Credentials | ⬜ |
| Error Handling | ⬜ |
| Validação | ⬜ |
| Testes | ⬜ |
| Documentação | ⬜ |
| Security | ⬜ |
| Custos | ⬜ |

**Aprovado para deploy:** ⬜ Sim / ⬜ Não

**Revisor:** _______________
**Data:** _______________
