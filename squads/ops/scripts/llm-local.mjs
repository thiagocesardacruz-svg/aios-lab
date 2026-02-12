#!/usr/bin/env node
/**
 * llm-local.mjs - Local LLM queries using Ollama
 *
 * Usage:
 *   node llm-local.mjs "<prompt>"
 *   node llm-local.mjs --file <input-file> "<prompt>"
 *
 * Options:
 *   --model, -m    Model name (default: llama3.2:1b)
 *   --file, -f     Input file to include in context
 *   --json         Output as JSON
 *   --system, -s   System prompt
 *
 * Examples:
 *   node llm-local.mjs "Explain recursion in 2 sentences"
 *   node llm-local.mjs --file code.js "Review this code"
 *   node llm-local.mjs --model llama3.2:1b "Summarize: ..."
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';

// Load config
const CONFIG_PATH = join(dirname(new URL(import.meta.url).pathname.slice(1)), '../config/local-tools.json');
const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));

const OLLAMA = config.tools.ollama.binary;
const DEFAULT_MODEL = config.tools.ollama.models[0] || 'llama3.2:1b';

function parseArgs(args) {
  const options = {
    prompt: null,
    model: DEFAULT_MODEL,
    file: null,
    json: false,
    system: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--model' || arg === '-m') {
      options.model = args[++i];
    } else if (arg === '--file' || arg === '-f') {
      options.file = args[++i];
    } else if (arg === '--system' || arg === '-s') {
      options.system = args[++i];
    } else if (arg === '--json') {
      options.json = true;
    } else if (!arg.startsWith('-')) {
      options.prompt = arg;
    }
  }

  return options;
}

function query(options) {
  if (!options.prompt) {
    console.error('Error: No prompt specified');
    process.exit(1);
  }

  let fullPrompt = options.prompt;

  // Include file content if specified
  if (options.file) {
    if (!existsSync(options.file)) {
      console.error(`Error: File not found: ${options.file}`);
      process.exit(1);
    }
    const content = readFileSync(options.file, 'utf-8');
    fullPrompt = `File content:\n\`\`\`\n${content}\n\`\`\`\n\n${options.prompt}`;
  }

  // Build prompt with system message if provided
  if (options.system) {
    fullPrompt = `System: ${options.system}\n\nUser: ${fullPrompt}`;
  }

  // Escape the prompt for shell
  const escapedPrompt = fullPrompt.replace(/"/g, '\\"').replace(/\n/g, '\\n');

  try {
    const startTime = Date.now();

    const result = execSync(
      `"${OLLAMA}" run ${options.model} "${escapedPrompt}"`,
      {
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024,
        timeout: 120000 // 2 min timeout
      }
    );

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    if (options.json) {
      console.log(JSON.stringify({
        model: options.model,
        prompt: options.prompt,
        response: result.trim(),
        duration_seconds: parseFloat(duration),
        tool: 'ollama',
        cost: 0
      }, null, 2));
    } else {
      console.log(result.trim());
    }

  } catch (error) {
    if (error.message.includes('ETIMEDOUT') || error.killed) {
      console.error('Error: Query timed out (>2 min)');
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

// Main
const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
llm-local.mjs - Local LLM queries using Ollama (LOCAL, FREE)

Usage:
  node llm-local.mjs "<prompt>"
  node llm-local.mjs --file <input-file> "<prompt>"

Options:
  --model, -m    Model name (default: ${DEFAULT_MODEL})
  --file, -f     Input file to include in context
  --system, -s   System prompt
  --json         Output as JSON

Available models (run 'ollama list' for more):
  - llama3.2:1b  (1.3GB, fast)
  - llama3.2:3b  (2GB, balanced)
  - mistral      (4GB, quality)
  - phi3         (2GB, efficient)

Examples:
  node llm-local.mjs "Explain recursion briefly"
  node llm-local.mjs --file code.js "Review this code"
  node llm-local.mjs --json "List 3 ideas for..."

Cost: €0 per query (runs locally)
`);
  process.exit(0);
}

query(parseArgs(args));
