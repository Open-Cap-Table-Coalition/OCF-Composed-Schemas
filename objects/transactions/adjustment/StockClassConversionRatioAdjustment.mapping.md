---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/adjustment/StockClassConversionRatioAdjustment.schema.json
ocf_object_type: TX_STOCK_CLASS_CONVERSION_RATIO_ADJUSTMENT
ocf_title: Object - Stock Class Conversion Ratio Adjustment Transaction
ocf_kind: object
required_fields:
  - new_ratio_conversion_mechanism
  - id
  - object_type
  - date
  - stock_class_id
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Stock Class Conversion Ratio Adjustment Transaction → Carta

> Object describing the conversion ratio adjustment of a stock class that has a RatioConversionMechanism conversion mechanism where there was an actual repricing due to a down-round. The actual determination of the new conversion ratio / conversion price is calculated outside of OCF, so the specific mechanism - e.g. broad-based weighted-average anti-dilution protection vs. full ratchet anti-dilution protection.

## OCF schema

Source: [`StockClassConversionRatioAdjustment.schema.json`](./StockClassConversionRatioAdjustment.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/adjustment/StockClassConversionRatioAdjustment.schema.json",
  "title": "Object - Stock Class Conversion Ratio Adjustment Transaction",
  "description": "Object describing the conversion ratio adjustment of a stock class that has a RatioConversionMechanism conversion mechanism where there was an actual repricing due to a down-round. The actual determination of the new conversion ratio / conversion price is calculated outside of OCF, so the specific mechanism - e.g. broad-based weighted-average anti-dilution protection vs. full ratchet anti-dilution protection.",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/Transaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/StockClassTransaction.schema.json"
    }
  ],
  "properties": {
    "id": {
      "description": "Identifier for the object",
      "type": "string"
    },
    "comments": {
      "description": "Unstructured text comments related to and stored for the object",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "object_type": {
      "const": "TX_STOCK_CLASS_CONVERSION_RATIO_ADJUSTMENT"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stock_class_id": {
      "description": "Identifier of the StockClass object, a subject of this transaction",
      "type": "string"
    },
    "new_ratio_conversion_mechanism": {
      "description": "New conversion ratio mechanism describing new conversion price and conversion ratio in effect following a repricing - based on original issue price to new conversion price (provided in this transaction). For 2-for-1 split the numerator of the ratio is 2 and the denominator is 1.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/conversion_mechanisms/RatioConversionMechanism.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "new_ratio_conversion_mechanism",
    "id",
    "object_type",
    "date",
    "stock_class_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/adjustment/StockClassConversionRatioAdjustment.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  id:
    kind: unmappable
    target: null
    reason: ocf-internal
  comments:
    kind: unmappable
    target: null
    reason: ocf-internal
  object_type:
    kind: unmappable
    target: null
    reason: ocf-internal
    values:
      TX_STOCK_CLASS_CONVERSION_RATIO_ADJUSTMENT: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  stock_class_id:
    kind: rename
    target: "#/$defs/ShareClass/properties/id"
  new_ratio_conversion_mechanism:
    kind: split
    target:
      - "#/$defs/ShareClassRightsAndPreferences/properties/conversionRatio"
      - "#/$defs/ShareClassRightsAndPreferences/properties/conversionPrice"
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassConversionRatioAdjustment) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassConversionRatioAdjustment%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassConversionRatioAdjustment%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassConversionRatioAdjustment%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassConversionRatioAdjustment%3A+date&property_path=date) |
| `stock_class_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassConversionRatioAdjustment%3A+stock_class_id&property_path=stock_class_id) |
| `new_ratio_conversion_mechanism` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassConversionRatioAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassConversionRatioAdjustment%3A+new_ratio_conversion_mechanism&property_path=new_ratio_conversion_mechanism) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta has no share-class adjustment transaction. The post-adjustment state is projected onto the selected `ShareClass`: `stock_class_id` identifies the class and `new_ratio_conversion_mechanism` splits into `conversionRatio` and `conversionPrice`.
- `date`, approval dates, and OCF scaffolding have no target; adjustment history is not represented.
