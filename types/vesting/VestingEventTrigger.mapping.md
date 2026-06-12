---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingEventTrigger.schema.json
ocf_object_type: null
ocf_title: Type - Vesting Event Trigger
ocf_kind: type
required_fields:
  - type
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Vesting Event Trigger → Carta

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
status: complete
coverage: 1/1

fields:
  type:
    kind: unmappable
    target: null
    values:
      VESTING_EVENT: null
```

## Notes / open questions

- OCF abandoned vesting machinery (no Carta counterpart). The canonical vesting layer at `canonical/vesting/` is the proposed replacement.
