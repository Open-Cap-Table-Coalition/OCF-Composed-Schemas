---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/EquityCompensationCancellation.schema.json
ocf_object_type: null
ocf_title: Object - Equity Compensation Cancellation Transaction
ocf_kind: object
required_fields:
  - quantity
  - id
  - object_type
  - date
  - security_id
  - reason_text
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Equity Compensation Cancellation Transaction → TBD

> Object describing a cancellation of equity compensation

## OCF schema

Source: [`EquityCompensationCancellation.schema.json`](./EquityCompensationCancellation.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/EquityCompensationCancellation.schema.json",
  "title": "Object - Equity Compensation Cancellation Transaction",
  "description": "Object describing a cancellation of equity compensation",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/cancellation/Cancellation.schema.json"
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
        "TX_PLAN_SECURITY_CANCELLATION",
        "TX_EQUITY_COMPENSATION_CANCELLATION"
      ],
      "description": "This is done to avoid a breaking change as we work towards a bigger restructure of the equity types in v2.0.0. `TX_PLAN_SECURITY_CANCELLATION` will be deprecated in v2.0.0"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "balance_security_id": {
      "description": "Identifier for the security that holds the remainder balance (for partial cancellations)",
      "type": "string"
    },
    "reason_text": {
      "description": "Reason for the cancellation",
      "type": "string"
    },
    "quantity": {
      "description": "Quantity of non-monetary security units cancelled",
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
    "reason_text"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/cancellation/EquityCompensationCancellation.schema.json"
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
      TX_PLAN_SECURITY_CANCELLATION: TODO
      TX_EQUITY_COMPENSATION_CANCELLATION: TODO
  date:
    kind: TODO
    target: TODO
  security_id:
    kind: TODO
    target: TODO
  balance_security_id:
    kind: TODO
    target: TODO
  reason_text:
    kind: TODO
    target: TODO
  quantity:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
