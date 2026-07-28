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

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FRatioConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FRatioConversionMechanism.mapping.md&title=%5BMapping+question%5D+RatioConversionMechanism) |
| `type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FRatioConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FRatioConversionMechanism.mapping.md&title=%5BMapping+question%5D+RatioConversionMechanism%3A+type&property_path=type) |
| `conversion_price` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FRatioConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FRatioConversionMechanism.mapping.md&title=%5BMapping+question%5D+RatioConversionMechanism%3A+conversion_price&property_path=conversion_price) |
| `ratio` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FRatioConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FRatioConversionMechanism.mapping.md&title=%5BMapping+question%5D+RatioConversionMechanism%3A+ratio&property_path=ratio) |
| `rounding_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_mechanisms%2FRatioConversionMechanism.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_mechanisms%2FRatioConversionMechanism.mapping.md&title=%5BMapping+question%5D+RatioConversionMechanism%3A+rounding_type&property_path=rounding_type) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- `conversion_price` maps to `ShareClassRightsAndPreferences.conversionPrice`; `ratio` is computed as OCF numerator ÷ denominator into `conversionRatio`.
- The mechanism discriminator and `rounding_type` have no Carta target. The quotient may require decimal precision policy when the fraction is non-terminating.
