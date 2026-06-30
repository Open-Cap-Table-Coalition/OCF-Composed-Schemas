# OCF Core — Derivation & Build Spec (Straw-Man v2)

How **OCF Core** is computed from the mapping corpus this repo already has, what the build emits, and
how CI keeps it honest. This is the **mechanism**; the **definition, rules (R0–R6), and rulings** live
in [`ocf-core-goal.md`](./ocf-core-goal.md), which is canonical. Where the two disagree, the goal doc
wins and this doc is wrong.

> **One-line recap of the goal.** OCF Core is an *event-driven* strict subset of OCF that **always
> folds down to a valid Carta snapshot** (and enriches back up to full OCF). The defining invariant: a
> document is Core iff the Carta fold is **total** over it — it never gets stuck and never drops a
> datum with nowhere to land. The fold itself is separate, already-owned machinery; Core's job is to
> *guarantee it can run*. This spec computes which OCF fields/events satisfy that guarantee.

---

## 1. Derive, don't declare

Core membership is a **computed view** over three pinned inputs that already exist — **no new
annotations on any mapping**; the corpus stays exactly as it is today:

1. **The mapping corpus** — the 102 `*.mapping.md` files. Each carries front-matter (`ocf_kind`,
   `ocf_object_type`, `required_fields`, `target_standard`, `target_version`, `status`,
   `last_generated`) and a fenced YAML block of per-field entries (`kind`, `target`, `reason`, and for
   enums `values` / `routed_to`). This is where the value/existence base of R2 is **already encoded**
   — the classifier reads it off the entry rather than re-deriving it.
2. **The OCF schema registry** — `loadRegistry()` over `enums/ files/ objects/ primitives/ types/`,
   indexed by `$id` (`scripts/lib/registry.ts`); supplies every source type and enum. Version pinned
   in `OCF_SOURCE.md` (`1.2.1-unstable`).
3. **The pinned Carta bundle** — `target-schema/Carta.schema.json` (`v1alpha1`), named in
   `TARGET_BUNDLES`; supplies every target type and enum. Self-contained (all internal `#/$defs`).

The machine **drafts** Core from these; a human **ratifies** it in a thin allow-list (§5). Nothing in
this pipeline asks an author to edit a mapping.

**Green-only.** A mapping is consumed only when its block `status` is **`complete` or `reviewed`** —
the exact pair the validator treats as strict (`const strict = blockStatus === "complete" ||
blockStatus === "reviewed"`, `scripts/lib/mapping-validator.ts`). At those statuses `kind: TODO` is
forbidden and every source property is mapped. Targets resolve only once `target_standard` is a real
bundle (not `TBD`). Only `ocf_kind: object` mappings produce membership rows; `ocf_kind: type` scalar
leaves (`Date`, `Numeric`, …) feed the inline-scalar library (§4), not their own rows.

---

## 2. The classifier — does this field land in Carta?

Each `(entity, variant, field)` gets one **class** ∈ `{ core, out }`. This implements R1–R3 + rulings
A/B/C from the goal doc; restated operationally:

- **`core`** — the field's data **lands in the Carta snapshot** via a clear, deterministic, **total**
  rule, with **no existence-loss**. Value-coarsening (precision clamp, enum→bucket) is fine; the datum
  is still there. "Lands" includes landing on a *different* Carta object via a **lossless reverse
  edge** (ruling B), not only on the field's own counterpart.
- **`out`** — no Carta destination, or the rule is **partial** (undefined on some legal OCF inputs —
  ruling C), **heuristic** (ruling A), or **existence-losing** (drops elements/entities/relationships
  — R2).

There is no "extended" tier: Core is exactly what folds. A field that exists in full OCF but does not
fold is simply not Core — it reappears on enrichment back to OCF, and that's fine.

Most of this is read straight off the mapping `kind`/`target`/`values`; the shape checks consult the
two schemas:

