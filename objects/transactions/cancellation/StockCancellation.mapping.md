---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/StockCancellation.schema.json
ocf_object_type: TX_STOCK_CANCELLATION
ocf_title: Object - Stock Cancellation Transaction
ocf_kind: object
required_fields:
  - quantity
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

# Object - Stock Cancellation Transaction → Carta

> Object describing a cancellation of a stock security

## OCF schema

Source: [`StockCancellation.schema.json`](./StockCancellation.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/StockCancellation.schema.json",
  "title": "Object - Stock Cancellation Transaction",
  "description": "Object describing a cancellation of a stock security",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/cancellation/Cancellation.schema.json"
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
      "const": "TX_STOCK_CANCELLATION"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "balance_security_id": {
      "description": "Identifier for the security that holds the remainder balance (for partial cancellations)",
      "type": "string"
    },
    "reason_text": {
      "description": "Reason for the cancellation",
      "type": "string"
    },
    "quantity": {
      "description": "Quantity of non-monetary security units cancelled",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "quantity",
    "id",
    "object_type",
    "date",
    "security_id",
    "reason_text"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/cancellation/StockCancellation.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: "8/8"

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
      TX_STOCK_CANCELLATION: null
  date:
    kind: rename
    target: "#/$defs/CertificateCancellationTransaction/properties/effectiveDatetime"
  security_id:
    kind: rename
    target: "#/$defs/CertificateTransactionItem/properties/securityId"
  balance_security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  reason_text:
    kind: computed
    target: "#/$defs/CertificateCancellationTransaction/properties/reason"
  quantity:
    kind: rename
    target: "#/$defs/CertificateCancellationTransaction/properties/quantity"
```

## Notes / open questions

- **Carta has a direct home for this transaction: `CertificateCancellationTransaction`.** OCF stock = Carta certificates (the transaction surface routes stock issuance to `CertificateIssuanceTransaction` + `Certificate`, and stock cancellation to `CertificateCancellationTransaction`). Carta nests the cancellation under its certificate via `CertificateTransactionItem.cancellations[]` — an array described as "all cancellation and termination transactions for the certificate, in chronological order," since a certificate can accrue multiple cancellation/termination events. This is the single unambiguous Carta destination, so the substantive payload of the OCF transaction maps field-for-field.
- **`quantity` → `CertificateCancellationTransaction.quantity`.** The number of stock units cancelled — the core economic payload. OCF `Numeric` → Carta `Decimal`; both are arbitrary-precision numeric strings, so the rename is value-preserving (the type is renamed, not the value).
- **`date` → `CertificateCancellationTransaction.effectiveDatetime`.** The date the cancellation occurred. **Granularity widening to flag:** OCF `date` is a calendar **date** (`types/Date.schema.json`), whereas Carta's `effectiveDatetime` is a full **datetime** (`Iso8601CompleteCalendarDateTime`). An importer must widen the OCF date to a datetime (e.g. by appending a time-of-day / midnight UTC); the reverse (Carta → OCF) is lossy as it truncates the time component. `CertificateCancellationTransaction` also carries `terminationDatetime` and `forfeitureDatetime`, but OCF supplies only a single transaction `date`, so `effectiveDatetime` is the correct one-to-one target; the other two datetimes have no OCF source field here and are left unset by this mapping.
- **`security_id` → `CertificateTransactionItem.securityId`.** OCF's transaction-to-security foreign key — the stable per-security id that selects *which* certificate is being cancelled. Note that `CertificateCancellationTransaction` itself carries **no** security reference field; the cancellation is nested *under* its certificate via `CertificateTransactionItem.cancellations[]`, so the security linkage in Carta is structural (array containment) and the corresponding stable key lives on the parent `CertificateTransactionItem.securityId` ("The identifier of the certificate" used to cross-reference transactions). Mapped there. Not value-identical (each system assigns its own ids), but it is the same role: the per-security reference used across Carta's certificate transactions (`securityId` also appears on `Certificate`).
- **`reason_text` → `CertificateCancellationTransaction.reason` (`computed`).** OCF stores the cancellation reason as **free text** (`reason_text`, "Reason for the cancellation"); Carta stores it as the **enum** `CertificateCancellationReason` (`CERTIFICATE_CANCELLATION_REASON_CANCELED`, `_TERMINATED`, `_TERMINATION_FORFEITED`, `_REPURCHASED`, `_TRANSFERRED`, `_SHARE_CLASS_CONVERTED`). Because the source is unconstrained prose and the target is a closed vocabulary, this is **not** a clean `enum-remap` (there is no OCF enum to remap member-for-member) — it is `computed`: an importer must classify the free text into one of Carta's reason codes (e.g. text describing an issuer repurchase → `_REPURCHASED`; a transfer to another holder → `_TRANSFERRED`; forfeiture of unvested shares on termination → `_TERMINATION_FORFEITED`; a share-class conversion → `_SHARE_CLASS_CONVERTED`; plain "canceled" → `_CANCELED`). The mapping is lossy in both directions: prose nuance is dropped going to Carta, and Carta's specific code loses the original wording going back. `reason_text` is OCF-required, so a value is always present to classify; when it does not match a more specific code, `_CANCELED` / `_TERMINATED` are the safe fallbacks. (Note that several of OCF's distinct transaction types — repurchase, transfer, conversion — collapse into reason codes on Carta's single cancellation transaction, but for *this* object the source is the free-text `reason_text`.)
- **`balance_security_id` → unmappable (`no-equivalent`).** OCF supports *partial* cancellations by pointing at a second security that holds the remaining (un-cancelled) balance. `CertificateCancellationTransaction` has no such field — Carta records only the cancelled `quantity` on the original certificate (and Carta represents balance reissuance via a separate `Certificate.precededBy` / `CERTIFICATE_PRECEDED_BY_REASON_BALANCE_REISSUED` mechanism on a *new* certificate, not as a pointer field on the cancellation transaction), so OCF's partial-cancellation balance pointer has no Carta home on this transaction. This is a genuine domain gap, not OCF scaffolding.
- **`id`, `comments`, `object_type`: OCF scaffolding (`ocf-internal`).**
  - `id` is OCF's identifier for the cancellation transaction object; Carta assigns its own ids and `CertificateCancellationTransaction` has no incoming-id field this could become.
  - `object_type` is OCF's transaction discriminator (a fixed `const` `TX_STOCK_CANCELLATION`), not a domain value — Carta selects the transaction kind by which concrete `$def` it instantiates (`CertificateCancellationTransaction`), so the discriminator string itself has no target. Its single member `TX_STOCK_CANCELLATION` maps to `null`. Do not confuse this discriminator with Carta's `CertificateCancellationTransaction.reason`, which is fed by `reason_text`, not by `object_type`.
  - `comments` is free-text OCF metadata with no slot on the Carta transaction.
- This object is `ocf_kind: object`, so it is classified `n/a-object` per the bucket policy: its own properties map directly to the corresponding Carta object's fields (`CertificateCancellationTransaction`, plus the parent `CertificateTransactionItem` for the security key) rather than to a reusable type. Of the 8 source properties, 5 carry into Carta (`quantity`, `date`, `security_id`, `reason_text`, and `object_type` is captured *structurally* by instantiating `CertificateCancellationTransaction`); the 3 unmappables are 2 pieces of OCF scaffolding plus the discriminator (`id`, `comments`, `object_type`) and 1 genuine gap (`balance_security_id`, the partial-cancellation balance pointer).
