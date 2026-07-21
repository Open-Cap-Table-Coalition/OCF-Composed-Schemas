---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/vesting/VestingAcceleration.schema.json
ocf_object_type: TX_VESTING_ACCELERATION
ocf_title: Object - Vesting Acceleration Transaction
ocf_kind: object
required_fields:
  - quantity
  - reason_text
  - id
  - object_type
  - date
  - security_id
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Vesting Acceleration Transaction → Carta

> Object describing an acceleration of vesting, in which additional shares vest ahead of the schedule specified in security's vesting terms.

## OCF schema

Source: [`VestingAcceleration.schema.json`](./VestingAcceleration.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/vesting/VestingAcceleration.schema.json",
  "title": "Object - Vesting Acceleration Transaction",
  "description": "Object describing an acceleration of vesting, in which additional shares vest ahead of the schedule specified in security's vesting terms.",
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
      "const": "TX_VESTING_ACCELERATION"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "quantity": {
      "description": "Number of shares vesting ahead of schedule",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "reason_text": {
      "description": "Reason for the acceleration; unstructured text",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "quantity",
    "reason_text",
    "id",
    "object_type",
    "date",
    "security_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/vesting/VestingAcceleration.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete
coverage: 7/7

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
      TX_VESTING_ACCELERATION: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  quantity:
    kind: unmappable
    target: null
    reason: no-equivalent
  reason_text:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Carta has no vesting-acceleration transaction, so the whole object is unmappable.** OCF's `TX_VESTING_ACCELERATION` is a *ledger event* asserting that a specific number of shares vested ahead of schedule on a given date for a given security, with a free-text reason. Carta's transaction surface (the 23 `*Transaction` defs: `CertificateIssuanceTransaction`, `CertificateCancellationTransaction`, `OptionIssuanceTransaction`/`…ExerciseTransaction`/`…CancellationTransaction`, the `Rsa*`/`Rsu*`/`Sar*`/`Convertible*`/`Warrant*`/`Phantom*`/`Piu*` families) contains **no vesting transaction of any kind** — neither acceleration, normal vesting, nor a vesting reversal. A grep for `vest`/`accel` across the transaction defs returns only `vestingScheduleTemplateId` on the issuance transactions (a forward reference to the schedule template, set at grant time), never a recorded acceleration event.
- **Carta *does* model vesting acceleration — but as prospective terms / schedule projection, not as a transaction.** This is the key distinction that keeps every field `no-equivalent` rather than something rerouted:
    - `#/$defs/Acceleration` (`{name, terms}`) is referenced only by `#/$defs/Vesting/properties/acceleration`, and `Vesting` is the vesting *configuration* of a (draft) option grant (`{templateId, startDate, acceleration}`). Its own field descriptions say "accelerated vesting of the draft option grant" — i.e. it captures the *clause/terms* under which acceleration may occur, free text, attached at grant configuration time. It is not a record that N shares accelerated on date D, has no `quantity`, no event `date`, no `securityId`, and is not on a transaction.
    - `#/$defs/OptionGrantVestingEvent` (and the parallel `RestrictedStockAwardVestingEvent`, `RestrictedStockUnitVestingEvent`) carry `{vestDate, quantity, vested, …}`, but these are computed schedule *projections* hanging off a grant/award, not transactions, and they have no acceleration semantics, no `securityId`, and no free-text reason. Carta surfaces vesting status as state (a `vested` boolean per projected event) rather than as OCF's append-only event log; there is no slot to record "this tranche vested early because of X."
  Because the OCF object is a transaction and Carta has no acceleration transaction (and the two acceleration-adjacent structures above are terms/projections that lack OCF's per-event quantity+date+security+reason tuple), there is no faithful target. Inventing one — e.g. forcing `quantity`→`OptionGrantVestingEvent.quantity` or `reason_text`→`Acceleration.terms` — would fabricate a Carta schedule projection / grant clause from a ledger event that has no such object, so it is deliberately not mapped.
- Per-field justification:
    - `object_type` (const `TX_VESTING_ACCELERATION`): the OCF type discriminator, a `const` present on every OCF object purely as scaffolding — Carta assigns types/objects server-side and has no transaction-type tag field to remap onto, so it is `ocf-internal` (the same treatment as `id`/`comments`, and consistent with the `VestingStart` sibling). The single OCF enum value `TX_VESTING_ACCELERATION` is still listed under `values:` and maps to `null`. (The fact that Carta lacks the acceleration *transaction* concept entirely is already carried by the domain fields below being `no-equivalent`.)
    - `date`: OCF records the calendar date the acceleration took effect (`types/Date.schema.json`, an `Iso8601CompleteCalendarDate`-style value). Carta's `*VestingEvent.vestDate` is also an `Iso8601CompleteCalendarDate`, so the *date concept* exists at the right granularity — but only on descriptive schedule projections, not on any transaction, and there is no acceleration transaction to attach an effective date to. `no-equivalent`.
    - `security_id`: the foreign key to the security (stock, plan security, warrant, or convertible) whose vesting is accelerated. Carta carries `securityId` on its security/transaction objects, so the *identifier concept* exists — but with no vesting-acceleration transaction there is nowhere to record "the security whose tranche vested early." `no-equivalent`.
    - `quantity`: number of shares vesting ahead of schedule (`types/Numeric.schema.json`, a fixed-point decimal). Carta's nearest `quantity` fields are `Decimal` values on `OptionGrantVestingEvent`/`RestrictedStock*VestingEvent` schedule projections and on the issuance/cancellation transactions — none of which represents an acceleration event. There is no transaction-level "accelerated quantity" slot. `no-equivalent`.
    - `reason_text`: free-text reason for the acceleration. No Carta transaction has a free-text reason; every `reason`-named transaction field is a closed enum (`CertificateCancellationReason` and the parallel cancellation-reason enums) scoped to cancellation causes, and the only free-text acceleration field, `Acceleration.terms`, lives on a draft-grant vesting clause, not on an event. `no-equivalent`.
    - `id`, `comments`: OCF object scaffolding. `id` is OCF's own identifier (Carta assigns identifiers server-side); `comments` has no Carta slot. Both `ocf-internal`.
- Object-level routing: a `TX_VESTING_ACCELERATION` is dropped entirely on import to Carta. Carta records vesting as resulting *state* — the `vested` flags and projected `vestDate`/`quantity` on its `*VestingEvent` objects, plus any `Acceleration` terms on the grant's `Vesting` config — not as OCF's transaction-by-transaction event log. The closest faithful behavior is to let the acceleration be reflected implicitly in the recomputed vested quantities of the affected grant/award, rather than as a standalone Carta record.
- Consistency: the sibling vesting transactions in `objects/transactions/vesting/` (`VestingEvent` = `TX_VESTING_EVENT`, `VestingStart` = `TX_VESTING_START`) share the same "Carta has no vesting transaction" conclusion and should map all-unmappable in the same way; like the retraction family (`StockRetraction` et al.), the absence of a corresponding Carta transaction type is what forces every field to `no-equivalent`.
