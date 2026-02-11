/**
 * Verificar execuções recentes no N8N
 */

const https = require('https');
require('dotenv').config({ path: '/Users/rafaelcosta/Downloads/aios-core-meta-gpt/.env' });

const N8N_API_TOKEN = process.env.N8N_API_TOKEN;
const N8N_BASE_URL = 'n8n.nataliatanaka.com.br';

function n8nRequest(method, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: N8N_BASE_URL,
      port: 443,
      path: `/api/v1${path}`,
      method: method,
      headers: {
        'X-N8N-API-KEY': N8N_API_TOKEN,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed);
        } catch (e) {
          reject({ status: res.statusCode, error: body });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('🔍 Verificando execuções recentes no N8N...\n');

  try {
    const result = await n8nRequest('GET', '/executions?limit=10');
    const executions = result.data || [];

    if (executions.length === 0) {
      console.log('📭 Nenhuma execução encontrada.');
      return;
    }

    console.log(`📊 Últimas ${executions.length} execuções:\n`);

    executions.forEach((exec, i) => {
      const status = exec.finished ? (exec.stoppedAt ? '✅' : '⏳') : '🔄';
      const date = new Date(exec.startedAt).toLocaleString('pt-BR');

      console.log(`${i + 1}. ${status} Workflow: ${exec.workflowData?.name || exec.workflowId}`);
      console.log(`   ID: ${exec.id}`);
      console.log(`   Início: ${date}`);
      console.log(`   Status: ${exec.finished ? 'Finalizado' : 'Em execução'}`);
      if (exec.data?.resultData?.error) {
        console.log(`   ❌ Erro: ${exec.data.resultData.error.message}`);
      }
      console.log('');
    });

  } catch (error) {
    console.log(`❌ Erro: ${JSON.stringify(error)}`);
  }
}

main().catch(console.error);
