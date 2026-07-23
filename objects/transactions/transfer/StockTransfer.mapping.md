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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_property (downstream join) resolves the stock FAMILY. A
# StockTransfer carries only security_id and NO discriminator, so the family (RSA
# vs founders/plain stock) is undecidable from the record alone: it is resolved by
# joining security_id back to the StockIssuance and reading that issuance's
# issuance_type.
# composite: Carta has no stock transfer transaction, so one OCF StockTransfer
# folds into an ORDERED PAIR of Carta transactions (all emitted): cancel the source
# certificate (reason TRANSFERRED) + issue the transferee's certificate
# (issuanceReason TRANSFERRED) — Carta's blessed representation of a transfer. The
# transfer EVENT payload (quantity/date) that previously had no home now lands on
# those step transactions, so StockTransfer becomes Core-admissible. Family and
# step are orthogonal axes: the step targets diverge by family (Certificate* vs
# Rsa*). See docs/polymorphic-transaction-routing.md §2.2/§4.3/§4.9.
status: complete

route_by_property:
  lookup_by:
    key: security_id
    through:
      mapping: ../issuance/StockIssuance.mapping.md
      on_property: issuance_type
  exhaustive: true

# composite: the two Carta transactions a stock transfer folds into, in order.
# Steps are additive (both emitted). Each step's target is per-family (the source
# and resulting securities are Certificates for plain/founders stock,
# RestrictedStockAwards for RSAs). const captures the fixed Carta reason codes —
# only the Certificate family has a *_TRANSFERRED reason enum member (RSA's
# cancellation/issuance reasons have no transferred value), so const omits Rsa.
composite:
  - step: cancel
    target:
      Default: "#/$defs/CertificateCancellationTransaction"
      Rsa:     "#/$defs/RsaCancellationTransaction"
    const:
      Default: { reason: CERTIFICATE_CANCELLATION_REASON_TRANSFERRED }
  - step: issue
    target:
      Default: "#/$defs/CertificateIssuanceTransaction"
      Rsa:     "#/$defs/RsaIssuanceTransaction"
    const:
      Default: { issuanceReason: CERTIFICATE_ISSUANCE_REASON_TRANSFERRED }

# shared: every source property. The transfer *event* payload now lands on the
# composite steps via per-step, per-family target maps: quantity onto both the
# cancel and issue quantities, date onto the step datetimes. The lineage fields
# keep their per-family security-object precededBy targets (the transferred-in /
# remainder securities carry the reverse edges — the precededBy $def diverges by
# family: RestrictedStockAwardPrecededBy for Rsa, CertificatePrecededBy for
# Default). The remaining fields have no Carta home.
shared:
  id:                     { kind: unmappable, target: null, reason: ocf-internal }
  comments:               { kind: unmappable, target: null, reason: ocf-internal }
  object_type:            { kind: unmappable, target: null, reason: no-equivalent }
  date:
    kind: rename                   # transfer date → the step transaction datetimes
    target:
      cancel:
        Default: "#/$defs/CertificateCancellationTransaction/properties/effectiveDatetime"
        Rsa:     "#/$defs/RsaCancellationTransaction/properties/effectiveDatetime"
      issue:
        Default: "#/$defs/CertificateIssuanceTransaction/properties/issueDatetime"
        Rsa:     "#/$defs/RsaIssuanceTransaction/properties/issueDatetime"
  security_id:            { kind: unmappable, target: null, reason: ocf-internal }
  consideration_text:     { kind: unmappable, target: null, reason: no-equivalent }
  balance_security_id:
    kind: computed                 # lineage: the remainder security precededBy
    target:
      Rsa:     "#/$defs/RestrictedStockAwardPrecededBy/properties/securities"
      Default: "#/$defs/CertificatePrecededBy/properties/securities"
    const:                         # the remainder is reissued from the source — a known reason
      Rsa:     { reason: RESTRICTED_STOCK_AWARD_PRECEDED_BY_REASON_BALANCE_REISSUED }
      Default: { reason: CERTIFICATE_PRECEDED_BY_REASON_BALANCE_REISSUED }
  resulting_security_ids:
    kind: computed                 # lineage: the transferred-in security precededBy
    target:
      Rsa:     "#/$defs/RestrictedStockAwardPrecededBy/properties/securities"
      Default: "#/$defs/CertificatePrecededBy/properties/securities"
    const:                         # the transferred-in security was preceded by a transfer
      Rsa:     { reason: RESTRICTED_STOCK_AWARD_PRECEDED_BY_REASON_TRANSFERRED }
      Default: { reason: CERTIFICATE_PRECEDED_BY_REASON_TRANSFERRED }
  quantity:
    kind: rename                   # ← the payload that was being dropped; now lands
    target:
      cancel:
        Default: "#/$defs/CertificateCancellationTransaction/properties/quantity"
        Rsa:     "#/$defs/RsaCancellationTransaction/properties/quantity"
      issue:
        Default: "#/$defs/CertificateIssuanceTransaction/properties/quantity"
        Rsa:     "#/$defs/RsaIssuanceTransaction/properties/quantity"

