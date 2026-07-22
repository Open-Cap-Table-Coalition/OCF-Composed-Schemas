# Contributing

This guide is for contributors who understand cap tables but are still learning OCF and the conventions in this repository. It covers the normal path from a mapping question to a validated pull request, with a walkthrough of the mapping DSL.

The short version is:

1. Start from a fresh branch based on `main`.
2. Treat the composed OCF schemas, the pinned Carta bundle, and the mapping documents as the inputs.
3. Describe every source property, including properties with no target.
4. Run the targeted validator first, then the Core and repository checks that your change can affect.
5. Regenerate generated Core output; never hand-edit generated schemas or reports.

## Before you start

Read these in order when the repository is unfamiliar:

- [`README.md`](./README.md) for the cap-table vocabulary and the Core/Extended distinction.
- [`OCF_SOURCE.md`](./OCF_SOURCE.md) for the pinned upstream OCF snapshot.
- [`docs/mapping-validation.md`](./docs/mapping-validation.md) for the validator's exact rules.
- [`docs/polymorphic-transaction-routing.md`](./docs/polymorphic-transaction-routing.md) when one OCF event routes to multiple Carta families.
- [`docs/ocf-core-goal.md`](./docs/ocf-core-goal.md) and [`docs/ocf-core-spec.md`](./docs/ocf-core-spec.md) when a mapping change affects Core membership.

The repository currently targets the Carta bundle under [`target-schema/Carta.schema.json`](./target-schema/Carta.schema.json). Mapping front matter records the target version used when each mapping was written.

## Local setup

The engines are declared in [`package.json`](./package.json): Node.js `>=24.11.0` and npm `>=11.0.0 <12`.

```bash
git switch main
git pull --ff-only
git switch -c my-short-description

npm ci
```

Replace `my-short-description` with a branch name that follows your team's convention. If you are working in a checkout where `main` is already current, the `git pull` is optional. Do not reset or discard existing work in a shared checkout without confirming whose changes they are.

## Where changes belong

The repository has a deliberate source/generated split.

| Change | Edit | Then run |
| --- | --- | --- |
| A field-to-Carta relationship | The relevant `objects/**/*.mapping.md` or `types/**/*.mapping.md` | `npm run mapping:validate`, then the Core checks if applicable |
| A mapping convention or validator rule | `scripts/lib/mapping-parser.ts`, `scripts/lib/mapping-validator.ts`, related report code | Targeted tests, full mapping validation, typecheck, lint, and test suite |
| Decide which OCF entities may graduate into Core, or describe which IDs must resolve | Add the entity to `core/allow-list.yml` / `core-rich/allow-list.yml`, or add the relationship to `core/reference-graph.yml` | `npm run core:build`, `npm run core:check`, `npm run core:validate-sample` |
| Generated Core schema, ledger, gap, upstream, or inventory output | Do not edit directly | Change the input, then `npm run core:build` |
| Upstream OCF version or content | Coordinate a provenance update | Update [`OCF_SOURCE.md`](./OCF_SOURCE.md), the content lock, composed schemas, and affected mappings together |
| Carta target bundle | Coordinate a target-bundle update | Update the bundle, target version references, mappings, reports, and tests together |

`core/allow-list.yml`, `core-rich/allow-list.yml`, and `core/reference-graph.yml` are hand-maintained inputs. Most other files under `core/`, `core-rich/`, and the three generated inventory documents under `docs/` are outputs of the Core pipeline.

There are two different kinds of human-maintained Core metadata here:

- The **allow-list is an approval gate**. The generator examines the mappings and drafts the entities that appear technically admissible. A human must add an entity to the relevant allow-list before that entity can ship as part of Core. `npm run core:check` fails when the generator finds a new admissible entity that has not been approved. Conversely, an entity may be listed in advance and remain absent from the generated package until its mappings become admissible. In other words: the human approves *which entities are allowed*; the generator proves *whether their current mappings are good enough* and produces their schemas.
- The **reference graph is not an approval list**. It tells the generator what an ID field points to so Core sample validation can check referential closure—for example, that a `stock_class_id` resolves to a Core `StockClass`. Add to it when a relationship is missing or changes; do not use it to admit an entity.

