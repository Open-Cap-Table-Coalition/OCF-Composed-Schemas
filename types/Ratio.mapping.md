---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Ratio.schema.json
ocf_object_type: null
ocf_title: Type - Ratio
ocf_kind: type
required_fields:
  - numerator
  - denominator
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Ratio → Carta

> Type representation of a ratio as two parts of a quotient, i.e. numerator and denominator numeric values

## OCF schema

Source: [`Ratio.schema.json`](./Ratio.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Ratio.schema.json",
  "title": "Type - Ratio",
  "description": "Type representation of a ratio as two parts of a quotient, i.e. numerator and denominator numeric values",
  "type": "object",
  "properties": {
    "numerator": {
      "description": "Numerator of the ratio, i.e. the ratio of A to B (A:B) can be expressed as a fraction (A/B), where A is the numerator",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "denominator": {
      "description": "Denominator of the ratio, i.e. the ratio of A to B (A:B) can be expressed as a fraction (A/B), where B is the denominator",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "numerator",
    "denominator"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/Ratio.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  numerator:
    kind: unmappable
    target: null
    reason: no-equivalent
  denominator:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Bucket 2 (inlined-per-object; no single well-posed home).** OCF's `Ratio` is a *generic, reusable* two-part quotient (`numerator` / `denominator`, each a `Numeric`). Carta has **no** analogous reusable `Ratio` (or `Fraction`/`Quotient`) `$def`, and — critically — `Ratio` is `$ref`'d by **four unrelated** OCF consumers (a stock-class conversion ratio, a SAFE conversion, a note conversion, and a stock-split factor) that do **not** share one Carta destination. The only ratio-shaped Carta scalar in the bundle is `ShareClassRightsAndPreferences.conversionRatio` (`Decimal`), and that is the home for **only one** of those consumers (`RatioConversionMechanism`), not for the split factor or the SAFE/note ratios. Because there is no single Carta `$def` (or even single scalar field) that corresponds to the *whole* `Ratio` type, this is the inlined-per-object bucket, and **every** field is `unmappable` / `no-equivalent` at the type level. Picking `conversionRatio` as a representative target for the generic type would be inventing a representative inline target — exactly what bucket 2 forbids; that target legitimately lives in the *object-level* mapping (`RatioConversionMechanism.mapping.md`, which maps its `ratio` field to `conversionRatio`).
- Each OCF object that `$ref`s `Ratio`, and where its ratio routes at the **object** level:
  - `types/conversion_mechanisms/RatioConversionMechanism.schema.json` (`ratio`) — a preferred→common ratio conversion. Mapped (object-level, `computed`) to `#/$defs/ShareClassRightsAndPreferences/properties/conversionRatio` (`Decimal`) as `numerator / denominator`. See `types/conversion_mechanisms/RatioConversionMechanism.mapping.md`. This is the *only* consumer with a Carta ratio home, and it owns that target — not this generic type.
  - `types/conversion_mechanisms/SAFEConversionMechanism.schema.json` and `types/conversion_mechanisms/NoteConversionMechanism.schema.json` reference `Ratio` inside their conversion-trigger / discount logic. Carta records convertible **terms** (`ConvertibleNote` / `ConvertibleIssuanceTransaction`: discount, valuation cap, interest, conversion-trigger amount) but has no ratio object or scalar for these mechanisms; the embedded ratio is dropped (the surrounding trigger state-machine is out of scope for Carta). See those mechanisms' own mapping files.
  - `objects/transactions/split/StockClassSplit.schema.json` (`split_ratio`) describes a stock-split factor (e.g. 2-for-1 → numerator 2, denominator 1). Carta has **no** split transaction or split-ratio field anywhere in the bundle, so this ratio has no home and is dropped at the object level. It is **not** the same concept as a stock-class conversion ratio and must not route to `conversionRatio`. See `objects/transactions/split/StockClassSplit.mapping.md`.
- Consistency / no-loss note: `numerator` and `denominator` are both unmappable because Carta neither preserves the OCF two-part fraction nor exposes a unifying ratio type; where individual consumers do have a Carta scalar (only `RatioConversionMechanism`), the already-evaluated quotient is mapped in that object's own file, not here. Both fields are explicitly accounted for and status is `complete`.
