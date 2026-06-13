---
canonical_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/main/canonical/vesting/VestingStatement.schema.json
canonical_title: Canonical - Vesting Statement
canonical_kind: type
required_fields:
  - order
  - occurrences
  - period
  - period_type
  - percentage
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-06-13
---

# Canonical - Vesting Statement → Carta

> One segment within a template; produces a sequence of vesting events at the given cadence. Each statement maps to one Carta `VestingPeriod`. Total segment duration is `occurrences * period` in `period_type` units.

## Canonical schema

Source: [`VestingStatement.schema.json`](./VestingStatement.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft/2020-12/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/main/canonical/vesting/VestingStatement.schema.json",
  "title": "Canonical - Vesting Statement",
  "description": "One segment within a template; produces a sequence of vesting events at the given cadence. Total segment duration is occurrences * period in period_type units.",
  "type": "object",
  "properties": {
    "order": { "type": "integer", "minimum": 1 },
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
      "description": "Optional cliff on this statement, expressed as a duration. length/lengthUnit give the time until the cliff; percentage is the share that vests at the cliff. Expressing the cliff as a duration (rather than an installment index) lets it fall between installments.",
      "properties": {
        "length": {
          "type": "integer",
          "minimum": 0,
          "description": "Duration until the cliff, in lengthUnit units."
        },
        "lengthUnit": {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/PeriodType.schema.json"
        },
        "percentage": {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/main/canonical/vesting/Fraction.schema.json"
        }
      },
      "required": ["length", "lengthUnit", "percentage"],
      "additionalProperties": false
    },
    "percentage": {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/main/canonical/vesting/Fraction.schema.json"
    }
  },
  "required": ["order", "occurrences", "period", "period_type", "percentage"],
  "additionalProperties": false
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 6/6

fields:
  order:
    kind: rename
    target: "#/$defs/VestingPeriod/properties/order"
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
      cliffLengthUnit = cliff.lengthUnit (DAYS -> DAY; MONTHS -> MONTH; YEARS -> YEAR)
      cliffPercentage = cliff.percentage.numerator / cliff.percentage.denominator
  percentage:
    kind: computed
    target: "#/$defs/VestingPeriod/properties/percentage"
    transform: |
      percentage = numerator / denominator
```

## Notes / open questions

Each `VestingStatement` produces one Carta `VestingPeriod`. The `period`/`occurrences`/`period_type` triple produces Carta's `length`, `lengthUnit`, and `vestingMethod`; the optional `cliff` produces `cliffLength`/`cliffLengthUnit`/`cliffPercentage` directly (the cliff is time-based, so no installment-index reconstruction). For the per-statement projection rule, the `period_type` normalization note, and worked examples, see [`../README.md`](../README.md).
