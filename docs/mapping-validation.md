# Mapping validation

`npm run mapping:validate` machine-checks every `.mapping.md` under `objects/` and `types/`
against its sibling composed `.schema.json` and the pinned target bundle in
`target-schema/`. CI runs it on every PR alongside typecheck, lint, and tests. The goal: the
"doc-first, parseable later" mapping format stays parseable in practice — target pointers resolve,
derived coverage stays reviewable, and enum remaps are checked value-by-value.

## How it works

- `scripts/lib/mapping-parser.ts` extracts the frontmatter and the single ` ```yaml ` block under
  `## Mapping` and parses both with the `yaml` package (duplicate keys are a parse error). It
  also parses the optional auditable checklist questions in `## Notes / open questions`.
- `scripts/lib/mapping-validator.ts` is pure rules: `validateMapping(parsed, sourceSchema,
  registry, targetBundle) → ValidationError[]`.
- `scripts/validate-mappings.ts` is the CLI walker (`--filter <glob>`, `--verbose`); errors are
  grouped per file and exit code is non-zero on any error. `--verbose` prints a per-file mapping
  tree (field → target, split fan-outs, enum value remaps, unmappable reasons, TODO counts, and —
  when present — a `composite (N steps, all emitted)` node listing each step's Carta target(s) and
  any fixed `const:` fills).
- `--inverse` prints a repository-wide target-first report in addition to validation. It renders the
  shared inverse-coverage ledger: executable/type/structural/deferred evidence, mutually exclusive definition
  roles, and the curated value-type/nested-type exclusions. Use `--inverse --target-object
  ConvertibleNote` to focus the object panels on one Carta definition. Unfiltered reports show
  mapped object-like definitions and only role-follow-up candidates; value types and nested types
  are listed separately with their coverage/parent objects. A `structural` slot is a parent
  property whose `$ref`/`items.$ref` child definition has executable mapping evidence and whose
  same mapping also carries executable evidence for the containing parent; it is populated through
  child records rather than by a source field aimed at the parent property.
  Within each target property, the report builds source path(s): the direct `[object]` route is
  the ancestor, and nested `[type]` entries appear beneath it when they are reached through an
  explicit sequential or schema-reference relationship. They are not additional independent
  source records. When the source is nested and polymorphic, the report also prints the
  discriminator chain: the selected nested wrapper, its outer `type` guard, and the inner union
  branches such as `NoteConversionMechanism` versus `SAFEConversionMechanism`.
  When the same Carta object is reached through a polymorphic mapping, the panel starts with a
  compact **resulting Carta object flavors** summary. Each flavor names the source route, the
  discriminator condition, and the target properties mapped by that route. Conditional property
  flows that enrich an object without creating a new object flavor are shown separately. The
  report also renders a Mermaid **Carta target class/data flow** when standalone OCF object
  mappings populate multiple child slots on the same Carta object (for example, `issuance` versus
  `cancellations[]` on a transaction item). OCF source routes are classes on the left; the Carta
  parent and nested child classes are on the right. Solid arrows label child fields and parent
  slots, while dotted arrows show parent-child containment. This is a per-source-record flow view:
  a routed OCF record follows its matching branch, while distinct lifecycle records may still
  aggregate into one parent Carta item. The full aggregate mapping detail remains below as the
  audit trail; the diagram is a report-only recut of the existing mapping evidence and does not
  change coverage counts or mapping semantics.
  Target properties with no mapped OCF source remain explicit in each panel.
- CI runs the equivalent `npm run mapping:inverse` command on every pull request and push to `main`.
  That command renders the same shared inverse-coverage ledger and role policy used by the
  generated Core reports, then uploads the object-panel view as a CI artifact.
  The generated report is added to the GitHub Actions job summary and uploaded as the
  `mapping-inverse-report` artifact, including when another mapping check fails.

Each mapping page also contains a generated **Ask a mapping question** table with a prefilled
GitHub issue-form link for every source property. The links pass the mapping file, property path,
source page, and issue title into `.github/ISSUE_TEMPLATE/mapping-question.yml`. The generated
block is marked with HTML comments and can be refreshed without touching the hand-authored YAML
mapping or notes:

```bash
npm run mapping:question-links
npm run mapping:question-links -- --check
```

Issue templates are read from the repository's default branch, so these links become active after
the template lands on `main`.

### Auditable mapping questions

