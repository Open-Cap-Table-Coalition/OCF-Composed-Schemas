---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/adjustment/StockPlanPoolAdjustment.schema.json
ocf_object_type: TX_STOCK_PLAN_POOL_ADJUSTMENT
ocf_title: Object - Stock Plan Pool Adjustment Transaction
ocf_kind: object
required_fields:
  - shares_reserved
  - id
  - object_type
  - date
  - stock_plan_id
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Stock Plan Pool Adjustment Transaction → TBD

> Object describing the change in the size of a Stock Plan pool.

## OCF schema

Source: [`StockPlanPoolAdjustment.schema.json`](./StockPlanPoolAdjustment.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/adjustment/StockPlanPoolAdjustment.schema.json",
  "title": "Object - Stock Plan Pool Adjustment Transaction",
  "description": "Object describing the change in the size of a Stock Plan pool.",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/Transaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/StockPlanTransaction.schema.json"
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
      "const": "TX_STOCK_PLAN_POOL_ADJUSTMENT"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stock_plan_id": {
      "description": "Identifier of the Stock Plan object, a subject of this transaction",
      "type": "string"
    },
    "board_approval_date": {
      "description": "Date on which board approved the change to the plan.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stockholder_approval_date": {
      "description": "This optional field tracks when the stockholders approved this change to the stock plan. This is intended for use by US companies that want to issue Incentive Stock Options (ISOs), as the issuing StockPlan must receive shareholder approval within a specified time frame in order to issue valid ISOs.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "shares_reserved": {
      "description": "The number of shares reserved in the pool for this stock plan by the Board or equivalent body as of the effective date of this pool adjustment.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "shares_reserved",
    "id",
    "object_type",
    "date",
    "stock_plan_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/adjustment/StockPlanPoolAdjustment.schema.json"
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
      TX_STOCK_PLAN_POOL_ADJUSTMENT: TODO
  date:
    kind: TODO
    target: TODO
  stock_plan_id:
    kind: TODO
    target: TODO
  board_approval_date:
    kind: TODO
    target: TODO
  stockholder_approval_date:
    kind: TODO
    target: TODO
  shares_reserved:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
