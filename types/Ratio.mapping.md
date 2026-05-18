---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Ratio.schema.json
ocf_object_type: null
ocf_title: Type - Ratio
ocf_kind: type
required_fields:
  - numerator
  - denominator
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Ratio → TBD

> Type representation of a ratio as two parts of a quotient, i.e. numerator and denominator numeric values

## OCF schema

Source: [`Ratio.schema.json`](./Ratio.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Ratio.schema.json",
  "title": "Type - Ratio",
  "description": "Type representation of a ratio as two parts of a quotient, i.e. numerator and denominator numeric values",
  "type": "object",
  "properties": {
    "numerator": {
      "description": "Numerator of the ratio, i.e. the ratio of A to B (A:B) can be expressed as a fraction (A/B), where A is the numerator",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "denominator": {
      "description": "Denominator of the ratio, i.e. the ratio of A to B (A:B) can be expressed as a fraction (A/B), where B is the denominator",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "numerator",
    "denominator"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/Ratio.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/2

fields:
  numerator:
    kind: TODO
    target: TODO
  denominator:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
