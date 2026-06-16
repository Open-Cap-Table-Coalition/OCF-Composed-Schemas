---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingScheduleRelativeTrigger.schema.json
ocf_object_type: null
ocf_title: Type - Vesting Schedule Relative Trigger
ocf_kind: type
required_fields:
  - period
  - relative_to_condition_id
  - type
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Vesting Schedule Relative Trigger → Carta

> Describes a vesting condition satisfied when a period of time, relative to another vesting condition, has elapsed.

## OCF schema

Source: [`VestingScheduleRelativeTrigger.schema.json`](./VestingScheduleRelativeTrigger.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingScheduleRelativeTrigger.schema.json",
  "title": "Type - Vesting Schedule Relative Trigger",
  "description": "Describes a vesting condition satisfied when a period of time, relative to another vesting condition, has elapsed.",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/vesting/VestingConditionTrigger.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "VESTING_SCHEDULE_RELATIVE"
    },
    "period": {
      "description": "The span of time that must have elapsed since the condition `relative_to_condition_id` occurred for this condition to trigger. For weeks or \"ideal\" years (365 days), use `VestingPeriodInDays`. For calendar years use `VestingPeriodInMonths`.",
      "oneOf": [
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingPeriodInDays.schema.json"
        },
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingPeriodInMonths.schema.json"
        }
      ]
    },
    "relative_to_condition_id": {
      "description": "Reference to the vesting condition ID to which the `period` is relative",
      "type": "string"
    }
  },
  "required": [
    "period",
    "relative_to_condition_id",
    "type"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/vesting/VestingScheduleRelativeTrigger.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 3/3

fields:
  type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      VESTING_SCHEDULE_RELATIVE: null
  period:
    kind: unmappable
    target: null
    reason: no-equivalent
  relative_to_condition_id:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- OCF abandoned vesting machinery (no Carta counterpart). The canonical vesting layer at `canonical/vesting/` is the proposed replacement.
