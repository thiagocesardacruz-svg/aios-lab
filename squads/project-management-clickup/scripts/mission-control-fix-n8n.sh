#!/bin/bash

# Mission Control - Fix n8n Database
# Remove workflows corrompidos e recria Mission Control com banco limpo

set -e

echo "🔧 Mission Control - Fix n8n Database"
echo "====================================="
echo ""

# Configurações
SSH_KEY="~/.ssh/hostinger_vps_nopass"
VPS_HOST="root@103.199.186.34"
N8N_CONTAINER="n8n-compose-n8n-1"
N8N_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzZjczMWFiZi0wN2QyLTRhMjItOTZlYi1jMzg1ZDAwMWZmMjgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY5OTcwOTQ2fQ.PKArd-d6Ce2EOSPrk0HOjMz604gm7IVpdEiuY_8-bGk"
N8N_URL="https://n8n.nataliatanaka.com.br"
TELEGRAM_TOKEN="7392752717:AAGnyxfHkrT68KtbVjfNEvVIMRsfjh56DAQ"

echo "⚠️  AVISO: Este script vai resetar o banco de dados do n8n!"
echo "Todos os workflows existentes serão removidos."
echo ""
read -p "Deseja continuar? (digite 'SIM' para confirmar): " CONFIRM

if [ "$CONFIRM" != "SIM" ]; then
  echo "❌ Operação cancelada."
  exit 0
fi

echo ""
echo "📦 Passo 1: Backup do banco de dados..."
BACKUP_NAME="backup-db-$(date +%Y%m%d-%H%M%S).sqlite"
ssh -i $SSH_KEY $VPS_HOST \
  "docker exec $N8N_CONTAINER cp /home/node/.n8n/database.sqlite /tmp/$BACKUP_NAME && \
   docker cp $N8N_CONTAINER:/tmp/$BACKUP_NAME /root/"

echo "✅ Backup salvo: /root/$BACKUP_NAME"
echo ""

echo "🗑️  Passo 2: Resetando banco de dados..."
ssh -i $SSH_KEY $VPS_HOST \
  "docker stop $N8N_CONTAINER && \
   docker exec $N8N_CONTAINER rm -f /home/node/.n8n/database.sqlite && \
   docker start $N8N_CONTAINER"

echo "✅ Banco resetado"
echo ""

echo "⏱️  Passo 3: Aguardando n8n inicializar (30 segundos)..."
sleep 30
echo ""

echo "🔑 Passo 4: Criando credencial Telegram..."
CREDENTIAL_RESPONSE=$(curl -s -X POST "$N8N_URL/api/v1/credentials" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Telegram Bot Rafael\",
    \"type\": \"telegramApi\",
    \"data\": {
      \"accessToken\": \"$TELEGRAM_TOKEN\"
    }
  }")

CREDENTIAL_ID=$(echo "$CREDENTIAL_RESPONSE" | jq -r '.id')

if [ "$CREDENTIAL_ID" == "null" ] || [ -z "$CREDENTIAL_ID" ]; then
  echo "❌ Erro ao criar credencial Telegram"
  echo "$CREDENTIAL_RESPONSE" | jq '.'
  exit 1
fi

echo "✅ Credencial criada: $CREDENTIAL_ID"
echo ""

echo "📋 Passo 5: Preparando workflow Mission Control..."

