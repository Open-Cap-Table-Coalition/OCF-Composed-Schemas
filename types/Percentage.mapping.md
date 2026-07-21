---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Percentage.schema.json
ocf_object_type: null
ocf_title: Type - Percentage
ocf_kind: type
required_fields: []
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Percentage → Carta

> Fixed-point string representation of a percentage as a decimal between 0.0 and 1.0 (up to 10 decimal places supported)

## OCF schema

Source: [`Percentage.schema.json`](./Percentage.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Percentage.schema.json",
  "title": "Type - Percentage",
  "description": "Fixed-point string representation of a percentage as a decimal between 0.0 and 1.0 (up to 10 decimal places supported)",
  "type": "string",
  "pattern": "^0?(\\.[0-9]{1,10})?$|^1(\\.0{1,10})?$",
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/Percentage.schema.json",
  "properties": {},
  "required": []
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 0/0

fields: {}
```

## Notes / open questions

- **Zero-property scalar leaf type (no fields to map).** `Percentage` is a bare `string` constrained by a `pattern` (a fixed-point decimal in `[0.0, 1.0]`, e.g. `0.125` for 12.5%); its `properties` object is empty. Like `types/Md5.mapping.md`, there are no member fields, so `fields: {}` and `coverage: 0/0`. The type-level correspondence is documented here.
- **Bucket 2 — inlined-per-object: Carta has no reusable `Percentage` (or `Rate`/`Ratio`) `$def`.** Carta does not model "percentage" as its own reusable type or structure. The concept *is* present in Carta, but only as bare scalar fields scattered across unrelated objects (e.g. `ConvertibleNote.interestRate`, `VestingPeriod.cliffPercentage`, `PerformanceCondition.payoutPercentage`), each of which `$ref`s the generic `#/$defs/Decimal` value-type (`{ "value": "<string decimal>" }`). `Decimal` is a generic number wrapper shared by monetary, count, and percentage fields alike — not a semantic percentage type — and there is no single unifying Carta `$def` for the concept. Per the 3-bucket policy this is therefore inlined-per-object: there is no well-posed type-level target, so this scalar leaf maps nothing directly and the value is always carried by the owning object's mapping. (Contrast `types/Monetary.mapping.md`, where a genuine reusable Carta `Money` `$def` exists, making that type a bucket-1 type-to-type rename.) Because `Percentage` is itself a zero-property scalar leaf, there are no member fields to individually mark `unmappable`; the type-level conclusion is documented here, exactly as for `types/Md5.mapping.md`.
- **Where the percentage concept actually lands in Carta (resolved at the object / object-field level, not here):**
  - `#/$defs/ConvertibleNote/properties/interestRate` and `#/$defs/ConvertibleIssuanceTransaction/properties/interestRate` — convertible interest rates.
  - `#/$defs/ConvertibleNote/properties/discountPercentage` and `#/$defs/ConvertibleIssuanceTransaction/properties/discountPercentage` — conversion discounts.
  - `#/$defs/ConvertibleNote/properties/changeInControlPercent` — change-in-control multiple/percentage.
  - `#/$defs/ShareClassRightsAndPreferences/properties/conversionRatio` — preferred-to-common conversion ratio.
  - `#/$defs/PerformanceCondition/properties/payoutPercentage`, `.../minPayoutPercentage`, `.../maxPayoutPercentage` — performance-vesting payout percentages.
  - `#/$defs/VestingPeriod/properties/percentage`, `.../immediatePercentage`, `.../cliffPercentage` — vesting tranche / cliff percentages.
  - `#/$defs/OptionExerciseTaxWithholdingLineItem/properties/rate` — tax-withholding rate.
  Each of these is a distinct, unrelated `Decimal` scalar; there is no Carta target that represents "a percentage" independent of the owning object.
- **OCF objects that `$ref` `Percentage` (routed at the object level, not here):**
  - `types/InterestRate.schema.json` → `rate` (the interest-rate value) → routes to `ConvertibleNote.interestRate` / `ConvertibleIssuanceTransaction.interestRate` when the parent convertible terms are mapped.
  - `types/conversion_mechanisms/PercentCapitalizationConversionMechanism.schema.json` → `converts_to_percent` — percent-of-capitalization conversion; Carta has no dedicated field for this mechanism, so it is handled (or dropped) in the convertible-conversion-mechanism mapping, not here.
  - `types/conversion_mechanisms/SAFEConversionMechanism.schema.json` → `conversion_discount` → `discountPercentage`.
  - `types/conversion_mechanisms/NoteConversionMechanism.schema.json` → `conversion_discount` → `discountPercentage` (and the `interest_rates` array of `InterestRate`, whose `rate` → `interestRate`).
  - `types/conversion_mechanisms/SharePriceBasedConversionMechanism.schema.json` → `discount_percentage` → `discountPercentage`.
- **Scale convention differs.** OCF stores percentages as a fraction in `[0.0, 1.0]` (0.125 = 12.5%). Carta's `Decimal`-backed percentage fields carry no schema-level scale constraint; whether a given Carta field expects a fraction (`0.125`) or a whole-number percent (`12.5`) is field-specific and undocumented in the schema. Any object-level mapping that routes an OCF `Percentage` into one of the Carta fields above must confirm and, if needed, rescale (×100). This is a per-field concern of the owning object mappings and cannot be resolved at this scalar type.
- Because Carta exposes no reusable percentage type, this file intentionally maps nothing directly; the value is always carried by the owning object's mapping, exactly as for the other inlined-scalar concepts.
