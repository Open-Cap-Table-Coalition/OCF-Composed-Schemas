---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/consolidation/StockConsolidation.schema.json
ocf_object_type: TX_STOCK_CONSOLIDATION
ocf_title: Object - Stock Consolidation Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - resulting_security_id
  - security_ids
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Stock Consolidation Transaction → TBD

> Object describing a consolidation of stock positions

## OCF schema

Source: [`StockConsolidation.schema.json`](./StockConsolidation.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/consolidation/StockConsolidation.schema.json",
  "title": "Object - Stock Consolidation Transaction",
  "description": "Object describing a consolidation of stock positions",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/Transaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/consolidation/Consolidation.schema.json"
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
      "const": "TX_STOCK_CONSOLIDATION"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "resulting_security_id": {
      "description": "Identifier for the security that holds the consolidated balance from this transaction",
      "type": "string"
    },
    "security_ids": {
      "title": "Consolidation Security IDs Array",
      "description": "Array of identifiers for the security (or securities) being consolidation as a result of the transaction",
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "reason_text": {
      "title": "Reason for stock consolidation",
      "description": "Free-form human-readable reason for stock consolidation",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "object_type",
    "date",
    "resulting_security_id",
    "security_ids"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/consolidation/StockConsolidation.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/7

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
      TX_STOCK_CONSOLIDATION: TODO
  date:
    kind: TODO
    target: TODO
  resulting_security_id:
    kind: TODO
    target: TODO
  security_ids:
    kind: TODO
    target: TODO
  reason_text:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
