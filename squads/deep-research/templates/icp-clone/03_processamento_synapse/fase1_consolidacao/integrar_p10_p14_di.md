# CONSOLIDAÇÃO DECISION INTELLIGENCE (P10-P14)

## 🎯 OBJETIVO
Consolidar os 5 módulos Decision Intelligence (P10-P14) em um perfil comportamental decisório integrado.

Este documento integra:
- P10: Decision Context Mapping
- P11: Action Triggers
- P12: Objection & Friction Map
- P13: Decision Heuristics
- P14: Outcome Learning

**Tempo estimado**: 45-60 minutos
**Output**: Perfil Decisório Consolidado para integração no PSH Shell

---

## 📋 INSTRUÇÕES

Você é especialista em síntese comportamental e Decision Intelligence.

# INPUTS NECESSÁRIOS
Cole TODOS os outputs de:
- P10_output_[nome].md
- P11_output_[nome].md
- P12_output_[nome].md
- P13_output_[nome].md
- P14_output_[nome].md

# TAREFA
Consolide os 5 módulos em **PERFIL DECISÓRIO INTEGRADO** pronto para alimentar o PSH Shell e o System Prompt final.

---

## SEÇÃO 1: PERFIL DECISÓRIO EXECUTIVO

### 1.1. SÍNTESE EM UMA FRASE
[Nome ICP] é um decisor [estilo decisório dominante] que decide melhor em [contexto ótimo], sendo ativado para ação por [gatilho primário] e bloqueado por [objeção/fricção primária], utilizando primariamente [heurística dominante] e aprendendo [padrão de aprendizado] com resultados.

### 1.2. PERFIL DECISÓRIO DETALHADO (200-300 palavras)

**CONTEXTO DECISÓRIO:**
[Parágrafo descrevendo como contexto afeta decisões - do P10]

**GATILHOS DE AÇÃO:**
[Parágrafo sobre o que move para ação - do P11]

**OBJEÇÕES E BARREIRAS:**
[Parágrafo sobre o que bloqueia - do P12]

**HEURÍSTICAS E VIESES:**
[Parágrafo sobre como realmente decide - do P13]

**PADRÃO DE APRENDIZADO:**
[Parágrafo sobre como processa resultados - do P14]

---

## SEÇÃO 2: MATRIZ DECISÓRIA MASTER

### 2.1. CONTEXTOS X GATILHOS X OBJEÇÕES

**Complete a matriz integrando P10, P11, P12:**

| Contexto | Gatilho Eficaz | Objeção Dominante | Taxa Conversão | Estratégia Ótima |
|----------|----------------|-------------------|----------------|------------------|
| **Alta ansiedade financeira** | [Do P11] | [Do P12] | [Estimativa] | [Como abordar] |
| **Autoconfiança baixa** | [...] | [...] | [...] | [...] |
| **Sobrecarga cognitiva** | [...] | [...] | [...] | [...] |
| **Janela $disponível** | [...] | [...] | [...] | [...] |
| **Pressão social alta** | [...] | [...] | [...] | [...] |
| **Pós-fracasso recente** | [...] | [...] | [...] | [...] |

---

## SEÇÃO 3: CÓDIGO DECISÓRIO CONSOLIDADO

### 3.1. ALGORITMO MASTER DE DECISÃO DE COMPRA

**Integre P10 (contexto), P11 (gatilhos), P12 (objeções), P13 (heurísticas):**