## The mapping document contract

Every mapping is a Markdown document with three important parts:

1. YAML front matter describing the OCF source schema and target standard.
2. A source-schema section, normally including the composed source schema for review.
3. Exactly one fenced YAML block under `## Mapping`.

The parser extracts that one mapping block. Extra YAML fences under `## Mapping` are an error, so keep examples in other language fences or outside that section.

A normal object mapping starts like this:

````markdown
---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/StockClass.schema.json
ocf_object_type: STOCK_CLASS
ocf_title: Object - Stock Class
ocf_kind: object
required_fields:
  - name
  - class_type
  - id
  - object_type
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: draft
last_generated: 2026-05-18
---

## Mapping

```yaml
status: draft

fields: {}
```
````

For a reusable OCF type, use `ocf_kind: type` and `ocf_object_type: null`. Type mappings contribute leaves to object mappings; they are not Core entities by themselves.

### Status and coverage

The front matter `status` and the mapping-block `status` must agree:

| Status | Meaning |
| --- | --- |
| `draft` | Exploring the mapping; TODOs are allowed |
| `partial` | Some fields are intentionally mapped, but the document is not complete |
| `complete` | Every source property has a non-TODO entry and every unmappable entry has a reason |
| `reviewed` | Complete and explicitly reviewed; it follows the same no-TODO rules |

### Derived coverage

Do not add a `coverage` key to a mapping. Coverage is calculated automatically from the sibling source schema and the mapping entries, so it cannot drift because someone forgot to update a counter. A valid mapping entry—including an explicit `unmappable` entry—counts as mapped; `TODO`, a missing field, or an invalid entry is shown separately.

Use `npm run mapping:validate -- --verbose` for a per-file view. The preferred review artifact is the generated [`docs/mapping-coverage.md`](./docs/mapping-coverage.md) heatmap:

```bash
npm run mapping:coverage
npm run mapping:coverage:check
```

For example, `10/13` in the heatmap means that the source schema has 13 properties and 10 have valid, decided mapping entries. You do not type or maintain that number; after changing a mapping, regenerate the heatmap and review the fields marked TODO, missing, or invalid.

## Mapping DSL walkthrough

The mapping is a declarative description of where each OCF property lands in the target bundle. It does not execute the conversion. A target is normally an RFC 6901 JSON Pointer into Carta's self-contained bundle, beginning with `#/`, such as `#/$defs/ShareClass/properties/name`.

### 1. Start with the source schema

Open the sibling `.schema.json` before choosing a mapping. Identify:

- every property, including inherited properties such as `id`, `comments`, and `object_type`;
- which properties are required;
- the type of each property and any referenced OCF enum;
- polymorphic constraints such as `anyOf`, `oneOf`, or a discriminator;
- relationships represented by `*_id` or `*_ids` fields.

Then inspect the relevant target `$defs` in [`target-schema/Carta.schema.json`](./target-schema/Carta.schema.json). A similar mapping is often the fastest guide: [`objects/StockClass.mapping.md`](./objects/StockClass.mapping.md), [`objects/Stakeholder.mapping.md`](./objects/Stakeholder.mapping.md), and [`objects/transactions/issuance/StockIssuance.mapping.md`](./objects/transactions/issuance/StockIssuance.mapping.md) cover the most common patterns.

### 2. `rename`: one source property to one target property

Use `rename` when the source value can be copied or represented directly at one target pointer:

```yaml
fields:
  name:
    kind: rename
    target: "#/$defs/ShareClass/properties/name"
```

The name `rename` describes the shape of the relationship, not a promise that the two schemas have identical business semantics. For example, a numeric OCF type may land in a wider Carta decimal type. Document any narrowing or context requirement in a `note:` or the prose below the YAML block.

### `wrap`: a bare scalar into an explicitly declared wrapper member

Use `wrap` when a bare string scalar is written to one explicitly named member of a target object:

```yaml
fields:
  percentage:
    kind: wrap
    target: "#/$defs/VestingPeriod/properties/percentage"
    wrap:
      property: value
      normalization:
        integer_leading_zeros: strip
```

