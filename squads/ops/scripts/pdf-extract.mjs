#!/usr/bin/env node
/**
 * pdf-extract.mjs - Extract text from PDF using pdftotext
 *
 * Usage:
 *   node pdf-extract.mjs <pdf-file> [options]
 *
 * Options:
 *   --output, -o   Output file (default: stdout)
 *   --layout       Maintain original layout
 *   --pages        Page range (e.g., "1-5" or "1,3,5")
 *   --json         Output as JSON
 *
 * Examples:
 *   node pdf-extract.mjs document.pdf
 *   node pdf-extract.mjs report.pdf --layout -o output.txt
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, unlinkSync } from 'fs';
import { basename, dirname, join } from 'path';
import { tmpdir } from 'os';

// Load config
const CONFIG_PATH = join(dirname(new URL(import.meta.url).pathname.slice(1)), '../config/local-tools.json');
const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));

const PDFTOTEXT = config.tools.pdftotext.binary;

function parseArgs(args) {
  const options = {
    input: null,
    output: null,
    layout: false,
    pages: null,
    json: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    } else if (arg === '--layout') {
      options.layout = true;
    } else if (arg === '--pages') {
      options.pages = args[++i];
    } else if (arg === '--json') {
      options.json = true;
    } else if (!arg.startsWith('-')) {
      options.input = arg;
    }
  }

  return options;
}

function extractPdf(options) {
  if (!options.input) {
    console.error('Error: No input file specified');
    console.log('Usage: node pdf-extract.mjs <pdf-file> [options]');
    process.exit(1);
  }

  if (!existsSync(options.input)) {
    console.error(`Error: File not found: ${options.input}`);
    process.exit(1);
  }

  const tempOutput = join(tmpdir(), `pdf-${Date.now()}.txt`);

  const args = [];

  if (options.layout) {
    args.push('-layout');
  }

  if (options.pages) {
    const [first, last] = options.pages.split('-');
    if (first) args.push('-f', first);
    if (last) args.push('-l', last);
  }

  args.push(`"${options.input}"`, `"${tempOutput}"`);

  console.error(`Extracting text from ${basename(options.input)}...`);

  try {
    execSync(`${PDFTOTEXT} ${args.join(' ')}`, {
      stdio: 'pipe'
    });

    const text = readFileSync(tempOutput, 'utf-8').trim();

    // Cleanup
    unlinkSync(tempOutput);

    if (options.json) {
      const result = {
        input: options.input,
        text: text,
        pages: options.pages || 'all',
        tool: 'pdftotext',
        cost: 0
      };
      console.log(JSON.stringify(result, null, 2));
    } else if (options.output) {
      require('fs').writeFileSync(options.output, text);
      console.error(`Output saved to ${options.output}`);
    } else {
      console.log(text);
    }

  } catch (error) {
    console.error('PDF extraction failed:', error.message);
    process.exit(1);
  }
}

// Main
const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
pdf-extract.mjs - Extract text from PDF (LOCAL, FREE)

Usage:
  node pdf-extract.mjs <pdf-file> [options]

Options:
  --output, -o   Output file path
  --layout       Maintain original layout
  --pages        Page range (e.g., "1-5")
  --json         Output as JSON

Examples:
  node pdf-extract.mjs document.pdf
  node pdf-extract.mjs report.pdf --layout -o output.txt
  node pdf-extract.mjs book.pdf --pages 1-10 --json
`);
  process.exit(0);
}

extractPdf(parseArgs(args));
