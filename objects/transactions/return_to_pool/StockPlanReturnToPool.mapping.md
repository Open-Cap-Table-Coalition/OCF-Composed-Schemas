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
      TX_STOCK_PLAN_RETURN_TO_POOL: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  stock_plan_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  reason_text:
    kind: unmappable
    target: null
    reason: no-equivalent
  quantity:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&title=%5BMapping+question%5D+StockPlanReturnToPool) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&title=%5BMapping+question%5D+StockPlanReturnToPool+%2F+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&title=%5BMapping+question%5D+StockPlanReturnToPool+%2F+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&title=%5BMapping+question%5D+StockPlanReturnToPool+%2F+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&title=%5BMapping+question%5D+StockPlanReturnToPool+%2F+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&title=%5BMapping+question%5D+StockPlanReturnToPool+%2F+security_id&property_path=security_id) |
| `stock_plan_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&title=%5BMapping+question%5D+StockPlanReturnToPool+%2F+stock_plan_id&property_path=stock_plan_id) |
| `reason_text` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&title=%5BMapping+question%5D+StockPlanReturnToPool+%2F+reason_text&property_path=reason_text) |
| `quantity` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freturn_to_pool%2FStockPlanReturnToPool.mapping.md&title=%5BMapping+question%5D+StockPlanReturnToPool+%2F+quantity&property_path=quantity) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Bucket: n/a-object — whole transaction unmappable (no Carta equivalent).** OCF `TX_STOCK_PLAN_RETURN_TO_POOL` is a discrete event recording that, upon a security's cancellation/forfeiture, a specific `quantity` of shares was returned to a named stock-plan pool (`stock_plan_id`) so they become re-issuable. Carta's transaction set has no return-to-pool transaction. Carta's transaction `$def`s are issuance / cancellation / exercise / settlement / transfer only (e.g. `OptionIssuanceTransaction`, `OptionCancellationTransaction`, `OptionExerciseTransaction`, plus the Certificate/Convertible/Warrant/Rsa/Rsu/Sar/Phantom/Piu families). None models replenishing a pool, so there is no Carta object whose fields can host any of this OCF transaction's properties.
- **Why pool replenishment is implicit in Carta, not a transaction.** Carta represents an option pool as a read-model summary, `#/$defs/OptionPoolSummary` — `{optionPoolId, shareClassId, fullyDilutedShares, outstandingEquityAwardDerivatives, outstandingCommittedRestrictedStockAwards, name, authorizedShares (Decimal), terminatedDatetime}` — plus the stakeholder-scoped `#/$defs/StakeholderOptionPoolSummary`. These are *aggregate states*, not event records: when a grant is cancelled, the shares re-enter the available pool implicitly via Carta's recomputed `authorizedShares` / `outstandingEquityAwardDerivatives`, with no discrete "return" line item. There is therefore no slot to record *which* event returned *how many* shares to *which* pool.
- **The cancellation that triggers the return carries no return-to-pool data either.** The nearest Carta transaction, `#/$defs/OptionCancellationTransaction`, exposes only `{effectiveDatetime, reason (OptionCancellationReason enum), quantity (Decimal), terminationDatetime, forfeitureDatetime}`. It records the *cancellation* of a grant, not a return to a *destination pool*; it has no field for a target `stock_plan_id` and is a different event than OCF's separate return-to-pool transaction. Mapping OCF `quantity`/`security_id` onto it would conflate two distinct OCF transactions, so it is not used as a target here.
- **Per-field justification (all unmappable):**
    - `quantity` (`Numeric`, shares returned): no-equivalent. Carta has no return-to-pool transaction to carry it; the analogous figure only exists as a recomputed aggregate inside `OptionPoolSummary` (e.g. `authorizedShares` / `outstandingEquityAwardDerivatives`), not as a per-event delta. `OptionPoolSummary` carries no `securityId`/`securityLabel` or event date, so it cannot represent "these N shares from this security on this date returned to this pool."
    - `stock_plan_id` (target pool): no-equivalent. Carta identifies pools by `OptionPoolSummary.optionPoolId`, but that lives on a summary object, not on any transaction, and there is no transaction here to reference it. OCF notes the return pool need not be the issuing pool (plan rollovers), a distinction Carta's summary model does not record per event.
    - `security_id` (the cancelled security whose shares are returned): no-equivalent. The Carta transactions reference a security via `securityId`/`securityLabel`, but none of those is a return-to-pool transaction, so there is no Carta home for this reference in this context.
    - `reason_text` (free-text reason for the return): no-equivalent. Carta has no return-to-pool record and no free-text reason field for one. (`OptionCancellationTransaction.reason` is a constrained `OptionCancellationReason` enum on the *cancellation*, not a free-text return reason.)
    - `date` (calendar date of the return): no-equivalent. No Carta transaction exists to date. Note also the granularity gap: OCF transaction `date` is a calendar `Date`, whereas Carta transaction timestamps are `Iso8601CompleteCalendarDateTime` (datetime) — but moot here since there is no target transaction.
    - `id`, `comments`, `object_type`: ocf-internal. `id` is OCF's object identifier (Carta assigns its own server-side); `comments` has no Carta slot; `object_type` (`TX_STOCK_PLAN_RETURN_TO_POOL`) is OCF's transaction discriminator — Carta types transactions positionally per `$def`/endpoint and has no return-to-pool member to remap the constant onto, so it is recorded as `values: { TX_STOCK_PLAN_RETURN_TO_POOL: null }`.
