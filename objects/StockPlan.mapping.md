---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/StockPlan.schema.json
ocf_object_type: STOCK_PLAN
ocf_title: Object - Stock Plan
ocf_kind: object
required_fields:
  - plan_name
  - initial_shares_reserved
  - id
  - object_type
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Stock Plan → TBD

> Object describing a plan which stock options are issued from

## OCF schema

Source: [`StockPlan.schema.json`](./StockPlan.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/StockPlan.schema.json",
  "title": "Object - Stock Plan",
  "description": "Object describing a plan which stock options are issued from",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
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
      "const": "STOCK_PLAN"
    },
    "plan_name": {
      "description": "Name for the stock plan",
      "type": "string"
    },
    "board_approval_date": {
      "description": "Date on which board approved the plan",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stockholder_approval_date": {
      "description": "This optional field tracks when the stockholders approved this stock plan. This is intended for use by US companies that want to issue Incentive Stock Options (ISOs), as the issuing StockPlan must receive shareholder approval within a specified time frame in order to issue valid ISOs.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "initial_shares_reserved": {
      "description": "The initial number of shares reserved in the pool for this stock plan by the Board or equivalent body.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "default_cancellation_behavior": {
      "description": "If a security issued under this Stock Plan is cancelled, what happens to the reserved shares by default? NOTE: for any given security issued from the pool, the Plan's default cancellation behavior can be overridden by subsequent transactions cancelling the reserved stock, returning it to pool or marking it as capital stock. The event chain should always control - do not rely on this field and fail to traverse the events.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StockPlanCancellationBehaviorType.schema.json"
    },
    "stock_class_id": {
      "description": "[DEPRECATED in favor of stock_class_ids] Identifier of the StockClass object this plan is composed of.",
      "type": "string",
      "deprecated": "true"
    },
    "stock_class_ids": {
      "description": "Identifiers of StockClass objects this plan is composed of",
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "string"
      }
    }
  },
  "oneOf": [
    {
      "required": [
        "stock_class_id"
      ],
      "not": {
        "required": [
          "stock_class_ids"
        ]
      },
      "$comment": "Due to how the JSONSchema 'not' works, this means that, if stock_class_id is present, stock_class_ids cannot be present"
    },
    {
      "required": [
        "stock_class_ids"
      ],
      "not": {
        "required": [
          "stock_class_id"
        ]
      },
      "$comment": "Due to how the JSONSchema 'not' works, this means that, if stock_class_ids is present, stock_class_id cannot be present"
    }
  ],
  "additionalProperties": false,
  "required": [
    "plan_name",
    "initial_shares_reserved",
    "id",
    "object_type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/StockPlan.schema.json"
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
      STOCK_PLAN: TODO
  plan_name:
    kind: TODO
    target: TODO
  board_approval_date:
    kind: TODO
    target: TODO
  stockholder_approval_date:
    kind: TODO
    target: TODO
  initial_shares_reserved:
    kind: TODO
    target: TODO
  default_cancellation_behavior:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      RETIRE: TODO
      RETURN_TO_POOL: TODO
      HOLD_AS_CAPITAL_STOCK: TODO
      DEFINED_PER_PLAN_SECURITY: TODO
  stock_class_id:
    kind: TODO
    target: TODO
  stock_class_ids:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
