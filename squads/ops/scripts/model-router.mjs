#!/usr/bin/env node
/**
 * Model Router - Intelligent model selection for cost optimization
 *
 * Analyzes task characteristics and routes to the most cost-effective model.
 * Haiku is ~19x cheaper than Opus, ~4x cheaper than Sonnet.
 *
 * Usage:
 *   node model-router.mjs analyze "Task description here"
 *   node model-router.mjs analyze --file=task.md
 *   node model-router.mjs recommend --task-type=extraction
 *   node model-router.mjs savings                         # Show model routing savings
 *
 * Model Pricing (per 1k tokens):
 *   - Haiku 3.5:  €0.0008 in, €0.004 out  (baseline)
 *   - Sonnet 4:   €0.003 in,  €0.015 out  (~4x Haiku)
 *   - Opus 4.5:   €0.015 in,  €0.075 out  (~19x Haiku)
 *
 * Cost: €0 (runs locally, no API calls)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Model definitions
const MODELS = {
  haiku: {
    id: 'claude-haiku-3-5',
    name: 'Haiku 3.5',
    pricing: { input: 0.0008, output: 0.004 },
    strengths: ['speed', 'simple-tasks', 'extraction', 'classification', 'formatting'],
    maxComplexity: 3,
    description: 'Fast, cheap. Best for simple, well-defined tasks.'
  },
  sonnet: {
    id: 'claude-sonnet-4',
    name: 'Sonnet 4',
    pricing: { input: 0.003, output: 0.015 },
    strengths: ['balanced', 'code', 'analysis', 'summarization', 'debugging'],
    maxComplexity: 7,
    description: 'Balanced performance/cost. Good for most development tasks.'
  },
  opus: {
    id: 'claude-opus-4-5',
    name: 'Opus 4.5',
    pricing: { input: 0.015, output: 0.075 },
    strengths: ['complex-reasoning', 'architecture', 'ambiguity', 'creativity', 'planning'],
    maxComplexity: 10,
    description: 'Most capable. Reserved for complex, ambiguous, or critical tasks.'
  }
};

// Task type patterns and their complexity scores
const TASK_PATTERNS = {
  // Haiku-suitable (complexity 1-3)
  extraction: {
    keywords: ['extract', 'extrair', 'parse', 'get', 'find', 'list', 'listar'],
    complexity: 2,
    model: 'haiku',
    description: 'Data extraction from structured content'
  },
  classification: {
    keywords: ['classify', 'classificar', 'categorize', 'categorizar', 'label', 'tag', 'type'],
    complexity: 2,
    model: 'haiku',
    description: 'Categorization and labeling'
  },
  formatting: {
    keywords: ['format', 'formatar', 'convert', 'converter', 'transform', 'reformat'],
    complexity: 1,
    model: 'haiku',
    description: 'Text/data formatting'
  },
  validation: {
    keywords: ['validate', 'validar', 'check', 'verificar', 'verify', 'confirm'],
    complexity: 2,
    model: 'haiku',
    description: 'Simple validation checks'
  },
  translation_simple: {
    keywords: ['translate', 'traduzir', 'tradução'],
    complexity: 3,
    model: 'haiku',
    description: 'Simple translations'
  },
  qa_factual: {
    keywords: ['what is', 'o que é', 'when', 'quando', 'where', 'onde', 'who', 'quem'],
    complexity: 2,
    model: 'haiku',
    description: 'Factual Q&A'
  },
  template: {
    keywords: ['fill', 'preencher', 'template', 'modelo', 'generate from template'],
    complexity: 2,
    model: 'haiku',
    description: 'Template filling'
  },

  // Sonnet-suitable (complexity 4-7)
  code_simple: {
    keywords: ['fix bug', 'corrigir', 'small change', 'update function', 'add method'],
    complexity: 5,
    model: 'sonnet',
    description: 'Simple code changes'
  },
  summarization: {
    keywords: ['summarize', 'resumir', 'summary', 'resumo', 'tldr', 'overview'],
    complexity: 4,
    model: 'sonnet',
    description: 'Content summarization'
  },
  analysis_moderate: {
    keywords: ['analyze', 'analisar', 'review', 'revisar', 'evaluate', 'avaliar'],
    complexity: 5,
    model: 'sonnet',
    description: 'Moderate analysis'
  },
  debugging: {
    keywords: ['debug', 'depurar', 'error', 'erro', 'fix', 'issue', 'problema'],
    complexity: 6,
    model: 'sonnet',
    description: 'Debugging and error resolution'
  },
  refactoring: {
    keywords: ['refactor', 'refatorar', 'improve', 'melhorar', 'optimize', 'otimizar'],
    complexity: 6,
    model: 'sonnet',
    description: 'Code refactoring'
  },
  documentation: {
    keywords: ['document', 'documentar', 'docs', 'readme', 'explain code'],
    complexity: 4,
    model: 'sonnet',
    description: 'Documentation writing'
  },

  // Opus-suitable (complexity 8-10)
  architecture: {
    keywords: ['architect', 'arquitetura', 'design system', 'structure', 'estrutura'],
    complexity: 9,
    model: 'opus',
    description: 'Architecture and system design'
  },
  complex_reasoning: {
    keywords: ['complex', 'complexo', 'multi-step', 'reasoning', 'raciocínio', 'strategy'],
    complexity: 9,
    model: 'opus',
    description: 'Complex multi-step reasoning'
  },
  ambiguous: {
    keywords: ['unclear', 'ambiguous', 'ambíguo', 'decide', 'decidir', 'choose approach'],
    complexity: 8,
    model: 'opus',
    description: 'Ambiguous requirements'
  },
  creative_long: {
    keywords: ['create', 'criar', 'write', 'escrever', 'generate content', 'storytelling'],
    complexity: 8,
    model: 'opus',
    description: 'Long-form creative content'
  },
  planning: {
    keywords: ['plan', 'planejar', 'roadmap', 'strategy', 'estratégia', 'prioritize'],
    complexity: 8,
    model: 'opus',
    description: 'Strategic planning'
  },
  code_complex: {
    keywords: ['implement feature', 'implementar', 'new system', 'from scratch', 'full implementation'],
    complexity: 9,
    model: 'opus',
    description: 'Complex code implementation'
  }
};

// Complexity modifiers
const COMPLEXITY_MODIFIERS = {
  // Increase complexity
  long_context: { pattern: /context|contexto|história|history|background/i, modifier: +1 },
  multiple_files: { pattern: /multiple files|vários arquivos|across files/i, modifier: +2 },
  integration: { pattern: /integrat|integrar|connect|conectar|api/i, modifier: +1 },
  security: { pattern: /security|segurança|auth|credential/i, modifier: +2 },
  production: { pattern: /production|produção|deploy|live/i, modifier: +1 },

  // Decrease complexity
  single_file: { pattern: /single file|um arquivo|this file|only/i, modifier: -1 },
  example_provided: { pattern: /example|exemplo|like this|assim/i, modifier: -1 },
  simple: { pattern: /simple|simples|basic|básico|quick|rápido/i, modifier: -1 },
  small: { pattern: /small|pequeno|minor|menor|tiny/i, modifier: -1 }
};

// Analyze task and recommend model
function analyzeTask(taskDescription) {
  const description = taskDescription.toLowerCase();
  const words = description.split(/\s+/);

  let matchedPatterns = [];
  let baseComplexity = 5; // Default to middle

  // Match task patterns
  for (const [patternName, pattern] of Object.entries(TASK_PATTERNS)) {
    const matches = pattern.keywords.filter(kw => description.includes(kw.toLowerCase()));
    if (matches.length > 0) {
      matchedPatterns.push({
        pattern: patternName,
        matches,
        complexity: pattern.complexity,
        model: pattern.model,
        description: pattern.description
      });
    }
  }

  // Calculate base complexity from matched patterns
  if (matchedPatterns.length > 0) {
    baseComplexity = Math.round(
      matchedPatterns.reduce((sum, p) => sum + p.complexity, 0) / matchedPatterns.length
    );
  }

  // Apply modifiers
  let modifiers = [];
  let totalModifier = 0;

  for (const [modName, mod] of Object.entries(COMPLEXITY_MODIFIERS)) {
    if (mod.pattern.test(description)) {
      modifiers.push({ name: modName, modifier: mod.modifier });
      totalModifier += mod.modifier;
    }
  }

  // Final complexity (clamped 1-10)
  const finalComplexity = Math.max(1, Math.min(10, baseComplexity + totalModifier));

  // Determine recommended model
  let recommendedModel;
  if (finalComplexity <= 3) {
    recommendedModel = 'haiku';
  } else if (finalComplexity <= 7) {
    recommendedModel = 'sonnet';
  } else {
    recommendedModel = 'opus';
  }

  // Calculate cost comparison
  const estimatedTokens = { input: words.length * 10, output: words.length * 20 }; // Rough estimate
  const costs = {};
  for (const [modelName, model] of Object.entries(MODELS)) {
    costs[modelName] = (
      (estimatedTokens.input / 1000 * model.pricing.input) +
      (estimatedTokens.output / 1000 * model.pricing.output)
    );
  }

  const savings = {
    vsOpus: costs.opus - costs[recommendedModel],
    vsSonnet: costs.sonnet - costs[recommendedModel],
    percentVsOpus: Math.round((1 - costs[recommendedModel] / costs.opus) * 100)
  };

  return {
    task: taskDescription.slice(0, 100) + (taskDescription.length > 100 ? '...' : ''),
    analysis: {
      matchedPatterns,
      modifiers,
      baseComplexity,
      totalModifier,
      finalComplexity
    },
    recommendation: {
      model: recommendedModel,
      modelId: MODELS[recommendedModel].id,
      confidence: matchedPatterns.length > 0 ? 'high' : 'medium',
      reason: matchedPatterns.length > 0
        ? `Matched patterns: ${matchedPatterns.map(p => p.pattern).join(', ')}`
        : 'Based on complexity analysis'
    },
    costs: {
      estimated: costs,
      recommended: costs[recommendedModel],
      savings
    }
  };
}

// Task type quick recommendation
function recommendByType(taskType) {
  const pattern = TASK_PATTERNS[taskType];
  if (!pattern) {
    return { error: `Unknown task type: ${taskType}`, availableTypes: Object.keys(TASK_PATTERNS) };
  }

  return {
    taskType,
    recommendedModel: pattern.model,
    modelDetails: MODELS[pattern.model],
    complexity: pattern.complexity,
    description: pattern.description
  };
}

// Savings tracking
const SAVINGS_LOG = join(__dirname, '../data/model-routing-savings.json');

function loadSavings() {
  if (!existsSync(SAVINGS_LOG)) {
    return { totalSaved: 0, routings: [], byModel: { haiku: 0, sonnet: 0, opus: 0 } };
  }
  return JSON.parse(readFileSync(SAVINGS_LOG, 'utf-8'));
}

function saveSavingsData(data) {
  writeFileSync(SAVINGS_LOG, JSON.stringify(data, null, 2));
}

function logRouting(taskDescription, recommendedModel, actualTokens = null) {
  const savings = loadSavings();

  const entry = {
    timestamp: new Date().toISOString(),
    task: taskDescription.slice(0, 50),
    model: recommendedModel,
    tokens: actualTokens
  };

  // Calculate savings vs always using Opus
  if (actualTokens) {
    const opusCost = (actualTokens.input / 1000 * MODELS.opus.pricing.input) +
                     (actualTokens.output / 1000 * MODELS.opus.pricing.output);
    const actualCost = (actualTokens.input / 1000 * MODELS[recommendedModel].pricing.input) +
                       (actualTokens.output / 1000 * MODELS[recommendedModel].pricing.output);
    entry.saved = opusCost - actualCost;
    savings.totalSaved += entry.saved;
  }

  savings.routings.push(entry);
  savings.byModel[recommendedModel] = (savings.byModel[recommendedModel] || 0) + 1;

  // Keep last 100 entries
  if (savings.routings.length > 100) {
    savings.routings = savings.routings.slice(-100);
  }

  saveSavingsData(savings);
  return entry;
}

function showSavingsReport() {
  const savings = loadSavings();

  let output = `## 📊 Model Routing Savings Report\n\n`;
  output += `**Total Saved vs Always-Opus: €${savings.totalSaved.toFixed(2)}**\n\n`;

  output += `### Routing Distribution\n\n`;
  output += `| Model | Count | % |\n`;
  output += `|-------|-------|---|\n`;

  const total = Object.values(savings.byModel).reduce((a, b) => a + b, 0);
  for (const [model, count] of Object.entries(savings.byModel)) {
    const pct = total > 0 ? Math.round(count / total * 100) : 0;
    output += `| ${model} | ${count} | ${pct}% |\n`;
  }

  output += `\n### Recent Routings (last 10)\n\n`;
  const recent = savings.routings.slice(-10).reverse();
  recent.forEach(r => {
    const savedStr = r.saved ? ` (saved €${r.saved.toFixed(4)})` : '';
    output += `- ${r.timestamp.split('T')[0]}: **${r.model}** - ${r.task}${savedStr}\n`;
  });

  return output;
}

// Format output
function formatAnalysis(result, format = 'text') {
  if (format === 'json') {
    return JSON.stringify(result, null, 2);
  }

  const model = MODELS[result.recommendation.model];
  const emoji = result.recommendation.model === 'haiku' ? '⚡' :
                result.recommendation.model === 'sonnet' ? '🎯' : '🧠';

  let output = `\n${emoji} **Recommended Model: ${model.name}**\n\n`;
  output += `Complexity Score: ${result.analysis.finalComplexity}/10\n`;
  output += `Confidence: ${result.recommendation.confidence}\n`;
  output += `Reason: ${result.recommendation.reason}\n\n`;

  output += `### Cost Comparison\n\n`;
  output += `| Model | Estimated Cost |\n`;
  output += `|-------|---------------|\n`;
  for (const [m, cost] of Object.entries(result.costs.estimated)) {
    const marker = m === result.recommendation.model ? ' ← RECOMMENDED' : '';
    output += `| ${MODELS[m].name} | €${cost.toFixed(4)}${marker} |\n`;
  }

  output += `\n**Savings vs Opus:** €${result.costs.savings.vsOpus.toFixed(4)} (${result.costs.savings.percentVsOpus}%)\n`;

  if (result.analysis.matchedPatterns.length > 0) {
    output += `\n### Detected Patterns\n`;
    result.analysis.matchedPatterns.forEach(p => {
      output += `- ${p.pattern}: ${p.description}\n`;
    });
  }

  if (result.analysis.modifiers.length > 0) {
    output += `\n### Complexity Modifiers\n`;
    result.analysis.modifiers.forEach(m => {
      const sign = m.modifier > 0 ? '+' : '';
      output += `- ${m.name}: ${sign}${m.modifier}\n`;
    });
  }

  return output;
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const format = args.find(a => a.startsWith('--format='))?.split('=')[1] || 'text';

  switch (command) {
    case 'analyze': {
      let taskDescription;

      const fileArg = args.find(a => a.startsWith('--file='));
      if (fileArg) {
        const filePath = fileArg.split('=')[1];
        taskDescription = readFileSync(filePath, 'utf-8');
      } else {
        taskDescription = args.slice(1).filter(a => !a.startsWith('--')).join(' ');
      }

      if (!taskDescription) {
        console.error('Usage: node model-router.mjs analyze "Task description"');
        console.error('       node model-router.mjs analyze --file=task.md');
        process.exit(1);
      }

      const result = analyzeTask(taskDescription);
      console.log(formatAnalysis(result, format));

      // Log the routing
      if (!args.includes('--dry-run')) {
        logRouting(taskDescription, result.recommendation.model);
      }
      break;
    }

    case 'recommend': {
      const typeArg = args.find(a => a.startsWith('--task-type='));
      if (!typeArg) {
        console.error('Usage: node model-router.mjs recommend --task-type=extraction');
        console.error('\nAvailable task types:');
        Object.entries(TASK_PATTERNS).forEach(([name, p]) => {
          console.error(`  ${name}: ${p.description} → ${p.model}`);
        });
        process.exit(1);
      }

      const taskType = typeArg.split('=')[1];
      const result = recommendByType(taskType);

      if (format === 'json') {
        console.log(JSON.stringify(result, null, 2));
      } else if (result.error) {
        console.error(`Error: ${result.error}`);
        console.error('Available types:', result.availableTypes.join(', '));
      } else {
        console.log(`\nTask Type: ${result.taskType}`);
        console.log(`Recommended: ${result.modelDetails.name}`);
        console.log(`Complexity: ${result.complexity}/10`);
        console.log(`Description: ${result.description}`);
      }
      break;
    }

    case 'savings': {
      console.log(showSavingsReport());
      break;
    }

    case 'models': {
      console.log('\n## Available Models\n');
      for (const [name, model] of Object.entries(MODELS)) {
        console.log(`### ${model.name}`);
        console.log(`- ID: ${model.id}`);
        console.log(`- Pricing: €${model.pricing.input}/1k in, €${model.pricing.output}/1k out`);
        console.log(`- Max Complexity: ${model.maxComplexity}/10`);
        console.log(`- Best for: ${model.strengths.join(', ')}`);
        console.log(`- ${model.description}\n`);
      }
      break;
    }

    case 'types': {
      console.log('\n## Task Types Reference\n');
      console.log('| Type | Model | Complexity | Description |');
      console.log('|------|-------|------------|-------------|');
      for (const [name, p] of Object.entries(TASK_PATTERNS)) {
        console.log(`| ${name} | ${p.model} | ${p.complexity}/10 | ${p.description} |`);
      }
      break;
    }

    default:
      console.log(`
Model Router - Intelligent model selection for cost optimization

Commands:
  analyze "task description"     Analyze task and recommend model
  analyze --file=task.md         Analyze task from file
  recommend --task-type=TYPE     Quick recommendation by task type
  savings                        Show routing savings report
  models                         List available models
  types                          List task type patterns

Options:
  --format=json                  JSON output
  --dry-run                      Don't log the routing

Examples:
  node model-router.mjs analyze "Extract all email addresses from this text"
  node model-router.mjs analyze "Design a new authentication architecture"
  node model-router.mjs recommend --task-type=extraction
  node model-router.mjs savings

Task Types (use with recommend):
  Haiku:  extraction, classification, formatting, validation, qa_factual, template
  Sonnet: code_simple, summarization, analysis_moderate, debugging, refactoring
  Opus:   architecture, complex_reasoning, ambiguous, creative_long, planning
      `);
  }
}

main().catch(console.error);
