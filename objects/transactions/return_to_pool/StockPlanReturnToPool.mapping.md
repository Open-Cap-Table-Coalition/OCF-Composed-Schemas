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
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Object - Stock Plan Return to Pool Transaction → Carta

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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

route_by_property:
  lookup_by:
    key: security_id
    through:
      mapping: ../issuance/EquityCompensationIssuance.mapping.md
      on_property: compensation_type
  exhaustive: true

shared:
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
      TX_STOCK_PLAN_RETURN_TO_POOL: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  security_id:
    kind: rename
    target:
      Option:
        - "#/$defs/OptionTransactionItem/properties/securityId"
        - "#/$defs/OptionGrant/properties/id"
        - "#/$defs/OptionGrant/properties/securityId"
      Rsu:
        - "#/$defs/RsuTransactionItem/properties/securityId"
        - "#/$defs/RestrictedStockUnit/properties/id"
        - "#/$defs/RestrictedStockUnit/properties/securityId"
      Sar: null
    inverse:
      role: reference-only
      note: Identifies the existing cancelled security; it does not reconstruct a return event.
  stock_plan_id:
    kind: unmappable
    target: null
    reason: target-definition-removed
  reason_text:
    kind: unmappable
    target: null
    reason: no-equivalent
  quantity:
    kind: rename
    target:
      Option: "#/$defs/OptionGrant/properties/returnedToPoolQuantity"
      Rsu:    "#/$defs/RestrictedStockUnit/properties/returnedToPoolQuantity"
      Sar:    null
    inverse:
      role: aggregate-projection
      note: Repeated return events are summed into a per-security total and cannot be split back deterministically.

variants:
  Option:
    when: [OPTION, OPTION_NSO, OPTION_ISO]
    primary_targets:
      - "#/$defs/OptionGrant"
      - "#/$defs/OptionTransactionItem"
    fields: {}

  Rsu:
    when: [RSU]
    primary_targets:
      - "#/$defs/RestrictedStockUnit"
      - "#/$defs/RsuTransactionItem"
    fields: {}

  Sar:
    when: [CSAR, SSAR]
    primary_targets: null
    fields: {}
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&title=%5BMapping+question%5D+StockPlanReturnToPool) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&title=%5BMapping+question%5D+StockPlanReturnToPool%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&title=%5BMapping+question%5D+StockPlanReturnToPool%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&title=%5BMapping+question%5D+StockPlanReturnToPool%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&title=%5BMapping+question%5D+StockPlanReturnToPool%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&title=%5BMapping+question%5D+StockPlanReturnToPool%3A+security_id&property_path=security_id) |
| `stock_plan_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&title=%5BMapping+question%5D+StockPlanReturnToPool%3A+stock_plan_id&property_path=stock_plan_id) |
| `reason_text` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&title=%5BMapping+question%5D+StockPlanReturnToPool%3A+reason_text&property_path=reason_text) |
| `quantity` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&title=%5BMapping+question%5D+StockPlanReturnToPool%3A+quantity&property_path=quantity) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Join on `security_id` to the compensation family. Carta has no return-to-pool transaction; Option/RSU quantity still maps to `returnedToPoolQuantity`. The pool-summary definition and SAR transaction-item definition were removed, so `stock_plan_id` and the entire SAR route are explicitly excluded.
- Repeated return events are summed into the aggregate and cannot be reconstructed as individual events. `date` and `reason_text` have no target; SAR quantity and OCF scaffolding remain unmappable.
