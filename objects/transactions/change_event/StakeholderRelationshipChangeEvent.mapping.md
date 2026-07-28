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

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fchange_event%2FStakeholderRelationshipChangeEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fchange_event%2FStakeholderRelationshipChangeEvent.mapping.md&title=%5BMapping+question%5D+StakeholderRelationshipChangeEvent) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fchange_event%2FStakeholderRelationshipChangeEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fchange_event%2FStakeholderRelationshipChangeEvent.mapping.md&title=%5BMapping+question%5D+StakeholderRelationshipChangeEvent%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fchange_event%2FStakeholderRelationshipChangeEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fchange_event%2FStakeholderRelationshipChangeEvent.mapping.md&title=%5BMapping+question%5D+StakeholderRelationshipChangeEvent%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fchange_event%2FStakeholderRelationshipChangeEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fchange_event%2FStakeholderRelationshipChangeEvent.mapping.md&title=%5BMapping+question%5D+StakeholderRelationshipChangeEvent%3A+object_type&property_path=object_type) |
| `date` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fchange_event%2FStakeholderRelationshipChangeEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fchange_event%2FStakeholderRelationshipChangeEvent.mapping.md&title=%5BMapping+question%5D+StakeholderRelationshipChangeEvent%3A+date&property_path=date) |
| `stakeholder_id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fchange_event%2FStakeholderRelationshipChangeEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fchange_event%2FStakeholderRelationshipChangeEvent.mapping.md&title=%5BMapping+question%5D+StakeholderRelationshipChangeEvent%3A+stakeholder_id&property_path=stakeholder_id) |
| `relationship_started` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fchange_event%2FStakeholderRelationshipChangeEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fchange_event%2FStakeholderRelationshipChangeEvent.mapping.md&title=%5BMapping+question%5D+StakeholderRelationshipChangeEvent%3A+relationship_started&property_path=relationship_started) |
| `relationship_ended` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2Ftransactions%2Fchange_event%2FStakeholderRelationshipChangeEvent.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2Ftransactions%2Fchange_event%2FStakeholderRelationshipChangeEvent.mapping.md&title=%5BMapping+question%5D+StakeholderRelationshipChangeEvent%3A+relationship_ended&property_path=relationship_ended) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta has no dated stakeholder-relationship event. `stakeholder_id` maps to `Stakeholder.id`; `relationship_started` and `relationship_ended` map their enum values onto the stakeholder's single current `relationship` field.
- The event date, start/end history, and simultaneous relationship states are not representable. `id`, `comments`, and `object_type` are OCF scaffolding.
