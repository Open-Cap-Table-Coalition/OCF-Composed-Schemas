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
status: complete
coverage: 10/10

fields:
  id:
    kind: unmappable
    target: null
    reason: ocf-internal
  comments:
    kind: unmappable
    target: null
    reason: ocf-internal
  object_type:
    kind: unmappable
    target: null
    reason: ocf-internal
    values:
      TX_PLAN_SECURITY_RELEASE: null
      TX_EQUITY_COMPENSATION_RELEASE: null
  date:
    kind: rename
    target: "#/$defs/RsuSettlementTransaction/properties/settlementDatetime"
  security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  settlement_date:
    kind: rename
    target: "#/$defs/RestrictedStockUnitSettlement/properties/settlementDate"
  release_price:
    kind: rename
    target: "#/$defs/RestrictedStockUnitSettlement/properties/settlementPrice"
  quantity:
    kind: rename
    target: "#/$defs/RestrictedStockUnitSettlement/properties/releaseQuantity"
  consideration_text:
    kind: unmappable
    target: null
    reason: no-equivalent
  resulting_security_ids:
    kind: rename
    target: "#/$defs/RsuSettlementTransaction/properties/resultingSecurityId"
```

## Notes / open questions

- **Bucket: n/a-object** (this is an OCF transaction, `ocf_kind: object`, so its properties map directly onto the corresponding Carta object's fields rather than to a reusable `$def`).
- **Carta has no dedicated *release* transaction type.** Carta's transaction set (`CertificateIssuance/Cancellation`, `Option…`, `Convertible…`, `Warrant…`, `Rsa…`, `Rsu…`, `Sar…`, `Phantom…`, `Piu…`) contains no `…ReleaseTransaction`. OCF's `EquityCompensationRelease` (and its v1 alias `PlanSecurityRelease`) records the *release / settlement* of a vested equity-compensation security — restrictions lapsing and units settling into shares, producing one or more resulting securities. The only place Carta models this "release" concept is the **RSU settlement** surface: `#/$defs/RsuSettlementTransaction` ("A settlement transaction for an RSU award. Represents the conversion of vested units into shares.") and the descriptive structure `#/$defs/RestrictedStockUnitSettlement` ("Restricted stock unit settlement information.") embedded under `RestrictedStockUnit.settlements`. These two Carta defs describe the *same* RSU-settlement event from two angles (the transaction record vs. the settlement line-item that carries the economics), so this mapping anchors the event/result fields on `RsuSettlementTransaction` and the release economics (date, price, quantity) on `RestrictedStockUnitSettlement`, which is the only Carta node that exposes them.
- **Scope caveat:** Carta's home is RSU-specific. OCF's `EquityCompensationRelease` is broader — it can in principle release any plan/equity-compensation security (the `security_id` could reference an option/SAR/RSU plan security), whereas Carta only models a release as an *RSU* settlement. A release of a non-RSU equity-comp security has no Carta representation, and even for RSUs Carta's settlement is reconstructed structurally under the parent `RestrictedStockUnit.settlements` / the `RsuSettlementTransaction` record, not as a standalone OCF-style transaction object.
- `date` → `RsuSettlementTransaction.settlementDatetime`: OCF's `date` is "Date on which the transaction occurred" (`types/Date.schema.json`, a calendar **date**, `YYYY-MM-DD`). Carta's `settlementDatetime` is `#/$defs/Iso8601CompleteCalendarDateTime` — a full **datetime**. Standard OCF-date → Carta-datetime granularity widening (OCF carries no time-of-day; a serializer appends e.g. midnight UTC, the reverse truncates). Note that OCF distinguishes the transaction `date` from `settlement_date` (the latter "typically after the release transaction date"); Carta's transaction record exposes a single `settlementDatetime`, so the two OCF dates land on *different* Carta nodes (`date` on the transaction, `settlement_date` on the settlement line-item — see below).
- `settlement_date` → `RestrictedStockUnitSettlement.settlementDate`: direct semantic match — "The settlement date for the shares released" → Carta's `settlementDate` (`#/$defs/Iso8601CompleteCalendarDate`, a calendar **date**, so no granularity change here). This is the cleanest leaf home for OCF's settlement date and is deliberately distinct from the transaction `date` above.
- `release_price` → `RestrictedStockUnitSettlement.settlementPrice`: OCF's `release_price` ("The release price used to determine the value of the security at the time of release", `types/Monetary.schema.json`) → Carta's `settlementPrice` (`#/$defs/Money`). `RsuSettlementTransaction` carries **no** price field, so `RestrictedStockUnitSettlement.settlementPrice` is the *only* Carta home for the release price. Per-share vs. aggregate: OCF `Monetary` is an amount+currency object and the description frames it as the price "to determine the value of the security at the time of release"; Carta `Money` is likewise amount+currency. Both standards treat this as a price, so it is a straight type-shape rename (Monetary `{amount, currency}` ↔ Money), with the usual Monetary→Money field renames handled by `types/Monetary.mapping.md`.
- `quantity` → `RestrictedStockUnitSettlement.releaseQuantity`: OCF `quantity` ("Quantity of shares released", `types/Numeric.schema.json`, a stringified decimal) → Carta's literal-name match `releaseQuantity` (`#/$defs/Decimal`). Same concept (shares released), numeric-string ↔ Decimal representation change only. (Carta also exposes `RsuSettlementTransaction.settledQuantity` and `RestrictedStockUnitSettlement.netSettlementQuantity`, but those denote *net* settled shares after withholding/sale; OCF's `quantity` is the gross released amount, which matches `releaseQuantity`, not the net figures.)
- `resulting_security_ids` → `RsuSettlementTransaction.resultingSecurityId`: **cardinality narrowing.** OCF allows an *array* of resulting security IDs ("the new security (or securities) issuance resulting from a release transaction"); Carta's `resultingSecurityId` is a single string. The common case (one release → one resulting certificate) round-trips cleanly; an OCF release listing multiple `resulting_security_ids` cannot be represented without loss / splitting into multiple Carta settlement records. Carta additionally exposes `resultingSecurityType` and `resultingSecurityLabel` describing that single resulting security, which have no OCF counterpart on this object.
- `security_id` → unmappable / `no-equivalent`: OCF's `security_id` points back to the *source* equity-compensation security being released. `RsuSettlementTransaction` has **no field referencing the source security** — its only `id` is "the identifier of the settlement transaction," and the settlement is linked to its grant structurally (settlements live nested under `RestrictedStockUnit.settlements`, and `RestrictedStockUnit.securityId` identifies the grant). So the source-security linkage is carried by the parent container, not by a property on the settlement transaction; there is no leaf property to receive `security_id`, and it is reconstructed at the object-graph level rather than field-mapped.
- `consideration_text` → unmappable / `no-equivalent`: OCF stores free-text describing the consideration provided in exchange for the security release. Carta has no free-text consideration field anywhere on the RSU-settlement surface (`RsuSettlementTransaction` / `RestrictedStockUnitSettlement`); the nearest fields are constrained quantity/price figures, not an unstructured consideration description, so this cannot be losslessly remapped.
- `object_type` → unmappable / `ocf-internal`: OCF's discriminator enum (`TX_PLAN_SECURITY_RELEASE`, the v1 alias retained for backward compatibility and deprecated in v2.0.0, and `TX_EQUITY_COMPENSATION_RELEASE`). Both values denote the same release/settlement concept, which Carta types positionally as `RsuSettlementTransaction` — there is no per-record type discriminator to remap onto, so both enum values route to `null`.
- `id`, `comments` → unmappable / `ocf-internal`: standard OCF object scaffolding. OCF's `id` identifies the OCF transaction object and Carta assigns its own server-side identifiers; note that Carta's same-named `RsuSettlementTransaction.id` is semantically *different* ("identifier of the settlement transaction"), so mapping OCF `id` onto it would be wrong. `comments` has no Carta slot.
- **Unused Carta fields:** on `RsuSettlementTransaction`: `id`, `settledQuantity`, `withheldQuantity`, `resultingSecurityType`, `resultingSecurityLabel`; on `RestrictedStockUnitSettlement`: `saleQuantity`, `withholdingQuantity`, `netSettlementQuantity`, `certificateId`, `certificateLabel`. These have no source field on this OCF object (OCF models tax withholding / sale-to-cover and the resulting-certificate metadata elsewhere or not at all) and are left unpopulated.
