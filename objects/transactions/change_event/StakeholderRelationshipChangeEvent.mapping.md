---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/change_event/StakeholderRelationshipChangeEvent.schema.json
ocf_object_type: CE_STAKEHOLDER_RELATIONSHIP
ocf_title: Object - Stakeholder Relationship Change Event
ocf_kind: object
required_fields:
  - id
  - object_type
  - date
  - stakeholder_id
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Stakeholder Relationship Change Event → Carta

> Object describing a change event for the relationship(s) between the stakeholder and the issuer

## OCF schema

Source: [`StakeholderRelationshipChangeEvent.schema.json`](./StakeholderRelationshipChangeEvent.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/transactions/change_event/StakeholderRelationshipChangeEvent.schema.json",
  "title": "Object - Stakeholder Relationship Change Event",
  "description": "Object describing a change event for the relationship(s) between the stakeholder and the issuer",
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
      "const": "CE_STAKEHOLDER_RELATIONSHIP"
    },
    "date": {
      "description": "Date on which the transaction occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    },
    "stakeholder_id": {
      "description": "Identifier of the Stakeholder object, a subject of this change event \"transaction\"",
      "type": "string"
    },
    "relationship_started": {
      "description": "Denoting the beginning of this relationship on the change date",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StakeholderRelationshipType.schema.json"
    },
    "relationship_ended": {
      "description": "Denoting the ending of this relationship on the change date",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StakeholderRelationshipType.schema.json"
    }
  },
  "additionalProperties": false,
  "anyOf": [
    {
      "required": [
        "relationship_started"
      ]
    },
    {
      "required": [
        "relationship_ended"
      ]
    }
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/transactions/change_event/StakeholderRelationshipChangeEvent.schema.json",
  "required": [
    "id",
    "object_type",
    "date",
    "stakeholder_id"
  ]
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
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
      CE_STAKEHOLDER_RELATIONSHIP: null
  date:
    kind: unmappable
    target: null
    reason: no-equivalent
  stakeholder_id:
    kind: rename
    target: "#/$defs/Stakeholder/properties/id"
  relationship_started:
    kind: enum-remap
    target: "#/$defs/Stakeholder/properties/relationship"
    values:
      ADVISOR: ADVISOR
      BOARD_MEMBER: BOARD_MEMBER
      CONSULTANT: CONSULTANT
      EMPLOYEE: EMPLOYEE
      EX_ADVISOR: EX_ADVISOR
      EX_CONSULTANT: EX_CONSULTANT
      EX_EMPLOYEE: EX_EMPLOYEE
      EXECUTIVE: EXECUTIVE
      FOUNDER: FOUNDER
      INVESTOR: INVESTOR
      NON_US_EMPLOYEE: INTERNATIONAL_EMPLOYEE
      OFFICER: OFFICER
      OTHER: OTHER
  relationship_ended:
    kind: enum-remap
    target: "#/$defs/Stakeholder/properties/relationship"
    values:
      ADVISOR: ADVISOR
      BOARD_MEMBER: BOARD_MEMBER
      CONSULTANT: CONSULTANT
      EMPLOYEE: EMPLOYEE
      EX_ADVISOR: EX_ADVISOR
      EX_CONSULTANT: EX_CONSULTANT
      EX_EMPLOYEE: EX_EMPLOYEE
      EXECUTIVE: EXECUTIVE
      FOUNDER: FOUNDER
      INVESTOR: INVESTOR
      NON_US_EMPLOYEE: INTERNATIONAL_EMPLOYEE
      OFFICER: OFFICER
      OTHER: OTHER
```

## Notes / open questions

- **Object kind: this is an OCF transaction object (`ocf_kind: object`), so per policy it maps its own properties directly to Carta fields (bucket `n/a-object`) — it is never a bucket-2 type.**
- **No Carta transaction host for this event.** OCF models a stakeholder's relationship to the issuer as a *time-stamped change event* — a row in the transaction log recording that, on `date`, a relationship `relationship_started` and/or `relationship_ended` (the `anyOf` requires at least one). Carta's bundled transaction set has no analogue: there is no `StakeholderRelationshipChangeEvent`, `StakeholderChangeEvent`, or any relationship-/status-change transaction `$def` (the only relationship surface in the bundle is the enum `StakeholderRelationship`, `$ref`'d exactly once, by `Stakeholder.relationship`). Carta records a stakeholder's relationship only as a **current snapshot** on the `Stakeholder` record, not as a dated start/end event. So the *event itself* — its existence as a transaction, its effective date, and the start-vs-end direction — has no home in Carta, and the mapping is necessarily lossy.
- `stakeholder_id` → `#/$defs/Stakeholder/properties/id`: the OCF event's subject is a foreign key to the OCF `Stakeholder`; the only meaningful destination is the matching Carta `Stakeholder` record (the one whose `relationship` field a consumer would update when replaying this event). This is a foreign-key rename, not a literal copy of a value into a Carta event object (Carta has no such event object).
- `relationship_started` / `relationship_ended` → `#/$defs/Stakeholder/properties/relationship`: both OCF fields `$ref` the OCF `StakeholderRelationshipType` enum, and Carta's only relationship surface is the `Stakeholder.relationship` scalar (which `$ref`s the `StakeholderRelationship` enum, `$ref`'d exactly once in the bundle). The target is that concrete property — the actual field a consumer writes the value into — rather than the bare shared enum `$def`; the validator dereferences the property's `$ref` down to the enum to check the value membership. Every OCF value has a member in Carta's `StakeholderRelationship` enum, so the *vocabulary* maps cleanly via `enum-remap`. The only value rename is `NON_US_EMPLOYEE` → `INTERNATIONAL_EMPLOYEE` (semantically identical: an employee outside the US). Carta additionally exposes `EX_BOARD_MEMBER` and `EX_INTERNATIONAL_EMPLOYEE`, which OCF lacks (OCF has no `EX_BOARD_MEMBER`/`EX_NON_US_EMPLOYEE` and would express those endings via `relationship_ended: BOARD_MEMBER` / `NON_US_EMPLOYEE`); those extra Carta members are simply unused by this mapping.
- **Semantics lost in the enum mapping.** Even though the enum *values* map, Carta's single `Stakeholder.relationship` scalar cannot represent OCF's richer model: (a) it is a single current value, so it cannot hold both a started and an ended relationship simultaneously, nor a *history* of relationships; (b) it carries no effective date, so `date` cannot be attached to the value; and (c) it does not distinguish a relationship *beginning* from one *ending* — there is no "started"/"ended" flag. A consumer replaying these events would have to collapse them into the latest `Stakeholder.relationship` snapshot (e.g. set the value on `relationship_started`, and on `relationship_ended` either clear it or set the corresponding `EX_*` member where Carta provides one). That projection is an application-level convention, not a field-to-field correspondence, which is why both relationship fields map only at the enum level.
- `date` → unmappable / `no-equivalent`: the change date has no home — Carta has no relationship-change transaction to date, and `Stakeholder.relationship` (the only place the value could land) is undated. Note also the OCF/Carta granularity difference seen across these transaction mappings: OCF transaction `date` is a calendar **date**, whereas Carta's dated fields use `Iso8601CompleteCalendarDateTime`; here it is moot because there is no target at all.
- `id`, `comments`, `object_type` → `ocf-internal`: standard OCF object scaffolding. `id` is OCF's own identifier (Carta assigns its own ids server-side); `object_type` (`CE_STAKEHOLDER_RELATIONSHIP`) is the OCF discriminator used to type rows in the transaction stream, which Carta does not need (Carta types data positionally per endpoint and has no row for this event); `comments` has no Carta slot.
