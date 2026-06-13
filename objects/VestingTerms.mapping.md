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
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Vesting Terms → Carta

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
      VESTING_TERMS: null
  name:
    kind: unmappable
    target: null
    reason: no-equivalent
  description:
    kind: unmappable
    target: null
    reason: no-equivalent
  allocation_type:
    kind: unmappable
    target: null
    reason: no-equivalent
    values:
      CUMULATIVE_ROUNDING: null
      CUMULATIVE_ROUND_DOWN: null
      FRONT_LOADED: null
      BACK_LOADED: null
      FRONT_LOADED_TO_SINGLE_TRANCHE: null
      BACK_LOADED_TO_SINGLE_TRANCHE: null
      FRACTIONAL: null
  vesting_conditions:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- OCF abandoned vesting machinery (no Carta counterpart). The canonical vesting layer at `canonical/vesting/` is the proposed replacement.
