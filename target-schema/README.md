# Target schema

This directory holds a pinned snapshot of the schema that the `.mapping.md` files in this repo
translate OCF into. Keeping our own copy ensures every mapping is meaningful with respect to a known
version of the target — upstream refreshes become a deliberate event (replace the snapshot,
re-review affected mappings) rather than silent misalignment.

- **Standard:** Carta Cap Table Data Schema
- **Version:** v1alpha1 (2026-06-22)
- **Source:** Google Drive
- **Last copied:** 2026-07-28
- **Content lock:** [`../provenance.lock.json`](../provenance.lock.json) — SHA-256 `b8d54974eea8957f67ebe600097b31024a691e50d949a8a6db6227dd7a2aa06c`

## How to refresh

1. Download the latest version from the Google Drive.
2. Replace `Carta.schema.json` in this directory.
3. Update `provenance.lock.json` with the new SHA-256 and run `npm run provenance:check`.
4. Sanity-check the file parses: `jq . target-schema/Carta.schema.json > /dev/null` (should exit
   silently).
5. Update the **Version** and **Last copied** lines above.
6. Open a tracking issue to re-review the `.mapping.md` files whose target paths land in changed
   parts of the schema.

## Notes

This bundle is a partial snapshot. Per the schema's own description, it excludes:

- API plumbing (response wrappers, request bodies, error envelopes, pagination)
- Capitalization summaries (derived views over the facts)
- Carta product features that are out of scope (Compensation Benchmarks/CTC, Draft Securities, 409A
  FMV)
- Document attachments

References from included schemas into excluded ones are rewritten to `true` (= "accepts any value").
When a mapping's target resolves to `true`, treat it as `unmappable` for now and note in the field's
`notes:` that the real target lives outside the bundle. The current bundle contains no such nodes —
the June 22 refresh dropped the excluded definitions outright rather than stubbing their references —
so a field that lost its target to that refresh takes `reason: target-definition-removed`, not
`excluded-from-snapshot`.

For a narrative walkthrough of the bundle's objects, enums, and worked examples, see
[`Explainer.md`](./Explainer.md).
