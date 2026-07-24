---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/StockAcceptance.schema.json
ocf_object_type: TX_STOCK_ACCEPTANCE
ocf_title: Object - Stock Acceptance Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - security_id
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Stock Acceptance Transaction → Carta

> Object describing a stock acceptance transaction

## OCF schema

Source: [`StockAcceptance.schema.json`](./StockAcceptance.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/acceptance/StockAcceptance.schema.json",
  "title": "Object - Stock Acceptance Transaction",
  "description": "Object describing a stock acceptance transaction",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/acceptance/Acceptance.schema.json"
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
      "const": "TX_STOCK_ACCEPTANCE"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "object_type",
    "date",
    "security_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/acceptance/StockAcceptance.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_property (downstream join). A stock acceptance carries only
# security_id and NO discriminator, so the family is undecidable from the record
# alone: it is resolved by joining security_id back to the StockIssuance and
# reading that issuance's issuance_type. An RSA acceptance lands on
# RestrictedStockAward.stakeholderAcceptanceDate; founders' / default stock maps to
# a Certificate, which has no acceptance field, so that variant is unmappable.
# See docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_property:
  lookup_by:
    key: security_id
    through:
      mapping: ../issuance/StockIssuance.mapping.md
      on_property: issuance_type
  exhaustive: true

# shared: every source property. `date` is the only mappable field and its Carta
# home differs by variant, so it carries a per-variant target map keyed by EVERY
# variant label (null = no acceptance slot in that variant).
shared:
  id:          { kind: unmappable, target: null, reason: ocf-internal }
  comments:    { kind: unmappable, target: null, reason: no-equivalent }
  object_type: { kind: unmappable, target: null, reason: ocf-internal }
  security_id: { kind: unmappable, target: null, reason: ocf-internal }
  date:
    kind: rename
    target:
      Rsa:     "#/$defs/RestrictedStockAward/properties/stakeholderAcceptanceDate"
      Default: null

variants:

  Rsa:
    when: [RSA]
    primary_targets:
      - "#/$defs/RestrictedStockAward"
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FStockAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FStockAcceptance.mapping.md&title=%5BMapping+question%5D+StockAcceptance) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FStockAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FStockAcceptance.mapping.md&title=%5BMapping+question%5D+StockAcceptance%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FStockAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FStockAcceptance.mapping.md&title=%5BMapping+question%5D+StockAcceptance%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FStockAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FStockAcceptance.mapping.md&title=%5BMapping+question%5D+StockAcceptance%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FStockAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FStockAcceptance.mapping.md&title=%5BMapping+question%5D+StockAcceptance%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Facceptance%2FStockAcceptance.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Facceptance%2FStockAcceptance.mapping.md&title=%5BMapping+question%5D+StockAcceptance%3A+security_id&property_path=security_id) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- **Join-dependent (downstream).** A stock acceptance carries only `security_id`
  and no discriminator; the security family is fixed at issuance, not on the
  acceptance record. An importer must resolve `issuance_type` from the joined
  `StockIssuance` first (the two-pass requirement, §2.2) before it can decide where
  the acceptance lands. `StockIssuanceType` has exactly two values — `RSA` and
  `FOUNDERS_STOCK` — which the two variants partition exhaustively.
- **`date` is the only mappable field.** For an `RSA` issuance the accepted security
  is a Carta `RestrictedStockAward`, which exposes
  `stakeholderAcceptanceDate` (`$ref Iso8601CompleteCalendarDate`); the OCF
  acceptance `date` is folded onto that security via the per-variant target map.
- **`Default` (FOUNDERS_STOCK) is unmappable.** Non-RSA stock maps to a Carta
  `Certificate`, and `Certificate` has no `stakeholderAcceptanceDate` (its only date
  fields are `issueDate` / `canceledDate` / `lastModifiedDatetime`). Carta also has
  no `StockAcceptanceTransaction` and no generic acceptance transaction, so there is
  nowhere to record a founders'-stock acceptance — `primary_targets: null` and
  `date → null` for this variant.
- **`security_id`** is the join key (`route_by_property.lookup_by.key`); it routes the family,
  it is not itself a stored Carta field on the resolved security.
- **`id`, `comments`, `object_type` → unmappable.** Standard OCF object scaffolding:
  `id` is OCF's own object identifier (Carta assigns server-side ids) and
  `object_type` is OCF's discriminator constant (`TX_STOCK_ACCEPTANCE`), both
  `ocf-internal`; `comments` is free-text with no Carta slot (`no-equivalent`).