Questions are ordinary GitHub task-list items, with fixed metadata underneath so CI can validate
them and the inverse report can project open questions onto the related Carta property:

```md
- [ ] `security_id`: Why does this source identifier map to Carta `securityId`?
  - Asked by: @alice
  - Answer: Pending confirmation from the OCF owners.
  - Answered by: —

- [x] `security_id`: Should the target identifier be preserved?
  - Asked by: @alice
  - Answer: No; Carta generates its own identifier.
  - Answered by: @bob

- [ ] `addresses[].country`: Should this source also populate stakeholder compliance residency?
  - Target: Compliance.countryOfResidency
  - Asked by: @alice
  - Answer: Open: investigate the required object linkage and code conversion.
  - Answered by: —
```

The property path is optional for mapping-level questions. Dotted paths such as
`vesting[].ratio` and JSON-pointer-like paths such as `/vesting/ratio` are accepted; the
top-level segment must exist in the sibling source schema. Every question must have non-empty
`Asked by`, `Answer`, and `Answered by` metadata. An open question may use `—` (or another
explicit placeholder) for `Answered by`; a checked question must name the answerer. The answer
and audit metadata remain in the mapping Markdown after the question is checked, while
`--inverse` renders only unchecked questions beneath the matching target property. To bind a
question directly to a Carta slot, add optional `Target: CartaObject.property` metadata; this is
especially useful for a target property that currently has no mapped OCF source. Carta target
paths are checked against the target bundle. Malformed question headers, metadata, answers, source
property paths, or Carta target paths fail mapping validation and therefore fail CI.

## DSL operator reference

Each `fields:` entry has one `kind`. Cardinality below describes one source record and its target
record(s); `N` means one or more items. `composite` is the one record-level block, not a `kind`.

| Operator | What changes | Cardinality | Simple example |
| --- | --- | --- | --- |
| `rename` | Copy a shape-compatible value to a target slot | 1 value → 1 slot | `name` → `ShareClass.fullName` |
| `construct` | Put a scalar in an explicitly named member of a one-member target object | 1 scalar → 1 object slot | `"0.25"` → `{ value: "0.25" }` |
| `select` | Reduce an array/object under an explicit policy | 1 aggregate → 1 slot | `addresses[]` → first `address.country` |
| `split` | Fan one source property out to several target slots, optionally by enum branch | 1 property → N slots | `schedule` → `length` + `lengthUnit` |
| `combine` | Fan several source properties into one target slot | N properties → 1 slot | `primary_contact` **or** `contact_info` → `email` |
| `enum-remap` | Map each member of a closed source enum | 1 enum value → 1 enum value | `PREFERRED` → `PREFERRED` |
| `union-map` | Choose one mapping for the source union branch | 1 union value → 1 branch mapping | `Numeric` branch → `ShareClass.authorizedShareCount` |
| `computed` | Derive a target value from source data or context | N inputs → 1 derived slot | stock-class seniority → Carta rank |
| `unmappable` | Explicitly record that no target exists | 1 property → 0 slots | `votes_per_share` → no-equivalent |
| `TODO` | Leave an unresolved mapping during drafting | unresolved | `new_field` → `TODO` |
| `composite:` block | Fold one source event into ordered target records; all steps emit | 1 record → N records | `StockTransfer` → `cancel` + `issue` |

The axes are intentionally separate: `construct` changes a value's shape, `split`/`combine` change
field cardinality, and `composite` changes record cardinality. A composite step may still use
ordinary field operators, including `construct` or `combine`, for the fields it emits.

### Inverse semantics

The optional `inverse:` block is a second, independent axis. It describes what a consumer can
recover when walking a Carta target back toward OCF; it does not change the forward transform
selected by `kind`:

| Role | Inverse meaning |
| --- | --- |
| `record-construction` | The default: the target can participate in constructing the corresponding OCF record. |
| `reference-only` | The target preserves an identifier or relationship used to join an existing record; it does not create the source record. |
| `state-projection` | The target is a current/summary state value; it does not preserve the source event history or temporal qualifier. |
| `aggregate-projection` | Multiple source facts are reduced into one target aggregate; the original records cannot be split deterministically. |
| `event-reconstruction` | The target retains enough event identity and payload to reconstruct the source event. |

For example:

```yaml
quantity:
  kind: rename
  target: "#/$defs/OptionGrant/properties/returnedToPoolQuantity"
  inverse:
    role: aggregate-projection
    note: Repeated return events are summed into a per-security total.
```

