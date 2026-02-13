#!/usr/bin/env node
/**
 * n8n Status Report - Shows all workflows, credentials, and execution stats
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const mcpPath = resolve(import.meta.dirname, '../../../.mcp.json');
const cfg = JSON.parse(readFileSync(mcpPath, 'utf8'));
const apiKey = cfg.mcpServers['n8n-mcp'].env.N8N_API_KEY;
const baseUrl = cfg.mcpServers['n8n-mcp'].env.N8N_API_URL;

const h = { 'X-N8N-API-KEY': apiKey };

async function fetchJSON(path) {
  const res = await fetch(`${baseUrl}/api/v1${path}`, { headers: h });
  const data = await res.json();
  return Array.isArray(data) ? data : (data.data || []);
}

async function main() {
  const [workflows, creds, execs] = await Promise.all([
    fetchJSON('/workflows'),
    fetchJSON('/credentials'),
    fetchJSON('/executions?limit=100')
  ]);

  // === WORKFLOWS ===
  console.log('\n╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║                        n8n STATUS REPORT                            ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝');
  console.log(`\nInstance: ${baseUrl}`);
  console.log(`Date: ${new Date().toISOString().split('T')[0]}\n`);

  // Group workflows by category (based on naming)
  const categories = {
    'GHL CRM': [],
    'Functional Machines': [],
    'Base Marketing/Sales': [],
    'Other': []
  };

  workflows.forEach(w => {
    const name = w.name;
    if (name.includes('GHL') || name.includes('→ GHL') || name.includes('Guest Lifecycle')) {
      categories['GHL CRM'].push(w);
    } else if (['SEO Content', 'Reputation', 'Competitor', 'Email Sequence', 'Ad Copy', 'Feedback', 'Meeting Notes'].some(k => name.includes(k))) {
      categories['Functional Machines'].push(w);
    } else if (['Lead Qualifier', 'Content Repurposer', 'Social Media', 'Blog Post', 'Review Response'].some(k => name.includes(k))) {
      categories['Base Marketing/Sales'].push(w);
    } else {
      categories['Other'].push(w);
    }
  });

  console.log('── WORKFLOWS (' + workflows.length + ' total) ──────────────────────────────────');

  for (const [cat, wfs] of Object.entries(categories)) {
    if (wfs.length === 0) continue;
    console.log(`\n  📁 ${cat} (${wfs.length})`);
    wfs.forEach(w => {
      const status = w.active ? '🟢 active' : '🔴 inactive';
      const nodes = w.nodes ? w.nodes.length : '?';
      console.log(`     ${status}  ${w.name}`);
      console.log(`              ID: ${w.id} | Nodes: ${nodes}`);
    });
  }

  // === CREDENTIALS ===
  console.log('\n── CREDENTIALS (' + creds.length + ') ──────────────────────────────────────');
  creds.forEach(c => {
    console.log(`  🔑 ${c.name} (${c.type}) [ID: ${c.id}]`);
  });

  // === EXECUTIONS ===
  console.log('\n── EXECUTION STATS (last ' + execs.length + ') ─────────────────────────────');

  const byWf = {};
  execs.forEach(e => {
    const name = e.workflowData?.name || e.workflowId;
    if (!byWf[name]) byWf[name] = { success: 0, error: 0, running: 0, total: 0, lastRun: null };
    byWf[name].total++;
    if (e.status === 'success') byWf[name].success++;
    else if (e.status === 'error') byWf[name].error++;
    else if (e.status === 'running') byWf[name].running++;
    if (!byWf[name].lastRun || e.startedAt > byWf[name].lastRun) {
      byWf[name].lastRun = e.startedAt;
    }
  });

  for (const [name, stats] of Object.entries(byWf)) {
    const rate = stats.total > 0 ? Math.round(stats.success / stats.total * 100) : 0;
    const lastRun = stats.lastRun ? new Date(stats.lastRun).toLocaleString('pt-BR') : 'N/A';
    console.log(`  ${name}`);
    console.log(`     ✅ ${stats.success} success | ❌ ${stats.error} error | Total: ${stats.total} | Rate: ${rate}% | Last: ${lastRun}`);
  }

  // === SUMMARY ===
  const active = workflows.filter(w => w.active).length;
  const inactive = workflows.length - active;
  const totalSuccess = execs.filter(e => e.status === 'success').length;
  const totalError = execs.filter(e => e.status === 'error').length;
  const overallRate = execs.length > 0 ? Math.round(totalSuccess / execs.length * 100) : 0;

  console.log('\n── SUMMARY ──────────────────────────────────────────────────────────');
  console.log(`  Workflows:    ${workflows.length} total (${active} active, ${inactive} inactive)`);
  console.log(`  Credentials:  ${creds.length}`);
  console.log(`  Executions:   ${execs.length} recent (${totalSuccess} success, ${totalError} error)`);
  console.log(`  Success Rate: ${overallRate}%`);
  console.log('');
}

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
