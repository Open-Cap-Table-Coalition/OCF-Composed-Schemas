---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/Financing.schema.json
ocf_object_type: FINANCING
ocf_title: Object - Financing
ocf_kind: object
required_fields:
  - name
  - issuance_ids
  - date
  - id
  - object_type
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Financing → TBD

> Object describing a financing

## OCF schema

Source: [`Financing.schema.json`](./Financing.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/Financing.schema.json",
  "title": "Object - Financing",
  "description": "Object describing a financing",
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
      "const": "FINANCING"
    },
    "name": {
      "description": "Name for the financing",
      "type": "string"
    },
    "issuance_ids": {
      "description": "Array of issuance IDs associated with the financing",
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "string"
      }
    },
    "date": {
      "description": "Date on which the financing event occurred",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Date.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "name",
    "issuance_ids",
    "date",
    "id",
    "object_type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/Financing.schema.json"
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
      FINANCING: TODO
  name:
    kind: TODO
    target: TODO
  issuance_ids:
    kind: TODO
    target: TODO
  date:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
