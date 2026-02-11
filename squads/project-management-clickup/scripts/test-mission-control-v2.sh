#!/bin/bash

# Mission Control Notification Flow - Test Script
# Workflow ID: 7Cs4aLiTfQf5BsFZ
# Data: 2026-02-07

set -e

CLICKUP_API_KEY="pk_42953089_4A273OG0YDRHNCSA4OVQMU6RHI672O25"
CLICKUP_LIST_ID="901325202828"
WEBHOOK_URL="https://n8n.nataliatanaka.com.br/webhook/mission-control/notify"

echo "🧪 Mission Control - Test Notification Flow v2"
echo "============================================="
echo ""

# Passo 1: Criar task de teste no ClickUp
echo "📝 Passo 1: Criando task de teste no ClickUp..."
TASK_RESPONSE=$(curl -s -X POST "https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task" \
  -H "Authorization: ${CLICKUP_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "🧪 TEST v2 - Workflow Recriado",
    "description": "Testando novo workflow Mission Control - Notification Flow (7Cs4aLiTfQf5BsFZ)\n\nFluxo esperado:\n1. Task criada no ClickUp\n2. Webhook dispara n8n\n3. n8n busca detalhes da task\n4. Notificação enviada ao Telegram\n5. Webhook response com status\n\nWorkflow ID: 7Cs4aLiTfQf5BsFZ",
    "status": "inbox",
    "priority": 3
  }')

TASK_ID=$(echo "$TASK_RESPONSE" | jq -r '.id')
TASK_NAME=$(echo "$TASK_RESPONSE" | jq -r '.name')
TASK_URL=$(echo "$TASK_RESPONSE" | jq -r '.url')

if [ "$TASK_ID" == "null" ] || [ -z "$TASK_ID" ]; then
  echo "❌ Erro ao criar task no ClickUp"
  echo "$TASK_RESPONSE" | jq '.'
  exit 1
fi

echo "✅ Task criada com sucesso!"
echo "   ID: $TASK_ID"
echo "   Nome: $TASK_NAME"
echo "   URL: $TASK_URL"
echo ""

# Passo 2: Aguardar 2 segundos
echo "⏱️  Passo 2: Aguardando 2 segundos..."
sleep 2
echo ""

# Passo 3: Disparar webhook do n8n
echo "🔔 Passo 3: Disparando webhook do n8n..."
WEBHOOK_RESPONSE=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "{\"task_id\": \"$TASK_ID\"}" \
  -w "\nHTTP_CODE: %{http_code}")

HTTP_CODE=$(echo "$WEBHOOK_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2 | tr -d ' ')
WEBHOOK_BODY=$(echo "$WEBHOOK_RESPONSE" | grep -v "HTTP_CODE")

echo "   HTTP Status: $HTTP_CODE"
echo "   Response: $WEBHOOK_BODY"
echo ""

if [ "$HTTP_CODE" == "200" ]; then
  echo "✅ Webhook disparado com sucesso!"
else
  echo "⚠️  Webhook retornou status $HTTP_CODE"
fi

echo ""
echo "============================================="
echo "🎯 Teste Completo!"
echo ""
echo "📋 Resumo:"
echo "   Task ID: $TASK_ID"
echo "   Webhook: $HTTP_CODE"
echo ""
echo "📱 Verifique se a notificação chegou no Telegram (chat 726437877)"
echo ""
echo "📊 Para ver logs do n8n:"
echo "   ssh -i ~/.ssh/hostinger_vps_nopass root@103.199.186.34 \\"
echo "     'docker logs n8n-compose-n8n-1 --tail 50'"
echo ""
