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
target_version: "v1alpha1 (2026-06-22)"
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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_property (downstream join). This cancellation carries only
# security_id and NO discriminator, so the Carta cancellation family
# (Rsa vs Certificate) is undecidable from the record alone: it is resolved by
# joining security_id back to the StockIssuance and reading that issuance's
# issuance_type. An RSA cancel must route to RsaCancellationTransaction, never to
# the Certificate family (the bug-#219 class). See
# docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_property:
  lookup_by:
    key: security_id
    through:
      mapping: ../issuance/StockIssuance.mapping.md
      on_property: issuance_type
  exhaustive: true

# shared: every source property. security_id also anchors the parent transaction item;
# date/quantity land on a different Carta
# cancellation tx per family, so they carry a per-variant target map
# { Rsa: pointer or pointer list, Default: pointer or pointer list }.
shared:
  id:                  { kind: unmappable, target: null, reason: ocf-internal }
  comments:            { kind: unmappable, target: null, reason: no-equivalent }
  object_type:         { kind: unmappable, target: null, reason: ocf-internal }
  security_id:
    kind: rename
    target:
      Rsa:
        - "#/$defs/RsaTransactionItem/properties/securityId"
        - "#/$defs/RestrictedStockAward/properties/id"
        - "#/$defs/RestrictedStockAward/properties/securityId"
      Default:
        - "#/$defs/CertificateTransactionItem/properties/securityId"
        - "#/$defs/Certificate/properties/id"
        - "#/$defs/Certificate/properties/securityId"
  reason_text:
    kind: computed                 # free text classified into the family's cancellation reason enum
    target:
      Rsa:     "#/$defs/RsaCancellationTransaction/properties/reason"
      Default: "#/$defs/CertificateCancellationTransaction/properties/reason"
  balance_security_id:
    kind: computed                 # remainder identity + lineage on the partial-cancel security
    target:
      Rsa:
        - "#/$defs/RestrictedStockAward/properties/id"
        - "#/$defs/RestrictedStockAward/properties/securityId"
        - "#/$defs/RestrictedStockAwardPrecededBy/properties/securities"
      Default:
        - "#/$defs/Certificate/properties/id"
        - "#/$defs/Certificate/properties/securityId"
        - "#/$defs/CertificatePrecededBy/properties/securities"
  date:
    kind: rename
    target:
      Rsa:
        - "#/$defs/RsaCancellationTransaction/properties/effectiveDatetime"
        - "#/$defs/RestrictedStockAward/properties/canceledDate"
      Default:
        - "#/$defs/CertificateCancellationTransaction/properties/effectiveDatetime"
        - "#/$defs/Certificate/properties/canceledDate"
  quantity:
    kind: rename
    target:
      Rsa:
        - "#/$defs/RsaCancellationTransaction/properties/quantity"
        - "#/$defs/RestrictedStockAward/properties/canceledQuantity"
      Default:
        - "#/$defs/CertificateCancellationTransaction/properties/quantity"
        - "#/$defs/Certificate/properties/canceledQuantity"

variants:

  Rsa:
    when: [RSA]
    primary_targets:
      - "#/$defs/RsaCancellationTransaction"
      - "#/$defs/RsaTransactionItem"
    fields: {}

  Default:
    when: [FOUNDERS_STOCK]
    primary_targets:
      - "#/$defs/CertificateCancellationTransaction"
      - "#/$defs/CertificateTransactionItem"
    fields: {}

 ```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FStockCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FStockCancellation.mapping.md&title=%5BMapping+question%5D+StockCancellation) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FStockCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FStockCancellation.mapping.md&title=%5BMapping+question%5D+StockCancellation%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FStockCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FStockCancellation.mapping.md&title=%5BMapping+question%5D+StockCancellation%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FStockCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FStockCancellation.mapping.md&title=%5BMapping+question%5D+StockCancellation%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FStockCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FStockCancellation.mapping.md&title=%5BMapping+question%5D+StockCancellation%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FStockCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FStockCancellation.mapping.md&title=%5BMapping+question%5D+StockCancellation%3A+security_id&property_path=security_id) |
| `balance_security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FStockCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FStockCancellation.mapping.md&title=%5BMapping+question%5D+StockCancellation%3A+balance_security_id&property_path=balance_security_id) |
| `reason_text` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FStockCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FStockCancellation.mapping.md&title=%5BMapping+question%5D+StockCancellation%3A+reason_text&property_path=reason_text) |
| `quantity` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fcancellation%2FStockCancellation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fcancellation%2FStockCancellation.mapping.md&title=%5BMapping+question%5D+StockCancellation%3A+quantity&property_path=quantity) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Join on `security_id` to `StockIssuance.issuance_type`: RSA and FOUNDERS_STOCK route to their corresponding cancellation transaction and security/item.
- `date` and `quantity` populate event and security state. Free-text `reason_text` is classified into the family enum; `balance_security_id` is retained through successor-security lineage. `id`, `comments`, and `object_type` are OCF scaffolding.
