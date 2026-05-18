---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/Stakeholder.schema.json
ocf_object_type: STAKEHOLDER
ocf_title: Object - Stakeholder
ocf_kind: object
required_fields:
  - name
  - stakeholder_type
  - id
  - object_type
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Stakeholder → TBD

> Object describing a stakeholder

## OCF schema

Source: [`Stakeholder.schema.json`](./Stakeholder.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/Stakeholder.schema.json",
  "title": "Object - Stakeholder",
  "description": "Object describing a stakeholder",
  "type": "object",
  "allOf": [
    {
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/primitives/objects/Object.schema.json"
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
      "const": "STAKEHOLDER"
    },
    "name": {
      "description": "Name for the stakeholder",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Name.schema.json"
    },
    "stakeholder_type": {
      "description": "Distinguish individuals from institutions",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StakeholderType.schema.json"
    },
    "issuer_assigned_id": {
      "description": "This might be any sort of id assigned to the stakeholder by the issuer, such as an internal company ID for an employee stakeholder",
      "type": "string"
    },
    "current_relationship": {
      "description": "What is the current relationship of the stakeholder to the issuer?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StakeholderRelationshipType.schema.json",
      "$comment": "Deprecated in v2, see `current_relationships` array instead"
    },
    "current_relationships": {
      "title": "Stakeholder - Relationships Array",
      "description": "What is/are the current relationship(s) of the stakeholder to the issuer?",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StakeholderRelationshipType.schema.json"
      }
    },
    "current_status": {
      "description": "What is the current activity status of the stakeholder?",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/StakeholderStatusType.schema.json"
    },
    "primary_contact": {
      "description": "The primary contact info for an institutional stakeholder",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ContactInfo.schema.json"
    },
    "contact_info": {
      "description": "The contact info for an individual stakeholder",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ContactInfoWithoutName.schema.json"
    },
    "addresses": {
      "title": "Stakeholder - Address Array",
      "description": "Addresses for the stakeholder",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Address.schema.json"
      }
    },
    "tax_ids": {
      "title": "Stakeholder - Tax ID Array",
      "description": "The tax ids for this stakeholder",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/TaxID.schema.json"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "name",
    "stakeholder_type",
    "id",
    "object_type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/Stakeholder.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/13

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
      STAKEHOLDER: TODO
  name:
    kind: TODO
    target: TODO
  stakeholder_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      INDIVIDUAL: TODO
      INSTITUTION: TODO
  issuer_assigned_id:
    kind: TODO
    target: TODO
  current_relationship:
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
  current_relationships:
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
  current_status:
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
  primary_contact:
    kind: TODO
    target: TODO
  contact_info:
    kind: TODO
    target: TODO
  addresses:
    kind: TODO
    target: TODO
  tax_ids:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
