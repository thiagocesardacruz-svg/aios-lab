# Source Tree

## Estrutura do Projeto - AIOS Lab

```
aios-lab/
├── .aios/                      # Configurações AIOS
│   ├── config.yaml             # Config do projeto
│   ├── environment-report.yaml # Relatório do ambiente
│   └── install-log.txt         # Log de instalação
│
├── .aios-core/                 # Framework AIOS (não editar)
│   ├── development/            # Agentes, tasks, workflows
│   ├── product/                # Templates, checklists
│   └── infrastructure/         # Tools, scripts
│
├── .claude/                    # Configuração Claude Code
│   ├── CLAUDE.md               # System prompt
│   └── commands/               # Comandos de agentes
│
├── docs/                       # Documentação do projeto
│   ├── framework/              # Padrões e convenções
│   ├── stories/                # User stories
│   ├── prd/                    # Product Requirements
│   ├── architecture/           # Arquitetura técnica
│   └── guides/                 # Guias e tutoriais
│
├── projects/                   # Projetos desenvolvidos
│   └── ai-os-v3-1-mvp/         # Projeto atual
│       ├── app/                # Next.js App
│       │   └── src/
│       │       ├── app/        # Routes
│       │       ├── components/ # React components
│       │       ├── lib/        # Utilities
│       │       └── actions/    # Server Actions
│       └── supabase/           # Database
│           ├── migrations/     # SQL migrations
│           └── seed.sql        # Seed data
│
├── squads/                     # Squads customizados
│   └── squad-creator/          # Squad para criar squads
│
├── .env                        # Variáveis de ambiente
├── .mcp.json                   # Configuração MCPs
└── README.md                   # Readme do workspace
```

---
*Última atualização: 2026-02-04*
