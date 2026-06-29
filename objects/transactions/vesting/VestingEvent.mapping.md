---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/vesting/VestingEvent.schema.json
ocf_object_type: TX_VESTING_EVENT
ocf_title: Object - Vesting Event Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - security_id
  - event_id
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-06-29
---

# Object - Vesting Event Transaction → TBD

> Version dispatcher for the vesting-event transaction. The stable public `$id` accepts either the current DAG-condition shape (v1) or the forward-looking named-event shape (v2) during the transition window.

## OCF schema

Source: [`VestingEvent.schema.json`](./VestingEvent.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/vesting/VestingEvent.schema.json",
  "title": "Object - Vesting Event Transaction",
  "description": "Version dispatcher for the vesting-event transaction. The stable public `$id` accepts either the current DAG-condition shape (v1) or the forward-looking named-event shape (v2) during the transition window.",
  "x-ocf-stability": "alpha",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Identifier for this transaction."
    },
    "object_type": {
      "const": "TX_VESTING_EVENT"
    },
    "date": {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json",
      "description": "Date the event fired."
    },
    "security_id": {
      "type": "string",
      "description": "Identifier of the security whose VestingStatement(s) reference this event. The firing is scoped to a single security; cross-grant fan-out of one underlying event is represented by emitting one transaction per affected security."
    },
    "event_id": {
      "type": "string",
      "minLength": 1,
      "description": "Identifier of the named event that fired. Matches `event_id` on the `event_condition` of some VestingStatement on this security's template."
    }
  },
  "required": [
    "id",
    "object_type",
    "date",
    "security_id",
    "event_id"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/vesting/versions.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
# unmappable reason vocabulary: no-equivalent | excluded-from-snapshot | out-of-scope | ocf-internal
status: draft
coverage: 0/5

fields:
  id:
    kind: TODO
    target: TODO
  object_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      TX_VESTING_EVENT: TODO
  date:
    kind: TODO
    target: TODO
  security_id:
    kind: TODO
    target: TODO
  event_id:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
