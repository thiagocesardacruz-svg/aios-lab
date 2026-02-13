# Sync to Notion

## Meta
- **ID:** sync-to-notion
- **Squad:** ops
- **Executed by:** clawdbot
- **Idempotent:** yes
- **Estimated tokens:** medium (1-5k)

## Purpose
Synchronize OS records and status to Notion Command Center database.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| os_records | yaml | yes | ops-manager |
| notion_db_id | text | yes | config |
| last_sync_timestamp | text | yes | system |

## Steps
1. Retrieve OS records modified since last sync
2. Transform OS format to Notion schema
3. For each OS, upsert to Notion database
4. Update sync timestamp
5. Log sync results

## Output
| Field | Type | Destination |
|-------|------|-------------|
| sync_result | yaml | ops-manager |
| sync_timestamp | text | system |
| sync_errors | yaml | ops-lead (if any) |

## Validation
- All modified OS synced
- Notion records match local records
- Sync timestamp updated

## Error Handling
- **If input missing:** Sync all OS (full sync)
- **If step fails:** Retry once, then log error and continue
