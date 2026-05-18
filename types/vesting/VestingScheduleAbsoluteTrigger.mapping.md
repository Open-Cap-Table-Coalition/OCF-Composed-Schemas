---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingScheduleAbsoluteTrigger.schema.json
ocf_object_type: null
ocf_title: Type - Vesting Schedule Absolute Trigger
ocf_kind: type
required_fields:
  - date
  - type
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Vesting Schedule Absolute Trigger → TBD

> Describes a vesting condition satisfied on an absolute date.

## OCF schema

Source: [`VestingScheduleAbsoluteTrigger.schema.json`](./VestingScheduleAbsoluteTrigger.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingScheduleAbsoluteTrigger.schema.json",
  "title": "Type - Vesting Schedule Absolute Trigger",
  "description": "Describes a vesting condition satisfied on an absolute date.",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/vesting/VestingConditionTrigger.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "VESTING_SCHEDULE_ABSOLUTE"
    },
    "date": {
      "description": "The date on which this condition triggers.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    }
  },
  "required": [
    "date",
    "type"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/vesting/VestingScheduleAbsoluteTrigger.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/2

fields:
  type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      VESTING_SCHEDULE_ABSOLUTE: TODO
  date:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
