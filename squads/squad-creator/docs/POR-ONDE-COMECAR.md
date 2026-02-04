# Por Onde Comecar

> Guia de navegacao para iniciantes no squad-creator v2.6
> Ultima atualizacao: 2026-02-04

---

## O que e o squad-creator?

O squad-creator e um meta-squad do Synkra AIOS que cria, gerencia e evolui squads de agentes de IA. Ele segue a **arquitetura task-first**, onde tudo comeca por tarefas executaveis e os agentes existem para serve-las. Na versao 2.6, o squad-creator vai muito alem da criacao basica de squads. Ele oferece tres capacidades avancadas que o diferenciam:

1. **Mind Cloning** -- Captura a essencia de como uma pessoa comunica (Voice DNA) e pensa (Thinking DNA) para criar personas de agentes com alta fidelidade. Suporta dois modos: YOLO (rapido, 60-75% de fidelidade) e QUALITY (completo, 85-95% de fidelidade).

2. **Deep Tool Discovery** -- Busca ferramentas em 5 canais paralelos (MCP, APIs, CLI, bibliotecas, GitHub), avalia cada uma com frameworks RICE e WSJF, aplica gates de seguranca e prova social, e classifica em tiers para decisao final.

3. **SOP Extraction** -- Extrai Procedimentos Operacionais Padrao de qualquer material fonte e estrutura no formato SC-PE-001 (11 partes), com classificacao cognitiva baseada na taxonomia de Bloom e analise de automacao PV_PM_001.

---

## Quem sao os agentes?

O squad-creator opera com 1 agente base e 4 agentes especialistas:

| Agente | Nome | Papel |
|--------|------|-------|
| **squad-creator** (Craft) | Agente base | Criacao e gerenciamento de squads |
| **squad-architect** (Atlas) | Estrategista | Composicao de squads, quality dashboard, tool discovery |
| **sop-extractor** (Scribe) | Analista | Extracao de SOPs, taxonomia cognitiva, automacao |
| **oalanicolas** (Mirror) | Empatico | Mind Cloning, Voice DNA, Thinking DNA |
| **pedro-valerio** (Forge) | Engenheiro | Design de workflows, checklists, condicoes de veto |

Para ativar um sub-agente, use a sintaxe `@squad-creator:nome-do-agente`. Por exemplo: `@squad-creator:oalanicolas` ativa o Mirror para mind cloning.

---

## Meu primeiro dia: por onde comeco?

### Caminho 1: "Quero criar meu primeiro squad"
1. Leia o [QUICK-START.md](./QUICK-START.md) -- crie seu primeiro squad em 5 minutos
2. Depois consulte o [COMMANDS.md](./COMMANDS.md) para ver todos os comandos disponiveis
3. Se algo nao funcionar, veja o [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Caminho 2: "Quero entender os conceitos antes de comecar"
1. Leia o [CONCEPTS.md](./CONCEPTS.md) -- conceitos profundos de Voice DNA, Thinking DNA, tiers e gates
2. Veja os [ARCHITECTURE-DIAGRAMS.md](./ARCHITECTURE-DIAGRAMS.md) para visualizar os fluxos
3. Depois siga o [TUTORIAL-COMPLETO.md](./TUTORIAL-COMPLETO.md) passo a passo

### Caminho 3: "Tenho duvidas sobre termos e conceitos"
1. Consulte o [FAQ.md](./FAQ.md) -- perguntas frequentes e glossario
2. Aprofunde-se no [CONCEPTS.md](./CONCEPTS.md) para detalhes tecnicos

### Caminho 4: "Quero entender o controle humano (HITL)"
1. Leia o [HITL-FLOW.md](./HITL-FLOW.md) -- quando e como o humano intervem nos fluxos
2. Complemente com os [ARCHITECTURE-DIAGRAMS.md](./ARCHITECTURE-DIAGRAMS.md)

---

## Mapa completo da documentacao

| Documento | O que encontro la | Para quem |
|-----------|------------------|-----------|
| [POR-ONDE-COMECAR.md](./POR-ONDE-COMECAR.md) | Este guia de navegacao | Iniciantes |
| [QUICK-START.md](./QUICK-START.md) | Primeiro squad em 5 minutos | Quem quer comecar rapido |
| [TUTORIAL-COMPLETO.md](./TUTORIAL-COMPLETO.md) | Tutorial passo a passo com exemplos | Quem quer aprender fazendo |
| [CONCEPTS.md](./CONCEPTS.md) | Conceitos profundos e frameworks | Quem quer entender a teoria |
| [COMMANDS.md](./COMMANDS.md) | Referencia completa de comandos | Consulta diaria |
| [FAQ.md](./FAQ.md) | Perguntas frequentes e glossario | Duvidas pontuais |
| [ARCHITECTURE-DIAGRAMS.md](./ARCHITECTURE-DIAGRAMS.md) | Diagramas Mermaid dos fluxos | Visualizacao de arquitetura |
| [HITL-FLOW.md](./HITL-FLOW.md) | Fluxos Human-in-the-Loop | Controle e governanca |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Problemas comuns e solucoes | Quando algo da errado |

---

## Fluxo tipico de trabalho

Uma sessao tipica com o squad-creator segue este fluxo:

```
1. Ativar o agente ........... @squad-creator
2. Criar um squad ............ *create-squad meu-squad
3. Clonar uma mente .......... *clone-mind --person "Nome" --mode yolo
4. Descobrir ferramentas ...... *discover-tools "dominio"
5. Extrair SOPs .............. *extract-sop --source ./docs/processo.md
6. Validar o squad ........... *validate-squad meu-squad
7. Verificar qualidade ....... *quality-dashboard meu-squad
```

Nao e necessario seguir todos os passos em uma unica sessao. Cada comando e independente e pode ser executado quando necessario. O importante e que o squad tenha sido criado antes de tentar validar ou rodar o dashboard de qualidade.

---

## Proximos passos recomendados

Se voce leu ate aqui, recomendo seguir para o [QUICK-START.md](./QUICK-START.md) para colocar a mao na massa imediatamente. Se preferir ir devagar, comece pelo [FAQ.md](./FAQ.md) para tirar duvidas basicas, e depois avance para o [TUTORIAL-COMPLETO.md](./TUTORIAL-COMPLETO.md) quando estiver pronto para praticar.

---

*squad-creator docs v2.6.0 -- Synkra AIOS*
