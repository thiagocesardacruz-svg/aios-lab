#!/usr/bin/env node
/**
 * Tool Router - Intelligent local tool selection (NO AI needed)
 *
 * Routes tasks to appropriate local tools based on content type and task pattern
 * Tracks cost savings from using local tools vs external APIs
 *
 * Usage:
 *   node tool-router.mjs analyze <file_path>           # Analyze and recommend tool
 *   node tool-router.mjs process <file_path>           # Auto-process with best tool
 *   node tool-router.mjs process <file_path> --tool=whisper  # Force specific tool
 *   node tool-router.mjs savings                       # Show cost savings report
 *
 * Supported Tools:
 *   - whisper.cpp: Audio transcription (wav, mp3, flac, ogg)
 *   - tesseract: OCR (png, jpg, jpeg, tiff, bmp)
 *   - pdftotext: PDF text extraction
 *   - pandoc: Document conversion (pdf→md, docx→md)
 *   - calibre: Ebook ETL (epub, mobi, azw)
 *   - ollama: Simple LLM queries
 *   - ffmpeg: Media conversion
 *
 * Cost: €0 (all processing is local)
 */

import { readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawn } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load tool config
function loadToolConfig() {
  const configPath = join(__dirname, '../config/local-tools.json');
  if (!existsSync(configPath)) {
    console.error('Error: local-tools.json not found. Run setup first.');
    process.exit(1);
  }
  return JSON.parse(readFileSync(configPath, 'utf-8'));
}

// Cost estimates for API alternatives (per unit)
const API_COSTS = {
  whisper: { unit: 'minute', cost: 0.006, api: 'OpenAI Whisper' },
  ocr: { unit: 'page', cost: 0.05, api: 'Google Vision / Azure OCR' },
  pdf_extract: { unit: 'page', cost: 0.02, api: 'Adobe Extract API' },
  document_convert: { unit: 'document', cost: 0.10, api: 'CloudConvert' },
  ebook_convert: { unit: 'book', cost: 0.20, api: 'Calibre Cloud / Manual' },
  llm_query: { unit: '1k tokens', cost: 0.03, api: 'GPT-4' }
};

// File extension to tool mapping
const EXTENSION_MAP = {
  // Audio -> Whisper
  '.wav': { tool: 'whisper', category: 'audio' },
  '.mp3': { tool: 'whisper', category: 'audio' },
  '.flac': { tool: 'whisper', category: 'audio' },
  '.ogg': { tool: 'whisper', category: 'audio' },
  '.m4a': { tool: 'whisper', category: 'audio' },

  // Images -> Tesseract
  '.png': { tool: 'tesseract', category: 'image' },
  '.jpg': { tool: 'tesseract', category: 'image' },
  '.jpeg': { tool: 'tesseract', category: 'image' },
  '.tiff': { tool: 'tesseract', category: 'image' },
  '.bmp': { tool: 'tesseract', category: 'image' },

  // PDF -> pdftotext or pandoc
  '.pdf': { tool: 'pdftotext', category: 'document', alt: 'pandoc' },

  // Documents -> Pandoc
  '.docx': { tool: 'pandoc', category: 'document' },
  '.doc': { tool: 'pandoc', category: 'document' },
  '.rtf': { tool: 'pandoc', category: 'document' },
  '.odt': { tool: 'pandoc', category: 'document' },
  '.html': { tool: 'pandoc', category: 'document' },

  // Ebooks -> Calibre
  '.epub': { tool: 'calibre', category: 'ebook' },
  '.mobi': { tool: 'calibre', category: 'ebook' },
  '.azw': { tool: 'calibre', category: 'ebook' },
  '.azw3': { tool: 'calibre', category: 'ebook' },
  '.fb2': { tool: 'calibre', category: 'ebook' },

  // Video -> FFmpeg (extract audio)
  '.mp4': { tool: 'ffmpeg', category: 'video' },
  '.mkv': { tool: 'ffmpeg', category: 'video' },
  '.avi': { tool: 'ffmpeg', category: 'video' },
  '.mov': { tool: 'ffmpeg', category: 'video' }
};

// Savings log path
const SAVINGS_LOG = join(__dirname, '../data/tool-savings.json');

// Load/save savings data
function loadSavings() {
  if (!existsSync(SAVINGS_LOG)) {
    return { total: 0, byTool: {}, history: [] };
  }
  return JSON.parse(readFileSync(SAVINGS_LOG, 'utf-8'));
}

function saveSavings(data) {
  writeFileSync(SAVINGS_LOG, JSON.stringify(data, null, 2));
}

// Log a savings entry
function logSaving(tool, units, apiCost) {
  const savings = loadSavings();

  const entry = {
    timestamp: new Date().toISOString(),
    tool,
    units,
    saved: apiCost
  };

  savings.total += apiCost;
  savings.byTool[tool] = (savings.byTool[tool] || 0) + apiCost;
  savings.history.push(entry);

  // Keep only last 100 entries
  if (savings.history.length > 100) {
    savings.history = savings.history.slice(-100);
  }

  saveSavings(savings);
  return apiCost;
}

