---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Percentage.schema.json
ocf_object_type: null
ocf_title: Type - Percentage
ocf_kind: type
required_fields: []
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - Percentage → TBD

> Fixed-point string representation of a percentage as a decimal between 0.0 and 1.0 (up to 10 decimal places supported)

## OCF schema

Source: [`Percentage.schema.json`](./Percentage.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Percentage.schema.json",
  "title": "Type - Percentage",
  "description": "Fixed-point string representation of a percentage as a decimal between 0.0 and 1.0 (up to 10 decimal places supported)",
  "type": "string",
  "pattern": "^0?(\\.[0-9]{1,10})?$|^1(\\.0{1,10})?$",
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/Percentage.schema.json",
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
