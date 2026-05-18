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
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Stakeholder Relationship Change Event → TBD

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
status: draft
coverage: 0/7

fields:
  id:
    kind: TODO
    target: TODO
  comments:
    kind: TODO
    target: TODO
  object_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      CE_STAKEHOLDER_RELATIONSHIP: TODO
  date:
    kind: TODO
    target: TODO
  stakeholder_id:
    kind: TODO
    target: TODO
  relationship_started:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      ADVISOR: TODO
      BOARD_MEMBER: TODO
      CONSULTANT: TODO
      EMPLOYEE: TODO
      EX_ADVISOR: TODO
      EX_CONSULTANT: TODO
      EX_EMPLOYEE: TODO
      EXECUTIVE: TODO
      FOUNDER: TODO
      INVESTOR: TODO
      NON_US_EMPLOYEE: TODO
      OFFICER: TODO
      OTHER: TODO
  relationship_ended:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      ADVISOR: TODO
      BOARD_MEMBER: TODO
      CONSULTANT: TODO
      EMPLOYEE: TODO
      EX_ADVISOR: TODO
      EX_CONSULTANT: TODO
      EX_EMPLOYEE: TODO
      EXECUTIVE: TODO
      FOUNDER: TODO
      INVESTOR: TODO
      NON_US_EMPLOYEE: TODO
      OFFICER: TODO
      OTHER: TODO
```

## Notes / open questions

- 
