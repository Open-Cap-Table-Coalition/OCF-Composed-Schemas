---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingEventTrigger.schema.json
ocf_object_type: null
ocf_title: Type - Vesting Event Trigger
ocf_kind: type
required_fields:
  - type
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Vesting Event Trigger → TBD

> Describes a vesting condition satisfied when a particular unscheduled event occurs

## OCF schema

Source: [`VestingEventTrigger.schema.json`](./VestingEventTrigger.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingEventTrigger.schema.json",
  "title": "Type - Vesting Event Trigger",
  "description": "Describes a vesting condition satisfied when a particular unscheduled event occurs",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/vesting/VestingConditionTrigger.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "VESTING_EVENT"
    }
  },
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/vesting/VestingEventTrigger.schema.json",
  "required": [
    "type"
  ]
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/1

fields:
  type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      VESTING_EVENT: TODO
```

## Notes / open questions

- 
