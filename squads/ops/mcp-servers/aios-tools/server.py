"""
AIOS Tools MCP Server
Exposes AIOS operations as MCP tools for Claude Code

Run: python server.py
Or: fastmcp run server.py
"""

from fastmcp import FastMCP
import duckdb
import json
import os
from datetime import datetime
from pathlib import Path

# Initialize MCP server
mcp = FastMCP("aios-tools")

# Paths
AIOS_ROOT = Path(__file__).parent.parent.parent.parent.parent
OPS_DATA = AIOS_ROOT / "squads" / "ops" / "data"
DB_PATH = OPS_DATA / "analytics.duckdb"


@mcp.tool()
def get_budget_status() -> dict:
    """Get current budget status including daily and monthly limits."""
    try:
        conn = duckdb.connect(str(DB_PATH), read_only=True)
        result = conn.execute("""
            SELECT
                COALESCE(SUM(cost_eur), 0) as today_cost,
                20.0 as daily_limit,
                15.0 as alert_threshold
            FROM cost_log
            WHERE date = CURRENT_DATE
        """).fetchone()
        conn.close()

        today_cost = float(result[0]) if result else 0.0
        return {
            "today_cost": round(today_cost, 2),
            "daily_limit": 20.0,
            "daily_remaining": round(20.0 - today_cost, 2),
            "alert_triggered": today_cost >= 15.0,
            "status": "SAFE" if today_cost < 15 else "WARNING" if today_cost < 20 else "BLOCKED"
        }
    except Exception as e:
        return {"error": str(e), "status": "UNKNOWN"}


@mcp.tool()
def log_cost(task_id: str, agent: str, tokens_in: int, tokens_out: int, model: str = "claude-opus-4") -> dict:
    """Log token usage and cost for a task."""
    # Cost per 1k tokens (EUR approximation)
    costs = {
        "claude-opus-4": {"in": 0.015, "out": 0.075},
        "claude-sonnet-4": {"in": 0.003, "out": 0.015},
        "claude-haiku-3.5": {"in": 0.0008, "out": 0.004}
    }

    model_cost = costs.get(model, costs["claude-opus-4"])
    cost_eur = (tokens_in / 1000 * model_cost["in"]) + (tokens_out / 1000 * model_cost["out"])

    try:
        conn = duckdb.connect(str(DB_PATH))
        conn.execute("""
            INSERT INTO cost_log (date, timestamp, task_id, agent, model, tokens_in, tokens_out, cost_eur)
            VALUES (CURRENT_DATE, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?)
        """, [task_id, agent, model, tokens_in, tokens_out, cost_eur])
        conn.close()

        return {
            "logged": True,
            "task_id": task_id,
            "cost_eur": round(cost_eur, 4),
            "tokens_total": tokens_in + tokens_out
        }
    except Exception as e:
        return {"error": str(e), "logged": False}


@mcp.tool()
def query_analytics(sql: str) -> dict:
    """Run a read-only SQL query on the analytics database."""
    # Security: only allow SELECT
    if not sql.strip().upper().startswith("SELECT"):
        return {"error": "Only SELECT queries allowed", "results": []}

    try:
        conn = duckdb.connect(str(DB_PATH), read_only=True)
        result = conn.execute(sql).fetchall()
        columns = [desc[0] for desc in conn.description]
        conn.close()

        return {
            "columns": columns,
            "results": [dict(zip(columns, row)) for row in result],
            "row_count": len(result)
        }
    except Exception as e:
        return {"error": str(e), "results": []}


@mcp.tool()
def list_squads() -> list:
    """List all available squads with their descriptions."""
    squads_dir = AIOS_ROOT / "squads"
    squads = []

    for squad_path in squads_dir.iterdir():
        if squad_path.is_dir() and not squad_path.name.startswith('_'):
            squad_yaml = squad_path / "squad.yaml"
            if squad_yaml.exists():
                squads.append({
                    "name": squad_path.name,
                    "path": str(squad_path)
                })

    return squads


@mcp.tool()
def get_squad_info(squad_name: str) -> dict:
    """Get detailed information about a specific squad."""
    import yaml

    squad_path = AIOS_ROOT / "squads" / squad_name / "squad.yaml"
    if not squad_path.exists():
        return {"error": f"Squad '{squad_name}' not found"}

    with open(squad_path) as f:
        data = yaml.safe_load(f)

    return {
        "name": data.get("name"),
        "version": data.get("version"),
        "description": data.get("description"),
        "lead": data.get("lead"),
        "agents": [a.get("id") for a in data.get("agents", [])],
        "commands": [c.get("name") for c in data.get("commands", [])]
    }


if __name__ == "__main__":
    mcp.run()
