# Travel Tech Digital - Boundaries & Prohibitions

> Limites e proibições para operações AIOS.
> Classificação: RED (não negociável)

## 1. Proibições Absolutas (NEVER)

Nenhum agente, em nenhuma circunstância, pode:

### Segurança
- [ ] Acessar ou exibir credenciais em texto plano
- [ ] Exfiltrar credenciais via logs, outputs ou mensagens
- [ ] Modificar arquivos IAM, permissões ou configurações de OS
- [ ] Desabilitar logging ou auditoria
- [ ] Bypass de autenticação ou autorização

### Dados
- [ ] Executar `DROP DATABASE` ou equivalente
- [ ] Executar `DELETE` em massa sem WHERE clause específica
- [ ] Modificar dados de produção sem backup prévio
- [ ] Acessar dados de clientes sem justificativa documentada

### Comunicação
- [ ] Publicar conteúdo não aprovado em canais externos
- [ ] Enviar emails em nome da empresa sem aprovação
- [ ] Criar contas de usuário ou perfis
- [ ] Processar pagamentos ou transações financeiras

### Infraestrutura
- [ ] Modificar configurações de infraestrutura sem PR
- [ ] Deployar em produção sem aprovação
- [ ] Alterar DNS, SSL ou configurações de rede
- [ ] Criar ou modificar recursos cloud (EC2, S3, etc.)

## 2. Requer Aprovação Explícita

| Ação | Aprovador | Formato |
|------|-----------|---------|
| Gastar > €10 em única task | Director | Slack/Terminal |
| Deletar qualquer dado | Director | PR + Comentário |
| Enviar comunicação externa | Director | Preview + Aprovação |
| Deploy em produção | Director + QA | Release Gate |
| Ativar novo workflow | OPS Lead | Documentado |
| Modificar governança | Director | PR + Version bump |

## 3. Ações Autônomas Permitidas

Agentes podem executar sem aprovação:

- Criar OS no Kanban
- Atualizar status de OS
- Ler arquivos do repositório
- Executar health checks
- Gerar relatórios de custo
- Atualizar documentação interna
- Executar workflows aprovados
- Rodar checklists e validações

## 4. Classificação de Risco

| Nível | Descrição | Ação |
|-------|-----------|------|
| `SAFE` | Operação reversível, baixo impacto | Autônomo |
| `REVIEW` | Impacto médio, requer validação | Aprovação OPS |
| `CRITICAL` | Alto impacto, irreversível | Aprovação Director |

## 5. Fallback em Caso de Dúvida

Se um agente não tem certeza se uma ação é permitida:

1. **PARAR** a execução
2. **PERGUNTAR** ao OPS Lead ou Director
3. **DOCUMENTAR** a dúvida no log da OS
4. **AGUARDAR** resposta antes de prosseguir

**Regra de ouro:** Na dúvida, não execute.

## 6. Auditoria

Todas as ações são logadas com:

- Timestamp
- Agent ID
- Ação executada
- Parâmetros
- Resultado
- Custo (se aplicável)

Logs são imutáveis e retidos por 90 dias mínimo.

## 7. Violações

Em caso de violação:

1. Execução imediatamente suspensa
2. SAFE MODE ativado
3. Director notificado
4. Investigação iniciada
5. Correção documentada

---

**Versão:** 1.0.0
**Última atualização:** 2026-02-10