# Criar workflow JSON com credencial correta
cat > /tmp/mission-control-final.json <<EOF
{
  "name": "Mission Control - Notification Flow",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "mission-control/notify",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "webhook-node-1",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1.1,
      "position": [240, 300],
      "webhookId": "mission-control-notify",
      "disabled": false
    },
    {
      "parameters": {
        "url": "=https://api.clickup.com/api/v2/task/{{ \$json.task_id }}?custom_fields=true",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "pk_42953089_4A273OG0YDRHNCSA4OVQMU6RHI672O25"
            }
          ]
        },
        "options": {}
      },
      "id": "http-request-1",
      "name": "Get Task",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.2,
      "position": [460, 300],
      "disabled": false
    },
    {
      "parameters": {
        "jsCode": "const task = items[0].json;\\n\\nreturn [\\n  {\\n    json: {\\n      taskId: task.id,\\n      taskName: task.name,\\n      taskUrl: task.url,\\n      status: task.status?.status || 'unknown',\\n      list: task.list?.name || 'Unknown List',\\n      assignees: task.assignees?.map(a => a.username).join(', ') || 'Unassigned',\\n      priority: task.priority?.priority || 'No priority',\\n      dueDate: task.due_date || 'No due date'\\n    }\\n  }\\n];"
      },
      "id": "code-node-1",
      "name": "Extract Fields",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [680, 300],
      "disabled": false
    },
    {
      "parameters": {
        "chatId": "726437877",
        "text": "=🔔 Nova Task no ClickUp\\n\\n📋 *{{ \$json.taskName }}*\\n\\n📂 Lista: {{ \$json.list }}\\n📊 Status: {{ \$json.status }}\\n👤 Assignee: {{ \$json.assignees }}\\n⏰ Priority: {{ \$json.priority }}\\n📅 Due: {{ \$json.dueDate }}\\n\\n🔗 [Abrir Task]({{ \$json.taskUrl }})",
        "additionalFields": {
          "parseMode": "Markdown"
        }
      },
      "id": "telegram-node-1",
      "name": "Telegram",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1.2,
      "position": [900, 300],
      "credentials": {
        "telegramApi": {
          "id": "$CREDENTIAL_ID",
          "name": "Telegram Bot Rafael"
        }
      },
      "disabled": false
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ { \\"success\\": true, \\"message\\": \\"Notification sent\\", \\"taskId\\": \$json.taskId } }}"
      },
      "id": "webhook-response-1",
      "name": "Webhook Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [1120, 300],
      "disabled": false
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{"node": "Get Task", "type": "main", "index": 0}]]
    },
    "Get Task": {
      "main": [[{"node": "Extract Fields", "type": "main", "index": 0}]]
    },
    "Extract Fields": {
      "main": [[{"node": "Telegram", "type": "main", "index": 0}]]
    },
    "Telegram": {
      "main": [[{"node": "Webhook Response", "type": "main", "index": 0}]]
    }
  },
  "settings": {
    "executionOrder": "v1"
  }
}
EOF

echo "📤 Passo 6: Importando workflow para n8n..."
scp -i $SSH_KEY /tmp/mission-control-final.json $VPS_HOST:/tmp/
ssh -i $SSH_KEY $VPS_HOST \
  "docker cp /tmp/mission-control-final.json $N8N_CONTAINER:/tmp/ && \
   docker exec $N8N_CONTAINER n8n import:workflow --input=/tmp/mission-control-final.json" 2>&1 | grep -v "INFO.*Skipping" | tail -5

echo ""
echo "🔍 Passo 7: Localizando workflow importado..."
WORKFLOW_LINE=$(ssh -i $SSH_KEY $VPS_HOST "docker exec $N8N_CONTAINER n8n list:workflow" 2>&1 | grep "Mission Control - Notification Flow")
WORKFLOW_ID=$(echo "$WORKFLOW_LINE" | cut -d'|' -f1)

echo "✅ Workflow encontrado: $WORKFLOW_ID"
echo ""

echo "🔄 Passo 8: Ativando workflow..."
ACTIVATE_RESPONSE=$(curl -s -X POST "$N8N_URL/api/v1/workflows/$WORKFLOW_ID/activate" \
  -H "X-N8N-API-KEY: $N8N_API_KEY")

WORKFLOW_ACTIVE=$(echo "$ACTIVATE_RESPONSE" | jq -r '.active')

if [ "$WORKFLOW_ACTIVE" == "true" ]; then
  echo "✅ Workflow ativado com sucesso!"
else
  echo "⚠️  Erro ao ativar workflow:"
  echo "$ACTIVATE_RESPONSE" | jq '.'
  exit 1
fi

echo ""
echo "==========================================="
echo "🎉 Mission Control - n8n Restaurado!"
echo "==========================================="
echo ""
echo "📋 Resumo:"
echo "   Workflow ID: $WORKFLOW_ID"
echo "   Credencial: $CREDENTIAL_ID"
echo "   Webhook: $N8N_URL/webhook/mission-control/notify"
echo ""
echo "🧪 Teste agora:"
echo "   ./.aios-core/squads/project-management-clickup/scripts/test-mission-control-v2.sh"
echo ""
echo "📱 Verifique notificações no Telegram (chat 726437877)"
echo ""
