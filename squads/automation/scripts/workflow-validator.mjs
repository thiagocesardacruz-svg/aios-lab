#!/usr/bin/env node
/**
 * Workflow Validator
 *
 * Validates n8n workflow JSON files for structure, best practices, and security.
 * Uses n8n MCP tools when available, falls back to local validation.
 *
 * Usage:
 *   node workflow-validator.mjs <workflow.json> [--profile=minimal|runtime|strict]
 *   node workflow-validator.mjs --batch <directory>
 *   node workflow-validator.mjs --fix <workflow.json>
 *
 * @squad automation
 * @agent n8n-builder (Forge)
 */

import fs from 'fs';
import path from 'path';

// Validation profiles
const PROFILES = {
  minimal: {
    name: 'Minimal',
    description: 'Basic structure check only',
    checks: ['structure', 'nodes_exist', 'connections_valid']
  },
  runtime: {
    name: 'Runtime',
    description: 'Structure + runtime safety',
    checks: ['structure', 'nodes_exist', 'connections_valid', 'node_versions', 'error_handling', 'credentials']
  },
  strict: {
    name: 'Strict',
    description: 'Full validation including security and performance',
    checks: ['structure', 'nodes_exist', 'connections_valid', 'node_versions', 'error_handling', 'credentials', 'security', 'performance', 'best_practices']
  }
};

// Common issues and auto-fixes
const AUTO_FIXES = {
  missing_error_handler: {
    description: 'Add error handling node',
    fix: (workflow) => {
      // Add error workflow trigger if missing
      const hasErrorHandler = workflow.nodes.some(n =>
        n.type === 'n8n-nodes-base.errorTrigger'
      );
      if (!hasErrorHandler) {
        console.log('  → Would add error handler (manual review needed)');
      }
      return workflow;
    }
  },
  old_node_version: {
    description: 'Update node to latest typeVersion',
    fix: (workflow, nodeId, latestVersion) => {
      const node = workflow.nodes.find(n => n.id === nodeId);
      if (node) {
        node.typeVersion = latestVersion;
      }
      return workflow;
    }
  },
  missing_execution_order: {
    description: 'Add executionOrder setting',
    fix: (workflow) => {
      workflow.settings = workflow.settings || {};
      workflow.settings.executionOrder = 'v1';
      return workflow;
    }
  }
};

// Known node types and their latest versions
const NODE_VERSIONS = {
  'n8n-nodes-base.webhook': 2,
  'n8n-nodes-base.httpRequest': 4.2,
  'n8n-nodes-base.code': 2,
  'n8n-nodes-base.if': 2,
  'n8n-nodes-base.switch': 3,
  'n8n-nodes-base.set': 3.4,
  'n8n-nodes-base.slack': 2.2,
  'n8n-nodes-base.googleSheets': 4.5,
  '@n8n/n8n-nodes-langchain.agent': 1.7,
  '@n8n/n8n-nodes-langchain.lmChatOpenAi': 1.2
};