The validator checks the source and target shapes plus the closed `wrap` contract: `property` must name the target's sole string member, and `normalization.integer_leading_zeros` must be `preserve` or `strip`. `preserve` copies text unchanged; `strip` removes redundant integer leading zeroes while preserving sign and numeric value. Core treats a valid `wrap` as deterministic and value-preserving.

### 3. `union-map`: map the alternatives of a source union

Use `union-map` when one source property is a `oneOf`/`anyOf` and its alternatives have different
mapping outcomes. Each case names the exact source `$ref` and carries its own ordinary mapping:

```yaml
fields:
  initial_shares_authorized:
    kind: union-map
    cases:
      - source_schema: ".../enums/AuthorizedShares.schema.json"
        mapping:
          kind: unmappable
          target: null
          reason: no-equivalent
          values:
            NOT APPLICABLE: null
            UNLIMITED: null
      - source_schema: ".../types/Numeric.schema.json"
        mapping:
          kind: rename
          target: "#/$defs/ShareClass/properties/authorizedShareCount"
```

The case list must cover every source union alternative exactly once. This is preferable to a plain
`rename` whenever one legal source alternative has no destination.

### 4. `enum-remap`: map a closed source vocabulary

Use `enum-remap` when the source property is enum-typed and every source enum member has a declared target result:

```yaml
fields:
  class_type:
    kind: enum-remap
    target: "#/$defs/ShareClass/properties/type"
    values:
      COMMON: COMMON
      PREFERRED: PREFERRED
```

The validator checks that:

- the `values` keys exactly match the OCF enum members;
- non-null mapped values are members of the target enum;
- `null` is explicit for a source member with no target.

Do not use `enum-remap` to classify arbitrary free text. A free-text-to-enum guess is a `computed` transformation and is not deterministic across the full OCF domain.

### 5. `split`: one source property to several target leaves

Use `split` when the source fact populates multiple concrete target fields:

```yaml
fields:
  conversion_rights:
    kind: split
    target:
      - "#/$defs/ShareClassRightsAndPreferences/properties/conversionRatio"
      - "#/$defs/ShareClassRightsAndPreferences/properties/conversionPrice"
```

The target must be an array with at least two pointers. Explain how structured source data is reduced into the target leaves. An OCF array that becomes one selected target value is existence-loss; it may be recorded in the mapping, but it should not be treated as strict Core-admissible without a separate, lossless landing rule.

### 6. `combine`: several source properties share one target

Use `combine` when distinct source properties feed one target slot:

```yaml
fields:
  primary_contact:
    kind: combine
    target: "#/$defs/Stakeholder/properties/email"

  contact_info:
    kind: combine
    target: "#/$defs/Stakeholder/properties/email"
```

The YAML should be accompanied by prose explaining the selection rule and the source-side condition. In the example above, the source type determines whether `primary_contact` or `contact_info` is relevant, and Carta accepts one email string. If the rule picks one item from an arbitrary array, call out the existence loss.

### 7. `computed`: a derived or context-dependent value

Use `computed` when the target value is derived rather than copied directly:

```yaml
fields:
  seniority:
    kind: computed
    target: "#/$defs/ShareClass/properties/seniority"
    note: >-
      Sort all issuer stock classes by OCF seniority descending, then assign
      Carta's ascending integer rank.
```

Use `computed` honestly. Examples include cross-record ordering, external file upload IDs, free-text classification, and derivation from structured source data. A mapping can be technically valid while still being unsuitable for strict Core if the computation is heuristic, partial, or existence-losing.

### 8. `unmappable`: no target, with a reason

Use `unmappable` when the source property has no usable Carta destination:

```yaml
fields:
  votes_per_share:
    kind: unmappable
    target: null
    reason: no-equivalent
```

Completed mappings must provide one of the validator's reasons:

| Reason | Use when |
| --- | --- |
| `no-equivalent` | Carta genuinely has no corresponding concept |
| `excluded-from-snapshot` | A related target exists but is outside the pinned target bundle |
| `out-of-scope` | The concept is deliberately outside this mapping effort |
| `ocf-internal` | The property is OCF scaffolding such as `id`, `comments`, or `object_type` |

