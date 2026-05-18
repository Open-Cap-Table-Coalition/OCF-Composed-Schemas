---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/split/StockClassSplit.schema.json
ocf_object_type: TX_STOCK_CLASS_SPLIT
ocf_title: Object - Stock Split Transaction
ocf_kind: object
required_fields:
  - split_ratio
  - id
  - object_type
  - date
  - stock_class_id
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Stock Split Transaction → TBD

> Object describing a split of a stock class

## OCF schema

Source: [`StockClassSplit.schema.json`](./StockClassSplit.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/split/StockClassSplit.schema.json",
  "title": "Object - Stock Split Transaction",
  "description": "Object describing a split of a stock class",
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
      "const": "TX_STOCK_CLASS_SPLIT"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stock_class_id": {
      "description": "Identifier of the StockClass object, a subject of this transaction",
      "type": "string"
    },
    "split_ratio": {
      "description": "Ratio of new shares to old shares. For 2-for-1 split the numerator of the ratio is 2 and the denominator is 1.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Ratio.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "split_ratio",
    "id",
    "object_type",
    "date",
    "stock_class_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/split/StockClassSplit.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/6

fields:
  id:
    kind: TODO
    target: TODO
  comments:
    kind: TODO
    target: TODO
  object_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      TX_STOCK_CLASS_SPLIT: TODO
  date:
    kind: TODO
    target: TODO
  stock_class_id:
    kind: TODO
    target: TODO
  split_ratio:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
