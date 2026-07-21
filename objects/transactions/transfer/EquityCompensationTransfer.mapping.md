---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/transfer/EquityCompensationTransfer.schema.json
ocf_object_type: null
ocf_title: Object - Equity Compensation Transfer Transaction
ocf_kind: object
required_fields:
  - quantity
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

# Object - Equity Compensation Transfer Transaction → Carta

> Object describing a transfer of equity compensation

## OCF schema

Source: [`EquityCompensationTransfer.schema.json`](./EquityCompensationTransfer.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/transfer/EquityCompensationTransfer.schema.json",
  "title": "Object - Equity Compensation Transfer Transaction",
  "description": "Object describing a transfer of equity compensation",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/transfer/Transfer.schema.json"
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
        "TX_PLAN_SECURITY_TRANSFER",
        "TX_EQUITY_COMPENSATION_TRANSFER"
      ],
      "description": "This is done to avoid a breaking change as we work towards a bigger restructure of the equity types in v2.0.0. `TX_PLAN_SECURITY_TRANSFER` will be deprecated in v2.0.0"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "consideration_text": {
      "description": "Unstructured text description of consideration provided in exchange for security transfer",
      "type": "string"
    },
    "balance_security_id": {
      "description": "Identifier for the security that holds the remainder balance (for partial transfers)",
      "type": "string"
    },
    "resulting_security_ids": {
      "title": "Security Transfer - Resulting Security ID Array",
      "description": "Array of identifiers for new security (or securities) created as a result of the transaction",
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    },
    "quantity": {
      "description": "Quantity of non-monetary security units transferred",
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
    "resulting_security_ids"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/transfer/EquityCompensationTransfer.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_security (downstream join). This transfer carries only
# security_id and NO discriminator, so the equity-compensation family
# (Option/Rsu/Sar) is undecidable from the record alone: it is resolved by
# joining security_id back to the EquityCompensationIssuance and reading that
# issuance's compensation_type. The join is declared for honesty even though
# Carta has no equity-comp transfer transaction in ANY family — every variant
# is unmappable. See docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_security:
  via: security_id
  resolve: compensation_type
  resolve_enum: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/CompensationType.schema.json"
  source_mapping: ../issuance/EquityCompensationIssuance.mapping.md
  exhaustive: true

# shared: every source property. Carta defines exactly one transfer transaction
# (WarrantTransferTransaction, warrant track only) and NO equity-comp transfer
# transaction for any family, so there is no destination object to host any of
# these fields — every property is unmappable in every variant.
shared:
  id:                     { kind: unmappable, target: null, reason: ocf-internal }
  comments:               { kind: unmappable, target: null, reason: no-equivalent }
  object_type:            { kind: unmappable, target: null, reason: ocf-internal }
  date:                   { kind: unmappable, target: null, reason: no-equivalent }
  security_id:            { kind: unmappable, target: null, reason: ocf-internal }
  consideration_text:     { kind: unmappable, target: null, reason: no-equivalent }
  balance_security_id:    { kind: unmappable, target: null, reason: no-equivalent }
  resulting_security_ids: { kind: unmappable, target: null, reason: no-equivalent }
  quantity:               { kind: unmappable, target: null, reason: no-equivalent }

variants:

  Option:
    when: [OPTION, OPTION_NSO, OPTION_ISO]
    primary_targets: null
    fields: {}

  Rsu:
    when: [RSU]
    primary_targets: null
    fields: {}

  Sar:
    when: [CSAR, SSAR]
    primary_targets: null
    fields: {}

 ```

## Notes / open questions

- **Join-dependent (downstream), but no host exists in any family.** One OCF
  `EquityCompensationTransfer` would fan out to a per-family transfer transaction
  selected by the instrument family fixed at issuance. The record carries no
  discriminator, only `security_id`, so an importer must resolve
  `compensation_type` from the joined `EquityCompensationIssuance` first (the
  two-pass requirement, §2.2). The join is declared for honesty; the family it
  selects, however, has no equity-comp transfer transaction to land on — so all
  three variants set `primary_targets: null`.
- **Why equity-comp transfer has no Carta home (all variants).** Carta's pinned
  bundle (`target-schema/Carta.schema.json`) defines exactly **one** transfer
  transaction: `WarrantTransferTransaction` (`transferredDatetime`, `quantity`,
  `resultingSecurityId`, `resultingSecurityLabel`) — on the warrant track only.
  There is no `OptionTransferTransaction` / `RsuTransferTransaction` /
  `SarTransferTransaction` / `PlanSecurityTransferTransaction` anywhere in the
  bundle; the option-grant lifecycle container groups only issuance / exercises /
  cancellations (no transfers member). So no `Option`/`Rsu`/`Sar` transfer object
  exists to host any of these fields. (Sibling `WarrantTransfer.mapping.md` *does*
  have a home; equity-comp transfer does not — same "host transaction absent"
  situation as `EquityCompensationRetraction.mapping.md`.)
- **The lineage has no Carta home either (sharper gap than `StockTransfer`).**
  Transferring an equity-comp award produces a new `OptionGrant` / `RestrictedStockUnit` /
  `SAR`, and Carta's equity-comp security objects carry **no** `precededBy` edge — only
  the stock securities (`Certificate`, `RestrictedStockAward`) do. So
  `resulting_security_ids` / `balance_security_id` cannot round-trip as reverse lineage
  onto the resulting security the way they would on the stock side; they stay
  `unmappable`. This is a sharper gap than stock-side `StockTransfer` (#212), where the
  *event* is dropped but the *lineage* survives via `precededBy.securities` — here neither
  the transfer event nor its lineage has any Carta destination.
- **`date` / `quantity` / `resulting_security_ids` / `balance_security_id` /
  `consideration_text`** are the business fields a transfer would carry —
  effective date, units transferred, the resulting securities created, the
  partial-transfer remainder, and free-text consideration. Carta's only transfer
  object (`WarrantTransferTransaction`) carries datetime/quantity/single
  resulting-security analogues, but on the warrant track exclusively; with no
  equity-comp transfer object in any family, none of these has a destination.
  All `no-equivalent`.
- **`security_id`** is the join key (`route_by_security.via`); it routes the
  family rather than being a stored Carta field, so it is `ocf-internal`.
- **`object_type` (`TX_PLAN_SECURITY_TRANSFER` | `TX_EQUITY_COMPENSATION_TRANSFER`),
  `id`, `comments`** are OCF scaffolding — the object-type discriminator (legacy
  alias + its v2.0.0 replacement, both denoting the equity-comp transfer type),
  OCF's own identifier (Carta assigns ids server-side), and unstructured comments
  with no Carta slot. All `ocf-internal` / `no-equivalent` accordingly.
- **Net:** 0 of 9 fields map in any variant. Because Carta represents
  option/plan-security ownership as point-in-time grant state
  (`OptionGrant.stakeholderId`) rather than an append-only ledger of transfer
  events, the correct downstream behavior is to drop the OCF transfer event and
  reflect its effect by reassigning the resulting `OptionGrant`(s) to the new
  holder(s) and adjusting quantities, rather than emitting a transfer transaction
  Carta cannot represent.