variants:

  Rsa:
    when: [RSA]
    primary_targets: null
    fields: {}

  Default:
    when: [FOUNDERS_STOCK]
    primary_targets: null
    fields: {}

 ```

## Notes / open questions

- **Carta represents a stock transfer as cancel + issue (the `composite:` fold).**
  Carta records ledger *state*, not OCF's per-event log, and has no
  `CertificateTransferTransaction` (the only `*TransferTransaction` in the pinned bundle is
  the warrant-specific `#/$defs/WarrantTransferTransaction`). Its blessed representation of
  a secondary sale is two certificate events: the source certificate is cancelled
  (`CertificateCancellationTransaction.reason = CERTIFICATE_CANCELLATION_REASON_TRANSFERRED`)
  and the transferee's certificate is issued (`CertificateIssuanceTransaction.issuanceReason
  = CERTIFICATE_ISSUANCE_REASON_TRANSFERRED`). One OCF `StockTransfer` therefore folds into
  an ordered *pair* of Carta transactions — modelled here with `composite:` (steps `cancel`,
  `issue`, both emitted). See docs/polymorphic-transaction-routing.md §4.9.
- **The transfer event payload now lands — StockTransfer enters Core.** `quantity` lands on
  both step transactions' `quantity`, and `date` lands on the step datetimes
  (`effectiveDatetime` on cancel, `issueDatetime` on issue), via per-step target maps.
  Because `quantity` is a real payload landing (not just lineage), the §3 non-degeneracy
  gate is satisfied and StockTransfer becomes Core-admissible — previously it landed only
  lineage references and was held out with `no-payload`.
- **Family and step are orthogonal axes.** `route_by_property` resolves the stock *family*
  (RSA vs founders/plain stock — mutually exclusive), while `composite` decomposes the
  *event* into ordered steps (both emitted). The step targets diverge by family: the
  Certificate family uses `Certificate{Cancellation,Issuance}Transaction`, the RSA family
  `Rsa{Cancellation,Issuance}Transaction`. Each step's `target` and each payload field's
  `target` is a `{ step: { family: pointer } }` map; the Core converter reduces the step
  dimension to one landing pointer per family (the issue step wins).
- **RSA asymmetry: `const` omits the RSA family.** `RsaCancellationReason` has no
  `*_TRANSFERRED` member and `RsaIssuanceTransaction` has no `issuanceReason`, so the RSA
  steps cannot carry the fixed transferred reason codes the Certificate steps do — `const`
  is Certificate-only. RSA transfers still land `quantity`/`date` on the RSA step
  transactions (so they graduate too), and their lineage still routes through the security
  object's `precededBy` (below).
- **Join-dependent (downstream).** A `StockTransfer` carries no discriminator — only
  `security_id` — so its family is fixed at issuance, not on the transfer record. An
  importer resolves `issuance_type` by joining `security_id` back to the `StockIssuance`
  (the two-pass requirement, §2.2), which selects both the step transaction family and the
  precededBy `$def` the resulting/balance securities carry.
- **The security lineage round-trips losslessly (kind `computed`).** OCF records the
  transferred-in (`resulting_security_ids`) and remainder (`balance_security_id`) securities
  as fields *on the transaction*; Carta records the same as reverse lineage edges *on the
  resulting/balance security* (`precededBy.securities`). These are always stock securities —
  `Certificate` (plain/founders) or `RestrictedStockAward` (RSAs) — so the importer writes
  the source security's id into each resulting/balance security's `precededBy.securities`,
  per-family (`CertificatePrecededBy` for `Default`, `RestrictedStockAwardPrecededBy` for
  `Rsa`).
- Per-field justification:
    - `quantity` (`types/Numeric.schema.json`): share units transferred. Lands on the cancel
      and issue step transactions' `quantity` (`Decimal`). The real payload that admits
      StockTransfer to Core.
    - `date`: transfer date. Lands on the cancel step's `effectiveDatetime` and the issue
      step's `issueDatetime` (a DATE→DATETIME widening). Not a payload for the §3 gate (dates
      are bookkeeping), but a faithful landing.
    - `resulting_security_ids` (array, `minItems: 1`), `balance_security_id`: transferred-in
      / remainder securities. `computed`, per-family reverse lineage onto the
      resulting/balance security's `precededBy.securities` (see above). (Carta's tx-level
      `WarrantTransferTransaction.resultingSecurityId` is single-valued and warrant-only, so
      it is not the target here.)
    - `security_id`: the join key (`route_by_property.lookup_by.key`) that routes the family; it is not
      itself a stored Carta field on the transfer event — `ocf-internal`. (The transferred-in
      lineage is captured by `resulting_security_ids` above.)
    - `object_type` (const `TX_STOCK_TRANSFER`): the OCF discriminator for the transfer
      concept; the composite steps are distinct Carta transactions with no single reason enum
      to remap onto — `no-equivalent`.
    - `consideration_text`: free-text consideration for the secondary sale. Carta has no
      consideration/price slot on the transfer pathway (`acquisitionCost` models cost basis on
      issuance, not free-text consideration) — `no-equivalent`.
    - `id`, `comments`: OCF object scaffolding (Carta assigns identifiers server-side;
      `comments` has no Carta slot) — `ocf-internal`.
- Consistency: the sibling transfer transactions share the "Carta has no single transfer
  transaction" shape and are candidates for the same `composite:` fold
  (`ConvertibleTransfer`, `EquityCompensationTransfer`, `PlanSecurityTransfer` are each
  recreated via their security family's cancel + reissue events). `WarrantTransfer`
  (`TX_WARRANT_TRANSFER`) is the one exception — it has a dedicated
  `#/$defs/WarrantTransferTransaction`.
