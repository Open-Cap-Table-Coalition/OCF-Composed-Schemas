---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/WarrantAcceptance.schema.json
ocf_object_type: TX_WARRANT_ACCEPTANCE
ocf_title: Object - Warrant Acceptance Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - security_id
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Warrant Acceptance Transaction → Carta

> Object describing a warrant acceptance transaction

## OCF schema

Source: [`WarrantAcceptance.schema.json`](./WarrantAcceptance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/WarrantAcceptance.schema.json",
  "title": "Object - Warrant Acceptance Transaction",
  "description": "Object describing a warrant acceptance transaction",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/acceptance/Acceptance.schema.json"
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
      "const": "TX_WARRANT_ACCEPTANCE"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "object_type",
    "date",
    "security_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/acceptance/WarrantAcceptance.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 5/5

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
      TX_WARRANT_ACCEPTANCE: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Object-level routing: Carta has no warrant-acceptance transaction, so this OCF object as a whole has no Carta home.** OCF models stakeholder acceptance of a warrant as its own first-class transaction object (`TX_WARRANT_ACCEPTANCE`), referencing the accepted warrant by `security_id`. Carta's warrant model is `WarrantIssuanceTransaction` / `WarrantExerciseTransaction` / `WarrantCancellationTransaction` / `WarrantTransferTransaction` (plus the `WarrantTransactionItem` bundle and `WarrantBlockSummary`) — there is **no** `WarrantAcceptanceTransaction` and no acceptance event in the warrant lifecycle. This matches the context note that Carta has no equivalent for OCF acceptance transactions: warrant acceptance is dropped wholesale.
- **Why `date` is `no-equivalent` (and not routable to an acceptance-date field).** Carta *does* carry a stakeholder-acceptance timestamp, but only on equity-comp and stock securities — `OptionGrant.stakeholderAcceptanceDate`, `RestrictedStockAward.stakeholderAcceptanceDate`, `RestrictedStockUnit.stakeholderAcceptanceDate` (all `Iso8601CompleteCalendarDate`), plus `Interest.acceptanceDate` (`Iso8601CompleteCalendarDateTime`). None of these is a warrant security/transaction, and there is no warrant analogue (`WarrantIssuanceTransaction` exposes only `issueDatetime` / `expirationDatetime`, never an acceptance date). So OCF's warrant-acceptance `date` has nowhere to land. Note also the granularity gap that would apply even if a home existed: OCF `date` is a calendar **date** (`types/Date.schema.json`, `format: date`), whereas Carta's acceptance fields on equity-comp securities are `Iso8601CompleteCalendarDate` (date) but `Interest.acceptanceDate` is a full **datetime** — a date-vs-datetime mismatch.
- **Why `security_id` is `no-equivalent`.** It is a foreign key onto the warrant security being accepted. Carta warrant transactions do reference a security via `securityId` (on `WarrantTransactionItem`), but only in the context of an issuance/exercise/cancellation/transfer — there is no acceptance transaction onto which this reference could be attached, so the reference has no destination. (Had a Carta warrant-acceptance transaction existed, `security_id` would route to its `securityId`; it does not.)
- `id`, `comments`, `object_type`: OCF object scaffolding (`ocf-internal`). `id` is OCF's own identifier (Carta assigns server-side ids); `object_type` is OCF's discriminator constant (`TX_WARRANT_ACCEPTANCE`) — Carta types transactions positionally by endpoint/def rather than via a stored discriminator, so the single const value remaps to `null`; `comments` is free-text OCF metadata with no Carta slot.
- Net result: **0 of 5 fields map.** Three are OCF-internal scaffolding and two (`date`, `security_id`) are genuinely absent from Carta because the warrant-acceptance concept itself is absent. This is consistent with the other acceptance transactions in this folder and with the Issuer precedent's treatment of scaffolding (`id`/`object_type`/`comments` → `ocf-internal`).
