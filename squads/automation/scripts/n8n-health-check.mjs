#!/usr/bin/env node
/**
 * n8n Health Check
 *
 * Verifies connection to n8n instance and reports status.
 *
 * Usage:
 *   node n8n-health-check.mjs
 *   node n8n-health-check.mjs --verbose
 *
 * @squad automation
 * @agent n8n-builder (Forge)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load config
function loadConfig() {
  // Try .env file first
  const envPath = path.join(__dirname, '..', 'config', '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      if (line.includes('=') && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  }

  // Load instance config
  const configPath = path.join(__dirname, '..', 'config', 'n8n-instance.json');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }

  return null;
}

async function healthCheck(verbose = false) {
  console.log('\n🔍 n8n Health Check');
  console.log('═'.repeat(50));

  const config = loadConfig();

  // Check config
  console.log('\n📋 Configuration:');
  if (config) {
    console.log(`   Instance: ${config.instance.name}`);
    console.log(`   Provider: ${config.instance.provider}`);
    console.log(`   URL: ${config.instance.url}`);
  } else {
    console.log('   ⚠️  No config file found');
  }

  // Check API key
  const apiKey = process.env.N8N_API_KEY;
  console.log(`   API Key: ${apiKey ? '✅ Set (' + apiKey.substring(0, 20) + '...)' : '❌ Not set'}`);

  if (!apiKey) {
    console.error('\n❌ N8N_API_KEY not found. Set it in config/.env');
    return { success: false, error: 'No API key' };
  }

  const apiBase = process.env.N8N_API_BASE || config?.instance?.api_base;
  if (!apiBase) {
    console.error('\n❌ N8N_API_BASE not found');
    return { success: false, error: 'No API base URL' };
  }

  // Test API connection
  console.log('\n🌐 Testing API Connection...');

  try {
    const response = await fetch(`${apiBase}/workflows?limit=1`, {
      headers: {
        'X-N8N-API-KEY': apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('   ✅ API Connection: SUCCESS');

    // Get workflow count
    const countResponse = await fetch(`${apiBase}/workflows`, {
      headers: {
        'X-N8N-API-KEY': apiKey,
        'Accept': 'application/json'
      }
    });
    const allData = await countResponse.json();
    const workflows = allData.data || [];

    console.log(`   📊 Total Workflows: ${workflows.length}`);
    console.log(`   🟢 Active: ${workflows.filter(w => w.active).length}`);
    console.log(`   ⚪ Inactive: ${workflows.filter(w => !w.active).length}`);

    if (verbose && workflows.length > 0) {
      console.log('\n   Recent workflows:');
      for (const wf of workflows.slice(0, 5)) {
        console.log(`     • ${wf.name} (${wf.active ? '🟢' : '⚪'})`);
      }
    }

    // Test credentials endpoint
    console.log('\n🔑 Testing Credentials API...');
    try {
      const credResponse = await fetch(`${apiBase}/credentials`, {
        headers: {
          'X-N8N-API-KEY': apiKey,
          'Accept': 'application/json'
        }
      });

      if (credResponse.ok) {
        const credData = await credResponse.json();
        console.log(`   ✅ Credentials API: SUCCESS`);
        console.log(`   🔐 Configured credentials: ${credData.data?.length || 0}`);
      } else {
        console.log('   ⚠️  Credentials API: Limited access');
      }
    } catch (e) {
      console.log('   ⚠️  Credentials API: Not accessible');
    }

    console.log('\n═'.repeat(50));
    console.log('✅ HEALTH CHECK PASSED');
    console.log('   n8n instance is operational');
    console.log('═'.repeat(50));

    return {
      success: true,
      instance: config?.instance?.name,
      workflows: workflows.length,
      active: workflows.filter(w => w.active).length
    };

  } catch (error) {
    console.error(`\n❌ API Connection Failed: ${error.message}`);
    console.log('\n═'.repeat(50));
    console.log('❌ HEALTH CHECK FAILED');
    console.log('═'.repeat(50));

    return { success: false, error: error.message };
  }
}

// CLI
const args = process.argv.slice(2);

if (args.includes('--help')) {
  console.log(`
n8n Health Check - Verify n8n instance connectivity

Usage:
  node n8n-health-check.mjs [options]

Options:
  --verbose    Show detailed output including workflow list
  --json       Output as JSON
  --help       Show this help

Environment:
  N8N_API_KEY  API key for n8n instance
  N8N_API_BASE Base URL for n8n API (e.g., https://instance.com/api/v1)
`);
  process.exit(0);
}

const verbose = args.includes('--verbose');
const jsonOutput = args.includes('--json');

healthCheck(verbose).then(result => {
  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  }
  process.exit(result.success ? 0 : 1);
});
