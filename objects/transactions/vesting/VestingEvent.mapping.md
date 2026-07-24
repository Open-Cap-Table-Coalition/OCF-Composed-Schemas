---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/vesting/VestingEvent.schema.json
ocf_object_type: TX_VESTING_EVENT
ocf_title: Object - Vesting Event Transaction
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - security_id
  - event_id
target_standard: Carta
target_version: "v1alpha1 (2026-04-30)"
status: complete
last_generated: 2026-06-29
---

# Object - Vesting Event Transaction → Carta

> Version dispatcher for the vesting-event transaction. The stable public `$id` accepts either the current DAG-condition shape (v1) or the forward-looking named-event shape (v2) during the transition window.

## OCF schema

Source: [`VestingEvent.schema.json`](./VestingEvent.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/vesting/VestingEvent.schema.json",
  "title": "Object - Vesting Event Transaction",
  "description": "Version dispatcher for the vesting-event transaction. The stable public `$id` accepts either the current DAG-condition shape (v1) or the forward-looking named-event shape (v2) during the transition window.",
  "x-ocf-stability": "alpha",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Identifier for this transaction."
    },
    "object_type": {
      "const": "TX_VESTING_EVENT"
    },
    "date": {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json",
      "description": "Date the event fired."
    },
    "security_id": {
      "type": "string",
      "description": "Identifier of the security whose VestingStatement(s) reference this event. The firing is scoped to a single security; cross-grant fan-out of one underlying event is represented by emitting one transaction per affected security."
    },
    "event_id": {
      "type": "string",
      "minLength": 1,
      "description": "Identifier of the named event that fired. Matches `event_id` on the `event_condition` of some VestingStatement on this security's template."
    }
  },
  "required": [
    "id",
    "object_type",
    "date",
    "security_id",
    "event_id"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/vesting/versions.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# unmappable reason vocabulary: no-equivalent | excluded-from-snapshot | out-of-scope | ocf-internal
status: complete

fields:
  id:
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
  event_id:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&title=%5BMapping+question%5D+VestingEvent) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&title=%5BMapping+question%5D+VestingEvent+%2F+id&property_path=id) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&title=%5BMapping+question%5D+VestingEvent+%2F+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&title=%5BMapping+question%5D+VestingEvent+%2F+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&title=%5BMapping+question%5D+VestingEvent+%2F+security_id&property_path=security_id) |
