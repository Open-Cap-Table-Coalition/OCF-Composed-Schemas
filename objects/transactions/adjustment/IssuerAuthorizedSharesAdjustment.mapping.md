---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/adjustment/IssuerAuthorizedSharesAdjustment.schema.json
ocf_object_type: TX_ISSUER_AUTHORIZED_SHARES_ADJUSTMENT
ocf_title: Object - Issuer Authorized Shares Adjustment Transaction
ocf_kind: object
required_fields:
  - new_shares_authorized
  - id
  - object_type
  - date
  - issuer_id
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Issuer Authorized Shares Adjustment Transaction → TBD

> Object describing an event to change the number of authorized shares at the issuer level.

## OCF schema

Source: [`IssuerAuthorizedSharesAdjustment.schema.json`](./IssuerAuthorizedSharesAdjustment.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/adjustment/IssuerAuthorizedSharesAdjustment.schema.json",
  "title": "Object - Issuer Authorized Shares Adjustment Transaction",
  "description": "Object describing an event to change the number of authorized shares at the issuer level.",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/Transaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/IssuerTransaction.schema.json"
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
      "const": "TX_ISSUER_AUTHORIZED_SHARES_ADJUSTMENT"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "issuer_id": {
      "description": "Identifier of the Issuer object, a subject of this transaction",
      "type": "string"
    },
    "new_shares_authorized": {
      "description": "The new number of shares authorized for this issuer as of the event of this transaction",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "board_approval_date": {
      "description": "Date on which the board approved the change to the issuer",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stockholder_approval_date": {
      "description": "Date on which the stockholders approved the change to the issuer",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "new_shares_authorized",
    "id",
    "object_type",
    "date",
    "issuer_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/adjustment/IssuerAuthorizedSharesAdjustment.schema.json"
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
      TX_ISSUER_AUTHORIZED_SHARES_ADJUSTMENT: TODO
  date:
    kind: TODO
    target: TODO
  issuer_id:
    kind: TODO
    target: TODO
  new_shares_authorized:
    kind: TODO
    target: TODO
  board_approval_date:
    kind: TODO
    target: TODO
  stockholder_approval_date:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
