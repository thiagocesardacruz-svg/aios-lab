#!/usr/bin/env node
/**
 * Product Packager
 *
 * Transforms n8n workflows into sellable white-label products.
 * Generates complete product packages with documentation, pricing, and sales materials.
 *
 * Usage:
 *   node product-packager.mjs <workflow.json> --name="Product Name" --tier=professional
 *   node product-packager.mjs --from-spec <product-spec.yaml>
 *   node product-packager.mjs --list
 *
 * @squad automation
 * @agent product-engineer (Package)
 */

import fs from 'fs';
import path from 'path';

// Product categories
const CATEGORIES = {
  acquisition: {
    name: 'Acquisition',
    description: 'Lead generation and capture',
    basePrice: { starter: 47, professional: 97, enterprise: 297 }
  },
  conversion: {
    name: 'Conversion',
    description: 'Sales and closing automation',
    basePrice: { starter: 67, professional: 147, enterprise: 397 }
  },
  content: {
    name: 'Content',
    description: 'Content creation and distribution',
    basePrice: { starter: 37, professional: 87, enterprise: 247 }
  },
  data: {
    name: 'Data',
    description: 'Analytics and intelligence',
    basePrice: { starter: 57, professional: 127, enterprise: 347 }
  },
  retention: {
    name: 'Retention',
    description: 'Customer success and engagement',
    basePrice: { starter: 47, professional: 97, enterprise: 297 }
  }
};

// Pricing tiers
const TIERS = {
  starter: {
    name: 'Starter',
    multiplier: 1.0,
    features: ['Basic workflow', 'Email support', '1 user'],
    limits: { executions: 1000, integrations: 3 }
  },
  professional: {
    name: 'Professional',
    multiplier: 2.0,
    features: ['Full workflow', 'Priority support', '5 users', 'Customization'],
    limits: { executions: 10000, integrations: 10 }
  },
  enterprise: {
    name: 'Enterprise',
    multiplier: 3.0,
    features: ['White-label', 'Dedicated support', 'Unlimited users', 'SLA'],
    limits: { executions: 'unlimited', integrations: 'unlimited' }
  }
};

// Template paths
const TEMPLATES_DIR = path.join(process.cwd(), 'templates');
const PRODUCTS_DIR = path.join(process.cwd(), '..', '..', 'products');

class ProductPackager {
  constructor(options = {}) {
    this.verbose = options.verbose || false;
    this.outputDir = options.outputDir || PRODUCTS_DIR;
    this.dryRun = options.dryRun || false;
  }