| `event_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&title=%5BMapping+question%5D+VestingEvent+%2F+event_id&property_path=event_id) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

> Note: rebased onto the 1.2.1-unstable (#227) shape. `TX_VESTING_EVENT` is now the named-event dispatcher — its properties are `id`, `object_type`, `date`, `security_id`, `event_id`. `vesting_condition_id` is gone (the old DAG-condition reference); the event is now keyed by a named `event_id` that matches the `event_condition` on a VestingStatement. `comments` is no longer a property. The all-unmappable determination below carries over to the new shape.

- **Carta has no vesting-event transaction, so the whole object is unmappable.** `TX_VESTING_EVENT` records a single *non-schedule-driven* vesting event — the firing of a named event (`event_id`) referenced by the `event_condition` of a VestingStatement on the security's template (a milestone/performance/manual event that vests a tranche outside the time-based schedule). Carta's transaction set is the 23 `*Transaction` defs in the pinned bundle (`Certificate*`, `Option*`, `Convertible*`, `Warrant*`, `Rsa*`, `Rsu*`, `Sar*`, `Phantom*`, `Piu*`); a grep for `*VestingEventTransaction` (or any vesting transaction) returns **nothing**. Carta does not model vesting as a postable event/transaction at all — it models vesting as a **schedule** attached to a security (`OptionGrant.vestingSchedule`/`Vesting`, `VestingSchedule`, `VestingPeriod`, `vestingScheduleTemplateId`) and surfaces realized outcomes as read-only summary sub-objects. So every field is `no-equivalent` (or `ocf-internal` for scaffolding).
- **Why Carta's `*VestingEvent` defs are NOT the target.** Carta does define `#/$defs/OptionGrantVestingEvent`, `#/$defs/RestrictedStockAwardVestingEvent`, and `#/$defs/RestrictedStockUnitVestingEvent`. These are **read-only, computed sub-objects nested inside the grant/award**, not standalone transactions:
    - Each is only ever reached via a `vestingEvents` array on its parent grant/award (`OptionGrant.vestingEvents → #/$defs/OptionGrantVestingEvent` at bundle line 1545–1551; the RSA/RSU analogues at 2206–2212 / 2366–2372). They are never `$ref`'d as a transaction or as an ingestion input.
    - The parent describes them as *output*: "The list of all vesting events associated with this grant. For time based vesting events, both past and future vesting details will be available. For performance and milestone based vesting, only achieved vesting events will be available." That is Carta *reporting* what its own schedule engine has computed/realized, not a slot to *record* an OCF vesting-event transaction.
    - Their fields confirm the mismatch: `{id, vestDate (Iso8601CompleteCalendarDate), quantity/isoQuantity/nsoQuantity/maxQuantity/targetQuantity/vestedQuantity (Decimal), performanceCondition (bool), vested (bool)}`. They carry **no `security_id`/`securityId` foreign key**, **no `event_id` reference**, and the `quantity` they expose is the *amount of shares vesting on that date* — a value OCF's `TX_VESTING_EVENT` doesn't even carry (OCF's quantity-vesting math lives in `VestingTerms`, not on the event transaction). Mapping OCF's id-only event onto one of these would require choosing one of three security-specific defs, fabricating the vested quantity, and writing into a read-only output array — exactly the "never invent a representative target" defect. Hence `no-equivalent`, not a re-point.
- **Object-level routing (how Carta would represent this).** OCF's whole vesting layer has no Carta home, consistent with the sibling `VestingTerms` (all-unmappable) and `VestingStatement` mappings. In OCF, `TX_VESTING_EVENT` is the cap table telling the engine "this named event (`event_id`) fired on this date for this security"; Carta instead stores a vesting *schedule/template* on the grant and recomputes vesting internally, exposing the result through the nested `vestingEvents` summaries above. There is no per-event transaction to import, so the object is dropped and the vesting state is reconstructed from Carta's schedule + computed `vestingEvents` rather than from a field-level mapping.
- Per-field justification:
    - `object_type` (const `TX_VESTING_EVENT`): the discriminator for the vesting-event-transaction concept itself. Because Carta has no vesting-event transaction, there is no target enum to remap onto — hence `no-equivalent` (not `ocf-internal`). The single OCF enum value `TX_VESTING_EVENT` is listed under `values:` and maps to `null`. (Contrast `id`, scaffolding on every OCF object and therefore `ocf-internal`.)
    - `date` (`types/Date.schema.json`, an `Iso8601CompleteCalendarDate`-style calendar DATE): the date the vesting event fired. Carta's vesting dates are `vestDate` on the read-only `*VestingEvent` summaries (also `Iso8601CompleteCalendarDate`), but those are computed outputs, not a transaction slot, and they belong to whichever grant/award Carta picked — there is no vesting-event *transaction* on which to record this date. `no-equivalent`. (Even where Carta has analogous transactions, note the OCF date-vs-Carta `Iso8601CompleteCalendarDateTime` granularity gap; the `vestDate` here happens to be a plain date.)
    - `security_id`: foreign key to the security whose tranche vested. Carta carries `securityId` on its security/transaction-item objects (`Certificate.securityId`, `CertificateTransactionItem.securityId`), so the *identifier concept* exists — but there is no vesting-event transaction to attach it to, and Carta's `*VestingEvent` summaries carry no `securityId` (the security is implied by the enclosing grant). `no-equivalent`.
    - `event_id`: identifier of the named event that fired, matching the `event_id` on the `event_condition` of some VestingStatement on this security's template. This points into OCF's `VestingTerms`/`VestingStatement` machinery, which has **no Carta counterpart at all** (see the `VestingTerms` precedent — all-unmappable). Carta's schedule model (`VestingSchedule`/`VestingPeriod`/`vestingScheduleTemplateId`) has no addressable named-event object to reference, and `OptionGrantVestingEvent` exposes only a `performanceCondition` boolean flag, not an event identifier. There is nothing to point a foreign key at. `no-equivalent`.
    - `id`: OCF object scaffolding — OCF's own identifier (Carta assigns identifiers server-side). `ocf-internal`.
- Consistency: this matches the rest of OCF's vesting layer (`VestingTerms`, `VestingStatement`) mapping all-unmappable, and matches the sibling non-issuance/non-cancellation transactions (e.g. `StockTransfer`) for which Carta has no dedicated transaction type.
