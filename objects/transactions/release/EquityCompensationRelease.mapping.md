---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/release/EquityCompensationRelease.schema.json
ocf_object_type: null
ocf_title: Object - Equity Compensation Release Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - security_id
  - settlement_date
  - release_price
  - quantity
  - resulting_security_ids
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Equity Compensation Release Transaction → Carta

> Object describing equity compensation security release transaction

## OCF schema

Source: [`EquityCompensationRelease.schema.json`](./EquityCompensationRelease.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/release/EquityCompensationRelease.schema.json",
  "title": "Object - Equity Compensation Release Transaction",
  "description": "Object describing equity compensation security release transaction",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/release/Release.schema.json"
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
        "TX_PLAN_SECURITY_RELEASE",
        "TX_EQUITY_COMPENSATION_RELEASE"
      ],
      "description": "This is done to avoid a breaking change as we work towards a bigger restructure of the equity types in v2.0.0. `TX_PLAN_SECURITY_RELEASE` will be deprecated in v2.0.0"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "settlement_date": {
      "description": "The settlement date for the shares released, typically after the release transaction date",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "release_price": {
      "description": "The release price used to determine the value of the security at the time of release",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    },
    "quantity": {
      "description": "Quantity of shares released",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "consideration_text": {
      "description": "Unstructured text description of consideration provided in exchange for security release",
      "type": "string"
    },
    "resulting_security_ids": {
      "title": "Security Release - Resulting Security ID Array",
      "description": "Identifier of the new security (or securities) issuance resulting from a release transaction",
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "object_type",
    "date",
    "security_id",
    "settlement_date",
    "release_price",
    "quantity",
    "resulting_security_ids"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/release/EquityCompensationRelease.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
# routing: route_by_security (downstream join). This release carries only
# security_id and NO discriminator, so the equity-comp family is undecidable from
# the record alone: it is resolved by joining security_id back to the
# EquityCompensationIssuance and reading that issuance's compensation_type.
# Only RSUs "release" (settle into shares); options/SARs have no Carta release
# surface, so those families route to null. See
# docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_security:
  via: security_id
  resolve: compensation_type
  resolve_enum: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/CompensationType.schema.json"
  source_mapping: ../issuance/EquityCompensationIssuance.mapping.md
  exhaustive: true

# shared: every source property. Fields whose Carta home differs by family carry
# a per-variant target map { Rsu/Option/Sar: pointer }. Only Rsu has a release
# surface (the RSU-settlement defs); Option/Sar are null because no Carta release
# transaction exists for those families.
shared:
  id:                 { kind: unmappable, target: null, reason: ocf-internal }
  comments:           { kind: unmappable, target: null, reason: no-equivalent }
  object_type:        { kind: unmappable, target: null, reason: ocf-internal }
  security_id:        { kind: unmappable, target: null, reason: ocf-internal }
  consideration_text: { kind: unmappable, target: null, reason: no-equivalent }
  date:
    kind: rename
    target:
      Rsu:    "#/$defs/RsuSettlementTransaction/properties/settlementDatetime"
      Option: null
      Sar:    null
  settlement_date:
    kind: rename
    target:
      Rsu:    "#/$defs/RestrictedStockUnitSettlement/properties/settlementDate"
      Option: null
      Sar:    null
  release_price:
    kind: rename
    target:
      Rsu:    "#/$defs/RestrictedStockUnitSettlement/properties/settlementPrice"
      Option: null
      Sar:    null
  quantity:
    kind: rename
    target:
      Rsu:    "#/$defs/RsuSettlementTransaction/properties/settledQuantity"
      Option: null
      Sar:    null
  resulting_security_ids:
    # cardinality narrowing: OCF array -> Carta scalar resultingSecurityId.
    kind: rename
    target:
      Rsu:    "#/$defs/RsuSettlementTransaction/properties/resultingSecurityId"
      Option: null
      Sar:    null

variants:

  Rsu:
    when: [RSU]
    primary_targets:
      - "#/$defs/RsuSettlementTransaction"
      - "#/$defs/RestrictedStockUnitSettlement"
    fields: {}

  Option:
    when: [OPTION, OPTION_NSO, OPTION_ISO]
    primary_targets: null
    fields: {}

  Sar:
    when: [CSAR, SSAR]
    primary_targets: null
    fields: {}

coverage:
  Option: 10/10
  Rsu: 10/10
  Sar: 10/10
```

## Notes / open questions

- **Join-dependent (downstream).** One OCF `EquityCompensationRelease` routes by the
  instrument family fixed at issuance, but the record itself carries no discriminator —
  only `security_id`. An importer must first resolve `compensation_type` from the joined
  `EquityCompensationIssuance` (the two-pass requirement,
  docs/polymorphic-transaction-routing.md §2.2), then route. `security_id` is the
  `route_by_security.via` join key, not a stored Carta field.
- **Only RSUs release.** "Release" here means a vested equity-comp security settling
  into shares. Carta models this *only* as RSU settlement — there is no
  `…ReleaseTransaction` for options or SARs — so the **Option** and **Sar** variants
  have `primary_targets: null` (whole family unmappable) and every shared field routes
  to `null` for them. The **Rsu** variant lands on the two Carta defs that describe the
  same RSU-settlement event from two angles: `RsuSettlementTransaction` (the transaction
  record) and `RestrictedStockUnitSettlement` (the settlement line-item carrying the
  economics, nested under `RestrictedStockUnit.settlements`).
- **Mappable Rsu fields.** `date` → `RsuSettlementTransaction.settlementDatetime` (OCF
  calendar date widening to a Carta datetime); `settlement_date` →
  `RestrictedStockUnitSettlement.settlementDate` (clean calendar-date match, deliberately
  a distinct node from the transaction `date`); `release_price` →
  `RestrictedStockUnitSettlement.settlementPrice` (the only Carta home for the price —
  `RsuSettlementTransaction` has no price field; Monetary ↔ Money); `quantity` →
  `RsuSettlementTransaction.settledQuantity` (shares released; numeric-string ↔ Decimal);
  `resulting_security_ids` → `RsuSettlementTransaction.resultingSecurityId`, a
  **cardinality narrowing** (OCF array → Carta scalar) — the one-release-one-result case
  round-trips cleanly, multiple resulting IDs cannot be represented without loss.
- **`consideration_text` has no home.** OCF stores free text describing consideration
  given for the release; Carta exposes no free-text consideration field on either RSU
  settlement def, so `no-equivalent` in every variant.
- **`object_type` / `id` / `comments` (`ocf-internal`).** `object_type`'s enum
  (`TX_PLAN_SECURITY_RELEASE`, the v1 alias deprecated in v2.0.0, and
  `TX_EQUITY_COMPENSATION_RELEASE`) is positionally encoded by the routed Carta def, with
  no per-record type discriminator to remap onto. OCF `id` identifies the OCF transaction
  object (Carta's same-named `RsuSettlementTransaction.id` is a *different* settlement-tx
  identifier, so reusing it would be wrong), and `comments` has no Carta slot.
