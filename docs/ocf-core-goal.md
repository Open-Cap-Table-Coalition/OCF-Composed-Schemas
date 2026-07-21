# OCF Core — Goal Statement

**North star.** Define **OCF Core**: a minimal, event-driven, OCF-shaped cap-table dialect whose
strict profile is statically admissible for the Carta fold. A Core document can be (a) **folded down**
to Carta and (b) explicitly enriched into **OCF Extended**, a fully OCF-valid document, when the
enrichment context supplies omitted required data. The contract is defined in
[`ocf-core-enrichment.md`](./ocf-core-enrichment.md).

## What it is

- **An OCF-shaped projection, not a new vendor format.** Core uses OCF's own objects, field names,
  types, and event model. Its generated schemas relax OCF requiredness so that the projection can
  omit fields the Core rules exclude. Enrichment produces OCF Extended by supplying the missing
  source/context data; a raw Core instance is not necessarily valid against the original OCF schemas.
- **Event-driven.** Core preserves OCF's transaction stream as first-class. Whether Carta ultimately
  stores an event as a transaction or folds it into state is a *translation-time* concern, not a Core
  one.
- **Bounded by Carta's representable universe (strict profile).** *Strict* Core contains only what
  Carta can hold or deterministically derive — everything in it is Carta-expressible. That bound is
  one-directional: strict Core must always fold *to* Carta; we never *require* recovering Core *from*
  Carta.
- **Two profiles over one derivation.** Core is machine-*derived* from the existing mapping corpus
  (see [`ocf-core-spec.md`](./ocf-core-spec.md) §1, "derive, don't declare"), read at two
  strictnesses by a single membership predicate. **Strict** (`core/`) is the lossless intersection
  above. **Rich** (`core-rich/`) is a strict superset that *also* keeps **lossy-home** fields — ones
  that do have a Carta target but narrow on the way out (a structured `Address` where Carta holds
  only a country) — in OCF's own shape. Rich thereby **relocates** the loss onto the Core→Carta fold
  and knowingly gives up strict's Carta-expressibility guarantee, in exchange for a populated hub
  both formats can meet on. Rich is the "interop hub" the coverage reports (`core:bidi`, `core:lossy`,
  `core:unmapped`) analyze; it is a discussion artifact, not a second contract.

## The defining invariant

A document is strict Core **iff the repository's schema-derived admissibility rules establish that it
is statically suitable for the Carta fold**: its mapped payloads have deterministic destinations,
referential closure holds, and no classified datum is silently left without a landing rule. Runtime
totality against a live importer is a separate importer-confirmed evidence level.

## The membership rules

The standard, applied uniformly and dialed in against the real fold:

- **R0 — Shape.** Core uses only OCF objects, field names, types, and the event model. No Carta
  objects and no invented objects. Core requiredness is intentionally relaxed; "enrich to OCF" means
  supplying omitted optional and required source/context fields to produce OCF Extended.
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
- **Not a `Carta → Core` round-trip** — convertibility is one-way *down*. The bidirectional "interop
  hub" report (`core:bidi`) is a **non-gated coverage measurement**, not a counter-example: it counts
  whether a forward mapping edge *could* fill a Core slot from a Carta document; it never inverts or
  executes a mapping, so it imposes no Carta→Core requirement. (Rich Core can be *populated* from
  Carta best-effort, but that is never a lossless obligation.)
- **The fold and enrichment mechanisms are separate, already-owned machinery** — this repository
  establishes schema-derived admissibility and the OCF Extended contract; runtime implementations
  must provide their own conformance evidence.

## Success criteria

1. A written Core schema (a constrained OCF dialect) plus the membership rules, derivable from — and
   consistent with — the existing mapping corpus.
2. Every strict Core instance is statically admissible for the Carta fold; with sufficient enrichment
   context it can produce OCF Extended, and runtime fold/enrichment claims are backed by conformance
   tests.
3. An honest **gap report**: OCF richness Carta can't hold, and generally-applicable Carta concepts
   OCF lacks.
4. The rules sharpened by iterating against the real fold until first-cut Core stops surprising us.
