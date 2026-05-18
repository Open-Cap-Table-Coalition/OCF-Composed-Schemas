---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/VestingTerms.schema.json
ocf_object_type: VESTING_TERMS
ocf_title: Object - Vesting Terms
ocf_kind: object
required_fields:
  - name
  - description
  - allocation_type
  - vesting_conditions
  - id
  - object_type
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Vesting Terms → TBD

> Object describing the terms under which a security vests

## OCF schema

Source: [`VestingTerms.schema.json`](./VestingTerms.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/VestingTerms.schema.json",
  "title": "Object - Vesting Terms",
  "description": "Object describing the terms under which a security vests",
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
      "const": "VESTING_TERMS"
    },
    "name": {
      "description": "Concise name for the vesting schedule",
      "type": "string"
    },
    "description": {
      "description": "Detailed description of the vesting schedule",
      "type": "string"
    },
    "allocation_type": {
      "description": "Allocation/rounding type for the vesting schedule",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/enums/AllocationType.schema.json"
    },
    "vesting_conditions": {
      "description": "Conditions and triggers that describe the graph of vesting schedules and events",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingCondition.schema.json"
      },
      "minItems": 1
    }
  },
  "additionalProperties": false,
  "required": [
    "name",
    "description",
    "allocation_type",
    "vesting_conditions",
    "id",
    "object_type"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/VestingTerms.schema.json"
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
      VESTING_TERMS: TODO
  name:
    kind: TODO
    target: TODO
  description:
    kind: TODO
    target: TODO
  allocation_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      CUMULATIVE_ROUNDING: TODO
      CUMULATIVE_ROUND_DOWN: TODO
      FRONT_LOADED: TODO
      BACK_LOADED: TODO
      FRONT_LOADED_TO_SINGLE_TRANCHE: TODO
      BACK_LOADED_TO_SINGLE_TRANCHE: TODO
      FRACTIONAL: TODO
  vesting_conditions:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
