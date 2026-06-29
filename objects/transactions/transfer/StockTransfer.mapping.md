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
# issuance_type. Carta has no stock transfer transaction at all, so the transfer
# *event* is unmappable in both families; but the transferred-in / remainder
# securities are stock securities that carry precededBy, so the transfer
# *lineage* round-trips losslessly (see Notes). See
# docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_security:
  via: security_id
  resolve: issuance_type
  resolve_enum: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StockIssuanceType.schema.json"
  source_mapping: ../issuance/StockIssuance.mapping.md
  exhaustive: true

# shared: every source property. Carta has no stock transfer transaction, so the
# transfer *event* fields (date/quantity/consideration_text/...) are unmappable in
# both families. The lineage fields (resulting_security_ids, balance_security_id)
# do have a home: the transferred-in / remainder securities are stock securities
# (Certificate / RestrictedStockAward) that carry precededBy.securities, so they
# carry a per-variant target map (the precededBy $def diverges by family —
# RestrictedStockAwardPrecededBy for Rsa, CertificatePrecededBy for Default).
shared:
  id:                     { kind: unmappable, target: null, reason: ocf-internal }
  comments:               { kind: unmappable, target: null, reason: ocf-internal }
  object_type:            { kind: unmappable, target: null, reason: no-equivalent }
  date:                   { kind: unmappable, target: null, reason: no-equivalent }
  security_id:            { kind: unmappable, target: null, reason: ocf-internal }
  consideration_text:     { kind: unmappable, target: null, reason: no-equivalent }
  balance_security_id:
    kind: computed                 # lineage: the remainder security precededBy
    target:
      Rsa:     "#/$defs/RestrictedStockAwardPrecededBy/properties/securities"
      Default: "#/$defs/CertificatePrecededBy/properties/securities"
  resulting_security_ids:
    kind: computed                 # lineage: the transferred-in security precededBy
    target:
      Rsa:     "#/$defs/RestrictedStockAwardPrecededBy/properties/securities"
      Default: "#/$defs/CertificatePrecededBy/properties/securities"
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

- **Join-dependent (downstream); the transfer *event* is unmappable, the lineage is not.**
  A `StockTransfer` carries no discriminator — only `security_id` — so the stock family it
  belongs to (`RSA` vs `FOUNDERS_STOCK`/plain stock) is fixed at issuance, not on the
  transfer record. An importer must resolve `issuance_type` by joining `security_id` back
  to the `StockIssuance` (the two-pass requirement, §2.2). The resolution does matter for
  the lineage fields: it selects which precededBy `$def` the resulting/balance securities
  carry. Both families still route to `primary_targets: null` because Carta has no stock
  transfer transaction in either case, so the transfer event itself is unrepresentable —
  but the security lineage (`resulting_security_ids`, `balance_security_id`) round-trips
  losslessly onto those securities' `precededBy.securities` (see below).
- **Carta has no stock/certificate transfer transaction.** Carta's stock-security
  transaction surface is the `Certificate*Transaction` family —
  `CertificateIssuanceTransaction` (issuance) and `CertificateCancellationTransaction`
  (cancellation) — with no `CertificateTransferTransaction`. The pinned bundle
  (`target-schema/Carta.schema.json`) contains exactly one `*TransferTransaction`,
  `#/$defs/WarrantTransferTransaction`, and it is **warrant-specific** (the destination
  for `WarrantTransfer` / `TX_WARRANT_TRANSFER`); re-pointing a stock transfer onto it
  would mis-type the security. So no *event*-level field of `TX_STOCK_TRANSFER`
  (`date`, `quantity`, `consideration_text`, `object_type`) has a Carta home — only the
  lineage fields land, via the resulting/balance securities' `precededBy` (next bullet).
- **How Carta represents a stock transfer (object-level recreation).** Carta records the
  resulting **ledger state**, not OCF's per-event log. A secondary sale surfaces as two
  certificate events: the source certificate is cancelled with
  `CertificateCancellationTransaction.reason = CERTIFICATE_CANCELLATION_REASON_TRANSFERRED`,
  and the resulting securities are re-issued as `CertificateIssuanceTransaction`s with
  `issuanceReason = CERTIFICATE_ISSUANCE_REASON_TRANSFERRED`. OCF's single `StockTransfer`
  has no 1:1 target in that pair, and per the "never invent a representative target" rule
  the data is reconstructed at import time rather than via a field-level mapping.
- **The security lineage round-trips losslessly (kind `computed`).** OCF records the
  transferred-in (`resulting_security_ids`) and remainder (`balance_security_id`)
  securities as fields *on the transaction*; Carta records the same information as reverse
  lineage edges *on the resulting/balance security*. The transferred-in and remainder
  securities here are always stock securities — `Certificate` (plain/founders stock) or
  `RestrictedStockAward` (RSAs) — and both carry `precededBy -> { reason, securities:
  [PrecededBySecurity] }`. So the importer derives the placement: it writes the source
  security's id into each resulting/balance security's `precededBy.securities`, and the
  OCF *array* becomes a set of reverse lineage edges with no loss. This is `computed`
  (importer-derived placement onto records the transfer *references*), per-variant
  because the `$def` diverges by family (`RestrictedStockAwardPrecededBy` for `Rsa`,
  `CertificatePrecededBy` for `Default`). Only the transfer *event* is unrepresentable
  in Carta — the security lineage is not.
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
      created by the transfer (the transferred-in shares). These resulting securities are
      stock securities (`Certificate` for plain/founders stock, `RestrictedStockAward` for
      RSAs), and each carries `precededBy.securities` — a `PrecededBySecurity` array of
      reverse lineage edges. The OCF *array* therefore round-trips **losslessly**:
      the importer writes the transferred security's id into every resulting security's
      `precededBy.securities`. `computed`, per-variant
      (`RestrictedStockAwardPrecededBy` for `Rsa`, `CertificatePrecededBy` for `Default`).
      (Carta's tx-level `WarrantTransferTransaction.resultingSecurityId` is single-valued
      and warrant-only, so it is not the target here.)
    - `quantity` (`types/Numeric.schema.json`): share units transferred. Carta has
      quantity fields on the transactions it supports (issuance/cancellation), but none on
      a stock transfer transaction. `no-equivalent`.
    - `balance_security_id`: remainder security for a *partial* transfer. Like the
      resulting securities, the remainder is a freshly-issued stock security
      (`Certificate` / `RestrictedStockAward`) that carries `precededBy.securities`, so its
      origin lineage round-trips losslessly: the importer writes the source security's id
      into the remainder security's `precededBy.securities`. `computed`, per-variant
      (`RestrictedStockAwardPrecededBy` for `Rsa`, `CertificatePrecededBy` for `Default`).
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
