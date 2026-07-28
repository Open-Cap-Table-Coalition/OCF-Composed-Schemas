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
target_version: "v1alpha1 (2026-06-22)"
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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# unmappable reason vocabulary: no-equivalent | excluded-from-snapshot | out-of-scope | ocf-internal
status: complete

fields:
  occurrences:
    kind: computed
    target: "#/$defs/VestingPeriod/properties/length"
    transform: |
      length = occurrences * period, normalized to the unit required by the
      June 22 Carta schema. (See period_type for the source unit; see period
      for vestingMethod.)
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
    kind: computed
    target: "#/$defs/VestingPeriod/properties/lengthUnit"
    transform: |
      The June 22 VestingPeriod conditional requires lengthUnit = MONTH for
      DAILY, WEEKLY, MONTHLY, BI_MONTHLY, QUARTERLY, SEMI_ANNUALLY, and
      ANNUALLY vesting methods. Normalize the source period/occurrence value
      into months before emitting length; do not emit DAY or YEAR for these
      cadence methods.
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

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fvesting%2FVestingScheduleSegment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fvesting%2FVestingScheduleSegment.mapping.md&title=%5BMapping+question%5D+VestingScheduleSegment) |
| `occurrences` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fvesting%2FVestingScheduleSegment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fvesting%2FVestingScheduleSegment.mapping.md&title=%5BMapping+question%5D+VestingScheduleSegment%3A+occurrences&property_path=occurrences) |
| `period` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fvesting%2FVestingScheduleSegment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fvesting%2FVestingScheduleSegment.mapping.md&title=%5BMapping+question%5D+VestingScheduleSegment%3A+period&property_path=period) |
| `period_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fvesting%2FVestingScheduleSegment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fvesting%2FVestingScheduleSegment.mapping.md&title=%5BMapping+question%5D+VestingScheduleSegment%3A+period_type&property_path=period_type) |
| `cliff` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fvesting%2FVestingScheduleSegment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fvesting%2FVestingScheduleSegment.mapping.md&title=%5BMapping+question%5D+VestingScheduleSegment%3A+cliff&property_path=cliff) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- A segment projects to one Carta `VestingPeriod`: occurrences × period becomes `length`, the supported cadence maps to `vestingMethod`, and the June 22 conditional requires the emitted cadence period to use `lengthUnit: MONTH`.
- Unsupported cadence combinations have no exact Carta enum. The optional cliff splits into the period's cliff length, unit, and percentage; the segment has no grant-share percentage of its own.
