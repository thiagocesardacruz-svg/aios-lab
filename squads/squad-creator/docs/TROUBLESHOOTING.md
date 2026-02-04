# Troubleshooting

> squad-creator v2.6 -- Common problems and solutions
> Last updated: 2026-02-04

---

## 1. Schema Validation Errors

### Problem: squad.yaml fails YAML parsing

**Symptoms**: `*validate-squad` reports "YAML parse error" or "invalid manifest".

**Error Code**: `SC-ERR-001`

**Common Causes**:
- Indentation errors (using tabs instead of spaces, or inconsistent spacing)
- Missing colons after keys
- Unquoted strings containing special characters (`:`, `#`, `@`, `{`, `}`)
- Duplicate keys in the same mapping

**Solution**:
1. Check indentation -- YAML requires consistent spaces (2 or 4), never tabs
2. Ensure all values with special characters are quoted: `description: "Mind Cloning: Voice + Thinking"`
3. Use a YAML linter to identify the exact line with the error
4. Verify no duplicate keys exist at the same nesting level

**Example fix**:
```yaml
# WRONG -- unquoted special characters
description: Mind Cloning: Advanced

# CORRECT -- quoted string
description: "Mind Cloning: Advanced"
```

### Problem: Task frontmatter validation fails

**Symptoms**: `*quality-dashboard` reports low task coverage, or `*validate-squad` warns about incomplete task definitions.

**Error Code**: `SC-ERR-002`

**Common Causes**:
- Missing required frontmatter fields (`task`, `responsavel`, `Entrada`, `Saida`, `Checklist`)
- Frontmatter not enclosed in `---` delimiters
- Field names using wrong capitalization (YAML is case-sensitive)

**Solution**:
1. Ensure every task file starts and ends its frontmatter with `---`
2. Include all 5 required fields: `task`, `responsavel`, `Entrada`, `Saida`, `Checklist`
3. Use exact field names with correct capitalization (note: `Entrada` and `Saida` are capitalized, `responsavel` is lowercase)

**Required frontmatter template**:
```yaml
---
task: Task Name Here
responsavel: "@agent-name"
responsavel_type: agent
atomic_layer: task
elicit: true
Entrada: |
  - param1: description (type, required/optional)
Saida: |
  - output1: description (type)
Checklist:
  - "[ ] First checklist item"
  - "[ ] Second checklist item"
---
```

---

## 2. Mind Cloning Issues

### Problem: Low fidelity score (below 60%)

**Symptoms**: `*clone-mind` completes but reports a fidelity score below 60%, or `*smoke-test` shows poor match percentages.

**Error Code**: `SC-MC-001`

**Common Causes**:
- Insufficient source material (too few sources or too little text)
- Sources that are not representative of the person's actual voice or thinking
- Using only one type of source (e.g., only formal documents, missing casual communication)
- Sources containing more third-party content than the target person's own writing
- Sources that are too short (under 500 words total)

**Solution**:
1. Add more diverse sources. For YOLO mode, ensure at least 2 high-quality sources (500+ words each). For QUALITY mode, ensure at least 5 sources from different contexts.
2. Prioritize sources authored directly by the person over sources about them.
3. Mix source types: combine written content (blog posts, articles) with conversational material (transcripts, interviews) and decision-oriented material (ADRs, strategy docs).
4. Run `*update-mind` with additional sources to incrementally improve the profile.
5. If score is below 40%, the pipeline aborts automatically. Gather more material before retrying.

### Problem: Source validation fails

**Symptoms**: `*clone-mind` aborts with "insufficient valid sources" or "source inaccessible".

**Error Code**: `SC-MC-002`

**Common Causes**:
- File paths are incorrect or files do not exist
- Files exist but are empty or contain only formatting (no actual text content)
- Fewer than 2 valid sources remain after skipping inaccessible ones
- File encoding issues (non-UTF-8 files)

**Solution**:
1. Verify all file paths are correct and files exist on disk
2. Ensure files contain actual text content (not just headers or empty templates)
3. Check file encoding -- the pipeline expects UTF-8 (falls back to Latin-1 if needed)
4. If using URLs, ensure they are publicly accessible

### Problem: Profile merge conflicts in QUALITY mode

**Symptoms**: `*clone-mind` in quality mode repeatedly prompts for conflict resolution, or merged profile seems inconsistent.

**Error Code**: `SC-MC-003`

**Common Causes**:
- Source material from different time periods showing genuine evolution in the person's style
- Sources from very different contexts (e.g., academic writing vs. casual social media)
- Contradictory signals in decision patterns (conservative in some domains, aggressive in others)

