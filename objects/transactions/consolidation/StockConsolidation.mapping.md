---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/consolidation/StockConsolidation.schema.json
ocf_object_type: TX_STOCK_CONSOLIDATION
ocf_title: Object - Stock Consolidation Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - resulting_security_id
  - security_ids
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Object - Stock Consolidation Transaction → Carta

> Object describing a consolidation of stock positions

## OCF schema

Source: [`StockConsolidation.schema.json`](./StockConsolidation.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/consolidation/StockConsolidation.schema.json",
  "title": "Object - Stock Consolidation Transaction",
  "description": "Object describing a consolidation of stock positions",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/Transaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/consolidation/Consolidation.schema.json"
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
      "const": "TX_STOCK_CONSOLIDATION"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "resulting_security_id": {
      "description": "Identifier for the security that holds the consolidated balance from this transaction",
      "type": "string"
    },
    "security_ids": {
      "title": "Consolidation Security IDs Array",
      "description": "Array of identifiers for the security (or securities) being consolidation as a result of the transaction",
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "reason_text": {
      "title": "Reason for stock consolidation",
      "description": "Free-form human-readable reason for stock consolidation",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "object_type",
    "date",
    "resulting_security_id",
    "security_ids"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/consolidation/StockConsolidation.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_property (downstream join). This consolidation carries NO
# scalar security_id and NO discriminator — it folds many stock positions
# (security_ids) into one resulting_security_id. The stock family (Rsa vs.
# Founders/Default) is fixed at issuance, so it is resolved by joining the
# consolidated securities back to their StockIssuance and reading that
# issuance's issuance_type. No Carta consolidation transaction exists, so the
# transaction event (date/reason_text) is unmappable — but the consolidation
# lineage round-trips losslessly onto the resulting stock security's precededBy.
# See docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_property:
  lookup_by:
    key: security_ids
    through:
      mapping: ../issuance/StockIssuance.mapping.md
      on_property: issuance_type
  exhaustive: true

# shared: every source property. No Carta consolidation tx exists, so the event
# fields (date/reason_text) are unmappable; but the consolidation lineage
# (security_ids → resulting_security_id) round-trips onto the resulting stock
# security's precededBy.securities and carries a per-variant target map.
shared:
  id:                    { kind: unmappable, target: null, reason: ocf-internal }
  comments:              { kind: unmappable, target: null, reason: no-equivalent }
  object_type:           { kind: unmappable, target: null, reason: ocf-internal }
  date:                  { kind: unmappable, target: null, reason: no-equivalent }
  resulting_security_id:
    kind: computed                 # result identity + lineage: the consolidated-into security records the inputs
    target:
      Rsa:
        - "#/$defs/RestrictedStockAward/properties/id"
        - "#/$defs/RestrictedStockAward/properties/securityId"
        - "#/$defs/RestrictedStockAwardPrecededBy/properties/securities"
      Default:
        - "#/$defs/Certificate/properties/id"
        - "#/$defs/Certificate/properties/securityId"
        - "#/$defs/CertificatePrecededBy/properties/securities"
  security_ids:
    kind: computed                 # lineage + via: the consolidated inputs become the resulting security precededBy
    target:
      Rsa:     "#/$defs/RestrictedStockAwardPrecededBy/properties/securities"
      Default: "#/$defs/CertificatePrecededBy/properties/securities"
  reason_text:           { kind: unmappable, target: null, reason: no-equivalent }

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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconsolidation%2FStockConsolidation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconsolidation%2FStockConsolidation.mapping.md&title=%5BMapping+question%5D+StockConsolidation) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconsolidation%2FStockConsolidation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconsolidation%2FStockConsolidation.mapping.md&title=%5BMapping+question%5D+StockConsolidation%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconsolidation%2FStockConsolidation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconsolidation%2FStockConsolidation.mapping.md&title=%5BMapping+question%5D+StockConsolidation%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconsolidation%2FStockConsolidation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconsolidation%2FStockConsolidation.mapping.md&title=%5BMapping+question%5D+StockConsolidation%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconsolidation%2FStockConsolidation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconsolidation%2FStockConsolidation.mapping.md&title=%5BMapping+question%5D+StockConsolidation%3A+date&property_path=date) |
| `resulting_security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconsolidation%2FStockConsolidation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconsolidation%2FStockConsolidation.mapping.md&title=%5BMapping+question%5D+StockConsolidation%3A+resulting_security_id&property_path=resulting_security_id) |
| `security_ids` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconsolidation%2FStockConsolidation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconsolidation%2FStockConsolidation.mapping.md&title=%5BMapping+question%5D+StockConsolidation%3A+security_ids&property_path=security_ids) |
| `reason_text` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fconsolidation%2FStockConsolidation.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fconsolidation%2FStockConsolidation.mapping.md&title=%5BMapping+question%5D+StockConsolidation%3A+reason_text&property_path=reason_text) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Join on `security_ids` to `StockIssuance.issuance_type`; neither RSA nor FOUNDERS_STOCK has a Carta consolidation transaction. `date` and `reason_text` are therefore dropped.
- `resulting_security_id` identifies the successor certificate/award, and each `security_id` is written as a reverse `precededBy.securities` lineage edge. `id`, `comments`, and `object_type` are OCF scaffolding.
