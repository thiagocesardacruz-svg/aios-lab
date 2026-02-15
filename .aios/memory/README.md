# Institutional Memory Storage

> Memória organizacional com scoping por projeto. Persiste entre sessões.

## Structure (Holding Model)

```
memory/
├── framework/              # Shared knowledge (AIOS as system)
│   ├── decisions/          # DEC-YYYY-NNN (architecture, infra, patterns)
│   ├── errors/             # ERR-YYYY-NNN (framework-level bugs)
│   ├── tacit/              # TAC-YYYY-NNN (tips, gotchas, rules)
│   └── context/            # CTX-YYYY-QN (quarterly snapshots)
├── projects/
│   └── traveltech/         # Niche: Hotels & Travel (AI OS V3.1 MVP)
│       ├── decisions/      # Domain-specific decisions
│       ├── errors/         # Product-specific bugs
│       ├── tacit/          # Hotel/travel knowledge
│       └── context/        # Product snapshots
├── search-index.yaml       # Global cross-scope search
└── README.md
```

## Auto-Capture (3 points, all deterministic)

| Source | Trigger | Script |
|--------|---------|--------|
| Git commit | Keywords: decision, fix, breaking, always, never | `.git/hooks/post-commit` |
| ClickUp done | `clickup-sync.mjs done` with error/decision keywords | `memory-capture.mjs` |
| Session end | Session logger hook | `session-logger.py` |

## Scripts

```bash
# Pre-task recall (search before starting work)
node squads/ops/scripts/memory-recall.mjs "authentication"
node squads/ops/scripts/memory-recall.mjs "supabase" --project=traveltech

# Query memory
node squads/ops/scripts/memory-query.mjs decisions
node squads/ops/scripts/memory-query.mjs decisions --project=framework
node squads/ops/scripts/memory-query.mjs search "hooks"

# Manual capture
node squads/ops/scripts/memory-capture.mjs clickup --task-id=123 --summary="Fixed auth bug"
```

## Project Registry

See `.aios/projects.yaml` for the holding model:
- AIOS (framework) = shared knowledge
- TravelTech = first niche (Hotels & Travel)
- Future niches inherit framework knowledge

## Scoping Rules

| What learned | Goes to |
|-------------|---------|
| Supabase Auth patterns | `framework/` (reusable) |
| Next.js deployment gotcha | `framework/` (reusable) |
| Hotel booking rules | `projects/traveltech/` (niche-specific) |
| Channel manager API quirk | `projects/traveltech/` (niche-specific) |

## Entry IDs

| Type | Format | Example |
|------|--------|---------|
| Decision | DEC-YYYY-NNN | DEC-2025-001 |
| Error | ERR-YYYY-NNN | ERR-2025-015 |
| Tacit | TAC-YYYY-NNN | TAC-2025-007 |
| Context | CTX-YYYY-QN | CTX-2025-Q1 |

## Governance

- Entries are NEVER deleted (only superseded)
- All entries include context (the WHY, not just the WHAT)
- No credentials or sensitive data stored
- Cost: always zero (deterministic, no AI)

---
*Auto-capture via memory-capture.mjs | Query via memory-query.mjs | Recall via memory-recall.mjs*
