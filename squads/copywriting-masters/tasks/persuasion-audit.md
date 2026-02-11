# Persuasion Audit

```yaml
---
task: Persuasion Audit
responsavel: "@robert-cialdini"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada:
  - campo: material_to_audit
    tipo: string
    obrigatorio: true
  - campo: material_type
    tipo: string
    obrigatorio: true
    validacao: "sales-letter | email | landing-page | vsl | funnel | ad | website"
  - campo: audit_depth
    tipo: string
    obrigatorio: false
    validacao: "quick | full (default: full)"
Saida:
  - campo: audit_report
    tipo: object
  - campo: persuasion_score
    tipo: number
  - campo: principle_scores
    tipo: object
  - campo: recommendations
    tipo: array
Checklist:
  - "[ ] Analisar Reciprocity"
  - "[ ] Analisar Commitment & Consistency"
  - "[ ] Analisar Social Proof"
  - "[ ] Analisar Authority"
  - "[ ] Analisar Liking"
  - "[ ] Analisar Scarcity"
  - "[ ] Analisar Unity"
  - "[ ] Aplicar Pre-Suasion check"
  - "[ ] Score por principio"
  - "[ ] Recomendacoes priorizadas"
---
```

---

## Execution Steps

### 1. Reciprocity Check
O material da algo de valor antes de pedir?
- Ebooks, trials, conteudo gratuito, ferramentas free
- Valor entregue ANTES do pedido de compra
- Qualidade do que e dado (alto valor = alta reciprocidade)
- **Score 0-15:** 0 = ausente, 5 = fraco, 10 = presente, 15 = forte

### 2. Commitment & Consistency
Ha micro-compromissos progressivos?
- Quiz, opt-in, small yes before big yes
- Foot-in-the-door technique
- Declaracoes de identidade ("Se voce e do tipo que...")
- Progressao logica de compromissos menores para maiores
- **Score 0-15:** 0 = ausente, 5 = fraco, 10 = presente, 15 = forte

### 3. Social Proof
Testimonials, ratings, numeros de usuarios, logos de clientes, case studies?
- Quantidade de prova social
- Qualidade (especificidade, credibilidade, relevancia)
- Variedade (diferentes tipos de prova)
- Posicionamento estrategico no material
- **Score 0-15:** 0 = ausente, 5 = fraco, 10 = presente, 15 = forte

### 4. Authority
Credenciais, awards, publicacoes, associacoes, endorsements?
- Credenciais do autor/empresa
- Endossos de figuras reconhecidas
- Publicacoes, midia, premios
- Dados de pesquisa, estudos citados
- **Score 0-15:** 0 = ausente, 5 = fraco, 10 = presente, 15 = forte

### 5. Liking
Storytelling pessoal, humor, vulnerabilidade, similaridade com o prospect?
- Historia pessoal que gera identificacao
- Tom conversacional e acessivel
- Humor apropriado
- Demonstracao de vulnerabilidade/autenticidade
- Similaridade com o publico-alvo
- **Score 0-15:** 0 = ausente, 5 = fraco, 10 = presente, 15 = forte

### 6. Scarcity
Tempo limitado, estoque limitado, exclusividade, edicao limitada?
- Escassez de tempo (deadline real)
- Escassez de quantidade (vagas, unidades)
- Exclusividade (acesso restrito)
- Urgencia percebida vs urgencia real
- **Score 0-15:** 0 = ausente, 5 = fraco, 10 = presente, 15 = forte

### 7. Unity
Senso de comunidade, "nos" vs "eles", identidade compartilhada?
- Linguagem de grupo ("nos", "nossa comunidade")
- Identidade compartilhada com o prospect
- In-group vs out-group positioning
- Valores e missao em comum
- **Score 0-15:** 0 = ausente, 5 = fraco, 10 = presente, 15 = forte

### 8. Pre-Suasion
A atencao e direcionada estrategicamente ANTES da mensagem principal?
- Framing: como o contexto e estabelecido antes da oferta
- Priming: elementos que preparam o prospect para a mensagem
- Atencao direcionada para atributos favoraveis
- Associacoes estrategicas (imagens, metaforas, ambiente)
- **Avaliacao qualitativa** (nao pontuada separadamente, mas influencia score geral)

### 9. Scoring
Cada principio: 0-15 pontos

| Principio | Score | Avaliacao |
|-----------|-------|-----------|
| Reciprocity | /15 | |
| Commitment & Consistency | /15 | |
| Social Proof | /15 | |
| Authority | /15 | |
| Liking | /15 | |
| Scarcity | /15 | |
| Unity | /15 | |
| **Total** | **/105** | Convertido para **/100** |

Escala de interpretacao:
- 80-100: Excelente — persuasao forte em multiplas dimensoes
- 60-79: Bom — fundamentos solidos, oportunidades de melhoria
- 40-59: Medio — gaps significativos em principios-chave
- 20-39: Fraco — faltam elementos basicos de persuasao
- 0-19: Critico — rewrite completo recomendado

### 10. Recommendations
Top 5 melhorias com exemplo de implementacao:
- Cada recomendacao inclui: principio afetado, o que falta, exemplo concreto de implementacao
- Priorizacao por impacto potencial na conversao
- Quick wins primeiro, depois melhorias estruturais

---

## Output

Persuasion Audit Report com:
- Score por principio (tabela detalhada)
- Score total convertido para /100
- Avaliacao de Pre-Suasion (qualitativa)
- Top 5 acoes priorizadas com exemplos de implementacao
- Diagnostico geral e recomendacao de proximos passos
