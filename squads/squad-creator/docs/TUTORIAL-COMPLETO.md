# Tutorial Completo

> Guia pratico passo a passo do squad-creator v2.6
> Todas as funcionalidades principais com exemplos reais
> Ultima atualizacao: 2026-02-04

---

## Pre-requisitos

Antes de comecar, verifique que voce tem:

- Synkra AIOS v2.1.0 ou superior instalado
- Acesso ao repositorio com o squad-creator em `squads/squad-creator/`
- Familiaridade basica com comandos de agente (prefixo `*`) e ativacao de agente (prefixo `@`)

Se voce nunca usou o AIOS antes, recomendo ler o [POR-ONDE-COMECAR.md](./POR-ONDE-COMECAR.md) primeiro.

---

## 1. Criando seu primeiro squad com *create-squad

O comando `*create-squad` gera a estrutura completa de um squad novo, incluindo diretorios, manifesto YAML e arquivos base.

### Passo 1: Ativar o squad-creator

```
@squad-creator
```

O agente Craft vai cumprimentar voce e mostrar os comandos disponiveis. Aguarde o prompt.

### Passo 2: Criar o squad

```
*create-squad meu-primeiro-squad
```

O agente vai solicitar informacoes interativamente (elicit=true):

```
Craft: Vamos criar o squad "meu-primeiro-squad". Preciso de algumas informacoes:

1. Descricao do squad: (descreva o proposito em 1-2 frases)
> Um squad para automatizar o processo de onboarding de novos desenvolvedores

2. Dominio principal: (area de atuacao)
> DevOps / Onboarding

3. Agentes necessarios: (quantos agentes e quais papeis)
> 2 agentes: onboarding-guide (guia de novos devs) e environment-setup (configuracao de ambiente)
```

### Saida esperada

Apos responder as perguntas, o agente gera a seguinte estrutura:

```
squads/meu-primeiro-squad/
  squad.yaml              # Manifesto do squad
  agents/
    onboarding-guide.md   # Definicao do agente guia
    environment-setup.md  # Definicao do agente de setup
  tasks/                  # Diretorio para tarefas (vazio inicialmente)
  workflows/              # Diretorio para workflows
  checklists/             # Diretorio para checklists
  data/                   # Diretorio para dados e registros
```

O arquivo `squad.yaml` gerado tera a versao, componentes declarados e configuracoes iniciais.

### Passo 3: Verificar a criacao

```
*validate-squad meu-primeiro-squad
```

O validador vai checar se todos os arquivos declarados no manifesto existem em disco e se o YAML e valido. Na primeira validacao, e normal receber avisos sobre tarefas e checklists vazios.

---

## 2. Desenhando um squad a partir de documentacao com *design-squad

O comando `*design-squad` e mais sofisticado que o `*create-squad`. Ele analisa documentacao existente (PRDs, requisitos, processos) para projetar a composicao ideal do squad.

### Passo 1: Ativar o squad-architect

```
@squad-creator:squad-architect
```

O Atlas (Estrategista) sera ativado.

### Passo 2: Executar o design

```
*design-squad --docs ./docs/prd/onboarding-system-prd.md
```

### O que acontece internamente

1. Atlas le o documento de requisitos completo
2. Identifica os dominios de competencia necessarios
3. Mapeia as tarefas que precisam ser executadas
4. Propoe uma composicao de agentes baseada nas tarefas
5. Sugere ferramentas necessarias
6. Gera um blueprint de squad

### Saida esperada

```
Atlas: Analise do PRD concluida. Proposta de composicao:

Squad: onboarding-system
Agentes propostos:
  1. welcome-bot (Guia) - Tarefas: boas-vindas, tour de ferramentas, FAQ interativo
  2. env-provisioner (Engenheiro) - Tarefas: setup IDE, config repositorios, acesso CI/CD
  3. mentor-matcher (Analista) - Tarefas: matching de mentor, agendamento, follow-up

Tarefas identificadas: 9
Workflows sugeridos: 2 (wf-onboard-new-dev, wf-mentor-assignment)
Ferramentas recomendadas: GitHub CLI, Slack API, Jira API

Deseja que eu gere o squad a partir deste blueprint? (sim/nao)
```