// Security patterns to check
const SECURITY_PATTERNS = {
  hardcoded_secrets: /(['"])(sk-|api_key|password|secret|token)[^'"]*\1/gi,
  eval_usage: /\beval\s*\(/g,
  dangerous_exec: /\bexec\s*\(/g,
  sql_injection: /\$\{.*\}.*(?:SELECT|INSERT|UPDATE|DELETE)/gi
};

class WorkflowValidator {
  constructor(options = {}) {
    this.profile = options.profile || 'runtime';
    this.autoFix = options.autoFix || false;
    this.verbose = options.verbose || false;
    this.issues = [];
    this.warnings = [];
    this.fixes = [];
  }

  async validate(workflowPath) {
    console.log(`\n🔍 Validating: ${path.basename(workflowPath)}`);
    console.log(`   Profile: ${PROFILES[this.profile].name}`);
    console.log('');

    // Load workflow
    let workflow;
    try {
      const content = fs.readFileSync(workflowPath, 'utf8');
      workflow = JSON.parse(content);
    } catch (error) {
      this.issues.push({
        severity: 'error',
        category: 'structure',
        message: `Failed to parse workflow: ${error.message}`
      });
      return this.getReport();
    }

    // Run checks based on profile
    const checks = PROFILES[this.profile].checks;

    if (checks.includes('structure')) {
      this.checkStructure(workflow);
    }
    if (checks.includes('nodes_exist')) {
      this.checkNodesExist(workflow);
    }
    if (checks.includes('connections_valid')) {
      this.checkConnections(workflow);
    }
    if (checks.includes('node_versions')) {
      this.checkNodeVersions(workflow);
    }
    if (checks.includes('error_handling')) {
      this.checkErrorHandling(workflow);
    }
    if (checks.includes('credentials')) {
      this.checkCredentials(workflow);
    }
    if (checks.includes('security')) {
      this.checkSecurity(workflow);
    }
    if (checks.includes('performance')) {
      this.checkPerformance(workflow);
    }
    if (checks.includes('best_practices')) {
      this.checkBestPractices(workflow);
    }

    // Apply auto-fixes if enabled
    if (this.autoFix && this.fixes.length > 0) {
      workflow = this.applyFixes(workflow);
      const fixedPath = workflowPath.replace('.json', '.fixed.json');
      fs.writeFileSync(fixedPath, JSON.stringify(workflow, null, 2));
      console.log(`\n✅ Fixed workflow saved to: ${fixedPath}`);
    }

    return this.getReport();
  }

  checkStructure(workflow) {
    // Required fields
    if (!workflow.name) {
      this.issues.push({
        severity: 'error',
        category: 'structure',
        message: 'Missing workflow name'
      });
    }

    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      this.issues.push({
        severity: 'error',
        category: 'structure',
        message: 'Missing or invalid nodes array'
      });
      return;
    }

    if (workflow.nodes.length === 0) {
      this.issues.push({
        severity: 'error',
        category: 'structure',
        message: 'Workflow has no nodes'
      });
    }

    if (!workflow.connections) {
      this.warnings.push({
        severity: 'warning',
        category: 'structure',
        message: 'Missing connections object'
      });
    }

    // Check for trigger
    const hasTrigger = workflow.nodes.some(n =>
      n.type.includes('Trigger') ||
      n.type.includes('webhook') ||
      n.type === 'n8n-nodes-base.manualTrigger'
    );
    if (!hasTrigger) {
      this.warnings.push({
        severity: 'warning',
        category: 'structure',
        message: 'No trigger node found - workflow cannot start automatically'
      });
    }

    // Check execution order setting
    if (!workflow.settings?.executionOrder) {
      this.warnings.push({
        severity: 'warning',
        category: 'structure',
        message: 'Missing executionOrder setting (recommend "v1")'
      });
      this.fixes.push({ type: 'missing_execution_order' });
    }
  }

  checkNodesExist(workflow) {
    for (const node of workflow.nodes) {
      if (!node.id) {
        this.issues.push({
          severity: 'error',
          category: 'nodes',
          message: `Node "${node.name}" missing id`
        });
      }
      if (!node.type) {
        this.issues.push({
          severity: 'error',
          category: 'nodes',
          message: `Node "${node.name}" missing type`
        });
      }
      if (!node.position) {
        this.warnings.push({
          severity: 'warning',
          category: 'nodes',
          message: `Node "${node.name}" missing position`
        });
      }
    }
  }

  checkConnections(workflow) {
    const nodeNames = new Set(workflow.nodes.map(n => n.name));

    for (const [sourceName, outputs] of Object.entries(workflow.connections || {})) {
      if (!nodeNames.has(sourceName)) {
        this.issues.push({
          severity: 'error',
          category: 'connections',
          message: `Connection references non-existent source node: "${sourceName}"`
        });
        continue;
      }

      for (const [outputType, connections] of Object.entries(outputs)) {
        for (const outputConnections of connections) {
          for (const conn of outputConnections) {
            if (!nodeNames.has(conn.node)) {
              this.issues.push({
                severity: 'error',
                category: 'connections',
                message: `Connection from "${sourceName}" references non-existent target: "${conn.node}"`
              });
            }
          }
        }
      }
    }
  }

  checkNodeVersions(workflow) {
    for (const node of workflow.nodes) {
      const latestVersion = NODE_VERSIONS[node.type];
      if (latestVersion && node.typeVersion < latestVersion) {
        this.warnings.push({
          severity: 'warning',
          category: 'versions',
          message: `Node "${node.name}" (${node.type}) uses v${node.typeVersion}, latest is v${latestVersion}`
        });
        this.fixes.push({
          type: 'old_node_version',
          nodeId: node.id,
          latestVersion
        });
      }
    }
  }

  checkErrorHandling(workflow) {
    // Check for error trigger or error workflow
    const hasErrorHandling = workflow.nodes.some(n =>
      n.type === 'n8n-nodes-base.errorTrigger' ||
      n.type === 'n8n-nodes-base.stopAndError'
    );

    // Check for try-catch patterns in Code nodes
    const codeNodes = workflow.nodes.filter(n => n.type === 'n8n-nodes-base.code');
    for (const node of codeNodes) {
      const code = node.parameters?.jsCode || '';
      if (!code.includes('try') && !code.includes('catch')) {
        this.warnings.push({
          severity: 'warning',
          category: 'error_handling',
          message: `Code node "${node.name}" has no try-catch error handling`
        });
      }
    }

    if (!hasErrorHandling && workflow.nodes.length > 3) {
      this.warnings.push({
        severity: 'warning',
        category: 'error_handling',
        message: 'No error handling found in workflow'
      });
      this.fixes.push({ type: 'missing_error_handler' });
    }
  }

  checkCredentials(workflow) {
    for (const node of workflow.nodes) {
      // Check if node type typically needs credentials
      const needsCredentials = [
        'slack', 'googleSheets', 'gmail', 'httpRequest',
        'openAi', 'postgres', 'mysql', 'mongodb'
      ].some(type => node.type.toLowerCase().includes(type));

      if (needsCredentials && !node.credentials) {
        this.warnings.push({
          severity: 'warning',
          category: 'credentials',
          message: `Node "${node.name}" (${node.type}) may need credentials configured`
        });
      }
    }
  }

  checkSecurity(workflow) {
    for (const node of workflow.nodes) {
      const params = JSON.stringify(node.parameters || {});

      for (const [pattern, regex] of Object.entries(SECURITY_PATTERNS)) {
        if (regex.test(params)) {
          this.issues.push({
            severity: 'error',
            category: 'security',
            message: `Node "${node.name}" has potential ${pattern.replace('_', ' ')}`
          });
        }
        regex.lastIndex = 0; // Reset regex
      }
    }

    // Check webhook security
    const webhooks = workflow.nodes.filter(n => n.type.includes('webhook'));
    for (const webhook of webhooks) {
      if (!webhook.parameters?.options?.rawBody) {
        // Not necessarily an issue, but worth noting
      }
      // Check for authentication
      const hasAuth = webhook.webhookId ||
                      webhook.parameters?.authentication !== 'none';
      if (!hasAuth) {
        this.warnings.push({
          severity: 'warning',
          category: 'security',
          message: `Webhook "${webhook.name}" has no authentication configured`
        });
      }
    }
  }

  checkPerformance(workflow) {
    // Check for potential infinite loops
    const connections = workflow.connections || {};
    const visited = new Set();

    const detectCycle = (nodeName, path = []) => {
      if (path.includes(nodeName)) {
        this.issues.push({
          severity: 'error',
          category: 'performance',
          message: `Potential infinite loop detected: ${path.join(' → ')} → ${nodeName}`
        });
        return true;
      }

      const nodeConnections = connections[nodeName];
      if (!nodeConnections) return false;

      for (const outputs of Object.values(nodeConnections)) {
        for (const outputList of outputs) {
          for (const conn of outputList) {
            if (detectCycle(conn.node, [...path, nodeName])) {
              return true;
            }
          }
        }
      }
      return false;
    };

    // Check from trigger nodes
    const triggers = workflow.nodes.filter(n =>
      n.type.includes('Trigger') || n.type.includes('webhook')
    );
    for (const trigger of triggers) {
      detectCycle(trigger.name);
    }

    // Check for large batch operations without limits
    const httpNodes = workflow.nodes.filter(n =>
      n.type === 'n8n-nodes-base.httpRequest'
    );
    for (const node of httpNodes) {
      if (node.parameters?.options?.batching?.batch?.batchSize > 100) {
        this.warnings.push({
          severity: 'warning',
          category: 'performance',
          message: `Node "${node.name}" has large batch size (${node.parameters.options.batching.batch.batchSize})`
        });
      }
    }
  }

  checkBestPractices(workflow) {
    // Check naming conventions
    for (const node of workflow.nodes) {
      if (node.name.match(/^(Node|Copy of|Untitled)/i)) {
        this.warnings.push({
          severity: 'warning',
          category: 'best_practices',
          message: `Node "${node.name}" has a generic name - use descriptive naming`
        });
      }
    }

    // Check for documentation
    if (!workflow.meta?.description && !workflow.notes) {
      this.warnings.push({
        severity: 'warning',
        category: 'best_practices',
        message: 'Workflow has no description or notes'
      });
    }

    // Check for Set node before external calls (data preparation)
    const externalNodes = workflow.nodes.filter(n =>
      n.type.includes('httpRequest') ||
      n.type.includes('slack') ||
      n.type.includes('email')
    );
    // This is just a heuristic check
    if (externalNodes.length > 0 && !workflow.nodes.some(n => n.type.includes('set'))) {
      this.warnings.push({
        severity: 'warning',
        category: 'best_practices',
        message: 'Consider using Set nodes to prepare data before external calls'
      });
    }
  }

  applyFixes(workflow) {
    console.log('\n🔧 Applying auto-fixes:');
    for (const fix of this.fixes) {
      const fixDef = AUTO_FIXES[fix.type];
      if (fixDef) {
        console.log(`  • ${fixDef.description}`);
        workflow = fixDef.fix(workflow, fix.nodeId, fix.latestVersion);
      }
    }
    return workflow;
  }

  getReport() {
    const errors = this.issues.filter(i => i.severity === 'error');
    const warnings = [...this.warnings, ...this.issues.filter(i => i.severity === 'warning')];

    const passed = errors.length === 0;
    const score = Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5));

    console.log('─'.repeat(50));

    if (errors.length > 0) {
      console.log('\n❌ ERRORS:');
      for (const error of errors) {
        console.log(`   [${error.category}] ${error.message}`);
      }
    }

    if (warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      for (const warning of warnings) {
        console.log(`   [${warning.category}] ${warning.message}`);
      }
    }

    console.log('\n─'.repeat(50));
    console.log(`\n${passed ? '✅ PASSED' : '❌ FAILED'} | Score: ${score}/100`);
    console.log(`   Errors: ${errors.length} | Warnings: ${warnings.length} | Auto-fixes: ${this.fixes.length}`);

    return {
      passed,
      score,
      errors,
      warnings,
      fixes: this.fixes,
      profile: this.profile
    };
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Workflow Validator - n8n workflow validation tool

Usage:
  node workflow-validator.mjs <workflow.json> [options]
  node workflow-validator.mjs --batch <directory>

Options:
  --profile=<profile>   Validation profile: minimal, runtime, strict (default: runtime)
  --fix                 Auto-fix issues where possible
  --verbose             Show detailed output
  --json                Output results as JSON
  --batch <dir>         Validate all .json files in directory

Profiles:
  minimal   Basic structure check only
  runtime   Structure + runtime safety (default)
  strict    Full validation including security and performance

Examples:
  node workflow-validator.mjs workflow.json
  node workflow-validator.mjs workflow.json --profile=strict
  node workflow-validator.mjs workflow.json --fix
  node workflow-validator.mjs --batch ./workflows
`);
    process.exit(0);
  }

  // Parse options
  const options = {
    profile: 'runtime',
    autoFix: args.includes('--fix'),
    verbose: args.includes('--verbose'),
    json: args.includes('--json')
  };

  const profileArg = args.find(a => a.startsWith('--profile='));
  if (profileArg) {
    options.profile = profileArg.split('=')[1];
    if (!PROFILES[options.profile]) {
      console.error(`Unknown profile: ${options.profile}`);
      console.error(`Available profiles: ${Object.keys(PROFILES).join(', ')}`);
      process.exit(1);
    }
  }

  const validator = new WorkflowValidator(options);

  // Batch mode
  if (args.includes('--batch')) {
    const dirIndex = args.indexOf('--batch') + 1;
    const directory = args[dirIndex] || '.';

    const files = fs.readdirSync(directory)
      .filter(f => f.endsWith('.json'))
      .map(f => path.join(directory, f));

    console.log(`\n📦 Batch validation: ${files.length} files in ${directory}\n`);

    const results = [];
    for (const file of files) {
      const result = await validator.validate(file);
      results.push({ file, ...result });
      // Reset for next file
      validator.issues = [];
      validator.warnings = [];
      validator.fixes = [];
    }

    // Summary
    const passed = results.filter(r => r.passed).length;
    console.log(`\n${'═'.repeat(50)}`);
    console.log(`BATCH SUMMARY: ${passed}/${results.length} passed`);
    console.log(`${'═'.repeat(50)}`);

    if (options.json) {
      console.log(JSON.stringify(results, null, 2));
    }

    process.exit(passed === results.length ? 0 : 1);
  }

  // Single file mode
  const workflowPath = args.find(a => !a.startsWith('--'));
  if (!workflowPath) {
    console.error('Please provide a workflow file path');
    process.exit(1);
  }

  if (!fs.existsSync(workflowPath)) {
    console.error(`File not found: ${workflowPath}`);
    process.exit(1);
  }

  const result = await validator.validate(workflowPath);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  }

  process.exit(result.passed ? 0 : 1);
}

main().catch(console.error);
