---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingPeriodInDays.schema.json
ocf_object_type: null
ocf_title: Type - Vesting Period in Days
ocf_kind: type
required_fields:
  - length
  - type
  - occurrences
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Vesting Period in Days → TBD

> Describes a period of time expressed in days (e.g. 365 days) for use in Vesting Terms

## OCF schema

Source: [`VestingPeriodInDays.schema.json`](./VestingPeriodInDays.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingPeriodInDays.schema.json",
  "title": "Type - Vesting Period in Days",
  "description": "Describes a period of time expressed in days (e.g. 365 days) for use in Vesting Terms",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/vesting/VestingPeriod.schema.json"
    }
  ],
  "properties": {
    "length": {
      "description": "The quantity of `type` units of time; e.g. for 3 months, this would be `3`; for 30 days, this would be `30`",
      "type": "integer",
      "minimum": 0
    },
    "type": {
      "const": "DAYS"
    },
    "occurrences": {
      "description": "The number of times this vesting period triggers. If vesting occurs monthly for 36 months, for example, this would be `36`",
      "type": "integer",
      "minimum": 1
    },
    "cliff_installment": {
      "description": "If specified, the 1-indexed vesting installment at which the cliff condition occurs. If this field is not provided or less than 2, it is treated as as if no cliff applies.",
      "type": "integer",
      "minimum": 0
    }
  },
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/vesting/VestingPeriodInDays.schema.json",
  "required": [
    "length",
    "type",
    "occurrences"
  ]
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/4

fields:
  length:
    kind: TODO
    target: TODO
  type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      DAYS: TODO
  occurrences:
    kind: TODO
    target: TODO
  cliff_installment:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
