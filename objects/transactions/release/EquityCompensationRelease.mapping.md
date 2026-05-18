---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/release/EquityCompensationRelease.schema.json
ocf_object_type: null
ocf_title: Object - Equity Compensation Release Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - security_id
  - settlement_date
  - release_price
  - quantity
  - resulting_security_ids
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Equity Compensation Release Transaction → TBD

> Object describing equity compensation security release transaction

## OCF schema

Source: [`EquityCompensationRelease.schema.json`](./EquityCompensationRelease.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/release/EquityCompensationRelease.schema.json",
  "title": "Object - Equity Compensation Release Transaction",
  "description": "Object describing equity compensation security release transaction",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/release/Release.schema.json"
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
      "enum": [
        "TX_PLAN_SECURITY_RELEASE",
        "TX_EQUITY_COMPENSATION_RELEASE"
      ],
      "description": "This is done to avoid a breaking change as we work towards a bigger restructure of the equity types in v2.0.0. `TX_PLAN_SECURITY_RELEASE` will be deprecated in v2.0.0"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "settlement_date": {
      "description": "The settlement date for the shares released, typically after the release transaction date",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "release_price": {
      "description": "The release price used to determine the value of the security at the time of release",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "quantity": {
      "description": "Quantity of shares released",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "consideration_text": {
      "description": "Unstructured text description of consideration provided in exchange for security release",
      "type": "string"
    },
    "resulting_security_ids": {
      "title": "Security Release - Resulting Security ID Array",
      "description": "Identifier of the new security (or securities) issuance resulting from a release transaction",
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "object_type",
    "date",
    "security_id",
    "settlement_date",
    "release_price",
    "quantity",
    "resulting_security_ids"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/release/EquityCompensationRelease.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/10

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
      TX_PLAN_SECURITY_RELEASE: TODO
      TX_EQUITY_COMPENSATION_RELEASE: TODO
  date:
    kind: TODO
    target: TODO
  security_id:
    kind: TODO
    target: TODO
  settlement_date:
    kind: TODO
    target: TODO
  release_price:
    kind: TODO
    target: TODO
  quantity:
    kind: TODO
    target: TODO
  consideration_text:
    kind: TODO
    target: TODO
  resulting_security_ids:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
