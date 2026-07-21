# OCF Core, OCF Extended, and the Carta fold

This document defines the boundary between the repository's generated Core dialect and the
translation steps that produce a fully valid OCF document or Carta snapshot.

## Terms

### Core

**Core** is an OCF-shaped projection. It uses OCF objects, field names, types, and events, but its
generated schemas intentionally relax OCF requiredness and omit fields that the Core membership rules
classify as unavailable, lossy, or irrelevant to the Carta-bound projection.

There are two generated profiles:

- **Strict Core** (`core/`) contains fields that the mapping corpus classifies as statically
  lossless and deterministically admissible for the Carta fold.
- **Rich Core** (`core-rich/`) additionally retains selected lossy-home fields. It is an analysis and
  interoperability profile, not a stronger validity guarantee.

A document that validates against a Core package is **Core-valid**. It is not necessarily directly
valid against the original OCF schemas.

### OCF Extended

**OCF Extended** is the result of enriching a Core document with the source or contextual data needed
to satisfy the original OCF schemas. It is not a new schema and does not add vendor-specific fields:
it is a fully OCF-valid document produced by an explicit enrichment operation.

```text
enrich(Core document, enrichment context) → OCF Extended | explicit failure
```

Enrichment may need to supply OCF-required fields that Core intentionally omits, including document
metadata, file collections, or fields with no Carta home such as `StockClass.votes_per_share`. It
must not invent values or silently discard a required field. If the enrichment context is
insufficient, enrichment fails and identifies the missing data.

### Carta fold

The **Carta fold** is the deterministic Core-to-Carta operation that consumes an ordered Core
document and produces a valid Carta snapshot. It may map an event directly, apply a state change, or
emit multiple Carta-side records. For example, a `StockTransfer` can fold into a cancellation plus a
new issuance because Carta does not retain the same event shape.

The fold is not a Carta-to-Core conversion and is not merely a field-by-field schema comparison.
Core-classified facts must have an explicit landing rule; the fold may not silently discard them.

## Evidence levels

Core membership currently has a **schema-derived** evidence level. The repository checks source and
target schemas, mapping cardinality, enum coverage, referential closure, and non-degeneracy. Those
checks establish static admissibility; they do not execute a live Carta importer.

Runtime claims require a separate **importer-confirmed** or **runtime-verified** conformance suite
owned by the fold implementation. Such a suite must pin the importer revision and cover every strict
entity, every polymorphic variant, composite `StockTransfer`, reference resolution, unit handling,
and negative cases such as missing joins or unknown security types.

Until that suite exists, documentation must describe Core as **schema-derived and statically
admissible for the Carta fold**, not as runtime-proven against Carta's importer.

## Contract summary

| Operation | Input | Output | Current repository status |
| --- | --- | --- | --- |
| Core validation | Core document | Core-valid document or schema errors | Implemented and drift-gated |
| Carta fold | Ordered Core document + fold context | Carta snapshot or explicit fold error | Owned outside this repository; schema-derived only here |
| OCF enrichment | Core document + enrichment context | OCF Extended or explicit enrichment error | Contract defined here; implementation owner must be pinned |

The generated Core schemas, mapping ledger, and reports remain the source of static membership truth.
The fold and enrichment implementations must not be inferred from those artifacts without their own
conformance evidence.
