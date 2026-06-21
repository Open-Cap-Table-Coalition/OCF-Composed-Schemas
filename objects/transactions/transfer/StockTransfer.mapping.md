---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/transfer/StockTransfer.schema.json
ocf_object_type: TX_STOCK_TRANSFER
ocf_title: Object - Stock Transfer Transaction
ocf_kind: object
required_fields:
  - quantity
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

# Object - Stock Transfer Transaction → Carta

> Object describing a transfer or secondary sale of a stock security

## OCF schema

Source: [`StockTransfer.schema.json`](./StockTransfer.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/transfer/StockTransfer.schema.json",
  "title": "Object - Stock Transfer Transaction",
  "description": "Object describing a transfer or secondary sale of a stock security",
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
      "const": "TX_STOCK_TRANSFER"
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
    "quantity": {
      "description": "Quantity of non-monetary security units transferred",
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
    "resulting_security_ids"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/transfer/StockTransfer.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 9/9

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
      TX_STOCK_TRANSFER: null
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
  quantity:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Carta has no stock/certificate transfer transaction, so the whole object is unmappable.** Carta's stock-security transaction surface is the `Certificate*Transaction` family: `#/$defs/CertificateIssuanceTransaction` (initial issuance) and `#/$defs/CertificateCancellationTransaction` (cancellation/termination). There is no `CertificateTransferTransaction`. A grep of the pinned bundle (`target-schema/Carta.schema.json`) for `*TransferTransaction` returns exactly one def — `#/$defs/WarrantTransferTransaction` — and it is **warrant-specific** (`"Represents the transfer of warrant shares to a new warrant."`). It is the destination for `WarrantTransfer` (`TX_WARRANT_TRANSFER`), not for a stock transfer, so re-pointing a stock transfer onto it would mis-type the security. Therefore every field of `TX_STOCK_TRANSFER` is `no-equivalent` (or `ocf-internal` for scaffolding).
- **How Carta actually represents a stock transfer (object-level routing).** Carta does not model a transfer as one atomic transaction; it records the resulting **ledger state**, not OCF's transaction-by-transaction event log. A secondary sale / transfer of stock surfaces in Carta as two separate certificate events: (1) the source certificate is cancelled with `CertificateCancellationTransaction.reason = CERTIFICATE_CANCELLATION_REASON_TRANSFERRED`, and (2) one or more new certificates are issued with `CertificateIssuanceTransaction.issuanceReason = CERTIFICATE_ISSUANCE_REASON_TRANSFERRED` (mirrored on the certificate's history via `CertificatePrecededByReason.CERTIFICATE_PRECEDED_BY_REASON_TRANSFERRED`). OCF's single `StockTransfer` object has **no 1:1 target** in that pair: synthesizing the cancel+issue pair would require fabricating two Carta objects from one OCF object and inventing per-target fields. Per the "never invent a representative target" rule, the object is mapped all-unmappable and its data is reconstructed at import time by the cancel-source + issue-resulting-certificates routing described here rather than by a field-level mapping.
- Per-field justification:
    - `object_type` (const `TX_STOCK_TRANSFER`): the discriminator for the stock-transfer concept itself. Because Carta has no stock transfer transaction, there is no target enum to remap onto — hence `no-equivalent` (not `ocf-internal`). The single OCF enum value `TX_STOCK_TRANSFER` is listed under `values:` and maps to `null`. (Contrast `id`/`comments`, which are scaffolding present on every OCF object and therefore `ocf-internal`.)
    - `date`: OCF records the calendar date the transfer occurred (`types/Date.schema.json`, an `Iso8601CompleteCalendarDate`-style value). Carta's transaction timestamps are `Iso8601CompleteCalendarDateTime` (e.g. `CertificateCancellationTransaction.effectiveDatetime`, `CertificateIssuanceTransaction.issueDatetime`, `WarrantTransferTransaction.transferredDatetime`), and they live on transaction types Carta actually has. With no stock transfer transaction to attach it to, there is no datetime field to carry this date — `no-equivalent`. (Even where Carta *does* have an analogous transaction, note the date-vs-datetime granularity gap: OCF stores a DATE, Carta a DATETIME.)
    - `security_id`: the foreign key to the source stock security being transferred. Carta does carry `securityId` on its security objects (`Certificate.securityId`) and transaction-item objects (`CertificateTransactionItem.securityId`), so the *identifier concept* exists — but there is no transfer transaction on which to record "the security being transferred away." In Carta's two-event recreation this is the certificate that receives the `…_TRANSFERRED` cancellation, but there is no single field on a transfer object to map onto. `no-equivalent`.
    - `resulting_security_ids` (array, `minItems: 1`): identifiers of the new securities created by the transfer. Carta's only field of this shape is `WarrantTransferTransaction.resultingSecurityId` (a single string, warrant-only) — there is no stock analogue, and OCF allows *multiple* resulting securities (e.g. transferred portion plus balance) where the warrant field carries only one. In Carta's recreation these become the freshly-issued certificates (each a `CertificateIssuanceTransaction` with `issuanceReason = …_TRANSFERRED`), but no stock transfer field exists to hold the id list. `no-equivalent`.
    - `quantity` (`types/Numeric.schema.json`): number of share units transferred. Carta represents share counts as `Decimal` and has quantity fields on the transactions it supports (`CertificateIssuanceTransaction.quantity`, `CertificateCancellationTransaction.quantity`, `WarrantTransferTransaction.quantity`), but none on a stock transfer transaction. In the cancel+issue recreation the transferred quantity would appear as the cancelled quantity on the source and the issued quantity on the resulting certificate(s); there is no single stock-transfer slot to map onto. `no-equivalent`.
    - `balance_security_id`: identifier of the security holding the remainder for a *partial* transfer. Carta has no transfer-remainder concept at all; in the recreation the balance is simply another issued certificate retained by the original holder. `no-equivalent`.
    - `consideration_text`: free-text description of consideration paid in the secondary sale. Carta has no consideration/price field on any transfer pathway — a `grep` of the bundle for `consideration` returns nothing — and `CertificateIssuanceTransaction.acquisitionCost (Money)` models a cost basis on issuance, not the OCF free-text consideration of a secondary sale. There is no free-text or transfer-consideration slot, so this drops. `no-equivalent`.
    - `id`, `comments`: OCF object scaffolding. `id` is OCF's own identifier (Carta assigns identifiers server-side); `comments` has no Carta slot. Both `ocf-internal`.
- Consistency: the sibling transfer transactions share this same "Carta has no single transfer transaction" shape. `WarrantTransfer` (`TX_WARRANT_TRANSFER`) is the **one exception** — it has a dedicated `#/$defs/WarrantTransferTransaction` (with `transferredDatetime`, `quantity`, `resultingSecurityId`, `resultingSecurityLabel`) and so is *not* all-unmappable. `ConvertibleTransfer`, `EquityCompensationTransfer`, and `PlanSecurityTransfer` resemble `StockTransfer`: Carta has no convertible/option/plan-security transfer transaction, so they map all-unmappable in the same way (each recreated via its security family's cancel + reissue events where Carta supports them).
