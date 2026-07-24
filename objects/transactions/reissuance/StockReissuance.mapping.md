---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/reissuance/StockReissuance.schema.json
ocf_object_type: TX_STOCK_REISSUANCE
ocf_title: Object - Stock Re-issuance Transaction
ocf_kind: object
required_fields:
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

# Object - Stock Re-issuance Transaction → Carta

> Object describing a re-issuance of stock

## OCF schema

Source: [`StockReissuance.schema.json`](./StockReissuance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/reissuance/StockReissuance.schema.json",
  "title": "Object - Stock Re-issuance Transaction",
  "description": "Object describing a re-issuance of stock",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/reissuance/Reissuance.schema.json"
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
      "const": "TX_STOCK_REISSUANCE"
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
      "title": "Security Reissuance - Resulting Security ID Array",
      "description": "Identifier of the new security (or securities) issuance resulting from a reissuance",
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "split_transaction_id": {
      "title": "Id of stock class split transaction",
      "description": "When stock is reissued as a result of a stock split, this field contains id of the respective stock class split transaction. It is not set otherwise.",
      "type": "string"
    },
    "reason_text": {
      "title": "Reason for stock reissuance",
      "description": "Free-form human-readable reason for stock reissuance",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "object_type",
    "date",
    "security_id",
    "resulting_security_ids"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/reissuance/StockReissuance.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_property (downstream join). This reissuance carries only
# security_id and NO discriminator, so the stock family (Rsa vs plain stock) is
# undecidable from the record alone: it is resolved by joining security_id back to
# the StockIssuance and reading that issuance's issuance_type. The reissuance verb
# itself has no Carta home in EITHER family — Carta models no reissuance
# transaction — so every variant has primary_targets: null. The reissued securities
# are nonetheless stock securities (Certificate / RSA) that record their origin in
# precededBy.securities, so resulting_security_ids round-trips via computed lineage.
# See docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_property:
  lookup_by:
    key: security_id
    through:
      mapping: ../issuance/StockIssuance.mapping.md
      on_property: issuance_type
  exhaustive: true

# shared: every source property. The reissuance event itself is unmappable in both
# families (Carta has no reissuance transaction), but resulting_security_ids lands on
# the reissued stock security's precededBy.securities via a per-variant target map.
shared:
  id:                     { kind: unmappable, target: null, reason: ocf-internal }
  comments:               { kind: unmappable, target: null, reason: no-equivalent }
  object_type:            { kind: unmappable, target: null, reason: ocf-internal }
  date:                   { kind: unmappable, target: null, reason: no-equivalent }
  security_id:            { kind: unmappable, target: null, reason: ocf-internal }
  resulting_security_ids:
    kind: computed                 # lineage: the reissued security precededBy
    target:
      Rsa:     "#/$defs/RestrictedStockAwardPrecededBy/properties/securities"
      Default: "#/$defs/CertificatePrecededBy/properties/securities"
  split_transaction_id:   { kind: unmappable, target: null, reason: no-equivalent }
  reason_text:            { kind: unmappable, target: null, reason: no-equivalent }

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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freissuance%2FStockReissuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freissuance%2FStockReissuance.mapping.md&title=%5BMapping+question%5D+StockReissuance) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freissuance%2FStockReissuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freissuance%2FStockReissuance.mapping.md&title=%5BMapping+question%5D+StockReissuance+%2F+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freissuance%2FStockReissuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freissuance%2FStockReissuance.mapping.md&title=%5BMapping+question%5D+StockReissuance+%2F+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freissuance%2FStockReissuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freissuance%2FStockReissuance.mapping.md&title=%5BMapping+question%5D+StockReissuance+%2F+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freissuance%2FStockReissuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freissuance%2FStockReissuance.mapping.md&title=%5BMapping+question%5D+StockReissuance+%2F+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freissuance%2FStockReissuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freissuance%2FStockReissuance.mapping.md&title=%5BMapping+question%5D+StockReissuance+%2F+security_id&property_path=security_id) |
| `resulting_security_ids` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freissuance%2FStockReissuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freissuance%2FStockReissuance.mapping.md&title=%5BMapping+question%5D+StockReissuance+%2F+resulting_security_ids&property_path=resulting_security_ids) |
| `split_transaction_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freissuance%2FStockReissuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freissuance%2FStockReissuance.mapping.md&title=%5BMapping+question%5D+StockReissuance+%2F+split_transaction_id&property_path=split_transaction_id) |
| `reason_text` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Freissuance%2FStockReissuance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Freissuance%2FStockReissuance.mapping.md&title=%5BMapping+question%5D+StockReissuance+%2F+reason_text&property_path=reason_text) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Join-dependent (downstream); the reissuance event is unmappable, the security
  lineage is not.** One OCF `TX_STOCK_REISSUANCE` fans out by the stock family fixed
  at issuance — restricted-stock (`RSA`) vs plain stock (`FOUNDERS_STOCK`). The record
  itself carries no discriminator, only `security_id`, so an importer must resolve
  `issuance_type` from the joined `StockIssuance` first (the two-pass requirement,
  §2.2). **Carta exposes no reissuance transaction in either family**, so both variants
  resolve to `primary_targets: null`: there is no destination tx to land the event on.
  But the *reissued securities* are stock securities (`Certificate` / `RestrictedStockAward`)
  that record their origin in `precededBy.securities`, so `resulting_security_ids`
  still round-trips losslessly via computed lineage. See
  docs/polymorphic-transaction-routing.md §4.3.
- **`security_id`** is the join key (`route_by_property.lookup_by.key`); it routes the family,
  it is not itself a stored Carta field — hence `ocf-internal`, not a rename.
- **No transaction-level endpoint.** Carta has no stock-reissuance transaction (the
  `CertificatePrecededByReason` set is share-reserve / option-exercised /
  RSU-settled / debt-converted / warrant-exercised / share-class-converted /
  transferred / balance-reissued — a reissuance verb is not a transaction type). So
  `date` and `split_transaction_id` have no reissuance-transaction endpoint in either
  family.
- **`resulting_security_ids` → lineage on the reissued security (kind `computed`).**
  A reissuance produces a new stock security — a Carta `Certificate` (plain stock) or
  `RestrictedStockAward` (RSA) — and each reissued security records its origin in
  `precededBy.securities` (a `PrecededBySecurity` array). The OCF *array* therefore
  round-trips **losslessly** as a set of reverse lineage edges per family:
  `CertificatePrecededBy.securities` for `Default`, `RestrictedStockAwardPrecededBy.securities`
  for `Rsa`. This is `computed` (importer-derived placement onto records the reissuance
  *references*), not a `rename` — there is no tx-level scalar, so the full lineage set
  is preserved. (The reissuance *event* still has no Carta home; only the resulting
  securities' provenance does.)
- **`reason_text` has no home.** Free-form human-readable justification for the
  reissuance. Carta encodes provenance reasons as structured enum values, never as
  free text, and exposes no per-transaction notes/memo/comment string — the
  type-mapping policy treats free-text → enum as unmappable, not a rename.
- **`id`, `object_type`, `comments`** are standard OCF object scaffolding: `id` is
  OCF's own identifier (Carta assigns ids server-side), `object_type` is the fixed
  `TX_STOCK_REISSUANCE` discriminator (no Carta reissuance transaction type to
  receive it), and `comments` has no Carta slot.

