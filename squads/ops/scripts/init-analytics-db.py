"""
Initialize DuckDB Analytics Database
Creates schema for cost tracking, task analytics, and squad metrics.

Run: python init-analytics-db.py
"""

import duckdb
from pathlib import Path
from datetime import datetime

# Database path
DB_PATH = Path(__file__).parent.parent / "data" / "analytics.duckdb"

print(f"Initializing DuckDB at: {DB_PATH}")

# Connect (creates if not exists)
conn = duckdb.connect(str(DB_PATH))

# Create schema
conn.execute("""
    -- Cost tracking table
    CREATE SEQUENCE IF NOT EXISTS cost_log_seq START 1;
    CREATE TABLE IF NOT EXISTS cost_log (
        id INTEGER PRIMARY KEY DEFAULT nextval('cost_log_seq'),
        date DATE NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        task_id VARCHAR,
        agent VARCHAR NOT NULL,
        squad VARCHAR,
        model VARCHAR DEFAULT 'claude-opus-4',
        tokens_in INTEGER NOT NULL DEFAULT 0,
        tokens_out INTEGER NOT NULL DEFAULT 0,
        cost_eur DECIMAL(10, 4) NOT NULL DEFAULT 0
    );

    -- Create index for date queries
    CREATE INDEX IF NOT EXISTS idx_cost_date ON cost_log(date);
    CREATE INDEX IF NOT EXISTS idx_cost_agent ON cost_log(agent);
""")

conn.execute("""
    -- Task metrics table
    CREATE SEQUENCE IF NOT EXISTS task_metrics_seq START 1;
    CREATE TABLE IF NOT EXISTS task_metrics (
        id INTEGER PRIMARY KEY DEFAULT nextval('task_metrics_seq'),
        task_id VARCHAR NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        agent VARCHAR NOT NULL,
        squad VARCHAR,
        status VARCHAR DEFAULT 'pending',
        complexity_score INTEGER,
        duration_minutes INTEGER
    );
""")

conn.execute("""
    -- Daily aggregates view
    CREATE OR REPLACE VIEW daily_costs AS
    SELECT
        date,
        COUNT(*) as tasks,
        SUM(tokens_in) as total_tokens_in,
        SUM(tokens_out) as total_tokens_out,
        SUM(tokens_in + tokens_out) as total_tokens,
        ROUND(SUM(cost_eur), 2) as total_cost_eur,
        COUNT(DISTINCT agent) as unique_agents
    FROM cost_log
    GROUP BY date
    ORDER BY date DESC;
""")

conn.execute("""
    -- Agent costs view
    CREATE OR REPLACE VIEW agent_costs AS
    SELECT
        agent,
        COUNT(*) as tasks,
        SUM(tokens_in + tokens_out) as total_tokens,
        ROUND(SUM(cost_eur), 2) as total_cost_eur,
        ROUND(AVG(cost_eur), 4) as avg_cost_per_task
    FROM cost_log
    GROUP BY agent
    ORDER BY total_cost_eur DESC;
""")

conn.execute("""
    -- Model usage view
    CREATE OR REPLACE VIEW model_usage AS
    SELECT
        model,
        COUNT(*) as calls,
        SUM(tokens_in + tokens_out) as total_tokens,
        ROUND(SUM(cost_eur), 2) as total_cost_eur
    FROM cost_log
    GROUP BY model
    ORDER BY total_cost_eur DESC;
""")

# Insert sample data for testing (only if table is empty)
count = conn.execute("SELECT COUNT(*) FROM cost_log").fetchone()[0]
if count == 0:
    conn.execute("""
        INSERT INTO cost_log (date, task_id, agent, squad, model, tokens_in, tokens_out, cost_eur)
        VALUES
            (CURRENT_DATE, 'init-db', '@devops', 'ops', 'claude-opus-4', 1000, 500, 0.0525),
            (CURRENT_DATE, 'tools-analysis', '@architect', 'tech', 'claude-opus-4', 5000, 3000, 0.30);
    """)

conn.close()

print("Database initialized successfully!")
print(f"  - Tables: cost_log, task_metrics")
print(f"  - Views: daily_costs, agent_costs, model_usage")
print(f"  - Sample data inserted")

# Verify
conn = duckdb.connect(str(DB_PATH), read_only=True)
tables = conn.execute("SHOW TABLES").fetchall()
print(f"\nTables created: {[t[0] for t in tables]}")

today = conn.execute("SELECT * FROM daily_costs WHERE date = CURRENT_DATE").fetchone()
if today:
    print(f"Today's cost: €{today[5]}")
conn.close()