```python
FUNÇÃO decidir_compra_MASTER(produto, contexto):

    # CONTEXTO (P10)
    contexto_estado = avaliar_contexto_atual(
        tempo_disponível, energia_mental, $disponível,
        estado_emocional, pressão_social
    )

    # ELIMINAÇÕES RÁPIDAS (P12 Dealbreakers + P13 Regras)
    SE produto EM dealbreakers_absolutos:
        RETORNAR REJEITAR_ABSOLUTO("Viola valores core")

    SE produto.gatilho_sistema_imunológico:
        RETORNAR REJEITAR("Ativa desconfiança máxima")

    # HEURÍSTICA DE DISPONIBILIDADE (P13)
    memória_relevante = buscar_experiência_similar(produto)
    SE memória_relevante.resultado == "negativo":
        viés_inicial = -3  # Penaliza
    SENÃO:
        viés_inicial = 0

    # CONTEXTO AFETA MODO DECISÓRIO (P10)
    SE contexto.energia_mental < 4/10:
        # Modo System 1 (intuitivo/automático)
        decisão = decidir_por_feeling()
    SENÃO:
        # Modo System 2 (analítico)
        decisão = analisar_racionalmente()

    # AVALIAÇÃO DE AFFORDABILITY (P10 + P0B)
    SE produto.preço > affordability_contexto(contexto):
        # OBJEÇÃO PRIMÁRIA (P12)
        ansiedade_compra = 10/10
        SE NÃO (parcelamento_disponível E validação_social_forte):
            RETORNAR ADIAR("Ansiedade paralisa")

    # GATILHOS DE AÇÃO (P11)
    score_gatilhos = 0

    # Gatilho Social (P11 - peso 40%)
    social_proof = contar_testemunhos_pares(produto)
    SE social_proof >= 2:
        score_gatilhos += 4

    # Gatilho Emocional (P11 - peso 30%)
    dor_atual = medir_dor_status_quo()
    SE dor_atual > 7/10:
        score_gatilhos += 3

    # Gatilho Racional (P11 - peso 20%)
    SE produto.roi_percebido > 300%:
        score_gatilhos += 2

    # Gatilho Temporal (P11 - peso 10%)
    SE contexto.janela_ótima:
        score_gatilhos += 1

    # FRICÇÕES REDUZEM SCORE (P12)
    fricções = [
        fricção_cognitiva (complexidade),
        fricção_emocional (vergonha/medo),
        fricção_prática (checkout complicado)
    ]
    score_fricções = somar_fricções()

    score_final = score_gatilhos - score_fricções + viés_inicial

    # DECISÃO FINAL
    SE score_final >= 7:
        SE contexto.tem_dinheiro_agora:
            # APRENDIZADO (P14) - registra para futuro
            registrar_decisão(produto, "COMPROU", contexto)
            RETORNAR COMPRAR("Janela ótima ativada")
        SENÃO:
            RETORNAR ADIAR("Quer mas affordability bloqueia")

    SENÃO SE score_final >= 4:
        RETORNAR CONSIDERAR("Em análise - precisa mais validação")

    SENÃO:
        RETORNAR REJEITAR("Gatilhos insuficientes")

FIM FUNÇÃO
```

---

## SEÇÃO 4: TSM TRIPLETS DECISÓRIOS

### 4.1. TSM #DI-1: PARALISIA DECISÓRIA
**Integração: P10 contexto + P12 objeções + P13 maximizer**

**TRIGGER:**
- Stakes altos (>R$ 1.000)
- + Múltiplas opções (5+)
- + Sobrecarga de informação
- + Contexto: Baixa energia mental

**STATE:**
- Cognitivo: Análise infinita, listas prós/contras, pesquisa obsessiva
- Emocional: Ansiedade crescente (7-9/10), fadiga mental
- Fisiológico: Tensão, insônia pensando nisso

**MANIFESTATION:**
- Abre 20+ abas comparando
- Pede opinião de 5+ pessoas
- Adia por semanas
- Eventualmente: ABANDONA por exaustão

**Frequência:** Semanal (em decisões importantes)
**Duração:** 1-3 semanas até exaustão
**Custo:** Alto - oportunidades perdidas

---

### 4.2. TSM #DI-2: COMPRA IMPULSIVA FOMO
**Integração: P11 gatilhos emocionais + P13 viés manada**

**TRIGGER:**
- Vê 3+ pares similares com resultado que não tem
- + Escassez (oferta termina)
- + Contexto: Comparação social ativa

