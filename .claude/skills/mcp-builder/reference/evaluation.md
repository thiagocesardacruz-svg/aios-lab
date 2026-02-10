# MCP Server Evaluation Guide

## Overview

Create 10 human-readable questions requiring ONLY READ-ONLY, INDEPENDENT, NON-DESTRUCTIVE operations to answer.

## Evaluation Requirements
- Questions must be READ-ONLY, INDEPENDENT, NON-DESTRUCTIVE
- Each question requires multiple tool calls (potentially dozens)
- Answers must be single, verifiable values
- Answers must be STABLE (won't change over time)

## Output Format

```xml
<evaluation>
   <qa_pair>
      <question>Your question here</question>
      <answer>Single verifiable answer</answer>
   </qa_pair>
</evaluation>
```

## Question Guidelines

### Core Requirements
1. Questions MUST be independent
2. Questions MUST require ONLY NON-DESTRUCTIVE tool use
3. Questions must be REALISTIC, CLEAR, CONCISE, and COMPLEX
4. Questions must require deep exploration
5. Questions may require extensive paging
6. Questions must not be solvable with straightforward keyword search

### Stability
- Questions must be designed so the answer DOES NOT CHANGE
- Do not ask questions that rely on dynamic "current state"

## Answer Guidelines

1. Answers must be VERIFIABLE via direct string comparison
2. Answers should prefer HUMAN-READABLE formats
3. Answers must be STABLE/STATIONARY
4. Answers must be CLEAR and UNAMBIGUOUS
5. Answers must be DIVERSE
6. Answers must NOT be complex structures

## Running Evaluations

### Setup
```bash
pip install -r scripts/requirements.txt
export ANTHROPIC_API_KEY=your_api_key_here
```

### Running
```bash
# Stdio transport
python scripts/evaluation.py -t stdio -c python -a my_server.py eval.xml

# SSE transport
python scripts/evaluation.py -t sse -u https://example.com/mcp eval.xml

# HTTP transport
python scripts/evaluation.py -t http -u https://example.com/mcp eval.xml
```
