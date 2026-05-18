---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/File.schema.json
ocf_object_type: null
ocf_title: Type - File
ocf_kind: type
required_fields:
  - filepath
  - md5
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Type - File → TBD

> Type representation of a file

## OCF schema

Source: [`File.schema.json`](./File.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/File.schema.json",
  "title": "Type - File",
  "description": "Type representation of a file",
  "type": "object",
  "properties": {
    "filepath": {
      "description": "Path to the file within the OCF container",
      "type": "string"
    },
    "md5": {
      "description": "MD5 file checksum",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Md5.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "filepath",
    "md5"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/File.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | split | combine | enum-remap | computed | unmappable | TODO
status: draft
coverage: 0/2

fields:
  filepath:
    kind: TODO
    target: TODO
  md5:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
