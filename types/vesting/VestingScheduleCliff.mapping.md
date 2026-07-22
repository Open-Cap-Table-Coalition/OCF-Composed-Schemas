---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingScheduleCliff.schema.json
ocf_object_type: null
ocf_title: Type - Vesting Schedule Cliff
ocf_kind: type
required_fields:
  - length
  - period_type
  - percentage
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-06-29
---

# Type - Vesting Schedule Cliff → Carta

> A cliff on a v2 vesting schedule, expressed as a duration. `length`/`period_type` give the time until the cliff; `percentage` is the share that vests at the cliff. Expressing the cliff as a duration (rather than an installment index) lets it fall between installments.

## OCF schema

Source: [`VestingScheduleCliff.schema.json`](./VestingScheduleCliff.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingScheduleCliff.schema.json",
  "title": "Type - Vesting Schedule Cliff",
  "description": "A cliff on a v2 vesting schedule, expressed as a duration. `length`/`period_type` give the time until the cliff; `percentage` is the share that vests at the cliff. Expressing the cliff as a duration (rather than an installment index) lets it fall between installments.",
  "type": "object",
  "properties": {
    "length": {
      "description": "Duration until the cliff, in `period_type` units.",
      "type": "integer",
      "minimum": 0
    },
    "period_type": {
      "description": "The cliff's own time unit, independent of the schedule's `period_type`.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/PeriodType.schema.json"
    },
    "percentage": {
      "description": "Share of the grant that vests at the cliff, as an OCF Numeric decimal.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "required": [
    "length",
    "period_type",
    "percentage"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/vesting/VestingScheduleCliff.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | wrap | select | split | combine | enum-remap | computed | unmappable | TODO
# unmappable reason vocabulary: no-equivalent | excluded-from-snapshot | out-of-scope | ocf-internal
status: complete

fields:
  length:
    kind: rename
    target: "#/$defs/VestingPeriod/properties/cliffLength"
  period_type:
    kind: enum-remap
    target: "#/$defs/VestingPeriod/properties/cliffLengthUnit"
    values:
      DAYS: DAY
      MONTHS: MONTH
      YEARS: YEAR
  percentage:
    kind: wrap
    target: "#/$defs/VestingPeriod/properties/cliffPercentage"
```

## Notes / open questions

- A `VestingScheduleCliff` lands on Carta's `VestingPeriod` cliff fields: `length`/`period_type`/`percentage` map to `cliffLength`/`cliffLengthUnit`/`cliffPercentage`. This matches the pre-#227 `canonical/vesting` cliff mapping, which pointed the same fields at `VestingPeriod`.
- `period_type` is an `enum-remap` because OCF's `PeriodType` (`DAYS`/`MONTHS`/`YEARS`) is plural while Carta's `PeriodUnit` (`#/$defs/PeriodUnit`, referenced by `cliffLengthUnit`) is singular (`DAY`/`MONTH`/`YEAR`). The two enums are 1:1, so the remap is total.
- `percentage` uses `kind: wrap`: the bare OCF `Numeric` string is written to the target `Decimal.value` member. Numeric lexical canonicalization is defined by [`Numeric.mapping.md`](../Numeric.mapping.md). The pre-#227 canonical mapping computed this from a `numerator`/`denominator` fraction; #129 simplified the cliff share to a single decimal.
