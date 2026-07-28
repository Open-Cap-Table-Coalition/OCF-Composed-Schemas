# OCF Core — Derivation & Build Specification

How **OCF Core** is computed from the mapping corpus this repo already has, what the build emits, and
how CI keeps it honest. This is the **mechanism**; the **definition, rules (R0–R6), and rulings** live
in [`ocf-core-goal.md`](./ocf-core-goal.md), which is canonical. Where the two disagree, the goal doc
wins and this doc is wrong.

> **One-line recap of the goal.** OCF Core is an *event-driven*, OCF-shaped projection whose strict
> membership is **schema-derived admissibility** for the Carta fold. A Core document can be enriched
> into **OCF Extended**, a fully OCF-valid document, when the required source/context data is
> available. The fold and enrichment implementations are separate; this spec computes the static
> conditions they must satisfy and records the evidence boundary.

> **Two profiles (§9).** The recap above defines the **`strict`** profile — the lossless intersection,
> emitted to `core/`. Everything in §§1–8 is about it and it is the default everywhere. A second
> **`rich`** profile (emitted to `core-rich/`) is the *same derivation read more permissively*: it also
> admits the lossy-home fields strict drops (a `name`, an `address`), kept in **OCF's own shape**, at
> the cost of the round-trip guarantee. It is a strict superset. See **§9** for the full mechanics;
> §§1–8 describe the shared machinery both profiles run.

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
  edge** (ruling B), not only on the field's own counterpart — but **only when that reverse edge is
  provably lossless**; the classifier does not assume it, and today holds every such lineage field
  `out` (see the Note).
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

  if entry.kind == construct:                                     # validated scalar → constructed target member
      return core                                                 # deterministic; value-preserving

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
existence-loss. **Ruling B:** the goal-doc rule credits a datum that lands on a *different* Carta
object via a **lossless reverse edge** (transfer/cancellation lineage on the resulting security's
`precededBy.securities`, not on the tx). The classifier does **not** realize this automatically:
`computed`/`combine`/`split` all default to **`out`** (`heuristic`), and a lineage field whose target
is an **array** only earns the diagnostic *"possible reverse-edge (ruling B) — target is an array;
confirm lossless lineage"* while staying `out`. So today there is **no** reverse-edge `core` row —
ruling B is a flagged candidate, not a verdict; the field is promoted to `core` only if the mapping is
sharpened to establish the landing is genuinely lossless. **Ruling A:** a
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