**Solution**:
1. When prompted for conflict resolution, consider whether the difference represents context-dependent behavior (which should be preserved as a range) or source noise (which should be resolved by picking the higher-confidence signal)
2. If conflicts are excessive, try running in YOLO mode first to establish a baseline, then switch to QUALITY mode with `*update-mind`
3. Add context tags to your sources (formal vs. informal, recent vs. historical) to help the extractor understand variations

---

## 3. Tool Discovery Issues

### Problem: No results found

**Symptoms**: `*discover-tools` returns empty results or "no tools found for domain".

**Error Code**: `SC-TD-001`

**Common Causes**:
- Domain description is too specific or uses niche terminology
- Search channels are rate-limited or temporarily unavailable
- Constraint parameters are too restrictive (e.g., requiring free + MIT + no-cloud eliminates most options)

**Solution**:
1. Broaden the domain description. Instead of "GraphQL schema stitching with TypeScript support for monorepo", try "GraphQL tools"
2. Remove or relax constraints one at a time to see which is most restrictive
3. Try different domain phrasings -- the 5 search channels respond differently to different terms
4. Run `*discover-tools` without constraints first, then filter results manually
5. If a specific search channel times out, it is skipped automatically. Check the output notes for any skipped channels and retry later.

### Problem: Security Gate blocks all candidates

**Symptoms**: Every discovered tool is classified as "DON'T DO" due to security gate failure.

**Error Code**: `SC-TD-002`

**Common Causes**:
- Tools have unpatched CVEs in the NVD database
- License incompatibility with your constraints (GPL tools when MIT is required)
- Tools are unmaintained (no commits in 12+ months)
- Dependency chain contains known vulnerable packages

**Solution**:
1. Review the specific security gate failure reason for each tool
2. For license issues, consider whether GPL/LGPL tools can be used with dynamic linking
3. For CVE issues, check if patches are available or if the vulnerability is not applicable to your use case
4. For maintenance issues, evaluate if the tool is "done" (stable and feature-complete) vs. truly abandoned
5. Use `*add-tool` to manually evaluate tools with overridden gate assessments (documented justification required)

### Problem: Social Proof Gate fails for valid tools

**Symptoms**: Good tools are flagged as "experimental" or "LOW_CONFIDENCE" due to social proof failure.

**Error Code**: `SC-TD-003`

**Common Causes**:
- Tool is new but high quality (not yet widely adopted)
- Tool is in a niche domain with inherently smaller community
- Tool is hosted outside GitHub (star count unavailable)

**Solution**:
1. Social Proof Gate failure caps tools at Tier 3 maximum but does not block them entirely
2. For niche tools, manually add them with `*add-tool` and document the low social proof justification
3. The `[experimental]` flag is appropriate for new, promising tools. They can be upgraded later as adoption grows.
4. Consider running the tool's own test suite and documenting results as manual social proof

---

## 4. SOP Extraction Issues

### Problem: Extraction produces incomplete SOP

**Symptoms**: `*extract-sop` generates an SOP with multiple empty parts, or `*validate-sop` reports low completeness.

**Error Code**: `SC-SOP-001`

**Common Causes**:
- Source document does not contain a complete procedure (only covers part of a workflow)
- Source type is misclassified (e.g., passing a high-level strategy doc as `document` when it should be `observation`)
- Source contains mostly narrative text with no discernible procedural steps
- Source is in a format the parser cannot handle well

**Solution**:
1. Verify the source actually contains procedural content (step-by-step instructions, action items, or process descriptions)
2. Try a different `source_type` parameter. Transcripts and interviews have different parsing strategies than documents.
3. If the source covers only part of a procedure, the SOP will note gaps. Provide additional sources to fill the gaps.
4. For narrative-heavy sources, consider extracting key actions manually into a bullet-point list, then running `*extract-sop` on that
5. Use `*validate-sop --verbose` to see exactly which parts are missing and target your remediation efforts

### Problem: Cognitive taxonomy classification seems wrong

**Symptoms**: Steps are classified at the wrong cognitive level (e.g., a creative task classified as "Remember").

**Error Code**: `SC-SOP-002`

**Common Causes**:
- Step description is too vague for accurate classification
- Step bundles multiple cognitive levels into one action
- Domain-specific actions that look simple but require expert judgment

**Solution**:
1. Refine step descriptions to be more specific about what cognitive activity is required
2. Split compound steps that combine recall with evaluation (e.g., "Look up the standard and decide if it applies" should be two steps)
3. Review classifications against Bloom's taxonomy definitions in [CONCEPTS.md](./CONCEPTS.md)
4. Manual override is always possible -- edit the SOP output directly and re-validate

