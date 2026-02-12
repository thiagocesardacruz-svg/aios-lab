# Institutional Memory Storage

> Memória organizacional acumulada que persiste entre sessões.

## Structure

```
memory/
├── decisions/       # Decision records (DEC-YYYY-NNN)
│   └── index.yaml   # Decision index with search keywords
├── errors/          # Error archive (ERR-YYYY-NNN)
│   └── index.yaml   # Error index with lessons
├── tacit/           # Tacit knowledge (TAC-YYYY-NNN)
│   └── index.yaml   # Tacit knowledge index
├── context/         # Context snapshots (CTX-YYYY-QN)
│   └── index.yaml   # Context snapshot index
└── search-index.yaml # Global search index
```

## Usage

This storage is managed by the `/institutional-memory` skill.

### Commands

- `*remember {topic}` - Search memory for topic
- `*decide` - Start decision documentation flow
- `*error` - Document error/incident
- `*tacit {knowledge}` - Record tacit knowledge
- `*snapshot` - Create context snapshot
- `*onboard {topic}` - Get onboarding context

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
- Related entries are always linked

---

*Managed by /institutional-memory skill*