Do not omit a source property just because it cannot be mapped. The explicit `unmappable` row is what makes loss reviewable and keeps coverage honest.

### 9. `TODO`: only while a mapping is incomplete

Use `TODO` in a `draft` or `partial` mapping when the relationship is not decided:

```yaml
fields:
  some_source_property:
    kind: TODO
    target: TODO
```

The validator rejects TODOs in `complete` and `reviewed` mappings. If investigation shows there is no target, replace the TODO with `unmappable`, `target: null`, and a reason.

## Polymorphic and multi-step mappings

OCF sometimes puts several instrument families behind one transaction schema, while Carta uses a distinct target family for each instrument. The flat `fields:` form cannot express that object-level routing. Use the conventions in [`docs/polymorphic-transaction-routing.md`](./docs/polymorphic-transaction-routing.md).

### Issuance-time routing with `discriminator`

When the source object contains the discriminator, declare it at the top of the mapping block:

```yaml
discriminator:
  field: compensation_type
  exhaustive: true

shared:
  quantity:
    kind: rename
    target:
      Option: "#/$defs/OptionIssuanceTransaction/properties/quantity"
      Rsu: "#/$defs/RsuIssuanceTransaction/properties/quantity"
      Sar: "#/$defs/SarIssuanceTransaction/properties/quantity"

variants:
  Option:
    when: [OPTION, OPTION_NSO, OPTION_ISO]
    primary_targets:
      - "#/$defs/OptionIssuanceTransaction"
      - "#/$defs/OptionGrant"
    fields: {}
  Rsu:
    when: [RSU]
    primary_targets:
      - "#/$defs/RsuIssuanceTransaction"
      - "#/$defs/RestrictedStockUnit"
    fields: {}
  Sar:
    when: [CSAR, SSAR]
    primary_targets:
      - "#/$defs/SarIssuanceTransaction"
    fields: {}

```

The validator checks that:

- `field` is an enum-typed source property;
- variant `when:` sets are disjoint;
- `exhaustive: true` means every source enum value is claimed by a variant;
- each non-null `primary_targets` pointer resolves;
- shared and variant fields together cover the source properties;
- per-variant target maps use exactly the declared variant labels.

If a source enum value is represented by another variant rather than the current one, use `routed_to` on the `enum-remap` entry. This records a verified route instead of silently dropping the value:

```yaml
compensation_type:
  kind: enum-remap
  target: "#/$defs/OptionGrant/properties/stockOptionType"
  values: { OPTION_NSO: NSO, OPTION_ISO: ISO, OPTION: OTHER, RSU: null, CSAR: null, SSAR: null }
  routed_to: { RSU: Rsu, CSAR: Sar, SSAR: Sar }
```

### Downstream routing with `route_by_security`

Downstream records often carry only `security_id`; their instrument family is fixed on the issuance record. Declare the join rather than pretending the downstream record has a local discriminator:

```yaml
route_by_security:
  via: security_id
  resolve: compensation_type
  resolve_enum: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/CompensationType.schema.json"
  source_mapping: ../issuance/EquityCompensationIssuance.mapping.md
  exhaustive: true

variants:
  Option:
    when: [OPTION, OPTION_NSO, OPTION_ISO]
    primary_targets:
      - "#/$defs/OptionExerciseTransaction"
    fields: {}
  Rsu:
    when: [RSU]
    primary_targets: null
    fields: {}
  Sar:
    when: [CSAR, SSAR]
    primary_targets:
      - "#/$defs/SarExerciseTransaction"
    fields: {}
```

`via` is the foreign key on the current record. `resolve` is the discriminator field on the joined issuance. `source_mapping` identifies the mapping that owns the issuance-time routing. The validator can check the declaration's shape and enum coverage, but a runtime converter still has to resolve the actual IDs in an input package.

### Composite folds

Some OCF events have no single Carta transaction. A stock transfer, for example, can fold into an ordered cancel-plus-issue pair. Use `composite:` alongside a discriminator or `route_by_security:` block:

