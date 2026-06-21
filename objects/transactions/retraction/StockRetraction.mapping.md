---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/retraction/StockRetraction.schema.json
ocf_object_type: TX_STOCK_RETRACTION
ocf_title: Object - Stock Retraction Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - security_id
  - reason_text
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Stock Retraction Transaction → Carta

> Object describing a retraction of a stock security

## OCF schema

Source: [`StockRetraction.schema.json`](./StockRetraction.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/retraction/StockRetraction.schema.json",
  "title": "Object - Stock Retraction Transaction",
  "description": "Object describing a retraction of a stock security",
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
      "const": "TX_STOCK_RETRACTION"
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
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/retraction/StockRetraction.schema.json",
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
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 6/6

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
      TX_STOCK_RETRACTION: null
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

- **Carta has no retraction transaction, so the whole object is unmappable.** A grep for `retract` / `reversal` / `correct` across the pinned bundle (`target-schema/Carta.schema.json`) and the `/tmp/carta-index.json` def index returns nothing. Carta's stock-transaction surface is the `Certificate*Transaction` family: `CertificateIssuanceTransaction` and `CertificateCancellationTransaction`. Neither models a retraction.
- **Retraction ≠ cancellation.** In OCF a retraction (`primitives/objects/transactions/retraction/Retraction.schema.json`, which this object composes via `allOf`) *withdraws a previously-recorded transaction* — i.e., it asserts the earlier transaction should not have been recorded at all (a data-correction / reversal against the ledger). A cancellation is a real-world corporate event that retires an outstanding security. Carta only models the latter. Carta's nearest field, `CertificateCancellationTransaction.reason`, is a closed enum (`CertificateCancellationReason`: `CERTIFICATE_CANCELLATION_REASON_CANCELED`, `…_TERMINATED`, `…_TERMINATION_FORFEITED`, `…_REPURCHASED`, `…_TRANSFERRED`, `…_SHARE_CLASS_CONVERTED`) — every member denotes a genuine cancellation cause, none denotes "this entry was retracted." Re-routing a retraction into a cancellation would fabricate a corporate event that never happened, so it is deliberately *not* mapped.
- Per-field justification:
    - `object_type` (const `TX_STOCK_RETRACTION`): the discriminator for the retraction concept itself. Because Carta has no retraction transaction there is no target enum to remap onto — hence `no-equivalent` (not `ocf-internal`). The single OCF enum value `TX_STOCK_RETRACTION` is listed under `values:` and maps to `null`. (Contrast `id`/`comments`, which are scaffolding present on every OCF object and therefore `ocf-internal`.)
    - `date`: OCF records the calendar date the retraction took effect (`types/Date.schema.json`, an `Iso8601CompleteCalendarDate`-style value). Carta's transaction timestamps are `Iso8601CompleteCalendarDateTime` (e.g. `CertificateCancellationTransaction.effectiveDatetime`), and they live on transaction types Carta actually has. Since there is no Carta retraction transaction, there is no datetime field to carry this date — `no-equivalent`. (Even where Carta *does* have an analogous transaction, note the date-vs-datetime granularity gap: OCF stores a DATE, Carta a DATETIME.)
    - `security_id`: the foreign key to the stock security being retracted. Carta does carry `securityId` on its security objects (`Certificate.securityId`) and transaction-item objects (`CertificateTransactionItem.securityId`), so the *identifier concept* exists — but only on issuance/cancellation transactions. With no retraction transaction to attach it to, there is nowhere to record "the security whose prior transaction is being retracted." `no-equivalent`.
    - `reason_text`: free-text reason for the retraction. Carta has no free-text reason field on any transaction; the only `reason`-named fields are closed enums (`CertificateCancellationReason`, etc.) scoped to cancellation/preceded-by semantics. There is no free-text or retraction-scoped reason slot, so this drops. `no-equivalent`.
    - `id`, `comments`: OCF object scaffolding. `id` is OCF's own identifier (Carta assigns identifiers server-side); `comments` has no Carta slot. Both `ocf-internal`.
- Object-level routing: a `TX_STOCK_RETRACTION` is dropped entirely on import to Carta. The closest faithful behavior would be *not replaying* the retracted transaction in the first place (i.e., honoring the retraction by omission), since Carta records only the resulting ledger state, not OCF's transaction-by-transaction event log with reversals.
- Consistency: the sibling retraction transactions (`ConvertibleRetraction`, `EquityCompensationRetraction`, `PlanSecurityRetraction`, `WarrantRetraction`) share the identical 6-field shape and the same "Carta has no retraction" conclusion, so all five should map all-unmappable in the same way.
