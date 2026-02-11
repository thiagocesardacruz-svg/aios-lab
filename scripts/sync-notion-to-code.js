#!/usr/bin/env node
/**
 * Sync Notion to Code
 *
 * Synchronizes Agents and Commands from Notion databases to code registry files.
 * Notion is the SOURCE OF TRUTH - this script generates derived CSV files.
 *
 * Environment Variables:
 *   NOTION_API_KEY      - Notion integration token
 *   NOTION_AGENTS_DB    - Agents database ID
 *   NOTION_COMMANDS_DB  - Commands database ID
 *
 * Generated Files:
 *   squads/_registry/agents-directory.csv
 *   squads/_registry/command-library.csv
 *
 * Usage:
 *   node sync-notion-to-code.js              # Sync all
 *   node sync-notion-to-code.js --dry-run    # Preview changes
 *   node sync-notion-to-code.js --agents     # Sync agents only
 *   node sync-notion-to-code.js --commands   # Sync commands only
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const REGISTRY_DIR = path.join(ROOT_DIR, 'squads', '_registry');

// Check for Notion client
let Client;
try {
  const notion = await import('@notionhq/client');
  Client = notion.Client;
} catch {
  Client = null;
}

/**
 * Extract text from Notion rich_text or title
 */
function extractText(property) {
  if (!property) return '';

  if (property.title) {
    return property.title.map(t => t.plain_text).join('');
  }
  if (property.rich_text) {
    return property.rich_text.map(t => t.plain_text).join('');
  }
  if (property.select) {
    return property.select?.name || '';
  }
  if (property.multi_select) {
    return property.multi_select.map(s => s.name).join(', ');
  }
  if (property.relation) {
    return property.relation.map(r => r.id).join(', ');
  }
  if (property.checkbox !== undefined) {
    return property.checkbox ? 'true' : 'false';
  }
  if (property.number !== undefined) {
    return property.number?.toString() || '';
  }

  return '';
}

/**
 * Fetch all pages from a Notion database
 */
async function fetchAllPages(notion, databaseId) {
  const pages = [];
  let cursor = undefined;

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100
    });

    pages.push(...response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return pages;
}

/**
 * Convert Notion agents to CSV format
 * Format: Agente,Chamada,Squad,Tipo,O que faz
 */
