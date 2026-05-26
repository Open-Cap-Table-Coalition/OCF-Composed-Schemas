# Canonical schemas

This directory holds canonical normalization schemas — internal intermediate shapes that mapping work points at when neither the OCF source nor the target schema is the right anchor.

Today: `vesting/` (the spec layer) and `transactions/` (issuance + the vesting-start anchor + the vesting-event witness).

## Why the canonical layer exists (for vesting)

Vesting is structurally different from other cap-table schema work. Vesting is effectively **spec + compiler + projection**:

- The **spec** expresses the inputs (schedule parameters)
- The **compiler** evaluates those inputs
- The **projection** is the resulting stream of vesting events (date + amount pairs)

OCF's `types/Vesting.schema.json` (`{ date, amount }`) is the **projection layer**. Carta's `VestingScheduleTemplate` + `Vesting` + `*VestingEvent` is the full three-layer model. The canonical shape here is the **spec layer** — a stable target the mapping work anchors on, positioned as a hypothetical OCF vesting AST.

## Vesting types

`vesting/VestingScheduleTemplate.schema.json` defines:

- `VestingScheduleTemplate` — `{ id, statements: VestingStatement[] }` — the reusable schedule shape. Per-grant binding is carried by the issuance transaction (`TX_CANONICAL_EQUITY_COMPENSATION_ISSUANCE`) which refs the template, plus a separate `TX_CANONICAL_VESTING_START` that anchors any DATE-based statements to a wall-clock date.
- `VestingStatement` — `{ order, vesting_base, occurrences, period: integer, period_type: PeriodType, cliff?: Cliff, percentage: Fraction }` — a segment of a template, producing a sequence of vesting events; total segment duration is `occurrences * period` in `period_type` units. The segment's clock begins at the anchor implied by `vesting_base`.
- `VestingBaseDate` — `{ type: "DATE" }` — statement is date-anchored. The anchor date is supplied per-grant by `TX_CANONICAL_VESTING_START` and is not carried by the spec.
- `VestingBaseEvent` — `{ type: "EVENT", event_id: string }` — statement is anchored to a named event. The firing date is supplied by `TX_CANONICAL_VESTING_EVENT` whose `event_id` matches. Multiple statements may reference the same event.
- `Cliff` — `{ occurrence: integer, percentage: Fraction }` — optional cliff within a statement (`occurrence` is the 1-indexed installment at which the cliff applies)
- `Fraction` — `{ numerator: integer, denominator: integer (≥ 1) }` — rational fraction (avoids decimal drift)
- `PeriodType` — OCF's existing enum at `enums/PeriodType.schema.json`: `"DAYS" | "MONTHS" | "YEARS"`

For mappings to specific target schemas (currently Carta), see [`VestingScheduleTemplate.mapping.md`](./VestingScheduleTemplate.mapping.md).

A TypeScript version of the same types is in [`types.ts`](./types.ts) for reference.

### Scope restrictions

Covers time-based and event-anchored vesting with an optional cliff. Each `VestingStatement` anchors to either a date (per-grant via `TX_CANONICAL_VESTING_START`) or a single named event (firing recorded by `TX_CANONICAL_VESTING_EVENT`). Deliberately excluded:

- Allocation methods other than `CUMULATIVE_ROUND_DOWN` (omitted from schema; implicit default)
- Compositional event logic (`BEFORE`/`AFTER` constraints, `AND`/`OR` conditions, `EARLIER_OF`/`LATER_OF` selectors). Such expressions, if present in an upstream authoring layer, are expected to resolve to single named events before reaching canonical. Canonical sees the event, not its decomposition.
- Event-based cliffs (cliffs are duration-only within a time-based statement)
- Acceleration clauses
- Performance-condition metadata (Carta's `PerformanceConditionType`, `minPayoutPercentage`/`maxPayoutPercentage` band). Realized payout at firing time is captured via `TX_CANONICAL_VESTING_EVENT.realized_fraction`; the band metadata itself is not preserved.
- Termination-aware vesting. Whether an event-anchored vest fires when the recipient is no longer employed is a consumer-side concern. Canonical does not model termination, termination reasons, or post-termination policies. Carta's `vestsPostTermination` flag is Carta-specific data and does not round-trip through canonical.
- Unresolved / impossible states (events that never fire)

Schedules outside this scope cannot be expressed in canonical. Source schemas (like Carta) that include these features are partially mappable at best — the structural skeleton is captured; the rest is dropped.

## Relationship to OCF projection layer

OCF's `types/Vesting.schema.json` (`{ date, amount }`) is the **projection layer** — the materialized stream of vesting events. The canonical spec layer here describes the *recipe*; `types/Vesting.schema.json` describes a *single event*.

The two coexist:

- A grant can carry both — the spec (an issuance referencing a `VestingScheduleTemplate`, plus `TX_CANONICAL_VESTING_START` to anchor date-based statements, plus zero or more `TX_CANONICAL_VESTING_EVENT` transactions for event-anchored statements that have fired) and a list of `Vesting` events (projection).
- Or only the projection, if the spec was lost or never materialized to canonical.
- Or only the spec, if events haven't been computed yet.

Mapping Carta `*VestingEvent` types ↔ OCF `Vesting` is the **projection-layer mapping**, documented in `types/Vesting.mapping.md`. Separate concern from this directory.
