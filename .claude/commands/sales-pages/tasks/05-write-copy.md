# Task: Write Copy

## Metadata
- **ID:** write-copy
- **Agent:** copy-chief
- **Phase:** Creation
- **Duration:** 60-120 min
- **Depends On:** write-headlines, structure-offer

## Objective
Escrever o copy completo da página de vendas, seção por seção, seguindo estrutura persuasiva.

## Inputs
```yaml
required:
  - avatar: Output de define-avatar
  - complete_offer: Output de structure-offer
  - headline_package: Output de write-headlines
```

## Page Structure

### 1. Above The Fold
```markdown
## Componentes:
- [ ] Headline principal
- [ ] Sub-headline
- [ ] Hero visual (placeholder)
- [ ] CTA primário
- [ ] Micro-prova social
```

### 2. Problem Agitation
```markdown
## Objetivo: Conectar com a dor

### Pattern:
1. Identificar situação atual
2. Descrever sintomas do problema
3. Amplificar consequências
4. Criar urgência emocional
5. Transição para solução

### Técnicas:
- "Você já se sentiu..."
- "Se você é como a maioria..."
- Storytelling de identificação
```

### 3. Solution Introduction
```markdown
## Objetivo: Apresentar a transformação

### Pattern:
1. Introduzir mudança de paradigma
2. Apresentar mecanismo único
3. Explicar por que funciona
4. Mostrar resultado possível
```

### 4. Product Presentation
```markdown
## Objetivo: Mostrar o que está incluído

### Para cada módulo/componente:
- Nome do módulo
- O que vai aprender
- Resultado específico
- Tempo estimado
```

### 5. Social Proof Section
```markdown
## Elementos:
- Depoimentos (mínimo 3)
- Resultados específicos
- Antes/Depois
- Logos de mídia (se aplicável)
- Números (alunos, resultados)
```

### 6. Offer Stack Presentation
```markdown
## Pattern:
1. Recap do que está incluído
2. Valor de cada componente
3. Total do valor
4. Preço especial
5. Economia destacada
```

### 7. Guarantee Section
```markdown
## Objetivo: Eliminar risco

### Elementos:
- Nome da garantia
- Duração
- Condições claras
- Reforço de confiança
```

### 8. FAQ Section
```markdown
## Abordar objeções:
- Preço
- Tempo necessário
- Nível de dificuldade
- Resultados esperados
- Suporte incluído
```

### 9. Final CTA
```markdown
## Componentes:
- Recap da transformação
- Urgência/Escassez
- CTA final
- Nota de escassez
```

## Writing Guidelines

### Voice & Tone
- [ ] Usar "você" extensivamente
- [ ] Tom conversacional
- [ ] Frases curtas e parágrafos curtos
- [ ] Bullet points para facilitar leitura

### Power Words
Incorporar palavras de impacto:
- Urgência: agora, hoje, imediatamente
- Exclusividade: secreto, revelado, descoberta
- Garantia: comprovado, garantido, certo
- Facilidade: simples, passo-a-passo, fácil

### Formatting
- [ ] Headers H2/H3 para cada seção
- [ ] Bullets para listas de benefícios
- [ ] Bold para pontos-chave
- [ ] Espaçamento generoso

## Outputs
```yaml
page_copy:
  sections:
    above_fold: ""
    problem: ""
    solution: ""
    product: ""
    proof: ""
    offer: ""
    guarantee: ""
    faq: ""
    final_cta: ""
  word_count: 0
  reading_time: ""
```

## Success Criteria
- [ ] Todas as 9 seções completas
- [ ] Copy adaptada ao avatar
- [ ] Objeções principais abordadas
- [ ] CTAs em posições estratégicas
- [ ] Formatação escaneável
