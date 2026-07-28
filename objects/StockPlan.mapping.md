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
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Object - Stock Plan → Carta

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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  id:
    kind: unmappable
    target: null
    reason: excluded-from-snapshot
  comments:
    kind: unmappable
    target: null
    reason: ocf-internal
  object_type:
    kind: unmappable
    target: null
    reason: ocf-internal
    values:
      STOCK_PLAN: null
  plan_name:
    kind: rename
    target:
      - "#/$defs/OptionGrant/properties/equityIncentivePlanName"
      - "#/$defs/RestrictedStockAward/properties/equityIncentivePlanName"
      - "#/$defs/RestrictedStockUnit/properties/equityIncentivePlanName"
    inverse:
      role: state-projection
      note: Current/denormalized plan-name state; it carries no plan-history semantics.
  board_approval_date:
    kind: unmappable
    target: null
    reason: no-equivalent
  stockholder_approval_date:
    kind: unmappable
    target: null
    reason: no-equivalent
  initial_shares_reserved:
    kind: unmappable
    target: null
    reason: excluded-from-snapshot
  default_cancellation_behavior:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      RETIRE: null
      RETURN_TO_POOL: null
      HOLD_AS_CAPITAL_STOCK: null
      DEFINED_PER_PLAN_SECURITY: null
  stock_class_id:
    kind: unmappable
    target: null
    reason: excluded-from-snapshot
  stock_class_ids:
    kind: unmappable
    target: null
    reason: excluded-from-snapshot
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+object_type&property_path=object_type) |
| `plan_name` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+plan_name&property_path=plan_name) |
| `board_approval_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+board_approval_date&property_path=board_approval_date) |
| `stockholder_approval_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+stockholder_approval_date&property_path=stockholder_approval_date) |
| `initial_shares_reserved` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+initial_shares_reserved&property_path=initial_shares_reserved) |
| `default_cancellation_behavior` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+default_cancellation_behavior&property_path=default_cancellation_behavior) |
| `stock_class_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+stock_class_id&property_path=stock_class_id) |
| `stock_class_ids` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FStockPlan.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FStockPlan.mapping.md&title=%5BMapping+question%5D+StockPlan%3A+stock_class_ids&property_path=stock_class_ids) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- OCF `StockPlan` has no retained pool-summary target in the June 22 bundle. `plan_name` still maps to the denormalized award plan-name fields on Option, RSA, and RSU records.
- `id`, `initial_shares_reserved`, `stock_class_id`, and `stock_class_ids` are explicitly excluded because `OptionPoolSummary` was removed; pool history and backing-class state cannot be represented in the retained bundle.
- Plan approval dates and `default_cancellation_behavior` have no Carta target. `comments` and `object_type` are OCF scaffolding.
