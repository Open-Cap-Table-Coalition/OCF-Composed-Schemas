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
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 8/8

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

## Notes / open questions

- Bucket: **n/a-object** (`ocf_kind: object`). This is an OCF *transaction* object, so it maps its own properties onto the corresponding Carta transaction + the security/state object it references. As with the sibling `IssuerAuthorizedSharesAdjustment`, the blocking fact is that **Carta has no corresponding adjustment transaction** — but, unlike the issuer-level sibling, the *resulting state* this event produces (a stock class's new authorized-share count) **does** have a Carta home on `ShareClass`. So the two payload fields that name the share class and its new authorized total are mappable to that state field; the event/governance fields are not.
- **Why no host transaction.** Carta's transaction set is entirely security-level (per the `=== CARTA TRANSACTION/SECURITY SURFACE ===` inventory, confirmed against the bundle): the `Certificate*`, `Option*`, `Convertible*`, `Warrant*`, `Rsa*`, `Rsu*`, `Sar*` families, each hanging off a security (`shareClassId`, `equityPlanId`, `precededBySecurityId`, …) and an `*Datetime`. None of them is a share-class-charter amendment, and Carta has **no** `StockClassAuthorizedSharesAdjustment`, no adjustment family at all, and no generic "amend authorized shares" event. This matches the context note that Carta has no equivalent for OCF adjustment (authorized-shares/pool/ratio) transactions. The adjustment is therefore not recorded as an *event* in Carta; it is collapsed into the current state of the `ShareClass`.
- **Where the result lives.** Carta's `ShareClass` is the per-stock-class state object and carries `authorizedShareCount` (`Decimal`) — the exact quantity this OCF transaction sets — and `id` (the share-class identifier). This is the distinction from the issuer-level sibling: there, no Carta object holds an *issuer-wide* authorized total (`Issuer`/`Corporation` carry none, and `CapitalizationTableSummary` tracks only fully-diluted/outstanding/cash-raised), so every field was `no-equivalent`. Here the destination field genuinely exists, so the mapping writes the post-event values onto it.
- Field-by-field justification:
    - `new_shares_authorized` (`Numeric`; the required payload of the event — the new authorized count for this stock class as of the transaction): **rename → `ShareClass.authorizedShareCount`**. This is the share-class authorized-share count Carta stores, and the OCF event's whole purpose is to set it. Lossy/representation note: the value lands on a *state* field, not an event log — applying this OCF transaction means overwriting `ShareClass.authorizedShareCount`, so Carta retains only the latest authorized figure, not the history of adjustments (date, prior value, approvals). Type note: OCF `Numeric` (fixed-point decimal *string*, up to 10 dp) → Carta `Decimal`; both are decimal quantities, so the round-trip is value-preserving for share counts.
    - `stock_class_id` (FK to the OCF `StockClass` being amended): **rename → `ShareClass.id`**. Carta's `ShareClass.id` is the identifier of the same share-class concept; this OCF FK selects which `ShareClass` row receives the new `authorizedShareCount`. (It is a foreign-key reference in OCF rather than the object's own `id`, but it resolves to the same Carta share-class identity, which is where the adjustment must be applied.)
    - `date` (OCF `Date`; date the adjustment took effect): **no-equivalent**. With no host transaction in Carta there is no `*Datetime` slot to carry it, and `ShareClass` has no effective-date field for an authorized-share change. (Granularity mismatch that would apply even if a host existed: OCF uses a calendar `Date`, whereas Carta transaction timestamps are `Iso8601CompleteCalendarDateTime`.)
    - `board_approval_date`, `stockholder_approval_date` (governance approval dates for the charter amendment): **no-equivalent**. Carta models board approval only as `BoardApproval` attached to *security/grant* issuance, not to share-class authorized-share amendments, and has no stockholder-approval concept at all. `ShareClass` exposes neither approval date.
    - `id`, `comments`, `object_type`: **ocf-internal** OCF object scaffolding. `id` is OCF's transaction identifier (Carta assigns its own server-side); `comments` has no Carta slot; `object_type` is OCF's discriminator constant (`TX_STOCK_CLASS_AUTHORIZED_SHARES_ADJUSTMENT`) — Carta types transactions positionally per endpoint, and there is no Carta adjustment transaction to remap it to, so `values` is `null`.
- Net: the *event* (with its date and governance approvals) is outside Carta's modeled surface and is unmappable, but the *outcome* it produces — a stock class's new authorized-share count keyed by share-class id — maps cleanly onto Carta's `ShareClass` state. This is the intended "still map any field that genuinely has a home" outcome for an otherwise no-equivalent OCF transaction.
