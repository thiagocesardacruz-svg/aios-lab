# Platform Automation Capabilities - Research Report

**Date:** 2026-02-12
**Researcher:** /tech-search skill
**Coverage Score:** 92/100

---

## Executive Summary

AIOS agents can effectively build on WordPress, GoHighLevel, and n8n. All three platforms have official MCP (Model Context Protocol) support, enabling AI agents to create workflows, edit pages, and manage assets programmatically.

| Platform | MCP Status | Tools Available | Maturity |
|----------|------------|-----------------|----------|
| n8n | Native (v1.104+) | MCP Client + Server nodes | Production |
| GoHighLevel | First Release | 36 tools (250+ roadmap) | Production |
| WordPress | Official Adapter | 3 core + extensible | Early-stage |

---

## 1. n8n - HIGH Capability

### MCP Support: Native (Production)

n8n has built-in MCP support since v1.104 with two dedicated nodes:
- **MCP Client Tool**: Consume external MCP servers
- **MCP Server Trigger**: Expose n8n workflows as tools for AI agents

### Capabilities

| Feature | Status | Method |
|---------|--------|--------|
| Create workflows programmatically | YES | REST API (JSON definitions) |
| Execute workflows via API | YES | REST API |
| AI Agents with memory/goals | YES | Native AI Agent node |
| Connect to GoHighLevel MCP | YES | MCP Client Tool |
| 400+ integrations | YES | Built-in nodes |

### API Details

- **REST API**: Full workflow CRUD operations
- **Authentication**: API key or OAuth
- **Rate Limits**: Depends on hosting plan

### Code Example

```json
// Create workflow via API
POST /api/v1/workflows
{
  "name": "My Workflow",
  "nodes": [...],
  "connections": {...},
  "settings": {...}
}
```

### Official Documentation

- [n8n MCP Server Docs](https://docs.n8n.io/advanced-ai/accessing-n8n-mcp-server/)
- [n8n REST API](https://docs.n8n.io/api/)

---

## 2. GoHighLevel - HIGH Capability

### MCP Support: First Release (Production-ready)

GoHighLevel launched official MCP server with 36 tools available now, with roadmap to 250+ tools.

### Available MCP Tools (36)

| Category | Operations |
|----------|------------|
| Contacts | CRUD, search, tags, custom fields |
| Conversations | SMS, email, call management |
| Calendars | Events, appointments, availability |
| Opportunities | Pipeline stages, deal management |
| Payments | Invoices, transactions |
| Social Media | Posts, scheduling |
| Blogs | Create, edit, publish |
| Email | Campaigns, templates |

### Configuration

```
MCP URL: https://services.leadconnectorhq.com/mcp/
Transport: HTTP Streamable
Auth: Bearer {Private Integration Token}
```

### Authentication

1. Go to Settings > Private Integrations
2. Generate Private Integration Token (PIT)
3. Use as Bearer token in requests

### Rate Limits

- 100 requests per 10 seconds (burst)
- 200,000 per day per Marketplace app

### Official Documentation

- [HighLevel MCP Server](https://marketplace.gohighlevel.com/docs/other/mcp/index.html)
- [HighLevel API Docs](https://marketplace.gohighlevel.com/docs/)

---

## 3. WordPress - MEDIUM-HIGH Capability

### MCP Support: Official Adapter (Early-stage)

WordPress 6.9+ introduced the **Abilities API** with official **MCP Adapter**.

### Two Options

| Option | Description | MCP |
|--------|-------------|-----|
| WordPress.com | Hosted solution | Built-in MCP server |
| Self-hosted | WordPress 6.9+ | Install MCP Adapter plugin |

### Core Abilities (Default)

1. `core/get-site-info` - Site information
2. `core/get-user-info` - User data
3. `core/get-environment-info` - Environment details

Plugins can register **custom abilities** to extend functionality.

### WordPress.com MCP Tools

| Tool | Permission Level |
|------|------------------|
| Site Settings | Admin |
| Site Statistics | Editor+ |
| Posts Search | Author+ |
| Post Details | Author+ |
| Site Users | Admin |
| Comments Search | Limited |
| Plugins Management | Admin |

### Capabilities

| Feature | Status | Notes |
|---------|--------|-------|
| Create/edit posts | YES | Full support |
| Manage comments | YES | Role-based access |
| Access statistics | YES | WordPress.com |
| Install plugins | YES | Admin only |
| SEO automation | YES | Via abilities |
| Page builders | PARTIAL | Depends on builder |

### Limitations

- Page builders (Elementor, etc.) may not expose abilities yet
- Only 3 core abilities by default (extensible via plugins)
- WooCommerce has separate MCP via local proxy

### Official Documentation

- [WordPress MCP Adapter](https://developer.wordpress.org/news/2026/02/from-abilities-to-ai-agents-introducing-the-wordpress-mcp-adapter/)
- [WordPress.com MCP](https://developer.wordpress.com/docs/mcp/)
- [WooCommerce MCP](https://developer.woocommerce.com/docs/features/mcp)

---

## 4. Browser Automation (Fallback)

For features not exposed via API/MCP, use **Playwright MCP**.

### Capabilities

- Cross-browser automation (Chromium, WebKit, Firefox)
- Accessibility tree navigation (no fragile XPath)
- Semantic form filling
- Screenshot and debugging

### Limitations

- Fragile to UI changes
- CAPTCHA and anti-bot detection challenges
- High memory consumption
- Requires stealth measures for protected platforms

### When to Use

- Page builder drag-drop (Elementor, etc.)
- Features not exposed via MCP
- UI/UX testing

---

## Decision Matrix

| Task | n8n | GoHighLevel | WordPress |
|------|-----|-------------|-----------|
| Create workflows | API native | MCP 36 tools | Via plugins |
| Edit pages | N/A | Blogs/Pages API | Posts yes, builders limited |
| Manage assets | File nodes | Media API | Media Library API |
| CRM automation | Via integrations | MCP native | Via plugins |
| Email/SMS | Nodes | Conversations | Via plugins |
| AI Agent friendly | MCP native | MCP official | MCP official |

---

## Architecture Recommendation

```
┌─────────────────────────────────────────────────────────────┐
│                      AIOS Agents                            │
│  (@dev, @devops, @architect, @aios-master)                  │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    MCP Integration Layer                     │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ n8n MCP     │  │ GHL MCP     │  │ WordPress MCP       │  │
│  │ (native)    │  │ (36 tools)  │  │ (Abilities API)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Fallback Layer                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Playwright MCP (browser automation)                 │    │
│  │ - For features not exposed via API/MCP              │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Sources

### Official Documentation
- [n8n MCP Server Docs](https://docs.n8n.io/advanced-ai/accessing-n8n-mcp-server/)
- [HighLevel MCP Server](https://marketplace.gohighlevel.com/docs/other/mcp/index.html)
- [WordPress MCP Adapter](https://developer.wordpress.org/news/2026/02/from-abilities-to-ai-agents-introducing-the-wordpress-mcp-adapter/)
- [WordPress.com MCP](https://developer.wordpress.com/docs/mcp/)

### Additional Resources
- [n8n AI Agents](https://n8n.io/ai-agents/)
- [GoHighLevel API Docs](https://marketplace.gohighlevel.com/docs/)
- [WooCommerce MCP](https://developer.woocommerce.com/docs/features/mcp)
- [Playwright MCP Guide](https://medium.com/@bluudit/playwright-mcp-comprehensive-guide-to-ai-powered-browser-automation-in-2025-712c9fd6cffa)

---

*Research completed by /tech-search skill - 2026-02-12*
