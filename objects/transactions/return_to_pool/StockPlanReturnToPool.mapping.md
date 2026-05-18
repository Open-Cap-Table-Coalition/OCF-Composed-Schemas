---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/return_to_pool/StockPlanReturnToPool.schema.json
ocf_object_type: TX_STOCK_PLAN_RETURN_TO_POOL
ocf_title: Object - Stock Plan Return to Pool Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - security_id
  - stock_plan_id
  - reason_text
  - stock_plan_id
  - quantity
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Stock Plan Return to Pool Transaction → TBD

> Object describing which stock plan pool a particular security's shares were returned to upon cancellation.

## OCF schema

Source: [`StockPlanReturnToPool.schema.json`](./StockPlanReturnToPool.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/return_to_pool/StockPlanReturnToPool.schema.json",
  "title": "Object - Stock Plan Return to Pool Transaction",
  "description": "Object describing which stock plan pool a particular security's shares were returned to upon cancellation.",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/StockPlanTransaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/return_to_pool/ReturnToPool.schema.json"
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
      "const": "TX_STOCK_PLAN_RETURN_TO_POOL"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "stock_plan_id": {
      "description": "Id of the Stock Plan whose pool the reserved shares should return to. This does not have to be the same pool the securities were issued from as sometimes plan rollovers or other actions taken by the company can result in stock returning to a different pool.",
      "type": "string"
    },
    "reason_text": {
      "description": "Reason for the return to the pool",
      "type": "string"
    },
    "quantity": {
      "description": "How many shares were returned to the pool?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/return_to_pool/StockPlanReturnToPool.schema.json",
  "required": [
    "id",
    "object_type",
    "date",
    "security_id",
    "stock_plan_id",
    "reason_text",
    "stock_plan_id",
    "quantity"
  ]
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
      TX_STOCK_PLAN_RETURN_TO_POOL: TODO
  date:
    kind: TODO
    target: TODO
  security_id:
    kind: TODO
    target: TODO
  stock_plan_id:
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