function agentsToCSV(pages) {
  const headers = 'Agente,Chamada,Squad,Tipo,O que faz';
  const rows = pages.map(page => {
    const props = page.properties;

    // Extract properties - adapt to your Notion database column names
    const agentId = extractText(props['Agent ID'] || props['Name'] || props['Title']);
    const squad = extractText(props['Squad']);
    const type = extractText(props['Type'] || props['Tipo']);
    const role = extractText(props['Role'] || props['Description'] || props['O que faz']);

    // Generate call syntax
    const call = `@${agentId}`;

    // Escape CSV fields
    const escapeCSV = (str) => {
      if (!str) return '';
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    return [
      escapeCSV(agentId),
      escapeCSV(call),
      escapeCSV(squad),
      escapeCSV(type),
      escapeCSV(role)
    ].join(',');
  });

  return [headers, ...rows].join('\n');
}

/**
 * Convert Notion commands to CSV format
 * Format: Objetivo,Command,Squad,Tipo,Responsável,Cross-Squad
 */
function commandsToCSV(pages) {
  const headers = 'Objetivo,Command,Squad,Tipo,Responsável,Cross-Squad';
  const rows = pages.map(page => {
    const props = page.properties;

    // Extract properties - adapt to your Notion database column names
    const objetivo = extractText(props['Objetivo'] || props['Description'] || props['Name']);
    const command = extractText(props['Command'] || props['Title']);
    const squad = extractText(props['Squad']);
    const tipo = extractText(props['Tipo'] || props['Type'] || props['Visibility']);
    const responsavel = extractText(props['Responsável'] || props['Responsible'] || props['Owner']);
    const crossSquad = extractText(props['Cross-Squad'] || props['Cross Squad'] || props['Dependencies']);

    // Escape CSV fields
    const escapeCSV = (str) => {
      if (!str) return '';
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    return [
      escapeCSV(objetivo),
      escapeCSV(command),
      escapeCSV(squad),
      escapeCSV(tipo),
      escapeCSV(responsavel),
      escapeCSV(crossSquad)
    ].join(',');
  });

  return [headers, ...rows].join('\n');
}

/**
 * Write file with backup
 */
function writeWithBackup(filePath, content, dryRun) {
  if (dryRun) {
    console.log(`[DRY-RUN] Would write to: ${filePath}`);
    console.log(`  Lines: ${content.split('\n').length}`);
    return;
  }

  // Create backup if file exists
  if (fs.existsSync(filePath)) {
    const backupPath = `${filePath}.backup`;
    fs.copyFileSync(filePath, backupPath);
  }

  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const agentsOnly = args.includes('--agents');
  const commandsOnly = args.includes('--commands');
  const syncBoth = !agentsOnly && !commandsOnly;

  console.log('=== Notion → Code Sync ===\n');

  // Check environment
  const apiKey = process.env.NOTION_API_KEY;
  const agentsDbId = process.env.NOTION_AGENTS_DB;
  const commandsDbId = process.env.NOTION_COMMANDS_DB;

  if (!apiKey) {
    console.log('Missing NOTION_API_KEY environment variable.\n');
    console.log('Setup:');
    console.log('1. Create a Notion integration at https://www.notion.so/my-integrations');
    console.log('2. Share your databases with the integration');
    console.log('3. Set environment variables:');
    console.log('   export NOTION_API_KEY="secret_..."');
    console.log('   export NOTION_AGENTS_DB="database-id-from-url"');
    console.log('   export NOTION_COMMANDS_DB="database-id-from-url"');
    console.log('\nDatabase IDs are in the Notion URL after the workspace name and before the ?v=');
    process.exit(1);
  }

  if (!Client) {
    console.error('Error: @notionhq/client not installed.');
    console.log('Run: npm install @notionhq/client');
    process.exit(1);
  }

  const notion = new Client({ auth: apiKey });

  let agentsCount = 0;
  let commandsCount = 0;

  // Sync Agents
  if ((syncBoth || agentsOnly) && agentsDbId) {
    console.log('Fetching agents from Notion...');
    try {
      const pages = await fetchAllPages(notion, agentsDbId);
      agentsCount = pages.length;
      console.log(`  Found ${agentsCount} agents`);

      const csv = agentsToCSV(pages);
      const outputPath = path.join(REGISTRY_DIR, 'agents-directory.csv');
      writeWithBackup(outputPath, csv, dryRun);

      if (!dryRun) {
        console.log(`  Written to: squads/_registry/agents-directory.csv`);
      }
    } catch (err) {
      console.error(`  Error: ${err.message}`);
    }
  } else if (syncBoth || agentsOnly) {
    console.log('Skipping agents: NOTION_AGENTS_DB not set');
  }

  // Sync Commands
  if ((syncBoth || commandsOnly) && commandsDbId) {
    console.log('\nFetching commands from Notion...');
    try {
      const pages = await fetchAllPages(notion, commandsDbId);
      commandsCount = pages.length;
      console.log(`  Found ${commandsCount} commands`);

      const csv = commandsToCSV(pages);
      const outputPath = path.join(REGISTRY_DIR, 'command-library.csv');
      writeWithBackup(outputPath, csv, dryRun);

      if (!dryRun) {
        console.log(`  Written to: squads/_registry/command-library.csv`);
      }
    } catch (err) {
      console.error(`  Error: ${err.message}`);
    }
  } else if (syncBoth || commandsOnly) {
    console.log('\nSkipping commands: NOTION_COMMANDS_DB not set');
  }

  // Summary
  console.log('\n--- Summary ---');
  console.log(`  Mode: ${dryRun ? 'Dry Run' : 'Sync'}`);
  console.log(`  Agents: ${agentsCount}`);
  console.log(`  Commands: ${commandsCount}`);

  if (!dryRun) {
    console.log('\nFiles updated in squads/_registry/');
    console.log('Backups created with .backup extension');
  }
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