  async package(workflowPath, productConfig) {
    console.log('\n📦 Product Packager');
    console.log('═'.repeat(50));

    // Load and analyze workflow
    let workflow;
    try {
      const content = fs.readFileSync(workflowPath, 'utf8');
      workflow = JSON.parse(content);
    } catch (error) {
      console.error(`❌ Failed to load workflow: ${error.message}`);
      return { success: false, error: error.message };
    }

    // Analyze workflow complexity
    const analysis = this.analyzeWorkflow(workflow);
    console.log('\n🔍 Workflow Analysis:');
    console.log(`   Name: ${workflow.name}`);
    console.log(`   Nodes: ${analysis.nodeCount}`);
    console.log(`   Complexity: ${analysis.complexity}`);
    console.log(`   Has AI: ${analysis.hasAI ? 'Yes' : 'No'}`);
    console.log(`   Integrations: ${analysis.integrations.join(', ') || 'None'}`);

    // Generate product ID
    const productId = productConfig.id || this.generateProductId(productConfig.name);
    const productDir = path.join(this.outputDir, productId);

    console.log(`\n📁 Product: ${productConfig.name}`);
    console.log(`   ID: ${productId}`);
    console.log(`   Category: ${productConfig.category}`);
    console.log(`   Output: ${productDir}`);

    if (this.dryRun) {
      console.log('\n🏃 DRY RUN - Would create product package');
      return { success: true, dryRun: true, productId };
    }

    // Create product directory structure
    this.ensureDir(productDir);
    this.ensureDir(path.join(productDir, 'docs'));
    this.ensureDir(path.join(productDir, 'sales'));
    this.ensureDir(path.join(productDir, 'workflows'));

    // Generate product files
    console.log('\n🔧 Generating product files:');

    // 1. Product specification
    const spec = this.generateProductSpec(workflow, analysis, productConfig);
    this.writeFile(path.join(productDir, 'spec.yaml'), spec);
    console.log('   ✅ spec.yaml');

    // 2. Workflow (sanitized for distribution)
    const sanitizedWorkflow = this.sanitizeWorkflow(workflow);
    this.writeFile(
      path.join(productDir, 'workflows', 'main.json'),
      JSON.stringify(sanitizedWorkflow, null, 2)
    );
    console.log('   ✅ workflows/main.json');

    // 3. User guide
    const userGuide = this.generateUserGuide(workflow, analysis, productConfig);
    this.writeFile(path.join(productDir, 'docs', 'user-guide.md'), userGuide);
    console.log('   ✅ docs/user-guide.md');

    // 4. Setup guide
    const setupGuide = this.generateSetupGuide(workflow, analysis, productConfig);
    this.writeFile(path.join(productDir, 'docs', 'setup-guide.md'), setupGuide);
    console.log('   ✅ docs/setup-guide.md');

    // 5. FAQ
    const faq = this.generateFAQ(analysis, productConfig);
    this.writeFile(path.join(productDir, 'docs', 'faq.md'), faq);
    console.log('   ✅ docs/faq.md');

    // 6. Sales one-pager
    const onePager = this.generateOnePager(analysis, productConfig);
    this.writeFile(path.join(productDir, 'sales', 'one-pager.md'), onePager);
    console.log('   ✅ sales/one-pager.md');

    // 7. Pricing table
    const pricing = this.generatePricingTable(analysis, productConfig);
    this.writeFile(path.join(productDir, 'sales', 'pricing.md'), pricing);
    console.log('   ✅ sales/pricing.md');

    // 8. README
    const readme = this.generateProductReadme(productConfig, analysis);
    this.writeFile(path.join(productDir, 'README.md'), readme);
    console.log('   ✅ README.md');

    console.log('\n═'.repeat(50));
    console.log('✅ PRODUCT PACKAGED SUCCESSFULLY');
    console.log(`   Product ID: ${productId}`);
    console.log(`   Location: ${productDir}`);
    console.log(`   Files: 8`);
    console.log('═'.repeat(50));

    return {
      success: true,
      productId,
      productDir,
      analysis
    };
  }

  analyzeWorkflow(workflow) {
    const nodes = workflow.nodes || [];
    const connections = workflow.connections || {};

    // Count node types
    const nodeTypes = {};
    let hasAI = false;
    const integrations = new Set();

    for (const node of nodes) {
      const type = node.type;
      nodeTypes[type] = (nodeTypes[type] || 0) + 1;

      // Check for AI
      if (type.includes('langchain') || type.includes('openAi')) {
        hasAI = true;
      }

      // Extract integrations
      const integration = this.extractIntegration(type);
      if (integration) {
        integrations.add(integration);
      }
    }

    // Calculate complexity
    const nodeCount = nodes.length;
    const connectionCount = Object.values(connections).reduce(
      (sum, c) => sum + Object.values(c).flat().flat().length, 0
    );

    let complexity = 'simple';
    if (nodeCount > 10 || hasAI) complexity = 'medium';
    if (nodeCount > 20 || (hasAI && nodeCount > 10)) complexity = 'complex';

    // Estimate execution cost
    const estimatedCost = this.estimateExecutionCost(nodes, hasAI);

    return {
      nodeCount,
      connectionCount,
      nodeTypes,
      complexity,
      hasAI,
      integrations: Array.from(integrations),
      estimatedCost
    };
  }

  extractIntegration(nodeType) {
    const integrationMap = {
      'slack': 'Slack',
      'gmail': 'Gmail',
      'googleSheets': 'Google Sheets',
      'notion': 'Notion',
      'airtable': 'Airtable',
      'hubspot': 'HubSpot',
      'salesforce': 'Salesforce',
      'stripe': 'Stripe',
      'openAi': 'OpenAI',
      'postgres': 'PostgreSQL',
      'mysql': 'MySQL',
      'mongodb': 'MongoDB',
      'supabase': 'Supabase'
    };

    for (const [key, name] of Object.entries(integrationMap)) {
      if (nodeType.toLowerCase().includes(key.toLowerCase())) {
        return name;
      }
    }
    return null;
  }