```yaml
composite:
  - step: cancel
    target:
      Default: "#/$defs/CertificateCancellationTransaction"
      Rsa: "#/$defs/RsaCancellationTransaction"
    const:
      Default: { reason: CERTIFICATE_CANCELLATION_REASON_TRANSFERRED }
  - step: issue
    target:
      Default: "#/$defs/CertificateIssuanceTransaction"
      Rsa: "#/$defs/RsaIssuanceTransaction"
    const:
      Default: { issuanceReason: CERTIFICATE_ISSUANCE_REASON_TRANSFERRED }
```

Composite steps are ordered and additive: all steps are emitted. Source fields can use step-keyed target maps, and a step-keyed map may contain per-family targets. A `const:` is appropriate for a fixed target enum value supplied by the fold rather than by an OCF field. Explain why each constant is semantically justified.

## Choosing and documenting a target

Before committing a pointer:

1. Find the target `$def` and property in [`target-schema/Carta.schema.json`](./target-schema/Carta.schema.json).
2. Confirm the pointer resolves to an actual node, not the bundle's literal `true` sentinel for an excluded object.
3. Compare source and target shapes: scalar versus object, scalar versus array, enum domains, nullable branches, and nested properties.
4. Decide whether the relationship is a direct rename, an explicit enum remap, a split, a combine, or a computed transformation.
5. Record semantic narrowing in the mapping notes, even if the validator accepts the pointer.

Useful distinctions:

- **Value coarsening** changes a value's precision or category but keeps the datum. It may be acceptable to strict Core.
- **Existence loss** drops an element, entity, or relationship. Array-to-scalar selection and structure-to-scalar collapse are typical examples; they are out of strict Core unless the same fact lands losslessly elsewhere.
- **No destination** means the target bundle has no place for the concept at all. Use `unmappable` with `reason: no-equivalent` or `excluded-from-snapshot` as appropriate.
- **Heuristic** means the result depends on a guess, such as classifying arbitrary prose into an enum. It is not a deterministic strict-Core mapping.

The mapping's prose is part of the review surface. Explain why the target is semantically comparable, what context the transformation needs, and what information is lost.

## Core derivation and generated output

OCF Core is derived from the mapping corpus; it is not declared by adding Core-only annotations to every mapping.

- [`core/`](./core/) is strict Core.
- [`core-rich/`](./core-rich/) is rich Core, which keeps lossy-home fields for analysis.
- `allow-list.yml` in each profile is the curated entity ratification input.
- [`core/reference-graph.yml`](./core/reference-graph.yml) supplies referential-closure metadata for `*_id` relationships.
- `core-ledger.md`, `core-gaps.md`, `core-upstream.md`, and the three `docs/core-*-inventory.md` documents are generated reports.

If a mapping change causes a new entity to become admissible, `npm run core:check` will identify an entity missing from the profile's allow-list. Review the mapping and the proposed entity first; then add it to the appropriate allow-list only if it belongs in that profile. That edit is the human graduation decision. Do not make the generated schema less accurate to avoid the gate.

If you add or rename a foreign-key field, inspect [`core/reference-graph.yml`](./core/reference-graph.yml) and update the graph when the relationship needs closure checking. The graph describes relationships, not field shapes; the generator owns field shape.

After changing a mapping or Core input:

```bash
npm run core:build
npm run core:check
npm run core:validate-sample
```

Review the generated diff. A large generated diff is not automatically wrong, but it should be explainable from the mapping or Core input change.

## Validation and tests

Run the narrowest useful check first:

```bash
# Validate one mapping file.
npm run mapping:validate -- --filter 'objects/StockClass.mapping.md' --verbose

# Validate all mapping documents.
npm run mapping:validate

# Check the pinned schema content and TypeScript.
npm run provenance:check
npm run typecheck
npm run lint

# Run the full test suite.
npm test
```

The mapping validator checks front matter, source-property coverage, mapping kinds, target JSON Pointers, enum values, polymorphic routing, composite steps, and unmappable reasons. `--verbose` prints the resolved mapping tree and is useful for reviewing a change.

