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
target_version: "v1alpha1 (2026-06-22)"
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
# unmappable reason vocabulary: no-equivalent | excluded-from-snapshot | target-definition-removed | out-of-scope | ocf-internal
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
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&title=%5BMapping+question%5D+VestingEvent%3A+id&property_path=id) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&title=%5BMapping+question%5D+VestingEvent%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&title=%5BMapping+question%5D+VestingEvent%3A+date&property_path=date) |
| `security_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&title=%5BMapping+question%5D+VestingEvent%3A+security_id&property_path=security_id) |
| `event_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fvesting%2FVestingEvent.mapping.md&title=%5BMapping+question%5D+VestingEvent%3A+event_id&property_path=event_id) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta has no vesting-event transaction. Its nested vesting-event records are computed schedule projections, not importable records for an OCF named event.
- `date`, `security_id`, and `event_id` have no target; `id` and `object_type` are OCF scaffolding.
