# TOOLKIT: ATUALIZAÇÃO CONTÍNUA DO CLONE

## 🎯 OBJETIVO
Evoluir o clone ao longo do tempo com novos dados e feedback.

---

## QUANDO ATUALIZAR

### Gatilhos de Atualização:
- **Mudança significativa na vida da persona real** (novo emprego, mudança de cidade, etc)
- **Feedback de uso** (clone respondeu de forma incoerente repetidamente)
- **Novos dados disponíveis** (entrevista adicional, novos comportamentos observados)
- **A cada 6 meses** (manutenção preventiva)

---

## COMO ATUALIZAR

### OPÇÃO 1: Atualização Pontual (1-2 horas)

Para mudanças pequenas/específicas:

**1. Identifique o módulo afetado**:
- Mudança financeira → Atualizar P0B
- Nova personalidade observada → Atualizar P1
- Nova frase/gíria → Atualizar P2
- Novo valor → Atualizar P3
- [...]

**2. Re-execute APENAS esse prompt**:
- Use dados atualizados
- Gere novo output
- Substitua no PSH

**3. Valide coerência**:
- Cheque se mudança não quebra outros módulos
- Execute teste conversacional rápido (10 perguntas)

**4. Atualize documentos finais**:
- System Prompt (seção afetada)
- Knowledge Base (doc afetado)

---

### OPÇÃO 2: Atualização Completa (8-12 horas)

Para mudanças grandes ou manutenção semestral:

**1. Re-execute prompts afetados** (3-5 prompts típico)
**2. Re-processe** consolidações e SYNAPSE
**3. Re-gere** humanização (se personalidade mudou)
**4. Re-gera** System Prompt e KB completos
**5. Valida** com 30 perguntas

---

## VERSIONAMENTO

### Nomenclatura:
- `clone_v1.0` = Versão inicial
- `clone_v1.1` = Atualização pontual
- `clone_v2.0` = Atualização completa

### O que versionar:
- PSH_SHELL_MASTER_v[X.X].md
- SYSTEM_PROMPT_v[X.X].txt
- Knowledge_Base_v[X.X]/ (pasta completa)

### Changelog:
Mantenha arquivo `CHANGELOG.md` com:
```
## v1.1 - 2024-12-15
- Atualizado P0B: Renda aumentou para R$ 4.000/mês
- Atualizado P2: Novas 15 frases adicionadas
- Revalidado: 28/30 ✅

## v1.0 - 2024-11-24
- Versão inicial completa
```

---

## CALIBRAÇÃO POR FEEDBACK

### Colete Feedback Estruturado:

**Após cada uso do clone**, documente:
1. **O clone respondeu de forma coerente?** (Sim/Não)
2. **Se não, qual foi a incoerência?** (Específico)
3. **Qual módulo provavelmente causou?** (P1? P2? P3?)
4. **Sugestão de correção**: (...)

**A cada 10 usos**, revise feedback e identifique padrões.

**Se >= 3 incoerências do mesmo tipo**, atualize módulo responsável.

---

## EXPANSÃO DO CLONE

### Adicionar Novos Contextos:

Se quiser expandir para novos domínios:

**Exemplo**: Clone foi criado para contexto profissional, agora quer adicionar contexto de relacionamento amoroso.

**Passos**:
1. Crie novo módulo: `P10_relacionamentos.md`
2. Execute prompt específico para esse domínio
3. Integre no PSH existente
4. Adicione à Knowledge Base: `13_relacionamentos.md`
5. Valide com perguntas específicas desse contexto

---

## TROUBLESHOOTING

### Problema: Clone soa genérico
**Solução**: Re-executar P2 (Linguagem) com mais exemplos específicos

### Problema: Clone toma decisões incoerentes
**Solução**: Re-validar P3 (Valores) e P7 (Compra) - pode ter conflito

### Problema: Clone não mostra ansiedade financeira
**Solução**: Re-enfatizar P0B e P5 no System Prompt

### Problema: Clone é muito "perfeito"
**Solução**: Re-reforçar Blind Spots e Paradoxos, adicionar mais contradições

---

## BACKUP E SEGURANÇA

**SEMPRE mantenha**:
- ✅ Cópias de todas as versões
- ✅ Dados originais do briefing
- ✅ Outputs de TODOS os prompts (P0-P9)
- ✅ PSH de cada versão

**Recomendação**: Google Drive, Dropbox ou Git para controle de versão.

---

**Próximo**: `calibracao_feedback.md` para ajustes finos
