---
canonical_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/main/canonical/vesting/VestingStatement.schema.json
canonical_title: Canonical - Vesting Statement
canonical_kind: type
required_fields:
  - order
  - percentage
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-06-16
---

# Canonical - Vesting Statement → Carta

> One segment within a template; each maps to one Carta `VestingPeriod`. Two independent optional axes — a time `schedule` and an `event_condition` — covering `percentage` of the grant.

## Canonical schema

Source: [`VestingStatement.schema.json`](./VestingStatement.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft/2020-12/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/main/canonical/vesting/VestingStatement.schema.json",
  "title": "Canonical - Vesting Statement",
  "description": "One segment within a template, covering `percentage` of the grant. It has two independent optional axes: a time `schedule` and an `event_condition`. With only a schedule it vests on a grid (DATE); with only an event_condition it is a pure milestone that vests when the event fires (MILESTONE); with both it is gated and then grids (HYBRID). At least one axis must be present — a statement with neither is meaningless. The DATE/MILESTONE/HYBRID label is a derived rollup (recomputed on export), not stored here.",
  "type": "object",
  "properties": {
    "order": { "type": "integer", "minimum": 1 },
    "schedule": {
      "type": "object",
      "description": "Optional time schedule. Present ⟺ the statement vests on a time grid; absent ⟺ a pure milestone that vests only when event_condition fires. Total segment duration is occurrences * period in period_type units.",
      "properties": {
        "occurrences": { "type": "integer", "minimum": 1 },
        "period": {
          "type": "integer",
          "minimum": 0,
          "description": "Length of one installment, in period_type units. Total segment duration is occurrences * period."
        },
        "period_type": {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/PeriodType.schema.json"
        },
        "cliff": {
          "type": "object",
          "description": "Optional cliff on this schedule, expressed as a duration. length/period_type give the time until the cliff; percentage is the share that vests at the cliff. Expressing the cliff as a duration (rather than an installment index) lets it fall between installments.",
          "properties": {
            "length": {
              "type": "integer",
              "minimum": 0,
              "description": "Duration until the cliff, in period_type units."
            },
            "period_type": {
              "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/PeriodType.schema.json"
            },
            "percentage": {
              "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
            }
          },
          "required": ["length", "period_type", "percentage"],
          "additionalProperties": false
        }
      },
      "required": ["occurrences", "period", "period_type"],
      "additionalProperties": false
    },
    "event_condition": {
      "type": "object",
      "description": "Optional. A named event (referenced by event_id) that must fire before this statement releases; its firing is recorded by TX_CANONICAL_VESTING_EVENT. Present ⟺ the statement is gated. Canonical models the event by its id and its firing; the event's real-world meaning (what counts as firing) is the producer's, not encoded here.",
      "properties": {
        "event_id": {
          "type": "string",
          "minLength": 1,
          "description": "Identifier of the gating event. Matches event_id on a TX_CANONICAL_VESTING_EVENT."
        }
      },
      "required": ["event_id"],
      "additionalProperties": false
    },
    "percentage": {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "anyOf": [
    { "required": ["schedule"] },
    { "required": ["event_condition"] }
  ],
  "required": ["order", "percentage"],
  "additionalProperties": false
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 4/4

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
      Present ⟺ time-based; absent ⟺ pure milestone (these Carta fields left empty).
      length          = schedule.occurrences * schedule.period
      lengthUnit      = schedule.period_type (DAYS -> DAY; MONTHS -> MONTH; YEARS -> YEAR)
      vestingMethod   = lookup (schedule.period, schedule.period_type):
                          (1,  DAYS)   -> DAILY
                          (7,  DAYS)   -> WEEKLY
                          (1,  MONTHS) -> MONTHLY
                          (2,  MONTHS) -> BI_MONTHLY
                          (3,  MONTHS) -> QUARTERLY
                          (6,  MONTHS) -> SEMI_ANNUALLY
                          (12, MONTHS) -> ANNUALLY
                          (1,  YEARS)  -> ANNUALLY
      cliff (optional, within schedule):
        cliffLength     = schedule.cliff.length
        cliffLengthUnit = schedule.cliff.period_type (DAYS -> DAY; MONTHS -> MONTH; YEARS -> YEAR)
        cliffPercentage = schedule.cliff.percentage   (an OCF Numeric decimal, e.g. "0.25"; copied directly)
  event_condition:
    kind: rename
    target: "#/$defs/PerformanceCondition/properties/name"
  percentage:
    kind: rename
    target: "#/$defs/VestingPeriod/properties/percentage"
```

## Notes / open questions

A `VestingStatement` is a **product of two independent optional axes** — a time `schedule` and an `event_condition`:

|                | no `event_condition` | `event_condition`   |
| -------------- | -------------------- | ------------------- |
| **`schedule`** | DATE                 | HYBRID              |
| no `schedule`  | *(illegal)*          | MILESTONE           |

The illegal corner (neither axis) is ruled out by the schema's `anyOf` invariant (`schedule || event_condition`). A **pure milestone** carries no `schedule` at all — it is no longer forced to encode "no schedule" as a degenerate zero-length grid.

- **`schedule` → Carta's time fields (`split`).** Present ⟺ the period is time-based: `length`/`lengthUnit`/`vestingMethod` (+ the optional `cliff*`) are produced from `occurrences`/`period`/`period_type`/`cliff`. Absent ⟺ a pure milestone: those Carta fields are left empty — Carta's `VestingPeriod` is flat-optional, so "no schedule" is the natural absence, not a magic value.
- **`event_condition` → `performanceCondition.name`.** Its `event_id` maps to the period's `performanceCondition.name`: Carta's `VestingPeriod` carries a period-level `performanceCondition`, so the gate has a home. Canonical models only **event** gates and so stores no condition-type field — a producer materializes the gate as an implicit `EVENT_NON_MARKET` condition. Carta's `MARKET` / `PERFORMANCE_NON_MARKET` conditions and the evaluation fields (`payoutPercentage`, `status`, …) are not representable by `{ event_id }` and are out of scope for this spec-level interchange.
- **`order` / `percentage`** are always present and map directly to `VestingPeriod.order` / `VestingPeriod.percentage`.
- **`vestingScheduleType` (DATE/MILESTONE/HYBRID) is a derived rollup**, recomputed on export at the *template* level from the mix of its statements (all schedule-only → DATE; all milestone-only → MILESTONE; any mix or any statement carrying both axes → HYBRID). It lives on Carta's `VestingScheduleTemplate`, not on the per-statement `VestingPeriod`, so canonical does not store it per statement.
- **Schedule round-trip.** Importing, `length`+`lengthUnit`+`vestingMethod` reconstruct `occurrences`/`period`/`period_type` deterministically except `ANNUALLY`, which is produced by both `(12, MONTHS)` and `(1, YEARS)`; prefer the smaller unit as the normal form.

For the per-statement projection rule and worked examples, see [`../README.md`](../README.md).
