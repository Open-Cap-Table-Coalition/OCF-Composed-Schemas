---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/repurchase/StockRepurchase.schema.json
ocf_object_type: TX_STOCK_REPURCHASE
ocf_title: Object - Stock Repurchase Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - security_id
  - price
  - quantity
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Object - Stock Repurchase Transaction → Carta

> Object describing a stock repurchase transaction

## OCF schema

Source: [`StockRepurchase.schema.json`](./StockRepurchase.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/repurchase/StockRepurchase.schema.json",
  "title": "Object - Stock Repurchase Transaction",
  "description": "Object describing a stock repurchase transaction",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/repurchase/Repurchase.schema.json"
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
      "const": "TX_STOCK_REPURCHASE"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "price": {
      "description": "Repurchase price per share of the stock",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "quantity": {
      "description": "Number of shares of stock repurchased",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "consideration_text": {
      "description": "Unstructured text description of consideration provided in exchange for security repurchase",
      "type": "string"
    },
    "balance_security_id": {
      "description": "Identifier for the security that holds the remainder balance (for partial repurchases)",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "object_type",
    "date",
    "security_id",
    "price",
    "quantity"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/repurchase/StockRepurchase.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_property (downstream join). A StockRepurchase carries only
# security_id and NO discriminator, so the repurchased stock's family is undecidable
# from the record alone: it is resolved by joining security_id back to the
# StockIssuance and reading that issuance's issuance_type. Carta has no repurchase
# transaction at all, so the repurchase event is unmappable in both stock families
# (RSA / FOUNDERS_STOCK); only the remainder security's lineage (balance_security_id)
# round-trips. See docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_property:
  lookup_by:
    key: security_id
    through:
      mapping: ../issuance/StockIssuance.mapping.md
      on_property: issuance_type
  exhaustive: true

# shared: every source property. Carta has no repurchase transaction in either
# family, so the repurchase event fields are unmappable. The security aggregate
# quantity and partial-repurchase remainder lineage are the exceptions: they carry
# per-variant target maps on the resolved stock security.
shared:
  id:                  { kind: unmappable, target: null, reason: ocf-internal }
  comments:            { kind: unmappable, target: null, reason: no-equivalent }
  object_type:         { kind: unmappable, target: null, reason: ocf-internal }
  date:                { kind: unmappable, target: null, reason: no-equivalent }
  security_id:         { kind: unmappable, target: null, reason: ocf-internal }
  price:               { kind: unmappable, target: null, reason: no-equivalent }
  quantity:
    kind: computed                 # repurchased shares leave the security's treasury balance
    target:
      Rsa:     "#/$defs/RestrictedStockAward/properties/returnedToTreasuryQuantity"
      Default: "#/$defs/Certificate/properties/returnedToTreasuryQuantity"
  consideration_text:  { kind: unmappable, target: null, reason: no-equivalent }
  balance_security_id:
    kind: computed                 # remainder identity + lineage on the post-repurchase security
    target:
      Rsa:
        - "#/$defs/RestrictedStockAward/properties/id"
        - "#/$defs/RestrictedStockAward/properties/securityId"
        - "#/$defs/RestrictedStockAwardPrecededBy/properties/securities"
      Default:
        - "#/$defs/Certificate/properties/id"
        - "#/$defs/Certificate/properties/securityId"
        - "#/$defs/CertificatePrecededBy/properties/securities"

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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase%3A+security_id&property_path=security_id) |
| `price` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase%3A+price&property_path=price) |
| `quantity` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase%3A+quantity&property_path=quantity) |
| `consideration_text` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase%3A+consideration_text&property_path=consideration_text) |
| `balance_security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Frepurchase%2FStockRepurchase.mapping.md&title=%5BMapping+question%5D+StockRepurchase%3A+balance_security_id&property_path=balance_security_id) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Join on `security_id` to `StockIssuance.issuance_type`. Carta has no stock repurchase transaction, so the event date, price, consideration, and source security reference are not retained.
- `quantity` projects to the RSA/Certificate `returnedToTreasuryQuantity`; `balance_security_id` identifies the post-repurchase security and its reverse lineage. `id`, `comments`, and `object_type` are OCF scaffolding.

- [ ] `price`: Is the June 22 `Certificate.returnedInvestedCapital` the intended home for repurchase consideration — i.e. `price × quantity`? The field is new in this bundle, is a `Money`, and sits on the same `Certificate` that already receives this transaction's `returnedToTreasuryQuantity`, which makes it a plausible target for the capital returned to the holder on repurchase. Classified `no-equivalent` pending confirmation rather than mapped on inference, because the bundle carries no description for the field and a product-price aggregate would be wrong if Carta means original invested capital instead.
  - Target: Certificate.returnedInvestedCapital
  - Asked by: @johnscrudato
  - Answer: Open: confirm whether `returnedInvestedCapital` records repurchase consideration (`price × quantity`) and, if so, whether Carta expects the importer to compute the product or whether the value has independent provenance. `RestrictedStockAward` has no equivalent field, so an RSA-variant answer is needed too.
  - Answered by: —