**STATE:**
- Cognitivo: Racionalização automática, ignora objeções
- Emocional: FOMO intenso (9/10), urgência
- Fisiológico: Ativação

**MANIFESTATION:**
- Decide em < 2 horas (override System 2)
- Compra mesmo sem $ confortável
- Racionaliza: "Não posso perder essa chance"

**Frequência:** Mensal
**Duração:** 2-4 horas
**Custo:** Médio - pode gerar arrependimento pós-compra (P14)

---

### 4.3. TSM #DI-3: PROCRASTINAÇÃO EVITATIVA
**Integração: P11 procrastinação + P12 objeções ocultas + P14 medo**

**TRIGGER:**
- Decisão que exige compromisso real
- + Medo de falhar
- + Contexto: Autoconfiança baixa

**STATE:**
- Cognitivo: "Preciso pensar mais", busca desculpas
- Emocional: Ansiedade (8/10), medo de arrependimento
- Fisiológico: Tensão, evitação

**MANIFESTATION:**
- "Não é o momento certo"
- "Vou esperar ter mais $"
- Adia indefinidamente

**Frequência:** Quinzenal
**Duração:** Indefinida (decisão morre)
**Custo:** Muito Alto - inação crônica

---

### 4.4. TSM #DI-4: DECISÃO RÁPIDA E CONFIANTE
**Integração: P10 contexto ótimo + P11 combinação gatilhos**

**TRIGGER:**
- Dor alta (8+/10)
- + Validação social forte (3+ pares)
- + $ disponível
- + Contexto: Energia alta, decisão clara

**STATE:**
- Cognitivo: Clareza, confiança
- Emocional: Esperança (7/10), decisão
- Fisiológico: Energia, ação

**MANIFESTATION:**
- Decide em 24-48h
- Age sem procrastinar
- Commit real

**Frequência:** Rara (contexto raro)
**Duração:** 1-2 dias
**Resultado:** Alta satisfação pós-decisão

---

[Continue para 4 mais TSM decisórios - total 8 TSM]

---

## SEÇÃO 5: GOOD ENOUGH THRESHOLDS CONSOLIDADOS

### 5.1. CRITÉRIOS "BOM O SUFICIENTE" POR CATEGORIA

**Para Decisão de Compra de Produto/Serviço:**

| Critério | Mínimo Aceitável | Bom O Suficiente | Ideal (Desnecessário) |
|----------|------------------|------------------|----------------------|
| **Prova Social** | 1 testemunho muito similar | 2-3 testemunhos pares | 20+ casos |
| **Garantia** | Promessa verbal confiável | 7 dias reembolso | Vitalícia |
| **ROI Percebido** | Break-even | 200-300% | 500%+ |
| **Clareza** | Descrição básica | Página vendas + 1 call | PDF 50 páginas |
| **Affordability** | Parcelamento difícil | 3-6x sem juros | À vista fácil |
| **Timing** | Preciso forçar | Janela OK | Momento perfeito |

**Implicação para Marketing:**
- Foque em atingir coluna "Bom O Suficiente"
- NÃO gaste esforço tentando atingir "Ideal"
- Garanta que NUNCA fique abaixo de "Mínimo Aceitável"

---

## SEÇÃO 6: ESTRATÉGIA DE CONVERSÃO INTEGRADA

### 6.1. JORNADA DECISÓRIA OTIMIZADA

**FASE 1: ATIVAÇÃO (Contexto + Gatilhos)**
- **Objetivo:** Mover de "não sei que preciso" para "preciso disso"
- **Contexto ideal:** [Do P10]
- **Gatilho primário:** [Do P11 - gatilho emocional + social]
- **Mensagem:** [Ativar dor + mostrar prova social]
- **Canal:** [Do P6 - plataforma preferencial]
- **Timing:** [Do P10 - janela ótima]

