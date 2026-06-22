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
# routing: route_by_security (downstream join). A StockTransfer carries only
# security_id and NO discriminator, so the stock family (RSA vs founders/plain
# stock) is undecidable from the record alone: it is resolved by joining
# security_id back to the StockIssuance and reading that issuance's
# issuance_type. Both families are all-unmappable here — Carta has no stock
# transfer transaction at all (see Notes). See
# docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_security:
  via: security_id
  resolve: issuance_type
  resolve_enum: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StockIssuanceType.schema.json"
  source_mapping: ../issuance/StockIssuance.mapping.md
  exhaustive: true

# shared: every source property. Carta has no stock transfer transaction, so
# every field is unmappable in BOTH families — no per-variant target maps are
# needed (a per-variant map only appears where a field's Carta home diverges by
# family, and here there is no Carta home in either family).
shared:
  id:                     { kind: unmappable, target: null, reason: ocf-internal }
  comments:               { kind: unmappable, target: null, reason: ocf-internal }
  object_type:            { kind: unmappable, target: null, reason: no-equivalent }
  date:                   { kind: unmappable, target: null, reason: no-equivalent }
  security_id:            { kind: unmappable, target: null, reason: ocf-internal }
  consideration_text:     { kind: unmappable, target: null, reason: no-equivalent }
  balance_security_id:    { kind: unmappable, target: null, reason: no-equivalent }
  resulting_security_ids: { kind: unmappable, target: null, reason: no-equivalent }
  quantity:               { kind: unmappable, target: null, reason: no-equivalent }

variants:

  Rsa:
    when: [RSA]
    primary_targets: null
    fields: {}

  Default:
    when: [FOUNDERS_STOCK]
    primary_targets: null
    fields: {}

coverage:
  Rsa: 9/9
  Default: 9/9
```

## Notes / open questions

- **Join-dependent (downstream), and all-unmappable.** A `StockTransfer` carries no
  discriminator — only `security_id` — so the stock family it belongs to (`RSA` vs
  `FOUNDERS_STOCK`/plain stock) is fixed at issuance, not on the transfer record. An
  importer must resolve `issuance_type` by joining `security_id` back to the
  `StockIssuance` (the two-pass requirement, §2.2). Here the resolution changes
  nothing about the field mapping: **both** families route to `primary_targets: null`,
  because Carta has no stock transfer transaction in either case. The routing block is
  present for shape consistency with the rest of the family and to document the join.
- **Carta has no stock/certificate transfer transaction.** Carta's stock-security
  transaction surface is the `Certificate*Transaction` family —
  `CertificateIssuanceTransaction` (issuance) and `CertificateCancellationTransaction`
  (cancellation) — with no `CertificateTransferTransaction`. The pinned bundle
  (`target-schema/Carta.schema.json`) contains exactly one `*TransferTransaction`,
  `#/$defs/WarrantTransferTransaction`, and it is **warrant-specific** (the destination
  for `WarrantTransfer` / `TX_WARRANT_TRANSFER`); re-pointing a stock transfer onto it
  would mis-type the security. So no field of `TX_STOCK_TRANSFER` has a Carta home and
  the whole object maps all-unmappable in every variant.
- **How Carta represents a stock transfer (object-level recreation).** Carta records the
  resulting **ledger state**, not OCF's per-event log. A secondary sale surfaces as two
  certificate events: the source certificate is cancelled with
  `CertificateCancellationTransaction.reason = CERTIFICATE_CANCELLATION_REASON_TRANSFERRED`,
  and the resulting securities are re-issued as `CertificateIssuanceTransaction`s with
  `issuanceReason = CERTIFICATE_ISSUANCE_REASON_TRANSFERRED`. OCF's single `StockTransfer`
  has no 1:1 target in that pair, and per the "never invent a representative target" rule
  the data is reconstructed at import time rather than via a field-level mapping.
- Per-field justification:
    - `object_type` (const `TX_STOCK_TRANSFER`): the discriminator for the stock-transfer
      concept itself. With no Carta stock transfer transaction there is no target enum to
      remap onto — `no-equivalent`. (Contrast `id`/`comments`/`security_id`, which are
      scaffolding/join machinery and therefore `ocf-internal`.)
    - `date`: OCF stores a calendar DATE. Carta's transaction timestamps are
      `Iso8601CompleteCalendarDateTime` and live only on transactions Carta actually has;
      with no stock transfer transaction there is no datetime field to carry it —
      `no-equivalent`.
    - `security_id`: the join key (`route_by_security.via`). It routes the family by
      resolving `issuance_type` on the joined `StockIssuance`; it is not itself a stored
      Carta field on a transfer — `ocf-internal`.
    - `resulting_security_ids` (array, `minItems: 1`): identifiers of the new securities
      created by the transfer. Carta's only field of this shape is
      `WarrantTransferTransaction.resultingSecurityId` (single string, warrant-only);
      there is no stock analogue, and OCF allows multiple resulting securities. In the
      recreation these become the freshly-issued certificates — no transfer field holds
      the id list. `no-equivalent`.
    - `quantity` (`types/Numeric.schema.json`): share units transferred. Carta has
      quantity fields on the transactions it supports (issuance/cancellation), but none on
      a stock transfer transaction. `no-equivalent`.
    - `balance_security_id`: remainder security for a *partial* transfer. Carta has no
      transfer-remainder concept; in the recreation the balance is simply another issued
      certificate retained by the holder. `no-equivalent`.
    - `consideration_text`: free-text consideration for the secondary sale. Carta has no
      consideration/price slot on any transfer pathway (`acquisitionCost` models cost basis
      on issuance, not free-text consideration). `no-equivalent`.
    - `id`, `comments`: OCF object scaffolding (Carta assigns identifiers server-side;
      `comments` has no Carta slot). Both `ocf-internal`.
- Consistency: the sibling transfer transactions share this "Carta has no single transfer
  transaction" shape. `WarrantTransfer` (`TX_WARRANT_TRANSFER`) is the **one exception** —
  it has a dedicated `#/$defs/WarrantTransferTransaction` and is *not* all-unmappable.
  `ConvertibleTransfer`, `EquityCompensationTransfer`, and `PlanSecurityTransfer` resemble
  `StockTransfer` (each recreated via its security family's cancel + reissue events).
