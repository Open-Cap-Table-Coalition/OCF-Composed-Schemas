# Canonical schemas

This directory holds canonical normalization schemas — internal intermediate shapes that mapping work points at when neither the OCF source nor the target schema is the right anchor.

Today: `vesting/` only.

## Why the canonical layer exists (for vesting)

Vesting is structurally different from other cap-table schema work. Vesting is effectively **spec + compiler + projection**:

- The **spec** expresses the inputs (schedule parameters)
- The **compiler** evaluates those inputs
- The **projection** is the resulting stream of vesting events (date + amount pairs)

OCF's `types/Vesting.schema.json` (`{ date, amount }`) is the **projection layer**. Carta's `VestingScheduleTemplate` + `Vesting` + `*VestingEvent` is the full three-layer model. The canonical shape here is the **spec layer** — a stable target the mapping work anchors on, positioned as a hypothetical OCF vesting AST.

## Vesting types

Each entity is its own OCF-native schema file (one file per entity, cross-referenced by `$ref`, the way OCF itself is structured):

- [`VestingScheduleTemplate.schema.json`](./VestingScheduleTemplate.schema.json) — `{ id, statements: VestingStatement[] }` — the reusable schedule shape
- [`VestingSchedule.schema.json`](./VestingSchedule.schema.json) — `{ template_id, start_date }` — per-grant application of a template
- [`VestingStatement.schema.json`](./VestingStatement.schema.json) — `{ order, occurrences, period: integer, period_type: PeriodType, cliff?, percentage: Fraction }` — a segment of a template, producing a sequence of vesting events; total segment duration is `occurrences * period` in `period_type` units
  - `cliff?` — optional, inlined on the statement, **time-based**: `{ length: integer, lengthUnit: PeriodType, percentage: Fraction }`. `length`/`lengthUnit` give the duration until the cliff (so a cliff can fall between installments); `percentage` is the share that vests at the cliff.
- [`Fraction.schema.json`](./Fraction.schema.json) — `{ numerator: integer, denominator: integer (≥ 1) }` — rational fraction, integer-only by design so exact rational percentages survive without decimal drift
- `PeriodType` — OCF's existing enum at `enums/PeriodType.schema.json`: `"DAYS" | "MONTHS" | "YEARS"`

Each entity has a sibling `*.mapping.md` describing its mapping to a target (currently Carta). `cliff` and `Fraction` have no standalone mapping file — Carta inlines the cliff fields on `VestingPeriod` and consumes the fraction as a `Decimal`, both via `VestingStatement`'s split/computed transforms. For the cross-entity projection rule and worked examples, see [Mapping to Carta](#mapping-to-carta) below.

A TypeScript version of the same types is in [`types.ts`](./types.ts) for reference.

### Scope restrictions

Covers vanilla time-based vesting with an optional cliff. Deliberately excluded:

- Allocation methods other than `CUMULATIVE_ROUND_DOWN` (omitted from schema; implicit default)
- Event-based logic (`EVENT` bases, `BEFORE`/`AFTER` constraints, `AND`/`OR` conditions, `EARLIER_OF`/`LATER_OF` selectors)
- Event-based cliffs
- Acceleration clauses
- Unresolved / impossible states
- Milestone-based vesting
- Performance conditions

Schedules outside this scope cannot be expressed in canonical. Source schemas (like Carta) that include these features are partially mappable at best — the time-based skeleton is captured; the rest is dropped.

## Mapping to Carta

Each canonical `VestingStatement` maps to one Carta `VestingPeriod`; the `statements` array becomes Carta's `VestingScheduleTemplate.periods[]`. The per-grant `VestingSchedule` maps to Carta's `Vesting`. The per-entity mapping blocks live in the sibling `*.mapping.md` files; this section covers the cross-entity rule and worked examples.

### Per-statement rule

For each `VestingStatement` in `VestingScheduleTemplate.statements`:

1. Produce one Carta `VestingPeriod`.
2. `period`, together with `occurrences` and `period_type`, produces Carta's `length`, `lengthUnit`, and `vestingMethod`.
3. The optional `cliff`, if present, produces Carta's `cliffLength`/`cliffLengthUnit`/`cliffPercentage` by a direct field-for-field copy — no installment-index reconstruction:
   - `cliffLength = cliff.length`
   - `cliffLengthUnit = cliff.lengthUnit` (DAYS → DAY; MONTHS → MONTH; YEARS → YEAR)
   - `cliffPercentage = cliff.percentage.numerator / cliff.percentage.denominator`

Statements chain implicitly by `order` — statement 2 starts where statement 1 ended. The grant-level `VestingSchedule.start_date` anchors the whole sequence.

### Normalization note

`period_type` is OCF's `PeriodType` enum (`DAYS | MONTHS | YEARS`). The same duration can be expressed two ways (e.g. `period: 12, period_type: MONTHS` vs `period: 1, period_type: YEARS`). Prefer the form with the smaller `period_type` (MONTHS over YEARS, DAYS over MONTHS where applicable) for canonical comparison.

### Worked examples

Each example shows canonical input → Carta output.

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
        "length": 12,
        "lengthUnit": "MONTHS",
        "percentage": { "numerator": 1, "denominator": 4 }
      },
      "percentage": { "numerator": 1, "denominator": 1 }
    }]
  },
  "VestingSchedule": { "template_id": "tmpl-standard", "start_date": "2025-01-01" }
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
  },
  "Vesting": { "templateId": "tmpl-standard", "startDate": "2025-01-01" }
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
        "length": 12,
        "lengthUnit": "MONTHS",
        "percentage": { "numerator": 3, "denominator": 10 }
      },
      "percentage": { "numerator": 1, "denominator": 1 }
    }]
  },
  "VestingSchedule": { "template_id": "tmpl-30-cliff", "start_date": "2025-01-01" }
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
  },
  "Vesting": { "templateId": "tmpl-30-cliff", "startDate": "2025-01-01" }
}
```

#### 3. Bespoke 5/15/40/40 over 4 years

Canonical input — four chained statements, each a single annual vest, no cliff:

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
  },
  "VestingSchedule": { "template_id": "tmpl-bespoke", "start_date": "2025-01-01" }
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
  },
  "Vesting": { "templateId": "tmpl-bespoke", "startDate": "2025-01-01" }
}
```

### Carta features not produced from canonical

These Carta fields/types have no canonical counterpart and are either omitted from produced output or filled with Carta defaults:

- `Acceleration.{name, terms}` — out of scope
- `PerformanceCondition` (entire object) — out of scope
- `vestingScheduleType: MILESTONE | HYBRID` — only `DATE` is produced
- `VestingPeriod.{vestingOccurs, milestoneName, immediatePercentage, performanceCondition}` — day-anchor + milestone + immediate-vest + performance metadata
- `VestingScheduleTemplate.{uuid, issuerId, description, name}` — Carta-internal metadata
- `VestingSchedule` (Carta's *materialized instance* type, not the template) — Carta computes this from the template + start date

## Relationship to OCF projection layer

OCF's `types/Vesting.schema.json` (`{ date, amount }`) is the **projection layer** — the materialized stream of vesting events. The canonical spec layer here describes the *recipe*; `types/Vesting.schema.json` describes a *single event*.

The two coexist:

- A grant can carry both — a canonical `VestingScheduleTemplate` + `VestingSchedule` (spec) and a list of `Vesting` events (projection).
- Or only the projection, if the spec was lost or never materialized to canonical.
- Or only the spec, if events haven't been computed yet.

Mapping Carta `*VestingEvent` types ↔ OCF `Vesting` is the **projection-layer mapping**, documented in `types/Vesting.mapping.md`. Separate concern from this directory.
