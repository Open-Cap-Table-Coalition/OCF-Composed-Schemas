---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingEventCondition.schema.json
ocf_object_type: null
ocf_title: Type - Vesting Event Condition
ocf_kind: type
required_fields:
  - event_id
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-06-29
---

# Type - Vesting Event Condition → TBD

> The named-event axis of a VestingStatement: a gating event (referenced by `event_id`) that must fire before the statement releases. Its firing is recorded by a v2 vesting-event transaction. Present ⟺ the statement is gated.

## OCF schema

Source: [`VestingEventCondition.schema.json`](./VestingEventCondition.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingEventCondition.schema.json",
  "title": "Type - Vesting Event Condition",
  "description": "The named-event axis of a VestingStatement: a gating event (referenced by `event_id`) that must fire before the statement releases. Its firing is recorded by a v2 vesting-event transaction. Present ⟺ the statement is gated.",
  "type": "object",
  "properties": {
    "event_id": {
      "description": "Identifier of the gating event. Matches `event_id` on a v2 vesting-event transaction.",
      "type": "string",
      "minLength": 1
    }
  },
  "required": [
    "event_id"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/vesting/VestingEventCondition.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
# unmappable reason vocabulary: no-equivalent | excluded-from-snapshot | out-of-scope | ocf-internal
status: draft

fields:
  event_id:
    kind: TODO
    target: TODO
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fvesting%2FVestingEventCondition.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fvesting%2FVestingEventCondition.mapping.md&title=%5BMapping+question%5D+VestingEventCondition) |
| `event_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2Fvesting%2FVestingEventCondition.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2Fvesting%2FVestingEventCondition.mapping.md&title=%5BMapping+question%5D+VestingEventCondition+%2F+event_id&property_path=event_id) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

-
