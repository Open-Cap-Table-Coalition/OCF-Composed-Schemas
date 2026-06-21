---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/vesting/VestingEvent.schema.json
ocf_object_type: TX_VESTING_EVENT
ocf_title: Object - Vesting Event Transaction
ocf_kind: object
required_fields:
  - vesting_condition_id
  - id
  - object_type
  - date
  - security_id
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-05-18
---

# Object - Vesting Event Transaction → Carta

> Object describing the transaction of an non-schedule-driven vesting event associated with a security

## OCF schema

Source: [`VestingEvent.schema.json`](./VestingEvent.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/vesting/VestingEvent.schema.json",
  "title": "Object - Vesting Event Transaction",
  "description": "Object describing the transaction of an non-schedule-driven vesting event associated with a security",
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
      "const": "TX_VESTING_EVENT"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "security_id": {
      "description": "Identifier for the security (stock, plan security, warrant, or convertible) by which it can be referenced by other transaction objects. Note that while this identifier is created with an issuance object, it should be different than the issuance object's `id` field which identifies the issuance transaction object itself. All future transactions on the security (e.g. acceptance, transfer, cancel, etc.) must reference this `security_id` to qualify which security the transaction applies to.",
      "type": "string"
    },
    "vesting_condition_id": {
      "description": "Reference to the `id` of a VestingCondition in this security's VestingTerms. This condition should have a trigger type of `VESTING_EVENT`.",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "vesting_condition_id",
    "id",
    "object_type",
    "date",
    "security_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/vesting/VestingEvent.schema.json"
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
    reason: no-equivalent
    values:
      TX_VESTING_EVENT: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  security_id:
    kind: unmappable
    target: null
    reason: no-equivalent
  vesting_condition_id:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- **Carta has no vesting-event transaction, so the whole object is unmappable.** `TX_VESTING_EVENT` records a single *non-schedule-driven* vesting event — the firing of a `VestingCondition` whose `trigger.type` is `VESTING_EVENT` (a milestone/performance/manual event that vests a tranche outside the time-based schedule). Carta's transaction set is the 23 `*Transaction` defs in the pinned bundle (`Certificate*`, `Option*`, `Convertible*`, `Warrant*`, `Rsa*`, `Rsu*`, `Sar*`, `Phantom*`, `Piu*`); a grep for `*VestingEventTransaction` (or any vesting transaction) returns **nothing**. Carta does not model vesting as a postable event/transaction at all — it models vesting as a **schedule** attached to a security (`OptionGrant.vestingSchedule`/`Vesting`, `VestingSchedule`, `VestingPeriod`, `vestingScheduleTemplateId`) and surfaces realized outcomes as read-only summary sub-objects. So every field is `no-equivalent` (or `ocf-internal` for scaffolding).
- **Why Carta's `*VestingEvent` defs are NOT the target.** Carta does define `#/$defs/OptionGrantVestingEvent`, `#/$defs/RestrictedStockAwardVestingEvent`, and `#/$defs/RestrictedStockUnitVestingEvent`. These are **read-only, computed sub-objects nested inside the grant/award**, not standalone transactions:
    - Each is only ever reached via a `vestingEvents` array on its parent grant/award (`OptionGrant.vestingEvents → #/$defs/OptionGrantVestingEvent` at bundle line 1545–1551; the RSA/RSU analogues at 2206–2212 / 2366–2372). They are never `$ref`'d as a transaction or as an ingestion input.
    - The parent describes them as *output*: "The list of all vesting events associated with this grant. For time based vesting events, both past and future vesting details will be available. For performance and milestone based vesting, only achieved vesting events will be available." That is Carta *reporting* what its own schedule engine has computed/realized, not a slot to *record* an OCF vesting-event transaction.
    - Their fields confirm the mismatch: `{id, vestDate (Iso8601CompleteCalendarDate), quantity/isoQuantity/nsoQuantity/maxQuantity/targetQuantity/vestedQuantity (Decimal), performanceCondition (bool), vested (bool)}`. They carry **no `security_id`/`securityId` foreign key**, **no `vesting_condition_id` reference**, and the `quantity` they expose is the *amount of shares vesting on that date* — a value OCF's `TX_VESTING_EVENT` doesn't even carry (OCF's quantity-vesting math lives in `VestingTerms`, not on the event transaction). Mapping OCF's id-only event onto one of these would require choosing one of three security-specific defs, fabricating the vested quantity, and writing into a read-only output array — exactly the "never invent a representative target" defect. Hence `no-equivalent`, not a re-point.
- **Object-level routing (how Carta would represent this).** OCF's whole vesting layer has no Carta home, consistent with the sibling `VestingTerms` (all-unmappable) and `VestingCondition` mappings. In OCF, `TX_VESTING_EVENT` is the cap table telling the engine "this `VESTING_EVENT`-triggered condition fired on this date for this security"; Carta instead stores a vesting *schedule/template* on the grant and recomputes vesting internally, exposing the result through the nested `vestingEvents` summaries above. There is no per-event transaction to import, so the object is dropped and the vesting state is reconstructed from Carta's schedule + computed `vestingEvents` rather than from a field-level mapping.
- Per-field justification:
    - `object_type` (const `TX_VESTING_EVENT`): the discriminator for the vesting-event-transaction concept itself. Because Carta has no vesting-event transaction, there is no target enum to remap onto — hence `no-equivalent` (not `ocf-internal`). The single OCF enum value `TX_VESTING_EVENT` is listed under `values:` and maps to `null`. (Contrast `id`/`comments`, which are scaffolding on every OCF object and therefore `ocf-internal`.)
    - `date` (`types/Date.schema.json`, an `Iso8601CompleteCalendarDate`-style calendar DATE): the date the vesting event occurred. Carta's vesting dates are `vestDate` on the read-only `*VestingEvent` summaries (also `Iso8601CompleteCalendarDate`), but those are computed outputs, not a transaction slot, and they belong to whichever grant/award Carta picked — there is no vesting-event *transaction* on which to record this date. `no-equivalent`. (Even where Carta has analogous transactions, note the OCF date-vs-Carta `Iso8601CompleteCalendarDateTime` granularity gap; the `vestDate` here happens to be a plain date.)
    - `security_id`: foreign key to the security whose tranche vested. Carta carries `securityId` on its security/transaction-item objects (`Certificate.securityId`, `CertificateTransactionItem.securityId`), so the *identifier concept* exists — but there is no vesting-event transaction to attach it to, and Carta's `*VestingEvent` summaries carry no `securityId` (the security is implied by the enclosing grant). `no-equivalent`.
    - `vesting_condition_id`: reference to the `id` of a `VestingCondition` (with `trigger.type = VESTING_EVENT`) inside the security's OCF `VestingTerms`. This points into OCF's `VestingTerms`/`VestingCondition` machinery, which has **no Carta counterpart at all** (see the `VestingTerms` precedent — all-unmappable). Carta's schedule model (`VestingSchedule`/`VestingPeriod`/`vestingScheduleTemplateId`) has no addressable "vesting condition" object to reference, and `OptionGrantVestingEvent` exposes only a `performanceCondition` boolean flag, not a condition identifier. There is nothing to point a foreign key at. `no-equivalent`.
    - `id`, `comments`: OCF object scaffolding. `id` is OCF's own identifier (Carta assigns identifiers server-side); `comments` has no Carta slot. Both `ocf-internal`.
- Consistency: this matches the rest of OCF's vesting layer (`VestingTerms`, `VestingCondition`) mapping all-unmappable, and matches the sibling non-issuance/non-cancellation transactions (e.g. `StockTransfer`) for which Carta has no dedicated transaction type.
