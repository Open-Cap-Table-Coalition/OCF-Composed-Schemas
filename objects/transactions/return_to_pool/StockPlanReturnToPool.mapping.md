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
target_version: "v1alpha1 (2026-04-30)"
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
        - "#/$defs/OptionGrant/properties/securityId"
      Rsu:
        - "#/$defs/RsuTransactionItem/properties/securityId"
        - "#/$defs/RestrictedStockUnit/properties/securityId"
      Sar: "#/$defs/SarTransactionItem/properties/securityId"
  stock_plan_id:
    kind: rename
    target: "#/$defs/OptionPoolSummary/properties/optionPoolId"
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
    primary_targets:
      - "#/$defs/SarTransactionItem"
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

- **No Carta return transaction, but the security aggregate is mappable.** OCF `TX_STOCK_PLAN_RETURN_TO_POOL` is a discrete event recording that a quantity of plan-security shares was returned to a named pool. Carta has no return-to-pool transaction, so the event date/reason do not land on a transaction. The security id and quantity do have faithful aggregate homes: the resolved Option/RSU security's `securityId` and `returnedToPoolQuantity`; `stock_plan_id` also identifies `OptionPoolSummary.optionPoolId`.
- **Why the mapping is aggregate, not transactional.** Carta represents an option pool as a read-model summary and has no return line item. The mapping preserves the per-security aggregate quantity and pool identity, while the importer aggregates repeated OCF return events rather than emitting a fabricated Carta transaction.
- **The cancellation that triggers the return remains a separate event.** The nearest Carta transaction, `#/$defs/OptionCancellationTransaction`, records cancellation itself, not the destination pool. The mapping therefore does not conflate the two transactions; it places the return quantity on the security's aggregate field and preserves the explicit destination pool id.
- **Per-field justification:**
    - `quantity` (`Numeric`, shares returned) → `OptionGrant.returnedToPoolQuantity` / `RestrictedStockUnit.returnedToPoolQuantity` for the joined family. The importer aggregates repeated return events for the same security.
    - `stock_plan_id` (target pool) → `OptionPoolSummary.optionPoolId`. If the return targets a rollover pool, the explicit destination id is retained even when it differs from the issuing plan.
    - `security_id` (the cancelled security whose shares are returned) → the joined Option/RSU security and its transaction-item anchor. SAR has no security object, so only its item id is retained.
    - `reason_text` (free-text reason for the return): no-equivalent. Carta has no return-to-pool record and no free-text reason field for one. (`OptionCancellationTransaction.reason` is a constrained `OptionCancellationReason` enum on the *cancellation*, not a free-text return reason.)
    - `date` (calendar date of the return): no-equivalent. No Carta transaction exists to date. Note also the granularity gap: OCF transaction `date` is a calendar `Date`, whereas Carta transaction timestamps are `Iso8601CompleteCalendarDateTime` (datetime) — but moot here since there is no target transaction.
    - `id`, `comments`, `object_type`: ocf-internal. `id` is OCF's object identifier (Carta assigns its own server-side); `comments` has no Carta slot; `object_type` (`TX_STOCK_PLAN_RETURN_TO_POOL`) is OCF's transaction discriminator — Carta types transactions positionally per `$def`/endpoint and has no return-to-pool member to remap the constant onto, so it is recorded as `values: { TX_STOCK_PLAN_RETURN_TO_POOL: null }`.
