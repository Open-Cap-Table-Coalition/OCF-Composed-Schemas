---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingScheduleSegment.schema.json
ocf_object_type: null
ocf_title: Type - Vesting Schedule Segment
ocf_kind: type
required_fields:
  - occurrences
  - period
  - period_type
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-06-29
---

# Type - Vesting Schedule Segment → Carta

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
status: complete
coverage: 4/4

fields:
  occurrences:
    kind: computed
    target: "#/$defs/VestingPeriod/properties/length"
    transform: |
      length = occurrences * period
      (See period_type for lengthUnit; see period for vestingMethod.)
  period:
    kind: computed
    target: "#/$defs/VestingPeriod/properties/vestingMethod"
    transform: |
      vestingMethod = lookup based on (period, period_type):
        (1,  DAYS)   -> DAILY
        (7,  DAYS)   -> WEEKLY
        (1,  MONTHS) -> MONTHLY
        (2,  MONTHS) -> BI_MONTHLY
        (3,  MONTHS) -> QUARTERLY
        (6,  MONTHS) -> SEMI_ANNUALLY
        (12, MONTHS) -> ANNUALLY
        (1,  YEARS)  -> ANNUALLY
      (Also contributes to length via occurrences * period — see occurrences.)
  period_type:
    kind: enum-remap
    target: "#/$defs/VestingPeriod/properties/lengthUnit"
    values:
      DAYS:   DAY
      MONTHS: MONTH
      YEARS:  YEAR
  cliff:
    kind: split
    target:
      - "#/$defs/VestingPeriod/properties/cliffLength"
      - "#/$defs/VestingPeriod/properties/cliffLengthUnit"
      - "#/$defs/VestingPeriod/properties/cliffPercentage"
    transform: |
      cliffLength     = cliff.length
      cliffLengthUnit = cliff.period_type (DAYS -> DAY; MONTHS -> MONTH; YEARS -> YEAR)
      cliffPercentage = cliff.percentage (OCF Numeric decimal -> Carta Decimal)
```

## Notes / open questions

- A `VestingScheduleSegment` maps to one Carta `VestingPeriod`, mirroring the pre-#227
  `VestingStatement` → `VestingPeriod` projection. The `period`/`occurrences`/`period_type`
  triple yields Carta's `length`, `lengthUnit`, and `vestingMethod`.
- `vestingMethod` is recovered from the `(period, period_type)` pair via the lookup above.
  Cadences OCF can express but Carta's `VestingMethod` enum cannot (e.g. every 5 days, every
  4 months) have no exact target; those would need a custom Carta period or an approximation.
- The segment carries no `percentage`/share-of-grant field (unlike the old `VestingStatement`),
  so there is nothing to map onto `VestingPeriod.percentage` here — Carta derives the per-period
  share from the period cadence and the grant total.
- `cliff.percentage` is an OCF `Numeric` decimal (already a ratio), so it maps straight to
  Carta's `Decimal` `cliffPercentage` with no numerator/denominator division (the old canonical
  cliff used a `Fraction`).
