# OCF Composed Schemas

This repository is a working set of composed [Open Cap Format (OCF)](https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF) schemas, field mappings, and generated OCF Core profiles.

It is aimed at a practical interoperability question:

> Which parts of an OCF cap table can be represented by Carta, and how can we describe that boundary in OCF's own vocabulary?

If you understand cap tables but are new to OCF or this repository, start with [Basic concepts](#basic-concepts), then read [OCF Core and OCF Extended](#ocf-core-and-ocf-extended). Contributors should continue to [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## What is in this repository?

The repository has four closely related layers:

1. **Composed OCF schemas** — the OCF v1 schemas copied into a locally indexed shape under `enums/`, `files/`, `objects/`, `primitives/`, and `types/`.
2. **Mapping documents** — Markdown files beside the source schemas under `objects/` and `types/`. Each mapping describes how OCF fields relate to the pinned Carta target schema.
3. **OCF Core profiles** — generated, constrained OCF-shaped schemas under `core/` and `core-rich/`.
4. **Reports and tooling** — TypeScript scripts, tests, and generated reports that check mapping coverage, Core membership, loss, provenance, and drift.

The upstream schema snapshot and its exact provenance are recorded in [`OCF_SOURCE.md`](./OCF_SOURCE.md). Do not infer the source version from a schema `$id`: the upstream `$id`s point at `main`.

## Basic concepts

OCF models a company capitalization as a package of JSON documents. The names are easier to understand if you map them to familiar cap-table concepts:

| OCF concept | Cap-table meaning | Where it appears here |
| --- | --- | --- |
| **Issuer** | The company that owns the cap table | An `Issuer` object in the manifest |
| **Stakeholder** | A holder, employee, investor, institution, or other participant | `StakeholdersFile` containing `Stakeholder` objects |
| **StockClass** | A class of equity such as Common or Series A Preferred | `StockClassesFile` containing `StockClass` objects |
| **StockPlan** | An equity incentive plan and its reserved pool | `StockPlansFile` containing `StockPlan` objects |
| **Valuation** | A dated price-per-share or valuation record | `ValuationsFile` containing `Valuation` objects |
| **Security** | A particular grant, certificate, note, warrant, or other instrument | Usually created by an issuance transaction's `security_id`; the security may be represented implicitly by the event stream |
| **Transaction** | An event that changes or explains cap-table state | `TransactionsFile`, for example `StockIssuance`, `StockTransfer`, or `EquityCompensationExercise` |
| **VestingTerms** | A reusable vesting schedule or statements-based vesting description | `VestingTermsFile` |
| **Document** | A file or evidence document associated with a record | `DocumentsFile` |
| **Manifest** | The package index: issuer, file categories, file paths, and checksums | `OCFManifestFile` or the generated `OCFCoreManifestFile` |

### Schemas, instances, files, and IDs

- A **schema** describes the allowed shape of one OCF object or file. For example, [`objects/StockClass.schema.json`](./objects/StockClass.schema.json) describes one stock class.
- An **instance** is the JSON data that validates against a schema. Examples are under [`core/sample/`](./core/sample/).
- An OCF **file** is a typed envelope containing an `items` array of objects, such as `StockClassesFile` or `TransactionsFile`.
- A **manifest** points to those files. Each file reference includes a `filepath` and an `md5` checksum so a consumer can verify the package contents.
- OCF uses string IDs to connect the graph. Common references include `stakeholder_id`, `stock_class_id`, `stock_plan_id`, `security_id`, `vesting_terms_id`, and `resulting_security_ids`.

The important modeling choice is that OCF is **event-driven**. A cap table is not only a latest-state table: issuances, transfers, cancellations, conversions, exercises, and other events are first-class records. A target system may fold several events into one current-state record, but that is a conversion concern; the OCF event remains the source fact.

## OCF Core and OCF Extended

This repository uses **OCF Core** and **OCF Extended** to describe two layers of the same OCF-shaped data. They are not two unrelated vendor formats.

### OCF Extended

In this repository, **OCF Extended** means a full OCF-valid document or package using the upstream OCF object model and requiredness. It may contain information that Carta cannot store, such as a detailed structured address, approval dates, extra vesting detail, or an OCF event for which Carta has no equivalent.

“Extended” is a useful repository term for the full side of the boundary; it is not a claim that upstream OCF publishes a separate schema family with that name.

### OCF Core

**OCF Core** is a constrained, OCF-shaped projection whose strict profile is intended to be safe to fold into a Carta snapshot:

```text
full OCF / “OCF Extended”
          │ project: omit detail that cannot fold
          ▼
OCF Core (strict) ───────────────► Carta snapshot
          ▲                          │
          └── enrich with context ───┘
```

Core keeps OCF's objects, field names, types, and transaction model. It does not introduce Carta objects into the source document. A Core document can omit fields that full OCF requires; an enrichment process supplies the missing source or contextual data before producing a full OCF-valid document.

The strict profile in [`core/`](./core/) applies these principles:

- A field or event must have a clear, deterministic, **total** destination in Carta, either directly or through a deterministic state derivation.
- Value coarsening can be acceptable. For example, an enum may be bucketed or a numeric representation widened, as long as the datum still lands.
- Existence loss is not acceptable for strict membership: an array must not silently become one selected scalar, and a relationship must not disappear.
- Core stays referentially closed. IDs used by Core records must resolve to Core records or to a security created by a Core issuance.
- Core remains OCF-shaped. Carta-only concepts belong in the fold implementation or in a gap report, not in Core.

The strict profile is a **one-way interoperability guarantee**: Core must fold to Carta. It is not a promise that Carta can be round-tripped back into the same Core document.

### Strict Core versus rich Core

The generated [`core-rich/`](./core-rich/) profile is a discussion and analysis profile. It is a superset of strict Core that also keeps fields that have a Carta home but narrow on the way down. For example, OCF may carry a structured array of addresses while Carta stores only one country.

Use the profiles this way:

| Profile | Directory | Contract |
| --- | --- | --- |
| **Strict Core** | [`core/`](./core/) | The admissible intersection used for the fold guarantee; no existence-loss is allowed |
| **Rich Core** | [`core-rich/`](./core-rich/) | An OCF-shaped interop hub and analysis surface; value or existence narrowing may remain |
| **OCF Extended** | Upstream/composed OCF schemas | Full OCF validity and full OCF detail |

The generated [`core-rich/core-upstream.md`](./core-rich/core-upstream.md) report is especially useful when deciding whether an upstream OCF constraint should be relaxed or whether a new OCF concept needs discussion.

The canonical design and derivation details are [`docs/ocf-core-goal.md`](./docs/ocf-core-goal.md) and [`docs/ocf-core-spec.md`](./docs/ocf-core-spec.md). The files under `core/` and `core-rich/` are generated; do not hand-edit their schemas or generated reports.

## If you implement OCF v1: where to find the proposed losses

If your product implements OCF v1 and you want to understand what a Carta fold-down would lose, use the generated reports rather than guessing from the schemas:

1. [`docs/core-lossy-inventory.md`](./docs/core-lossy-inventory.md) lists OCF properties that **do have a Carta home but narrow on the way down**. Examples include structured-to-scalar, array-to-scalar, enum bucketing, and fields that land on a different Carta object.
2. [`docs/core-unmapped-inventory.md`](./docs/core-unmapped-inventory.md) lists OCF properties with **no Carta home at all**. These are the fields a fold cannot represent in the pinned target bundle.
3. [`core-rich/core-upstream.md`](./core-rich/core-upstream.md) turns lossy-home fields into **proposed upstream-OCF change candidates**. OCF-required fields are highlighted because they are the strongest signal that a Core-compatible or relaxed representation may be needed.
4. [`core/core-gaps.md`](./core/core-gaps.md) and [`core-rich/core-gaps.md`](./core-rich/core-gaps.md) group the losses by OCF object and separately call out Carta concepts for which OCF has no source concept.
5. [`docs/generated/mapping-inverse-report.md`](./docs/generated/mapping-inverse-report.md) and the [mapping-flow gallery](./docs/generated/mapping-flows/README.md) are the canonical Carta-side inverse coverage report and visuals. They are target-first evidence, not a Carta-to-OCF round-trip guarantee; field-level inverse semantics are documented in [`docs/mapping-validation.md`](./docs/mapping-validation.md#inverse-semantics).

These are proposed **fold-down differences and change candidates**, not instructions for an OCF v1 implementation to silently discard data. A full OCF consumer can continue to use the composed OCF schemas; the reports show what needs an explicit policy when that data is sent to Carta.

These reports are generated from the mapping corpus, the composed OCF registry, and the pinned Carta bundle. Refresh them with:

```bash
npm run core:lossy
npm run core:unmapped
npm run mapping:artifacts
```

`npm run mapping:artifacts:check` verifies that the checked-in inverse report, SVG gallery,
interactive viewer, and generated mapping explorer match the same renderer used by CI. The Core loss inventories remain
separate because they answer the OCF-side questions that the target-first inverse ledger does
not model.

The generated explorer lives at [`docs/generated/mapping-explorer/`](./docs/generated/mapping-explorer/)
for local browsing. It includes one page for every canonical green OCF object and Carta
object-like definition, keeps no-target/no-source gaps visible, embeds the available SVGs,
links the interactive HTML viewer, and places a prefilled GitHub issue button on each mapping
page. The overview also links to the tracked Carta OCF Core proposal in `target-schema/`, shows
its current provenance metadata, discovers optional Markdown reports from that directory, and
provides a schema-level issue button. Legacy `PlanSecurity*` compatibility wrappers are intentionally omitted because their
economic mapping is inherited from the corresponding `EquityCompensation*` object.
The `Mapping Explorer` workflow regenerates it for every pull request (as a downloadable
preview artifact) and publishes the `main` version to GitHub Pages.

Normally, use `npm run core:build` to regenerate the complete Core package and the two OCF-side
loss inventories together. Use `npm run mapping:artifacts` for the canonical Carta-side inverse
report and visuals; `npm run core:check` and `npm run mapping:artifacts:check` detect stale generated output.

The current schema provenance and target assumptions are always the source of truth: see [`OCF_SOURCE.md`](./OCF_SOURCE.md), the mapping front matter, and [`target-schema/Carta.schema.json`](./target-schema/Carta.schema.json).

For a corpus-wide view of mapping progress, see the generated [`docs/mapping-coverage.md`](./docs/mapping-coverage.md) heatmap. It is derived from the source schemas and mapping entries; contributors do not maintain coverage counters in individual mapping files.

## Repository map

| Path | Purpose |
| --- | --- |
| [`enums/`](./enums/) | Composed OCF enum schemas |
| [`types/`](./types/) | Reusable OCF scalar and structured types, plus their mapping documents |
| [`primitives/`](./primitives/) | OCF base object, file, and transaction shapes |
| [`objects/`](./objects/) | OCF objects and transactions, plus one mapping document per source schema |
| [`files/`](./files/) | Composed OCF file-envelope schemas |
| [`target-schema/`](./target-schema/) | Pinned Carta target bundle used to resolve mapping pointers |
| [`core/`](./core/) | Generated strict Core package, ledger, gaps, and sample |
| [`core-rich/`](./core-rich/) | Generated rich Core package, upstream candidates, gaps, and sample |
| [`docs/`](./docs/) | Design notes, mapping rules, routing conventions, and generated inventories |
| [`docs/mapping-coverage.md`](./docs/mapping-coverage.md) | Generated field-level mapping coverage heatmap |
| [`scripts/`](./scripts/) | Mapping validators, Core derivation, report generation, and provenance checks |
| [`tests/`](./tests/) | Unit, integration, CLI, mapping, and Core pipeline tests |
| [`OCF_SOURCE.md`](./OCF_SOURCE.md) | Upstream schema version, pin, and content lock |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | End-to-end contributor guide and mapping DSL walkthrough |

## Quick start

The repository expects Node.js `>=24.11.0` and npm `>=11.0.0 <12`.

```bash
npm ci
npm run mapping:validate
npm run mapping:coverage:check
npm run typecheck
npm test
```

For Core work, the useful commands are:

```bash
npm run core:build
npm run core:check
npm run core:validate-sample
```

For the full contribution workflow, including how to add or refine a mapping, see [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Scope and status

The Carta target in this repository is pinned and versioned independently from upstream OCF. A mapping can therefore be correct for this repository's current target bundle while requiring review when either upstream OCF or Carta changes.

Think of this repository as the vocabulary and rulebook for a converter, not the converter itself. It provides the OCF schemas, the pinned Carta schema, and mapping files that say where each OCF field should go—or why it cannot go anywhere. It also generates the Core schemas and loss reports from those mappings. Separate application code must read an OCF package, apply those rules to produce Carta data, or add the missing context needed to produce full OCF again.
