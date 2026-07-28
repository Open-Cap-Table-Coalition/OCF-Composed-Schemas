---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingStatement.schema.json
ocf_object_type: null
ocf_title: Type - Vesting Statement
ocf_kind: type
required_fields:
  - order
  - percentage
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-06-29
---

# Type - Vesting Statement → Carta

> One segment within a v2 vesting template, covering `percentage` of the grant. It has two independent optional axes: a time `schedule` and an `event_condition`. With only a schedule it vests on a grid (DATE); with only an event_condition it is a pure milestone that vests when the event fires (MILESTONE); with both it is gated and then grids (HYBRID). At least one axis must be present.

## OCF schema

Source: [`VestingStatement.schema.json`](./VestingStatement.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingStatement.schema.json",
  "title": "Type - Vesting Statement",
  "description": "One segment within a v2 vesting template, covering `percentage` of the grant. It has two independent optional axes: a time `schedule` and an `event_condition`. With only a schedule it vests on a grid (DATE); with only an event_condition it is a pure milestone that vests when the event fires (MILESTONE); with both it is gated and then grids (HYBRID). At least one axis must be present.",
  "type": "object",
  "properties": {
    "order": {
      "description": "1-indexed position of this statement within the template; statements chain implicitly in this order.",
      "type": "integer",
      "minimum": 1
    },
    "schedule": {
      "description": "Optional time-schedule axis. Present ⟺ the statement vests on a time grid.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingScheduleSegment.schema.json"
    },
    "event_condition": {
      "description": "Optional named-event axis. Present ⟺ the statement is gated on an event firing.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingEventCondition.schema.json"
    },
    "percentage": {
      "description": "The share of the grant this statement covers, as an OCF Numeric decimal (e.g. \"0.25\").",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "anyOf": [
    {
      "required": [
        "schedule"
      ]
    },
    {
      "required": [
        "event_condition"
      ]
    }
  ],
  "required": [
    "order",
    "percentage"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/vesting/VestingStatement.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | construct | select | split | combine | enum-remap | computed | unmappable | TODO
# unmappable reason vocabulary: no-equivalent | excluded-from-snapshot | out-of-scope | ocf-internal
status: complete

# Each VestingStatement projects to one Carta VestingPeriod
# (#/$defs/VestingPeriod), an item of VestingScheduleTemplate.periods[].
# The three statement modes line up with Carta's VestingScheduleType:
# schedule only -> DATE, event_condition only -> MILESTONE, both -> HYBRID.

fields:
  order:
    kind: rename
    target: "#/$defs/VestingPeriod/properties/order"
  schedule:
    kind: split
    target:
      - "#/$defs/VestingPeriod/properties/length"
      - "#/$defs/VestingPeriod/properties/lengthUnit"
      - "#/$defs/VestingPeriod/properties/vestingMethod"
      - "#/$defs/VestingPeriod/properties/cliffLength"
      - "#/$defs/VestingPeriod/properties/cliffLengthUnit"
      - "#/$defs/VestingPeriod/properties/cliffPercentage"
    transform: |
      The schedule sub-object (VestingScheduleSegment) spreads across the
      time fields of one Carta VestingPeriod:
        length        = schedule.occurrences * schedule.period
        lengthUnit    = schedule.period_type (DAYS -> DAY; MONTHS -> MONTH; YEARS -> YEAR)
        vestingMethod = lookup on (schedule.period, schedule.period_type):
          (1,  DAYS)   -> DAILY
          (7,  DAYS)   -> WEEKLY
          (1,  MONTHS) -> MONTHLY
          (2,  MONTHS) -> BI_MONTHLY
          (3,  MONTHS) -> QUARTERLY
          (6,  MONTHS) -> SEMI_ANNUALLY
          (12, MONTHS) -> ANNUALLY
          (1,  YEARS)  -> ANNUALLY
      When schedule.cliff is present:
        cliffLength     = schedule.cliff.length
        cliffLengthUnit = schedule.cliff.period_type (DAYS -> DAY; MONTHS -> MONTH; YEARS -> YEAR)
        cliffPercentage = { value: schedule.cliff.percentage }   # OCF Numeric decimal string -> Carta Decimal
      When schedule is absent (pure MILESTONE statement) none of these are set.
      Per-sub-field detail lives in the sibling VestingScheduleSegment /
      VestingScheduleCliff mappings.
  event_condition:
    kind: computed
    target: "#/$defs/VestingPeriod/properties/milestoneName"
    transform: |
      milestoneName = event_condition.event_id
      The event axis gates this period on a named event, mapping to Carta's
      milestoneName for milestone-based periods. The same value also links to
      the v2 vesting-event transaction that records the firing. See the
      VestingEventCondition mapping for the type-level event_id -> milestoneName
      detail. Absent for pure DATE statements.
  percentage:
    kind: construct
    target: "#/$defs/VestingPeriod/properties/percentage"
    construct:
      property: value
      normalization:
        integer_leading_zeros: strip
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fvesting%2FVestingStatement.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fvesting%2FVestingStatement.mapping.md&title=%5BMapping+question%5D+VestingStatement) |
| `order` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fvesting%2FVestingStatement.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fvesting%2FVestingStatement.mapping.md&title=%5BMapping+question%5D+VestingStatement%3A+order&property_path=order) |
| `schedule` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fvesting%2FVestingStatement.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fvesting%2FVestingStatement.mapping.md&title=%5BMapping+question%5D+VestingStatement%3A+schedule&property_path=schedule) |
| `event_condition` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fvesting%2FVestingStatement.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fvesting%2FVestingStatement.mapping.md&title=%5BMapping+question%5D+VestingStatement%3A+event_condition&property_path=event_condition) |
| `percentage` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fvesting%2FVestingStatement.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fvesting%2FVestingStatement.mapping.md&title=%5BMapping+question%5D+VestingStatement%3A+percentage&property_path=percentage) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- One `VestingStatement` → one Carta `VestingPeriod` (an item of `VestingScheduleTemplate.periods[]`), matching the pre-v2 canonical `VestingStatement → Carta` mapping.
- The statement's two optional axes line up with Carta's `VestingScheduleType` at the template level: `schedule` only → `DATE`, `event_condition` only → `MILESTONE`, both → `HYBRID`. That enum is set on the parent template, not the period, so it is not a target here.
- `percentage` declares the destination member and Numeric lexical rule in its `construct` block.
- `event_condition.event_id` maps to Carta's `VestingPeriod.milestoneName`, the field explicitly described for milestone-based periods. `performanceCondition` is intentionally left unset: OCF carries no condition type, description, evaluation status, or payout values from which to construct that richer object.
- `schedule` is mapped as a `split` at the statement level because the whole sub-object spreads across one `VestingPeriod`'s time fields; the per-sub-field breakdown (occurrences/period/period_type/cliff) lives in the sibling `VestingScheduleSegment` and `VestingScheduleCliff` mappings.
