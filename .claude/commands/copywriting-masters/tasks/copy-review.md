# Copy Review

```yaml
---
task: Copy Review
responsavel: "@john-carlton"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada:
  - campo: copy_text
    tipo: string
    obrigatorio: true
  - campo: copy_type
    tipo: string
    obrigatorio: true
    validacao: "sales-letter | email | landing-page | vsl | ad | headline"
  - campo: review_depth
    tipo: string
    obrigatorio: false
    validacao: "quick | standard | deep (default: standard)"
Saida:
  - campo: review_report
    tipo: object
  - campo: score
    tipo: number
  - campo: rewrite_suggestions
    tipo: array
Checklist:
  - "[ ] Ler copy completo"
  - "[ ] Aplicar Carlton SWS 17-point checklist"
  - "[ ] Aplicar Wiebe Seven Sweeps"
  - "[ ] Aplicar Cialdini Persuasion Audit"
  - "[ ] Verificar Sugarman Slippery Slide"
  - "[ ] Scoring por criterio"
  - "[ ] Sugestoes de rewrite priorizadas"
---
```

---

## Execution Steps

### 1. First Read
Ler copy inteiro como prospect faria. Anotar:
- Onde parou de ler
- Onde ficou confuso
- Onde perdeu interesse
- Onde sentiu ceticismo
- Onde sentiu desejo de agir

### 2. SWS 17-Point Check (Carlton)
Aplicar cada um dos 17 pontos da Simple Writing System como checklist:
- A headline captura atencao imediata?
- O lead conecta com a dor/desejo do prospect?
- Ha uma Big Idea clara?
- O copy fala COM o prospect (nao SOBRE o produto)?
- Beneficios estao antes de features?
- Ha prova suficiente para cada claim?
- O offer e irresistivel?
- Ha urgencia real?
- O CTA e claro e especifico?
- A garantia remove risco?
- Ha P.S. estrategico?
- Cada secao flui para a proxima?
- O tom e conversacional?
- Ha especificidade (numeros, nomes, detalhes)?
- Objecoes sao antecipadas e refutadas?
- Ha razao para agir AGORA?
- O copy seria aprovado pelo "bar stool test"?

### 3. Seven Sweeps (Wiebe)
7 passes sequenciais pela copy:
1. **Clarity Sweep** — Cada frase e imediatamente compreensivel?
2. **Voice Sweep** — O tom e consistente e adequado ao publico?
3. **"So What?" Sweep** — Cada afirmacao tem relevancia clara para o prospect?
4. **"Prove It" Sweep** — Cada claim tem evidencia ou prova?
5. **Specificity Sweep** — Generalidades foram substituidas por dados concretos?
6. **Emotion Sweep** — Ha conexao emocional suficiente?
7. **Zero Risk Sweep** — O prospect sente que nao tem nada a perder?

### 4. Slippery Slide Test (Sugarman)
Cada frase compele a ler a proxima? Identificar:
- Onde o "slide" (fluxo de leitura) quebra
- Frases que nao puxam para a proxima
- Paragrafos que poderiam ser cortados sem perda
- Transicoes fracas entre secoes

### 5. Persuasion Audit (Cialdini)
Verificar presenca dos 7 principios:
- **Reciprocity** — Algo de valor e dado antes de pedir?
- **Commitment** — Ha micro-compromissos progressivos?
- **Social Proof** — Testemunhos, numeros, logos?
- **Authority** — Credenciais, publicacoes, endorsements?
- **Liking** — Storytelling, humor, identificacao?
- **Scarcity** — Limitacao real de tempo, vagas, estoque?
- **Unity** — Senso de grupo, identidade compartilhada?

### 6. "So What?" Test (Carlton)
Para cada claim no copy, perguntar "So what?" — se nao ha resposta convincente que conecte ao beneficio real do prospect, o claim e fraco e precisa ser reescrito ou cortado.

### 7. Scoring
Pontuar cada dimensao:
| Dimensao | Pontos | Criterio |
|----------|--------|----------|
| Headline | 20 pts | Atencao, curiosidade, beneficio claro |
| Opening | 15 pts | Hook, conexao com dor/desejo |
| Body | 20 pts | Fluxo, beneficios, engagement |
| Proof | 15 pts | Credibilidade, evidencia, especificidade |
| Offer | 15 pts | Valor percebido, stack, garantia |
| CTA | 15 pts | Clareza, urgencia, acao especifica |
| **Total** | **100 pts** | |

### 8. Rewrite Suggestions
Top 5 melhorias priorizadas por impacto:
- Cada sugestao inclui: o que mudar, por que mudar, exemplo de rewrite
- Priorizacao: impacto na conversao (alto > medio > baixo)
- Foco nas mudancas que geram maior resultado com menor esforco

---

## Output

Review Report com:
- Score total (/100) + breakdown por criterio
- Top 5 rewrites sugeridos com exemplos
- Lista completa de issues encontrados por framework
- Recomendacao de proximo passo (quick fix vs rewrite completo)
