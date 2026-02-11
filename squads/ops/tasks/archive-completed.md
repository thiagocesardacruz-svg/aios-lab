# Archive Completed

## Meta
- **ID:** archive-completed
- **Squad:** ops
- **Executed by:** ops-manager
- **Idempotent:** yes
- **Estimated tokens:** low (<1k)

## Purpose
Move completed OS to archived status after retention period.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| completed_os_list | yaml | yes | ops-manager |
| retention_days | number | yes | config |
| current_date | text | yes | system |

## Steps
1. Filter OS with status "completed"
2. Check completion date against retention period (default 7 days)
3. For OS past retention, transition to "archived"
4. Move records to archive storage
5. Update sync with Notion
6. Log archival action

## Output
| Field | Type | Destination |
|-------|------|-------------|
| archived_count | number | ops-manager |
| archive_log | yaml | system |

## Validation
- Only completed OS archived
- Retention period respected
- Records preserved in archive

## Error Handling
- **If input missing:** Use default 7-day retention
- **If step fails:** Skip problematic OS, continue with others
