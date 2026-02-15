# MCP Usage (Summary)

## TL;DR
ALWAYS prefer native Claude Code tools (Read, Edit, Bash, Glob, Grep) over MCP servers. Use MCPs only when needed: EXA (web search), Context7 (library docs), Apify (web scraping), playwright (browser automation). DevOps Agent manages all MCP infrastructure.

## Critical Rules
- MUST: Use native Claude Code tools (Read, Edit, Bash) for local file operations
- MUST: Delegate MCP management to @devops agent (add, remove, configure)
- NEVER: Use docker-gateway for reading/writing local files or running host commands
- NEVER: Use playwright for non-browser tasks
- ONLY: Use docker-gateway when explicitly accessing Docker containers or Docker-based MCPs

## Tool Selection Priority

| Task | USE THIS | NOT THIS |
|------|----------|----------|
| Read/write files | `Read` / `Edit` tools | docker-gateway |
| Run commands | `Bash` tool | docker-gateway |
| Search files | `Glob` / `Grep` tools | docker-gateway |
| Web search/research | EXA (`mcp__docker-gateway__web_search_exa`) | - |
| Library docs | Context7 (`mcp__docker-gateway__get-library-docs`) | - |
| Web scraping | Apify (`mcp__docker-gateway__call-actor`) | - |
| Browser automation | playwright MCP | - |

## MCP Catalog

**Direct MCPs:** playwright (browser), desktop-commander (Docker ops)
**Docker MCPs (via gateway):** EXA (search), Context7 (docs), Apify (scraping)

**Management:** All MCP operations (`*add-mcp`, `*remove-mcp`, `*setup-mcp-docker`) → @devops agent only

## Full Documentation
See: `docs/rules/mcp-usage-full.md` for complete MCP architecture, access patterns, known issues (Docker secrets bug), and rationale.
