---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingPeriodInMonths.schema.json
ocf_object_type: null
ocf_title: Type - Vesting Period in Months
ocf_kind: type
required_fields:
  - day_of_month
  - length
  - type
  - occurrences
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Vesting Period in Months → Carta

> Describes a period of time expressed in months (e.g. 3 months) for use in Vesting Terms.

## OCF schema

Source: [`VestingPeriodInMonths.schema.json`](./VestingPeriodInMonths.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingPeriodInMonths.schema.json",
  "title": "Type - Vesting Period in Months",
  "description": "Describes a period of time expressed in months (e.g. 3 months) for use in Vesting Terms.",
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
      "const": "MONTHS"
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
    },
    "day_of_month": {
      "description": "The calendar day of a month to award vesting.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/VestingDayOfMonth.schema.json"
    }
  },
  "required": [
    "day_of_month",
    "length",
    "type",
    "occurrences"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/vesting/VestingPeriodInMonths.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 5/5

fields:
  length:
    kind: unmappable
    target: null
  type:
    kind: unmappable
    target: null
    values:
      MONTHS: null
  occurrences:
    kind: unmappable
    target: null
  cliff_installment:
    kind: unmappable
    target: null
  day_of_month:
    kind: unmappable
    target: null
    values:
      01: TODO
      02: TODO
      03: TODO
      04: TODO
      05: TODO
      06: TODO
      07: TODO
      08: TODO
      09: TODO
      10: TODO
      11: TODO
      12: TODO
      13: TODO
      14: TODO
      15: TODO
      16: TODO
      17: TODO
      18: TODO
      19: TODO
      20: TODO
      21: TODO
      22: TODO
      23: TODO
      24: TODO
      25: TODO
      26: TODO
      27: TODO
      28: TODO
      29_OR_LAST_DAY_OF_MONTH: TODO
      30_OR_LAST_DAY_OF_MONTH: TODO
      31_OR_LAST_DAY_OF_MONTH: TODO
      VESTING_START_DAY_OR_LAST_DAY_OF_MONTH: null
```

## Notes / open questions

- OCF abandoned vesting machinery (no Carta counterpart). The canonical vesting layer at `canonical/vesting/` is the proposed replacement.
