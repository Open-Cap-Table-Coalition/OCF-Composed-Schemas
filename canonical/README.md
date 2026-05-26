# Canonical schemas

This directory holds **canonical normalization schemas** — internal intermediate shapes that mapping work in this repo points at when neither the OCF source nor the target schema (currently Carta) is the right anchor. Today canonical is used exclusively for vesting, but the directory is structured to accommodate other domains over time.

Canonical schemas are positioned as **hypothetical OCF replacements**, not pipeline intermediates. Where canonical defines a type that overlaps with an existing OCF type, the canonical version is meant to *supersede* the OCF one in a future OCF revision. The mapping work treats the canonical type as the source of truth and does not separately map the OCF original to Carta.

---

## Why canonical exists

Most cap-table schema work is a direct mapping problem: OCF defines a shape, the target system defines a shape, and the mapping documents how to translate one to the other. Vesting is different. Vesting is effectively **spec + compiler + projection**:

- The **spec** expresses the inputs (schedule parameters)
- The **compiler** evaluates those inputs against runtime state (start dates, event firings)
- The **projection** is the resulting stream of vesting events (`{date, amount}` pairs)

OCF's `types/Vesting.schema.json` is the projection layer — a single `{date, amount}` event. OCF's `types/vesting/VestingCondition.schema.json` and `objects/VestingTerms.schema.json` were a partial spec-layer attempt, but model vesting as a DAG of conditions with multiple trigger kinds that never standardized and didn't see real implementation adoption.

Carta has the full three-layer model (template → period → event), but with a fixed shape tied to Carta's runtime semantics. Direct OCF→Carta mapping for vesting therefore ends up either lossy (drop OCF's DAG entirely) or awkward (encode OCF's DAG as Carta's flat periods).

The canonical layer addresses this by introducing a simpler, AST-based spec layer that:

- Carries the vesting recipe in a shape that maps cleanly to Carta;
- Replaces OCF's DAG-based machinery with a flatter, statement-list-based form;
- Pairs the static spec with a small set of event-sourced transactions that supply the runtime data (start anchor, event firings) the compiler needs.

The intent is that a future OCF version could adopt the canonical shapes wholesale.

---

## What's in canonical

```
canonical/
├── README.md                                         # this file
├── vesting/                                          # the vesting spec types
│   ├── VestingScheduleTemplate.schema.json           # schema (multi-type)
│   ├── VestingScheduleTemplate.mapping.md            # canonical → Carta mapping
│   └── types.ts                                      # TypeScript view of the types
└── transactions/                                     # the per-grant transactions
    ├── issuance/
    │   ├── EquityCompensationIssuance.schema.json    # TX_CANONICAL_EQUITY_COMPENSATION_ISSUANCE
    │   └── EquityCompensationIssuance.mapping.md     # canonical → Carta mapping
    └── vesting/
        ├── VestingStart.schema.json                  # TX_CANONICAL_VESTING_START
        ├── VestingStart.mapping.md                   # canonical → Carta mapping
        ├── VestingEvent.schema.json                  # TX_CANONICAL_VESTING_EVENT
        └── VestingEvent.mapping.md                   # canonical → Carta mapping
```

### The spec types (in `canonical/vesting/`)

`VestingScheduleTemplate.schema.json` defines a single composed schema with these `$defs`:

- **`VestingScheduleTemplate`** — `{ id, statements: VestingStatement[] }`. Reusable schedule shape, independent of any specific grant.
- **`VestingStatement`** — `{ order, vesting_base, occurrences, period, period_type, cliff?, percentage }`. One segment within a template; produces a sequence of vesting events at the given cadence.
- **`VestingBaseDate`** — `{ type: "DATE" }`. Statement is anchored to the per-grant date supplied by `TX_CANONICAL_VESTING_START`. No payload (the date lives on the transaction, not the spec).
- **`VestingBaseEvent`** — `{ type: "EVENT", event_id }`. Statement is anchored to a named event whose firing is recorded by `TX_CANONICAL_VESTING_EVENT`. The event's definition (what it means, how it's achieved) is not modeled by canonical; consumers maintain that meaning out-of-band. Multiple statements may reference the same `event_id`.
- **`Cliff`** — `{ occurrence, percentage }`. Optional cliff within a statement (`occurrence` is the 1-indexed installment at which the cliff applies; must be ≤ the containing `VestingStatement.occurrences`).
- **`Fraction`** — `{ numerator, denominator }`. Rational fraction (avoids decimal drift).

A TypeScript mirror lives in [`vesting/types.ts`](./vesting/types.ts).

