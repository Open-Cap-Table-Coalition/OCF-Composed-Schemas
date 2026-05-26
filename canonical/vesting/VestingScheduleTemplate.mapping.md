---
canonical_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/main/canonical/vesting/VestingScheduleTemplate.schema.json
canonical_title: Canonical - Vesting
canonical_kind: type
required_fields: []
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-20
---

# Canonical - Vesting → Carta

> Canonical (hypothetical OCF) representation of time-based vesting: a reusable schedule template (`VestingScheduleTemplate`) composed of vesting statements that describe how a grant vests over time. Per-grant binding is carried by `TX_CANONICAL_EQUITY_COMPENSATION_ISSUANCE` (refs a template) plus `TX_CANONICAL_VESTING_START` (anchors it to a date). Assumes CUMULATIVE_ROUND_DOWN allocation throughout.

## Canonical schema

Source: [`VestingScheduleTemplate.schema.json`](./VestingScheduleTemplate.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft/2020-12/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/main/canonical/vesting/VestingScheduleTemplate.schema.json",
  "title": "Canonical - Vesting",
  "description": "Canonical (hypothetical OCF) representation of vesting: a reusable schedule template (VestingScheduleTemplate) composed of one or more VestingStatements. Each statement is anchored either to a date (the per-grant anchor supplied by TX_CANONICAL_VESTING_START) or to a named event (whose firing is recorded by TX_CANONICAL_VESTING_EVENT). Assumes CUMULATIVE_ROUND_DOWN allocation throughout.",
  "$defs": {
    "VestingScheduleTemplate": {
      "type": "object",
      "description": "Reusable vesting schedule shape, independent of any specific grant. Per-grant binding is carried on TX_CANONICAL_EQUITY_COMPENSATION_ISSUANCE (refs a template) plus a separate TX_CANONICAL_VESTING_START that anchors any DATE-based statements to a wall-clock date.",
      "properties": {
        "id":         { "type": "string" },
        "statements": {
          "type": "array",
          "items":    { "$ref": "#/$defs/VestingStatement" },
          "minItems": 1
        }
      },
      "required": ["id", "statements"],
      "additionalProperties": false
    },
    "VestingStatement": {
      "type": "object",
      "description": "One segment within a template; produces a sequence of vesting events at the given cadence.",
      "properties": {
        "order":        { "type": "integer", "minimum": 1 },
        "vesting_base": {
          "oneOf": [
            { "$ref": "#/$defs/VestingBaseDate" },
            { "$ref": "#/$defs/VestingBaseEvent" }
          ]
        },
        "occurrences":  { "type": "integer", "minimum": 1 },
        "period":       { "type": "integer", "minimum": 0, "description": "Length of one installment, in period_type units. Total segment duration is occurrences * period." },
        "period_type":  { "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/PeriodType.schema.json" },
        "cliff":        { "$ref": "#/$defs/Cliff" },
        "percentage":   { "$ref": "#/$defs/Fraction" }
      },
      "required": ["order", "vesting_base", "occurrences", "period", "period_type", "percentage"],
      "additionalProperties": false
    },
    "VestingBaseDate": {
      "type": "object",
      "properties": { "type": { "const": "DATE" } },
      "required": ["type"],
      "additionalProperties": false
    },
    "VestingBaseEvent": {
      "type": "object",
      "properties": {
        "type":     { "const": "EVENT" },
        "event_id": { "type": "string" }
      },
      "required": ["type", "event_id"],
      "additionalProperties": false
    },
    "Fraction": {
      "type": "object",
      "properties": {
        "numerator":   { "type": "integer" },
        "denominator": { "type": "integer", "minimum": 1 }
      },
      "required": ["numerator", "denominator"],
      "additionalProperties": false
    },
    "Cliff": {
      "type": "object",
      "description": "Optional cliff on a VestingStatement. `occurrence` is the 1-indexed installment at which the cliff applies (must be <= the containing VestingStatement.occurrences).",
      "properties": {
        "occurrence": { "type": "integer", "minimum": 1 },
        "percentage": { "$ref": "#/$defs/Fraction" }
      },
      "required": ["occurrence", "percentage"],
      "additionalProperties": false
    }
  }
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 11/11

fields:
  # === VestingScheduleTemplate → Carta VestingScheduleTemplate ===
  "VestingScheduleTemplate.id":
    kind: rename
    target: "#/$defs/VestingScheduleTemplate/properties/id"
  "VestingScheduleTemplate.statements":
    kind: rename
    target: "#/$defs/VestingScheduleTemplate/properties/periods"
  # `vestingScheduleType` (DATE | MILESTONE | HYBRID) is computed from the set of
  # `vesting_base.type` values across all statements (see Notes).
  "VestingScheduleTemplate.statements[].vesting_base":
    kind: computed
    target: "#/$defs/VestingScheduleTemplate/properties/vestingScheduleType"

  # === VestingStatement → Carta VestingPeriod ===
  "VestingStatement.order":
    kind: rename
    target: "#/$defs/VestingPeriod/properties/order"
  "VestingStatement.occurrences":
    kind: computed
    target: "#/$defs/VestingPeriod/properties/length"
    transform: |
      length = occurrences * period
      (See VestingStatement.period_type for lengthUnit; see VestingStatement.period for vestingMethod.)
  "VestingStatement.period":
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
      (Also contributes to length via occurrences * period — see VestingStatement.occurrences.)
  "VestingStatement.period_type":
    kind: enum-remap
    target: "#/$defs/VestingPeriod/properties/lengthUnit"
    values:
      DAYS:   DAY
      MONTHS: MONTH
      YEARS:  YEAR
  "VestingStatement.cliff":
    kind: split
    target:
      - "#/$defs/VestingPeriod/properties/cliffLength"
      - "#/$defs/VestingPeriod/properties/cliffLengthUnit"
      - "#/$defs/VestingPeriod/properties/cliffPercentage"
    transform: |
      cliffLength     = cliff.occurrence * period
      cliffLengthUnit = period_type (DAYS -> DAY; MONTHS -> MONTH; YEARS -> YEAR)
      cliffPercentage = cliff.percentage.numerator / cliff.percentage.denominator
  "VestingStatement.percentage":
    kind: computed
    target: "#/$defs/VestingPeriod/properties/percentage"
    transform: |
      percentage = numerator / denominator
  "VestingStatement.vesting_base":
    kind: enum-remap
    target: "#/$defs/VestingPeriod/properties/milestoneName"
    values:
      DATE: null
      EVENT: vesting_base.event_id
    transform: |
      For DATE: VestingPeriod has no milestoneName or performanceCondition (time-only).
      For EVENT: VestingPeriod.milestoneName = vesting_base.event_id; performanceCondition is populated with name = event_id, type = PERFORMANCE_CONDITION_TYPE_EVENT_NON_MARKET (the most generic Carta categorization). See Notes.
```

## Notes / open questions

Each canonical `VestingStatement` maps to one Carta `VestingPeriod`; the array becomes Carta's `VestingScheduleTemplate.periods[]`. The per-grant binding to Carta's `Vesting` object (the `templateId` reference and the `startDate` anchor) is sourced from the canonical transactions — `TX_CANONICAL_EQUITY_COMPENSATION_ISSUANCE.vesting_template_id` and `TX_CANONICAL_VESTING_START.date` respectively — and lives in those transactions' mapping docs (a follow-up).

### Per-statement rule

For each `VestingStatement` in `VestingScheduleTemplate.statements`:

1. Produce one Carta `VestingPeriod` with fields derived per the mapping block above.
2. The `period` field, together with `occurrences` and `period_type`, produces Carta's `length`, `lengthUnit`, and `vestingMethod` (the three Carta-side period fields).
3. The optional `cliff` field, if present, produces Carta's `cliffLength`, `cliffLengthUnit`, and `cliffPercentage`.

Statements chain implicitly by `order` — statement 2 starts where statement 1 ended. The grant-level anchor date (supplied by `TX_CANONICAL_VESTING_START`) anchors the whole sequence.

### Normalization note

`period_type` is OCF's `PeriodType` enum (`DAYS | MONTHS | YEARS`), inherited from OCF for consistency with `TerminationWindow` etc. This means the same duration can be expressed two ways (e.g., `period: 12, period_type: MONTHS` vs `period: 1, period_type: YEARS`). Prefer the form with the smaller `period_type` (i.e., MONTHS over YEARS, DAYS over MONTHS where applicable) for canonical comparison.

### Worked examples

Each example shows the canonical `VestingScheduleTemplate` and the Carta `VestingScheduleTemplate` it produces. The per-grant binding to Carta's `Vesting` object — `templateId` and `startDate` — is sourced from the canonical transactions (`TX_CANONICAL_EQUITY_COMPENSATION_ISSUANCE.vesting_template_id` and `TX_CANONICAL_VESTING_START.date`) and is not shown here.

#### 1. Standard 4-year monthly with 1-year 25% cliff

Canonical input:

```json
{
  "VestingScheduleTemplate": {
    "id": "tmpl-standard",
    "statements": [{
      "order": 1,
      "occurrences": 48,
      "period": 1,
      "period_type": "MONTHS",
      "cliff": {
        "occurrence": 12,
        "percentage": { "numerator": 1, "denominator": 4 }
      },
      "percentage": { "numerator": 1, "denominator": 1 }
    }]
  }
}
```

Carta output:

```json
{
  "VestingScheduleTemplate": {
    "id": "tmpl-standard",
    "vestingScheduleType": "DATE",
    "periods": [{
      "order": 1,
      "length": 48,
      "lengthUnit": "MONTH",
      "vestingMethod": "MONTHLY",
      "cliffLength": 12,
      "cliffLengthUnit": "MONTH",
      "cliffPercentage": 0.25,
      "percentage": 1.0
    }]
  }
}
```

#### 2. Non-standard cliff (30% at cliff)

Canonical input — same as #1 but with `cliff.percentage` of 3/10 instead of 1/4:

```json
{
  "VestingScheduleTemplate": {
    "id": "tmpl-30-cliff",
    "statements": [{
      "order": 1,
      "occurrences": 48,
      "period": 1,
      "period_type": "MONTHS",
      "cliff": {
        "occurrence": 12,
        "percentage": { "numerator": 3, "denominator": 10 }
      },
      "percentage": { "numerator": 1, "denominator": 1 }
    }]
  }
}
```

Carta output — `cliffPercentage` carries the 30% directly:

```json
{
  "VestingScheduleTemplate": {
    "id": "tmpl-30-cliff",
    "vestingScheduleType": "DATE",
    "periods": [{
      "order": 1,
      "length": 48,
      "lengthUnit": "MONTH",
      "vestingMethod": "MONTHLY",
      "cliffLength": 12,
      "cliffLengthUnit": "MONTH",
      "cliffPercentage": 0.30,
      "percentage": 1.0
    }]
  }
}
```

#### 3. Bespoke 5/15/40/40 over 4 years

Canonical input — four chained statements, each a single annual vest:

```json
{
  "VestingScheduleTemplate": {
    "id": "tmpl-bespoke",
    "statements": [
      { "order": 1, "occurrences": 1, "period": 12, "period_type": "MONTHS",
        "percentage": { "numerator": 1, "denominator": 20 } },
      { "order": 2, "occurrences": 1, "period": 12, "period_type": "MONTHS",
        "percentage": { "numerator": 3, "denominator": 20 } },
      { "order": 3, "occurrences": 1, "period": 12, "period_type": "MONTHS",
        "percentage": { "numerator": 2, "denominator": 5 } },
      { "order": 4, "occurrences": 1, "period": 12, "period_type": "MONTHS",
        "percentage": { "numerator": 2, "denominator": 5 } }
    ]
  }
}
```

Carta output:

```json
{
  "VestingScheduleTemplate": {
    "id": "tmpl-bespoke",
    "vestingScheduleType": "DATE",
    "periods": [
      { "order": 1, "length": 12, "lengthUnit": "MONTH", "vestingMethod": "ANNUALLY", "percentage": 0.05 },
      { "order": 2, "length": 12, "lengthUnit": "MONTH", "vestingMethod": "ANNUALLY", "percentage": 0.15 },
      { "order": 3, "length": 12, "lengthUnit": "MONTH", "vestingMethod": "ANNUALLY", "percentage": 0.40 },
      { "order": 4, "length": 12, "lengthUnit": "MONTH", "vestingMethod": "ANNUALLY", "percentage": 0.40 }
    ]
  }
}
```

### Computing `vestingScheduleType`

The template-level `vestingScheduleType` enum on Carta's `VestingScheduleTemplate` is derived from the set of `vesting_base.type` values across all the template's statements:

- All statements have `vesting_base.type: DATE` → `vestingScheduleType: DATE`
- All statements have `vesting_base.type: EVENT` → `vestingScheduleType: MILESTONE`
- Mix of DATE and EVENT statements → `vestingScheduleType: HYBRID`

### Event-anchored statements

For statements with `vesting_base.type: EVENT`:

- `VestingPeriod.milestoneName` is populated from `vesting_base.event_id`. Carta's `milestoneName` is a human-readable string; canonical's `event_id` is an identifier. Where these conventions differ, the consumer may post-process — e.g., look up a friendly name for the event id. As a minimal default, the `event_id` value is acceptable.
- `VestingPeriod.performanceCondition` is populated with `name = event_id` and `type = PERFORMANCE_CONDITION_TYPE_EVENT_NON_MARKET` (the most generic Carta categorization, since canonical does not distinguish MARKET/PERFORMANCE/EVENT subtypes).
- The time-based fields (`length`, `lengthUnit`, `vestingMethod`, `cliffLength`, `cliffPercentage`) still apply if the statement carries a post-event schedule (e.g., `occurrences: 48, period: 1, period_type: MONTHS` meaning "vest monthly for 48 months after the event fires"). For instant event vesting (`occurrences: 1, period: 0`), `length: 0` and `vestingMethod` has no natural Carta value — producers may omit it or pick `MONTHLY` as a placeholder.

### Carta features not produced from canonical

These Carta fields/types have no canonical counterpart and are either omitted from produced output or filled with Carta defaults:

- `Acceleration.{name, terms}` — out of scope
- `PerformanceCondition.{description, minPayoutPercentage, maxPayoutPercentage, vestsPostTermination, evaluationDate, status, payoutPercentage}` — Canonical populates only `PerformanceCondition.name` and `type` (set to `EVENT_NON_MARKET`). The structured Carta extras (payout band, evaluation date, status, post-termination flag) have no canonical source. The realized payout flows separately via `TX_CANONICAL_VESTING_EVENT.realized_fraction` and is applied at the event-firing level, not as part of the template-level `PerformanceCondition`.
- `VestingPeriod.{vestingOccurs, immediatePercentage}` — day-anchor and immediate-vest metadata
- `VestingScheduleTemplate.{uuid, issuerId, description, name}` — Carta-internal metadata
- `Vesting` (Carta's per-grant materialized instance) — the `templateId` and `startDate` fields are sourced from canonical transactions; the mapping for those lives in [`../transactions/issuance/EquityCompensationIssuance.mapping.md`](../transactions/issuance/EquityCompensationIssuance.mapping.md) and [`../transactions/vesting/VestingStart.mapping.md`](../transactions/vesting/VestingStart.mapping.md).
