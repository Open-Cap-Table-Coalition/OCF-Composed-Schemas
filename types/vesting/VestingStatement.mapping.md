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
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
# unmappable reason vocabulary: no-equivalent | excluded-from-snapshot | out-of-scope | ocf-internal
status: complete
coverage: 4/4

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
      The event axis turns the period into a milestone-based VestingPeriod.
      Carta has only the milestone name to carry the gate, so the OCF event_id
      (which also links to the v2 vesting-event transaction that records the
      firing) is reused as the milestoneName. Absent for pure DATE statements.
  percentage:
    kind: computed
    target: "#/$defs/VestingPeriod/properties/percentage"
    transform: |
      percentage = { value: percentage }
      OCF percentage is already a decimal fraction string (e.g. "0.25");
      it is wrapped in Carta's Decimal object ({ value: "0.25" }).
```

## Notes / open questions

- One `VestingStatement` → one Carta `VestingPeriod` (an item of `VestingScheduleTemplate.periods[]`), matching the pre-v2 canonical `VestingStatement → Carta` mapping.
- The statement's two optional axes line up with Carta's `VestingScheduleType` at the template level: `schedule` only → `DATE`, `event_condition` only → `MILESTONE`, both → `HYBRID`. That enum is set on the parent template, not the period, so it is not a target here.
- `event_condition.event_id` has no first-class home on Carta's `VestingPeriod`, so it is reused as `milestoneName`. Open question: a richer mapping could populate `VestingPeriod.performanceCondition` (name/type/status) for HYBRID statements, but OCF carries only the event id here, so `milestoneName` is the faithful one-to-one choice.
- `schedule` is mapped as a `split` at the statement level because the whole sub-object spreads across one `VestingPeriod`'s time fields; the per-sub-field breakdown (occurrences/period/period_type/cliff) lives in the sibling `VestingScheduleSegment` and `VestingScheduleCliff` mappings (still drafts as of #227).
