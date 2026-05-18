---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/AutomaticConversionOnConditionTrigger.schema.json
ocf_object_type: null
ocf_title: Type - Automatic Conversion on Condition Trigger
ocf_kind: type
required_fields:
  - trigger_id
  - trigger_condition
  - type
  - conversion_right
  - type
  - trigger_id
  - conversion_right
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Automatic Conversion on Condition Trigger → TBD

> Type representation of automatic trigger on a tive or condition.

## OCF schema

Source: [`AutomaticConversionOnConditionTrigger.schema.json`](./AutomaticConversionOnConditionTrigger.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/AutomaticConversionOnConditionTrigger.schema.json",
  "title": "Type - Automatic Conversion on Condition Trigger",
  "description": "Type representation of automatic trigger on a tive or condition.",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_triggers/ConversionTrigger.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "AUTOMATIC_ON_CONDITION"
    },
    "trigger_id": {
      "description": "Id for this conversion trigger, unique within list of ConversionTriggers in parent convertible issuance's `conversion_triggers` field.",
      "type": "string"
    },
    "nickname": {
      "description": "Human-friendly nickname to describe the conversion right",
      "type": "string"
    },
    "trigger_description": {
      "description": "Long-form description of the trigger",
      "type": "string"
    },
    "conversion_right": {
      "description": "When the conditions of the trigger are met, how does the convertible convert?",
      "oneOf": [
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/ConvertibleConversionRight.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/WarrantConversionRight.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/StockClassConversionRight.schema.json"
        }
      ]
    },
    "trigger_condition": {
      "description": "Legal language describing what conditions must be satisfied for the conversion to take place (ideally, this should be excerpted from the instrument where possible)",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "trigger_id",
    "trigger_condition",
    "type",
    "conversion_right",
    "type",
    "trigger_id",
    "conversion_right"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_triggers/AutomaticConversionOnConditionTrigger.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/6

fields:
  type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      AUTOMATIC_ON_CONDITION: TODO
  trigger_id:
    kind: TODO
    target: TODO
  nickname:
    kind: TODO
    target: TODO
  trigger_description:
    kind: TODO
    target: TODO
  conversion_right:
    kind: TODO
    target: TODO
  trigger_condition:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
