---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/EquityCompensationCancellation.schema.json
ocf_object_type: null
ocf_title: Object - Equity Compensation Cancellation Transaction
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

# Object - Equity Compensation Cancellation Transaction → Carta

> Object describing a cancellation of equity compensation

## OCF schema

Source: [`EquityCompensationCancellation.schema.json`](./EquityCompensationCancellation.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/cancellation/EquityCompensationCancellation.schema.json",
  "title": "Object - Equity Compensation Cancellation Transaction",
  "description": "Object describing a cancellation of equity compensation",
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
      "enum": [
        "TX_PLAN_SECURITY_CANCELLATION",
        "TX_EQUITY_COMPENSATION_CANCELLATION"
      ],
      "description": "This is done to avoid a breaking change as we work towards a bigger restructure of the equity types in v2.0.0. `TX_PLAN_SECURITY_CANCELLATION` will be deprecated in v2.0.0"
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
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/cancellation/EquityCompensationCancellation.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_security (downstream join). This cancellation carries only
# security_id and NO discriminator, so the Carta cancellation family
# (Option/Rsu/Sar) is undecidable from the record alone: it is resolved by
# joining security_id back to the EquityCompensationIssuance and reading that
# issuance's compensation_type. See docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_security:
  via: security_id
  resolve: compensation_type
  resolve_enum: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/CompensationType.schema.json"
  source_mapping: ../issuance/EquityCompensationIssuance.mapping.md
  exhaustive: true

# shared: fields whose Carta home differs by family carry a per-variant target map
# { Option/Rsu/Sar: pointer }; all three Carta cancellation txs share the same shape.
shared:
  id:                  { kind: unmappable, target: null, reason: ocf-internal }
  comments:            { kind: unmappable, target: null, reason: no-equivalent }
  object_type:         { kind: unmappable, target: null, reason: ocf-internal }
  security_id:         { kind: unmappable, target: null, reason: ocf-internal }
  balance_security_id: { kind: unmappable, target: null, reason: no-equivalent }
  reason_text:
    kind: computed                 # free text classified into the family's cancellation reason enum
    target:
      Option: "#/$defs/OptionCancellationTransaction/properties/reason"
      Rsu:    "#/$defs/RsuCancellationTransaction/properties/reason"
      Sar:    "#/$defs/SarCancellationTransaction/properties/reason"
  date:
    kind: rename
    target:
      Option: "#/$defs/OptionCancellationTransaction/properties/effectiveDatetime"
      Rsu:    "#/$defs/RsuCancellationTransaction/properties/effectiveDatetime"
      Sar:    "#/$defs/SarCancellationTransaction/properties/effectiveDatetime"
  quantity:
    kind: rename
    target:
      Option: "#/$defs/OptionCancellationTransaction/properties/quantity"
      Rsu:    "#/$defs/RsuCancellationTransaction/properties/quantity"
      Sar:    "#/$defs/SarCancellationTransaction/properties/quantity"

variants:

  Option:
    when: [OPTION, OPTION_NSO, OPTION_ISO]
    primary_targets:
      - "#/$defs/OptionCancellationTransaction"
    fields: {}

  Rsu:
    when: [RSU]
    primary_targets:
      - "#/$defs/RsuCancellationTransaction"
    fields: {}

  Sar:
    when: [CSAR, SSAR]
    primary_targets:
      - "#/$defs/SarCancellationTransaction"
    fields: {}

coverage:
  Option: 8/8
  Rsu: 8/8
  Sar: 8/8
```

## Notes / open questions

- **Join-dependent (downstream).** One OCF `EquityCompensationCancellation` fans out
  to three Carta cancellation transactions — `OptionCancellationTransaction`,
  `RsuCancellationTransaction`, `SarCancellationTransaction` — selected by the
  instrument family fixed at issuance. The record itself carries no discriminator,
  only `security_id`, so an importer must resolve `compensation_type` from the joined
  `EquityCompensationIssuance` first (the two-pass requirement, §2.2).
- **`date` / `quantity`** are the only mappable fields; each lands on the resolved
  family's cancellation tx (`effectiveDatetime` / `quantity`) via a per-variant
  target map.
- **`reason_text` lands lossily (kind `computed`).** Carta's cancellation `reason` is
  an enum (`OptionCancellationReason` / `RsuCancellationReason` / `SarCancellationReason`)
  and OCF `reason_text` is free text, so this is not a member-for-member `enum-remap`:
  an importer classifies the free text into the resolved family's enum, keeping the
  bucket and dropping the prose. It lands on the family's cancellation tx `reason` via
  a per-variant target map, mirroring `date`/`quantity` — and matching the
  `ConvertibleCancellation` / `WarrantCancellation` siblings.
- **`security_id`** is the join key (`route_by_security.via`); it routes the family,
  it is not itself a stored Carta field. **`balance_security_id`** (partial-cancel
  remainder) has no Carta equivalent on any cancellation tx.
- **Lineage asymmetry — why `balance_security_id` stays unmappable here.** A partial
  equity-comp cancellation mints a new balance security in the *same* family — an
  `OptionGrant` / `RestrictedStockUnit` / `SarTransactionItem` — and Carta's
  equity-comp security objects carry **no `precededBy` edge**; only the stock
  securities (`Certificate`, `RestrictedStockAward`) do. So unlike the stock families,
  `balance_security_id` has no Carta reverse-lineage home to be `computed` onto and
  remains genuinely unmappable. Contrast the stock-side `StockCancellation` (#182),
  where the same field *is* recorded via the resulting security's
  `precededBy.securities`.
