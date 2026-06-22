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
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_security (downstream join). This reissuance carries only
# security_id and NO discriminator, so the stock family (Rsa vs plain stock) is
# undecidable from the record alone: it is resolved by joining security_id back to
# the StockIssuance and reading that issuance's issuance_type. The reissuance verb
# itself has no Carta home in EITHER family — Carta models no reissuance
# transaction — so every variant is fully unmappable (primary_targets: null).
# See docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_security:
  via: security_id
  resolve: issuance_type
  resolve_enum: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StockIssuanceType.schema.json"
  source_mapping: ../issuance/StockIssuance.mapping.md
  exhaustive: true

# shared: every source property. All 8 are unmappable in both families (Carta has
# no reissuance transaction), so none carries a per-variant target map.
shared:
  id:                     { kind: unmappable, target: null, reason: ocf-internal }
  comments:               { kind: unmappable, target: null, reason: no-equivalent }
  object_type:            { kind: unmappable, target: null, reason: ocf-internal }
  date:                   { kind: unmappable, target: null, reason: no-equivalent }
  security_id:            { kind: unmappable, target: null, reason: ocf-internal }
  resulting_security_ids: { kind: unmappable, target: null, reason: no-equivalent }
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

coverage:
  Rsa: 8/8
  Default: 8/8
```

## Notes / open questions

- **Join-dependent (downstream), and fully unmappable in every family.** One OCF
  `TX_STOCK_REISSUANCE` would, if it had a Carta home, fan out by the stock family
  fixed at issuance — restricted-stock (`RSA`) vs plain stock (`FOUNDERS_STOCK`). The
  record itself carries no discriminator, only `security_id`, so an importer must
  resolve `issuance_type` from the joined `StockIssuance` first (the two-pass
  requirement, §2.2). But **Carta exposes no reissuance transaction in either
  family**, so both variants resolve to `primary_targets: null`: routing is still
  modelled for fidelity (the family is decidable), yet there is no destination tx
  to land on. See docs/polymorphic-transaction-routing.md §4.3.
- **`security_id`** is the join key (`route_by_security.via`); it routes the family,
  it is not itself a stored Carta field — hence `ocf-internal`, not a rename.
- **No mappable fields.** Carta has no stock-reissuance transaction (the
  `CertificatePrecededByReason` set is share-reserve / option-exercised /
  RSU-settled / debt-converted / warrant-exercised / share-class-converted /
  transferred / balance-reissued — a reissuance verb is not a transaction type, and
  the closest provenance reason is a property value on a *certificate*, not a home
  for these transaction fields). So `date`, `resulting_security_ids`, and
  `split_transaction_id` have no reissuance-transaction endpoint in either family.
- **`reason_text` has no home.** Free-form human-readable justification for the
  reissuance. Carta encodes provenance reasons as structured enum values, never as
  free text, and exposes no per-transaction notes/memo/comment string — the
  type-mapping policy treats free-text → enum as unmappable, not a rename.
- **`id`, `object_type`, `comments`** are standard OCF object scaffolding: `id` is
  OCF's own identifier (Carta assigns ids server-side), `object_type` is the fixed
  `TX_STOCK_REISSUANCE` discriminator (no Carta reissuance transaction type to
  receive it), and `comments` has no Carta slot.