```
classify(entry, src, tgt):           # src/tgt = source & target nodes, resolved + unwrapped per 2.3
  if entry.kind in {unmappable, TODO}:            return out      # no destination
  if entry.target is null or "TODO":              return out
  if not resolves(entry.target):                  return out      # see 2.1

  if entry.kind == enum-remap:                                    # ruling C (totality); routed_to per 2.2
      if any source member maps to null and is not in entry.routed_to:  return out   # partial → out
      return core                                                 # total; bucketing/coarsening OK

  if entry.kind in {computed, combine, split}:                    # ruling A vs B — see note
      if target is a lossless reverse-edge landing (full payload, no existence-loss):  return core
      return out                                                  # heuristic / unprovable derivation

  # kind == rename: lands unless the shape collapses (existence-loss, R2)
  if isArray(src) and not isArray(tgt):           return out      # array → scalar
  if isMultiPropObject(src) and not isMultiPropObject(tgt): return out   # structure → scalar
  if isEnum(tgt) and not isEnum(src):             return out      # free-text → enum
  if isArray(src) and isArray(tgt) and shapeCollapses(itemsOf(src), itemsOf(tgt)): return out
  if isMultiPropObject(src) and a source property has no target property:          return out
  return core                                                     # incl. widening (Numeric→Decimal, Date→DateTime)
```

**Note on `computed` / `combine` / `split` (where rulings A and B split).** The `kind` alone doesn't
decide these — what decides is whether the datum *provably lands* in the snapshot with no
existence-loss. **Ruling B:** a field whose target is a **lossless reverse edge** on another Carta
object (e.g. transfer/cancellation lineage written to `precededBy.securities` on the resulting
security) **is `core`, and that is a schema-level verdict** (`basis: schema`, per goal R3) — no human
sign-off needed, because the mapping's resolved target shows the datum has a home. **Ruling A:** a
`computed` free-text→enum classification (heuristic, drops the prose) is **`out`** — it neither lands
totally nor losslessly. Everything else `computed`/`combine`/`split` whose landing a static read can't
establish is `out` by default; `basis: confirmed` (§6) is for *empirically hardening* a `core` verdict
against the live importer, **not** the gate for membership. `array→scalar` fan-out
(`resulting_security_ids[]` → a scalar slot) stays `out` under either reading — existence-loss, not a
reverse edge.

### 2.1 What "resolves" means — reuse the validator

`resolves(target)` is the predicate `scripts/lib/mapping-validator.ts` already implements: the pointer
begins with `#/`, `resolveJsonPointer(bundle, ptr)` returns `found: true` (RFC 6901 via the
`jsonpointer` package), and the dereferenced node is **not** the literal `true` (Carta marks
out-of-snapshot references as `true`; treated as no-home). `derefNode()` follows internal `$ref`
chains; the bundle is self-contained, so resolution is closed. Enum membership uses the existing
`detectEnumValues(property, registry)` (OCF side) and `targetEnumValuesAt(bundle, node)` (Carta side).

### 2.2 Polymorphic entities — classify per variant

