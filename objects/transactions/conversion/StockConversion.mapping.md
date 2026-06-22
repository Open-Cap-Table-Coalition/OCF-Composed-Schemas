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
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_security (downstream join). A stock conversion carries only
# security_id and NO discriminator, so the source security's family is fixed at
# issuance: join security_id back to the StockIssuance and read its issuance_type
# (RSA vs FOUNDERS_STOCK / absent). See docs/polymorphic-transaction-routing.md §2.2.
# Routing is moot for the *outputs* here, though: Carta has no stock-conversion
# transaction in EITHER family, so every variant is all-unmappable (primary_targets:
# null). The route block still declares the join so the conversion verb is recorded
# against the same enum its siblings (issuance/cancellation) partition.
status: complete

route_by_security:
  via: security_id
  resolve: issuance_type
  resolve_enum: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StockIssuanceType.schema.json"
  source_mapping: ../issuance/StockIssuance.mapping.md
  exhaustive: true

# shared: every source property. There is no Carta conversion home in any family,
# so all eight are plain unmappable (no per-variant target map is needed — a
# divergent home would require at least one variant where the field lands).
shared:
  id:                     { kind: unmappable, target: null, reason: ocf-internal }
  comments:               { kind: unmappable, target: null, reason: no-equivalent }
  object_type:            { kind: unmappable, target: null, reason: ocf-internal }
  date:                   { kind: unmappable, target: null, reason: no-equivalent }
  security_id:            { kind: unmappable, target: null, reason: ocf-internal }
  resulting_security_ids: { kind: unmappable, target: null, reason: no-equivalent }
  balance_security_id:    { kind: unmappable, target: null, reason: no-equivalent }
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

coverage:
  Rsa: 8/8
  Default: 8/8
```

## Notes / open questions

- **Downstream join (no discriminator on the record).** A stock conversion carries
  only `security_id` and the fixed `object_type` const — it has no `issuance_type` of
  its own. The source security's family was fixed at issuance, so an importer must
  resolve `issuance_type` by joining `security_id` back to the `StockIssuance`
  (RSA → `RestrictedStockAward` family; FOUNDERS_STOCK / absent → plain `Certificate`),
  the two-pass requirement in docs/polymorphic-transaction-routing.md §2.2. The
  `route_by_security:` block declares that join and partitions the
  `StockIssuanceType` enum (`{RSA, FOUNDERS_STOCK}`) exactly, just as the sibling
  `StockIssuance` mapping does at issuance time.
- **All variants are unmappable — Carta has no stock-conversion transaction in
  either family.** OCF models a stock-class conversion as a first-class transaction
  object (`TX_STOCK_CONVERSION`) pointing at the converted security and the securities
  it became. Carta's transaction surface is issuance / cancellation only: there is no
  `StockConversionTransaction`, no conversion `$def`, and no transaction-type for a
  conversion in the `RestrictedStockAward` family or the `Certificate` family. (Carta
  instead reconstructs the economic event as a cancel-of-source + issue-of-resulting
  pair joined by `SHARE_CLASS_CONVERTED` reason codes and `precededBySecurityId` — a
  reason-code convention, not a typed event, so there is no single Carta `$def` that
  is "the conversion." It cannot be a `primary_target`.) Hence `primary_targets: null`
  for both `Rsa` and `Default`, and every field is `unmappable`.
- **Per field, why no home.** `date`, `resulting_security_ids`, `balance_security_id`,
  and `quantity_converted` would each only land on the *synthesised* cancel/issue
  Carta records that no conversion `$def` owns, so they have no conversion-level
  Carta target (`no-equivalent`). `security_id` is the `route_by_security.via` join
  key — it routes the family, it is not itself a stored Carta field (`ocf-internal`).
  `id` is OCF's own object identifier and `object_type` is the fixed discriminator
  const `TX_STOCK_CONVERSION` (Carta types transactions positionally and has no
  conversion discriminator at all) — both `ocf-internal`.
- **Coverage.** Both variants are `8/8`: all eight source properties are shared and
  non-TODO (every one is a resolved `unmappable`), and neither variant adds any
  variant-specific fields, so X = shared (8) + own (0) = N = 8.
- Open question: representing a stock conversion on Carta at all requires the
  cancel+issue reason-code convention described above; that pairing/identity logic is
  export-tooling territory, not expressible in this static mapping. The mapping here
  faithfully records that no in-schema Carta home exists.
