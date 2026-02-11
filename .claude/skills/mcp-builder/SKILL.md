---
name: mcp-builder
description: Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Use when building MCP servers to integrate external APIs or services, whether in Python (FastMCP) or Node/TypeScript (MCP SDK).
license: Complete terms in LICENSE.txt

# Auto-routing configuration (opt-in)
auto_invoke: true
triggers:
  keywords:
    - "criar mcp"
    - "create mcp"
    - "build mcp server"
    - "mcp integration"
    - "nova integração"
    - "fastmcp"
    - "mcp sdk"
  patterns:
    - "(?i)mcp.*server"
    - "(?i)integr.*externa"
agents_allowed:
  - devops
  - dev
  - architect
priority: high
confirm_before_invoke: false
---

# MCP Server Development Guide

## Overview

To create high-quality MCP (Model Context Protocol) servers that enable LLMs to effectively interact with external services, use this skill. An MCP server provides tools that allow LLMs to access external services and APIs.

---

## High-Level Workflow

### Phase 1: Deep Research and Planning
1. Understand Agent-Centric Design Principles
2. Study MCP Protocol Documentation
3. Study Framework Documentation
4. Exhaustively Study API Documentation
5. Create Implementation Plan

### Phase 2: Implementation
1. Set Up Project Structure
2. Implement Core Infrastructure First
3. Implement Tools Systematically
4. Follow Language-Specific Best Practices

### Phase 3: Review and Refine
1. Code Quality Review
2. Test and Build
3. Use Quality Checklist

### Phase 4: Create Evaluations
1. Create 10 Evaluation Questions
2. Follow Evaluation Requirements
3. Verify Answers

---

## Server Naming Conventions

**Python**: `{service}_mcp` (lowercase with underscores)
- Examples: `slack_mcp`, `github_mcp`, `jira_mcp`

**Node/TypeScript**: `{service}-mcp-server` (lowercase with hyphens)
- Examples: `slack-mcp-server`, `github-mcp-server`

---

## Tool Naming Best Practices

1. **Use snake_case**: `search_users`, `create_project`
2. **Include service prefix**: `slack_send_message`, `github_create_issue`
3. **Be action-oriented**: Start with verbs (get, list, search, create)
4. **Be specific**: Avoid generic names
5. **Maintain consistency**: Use consistent patterns

---

## Response Format Guidelines

### JSON Format
- Machine-readable structured data
- Include all available fields
- Suitable for programmatic processing

### Markdown Format (default)
- Human-readable formatted text
- Use headers, lists, formatting
- Convert timestamps to human-readable format

---

## Pagination Best Practices

- Always respect the `limit` parameter
- Implement pagination with `offset` or cursor
- Return: `has_more`, `next_offset`, `total_count`
- Default to 20-50 items

---

## Character Limits and Truncation

```python
CHARACTER_LIMIT = 25000  # Maximum response size

if len(result) > CHARACTER_LIMIT:
    response["truncated"] = True
    response["truncation_message"] = "Use 'offset' or add filters"
```

---

## Resources

### scripts/
- `connections.py` - Lightweight connection handling
- `evaluation.py` - MCP Server Evaluation Harness
- `example_evaluation.xml` - Sample evaluation file
- `requirements.txt` - Python dependencies

### reference/
- `mcp_best_practices.md` - Core guidelines
- `python_mcp_server.md` - Python implementation guide
- `node_mcp_server.md` - TypeScript implementation guide
- `evaluation.md` - Evaluation creation guide