**FASE 2: VALIDAÇÃO (Superar Objeções)**
- **Objetivo:** Remover barreiras conscientes e inconscientes
- **Objeção primária:** [Do P12]
- **Resposta:** [Evidência específica]
- **Objeção secundária:** [...]
- **Resposta:** [...]
- **Fricções:** [Do P12 - como reduzir]

**FASE 3: PERMISSÃO (Estruturas de Compromisso)**
- **Objetivo:** Dar permissão para agir
- **Permissão interna:** [Do P11 - como facilitar]
- **Permissão externa:** [Validação de quem?]
- **Permissão financeira:** [Affordability + parcelamento]

**FASE 4: DECISÃO (Facilitação)**
- **Objetivo:** Tornar SIM mais fácil que NÃO
- **Facilitadores:** [Do P11]
- **Simplificação:** [Reduzir opções, processo claro]
- **Urgência saudável:** [Não pressão, mas clareza de janela]

**FASE 5: CONFIRMAÇÃO (Prevenir Arrependimento)**
- **Objetivo:** Reforçar decisão + primeiro resultado
- **0-48h:** [Email reafirmação]
- **Primeira semana:** [Quick win]
- **Primeiro mês:** [Consolidação aprendizado P14]

---

### 6.2. MATRIZ DE INTERVENÇÃO CONTEXTUAL

**Quando intervir baseado em contexto e comportamento:**

| Comportamento Observado | Diagnóstico | Intervenção Ótima |
|------------------------|-------------|-------------------|
| Pesquisando obsessivamente 5+ opções | TSM Paralisia (DI-1) | Simplificar: "Só 2 opções", call de decisão |
| Salva múltiplas vezes sem agir | Interesse + Objeção oculta | Abordar medo: "O que te impede?" |
| Volta 3+ vezes à oferta | Gatilhos presentes + Fricção financeira | Parcelamento personalizado |
| Age impulsivamente após ver social proof | TSM FOMO (DI-2) | Agilizar + Garantia forte (evitar arrependimento P14) |
| "Preciso pensar mais" repetido | TSM Procrastinação (DI-3) | Deadline gentil + validação externa |
| Pergunta sobre garantia 3+ vezes | Objeção: Desconfiança alta | Mais prova + Testemunho vídeo similar |

---

## SEÇÃO 7: MODELO PREDITIVO COMPORTAMENTAL

### 7.1. SCORE DE PROBABILIDADE DE CONVERSÃO

**Crie modelo preditivo baseado em variáveis observáveis:**

```
PROB_CONVERSÃO =
    (Dor_Atual × 0.25) +
    (Social_Proof_Score × 0.20) +
    (Affordability_Fit × 0.20) +
    (Contexto_Ótimo × 0.15) +
    (Confiança_Fonte × 0.10) +
    (Timing_Certo × 0.10) -
    (Fricções_Totais × 0.30)

Onde:
- Dor_Atual: 0-10 (do P10/P11)
- Social_Proof_Score: 0-10 (quantidade e qualidade de testemunhos)
- Affordability_Fit: 0-10 (quanto cabe no orçamento P0B)
- Contexto_Ótimo: 0-10 (match com contexto ideal P10)
- Confiança_Fonte: 0-10 (credibilidade de quem oferece)
- Timing_Certo: 0-10 (janela financeira/emocional P10)
- Fricções_Totais: Soma de fricções (P12)

INTERPRETAÇÃO:
- Score > 7.0: Alta probabilidade (70%+) - ABORDE AGORA
- Score 5.0-7.0: Média probabilidade (40-70%) - NUTRA
- Score 3.0-5.0: Baixa probabilidade (20-40%) - EDUQUE
- Score < 3.0: Muito baixa (< 20%) - NÃO FORCE
```

---

### 7.2. INDICADORES ANTECEDENTES

**Sinais precoces de prontidão para compra:**

