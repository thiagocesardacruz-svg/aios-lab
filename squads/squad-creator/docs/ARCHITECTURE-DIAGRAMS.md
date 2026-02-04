# Architecture Diagrams

> Visual architecture reference for Squad Creator v2.6
> All diagrams use Mermaid syntax for portability

---

## 1. Overall Squad Creator Architecture

The base agent (Craft) orchestrates 4 specialist sub-agents. Each sub-agent owns specific tasks and can be accessed directly via delegation.

```mermaid
graph TD
    USER[User] --> SC["@squad-creator (Craft)"]

    SC --> SA["@squad-architect (Atlas)"]
    SC --> SE["@sop-extractor (Scribe)"]
    SC --> MC["@oalanicolas (Mirror)"]
    SC --> PV["@pedro-valerio (Forge)"]

    subgraph "Squad Management"
        SC --> T1["*design-squad"]
        SC --> T2["*create-squad"]
        SC --> T3["*validate-squad"]
        SC --> T4["*analyze-squad"]
        SC --> T5["*extend-squad"]
        SC --> T6["*list-squads"]
    end

    subgraph "Mind Cloning"
        MC --> M1["*clone-mind"]
        MC --> M2["*extract-voice-dna"]
        MC --> M3["*extract-thinking-dna"]
        MC --> M4["*update-mind"]
        MC --> M5["*auto-acquire-sources"]
        MC --> M6["*smoke-test"]
    end

    subgraph "Tool Discovery"
        SA --> D1["*discover-tools"]
        SA --> D2["*show-tools"]
        SA --> D3["*add-tool"]
        SA --> D4["*quality-dashboard"]
    end

    subgraph "SOP Extraction"
        SE --> S1["*extract-sop"]
        SE --> S2["*validate-sop"]
        SE --> S3["*generate-blueprint"]
        SE --> S4["*analyze-automation"]
    end

    subgraph "Process Design"
        PV --> P1["*design-workflow"]
        PV --> P2["*design-checklist"]
        PV --> P3["*define-veto-conditions"]
        PV --> P4["*analyze-process"]
    end

    style SC fill:#FFD700,color:#000
    style SA fill:#ADD8E6
    style SE fill:#90EE90
    style MC fill:#E6E6FA
    style PV fill:#FFE4B5
```

---

## 2. Mind Cloning Pipeline

Full pipeline from source acquisition through profile generation and validation.

```mermaid
graph TD
    START[Start: *clone-mind] --> MODE{Mode?}

    MODE -->|YOLO| YOLO_CFG["Min 2 sources<br/>60-75% fidelity target"]
    MODE -->|QUALITY| QUAL_CFG["Min 5 sources<br/>85-95% fidelity target"]

    YOLO_CFG --> SOURCES
    QUAL_CFG --> SOURCES

    SOURCES[Collect Sources] --> VALIDATE[Validate Source Quality]
    VALIDATE --> PARALLEL

    subgraph PARALLEL["Parallel Extraction"]
        VOICE["Extract Voice DNA<br/>- Vocabulary<br/>- Tone<br/>- Sentence structure<br/>- Cultural markers<br/>- Catchphrases"]
        THINK["Extract Thinking DNA<br/>- Decision frameworks<br/>- Mental models<br/>- Cognitive biases<br/>- Risk tolerance<br/>- Priorities"]
    end

    PARALLEL --> MERGE[Merge Profiles]
    MERGE --> SMOKE["Smoke Test<br/>(3 scenarios)"]

    SMOKE --> SCORE{Fidelity Score}
    SCORE -->|"Pass (>= threshold)"| SAVE[Save Profile]
    SCORE -->|"Fail (< threshold)"| REVIEW["HITL Review<br/>Add more sources?"]

    REVIEW -->|Yes| SOURCES
    REVIEW -->|Accept as-is| SAVE

    SAVE --> DONE[Profile Complete]

    style START fill:#FFD700,color:#000
    style DONE fill:#90EE90
    style REVIEW fill:#FFB6C1
    style VOICE fill:#E6E6FA
    style THINK fill:#E6E6FA
```

---

## 3. Tool Discovery Workflow (4 Phases)

```mermaid
graph TD
    subgraph PHASE_0["Phase 0: Capability Gap Analysis"]
        A[Start: *discover-tools] --> B[Load Squad Manifest]
        B --> C[Inventory Current Tools]
        C --> D[Map Capability Gaps]
        D --> E[Define Search Criteria]
    end

    subgraph PHASE_1["Phase 1: Parallel Deep Search"]
        E --> F1[MCP Catalog]
        E --> F2[API Marketplaces]
        E --> F3[CLI Registries]
        E --> F4[Package Managers]
        E --> F5[GitHub Repos]
    end

    subgraph PHASE_2["Phase 2: Comprehensive Evaluation"]
        F1 & F2 & F3 & F4 & F5 --> G[Merge Candidates]
        G --> H[RICE Scoring]
        H --> I[WSJF Scoring]
        I --> J{Security Gate}
        J -->|PASS| K{Social Proof Gate}
        J -->|FAIL| L["Flag: security-concern"]
        K -->|PASS| M[Tier Classification]
        K -->|FAIL| N["Flag: experimental"]
        L --> M
        N --> M
    end

    subgraph PHASE_3["Phase 3: Decision Matrix"]
        M --> O{Composite Score}
        O -->|"> 80"| P["DO NOW"]
        O -->|"> 60"| Q["DO NEXT"]
        O -->|"> 40"| R["DO LATER"]
        O -->|"<= 40"| S["DON'T DO"]
        P & Q & R & S --> T[Update Registry]
        T --> U[Generate Report]
    end

    style P fill:#90EE90
    style Q fill:#ADD8E6
    style R fill:#FFE4B5
    style S fill:#FFB6C1
    style F1 fill:#E6E6FA
    style F2 fill:#E6E6FA
    style F3 fill:#E6E6FA
    style F4 fill:#E6E6FA
    style F5 fill:#E6E6FA
```

