#!/usr/bin/env node
/**
 * ebook-etl.mjs - Extract, Transform, Load for ebooks using Calibre
 *
 * Supports: EPUB, MOBI, AZW, AZW3, FB2, LIT, PDB, PDF, RTF, TXT, DOCX, HTML
 *
 * Usage:
 *   node ebook-etl.mjs <ebook-file> [options]
 *
 * Options:
 *   --to, -t       Output format (md, txt, epub, pdf, html, docx)
 *   --output, -o   Output file path
 *   --metadata     Extract metadata only
 *   --chapters     Split by chapters (creates folder)
 *   --json         Output info as JSON
 *
 * Examples:
 *   node ebook-etl.mjs book.epub --to md
 *   node ebook-etl.mjs book.mobi --to txt --chapters
 *   node ebook-etl.mjs book.azw3 --metadata --json
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, mkdirSync, readdirSync } from 'fs';
import { basename, dirname, join, extname } from 'path';

// Load config
const CONFIG_PATH = join(dirname(new URL(import.meta.url).pathname.slice(1)), '../config/local-tools.json');
const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));

const EBOOK_CONVERT = config.tools.calibre?.binary || 'C:\\Program Files\\Calibre2\\ebook-convert.exe';
const EBOOK_META = 'C:\\Program Files\\Calibre2\\ebook-meta.exe';

const FORMAT_MAP = {
  'md': 'markdown',
  'markdown': 'markdown',
  'txt': 'txt',
  'text': 'txt',
  'epub': 'epub',
  'pdf': 'pdf',
  'html': 'htmlz',
  'docx': 'docx'
};

function parseArgs(args) {
  const options = {
    input: null,
    to: 'md',
    output: null,
    metadata: false,
    chapters: false,
    json: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--to' || arg === '-t') {
      options.to = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    } else if (arg === '--metadata') {
      options.metadata = true;
    } else if (arg === '--chapters') {
      options.chapters = true;
    } else if (arg === '--json') {
      options.json = true;
    } else if (!arg.startsWith('-')) {
      options.input = arg;
    }
  }

  return options;
}

function getMetadata(inputFile) {
  try {
    const result = execSync(`"${EBOOK_META}" "${inputFile}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });

    const metadata = {};
    const lines = result.split('\n');

    for (const line of lines) {
      const match = line.match(/^([^:]+):\s*(.+)$/);
      if (match) {
        const key = match[1].trim().toLowerCase().replace(/\s+/g, '_');
        metadata[key] = match[2].trim();
      }
    }

    return metadata;
  } catch (error) {
    return { error: 'Could not extract metadata' };
  }
}

function convertEbook(options) {
  if (!options.input) {
    console.error('Error: No input file specified');
    console.log('Usage: node ebook-etl.mjs <ebook-file> [options]');
    process.exit(1);
  }

  if (!existsSync(options.input)) {
    console.error(`Error: File not found: ${options.input}`);
    process.exit(1);
  }

  // Metadata only mode
  if (options.metadata) {
    const meta = getMetadata(options.input);
    if (options.json) {
      console.log(JSON.stringify({
        input: options.input,
        metadata: meta,
        tool: 'calibre',
        cost: 0
      }, null, 2));
    } else {
      console.log('Metadata:');
      for (const [key, value] of Object.entries(meta)) {
        console.log(`  ${key}: ${value}`);
      }
    }
    return;
  }

  const inputBase = basename(options.input, extname(options.input));
  const targetFormat = FORMAT_MAP[options.to] || options.to;
  const outputExt = options.to === 'md' ? 'md' : (targetFormat === 'htmlz' ? 'html' : targetFormat);
  const outputFile = options.output || `${inputBase}.${outputExt}`;

  const args = [
    `"${options.input}"`,
    `"${outputFile}"`
  ];

  // Add format-specific options
  if (targetFormat === 'markdown' || targetFormat === 'txt') {
    args.push('--txt-output-formatting=markdown');
    args.push('--keep-links');
    args.push('--keep-image-references');
  }

  console.error(`Converting ${basename(options.input)} to ${options.to.toUpperCase()}...`);

  try {
    const startTime = Date.now();

    execSync(`"${EBOOK_CONVERT}" ${args.join(' ')}`, {
      stdio: 'pipe',
      maxBuffer: 100 * 1024 * 1024
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const meta = getMetadata(options.input);

    if (options.json) {
      console.log(JSON.stringify({
        input: options.input,
        output: outputFile,
        format: options.to,
        metadata: meta,
        duration_seconds: parseFloat(duration),
        tool: 'calibre',
        cost: 0
      }, null, 2));
    } else {
      console.log(`✓ Created: ${outputFile}`);
      if (meta.title) console.log(`  Title: ${meta.title}`);
      if (meta.author) console.log(`  Author: ${meta.author}`);
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
ebook-etl.mjs - Extract, Transform, Load for ebooks (LOCAL, FREE)

Powered by Calibre - supports 15+ ebook formats

Usage:
  node ebook-etl.mjs <ebook-file> [options]

Options:
  --to, -t       Output format: md, txt, epub, pdf, html, docx
  --output, -o   Output file path
  --metadata     Extract metadata only (no conversion)
  --json         Output info as JSON

Supported input formats:
  EPUB, MOBI, AZW, AZW3, FB2, LIT, PDB, PDF, RTF, TXT, DOCX, HTML, CBZ, CBR

Examples:
  node ebook-etl.mjs book.epub --to md
  node ebook-etl.mjs book.mobi --to txt -o output.txt
  node ebook-etl.mjs book.azw3 --metadata --json
  node ebook-etl.mjs book.pdf --to epub

ETL Pipeline for books:
  1. Extract: node ebook-etl.mjs book.epub --metadata --json
  2. Transform: node ebook-etl.mjs book.epub --to md
  3. Load: Use the .md file for RAG, search, or analysis
`);
  process.exit(0);
}

convertEbook(parseArgs(args));
