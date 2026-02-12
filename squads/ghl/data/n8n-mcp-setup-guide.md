# n8n MCP Setup Guide

## Status: Configurado (Aguardando Credenciais)

A configuração MCP foi adicionada ao projeto. Falta apenas inserir as credenciais.

---

## Passo 1: Obter API Key do n8n

### Opção A: n8n Cloud

1. Acesse sua instância n8n Cloud
2. Vá para **Settings** → **API**
3. Clique em **Create API Key**
4. Copie a key gerada

### Opção B: n8n Self-hosted (Local)

1. Acesse `http://localhost:5678` (ou sua URL)
2. Vá para **Settings** → **API**
3. Habilite a API se necessário
4. Crie uma API Key

---

## Passo 2: Identificar URL da Instância

| Tipo | URL |
|------|-----|
| **Local** | `http://localhost:5678` |
| **Cloud** | `https://seu-workspace.app.n8n.cloud` |
| **Self-hosted** | `https://n8n.seudominio.com` |

---

## Passo 3: Adicionar Credenciais ao Projeto

### Editar `.mcp.json`

Abra o arquivo `.mcp.json` na raiz do projeto e substitua os placeholders:

```json
{
    "mcpServers": {
        "n8n-mcp": {
            "command": "cmd",
            "args": ["/c", "npx", "-y", "n8n-mcp"],
            "env": {
                "MCP_MODE": "stdio",
                "LOG_LEVEL": "error",
                "DISABLE_CONSOLE_OUTPUT": "true",
                "N8N_API_URL": "http://localhost:5678",      ← SUA URL AQUI
                "N8N_API_KEY": "n8n_api_xxxxxxxxxxxxx"       ← SUA KEY AQUI
            }
        }
    }
}
```

---

## Passo 4: Reiniciar Claude Code

1. Feche o Claude Code completamente
2. Abra novamente
3. O MCP será carregado automaticamente

---

## Passo 5: Testar Conexão

Execute no Claude Code:

```
Liste os workflows do n8n
```

Ou verifique o status:
```
/mcp
```

---

## Modo Sem Credenciais (Documentation Only)

Se você não tem instância n8n ainda, o MCP funciona em modo **documentation only**:

- ✅ Acesso a documentação de 1,084+ nodes
- ✅ Validação de workflows
- ✅ Sugestões de configuração
- ❌ Não gerencia workflows reais

Para usar sem credenciais, deixe `N8N_API_URL` e `N8N_API_KEY` vazios:

```json
"env": {
    "MCP_MODE": "stdio",
    "LOG_LEVEL": "error",
    "DISABLE_CONSOLE_OUTPUT": "true"
}
```

---

## Tools Disponíveis

### Com Credenciais (Full Access)

| Tool | Descrição |
|------|-----------|
| `list_workflows` | Listar todos os workflows |
| `get_workflow` | Detalhes de um workflow |
| `create_workflow` | Criar novo workflow |
| `update_workflow` | Atualizar workflow |
| `execute_workflow` | Executar workflow |
| `get_executions` | Ver histórico de execuções |

### Sem Credenciais (Documentation Only)

| Tool | Descrição |
|------|-----------|
| `search_nodes` | Buscar nodes por nome/função |
| `get_node_info` | Documentação de um node |
| `validate_workflow` | Validar estrutura JSON |
| `suggest_nodes` | Sugerir nodes para tarefa |

---

## Troubleshooting

### Erro: "Connection refused"
- Verifique se n8n está rodando
- Confirme a URL (http vs https, porta correta)

### Erro: "Unauthorized"
- Verifique se a API Key está correta
- Confirme que a API está habilitada no n8n

### Erro: "MCP not loading"
- Verifique se Node.js >= 18 está instalado
- Tente: `npx n8n-mcp --help`

---

## Integração com Squad GHL

O n8n MCP é usado pelo `@ghl-automation-specialist` para:

- Processar webhooks complexos off-platform
- Executar lógica que excede capacidades do GHL
- Integrar com sistemas externos

### Fluxo típico:

```
GHL Workflow → Custom Webhook → n8n → Processamento → API GHL → Continua
```

---

## Referências

- [n8n MCP Package](https://github.com/czlonkowski/n8n-mcp)
- [n8n MCP on npm](https://www.npmjs.com/package/n8n-mcp)
- [n8n API Documentation](https://docs.n8n.io/api/)

---

*Setup Guide v1.0 - GHL Squad*