For a new mapping, a useful sequence is:

```bash
npm run mapping:skeleton -- --filter 'objects/path/to/NewObject.schema.json' --dry-run
npm run mapping:skeleton -- --filter 'objects/path/to/NewObject.schema.json' --verbose
npm run mapping:validate -- --filter 'objects/path/to/NewObject.mapping.md' --verbose
```

The skeleton command skips existing mappings unless `--force` is explicitly supplied. Use `--dry-run` before generating or overwriting files. Treat `--force` as an intentional rewrite of the mapping document, not as a routine formatting command.

When a change affects Core, add:

```bash
npm run core:build
npm run core:check
npm run core:validate-sample
```

The Core sample validator checks both profiles, negative cases, and referential closure. The Core check also catches stale generated schemas and reports.

## Review principles

Good mapping reviews answer these questions:

- Is the source property actually present in the sibling OCF schema, including inherited properties?
- Does the target pointer resolve in the pinned Carta bundle?
- Does the mapping preserve the fact, or does it narrow or drop it?
- Is the transformation total over the entire declared OCF domain?
- Does a polymorphic event route using its real discriminator or an explicit foreign-key join?
- Does an event's effect land in Carta even if Carta represents it as state or as a composite of transactions?
- Are all source enum values handled, including values routed to another variant?
- Is every unmappable field explicit and explained?
- If Core membership changes, are the generated schemas and reports updated and the allow-list decision justified?
- Are the notes clear enough that a runtime converter author can implement the intended behavior without guessing?

Prefer a precise `unmappable` decision over a speculative `computed` target. A documented gap is actionable; an undocumented heuristic is difficult to test and can make Core appear safer than it is.

## Pull request checklist

Before opening a PR, confirm:

- [ ] The branch started from current `main`.
- [ ] The relevant mapping document and sibling source schema are in the same change when both need updating.
- [ ] The mapping front matter and YAML-block status agree.
- [ ] Every source property is present; completed mappings contain no TODOs.
- [ ] Every `unmappable` entry has a reason.
- [ ] Every target pointer resolves in the pinned target bundle.
- [ ] Enum remaps cover the complete source enum and use `null` deliberately.
- [ ] Polymorphic routing is exhaustive and variant target maps have matching keys.
- [ ] Mapping notes explain narrowing, context, selection, or external dependencies.
- [ ] `npm run mapping:validate` passes.
- [ ] `npm run typecheck`, `npm run lint`, and `npm test` pass, or any unrelated baseline failure is called out.
- [ ] If Core inputs changed, `npm run core:build`, `npm run core:check`, and `npm run core:validate-sample` pass.
- [ ] Generated output was regenerated rather than hand-edited.

## Common mistakes

### Mapping only the obvious fields

The validator intentionally requires the full source property set. Include OCF bookkeeping fields and explain why they are unmappable. This is how the repository distinguishes “not considered” from “considered and has no target.”

### Treating a matching field name as a semantic match

`name`, `date`, `quantity`, and `type` are not enough evidence. Compare the source and target descriptions and shapes. A structured OCF `Name` is not automatically equivalent to a scalar Carta `fullName`.

### Using `enum-remap` for free text

`enum-remap` is closed-world and value-by-value. Free-text classification belongs in a documented `computed` relationship and is not a deterministic strict-Core membership.

### Hiding array collapse in a `rename`

If the source has an array and the target has one scalar slot, document which information is lost. Do not describe the relationship as lossless just because the target pointer resolves.

### Treating downstream transactions as self-describing

An event with only `security_id` usually needs a join to its issuance record before its Carta family is known. Use `route_by_security:` and explain the two-pass runtime requirement.

### Editing generated files directly

Generated files will be replaced by `npm run core:build` and rejected by `npm run core:check` if they drift. Change the mapping, allow-list, reference graph, or generator input that should produce the desired output.

## Questions and larger changes

For a new target standard, a new routing construct, an upstream OCF version change, or a change to the Core membership rules, start with a design note under `docs/` and link it from the affected mapping or script. These changes affect more than one mapping and should make their invariants and evidence boundary explicit before implementation.
