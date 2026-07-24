---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/InterestRate.schema.json
ocf_object_type: null
ocf_title: Type - Interest Rate
ocf_kind: type
required_fields:
  - rate
  - accrual_start_date
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Type - Interest Rate → Carta

> Type representation of an interest rate, including accrual start and end dates

## OCF schema

Source: [`InterestRate.schema.json`](./InterestRate.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/InterestRate.schema.json",
  "title": "Type - Interest Rate",
  "description": "Type representation of an interest rate, including accrual start and end dates",
  "type": "object",
  "properties": {
    "rate": {
      "description": "Interest rate for the convertible (decimal representation - e.g. 0.125 for 12.5%)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Percentage.schema.json"
    },
    "accrual_start_date": {
      "description": "Commencement date for interest accruing at the specified rate",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "accrual_end_date": {
      "description": "Optional end date (inclusive) for interest accruing at the specified rate. If none specified, interest will accrue indefinitely or until accrual of next interest rate commences",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "rate",
    "accrual_start_date"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/InterestRate.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  rate:
    kind: rename
    target: "#/$defs/ConvertibleNote/properties/interestRate"
  accrual_start_date:
    kind: unmappable
    target: null
    reason: no-equivalent
  accrual_end_date:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FInterestRate.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FInterestRate.mapping.md&title=%5BMapping+question%5D+InterestRate) |
| `rate` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FInterestRate.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FInterestRate.mapping.md&title=%5BMapping+question%5D+InterestRate%3A+rate&property_path=rate) |
| `accrual_start_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FInterestRate.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FInterestRate.mapping.md&title=%5BMapping+question%5D+InterestRate%3A+accrual_start_date&property_path=accrual_start_date) |
| `accrual_end_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FInterestRate.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FInterestRate.mapping.md&title=%5BMapping+question%5D+InterestRate%3A+accrual_end_date&property_path=accrual_end_date) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Bucket (1) — type-to-type with a single clear home.** OCF's `InterestRate` is a structured type, but it has one unambiguous Carta destination: the convertible-note interest terms inlined on `#/$defs/ConvertibleNote` (and mirrored on `#/$defs/ConvertibleIssuanceTransaction`). The only OCF object that `$ref`s this type is `types/conversion_mechanisms/NoteConversionMechanism.schema.json`, whose `interest_rates` array carries `InterestRate` entries describing the rate(s) of a convertible note. At the object level a `NoteConversionMechanism` routes to `ConvertibleNote` / `ConvertibleIssuanceTransaction`, so the rate value lands on those objects' `interestRate` field. We therefore map the field that has a home and mark only the genuinely-absent ones unmappable, rather than treating the whole type as unmappable.
- `rate` → `#/$defs/ConvertibleNote/properties/interestRate` (Carta `Decimal`). This is a `rename` (Carta inlines the rate as a bare scalar; OCF wraps it in an `InterestRate` object). Representation matches with **no transform**: OCF's `Percentage` is itself a fixed-point *string* holding a decimal fraction between `0.0` and `1.0` (e.g. `0.125` for 12.5%), and Carta's `Decimal` is likewise a string-form decimal, so the identical `0.125` string transfers — no scaling, no percent-vs-fraction conversion, and no numeric serialization (both sides are already strings). `ConvertibleIssuanceTransaction.interestRate` (also `Decimal`) is the equivalent field on the issuance transaction and is an acceptable alternate target for the same value; `ConvertibleNote` is chosen as the canonical home because it is the persistent note object.
- `accrual_start_date` → **unmappable / no-equivalent.** Carta models a note's interest as a single flat scalar (`interestRate`) plus a frequency enum (`interestAccrualPeriod`) and compounding enum (`interestCompoundingPeriod`); it does **not** record a per-rate accrual *commencement date*. A scan of the entire Carta bundle for any accrual/interest start-date field returns only the accrual-*period* frequency enums and `Interest.accruedValue` (a Money amount) — no calendar date for when a rate begins accruing. `ConvertibleNote` exposes `issueDatetime` and `maturityDatetime`, but neither is the rate's accrual-start date, so reusing them would be incorrect.
- `accrual_end_date` → **unmappable / no-equivalent.** Same gap: there is no field on `ConvertibleNote` / `ConvertibleIssuanceTransaction` (or anywhere in the bundle) for the inclusive end date of a given rate's accrual window.
- **Lossy: OCF's multi-rate, time-segmented schedule collapses to one rate in Carta.** OCF `NoteConversionMechanism.interest_rates` is an *array* of `InterestRate` objects, each with its own `rate` and accrual `start`/`end` dates — i.e. a step schedule where the applicable rate changes over time. Carta's `ConvertibleNote.interestRate` is a single scalar with no window dates, so only one rate survives and the schedule's time boundaries are dropped. When OCF supplies more than one entry, the importer must choose a representative rate (e.g. the first/current segment); this choice and the loss of the accrual windows should be flagged at ingestion. The accrual-start/end dates are the per-segment scheduling that Carta does not model — hence both are unmappable rather than re-pointed at unrelated note datetimes.
