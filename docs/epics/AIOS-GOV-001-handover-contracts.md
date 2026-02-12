# EPIC: Handover Contracts System

## Brownfield Enhancement

**Epic ID:** AIOS-GOV-001
**Complexidade:** Média
**Stories Estimadas:** 3
**Created:** 2026-02-12
**Author:** @pm (Morgan)

---

## Epic Goal

Implementar sistema de contratos de handover entre agentes que garanta transferência de contexto completa, rastreável e validável, eliminando perda de informação e habilitando os Five Trust Behaviors em todo o workflow Task → Story → Epic.

---

## Existing System Context

**Current Relevant Functionality:**
- Agentes existem em `squads/*/agents/`
- Workflows definidos em `squads/*/workflows/`
- ClickUp integration via `squads/ops/scripts/clickup-sync.mjs`
- Skill system em `.claude/skills/`
- Governance rules em `governance/` e `.claude/rules/`

**Technology Stack:**
- AIOS 2.1.0 framework
- Node.js scripts
- YAML configurations
- ClickUp API integration

**Integration Points:**
- Squad workflows (all 18 squads)
- ClickUp task status transitions
- Agent activation system
- Skill auto-routing

---

## Enhancement Details

**What's Being Added:**

1. **Handover Contract Schema** — Definição YAML do contrato entre agentes
2. **Validation Skill** — `/handover-validator` para validar contratos
3. **ClickUp Gate** — Bloqueio de transição de status sem contrato válido
4. **Five Trust Behaviors Enforcement** — Decorators e flags obrigatórios

**How It Integrates:**
- Extends squad.yaml with `handover_contracts` section
- New skill integrates with skill-auto-routing
- ClickUp sync script validates contracts before status change
- Governance rules enforced via `.claude/rules/`

**Success Criteria:**
- 100% dos handovers entre agentes têm contrato válido
- Zero transições de status ClickUp sem evidência
- Rastreabilidade completa (paper trail) em todos os workflows
- Redução de 80% em "contexto perdido" entre agentes

---

## The Five Trust Behaviors

| Behavior | Rule | Enforcement |
|----------|------|-------------|
| **Verification Before Claim** | Never say "done" without proof | `@requires_verification` decorator |
| **Loud Failure** | No silent fallbacks | Exceptions surfaced, logged, explained |
| **Honest Uncertainty** | "I don't know" is valid | Fabrication detection, uncertainty flags |
| **Paper Trail** | Every action documented | Automatic logging, evidence collection |
| **Diligent Execution** | No shortcuts, even when tedious | Spot-check audits, consistency validation |

---

## Handover Contract Schema

```yaml
# Cada handover entre agentes deve incluir:
handover_contract:
  from_agent: "@pm"
  to_agent: "@sm"
  artifact_type: "epic"

  # O que DEVE estar presente (validação automática)
  required_fields:
    - business_context
    - success_metrics
    - scope_boundaries
    - quality_gates
    - dependencies

  # Evidência de completude
  verification:
    checklist_completed: true
    checklist_path: "checklists/epic-ready.md"
    confidence: "high"  # low | medium | high

  # Trail
  paper_trail:
    clickup_task_id: "abc123"
    git_commit: "feat(epic): create user-auth epic"

  # Próximos passos explícitos
  next_actions:
    - "@sm: quebrar em stories usando template X"
    - "@architect: validar technical approach"
```

---

## Stories (with Quality Planning)

### Story 1: Handover Contract Schema & Governance Rules

**Description:** Criar schema JSON/YAML para contratos de handover e regras de governança que enforcem os Five Trust Behaviors.

**Predicted Agents:**
- @architect (schema design)
- @dev (implementation)

**Quality Gates:**
- Pre-Commit: Schema validation, YAML lint
- Pre-PR: @architect review do contrato

**Deliverables:**
```
governance/schemas/handover-contract-schema.json
.claude/rules/handover-contracts.md
squads/_template/squad.yaml (updated with handover_contracts section)
```

**Acceptance Criteria:**
- [ ] Schema define campos obrigatórios: from_agent, to_agent, artifact_type
- [ ] Schema inclui verification block (checklist, confidence, evidence)
- [ ] Schema inclui paper_trail block (clickup_task_id, git_commit)
- [ ] Rules file documenta quando handover é required
- [ ] Template squad.yaml atualizado com exemplo

---

### Story 2: Handover Validator Skill

**Description:** Criar skill `/handover-validator` que valida contratos de handover e bloqueia transições inválidas.

**Predicted Agents:**
- @dev (skill implementation)
- @architect (design review)

**Quality Gates:**
- Pre-Commit: Skill structure validation
- Pre-PR: Integration test com workflow real

**Deliverables:**
```
.claude/skills/handover-validator/
├── SKILL.md
├── scripts/
│   └── validate-handover.js
└── references/
    └── five-trust-behaviors.md
```

**Acceptance Criteria:**
- [ ] Skill valida contratos contra schema
- [ ] Skill verifica presença de evidência (screenshot, test, diff)
- [ ] Skill detecta campos faltantes e sugere correções
- [ ] Skill integra com skill-auto-routing (auto_invoke: true)
- [ ] Skill bloqueia handover se confidence < medium sem justificativa