// Analyze file and recommend tool
function analyzeFile(filePath) {
  if (!existsSync(filePath)) {
    return { error: `File not found: ${filePath}` };
  }

  const ext = extname(filePath).toLowerCase();
  const stats = statSync(filePath);
  const mapping = EXTENSION_MAP[ext];

  if (!mapping) {
    return {
      file: filePath,
      extension: ext,
      supported: false,
      recommendation: 'File type not supported by local tools'
    };
  }

  const config = loadToolConfig();
  const tool = config.tools[mapping.tool];

  // Estimate API cost
  let estimatedUnits = 1;
  let costInfo = API_COSTS[mapping.category === 'audio' ? 'whisper' : mapping.category === 'image' ? 'ocr' : 'document_convert'];

  if (mapping.category === 'audio') {
    // Estimate audio duration (rough: 1MB ≈ 1 min for mp3)
    estimatedUnits = Math.ceil(stats.size / (1024 * 1024));
    costInfo = API_COSTS.whisper;
  } else if (mapping.category === 'image') {
    estimatedUnits = 1;
    costInfo = API_COSTS.ocr;
  } else if (mapping.category === 'document' || mapping.category === 'ebook') {
    // Rough page estimate
    estimatedUnits = Math.ceil(stats.size / (50 * 1024)); // ~50KB per page
    costInfo = mapping.category === 'ebook' ? API_COSTS.ebook_convert : API_COSTS.pdf_extract;
  }

  const apiCost = estimatedUnits * costInfo.cost;

  return {
    file: filePath,
    extension: ext,
    size: stats.size,
    category: mapping.category,
    supported: true,
    recommendedTool: mapping.tool,
    alternativeTool: mapping.alt || null,
    toolAvailable: !!tool,
    toolPath: tool?.binary || 'not configured',
    estimatedUnits,
    unitType: costInfo.unit,
    apiAlternative: costInfo.api,
    estimatedApiCost: apiCost,
    localCost: 0,
    savings: apiCost
  };
}

// Process file with appropriate tool
async function processFile(filePath, options = {}) {
  const analysis = analyzeFile(filePath);

  if (!analysis.supported) {
    return { error: analysis.recommendation };
  }

  if (!analysis.toolAvailable) {
    return { error: `Tool not configured: ${analysis.recommendedTool}` };
  }

  const tool = options.tool || analysis.recommendedTool;
  const config = loadToolConfig();
  const toolConfig = config.tools[tool];

  let result;
  const startTime = Date.now();

  try {
    switch (tool) {
      case 'whisper':
        result = await runWhisper(filePath, toolConfig, options);
        break;
      case 'tesseract':
        result = await runTesseract(filePath, toolConfig, options);
        break;
      case 'pdftotext':
        result = await runPdftotext(filePath, toolConfig, options);
        break;
      case 'pandoc':
        result = await runPandoc(filePath, toolConfig, options);
        break;
      case 'calibre':
        result = await runCalibre(filePath, toolConfig, options);
        break;
      case 'ffmpeg':
        result = await runFfmpeg(filePath, toolConfig, options);
        break;
      default:
        return { error: `Unknown tool: ${tool}` };
    }

    const duration = Date.now() - startTime;

    // Log savings
    const saved = logSaving(tool, analysis.estimatedUnits, analysis.estimatedApiCost);

    return {
      success: true,
      tool,
      file: filePath,
      duration: `${duration}ms`,
      output: result,
      costSaved: `€${saved.toFixed(4)}`,
      apiAlternative: analysis.apiAlternative
    };

  } catch (error) {
    return {
      success: false,
      tool,
      error: error.message
    };
  }
}

