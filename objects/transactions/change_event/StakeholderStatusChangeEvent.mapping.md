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
target_version: "v1alpha1 (2026-06-22)"
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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
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

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fchange_event%2FStakeholderStatusChangeEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fchange_event%2FStakeholderStatusChangeEvent.mapping.md&title=%5BMapping+question%5D+StakeholderStatusChangeEvent) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fchange_event%2FStakeholderStatusChangeEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fchange_event%2FStakeholderStatusChangeEvent.mapping.md&title=%5BMapping+question%5D+StakeholderStatusChangeEvent%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fchange_event%2FStakeholderStatusChangeEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fchange_event%2FStakeholderStatusChangeEvent.mapping.md&title=%5BMapping+question%5D+StakeholderStatusChangeEvent%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fchange_event%2FStakeholderStatusChangeEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fchange_event%2FStakeholderStatusChangeEvent.mapping.md&title=%5BMapping+question%5D+StakeholderStatusChangeEvent%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fchange_event%2FStakeholderStatusChangeEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fchange_event%2FStakeholderStatusChangeEvent.mapping.md&title=%5BMapping+question%5D+StakeholderStatusChangeEvent%3A+date&property_path=date) |
| `stakeholder_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fchange_event%2FStakeholderStatusChangeEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fchange_event%2FStakeholderStatusChangeEvent.mapping.md&title=%5BMapping+question%5D+StakeholderStatusChangeEvent%3A+stakeholder_id&property_path=stakeholder_id) |
| `new_status` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fchange_event%2FStakeholderStatusChangeEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fchange_event%2FStakeholderStatusChangeEvent.mapping.md&title=%5BMapping+question%5D+StakeholderStatusChangeEvent%3A+new_status&property_path=new_status) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta has no stakeholder status event or status-history field. Only `stakeholder_id` maps to `Stakeholder.id`; `date` and `new_status` are `no-equivalent` because relationship categories do not express OCF activity status or termination reasons.
- `id`, `comments`, and `object_type` are OCF scaffolding.
