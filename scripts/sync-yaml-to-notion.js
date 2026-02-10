#!/usr/bin/env node
/**
 * Sync YAML to Notion
 *
 * Synchronizes Service Order YAML files to Notion databases.
 * Requires Notion API key and database IDs in environment.
 *
 * Environment Variables:
 *   NOTION_API_KEY      - Notion integration token
 *   NOTION_OS_DB        - Service Orders database ID
 *   NOTION_AGENTS_DB    - Agents database ID (optional)
 *   NOTION_COMMANDS_DB  - Commands database ID (optional)
 *
 * Usage:
 *   node sync-yaml-to-notion.js              # Sync all OS
 *   node sync-yaml-to-notion.js --dry-run    # Show what would be synced
 *   node sync-yaml-to-notion.js --json       # Output as JSON
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const LOGS_DIR = path.join(ROOT_DIR, 'logs', 'service-orders');

// Check for Notion client (optional dependency)
let Client;
try {
  const notion = await import('@notionhq/client');
  Client = notion.Client;
} catch {
  Client = null;
}

/**
 * Load all OS documents
 * @returns {Promise<object[]>}
 */
async function loadAllOs() {
  const docs = [];

  if (!fs.existsSync(LOGS_DIR)) {
    return docs;
  }

  const files = await glob('**/*.yaml', {
    cwd: LOGS_DIR,
    ignore: ['_schema.yaml', '_template.yaml']
  });

  for (const file of files) {
    const filePath = path.join(LOGS_DIR, file);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const doc = yaml.load(content);
      if (doc && doc.os_id) {
        docs.push({ ...doc, _file: file });
      }
    } catch (err) {
      console.error(`Warning: Could not parse ${file}: ${err.message}`);
    }
  }

  return docs;
}

/**
 * Convert OS to Notion properties
 * @param {object} os
 * @returns {object}
 */
function osToNotionProperties(os) {
  const properties = {
    'OS ID': {
      title: [{ text: { content: os.os_id || 'Unknown' } }]
    },
    'Title': {
      rich_text: [{ text: { content: os.title || '' } }]
    },
    'Squad': {
      select: { name: os.squad || 'unknown' }
    },
    'Status': {
      select: { name: os.status || 'intake' }
    },
    'Priority': {
      select: { name: os.priority || 'medium' }
    },
    'Workflow': {
      rich_text: [{ text: { content: os.workflow || '' } }]
    },
    'Requester': {
      rich_text: [{ text: { content: os.requester || '' } }]
    }
  };

  // Optional fields
  if (os.created_at) {
    properties['Created'] = {
      date: { start: os.created_at }
    };
  }

  if (os.completed_at) {
    properties['Completed'] = {
      date: { start: os.completed_at }
    };
  }

  if (os.cost?.actual_eur) {
    properties['Cost (EUR)'] = {
      number: os.cost.actual_eur
    };
  }

  if (os.cost?.category) {
    properties['Cost Category'] = {
      select: { name: os.cost.category }
    };
  }

  if (os.project_name) {
    properties['Project'] = {
      rich_text: [{ text: { content: os.project_name } }]
    };
  }

  if (os.tags && os.tags.length > 0) {
    properties['Tags'] = {
      multi_select: os.tags.map(tag => ({ name: tag }))
    };
  }

  return properties;
}

/**
 * Find existing page in Notion by OS ID
 * @param {Client} notion
 * @param {string} databaseId
 * @param {string} osId
 * @returns {Promise<string | null>}
 */
async function findExistingPage(notion, databaseId, osId) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'OS ID',
        title: { equals: osId }
      }
    });

    return response.results.length > 0 ? response.results[0].id : null;
  } catch {
    return null;
  }
}

/**
 * Sync a single OS to Notion
 * @param {Client} notion
 * @param {string} databaseId
 * @param {object} os
 * @param {boolean} dryRun
 * @returns {Promise<{ action: string, osId: string, pageId?: string }>}
 */
