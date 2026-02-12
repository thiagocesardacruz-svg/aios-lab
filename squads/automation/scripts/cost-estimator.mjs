#!/usr/bin/env node
/**
 * Cost Estimator
 *
 * Estimates execution costs for n8n workflows including AI tokens, API calls,
 * and infrastructure costs. Provides pricing recommendations for products.
 *
 * Usage:
 *   node cost-estimator.mjs <workflow.json>
 *   node cost-estimator.mjs <workflow.json> --executions=10000
 *   node cost-estimator.mjs --product <product-id> --tier=professional
 *
 * @squad automation
 * @agent product-engineer (Package)
 */

import fs from 'fs';
import path from 'path';

// Cost models (in EUR)
const COST_MODELS = {
  // AI Token costs (per 1k tokens)
  ai: {
    'gpt-4o': { input: 0.0025, output: 0.01 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'gpt-4-turbo': { input: 0.01, output: 0.03 },
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
    'claude-3-5-sonnet': { input: 0.003, output: 0.015 },
    'claude-3-haiku': { input: 0.00025, output: 0.00125 }
  },

  // API call costs (estimated per call)
  apis: {
    'slack': 0.0001,
    'gmail': 0.0001,
    'googleSheets': 0.0002,
    'notion': 0.0001,
    'airtable': 0.0002,
    'hubspot': 0.0003,
    'salesforce': 0.0003,
    'stripe': 0.0002,
    'twilio': 0.01,  // SMS
    'sendgrid': 0.001,  // Email
    'webhook': 0.00001,
    'httpRequest': 0.0001
  },

  // n8n infrastructure (per execution)
  n8n: {
    cloud: 0.001,  // n8n Cloud per execution
    selfHosted: 0.0002  // Estimated server cost
  },

  // Data processing
  data: {
    perMB: 0.0001,
    perRecord: 0.00001
  }
};

// Average token usage by operation type
const TOKEN_ESTIMATES = {
  classification: { input: 200, output: 50 },
  summarization: { input: 1000, output: 300 },
  extraction: { input: 500, output: 200 },
  generation: { input: 300, output: 500 },
  chat: { input: 500, output: 400 },
  agent: { input: 1500, output: 800 }
};

class CostEstimator {
  constructor(options = {}) {
    this.verbose = options.verbose || false;
    this.executionsPerMonth = options.executions || 1000;
    this.infrastructure = options.infrastructure || 'cloud';
  }

  async estimate(workflowPath) {
    console.log('\n💰 Cost Estimator');
    console.log('═'.repeat(50));

    // Load workflow
    let workflow;
    try {
      const content = fs.readFileSync(workflowPath, 'utf8');
      workflow = JSON.parse(content);
    } catch (error) {
      console.error(`❌ Failed to load workflow: ${error.message}`);
      return { success: false, error: error.message };
    }

    console.log(`\nWorkflow: ${workflow.name}`);
    console.log(`Estimated executions/month: ${this.executionsPerMonth.toLocaleString()}`);
    console.log('');

    // Analyze nodes
    const analysis = this.analyzeNodes(workflow.nodes);

    // Calculate costs
    const costs = this.calculateCosts(analysis);

    // Display results
    this.displayResults(analysis, costs);

    // Pricing recommendations
    const pricing = this.recommendPricing(costs);
    this.displayPricingRecommendations(pricing);

    return {
      success: true,
      workflow: workflow.name,
      analysis,
      costs,
      pricing
    };
  }

  analyzeNodes(nodes) {
    const analysis = {
      totalNodes: nodes.length,
      aiNodes: [],
      apiNodes: [],
      codeNodes: [],
      dataNodes: [],
      triggerType: null,
      complexity: 'simple'
    };

    for (const node of nodes) {
      const type = node.type.toLowerCase();

      // Identify trigger
      if (type.includes('trigger') || type.includes('webhook')) {
        analysis.triggerType = type.includes('webhook') ? 'webhook' :
                               type.includes('schedule') ? 'schedule' : 'manual';
      }

      // AI nodes
      if (type.includes('langchain') || type.includes('openai') || type.includes('agent')) {
        const aiModel = this.detectAIModel(node);
        const operation = this.detectAIOperation(node);
        analysis.aiNodes.push({
          name: node.name,
          model: aiModel,
          operation,
          tokens: TOKEN_ESTIMATES[operation] || TOKEN_ESTIMATES.chat
        });
      }

      // API nodes
      else if (this.isAPINode(type)) {
        const apiType = this.detectAPIType(type);
        analysis.apiNodes.push({
          name: node.name,
          type: apiType,
          costPerCall: COST_MODELS.apis[apiType] || COST_MODELS.apis.httpRequest
        });
      }

      // Code nodes
      else if (type.includes('code') || type.includes('function')) {
        analysis.codeNodes.push({ name: node.name });
      }

      // Data processing nodes
      else if (type.includes('set') || type.includes('merge') || type.includes('split')) {
        analysis.dataNodes.push({ name: node.name });
      }
    }

    // Determine complexity
    if (analysis.aiNodes.length > 0 && analysis.totalNodes > 10) {
      analysis.complexity = 'complex';
    } else if (analysis.aiNodes.length > 0 || analysis.totalNodes > 5) {
      analysis.complexity = 'medium';
    }

    return analysis;
  }

  detectAIModel(node) {
    const params = JSON.stringify(node.parameters || {}).toLowerCase();

    if (params.includes('gpt-4o-mini')) return 'gpt-4o-mini';
    if (params.includes('gpt-4o')) return 'gpt-4o';
    if (params.includes('gpt-4-turbo')) return 'gpt-4-turbo';
    if (params.includes('gpt-3.5')) return 'gpt-3.5-turbo';
    if (params.includes('claude-3-5-sonnet') || params.includes('sonnet')) return 'claude-3-5-sonnet';
    if (params.includes('claude-3-haiku') || params.includes('haiku')) return 'claude-3-haiku';

    // Default to gpt-4o-mini as it's common
    return 'gpt-4o-mini';
  }

  detectAIOperation(node) {
    const params = JSON.stringify(node.parameters || {}).toLowerCase();
    const name = node.name.toLowerCase();
    const type = node.type.toLowerCase();

    if (type.includes('agent')) return 'agent';
    if (params.includes('classif') || name.includes('classif')) return 'classification';
    if (params.includes('summar') || name.includes('summar')) return 'summarization';
    if (params.includes('extract') || name.includes('extract')) return 'extraction';
    if (params.includes('generat') || name.includes('generat')) return 'generation';

    return 'chat';
  }

  isAPINode(type) {
    const apiTypes = Object.keys(COST_MODELS.apis);
    return apiTypes.some(api => type.includes(api.toLowerCase()));
  }

  detectAPIType(type) {
    for (const api of Object.keys(COST_MODELS.apis)) {
      if (type.includes(api.toLowerCase())) {
        return api;
      }
    }
    return 'httpRequest';
  }

  calculateCosts(analysis) {
    const costs = {
      ai: { perExecution: 0, monthly: 0, breakdown: [] },
      api: { perExecution: 0, monthly: 0, breakdown: [] },
      infrastructure: { perExecution: 0, monthly: 0 },
      total: { perExecution: 0, monthly: 0 }
    };

    // AI costs
    for (const aiNode of analysis.aiNodes) {
      const model = COST_MODELS.ai[aiNode.model] || COST_MODELS.ai['gpt-4o-mini'];
      const tokens = aiNode.tokens;

      const inputCost = (tokens.input / 1000) * model.input;
      const outputCost = (tokens.output / 1000) * model.output;
      const nodeCost = inputCost + outputCost;

      costs.ai.perExecution += nodeCost;
      costs.ai.breakdown.push({
        node: aiNode.name,
        model: aiNode.model,
        tokens: tokens.input + tokens.output,
        cost: nodeCost
      });
    }
    costs.ai.monthly = costs.ai.perExecution * this.executionsPerMonth;

    // API costs
    for (const apiNode of analysis.apiNodes) {
      costs.api.perExecution += apiNode.costPerCall;
      costs.api.breakdown.push({
        node: apiNode.name,
        type: apiNode.type,
        cost: apiNode.costPerCall
      });
    }
    costs.api.monthly = costs.api.perExecution * this.executionsPerMonth;

    // Infrastructure costs
    costs.infrastructure.perExecution = COST_MODELS.n8n[this.infrastructure];
    costs.infrastructure.monthly = costs.infrastructure.perExecution * this.executionsPerMonth;

    // Totals
    costs.total.perExecution = costs.ai.perExecution + costs.api.perExecution + costs.infrastructure.perExecution;
    costs.total.monthly = costs.total.perExecution * this.executionsPerMonth;

    return costs;
  }

  displayResults(analysis, costs) {
    console.log('─'.repeat(50));
    console.log('📊 WORKFLOW ANALYSIS');
    console.log('─'.repeat(50));
    console.log(`Total nodes: ${analysis.totalNodes}`);
    console.log(`AI nodes: ${analysis.aiNodes.length}`);
    console.log(`API nodes: ${analysis.apiNodes.length}`);
    console.log(`Complexity: ${analysis.complexity}`);
    console.log(`Trigger: ${analysis.triggerType || 'manual'}`);

    console.log('\n─'.repeat(50));
    console.log('💵 COST BREAKDOWN');
    console.log('─'.repeat(50));

    // AI costs
    if (costs.ai.breakdown.length > 0) {
      console.log('\n🤖 AI Costs:');
      for (const item of costs.ai.breakdown) {
        console.log(`   ${item.node}`);
        console.log(`     Model: ${item.model}, ~${item.tokens} tokens`);
        console.log(`     Cost: €${item.cost.toFixed(5)}/exec`);
      }
      console.log(`   Subtotal: €${costs.ai.perExecution.toFixed(5)}/exec | €${costs.ai.monthly.toFixed(2)}/month`);
    }

    // API costs
    if (costs.api.breakdown.length > 0) {
      console.log('\n🔌 API Costs:');
      for (const item of costs.api.breakdown) {
        console.log(`   ${item.node} (${item.type}): €${item.cost.toFixed(5)}/call`);
      }
      console.log(`   Subtotal: €${costs.api.perExecution.toFixed(5)}/exec | €${costs.api.monthly.toFixed(2)}/month`);
    }

    // Infrastructure
    console.log('\n🖥️  Infrastructure:');
    console.log(`   n8n ${this.infrastructure}: €${costs.infrastructure.perExecution.toFixed(5)}/exec`);
    console.log(`   Subtotal: €${costs.infrastructure.monthly.toFixed(2)}/month`);

    // Total
    console.log('\n═'.repeat(50));
    console.log('💰 TOTAL COSTS');
    console.log('═'.repeat(50));
    console.log(`Per execution: €${costs.total.perExecution.toFixed(5)}`);
    console.log(`Monthly (${this.executionsPerMonth.toLocaleString()} exec): €${costs.total.monthly.toFixed(2)}`);
    console.log(`Yearly estimate: €${(costs.total.monthly * 12).toFixed(2)}`);
  }

  recommendPricing(costs) {
    // Calculate minimum prices for different margins
    const margins = {
      minimum: 0.3,   // 30% margin
      target: 0.6,    // 60% margin
      premium: 0.75   // 75% margin
    };

    const recommendations = {};

    // For different execution volumes
    const volumes = {
      starter: 1000,
      professional: 10000,
      enterprise: 50000
    };

    for (const [tier, volume] of Object.entries(volumes)) {
      const monthlyCost = costs.total.perExecution * volume;

      recommendations[tier] = {
        volume,
        cost: monthlyCost,
        prices: {
          minimum: Math.ceil(monthlyCost / (1 - margins.minimum)),
          target: Math.ceil(monthlyCost / (1 - margins.target)),
          premium: Math.ceil(monthlyCost / (1 - margins.premium))
        }
      };
    }

    return recommendations;
  }

  displayPricingRecommendations(pricing) {
    console.log('\n─'.repeat(50));
    console.log('💡 PRICING RECOMMENDATIONS');
    console.log('─'.repeat(50));
    console.log('\nBased on costs and target margins:\n');

    console.log('| Tier | Volume | Cost | Min (30%) | Target (60%) | Premium (75%) |');
    console.log('|------|--------|------|-----------|--------------|---------------|');

    for (const [tier, data] of Object.entries(pricing)) {
      console.log(
        `| ${tier.padEnd(6)} | ${data.volume.toLocaleString().padStart(6)} | ` +
        `€${data.cost.toFixed(0).padStart(4)} | ` +
        `€${data.prices.minimum.toString().padStart(4)}/mo | ` +
        `€${data.prices.target.toString().padStart(5)}/mo | ` +
        `€${data.prices.premium.toString().padStart(6)}/mo |`
      );
    }

    console.log('\nRecommended pricing strategy:');
    console.log(`  Starter:      €${pricing.starter.prices.target}/month (${pricing.starter.volume.toLocaleString()} exec)`);
    console.log(`  Professional: €${pricing.professional.prices.target}/month (${pricing.professional.volume.toLocaleString()} exec)`);
    console.log(`  Enterprise:   €${pricing.enterprise.prices.premium}/month (${pricing.enterprise.volume.toLocaleString()} exec)`);
  }

  // Quick estimate for a product tier
  async estimateProduct(productId, tier) {
    console.log(`\n💰 Product Cost Estimate: ${productId}`);
    console.log(`   Tier: ${tier}`);

    const volumes = {
      starter: 1000,
      professional: 10000,
      enterprise: 50000
    };

    const executions = volumes[tier] || 1000;
    console.log(`   Executions/month: ${executions.toLocaleString()}`);

    // Try to load product spec
    const productDir = path.join(process.cwd(), '..', '..', 'products', productId);
    const workflowPath = path.join(productDir, 'workflows', 'main.json');

    if (fs.existsSync(workflowPath)) {
      this.executionsPerMonth = executions;
      return await this.estimate(workflowPath);
    } else {
      console.error(`Product workflow not found: ${workflowPath}`);
      return { success: false, error: 'Product not found' };
    }
  }

  // Compare costs across different AI models
  compareModels(workflow) {
    console.log('\n🔄 Model Cost Comparison');
    console.log('─'.repeat(50));

    const models = Object.keys(COST_MODELS.ai);
    const results = [];

    for (const model of models) {
      // Estimate with each model
      let totalCost = 0;
      const nodes = workflow.nodes.filter(n =>
        n.type.toLowerCase().includes('langchain') ||
        n.type.toLowerCase().includes('openai')
      );

      for (const node of nodes) {
        const operation = this.detectAIOperation(node);
        const tokens = TOKEN_ESTIMATES[operation] || TOKEN_ESTIMATES.chat;
        const costs = COST_MODELS.ai[model];

        const inputCost = (tokens.input / 1000) * costs.input;
        const outputCost = (tokens.output / 1000) * costs.output;
        totalCost += inputCost + outputCost;
      }

      results.push({ model, perExecution: totalCost, monthly: totalCost * this.executionsPerMonth });
    }

    // Sort by cost
    results.sort((a, b) => a.perExecution - b.perExecution);

    console.log('\n| Model | Per Execution | Monthly |');
    console.log('|-------|---------------|---------|');
    for (const r of results) {
      console.log(`| ${r.model.padEnd(18)} | €${r.perExecution.toFixed(5).padStart(11)} | €${r.monthly.toFixed(2).padStart(7)} |`);
    }

    const savings = results[results.length - 1].monthly - results[0].monthly;
    console.log(`\nPotential savings (cheapest vs most expensive): €${savings.toFixed(2)}/month`);

    return results;
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Cost Estimator - Estimate n8n workflow execution costs

Usage:
  node cost-estimator.mjs <workflow.json> [options]
  node cost-estimator.mjs --product <product-id> --tier=<tier>

Options:
  --executions=<n>     Monthly execution count (default: 1000)
  --infrastructure=<type>  cloud or selfHosted (default: cloud)
  --compare-models     Compare costs across different AI models
  --verbose            Show detailed output
  --json               Output as JSON

Examples:
  node cost-estimator.mjs workflow.json
  node cost-estimator.mjs workflow.json --executions=10000
  node cost-estimator.mjs workflow.json --compare-models
  node cost-estimator.mjs --product lead-qualifier --tier=professional
`);
    process.exit(0);
  }

  // Parse options
  const options = {
    verbose: args.includes('--verbose'),
    executions: 1000,
    infrastructure: 'cloud'
  };

  const execArg = args.find(a => a.startsWith('--executions='));
  if (execArg) {
    options.executions = parseInt(execArg.split('=')[1], 10);
  }

  const infraArg = args.find(a => a.startsWith('--infrastructure='));
  if (infraArg) {
    options.infrastructure = infraArg.split('=')[1];
  }

  const estimator = new CostEstimator(options);

  // Product mode
  if (args.includes('--product')) {
    const idx = args.indexOf('--product') + 1;
    const productId = args[idx];
    const tierArg = args.find(a => a.startsWith('--tier='));
    const tier = tierArg ? tierArg.split('=')[1] : 'starter';

    const result = await estimator.estimateProduct(productId, tier);
    if (args.includes('--json')) {
      console.log(JSON.stringify(result, null, 2));
    }
    process.exit(result.success ? 0 : 1);
  }

  // Workflow mode
  const workflowPath = args.find(a => !a.startsWith('--'));
  if (!workflowPath) {
    console.error('Please provide a workflow file path');
    process.exit(1);
  }

  if (!fs.existsSync(workflowPath)) {
    console.error(`File not found: ${workflowPath}`);
    process.exit(1);
  }

  // Compare models if requested
  if (args.includes('--compare-models')) {
    const content = fs.readFileSync(workflowPath, 'utf8');
    const workflow = JSON.parse(content);
    estimator.compareModels(workflow);
    console.log('');
  }

  const result = await estimator.estimate(workflowPath);

  if (args.includes('--json')) {
    console.log(JSON.stringify(result, null, 2));
  }

  process.exit(result.success ? 0 : 1);
}

main().catch(console.error);
