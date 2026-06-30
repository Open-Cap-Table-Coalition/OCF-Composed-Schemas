# OCF Core Converter — Completion Goal

**North star.** The converter is **done** when the pipeline in
[`ocf-core-spec.md`](./ocf-core-spec.md) runs **end-to-end** — green mappings in; a ratified Core
schema, membership ledger, and gap report out — with **zero hand-editing of field shapes**, drift-
and subset-gated in CI, so that **landing a green mapping is the only act that changes Core.**

This is the goal for the *mechanism*. The *standard* it computes — OCF Core, the rules R0–R6, and
rulings A/B/C — is defined in [`ocf-core-goal.md`](./ocf-core-goal.md), which is canonical. Where the
two disagree, the goal doc wins.

## What "complete" means — the pipeline, finished

One pass over the green corpus, no human in the field-shape loop:

```
green mappings ──▶ classify (§2 + §2.3 + type library) ──▶ admissibility & closure (§3)
              ──▶ emit: Core schema + ledger + gap report + rollup (§4)
              ──▶ ratify against the thin allow-list (§5) ──▶ CI: drift + subset gates
```

- **Classify — built.** The §2 cascade and §2.3 inspector, plus the type library (below), decide
  `core`/`out` per `(entity, variant, field)`. Proven against the corpus (see *Floor*).
- **Admissibility & closure — to build (§3).** The field ledger becomes a per-`(entity, variant)`
  **admissible / blocked** verdict: every *fold-required* field lands, and every referenced id
  resolves to another Core entity.
- **Emit — to build (§4).** The Core JSON Schema (OCF-dialect, one `$def` per admissible entity,
  pruned to `core` fields, `required[]` = fold-required, scalars inlined with **assertable** patterns
  incl. the synthesized `Date` pattern), the ledger, the R5 gap report, and the human rollup — all
  generated, never hand-edited.
- **Ratify & gate — to build (§5, §6).** A thin allow-list of ratified entity names + optional
  `basis: confirmed` markers; CI re-derives and asserts **drift** (committed == fresh recompute) and
  **subset** (admissible ⊆ allow-list).

## The floor — what the first cut already proved

The read-only report (`npm run core:report` over the green corpus) established the hypothesis the
converter rests on:

- **The machine matches hand judgment on the spine.** The four issuances classify with exactly the
  economic core a curator would hand-pick; the great majority of `out` rows are the **corpus's own**
  `unmappable`/`TODO` verdicts, not the classifier inventing exclusions.
- **The classifier's *independent* verdicts are a small, auditable, flagged surface** — a handful of
  genuine `existence-loss` collapses (`array→scalar`, `structure→scalar`) and the
  `computed`/`combine`/`split` rows held `out` by default, with lineage cases flagged as ruling-B
  candidates. Every disagreement-with-`core` is a documented A/B/C judgment call, surfaced rather than
  silently decided.

Build on this floor; do not regress below it.

## Earned constraints — do not regress these

The experiment paid for these; bake them in.

- **C1 — The type library is a first-class input, not an afterthought.** Sub-property landing
  (OCF `Monetary{amount, currency}` → Carta `Money{amount, currencyCode}`) lives in the
  `ocf_kind: type` mappings, **not** in name-matching. A name-based sub-property check is forbidden:
  it false-reads the entire money value-layer as existence-loss. The classifier consults the library
  built from green type mappings; guard that the field's target type matches the type mapping's
  target type before trusting its verdict.
- **C2 — "What's in Core today" is *output*, never prose.** It is re-derived every build and lives
  only in the ledger + allow-list. It must not be narrated in any doc — a hand-written status section
  already went stale across two merged mapping PRs while still claiming the spine was blocked. The
  converter exists precisely so that snapshot can't rot.
- **C3 — Ruling-B stays flagged, not silently decided.** A reverse-edge `core` is a schema-level
  verdict; whether the live importer honors it is `basis: confirmed`, recorded, never assumed.
- **C4 — No hand-edited field shapes.** The only human layer is the thin allow-list: *which entities*
  are in, not *which fields* or *what types*. The generator owns shapes; the drift gate pins them.

## Milestones

1. **§3 closure** — define how the *fold-required* set is expressed (it is **not** OCF
   `required_fields`) and how `*_id`/`*_ids` references resolve to a referent entity; emit the
   admissible/blocked verdict with a named blocker.
2. **§4 generator** — Core schema (inlined scalars with assertable patterns), ledger, gap report,
   rollup; everything generated.
3. **§5 allow-list + subset guard** — the ratification file and the admissible ⊆ allow-list check.
4. **§6 basis + CI** — the `schema`/`confirmed` basis on ledger rows; the drift and subset gates,
   modeled on the existing coverage recompute-and-assert; authors run the same build pre-commit.

## Success criteria — done iff all hold

1. **End-to-end, hands-off.** A single `core:build` emits schema + ledger + gap report from the green
   corpus with no hand-edits; re-running is idempotent.
2. **Provably foldable on values.** An instance valid against the emitted Core schema is in OCF
   grammar by construction; the ledger shows every field lands. (Totality *of the fold* is verified
   when run against the real fold — that machinery is separate, per the goal doc.)
3. **CI green** on **drift** (committed artifacts == fresh recompute, structural equality) and
   **subset** (every admissible `(entity, variant)` is ratified).
4. **Graduation is automatic.** Landing a green mapping flips its entity into Core with no annotation
   step; CI fails if the draft and allow-list disagree.
5. **Honest gap report (R5)** emitted: OCF richness with no Carta home, and generally-applicable Carta
   concepts OCF lacks.
6. **The spine folds.** `StockIssuance`, `EquityCompensationIssuance`, `WarrantIssuance`,
   `ConvertibleIssuance`, plus the `StockClass`/`Stakeholder` they close over, come out
   **admissible** — the first concrete Core set, derived not declared.

## Non-goals

- **Not the fold itself** — separate, already-owned machinery; the converter only guarantees it can
  run.
- **Not `Carta → Core`** — convertibility is one-way down.
- **Not re-deriving the rules** — R0–R6 and rulings A/B/C are canonical in `ocf-core-goal.md`; this
  completes the mechanism in `ocf-core-spec.md`.
