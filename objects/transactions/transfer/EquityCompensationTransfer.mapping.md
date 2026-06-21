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
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 9/9

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
      TX_PLAN_SECURITY_TRANSFER: null
      TX_EQUITY_COMPENSATION_TRANSFER: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  consideration_text:
    kind: unmappable
    target: null
    reason: no-equivalent
  balance_security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  resulting_security_ids:
    kind: unmappable
    target: null
    reason: no-equivalent
  quantity:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Bucket: n/a-object (OCF transaction object).** This is an `ocf_kind: object` transaction, so it is not subject to the 3-bucket OCF-*type* policy — it would normally map its own properties directly onto the fields of the corresponding Carta transaction object. The blocking fact here is that **Carta has no transfer transaction for equity compensation / option grants**, so there is no destination object to host any of these fields. Every field is therefore `unmappable`. (`object_type`, `id`, `comments` are OCF scaffolding → `ocf-internal`; the six business fields → `no-equivalent`.)
- **Why equity-comp transfer has no Carta home.** Carta's pinned bundle (`target-schema/Carta.schema.json`) defines exactly **one** transfer transaction: `WarrantTransferTransaction` (`transferredDatetime`, `quantity`, `resultingSecurityId`, `resultingSecurityLabel`). Grepping the bundle for `*Transfer*` returns only `WarrantTransferTransaction`, the `WarrantTransactionItem.transfers` array, and the `transferredDatetime` field — i.e., transfers exist *only* on the warrant track. The option-grant lifecycle container, `OptionTransactionItem`, groups only `issuance` / `exercises` / `cancellations` (no `transfers` member), and there is no `OptionTransferTransaction` / `PlanSecurityTransferTransaction` / `EquityCompensationTransferTransaction` anywhere in the bundle or in `/tmp/carta-index.json`. So OCF's transfer-of-equity-compensation event has no analogous Carta transaction object to map onto. By contrast, `WarrantTransfer.mapping.md` (sibling) *does* have a home (`WarrantTransferTransaction`); equity-comp transfer does not. This is the same "host transaction is absent" situation already established for `EquityCompensationRetraction.mapping.md`.
- **`object_type` (`TX_PLAN_SECURITY_TRANSFER` | `TX_EQUITY_COMPENSATION_TRANSFER`).** OCF scaffolding discriminator. Both enum members denote the equity-compensation transfer transaction type — `TX_PLAN_SECURITY_TRANSFER` is the legacy alias being deprecated in OCF v2.0.0, `TX_EQUITY_COMPENSATION_TRANSFER` is its replacement. Carta types its records positionally per endpoint and has no transfer type for equity comp to discriminate to, so both values map to `null`. Classified `ocf-internal` (object-type discriminator), consistent with the `Issuer` / `EquityCompensationRetraction` precedents.
- **`quantity`** (OCF `Numeric`; required). Quantity of non-monetary option/plan-security units transferred. Carta's only transfer object carries a `quantity` (`Decimal`), but it lives on `WarrantTransferTransaction`, which is reserved for the warrant track; there is no equity-comp transfer object to host this count. `no-equivalent`.
- **`resulting_security_ids`** (array, `minItems: 1`, required). OCF's foreign keys to the new option/plan securities created by the transfer (the transferee's grant, and any balance grant). Carta's transfer model records the resulting security as a **single** `resultingSecurityId` (+ `resultingSecurityLabel`) on `WarrantTransferTransaction` — but again only on the warrant track, and as a scalar rather than OCF's array. No equity-comp transfer object exists to receive these. `no-equivalent`.
- **`balance_security_id`.** OCF's foreign key to the security holding the remainder after a *partial* transfer. Carta does not model partial-transfer remainders as a distinct id on a transfer object; the closest concept is the `*_PRECEDED_BY_REASON_BALANCE_REISSUED` enum members on `CertificatePrecededByReason` / `RestrictedStockAwardPrecededByReason`, which annotate a *certificate/RSA* re-issued as a balance — neither applies to option grants, and neither is a transfer-object field. With no equity-comp transfer object, there is nowhere to route this. `no-equivalent`.
- **`consideration_text`.** OCF free-text description of consideration exchanged for the transfer. Carta's transaction objects carry no consideration field at all (its monetary fields are typed `Money`/`Decimal` price/cash amounts on issuance/exercise objects, not free-text consideration on transfers). `no-equivalent`.
- **`security_id`** (required). OCF's foreign key to the equity-compensation security being transferred. Carta references securities via `securityId` on its real transaction objects, but those keys live on the transaction objects that exist (option issuance/exercise/cancellation); there is no equity-comp transfer object to host a `securityId`. `no-equivalent`.
- **`date`** (OCF `Date`; required). Calendar date of the transfer. Carta's warrant transfer records `transferredDatetime` (`Iso8601CompleteCalendarDateTime`), but there is no equity-comp transfer object to host an equivalent datetime. (Were a home to exist, the OCF calendar-date-vs-Carta-datetime granularity difference would also apply.) `no-equivalent`.
- **`id`, `comments`.** OCF object scaffolding: `id` is OCF's own identifier (Carta assigns identifiers server-side) and `comments` has no Carta slot. Both `ocf-internal`.
- **Net:** 0 of 9 fields map. Because Carta represents option/plan-security ownership as point-in-time grant state (`OptionGrant.stakeholderId`) rather than as an append-only ledger of transfer events, the correct downstream behavior is to drop the OCF transfer event and instead reflect its effect by reassigning the resulting `OptionGrant`(s) to the new holder(s) — the transferee's grant(s) and any balance grant — and adjusting quantities, rather than emitting a transfer transaction Carta cannot represent.
