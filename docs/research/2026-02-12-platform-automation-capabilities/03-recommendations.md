# Recommendations - Platform Automation

**Date:** 2026-02-12

---

## Immediate Actions (Ready to Use)

### 1. Configure n8n MCP
- **Status:** Already listed as @dev tool
- **Action:** Verify MCP Server/Client nodes are enabled
- **Owner:** @devops

### 2. Register GoHighLevel MCP
- **Action:** Obtain Private Integration Token from GHL Settings
- **Configuration:**
  ```
  MCP URL: https://services.leadconnectorhq.com/mcp/
  Transport: HTTP Streamable
  Auth: Bearer {PIT}
  ```
- **Owner:** @devops

---

## Short-term Actions

### 3. Evaluate WordPress MCP
- **Requirement:** WordPress 6.9+ site for testing
- **Options:**
  - WordPress.com (built-in MCP, paid plans)
  - Self-hosted with MCP Adapter plugin
- **Owner:** @devops + @architect

### 4. Create `/platform-builder` Skill
- **Purpose:** Orchestrate multi-platform operations
- **Features:**
  - Unified interface for all 3 platforms
  - Fallback to Playwright when needed
  - Error handling and retry logic
- **Owner:** @pm to prioritize, @dev to implement

---

## Implementation Owners

| Action | Owner | Priority |
|--------|-------|----------|
| MCP setup environment | @devops | High |
| Integration architecture | @architect | High |
| Feature prioritization | @pm | Medium |
| Skill development | @dev | Medium |

---

## Risk Mitigation

### WordPress Page Builders
- **Risk:** Elementor, Divi may not expose abilities
- **Mitigation:** Use Playwright MCP as fallback
- **Monitoring:** Track WordPress Abilities API updates

### GoHighLevel Rate Limits
- **Risk:** 100 req/10s burst, 200k/day limits
- **Mitigation:** Implement request queuing and caching
- **Monitoring:** Track API usage metrics

### Authentication Security
- **Risk:** Token management across platforms
- **Mitigation:**
  - Store tokens in secure credential store
  - Implement token rotation
  - Never log tokens in outputs

---

## Success Metrics

| Metric | Target |
|--------|--------|
| n8n workflows created via API | First workflow within 1 week |
| GHL MCP integration working | Basic CRUD within 2 weeks |
| WordPress post automation | Publish via agent within 2 weeks |
| Multi-platform skill | MVP within 1 month |

---

## Not In Scope (This Research)

- Production code implementation
- Credential setup
- Infrastructure provisioning
- Cost analysis

→ For implementation: Contact @pm for prioritization or @dev for execution.

---

*Recommendations by /tech-search skill*