**SINAIS POSITIVOS (Mover para abordagem):**
- [ ] Mencionou dor específica relacionada 2+ vezes
- [ ] Perguntou sobre experiência de outros similares
- [ ] Voltou à oferta 3+ vezes
- [ ] Perguntou sobre detalhes de implementação (não só preço)
- [ ] Contexto: Recebeu pagamento recentemente
- [ ] Engajou com conteúdo sobre solução

**SINAIS NEGATIVOS (Não abordar ainda):**
- [ ] Final de mês (sem $ disponível)
- [ ] Recém-saiu de compra similar que não funcionou
- [ ] Alta ansiedade financeira verbalizada
- [ ] Foco apenas em objeções (não em solução)

---

## SEÇÃO 8: PERFIL PARA PSH SHELL

### 8.1. RESUMO EXECUTIVO DECISÓRIO (Para PSH)

```json
{
  "decision_intelligence_profile": {
    "estilo_decisório": "[satisficer/maximizer/misto]",
    "system_dominante": "[System 1 / System 2 / contextual]",

    "contexto_ótimo": {
      "temporal": "[janela temporal ideal]",
      "financeiro": "[momento pós-pagamento / mid-month]",
      "emocional": "[estado emocional ideal]",
      "social": "[contexto social favorável]"
    },

    "gatilhos_primários": [
      {"tipo": "social", "descrição": "...", "peso": 40},
      {"tipo": "emocional", "descrição": "...", "peso": 30},
      {"tipo": "racional", "descrição": "...", "peso": 20},
      {"tipo": "temporal", "descrição": "...", "peso": 10}
    ],

    "objeções_críticas": [
      {"tipo": "primária", "objeção": "...", "resposta": "..."},
      {"tipo": "oculta", "objeção": "...", "resposta": "..."},
      {"tipo": "dealbreaker", "objeção": "...", "resposta": "não superável"}
    ],

    "fricções_principais": [
      {"tipo": "cognitiva", "descrição": "...", "redução": "..."},
      {"tipo": "emocional", "descrição": "...", "redução": "..."},
      {"tipo": "prática", "descrição": "...", "redução": "..."}
    ],

    "heurísticas_dominantes": [
      "Representatividade (8/10)",
      "Aversão à perda (9/10)",
      "Social proof (9/10)",
      "Disponibilidade (7/10)",
      "Afeto (6/10)"
    ],

    "vieses_fortes": [
      {"viés": "Confirmação", "intensidade": 8},
      {"viés": "Aversão perda", "intensidade": 9},
      {"viés": "Status quo", "intensidade": 7}
    ],

    "aprendizado_pattern": {
      "atribuição_sucesso": "externa (não consolida)",
      "atribuição_fracasso": "interna global (tóxica)",
      "taxa_atualização": "lenta (crenças rígidas)",
      "calibração": "subconfiante (competência > confiança)"
    },

    "good_enough_thresholds": {
      "prova_social": "2-3 testemunhos pares",
      "garantia": "7 dias reembolso",
      "roi": "200-300%",
      "affordability": "3-6x parcelamento"
    },

    "prob_conversão_atual": "[calcular com modelo]"
  }
}
```

---

## ✅ VALIDAÇÃO

Antes de prosseguir para PSH Shell, confirme:
- [ ] Criou síntese executiva de 1 frase
- [ ] Consolidou perfil decisório detalhado (200-300 palavras)
- [ ] Criou matriz decisória (contexto × gatilhos × objeções)
- [ ] Desenvolveu algoritmo master de decisão
- [ ] Criou 4+ TSM triplets decisórios
- [ ] Definiu good enough thresholds consolidados
- [ ] Desenhou jornada de conversão integrada (5 fases)
- [ ] Criou modelo preditivo de probabilidade
- [ ] Formatou perfil JSON para PSH Shell

**Score mínimo**: 9/9 ✅ para prosseguir

---

**PRÓXIMO PASSO**: Integração no PSH Shell Master (`fase3_psh_shell/criar_psh_completo.md`)

**SALVAR OUTPUT**: `CONSOLIDACAO_DI_[nome].md`
