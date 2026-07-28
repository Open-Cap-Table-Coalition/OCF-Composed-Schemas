---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/adjustment/StockClassAuthorizedSharesAdjustment.schema.json
ocf_object_type: TX_STOCK_CLASS_AUTHORIZED_SHARES_ADJUSTMENT
ocf_title: Object - Stock Class Authorized Shares Adjustment Transaction
ocf_kind: object
required_fields:
  - new_shares_authorized
  - id
  - object_type
  - date
  - stock_class_id
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Stock Class Authorized Shares Adjustment Transaction → Carta

> Object describing an event to change the number of authorized shares of a stock class.

## OCF schema

Source: [`StockClassAuthorizedSharesAdjustment.schema.json`](./StockClassAuthorizedSharesAdjustment.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/adjustment/StockClassAuthorizedSharesAdjustment.schema.json",
  "title": "Object - Stock Class Authorized Shares Adjustment Transaction",
  "description": "Object describing an event to change the number of authorized shares of a stock class.",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/Transaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/StockClassTransaction.schema.json"
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
      "const": "TX_STOCK_CLASS_AUTHORIZED_SHARES_ADJUSTMENT"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stock_class_id": {
      "description": "Identifier of the StockClass object, a subject of this transaction",
      "type": "string"
    },
    "new_shares_authorized": {
      "description": "The new number of shares authorized for this stock class as of the event of this transaction",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "board_approval_date": {
      "description": "Date on which the board approved the change to the stock class",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stockholder_approval_date": {
      "description": "This optional field tracks when the stockholders approved the change to the stock class.",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "new_shares_authorized",
    "id",
    "object_type",
    "date",
    "stock_class_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/adjustment/StockClassAuthorizedSharesAdjustment.schema.json"
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
      TX_STOCK_CLASS_AUTHORIZED_SHARES_ADJUSTMENT: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  stock_class_id:
    kind: rename
    target: "#/$defs/ShareClass/properties/id"
  new_shares_authorized:
    kind: rename
    target: "#/$defs/ShareClass/properties/authorizedShareCount"
  board_approval_date:
    kind: unmappable
    target: null
    reason: no-equivalent
  stockholder_approval_date:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassAuthorizedSharesAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassAuthorizedSharesAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassAuthorizedSharesAdjustment) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassAuthorizedSharesAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassAuthorizedSharesAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassAuthorizedSharesAdjustment%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassAuthorizedSharesAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassAuthorizedSharesAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassAuthorizedSharesAdjustment%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassAuthorizedSharesAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassAuthorizedSharesAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassAuthorizedSharesAdjustment%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassAuthorizedSharesAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassAuthorizedSharesAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassAuthorizedSharesAdjustment%3A+date&property_path=date) |
| `stock_class_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassAuthorizedSharesAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassAuthorizedSharesAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassAuthorizedSharesAdjustment%3A+stock_class_id&property_path=stock_class_id) |
| `new_shares_authorized` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassAuthorizedSharesAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassAuthorizedSharesAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassAuthorizedSharesAdjustment%3A+new_shares_authorized&property_path=new_shares_authorized) |
| `board_approval_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassAuthorizedSharesAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassAuthorizedSharesAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassAuthorizedSharesAdjustment%3A+board_approval_date&property_path=board_approval_date) |
| `stockholder_approval_date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fadjustment%2FStockClassAuthorizedSharesAdjustment.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fadjustment%2FStockClassAuthorizedSharesAdjustment.mapping.md&title=%5BMapping+question%5D+StockClassAuthorizedSharesAdjustment%3A+stockholder_approval_date&property_path=stockholder_approval_date) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta has no share-class adjustment transaction, so the event history and `date` are not retained. The resulting state is mappable: `stock_class_id` selects `ShareClass.id`, and `new_shares_authorized` updates `ShareClass.authorizedShareCount`.
- Approval dates and OCF scaffolding (`id`, `comments`, `object_type`) have no target.
