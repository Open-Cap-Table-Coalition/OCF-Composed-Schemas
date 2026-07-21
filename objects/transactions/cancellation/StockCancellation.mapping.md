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
target_version: "v1alpha1 (2026-04-30)"
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
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_security (downstream join). This cancellation carries only
# security_id and NO discriminator, so the Carta cancellation family
# (Rsa vs Certificate) is undecidable from the record alone: it is resolved by
# joining security_id back to the StockIssuance and reading that issuance's
# issuance_type. An RSA cancel must route to RsaCancellationTransaction, never to
# the Certificate family (the bug-#219 class). See
# docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_security:
  via: security_id
  resolve: issuance_type
  resolve_enum: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StockIssuanceType.schema.json"
  source_mapping: ../issuance/StockIssuance.mapping.md
  exhaustive: true

# shared: every source property. date/quantity land on a different Carta
# cancellation tx per family, so they carry a per-variant target map
# { Rsa: pointer, Default: pointer }.
shared:
  id:                  { kind: unmappable, target: null, reason: ocf-internal }
  comments:            { kind: unmappable, target: null, reason: no-equivalent }
  object_type:         { kind: unmappable, target: null, reason: ocf-internal }
  security_id:         { kind: unmappable, target: null, reason: ocf-internal }
  reason_text:
    kind: computed                 # free text classified into the family's cancellation reason enum
    target:
      Rsa:     "#/$defs/RsaCancellationTransaction/properties/reason"
      Default: "#/$defs/CertificateCancellationTransaction/properties/reason"
  balance_security_id:
    kind: computed                 # lineage: the partial-cancel remainder security precededBy
    target:
      Rsa:     "#/$defs/RestrictedStockAwardPrecededBy/properties/securities"
      Default: "#/$defs/CertificatePrecededBy/properties/securities"
  date:
    kind: rename
    target:
      Rsa:     "#/$defs/RsaCancellationTransaction/properties/effectiveDatetime"
      Default: "#/$defs/CertificateCancellationTransaction/properties/effectiveDatetime"
  quantity:
    kind: rename
    target:
      Rsa:     "#/$defs/RsaCancellationTransaction/properties/quantity"
      Default: "#/$defs/CertificateCancellationTransaction/properties/quantity"

variants:

  Rsa:
    when: [RSA]
    primary_targets:
      - "#/$defs/RsaCancellationTransaction"
    fields: {}

  Default:
    when: [FOUNDERS_STOCK]
    primary_targets:
      - "#/$defs/CertificateCancellationTransaction"
    fields: {}

 ```

## Notes / open questions

- **Join-dependent (downstream).** One OCF `StockCancellation` fans out to two Carta
  cancellation transactions — `RsaCancellationTransaction` (restricted stock awards)
  and `CertificateCancellationTransaction` (founders / plain certificated stock) —
  selected by the stock family fixed at issuance. The record itself carries no
  discriminator, only `security_id`, so an importer must resolve `issuance_type` from
  the joined `StockIssuance` first (the two-pass requirement, §2.2). Routing an RSA
  cancel into the Certificate family would be the bug-#219 misroute; the
  `route_by_security` join prevents it.
- **`date` / `quantity`** are the mappable tx-level fields; each lands on the resolved
  family's cancellation tx (`effectiveDatetime` / `quantity`) via a per-variant target
  map. **Granularity to flag:** OCF `date` is a calendar date and Carta
  `effectiveDatetime` is a full datetime, so an importer must widen the OCF date
  (the reverse is lossy).
- **`reason_text` lands lossily (kind `computed`).** Carta's cancellation `reason` is
  an enum (`CertificateCancellationReason` / the RSA equivalent) and OCF `reason_text`
  is free text, so this is not a member-for-member `enum-remap`: an importer must
  classify the free text into the family's enum, keeping the bucket and dropping the
  prose. It lands on the resolved family's cancellation tx `reason` via a per-variant
  target map, mirroring `date`/`quantity` — and matching the `ConvertibleCancellation`
  / `WarrantCancellation` siblings, which map the identical field the same way.
- **`security_id`** is the join key (`route_by_security.via`); it routes the family,
  it is not itself a stored Carta field.
- **`balance_security_id` round-trips as lineage (kind `computed`).** The remainder
  security minted by a partial cancellation is itself a stock security —
  `RestrictedStockAward` for the RSA family, `Certificate` for the default family — and
  both carry `precededBy.securities` (a `PrecededBySecurity` array). The remainder
  records the cancelled security as its predecessor, so an importer writes the cancelled
  `security_id` into the remainder's `precededBy.securities`: this reverse lineage edge
  round-trips losslessly, it is not unmappable. (The cancellation tx *itself* still
  holds no balance field — only the security lineage carries it.)
- **`id`, `comments`, `object_type`** are OCF scaffolding with no Carta home: `id`
  is OCF's own object identifier, `comments` is free-text metadata, and `object_type`
  (the fixed `const TX_STOCK_CANCELLATION`) is the transaction discriminator — Carta
  selects the kind by which `$def` it instantiates, so the string has no target.
