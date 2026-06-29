# OCF Core — Generation Spec (Straw-Man v0)

A self-contained specification of the **proposed syntax, workflow, and mechanism** for generating
the **OCF Core** straw-man profile. This is the *design*, decoupled from any particular
implementation: it describes what an author writes, what the machine must do with it, and what it
must emit — enough for a fresh implementation in any language. The reference implementation's code,
generated manifests, and hand-rolled artifact contents are intentionally **not** reproduced here.

---

## 1. What OCF Core is, and the problem it solves

**OCF Core** is the subset of OCF that survives a **round-trip through Carta in both directions**.
It is *not* a new format: an OCF Core instance is a valid OCF document with the non-surviving fields
removed (a **subset projection** — see §8). The artifact being standardized is *membership* — which
OCF entities and fields are Core — made **machine-checkable in CI** so "this field is Core" is an
enforceable claim rather than a prose assertion.

The straw man re-derives Core under a **bidirectional gate**. A prior pass asked only the forward
question — does OCF data survive `OCF → Carta → OCF`. The bidirectional gate additionally requires
`Carta → OCF → Carta`, the literal reading of "mappable to and from both standards." This matters
because Carta carries economically-meaningful structure OCF cannot express, so several forward-clean
transforms are **not reversible** (wider enums, free-text→enum, array→scalar, arbitrary-precision
widening). The reverse direction is the new source of disqualifiers.

**Load-bearing honesty constraint.** Every reverse-direction verdict is **schema-derived, not
importer-tested** — derived from what the two JSON Schemas permit, *not* from running a live Carta
importer. "Round-trips both ways" means *the schemas allow a lossless mapping*, not that production
performs it. The spec therefore attaches a `proof_level` to every claim and ships a
**needs-confirmation** list rather than overclaiming (see §9).

---

## 2. The conceptual model: tiers, transforms, and the gate

### 2.1 Three tiers, applied at field granularity

An entity is admitted on its **defining economic payload** (the amounts/quantities/prices/dates and
the security/stakeholder/class identifiers). Individual fields that fail the gate are **kept but
flagged**, not used to disqualify the whole entity.

- **StrictCore** — the defining economic payload round-trips **both** directions using only
  **reversible** transforms. Non-round-tripping fields on a StrictCore entity are marked
  **Extended** (they drop on export; the entity stays Core on its spine).
- **Reconstructable** — no clean 1:1 home, but the cap-table **state** survives via one of three
  reconstruction transforms (A/B/C below). *State reproduces; event identity, atomicity, effective
  dates, and governance approvals are lost.* "End-state reproducible" ≠ "event/graph preserved."
- **Out** — no home in one or both directions, reachable only through a disqualifying transform, or
  a genuinely missing attribute.

A field's tier is a pair: a **tier** (`core` | `extended` | `reconstructable`) and a **roundtrips**
direction (`both` | `forward` | `none`).

### 2.2 Reversible transforms (permitted inside StrictCore)

A field may be `core` only if its OCF→Carta transform is one of these (value-preserving and
invertible):

| # | Transform | Reversible because |
|---|---|---|
| T1 | `date ↔ datetime` widen/truncate | recoverable to date granularity (synthesize `T00:00:00Z` forward, truncate on import) |
| T2 | numeric / money formatting (`Numeric→Decimal`, `Monetary→Money`) | value-preserving **within OCF's grammar** (see scalar caveat, §2.5) |
| T3 | **bijective** `enum-remap` | source and target enum value-sets are identical (1:1 onto) — see bijection test in §4 Stage 1 |
| T4 | country-code reshaping (alpha-2↔alpha-3, subdivision `CC-` prefix) | deterministic over the ISO-assigned table |
| T5 | id **role**-remap | FK mapped by role; the value differs, the role is stable |
| T6 | container grouping | flat OCF transaction ↔ Carta `*TransactionItem` array — structural, not loss |

### 2.3 Disqualifying transforms (force a field to Extended; if it carries the defining payload, the entity drops to Reconstructable or Out)

