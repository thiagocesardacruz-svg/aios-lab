# Route Request

## Meta
- **ID:** route-request
- **Squad:** ops
- **Executed by:** ops-manager
- **Idempotent:** yes
- **Estimated tokens:** low (<1k)

## Purpose
Determine the correct squad and agent for a submitted OS based on type and content.

## Input
| Field | Type | Required | Source |
|-------|------|----------|--------|
| os_record | yaml | yes | create-os |
| squad_registry | yaml | yes | data/squad-registry.yaml |

## Steps
1. Parse OS description and type
2. Match against squad capabilities in squad-registry
3. Check squad availability and workload
4. Select primary squad and fallback
5. Return routing recommendation

## Output
| Field | Type | Destination |
|-------|------|-------------|
| recommended_squad | text | assign-agent |
| fallback_squad | text | assign-agent |
| routing_confidence | text | ops-manager |

## Validation
- Recommended squad exists in registry
- Squad is active (not suspended)
- At least one agent available in squad

## Error Handling
- **If input missing:** Abort with error
- **If step fails:** Return to ops-lead for manual routing
