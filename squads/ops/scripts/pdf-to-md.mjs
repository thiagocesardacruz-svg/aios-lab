#!/usr/bin/env node
/**
 * pdf-to-md.mjs - Convert PDF to Markdown using Pandoc
 *
 * Usage:
 *   node pdf-to-md.mjs <pdf-file> [options]
 *
 * Options:
 *   --output, -o   Output file (default: <input>.md)
 *   --extract-media   Extract images to folder
 *   --toc          Include table of contents
 *   --json         Output metadata as JSON
 *
 * Examples:
 *   node pdf-to-md.mjs document.pdf
 *   node pdf-to-md.mjs book.pdf -o book.md --extract-media
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, mkdirSync } from 'fs';
import { basename, dirname, join, extname } from 'path';

// Load config
const CONFIG_PATH = join(dirname(new URL(import.meta.url).pathname.slice(1)), '../config/local-tools.json');
const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));

const PANDOC = config.tools.pandoc?.binary || 'C:\\Users\\thiag\\AppData\\Local\\Pandoc\\pandoc.exe';

function parseArgs(args) {
  const options = {
    input: null,
    output: null,
    extractMedia: false,
    toc: false,
    json: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    } else if (arg === '--extract-media') {
      options.extractMedia = true;
    } else if (arg === '--toc') {
      options.toc = true;
    } else if (arg === '--json') {
      options.json = true;
    } else if (!arg.startsWith('-')) {
      options.input = arg;
    }
  }

  return options;
}

function convertPdfToMd(options) {
  if (!options.input) {
    console.error('Error: No input file specified');
    console.log('Usage: node pdf-to-md.mjs <pdf-file> [options]');
    process.exit(1);
  }

  if (!existsSync(options.input)) {
    console.error(`Error: File not found: ${options.input}`);
    process.exit(1);
  }

  const inputBase = basename(options.input, extname(options.input));
  const outputFile = options.output || `${inputBase}.md`;
  const mediaDir = `${inputBase}_media`;

  const args = [
    `"${options.input}"`,
    '-t', 'markdown',
    '-o', `"${outputFile}"`,
    '--wrap=none'
  ];

  if (options.extractMedia) {
    if (!existsSync(mediaDir)) {
      mkdirSync(mediaDir, { recursive: true });
    }
    args.push(`--extract-media="${mediaDir}"`);
  }

  if (options.toc) {
    args.push('--toc');
  }

  console.error(`Converting ${basename(options.input)} to Markdown...`);

  try {
    const startTime = Date.now();

    execSync(`"${PANDOC}" ${args.join(' ')}`, {
      stdio: 'pipe',
      maxBuffer: 50 * 1024 * 1024
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    if (options.json) {
      const stats = {
        input: options.input,
        output: outputFile,
        media_dir: options.extractMedia ? mediaDir : null,
        duration_seconds: parseFloat(duration),
        tool: 'pandoc',
        cost: 0
      };
      console.log(JSON.stringify(stats, null, 2));
    } else {
      console.log(`✓ Created: ${outputFile}`);
      if (options.extractMedia) {
        console.log(`✓ Media extracted to: ${mediaDir}/`);
      }
      console.log(`  Duration: ${duration}s`);
    }

  } catch (error) {
    console.error('Conversion failed:', error.message);
    process.exit(1);
  }
}

// Main
const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
pdf-to-md.mjs - Convert PDF to Markdown (LOCAL, FREE)

Usage:
  node pdf-to-md.mjs <pdf-file> [options]

Options:
  --output, -o      Output file path (default: <input>.md)
  --extract-media   Extract images to separate folder
  --toc             Include table of contents
  --json            Output metadata as JSON

Examples:
  node pdf-to-md.mjs document.pdf
  node pdf-to-md.mjs book.pdf -o book.md --extract-media
  node pdf-to-md.mjs report.pdf --toc --json

Note: For best results with complex PDFs, consider using
      pdf-extract.mjs first, then processing the text.
`);
  process.exit(0);
}

convertPdfToMd(parseArgs(args));
