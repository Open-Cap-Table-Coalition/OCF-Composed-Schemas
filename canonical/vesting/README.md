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

`vesting/VestingScheduleTemplate.schema.json` defines:

- `VestingScheduleTemplate` — `{ id, statements: VestingStatement[] }` — the reusable schedule shape
- `VestingSchedule` — `{ template_id, start_date }` — per-grant application of a template
- `VestingStatement` — `{ order, occurrences, period: integer, period_type: PeriodType, cliff?: Cliff, percentage: Fraction }` — a segment of a template, producing a sequence of vesting events; total segment duration is `occurrences * period` in `period_type` units
- `Cliff` — `{ occurrence: integer, percentage: Fraction }` — optional cliff within a statement (`occurrence` is the 1-indexed installment at which the cliff applies)
- `Fraction` — `{ numerator: integer, denominator: integer (≥ 1) }` — rational fraction (avoids decimal drift)
- `PeriodType` — OCF's existing enum at `enums/PeriodType.schema.json`: `"DAYS" | "MONTHS" | "YEARS"`

For mappings to specific target schemas (currently Carta), see [`VestingScheduleTemplate.mapping.md`](./VestingScheduleTemplate.mapping.md).

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

## Relationship to OCF projection layer

OCF's `types/Vesting.schema.json` (`{ date, amount }`) is the **projection layer** — the materialized stream of vesting events. The canonical spec layer here describes the *recipe*; `types/Vesting.schema.json` describes a *single event*.

The two coexist:

- A grant can carry both — a canonical `VestingScheduleTemplate` + `VestingSchedule` (spec) and a list of `Vesting` events (projection).
- Or only the projection, if the spec was lost or never materialized to canonical.
- Or only the spec, if events haven't been computed yet.

Mapping Carta `*VestingEvent` types ↔ OCF `Vesting` is the **projection-layer mapping**, documented in `types/Vesting.mapping.md`. Separate concern from this directory.