- free-text → enum classification (e.g. `reason_text` → a closed `*CancellationReason`)
- array → scalar collapse (e.g. `resulting_security_ids[]`, `emails[]`, multi-`Address`)
- **non-bijective** enum coarsening (wider/narrower Carta enum, or many→one like `INSTITUTION→UNKNOWN`)
- structure → scalar collapse (e.g. `Ratio{num,den}` → `Decimal`)
- settlement-mode / state-machine flattening (e.g. CSAR/SSAR → one row; trigger/condition graphs)
- arbitrary-precision widening (Carta `Decimal`/`DateTime` strictly ⊋ OCF `Numeric`/`Date`) — a
  **reverse-only** disqualifier (forward is clean; the reverse admits values OCF cannot represent)

### 2.4 The three reconstruction transforms (define `reconstructable`)

A `reconstructable` field/entity must declare which transform reproduces its state:

- **A — cancel + reissue with lineage** (e.g. `precededBy` / `*Reason` chains): the event is modeled
  as a cancellation plus a new issuance carrying provenance links.
- **B — in-place snapshot mutation**: only the latest value survives (e.g. an adjusted authorized
  share count, a repriced strike); the event itself and its date are lost.
- **C — realized-event row**: the state lands as a row in a Carta array (e.g. a cancellation entry, a
  vesting-event row, an exercise transaction).

Each carries a **fidelity** ∈ {`strong`, `partial`} describing how much state survives.

### 2.5 The scalar value-domain scoping rule

The scalar substrate (`Numeric`, `Monetary`, `Percentage`, `Date`, and the code types) is StrictCore
**only for OCF-originated values inside OCF's grammar** (fixed-point with ≤10 decimal places, no
scientific notation, `[0,1]` for percentages, calendar dates with no time-of-day). A
Carta-originated value outside that grammar (a `Decimal` with an exponent or >10 dp, a `DateTime`
with a time-of-day) is reverse-lossy and therefore **Extended**. This rule is enforced concretely: in
the generated profile schema (§5) each scalar `$def` is emitted with the OCF-grammar validation
pattern, so an instance carrying an out-of-grammar value fails validation.

---

## 3. The annotation syntax (what an author writes)

### 3.1 The input: one structured mapping document per OCF entity

The only human input is a **per-entity mapping document** — a structured (YAML-style) record with a
per-field entry keyed by the OCF field name. (In the reference repo this is `<Entity>.mapping.md`,
with the mapping in a fenced YAML block; the format, not the file convention, is what matters.) Each
document carries **front-matter** the machinery relies on:

- `status` — the lifecycle gate; the generator only consumes mappings at `complete` (§4 Stage 3).
- `target_standard` / `target_version` — the pinned target bundle (Carta) the `target` pointers
  resolve against. (§8 proposes pinning this version into the versioned reference artifact.)
- `required_fields` — the OCF entity's required fields, used to intersect `required[]` in the
  emitted profile schema (§5).

Each per-field entry already carries (independent of this profile work):

```yaml
field_name:
  kind:   rename                                   # the transform — see vocabulary below
  target: "#/$defs/<CartaDef>/properties/<prop>"   # JSON-Pointer into the target bundle, or null
  reason: <slug>        # required when target is null / kind: unmappable
  note:   >- ...        # optional prose
```

**`kind` vocabulary:** `rename` | `split` | `combine` | `enum-remap` | `computed` | `unmappable` |
`TODO`.

**`reason` controlled slugs** (required whenever `target: null` / `kind: unmappable`) — at minimum:
- `ocf-internal` — an OCF bookkeeping field with no Carta analog (e.g. `id`, `object_type`).
- `no-equivalent` — Carta genuinely lacks the concept (e.g. `stock_legend_ids`, `consideration_text`).

**`enum-remap` payload:** an `enum-remap` entry carries a `values:` map giving the per-member
source→target mapping, and optionally a `routed_to:` map:

```yaml
compensation_type:
  kind: enum-remap
  target: "#/$defs/OptionGrant/properties/stockOptionType"
  values: { OPTION_NSO: NSO, OPTION_ISO: ISO, OPTION: OTHER, RSU: null, CSAR: null, SSAR: null }
  routed_to: { RSU: Rsu, CSAR: Sar, SSAR: Sar }   # null-valued members handled by a sibling variant
```

- `values: { <SourceMember>: <TargetMember> | null }` — the member-level mapping the validator reads
  to test bijectivity (§4 Stage 1). A member mapped to `null` is unmapped *in this variant*.
