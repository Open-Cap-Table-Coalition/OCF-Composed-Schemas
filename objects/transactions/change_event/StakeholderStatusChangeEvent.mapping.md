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
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Stakeholder Status Change Event → TBD

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
status: draft
coverage: 0/6

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
      CE_STAKEHOLDER_STATUS: TODO
  date:
    kind: TODO
    target: TODO
  stakeholder_id:
    kind: TODO
    target: TODO
  new_status:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      ACTIVE: TODO
      LEAVE_OF_ABSENCE: TODO
      TERMINATION_VOLUNTARY_OTHER: TODO
      TERMINATION_VOLUNTARY_GOOD_CAUSE: TODO
      TERMINATION_VOLUNTARY_RETIREMENT: TODO
      TERMINATION_INVOLUNTARY_OTHER: TODO
      TERMINATION_INVOLUNTARY_DEATH: TODO
      TERMINATION_INVOLUNTARY_DISABILITY: TODO
      TERMINATION_INVOLUNTARY_WITH_CAUSE: TODO
```

## Notes / open questions

- 
