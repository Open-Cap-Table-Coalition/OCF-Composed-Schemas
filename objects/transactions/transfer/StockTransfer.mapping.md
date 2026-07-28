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
target_version: "v1alpha1 (2026-06-22)"
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
    kind: computed                 # remainder identity + lineage on the balance security
    target:
      Rsa:
        - "#/$defs/RestrictedStockAward/properties/id"
        - "#/$defs/RestrictedStockAward/properties/securityId"
        - "#/$defs/RestrictedStockAwardPrecededBy/properties/securities"
      Default:
        - "#/$defs/Certificate/properties/id"
        - "#/$defs/Certificate/properties/securityId"
        - "#/$defs/CertificatePrecededBy/properties/securities"
    const:                         # the remainder is reissued from the source — a known reason
      Rsa:     { reason: RESTRICTED_STOCK_AWARD_PRECEDED_BY_REASON_BALANCE_REISSUED }
      Default: { reason: CERTIFICATE_PRECEDED_BY_REASON_BALANCE_REISSUED }
  resulting_security_ids:
    kind: computed                 # result identities + lineage on the transferred-in securities
    target:
      Rsa:
        - "#/$defs/RestrictedStockAward/properties/id"
        - "#/$defs/RestrictedStockAward/properties/securityId"
        - "#/$defs/RestrictedStockAwardPrecededBy/properties/securities"
      Default:
        - "#/$defs/Certificate/properties/id"
        - "#/$defs/Certificate/properties/securityId"
        - "#/$defs/CertificatePrecededBy/properties/securities"
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

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&title=%5BMapping+question%5D+StockTransfer) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&title=%5BMapping+question%5D+StockTransfer%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&title=%5BMapping+question%5D+StockTransfer%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&title=%5BMapping+question%5D+StockTransfer%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&title=%5BMapping+question%5D+StockTransfer%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&title=%5BMapping+question%5D+StockTransfer%3A+security_id&property_path=security_id) |
| `consideration_text` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&title=%5BMapping+question%5D+StockTransfer%3A+consideration_text&property_path=consideration_text) |
| `balance_security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&title=%5BMapping+question%5D+StockTransfer%3A+balance_security_id&property_path=balance_security_id) |
| `resulting_security_ids` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&title=%5BMapping+question%5D+StockTransfer%3A+resulting_security_ids&property_path=resulting_security_ids) |
| `quantity` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Ftransfer%2FStockTransfer.mapping.md&title=%5BMapping+question%5D+StockTransfer%3A+quantity&property_path=quantity) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta represents RSA and certificate transfers as a composite cancel-plus-issue sequence, selected by the stock issuance family. The transfer date and quantity populate both step transactions with transfer-specific reasons.
- Source/result/balance IDs are retained through successor-security identities and `precededBy.securities` lineage. `consideration_text` has no target; `id`, `comments`, and `object_type` are OCF scaffolding.
