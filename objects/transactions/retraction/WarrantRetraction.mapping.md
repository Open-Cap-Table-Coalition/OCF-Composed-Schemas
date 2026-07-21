---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/retraction/WarrantRetraction.schema.json
ocf_object_type: TX_WARRANT_RETRACTION
ocf_title: Object - Warrant Retraction Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - security_id
  - reason_text
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Warrant Retraction Transaction → Carta

> Object describing a retraction of a warrant security

## OCF schema

Source: [`WarrantRetraction.schema.json`](./WarrantRetraction.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/retraction/WarrantRetraction.schema.json",
  "title": "Object - Warrant Retraction Transaction",
  "description": "Object describing a retraction of a warrant security",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/retraction/Retraction.schema.json"
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
      "const": "TX_WARRANT_RETRACTION"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "reason_text": {
      "description": "Reason for the retraction",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/retraction/WarrantRetraction.schema.json",
  "required": [
    "id",
    "object_type",
    "date",
    "security_id",
    "reason_text"
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
    reason: no-equivalent
    values:
      TX_WARRANT_RETRACTION: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  reason_text:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Carta has no retraction transaction, so this entire object is unmappable.** A retraction in OCF voids a previously-recorded transaction that was entered in error or that the issuer chose to undo — it is a correction/withdrawal of a record, distinct from a *cancellation* (which terminates a live security). Carta's warrant transaction surface, modeled by `WarrantTransactionItem` (`#/$defs/WarrantTransactionItem`), exposes only `issuance`, `exercises[]`, `transfers[]`, and `cancellations[]` — there is no retraction array and no retraction transaction `$def`. A full-text scan of the pinned bundle for `retract*` / `reasonText` / `reason_text` returns nothing. So none of the six OCF fields has a Carta home.
- `reason_text` (free-text reason for the retraction) has no Carta counterpart. The only `reason` fields in the Carta bundle are the constrained **cancellation** enums (`WarrantCancellationReason`, `CertificateCancellationReason`, `OptionCancellationReason`, etc.), each carried by a `*CancellationTransaction`. `WarrantCancellationReason` allows only `WARRANT_CANCELLATION_REASON_{CANCELED,LIFETIME_ENDED,TRANSFERRED}` — semantics that describe *why a security was cancelled*, not *why a prior record was retracted*. They are not a destination for OCF's free-form retraction reason: the concept (correction of an erroneous record), the field type (free text vs. closed enum), and the host transaction (cancellation vs. retraction) all differ. Mapping `reason_text` there would be semantically wrong, so it is left `no-equivalent` rather than forced onto a cancellation-reason enum.
- `security_id` is OCF's reference to the warrant whose record is being retracted. Carta does use `securityId` (a string foreign key) on its transaction/security items — e.g. `WarrantTransactionItem.securityId` — but only to anchor *supported* transactions to a security. Because the retraction transaction itself does not exist in Carta, there is no Carta record for this `security_id` to populate; it is marked `no-equivalent` rather than pointed at an unrelated object's foreign key.
- `date` — OCF records a calendar `Date`; Carta's transactions use `Iso8601CompleteCalendarDateTime` (a datetime) on their `*Datetime` fields. The date-vs-datetime granularity difference is moot here regardless, because there is no Carta retraction transaction to host a date.
- `object_type` is the OCF discriminator constant `TX_WARRANT_RETRACTION`. There is no Carta transaction type to remap it to (Carta types transactions positionally by which array/`$def` they appear in, and it has no retraction type), so this is `no-equivalent` rather than `enum-remap`; the single OCF enum value `TX_WARRANT_RETRACTION` is listed and maps to `null`. (Contrast Carta's *supported* warrant events, which carry no `object_type` discriminator at all.)
- `id` and `comments` are OCF object scaffolding (per the `Object` primitive). `id` is OCF's own identifier and Carta assigns identifiers server-side; `comments` has no Carta slot on any transaction. Both are marked `ocf-internal`, consistent with the Issuer/Document precedents. (`object_type` is classified `no-equivalent` rather than `ocf-internal` here because — unlike `id`/`comments` — its content is a transaction-type signal whose closest Carta analog, a transaction `$def`, genuinely does not exist for retractions.)
- This matches the broader pattern for OCF transactions Carta does not model: per the transaction-surface guidance, Carta has **no equivalent for retraction** (alongside acceptance, adjustment, change-event, consolidation, reissuance, release, repricing, repurchase, return-to-pool, and stock-split). The four sibling retraction transactions (`StockRetraction`, `EquityCompensationRetraction`, `PlanSecurityRetraction`, `ConvertibleRetraction`) carry the identical field set and reach the same all-unmappable result.
