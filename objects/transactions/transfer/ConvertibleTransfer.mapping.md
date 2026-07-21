---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/transfer/ConvertibleTransfer.schema.json
ocf_object_type: TX_CONVERTIBLE_TRANSFER
ocf_title: Object - Convertible Transfer Transaction
ocf_kind: object
required_fields:
  - amount
  - id
  - object_type
  - date
  - security_id
  - resulting_security_ids
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Convertible Transfer Transaction → Carta

> Object describing a transfer or secondary sale of a convertible security

## OCF schema

Source: [`ConvertibleTransfer.schema.json`](./ConvertibleTransfer.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/transfer/ConvertibleTransfer.schema.json",
  "title": "Object - Convertible Transfer Transaction",
  "description": "Object describing a transfer or secondary sale of a convertible security",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/transfer/Transfer.schema.json"
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
      "const": "TX_CONVERTIBLE_TRANSFER"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "consideration_text": {
      "description": "Unstructured text description of consideration provided in exchange for security transfer",
      "type": "string"
    },
    "balance_security_id": {
      "description": "Identifier for the security that holds the remainder balance (for partial transfers)",
      "type": "string"
    },
    "resulting_security_ids": {
      "title": "Security Transfer - Resulting Security ID Array",
      "description": "Array of identifiers for new security (or securities) created as a result of the transaction",
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "amount": {
      "description": "Amount of monetary value transferred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "amount",
    "id",
    "object_type",
    "date",
    "security_id",
    "resulting_security_ids"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/transfer/ConvertibleTransfer.schema.json"
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
      TX_CONVERTIBLE_TRANSFER: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  consideration_text:
    kind: unmappable
    target: null
    reason: no-equivalent
  balance_security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  resulting_security_ids:
    kind: unmappable
    target: null
    reason: no-equivalent
  amount:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Whole object has no Carta equivalent (bucket n/a-object, all nine fields unmappable).** OCF `TX_CONVERTIBLE_TRANSFER` records a transfer / secondary sale of a convertible security: the original `security_id` is (partially) moved, producing one or more `resulting_security_ids`, optionally leaving a `balance_security_id` remainder, for a transferred `amount` of monetary value and an optional `consideration_text`. **Carta models no transfer event for convertibles.** Carta's only transfer transaction in the pinned bundle (`target-schema/Carta.schema.json`) is `#/$defs/WarrantTransferTransaction` (warrants only); grepping the bundle for `Transfer` returns just `WarrantTransferTransaction`, `transferredDatetime`, and `transfers` (the latter being `#/$defs/WarrantTransactionItem.transfers`, a warrant-only array). The convertible lifecycle container `#/$defs/ConvertibleTransactionItem` groups only `issuance` (`ConvertibleIssuanceTransaction`) and `cancellations` (`ConvertibleCancellationTransaction`) — there is **no** convertible transfer transaction and no slot to host one. With no host object, every property is `unmappable`.
- `amount` (OCF `types/Monetary`, the monetary value transferred) — **no-equivalent.** Although Carta has a `Money` type (`#/$defs/Money`) and convertible amounts live on issuance/cancellation (`ConvertibleIssuanceTransaction.principal`, `ConvertibleCancellationTransaction.principal`, both `Money`), those `principal` fields belong to issuance/cancellation events, not a transfer, and represent the note's face principal — not a secondary-sale consideration. There is no Carta transfer transaction for the transferred amount to land in, so it is dropped. (Note: OCF `amount` here is the *value transferred* in a secondary sale, which Carta does not capture for any security type.)
- `consideration_text` (free-text description of consideration given for the transfer) — **no-equivalent.** Carta has no free-text consideration field on any convertible transaction; the convertible objects carry only structured economic terms (principal, interest, valuation cap, discount), not narrative consideration. Dropped.
- `resulting_security_ids` (array of new convertible-security identifiers created by the transfer) — **no-equivalent.** Carta's only transfer that produces a resulting security is the warrant one (`WarrantTransferTransaction.resultingSecurityId` / `resultingSecurityLabel`, a single id, warrant-only). There is no convertible analogue. Note also a shape mismatch: OCF allows an *array* of resulting securities (a single transfer can fan out to several new notes), whereas Carta's warrant transfer models only one resulting security — so even the closest concept is structurally narrower. No convertible target exists, so this is dropped.
- `balance_security_id` (FK to the security holding the remainder after a partial transfer) — **no-equivalent.** Carta has no notion of a "balance"/remainder security on a transfer (its warrant transfer carries only a single `resultingSecurityId`, no remainder pointer), and there is no convertible transfer at all. Dropped.
- `security_id` (FK identifying which convertible the transfer applies to) — **no-equivalent.** Carta's convertible transactions are referenced positionally inside `ConvertibleTransactionItem` (which holds the `securityId` once at the item level) rather than each transaction carrying its own generic security reference. With no convertible transfer transaction in Carta, this FK has nowhere to route.
- `date` (OCF `types/Date`, a calendar date) — **no-equivalent.** Carta does timestamp convertible events (`ConvertibleIssuanceTransaction.issueDatetime`, `ConvertibleCancellationTransaction.effectiveDatetime`, both `#/$defs/Iso8601CompleteCalendarDateTime`), but those live on issuance/cancellation, which have no transfer counterpart. So there is no Carta field for this transfer's date to occupy. (General OCF→Carta granularity gap also applies: OCF transaction `date` is a calendar DATE while Carta uses DATETIME — relevant only had a host transaction existed.)
- `id`, `comments`, `object_type` — **ocf-internal** OCF object scaffolding. `id` is OCF's own object identifier (Carta assigns identifiers server-side); `object_type` is the OCF discriminator constant `TX_CONVERTIBLE_TRANSFER` (Carta types transactions positionally per container/endpoint, so the single enum value has no Carta enum to remap onto — `TX_CONVERTIBLE_TRANSFER: null`); `comments` has no Carta slot.
- Consistency: this matches the sibling convertible-transaction treatments — `ConvertibleRetraction` (complete, all unmappable) — and the general guidance that Carta's transaction set is strictly smaller than OCF's. Of the OCF transfer family, only `WarrantTransfer` has a partial Carta home (`WarrantTransferTransaction`); the stock/convertible/equity-comp/plan-security transfers have no Carta transfer transaction and are wholly unmappable.