The corpus already encodes polymorphism (`discriminator` / `shared` / `variants` / `primary_targets` /
per-variant `target` maps / `routed_to`; see `docs/polymorphic-transaction-routing.md`). The
classifier consumes it as-is: a `shared` field with a per-variant `target` map is resolved **once per
variant** (one row per `(entity, variant, field)`); a null target for a variant ⇒ `out` for that
variant only; an `enum-remap` member sent to `null` but listed in `routed_to: { MEMBER: Variant }` is
**not** unmapped — it round-trips in the named sibling variant, so it doesn't make the map partial.
That is why `EquityCompensationIssuance`'s Option-variant `compensation_type` (`{ OPTION_NSO: NSO,
OPTION_ISO: ISO, OPTION: OTHER }`, with `RSU/CSAR/SSAR` routed to `Rsu`/`Sar`) is **total → `core`**.
Downstream transactions routed by `route_by_security` (no local discriminator; a two-pass JOIN on the
issuance) classify against the variant the join selects.

### 2.3 The type inspector (the one piece of new code)

The `rename` shape checks turn on four predicates over a **resolved, unwrapped** node — resolve `$ref`
(`derefNode`) and **unwrap a nullable union** first (a `oneOf`/`anyOf` of `{type: null}` + one real
branch resolves to that branch, e.g. `expiration_date`):

- **`isEnum(n)`** — `detectEnumValues`/`targetEnumValuesAt` returns a non-null value set.
- **`isArray(n)`** — `n.type == "array"` (or its `$ref`/unwrapped target is); `itemsOf(n)` is the
  resolved `items` node.
- **`isScalar(n)`** — an object whose only data property is a single string leaf (Carta's `{value: …}`
  wrappers — `Decimal`, `Iso8601*`, `Money.amount`) **or** a bare `type: string` leaf (OCF
  primitives). Scalar wrappers count as scalars — that is what makes `Ratio → Decimal` a
  `structure → scalar` collapse.
- **`isMultiPropObject(n)`** — an object with ≥2 data properties that is *not* a scalar wrapper
  (`Ratio{numerator,denominator}`, `Monetary{amount,currency}`).

These aren't disjoint (a string enum is both `isEnum` and `isScalar`); totality comes from the
**ordered cascade** above, not a partition. `shapeCollapses(s,t)` applies the three structural checks
once to a nested element/component pair (one level — the green corpus nests no deeper).

**Why widening is never a collapse.** Folding *down* into a wider Carta type loses nothing: OCF
`Numeric 1.25` → Carta `Decimal "1.25"`; OCF `Date` → Carta `DateTime` at `T00:00:00Z`. We only ever
go Core→Carta (down) and Core→OCF (up, by re-adding detail); we never reconstruct Core *from* Carta,
so the extra room in Carta's types is simply unused. The Core schema (§4) constrains values to OCF's
own grammar, so a wide Carta value (`1.5e9`, a real `14:30`) is not an OCF Core value in the first
place.

---

## 3. Entity admissibility and closure (R4)

A field-level pass isn't enough; the fold must be **total over a whole document**. The spec names two
conditions; **measured against the real bundle they resolve into two operational gates**
(`scripts/lib/core-admissibility.ts`):

- **Non-degeneracy — "the effect lands" (this is the fold-required condition, made operational).** The
  original phrasing was "the fields a valid Carta snapshot *needs* must all be `core`." **Empirical
  finding: every Carta target object declares `required: []`** — Carta requires nothing at the schema
  level, so a fold-required check against the bundle is *vacuous* and can never gate. What a meaningful
  snapshot actually needs is captured by **non-degeneracy**: the entity must land **≥1 payload field**
  — a `core` field that is not bookkeeping (`id`/`object_type`/`comments`/`date`), not the self-created
  security key, and not a graph reference. An entity that lands only a date, a key, or references has
  no Core projection at all — exactly the case the goal doc calls "Carta has no transaction to reflect
  this event." (The "useful-snapshot minimum" beyond this — e.g. a `Stakeholder`'s `legal_name` — is a
  quality judgement, surfaced in the gap report, not a hard gate; cf. §7's "id alone closes the FK.")
- **Referential closure.** Every id the entity carries **into Core** (a `core` FK field) must resolve
  to another **Core-admissible** entity. An FK that is `out` imposes no obligation — Core doesn't carry
  it. Computed as a greatest fixpoint (assume every green entity admissible, remove any whose `core` FK
  dangles). References resolve through a **curated reference graph** — `core/reference-graph.yml`, the
  second thin curated input alongside the allow-list (§5) — because *which* OCF object each `*_id`
  points to is **not** encoded in the schemas (an id is just a string). `security_id` is special:
  *created* by an issuance (no obligation), a *reference* to that security elsewhere.

An entity meeting both is **Core-admissible**; otherwise it is **blocked** (and the blocker is named:
`no-payload`, or a `dangling-reference` to a non-Core/absent referent). Events are **first-class** — a
Core-admissible transaction stays an event in Core; whether the fold lands it as a Carta transaction or
collapses it into snapshot state is a translation-time concern, not a demotion. There is no separate
"reconstructable" tier.

> **Note on the current corpus.** Closure never actually fires today — once
> `StockClass`/`Stakeholder`/`StockPlan`/`VestingTerms` went green, every reference resolves. What
> bounds Core is non-degeneracy: the transfers/retractions/acceptances whose only payload was an
> `array → scalar` lineage field (held `out`) land nothing, so they are `no-payload`-blocked.

---

## 4. What the build emits

The generator walks the green corpus, classifies every row (§2), applies the closure check (§3), and
emits, all **generated, never hand-edited**:

- **Membership ledger** — one row per `(entity, variant, field)`: `class` (core/out), `target`, source
  & target type names, and for `out` rows the reason (`no-destination` / `existence-loss` / `partial` /
  `heuristic`), for `core` rows the loss kind (`direct` / `widening` / `value-coarsening` /
  `reverse-edge`). Plus the per-entity admissibility verdict and any closure blocker. This holds the
  fold-relevant truth a JSON Schema can't.
- **Core schema package** — packaged like OCF proper (`core/`): a manifest plus per-category `*File`
  schemas, **reusing OCF `file_type` consts** so a Core package is also a shape-valid OCF package.
  `files/TransactionsFile.schema.json` holds every admissible **event** (`items.oneOf`); one
  `files/<Category>File.schema.json` per admissible **object**; `OCFCoreManifestFile.schema.json`
  carries the issuer inline + a `*_files` pointer collection per present category. **Entities are OCF
  entities — variants are collapsed**: a Carta-fold split like `StockIssuance` Default/Rsa is one OCF
  `StockIssuance` (R0), with fields = the union of what is `core` in any admissible variant, each
  optional. **Identity spine:** because Core ⊆ OCF, every entity also carries OCF's universal keys —
  `id` and `object_type` (a `const`, the transaction-union discriminator) — even though they are
  economically `out` (no Carta payload home). They are keys, not payload (the §3 non-degeneracy gate
  ignores them); without them the all-optional event union is ambiguous and referential closure (R4)
  can't resolve. Scalar leaves are inlined with **assertable OCF-grammar `pattern`s**: `Numeric`/`Percentage`
  already ship patterns; for `Date` the emitter **synthesizes** `^\d{4}-\d{2}-\d{2}$`, because
  `types/Date.schema.json` only declares `format: date`, annotation-only under draft-07. Every value is
  inlined — each file is self-contained, no `$ref`. An instance valid against the package is, by
  construction, in OCF grammar — guaranteed-foldable on values.
- **Gap report (R5)** — two lists: (a) OCF richness with no Carta home (fold-required fields that are
  `out` with `no-destination`/`existence-loss`), and (b) generally-applicable Carta concepts OCF
  lacks. These are the OCF↔Carta gaps to discuss; they are never smuggled into Core.
- **Human rollup** (markdown) — per-entity core/out field lists and admissibility, for review.

### CI gates — the trust model already in this repo

CI rebuilds the draft in memory and fails unless both hold:

1. **Drift** — committed artifacts equal a fresh recomputation. This reuses the repo's existing
   pattern: the validator does **not** byte-diff `coverage`; it re-derives the `X/N` count and asserts
   the committed value matches (`mapping-validator.ts`). The Core gate extends that — CI reclassifies
   the corpus and asserts the committed ledger and Core schema are **structurally equal** (same row
   set, same `$def`/field/`required` shape). Equality is structural after canonical parse; committed
   files are emitted with sorted keys/rows for a clean diff.
2. **Subset** — every Core-admissible `(entity, variant)` the generator drafts is **ratified** in the
   allow-list (§5). The machine can never publish an entity the curators haven't sanctioned. An
   over-derivation (a wrongly-`core` field that flips an unratified entity to admissible) trips this
   gate; CI fails until the **mapping** is corrected (a false `core` is a mis-encoded transform) or the
   entity is ratified and this spec updated together.

---

## 5. Two layers: the drafted subset and the curated inputs

A *derived* draft must not be mistaken for a *ratified* definition, but the human layer is kept
deliberately **thin** — exactly **two small curated files**, neither of which lists a field shape:

- **Allow-list (`core/allow-list.yml`, curated, versioned) — not a second schema.** Small, hand-edited:
  (1) the set of **ratified `(entity, variant)` names** admitted to Core; (2) optional
  **`basis: confirmed`** markers per `(entity, variant, field)` that *empirically harden* a `core`
  verdict against the live importer (§6) — hardening, not membership; (3) any documented **OCF↔Carta
  gaps** being tracked. It does **not** re-list field sets or types — the generator owns those and the
  drift gate pins them. The human ratifies *which entities are in*; they don't re-draw the spine.
- **Reference graph (`core/reference-graph.yml`, curated) — closure metadata, not shapes.** Which OCF
  object each `*_id` points to, which id-shaped fields are labels not FKs, and which `core` fields are
  bookkeeping rather than payload. This is knowledge the schemas don't encode (an id is just a string);
  it drives §3 closure and the non-degeneracy gate. Like the allow-list it names *relationships*, never
  field types — those stay derived.
- **Generated (derived, unversioned)** — the ledger + Core schema + gap report + rollup of §4,
  everything drafted so far from green mappings. Converges on the ratified set; no independent version.

**Graduation is automatic.** An entity is allow-listed but absent until its mapping is green; the next
build classifies it, and if it's Core-admissible it appears. Landing a green mapping *is* graduation —
no annotation step. If the draft and allow-list disagree, CI fails.

---

## 6. Honesty boundary — schema-derived vs importer-confirmed

Every class in §2 is **schema-derived** — including a reverse-edge `core` (ruling B): the verdict
states what the two JSON Schemas *permit* a fold to do, not what a live Carta importer *does*. The
ledger records a two-value **`basis`**:

- **`schema`** (default) — decided by the type/enum/cardinality read alone. This includes reverse-edge
  `core` rows: the resolved target shows the datum has a lossless home, no human needed.
- **`confirmed`** — a human verified the behavior against a live importer and recorded it in the
  allow-list. This *hardens* an existing `core` verdict; it is never required for membership and never
  assigned automatically.

Verdicts a live importer could move: (1) whether transfer/conversion lineage is actually ingested as a
reverse edge or dropped; (2) whether `enum-remap` members claimed total wire 1:1 on import or fall to
`OTHER`/`UNKNOWN`; (3) whether targeted Carta fields are writable vs derived/read-only; (4) unit
conventions (fraction `0.125` vs whole-percent `12.5`). `basis` records which side of the
schema-permits / folds-in-production line each claim sits on.

---

## 7. Current state — first cut against the corpus

Applying the rules to the corpus today (a snapshot; re-derived on every build, not part of the spec):

- **The intended spine is the four issuances** — `StockIssuance`, `EquityCompensationIssuance`,
  `WarrantIssuance`, `ConvertibleIssuance` — with a clean value layer (`Monetary`→Carta `Money`,
  `Date`, `Numeric`, `CurrencyCode`) and cliff vesting mechanics; cancellation lineage rides in as a
  reverse-edge `core` (ruling B). But **today none of them are Core-admissible: they are `blocked` on
  closure** (§3) — every issuance references `StockClass`/`Stakeholder`, whose mappings aren't green,
  so the references have no Core projection to resolve to. Most *other* transactions (transfers,
  retractions, acceptances, conversions) are blocked for a deeper reason — Carta has no transaction to
  reflect them, or they fan out `array→scalar`.
- **That closure block is an *artifact*, not a real gap — and a focused analysis says it clears.** The
  `StockClass`/`Stakeholder` references score 0-core today only because **their mappings are still
  draft skeletons** (the open draft PRs #112/#113, all `kind: TODO`), not because Carta lacks the
  concept — Carta carries both (`#/$defs/ShareClass`, `#/$defs/Stakeholder`). Once a small **minimal
  Core projection** of each lands green, the spine becomes admissible (R4):
  - `StockClass → ShareClass`: `{ id, name, class_type, default_id_prefix, seniority }` (plus optional
    `par_value`→`parValue`, `initial_shares_authorized`→`authorizedShareCount`). Preferred-class
    economics like the participation cap live on the **nested** `preferredShareClassDetails` /
    `ShareClassRightsAndPreferences`, not on `ShareClass` directly, and OCF `price_per_share` has no
    `ShareClass` home at all.
  - `Stakeholder → Stakeholder`: `{ id, name.legal_name }` (Carta `Stakeholder` has no required
    fields, so `id` alone closes the FK; `legal_name` is the minimum for a *useful* snapshot).
  - Note `WarrantIssuance`/`ConvertibleIssuance` don't reference `StockClass` at all — only
    `StockIssuance` and `EquityCompensationIssuance` do.
  The remaining `StockClass`/`Stakeholder` fields are R5 gaps (reported, not blocking) — the one
  uncomfortable case is **`StockClass.votes_per_share`**: OCF-*required* yet homeless in Carta. It is
  not fold-required, so it stays out of the Core projection and is logged as an R5 gap; a folded doc
  silently loses voting rights.