  estimateExecutionCost(nodes, hasAI) {
    // Base cost per execution
    let cost = 0.001; // €0.001 base

    // Add for each node
    cost += nodes.length * 0.0001;

    // Add for AI
    if (hasAI) {
      cost += 0.01; // ~1000 tokens average
    }

    // Add for external APIs
    const apiNodes = nodes.filter(n =>
      n.type.includes('httpRequest') ||
      n.type.includes('Api')
    );
    cost += apiNodes.length * 0.001;

    return {
      perExecution: cost,
      monthly1000: cost * 1000,
      monthly10000: cost * 10000
    };
  }

  generateProductId(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  sanitizeWorkflow(workflow) {
    // Remove sensitive data, keep structure
    const sanitized = JSON.parse(JSON.stringify(workflow));

    // Remove credentials
    for (const node of sanitized.nodes) {
      if (node.credentials) {
        for (const key of Object.keys(node.credentials)) {
          node.credentials[key] = { name: `Configure ${key}` };
        }
      }
    }

    // Add product metadata
    sanitized.meta = sanitized.meta || {};
    sanitized.meta.isProduct = true;
    sanitized.meta.packagedAt = new Date().toISOString();

    return sanitized;
  }

  generateProductSpec(workflow, analysis, config) {
    const category = CATEGORIES[config.category] || CATEGORIES.data;
    const pricing = this.calculatePricing(analysis, category, config);

    return `# Product Specification: ${config.name}

## Product Identity

| Field | Value |
|-------|-------|
| **Product ID** | \`${config.id || this.generateProductId(config.name)}\` |
| **Product Name** | ${config.name} |
| **Version** | 1.0.0 |
| **Category** | ${config.category} |
| **Status** | development |

## Tagline

> ${config.tagline || 'Automate your workflow with AI-powered efficiency'}

## Description

### Short
${config.description || workflow.meta?.description || 'An automated workflow that streamlines your operations.'}

### Long
${config.longDescription || 'This product provides a complete automation solution that integrates with your existing tools and processes. Built on enterprise-grade infrastructure, it delivers reliable performance while reducing manual work.'}

---

## Technical Specification

### Workflow Details

| Property | Value |
|----------|-------|
| Workflow File | \`workflows/main.json\` |
| Complexity | ${analysis.complexity} |
| Nodes Count | ${analysis.nodeCount} |
| Has AI | ${analysis.hasAI ? 'Yes' : 'No'} |

### Integrations Required

| Integration | Required | Purpose |
|-------------|----------|---------|
${analysis.integrations.map(i => `| ${i} | Yes | Core integration |`).join('\n') || '| None | - | - |'}

### Cost per Execution

| Component | Cost |
|-----------|------|
| Base execution | €${analysis.estimatedCost.perExecution.toFixed(4)} |
| Monthly (1,000 runs) | €${analysis.estimatedCost.monthly1000.toFixed(2)} |
| Monthly (10,000 runs) | €${analysis.estimatedCost.monthly10000.toFixed(2)} |

---

## Pricing

### Model: Tiered Subscription

| Tier | Price | Target | Limits |
|------|-------|--------|--------|
| Starter | €${pricing.starter}/mo | Small teams | ${TIERS.starter.limits.executions} exec/mo |
| Professional | €${pricing.professional}/mo | Growing businesses | ${TIERS.professional.limits.executions} exec/mo |
| Enterprise | €${pricing.enterprise}/mo | Large organizations | Unlimited |

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Time saved | 10+ hours/week | User surveys |
| Error reduction | 90% fewer errors | Error tracking |
| Adoption rate | 80% within 30 days | Usage analytics |

---

## Files

| File | Path |
|------|------|
| Product Spec | \`spec.yaml\` |
| Workflow | \`workflows/main.json\` |
| User Guide | \`docs/user-guide.md\` |
| Setup Guide | \`docs/setup-guide.md\` |
| FAQ | \`docs/faq.md\` |
| One-Pager | \`sales/one-pager.md\` |
| Pricing | \`sales/pricing.md\` |

---

## Metadata

| Field | Value |
|-------|-------|
| Created At | ${new Date().toISOString().split('T')[0]} |
| Created By | @product-engineer |
| Source Workflow | ${workflow.name} |

---

*Product packaged by AIOS squad-automation*
`;
  }

  calculatePricing(analysis, category, config) {
    const base = category.basePrice;

    // Adjust for complexity
    let complexityMultiplier = 1.0;
    if (analysis.complexity === 'medium') complexityMultiplier = 1.5;
    if (analysis.complexity === 'complex') complexityMultiplier = 2.0;

    // Adjust for AI
    const aiMultiplier = analysis.hasAI ? 1.3 : 1.0;

    // Calculate final prices
    return {
      starter: Math.round(base.starter * complexityMultiplier * aiMultiplier),
      professional: Math.round(base.professional * complexityMultiplier * aiMultiplier),
      enterprise: Math.round(base.enterprise * complexityMultiplier * aiMultiplier)
    };
  }

  generateUserGuide(workflow, analysis, config) {
    return `# ${config.name} - User Guide

## Introduction

Welcome to ${config.name}! This guide will help you get the most out of your automation.

## What This Product Does

${config.description || 'This automation streamlines your workflow by connecting your tools and automating repetitive tasks.'}

## Getting Started

### Prerequisites

Before using this product, make sure you have:

${analysis.integrations.map(i => `- [ ] ${i} account with API access`).join('\n') || '- [ ] n8n instance running'}

### Quick Start

1. Import the workflow into your n8n instance
2. Configure the required credentials
3. Test with sample data
4. Activate for production use

## Features

### Core Features (All Tiers)

- Automated workflow execution
- Error handling and notifications
- Activity logging

### Professional Features

- Custom configurations
- Priority support
- Extended limits

### Enterprise Features

- White-label customization
- Dedicated support
- SLA guarantees

## How to Use

### Step 1: Configure Your Settings

After installation, update the configuration with your specific settings:

- API keys for integrations
- Notification preferences
- Custom field mappings

### Step 2: Test the Workflow

Run a test execution to ensure everything is connected properly:

1. Open the workflow in n8n
2. Click "Execute Workflow"
3. Verify the results

### Step 3: Activate

Once testing is complete:

1. Toggle the workflow to "Active"
2. Monitor the first few executions
3. You're good to go!

## Troubleshooting

### Common Issues

**Issue: Workflow doesn't trigger**
- Check that the trigger is properly configured
- Verify the workflow is active

**Issue: API errors**
- Confirm credentials are valid
- Check rate limits

**Issue: Data not appearing**
- Verify field mappings
- Check data format

## Support

- **Documentation**: Check our FAQ first
- **Email**: support@example.com
- **Response Time**: Based on your tier (see SLA)

---

*${config.name} v1.0.0 - User Guide*
`;
  }

  generateSetupGuide(workflow, analysis, config) {
    return `# ${config.name} - Setup Guide

## Overview

This guide walks you through setting up ${config.name} in your n8n instance.

**Estimated Setup Time**: 15-30 minutes

## Prerequisites

### n8n Instance

You need an n8n instance. Options:
- n8n Cloud (recommended)
- Self-hosted n8n
- n8n Desktop

### Required Accounts

${analysis.integrations.map(i => `- **${i}**: Account with API access`).join('\n') || '- No external accounts required'}

## Step-by-Step Setup

### Step 1: Import Workflow

1. Open your n8n instance
2. Go to **Workflows** > **Import from File**
3. Select \`workflows/main.json\`
4. Click **Import**

### Step 2: Configure Credentials

For each integration, set up credentials:

${analysis.integrations.map(i => `
#### ${i}

1. Go to **Credentials** > **Add Credential**
2. Select **${i}**
3. Enter your API key/OAuth details
4. Click **Save**
`).join('\n') || 'No credentials needed for this workflow.'}

### Step 3: Configure Settings

Open the workflow and update these nodes:

| Node | Setting | Description |
|------|---------|-------------|
| Config | All settings | Your custom configuration |

### Step 4: Test

1. Click **Execute Workflow**
2. Check each node for errors
3. Verify output data

### Step 5: Activate

1. Toggle **Active** switch
2. Monitor first 5-10 executions
3. Set up error notifications

## Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| \`NOTIFICATION_CHANNEL\` | email | Where to send alerts |
| \`RETRY_COUNT\` | 3 | Number of retry attempts |
| \`LOG_LEVEL\` | info | Logging verbosity |

## Security Checklist

- [ ] All credentials stored in n8n credential store
- [ ] No hardcoded API keys in workflow
- [ ] Webhook authentication enabled (if applicable)
- [ ] Minimum required permissions configured

## Post-Setup Verification

Run through this checklist after setup:

- [ ] Workflow imports without errors
- [ ] All credentials configured
- [ ] Test execution successful
- [ ] Error handling works
- [ ] Notifications sent correctly

## Troubleshooting

### Import Fails

1. Check n8n version compatibility
2. Verify JSON file is not corrupted
3. Try importing to a new workspace

### Credentials Not Working

1. Verify API key is correct
2. Check scope/permissions
3. Regenerate if needed

### Test Execution Errors

1. Check error message in node
2. Verify data format
3. Contact support if persists

## Support

Need help? Contact us:

- **Email**: support@example.com
- **Documentation**: See user-guide.md
- **Community**: n8n Community Forum

---

*${config.name} v1.0.0 - Setup Guide*
`;
  }

  generateFAQ(analysis, config) {
    return `# ${config.name} - Frequently Asked Questions

## General Questions

### What is ${config.name}?

${config.description || 'An automation product that streamlines your workflow.'}

### What do I need to use this product?

- An n8n instance (Cloud, self-hosted, or Desktop)
${analysis.integrations.map(i => `- ${i} account with API access`).join('\n')}

### How long does setup take?

Typical setup takes 15-30 minutes, depending on your familiarity with n8n.

## Technical Questions

### Which n8n version is required?

This product requires n8n version 1.0.0 or later.

### Does this use AI?

${analysis.hasAI ? 'Yes, this product includes AI-powered features using OpenAI or similar providers.' : 'No, this product does not require AI services.'}

### How many executions can I run?

| Tier | Monthly Executions |
|------|-------------------|
| Starter | ${TIERS.starter.limits.executions} |
| Professional | ${TIERS.professional.limits.executions} |
| Enterprise | Unlimited |

## Pricing Questions

### What's included in each tier?

**Starter**:
${TIERS.starter.features.map(f => `- ${f}`).join('\n')}

**Professional**:
${TIERS.professional.features.map(f => `- ${f}`).join('\n')}

**Enterprise**:
${TIERS.enterprise.features.map(f => `- ${f}`).join('\n')}

### Can I upgrade my tier?

Yes! Contact support to upgrade at any time. You'll be credited for unused time.

### Is there a free trial?

Contact sales for trial options.

## Support Questions

### How do I get support?

- **Starter**: Email support (48h response)
- **Professional**: Priority email + chat (24h response)
- **Enterprise**: Dedicated support (4h response)

### What's covered under support?

- Setup assistance
- Configuration help
- Bug fixes
- Feature questions

### What's NOT covered?

- Custom development (available separately)
- Third-party integration issues
- Infrastructure problems

## Troubleshooting

### The workflow won't start

1. Check if workflow is activated
2. Verify trigger configuration
3. Check execution logs for errors

### I'm getting API errors

1. Verify credentials are current
2. Check if API limits were reached
3. Ensure required permissions

### Data isn't flowing correctly

1. Check field mappings
2. Verify data format matches expectations
3. Test with sample data

---

## Still have questions?

Contact us at support@example.com

---

*${config.name} v1.0.0 - FAQ*
`;
  }

  generateOnePager(analysis, config) {
    const category = CATEGORIES[config.category] || CATEGORIES.data;
    const pricing = this.calculatePricing(analysis, category, config);

    return `# ${config.name}

## The Problem

[Target audience] spends too much time on [manual process], leading to:
- ❌ Wasted hours on repetitive tasks
- ❌ Human errors and inconsistencies
- ❌ Slow response times
- ❌ Missed opportunities

## The Solution

**${config.name}** automates your entire workflow:

${config.tagline || '> Save hours every week with intelligent automation'}

### Key Benefits

✅ **Save Time** - Automate ${analysis.nodeCount}+ manual steps
✅ **Reduce Errors** - Consistent, reliable execution every time
✅ **Scale Effortlessly** - Handle 10x volume without extra work
${analysis.hasAI ? '✅ **AI-Powered** - Intelligent decisions built-in' : ''}

### How It Works

\`\`\`
1. [Trigger] → 2. [Process] → 3. [Output]
      ↓              ↓              ↓
  Automatic      AI-powered      Results
   start         processing      delivered
\`\`\`

## Integrations

Works with your existing tools:

${analysis.integrations.map(i => `✓ ${i}`).join('  |  ') || 'Standalone operation'}

## Pricing

| | Starter | Professional | Enterprise |
|---|:---:|:---:|:---:|
| **Price** | €${pricing.starter}/mo | €${pricing.professional}/mo | €${pricing.enterprise}/mo |
| Executions | ${TIERS.starter.limits.executions} | ${TIERS.professional.limits.executions} | Unlimited |
| Support | Email | Priority | Dedicated |
| Users | 1 | 5 | Unlimited |

## Get Started

1. **Schedule Demo** - See it in action (15 min)
2. **Quick Setup** - We'll help you configure (30 min)
3. **Go Live** - Start saving time today

---

📧 **Contact**: sales@example.com
🌐 **Website**: example.com/products/${config.id || this.generateProductId(config.name)}

---

*${config.name} by Travel Tech Digital*
`;
  }

  generatePricingTable(analysis, config) {
    const category = CATEGORIES[config.category] || CATEGORIES.data;
    const pricing = this.calculatePricing(analysis, category, config);

    return `# ${config.name} - Pricing

## Plans & Pricing

| Feature | Starter | Professional | Enterprise |
|---------|:-------:|:------------:|:----------:|
| **Monthly Price** | **€${pricing.starter}** | **€${pricing.professional}** | **€${pricing.enterprise}** |
| Annual Price | €${Math.round(pricing.starter * 10)} | €${Math.round(pricing.professional * 10)} | €${Math.round(pricing.enterprise * 10)} |
| | (2 months free) | (2 months free) | (2 months free) |

## Feature Comparison

| Feature | Starter | Professional | Enterprise |
|---------|:-------:|:------------:|:----------:|
| **Core Workflow** | ✅ | ✅ | ✅ |
| **Executions/month** | ${TIERS.starter.limits.executions} | ${TIERS.professional.limits.executions} | Unlimited |
| **Integrations** | ${TIERS.starter.limits.integrations} | ${TIERS.professional.limits.integrations} | Unlimited |
| **Users** | 1 | 5 | Unlimited |
| **Customization** | ❌ | ✅ | ✅ |
| **White-label** | ❌ | ❌ | ✅ |
| **API Access** | ❌ | ✅ | ✅ |
| **Priority Support** | ❌ | ✅ | ✅ |
| **Dedicated Support** | ❌ | ❌ | ✅ |
| **SLA** | ❌ | ❌ | ✅ |

## Support Comparison

| Aspect | Starter | Professional | Enterprise |
|--------|:-------:|:------------:|:----------:|
| **Response Time** | 48 hours | 24 hours | 4 hours |
| **Channels** | Email | Email, Chat | Email, Chat, Phone |
| **Training** | Documentation | 1 session | Unlimited |
| **Onboarding** | Self-service | Guided | Dedicated |

## Volume Discounts

For high-volume usage or multiple products:

| Volume | Discount |
|--------|----------|
| 2-4 products | 10% off |
| 5-9 products | 15% off |
| 10+ products | 20% off |

## Enterprise Custom Pricing

For organizations needing:
- Custom integrations
- On-premise deployment
- Dedicated infrastructure
- Custom SLA

Contact: enterprise@example.com

## FAQ

**Can I switch plans?**
Yes, upgrade or downgrade anytime. Changes take effect immediately.

**Is there a free trial?**
Contact sales for trial options.

**What payment methods do you accept?**
Credit card, bank transfer, invoice for Enterprise.

**Do you offer refunds?**
30-day money-back guarantee on all plans.

---

*Pricing as of ${new Date().toISOString().split('T')[0]}. Prices in EUR.*
`;
  }

  generateProductReadme(config, analysis) {
    return `# ${config.name}

> ${config.tagline || 'Automate your workflow with AI-powered efficiency'}

## Overview

${config.description || 'A complete automation solution for your business.'}

## Quick Facts

| Property | Value |
|----------|-------|
| Category | ${config.category} |
| Complexity | ${analysis.complexity} |
| AI-Powered | ${analysis.hasAI ? 'Yes' : 'No'} |
| Integrations | ${analysis.integrations.length} |

## What's Included

- \`workflows/main.json\` - The n8n workflow
- \`docs/user-guide.md\` - How to use this product
- \`docs/setup-guide.md\` - Installation instructions
- \`docs/faq.md\` - Common questions
- \`sales/one-pager.md\` - Product overview
- \`sales/pricing.md\` - Pricing details
- \`spec.yaml\` - Technical specification

## Getting Started

1. Read the [Setup Guide](docs/setup-guide.md)
2. Import the workflow
3. Configure credentials
4. Test and activate

## Support

See [FAQ](docs/faq.md) or contact support@example.com

## Version

- **Version**: 1.0.0
- **Created**: ${new Date().toISOString().split('T')[0]}
- **By**: squad-automation

---

*Product of Travel Tech Digital*
`;
  }

  ensureDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  writeFile(filePath, content) {
    fs.writeFileSync(filePath, content);
  }

  listProducts() {
    console.log('\n📦 Product Catalog\n');

    if (!fs.existsSync(PRODUCTS_DIR)) {
      console.log('   No products found');
      return;
    }

    const products = fs.readdirSync(PRODUCTS_DIR)
      .filter(f => fs.statSync(path.join(PRODUCTS_DIR, f)).isDirectory());

    if (products.length === 0) {
      console.log('   No products found');
      return;
    }

    for (const productId of products) {
      const specPath = path.join(PRODUCTS_DIR, productId, 'spec.yaml');
      if (fs.existsSync(specPath)) {
        console.log(`   • ${productId}/`);
      }
    }

    console.log(`\nTotal: ${products.length} products`);
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Product Packager - Transform workflows into sellable products

Usage:
  node product-packager.mjs <workflow.json> --name="Product Name" [options]
  node product-packager.mjs --list

Required:
  --name=<name>        Product name

Options:
  --category=<cat>     Category: acquisition, conversion, content, data, retention
  --tagline=<text>     Product tagline
  --description=<text> Short description
  --dry-run            Show what would be done without creating files
  --verbose            Show detailed output
  --output=<dir>       Output directory (default: ../../products/)

Actions:
  --list               List existing products

Examples:
  node product-packager.mjs lead-qualifier.json --name="AI Lead Qualifier" --category=acquisition
  node product-packager.mjs workflow.json --name="Content Repurposer" --category=content --dry-run
  node product-packager.mjs --list
`);
    process.exit(0);
  }

  const packager = new ProductPackager({
    verbose: args.includes('--verbose'),
    dryRun: args.includes('--dry-run')
  });

  if (args.includes('--list')) {
    packager.listProducts();
    process.exit(0);
  }

  // Get workflow path
  const workflowPath = args.find(a => !a.startsWith('--'));
  if (!workflowPath) {
    console.error('Please provide a workflow file path');
    process.exit(1);
  }

  if (!fs.existsSync(workflowPath)) {
    console.error(`File not found: ${workflowPath}`);
    process.exit(1);
  }

  // Parse config
  const nameArg = args.find(a => a.startsWith('--name='));
  if (!nameArg) {
    console.error('Please provide --name="Product Name"');
    process.exit(1);
  }

  const config = {
    name: nameArg.split('=')[1].replace(/"/g, ''),
    category: (args.find(a => a.startsWith('--category='))?.split('=')[1]) || 'data',
    tagline: args.find(a => a.startsWith('--tagline='))?.split('=')[1]?.replace(/"/g, ''),
    description: args.find(a => a.startsWith('--description='))?.split('=')[1]?.replace(/"/g, '')
  };

  const result = await packager.package(workflowPath, config);
  process.exit(result.success ? 0 : 1);
}

main().catch(console.error);
