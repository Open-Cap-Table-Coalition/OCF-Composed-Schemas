---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/reissuance/StockReissuance.schema.json
ocf_object_type: TX_STOCK_REISSUANCE
ocf_title: Object - Stock Re-issuance Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - security_id
  - resulting_security_ids
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Stock Re-issuance Transaction → TBD

> Object describing a re-issuance of stock

## OCF schema

Source: [`StockReissuance.schema.json`](./StockReissuance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/reissuance/StockReissuance.schema.json",
  "title": "Object - Stock Re-issuance Transaction",
  "description": "Object describing a re-issuance of stock",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/Transaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/SecurityTransaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/reissuance/Reissuance.schema.json"
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
      "const": "TX_STOCK_REISSUANCE"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "resulting_security_ids": {
      "title": "Security Reissuance - Resulting Security ID Array",
      "description": "Identifier of the new security (or securities) issuance resulting from a reissuance",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "split_transaction_id": {
      "title": "Id of stock class split transaction",
      "description": "When stock is reissued as a result of a stock split, this field contains id of the respective stock class split transaction. It is not set otherwise.",
      "type": "string"
    },
    "reason_text": {
      "title": "Reason for stock reissuance",
      "description": "Free-form human-readable reason for stock reissuance",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "object_type",
    "date",
    "security_id",
    "resulting_security_ids"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/reissuance/StockReissuance.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/8

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
      TX_STOCK_REISSUANCE: TODO
  date:
    kind: TODO
    target: TODO
  security_id:
    kind: TODO
    target: TODO
  resulting_security_ids:
    kind: TODO
    target: TODO
  split_transaction_id:
    kind: TODO
    target: TODO
  reason_text:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
