---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/change_event/StakeholderStatusChangeEvent.schema.json
ocf_object_type: CE_STAKEHOLDER_STATUS
ocf_title: Object - Stakeholder Status Change Event
ocf_kind: object
required_fields:
  - new_status
  - id
  - object_type
  - date
  - stakeholder_id
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Stakeholder Status Change Event → Carta

> Object describing a change event for the activity status of this stakeholder

## OCF schema

Source: [`StakeholderStatusChangeEvent.schema.json`](./StakeholderStatusChangeEvent.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/change_event/StakeholderStatusChangeEvent.schema.json",
  "title": "Object - Stakeholder Status Change Event",
  "description": "Object describing a change event for the activity status of this stakeholder",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/Transaction.schema.json"
    },
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/transactions/change_event/StakeholderChangeEvent.schema.json"
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
      "const": "CE_STAKEHOLDER_STATUS"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stakeholder_id": {
      "description": "Identifier of the Stakeholder object, a subject of this change event \"transaction\"",
      "type": "string"
    },
    "new_status": {
      "description": "Denoting the beginning of this activity status on the change date",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StakeholderStatusType.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "new_status",
    "id",
    "object_type",
    "date",
    "stakeholder_id"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/change_event/StakeholderStatusChangeEvent.schema.json"
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
      CE_STAKEHOLDER_STATUS: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  stakeholder_id:
    kind: rename
    target: "#/$defs/Stakeholder/properties/id"
  new_status:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      ACTIVE: null
      LEAVE_OF_ABSENCE: null
      TERMINATION_VOLUNTARY_OTHER: null
      TERMINATION_VOLUNTARY_GOOD_CAUSE: null
      TERMINATION_VOLUNTARY_RETIREMENT: null
      TERMINATION_INVOLUNTARY_OTHER: null
      TERMINATION_INVOLUNTARY_DEATH: null
      TERMINATION_INVOLUNTARY_DISABILITY: null
      TERMINATION_INVOLUNTARY_WITH_CAUSE: null
```

## Notes / open questions

- **Bucket: n/a-object — no Carta event host; only the stakeholder foreign key lands.** OCF's `StakeholderStatusChangeEvent` is a dated *transaction* that records the moment a stakeholder's employment/engagement **activity status** changes (becomes active, goes on leave, or is terminated for a specific reason). Carta's pinned `v1alpha1 (2026-04-30)` bundle has **no transaction type and no event type for stakeholder status changes.** The bundle's full transaction surface is the issuance/cancellation/exercise/settlement/transfer set for Certificate, Convertible, Option, Phantom, Piu, Rsa, Rsu, Sar, and Warrant securities (verified by enumerating every `*Transaction` `$def`); none model a stakeholder lifecycle event. The only non-security "event" `$def`s are the three vesting-event types (`OptionGrantVestingEvent`, `RestrictedStockAwardVestingEvent`, `RestrictedStockUnitVestingEvent`), which are unrelated. So the event *itself* — its existence as a transaction, its effective date, and the new-status payload — has no host object in Carta. The one field with a real destination is the subject foreign key (`stakeholder_id`), which references the Carta `Stakeholder` record whose state a consumer would update when replaying this event.
- **`new_status` (the substantive field) has no Carta home — `no-equivalent`.** It `$ref`s OCF's `StakeholderStatusType` enum: `ACTIVE`, `LEAVE_OF_ABSENCE`, and seven reason-coded termination values (`TERMINATION_VOLUNTARY_{OTHER,GOOD_CAUSE,RETIREMENT}`, `TERMINATION_INVOLUNTARY_{OTHER,DEATH,DISABILITY,WITH_CAUSE}`). Carta models nothing equivalent:
    - Carta's nearest concept is the `StakeholderRelationship` enum on `Stakeholder.relationship` (`EMPLOYEE`/`EX_EMPLOYEE`, `ADVISOR`/`EX_ADVISOR`, `CONSULTANT`/`EX_CONSULTANT`, `BOARD_MEMBER`/`EX_BOARD_MEMBER`, `INTERNATIONAL_EMPLOYEE`/`EX_INTERNATIONAL_EMPLOYEE`, plus `FOUNDER`/`INVESTOR`/`OFFICER`/`EXECUTIVE`/`OTHER`). That is a **relationship category**, not an activity status: it distinguishes *what kind* of relationship the stakeholder has (and a present/`EX_` past flavor), but it cannot express `ACTIVE` vs. `LEAVE_OF_ABSENCE`, and it carries no termination reason (no voluntary/involuntary, good-cause, retirement, death, or disability distinction). The OCF *relationship* concept (its own `CE_STAKEHOLDER_RELATIONSHIP` event / `current_relationship`) is the field that lines up with `StakeholderRelationship`; *status* does not.
    - `Stakeholder.relationship` is also a single **current-state** scalar on the stakeholder record, not a dated, append-only history. Even the relationship dimension that does overlap cannot capture *when* a status began (`new_status` "denot[es] the beginning of this activity status on the change date"). Carta keeps no per-stakeholder status timeline.
    - Other Carta status-like enums (`ExerciseStatus`, `NoteBlockStatus`, `PerformanceConditionStatus`) belong to securities/exercises, not stakeholders, and are irrelevant here.
  - Because no Carta enum can receive these members, `enum-remap` is not applicable; every OCF value maps to `null` and the property is `unmappable / no-equivalent`.
- **`date` — `no-equivalent`.** This is the effective date of the status change. With no status-change event object in Carta, there is no datetime field to receive it. (Separately, note the OCF/Carta granularity gap: OCF transaction `date` is a calendar `Date`, whereas Carta transaction timestamps are `Iso8601CompleteCalendarDateTime` — but that is moot here since the host object itself is absent.)
- **`stakeholder_id` → `#/$defs/Stakeholder/properties/id` (`rename`).** It is the foreign key naming the stakeholder whose status changed; the only meaningful destination is the matching Carta `Stakeholder` record (the one whose state a consumer would update when replaying this event). This is a foreign-key rename, not a literal copy of a value into a Carta event object (Carta has no such event object). This is identical in concept to the subject reference on the sibling `StakeholderRelationshipChangeEvent`, which maps `stakeholder_id` → the same `#/$defs/Stakeholder/properties/id` pointer; the consistency rule requires both to land here.
- **`id`, `comments`, `object_type` — `ocf-internal`.** Standard OCF object scaffolding: `id` is OCF's own object identifier (Carta assigns its own server-side identifiers); `object_type` is the `CE_STAKEHOLDER_STATUS` discriminator constant OCF uses for polymorphic transaction typing, which Carta does not need (positional typing per endpoint) — its single value maps to `null`; `comments` has no Carta slot on any transaction or stakeholder type.
- This mirrors the broader rule that Carta has no host transaction/event object for OCF change-event transactions (stakeholder relationship/status): the only field with a Carta home is the `stakeholder_id` foreign key (→ `Stakeholder.id`), exactly as in the sibling `StakeholderRelationshipChangeEvent`. The two diverge on the substantive payload: the sibling's relationship fields overlap Carta's `StakeholderRelationship` enum (mappable via `enum-remap`), whereas this *status* event's `new_status` (`ACTIVE`/`LEAVE_OF_ABSENCE`/termination reasons) has no Carta enum overlap at all and stays `unmappable`.
