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
`X` = non-`TODO` entry count — the counter is machine-checked, never hand-trusted.

**Source kind:** a mapping declares its source schema with an identity block — `ocf_schema_id` +
`ocf_object_type` + `ocf_title` + `ocf_kind` for OCF object/type sources, or `canonical_schema_id`
+ `canonical_title` + `canonical_kind` for canonical sources (e.g. `canonical/vesting/`); the file
self-selects by which `*_schema_id` key it carries. Flat OCF schemas key `fields:` by bare property
name; canonical schemas have no top-level `properties` and instead declare their objects under
`$defs`, addressed by dotted `Def.prop` field names. Coverage for a `$defs` source counts every
property of each def a field references — nested value-object defs that no field targets directly
are excluded.

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

## Adding a target standard

Add the pinned bundle under `target-schema/`, register it in `TARGET_BUNDLES`
(`scripts/lib/mapping-validator.ts`), and set `target_standard` in the mapping frontmatter.
