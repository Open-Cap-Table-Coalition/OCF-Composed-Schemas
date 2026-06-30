# OCF Core — Goal Statement

**North star.** Define **OCF Core**: a minimal, event-driven cap-table data standard that is a
strict subset of OCF and is *guaranteed* to convert cleanly into a Carta snapshot — so that any Core
document can be (a) **folded down** to Carta and (b) **enriched up** to full OCF without
special-casing.

## What it is

- **A subset of OCF, not a new format.** Core uses OCF's own objects, field names, types, and event
  model. Producing Core from OCF drops detail; enriching Core back to OCF re-adds it. Core is "more
  OCF than Carta" by construction.
- **Event-driven.** Core preserves OCF's transaction stream as first-class. Whether Carta ultimately
  stores an event as a transaction or folds it into state is a *translation-time* concern, not a Core
  one.
- **Bounded by Carta's representable universe.** Core contains only what Carta can hold or
  deterministically derive. The bound is one-directional: Core must always go *to* Carta; we never
  require recovering Core *from* Carta.

## The defining invariant

A document is Core **iff the Carta fold is total over it** — it always produces a valid Carta
snapshot, never gets stuck, and never silently drops a datum that has nowhere to land. **Core is
exactly the domain on which that fold is guaranteed to succeed.**

## The membership rules

The standard, applied uniformly and dialed in against the real fold:

- **R0 — Shape.** Core ⊆ OCF (same objects, field names, types, event model). No Carta objects, no
  invented objects. "Enrich to OCF" = re-add the omitted optional fields.
- **R1 — Field inclusion.** Include a field/event only if it has a **clear, deterministic, and
  *total*** destination in Carta (a Carta field, or a deterministic state derivation). Type widening
  (OCF → a wider Carta type) is trivially in. Enum bucketing is in **only** as an explicit, *total*
  `enum-remap` values-map — a heuristic free-text→enum classification (`kind: computed` with a
  default) is **not** deterministic and is Out *(ruling A)*. "Total" means deterministic across the
  field's **full declared OCF domain**: a partial lookup that has no Carta target for some legal
  inputs (e.g. vesting `period → vestingMethod` for "every 5 days") is Out — Core must *always* fold
  *(ruling C)*.
- **R2 — Value-loss OK, existence-loss not.** Core→Carta may coarsen a value (precision clamp,
  enum→bucket) but may **never** drop elements, entities, or relationships. (`enum→bucket`,
  `decimal→clamp` = in; `array→scalar`, "pick the primary of N" = out.) This base is already encoded
  in the mapping files — read it off `kind`/`target`/`values`.
- **R3 — Events.** An OCF transaction is Core iff its *effect* on cap-table state lands
  deterministically in Carta — as a Carta transaction where one exists, else as a snapshot
  state-change. The effect counts as landing if it appears **anywhere in the valid snapshot**,
  including on a *different* Carta object via a **lossless reverse edge** (e.g. transfer lineage on
  the resulting security, not on the tx) — not only on the tx's own counterpart *(ruling B)*. R2 still
  binds: a reverse edge that drops elements/relationships (e.g. `array → scalar`) is existence-loss
  and Out. Core keeps the event regardless; the fold decides how it survives. Effect Carta can't
  reflect at all → out.
- **R4 — Closure.** Core is referentially closed (every referenced id resolves to a Core object), and
  its "required" set is **fold-driven** — the fields a valid snapshot needs, not OCF's
  `required_fields`.
- **R5 — No Carta-isms; gaps are a report.** Core carries no Carta-only concepts (automatic, since
  it's OCF-shaped). A generally-applicable Carta concept that OCF lacks is logged as an **OCF gap to
  discuss** — never smuggled into Core.
- **R6 — Vesting.** Vesting gets the same treatment as everything else — no exemption. The latest OCF
  vesting model is closer to Carta's; capture what genuinely lands, expect much to fall out.

## Non-goals (explicit scope)

- **Not vendor-neutral interop** across many systems — Carta is the target; other targets are future
  work.
- **Not a `Carta → Core` round-trip** — convertibility is one-way *down*.
- **The fold mechanism is separate, already-owned machinery** — Core's job is only to *guarantee it
  can run*.

## Success criteria

1. A written Core schema (a constrained OCF dialect) plus the membership rules, derivable from — and
   consistent with — the existing mapping corpus.
2. Every Core instance provably folds to a valid Carta snapshot and enriches to valid OCF.
3. An honest **gap report**: OCF richness Carta can't hold, and generally-applicable Carta concepts
   OCF lacks.
4. The rules sharpened by iterating against the real fold until first-cut Core stops surprising us.
