---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/RatioConversionMechanism.schema.json
ocf_object_type: null
ocf_title: Conversion Mechanism - Ratio
ocf_kind: type
required_fields:
  - ratio
  - conversion_price
  - rounding_type
  - type
  - type
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Conversion Mechanism - Ratio → Carta

> Sets forth inputs and conversion mechanism of a ratio conversion (primarily used to describe conversion from one stock class (e.g. Preferred) into another (e.g. Common)

## OCF schema

Source: [`RatioConversionMechanism.schema.json`](./RatioConversionMechanism.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/RatioConversionMechanism.schema.json",
  "title": "Conversion Mechanism - Ratio",
  "description": "Sets forth inputs and conversion mechanism of a ratio conversion (primarily used to describe conversion from one stock class (e.g. Preferred) into another (e.g. Common)",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_mechanisms/ConversionMechanism.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "RATIO_CONVERSION"
    },
    "conversion_price": {
      "description": "What is the effective conversion price per share of this stock class?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "ratio": {
      "description": "One share of this stock class converts into this many target stock class shares",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Ratio.schema.json"
    },
    "rounding_type": {
      "description": "How should fractional shares be rounded?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/RoundingType.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "ratio",
    "conversion_price",
    "rounding_type",
    "type",
    "type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_mechanisms/RatioConversionMechanism.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 4/4

fields:
  type:
    kind: unmappable
    target: null
    reason: ocf-internal
  conversion_price:
    kind: rename
    target: "#/$defs/ShareClassRightsAndPreferences/properties/conversionPrice"
  ratio:
    kind: computed
    target: "#/$defs/ShareClassRightsAndPreferences/properties/conversionRatio"
  rounding_type:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Bucket 1 (single clear Carta home).** This is the canonical preferred→common ratio conversion: "one share of this stock class converts into this many target-class shares." Carta models exactly those economics on `#/$defs/ShareClassRightsAndPreferences` (the rights-and-preferences block of a preferred share class), which carries `conversionPrice` (`Money`) and `conversionRatio` (`Decimal`). So the two economic inputs of this mechanism have an unambiguous home and are mapped; only the OCF discriminator and the rounding policy — neither of which Carta records — are `unmappable`.
- **`conversion_price`** (`Monetary`) → `ShareClassRightsAndPreferences.conversionPrice`. Direct `rename`. The OCF `Monetary` type ↔ Carta `Money` correspondence is the standard bucket-1 type-to-type pairing (`amount`→`amount`, `currency`→`currencyCode`; see `types/Monetary.mapping.md`), so the per-share effective conversion price lands cleanly on Carta's `conversionPrice`.
- **`ratio`** (`Ratio`: `numerator` / `denominator`, two `Numeric`s) → `ShareClassRightsAndPreferences.conversionRatio` (`Decimal`). This is `computed`, not `rename`, because OCF carries the ratio as a numerator/denominator pair while Carta stores a single decimal: the target value is `numerator / denominator` (e.g. `2 / 1` → `"2"`). This loses the explicit fraction representation but preserves the conversion factor, which is what `conversionRatio` means ("how many target-class shares per source share"). Carta's `conversionRatio` is a `Decimal` (string-form decimal), so a non-terminating quotient (e.g. `1/3`) must be rendered as a rounded/truncated decimal string on export — a precision caveat inherent to the target shape, not a semantic mismatch.
- **`type`** (const `RATIO_CONVERSION`) → **unmappable / `ocf-internal`.** This is the OCF discriminator constant (inherited via the `ConversionMechanism` primitive) that selects which conversion-mechanism variant is in play — pure OCF scaffolding, not a data value a holder would supply. Carta has no conversion-mechanism enum to remap it to (no `Conversion*`/`Mechanism`/`Trigger` enum exists anywhere in the bundle, confirmed against `carta-enums.json`) and does not record the mechanism kind at all — the mechanism is implied structurally by the destination object (`ShareClassRightsAndPreferences`). Treated as `ocf-internal`, the same class as `object_type` and the other variant-discriminator consts, consistent with the precedent (`objects/Issuer.mapping.md` `object_type` → `ocf-internal`) and the sibling typed mechanisms (`FixedAmountConversionMechanism`, `NoteConversionMechanism`, `ValuationBasedConversionMechanism` all map their `type` const → `ocf-internal`).
- **`rounding_type`** (`RoundingType` enum: `CEILING` / `FLOOR` / `NORMAL`): how fractional shares produced by the conversion are rounded. Carta has no rounding concept anywhere in the bundle — no `Rounding*` enum and no rounding field on `ShareClassRightsAndPreferences` or any related object (`grep` for `rounding`/`ceiling` across both `Carta.schema.json` and the enum bundle returns nothing). Carta stores the conversion *terms* but not the fractional-share rounding *policy*, so there is no enum to remap the three values onto. `unmappable` / `no-equivalent`. (No `values:` block is emitted because, per the validator, `values:` only attaches to an `enum-remap` with a resolving Carta enum target — which does not exist here.)
- **Consumers / object-level routing.** This type is `$ref`'d (via `primitives/types/conversion_mechanisms/ConversionMechanism.schema.json`) by `types/conversion_rights/StockClassConversionRight.schema.json` and by the `ratio_conversion_mechanism` of `objects/transactions/adjustment/StockClassConversionRatioAdjustment.schema.json`. At the object level, a `StockClassConversionRight` describes a preferred class's right to convert into another class, which is precisely what Carta's `ShareClassRightsAndPreferences` captures — so the `conversion_price`/`ratio` mapped above route onto that object's `conversionPrice`/`conversionRatio`. The standalone ratio-*adjustment* transaction (a mid-life re-statement of the ratio) has no dedicated Carta object; only the resulting current ratio survives, by overwriting `ShareClassRightsAndPreferences.conversionRatio`, and the adjustment event history itself is dropped.
