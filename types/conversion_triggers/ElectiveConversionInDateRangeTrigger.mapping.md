---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/ElectiveConversionInDateRangeTrigger.schema.json
ocf_object_type: null
ocf_title: Type - Elective Conversion In Date Range Trigger
ocf_kind: type
required_fields:
  - trigger_id
  - type
  - start_date
  - end_date
  - conversion_right
  - type
  - trigger_id
  - conversion_right
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Elective Conversion In Date Range Trigger → TBD

> Type representation of elective trigger valid on or after start_date and until or before end_date.

## OCF schema

Source: [`ElectiveConversionInDateRangeTrigger.schema.json`](./ElectiveConversionInDateRangeTrigger.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_triggers/ElectiveConversionInDateRangeTrigger.schema.json",
  "title": "Type - Elective Conversion In Date Range Trigger",
  "description": "Type representation of elective trigger valid on or after start_date and until or before end_date.",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_triggers/ConversionTrigger.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "ELECTIVE_IN_RANGE"
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
    "start_date": {
      "description": "Start date of range (inclusive)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "end_date": {
      "description": "End date of range (inclusive)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "trigger_id",
    "type",
    "start_date",
    "end_date",
    "conversion_right",
    "type",
    "trigger_id",
    "conversion_right"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_triggers/ElectiveConversionInDateRangeTrigger.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/7

fields:
  type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      ELECTIVE_IN_RANGE: TODO
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
  start_date:
    kind: TODO
    target: TODO
  end_date:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