- `routed_to: { <SourceMember>: <VariantName> }` — optional; declares a `null`-valued member is not
  dropped but handled by the named sibling variant (a verified round-trip there), excluding it from
  the drop count.

### 3.2 Field-level profile keys (all optional — additive on the entry above)

| Key | Values | Meaning |
|---|---|---|
| `tier` | `core` \| `extended` \| `reconstructable` | the field's tier (omit → derived, §4 Stage 2) |
| `roundtrips` | `both` \| `forward` \| `none` | which directions survive |
| `reverse_blocker` | free text | *why* the reverse direction fails (expected on any forward-only field; copied into the ledger) |
| `reconstruct` | `{ transform: A\|B\|C, fidelity: strong\|partial }` | required when `tier: reconstructable` |

### 3.3 Entity- and variant-level default

An entity declares its tier once (a **top-level** key in the mapping block, alongside
`discriminator:`/`shared:`/`variants:`); unannotated fields inherit and only exceptions are
overridden:

```yaml
profile: { tier: core, roundtrips: both }     # entity is StrictCore
# or
profile: { tier: reconstructable }            # state round-trips, event lost
```

For polymorphic entities the default may instead/also be set per variant under
`variants.<Variant>.profile`.

### 3.4 Polymorphic entities: discriminator, variants, and the file skeleton

An entity whose Carta home depends on an OCF field is **polymorphic**. Its mapping declares a
discriminator and partitions the work into a shared block plus per-variant blocks:

```yaml
discriminator:
  field: issuance_type        # the OCF field that selects the route
  exhaustive: true            # the union of all variant `when:` sets must cover every enum value

shared:                       # fields common to all variants
  quantity:
    kind: rename
    target:                   # per-variant target MAP when the Carta home differs by route
      Rsa:     "#/$defs/RsaIssuanceTransaction/properties/quantity"
      Default: "#/$defs/CertificateIssuanceTransaction/properties/quantity"
  stock_legend_ids: { kind: unmappable, target: null, reason: no-equivalent }

variants:
  Rsa:
    when: [RSA]                                      # discriminator values this variant handles
    primary_targets:                                 # the Carta object(s) this route lands on
      - "#/$defs/RsaIssuanceTransaction"
      - "#/$defs/RestrictedStockAward"
    fields:                                          # variant-specific field entries / overrides
      vestings:
        kind: rename
        target: "#/$defs/RestrictedStockAward/properties/vestingEvents"
        tier: extended
        roundtrips: forward
        reverse_blocker: "vestingEvents realized rows (isoQuantity/nsoQuantity/vested) have no OCF pre-image"
```

Rules a fresh implementation must honor:

- **Variant set.** The keys under `variants:` are the canonical variant set. Every per-variant
  `target` map's keys are validated against it (every variant present, none unknown).
- **`when:` exhaustiveness.** When `discriminator.exhaustive: true`, the union of all `when:` sets
  must cover every value of the discriminator enum.
- **Shared vs variant.** `shared:` fields apply to every variant (divergent homes via a per-variant
  `target` map); `variants.<V>.fields:` are variant-specific. The classifier resolves each shared
  field against every variant and merges in the variant-specific fields, emitting one row per
  `(entity, variant, field)`.
- **Null variant.** A field whose `target` is `null` for a given variant (no home on that route) is
  forced to `extended`/`none` for that variant — never `core`.

**The discipline: annotate only the exceptions.** In the example above `quantity` is left bare and
derived to `core`; `vestings` is the one field a human must flag as forward-only; `stock_legend_ids`
is simply `unmappable`. A non-polymorphic entity omits `discriminator:`/`variants:` and lists its
fields under a single `fields:` block.

---

## 4. The mechanism: a four-stage, deterministic, CI-gated pipeline

A mapping document is the **only human input**; every downstream artifact is derived and gated.

```
  <Entity> mapping document   ← human writes this (targets + tier annotations)
        │  validate
        ▼
  [1] VALIDATOR  — gate: reject any dishonest annotation
        │  build
        ▼
  [2] CLASSIFIER — per (entity, variant, field) → a tier row
        │
        ▼
  [3] GENERATOR  — emit the three deterministic artifacts
        │  check (CI)
        ▼
  [4] GATES      — (a) drift: committed bytes == fresh build
                   (b) subset: generated ⊆ curated reference
```

