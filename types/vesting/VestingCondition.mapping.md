---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingCondition.schema.json
ocf_object_type: null
ocf_title: Type - Vesting Condition
ocf_kind: type
required_fields:
  - id
  - trigger
  - next_condition_ids
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Vesting Condition → TBD

> Describes condition / triggers to be satisfied for vesting to occur

## OCF schema

Source: [`VestingCondition.schema.json`](./VestingCondition.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingCondition.schema.json",
  "title": "Type - Vesting Condition",
  "description": "Describes condition / triggers to be satisfied for vesting to occur",
  "type": "object",
  "properties": {
    "id": {
      "description": "Reference identifier for this condition",
      "type": "string",
      "minLength": 1
    },
    "description": {
      "description": "Detailed description of the condition",
      "type": "string"
    },
    "portion": {
      "description": "If specified, the fractional part of the whole security that is vested, e.g. 25:100 for 25%. Use `quantity` for a fixed vesting amount.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingConditionPortion.schema.json"
    },
    "quantity": {
      "description": "If specified, the fixed amount of the whole security to vest, e.g. 10000 shares. Use `portion` for a proportional vesting amount.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "trigger": {
      "description": "Describes how this vesting condition is met, resulting in vesting the specified tranche of shares",
      "oneOf": [
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingStartTrigger.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingScheduleAbsoluteTrigger.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingScheduleRelativeTrigger.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingEventTrigger.schema.json"
        }
      ]
    },
    "next_condition_ids": {
      "description": "List of ALL VestingCondition IDs that can trigger after this one. If there are none, use an empty array.\nConditions should be in priority order in the array, ordered from the highest priority to the lowest.",
      "type": "array",
      "items": {
        "type": "string"
      },
      "uniqueItems": true
    }
  },
  "required": [
    "id",
    "trigger",
    "next_condition_ids"
  ],
  "oneOf": [
    {
      "required": [
        "portion"
      ]
    },
    {
      "required": [
        "quantity"
      ]
    }
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/vesting/VestingCondition.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/6

fields:
  id:
    kind: TODO
    target: TODO
  description:
    kind: TODO
    target: TODO
  portion:
    kind: TODO
    target: TODO
  quantity:
    kind: TODO
    target: TODO
  trigger:
    kind: TODO
    target: TODO
  next_condition_ids:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
