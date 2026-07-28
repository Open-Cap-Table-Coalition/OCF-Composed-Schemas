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
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Object - Stock Plan Pool Adjustment Transaction → Carta

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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  id:
    kind: unmappable
    target: null
    reason: ocf-internal
  comments:
    kind: unmappable
    target: null
    reason: ocf-internal
  object_type:
    kind: unmappable
    target: null
    reason: ocf-internal
    values:
      TX_STOCK_PLAN_POOL_ADJUSTMENT: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  stock_plan_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  board_approval_date:
    kind: unmappable
    target: null
    reason: no-equivalent
  stockholder_approval_date:
    kind: unmappable
    target: null
    reason: no-equivalent
  shares_reserved:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockPlanPoolAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockPlanPoolAdjustment.mapping.md&title=%5BMapping+question%5D+StockPlanPoolAdjustment) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockPlanPoolAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockPlanPoolAdjustment.mapping.md&title=%5BMapping+question%5D+StockPlanPoolAdjustment%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockPlanPoolAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockPlanPoolAdjustment.mapping.md&title=%5BMapping+question%5D+StockPlanPoolAdjustment%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockPlanPoolAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockPlanPoolAdjustment.mapping.md&title=%5BMapping+question%5D+StockPlanPoolAdjustment%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockPlanPoolAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockPlanPoolAdjustment.mapping.md&title=%5BMapping+question%5D+StockPlanPoolAdjustment%3A+date&property_path=date) |
| `stock_plan_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockPlanPoolAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockPlanPoolAdjustment.mapping.md&title=%5BMapping+question%5D+StockPlanPoolAdjustment%3A+stock_plan_id&property_path=stock_plan_id) |
| `board_approval_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockPlanPoolAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockPlanPoolAdjustment.mapping.md&title=%5BMapping+question%5D+StockPlanPoolAdjustment%3A+board_approval_date&property_path=board_approval_date) |
| `stockholder_approval_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockPlanPoolAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockPlanPoolAdjustment.mapping.md&title=%5BMapping+question%5D+StockPlanPoolAdjustment%3A+stockholder_approval_date&property_path=stockholder_approval_date) |
| `shares_reserved` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockPlanPoolAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockPlanPoolAdjustment.mapping.md&title=%5BMapping+question%5D+StockPlanPoolAdjustment%3A+shares_reserved&property_path=shares_reserved) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta has no option-pool adjustment transaction or writable pool-adjustment history. The OCF event's `date`, `stock_plan_id`, approval dates, and `shares_reserved` are `no-equivalent`.
- `id`, `comments`, and `object_type` are OCF scaffolding.
