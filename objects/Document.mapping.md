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
target_version: "v1alpha1 (2026-06-22)"
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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

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
    kind: unmappable
    target: null
    reason: excluded-from-snapshot
  related_objects:
    kind: unmappable
    target: null
    reason: no-equivalent
  uri:
    kind: unmappable
    target: null
    reason: excluded-from-snapshot
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FDocument.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FDocument.mapping.md&title=%5BMapping+question%5D+Document) |
| `id` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FDocument.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FDocument.mapping.md&title=%5BMapping+question%5D+Document%3A+id&property_path=id) |
| `comments` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FDocument.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FDocument.mapping.md&title=%5BMapping+question%5D+Document%3A+comments&property_path=comments) |
| `object_type` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FDocument.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FDocument.mapping.md&title=%5BMapping+question%5D+Document%3A+object_type&property_path=object_type) |
| `path` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FDocument.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FDocument.mapping.md&title=%5BMapping+question%5D+Document%3A+path&property_path=path) |
| `related_objects` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FDocument.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FDocument.mapping.md&title=%5BMapping+question%5D+Document%3A+related_objects&property_path=related_objects) |
| `uri` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FDocument.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FDocument.mapping.md&title=%5BMapping+question%5D+Document%3A+uri&property_path=uri) |
| `md5` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=objects%2FDocument.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Fobjects%2FDocument.mapping.md&title=%5BMapping+question%5D+Document%3A+md5&property_path=md5) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- OCF `Document` carries a file path or URI plus metadata, but the June 22 Carta bundle removes the `Document` definition entirely.
- `path` and `uri` are mutually exclusive source alternatives and are explicitly excluded from this snapshot; they are not literal value-renames to a retained Carta target.
- `md5` and `related_objects` also have no target in the retained bundle. Carta's former file record is outside this snapshot.