---

## 5. Agent Activation Issues

### Problem: Sub-agent does not activate

**Symptoms**: Typing `@squad-creator:oalanicolas` does not change the agent context, or produces an error.

**Error Code**: `SC-AGT-001`

**Common Causes**:
- Typo in agent name (agent IDs are: `squad-architect`, `sop-extractor`, `oalanicolas`, `pedro-valerio`)
- Squad-creator package is not properly loaded in the AIOS environment
- AIOS version is below the minimum required (2.1.0)
- Agent definition file is missing or corrupted

**Solution**:
1. Double-check the agent ID spelling. Use exact IDs: `squad-architect`, `sop-extractor`, `oalanicolas`, `pedro-valerio`
2. Verify the agent definition files exist in `squads/squad-creator/agents/`
3. Check AIOS version compatibility (requires v2.1.0+)
4. Try activating the base agent first (`@squad-creator`) and then delegate from there

### Problem: Agent does not recognize command

**Symptoms**: Running a command returns "unknown command" or agent does not respond correctly.

**Error Code**: `SC-AGT-002`

**Common Causes**:
- Command is being run on the wrong agent (e.g., `*extract-sop` on Atlas instead of Scribe)
- Missing the `*` prefix
- Using the wrong command name (e.g., `*clone` instead of `*clone-mind`)

**Solution**:
1. Check which agent is currently active -- each agent has its own command set
2. Run `*help` to see the full list of commands available to the current agent
3. Ensure the `*` prefix is present
4. Refer to [COMMANDS.md](./COMMANDS.md) for the exact command names per agent

---

## 6. Sub-Agent Delegation Errors

### Problem: Delegation to sub-agent fails silently

**Symptoms**: Requesting a delegation (e.g., Atlas asks Mirror to clone a mind) does not produce output.

**Error Code**: `SC-DLG-001`

**Common Causes**:
- Sub-agent's task dependency files are not present on disk
- The delegating agent does not have the target agent listed in its `delegate_to` configuration
- Task file referenced by the sub-agent has a parsing error

**Solution**:
1. Verify task dependency files exist: check the `dependencies.tasks` list in the target agent's definition
2. Confirm the delegation path is valid: check `responsibility_boundaries.delegate_to` in the source agent's definition
3. Run `*validate-squad squad-creator` to check all component files are present
4. Manually activate the target sub-agent and run the command directly to isolate the issue

### Problem: Circular delegation loop

**Symptoms**: Two agents keep delegating to each other without producing results.

**Error Code**: `SC-DLG-002`

**Common Causes**:
- Misconfigured `delegate_to` sections creating a cycle
- Ambiguous request that both agents interpret as belonging to the other

**Solution**:
1. Each agent has clear responsibility boundaries. Review the `whenToUse` and `delegate_to` sections.
2. Be explicit about which agent should handle the task by directly activating that agent.
3. If the request genuinely spans two agents, break it into sequential steps and run each on the appropriate agent.

---

## Error Code Reference

| Code | Category | Description |
|------|----------|-------------|
| SC-ERR-001 | Schema | YAML parsing error in squad.yaml |
| SC-ERR-002 | Schema | Task frontmatter validation failure |
| SC-MC-001 | Mind Cloning | Low fidelity score |
| SC-MC-002 | Mind Cloning | Source validation failure |
| SC-MC-003 | Mind Cloning | Profile merge conflict |
| SC-TD-001 | Tool Discovery | No results found |
| SC-TD-002 | Tool Discovery | Security Gate blocks all |
| SC-TD-003 | Tool Discovery | Social Proof Gate failure |
| SC-SOP-001 | SOP Extraction | Incomplete extraction |
| SC-SOP-002 | SOP Extraction | Wrong cognitive classification |
| SC-AGT-001 | Agent | Sub-agent activation failure |
| SC-AGT-002 | Agent | Unrecognized command |
| SC-DLG-001 | Delegation | Silent delegation failure |
| SC-DLG-002 | Delegation | Circular delegation loop |

---

## Getting Further Help

If your issue is not covered above:

1. Run `*quality-dashboard squad-creator` to get an overall health check of the squad-creator itself
2. Check the agent definition files in `squads/squad-creator/agents/` for configuration issues
3. Review the task files in `squads/squad-creator/tasks/` for implementation details
4. Consult the [CONCEPTS.md](./CONCEPTS.md) for framework details
5. Review [ARCHITECTURE-DIAGRAMS.md](./ARCHITECTURE-DIAGRAMS.md) to understand the expected flow

---

*squad-creator docs v2.6.0 -- Synkra AIOS*
