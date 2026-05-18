---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Md5.schema.json
ocf_object_type: null
ocf_title: Type - MD5 Hash
ocf_kind: type
required_fields: []
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - MD5 Hash → TBD

> String representation of MD5 hash with basic validation for a string of 32 characters composed of letters (uppercase or lowercase) and numbers

## OCF schema

Source: [`Md5.schema.json`](./Md5.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Md5.schema.json",
  "title": "Type - MD5 Hash",
  "description": "String representation of MD5 hash with basic validation for a string of 32 characters composed of letters (uppercase or lowercase) and numbers",
  "type": "string",
  "pattern": "^[a-fA-F0-9]{32}$",
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/Md5.schema.json",
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