---

### Story 3: ClickUp Integration & Enforcement

**Description:** Integrar validação de handover com ClickUp, bloqueando transições de status sem contrato válido.

**Predicted Agents:**
- @dev (implementation)
- @devops (ClickUp API integration)

**Quality Gates:**
- Pre-Commit: Script validation
- Pre-PR: Integration test com ClickUp sandbox
- Pre-Deployment: Rollback plan documentado

**Deliverables:**
```
squads/ops/scripts/clickup-sync.mjs (updated)
squads/ops/scripts/handover-gate.mjs (new)
.claude/rules/clickup-auto-sync.md (updated)
```

**Acceptance Criteria:**
- [ ] clickup-sync.mjs valida handover contract antes de `done`
- [ ] Transição bloqueada se contrato inválido (com mensagem clara)
- [ ] Paper trail automático: comentário ClickUp com contrato
- [ ] Flag `--skip-handover` para casos excepcionais (com log)
- [ ] Dashboard mostra % de handovers com contrato válido

---

## Workflow Mapping: Task → Story → Epic

```
┌─────────────────────────────────────────────────────────────────┐
│                        EPIC (PM cria)                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Contrato de Entrada:                                      │  │
│  │ - Business context (Why)                                  │  │
│  │ - Success metrics definidos                               │  │
│  │ - Scope boundaries claros                                 │  │
│  │ - Quality gates pré-definidos                             │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↓                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    STORIES (SM cria)                      │  │
│  │ Contrato de Entrada:                                      │  │
│  │ - Epic reference + acceptance criteria herdados           │  │
│  │ - User persona + job-to-be-done                           │  │
│  │ - Dependencies mapeadas                                   │  │
│  │ - Definition of Done explícito                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ↓                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    TASKS (Dev executa)                    │  │
│  │ Contrato de Entrada:                                      │  │
│  │ - Story reference + DoD                                   │  │
│  │ - Technical specs (do @architect)                         │  │
│  │ - Files to touch (lista explícita)                        │  │
│  │ - Verification criteria                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Five Trust Behaviors Implementation

| Behavior | Implementation | Story |
|----------|---------------|-------|
| **Verification Before Claim** | `evidence` field required em handover contract | 1, 2 |
| **Loud Failure** | Validation errors surfaced, não silenciados | 2 |
| **Honest Uncertainty** | `confidence` field (low/medium/high) required | 1, 2 |
| **Paper Trail** | ClickUp comment + git commit em contract | 1, 3 |
| **Diligent Execution** | Checklist required antes de handover | 1, 2 |

---

## Compatibility Requirements

- [x] Existing squad.yaml format remains backward compatible
- [x] ClickUp sync commands continue working (graceful degradation)
- [x] Agents without explicit handover can still function
- [x] No breaking changes to existing workflows

---

## Risk Mitigation

**Primary Risk:** Over-engineering que paralisa workflows simples

**Mitigation:**
- Handover contracts OPTIONAL para tasks < 3 steps
- Graceful degradation: warning, não bloqueio, em fase inicial
- `--quick` mode para handovers simples (minimal contract)

**Rollback Plan:**
- Feature flag `HANDOVER_VALIDATION_ENABLED` em config
- Revert `.claude/rules/handover-contracts.md` desabilita enforcement
- ClickUp gate bypass via `--skip-handover`

---

## Definition of Done

- [x] Schema definido e documentado
- [x] Skill `/handover-validator` funcional
- [x] ClickUp integration testada
- [ ] 3 squads piloto usando handover contracts (next phase)
- [ ] Documentação atualizada em CLAUDE.md (next phase)
- [x] Zero regressões em workflows existentes

---

## Story Manager Handoff

"@sm: Desenvolva user stories detalhadas para este epic de Handover Contracts.

**Considerações chave:**
- Este é enhancement ao AIOS 2.1.0 existente (Node.js + YAML + ClickUp)
- Integration points: squad.yaml, clickup-sync.mjs, skill system
- Padrões existentes: skill-creator structure, governance rules format
- Requisitos críticos: backward compatibility, graceful degradation
- Cada story deve incluir verificação de que workflows existentes continuam funcionando

O epic deve manter integridade do sistema enquanto entrega governança robusta de handovers."

---

## Quality Assurance Strategy

- **CodeRabbit Validation:** Todas as stories incluem pre-commit reviews
- **Specialized Expertise:** @architect valida schema, @devops valida ClickUp integration
- **Quality Gates Aligned with Risk:** MEDIUM risk → Pre-Commit + Pre-PR validation
- **Regression Prevention:** Pilot em 3 squads antes de rollout completo

---

## Metadata

```yaml
epic_id: AIOS-GOV-001
version: 1.0.0
created_by: "@pm (Morgan)"
created_at: 2026-02-12
complexity: medium
estimated_stories: 3
status: complete
tags:
  - governance
  - handover
  - trust-behaviors
  - clickup-integration
dependencies:
  - skill-creator (for creating /handover-validator)
  - clickup-sync.mjs (existing)
  - governance/schemas/ (existing directory)
```

---

*Epic criado por @pm (Morgan) — Planejando o futuro*
