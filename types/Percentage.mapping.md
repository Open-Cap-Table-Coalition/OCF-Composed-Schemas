---
ocf_schema_id: https://raw.githubusercontent.com/Open-Cap-Table-Coalition/Open-Cap-Format-OCF/main/schema/types/Percentage.schema.json
ocf_object_type: null
ocf_title: Type - Percentage
ocf_kind: type
required_fields: []
target_standard: Carta
target_version: "v1alpha1 (2026-06-22)"
status: complete
last_generated: 2026-05-18
---

# Type - Percentage → Carta

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
# kind vocabulary: rename | select | split | combine | enum-remap | computed | unmappable | TODO
status: complete

fields: {}
```

## Ask a mapping question

Use a link below to open a prefilled GitHub issue. The issue can be copied into the auditable checklist in `## Notes / open questions`.

<details>
<summary>Open a prefilled issue for a property</summary>

<!-- mapping-question-links:start -->
| Source property | Action |
| --- | --- |
| _(mapping-level)_ | [💬 Ask a question](https://github.com/Open-Cap-Table-Coalition/OCF-Composed-Schemas/issues/new?template=mapping-question.yml&mapping_file=types%2FPercentage.mapping.md&source_url=https%3A%2F%2Fgithub.com%2FOpen-Cap-Table-Coalition%2FOCF-Composed-Schemas%2Fblob%2Fmain%2Ftypes%2FPercentage.mapping.md&title=%5BMapping+question%5D+Percentage) |
</details>
<!-- mapping-question-links:end -->

## Notes / open questions

- Carta has no reusable percentage type. OCF percentage values are carried by the owning object into context-specific `Decimal` fields; this type has no direct target.
- OCF stores fractions in `[0,1]`; any required rescaling is a field-level decision of the consuming mapping.
