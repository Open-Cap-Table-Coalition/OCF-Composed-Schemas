---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/Document.schema.json
ocf_object_type: DOCUMENT
ocf_title: Object - Document
ocf_kind: object
required_fields:
  - md5
  - id
  - object_type
target_standard: TBD
target_version: TBD
status: draft
last_generated: 2026-05-18
---

# Object - Document → TBD

> Object describing a document

## OCF schema

Source: [`Document.schema.json`](./Document.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/Document.schema.json",
  "title": "Object - Document",
  "description": "Object describing a document",
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
      "const": "DOCUMENT"
    },
    "path": {
      "description": "Relative path/filename for the document. Path is understood to be a relative location within an associated ZIP archive (packaged separately from the OCF archive) e.g. './acceptance_records/John_Wayne_2017_Grant_Agreement.pdf'",
      "type": "string"
    },
    "related_objects": {
      "title": "Document - Related Objects Array",
      "description": "List of objects which this document is related to",
      "type": "array",
      "items": {
        "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ObjectReference.schema.json"
      }
    },
    "uri": {
      "description": "Uniform resource identifier for the document if not using the `path` property and associated ZIP archive separate from the OCF package.",
      "type": "string"
    },
    "md5": {
      "description": "MD5 file checksum",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Md5.schema.json"
    }
  },
  "required": [
    "md5",
    "id",
    "object_type"
  ],
  "oneOf": [
    {
      "required": [
        "path"
      ]
    },
    {
      "required": [
        "uri"
      ]
    }
  ],
  "additionalProperties": false,
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/objects/Document.schema.json"
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
      DOCUMENT: TODO
  path:
    kind: TODO
    target: TODO
  related_objects:
    kind: TODO
    target: TODO
  uri:
    kind: TODO
    target: TODO
  md5:
    kind: TODO
    target: TODO
```

## Notes / open questions

- 
