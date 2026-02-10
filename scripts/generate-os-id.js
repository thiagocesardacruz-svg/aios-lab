#!/usr/bin/env node
/**
 * Generate OS ID
 *
 * Generates unique Service Order IDs in format: OS-YYYY-NNNN
 * Scans existing logs to find the next available number.
 *
 * Usage:
 *   node generate-os-id.js              # Generate next ID for current year
 *   node generate-os-id.js --year 2026  # Generate for specific year
 *   node generate-os-id.js --json       # Output as JSON
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

/**
 * Parse OS ID to extract year and number
 * @param {string} osId - OS ID in format OS-YYYY-NNNN
 * @returns {{ year: number, num: number } | null}
 */
function parseOsId(osId) {
  const match = osId.match(/^OS-(\d{4})-(\d{4})$/);
  if (!match) return null;
  return {
    year: parseInt(match[1], 10),
    num: parseInt(match[2], 10)
  };
}

/**
 * Format OS ID from components
 * @param {number} year
 * @param {number} num
 * @returns {string}
 */
function formatOsId(year, num) {
  return `OS-${year}-${String(num).padStart(4, '0')}`;
}

/**
 * Get all existing OS IDs from logs directory
 * @returns {Promise<string[]>}
 */
async function getExistingOsIds() {
  const ids = [];

  // Check if logs directory exists
  if (!fs.existsSync(LOGS_DIR)) {
    return ids;
  }

  // Find all YAML files in logs directory
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
        ids.push(doc.os_id);
      }
    } catch (err) {
      // Skip files that can't be parsed
      console.error(`Warning: Could not parse ${file}: ${err.message}`);
    }
  }

  return ids;
}

/**
 * Generate next available OS ID for a given year
 * @param {number} year
 * @param {string[]} existingIds
 * @returns {string}
 */
function generateNextId(year, existingIds) {
  // Filter IDs for the specified year and extract numbers
  const numbersForYear = existingIds
    .map(parseOsId)
    .filter(parsed => parsed && parsed.year === year)
    .map(parsed => parsed.num);

  // Find max number or start at 0
  const maxNum = numbersForYear.length > 0
    ? Math.max(...numbersForYear)
    : 0;

  return formatOsId(year, maxNum + 1);
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const jsonOutput = args.includes('--json');

  // Parse year argument
  let year = new Date().getFullYear();
  const yearIndex = args.indexOf('--year');
  if (yearIndex !== -1 && args[yearIndex + 1]) {
    year = parseInt(args[yearIndex + 1], 10);
    if (isNaN(year) || year < 2020 || year > 2100) {
      console.error('Error: Invalid year. Must be between 2020 and 2100.');
      process.exit(1);
    }
  }

  try {
    const existingIds = await getExistingOsIds();
    const nextId = generateNextId(year, existingIds);

    if (jsonOutput) {
      console.log(JSON.stringify({
        os_id: nextId,
        year,
        existing_count: existingIds.filter(id => {
          const parsed = parseOsId(id);
          return parsed && parsed.year === year;
        }).length
      }, null, 2));
    } else {
      console.log(nextId);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