async function syncOs(notion, databaseId, os, dryRun) {
  const properties = osToNotionProperties(os);
  const existingPageId = await findExistingPage(notion, databaseId, os.os_id);

  if (dryRun) {
    return {
      action: existingPageId ? 'update' : 'create',
      osId: os.os_id,
      pageId: existingPageId
    };
  }

  if (existingPageId) {
    // Update existing page
    await notion.pages.update({
      page_id: existingPageId,
      properties
    });

    return { action: 'updated', osId: os.os_id, pageId: existingPageId };
  } else {
    // Create new page
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties
    });

    return { action: 'created', osId: os.os_id, pageId: response.id };
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const jsonOutput = args.includes('--json');

  // Check environment
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_OS_DB;

  if (!apiKey || !databaseId) {
    if (!jsonOutput) {
      console.log('=== Notion Sync ===\n');
      console.log('Missing environment variables:');
      if (!apiKey) console.log('  - NOTION_API_KEY');
      if (!databaseId) console.log('  - NOTION_OS_DB');
      console.log('\nTo use this script:');
      console.log('1. Create a Notion integration at https://www.notion.so/my-integrations');
      console.log('2. Share your database with the integration');
      console.log('3. Set environment variables:');
      console.log('   export NOTION_API_KEY="secret_..."');
      console.log('   export NOTION_OS_DB="database-id-from-url"');
      console.log('\nFor now, running in preview mode...\n');
    }

    // Preview mode - show what would be synced
    const osList = await loadAllOs();

    if (jsonOutput) {
      console.log(JSON.stringify({
        mode: 'preview',
        configured: false,
        os_count: osList.length,
        os_list: osList.map(os => ({
          os_id: os.os_id,
          title: os.title,
          squad: os.squad,
          status: os.status
        }))
      }, null, 2));
    } else {
      console.log(`Found ${osList.length} OS files to sync:\n`);
      for (const os of osList) {
        console.log(`  ${os.os_id}: ${os.title || 'Untitled'} [${os.status}]`);
      }
    }

    return;
  }

  // Check for Notion client
  if (!Client) {
    console.error('Error: @notionhq/client not installed.');
    console.log('Run: npm install @notionhq/client');
    process.exit(1);
  }

  // Initialize Notion client
  const notion = new Client({ auth: apiKey });

  // Load OS files
  const osList = await loadAllOs();

  if (osList.length === 0) {
    if (!jsonOutput) {
      console.log('No OS files found to sync.');
    }
    return;
  }

  if (!jsonOutput) {
    console.log(`=== Notion Sync ${dryRun ? '(Dry Run)' : ''} ===\n`);
    console.log(`Found ${osList.length} OS files\n`);
  }

  // Sync each OS
  const results = [];

  for (const os of osList) {
    try {
      const result = await syncOs(notion, databaseId, os, dryRun);
      results.push(result);

      if (!jsonOutput) {
        const icon = result.action === 'created' || result.action === 'create' ? '+' : '~';
        console.log(`  [${icon}] ${result.osId}: ${result.action}`);
      }
    } catch (err) {
      results.push({ action: 'error', osId: os.os_id, error: err.message });

      if (!jsonOutput) {
        console.log(`  [X] ${os.os_id}: ${err.message}`);
      }
    }
  }

  // Output
  if (jsonOutput) {
    console.log(JSON.stringify({
      mode: dryRun ? 'dry-run' : 'sync',
      total: osList.length,
      created: results.filter(r => r.action === 'created' || r.action === 'create').length,
      updated: results.filter(r => r.action === 'updated' || r.action === 'update').length,
      errors: results.filter(r => r.action === 'error').length,
      results
    }, null, 2));
  } else {
    console.log('\n--- Summary ---');
    console.log(`  Total:   ${osList.length}`);
    console.log(`  Created: ${results.filter(r => r.action === 'created' || r.action === 'create').length}`);
    console.log(`  Updated: ${results.filter(r => r.action === 'updated' || r.action === 'update').length}`);
    console.log(`  Errors:  ${results.filter(r => r.action === 'error').length}`);
  }
}

main();
