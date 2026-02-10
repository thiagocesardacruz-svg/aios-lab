# Task: Audience Research

## Objective
Entender profundamente o público-alvo: quem são, o que sentem, o que desejam, como decidem.

## Context
Um produto sem clareza de audiência é um produto para ninguém. Esta task cria personas baseadas em evidências, não suposições.

## Process

### Step 1: Audience Segmentation
Liste possíveis segmentos:

| Segmento | Descrição | Potencial | Acessibilidade |
|----------|-----------|-----------|----------------|
| | | Alto/Médio/Baixo | Fácil/Médio/Difícil |

### Step 2: Primary Segment Deep Dive
Para o segmento prioritário:

**Demographics**
- Cargo/função:
- Tamanho da empresa:
- Localização:
- Faixa etária:

**Psychographics**
- Valores e crenças:
- Aspirações:
- Medos e frustrações:
- Como se veem vs. como querem ser vistos:

### Step 3: Pain & Desire Mapping

```markdown
## Dores (Problems)

### Dores Funcionais
- [ ] [O que não conseguem fazer?]

### Dores Emocionais
- [ ] [Como se sentem sobre o problema?]

### Dores Sociais
- [ ] [Como o problema afeta sua imagem/status?]

## Desejos (Desires)

### Desejos Funcionais
- [ ] [O que querem conseguir fazer?]

### Desejos Emocionais
- [ ] [Como querem se sentir?]

### Desejos Sociais
- [ ] [Como querem ser vistos?]
```

### Step 4: Decision Journey

```
Trigger → Awareness → Consideration → Decision → Usage → Loyalty
   ↓           ↓            ↓            ↓         ↓        ↓
[O que      [Como        [O que       [Como     [Como    [O que faz
dispara]   descobrem]   avaliam]    decidem]   usam]    voltar]
```

### Step 5: Persona Creation
Use template: `templates/audience-persona-tmpl.md`

## Research Methods

### Primary Research
- [ ] Entrevistas (5-10 pessoas)
- [ ] Surveys
- [ ] Observação de comportamento

### Secondary Research
- [ ] Reviews e comentários online
- [ ] Fóruns e comunidades
- [ ] Social media listening
- [ ] Relatórios de mercado

## Output
- 1-3 personas detalhadas
- Mapa de dores e desejos
- Jornada de decisão
- Citações e evidências reais

## Next Task
→ `03-market-analysis.md`

---

## Prompts de Apoio

### Para Criar Persona
```
Com base nestas informações sobre o segmento [SEGMENTO]:
[DADOS COLETADOS]

Crie uma persona detalhada incluindo:
1. Nome, cargo, contexto
2. Um dia típico na vida
3. Principais dores (funcionais, emocionais, sociais)
4. Principais desejos (funcionais, emocionais, sociais)
5. Como busca soluções
6. Critérios de decisão
7. Objeções típicas
8. Citação que resume seu mindset
```

### Para Mapear Dores
```
Para o segmento [SEGMENTO] no contexto de [PROBLEMA]:

Liste e priorize:
1. As 5 maiores dores funcionais
2. As 3 maiores dores emocionais
3. As 2 maiores dores sociais

Para cada dor, indique:
- Frequência (diária/semanal/mensal)
- Intensidade (1-10)
- Soluções atuais e suas falhas
```