### Stage 1 — Validator (the bidirectional gate)

Runs on every field as part of normal mapping validation. It enforces the **bidirectional
invariant**, which is what makes a dishonest annotation impossible to commit:

> `tier: core` **requires** `roundtrips: both` **and** a reversible-only `kind`
> (`rename` / `combine` / `computed`, or a **bijective** `enum-remap`).

Concretely the gate must:

- **Reject** `tier: core` on a `split`, an `unmappable`, a `TODO`, or a **non-bijective**
  `enum-remap`. **Bijection test:** resolve the target enum from the bundle and the source enum from
  the entry's `values:` map; require the two value-sets to be **equal as sets** (same membership, a
  true 1:1 onto remap — equal cardinality is necessary but not sufficient, and a wider/narrower
  target enum fails).
- **Reject** `tier: core` with any `roundtrips` other than `both`.
- **Require** `reconstruct: { transform ∈ {A,B,C}, fidelity ∈ {strong,partial} }` whenever
  `tier: reconstructable`, and require `roundtrips ≠ both`.
- **Require** `roundtrips ∈ {forward, none}` for `tier: extended`.
- For polymorphic fields, carry the author's `tier:` onto **each variant projection** including the
  `null`/no-home ones — so `core` + "no home in this variant" is rejected, not silently dropped.

All keys are optional, so a corpus with no annotations still validates (additive rollout). A
configuration switch can later make the entity-level tier declaration mandatory once the corpus is
fully annotated (optional first, required later).

### Stage 2 — Classifier (derive tier rows)

Produces **one tier row per `(entity, variant, field)`**. An explicit annotation always wins;
otherwise the tier is **derived** from the kind + whether the target resolves in the target bundle:

| Kind (unannotated) | Derived tier / roundtrips |
|---|---|
| `rename` / `computed` / `combine` with a **resolving** target | `core` / `both` |
| `rename` / `computed` / `combine` with a **null / unresolved** target | `extended` / `none` (or `forward`) |
| bijective `enum-remap` | `core` / `both` |
| non-bijective `enum-remap` | `extended` / `forward` |
| `unmappable` / `TODO` / `split` | `extended` / `none` |

Per-variant `target` maps are resolved **per variant** before classifying, so one OCF field emits
multiple rows.

**The honesty rule (load-bearing).** Deriving fields to `core` does **not** make the *entity*
StrictCore. An entity is StrictCore only when its mapping carries an **explicit** tier declaration —
an entity-level `profile: { tier: core }`, or ≥1 field tagged `tier: core`. Derivation alone never
promotes an entity: a forward mapping is not a proven round-trip. (Concretely: strip a StockIssuance
of its entity-level `profile:` line and every field is still classified, but the entity drops to
*Out*.)

### Stage 3 — Generator (emit artifacts)

Walks the corpus, **validates each mapping and skips any with errors or not at `status: complete`**
(green-only filter), classifies the rest, and emits three **deterministic, byte-stable** artifacts
(see §5). Output must be reproducible — no timestamps, stable key ordering — so the drift gate can
byte-compare.

### Stage 4 — CI gates

A verification/CI pass rebuilds in memory and fails unless **both** hold:

1. **Drift** — every committed artifact byte-equals a fresh build (edit an annotation, forget to
   rebuild → CI goes red).
2. **Subset** — the generated set is a subset of the curated **reference** (§6): every generated
   StrictCore entity is in the reference's `$defs`; every generated `core` field is in that entity's
   reference `$def`; every generated Reconstructable entity is a key in the reference's
   `x-reconstructable` map.

This reuses the trust model the repo already applies to its per-variant `coverage: { <Variant>:
<mapped>/<total> }` counters — a generated value committed alongside the mapping and re-derived +
diff-checked in CI. The three new artifacts extend exactly that pattern.

---

## 5. The generated artifacts (what the machine emits)

Three files, generated and never hand-edited, regenerated and diff-gated in CI:

- **Membership ledger** — one row per `(entity, variant?, field)` carrying `tier`, `roundtrips`,
  `target`, optional `reconstruct`, optional `reverse_blocker`, and `proof_level`, plus per-tier
  counts. This carries the reverse-direction and Reconstructable truth a JSON Schema cannot express.
