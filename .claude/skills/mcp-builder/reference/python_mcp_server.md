# Python MCP Server Implementation Guide

## Quick Reference

### Key Imports
```python
from mcp.server.fastmcp import FastMCP
from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Optional, List, Dict, Any
from enum import Enum
import httpx
```

### Server Initialization
```python
mcp = FastMCP("service_mcp")
```

### Tool Registration Pattern
```python
@mcp.tool(name="tool_name", annotations={...})
async def tool_function(params: InputModel) -> str:
    # Implementation
    pass
```

---

## Server Naming Convention

Python MCP servers: `{service}_mcp` (lowercase with underscores)
- Examples: `github_mcp`, `jira_mcp`, `stripe_mcp`

---

## Pydantic v2 Key Features

```python
from pydantic import BaseModel, Field, field_validator, ConfigDict

class CreateUserInput(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        validate_assignment=True
    )

    name: str = Field(..., description="User's full name", min_length=1, max_length=100)
    email: str = Field(..., description="User's email address")
    age: int = Field(..., description="User's age", ge=0, le=150)

    @field_validator('email')
    @classmethod
    def validate_email(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Email cannot be empty")
        return v.lower()
```

---

## Response Format Options

```python
from enum import Enum

class ResponseFormat(str, Enum):
    MARKDOWN = "markdown"
    JSON = "json"
```

---

## Error Handling

```python
def _handle_api_error(e: Exception) -> str:
    if isinstance(e, httpx.HTTPStatusError):
        if e.response.status_code == 404:
            return "Error: Resource not found."
        elif e.response.status_code == 403:
            return "Error: Permission denied."
        elif e.response.status_code == 429:
            return "Error: Rate limit exceeded."
    return f"Error: {type(e).__name__}"
```

---

## Complete Example

```python
#!/usr/bin/env python3
from mcp.server.fastmcp import FastMCP
from pydantic import BaseModel, Field, ConfigDict
import httpx

mcp = FastMCP("example_mcp")
CHARACTER_LIMIT = 25000

class SearchInput(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    query: str = Field(..., description="Search query", min_length=2)
    limit: int = Field(default=20, ge=1, le=100)

@mcp.tool(
    name="example_search",
    annotations={"readOnlyHint": True, "openWorldHint": True}
)
async def example_search(params: SearchInput) -> str:
    '''Search for items in the example system.'''
    # Implementation here
    return "Results"

if __name__ == "__main__":
    mcp.run()
```
