---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Name.schema.json
ocf_object_type: null
ocf_title: Type - Name
ocf_kind: type
required_fields:
  - legal_name
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Name → Carta

> Type comprising of multiple name components

## OCF schema

Source: [`Name.schema.json`](./Name.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Name.schema.json",
  "title": "Type - Name",
  "description": "Type comprising of multiple name components",
  "type": "object",
  "properties": {
    "legal_name": {
      "description": "Legal full name for the individual/institution",
      "type": "string"
    },
    "first_name": {
      "description": "First/given name for the individual",
      "type": "string"
    },
    "last_name": {
      "description": "Last/family name for the individual",
      "type": "string"
    }
  },
  "additionalProperties": false,
  "required": [
    "legal_name"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/Name.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  legal_name:
    kind: unmappable
    target: null
    reason: no-equivalent
  first_name:
    kind: unmappable
    target: null
    reason: no-equivalent
  last_name:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FName.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FName.mapping.md&title=%5BMapping+question%5D+Name) |
| `legal_name` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FName.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FName.mapping.md&title=%5BMapping+question%5D+Name%3A+legal_name&property_path=legal_name) |
| `first_name` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FName.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FName.mapping.md&title=%5BMapping+question%5D+Name%3A+first_name&property_path=first_name) |
| `last_name` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FName.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FName.mapping.md&title=%5BMapping+question%5D+Name%3A+last_name&property_path=last_name) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta stores names as flat strings rather than a reusable structured name. Object mappings select `legal_name` where a full-name target exists.
- `first_name` and `last_name` have no independent Carta target and are not silently concatenated at this type level.