// Tool runners
async function runWhisper(filePath, config, options) {
  const lang = options.lang || 'en';
  const cmd = `"${config.binary}" -m "${config.model}" -l ${lang} -f "${filePath}" -otxt`;
  const output = execSync(cmd, { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
  return output.trim();
}

async function runTesseract(filePath, config, options) {
  const cmd = `"${config.binary}" "${filePath}" stdout`;
  const output = execSync(cmd, { encoding: 'utf-8' });
  return output.trim();
}

async function runPdftotext(filePath, config, options) {
  const cmd = `"${config.binary}" "${filePath}" -`;
  const output = execSync(cmd, { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
  return output.trim();
}

async function runPandoc(filePath, config, options) {
  const outputFormat = options.to || 'markdown';
  const cmd = `"${config.binary}" "${filePath}" -t ${outputFormat}`;
  const output = execSync(cmd, { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
  return output.trim();
}

async function runCalibre(filePath, config, options) {
  const outputFormat = options.to || 'txt';
  const outputPath = filePath.replace(/\.[^.]+$/, `.${outputFormat}`);
  const cmd = `"${config.binary}" "${filePath}" "${outputPath}"`;
  execSync(cmd, { encoding: 'utf-8' });
  return `Converted to: ${outputPath}`;
}

async function runFfmpeg(filePath, config, options) {
  const outputPath = filePath.replace(/\.[^.]+$/, '.wav');
  const cmd = `"${config.binary}" -i "${filePath}" -ar 16000 -ac 1 "${outputPath}" -y`;
  execSync(cmd, { encoding: 'utf-8' });
  return `Audio extracted to: ${outputPath}`;
}

// Savings report
function savingsReport() {
  const savings = loadSavings();

  let output = `## 💰 Local Tools Savings Report\n\n`;
  output += `**Total Saved: €${savings.total.toFixed(2)}**\n\n`;

  output += `### By Tool\n\n`;
  output += `| Tool | Saved |\n`;
  output += `|------|-------|\n`;
  Object.entries(savings.byTool).forEach(([tool, amount]) => {
    output += `| ${tool} | €${amount.toFixed(2)} |\n`;
  });

  output += `\n### Recent Activity (last 10)\n\n`;
  const recent = savings.history.slice(-10).reverse();
  recent.forEach(entry => {
    output += `- ${entry.timestamp.split('T')[0]}: ${entry.tool} saved €${entry.saved.toFixed(4)}\n`;
  });

  return output;
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const format = args.find(a => a.startsWith('--format='))?.split('=')[1] || 'text';

  switch (command) {
    case 'analyze': {
      const filePath = args[1];
      if (!filePath) {
        console.error('Usage: node tool-router.mjs analyze <file_path>');
        process.exit(1);
      }
      const analysis = analyzeFile(filePath);
      if (format === 'json') {
        console.log(JSON.stringify(analysis, null, 2));
      } else {
        if (analysis.error) {
          console.log(`❌ ${analysis.error}`);
        } else if (!analysis.supported) {
          console.log(`❌ ${analysis.recommendation}`);
        } else {
          console.log(`📁 File: ${analysis.file}`);
          console.log(`📦 Category: ${analysis.category}`);
          console.log(`🔧 Recommended Tool: ${analysis.recommendedTool}`);
          console.log(`💵 API Cost: €${analysis.estimatedApiCost.toFixed(4)} (${analysis.apiAlternative})`);
          console.log(`💰 Local Cost: €0.00`);
          console.log(`✅ Savings: €${analysis.savings.toFixed(4)}`);
        }
      }
      break;
    }

    case 'process': {
      const filePath = args[1];
      if (!filePath) {
        console.error('Usage: node tool-router.mjs process <file_path>');
        process.exit(1);
      }

      const tool = args.find(a => a.startsWith('--tool='))?.split('=')[1];
      const lang = args.find(a => a.startsWith('--lang='))?.split('=')[1];
      const to = args.find(a => a.startsWith('--to='))?.split('=')[1];

      const result = await processFile(filePath, { tool, lang, to });

      if (format === 'json') {
        console.log(JSON.stringify(result, null, 2));
      } else {
        if (result.success) {
          console.log(`✅ Processed with ${result.tool}`);
          console.log(`⏱️ Duration: ${result.duration}`);
          console.log(`💰 Saved: ${result.costSaved} vs ${result.apiAlternative}`);
          console.log(`\n--- Output ---\n`);
          console.log(result.output?.slice(0, 2000) || '(no text output)');
          if (result.output?.length > 2000) {
            console.log(`\n... (${result.output.length - 2000} more characters)`);
          }
        } else {
          console.log(`❌ Error: ${result.error}`);
        }
      }
      break;
    }

    case 'savings': {
      const report = savingsReport();
      console.log(report);
      break;
    }

    default:
      console.log(`
Tool Router - Intelligent local tool selection

Commands:
  analyze <file>              Analyze file and recommend tool
  process <file>              Process file with best local tool
      --tool=whisper          Force specific tool
      --lang=pt               Language (for whisper)
      --to=markdown           Output format (for pandoc/calibre)
  savings                     Show cost savings report

Supported file types:
  Audio:    .wav .mp3 .flac .ogg .m4a → whisper
  Images:   .png .jpg .jpeg .tiff .bmp → tesseract
  PDF:      .pdf → pdftotext or pandoc
  Docs:     .docx .doc .rtf .odt → pandoc
  Ebooks:   .epub .mobi .azw → calibre
  Video:    .mp4 .mkv .avi .mov → ffmpeg (audio extraction)

Examples:
  node tool-router.mjs analyze meeting.mp3
  node tool-router.mjs process screenshot.png
  node tool-router.mjs process document.pdf --to=markdown
  node tool-router.mjs savings
      `);
  }
}

main().catch(console.error);