The corpus already encodes polymorphism (`route_by_property` / `shared` / `variants` / `primary_targets` /
per-variant `target` maps / `routed_to`; see `docs/polymorphic-transaction-routing.md`). The
classifier consumes it as-is: a `shared` field with a per-variant `target` map is resolved **once per
variant** (one row per `(entity, variant, field)`); a null target for a variant ⇒ `out` for that
variant only; an `enum-remap` member sent to `null` but listed in `routed_to: { MEMBER: Variant }` is
**not** unmapped — it round-trips in the named sibling variant, so it doesn't make the map partial.
That is why `EquityCompensationIssuance`'s Option-variant `compensation_type` (`{ OPTION_NSO: NSO,
OPTION_ISO: ISO, OPTION: OTHER }`, with `RSU/CSAR/SSAR` routed to `Rsu`/`Sar`) is **total → `core`**.
Downstream transactions routed by `route_by_property` (the route property comes from a two-pass JOIN on the
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
> bounds Core is non-degeneracy: the retractions/acceptances and the lineage-only transfers whose only
> payload was an `array → scalar` lineage field (held `out`) land nothing, so they are
> `no-payload`-blocked — except where a `composite:` fold hands the event real payload (§4.9;
> `StockTransfer`).

---

## 4. What the build emits

The generator walks the green corpus, classifies every row (§2), applies the closure check (§3), and
emits, all **generated, never hand-edited**:

- **Membership ledger** — one row per `(entity, variant, field)`: `class` (core/out), `target`, source
  & target type names, and for `out` rows the reason (`no-destination` / `existence-loss` / `partial` /
  `heuristic`), for `core` rows the loss kind (`direct` / `widening` / `value-coarsening`). Plus the
  per-entity admissibility verdict and any closure blocker, and — for composite entities (§4.9) — a
  **Composite folds** section naming the Carta step objects each event lands on and the fixed `const:`
  values each step supplies. This holds the fold-relevant truth a JSON Schema can't.
- **Core schema package** — packaged like OCF proper (`core/`): a manifest plus per-category `*File`
  schemas, **reusing OCF `file_type` consts** so the package remains OCF-shaped and uses OCF file
  vocabulary. A Core-valid instance is not necessarily directly valid against the original OCF
  schemas; OCF Extended is the post-enrichment valid OCF output.
  `files/TransactionsFile.schema.json` holds every admissible **event** (`items.oneOf`); one
  `files/<Category>File.schema.json` per admissible **object**; `OCFCoreManifestFile.schema.json`
  carries the issuer inline + a `*_files` pointer collection per present category. **Entities are OCF
  entities — variants are collapsed**: a Carta-fold split like `StockIssuance` Default/Rsa is one OCF
  `StockIssuance` (R0), with fields = the union of what is `core` in any admissible variant, each
  optional. **Identity spine:** because Core uses OCF's object vocabulary, every entity also carries
  OCF's universal keys —
  `id` and `object_type` (a `const`, the transaction-union discriminator) — even though they are
  economically `out` (no Carta payload home). They are keys, not payload (the §3 non-degeneracy gate
  ignores them); without them the all-optional event union is ambiguous and referential closure (R4)
  can't resolve. Scalar leaves are inlined with **assertable OCF-grammar `pattern`s**: `Numeric`/`Percentage`
  already ship patterns; for `Date` the emitter **synthesizes** `^\d{4}-\d{2}-\d{2}$`, because
  `types/Date.schema.json` only declares `format: date`, annotation-only under draft-07. Every value is
  inlined — each file is self-contained, no `$ref`. An instance valid against the package is, by
  construction, in OCF grammar. This establishes value-shape admissibility, not live-importer
  execution or complete OCF requiredness; those are covered by the Carta fold and OCF Extended
  contracts.
- **Gap report (R5)** — two lists: (a) OCF richness with no Carta home (fold-required fields that are
  `out` with `no-destination`/`existence-loss`), and (b) generally-applicable Carta concepts OCF
  lacks. These are the OCF↔Carta gaps to discuss; they are never smuggled into Core.
- **Human rollup** (markdown) — per-entity core/out field lists and admissibility, for review.
- **Analysis docs** — `core:build` regenerates the distinct OCF-side loss inventories:
  [`core-lossy-inventory.md`](./core-lossy-inventory.md) and
  [`core-unmapped-inventory.md`](./core-unmapped-inventory.md). The canonical Carta-side target-first
  report and visuals are generated by `npm run mapping:artifacts` and drift-checked by
  `npm run mapping:artifacts:check`.

### CI gates — the trust model already in this repo

CI rebuilds the draft in memory and fails unless both hold:

1. **Drift** — committed artifacts equal a fresh recomputation. Mapping coverage is derived from
   source schemas and entries; it is not stored in mapping YAML. CI checks the generated
   [`mapping-coverage.md`](./mapping-coverage.md) heatmap for drift. The Core gate extends that — CI reclassifies
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
  object each `*_id` points to, which id-shaped fields are labels not FKs, which fields reference a
  *security* (`security_references:`, resolved like `security_id` — used only by rich's lineage members,
  §9), and which `core` fields are bookkeeping rather than payload. This is knowledge the schemas don't
  encode (an id is just a string); it drives §3 closure and the non-degeneracy gate. Like the allow-list
  it names *relationships*, never field types — those stay derived. It is shared by both profiles; each
  profile has its own `allow-list.yml`.
- **Generated (derived, unversioned)** — the ledger + Core schema + gap report + rollup of §4,
  everything drafted so far from green mappings. Converges on the ratified set; no independent version.

**Graduation is automatic.** An entity is allow-listed but absent until its mapping is green; the next
build classifies it, and if it's Core-admissible it appears. Landing a green mapping *is* graduation —
no annotation step. If the draft and allow-list disagree, CI fails.

---

## 6. Honesty boundary — schema-derived vs importer-confirmed

Every class in §2 is **schema-derived**: the verdict states what the two JSON Schemas *permit* a fold
to do, not what a live Carta importer *does*. The ledger records a two-value **`basis`**:

- **`schema`** (default) — decided by the type/enum/cardinality read alone.
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

Applying the rules to the corpus today (a snapshot; the live truth is the generated
`core/core-ledger.md` / `core-rich/core-ledger.md`, re-derived on every build — this section is not
part of the spec):

- **The spine is admissible.** All four issuances now fold: `StockIssuance` (Default + Rsa),
  `EquityCompensationIssuance` (Option/Rsu/Sar), `WarrantIssuance`, and `ConvertibleIssuance` are all
  Core-admissible over a clean value layer (`Monetary`→Carta `Money`, `Date`, `Numeric`,
  `CurrencyCode`). This reverses the earlier straw-man, where the spine was `blocked` on closure: the
  block cleared the moment `StockClass` and `Stakeholder` went green (PRs #112/#113, now **merged**),
  joined by `StockPlan` and `VestingTerms`. With every referenced object green, **§3 closure never
  fires today** — what bounds Core is now **non-degeneracy** (no-payload), not closure.
- **The referenced objects carry a minimal Core projection** (their remaining fields are R5 gaps, not
  blockers). `StockClass → ShareClass` lands several core fields (`class_type`, `name`, `seniority`,
  `par_value`, `default_id_prefix`, `initial_shares_authorized`, …); preferred-class economics like the
  participation cap live on the **nested** `ShareClassRightsAndPreferences`, not on `ShareClass`
  directly. `Stakeholder → Stakeholder` lands `id` + `name.legal_name` (Carta `Stakeholder` requires
  nothing, so `id` alone closes the FK; `legal_name` is the minimum for a *useful* snapshot). The one
  uncomfortable R5 gap is **`StockClass.votes_per_share`** — OCF-*required* yet homeless in Carta; not
  fold-required, so it drops out of the projection and a folded doc silently loses voting rights.
- **The downstream verbs are all green now, but green ≠ admissible.** Every `route_by_property:` verb
  (`EquityCompensation{Exercise,Cancellation,Release,Retraction,Acceptance,Transfer,Repricing}` and the
  convertible/warrant/stock cancellations) is a complete mapping; whether it enters Core is decided by
  §3, not by mapping status. Those that land a real payload are in (e.g. `ConvertibleCancellation`,
  `ConvertibleConversion`); those whose only fields are lineage references, or that Carta can't reflect
  at all, stay `no-payload`-blocked (the retractions, the acceptances, and the lineage-only transfers).
- **Transfers enter via `composite:` (§4.9).** A stock transfer has no single Carta transaction, so it
  folds into an ordered **cancel + reissue** pair of certificate events; `quantity`/`date` land on
  those step transactions as real payload, so **`StockTransfer` (Default + Rsa) is now admissible in
  both profiles**. Its lineage-only siblings — `StockConversion`, `StockConsolidation`,
  `StockReissuance` and `StockRepurchase` share the shape but have no transaction-level payload;
  `StockReissuance` remains `no-payload`-blocked, while rich Core admits `StockRepurchase` through
  its explicitly lossy `returnedToTreasuryQuantity` aggregate projection. `StockPlanReturnToPool`
  similarly admits through the option/RSU security aggregates and pool identity, while its event date
  and reason remain unmappable.
- **Vesting under R6 lands via `VestingTerms`, not the event axis.** `VestingTerms` is admissible; the
  standalone vesting *transactions* (`VestingEvent`, `VestingAcceleration`) land no payload Carta can
  reflect and are `no-payload`-blocked, and the milestone/event-condition axis is unmapped. The
  "closer to Carta" hope held for the declarative template, not the event stream.

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

---

## 9. Two profiles — `strict` (shared floor) and `rich` (relaxed-OCF)

Everything above computes one thing: the **lossless intersection** — fields whose fold to Carta keeps
existence and cardinality. That is the **`strict`** profile (`core/`). But the intersection is
austere: a `Stakeholder` with no `name`, no `address`, no `email`, because each of those only has a
*narrowing* Carta home. A second **`rich`** profile keeps them.

**One derivation, two readings — not two pipelines.** Both profiles run the identical corpus load,
classifier (§2), admissibility gates (§3), and emitter (§4). They differ in a single predicate —
which loss classes still count a field as a **member** (`isMember`, `scripts/lib/core-pipeline.ts`):

- **`strict`** — members are exactly the `core`-class fields. `memberReasons = ∅`. This reproduces
  §§1–8 verbatim; `core/` must stay **byte-identical** to what it was before profiles existed (a test
  and the drift gate both pin this).
- **`rich`** — members are `core` **plus the lossy-home classes** `existence-loss` / `heuristic` /
  `partial` (bucket A of the lossy-home inventory, `npm run core:lossy`). A rich member is fed to §3
  exactly like a `core` field and rendered by the same emitter.

**Rich keeps OCF's shape; the loss moves to a different edge.** The emitter's `renderNode` already
renders from the **OCF source node**, inlining its `$ref`s — so admitting `Stakeholder.name` yields
OCF's structured `Name` (`{legal_name, first_name?, last_name?}`), not Carta's flat `fullName`; and
`addresses` stays an array of full `Address`, not a country string. `required` is already relaxed
(`[]`) on every entity. So rich does not *remove* the loss strict avoided — it **relocates** it:

- `strict`: the lossy edge is **OCF→Core** (richness shed on the way in); Core→Carta is
  schema-derived lossless, while Core→OCF requires OCF Extended enrichment.
- `rich`: Core is rich, so the lossy edge becomes **Core→target** (a rich `Address` narrows to Carta's
  `country`); a rich document also requires OCF Extended enrichment when it is returned to OCF.

`rich` therefore **gives up strict's "everything in Core is Carta-expressible" guarantee** in exchange
for a useful, populated Core. Both artifacts ship; neither replaces the other.

**Admissibility under rich — same gates, two consequences.** §3 is unchanged; it just sees more `core`
fields:

1. **Rich re-admits an entity only when a lossy-home field gives it *payload*** — a non-reference,
   non-bookkeeping member. Today that adds `StockClassConversionRatioAdjustment` (via
   `new_ratio_conversion_mechanism`) and `StockRepurchase` (via its explicit treasury-quantity
   aggregate projection). `Document` qualified under the April bundle via `path`/`uri`; the June 22
   refresh removed Carta's document definition, so `Document` now has no payload and stays out of
   rich (it remains ratified in `core-rich/allow-list.yml`, awaiting a green mapping). Rich is
   otherwise the
   same entity set as strict, enriched with fields (`Stakeholder` gains `name`/`addresses`/`contact_info`,
   `StockClass` gains `conversion_rights`/`seniority`, …). Rich is always a **strict superset**.
2. **Reference-only lossy-home fields resolve but are not payload.** The reverse-edge lineage links
   (`resulting_security_ids`, `balance_security_id`, `security_ids`, …) are `heuristic` members in rich
   and reference securities. So the reference graph (§5) gains a `security_references:` list (and
   `stock_class_ids → StockClass`) — **inert for strict**, where those fields are `out` and §3 never
   consults them — without which a rich member would dangle as an unknown FK and wrongly drop its
   entity. Because these are references (not payload), a transaction whose *only* lossy-home fields are
   lineage links lands nothing on its own and fails non-degeneracy. The `composite:` construct (§4.9)
   is the escape hatch: folding the event into an ordered pair of Carta step transactions gives the
   payload (`quantity`/`date`) a real home — which is exactly how **`StockTransfer`** is now admissible
   in **both** profiles. Its lineage-only siblings (`StockConversion`/`StockConsolidation`/
   `StockReissuance` remains **out** because it has no payload destination. `StockRepurchase` is **rich-only**
   through its explicit security aggregate projection, and `StockPlanReturnToPool` is admitted in both
   profiles through its security aggregates and destination pool identity. A future composite fold could
   provide transaction-level homes without relaxing the non-degeneracy gate.

**The upstream-OCF report (`core-rich/core-upstream.md`, rich only).** The actionable byproduct: every
lossy-home field rich carries, with the narrowing target home and the loss kind, OCF-*required* fields
flagged. Each row is where Core→target is knowingly lossy, and a candidate for an **upstream OCF
change** — e.g. relax `Address.required` so a Carta-sourced (country-only) address validates back as
OCF. Rich-Core does **not** wait on those changes; the report is its output, not its precondition.

**Build & gates run per profile.** `npm run core:build` emits both (`core/`, `core-rich/`), each with
its package + `core-ledger.md` + `core-gaps.md` (+ rich's `core-upstream.md`) and its own thin
`allow-list.yml`. `npm run core:check` runs the §4 drift + subset gates for **each** profile;
`npm run core:validate-sample` validates each profile's `sample/` against its own schemas. The
invariant that keeps this safe: the `strict` reading is the default and must never change.
