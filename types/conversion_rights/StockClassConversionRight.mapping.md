---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/StockClassConversionRight.schema.json
ocf_object_type: null
ocf_title: Type - Stock Class Conversion Rights
ocf_kind: type
required_fields:
  - conversion_mechanism
  - conversion_mechanism
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Type - Stock Class Conversion Rights → Carta

> Type representation of a conversion right from one Stock Class into another Stock Class

## OCF schema

Source: [`StockClassConversionRight.schema.json`](./StockClassConversionRight.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_rights/StockClassConversionRight.schema.json",
  "title": "Type - Stock Class Conversion Rights",
  "description": "Type representation of a conversion right from one Stock Class into another Stock Class",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/types/conversion_rights/ConversionRight.schema.json"
    }
  ],
  "properties": {
    "type": {
      "const": "STOCK_CLASS_CONVERSION_RIGHT"
    },
    "conversion_mechanism": {
      "oneOf": [
        {
          "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/RatioConversionMechanism.schema.json"
        }
      ]
    },
    "converts_to_future_round": {
      "description": "Is this stock class potentially convertible into a future, as-yet undetermined stock class (e.g. Founder Preferred)",
      "type": "boolean"
    },
    "converts_to_stock_class_id": {
      "description": "The identifier of the existing, known stock class this stock class can convert into",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "conversion_mechanism",
    "conversion_mechanism"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/conversion_rights/StockClassConversionRight.schema.json"
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
    reason: no-equivalent
    values:
      STOCK_CLASS_CONVERSION_RIGHT: null
  conversion_mechanism:
    kind: split
    target:
      - "#/$defs/ShareClassRightsAndPreferences/properties/conversionRatio"
      - "#/$defs/ShareClassRightsAndPreferences/properties/conversionPrice"
  converts_to_future_round:
    kind: unmappable
    target: null
    reason: no-equivalent
  converts_to_stock_class_id:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FStockClassConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FStockClassConversionRight.mapping.md&title=%5BMapping+question%5D+StockClassConversionRight) |
| `type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FStockClassConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FStockClassConversionRight.mapping.md&title=%5BMapping+question%5D+StockClassConversionRight%3A+type&property_path=type) |
| `conversion_mechanism` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FStockClassConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FStockClassConversionRight.mapping.md&title=%5BMapping+question%5D+StockClassConversionRight%3A+conversion_mechanism&property_path=conversion_mechanism) |
| `converts_to_future_round` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FStockClassConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FStockClassConversionRight.mapping.md&title=%5BMapping+question%5D+StockClassConversionRight%3A+converts_to_future_round&property_path=converts_to_future_round) |
| `converts_to_stock_class_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fconversion_rights%2FStockClassConversionRight.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fconversion_rights%2FStockClassConversionRight.mapping.md&title=%5BMapping+question%5D+StockClassConversionRight%3A+converts_to_stock_class_id&property_path=converts_to_stock_class_id) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- The supported ratio mechanism splits into `ShareClassRightsAndPreferences.conversionRatio` and `conversionPrice`.
- The conversion-right discriminator, future-round flag, and target stock-class ID have no Carta target; the containing stock-class mapping supplies the preferred-class context.
