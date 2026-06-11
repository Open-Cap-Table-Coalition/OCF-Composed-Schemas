---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/objects/Document.schema.json
ocf_object_type: DOCUMENT
ocf_title: Object - Document
ocf_kind: object
required_fields:
  - md5
  - id
  - object_type
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Object - Document → Carta

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
      DOCUMENT: null
  path:
    kind: computed
    target: "#/$defs/Document/properties/fileId"
  related_objects:
    kind: unmappable
    target: null
    reason: no-equivalent
  uri:
    kind: computed
    target: "#/$defs/Document/properties/fileId"
  md5:
    kind: unmappable
    target: null
    reason: no-equivalent
```

## Notes / open questions

- OCF Document and Carta Document represent the same concept (a file attached to cap-table objects), but express it differently. OCF carries descriptive metadata inline (`path`/`uri`, `md5`, `related_objects`); Carta carries only a reference (`fileId`) to a file uploaded out-of-band, plus output-only `name` and `url`.
- `path` / `uri` → `fileId`: not a value-preserving rename. The OCF `path` or `uri` identifies a file to upload via Carta's [Upload File](https://docs.carta.com/carta/reference/v1alpha1filesuploadfile) endpoint; that endpoint returns a `fileId` which populates Carta's `Document.fileId`. Marked `kind: computed` (stretching the vocabulary: target value is derived from the source via an external process, not a direct copy). The OCF schema's `oneOf` constraint guarantees exactly one of `path`/`uri` is present per Document, so both rows pointing at `fileId` is not a collision.
- `md5`: no Carta counterpart. Useful for verifying upload integrity, but not stored on Carta's `Document`.
- `related_objects`: no Carta counterpart on the Document side. Carta represents document relationships from the other side (e.g., a Grant carries a `documentList` referencing its Documents).
- Carta's `name` and `url` are server-computed read-only outputs; no OCF counterpart is needed on the inbound direction.
