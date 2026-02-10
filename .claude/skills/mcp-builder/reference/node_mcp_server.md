# Node/TypeScript MCP Server Implementation Guide

## Quick Reference

### Key Imports
```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios, { AxiosError } from "axios";
```

### Server Initialization
```typescript
const server = new McpServer({
  name: "service-mcp-server",
  version: "1.0.0"
});
```

### Tool Registration Pattern
```typescript
server.registerTool("tool_name", {...config}, async (params) => {
  // Implementation
});
```

---

## Server Naming Convention

Node/TypeScript MCP servers: `{service}-mcp-server` (lowercase with hyphens)
- Examples: `github-mcp-server`, `jira-mcp-server`

---

## Project Structure

```
{service}-mcp-server/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   ├── types.ts
│   ├── tools/
│   ├── services/
│   ├── schemas/
│   └── constants.ts
└── dist/
```

---

## Zod Schemas for Input Validation

```typescript
import { z } from "zod";

const CreateUserSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),
  email: z.string()
    .email("Invalid email format"),
  age: z.number()
    .int("Age must be a whole number")
    .min(0, "Age cannot be negative")
}).strict();
```

---

## Error Handling

```typescript
import axios, { AxiosError } from "axios";

function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          return "Error: Resource not found.";
        case 403:
          return "Error: Permission denied.";
        case 429:
          return "Error: Rate limit exceeded.";
      }
    }
  }
  return `Error: Unexpected error occurred`;
}
```

---

## TypeScript Best Practices

1. **Use Strict TypeScript**: Enable strict mode in tsconfig.json
2. **Define Interfaces**: Create clear interface definitions
3. **Avoid `any`**: Use proper types or `unknown`
4. **Zod for Runtime Validation**: Use Zod schemas
5. **Type Guards**: Create type guard functions
6. **Error Handling**: Always use try-catch
7. **Null Safety**: Use optional chaining (`?.`) and nullish coalescing (`??`)
