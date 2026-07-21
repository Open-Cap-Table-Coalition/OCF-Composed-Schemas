---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/File.schema.json
ocf_object_type: null
ocf_title: Type - File
ocf_kind: type
required_fields:
  - filepath
  - md5
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - File → Carta

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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  filepath:
    kind: unmappable
    target: null
    reason: no-equivalent
  md5:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- Carta has no in-schema file type. Files live outside the data schema and are referenced via `Document.fileId`, which is returned by the Carta Upload File endpoint. Neither the local file path nor the MD5 checksum survives the transfer — clients use these OCF fields only to locate and verify the file before uploading it. See also `types/Md5.mapping.md` and `objects/Document.mapping.md`.
