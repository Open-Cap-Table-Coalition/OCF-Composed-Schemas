---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/conversion/StockConversion.schema.json
ocf_object_type: TX_STOCK_CONVERSION
ocf_title: Object - Stock Conversion Transaction
ocf_kind: object
required_fields:
  - quantity_converted
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

# Object - Stock Conversion Transaction → Carta

> Object describing a conversion of stock

## OCF schema

Source: [`StockConversion.schema.json`](./StockConversion.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/conversion/StockConversion.schema.json",
  "title": "Object - Stock Conversion Transaction",
  "description": "Object describing a conversion of stock",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/conversion/Conversion.schema.json"
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
      "const": "TX_STOCK_CONVERSION"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "resulting_security_ids": {
      "title": "Security Conversion - Resulting Security ID Array",
      "description": "Identifier for the security (or securities) that resulted from the conversion",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "balance_security_id": {
      "description": "Identifier for the security that holds the remainder balance (for partial conversions)",
      "type": "string"
    },
    "quantity_converted": {
      "description": "Quantity of non-monetary security units converted",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "quantity_converted",
    "id",
    "object_type",
    "date",
    "security_id",
    "resulting_security_ids"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/conversion/StockConversion.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_property (downstream join). A stock conversion carries only
# security_id and NO discriminator, so the source security's family is fixed at
# issuance: join security_id back to the StockIssuance and read its issuance_type
# (RSA vs FOUNDERS_STOCK / absent). See docs/polymorphic-transaction-routing.md §2.2.
# Routing matters for the *outputs*: Carta has no stock-conversion transaction in
# EITHER family (primary_targets: null, the event itself is unmappable), but the
# converted-to and balance securities ARE stock securities (RSA / Certificate)
# whose precededBy.securities records the converted-from security — so the
# conversion lineage round-trips losslessly via computed onto the resolved family's
# PrecededBy. The route block declares the join so the conversion verb is recorded
# against the same enum its siblings (issuance/cancellation) partition.
status: complete

route_by_property:
  lookup_by:
    key: security_id
    through:
      mapping: ../issuance/StockIssuance.mapping.md
      on_property: issuance_type
  exhaustive: true

# shared: every source property. There is no Carta conversion *transaction* home in
# any family, so the event fields stay unmappable — but resulting_security_ids and
# balance_security_id point at stock securities (RSA / Certificate) whose precededBy
# records the converted-from security, so each carries a per-variant target map
# { Rsa / Default: <Family>PrecededBy.securities } and is computed lineage.
shared:
  id:                     { kind: unmappable, target: null, reason: ocf-internal }
  comments:               { kind: unmappable, target: null, reason: no-equivalent }
  object_type:            { kind: unmappable, target: null, reason: ocf-internal }
  date:                   { kind: unmappable, target: null, reason: no-equivalent }
  security_id:            { kind: unmappable, target: null, reason: ocf-internal }
  resulting_security_ids:
    kind: computed                 # result identities + lineage on the converted-to certificates
    target:
      Rsa:
        - "#/$defs/RestrictedStockAward/properties/securityId"
        - "#/$defs/RestrictedStockAwardPrecededBy/properties/securities"
      Default:
        - "#/$defs/Certificate/properties/securityId"
        - "#/$defs/CertificatePrecededBy/properties/securities"
  balance_security_id:
    kind: computed                 # remainder identity + lineage on the unconverted security
    target:
      Rsa:
        - "#/$defs/RestrictedStockAward/properties/securityId"
        - "#/$defs/RestrictedStockAwardPrecededBy/properties/securities"
      Default:
        - "#/$defs/Certificate/properties/securityId"
        - "#/$defs/CertificatePrecededBy/properties/securities"
  quantity_converted:     { kind: unmappable, target: null, reason: no-equivalent }

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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FStockConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FStockConversion.mapping.md&title=%5BMapping+question%5D+StockConversion) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FStockConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FStockConversion.mapping.md&title=%5BMapping+question%5D+StockConversion%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FStockConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FStockConversion.mapping.md&title=%5BMapping+question%5D+StockConversion%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FStockConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FStockConversion.mapping.md&title=%5BMapping+question%5D+StockConversion%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FStockConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FStockConversion.mapping.md&title=%5BMapping+question%5D+StockConversion%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FStockConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FStockConversion.mapping.md&title=%5BMapping+question%5D+StockConversion%3A+security_id&property_path=security_id) |
| `resulting_security_ids` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FStockConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FStockConversion.mapping.md&title=%5BMapping+question%5D+StockConversion%3A+resulting_security_ids&property_path=resulting_security_ids) |
| `balance_security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FStockConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FStockConversion.mapping.md&title=%5BMapping+question%5D+StockConversion%3A+balance_security_id&property_path=balance_security_id) |
| `quantity_converted` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconversion%2FStockConversion.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconversion%2FStockConversion.mapping.md&title=%5BMapping+question%5D+StockConversion%3A+quantity_converted&property_path=quantity_converted) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Join on `security_id` to `StockIssuance.issuance_type`. Carta has no stock conversion transaction; the RSA/Certificate result and balance identities are preserved through successor-security `precededBy.securities` lineage.
- `date`, `quantity_converted`, and the conversion event itself have no target. `security_id` is only the routing key; `id`, `comments`, and `object_type` are OCF scaffolding.
