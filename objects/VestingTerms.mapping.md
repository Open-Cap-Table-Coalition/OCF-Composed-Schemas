---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/VestingTerms.schema.json
ocf_object_type: VESTING_TERMS
ocf_title: Object - Vesting Terms
ocf_kind: object
required_fields:
  - object_type
  - id
  - statements
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-06-29
---

# Object - Vesting Terms → TBD

> Version dispatcher for vesting terms. The stable public `$id` accepts either the current condition-DAG shape (v1) or the forward-looking ordered-statement template shape (v2) during the transition window.

## OCF schema

Source: [`VestingTerms.schema.json`](./VestingTerms.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/VestingTerms.schema.json",
  "title": "Object - Vesting Terms",
  "description": "Version dispatcher for vesting terms. The stable public `$id` accepts either the current condition-DAG shape (v1) or the forward-looking ordered-statement template shape (v2) during the transition window.",
  "x-ocf-stability": "alpha",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Identifier the issuance's `vesting_template_id` references."
    },
    "object_type": {
      "const": "VESTING_TERMS"
    },
    "statements": {
      "description": "Ordered list of vesting statements. They chain implicitly by their `order` field rather than via explicit graph edges.",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/vesting/VestingStatement.schema.json"
      },
      "minItems": 1
    }
  },
  "required": [
    "object_type",
    "id",
    "statements"
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/versions.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
# unmappable reason vocabulary: no-equivalent | excluded-from-snapshot | out-of-scope | ocf-internal
status: draft
coverage: 0/3

fields:
  id:
    kind: TODO
    target: TODO
  object_type:
    kind: TODO          # likely enum-remap
    target: TODO
    values:
      VESTING_TERMS: TODO
  statements:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
