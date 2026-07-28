# OCF Composed Schemas

This repository is the working analysis and mapping corpus for a proposed “Carta Core”: expressing Carta’s proposed cap-table standard in OCF’s vocabulary so the community can understand interoperability with OCF v1.

At a high level, the project examines whether Carta’s standard can become an OCF standard, what migration would require, and what the standards may still need.

## What this repository answers

The mappings are used to:

- measure migration lift between Carta’s proposed standard and OCF v1;
- show OCF v1 fields that map cleanly, map narrowly, or have no Carta destination;
- show Carta concepts with no OCF source; and
- identify possible extensions: OCF features missing from Carta Core, and concepts missing from both models.

This is analysis and mapping infrastructure, not a runtime converter or a promise of lossless round-tripping.

## A useful naming distinction

- **Carta Core** is the Carta-side standard under analysis.
- **OCF Core** is the generated, OCF-shaped projection in this repository: a strict profile designed to fold down to the Carta target.
- **OCF Extended** is the richer analysis profile, retaining upstream OCF context that may not fit the strict target.

The distinction matters because Carta Core and OCF Core are related, but they are not the same artifact. See the [OCF Core goal](./docs/ocf-core-goal.md) for the design rationale.

## Start with the results

- [Mapping Explorer](./docs/generated/mapping-explorer/index.html) — the canonical source/target maps, target coverage, and open mapping questions. The `main` workflow publishes this explorer to GitHub Pages.
- [OCF-side loss inventory](./docs/core-lossy-inventory.md) — OCF fields that have a Carta home, but only through a narrowed or lossy mapping.
- [OCF-side unmapped inventory](./docs/core-unmapped-inventory.md) — OCF fields with no Carta destination.
- [Core gap reports](./core/core-gaps.md), [rich Core gaps](./core-rich/core-gaps.md), and [rich upstream candidates](./core-rich/core-upstream.md) — generated views of the strict and rich profiles.
- [Mapping validation and DSL guide](./docs/mapping-validation.md) — mapping grammar, operators, inverse semantics, and review rules.
- [Contributor guide](./CONTRIBUTING.md) — how to add or refine mappings and run the checks.
- [Pinned source and provenance](./OCF_SOURCE.md) — the OCF snapshot and target assumptions used by the repository.

## How the maps work

Authored mappings live primarily under [`objects/`](./objects/) and [`types/`](./types/). Each mapping describes the relationship between an OCF source field and a Carta target field using the repository’s small Markdown/YAML DSL. The DSL makes mappings reviewable in pull requests and versionable alongside the schemas.

The target schema is pinned under [`target-schema/`](./target-schema/). Generated reports and the Mapping Explorer are derived from that schema plus the authored mappings; they should not be edited by hand.

## Regenerate and check the outputs

After changing mappings or schemas:

```bash
npm ci
npm run mapping:validate
npm run mapping:coverage:check
npm run core:build
npm run mapping:artifacts
npm run core:check
npm run mapping:artifacts:check
npm test
```

The main generation commands are:

- `npm run core:build` — regenerate the OCF Core and OCF Extended projections and their inventories.
- `npm run mapping:artifacts` — regenerate the Mapping Explorer and its supporting report.
- `npm run mapping:validate` — validate the authored mapping DSL.

The `*:check` commands detect generated-output drift. See [`package.json`](./package.json) for the complete command list.

## Repository map

- [`objects/`](./objects/) and [`types/`](./types/) — OCF schemas and authored mappings.
- [`target-schema/`](./target-schema/) — pinned Carta target schema.
- [`core/`](./core/) and [`core-rich/`](./core-rich/) — generated OCF projections and reports.
- [`docs/generated/mapping-explorer/`](./docs/generated/mapping-explorer/) — checked-in Pages artifact.
- [`scripts/`](./scripts/) and [`tests/`](./tests/) — generators, validators, and regression tests.

The repository tracks a particular OCF and Carta schema snapshot. Read [OCF_SOURCE.md](./OCF_SOURCE.md) and the [contributor guide](./CONTRIBUTING.md) before interpreting results or changing the corpus.
