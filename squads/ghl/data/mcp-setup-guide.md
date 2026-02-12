# GoHighLevel MCP Setup Guide

## Status: Configurado (Aguardando Token)

A configuração MCP foi adicionada ao projeto. Falta apenas inserir o token.

---

## Passo 1: Obter Private Integration Token (PIT)

### No GoHighLevel:

1. **Login** em [app.gohighlevel.com](https://app.gohighlevel.com)
2. Vá para **Settings** (ícone de engrenagem)
3. Clique em **Integrations** → **Private Integrations**
4. Clique em **+ Create Token**
5. Configure os **Scopes** necessários:

| Scope | Agente que usa |
|-------|----------------|
| `locations.read` | @ghl-snapshot-architect |
| `locations.write` | @ghl-snapshot-architect |
| `contacts.read` | @ghl-crm-structuralist |
| `contacts.write` | @ghl-crm-structuralist |
| `opportunities.read` | @ghl-crm-structuralist |
| `opportunities.write` | @ghl-crm-structuralist |
| `calendars.read` | All agents |
| `calendars.write` | @ghl-automation-specialist |
| `conversations.read` | @ghl-email-strategist |
| `conversations.write` | @ghl-email-strategist |
| `workflows.read` | @ghl-automation-specialist |
| `workflows.write` | @ghl-automation-specialist |

6. Clique em **Create**
7. **Copie o token** (será mostrado apenas uma vez!)

---

## Passo 2: Adicionar Token ao Projeto

### Editar `.mcp.json`

Abra o arquivo `.mcp.json` na raiz do projeto e substitua o placeholder:

```json
{
    "mcpServers": {
        "context7": {
            "command": "cmd",
            "args": ["/c", "npx", "-y", "@upstash/context7-mcp"]
        },
        "gohighlevel": {
            "command": "cmd",
            "args": ["/c", "npx", "-y", "@drausal/gohighlevel-mcp"],
            "env": {
                "BEARER_TOKEN_BEARERAUTH": "pit_xxxxxxxxxxxxx",  ← SEU TOKEN AQUI
                "BEARER_TOKEN_BEARER": "pit_xxxxxxxxxxxxx"       ← SEU TOKEN AQUI
            }
        }
    }
}
```

---

## Passo 3: Reiniciar Claude Code

Após salvar o arquivo, reinicie o Claude Code para carregar o novo MCP:

1. Feche o Claude Code completamente
2. Abra novamente
3. O MCP será carregado automaticamente

---

## Passo 4: Testar Conexão

Execute no Claude Code:

```
Liste os contatos do GoHighLevel
```

Se configurado corretamente, você verá os tools MCP disponíveis.

---

## Troubleshooting

### Erro: "Invalid token"
- Verifique se o token foi copiado completamente
- Confirme que o token tem os scopes necessários

### Erro: "MCP not loading"
- Verifique se Node.js >= 20 está instalado
- Tente executar manualmente: `npx @drausal/gohighlevel-mcp`

### Erro: "Rate limit exceeded"
- Aguarde 10 segundos entre requisições
- Verifique se não há múltiplas instâncias rodando

---

## Tools Disponíveis (Após Conexão)

O MCP expõe 36+ ferramentas:

| Categoria | Quantidade |
|-----------|------------|
| Contacts | 8 tools |
| Conversations | 5 tools |
| Calendars | 5 tools |
| Opportunities | 5 tools |
| Pipelines | 3 tools |
| Custom Fields | 3 tools |
| Locations | 4 tools |
| Snapshots | 2 tools |
| Emails | 3 tools |

---

## Referências

- [GoHighLevel MCP Docs](https://marketplace.gohighlevel.com/docs/other/mcp/index.html)
- [Package: @drausal/gohighlevel-mcp](https://github.com/drausal/gohighlevel-mcp)
- [Como criar PIT](https://help.gohighlevel.com/support/solutions/articles/155000005741-how-to-use-the-highlevel-mcp-server)

---

*Setup Guide v1.0 - GHL Squad*