The inverse ledger retains these roles on each target edge and renders non-default roles in the
target-first report. This keeps ordinary slot coverage separate from round-trip recoverability:
an aggregate or reference edge still proves that the forward mapping reaches a Carta slot, but it
does not claim that the slot can recreate an OCF event or record. Target-definition roles such as
`report-rollup` remain separate in `core/inverse-coverage-policy.yml`; use `override: true` only
when curated target metadata must supersede direct shape evidence, such as an orphaned summary
definition that is a forward conceptual target but cannot seed an inverse source record.

## Rules

**Structural (every file):** required frontmatter keys; `status` ∈ `draft | partial | complete |
reviewed` and identical in frontmatter and mapping block; every `fields:` key is a real property
of the source schema; `kind` ∈ `rename | construct | select | split | sequential_transform | combine | enum-remap | union-map | computed | unmappable |
TODO` with the matching target shape (string; `construct` requires its construction block; array of ≥2 strings for `split`; exactly two `steps`
(`select` then `apply_mapping`) for `sequential_transform`; a `cases:` list for
`union-map`; `null` for
`unmappable`; literal `TODO` for `TODO`). Coverage is derived from the source schema and effective
mapping entries; it is not a mapping key and is never hand-maintained. Any entry may carry an
optional free-text `note:` (a string), rendered under its field in `--verbose`. Any entry may also
carry the closed `inverse: { role, note? }` block described above. A `split` on an
enum property may also carry `routes:`: a complete map of `source enum value → source field →
target pointer|null`, which makes paired or multi-field branches explicit and lets `--verbose`
render the branch as one grouped route. `rename` is
a lossless, shape-compatible 1:1 copy. `select` reduces an array or structured value to one target
and requires a non-empty deterministic `policy:`; an optional relative `source:` pointer identifies
the member path selected from an object or array item. Array-to-scalar `split` entries likewise
require a deterministic `policy:`. Every policy name must be registered in
[`scripts/lib/mapping-policies.ts`](../scripts/lib/mapping-policies.ts), and a policy may only be
used with its registered host kind. `sequential_transform` is the narrow composition form for a
field-level pipeline: its first step selects one intermediate value, and its second
`apply_mapping` step names the reusable mapping file and its Carta target pointers. A
select step may also carry `where: { path, equals }` when the selected intermediate value
must satisfy a discriminator guard; registered policies may require an exact guard. In a
polymorphic mapping (below), an entry may also carry a
**`routed_to:`** map
(`{ route property value → variant label }`) — a *verified round-trip edge*: a value `null`-ed in
this variant because it belongs to another. The validator confirms each named variant actually
*claims* that value (a real, deterministic route), and `--verbose` renders it as
`VALUE → routed to "Variant" variant: <that variant's Carta primary_targets>` instead of
`VALUE ✗ dropped` — so it is clear which Carta objects the value actually lands in.

### `construct`: construct a target object from a scalar

Use `construct` when a bare string scalar is used to construct a target object with one explicitly named member. The mapping must declare both the member and the lexical rule; neither is inferred from the target schema:

```yaml
fields:
  percentage:
    kind: construct
    target: "#/$defs/VestingPeriod/properties/percentage"
    construct:
      property: value
      normalization:
        integer_leading_zeros: strip
```

The grammar is closed:

- `construct.property` is a non-empty string and must be the sole string property in the target object.
- `construct.normalization` contains exactly `integer_leading_zeros`, whose value is `preserve` or `strip`.
- `preserve` copies the scalar text unchanged. `strip` removes redundant leading zeroes from the integer part, retains the sign, and retains at least one integer zero (`0007` → `7`, `-000.50` → `-0.50`, `000` → `0`).

The validator rejects a missing member, an unknown normalization key, or an unsupported normalization value. For OCF `Numeric` → Carta `Decimal`, use `strip` because Carta's `Decimal.value` rejects multi-digit integer leading zeroes.

