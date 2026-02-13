# Task: Strategic Brief

## Objective
Consolidar todas as descobertas em um documento estratégico único que serve de base para PRD e desenvolvimento.

## Context
O Strategic Brief é o output final da pesquisa profunda. Deve ser claro, acionável e servir como "north star" do projeto.

## Process

### Step 1: Gather All Outputs
Colete os outputs das tasks anteriores:
- [ ] Problem statement
- [ ] Audience personas
- [ ] Market analysis
- [ ] Competitor mapping
- [ ] Gap analysis / SWOT
- [ ] Positioning statement

### Step 2: Executive Summary
Escreva em 1 parágrafo:
- O que estamos criando
- Para quem
- Por que agora
- O que nos diferencia

### Step 3: Strategic Brief Document

Use template: `templates/strategic-brief-tmpl.md`

```markdown
# Strategic Brief: [Project Name]

## 1. Executive Summary
[1 paragraph overview]

## 2. Problem & Opportunity
**Problem Statement:**
>

**Why Now:**
>

**Opportunity Size:**
- TAM:
- SAM:
- SOM:

## 3. Target Audience
**Primary Persona:**
[Summary]

**Key Insight:**
>

## 4. Competitive Landscape
**Direct Competitors:**
-

**Our Differentiation:**
>

**Market Sophistication Level:** [1-5]

## 5. Positioning
**Positioning Statement:**
>

**Value Proposition:**
>

**Key Messages:**
1.
2.
3.

## 6. Strategic Priorities
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

## 7. Success Metrics
| Metric | Target | Timeframe |
|--------|--------|-----------|
| | | |

## 8. Risks & Mitigations
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| | | | |

## 9. Next Steps
- [ ] Step 1
- [ ] Step 2
- [ ] Step 3

## 10. Appendix
- Link to full research documents
- Data sources
- Interview notes
```

### Step 4: Validation Checklist
- [ ] Problem is clearly defined and validated
- [ ] Target audience is specific and researched
- [ ] Market opportunity is sized and timed
- [ ] Competition is mapped and differentiation is clear
- [ ] Positioning is unique and defensible
- [ ] Next steps are actionable

### Step 5: Review & Sign-off
- Present to stakeholders
- Gather feedback
- Finalize document

## Output
- `strategic-brief.md` - Complete strategic document
- Ready to create PRD
- Ready to start development

## Next Steps
→ Create PRD based on strategic brief
→ Start product development
→ Create marketing assets

---

## Prompts de Apoio

### Para Executive Summary
```
Crie um executive summary de 1 parágrafo para este projeto:

Problem: [PROBLEM]
Audience: [AUDIENCE]
Solution: [SOLUTION]
Differentiation: [DIFFERENTIATION]

O summary deve:
- Começar com o problema
- Apresentar a solução
- Destacar a oportunidade
- Criar urgência
```

### Para Strategic Priorities
```
Com base nesta pesquisa:
[SUMMARY OF FINDINGS]

Defina as 3 prioridades estratégicas mais importantes para o lançamento:

Para cada prioridade, indique:
1. O que é e por que importa
2. Como medir sucesso
3. Principais riscos
4. Dependências
```
