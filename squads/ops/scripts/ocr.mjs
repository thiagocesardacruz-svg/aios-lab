#!/usr/bin/env node
/**
 * ocr.mjs - Image to text using Tesseract OCR
 *
 * Usage:
 *   node ocr.mjs <image-file> [options]
 *
 * Options:
 *   --lang, -l     Language code (default: eng)
 *   --output, -o   Output file (default: stdout)
 *   --json         Output as JSON
 *
 * Examples:
 *   node ocr.mjs screenshot.png
 *   node ocr.mjs document.jpg --lang por -o output.txt
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, unlinkSync } from 'fs';
import { basename, dirname, join } from 'path';
import { tmpdir } from 'os';

// Load config
const CONFIG_PATH = join(dirname(new URL(import.meta.url).pathname.slice(1)), '../config/local-tools.json');
const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));

const TESSERACT = config.tools.tesseract.binary;

function parseArgs(args) {
  const options = {
    input: null,
    lang: 'eng',
    output: null,
    json: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--lang' || arg === '-l') {
      options.lang = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    } else if (arg === '--json') {
      options.json = true;
    } else if (!arg.startsWith('-')) {
      options.input = arg;
    }
  }

  return options;
}

function ocr(options) {
  if (!options.input) {
    console.error('Error: No input file specified');
    console.log('Usage: node ocr.mjs <image-file> [options]');
    process.exit(1);
  }

  if (!existsSync(options.input)) {
    console.error(`Error: File not found: ${options.input}`);
    process.exit(1);
  }

  const tempOutput = join(tmpdir(), `ocr-${Date.now()}`);

  console.error(`OCR processing ${basename(options.input)}...`);

  try {
    execSync(`"${TESSERACT}" "${options.input}" "${tempOutput}" -l ${options.lang}`, {
      stdio: 'pipe'
    });

    const text = readFileSync(`${tempOutput}.txt`, 'utf-8').trim();

    // Cleanup
    unlinkSync(`${tempOutput}.txt`);

    if (options.json) {
      const result = {
        input: options.input,
        text: text,
        language: options.lang,
        tool: 'tesseract',
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
    console.error('OCR failed:', error.message);
    process.exit(1);
  }
}

// Main
const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
ocr.mjs - Image to text using Tesseract OCR (LOCAL, FREE)

Usage:
  node ocr.mjs <image-file> [options]

Options:
  --lang, -l     Language code (eng, por, spa, etc.)
  --output, -o   Output file path
  --json         Output as JSON

Supported formats: PNG, JPG, JPEG, TIFF, BMP

Examples:
  node ocr.mjs screenshot.png
  node ocr.mjs document.jpg --lang eng -o output.txt
  node ocr.mjs scan.png --json
`);
  process.exit(0);
}

ocr(parseArgs(args));
