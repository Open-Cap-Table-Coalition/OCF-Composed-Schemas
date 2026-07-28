---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ShareNumberRange.schema.json
ocf_object_type: null
ocf_title: Type - Share Number Range
ocf_kind: type
required_fields:
  - starting_share_number
  - ending_share_number
target_standard: Carta
target_version: v1alpha1 (2026-04-30)
status: complete
last_generated: 2026-05-18
---

# Type - Share Number Range → Carta

> Type representation of a range of share numbers associated with an event (such as the share numbers associated with an issuance) - for use where shares are not fungible and need unique identifiers *per share*

## OCF schema

Source: [`ShareNumberRange.schema.json`](./ShareNumberRange.schema.json)

<details>
<summary>Composed schema (click to expand)</summary>

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/ShareNumberRange.schema.json",
  "title": "Type - Share Number Range",
  "description": "Type representation of a range of share numbers associated with an event (such as the share numbers associated with an issuance) - for use where shares are not fungible and need unique identifiers *per share*",
  "type": "object",
  "properties": {
    "starting_share_number": {
      "description": "The starting share number of a range of shares impacted by a particular event (**INCLUSIVE** and assuming **share counts start at 1**)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    },
    "ending_share_number": {
      "description": "The ending share number of a range of shares impacted by a particular event (**INCLUSIVE**)",
      "$ref": "https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Numeric.schema.json"
    }
  },
  "additionalProperties": false,
  "required": [
    "starting_share_number",
    "ending_share_number"
  ],
  "$comment": "Copyright © 2026 Open Cap Table Coalition (https://opencaptablecoalition.com) / Original File: https://github.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/tree/main/schema/types/ShareNumberRange.schema.json"
}
```

</details>

## Mapping

```yaml
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields:
  starting_share_number:
    kind: unmappable
    target: null
    reason: no-equivalent
  ending_share_number:
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
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FShareNumberRange.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FShareNumberRange.mapping.md&title=%5BMapping+question%5D+ShareNumberRange) |
| `starting_share_number` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FShareNumberRange.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FShareNumberRange.mapping.md&title=%5BMapping+question%5D+ShareNumberRange%3A+starting_share_number&property_path=starting_share_number) |
| `ending_share_number` | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FShareNumberRange.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FShareNumberRange.mapping.md&title=%5BMapping+question%5D+ShareNumberRange%3A+ending_share_number&property_path=ending_share_number) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta certificates carry aggregate quantity but no starting/ending share-number bounds. Both OCF range fields are `no-equivalent`.
