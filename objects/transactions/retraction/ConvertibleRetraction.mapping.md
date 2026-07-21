---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/retraction/ConvertibleRetraction.schema.json
ocf_object_type: TX_CONVERTIBLE_RETRACTION
ocf_title: Object - Convertible Retraction Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - security_id
  - reason_text
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Convertible Retraction Transaction → Carta

> Object describing a retraction of a convertible security

## OCF schema

Source: [`ConvertibleRetraction.schema.json`](./ConvertibleRetraction.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/retraction/ConvertibleRetraction.schema.json",
  "title": "Object - Convertible Retraction Transaction",
  "description": "Object describing a retraction of a convertible security",
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
      "const": "TX_CONVERTIBLE_RETRACTION"
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
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/retraction/ConvertibleRetraction.schema.json",
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
      TX_CONVERTIBLE_RETRACTION: null
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

- **Whole object has no Carta equivalent (bucket n/a-object, all six fields unmappable).** OCF retraction transactions record that an erroneously-recorded transaction is being *rescinded / taken back* (the `Retraction` primitive: a `security_id` + `reason_text`, with no quantity or amount). Carta's transaction vocabulary has no analogue. Searching the pinned bundle (`target-schema/Carta.schema.json`) for "retract"/"reason_text"/"reasonText" returns nothing, and the only convertible-security transactions Carta defines are `#/$defs/ConvertibleIssuanceTransaction` and `#/$defs/ConvertibleCancellationTransaction`. Neither models a retraction: a cancellation removes/voids a still-valid security going forward, whereas a retraction asserts the original record should never have existed. There is no Carta object to host any field of this transaction, so every property is `unmappable`.
- `date` (OCF `types/Date`, a calendar date) — **no-equivalent.** Carta does carry transaction timestamps (e.g. `ConvertibleCancellationTransaction.effectiveDatetime`, `ConvertibleIssuanceTransaction.issueDatetime`, both `#/$defs/Iso8601CompleteCalendarDateTime`), but those live on transaction objects that have no retraction counterpart, so there is no Carta field for *this* transaction's date to land in. (Note also the general OCF→Carta granularity gap: OCF transaction `date` is a calendar DATE while Carta's transaction times are DATETIMEs — relevant only if a host transaction existed.)
- `security_id` (the FK identifying which convertible the retraction applies to) — **no-equivalent.** The security-identifier *concept* does exist in Carta — `#/$defs/ConvertibleNote.securityId` and the lifecycle container `#/$defs/ConvertibleTransactionItem.securityId` both carry it — but `ConvertibleTransactionItem` groups only issuance and cancellation events (its description: "Groups all lifecycle events (issuance, cancellation) for a single convertible note"), and the individual transaction objects don't carry a generic security FK themselves (`ConvertibleCancellationTransaction` has only `effectiveDatetime`, `reason`, `principal`; `ConvertibleIssuanceTransaction` references prior securities via `precededBySecurityId`/`noteBlockId`). With no retraction event anywhere in that lifecycle model, there is no retraction node for this FK to attach to, so it has nowhere to route.
- `reason_text` (free-text reason for the retraction) — **no-equivalent.** Carta has no free-text reason field for convertibles. The closest token, `ConvertibleCancellationTransaction.reason`, is a constrained `#/$defs/ConvertibleCancellationReason` **enum** attached to *cancellation*, not retraction, and is not a free-text capture; it cannot represent an arbitrary retraction justification and belongs to a different (cancellation) event. So `reason_text` is dropped.
- `id`, `comments`, `object_type` — **ocf-internal** OCF object scaffolding. `id` is OCF's own identifier (Carta assigns identifiers server-side); `object_type` is the OCF discriminator constant `TX_CONVERTIBLE_RETRACTION` (Carta types transactions positionally per endpoint, so there is nothing to remap the single enum value onto — `TX_CONVERTIBLE_RETRACTION: null`); `comments` has no Carta slot.
- Consistency: this matches the treatment of the sibling retraction transactions (`StockRetraction`, `WarrantRetraction`, `EquityCompensationRetraction`, `PlanSecurityRetraction`) and the general guidance that OCF retraction/adjustment/reissuance/etc. transactions have no Carta equivalent — Carta's transaction set is strictly smaller than OCF's.
