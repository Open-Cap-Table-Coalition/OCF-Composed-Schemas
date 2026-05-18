---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/transfer/WarrantTransfer.schema.json
ocf_object_type: TX_WARRANT_TRANSFER
ocf_title: Object - Warrant Transfer Transaction
ocf_kind: object
required_fields:
  - quantity
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

# Object - Warrant Transfer Transaction → TBD

> Object describing a transfer or secondary sale of a warrant security

## OCF schema

Source: [`WarrantTransfer.schema.json`](./WarrantTransfer.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/transfer/WarrantTransfer.schema.json",
  "title": "Object - Warrant Transfer Transaction",
  "description": "Object describing a transfer or secondary sale of a warrant security",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/transfer/Transfer.schema.json"
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
      "const": "TX_WARRANT_TRANSFER"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "consideration_text": {
      "description": "Unstructured text description of consideration provided in exchange for security transfer",
      "type": "string"
    },
    "balance_security_id": {
      "description": "Identifier for the security that holds the remainder balance (for partial transfers)",
      "type": "string"
    },
    "resulting_security_ids": {
      "title": "Security Transfer - Resulting Security ID Array",
      "description": "Array of identifiers for new security (or securities) created as a result of the transaction",
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "quantity": {
      "description": "Quantity of non-monetary security units transferred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "quantity",
    "id",
    "object_type",
    "date",
    "security_id",
    "resulting_security_ids"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/transfer/WarrantTransfer.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/9

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
      TX_WARRANT_TRANSFER: TODO
  date:
    kind: TODO
    target: TODO
  security_id:
    kind: TODO
    target: TODO
  consideration_text:
    kind: TODO
    target: TODO
  balance_security_id:
    kind: TODO
    target: TODO
  resulting_security_ids:
    kind: TODO
    target: TODO
  quantity:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