**Semantic (when `target_standard` ≠ `TBD`):** every string target must be a `#/...` JSON pointer
that resolves in the target bundle (`target_standard` → bundle file via `TARGET_BUNDLES` in the
validator). A pointer resolving to literal `true` (the bundle's rewrite for excluded schemas) is
an error — use `unmappable` + `reason: excluded-from-snapshot` instead. `enum-remap` entries need
a `values:` map whose keys exactly equal the OCF enum values; when the target resolves to an enum,
mapped values must be members of it (`null` = dropped value).

`union-map` handles a source `oneOf`/`anyOf` whose alternatives have different mapping outcomes.
Each `cases:` item names one exact source `$ref` in `source_schema:` and supplies a normal mapping
entry under `mapping:`. The cases must cover every named source branch exactly once. This keeps a
branch that has no Carta home explicit instead of allowing a plain `rename` to imply total coverage.

For `rename`, `construct`, `combine`, and `computed`, `target:` may be a non-empty list of pointers
when one source value is intentionally replicated to multiple Carta homes. `split` already uses a
target list for its fan-out semantics; `select` and `enum-remap` remain scalar-target operations.

**Status-conditional:** `draft`/`partial` files may contain `TODO`s; `complete`/`reviewed` files
may not, must cover every property, and every `unmappable` entry must carry a `reason:`:

| `reason` | meaning |
| --- | --- |
| `no-equivalent` | the target genuinely lacks the concept |
| `excluded-from-snapshot` | the real target exists but is outside the pinned partial bundle |
| `out-of-scope` | deliberately dropped from the mapping effort |
| `ocf-internal` | OCF scaffolding (`id`, `object_type`, `comments`) with no target meaning |

## Polymorphic mappings (route-by-property routing)

Some OCF transactions are **polymorphic** — one shared transaction type whose instrument is
selected by a route property (e.g. `EquityCompensationIssuance.compensation_type` →
option / RSU / SAR; `StockIssuance.issuance_type` → RSA / plain stock) — while the target splits
them into dedicated per-instrument families. A `.mapping.md` may declare routing **inside** its
single `## Mapping` block (no parser change; mappings without this block use the ordinary
single-target `fields:` shape). The full design is in
[`polymorphic-transaction-routing.md`](./polymorphic-transaction-routing.md).

OCF source schemas may use discriminator fields, but the mapping DSL has one polymorphic routing
operator: `route_by_property`. `discriminator` and `route_by_security` are not supported mapping
keys.

**Polymorphic routing** (`route_by_property:`) — the routed property may belong to the current
record or to a related record:

```yaml
route_by_property:
  on_property: compensation_type
  exhaustive: true
shared: { <field>: <entry> }            # fields identical across variants (validated once per variant)
variants:
  <Label>:
    when: [ENUM_VALUE, ...]             # the route property values this variant claims
    primary_targets: ["#/$defs/...", ...]  # the Carta family roots (or null for an unroutable variant)
    fields: { <field>: <entry> }        # same entry grammar as a simple mapping
```

For a related record, `lookup_by` declares the relationship (the validator checks its shape and
the referenced source property):

```yaml
route_by_property:
  lookup_by:
    key: security_id                # key property on THIS schema
    through:
      mapping: ../issuance/EquityCompensationIssuance.mapping.md
      on_property: compensation_type # property on the looked-up record
  exhaustive: true
variants: { ... }                  # as above
```

`on_property` is the local form. `lookup_by` makes a cross-record lookup explicit: `key` is the
property on the current record, `through.mapping` identifies the looked-up record, and
`through.on_property` is the route property read from it. The validator infers the enum from that
mapping/property pair, so no separate enum URL is needed. The same construct covers local and
cross-record polymorphism without a security-specific key.

**Per-variant target maps.** A `shared:` field is common to every variant, but its Carta *home*
may differ by variant (e.g. `quantity` lands on `OptionIssuanceTransaction` for options but
`RsuIssuanceTransaction` for RSUs). Rather than pinning such a field to one representative family,
give it a `target:` **map** keyed by variant label instead of a single pointer. Each map value may
be one pointer, a non-empty list of pointers when the source field is intentionally replicated, or
`null`:

```yaml
shared:
  quantity:
    kind: rename
    target:
      Option: "#/$defs/OptionIssuanceTransaction/properties/quantity"
      Rsu:    "#/$defs/RsuIssuanceTransaction/properties/quantity"
      Sar:    "#/$defs/SarIssuanceTransaction/properties/quantity"
  security_id:
    kind: rename
    target:
      Option: "#/$defs/OptionGrant/properties/securityId"
      Rsu:    "#/$defs/RestrictedStockUnit/properties/securityId"
      Sar:    null   # no Carta security object for SARs → unmappable in this variant
```

The validator enforces the keys **stay in sync** with the variant set: every variant must have an
entry (none missing) and no key may name a non-existent variant. Each value is a resolving `#/...`
pointer, a non-empty list of resolving pointers (not the `true` sentinel), or `null` (= unmappable in that variant; still counts as a
covered, non-`TODO` entry). Map targets are allowed only on `rename` / `construct` / `computed` / `combine`
`shared:` entries — not on `enum-remap` (route enum values in `variants.fields`) and not inside a
variant's own `fields:`. `--verbose` projects these effective targets beneath the routed variant
and groups them by Carta target object.

**Checks (in addition to the per-field rules above):** the route property is enum-typed; the
variants' `when:` sets **partition** the routed enum — pairwise disjoint, and with
`exhaustive: true` every enum value is claimed by some variant (handled or explicitly unroutable);
each `primary_targets` pointer resolves (and is not the `true` sentinel); each variant's
`shared:` ∪ `fields:` map is validated and covers every source property. `--verbose` prints the
routing, each variant's derived coverage, and its target-object-first field routes; identical shared
decisions are shown once at the bottom under `shared across all variants`, with each affected variant
annotated as `+N shared`.

To review coverage across the whole mapping corpus, run `npm run mapping:coverage`. It writes the
generated [`mapping-coverage.md`](./mapping-coverage.md) heatmap. CI runs
`npm run mapping:coverage:check` so the committed artifact cannot go stale.

## Composite steps (one OCF verb → an ordered set of Carta transactions)

Some OCF transactions have **no single Carta target** because Carta records ledger *state*, not the
event — a stock transfer is not a transfer transaction but a **pair** of certificate events (cancel
the source, issue the transferee's). A `composite:` block models that fold: an **ordered list of
steps, ALL emitted** (additive), orthogonal to `variants:`, which are mutually exclusive (pick one).
It is only valid **alongside** a `route_by_property:` + `variants:` block — the
polymorphic block supplies the family axis its per-step target maps key into. The full design is in
[`polymorphic-transaction-routing.md`](./polymorphic-transaction-routing.md) §4.9.

Each step carries a `step:` id, a per-family `target:` map (the Carta `$def` diverges by family),
and an optional per-family `const:` map of fixed Carta values the step always carries (the
`*_TRANSFERRED` reason enums):

```yaml
route_by_property:                                                     # family axis (required)
  lookup_by:
    key: security_id
    through:
      mapping: ../issuance/StockIssuance.mapping.md
      on_property: issuance_type

composite:                                     # ordered steps, ALL emitted
  - step: cancel
    target:
      Default: "#/$defs/CertificateCancellationTransaction"
      Rsa:     "#/$defs/RsaCancellationTransaction"
    const: { Default: { reason: CERTIFICATE_CANCELLATION_REASON_TRANSFERRED } }
  - step: issue
    target:
      Default: "#/$defs/CertificateIssuanceTransaction"
      Rsa:     "#/$defs/RsaIssuanceTransaction"
    const: { Default: { issuanceReason: CERTIFICATE_ISSUANCE_REASON_TRANSFERRED } }
```

**Payload fields land per-step, then per-family.** A `shared:` target map may be keyed by **step id**
instead of variant label, reusing the per-variant `{ key: pointer }` map shape (the "Per-variant
target maps" above, §4.8) — a step's value may itself be a per-family `{ label: pointer }` map.
Step-id and variant-label key spaces are **disjoint**, so a map is read as per-step when its keys
are step ids and per-variant otherwise (no extra syntax).

**Checks (`validateCompositeBlock`, in addition to the per-field rules above):** the steps are a
non-empty ordered list; step ids are unique; each step `target:` resolves per family (a resolving
`#/...` pointer, not the `true` sentinel); a `const:` field must exist on that step's `$def` and,
if the target is enum-typed, the value must be a member of that enum; `const:` may be per-family —
needed where an enum lacks a `*_TRANSFERRED` member (e.g. `RsaCancellationReason`), so those steps
omit it; and a `composite:` block requires an accompanying polymorphic block (a bare composite is an
error).

This is what lets `StockTransfer` — which otherwise carries only lineage references (no payload, so
held out of Core) — land `quantity`/`date` on its step transactions and become Core-admissible.

## Adding a target standard

Add the pinned bundle under `target-schema/`, register it in `TARGET_BUNDLES`
(`scripts/lib/mapping-validator.ts`), and set `target_standard` in the mapping frontmatter.
