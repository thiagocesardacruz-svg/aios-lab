"""MCP Server Evaluation Harness

This script evaluates MCP servers by running test questions against them using Claude.
"""

import argparse
import asyncio
import json
import re
import sys
import time
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any

from anthropic import Anthropic
from connections import create_connection


EVALUATION_PROMPT = """You are an AI assistant with access to tools.

When given a task, you MUST:
1. Use the available tools to complete the task
2. Provide summary of each step in your approach, wrapped in <summary> tags
3. Provide feedback on the tools provided, wrapped in <feedback> tags
4. Provide your final response, wrapped in <response> tags

Response Requirements:
- Your response should be concise and directly address what was asked
- Always wrap your final response in <response> tags
- If you cannot solve the task return <response>NOT_FOUND</response>
"""


def parse_evaluation_file(file_path: Path) -> list[dict[str, Any]]:
    """Parse XML evaluation file with qa_pair elements."""
    try:
        tree = ET.parse(file_path)
        root = tree.getroot()
        evaluations = []

        for qa_pair in root.findall(".//qa_pair"):
            question_elem = qa_pair.find("question")
            answer_elem = qa_pair.find("answer")

            if question_elem is not None and answer_elem is not None:
                evaluations.append({
                    "question": (question_elem.text or "").strip(),
                    "answer": (answer_elem.text or "").strip(),
                })

        return evaluations
    except Exception as e:
        print(f"Error parsing evaluation file {file_path}: {e}")
        return []


def extract_xml_content(text: str, tag: str) -> str | None:
    """Extract content from XML tags."""
    pattern = rf"<{tag}>(.*?)</{tag}>"
    matches = re.findall(pattern, text, re.DOTALL)
    return matches[-1].strip() if matches else None


async def agent_loop(
    client: Anthropic,
    model: str,
    question: str,
    tools: list[dict[str, Any]],
    connection: Any,
) -> tuple[str, dict[str, Any]]:
    """Run the agent loop with MCP tools."""
    messages = [{"role": "user", "content": question}]

    response = await asyncio.to_thread(
        client.messages.create,
        model=model,
        max_tokens=4096,
        system=EVALUATION_PROMPT,
        messages=messages,
        tools=tools,
    )

    messages.append({"role": "assistant", "content": response.content})
    tool_metrics = {}

    while response.stop_reason == "tool_use":
        tool_use = next(block for block in response.content if block.type == "tool_use")
        tool_name = tool_use.name
        tool_input = tool_use.input

        tool_start_ts = time.time()
        try:
            tool_result = await connection.call_tool(tool_name, tool_input)
            tool_response = json.dumps(tool_result) if isinstance(tool_result, (dict, list)) else str(tool_result)
        except Exception as e:
            tool_response = f"Error executing tool {tool_name}: {str(e)}"
        tool_duration = time.time() - tool_start_ts

        if tool_name not in tool_metrics:
            tool_metrics[tool_name] = {"count": 0, "durations": []}
        tool_metrics[tool_name]["count"] += 1
        tool_metrics[tool_name]["durations"].append(tool_duration)

        messages.append({
            "role": "user",
            "content": [{
                "type": "tool_result",
                "tool_use_id": tool_use.id,
                "content": tool_response,
            }]
        })

        response = await asyncio.to_thread(
            client.messages.create,
            model=model,
            max_tokens=4096,
            system=EVALUATION_PROMPT,
            messages=messages,
            tools=tools,
        )
        messages.append({"role": "assistant", "content": response.content})

    response_text = next(
        (block.text for block in response.content if hasattr(block, "text")),
        None,
    )
    return response_text, tool_metrics


async def run_evaluation(
    eval_path: Path,
    connection: Any,
    model: str = "claude-3-7-sonnet-20250219",
) -> str:
    """Run evaluation with MCP server tools."""
    print("🚀 Starting Evaluation")

    client = Anthropic()

    tools = await connection.list_tools()
    print(f"📋 Loaded {len(tools)} tools from MCP server")

    qa_pairs = parse_evaluation_file(eval_path)
    print(f"📋 Loaded {len(qa_pairs)} evaluation tasks")

    results = []
    for i, qa_pair in enumerate(qa_pairs):
        print(f"Processing task {i + 1}/{len(qa_pairs)}")
        start_time = time.time()
        response, tool_metrics = await agent_loop(client, model, qa_pair["question"], tools, connection)

        response_value = extract_xml_content(response, "response")
        duration = time.time() - start_time

        results.append({
            "question": qa_pair["question"],
            "expected": qa_pair["answer"],
            "actual": response_value,
            "score": int(response_value == qa_pair["answer"]) if response_value else 0,
            "duration": duration,
            "tool_calls": tool_metrics,
        })

    # Generate report
    correct = sum(r["score"] for r in results)
    accuracy = (correct / len(results)) * 100 if results else 0

    report = f"""
# Evaluation Report

## Summary
- **Accuracy**: {correct}/{len(results)} ({accuracy:.1f}%)
- **Average Duration**: {sum(r['duration'] for r in results) / len(results):.2f}s

## Results
"""
    for i, r in enumerate(results):
        status = "✅" if r["score"] else "❌"
        report += f"\n### Task {i + 1} {status}\n"
        report += f"**Question**: {r['question']}\n"
        report += f"**Expected**: `{r['expected']}`\n"
        report += f"**Actual**: `{r['actual']}`\n"

    return report


def main():
    parser = argparse.ArgumentParser(description="Evaluate MCP servers")
    parser.add_argument("eval_file", type=Path, help="Path to evaluation XML file")
    parser.add_argument("-t", "--transport", choices=["stdio", "sse", "http"], default="stdio")
    parser.add_argument("-m", "--model", default="claude-3-7-sonnet-20250219")
    parser.add_argument("-c", "--command", help="Command to run MCP server (stdio only)")
    parser.add_argument("-a", "--args", nargs="+", help="Arguments for the command")
    parser.add_argument("-u", "--url", help="MCP server URL (sse/http only)")
    parser.add_argument("-o", "--output", type=Path, help="Output file for report")

    args = parser.parse_args()

    if not args.eval_file.exists():
        print(f"Error: Evaluation file not found: {args.eval_file}")
        sys.exit(1)

    try:
        connection = create_connection(
            transport=args.transport,
            command=args.command,
            args=args.args,
            url=args.url,
        )
    except ValueError as e:
        print(f"Error: {e}")
        sys.exit(1)

    async def run():
        async with connection:
            report = await run_evaluation(args.eval_file, connection, args.model)
            if args.output:
                args.output.write_text(report)
                print(f"\n✅ Report saved to {args.output}")
            else:
                print(report)

    asyncio.run(run())


if __name__ == "__main__":
    main()
