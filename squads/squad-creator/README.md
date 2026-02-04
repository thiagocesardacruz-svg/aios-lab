# Squad Creator v2.6.0

> Mind Cloning, Deep Tool Discovery, SOP Extraction

Squad Creator is the meta-squad for creating, validating, and managing AIOS squads. Version 2.6 adds three advanced capabilities: Mind Cloning for creating AI personas, Deep Tool Discovery for evaluating tools, and SOP Extraction for structuring processes.

## Features

### Core (v1.x)
- **Design Squad** — Generate squad blueprints from documentation
- **Create Squad** — Scaffold squads with task-first architecture
- **Validate Squad** — JSON Schema validation against AIOS standards
- **Analyze Squad** — Coverage metrics and improvement suggestions
- **Extend Squad** — Add components to existing squads

### Mind Cloning (v2.6)
- **Voice DNA Extraction** — Communication patterns, vocabulary, tone, cultural markers
- **Thinking DNA Extraction** — Decision frameworks, mental models, cognitive biases
- **YOLO Mode** — Fast extraction at 60-75% fidelity for prototyping
- **QUALITY Mode** — Thorough extraction at 85-95% fidelity for production
- **Auto-Acquire Sources** — Automatically find public source material
- **Smoke Test** — 3-scenario fidelity validation

### Deep Tool Discovery (v2.6)
- **5 Parallel Search Channels** — MCP, API, CLI, Library, GitHub
- **RICE/WSJF Scoring** — Quantitative tool evaluation
- **Security Gate** — CVE check, license audit, maintenance health
- **Social Proof Gate** — Stars, downloads, community activity
- **Tier Classification** — Percentile-based ranking (Tier 1-4)
- **Decision Matrix** — DO NOW / DO NEXT / DO LATER / DON'T DO

### SOP Extraction (v2.6)
- **SC-PE-001 Format** — 11-part Standard Operating Procedure
- **Cognitive Taxonomy** — Bloom's classification per step
- **Executor Classification** — Human / AI / Hybrid per step
- **PV_PM_001 Analysis** — Automation opportunity assessment
- **Blueprint Generation** — Convert SOP to squad blueprint

## Architecture

```
squads/squad-creator/
├── squad.yaml              # Manifest v2.6.0
├── README.md               # This file
├── config/
├── agents/                 # 4 specialist agents
│   ├── squad-architect.md  # Atlas — Squad design & tool discovery
│   ├── sop-extractor.md    # Scribe — SOP extraction & validation
│   ├── oalanicolas.md      # Mirror — Mind cloning specialist
│   └── pedro-valerio.md    # Forge — Process design
├── tasks/                  # 14 tasks
├── workflows/              # 1 workflow (wf-discover-tools)
├── checklists/             # 2 checklists
├── data/                   # 3 data files (KB, registry, framework)
├── docs/                   # 9 documentation files
├── templates/
├── tools/
└── scripts/
```

## Quick Start

```bash
# 1. Activate the agent
@squad-creator

# 2. Create your first squad
*create-squad my-domain-squad

# 3. Validate
*validate-squad my-domain-squad

# 4. Clone a mind (YOLO mode)
*clone-mind "John Doe" --mode yolo --sources ./john-texts/

# 5. Discover tools
*discover-tools --domain "data-processing"

# 6. Extract SOP
*extract-sop --source ./process-doc.md
```

## Specialist Agents

| Agent | Name | Role |
|-------|------|------|
| `squad-architect` | Atlas | Squad design, tool discovery, quality metrics |
| `sop-extractor` | Scribe | SOP extraction, validation, blueprint generation |
| `oalanicolas` | Mirror | Mind cloning (Voice DNA + Thinking DNA) |
| `pedro-valerio` | Forge | Process design, workflow optimization |

Access sub-agents via delegation: `@squad-creator:oalanicolas`

## Documentation

| Document | Description |
|----------|-------------|
| [POR-ONDE-COMECAR.md](docs/POR-ONDE-COMECAR.md) | Navigation guide for beginners |
| [QUICK-START.md](docs/QUICK-START.md) | First squad in 5 minutes |
| [TUTORIAL-COMPLETO.md](docs/TUTORIAL-COMPLETO.md) | Complete hands-on tutorial |
| [CONCEPTS.md](docs/CONCEPTS.md) | Deep dive into key concepts |
| [COMMANDS.md](docs/COMMANDS.md) | Complete command reference |
| [ARCHITECTURE-DIAGRAMS.md](docs/ARCHITECTURE-DIAGRAMS.md) | Mermaid flow diagrams |
| [HITL-FLOW.md](docs/HITL-FLOW.md) | Human-in-the-Loop documentation |
| [FAQ.md](docs/FAQ.md) | Frequently asked questions |
| [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Common problems and solutions |

## Requirements

- AIOS v2.1.0+
- Node.js 18+
- Git configured

## License

MIT
