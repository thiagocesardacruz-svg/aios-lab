# Write SEO Content

```yaml
---
task: Write SEO Content
responsavel: "@brian-dean"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada:
  - campo: topic
    tipo: string
    obrigatorio: true
  - campo: target_keyword
    tipo: string
    obrigatorio: true
  - campo: content_type
    tipo: string
    obrigatorio: true
    validacao: "blog-post | pillar-page | guide | listicle | how-to"
  - campo: word_count_target
    tipo: number
    obrigatorio: false
Saida:
  - campo: seo_content
    tipo: string
  - campo: meta_tags
    tipo: object
  - campo: internal_links_suggestions
    tipo: array
Checklist:
  - "[ ] Pesquisa de keyword"
  - "[ ] Analise de concorrencia (Skyscraper step 1)"
  - "[ ] Criar versao superior (Skyscraper step 2)"
  - "[ ] Intro com APP Method"
  - "[ ] Body com Bucket Brigades"
  - "[ ] Writing GPS (Handley)"
  - "[ ] SEO On-Page checklist"
  - "[ ] Content Upgrade strategy"
---
```

---

## Execution Steps

### 1. Keyword Research
Identificar keyword principal + LSI keywords. Mapear volume de busca, dificuldade e intencao de busca (informacional, transacional, navegacional).

### 2. Competitive Analysis
Skyscraper Step 1: analisar top 10 do Google para a keyword alvo. Avaliar cada resultado nas 4 dimensoes:
- **Length** — Quao completo e o conteudo?
- **Freshness** — Quao atualizado esta?
- **Design** — Visual, formatacao, legibilidade?
- **Depth** — Profundidade de analise, dados, exemplos?

### 3. Content Planning
Skyscraper Step 2: definir estrutura SUPERIOR ao melhor concorrente. Planejar outline com H2s e H3s que cubram tudo que os concorrentes cobrem + gaps que eles deixaram.

### 4. Intro
Aplicar APP Method de Dean:
- **Agree** — Concordar com algo que o leitor ja sabe/sente
- **Promise** — Prometer o que o post vai entregar
- **Preview** — Mostrar um preview do conteudo (dados, resultados, framework)

### 5. Writing
Handley Writing GPS:
- **Goal** — Definir objetivo claro do conteudo
- **TUFD (The Ugly First Draft)** — Escrever sem editar, fluxo livre
- **Edit** — Revisar estrutura, clareza, fluxo
- **Polish** — Refinar linguagem, cortar gordura, otimizar

### 6. Engagement
Inserir Bucket Brigades nos pontos de abandono (apos paragrafos densos, antes de secoes tecnicas):
- "Aqui esta o ponto..."
- "Mas espera — tem mais..."
- "E a melhor parte?"
- "Voce deve estar pensando..."
- "Na pratica, isso significa..."

### 7. SEO Optimization
Dean On-Page Checklist:
- Title tag com keyword (primeiros 60 caracteres)
- Meta description com keyword + CTA (155 caracteres)
- H2s com keyword e variacoes
- Alt text descritivo em todas as imagens
- URL slug curto e com keyword
- Keyword no primeiro paragrafo
- Links internos para conteudo relacionado
- Links externos para fontes autoritativas

### 8. Content Upgrade
Criar lead magnet complementar ao post (Dean Content Upgrade Strategy):
- Checklist, template, planilha, ou guia rapido
- Diretamente relacionado ao conteudo do post
- CTA para download inserido no corpo do artigo
- Objetivo: converter leitores em leads

### 9. Outreach Plan
Skyscraper Step 3: montar lista de sites para outreach:
- Identificar quem linkou para conteudos inferiores
- Preparar template de email personalizado
- Sequencia de follow-up (3 toques)
- Priorizar por Domain Authority e relevancia

### 10. Review
Handley 13 Writing Rules check:
- Cada frase justifica sua existencia?
- Linguagem clara e direta?
- Voz ativa predominante?
- Jargao eliminado ou explicado?
- Dados e fontes citados?
- Formatacao facilita scanning?

---

## Output

Conteudo SEO completo + meta tags + plano de outreach + content upgrade strategy
