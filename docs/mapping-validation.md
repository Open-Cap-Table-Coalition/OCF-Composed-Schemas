# Mapping validation

`npm run mapping:validate` machine-checks every `.mapping.md` under `objects/`, `types/`, and
`canonical/` against its sibling composed `.schema.json` and the pinned target bundle in
`target-schema/`. CI runs it on every PR alongside typecheck, lint, and tests. The goal: the
"doc-first, parseable later" mapping format stays parseable in practice — target pointers resolve,
coverage counters never lie, and enum remaps are checked value-by-value.

## How it works

- `scripts/lib/mapping-parser.ts` extracts the frontmatter and the single ` ```yaml ` block under
  `## Mapping` and parses both with the `yaml` package (duplicate keys are a parse error).
- `scripts/lib/mapping-validator.ts` is pure rules: `validateMapping(parsed, sourceSchema,
  registry, targetBundle) → ValidationError[]`.
- `scripts/validate-mappings.ts` is the CLI walker (`--filter <glob>`, `--verbose`); errors are
  grouped per file and exit code is non-zero on any error. `--verbose` prints a per-file mapping
  tree (field → target, split fan-outs, enum value remaps, unmappable reasons, TODO counts).

## Rules

**Structural (every file):** required frontmatter keys; `status` ∈ `draft | partial | complete |
reviewed` and identical in frontmatter and mapping block; every `fields:` key is a real property
of the source schema; `kind` ∈ `rename | split | combine | enum-remap | computed | unmappable |
TODO` with the matching target shape (string; array of ≥2 strings for `split`; `null` for
`unmappable`; literal `TODO` for `TODO`); `coverage: X/N` where `N` = source property count and
`X` = non-`TODO` entry count — the counter is machine-checked, never hand-trusted. Any entry may
carry an optional free-text `note:` (a string), rendered under its field in `--verbose`. In a
polymorphic mapping (below), an entry may also carry a **`routed_to:`** map
(`{ discriminator value → variant label }`) — a *verified round-trip edge*: a value `null`-ed in
this variant because it belongs to another. The validator confirms each named variant actually
*claims* that value (a real, deterministic route), and `--verbose` renders it as
`VALUE → routed to "Variant" variant: <that variant's Carta primary_targets>` instead of
`VALUE ✗ dropped` — so it is clear which Carta objects the value actually lands in.

**Semantic (when `target_standard` ≠ `TBD`):** every string target must be a `#/...` JSON pointer
that resolves in the target bundle (`target_standard` → bundle file via `TARGET_BUNDLES` in the
validator). A pointer resolving to literal `true` (the bundle's rewrite for excluded schemas) is
an error — use `unmappable` + `reason: excluded-from-snapshot` instead. `enum-remap` entries need
a `values:` map whose keys exactly equal the OCF enum values; when the target resolves to an enum,
mapped values must be members of it (`null` = dropped value).

**Status-conditional:** `draft`/`partial` files may contain `TODO`s; `complete`/`reviewed` files
may not, must cover every property, and every `unmappable` entry must carry a `reason:`:

| `reason` | meaning |
| --- | --- |
| `no-equivalent` | the target genuinely lacks the concept |
| `excluded-from-snapshot` | the real target exists but is outside the pinned partial bundle |
| `out-of-scope` | deliberately dropped from the mapping effort |
| `ocf-internal` | OCF scaffolding (`id`, `object_type`, `comments`) with no target meaning |

## Polymorphic mappings (discriminator routing)

Some OCF transactions are **polymorphic** — one shared transaction type whose instrument is
selected by a discriminator field (e.g. `EquityCompensationIssuance.compensation_type` →
option / RSU / SAR; `StockIssuance.issuance_type` → RSA / plain stock) — while the target splits
them into dedicated per-instrument families. A `.mapping.md` may declare routing **inside** its
single `## Mapping` block (no parser change; absent these keys, the legacy single-target path runs
unchanged). The full design is in
[`polymorphic-transaction-routing.md`](./polymorphic-transaction-routing.md).

**Issuance-time** (`discriminator:`) — the discriminator is a property of this schema:

```yaml
discriminator: { field: compensation_type, exhaustive: true }
shared: { <field>: <entry> }            # fields identical across variants (validated once per variant)
variants:
  <Label>:
    when: [ENUM_VALUE, ...]             # the discriminator values this variant claims
    primary_targets: ["#/$defs/...", ...]  # the Carta family roots (or null for an unroutable variant)
    fields: { <field>: <entry> }        # same entry grammar as a simple mapping
coverage: { <Label>: "X/N", ... }       # per-variant; N = source property count
```

**Downstream** (`route_by_security:`) — the discriminator lives on the *joined issuance*, reached
via a foreign key; the file declares the join (the validator checks its shape, not its resolution):

```yaml
route_by_security:
  via: security_id                 # FK property on THIS schema
  resolve: compensation_type       # discriminator on the joined issuance
  resolve_enum: "<registry $id>"   # the enum the routes must cover
  source_mapping: ../issuance/EquityCompensationIssuance.mapping.md
  exhaustive: true
variants: { ... }                  # as above
```

**Per-variant target maps.** A `shared:` field is common to every variant, but its Carta *home*
may differ by variant (e.g. `quantity` lands on `OptionIssuanceTransaction` for options but
`RsuIssuanceTransaction` for RSUs). Rather than pinning such a field to one representative family,
give it a `target:` **map** keyed by variant label instead of a single pointer:

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
pointer (not the `true` sentinel) or `null` (= unmappable in that variant; still counts as a
covered, non-`TODO` entry). Map targets are allowed only on `rename` / `computed` / `combine`
`shared:` entries — not on `enum-remap` (route enum values in `variants.fields`) and not inside a
variant's own `fields:`. `--verbose` prints each variant's target (or `✗ unmappable`) beneath the
field.

**Checks (in addition to the per-field rules above):** the discriminator is enum-typed; the
variants' `when:` sets **partition** the routed enum — pairwise disjoint, and with
`exhaustive: true` every enum value is claimed by some variant (handled or explicitly unroutable);
each `primary_targets` pointer resolves (and is not the `true` sentinel); each variant's
`shared:` ∪ `fields:` map is validated and covers every source property against its own
`coverage[<Label>]` entry. `--verbose` prints the routing and each variant's per-field routes.

## Adding a target standard

Add the pinned bundle under `target-schema/`, register it in `TARGET_BUNDLES`
(`scripts/lib/mapping-validator.ts`), and set `target_standard` in the mapping frontmatter.
