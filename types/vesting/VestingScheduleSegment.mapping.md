---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingScheduleSegment.schema.json
ocf_object_type: null
ocf_title: Type - Vesting Schedule Segment
ocf_kind: type
required_fields:
  - occurrences
  - period
  - period_type
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-06-29
---

# Type - Vesting Schedule Segment → TBD

> The time-schedule axis of a VestingStatement. Present ⟺ the statement vests on a time grid; absent ⟺ a pure milestone that vests only when its `event_condition` fires. Total segment duration is `occurrences * period` in `period_type` units.

## OCF schema

Source: [`VestingScheduleSegment.schema.json`](./VestingScheduleSegment.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingScheduleSegment.schema.json",
  "title": "Type - Vesting Schedule Segment",
  "description": "The time-schedule axis of a VestingStatement. Present ⟺ the statement vests on a time grid; absent ⟺ a pure milestone that vests only when its `event_condition` fires. Total segment duration is `occurrences * period` in `period_type` units.",
  "type": "object",
  "properties": {
    "occurrences": {
      "description": "Number of installments in this segment.",
      "type": "integer",
      "minimum": 1
    },
    "period": {
      "description": "Length of one installment, in `period_type` units. Total segment duration is `occurrences * period`.",
      "type": "integer",
      "minimum": 0
    },
    "period_type": {
      "description": "Time unit for `period`.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/PeriodType.schema.json"
    },
    "cliff": {
      "description": "Optional cliff on this schedule.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingScheduleCliff.schema.json"
    }
  },
  "required": [
    "occurrences",
    "period",
    "period_type"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/vesting/VestingScheduleSegment.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
# unmappable reason vocabulary: no-equivalent | excluded-from-snapshot | out-of-scope | ocf-internal
status: draft
coverage: 0/4

fields:
  occurrences:
    kind: TODO
    target: TODO
  period:
    kind: TODO
    target: TODO
  period_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      DAYS: TODO
      MONTHS: TODO
      YEARS: TODO
  cliff:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