- **Profile schema** — a derived OCF-dialect JSON Schema (draft-07; `$id` `ocf-core/profile`) with
  one `$def` per StrictCore entity, **pruned to its `core`/`both` fields**, with `required[]`
  intersected down to the surviving fields. Referenced OCF scalar types are inlined as local `$defs`
  carrying their **OCF-grammar validation** (`Numeric` as fixed-point ≤10 dp, `Percentage`
  constrained to `[0,1]`, code types as their patterns) — this materializes the §2.5 value-domain
  rule on the OCF side. External `$ref`s are rewritten to local `#/$defs/...` so the schema is
  self-contained. **By construction, an instance valid against this schema *is* StrictCore.** It
  reuses OCF's own field names and types verbatim (see §8 — Core is a projection, not a transform).
- **Human rollup** (markdown) — per-tier counts and, per entity, the core / extended field lists
  (per-variant rows deduped to one name each; a field that is core in *any* variant shows as core).

### Proof levels

`proof_level` keeps StrictCore from overclaiming:

- `P0` — structural only (target shape resolves)
- `P1` — enum-bijection checked (target resolves **and** the source/target enum value-sets verified
  equal)
- `P2` — executed value-level round-trip (**out of scope** for the static gate)

Under the static gate, Core fields ship at `P1` at best; `P2` requires a live importer and is
explicitly deferred (see §9).

---

## 6. Two-layer model: curated reference vs generated profile

The full Core definition must **not** wait on every in-flight mapping PR to land. So Core is split
into two layers, with a guard that keeps them honest:

- **Reference** (curated) — the hand-maintained *definition* of Core: an OCF-dialect JSON Schema
  (`$id` `ocf-core/reference`) with one `$def` per StrictCore entity, plus a top-level
  **`x-reconstructable`** object keyed by entity family (each family's reconstruct transform +
  fidelity). v0 is ~16 StrictCore `$defs` + ~26 reconstructable families. Derived from the spec
  analysis by a human, **independent of which mapping PRs have landed.** This is *the* definition of
  OCF Core, and the **versioned** artifact. Each StrictCore `$def` carries a `$comment` with an
  `EXTENDED (drop on export): …` line naming that entity's reverse-lossy fields and reasons — the
  source authors copy from when filling in `reverse_blocker:` (see §7).
- **Generated** (the ledger + profile schema + rollup) — the subset that has been **mechanically
  verified so far**: the entities whose mappings are actually annotated and validating today. It
  converges on the reference as entities graduate; it carries no independent version.

**Subset guard.** Stage 4(b) asserts the generated profile is **always a subset of the reference**
— for StrictCore entities/fields *and* for the `x-reconstructable` families. The machinery can
therefore never publish an entity or field the curated definition does not sanction (this is what
catches an optimistic over-derivation). If a green mapping would generate something the reference
does not list, CI fails: either the annotation is wrong, or the spec genuinely changed and the
reference + analysis doc must be updated **in the same change**.

---

## 7. The graduation workflow (how an entity enters the generated profile)

An entity starts **reference-only** (defined in the curated reference, not yet generated) and
**graduates** into the generated/gated profile when its mapping lands and is annotated:

1. **Land the mapping** — `status: complete`, passing normal mapping validation.
2. **Declare the entity tier** — add `profile: { tier: core, roundtrips: both }` (or `{ tier:
   reconstructable }`) to the mapping's block.
