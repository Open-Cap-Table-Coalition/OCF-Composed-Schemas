---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/File.schema.json
ocf_object_type: null
ocf_title: Type - File
ocf_kind: type
required_fields:
  - filepath
  - md5
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
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

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FFile.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FFile.mapping.md&title=%5BMapping+question%5D+File) |
| `filepath` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FFile.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FFile.mapping.md&title=%5BMapping+question%5D+File%3A+filepath&property_path=filepath) |
| `md5` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FFile.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FFile.mapping.md&title=%5BMapping+question%5D+File%3A+md5&property_path=md5) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta does not expose a reusable file metadata type corresponding to OCF `File`. `filepath` and `md5` have no direct target.
- Document uploads were previously handled at the object level, with an OCF path/URI uploaded out-of-band and the returned Carta file identifier computed there. The June 22 bundle removes Carta's document definition outright, so no such identifier slot remains; see [`Document.mapping.md`](../objects/Document.mapping.md).
