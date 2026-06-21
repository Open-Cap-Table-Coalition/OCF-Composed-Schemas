---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/repricing/EquityCompensationRepricing.schema.json
ocf_object_type: TX_EQUITY_COMPENSATION_REPRICING
ocf_title: Object - Equity Compensation Repricing Transaction
ocf_kind: object
required_fields:
  - new_exercise_price
  - id
  - object_type
  - date
  - security_id
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Equity Compensation Repricing Transaction → Carta

> Object describing an event that adjusts the exercise price of existing equity compensation, typically done when the current share price falls significantly below the set exercise price, rendering an option underwater.

## OCF schema

Source: [`EquityCompensationRepricing.schema.json`](./EquityCompensationRepricing.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/repricing/EquityCompensationRepricing.schema.json",
  "title": "Object - Equity Compensation Repricing Transaction",
  "description": "Object describing an event that adjusts the exercise price of existing equity compensation, typically done when the current share price falls significantly below the set exercise price, rendering an option underwater.",
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
      "const": "TX_EQUITY_COMPENSATION_REPRICING"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "new_exercise_price": {
      "description": "What is the exercise price of the option after the repricing?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Monetary.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "new_exercise_price",
    "id",
    "object_type",
    "date",
    "security_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/repricing/EquityCompensationRepricing.schema.json"
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
      TX_EQUITY_COMPENSATION_REPRICING: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  new_exercise_price:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Carta has no equity-compensation repricing transaction, so the whole object is unmappable.** OCF's `TX_EQUITY_COMPENSATION_REPRICING` records a discrete *event* that resets the exercise price of an already-issued plan/option security (`security_id`) to a new value (`new_exercise_price`) — the classic "underwater option" repricing where the strike is lowered after the share price falls below the original grant price. Carta's option transaction set is `OptionIssuanceTransaction`, `OptionExerciseTransaction`, and `OptionCancellationTransaction` (plus the parent `OptionGrant` and `OptionExercise`/`Exercise` records); none of them models repricing an outstanding grant. The tokens "repric", "modif", and "amend" do not appear anywhere in the bundle (confirmed against `target-schema/Carta.schema.json`), and `npm run mapping:validate`'s index search for a modification/amendment transaction returns nothing. There is therefore no corresponding Carta transaction onto which this event's substantive fields can land. (This object is `ocf_kind: object`, so the 3-bucket *type* policy does not apply; an OCF transaction maps to its *corresponding* Carta transaction, and here there is none.)
- `new_exercise_price` → unmappable / `no-equivalent`. This is the load-bearing decision and the one most likely to be mis-mapped. Carta *does* define an `exercisePrice` (`#/$defs/Money`) field — it appears on `#/$defs/OptionGrant`, `#/$defs/OptionIssuanceTransaction`, `#/$defs/SarIssuanceTransaction`, `#/$defs/WarrantIssuanceTransaction`, and `#/$defs/Interest`. But in every case `exercisePrice` is the **strike set at issuance/grant**, a single static value with no event log, *not* the result of a repricing event. Carta stores exactly **one** current exercise price per `OptionGrant` and offers no transaction to change it over time. Routing OCF's `new_exercise_price` onto `OptionGrant.exercisePrice` (or onto `OptionIssuanceTransaction.exercisePrice`) would silently rewrite the *original grant terms* to assert the option had always been priced at the repriced strike, destroying the fact that a repricing occurred and erasing the prior price and its effective date. That is the same "same-named field on the wrong (non-repricing) object" trap that makes `resulting_security_ids` unmappable in the `StockReissuance` precedent. The `new_exercise_price` Money value (`types/Monetary.schema.json`: `{amount, currency}`) is shape-compatible with Carta's `Money` (`{amount: Decimal, currencyCode: Iso4217CurrencyAlphaCode}`), so the *value* could be carried — but there is no repricing-event home to carry it into, and the only static-strike fields it could overwrite would misrepresent the grant. Hence `no-equivalent` rather than a lossy rename onto a static grant-price field.
- `security_id` → unmappable / `no-equivalent`. OCF's `security_id` points back to the plan/option security being repriced. Carta transactions reference a `securityId`, but only on a concrete Carta transaction (issuance/exercise/cancellation); with no repricing transaction to host it, the foreign key has nowhere to land. **Contrast with `StockReissuance`**, where the structurally-similar `security_id` *does* map (to `CertificateIssuanceTransaction.precededBySecurityId`) precisely because Carta materialises a reissuance as a real issuance transaction carrying the `BALANCE_REISSUED` preceded-by reason; there is no analogous repricing transaction or `..._REPRICED` preceded-by reason in the bundle (`CertificatePrecededByReason` has no repricing member), so the predecessor-link target that `StockReissuance` uses simply does not exist here. The same option grant is already identified by `OptionGrant.securityId` on whatever issuance Carta would otherwise carry for this position, so nothing is lost by leaving it `no-equivalent` here.
- `date` → unmappable / `no-equivalent`. OCF records the repricing date as a calendar `Date` (`types/Date.schema.json`, `YYYY-MM-DD`). Carta's transaction timestamps are `#/$defs/Iso8601CompleteCalendarDateTime` (date *plus* time) and live on the concrete transaction objects (`*Datetime`/`*Date` fields); with no Carta repricing transaction to carry it, the effective date of the price change has nowhere to land. The one non-issuance datetime that names "modification," `OptionGrant.lastModifiedDatetime`, is **deliberately not used**: it is record-edit metadata (the last time the grant row was touched, for any reason), not a repricing effective date, so routing OCF `date` there would assert a spurious semantics and silently collide with unrelated edits. (The only `modif` tokens anywhere in the bundle are `lastModifiedDate`/`lastModifiedDatetime`, both record metadata.) Note also the OCF-date-vs-Carta-datetime granularity gap that would apply even if a real target existed: because Carta keeps only the current static `exercisePrice`, the *when* of the repricing is exactly the information that cannot be represented.
- `id`, `comments`, `object_type` → unmappable / `ocf-internal`. Standard OCF object scaffolding. `id` is OCF's identifier (Carta assigns its own server-side IDs); `object_type` is OCF's discriminator constant (`TX_EQUITY_COMPENSATION_REPRICING`), which Carta does not need because it types transactions positionally per endpoint — there is no Carta repricing-discriminator value to remap to, so the sole `values:` entry maps to `null`; `comments` has no Carta slot.
- **Round-tripping note.** Because Carta has no repricing event, the only way a repricing's effect surfaces in a Carta export is as a changed `OptionGrant.exercisePrice` (and possibly a cancel-and-reissue pair) — i.e. as *state*, not as a recorded *transaction*. Reconstructing OCF's `TX_EQUITY_COMPENSATION_REPRICING` from Carta is therefore not possible from the schema alone; the event, its date, and the prior exercise price are all lost. This is the genuinely-absent end of the spectrum: unlike `StockReissuance` (which Carta *does* reconstruct via the `BALANCE_REISSUED` preceded-by reason, so its `date`/`security_id` map) and unlike the term-bearing adjustment transactions, repricing has neither a Carta transaction, a preceded-by reason, nor an event-bearing field, so every substantive field is captured field-by-field above rather than mapped.
