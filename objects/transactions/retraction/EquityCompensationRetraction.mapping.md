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
# routing: route_by_security (downstream join). This retraction carries only
# security_id and NO discriminator, so the equity-comp family (Option/Rsu/Sar)
# is undecidable from the record alone: it is resolved by joining security_id
# back to the EquityCompensationIssuance and reading that issuance's
# compensation_type. The join is declared for honesty/exhaustiveness — every
# resolved family is unmappable because Carta has no retraction transaction at
# all. See docs/polymorphic-transaction-routing.md §2.2/§4.3.
status: complete

route_by_security:
  via: security_id
  resolve: compensation_type
  resolve_enum: "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/CompensationType.schema.json"
  source_mapping: ../issuance/EquityCompensationIssuance.mapping.md
  exhaustive: true

# shared: every source property. There is no per-variant target map here because
# every field is unmappable in every family — Carta has no retraction tx to host
# any of them. security_id is the join key (route_by_security.via).
shared:
  id:          { kind: unmappable, target: null, reason: ocf-internal }
  comments:    { kind: unmappable, target: null, reason: no-equivalent }
  object_type: { kind: unmappable, target: null, reason: ocf-internal }
  date:        { kind: unmappable, target: null, reason: no-equivalent }
  security_id: { kind: unmappable, target: null, reason: ocf-internal }
  reason_text: { kind: unmappable, target: null, reason: no-equivalent }

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

- **Join-dependent (downstream).** One OCF `EquityCompensationRetraction` carries only
  `security_id` and no discriminator, so the instrument family is fixed at issuance, not
  on this record. An importer must resolve `compensation_type` from the joined
  `EquityCompensationIssuance` first (the two-pass requirement, §2.2). We declare the
  `route_by_security` join — partitioning `CompensationType` into Option `[OPTION,
  OPTION_NSO, OPTION_ISO]`, Rsu `[RSU]`, and Sar `[CSAR, SSAR]` — so the routing tree is
  honest and exhaustive, even though no family has a destination.
- **All-unmappable: Carta has no retraction transaction.** In OCF a *retraction* voids a
  previously-recorded transaction entry — it asserts the prior transaction never validly
  happened (entered in error and withdrawn from the ledger). This is a *ledger-correction*
  event, semantically distinct from a *cancellation* (a real lifecycle event in which an
  outstanding security is genuinely canceled/terminated/forfeited). Carta models the
  lifecycle events (Issuance / Cancellation / Exercise / Settlement / Transfer) but has no
  concept for "this previously-entered transaction is being retracted/void." Searching the
  pinned bundle (`target-schema/Carta.schema.json`) for `retract` / `Retraction` returns
  nothing — so `primary_targets` is `null` for every variant and 0 of 6 fields map.
- **`security_id`** is the join key (`route_by_security.via`); it routes the family, it is
  not itself a stored Carta field. `ocf-internal`.
- **`reason_text` has no home.** OCF free-text reason for the retraction. The only
  `reason`-bearing fields in Carta are the per-cancellation enums (`OptionCancellationReason`,
  `RsuCancellationReason`, `SarCancellationReason`, …), each constrained to lifecycle
  outcomes (`*_TERMINATED` / `*_CANCELED` / `*_FORFEITED`) and none accepting free text;
  free-text → enum is unmappable by policy. With no host retraction tx there is no Carta
  `reason` slot regardless. `no-equivalent`.
- **`date`.** Carta transaction objects carry `effectiveDatetime`, but only on transactions
  that exist in Carta; there is no retraction object to host a datetime. `no-equivalent`.
- **`object_type` (`TX_PLAN_SECURITY_RETRACTION` | `TX_EQUITY_COMPENSATION_RETRACTION`).**
  OCF scaffolding discriminator (the former is the legacy alias deprecated in OCF v2.0.0).
  Carta types records positionally per endpoint and has no retraction type to discriminate
  to. `ocf-internal`.
- **`id`, `comments`.** OCF object scaffolding: `id` is OCF's own identifier (Carta assigns
  identifiers server-side); `comments` has no Carta slot. `id` is `ocf-internal`, `comments`
  is `no-equivalent`.
- **Net:** 0 of 6 fields map. The correct downstream behavior is to drop the retraction
  event and instead reflect its effect by not emitting (or removing) the underlying
  transaction it retracts, since Carta represents ledger state rather than OCF's full
  append-only event/correction history.