3. **Annotate only the exceptions** — leave plain resolving renames bare (derived to `core`); for
   each **reverse-lossy** field, override to `tier: extended, roundtrips: forward` with a
   `reverse_blocker` (copy the reason from the reference `$def`'s `EXTENDED` `$comment` line). For a
   reconstructable entity, tag the relevant field(s) with `reconstruct: { transform, fidelity }`.
   The four reverse-lossy patterns to watch:
   **wider Carta enum · free-text → enum · array → scalar · arbitrary-precision widen.**
4. **Regenerate and verify** — validate (gate the annotation) → build (regenerate the three
   artifacts) → check (drift + subset). Commit the mapping **and** the regenerated artifacts
   together.
5. **Result** — the entity now appears in the profile schema / rollup, and the subset guard confirms
   it matches the curated reference. If it doesn't, CI fails until either the annotation or the
   reference+spec is corrected.

Each in-flight mapping PR thus adds its own annotations and re-runs the build; CI's check enforces
the regen on every PR.

---

## 8. Governance, versioning, and the projection model

Three framing points a ratified spec must nail down (flagged here so the straw man is honest about
what it is *not* yet):

- **OCF Core is a projection of OCF, not a new format.** Producing a Core instance is a **subset
  projection**: keep the StrictCore fields, drop the Extended ones. Each `$def` keeps OCF's own field
  names and types, so an OCF Core document **is** a valid OCF document with fields removed — **no
  value transform on the OCF side.** The value transforms (`date↔datetime`, enum remaps,
  country-code reshaping, …) happen **only on the Carta crossing**, recorded per field as the Carta
  `target`. This is why the profile schema reuses OCF field names verbatim.
- **Versioning.** The **reference** schema is the versioned artifact; a Core release is a tagged
  state of the reference + the spec doc. The generated profile is derived and always a subset, so it
  carries no independent version. A future revision should pin the target (Carta) bundle version —
  which each mapping already records — into the reference schema's `$id`.
- **Produce/consume contract (out of scope for v0).** This spec defines *membership* (what is Core),
  not a wire contract for emitting or ingesting Core instances. An instance is "StrictCore-valid" iff
  it validates against the generated profile schema; the round-trip *guarantee* behind that validity
  is still `proof_level`-bounded and pending the §9 importer confirmations.

---

## 9. Honesty boundary — what must be confirmed against a live importer

Because every reverse verdict is **schema-derived, not importer-tested**, the spec ships a
needs-confirmation list rather than overclaiming. The categories that would change verdicts:

1. **Authoring model** — are transfer/conversion/split entered as cancel+reissue (transform A) or
   rescaled in place (transform B)? Gates every transform-A family.
2. **Enum bijections** — are the enums claimed bijective actually wired 1:1 by the importer, or do
   exotics fall to `OTHER`/`UNKNOWN`? Gates every `enum-remap` claiming `core`.
3. **Writability on import** — are the Carta fields targeted by reconstructable transforms actually
   ingestable, or derived/read-only? Gates Repricing/Vesting/Acceptance-style reconstructions.
4. **Unit conventions** — e.g. fraction `0.125` vs whole-number `12.5` for percentages; a silent
   mismatch breaks the percentage leaf.
5. **Out-of-grammar scalars** — does Carta ever emit scientific-notation / >10-dp `Decimal`s or
   sub-day `DateTime`s in practice? Determines whether the scalar reverse-blocker is operational or
   theoretical.

The static gate proves **schema-permits**; these confirmations are the difference between that and
**round-trips-in-production**. `proof_level` is the field that records which side of that line each
claim sits on.

---

## 10. Implementation checklist for a fresh build

A crack dev re-implementing this needs to deliver, in order:

1. **Annotation grammar** — extend the mapping-entry parser to accept the optional field keys
   (`tier`, `roundtrips`, `reverse_blocker`, `reconstruct`), the `enum-remap` `values:`/`routed_to:`
   payload, and the entity/variant `profile:` default. All optional; existing corpus must still
   validate.
2. **Validator invariant** — the bidirectional gate (§4 Stage 1), including the bijection test by
   enum value-set equality and per-variant projection of `tier:`.
3. **Classifier** — the derivation table (§4 Stage 2), per-variant resolution, and the honesty rule
   (no entity promotion without an explicit tier declaration).
4. **Generator** — deterministic emission of the three artifacts (§5), including the
   OCF-name-preserving, self-contained profile schema with inlined scalar grammar patterns and
   intersected `required[]`.
5. **Curated reference** — the hand-maintained Core definition (§6: StrictCore `$defs` +
   `x-reconstructable`) and the subset guard.
6. **CI wiring** — a verification mode running both gates (drift + subset), plus a build step authors
   run before committing.

Domain *data* (which specific entities/fields land in each tier under the current Carta bundle) is
the **output** of this machinery, not part of the spec — it is re-derived whenever the mappings or
the Carta bundle change, and lives in the curated reference + generated artifacts, not in this
document.