Respondendo "sim", o Atlas delega para o Craft gerar os arquivos.

---

## 3. Clonando uma mente com *clone-mind

O Mind Cloning e uma das funcionalidades mais poderosas do v2.6. Ele cria uma persona de agente baseada em uma pessoa real.

### Passo 1: Ativar o Mirror

```
@squad-creator:oalanicolas
```

### Passo 2: Preparar as fontes

Voce precisa de material escrito pela pessoa ou sobre ela. Tipos aceitos:

- Artigos de blog ou posts no LinkedIn
- Transcricoes de reunioes ou apresentacoes
- Registros de decisoes (ADRs)
- Threads no Twitter/X
- Entrevistas gravadas (texto)

Coloque os arquivos em um diretorio acessivel, por exemplo: `./sources/joao/`

### Passo 3: Executar o clone (modo YOLO)

```
*clone-mind --person "Joao Silva" --mode yolo --sources ["./sources/joao/linkedin-posts.md", "./sources/joao/meeting-notes.md"]
```

### O que acontece internamente

1. **Validacao de fontes**: Mirror verifica se os arquivos existem e tem conteudo util. Minimo de 2 fontes para YOLO.
2. **Extracao de Voice DNA**: Analisa vocabulario, tom, estrutura de frases, marcadores culturais e catchphrases.
3. **Extracao de Thinking DNA**: Analisa frameworks de decisao, modelos mentais, vieses cognitivos e prioridades.
4. **Merge**: Combina Voice DNA e Thinking DNA em um perfil unificado. No modo YOLO, conflitos sao resolvidos automaticamente usando o sinal de maior confianca.
5. **Smoke Test**: Roda 3 cenarios de teste (escrita de email, tomada de decisao, resolucao de conflito) para validar a fidelidade do perfil.

### Saida esperada

```
Mirror: Mind Clone concluido para "Joao Silva"

Fidelity Score: 68% (modo YOLO)

Voice DNA:
  - Tom: Pragmatico, direto, com humor sutil
  - Vocabulario: Predominancia de termos tecnicos em ingles, mistura com portugues informal
  - Marcadores culturais: Brasileiro, tech culture, refs a startups e agile

Thinking DNA:
  - Framework dominante: Data-driven com validacao por pares
  - Vies detectado: Otimismo moderado, preferencia por acao rapida
  - Prioridades: Velocidade > Perfeicao > Custo

Smoke Test:
  Cenario 1 (Email): PASS - 72% match
  Cenario 2 (Decisao): PASS - 65% match
  Cenario 3 (Conflito): PASS - 67% match

Perfil salvo em: squads/squad-creator/data/minds/joao-silva.yaml
```

### Passo 4: Modo QUALITY (opcional)

Para maior fidelidade, junte pelo menos 5 fontes diversas e execute:

```
*clone-mind --person "Joao Silva" --mode quality --sources ["./sources/joao/blog-posts.md", "./sources/joao/linkedin-posts.md", "./sources/joao/meeting-notes.md", "./sources/joao/adr-decisions.md", "./sources/joao/interview-transcript.md"]
```

No modo QUALITY, o Mirror vai pausar em conflitos ambiguos e pedir sua opiniao antes de resolver.

---

## 4. Descobrindo ferramentas com *discover-tools

O Deep Tool Discovery busca em 5 canais paralelos e avalia cada ferramenta encontrada.

### Passo 1: Ativar o squad-architect

```
@squad-creator:squad-architect
```

### Passo 2: Executar a descoberta

```
*discover-tools domain="web scraping" capability_gaps="Preciso extrair dados estruturados de paginas JS-rendered" constraints={"budget": "free", "license": "MIT/Apache"}
```

### O que acontece internamente

O workflow `wf-discover-tools` e executado em 4 fases:

1. **Fase 0 - Gap Analysis**: Mapeia o que o squad ja tem vs. o que precisa
2. **Fase 1 - Parallel Search**: Busca em MCP Catalog, APIs, CLI, Packages e GitHub simultaneamente
3. **Fase 2 - Evaluation**: Aplica RICE scoring, WSJF scoring, Security Gate e Social Proof Gate, e classifica em tiers
4. **Fase 3 - Decision Matrix**: Gera a matriz final com DO NOW / DO NEXT / DO LATER / DON'T DO

### Saida esperada

```
Atlas: Tool Discovery para "web scraping" concluido.

| Ferramenta | Categoria | RICE | WSJF | Security | Social | Tier | Decisao |
|------------|-----------|------|------|----------|--------|------|---------|
| Playwright MCP | MCP | 82 | 78 | PASS | PASS | 1 | DO NOW |
| Puppeteer | Library | 75 | 70 | PASS | PASS | 2 | DO NEXT |
| Crawlee | Library | 68 | 65 | PASS | PASS | 2 | DO NEXT |
| Scrapy | CLI | 60 | 55 | PASS | PASS | 3 | DO LATER |

Top 3 recomendacoes:
1. Playwright MCP - Integracao nativa com AIOS via Docker MCP
2. Puppeteer - Ecossistema maduro, excelente para JS rendering
3. Crawlee - Framework moderno com crawling avancado

Registry atualizado: squads/squad-creator/data/tool-registry.yaml
```

---

## 5. Extraindo um SOP com *extract-sop

A extracao de SOPs transforma documentacao nao-estruturada em procedimentos padrao no formato SC-PE-001.

### Passo 1: Ativar o sop-extractor

```
@squad-creator:sop-extractor
```

### Passo 2: Executar a extracao

```
*extract-sop --source ./docs/deployment-process.md --source_type document
```

### O que acontece internamente

1. **Parsing**: O Scribe analisa o documento e extrai passos candidatos
2. **Identificacao de passos**: Discretiza os passos, funde acoes granulares demais e divide acoes compostas
3. **Taxonomia cognitiva**: Classifica cada passo (Remember, Understand, Apply, Analyze, Evaluate, Create)
4. **Classificacao de executor**: Atribui Human, AI ou Hybrid para cada passo com justificativa
5. **Estruturacao SC-PE-001**: Organiza nas 11 partes do formato padrao
6. **Validacao**: Verifica completude e fluxo logico

### Saida esperada

```
Scribe: SOP extraido com sucesso.

SOP ID: SC-PE-DEPLOY-2026-02-04
Titulo: Deploy de Release para Producao
Passos extraidos: 12
Classificacao cognitiva:
  - Remember: 3 passos (25%)
  - Apply: 4 passos (33%)
  - Analyze: 3 passos (25%)
  - Evaluate: 2 passos (17%)

Executor:
  - AI: 5 passos (42%)
  - Hybrid: 4 passos (33%)
  - Human: 3 passos (25%)

Potencial de automacao: 42% totalmente automatizavel, 33% parcialmente

SOP salvo em: squads/squad-creator/data/sops/SC-PE-DEPLOY-2026-02-04.md
```

### Passo 3: Validar o SOP

```
*validate-sop SC-PE-DEPLOY-2026-02-04
```

### Passo 4: Gerar blueprint de squad

```
*generate-blueprint SC-PE-DEPLOY-2026-02-04
```

Isso transforma o SOP validado em um blueprint de squad com agentes, tarefas e workflows sugeridos.

---

## Proximos passos

Agora que voce completou o tutorial, recomendo:

1. Consultar o [COMMANDS.md](./COMMANDS.md) para explorar todos os comandos disponiveis
2. Ler o [CONCEPTS.md](./CONCEPTS.md) para aprofundar nos frameworks teoricos
3. Revisar o [HITL-FLOW.md](./HITL-FLOW.md) para entender os pontos de controle humano
4. Usar o [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) quando encontrar problemas

---

*squad-creator docs v2.6.0 -- Synkra AIOS*
