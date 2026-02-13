# Workflow Design Review Checklist

## Quando Usar
Antes de aprovar um design de workflow para implementação.

## Revisor
- [ ] Identificação do revisor: _______________
- [ ] Data da revisão: _______________

---

## 1. Clareza dos Requisitos

- [ ] Use case está claramente definido?
- [ ] Inputs esperados estão documentados?
- [ ] Outputs esperados estão documentados?
- [ ] Critérios de sucesso estão definidos?

**Notas:**
```
(Adicionar observações aqui)
```

## 2. Trigger

- [ ] Tipo de trigger apropriado para o use case?
- [ ] Configuração do trigger está completa?
- [ ] Frequência/timing faz sentido?

| Pergunta | Resposta |
|----------|----------|
| Tipo de trigger | webhook / schedule / manual / event |
| Justificativa | |

## 3. Arquitetura de Nodes

- [ ] Nodes selecionados são os mais apropriados?
- [ ] Existem alternativas melhores para algum node?
- [ ] Complexidade é justificada?
- [ ] Nodes deprecated não estão sendo usados?

**Análise de Nodes:**
| Node | Tipo | Alternativa Considerada | Decisão |
|------|------|------------------------|---------|
| | | | |

## 4. Fluxo de Dados

- [ ] Dados fluem logicamente entre nodes?
- [ ] Transformações necessárias estão documentadas?
- [ ] Não há perda de dados no caminho?
- [ ] Formato dos dados é consistente?

**Data Flow Diagram:**
```
(Verificar se o diagrama está claro)
```

## 5. Error Handling

- [ ] Estratégia de error handling está definida?
- [ ] Retry logic faz sentido?
- [ ] Timeouts estão apropriados?
- [ ] Notificação de erros está configurada?
- [ ] Fallback/recovery path existe?

| Cenário de Erro | Handling | Adequado? |
|-----------------|----------|-----------|
| API timeout | | ⬜ |
| Invalid input | | ⬜ |
| Rate limit | | ⬜ |
| Auth failure | | ⬜ |

## 6. Performance

- [ ] Número de nodes é otimizado?
- [ ] Loops são necessários e otimizados?
- [ ] API calls estão minimizadas?
- [ ] Dados grandes são paginados?
- [ ] Paralelização foi considerada?

**Estimativas:**
| Métrica | Valor |
|---------|-------|
| Tempo de execução estimado | |
| API calls por execução | |
| Tokens AI por execução | |

## 7. Custos

- [ ] Custos de AI estão estimados?
- [ ] Custos de APIs externas estão estimados?
- [ ] Custo total por execução calculado?
- [ ] Custo mensal estimado faz sentido?

| Item | Custo por Run | Runs/Mês | Total |
|------|---------------|----------|-------|
| AI tokens | | | |
| APIs | | | |
| **Total** | | | |

## 8. Segurança

- [ ] Credentials são referenciadas (não hardcoded)?
- [ ] Dados sensíveis são protegidos?
- [ ] Webhooks têm autenticação (se públicos)?
- [ ] Rate limiting considerado?
- [ ] GDPR/LGPD compliance?

**Security Concerns:**
```
(Listar preocupações identificadas)
```

## 9. Testabilidade

- [ ] Workflow pode ser testado em partes?
- [ ] Dados de teste estão definidos?
- [ ] Cenários de teste listados?

**Test Scenarios:**
- [ ] Happy path
- [ ] Error path
- [ ] Edge cases: _______________

## 10. Manutenibilidade

- [ ] Design é compreensível?
- [ ] Documentação inline planejada?
- [ ] Configurações são externalizadas?
- [ ] Fácil de debugar?

---

## Resultado da Revisão

### Issues Encontrados

| # | Severidade | Descrição | Ação Requerida |
|---|------------|-----------|----------------|
| 1 | High/Med/Low | | |
| 2 | | | |

### Recomendações

1. _______________
2. _______________

### Decisão

- [ ] **APROVADO** - Pode prosseguir para implementação
- [ ] **APROVADO COM RESSALVAS** - Implementar com as alterações listadas
- [ ] **REVISÃO NECESSÁRIA** - Retornar para n8n-architect com feedback
- [ ] **REJEITADO** - Design inadequado, explicar razões

**Justificativa:**
```
(Explicar a decisão)
```

---

**Revisor:** _______________
**Data:** _______________
**Assinatura:** _______________
