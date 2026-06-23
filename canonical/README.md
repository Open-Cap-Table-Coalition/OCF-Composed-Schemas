# Canonical schemas

This directory holds canonical normalization schemas — internal intermediate shapes that mapping work points at when neither the OCF source nor the target schema is the right anchor. They are positioned as a hypothetical OCF "vesting AST."

Each entity is an OCF-native `*.schema.json` with a sibling `*.mapping.md` describing its mapping to a target (currently Carta). **The schemas and mapping files are the source of truth** — see them for field-level detail. This README covers only what spans multiple files: why the layer exists, the cross-entity projection rule, and open questions.

Two areas:

- [`vesting/`](./vesting) — the reusable vesting **spec**: `VestingScheduleTemplate` (`id` + ordered `statements`) and `VestingStatement` (one segment; shares carried as OCF `Numeric` decimals). Statements carry no anchor — the per-grant start date rides on the issuance (see below).
- [`transactions/`](./transactions) — the per-grant **lifecycle** (canonical analogues of OCF transactions).

## Why the canonical layer exists (for vesting)

Vesting is effectively **spec + compiler + projection**:

- The **spec** expresses the inputs (schedule parameters)
- The **compiler** evaluates those inputs
- The **projection** is the resulting stream of vesting events (`{ date, amount }` pairs)

OCF's `types/Vesting.schema.json` (`{ date, amount }`) is the projection layer. Carta's `VestingScheduleTemplate` + `Vesting` + `*VestingEvent` is the full three-layer model. The canonical shape here is the **spec layer** — a stable target the mapping work anchors on.

## Transaction layer

Per-grant lifecycle lives in [`transactions/`](./transactions), not in a standalone schedule entity:

- [`EquityCompensationIssuance`](./transactions/issuance/EquityCompensationIssuance.mapping.md) — the grant; references a `vesting_template_id` and carries quantity/stakeholder/comp-type. Fans out to Carta `OptionGrant` / `RestrictedStockUnit` / `SarIssuanceTransaction` by `compensation_type`.
- [`VestingEvent`](./transactions/vesting/VestingEvent.mapping.md) — **witnesses** a named event firing for a statement's `event_condition` (→ a Carta `*VestingEvent` row).

The per-grant vesting start date rides on the issuance as **`vesting_start_date`** (it populates Carta's `Vesting.startDate`) — the template is reusable across grants, so the anchor can't live on it. Canonical has no standalone vesting-start transaction; the start is always supplied with the grant, and a not-yet-known (contingent) start is given as a far-future placeholder date rather than modeled as an event.

**Spec and projection are alternative descriptions of one grant.** A grant can carry a declarative `vesting_template_id`, an imperative `vestings` (`{ date, amount }`) list on the issuance, or both — when both are present, OCF Tools will validate that they both agree.

## How a template projects to Carta

Each `VestingStatement` becomes one Carta `VestingPeriod`; `statements[]` becomes Carta's `VestingScheduleTemplate.periods[]`. A statement has two optional axes (at least one present):

1. optional `schedule` → Carta's time fields. Present: `schedule.occurrences`/`period`/`period_type` → `length`/`lengthUnit`/`vestingMethod`, and optional `schedule.cliff` → `cliffLength`/`cliffLengthUnit`/`cliffPercentage`. Absent (a pure milestone) → those fields are left empty.
2. optional `event_condition` → the period's `performanceCondition` (`name` ← `event_id`); the period is held until the named event fires, witnessed by `TX_CANONICAL_VESTING_EVENT`.
3. `order` → `order`; `percentage` → `percentage`.

Statements chain by `order`, anchored at the issuance's `vesting_start_date`. The template's `vestingScheduleType` (DATE/MILESTONE/HYBRID) is **recomputed on export** from the mix of statements (all schedule-only → DATE; all milestone-only → MILESTONE; mixed, or any statement carrying both axes → HYBRID) — it is not stored per statement.

**Normalization:** `period_type` (`DAYS | MONTHS | YEARS`) lets the same duration be written two ways (`12 MONTHS` vs `1 YEARS`); prefer the smaller unit for canonical comparison.

### Worked example — 4-year monthly, 1-year 25% cliff

Spec (reusable template):

```json
{
  "id": "tmpl-standard",
  "statements": [{
    "order": 1,
    "schedule": {
      "occurrences": 48, "period": 1, "period_type": "MONTHS",
      "cliff": { "length": 12, "period_type": "MONTHS", "percentage": "0.25" }
    },
    "percentage": "1"
  }]
}
```

Per-grant binding: an `EquityCompensationIssuance` with `vesting_template_id: "tmpl-standard"` and `vesting_start_date: "2025-01-01"`.

Carta output:

```json
{
  "VestingScheduleTemplate": {
    "vestingScheduleType": "DATE",
    "periods": [{
      "order": 1, "length": 48, "lengthUnit": "MONTH", "vestingMethod": "MONTHLY",
      "cliffLength": 12, "cliffLengthUnit": "MONTH", "cliffPercentage": 0.25, "percentage": 1.0
    }]
  },
  "Vesting": { "startDate": "2025-01-01" }
}
```

### Pure milestone — vests only on an event

A slice that vests entirely when a named event fires carries an `event_condition` and **no** `schedule`:

```json
{ "order": 1, "event_condition": { "event_id": "ipo" }, "percentage": "1" }
```

It projects to a `VestingPeriod` with the time fields empty and a `performanceCondition` named `ipo`; the template's `vestingScheduleType` rolls up to `MILESTONE`.

## Scope

Covers `DATE` (time schedule, optional cliff), `MILESTONE` (event-gated, no schedule), and `HYBRID` (both) statements — at least one axis per statement. Out of scope: richer event logic (`BEFORE`/`AFTER`, `AND`/`OR`, `EARLIER_OF`/`LATER_OF`), event-based cliffs, partial/performance payout, acceleration, and allocation methods other than `CUMULATIVE_ROUND_DOWN` (the implicit default).

## Relationship to OCF projection layer

OCF's `types/Vesting.schema.json` (`{ date, amount }`) is the projection layer — the materialized event stream. The canonical spec here is the *recipe*. A grant can carry both (recipe + materialized `vestings`); mapping Carta `*VestingEvent` ↔ OCF `Vesting` is the projection-layer mapping, documented in [`../types/Vesting.mapping.md`](../types/Vesting.mapping.md) — a separate concern.
