#!/usr/bin/env node
/**
 * transcribe.mjs - Audio to text using whisper.cpp
 *
 * Usage:
 *   node transcribe.mjs <audio-file> [options]
 *
 * Options:
 *   --lang, -l     Language code (default: auto-detect)
 *   --output, -o   Output file (default: <input>.txt)
 *   --srt          Generate SRT subtitles
 *   --json         Output as JSON
 *
 * Examples:
 *   node transcribe.mjs meeting.mp3
 *   node transcribe.mjs video.wav --lang pt --srt
 */

import { execSync, spawn } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { basename, extname, dirname, join } from 'path';

// Load config
const CONFIG_PATH = join(dirname(new URL(import.meta.url).pathname.slice(1)), '../config/local-tools.json');
const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));

const WHISPER_CLI = config.tools.whisper.binary;
const WHISPER_MODEL = config.tools.whisper.model;
const FFMPEG = config.tools.ffmpeg.binary;

function parseArgs(args) {
  const options = {
    input: null,
    lang: null,
    output: null,
    srt: false,
    json: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--lang' || arg === '-l') {
      options.lang = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    } else if (arg === '--srt') {
      options.srt = true;
    } else if (arg === '--json') {
      options.json = true;
    } else if (!arg.startsWith('-')) {
      options.input = arg;
    }
  }

  return options;
}

function convertToWav(inputFile) {
  const ext = extname(inputFile).toLowerCase();
  if (ext === '.wav') return inputFile;

  const outputFile = inputFile.replace(extname(inputFile), '.converted.wav');
  console.log(`Converting ${basename(inputFile)} to WAV...`);

  execSync(`"${FFMPEG}" -i "${inputFile}" -ar 16000 -ac 1 -y "${outputFile}"`, {
    stdio: 'pipe'
  });

  return outputFile;
}

function transcribe(options) {
  if (!options.input) {
    console.error('Error: No input file specified');
    console.log('Usage: node transcribe.mjs <audio-file> [options]');
    process.exit(1);
  }

  if (!existsSync(options.input)) {
    console.error(`Error: File not found: ${options.input}`);
    process.exit(1);
  }

  // Convert to WAV if needed
  const wavFile = convertToWav(options.input);

  // Build whisper command
  const args = [
    '-m', WHISPER_MODEL,
    '-f', wavFile
  ];

  if (options.lang) {
    args.push('-l', options.lang);
  }

  if (options.srt) {
    args.push('-osrt');
  }

  if (options.output) {
    args.push('-of', options.output.replace(/\.[^.]+$/, ''));
  }

  console.log(`Transcribing ${basename(options.input)}...`);

  const result = execSync(`"${WHISPER_CLI}" ${args.join(' ')}`, {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe']
  });

  if (options.json) {
    console.log(JSON.stringify({
      input: options.input,
      transcription: result.trim(),
      tool: 'whisper.cpp',
      cost: 0
    }, null, 2));
  } else {
    console.log(result);
  }

  // Cleanup temp file
  if (wavFile !== options.input && existsSync(wavFile)) {
    execSync(`del "${wavFile}"`);
  }
}

// Main
const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
transcribe.mjs - Audio to text using whisper.cpp (LOCAL, FREE)

Usage:
  node transcribe.mjs <audio-file> [options]

Options:
  --lang, -l     Language code (pt, en, es, etc.)
  --output, -o   Output file path
  --srt          Generate SRT subtitles
  --json         Output as JSON

Examples:
  node transcribe.mjs meeting.mp3
  node transcribe.mjs video.wav --lang pt --srt
  node transcribe.mjs audio.mp3 --json
`);
  process.exit(0);
}

transcribe(parseArgs(args));