- **Vesting under R6 lands as quantum + cliff, not cadence or milestones.** `VestingScheduleCliff` and
  the segment quantum (length, unit, percentage, order) fold cleanly; but `VestingScheduleSegment.period
  → vestingMethod` is a **partial lookup** (every-5-days, every-4-months have no Carta target), which
  by ruling C is `out` and cascades up to block the time-vesting spine. The milestone axis
  (`VestingEventCondition`, `TX_VESTING_EVENT`) is unmapped entirely. The "closer to Carta" hope held
  only for the grid quantum.

---

## 8. Implementation checklist (mostly wiring existing parts)

1. **Type inspector (§2.3)** — resolve-and-unwrap + `isEnum`/`isArray`/`isScalar`/`isMultiPropObject`,
   on the existing `registry`, `derefNode`, `detectEnumValues`, `targetEnumValuesAt`. The only genuinely
   new code; the nullable-union unwrap and the scalar-wrapper rule are the parts to get right.
2. **Classifier (§2)** — the `core`/`out` cascade per `(entity, variant, field)`, consuming the parsed
   mapping (`mapping-parser.ts`) and the §2.1 resolution predicate, with ruling A/B/C behavior for
   `enum-remap` totality and the `computed`/`reverse-edge` carve-out.
3. **Admissibility + closure (§3)** — the fold-required-set check and referential closure over the
   classified rows; restricted to `ocf_kind: object` entities.
4. **Generator (§4)** — the ledger, the Core schema (OCF names/types verbatim, scalars inlined with
   assertable patterns incl. the synthesized `Date` pattern, `required[]` = fold-required set), the gap
   report, and the rollup.
5. **Allow-list + subset guard (§5)** — the thin ratification file and the admissible-entities ⊆
   allow-list check.
6. **CI (§4)** — the recompute-and-assert **drift** gate (modeled on the coverage check) and the
   **subset** gate; authors run the same build before committing.

Which specific entities and fields land in Core under the current Carta bundle is the **output** of
this machinery, not part of the spec — re-derived whenever a mapping or the bundle changes, and living
in the generated artifacts and the allow-list, never in this document.