---

## 4. SOP Extraction Flow

```mermaid
graph TD
    SOURCE["Source Material<br/>(doc, transcript, interview)"] --> PARSE[Parse & Identify Steps]

    PARSE --> STRUCT["Structure into SC-PE-001<br/>(11 parts)"]

    subgraph SC_PE_001["SC-PE-001 Format"]
        P1["1. Title"]
        P2["2. Objective"]
        P3["3. Scope"]
        P4["4. Prerequisites"]
        P5["5. Procedure Steps"]
        P6["6. Decision Points"]
        P7["7. Error Handling"]
        P8["8. Outputs"]
        P9["9. Quality Checks"]
        P10["10. Handoffs"]
        P11["11. Revision History"]
    end

    STRUCT --> CLASSIFY_COG["Classify: Cognitive Taxonomy<br/>(Bloom's 6 levels)"]
    CLASSIFY_COG --> CLASSIFY_EXEC["Classify: Executor Type<br/>(Human / AI / Hybrid)"]
    CLASSIFY_EXEC --> VALIDATE["*validate-sop<br/>(SC-CK-001 checklist)"]

    VALIDATE --> BRANCH{Next Action?}
    BRANCH -->|"Generate Blueprint"| BLUEPRINT["*generate-blueprint<br/>squad-design.yaml"]
    BRANCH -->|"Analyze Automation"| AUTOMATION["*analyze-automation<br/>PV_PM_001 analysis"]
    BRANCH -->|"Done"| DONE[SOP Complete]

    BLUEPRINT --> DESIGN["squads/.designs/<br/>blueprint.yaml"]
    AUTOMATION --> REPORT["Automation Report<br/>ROI + Quick Wins"]

    style SOURCE fill:#FFE4B5
    style DONE fill:#90EE90
    style DESIGN fill:#ADD8E6
    style REPORT fill:#ADD8E6
```

---

## 5. Agent Delegation Flow

How commands flow from the base agent to specialist sub-agents.

```mermaid
sequenceDiagram
    actor User
    participant SC as @squad-creator (Craft)
    participant SA as @squad-architect (Atlas)
    participant MC as @oalanicolas (Mirror)
    participant SE as @sop-extractor (Scribe)
    participant PV as @pedro-valerio (Forge)

    User->>SC: *clone-mind "John" --mode yolo
    SC->>SC: Resolve command -> delegates_to: oalanicolas
    SC->>MC: Execute clone-mind task
    MC->>MC: Load squads/squad-creator/tasks/clone-mind.md
    MC->>MC: Extract Voice DNA + Thinking DNA
    MC->>MC: Merge + Smoke Test
    MC-->>SC: Return mind_profile + fidelity_score
    SC-->>User: Display results

    User->>SC: *discover-tools --domain "testing"
    SC->>SA: Execute discover-tools task
    SA->>SA: Run 4-phase workflow
    SA-->>SC: Return decision matrix
    SC-->>User: Display recommendations

    User->>SC: *extract-sop --source ./proc.md
    SC->>SE: Execute extract-sop task
    SE->>SE: Parse + Classify + Structure
    SE-->>SC: Return SOP document
    SC-->>User: Display SOP

    Note over User,SC: Direct delegation also possible:
    User->>MC: @squad-creator:oalanicolas *smoke-test
    MC-->>User: Run smoke test directly
```

---

## 6. Squad Package Structure

```mermaid
graph LR
    subgraph "squads/squad-creator/"
        MANIFEST["squad.yaml<br/>v2.6.0"]
        README["README.md"]

        subgraph "agents/ (4)"
            AG1["squad-architect.md"]
            AG2["sop-extractor.md"]
            AG3["oalanicolas.md"]
            AG4["pedro-valerio.md"]
        end

        subgraph "tasks/ (14)"
            TG_A["Group A: Mind Cloning (6)"]
            TG_B["Group B: Tool Discovery (3)"]
            TG_C["Group C: SOP Extraction (4)"]
            TG_D["Group D: Quality (1)"]
        end

        subgraph "data/ (3)"
            D1["squad-kb.md"]
            D2["tool-registry.yaml"]
            D3["tool-evaluation-framework.md"]
        end

        subgraph "workflows/ (1)"
            WF["wf-discover-tools.yaml"]
        end

        subgraph "checklists/ (2)"
            CK1["squad-checklist.md"]
            CK2["sop-validation.md"]
        end

        subgraph "docs/ (9)"
            DOC["9 documentation files"]
        end
    end

    subgraph ".aios-core/"
        BASE["agents/squad-creator.md<br/>(base agent v2.6)"]
        SCHEMA1["schemas/squad-schema.json"]
        SCHEMA2["schemas/squad-design-schema.json"]
    end

    BASE -->|"squad_package"| MANIFEST
    BASE -->|"sub_agents"| AG1 & AG2 & AG3 & AG4
    SCHEMA1 -->|"validates"| MANIFEST
    WF -->|"references"| TG_B

    style MANIFEST fill:#FFD700,color:#000
    style BASE fill:#FFD700,color:#000
```

---

*Diagrams rendered with Mermaid — compatible with GitHub, VS Code, and most markdown renderers.*
