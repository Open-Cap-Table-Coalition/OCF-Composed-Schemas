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
target_version: v1alpha1 (2026-04-30)
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
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
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

## Notes / open questions

- Bucket: **n/a-object** (`ocf_kind: object`). This is an OCF *transaction* object, so it would normally map its own properties onto the corresponding Carta transaction + the security/structure it references. The blocking fact here is that **Carta has no corresponding transaction**: the entire OCF stock-plan pool-adjustment event has no Carta home, so every field is unmappable. This is the pool-level analog of the sibling `IssuerAuthorizedSharesAdjustment` (also fully unmappable on main) and follows the same reasoning.
- Carta's transaction set is entirely **security-level** issuance / cancellation / exercise / transfer / settlement (confirmed by enumerating every `*Transaction` $def in the bundle): the `Certificate`, `Option`, `Convertible`, `Warrant`, `Rsa`, `Rsu`, `Sar`, `Piu`, and `Phantom` families. Each Carta transaction hangs off a security and an `*Datetime`. **None** of them is a stock-plan / option-pool-level event, and Carta has no `StockPlanPoolAdjustment`, no adjustment family at all, and no generic "resize the option pool" transaction. This matches the context note that Carta has no equivalent for OCF adjustment (authorized-shares / pool / ratio) transactions.
- There is also no writeable Carta *state* field that this transaction's result (the new pool reservation) could be posted to. The only place in the whole bundle that holds a per-pool authorized count is `OptionPoolSummary.authorizedShares` (a bare `Decimal`), but `OptionPoolSummary` is an **orphan summary** $def — it is *defined* (line 1687 of the bundle) yet **referenced by nothing**; the only pool summary actually wired into the model is `StakeholderOptionPoolSummary` (referenced from the stakeholder summary at line 3063), and that one carries no authorized-shares field at all. A read-only, unreferenced summary structure is not a transaction destination, so even the resulting pool-reservation state has no Carta home. (This is the same conclusion the `IssuerAuthorizedSharesAdjustment` precedent reached about `OptionPoolSummary.authorizedShares`.)
- Field-by-field justification:
    - `shares_reserved` (`Numeric`; the required payload of the event — the new pool size reserved by the board as of the effective date): **no-equivalent**. No Carta transaction stores a pool-reservation figure, and the only per-pool authorized count (`OptionPoolSummary.authorizedShares`) lives on an unreferenced summary $def that nothing reads or writes (see above). Carta records no event by which the pool size would change.
    - `date` (OCF `Date`; date the adjustment took effect): **no-equivalent**. With no host transaction in Carta, there is no `*Datetime` slot to carry it. (Note the granularity mismatch that would apply even if a host existed: OCF uses a calendar `Date`, whereas Carta transaction timestamps are `Iso8601CompleteCalendarDateTime`.)
    - `stock_plan_id` (FK to the OCF `StockPlan` whose pool is being resized): **no-equivalent**. Carta has no standalone equity-plan / stock-plan object. It *does* carry an `equityPlanId` string FK, but only on its **security-issuance** transactions (`equityPlanId` appears on `CertificateIssuanceTransaction`, `OptionIssuanceTransaction`, `PhantomIssuanceTransaction`, `PiuIssuanceTransaction`, `RsaIssuanceTransaction`, `RsuIssuanceTransaction`, `SarIssuanceTransaction`), where it records "the identifier of the equity plan from which the [award] was issued" — i.e. it tags an individual grant with its source plan. That is a different concept from this transaction's subject FK, and there is no pool-scoped / pool-adjustment transaction in Carta to attach this FK to, so the `stock_plan_id` of a pool-resize event has no Carta field to receive it. (The only pool *identifier* per se, `OptionPoolSummary.optionPoolId`, sits on the orphan summary above.) Mapping `stock_plan_id` to an issuance transaction's `equityPlanId` would be semantically wrong: this event issues no security.
    - `board_approval_date`, `stockholder_approval_date` (governance approval dates for the pool change — the stockholder date specifically supports the US ISO shareholder-approval window): **no-equivalent**. Carta *does* model board approval at the **individual-grant** level — both a status enum (`BoardApproval`: `BOARD_APPROVAL_APPROVED` / `BOARD_APPROVAL_NOT_APPROVED`) and an actual `boardApprovalDate` (`Iso8601CompleteCalendarDate`) on the per-award security objects `OptionGrant`, `RestrictedStockAward`, and `RestrictedStockUnit`. But those approval dates record when *that specific grant* was board-approved, not when a stock-plan **pool** was resized; there is no pool-level / plan-level board-approval-date field anywhere in the bundle, and no pool-adjustment transaction to host one. Carta has no stockholder-approval concept at all (no `stockholderApprovalDate`, no ISO shareholder-approval-window field). So neither approval *date* of a pool-resize event has a Carta home — mapping them onto a grant's `boardApprovalDate` would be semantically wrong (different subject, and no grant is being created here).
    - `id`, `comments`, `object_type`: **ocf-internal** OCF object scaffolding. `id` is OCF's identifier (Carta assigns its own server-side); `comments` has no Carta slot; `object_type` is OCF's discriminator constant (`TX_STOCK_PLAN_POOL_ADJUSTMENT`), which Carta does not need (it types transactions positionally per endpoint) — and in any case there is no Carta transaction type to remap it to, so `values` is `null`.
- Net: this is one of the OCF transactions the context flags as expected to be "mostly unmappable / no-equivalent." Here it is **fully** unmappable — both the pool-adjustment event itself and the resulting option-pool reservation state are outside Carta's modeled (writeable) surface.
