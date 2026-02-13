#!/usr/bin/env node
/**
 * MarkItDown Wrapper - Convert files to Markdown
 * Uses Microsoft's MarkItDown (better structure preservation than Pandoc)
 *
 * Usage:
 *   node markitdown-convert.mjs <input-file> [--output <file>] [--json]
 *
 * Examples:
 *   node markitdown-convert.mjs document.pdf
 *   node markitdown-convert.mjs report.docx --output report.md
 *   node markitdown-convert.mjs data.xlsx --json
 */

import { spawn } from 'child_process';
import { writeFileSync, existsSync } from 'fs';
import { basename, extname, dirname, join } from 'path';

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help')) {
  console.log(`
MarkItDown Converter (v0.1.2)
Convert various file formats to Markdown

Usage:
  node markitdown-convert.mjs <input-file> [options]

Options:
  --output, -o <file>   Output file path (default: <input>.md)
  --json                Output as JSON with metadata
  --help                Show this help

Supported formats:
  Documents: pdf, docx, pptx, xlsx, csv
  Web: html, xml, json
  Images: png, jpg (with OCR via description)
  Audio: wav, mp3 (transcription if supported)
  Archives: zip (extracts and converts contents)
`);
  process.exit(0);
}

const inputFile = args.find(a => !a.startsWith('-'));
const outputFlag = args.includes('--output') || args.includes('-o');
const outputFile = outputFlag
  ? args[args.indexOf(outputFlag ? '--output' : '-o') + 1] || args[args.indexOf('-o') + 1]
  : null;
const jsonOutput = args.includes('--json');

if (!inputFile) {
  console.error('Error: No input file specified');
  process.exit(1);
}

if (!existsSync(inputFile)) {
  console.error(`Error: File not found: ${inputFile}`);
  process.exit(1);
}

// Build Python command
const pythonCode = `
from markitdown import MarkItDown
import json
import sys

md = MarkItDown()
result = md.convert("${inputFile.replace(/\\/g, '\\\\')}")

if ${jsonOutput}:
    output = {
        "source": "${inputFile.replace(/\\/g, '\\\\')}",
        "title": result.title or "",
        "content": result.text_content,
        "metadata": {}
    }
    print(json.dumps(output, ensure_ascii=False, indent=2))
else:
    print(result.text_content)
`;

const python = spawn('python', ['-c', pythonCode]);

let stdout = '';
let stderr = '';

python.stdout.on('data', (data) => {
  stdout += data.toString();
});

python.stderr.on('data', (data) => {
  stderr += data.toString();
});

python.on('close', (code) => {
  if (code !== 0) {
    console.error(`Error: MarkItDown failed`);
    console.error(stderr);
    process.exit(1);
  }

  if (outputFile || !jsonOutput) {
    const defaultOutput = join(
      dirname(inputFile),
      basename(inputFile, extname(inputFile)) + '.md'
    );
    const finalOutput = outputFile || defaultOutput;

    if (outputFile) {
      writeFileSync(finalOutput, stdout);
      console.log(`Converted: ${inputFile} -> ${finalOutput}`);
    } else {
      // Print to stdout if no output file and not JSON
      console.log(stdout);
    }
  } else {
    // JSON output to stdout
    console.log(stdout);
  }
});