### The transactions (in `canonical/transactions/`)

Three transaction types — one for issuance, two for vesting machinery:

- **`TX_CANONICAL_EQUITY_COMPENSATION_ISSUANCE`** (`transactions/issuance/`). Field-for-field equivalent to OCF's `TX_EQUITY_COMPENSATION_ISSUANCE`, with one substantive change: `vesting_terms_id` (OCF's DAG reference) is replaced with `vesting_template_id` (canonical's `VestingScheduleTemplate` reference). All other OCF fields are preserved.
- **`TX_CANONICAL_VESTING_START`** (`transactions/vesting/`). Carries the per-grant date anchor for DATE-anchored statements. Fields: `id`, `object_type`, `date`, `security_id`. One per security.
- **`TX_CANONICAL_VESTING_EVENT`** (`transactions/vesting/`). Witness record for event firings. Fields: `id`, `object_type`, `date`, `security_id`, `event_id`, and an optional `realized_fraction` for partial payouts. Multiple per security as events fire.

---

## The vesting model, end-to-end

A complete canonical-vested grant is composed of up to four pieces:

1. A **`VestingScheduleTemplate`** — the reusable spec, defined once per issuer and shared across grants.
2. A **`TX_CANONICAL_EQUITY_COMPENSATION_ISSUANCE`** — the per-grant issuance, which carries the grant's identity (security id, stakeholder, quantity, etc.) and references a template via `vesting_template_id`.
3. A **`TX_CANONICAL_VESTING_START`** — the per-grant date anchor, supplying the wall-clock date that any DATE-anchored statement in the template should resolve to. Omitted if the template has no DATE-anchored statements.
4. Zero or more **`TX_CANONICAL_VESTING_EVENT`** transactions — one per event firing, supplying the date (and optional `realized_fraction`) for any EVENT-anchored statements whose `event_id` matches.

The compiler walks the spec, applies the runtime data from the transactions, and produces the projection (the stream of `{date, amount}` events).

### Time-based vesting

A vanilla 4-year monthly vest with a 1-year cliff:

```json
{
  "VestingScheduleTemplate": {
    "id": "tmpl-standard-4yr",
    "statements": [{
      "order": 1,
      "vesting_base": { "type": "DATE" },
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

For a grant referencing this template, the per-grant binding looks like:

```json
{
  "TxCanonicalEquityCompensationIssuance": {
    "id": "tx-issue-001",
    "object_type": "TX_CANONICAL_EQUITY_COMPENSATION_ISSUANCE",
    "date": "2024-01-15",
    "security_id": "sec-abc",
    "stakeholder_id": "stk-xyz",
    "vesting_template_id": "tmpl-standard-4yr",
    "compensation_type": "OPTION_ISO",
    "quantity": "1000",
    "exercise_price": { "amount": "1.00", "currency": "USD" },
    "expiration_date": "2034-01-15",
    "...": "other required fields"
  },
  "TxCanonicalVestingStart": {
    "id": "tx-start-001",
    "object_type": "TX_CANONICAL_VESTING_START",
    "date": "2024-01-15",
    "security_id": "sec-abc"
  }
}
```

The compiler resolves the statement's DATE anchor to `2024-01-15` from the start transaction and projects 48 monthly vesting events from that anchor, with the 1-year cliff producing 25% at month 12.

### Event-based vesting

A grant that vests 50% on each of two performance milestones:

```json
{
  "VestingScheduleTemplate": {
    "id": "tmpl-2-milestones",
    "statements": [
      {
        "order": 1,
        "vesting_base": { "type": "EVENT", "event_id": "revenue_10m" },
        "occurrences": 1, "period": 0, "period_type": "MONTHS",
        "percentage": { "numerator": 1, "denominator": 2 }
      },
      {
        "order": 2,
        "vesting_base": { "type": "EVENT", "event_id": "revenue_20m" },
        "occurrences": 1, "period": 0, "period_type": "MONTHS",
        "percentage": { "numerator": 1, "denominator": 2 }
      }
    ]
  }
}
```

If revenue hits $10M on 2026-04-01, the issuer emits one witness transaction per affected security:

```json
{
  "TxCanonicalVestingEvent": {
    "id": "tx-event-001",
    "object_type": "TX_CANONICAL_VESTING_EVENT",
    "date": "2026-04-01",
    "security_id": "sec-abc",
    "event_id": "revenue_10m"
  }
}
```

The compiler matches the `event_id` to statement 1 and projects 50% of the grant as vested on 2026-04-01.

### Partial payouts on event firings

Where an event fires "partially" — e.g., revenue hit $15M against a $10M-to-$20M payout band — the witness transaction carries a `realized_fraction`:

```json
{
  "TxCanonicalVestingEvent": {
    "id": "tx-event-002",
    "object_type": "TX_CANONICAL_VESTING_EVENT",
    "date": "2026-04-01",
    "security_id": "sec-abc",
    "event_id": "revenue_band",
    "realized_fraction": { "numerator": 1, "denominator": 2 }
  }
}
```

The compiler multiplies the matching statement's amount by `realized_fraction` to produce the vested quantity. If `realized_fraction` is absent, the firing is binary and the statement's full max amount vests.

### Hybrid templates

A template can mix DATE-anchored and EVENT-anchored statements freely. The compiler resolves each statement's anchor independently from the matching transaction. Order is preserved by `VestingStatement.order` but does not enforce dependency between statements — they each fire when their own conditions are met.

---

## Carta's vesting model, side-by-side

Carta uses a parallel three-layer model:

1. **`VestingScheduleTemplate`** — `{ id, name, vestingScheduleType, periods: VestingPeriod[] }`. The reusable template, tagged with `vestingScheduleType: DATE | MILESTONE | HYBRID` to indicate the kind of vesting it expresses.
2. **`VestingPeriod`** — a segment within a template. Carries time-based fields (`length`, `lengthUnit`, `vestingMethod`, `cliffLength`, `cliffPercentage`, …) and, for non-date periods, milestone fields (`milestoneName`, `performanceCondition`).
3. **`Vesting`** — `{ templateId, startDate, acceleration? }`. The per-grant application. Lives on the grant (`OptionGrant.vestingSchedule`, `RestrictedStockUnit.vestingSchedule`, etc.).

Event firings are represented as rows in the grant's `vestingEvents` array — `OptionGrantVestingEvent` / `RestrictedStockUnitVestingEvent` / `RestrictedStockAwardVestingEvent` — each carrying a `vestDate`, `quantity`, `vested` boolean, and a `performanceCondition` flag. The `PerformanceCondition` object on a `VestingPeriod` carries the structural metadata of a milestone: `name`, `type` (MARKET / PERFORMANCE / EVENT), `minPayoutPercentage` / `maxPayoutPercentage`, and a `status` that Carta updates as the condition is evaluated.

### Conceptual alignment

| Concept | Canonical | Carta |
|---|---|---|
| Reusable schedule | `VestingScheduleTemplate` | `VestingScheduleTemplate` |
| Schedule kind discriminator | derived from `vesting_base` values | `vestingScheduleType: DATE \| MILESTONE \| HYBRID` |
| Schedule segment | `VestingStatement` | `VestingPeriod` |
| Per-grant binding | `TX_CANONICAL_EQUITY_COMPENSATION_ISSUANCE` + `TX_CANONICAL_VESTING_START` | `Vesting` (on the grant) |
| Event firing record | `TX_CANONICAL_VESTING_EVENT` | `*VestingEvent` row on the grant |
| Partial-payout amount | `TX_CANONICAL_VESTING_EVENT.realized_fraction` | `OptionGrantVestingEvent.quantity` (vs. `maxQuantity`) |
| Milestone identity | `VestingBaseEvent.event_id` | `VestingPeriod.milestoneName` + `PerformanceCondition.name` |

The mapping work translates between these shapes. Per-type details live in:

- [`canonical/vesting/VestingScheduleTemplate.mapping.md`](./vesting/VestingScheduleTemplate.mapping.md) — covers the spec layer (templates, statements, cliffs, the DATE/EVENT discriminator).
- [`canonical/transactions/issuance/EquityCompensationIssuance.mapping.md`](./transactions/issuance/EquityCompensationIssuance.mapping.md) — covers the per-grant issuance, including the fan-out by `compensation_type` to Carta's `OptionGrant` / `RestrictedStockUnit` / `SarIssuanceTransaction`.
- [`canonical/transactions/vesting/VestingStart.mapping.md`](./transactions/vesting/VestingStart.mapping.md) — the date-anchor transaction.
- [`canonical/transactions/vesting/VestingEvent.mapping.md`](./transactions/vesting/VestingEvent.mapping.md) — the event-firing witness, including the `realized_fraction` ↔ Carta partial-payout flow.

---

## Relationship to existing OCF

The canonical types overlap with, and are intended to supersede, parts of existing OCF:

| OCF object | Canonical replacement |
|---|---|
| `objects/VestingTerms.schema.json` (DAG) | `canonical/vesting/VestingScheduleTemplate` (AST) |
| `types/vesting/*` (`VestingCondition`, `VestingScheduleAbsoluteTrigger`, etc.) | Absorbed into the canonical statement shape and the `vesting_base` discriminator |
| `objects/transactions/issuance/EquityCompensationIssuance.schema.json` | `canonical/transactions/issuance/EquityCompensationIssuance` |
| `objects/transactions/vesting/VestingStart.schema.json` | `canonical/transactions/vesting/VestingStart` |
| `objects/transactions/vesting/VestingEvent.schema.json` | `canonical/transactions/vesting/VestingEvent` |

The mapping files for the OCF originals (in `objects/transactions/...`) declare themselves *unmapped*, pointing at the canonical replacements. The Carta mapping work lives entirely on the canonical side. This is a deliberate choice: the canonical layer is positioned as a replacement, not a pipeline intermediate, so re-mapping the OCF originals would be redundant and would imply they remain in scope.

The OCF `types/Vesting.schema.json` (the `{date, amount}` projection type) is *not* replaced — it remains the projection layer that the canonical spec layer compiles down to. The canonical issuance transaction carries an optional `vestings` array (of OCF `Vesting` events) for grants where the projection is already materialized.

---

## Deliberately out of scope

The canonical vesting model covers vanilla time-based and event-anchored vesting. Several adjacent features are excluded by design:

- **Compositional event logic** — `BEFORE`/`AFTER` constraints, `AND`/`OR` conditions, `EARLIER_OF`/`LATER_OF` selectors. If upstream authoring layers express these, they're expected to resolve to single named events before reaching canonical. Canonical sees the resolved event by name, not its decomposition.
- **Event-based cliffs** — cliffs are duration-only within a time-based statement.
- **Acceleration clauses** — single-trigger and double-trigger acceleration. Carta has an `Acceleration` block on `Vesting`; canonical does not represent it.
- **Performance-condition metadata** — Carta's `PerformanceCondition` carries `type` (MARKET / PERFORMANCE / EVENT), `minPayoutPercentage` / `maxPayoutPercentage` band, evaluation date, and status. Canonical records only the event identity (`event_id`) and the realized fraction (in the witness transaction); the band metadata and typing are not preserved on round-trip.
- **Termination-aware vesting** — whether an event-anchored vest fires when the recipient is no longer employed is a consumer-side concern. Canonical does not model termination, termination reasons, or post-termination policies. Carta's `vestsPostTermination` flag is Carta-specific data and does not round-trip through canonical.
- **Unresolved / impossible states** — events that never fire, conditions that can never be met.
- **Allocation methods other than `CUMULATIVE_ROUND_DOWN`** — canonical assumes this allocation throughout; no schema toggle.

Schedules using these features cannot be expressed in canonical. Source schemas (like Carta) that include them are partially mappable — the structural skeleton is captured; the rest is dropped.

---

## PR map

The canonical work has landed in a stack of PRs. As of this writing:

1. **PR #2** — `add-canonical-vesting` — introduces `canonical/vesting/` (`VestingScheduleTemplate`, `VestingStatement`, `Cliff`, `Fraction`), the initial `VestingScheduleTemplate.mapping.md`, and marks OCF's `VestingTerms` plus `types/vesting/*` as unmappable.
2. **PR #115** — `add-canonical-equity-comp-issuance` — adds `canonical/transactions/issuance/EquityCompensationIssuance.schema.json` (`TX_CANONICAL_EQUITY_COMPENSATION_ISSUANCE`) and `canonical/transactions/vesting/VestingStart.schema.json` (`TX_CANONICAL_VESTING_START`). Retires the `VestingSchedule` `$def` that was orphaned by the new transaction-based per-grant binding pattern. Cleans up stale `VestingSchedule` references in the vesting mapping doc.
3. **PR #116** — `add-canonical-vesting-event` — adds event-anchored vesting: `VestingBaseDate` / `VestingBaseEvent` discriminated union on `VestingStatement`, and `canonical/transactions/vesting/VestingEvent.schema.json` (`TX_CANONICAL_VESTING_EVENT` with optional `realized_fraction`).
4. **PR (this branch, `map-events-mapping`)** — completes the canonical-side Carta mapping. Adds mapping docs for the three transactions, extends the existing vesting template mapping to cover event-anchored statements, and updates the OCF mapping docs for `TX_EQUITY_COMPENSATION_ISSUANCE`, `TX_VESTING_START`, and `TX_VESTING_EVENT` to declare them superseded.

The PRs are stacked: each depends on its predecessors. They will need to be merged in order (#2 → #115 → #116 → this one), with each base branch retargeted as the previous one lands.
