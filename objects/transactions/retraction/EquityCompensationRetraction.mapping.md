---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/retraction/EquityCompensationRetraction.schema.json
ocf_object_type: null
ocf_title: Object - Equity Compensation Retraction Transaction
ocf_kind: object
required_fields:
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

# Object - Equity Compensation Retraction Transaction → Carta

> Object describing a retraction of equity compensation

## OCF schema

Source: [`EquityCompensationRetraction.schema.json`](./EquityCompensationRetraction.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/retraction/EquityCompensationRetraction.schema.json",
  "title": "Object - Equity Compensation Retraction Transaction",
  "description": "Object describing a retraction of equity compensation",
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
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/retraction/Retraction.schema.json"
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
        "TX_PLAN_SECURITY_RETRACTION",
        "TX_EQUITY_COMPENSATION_RETRACTION"
      ],
      "description": "This is done to avoid a breaking change as we work towards a bigger restructure of the equity types in v2.0.0. `TX_PLAN_SECURITY_RETRACTION` will be deprecated in v2.0.0"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "reason_text": {
      "description": "Reason for the retraction",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/retraction/EquityCompensationRetraction.schema.json",
  "required": [
    "id",
    "object_type",
    "date",
    "security_id",
    "reason_text"
  ]
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 6/6

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
      TX_PLAN_SECURITY_RETRACTION: null
      TX_EQUITY_COMPENSATION_RETRACTION: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  reason_text:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Bucket: n/a-object (OCF transaction object).** This is an `ocf_kind: object` transaction, so it is not subject to the 3-bucket type policy — it would normally map its own properties directly onto the corresponding Carta transaction object's fields. The blocking fact here is that **Carta has no retraction transaction at all**, so there is no destination object to carry any of these fields. Every field is therefore `unmappable`.
- **Why retraction has no Carta home.** In OCF a *retraction* voids a previously-recorded transaction entry — it asserts the prior transaction never validly happened (it was entered in error and is being withdrawn from the ledger). This is a *ledger-correction* event, semantically distinct from a *cancellation*, which records a real-world lifecycle event in which an outstanding security is genuinely canceled/terminated/forfeited. Carta's transaction set models the lifecycle events (Issuance / Cancellation / Exercise / Settlement / Transfer) but has no concept for "this previously-entered transaction is being retracted/void." Searching the pinned bundle (`target-schema/Carta.schema.json`) and `/tmp/carta-index.json` for `retract` / `Retraction` returns nothing.
- **`object_type` (`TX_PLAN_SECURITY_RETRACTION` | `TX_EQUITY_COMPENSATION_RETRACTION`).** OCF scaffolding discriminator. Both enum members denote the equity-compensation retraction transaction type (`TX_PLAN_SECURITY_RETRACTION` is the legacy alias being deprecated in OCF v2.0.0, `TX_EQUITY_COMPENSATION_RETRACTION` is its replacement). Carta types its records positionally per endpoint and has no retraction type to discriminate to, so both values map to `null`. Classified `ocf-internal` (object-type discriminator), consistent with the `Issuer` precedent.
- **`reason_text`.** OCF free-text reason for the retraction. The only `reason`-bearing fields in Carta are the per-cancellation enums (`OptionCancellationReason`, `RsaCancellationReason`, `WarrantCancellationReason`, etc.), each constrained to lifecycle outcomes such as `*_TERMINATED` / `*_CANCELED` / `*_FORFEITED` / `*_REPURCHASED` — none expresses "transaction retracted / entered in error," and none accepts free text. Because the host concept (a retraction transaction) is itself absent, there is no Carta `reason` field to route this to. `no-equivalent`.
- **`security_id`.** OCF's foreign key to the equity-compensation security being retracted. Carta references securities via `securityId` on its real transaction objects, but those keys live on the transaction objects that *do* exist (issuance/cancellation/exercise). Since the retraction transaction has no Carta object, there is no `securityId` slot to populate. `no-equivalent`.
- **`date`.** Calendar date of the retraction. Carta transaction objects carry an `effectiveDatetime` (`Iso8601CompleteCalendarDateTime`), but again only on transactions that exist in Carta; there is no retraction object to host a datetime. (Note also the OCF date-vs-Carta datetime granularity difference that would apply if a home existed.) `no-equivalent`.
- **`id`, `comments`.** OCF object scaffolding: `id` is OCF's own identifier (Carta assigns identifiers server-side) and `comments` has no Carta slot. Both `ocf-internal`.
- **Net:** 0 of 6 fields map. The correct downstream behavior is to drop the retraction event and instead reflect its effect by not emitting (or by removing) the underlying transaction it retracts, since Carta represents ledger state rather than OCF's full append-only event/correction history.
