---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json
ocf_object_type: null
ocf_title: Type - Numeric
ocf_kind: type
required_fields: []
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Numeric → TBD

> Fixed-point string representation of a number (up to 10 decimal places supported)

## OCF schema

Source: [`Numeric.schema.json`](./Numeric.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json",
  "title": "Type - Numeric",
  "description": "Fixed-point string representation of a number (up to 10 decimal places supported)",
  "type": "string",
  "pattern": "^[+-]?[0-9]+(\\.[0-9]{1,10})?$",
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/Numeric.schema.json",
  "properties": {},
  "required": []
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/0

fields:
```

## Notes / open questions

- 
